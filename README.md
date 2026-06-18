# 🔗 링크 모음 (guns.lol 스타일)

본인의 모든 SNS·연락 링크를 한 페이지에 보여주는 **link-in-bio** 사이트입니다.
빌드 도구 없이 순수 HTML/CSS/JS로 만들어져 어디서나 바로 호스팅할 수 있어요.

## ✨ 기능

- 입장 화면("클릭해서 입장하기") → 부드러운 등장 애니메이션
- 글래스모피즘 프로필 카드 + 그라데이션 글로우
- 타자기 효과의 자기소개(bio), 인증 뱃지
- 링크 순차 등장 + 호버 애니메이션 (17종 플랫폼 아이콘 내장)
- 마우스 따라다니는 반짝임 / 카드 3D 기울기 효과
- 배경: 그라데이션 / 이미지 / 동영상 선택
- 선택적 배경 음악 플레이어, 간단한 조회수 카운터
- 모바일 반응형

## 🛠 커스터마이징

`config.js` 파일 하나만 수정하면 됩니다. (이름, 자기소개, 색상, 배경, 링크 등)

```js
window.PROFILE_CONFIG = {
  username: "내이름",
  bio: ["첫 줄", "두 번째 줄"],
  theme: { accent: "#7c5cff", accent2: "#22d3ee", background: "#0a0a0f" },
  links: [
    { icon: "github", label: "GitHub", url: "https://github.com/내계정" },
    // ...
  ],
};
```

### 지원 아이콘
`github, instagram, twitter, x, youtube, tiktok, discord, twitch, linkedin,
facebook, telegram, spotify, soundcloud, threads, kakao, email, website, link`

## 🚀 실행

로컬에서 보려면:

```bash
# 아무 정적 서버나 사용 가능
python3 -m http.server 8000
# 또는
npx serve .
```

브라우저에서 `http://localhost:8000` 접속.

## 🌐 배포

`index.html`, `styles.css`, `script.js`, `config.js`를 그대로 올리면 됩니다.
GitHub Pages, Netlify, Vercel, Cloudflare Pages 등 정적 호스팅이면 어디든 OK.
