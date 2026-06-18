// ============================================================
//  Firebase 설정 — 본인 프로젝트 값으로 교체하세요.
//
//  값 찾는 법:
//  Firebase 콘솔(https://console.firebase.google.com)
//   → 프로젝트 선택 → ⚙️ 프로젝트 설정 → "내 앱" → 웹 앱(</>)
//   → "SDK 설정 및 구성"의 firebaseConfig 객체를 그대로 복사해 붙여넣기
// ============================================================
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBHDbNTM5jwpYJtf5pqbSTrbvkYNO6zcQY",
  authDomain: "status-f9a7c.firebaseapp.com",
  projectId: "status-f9a7c",
  storageBucket: "status-f9a7c.firebasestorage.app",
  messagingSenderId: "489179068121",
  appId: "1:489179068121:web:4f232088e6c07bf9b4b0c8",
  measurementId: "G-5CYBT5TW6C",
};

// 편집 권한을 가질 "관리자(나)"의 Google 계정 이메일.
// 이 이메일로 로그인했을 때만 편집 패널이 열립니다.
// (실제 쓰기 차단은 firestore.rules 의 보안 규칙이 담당합니다 —
//  규칙에도 동일한 이메일을 넣어야 합니다.)
window.OWNER_EMAIL = "shdblankit@gmail.com";

// Firestore 에서 프로필을 저장할 문서 경로 (컬렉션/문서)
window.PROFILE_DOC = { collection: "site", doc: "profile" };
