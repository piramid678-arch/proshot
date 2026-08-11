export type CategoryId = "creator" | "thumbnail" | "fun" | "custom";

export interface StyleCategory {
  id: CategoryId;
  label: string;
  emoji: string;
  description: string;
}

export interface StyleDef {
  id: string;
  category: CategoryId;
  label: string;
  description: string;
  emoji: string;
  /** English edit instruction sent to the image model */
  prompt: string;
  /** Overrides the default identity-preservation suffix */
  identityNote?: string;
  supportsBgColor?: boolean;
  printable?: boolean;
}

export const CATEGORIES: StyleCategory[] = [
  {
    id: "creator",
    label: "크리에이터 프로필",
    emoji: "📸",
    description: "유튜브 채널 아트·SNS 프로필·헤드샷",
  },
  {
    id: "thumbnail",
    label: "썸네일 캐릭터",
    emoji: "🔥",
    description: "시청 지체 시간을 늘리는 3D 툰 & 표정 캐릭터",
  },
  {
    id: "fun",
    label: "컨셉 & 밈 비주얼",
    emoji: "🎨",
    description: "K-POP 화보 & 세련된 컨셉 비주얼",
  },
  {
    id: "custom",
    label: "커스텀 프롬프트",
    emoji: "✍️",
    description: "원하는 시각 씬을 직접 글 표현",
  },
];

export type BgColor = "white" | "blue" | "gray";

export const BG_COLORS: { id: BgColor; label: string; swatch: string; prompt: string }[] = [
  { id: "white", label: "흰색 스튜디오", swatch: "#ffffff", prompt: "plain pure white studio background" },
  { id: "blue", label: "네온 네이비", swatch: "#1e293b", prompt: "dark navy blue studio background with subtle ambient neon lights" },
  { id: "gray", label: "미니멀 그레이", swatch: "#e5e7eb", prompt: "solid soft light gray studio background" },
];

export const STYLES: StyleDef[] = [
  // ───────── 크리에이터 프로필 ─────────
  {
    id: "corporate",
    category: "creator",
    label: "전문 크리에이터 룩",
    description: "신뢰감 높은 깔끔한 프로필 헤드샷",
    emoji: "👔",
    prompt:
      "Convert the subject into a crisp, modern creator profile headshot. Professional tech-casual blazer, polished look, solid light neutral studio backdrop.",
  },
  {
    id: "studio",
    category: "creator",
    label: "스튜디오 조명",
    description: "인물 부각 고급 실내 스튜디오 씬",
    emoji: "📸",
    prompt:
      "Apply soft cinematic studio portrait lighting. High contrast facial features, deep subtle background bokeh.",
  },
  {
    id: "outdoor",
    category: "creator",
    label: "야외 브이로그 룩",
    description: "화사하고 트렌디한 야외 자연광 뷰",
    emoji: "🌤️",
    prompt:
      "Apply bright, natural outdoor sunlight with soft background blur representing a clean modern city street or stylish lounge.",
  },
  // ───────── 썸네일 캐릭터 ─────────
  {
    id: "id_photo",
    category: "thumbnail",
    label: "3D 애니 썸네일 캐릭터",
    description: "유튜브 썸네일 전용 3D 피규어/애니 스타일",
    emoji: "🧸",
    prompt:
      "Transform into a high-end 3D Pixar/Disney style animated creator avatar character. Expressive face, vibrant lighting, solid clean backdrop.",
  },
  {
    id: "cyberpunk",
    category: "thumbnail",
    label: "네온 테크 썸네일 씬",
    description: "테크/게임 유튜버용 퓨처리스틱 네온 씬",
    emoji: "🚀",
    prompt:
      "Transform into a futuristic neon tech creator style: dark cyber studio environment with glowing magenta and cyan lights, wearing futuristic techwear jacket.",
  },
  // ───────── 컨셉 & 밈 비주얼 ─────────
  {
    id: "yearbook",
    category: "fun",
    label: "90년대 졸업앨범 레트로",
    description: "레트로 미국 하이스쿨 밈 감성",
    emoji: "📒",
    prompt:
      "Transform into a nostalgic 1990s American high school yearbook portrait: retro hairstyle, vintage 90s outfit, classic blue-gray laser beam backdrop.",
  },
  {
    id: "kpop",
    category: "fun",
    label: "K-POP 화보 씬",
    description: "화려한 무대 조명과 K-POP 앨범 비주얼",
    emoji: "🎤",
    prompt:
      "Transform into a high-energy K-POP artist concept photo: glossy idol hair styling, glamorous K-pop stage makeup, dynamic neon studio lighting.",
  },
];

export function getStyle(id: string): StyleDef | undefined {
  return STYLES.find((s) => s.id === id);
}

export function buildPrompt(options: {
  styleId: string;
  bgColor?: BgColor;
  customPrompt?: string;
}): string {
  const { styleId, bgColor, customPrompt } = options;

  if (styleId === "custom" && customPrompt) {
    let base = `Modify the input selfie image according to this description: "${customPrompt.trim()}".`;
    if (bgColor) {
      const bg = BG_COLORS.find((b) => b.id === bgColor);
      if (bg) {
        base += ` Ensure the background is changed to a ${bg.prompt}.`;
      }
    }
    base += " Maintain the same facial features, identity, expression, and person's face structure.";
    return base;
  }

  const style = getStyle(styleId);
  if (!style) {
    return "Transform this selfie into a high quality professional creator profile portrait. Retain facial identity.";
  }

  let prompt = style.prompt;

  if (style.supportsBgColor && bgColor) {
    const bg = BG_COLORS.find((b) => b.id === bgColor);
    if (bg) {
      prompt += ` Replace background with ${bg.prompt}.`;
    }
  }

  const identityInstruction =
    style.identityNote ??
    "Keep the exact same face, gender, age, and identity of the person in the input selfie. Only alter clothing, hair styling, lighting, and background.";

  return `${prompt} ${identityInstruction}`;
}
