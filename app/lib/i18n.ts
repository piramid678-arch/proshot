export type Language = "ko" | "en" | "ja" | "zh";

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  ko: {
    // Nav
    brandName: "ProShot AI",
    navHowItWorks: "이용 방법",
    navShowcase: "스타일 갤러리",
    navStart: "시작하기",
    
    // Credits & Payment Modal
    freeTrialBadge: "무료 체험 1회",
    creditsLeft: "남은 크레딧",
    rechargeButton: "+ 패스 구매",
    paymentModalTitle: "신규 가입 1회 무료 체험 🎁",
    paymentModalSubtitle: "월간 자동 구독 없이, 필요한 횟수만큼 안전하게 단건 결제하세요!",
    pass1Title: "1회 단건 패스",
    pass1Desc: "HD 고화질 증명사진/헤드샷 1장 생성 & 다운로드",
    pass1Price: "2,900원",
    pass3Title: "3회 프로 패스",
    pass3Desc: "3가지 다양한 컨셉 생성 + 4x6 8구 인화 시트(Print Sheet) 무료 포함",
    pass3Price: "4,900원",
    pass3Tag: "🔥 가장 인기 (추천)",
    pass5Title: "5회 올인원 패스",
    pass5Desc: "5가지 풀패키지 생성 + 8구 인화 시트 + 1:1 보정 재생성권 포함",
    pass5Price: "6,900원",
    paymentMethodLabel: "결제 수단 선택 (자동 정기 결제 없음 ❌)",
    kakaoPay: "카카오페이",
    cardPay: "신용 / 체크카드",
    paypalPay: "PayPal (해외결제)",
    naverPay: "네이버페이",
    paySubmitButton: "단건 결제하고 바로 생성하기",
    paymentSuccessMsg: "결제가 완료되어 패스가 충전되었습니다!",

    // Hero
    heroEyebrow: "AI 포토 스튜디오",
    heroTitleLine1: "셀카 한 장이면,",
    heroTitleGradient: "증명사진부터 컨셉 화보까지",
    heroSubheadline: "취업용 증명사진, 여권사진, 비즈니스 헤드샷, K-POP 프로필, 나만의 커스텀 컨셉까지 — 스튜디오 예약 없이 5분 만에",
    heroSheetChip: "🖨️ 인화용 시트 자동 생성",
    heroCTA: "내 헤드샷 만들기",

    // UploadCard
    uploadTitle: "나만의 AI 프로필 만들기",
    step1: "1. 셀카 업로드",
    step2: "2. 스타일 & 배경 선택",
    step3: "3. AI 프로필 생성하기",
    dragDropText: "셀카 사진을 여기에 드래그하거나 클릭하여 선택하세요",
    fileSupportInfo: "JPG, PNG, WEBP (최대 10MB)",
    changePhoto: "사진 변경",
    removePhoto: "삭제",

    // Categories
    catBusiness: "비즈니스",
    catBusinessDesc: "이력서·링크드인·사내 프로필용 헤드샷",
    catId: "증명·여권",
    catIdDesc: "규격에 맞춘 증명사진과 여권사진",
    catFun: "컨셉·재미",
    catFunDesc: "SNS를 뒤집을 이색 컨셉 사진",
    catCustom: "커스텀",
    catCustomDesc: "원하는 스타일을 직접 글로 설명",

    // Background color
    bgColorLabel: "증명사진 배경색 선택",
    bgWhite: "흰색",
    bgBlue: "연한 파랑",
    bgGray: "연한 회색",

    // Custom prompt
    customPromptLabel: "커스텀 스타일 설명",
    customPromptPlaceholder: "예: 우주비행사 슈트를 입고 은하수 배경 앞에서 4K 스튜디오 포토",

    // Buttons
    generateButton: "AI 프로필 사진 생성하기",
    generatingButton: "AI 이미지 생성 중...",
    randomFunStyle: "🎲 컨셉 랜덤 픽!",

    // Results
    resultTitle: "AI 프로필 생성 결과",
    resultDesc: "생성된 이미지를 원본과 비교해 보고, 4K 규격 인화용 시트로 다운로드하세요.",
    liteTag: "⚡ 가성비 모델 (Fast)",
    proTag: "✨ 고화질 모델 (Pro)",
    downloadSingle: "단일 사진 다운로드",
    downloadSheet: "인화용 시트 다운로드",
    share: "공유하기",
    printSizeLabel: "인화 규격 선택",

    // Errors
    errorNoSelfie: "셀카 사진을 먼저 업로드해 주세요.",
    errorCustomEmpty: "커스텀 스타일 설명을 입력해 주세요.",

    // How it works section
    howItWorksTitle: "스튜디오 방문 없이, 단 3단계",
    step1Title: "셀카 업로드",
    step1Desc: "정면이 잘 보이는 밝은 셀카 사진 한 장을 업로드합니다.",
    step2Title: "스타일 선택",
    step2Desc: "비즈니스 헤드샷부터 증명사진, K-POP 화보까지 원하는 스타일을 고릅니다.",
    step3Title: "다운로드 & 인화",
    step3Desc: "AI가 완성한 프로필 이미지와 인화용 배치 시트를 다운로드합니다.",

    // Showcase section
    showcaseTitle: "다양한 스타일 갤러리",
    showcaseSubtitle: "하나의 셀카로 완성되는 무궁무진한 변신",
    beforeLabel: "원본 셀카",
    afterLabel: "AI 변환 결과",

    // Footer
    footerRights: "ProShot AI. All rights reserved.",
  },

  en: {
    // Nav
    brandName: "ProShot AI",
    navHowItWorks: "How It Works",
    navShowcase: "Style Gallery",
    navStart: "Get Started",
    
    // Credits & Payment Modal
    freeTrialBadge: "1 Free Trial",
    creditsLeft: "Credits Left",
    rechargeButton: "+ Buy Pass",
    paymentModalTitle: "1 Free Trial Included 🎁",
    paymentModalSubtitle: "No monthly recurring subscription! Select a single pass and generate high-res photos instantly.",
    pass1Title: "1 Single Pass",
    pass1Desc: "Generate & download 1 HD quality ID/Headshot photo",
    pass1Price: "$1.99",
    pass3Title: "3 Pro Pass",
    pass3Desc: "Generate 3 styles + Free 4x6 8-cut printable sheet included",
    pass3Price: "$3.49",
    pass3Tag: "🔥 Most Popular (Recommended)",
    pass5Title: "5 All-in-One Pass",
    pass5Desc: "5 full concept styles + 8-cut print sheet + 1 retouch retry pass",
    pass5Price: "$4.99",
    paymentMethodLabel: "Select Payment Method (No Auto-recurring Fee ❌)",
    kakaoPay: "KakaoPay",
    cardPay: "Credit / Debit Card",
    paypalPay: "PayPal / Apple Pay",
    naverPay: "Naver Pay",
    paySubmitButton: "Pay Single Pass & Generate Now",
    paymentSuccessMsg: "Payment complete! Pass credits added successfully.",

    // Hero
    heroEyebrow: "AI Photo Studio",
    heroTitleLine1: "One selfie is all it takes,",
    heroTitleGradient: "from ID photos to concept portraits",
    heroSubheadline: "Formal ID photos, passports, business headshots, K-pop profiles, and custom concepts — without studio booking in 5 minutes",
    heroSheetChip: "🖨️ Auto Print Sheet Generation",
    heroCTA: "Create My Headshot",

    // UploadCard
    uploadTitle: "Create Your AI Profile",
    step1: "1. Upload Selfie",
    step2: "2. Select Style & Background",
    step3: "3. Generate AI Profile",
    dragDropText: "Drag & drop your selfie here, or click to select",
    fileSupportInfo: "JPG, PNG, WEBP (Max 10MB)",
    changePhoto: "Change Photo",
    removePhoto: "Remove",

    // Categories
    catBusiness: "Business",
    catBusinessDesc: "Headshots for resume, LinkedIn, & corporate profile",
    catId: "ID & Passport",
    catIdDesc: "Standardized passport and ID photo specs",
    catFun: "Concept & Fun",
    catFunDesc: "Trendy and creative concept photos for social media",
    catCustom: "Custom",
    catCustomDesc: "Describe any style in your own words",

    // Background color
    bgColorLabel: "Select Background Color",
    bgWhite: "Pure White",
    bgBlue: "Light Blue",
    bgGray: "Light Gray",

    // Custom prompt
    customPromptLabel: "Custom Style Description",
    customPromptPlaceholder: "e.g., Wearing an astronaut suit in front of the Milky Way galaxy, 4K studio portrait",

    // Buttons
    generateButton: "Generate AI Profile Photos",
    generatingButton: "Generating AI Images...",
    randomFunStyle: "🎲 Random Pick!",

    // Results
    resultTitle: "AI Generation Results",
    resultDesc: "Compare your AI headshot with the original, and download print-ready grid sheets.",
    liteTag: "⚡ Fast Model (Lite)",
    proTag: "✨ High Quality (Pro)",
    downloadSingle: "Download Photo",
    downloadSheet: "Download Print Sheet",
    share: "Share",
    printSizeLabel: "Select Print Spec",

    // Errors
    errorNoSelfie: "Please upload a selfie photo first.",
    errorCustomEmpty: "Please enter a custom style description.",

    // How it works section
    howItWorksTitle: "3 Easy Steps, No Studio Needed",
    step1Title: "Upload Selfie",
    step1Desc: "Upload one clear front-facing selfie with good lighting.",
    step2Title: "Choose Style",
    step2Desc: "Pick from business headshots, ID spec photos, to K-POP concepts.",
    step3Title: "Download & Print",
    step3Desc: "Download high-res AI portraits and print-ready photo sheets.",

    // Showcase section
    showcaseTitle: "Style Showcase Gallery",
    showcaseSubtitle: "Endless transformations created from a single selfie",
    beforeLabel: "Original Selfie",
    afterLabel: "AI Transformed",

    // Footer
    footerRights: "ProShot AI. All rights reserved.",
  },

  ja: {
    // Nav
    brandName: "ProShot AI",
    navHowItWorks: "使い方",
    navShowcase: "スタイルギャラリー",
    navStart: "はじめに",
    
    // Credits & Payment Modal
    freeTrialBadge: "無料体験1回",
    creditsLeft: "残りクレジット",
    rechargeButton: "+ パス購入",
    paymentModalTitle: "初回無料体験 1回付 🎁",
    paymentModalSubtitle: "月額サブスクなし！必要な回数だけ単品パスを選択してすぐ生成できます。",
    pass1Title: "1回単品パス",
    pass1Desc: "HD高画質 証明写真/ヘッドショット1枚生成＆保存",
    pass1Price: "￥300",
    pass3Title: "3回プロパス",
    pass3Desc: "3つのコンセプト生成＋4x6印刷シート(Print Sheet)無料付",
    pass3Price: "￥500",
    pass3Tag: "🔥 一番人気（おすすめ）",
    pass5Title: "5回オールインワン",
    pass5Desc: "5つのフルコンセプト＋印刷シート＋1:1レタッチ再生成権付",
    pass5Price: "￥700",
    paymentMethodLabel: "決済方法を選択（自動更新なし ❌）",
    kakaoPay: "KakaoPay",
    cardPay: "クレジットカード",
    paypalPay: "PayPal / Apple Pay",
    naverPay: "Naver Pay",
    paySubmitButton: "単品決済してすぐ生成",
    paymentSuccessMsg: "決済が完了し、パスがチャージされました！",

    // Hero
    heroEyebrow: "AI フォトスタジオ",
    heroTitleLine1: "自撮り写真1枚で、",
    heroTitleGradient: "証明写真からコンセプト写真まで",
    heroSubheadline: "就職用証明写真、パスポート、ビジネスヘッドショット、K-POPアイドル風、カスタムコンセプトまで — 予約なしで5分で完成",
    heroSheetChip: "🖨️ 印刷用シート自動生成",
    heroCTA: "ヘッドショットを作成",

    // UploadCard
    uploadTitle: "AIプロフィール写真の作成",
    step1: "1. 自撮りアップロード",
    step2: "2. スタイル＆背景選択",
    step3: "3. AIプロフィール生成",
    dragDropText: "ここに自撮り画像をドラッグ＆ドロップするか、クリックして選択",
    fileSupportInfo: "JPG, PNG, WEBP (最大10MB)",
    changePhoto: "写真を変更",
    removePhoto: "削除",

    // Categories
    catBusiness: "ビジネス",
    catBusinessDesc: "履歴書・LinkedIn・社내プロフ用写真",
    catId: "証明・パスポート",
    catIdDesc: "規格に合わせた証明写真とパスポート写真",
    catFun: "コンセプト・楽しむ",
    catFunDesc: "SNSで話題のユニークなコンセプト写真",
    catCustom: "カスタム",
    catCustomDesc: "お好みのスタイルを文字で自由に入力",

    // Background color
    bgColorLabel: "証明写真の背景色を選択",
    bgWhite: "ホワイト",
    bgBlue: "ライトブルー",
    bgGray: "ライトグレー",

    // Custom prompt
    customPromptLabel: "カスタムスタイルの説明",
    customPromptPlaceholder: "例：宇宙服を着て銀河系を背景にした4Kスタジオ写真",

    // Buttons
    generateButton: "AIプロフィール写真を生成",
    generatingButton: "AI画像生成中...",
    randomFunStyle: "🎲 ランダム選択！",

    // Results
    resultTitle: "AI生成結果",
    resultDesc: "生成された写真を元画像と比較し、4K印刷用シートでダウンロードできます。",
    liteTag: "⚡ 高速モデル (Lite)",
    proTag: "✨ 高画質モデル (Pro)",
    downloadSingle: "写真をダウンロード",
    downloadSheet: "印刷シートダウンロード",
    share: "共有する",
    printSizeLabel: "印刷規格を選択",

    // Errors
    errorNoSelfie: "最初に自撮り写真をアップロードしてください。",
    errorCustomEmpty: "カスタムスタイルの説明を入力してください。",

    // How it works section
    howItWorksTitle: "スタジオ訪問不要、わずか3ステップ",
    step1Title: "自撮りアップロード",
    step1Desc: "正面がはっきり見える明るい自撮り写真を1枚アップロードします。",
    step2Title: "スタイル選択",
    step2Desc: "ビジネスから証明写真、K-POPスタイルまでお好みのデザインを選びます。",
    step3Title: "ダウンロード＆印刷",
    step3Desc: "AIが仕上げたプロフィール画像と印刷用シート를ダウンロードします。",

    // Showcase section
    showcaseTitle: "多彩なスタイルギャラリー",
    showcaseSubtitle: "1枚の自撮りから広がる無限の変身",
    beforeLabel: "元の自撮り",
    afterLabel: "AI変換結果",

    // Footer
    footerRights: "ProShot AI. All rights reserved.",
  },

  zh: {
    // Nav
    brandName: "ProShot AI",
    navHowItWorks: "使用方法",
    navShowcase: "风格画廊",
    navStart: "开始",
    
    // Credits & Payment Modal
    freeTrialBadge: "免费体验1次",
    creditsLeft: "剩余积分",
    rechargeButton: "+ 购买通行证",
    paymentModalTitle: "新用户包含1次免费体验 🎁",
    paymentModalSubtitle: "无需月费自动扣款！按需选择单次通行证，立即生成 HD 高清照片。",
    pass1Title: "1次单页通行证",
    pass1Desc: "生成并下载 1 张 HD 高清证件照 / 形象照",
    pass1Price: "¥15",
    pass3Title: "3次专业通行证",
    pass3Desc: "生成 3 种概念风格 + 免费赠送 4x6 8格打印排版排版",
    pass3Price: "¥25",
    pass3Tag: "🔥 最受欢迎 (推荐)",
    pass5Title: "5次全能通行证",
    pass5Desc: "5 种全套风格 + 8格打印排版 + 1次1:1修图重生成",
    pass5Price: "¥35",
    paymentMethodLabel: "选择支付方式（无自动扣款 ❌）",
    kakaoPay: "KakaoPay",
    cardPay: "信用卡 / 借记卡",
    paypalPay: "PayPal / Apple Pay",
    naverPay: "Naver Pay",
    paySubmitButton: "支付通行证并立即生成",
    paymentSuccessMsg: "支付成功！通行证已充值到账。",

    // Hero
    heroEyebrow: "AI 照片工作室",
    heroTitleLine1: "只需一张自拍，",
    heroTitleGradient: "从证件照到概念写真",
    heroSubheadline: "求职证件照、护照照、商务形象照、K-POP爱豆写真、自定义概念 — 无需预约，5分钟搞定",
    heroSheetChip: "🖨️ 自动生成打印排版",
    heroCTA: "生成我的形象照",

    // UploadCard
    uploadTitle: "生成你的 AI 个人照",
    step1: "1. 上传自拍",
    step2: "2. 选择风格与背景",
    step3: "3. 生成 AI 个人照",
    dragDropText: "拖拽自拍至此，或点击选择文件",
    fileSupportInfo: "JPG, PNG, WEBP (最大 10MB)",
    changePhoto: "更换照片",
    removePhoto: "删除",

    // Categories
    catBusiness: "商务",
    catBusinessDesc: "简历、LinkedIn 及公司个人资料形象照",
    catId: "证件·护照",
    catIdDesc: "符合标准规格的证件照和护照照",
    catFun: "概念·趣味",
    catFunDesc: "适合社交媒体的创意艺术概念写真",
    catCustom: "自定义",
    catCustomDesc: "用文字自由描述你想要的任意风格",

    // Background color
    bgColorLabel: "选择证件照背景颜色",
    bgWhite: "纯白",
    bgBlue: "浅蓝",
    bgGray: "浅灰",

    // Custom prompt
    customPromptLabel: "自定义风格描述",
    customPromptPlaceholder: "例如：穿宇航服站在银河系背景前，4K 影棚大片",

    // Buttons
    generateButton: "生成 AI 个人照",
    generatingButton: "AI 图像生成中...",
    randomFunStyle: "🎲 随机选择！",

    // Results
    resultTitle: "AI 生成结果",
    resultDesc: "将生成的效果图与原图对比，并直接下载可打印规格排版图。",
    liteTag: "⚡ 极速模型 (Lite)",
    proTag: "✨ 高清模型 (Pro)",
    downloadSingle: "下载单张照片",
    downloadSheet: "下载打印排版",
    share: "分享",
    printSizeLabel: "选择打印规格",

    // Errors
    errorNoSelfie: "请先上传一张自拍照片。",
    errorCustomEmpty: "请输入自定义风格描述。",

    // How it works section
    howItWorksTitle: "无需去影棚，仅需3步",
    step1Title: "上传自拍",
    step1Desc: "上传一张光线充足、五官清晰的正脸自拍。",
    step2Title: "选择风格",
    step2Desc: "从商务照、标准证件照到 K-POP 概念，随心选择。",
    step3Title: "下载与打印",
    step3Desc: "下载 AI 完成的高清个人照及多格打印排版图。",

    // Showcase section
    showcaseTitle: "丰富风格画廊",
    showcaseSubtitle: "仅凭一张自拍即可完成无限蜕变",
    beforeLabel: "原始自拍",
    afterLabel: "AI 转换结果",

    // Footer
    footerRights: "ProShot AI. All rights reserved.",
  }
};

