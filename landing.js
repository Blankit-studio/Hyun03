// ============================================================
//  랜딩 페이지: 공개 프로필 목록 + 로그인 + 프로필 만들기(온보딩)
// ============================================================
import {
  configured, onAuth, signInGoogle, signOutUser,
  getProfileByUid, listPublicProfiles, isUsernameAvailable,
  claimUsernameAndCreate, normalizeUsername, USERNAME_RE,
} from "./core.js";

const SITE = window.SITE_CONFIG || {};
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// 사이트 이름 문구
if (SITE.name) { $("brand-name").textContent = SITE.name; $("foot-name").textContent = SITE.name; }
if (SITE.tagline) $("hero-sub").textContent = SITE.tagline;

let currentUser = null;
let myProfile = null;

// ---------- 인증 상태 ----------
onAuth(async (user) => {
  currentUser = user;
  myProfile = null;
  if (user) {
    try { myProfile = await getProfileByUid(user.uid); } catch { /* 무시 */ }
  }
  updateAuthUI();
});

function updateAuthUI() {
  const navAuth = $("nav-auth");
  const cta = $("cta-create");
  const hint = $("hero-hint");
  if (!configured) {
    navAuth.style.display = "none";
    cta.disabled = true;
    hint.textContent = "⚠️ Firebase 설정이 필요합니다 (firebase-config.js).";
    return;
  }
  if (!currentUser) {
    navAuth.textContent = "로그인";
    navAuth.onclick = () => signInGoogle().catch((e) => alert("로그인 실패: " + (e.code || e.message)));
    cta.textContent = "내 프로필 만들기";
    hint.textContent = "";
  } else if (myProfile) {
    navAuth.textContent = "로그아웃";
    navAuth.onclick = () => signOutUser();
    cta.textContent = "내 프로필 관리";
    hint.innerHTML = `로그인됨 · <a href="profile.html?u=${encodeURIComponent(myProfile.username)}">@${esc(myProfile.username)}</a>`;
  } else {
    navAuth.textContent = "로그아웃";
    navAuth.onclick = () => signOutUser();
    cta.textContent = "내 프로필 만들기";
    hint.textContent = "로그인됨 · 아직 프로필이 없어요. 만들어 보세요!";
  }
}

// ---------- CTA (만들기 / 관리) ----------
$("cta-create").addEventListener("click", async () => {
  if (!configured) return;
  if (!currentUser) {
    try {
      const cred = await signInGoogle();      // 로그인 결과에서 바로 uid 확보
      currentUser = cred.user;
    } catch (e) { alert("로그인 실패: " + (e.code || e.message)); return; }
    try { myProfile = await getProfileByUid(currentUser.uid); } catch { /* 무시 */ }
  }
  if (myProfile) {
    location.href = "profile.html?u=" + encodeURIComponent(myProfile.username);
  } else {
    openOnboard();
  }
});

// ---------- 온보딩 모달 ----------
const onboard = $("onboard");
const obInput = $("ob-username");
const obStatus = $("ob-status");
const obSubmit = $("ob-submit");
let checkTimer, lastChecked = "";

function openOnboard() {
  onboard.hidden = false;
  obInput.value = "";
  obStatus.textContent = "";
  obStatus.className = "ob-status";
  obSubmit.disabled = true;
  requestAnimationFrame(() => onboard.classList.add("open"));
  setTimeout(() => obInput.focus(), 60);
}
function closeOnboard() {
  onboard.classList.remove("open");
  setTimeout(() => { onboard.hidden = true; }, 200);
}
onboard.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeOnboard));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !onboard.hidden) closeOnboard(); });

obInput.addEventListener("input", () => {
  const name = normalizeUsername(obInput.value);
  if (obInput.value !== name) obInput.value = name; // 소문자/공백 정리 즉시 반영
  obSubmit.disabled = true;
  clearTimeout(checkTimer);
  if (!name) { setStatus("", ""); return; }
  if (!USERNAME_RE.test(name)) { setStatus("bad", "3~20자의 영문 소문자·숫자·밑줄(_)만 가능해요."); return; }
  setStatus("checking", "확인 중…");
  checkTimer = setTimeout(async () => {
    lastChecked = name;
    try {
      const ok = await isUsernameAvailable(name);
      if (lastChecked !== name) return;
      if (ok) { setStatus("ok", "사용 가능한 아이디예요 ✓"); obSubmit.disabled = false; }
      else setStatus("bad", "이미 사용 중인 아이디예요.");
    } catch (e) {
      setStatus("bad", "확인 실패: " + (e.code || e.message));
    }
  }, 400);
});
function setStatus(kind, msg) { obStatus.className = "ob-status " + kind; obStatus.textContent = msg; }

