export interface ContentTemplate {
  id: string;
  title: string;
  platform: "youtube" | "tiktok" | "instagram" | "threads" | "x" | "blog";
  category: string;
  icon: string;
  description: string;
  suggestedPrompt: string;
  suggestedKeywords: string;
  suggestedTone: string;
  suggestedPlatform?: string;
  contentType: string;
}

export interface OptionItem {
  id: string;
  label: string;
  description: string;
  icon?: string;
  badge?: string;
  color?: string;
}

export const PLATFORMS: OptionItem[] = [
  {
    id: "youtube",
    label: "유튜브 (YouTube)",
    description: "숏폼/롱폼 대본, 기획안, 썸네일 카피 & SEO 설명란",
    icon: "🎬",
    badge: "인기",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "tiktok",
    label: "틱톡 (TikTok)",
    description: "⚡ 15~60초 세로 숏폼 대본, FYP 챌린지 & 바이럴 캡션",
    icon: "🎵",
    badge: "NEW",
    color: "from-cyan-400 via-pink-500 to-black",
  },
  {
    id: "instagram",
    label: "인스타그램 (Instagram)",
    description: "카드뉴스 슬라이드 대본, 릴스 대본 & 본문 캡션/해시태그",
    icon: "📸",
    badge: "추천",
    color: "from-pink-500 via-purple-500 to-orange-400",
  },
  {
    id: "threads",
    label: "스레드 (Threads)",
    description: "바이럴 타래 포스트(Thread Chain) & 친근한 공감 단문",
    icon: "🧵",
    color: "from-slate-400 to-slate-100",
  },
  {
    id: "x",
    label: "X (구 트위터)",
    description: "280자 맞춤 트윗, RT 유도 훅 트윗 & 지식 요약 타래",
    icon: "🐦",
    color: "from-sky-400 to-blue-600",
  },
  {
    id: "blog",
    label: "GEO & SEO 블로그",
    description: "ChatGPT, Perplexity, Gemini, SearchGPT 인용 및 SEO 검색 최적화",
    icon: "🤖",
    badge: "GEO 2026",
    color: "from-emerald-400 to-teal-600",
  },
];

