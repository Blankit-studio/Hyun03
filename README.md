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

## 🔐 Google 로그인 + 관리자 편집 (Firebase)

내 Google 계정으로 로그인하면 **편집 패널**이 열려서 이름·자기소개·색상·링크를
화면에서 바로 수정하고 **Firestore에 저장**할 수 있습니다. 방문자는 저장된 내용을 보기만 해요.
(Firebase를 설정하지 않으면 이 기능은 자동으로 비활성화되고, `config.js` 기본값으로 표시됩니다.)

### 설정 순서

1. **웹 앱 등록 & 키 복사**
   Firebase 콘솔 → 프로젝트 설정 → "내 앱"에서 **웹 앱(`</>`)** 추가 →
   `firebaseConfig` 객체를 복사해 **`firebase-config.js`** 의 `window.FIREBASE_CONFIG` 에 붙여넣기.

2. **관리자 이메일 지정**
   `firebase-config.js` 의 `window.OWNER_EMAIL` 을 본인 Google 계정 이메일로 설정.

3. **Google 로그인 사용 설정**
   콘솔 → **Authentication** → 로그인 방법 → **Google** 사용 설정.

4. **승인된 도메인 추가**
   콘솔 → Authentication → 설정 → 승인된 도메인에 배포 도메인 추가
   (예: `<사용자명>.github.io`). `localhost` 는 기본 포함.

5. **Firestore 만들기 & 보안 규칙 적용**
   콘솔 → **Firestore Database** 생성 → **규칙(Rules)** 탭에 **`firestore.rules`** 내용을 붙여넣고
   이메일을 본인 것으로 바꾼 뒤 **게시**. (쓰기는 관리자만, 읽기는 공개)

설정이 끝나면 사이트 우하단의 ⚙️ 버튼 → Google 로그인 → ✎ 편집 → 저장 순으로 사용합니다.
한 번 로그인하면 세션이 유지되어 **자동 로그인** 됩니다.

> 데이터 흐름: 공개 페이지는 `site/profile` 문서를 실시간 구독해 표시하고,
> 저장된 문서가 없으면 `config.js` 의 기본값을 사용합니다.

## 🛠 커스터마이징 (Firebase 없이)

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

## 🌐 배포 (GitHub Pages)

이 저장소에는 `/.github/workflows/deploy.yml` 자동 배포 워크플로가 포함되어 있습니다.
**최초 1회만** 아래 설정을 해주면, 이후 푸시할 때마다 자동으로 배포됩니다.

1. GitHub 저장소 → **Settings** → **Pages** 이동
2. **Build and deployment** → **Source** 를 **GitHub Actions** 로 선택
3. 워크플로가 동작하는 브랜치(`main` 또는 `claude/sleepy-gauss-n4t8d5`)에 푸시
4. **Actions** 탭에서 배포 완료를 확인하면, Pages URL이 생성됩니다
   (예: `https://<사용자명>.github.io/Hyun03/`)

> 워크플로는 `main` 과 작업 브랜치 푸시 시 실행되며, Actions 탭에서 수동 실행도 가능합니다.

### 다른 호스팅을 쓰려면
`index.html`, `styles.css`, `script.js`, `config.js` 4개 파일을 그대로 올리면 됩니다.
Netlify, Vercel, Cloudflare Pages 등 정적 호스팅이면 어디든 OK.