// Category and Style Multilingual helper
export const STYLE_TRANSLATIONS: Record<string, Record<Language, { label: string; description: string }>> = {
  // Business
  corporate: {
    ko: { label: "비즈니스 정장", description: "단정한 수트와 셔츠 룩" },
    en: { label: "Business Suit", description: "Neat suit and dark blazer look" },
    ja: { label: "ビジネススーツ", description: "清潔感のあるスーツ＆シャツ" },
    zh: { label: "商务西装", description: "干练整洁的正装西服" },
  },
  studio: {
    ko: { label: "스튜디오", description: "인물 부각 실내 스튜디오 조명" },
    en: { label: "Studio Portrait", description: "Flattering professional indoor studio lighting" },
    ja: { label: "スタジオライティング", description: "人物を引き立てる室内照明" },
    zh: { label: "影棚布光", description: "凸显面부轮廓的室内影棚人像" },
  },
  outdoor: {
    ko: { label: "야외 자연광", description: "화사하고 입체감 있는 자연광" },
    en: { label: "Outdoor Sun", description: "Bright natural daylight with soft bokeh background" },
    ja: { label: "屋外自然光", description: "明るく立体感のある自然光ポートレート" },
    zh: { label: "户外自然光", description: "通透自然的光影与柔和虚化背景" },
  },

  // ID
  id_photo: {
    ko: { label: "취업용 증명사진", description: "정장 착용, 규격 프레이밍" },
    en: { label: "Resume ID Photo", description: "Standardized Korean job-application ID photo" },
    ja: { label: "就活証明写真", description: "スーツ着用、標準規格フレーミング" },
    zh: { label: "求职证件照", description: "标准正装求职证件人像" },
  },
  passport: {
    ko: { label: "여권·비자 사진", description: "국제 규정 준수 화이트 배경" },
    en: { label: "Passport Photo", description: "Official passport & visa standard compliance" },
    ja: { label: "パスポート・ビザ写真", description: "国際規定準拠の白背景写真" },
    zh: { label: "护照·签证照", description: "符合国际标准的白底护照人像" },
  },
  student: {
    ko: { label: "학생증·사원증", description: "밝고 단정한 캐주얼 정장" },
    en: { label: "Student & Employee ID", description: "Bright friendly smart-casual ID photo" },
    ja: { label: "学生証・社員証", description: "明るくスマートなカジュアル衣装" },
    zh: { label: "学生证·工作证", description: "大方得体的便装证件照" },
  },

  // Fun
  yearbook: {
    ko: { label: "90년대 졸업앨범", description: "레트로 미국 하이스쿨 감성" },
    en: { label: "90s Yearbook", description: "Nostalgic 1990s American high school portrait" },
    ja: { label: "90年代卒業アルバム", description: "レトロなアメリカの高校写真感" },
    zh: { label: "90年代毕业照", description: "美式复古校园毕业写真" },
  },
  kpop: {
    ko: { label: "K-POP 스타일", description: "화려한 무대 의상과 K-POP 앨범 비주얼" },
    en: { label: "K-POP Concept", description: "High-energy stage outfit and album visual" },
    ja: { label: "K-POPスタイル", description: "華やかな衣装とK-POPビジュアル" },
    zh: { label: "K-POP 概念", description: "华丽的舞台造型与爱豆大片视觉" },
  },
  idol: {
    ko: { label: "아이돌 데뷔 프로필", description: "K-pop 데뷔조 비주얼" },
    en: { label: "K-Pop Idol Profile", description: "Glamorous idol group debut visual" },
    ja: { label: "アイドルデビュープロフ", description: "K-POPデビュー組ビジュアル" },
    zh: { label: "爱豆出道概念", description: "韩团出道精修爱豆形象照" },
  },
  kdrama: {
    ko: { label: "K-드라마 포스터", description: "시네마틱 무드의 주인공" },
    en: { label: "K-Drama Poster", description: "Cinematic romantic male/female lead portrait" },
    ja: { label: "韓ドラポスター", description: "シネマティックな主人公風ポスター" },
    zh: { label: "韩剧海报风格", description: "电影级质感的韩剧男女主剧照" },
  },
  magazine: {
    ko: { label: "패션 매거진 커버", description: "하이패션 에디토리얼 화보" },
    en: { label: "Fashion Magazine", description: "High-fashion Vogue editorial photography" },
    ja: { label: "ファッション誌カバー", description: "ハイファッションのヴォーグ風写真" },
    zh: { label: "时尚杂志封面", description: "高级时尚大片高级画报" },
  },
  noir: {
    ko: { label: "흑백 감성 화보", description: "필름 느낌의 모노크롬 아트" },
    en: { label: "Black & White Noir", description: "Timeless monochrome Rembrandt lighting" },
    ja: { label: "モノクロノワール", description: "ドラマチックなモノクロ芸術写真" },
    zh: { label: "复古黑白黑黑", description: "具艺术感与沉静氛围的光影黑白照" },
  },
  cartoon: {
    ko: { label: "3D 애니 캐릭터", description: "애니메이션 영화 주인공처럼" },
    en: { label: "3D Animated Character", description: "Adorable 3D animated movie character" },
    ja: { label: "3Dアニメキャラ", description: "アニメ映画の主人公のような可愛さ" },
    zh: { label: "3D 动漫角色", description: "精致可爱 3D 动画电影主角风" },
  },
};