export const CONTENT_TYPES: Record<string, OptionItem[]> = {
  youtube: [
    { id: "shorts_script", label: "⚡ 유튜브 숏폼/쇼츠 대본 (15~60초)", description: "초반 3초 훅 + 음성 멘트 + 시각 화면 연출지침", icon: "⚡" },
    { id: "long_script", label: "📽️ 유튜브 롱폼 영상 대본", description: "오프닝, 본문 섹션, 클로징, 화면 연출 노트 포함", icon: "🎥" },
    { id: "concept_thumbnail", label: "💡 콘텐츠 기획 & 썸네일/제목", description: "클릭률(CTR) 극대화 제목 5종, 썸네일 카피 및 기획안", icon: "🎯" },
    { id: "seo_description", label: "🏷️ SEO 영상 설명란 & 타임스탬프", description: "유튜브 비디오 설명글, 타임스탬프 목차, 핵심 태그", icon: "📌" },
  ],
  tiktok: [
    { id: "tiktok_script", label: "⚡ 틱톡 세로 숏폼 대본 (15~60초)", description: "시선 강탈 훅 + 오디오/효과음 지침 + 화면 연출 지침", icon: "⚡" },
    { id: "tiktok_challenge", label: "🎵 틱톡 챌린지 & 음원 아이디어", description: "참여 유발 댄스/음원 챌린지 구상 & 해시태그 팁", icon: "🎶" },
    { id: "tiktok_caption", label: "🏷️ 틱톡 FYP 추천 캡션 & 태그", description: "추천 알고리즘 저격 캡션 문구 및 #fyp 필수 해시태그", icon: "📌" },
  ],
  instagram: [
    { id: "card_news", label: "🖼️ 카드뉴스 (1~10번 슬라이드)", description: "표지 훅 + 장별 핵심 텍스트 + 이미지 연출 팁", icon: "🎴" },
    { id: "reels_script", label: "🎞️ 인스타 릴스 대본", description: "트렌디 어조, 오디오 매칭 가이드, 30초 대본", icon: "⚡" },
    { id: "caption_hashtags", label: "📝 본문 캡션 & 해시태그 묶음", description: "공감 유발 첫줄, 상세 본문글, 관련 해시태그", icon: "🏷️" },
  ],
  threads: [
    { id: "thread_chain", label: "🧵 바이럴 연쇄 타래 글 (3~5개)", description: "1번 훅 + 2~4번 인사이트 + 5번 결론/질문", icon: "🔗" },
    { id: "single_relatable", label: "💬 공감 유발 단문 포스트", description: "댓글 유발형 친근한 사연 / 생각 공유글", icon: "💭" },
    { id: "qna_discussion", label: "❓ 토론 & Q&A 포스트", description: "팔로워들의 의견과 댓글을 유도하는 질문 포스트", icon: "🙋" },
  ],
  x: [
    { id: "viral_tweet", label: "🔥 RT 유도 바이럴 훅 트윗", description: "인용 & 리트윗을 부르는 강렬한 280자 한 줄 트윗", icon: "⚡" },
    { id: "info_thread", label: "📚 지식 요약 트위터 타래", description: "핵심 내용을 요약하여 전달하는 연속 트윗", icon: "🧵" },
    { id: "opinion_tweet", label: "💡 인사이트 / 견해 트윗", description: "트렌드에 대한 날카로운 통찰과 의견 전달", icon: "🧠" },
  ],
  blog: [
    { id: "geo_ai_answer", label: "🤖 GEO AI 답변 엔진 인용 저격 원고", description: "ChatGPT, Perplexity, SearchGPT 최상단 인용 상자 + 팩트/통계 + Q&A 구조", icon: "🤖", badge: "GEO 2026" },
    { id: "full_post", label: "📝 SEO & GEO 검색 최적화 전문 원고", description: "H2/H3 구조화 소제목, 직관적 핵심 요약 박스, Q&A 및 태그 포함", icon: "📖" },
    { id: "outline_only", label: "📋 GEO 목차 & 팩트 스키마 가이드라인", description: "AI 검색 엔티티 분류, 소제목 구조, 인용 통계 자료 가이드", icon: "📌" },
  ],
};

export const TONES: OptionItem[] = [
  {
    id: "viral_hook",
    label: "🔥 강렬한 바이럴/훅 어조",
    description: "첫 3초만에 시선을 끌어당기는 자극적이고 흥미진진한 문체",
  },
  {
    id: "friendly",
    label: "💬 친근한 대화체",
    description: "구독자/팔로워에게 친절하게 말하듯 편안한 문체 (~해요체)",
  },
  {
    id: "witty_meme",
    label: "⚡ 위트 & MZ 밈 어조",
    description: "트렌디한 밈, 유머, 센스 넘치는 위트 있는 표현",
  },
  {
    id: "professional",
    label: "👔 전문적인 정보 전달",
    description: "신뢰감 높고 깔끔한 전문가 스타일 (~합니다체)",
  },
  {
    id: "storytelling",
    label: "🌟 솔직 경험담 & 스토리",
    description: "몰입감 높은 나만의 솔직 후기 및 라이프 스토리",
  },
];

export const LENGTHS: OptionItem[] = [
  {
    id: "short",
    label: "⚡ 숏폼 / 요약 단문",
    description: "빠르게 읽을 수 있는 요약 중심 포스팅 (15~60초)",
  },
  {
    id: "medium",
    label: "📝 표준 포스팅",
    description: "가장 일반적이고 가독성 높은 적정 분량 (1~3분)",
    badge: "추천",
  },
  {
    id: "long",
    label: "📚 심층 완벽 가이드",
    description: "상세한 정보와 설명이 담긴 고품질 대형 대본/글 (5분+)",
  },
];

