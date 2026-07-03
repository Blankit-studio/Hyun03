# Status — 나만의 링크 페이지 플랫폼

guns.lol 스타일의 **멀티유저 link-in-bio 플랫폼**입니다.
누구나 Google로 로그인해 자신만의 프로필을 만들고, 고유 링크로 공유할 수 있어요.
빌드 도구 없이 순수 HTML/CSS/JS + Firebase로 동작합니다.

## ✨ 구성

| 페이지 | 설명 |
|--------|------|
| `index.html` | **랜딩** — 공개 프로필 목록 + "내 프로필 만들기" |
| `profile.html?u=아이디` | **개별 프로필** — 각자의 고유 링크. 본인이 보면 편집 가능 |

- 로그인(Google) → 아이디 정하기 → 프로필 자동 생성
- 본인 프로필에서 ✎ 편집: 이름·소개·색상·배경·링크·공개여부를 실시간 미리보기하며 수정 → 저장
- 링크 항목은 입력하면 자동으로 새 줄 추가, 링크 복사(공유) 버튼 제공
- 공개 프로필은 랜딩 갤러리에 노출, 비공개는 본인만 열람
- 깔끔한 정적 UI(상시 애니메이션 없음), 모바일 반응형, 다크 테마

## 🗂 데이터 구조 (Firestore)

```
profiles/{uid}     : { uid, username, displayName, verified, bio[], avatar,
                       theme{}, background{}, showViews, public, links[], ... }
usernames/{아이디}  : { uid }         # 아이디 중복 방지(선점 방식)
```

## 🔧 Firebase 설정 (최초 1회)

1. **웹 앱 키 입력** — 콘솔 → 프로젝트 설정 → 웹 앱(`</>`)의 `firebaseConfig`를
   `firebase-config.js` 의 `window.FIREBASE_CONFIG` 에 붙여넣기. *(이미 입력되어 있음)*
2. **Google 로그인 사용** — Authentication → 로그인 방법 → **Google** 사용 설정.
3. **승인된 도메인 추가** — Authentication → 설정 → 승인된 도메인에 배포 주소
   (예: `<사용자명>.github.io`) 추가. `localhost` 는 기본 포함.
4. **Firestore 생성 & 규칙 적용** — Firestore Database 생성 후, **규칙(Rules)** 탭에
   `firestore.rules` 내용을 붙여넣고 **게시**. (공개 읽기 / 본인만 쓰기 / 아이디 선점)

> `firebaseConfig` 의 apiKey 등은 비밀값이 아닌 공개 클라이언트 키라 커밋해도 안전합니다.
> 실제 권한 보호는 Firestore 보안 규칙(`request.auth.uid` 기반)이 담당합니다.

## 🚀 로컬 실행

```bash
python3 -m http.server 8000   # 이후 http://localhost:8000 접속
```

## 🌐 배포 (GitHub Pages)

`/.github/workflows/deploy.yml` 워크플로가 포함되어 있어, 지정 브랜치에 푸시하면
자동 배포됩니다. 저장소 **Settings → Pages → Source: GitHub Actions** 로 한 번 설정하세요.
배포 후 승인된 도메인(3번)에 실제 Pages 도메인을 꼭 추가해야 로그인이 동작합니다.

## 🎨 커스터마이징

- 사이트 이름·소개 문구: `config.js` 의 `window.SITE_CONFIG`
- 새 프로필 기본 테마: `config.js` 의 `window.DEFAULT_THEME`
- 지원 아이콘: `github, instagram, twitter, x, youtube, tiktok, discord, twitch,
  linkedin, facebook, telegram, spotify, soundcloud, threads, kakao, email, website, link`
