import { NextRequest, NextResponse } from "next/server";
import { normalizeBaseUrl, DEFAULT_LMSTUDIO_URL, buildSystemPrompt } from "../../lib/lmstudio";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      keywords,
      platform = "youtube",
      contentType = "shorts_script",
      tone = "viral_hook",
      length = "medium",
      customBaseUrl,
      customModel,
      mode = "full", // 'full' | 'outline'
    } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "제작하고자 하는 콘텐츠 주제나 아이디어를 입력해 주세요." },
        { status: 400 }
      );
    }

    const baseUrl = normalizeBaseUrl(customBaseUrl || DEFAULT_LMSTUDIO_URL);

    // 1. Fetch available models from LM Studio if customModel is not provided
    let modelToUse = customModel;
    if (!modelToUse) {
      try {
        const modelsRes = await fetch(`${baseUrl}/v1/models`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }).catch(() => null);

        if (modelsRes && modelsRes.ok) {
          const modelsData = await modelsRes.json();
          if (Array.isArray(modelsData.data) && modelsData.data.length > 0) {
            modelToUse = modelsData.data[0].id;
          }
        }
      } catch {
        modelToUse = "local-model";
      }
    }
    if (!modelToUse) {
      modelToUse = "local-model";
    }

    // 2. Build User Content based on length and platform
    let lengthInstruction = "적정 분량으로 알차게 작성해 주세요.";
    if (length === "short") {
      lengthInstruction = "짧고 핵심적인 숏폼/단문 위주로 임팩트 있게 작성하세요.";
    } else if (length === "long") {
      lengthInstruction = "상세하고 구성이 풍부한 장문/롱폼 형식으로 깊이 있게 작성하세요.";
    }

    let modeInstruction = "";
    if (mode === "outline") {
      modeInstruction = "기획 개요, 훅 문구 아이디어 및 구성 목차 가이드라인을 작성해 주세요.";
    } else {
      modeInstruction = "실제 게시/녹음/촬영에 즉시 사용할 수 있는 완성된 원고/대본 전문을 작성해 주세요.";
    }

    const userPromptContent = `[콘텐츠 제작 요청]
- 플랫폼: ${platform.toUpperCase()}
- 세부 세그먼트: ${contentType}
- 메인 주제/아이디어: ${prompt.trim()}
${keywords ? `- 강조 키워드 & 해시태그: ${keywords.trim()}` : ""}
- 목표 분량: ${lengthInstruction}
- 지침: ${modeInstruction}`;

    const systemPrompt = buildSystemPrompt(platform, contentType, tone);

    // 3. Call LM Studio Local Server (Supports OpenAI Compatible Endpoint & LM Studio REST API v1)
    const requestPayload = {
      model: modelToUse,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPromptContent },
      ],
      temperature: 0.75,
      max_tokens: length === "long" ? 3500 : length === "short" ? 1200 : 2500,
      stream: false,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout

    // Primary: /v1/chat/completions (OpenAI Compatible)
    let lmResponse = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    }).catch(() => null);

    // Fallback: /api/v1/chat (LM Studio Native REST API)
    if (!lmResponse || !lmResponse.ok) {
      lmResponse = await fetch(`${baseUrl}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      }).catch(() => null);
    }

    clearTimeout(timeoutId);

    if (!lmResponse || !lmResponse.ok) {
      const errText = lmResponse ? await lmResponse.text() : "서버 응답 없음";
      console.error("LM Studio Error Response:", errText);
      return NextResponse.json(
        {
          error: `LM Studio 요청 실패 (HTTP ${lmResponse?.status || 500}): ${errText || "응답이 비어있습니다."}\nLM Studio 실행 상태 및 Local Server (http://127.0.0.1:1234)를 확인하세요.`,
        },
        { status: 502 }
      );
    }

    const data = await lmResponse.json();
    const content =
      data.choices?.[0]?.message?.content ||
      data.output ||
      data.message?.content ||
      data.content;

    if (!content) {
      return NextResponse.json(
        { error: "LM Studio에서 응답 텍스트를 생성하지 못했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: content,
      modelUsed: modelToUse,
      baseUrlUsed: baseUrl,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Generate Content API Error:", errorMsg);

    let clientMsg = "LM Studio와 통신 중 오류가 발생했습니다.";
    if (errorMsg.includes("abort") || errorMsg.includes("timeout")) {
      clientMsg = "생성 시간이 90초를 초과했습니다. LM Studio에서 로드된 모델의 처리 속도를 확인하세요.";
    } else if (errorMsg.includes("ECONNREFUSED") || errorMsg.includes("fetch failed")) {
      clientMsg = "LM Studio 로컬 서버(http://127.0.0.1:1234)에 연결할 수 없습니다. LM Studio -> Local Server -> Start Server를 확인해 주세요.";
    }

    return NextResponse.json({ error: clientMsg }, { status: 500 });
  }
}