export const TEMPLATES: ContentTemplate[] = [
  // YouTube Templates
  {
    id: "yt-shorts-tech",
    title: "아이폰/갤럭시 30초 꿀팁 쇼츠",
    platform: "youtube",
    category: "테크 & 꿀팁",
    icon: "📱",
    description: "시청 지체 시간을 늘리는 30초 가로/세로 숏폼 대본 (화면 연출 지침 포함)",
    suggestedPrompt: "아이폰 유저 90%가 모르는 숨겨진 꿀기능 3가지. (배터리 절약, 카메라 비밀 설정, 텍스트 스캔)",
    suggestedKeywords: "아이폰꿀팁, 쇼츠대본, 아이폰기능, 스마트폰꿀팁",
    suggestedTone: "viral_hook",
    contentType: "shorts_script",
  },
  {
    id: "yt-long-review",
    title: "IT 기기/신제품 솔직 리뷰 롱폼",
    platform: "youtube",
    category: "전자기기 리뷰",
    icon: "🎥",
    description: "오프닝, 제품 외관, 성능 테스트, 장단점 완벽 비교 롱폼 영상 대본",
    suggestedPrompt: "최신 M3 맥북 에어 15인치 1달 실사용 후기. 수발열, 성능, 배터리, 사야 할 사람 vs 사지 말아야 할 사람",
    suggestedKeywords: "맥북에어, 테크유튜버, 노트북리뷰, 실사용후기",
    suggestedTone: "professional",
    contentType: "long_script",
  },
  {
    id: "yt-concept-title",
    title: "유튜브 클릭률(CTR) 썸네일 & 제목 기획",
    platform: "youtube",
    category: "콘텐츠 기획",
    icon: "💡",
    description: "조회수 100만 회를 노리는 어그로/클릭 유도 제목 5종 & 썸네일 시각 컨셉",
    suggestedPrompt: "주식 초보자가 월 50만 원 자동 수익 만든 방법. 썸네일 카피와 영상 기획안",
    suggestedKeywords: "재테크, 유튜브기획, 썸네일문구, 조회수폭발",
    suggestedTone: "viral_hook",
    contentType: "concept_thumbnail",
  },
  // TikTok Templates
  {
    id: "tiktok-viral-hook",
    title: "틱톡 15초 초스피드 반전 숏폼",
    platform: "tiktok",
    category: "틱톡 & 바이럴",
    icon: "🎵",
    description: "첫 2초 시선 강탈 자막 + 트렌디 밈 오디오 연출 + 반전 결말 세로 뷰 대본",
    suggestedPrompt: "편의점 꿀조합 음식 TOP 3. 먹자마자 눈 튀어나오는 미친 맛 조합 15초 세로 대본",
    suggestedKeywords: "편의점꿀조합, 틱톡푸드, 틱톡숏폼, 꿀맛",
    suggestedTone: "witty_meme",
    contentType: "tiktok_script",
  },
  {
    id: "tiktok-fyp-caption",
    title: "틱톡 추천 알고리즘(FYP) 캡션 & 태그",
    platform: "tiktok",
    category: "알고리즘 노출",
    icon: "📌",
    description: "#fyp #추천 알짜 해시태그 조합 및 시청자 댓글 유도 캡션 문구",
    suggestedPrompt: "요즘 인스타/틱톡에서 난리 난 댄스 챌린지 참여 영상 캡션 및 추천 태그",
    suggestedKeywords: "fyp, 틱톡추천, 챌린지, 바이럴, 틱톡어그로",
    suggestedTone: "viral_hook",
    contentType: "tiktok_caption",
  },
  // Instagram Templates
  {
    id: "insta-card-5steps",
    title: "5분 완성 인사이트 카드뉴스",
    platform: "instagram",
    category: "자기계발/정보",
    icon: "🎴",
    description: "표지 이미지 문구 + 1~5번 슬라이드 내용 + 인스타그램 본문 캡션",
    suggestedPrompt: "돈 버는 사람들의 5가지 아침 습관. 가독성 높은 카드뉴스 5장 텍스트 구성안",
    suggestedKeywords: "자기계발, 동기부여, 카드뉴스, 아침습관",
    suggestedTone: "friendly",
    contentType: "card_news",
  },
  {
    id: "insta-reels-trend",
    title: "바이럴 릴스 15초 대본",
    platform: "instagram",
    category: "릴스 & 세로비디오",
    icon: "🎞️",
    description: "인스타그램 릴스 조회수를 올리는 짧고 강렬한 멘트 및 텍스트 자막 가이드",
    suggestedPrompt: "주말에 꼭 가봐야 할 분위기 미친 서울 성수동 신상 카페 릴스 대본",
    suggestedKeywords: "성수동카페, 릴스추천, 서울데이트, 데이트코스",
    suggestedTone: "witty_meme",
    contentType: "reels_script",
  },
  // Threads Templates
  {
    id: "threads-viral-story",
    title: "스레드 5단계 바이럴 타래 글",
    platform: "threads",
    category: "스토리텔링",
    icon: "🧵",
    description: "1번 포스트 훅 + 2~4번 경험담 및 조언 + 5번 질문으로 이어지는 스레드 타래",
    suggestedPrompt: "연봉 3,000만 원에서 1억으로 올리면서 깨달은 커리어 성장의 3가지 핵심 규칙",
    suggestedKeywords: "커리어, 이직, 연봉협상, 직장인, 인사이트",
    suggestedTone: "storytelling",
    suggestedPlatform: "threads",
    contentType: "thread_chain",
  },
  {
    id: "threads-relatable",
    title: "스레드 댓글 폭발 공감 포스트",
    platform: "threads",
    category: "소통 & 질문",
    icon: "💬",
    description: "팔로워들의 열띤 댓글 참여와 인용 반응을 이끌어내는 질문형 포스트",
    suggestedPrompt: "개발자/디자이너들이 일하면서 제일 킹받는 순간 TOP 3 공유 및 팔로워 의견 묻기",
    suggestedKeywords: "직장인공감, 개발자일상, 스레드소통",
    suggestedTone: "friendly",
    contentType: "single_relatable",
  },
  // X Templates
  {
    id: "x-hook-tweet",
    title: "X(트위터) 280자 바이럴 훅 트윗",
    platform: "x",
    category: "알고리즘 저격",
    icon: "🔥",
    description: "RT와 마음에 들어요(하트)를 부르는 압축적이고 감각적인 한 줄 포스팅",
    suggestedPrompt: "생산성을 10배 끌어올려준 무료 AI 툴 4가지 정리 트윗",
    suggestedKeywords: "AI툴추천, 생산성, 트위터바이럴, 꿀팁",
    suggestedTone: "viral_hook",
    contentType: "viral_tweet",
  },
  {
    id: "x-info-thread",
    title: "X 지식 요약 스레드 타래",
    platform: "x",
    category: "정보 요약",
    icon: "📚",
    description: "알짜 지식을 1/N 타래 형태로 가독성 좋게 나눠 올리는 스레드",
    suggestedPrompt: "2026년 프론트엔드 개발자가 알아야 할 렌더링 패턴 정리 스레드 (1/5 ~ 5/5)",
    suggestedKeywords: "개발자, 트위터타래, 정보요약, 프론트엔드",
    suggestedTone: "professional",
    contentType: "info_thread",
  },
  // Blog Templates
  {
    id: "blog-tech-review",
    title: "블로그 SEO 전문 포스팅",
    platform: "blog",
    category: "네이버/티스토리",
    icon: "✍️",
    description: "검색 노출 최적화 소제목(H2, H3), 세련된 문체 및 해시태그 포함 원고",
    suggestedPrompt: "2026년 청년 도약 계좌 가입 조건 및 신청 방법 완전 정복 가이드",
    suggestedKeywords: "청년대움계좌, 금융꿀팁, 정부지원금, 자산형성",
    suggestedTone: "professional",
    contentType: "full_post",
  },
];