obSubmit.addEventListener("click", async () => {
  const name = normalizeUsername(obInput.value);
  if (!USERNAME_RE.test(name) || !currentUser) return;
  obSubmit.disabled = true; obSubmit.textContent = "만드는 중…";
  const data = {
    displayName: currentUser.displayName || name,
    bio: [],
    avatar: currentUser.photoURL || "",
    theme: window.DEFAULT_THEME || {},
    background: { type: "gradient", blur: 6, dim: 0.5 },
    showViews: true,
    public: true,
    links: [],
  };
  try {
    await claimUsernameAndCreate(currentUser.uid, name, data);
    location.href = "profile.html?u=" + encodeURIComponent(name) + "&edit=1";
  } catch (e) {
    if ((e.message || "").includes("username-taken")) setStatus("bad", "방금 누군가 선점했어요. 다른 아이디를 써주세요.");
    else setStatus("bad", "생성 실패: " + (e.code || e.message));
    obSubmit.disabled = false; obSubmit.textContent = "만들기";
  }
});

// ---------- 공개 프로필 목록 ----------
(async function loadGrid() {
  const grid = $("grid");
  if (!configured) { grid.innerHTML = `<div class="grid-empty">Firebase 설정 후 공개 프로필이 표시됩니다.</div>`; return; }
  try {
    const list = await listPublicProfiles(60);
    $("explore-count").textContent = list.length ? `${list.length}명` : "";
    if (!list.length) {
      grid.innerHTML = `<div class="grid-empty">아직 공개된 프로필이 없어요. 첫 번째 프로필을 만들어 보세요!</div>`;
      return;
    }
    grid.innerHTML = "";
    list.forEach((p) => grid.appendChild(cardFor(p)));
  } catch (e) {
    grid.innerHTML = `<div class="grid-empty">목록을 불러오지 못했어요 (${esc(e.code || e.message)}).<br>보안 규칙의 공개 읽기 설정을 확인하세요.</div>`;
  }
})();

// 아바타 URL 검증: http(s) / data:image 만 허용
function safeMediaUrl(raw) {
  const u = String(raw || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u) || /^data:image\//i.test(u)) return u;
  if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return "";
  return "https://" + u;
}

function cardFor(p) {
  const a = document.createElement("a");
  a.className = "pcard";
  a.href = "profile.html?u=" + encodeURIComponent(p.username);
  const accent = (p.theme && p.theme.accent) || "#7c5cff";
  const accent2 = (p.theme && p.theme.accent2) || "#22d3ee";
  const initial = (p.displayName || p.username || "?").charAt(0).toUpperCase();
  const bio = Array.isArray(p.bio) ? p.bio.filter(Boolean).join(" · ") : (p.bio || "");
  a.style.setProperty("--a", accent);
  a.style.setProperty("--a2", accent2);
  a.innerHTML = `
    <div class="pcard-name">${esc(p.displayName || p.username)}</div>
    <div class="pcard-handle">@${esc(p.username)}</div>
    ${bio ? `<div class="pcard-bio">${esc(bio)}</div>` : ""}
    <div class="pcard-links">${(p.links || []).length}개 링크</div>`;

  // 아바타는 DOM 으로 생성(인라인 onerror 없이) → 이름에 따옴표가 있어도 안전
  const fallback = () => {
    const d = document.createElement("div");
    d.className = "pcard-av fallback";
    d.textContent = initial;
    return d;
  };
  const src = safeMediaUrl(p.avatar);
  let av;
  if (src) {
    av = document.createElement("img");
    av.className = "pcard-av";
    av.src = src; av.alt = ""; av.loading = "lazy";
    av.onerror = () => av.replaceWith(fallback());
  } else {
    av = fallback();
  }
  a.prepend(av);
  return a;
}
