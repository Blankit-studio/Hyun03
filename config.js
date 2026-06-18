// ============================================================
//  프로필 설정 — 이 파일만 수정하면 사이트가 바뀝니다.
// ============================================================
window.PROFILE_CONFIG = {
  // 기본 정보
  username: "hyun03",
  // 프로필 이름 옆에 붙는 인증 뱃지 표시 여부
  verified: true,
  // 여러 줄을 적으면 가운뎃점(·)으로 이어 한 줄로 표시됩니다.
  bio: ["환영합니다 👋", "제 링크들을 모아뒀어요"],
  // 아바타 이미지 경로(로컬 파일 또는 URL). 비워두면 이니셜로 표시됩니다.
  avatar: "",

  // 색상 테마 (CSS 변수로 적용)
  theme: {
    accent: "#7c5cff",       // 강조 색
    accent2: "#22d3ee",      // 보조 색 (그라데이션)
    background: "#0a0a0f",    // 배경 색
  },

  // 배경 설정: type 은 "gradient" | "image" | "video"
  background: {
    type: "gradient",
    src: "",                 // image/video 일 때 경로
    blur: 6,                 // 배경 블러 정도(px)
    dim: 0.55,               // 어둡게(0~1)
  },

  // 입장 화면 ("click to enter")
  enterScreen: {
    enabled: true,
    text: "클릭해서 입장하기",
  },

  // 배경 음악 (선택). src 를 비워두면 표시되지 않습니다.
  music: {
    src: "",                 // 예: "music/song.mp3"
    title: "",
    artist: "",
  },

  // 조회수 표시 여부 (브라우저 localStorage 기반의 간단한 카운터)
  showViews: true,

  // (구버전 효과 옵션 — 현재는 깔끔한 정적 UI로 동작하며 사용되지 않습니다.)
  effects: {},

  // ----------------------------------------------------------
  //  링크 목록
  //  icon 은 아래 지원 목록 중 하나를 사용하세요:
  //  github, instagram, twitter, x, youtube, tiktok, discord,
  //  twitch, linkedin, facebook, telegram, spotify, email,
  //  website, soundcloud, kakao, threads, link
  // ----------------------------------------------------------
  links: [
    { icon: "github",    label: "GitHub",    url: "https://github.com/" },
    { icon: "instagram", label: "Instagram", url: "https://instagram.com/" },
    { icon: "youtube",   label: "YouTube",   url: "https://youtube.com/" },
    { icon: "discord",   label: "Discord",   url: "https://discord.com/" },
    { icon: "email",     label: "이메일",     url: "mailto:hello@example.com" },
  ],
};
