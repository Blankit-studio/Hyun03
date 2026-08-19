// ============================================================
//  공용 Firebase 코어: 인증 + Firestore 데이터 헬퍼
//  (랜딩 페이지와 프로필 페이지가 함께 사용)
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut,
  onAuthStateChanged, setPersistence, browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, collection, query, where,
  limit, getDocs, runTransaction,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const CFG = window.FIREBASE_CONFIG || {};
export const configured = !!CFG.apiKey && CFG.apiKey !== "YOUR_API_KEY";

let auth = null, db = null, provider = null;
if (configured) {
  const app = initializeApp(CFG);
  auth = getAuth(app);
  db = getFirestore(app);
  provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} else {
  console.warn("[Firebase] firebase-config.js 가 설정되지 않았습니다. 로그인/저장 기능이 비활성화됩니다.");
}
export { auth, db };

// 최초 인증 상태 복원을 1회 기다리는 프라미스 (null = 비로그인)
export const authReady = configured
  ? new Promise((res) => { const un = onAuthStateChanged(auth, (u) => { un(); res(u); }); })
  : Promise.resolve(null);

// ---------- 인증 ----------
export function onAuth(cb) {
  if (!configured) { cb(null); return () => {}; }
  return onAuthStateChanged(auth, cb);
}
export function signInGoogle() { return signInWithPopup(auth, provider); }
export function signOutUser() { return signOut(auth); }

// ---------- 아이디(username) 규칙 ----------
export const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
export function normalizeUsername(u) { return (u || "").trim().toLowerCase(); }

// ---------- 프로필 조회 ----------
export async function getProfileByUid(uid) {
  const s = await getDoc(doc(db, "profiles", uid));
  return s.exists() ? s.data() : null;
}
export async function getProfileByUsername(username) {
  const name = normalizeUsername(username);
  const u = await getDoc(doc(db, "usernames", name));
  if (!u.exists()) return null;
  return getProfileByUid(u.data().uid);
}
export async function listPublicProfiles(n = 60) {
  const q = query(collection(db, "profiles"), where("public", "==", true), limit(n));
  const snap = await getDocs(q);
  const arr = [];
  snap.forEach((d) => arr.push(d.data()));
  arr.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return arr;
}
export async function isUsernameAvailable(username) {
  const name = normalizeUsername(username);
  const u = await getDoc(doc(db, "usernames", name));
  return !u.exists();
}

// ---------- 생성 / 저장 ----------
export async function claimUsernameAndCreate(uid, username, data) {
  const name = normalizeUsername(username);
  await runTransaction(db, async (tx) => {
    const uref = doc(db, "usernames", name);
    const usnap = await tx.get(uref);
    if (usnap.exists()) throw new Error("username-taken");
    tx.set(uref, { uid });
    tx.set(doc(db, "profiles", uid), {
      ...data, uid, username: name,
      createdAt: Date.now(), updatedAt: Date.now(),
    });
  });
}
export async function saveProfile(uid, data) {
  // username 은 변경 불가(생성 시 고정) → 저장 데이터에서 제외
  const { username, uid: _u, createdAt, ...rest } = data;
  await setDoc(doc(db, "profiles", uid), { ...rest, uid, updatedAt: Date.now() }, { merge: true });
}
