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

// ※ 멀티유저 플랫폼이라 별도의 "관리자 이메일" 설정은 필요 없습니다.
//   로그인한 사용자는 각자 자신의 프로필만 만들고 편집할 수 있으며,
//   권한 제어는 firestore.rules 의 보안 규칙(request.auth.uid 기반)이 담당합니다.
