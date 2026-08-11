import { NextRequest, NextResponse } from "next/server";
import { normalizeBaseUrl, DEFAULT_LMSTUDIO_URL } from "../../lib/lmstudio";

export const runtime = "nodejs";

interface LMStudioRawModel {
  id?: string;
  name?: string;
  key?: string;
  object?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("baseUrl") || DEFAULT_LMSTUDIO_URL;
  const baseUrl = normalizeBaseUrl(rawUrl);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

    // Try OpenAI-compatible endpoint first (/v1/models)
    let res = await fetch(`${baseUrl}/v1/models`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    }).catch(() => null);

    // Fallback to LM Studio REST API endpoint (/api/v1/models)
    if (!res || !res.ok) {
      res = await fetch(`${baseUrl}/api/v1/models`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      }).catch(() => null);
    }

    clearTimeout(timeoutId);

    if (!res || !res.ok) {
      return NextResponse.json({
        connected: false,
        baseUrl,
        models: [],
        error: `LM Studio 서버 연결 실패 (HTTP ${res?.status || "500"})`,
      });
    }

    const data = await res.json();
    let rawModels: LMStudioRawModel[] = [];
    if (Array.isArray(data.data)) {
      rawModels = data.data;
    } else if (Array.isArray(data.models)) {
      rawModels = data.models;
    } else if (Array.isArray(data)) {
      rawModels = data;
    }

    const models = rawModels.map((m) => ({
      id: m.id || m.name || m.key || String(m),
      object: m.object || "model",
    }));

    const activeModel = models.length > 0 ? models[0].id : undefined;

    return NextResponse.json({
      connected: true,
      baseUrl,
      models,
      activeModel,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    let userMsg = `http://127.0.0.1:1234 에서 LM Studio 서버를 연결할 수 없습니다.`;

    if (errorMsg.includes("abort") || errorMsg.includes("timeout")) {
      userMsg = "LM Studio 응답 시간 초과 (4초). 서버가 응답하지 않습니다.";
    } else if (errorMsg.includes("ECONNREFUSED") || errorMsg.includes("fetch failed")) {
      userMsg = "LM Studio가 실행 중이 아니거나 Local Server 가 켜져 있지 않습니다. (LM Studio -> Local Server -> Start Server)";
    }

    return NextResponse.json({
      connected: false,
      baseUrl,
      models: [],
      error: userMsg,
    });
  }
}
