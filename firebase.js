// ============================================================
//  Firebase 연동: Google 로그인 + Firestore 프로필 저장/불러오기
//  (관리자 = OWNER_EMAIL 계정만 편집 가능)
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut,
  onAuthStateChanged, setPersistence, browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const CFG = window.FIREBASE_CONFIG || {};
const OWNER_EMAIL = (window.OWNER_EMAIL || "").toLowerCase();
const PATH = window.PROFILE_DOC || { collection: "site", doc: "profile" };

const adminBtn = document.getElementById("admin-btn");

// 설정이 안 된 경우: Firebase 비활성화, 기본 페이지만 표시
if (!CFG.apiKey || CFG.apiKey === "YOUR_API_KEY") {
  console.warn("[Firebase] firebase-config.js 가 아직 설정되지 않았습니다. 로그인/저장 기능이 비활성화됩니다.");
  if (adminBtn) adminBtn.style.display = "none";
} else {
  boot().catch((e) => console.error("[Firebase] 초기화 실패:", e));
}

async function boot() {
  const app = initializeApp(CFG);
  const auth = getAuth(app);
  const db = getFirestore(app);
  await setPersistence(auth, browserLocalPersistence); // 자동 로그인 유지
  const provider = new GoogleAuthProvider();
  const profileRef = doc(db, PATH.collection, PATH.doc);

  let currentUser = null;
  const isOwner = (u) => u && (u.email || "").toLowerCase() === OWNER_EMAIL;

  // 공개 프로필 실시간 구독 → 변경 시 자동 반영
  onSnapshot(profileRef,
    (snap) => { if (snap.exists()) window.LinkSite.applyProfile(snap.data()); },
    (err) => console.warn("[Firebase] 프로필 구독 오류(공개 읽기 규칙 확인):", err.code)
  );

  // 인증 상태 변화
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateAdminButton();
    if (user && !isOwner(user)) {
      toast(`이 계정(${user.email})은 편집 권한이 없습니다.`);
    }
  });

  // 관리자 버튼 클릭
  adminBtn.addEventListener("click", async () => {
    if (!currentUser) {
      try { await signInWithPopup(auth, provider); }
      catch (e) { toast("로그인 실패: " + (e.code || e.message)); }
      return;
    }
    if (isOwner(currentUser)) openEditor();
    else { await signOut(auth); }
  });

  function updateAdminButton() {
    if (isOwner(currentUser)) {
      adminBtn.innerHTML = pencilIcon();
      adminBtn.title = "편집";
      adminBtn.classList.add("is-owner");
    } else {
      adminBtn.innerHTML = gearIcon();
      adminBtn.title = currentUser ? "권한 없음 (클릭 시 로그아웃)" : "관리자 로그인";
      adminBtn.classList.remove("is-owner");
    }
  }
  updateAdminButton();

  // ---------------- 편집 패널 ----------------
  async function openEditor() {
    let data;
    try { const s = await getDoc(profileRef); data = s.exists() ? s.data() : window.LinkSite.getProfile(); }
    catch { data = window.LinkSite.getProfile(); }
    renderEditor(data);
  }

  function renderEditor(p) {
    closeEditor();
    p = p || {};
    const theme = p.theme || {};
    const bgc = p.background || {};
    const bioText = Array.isArray(p.bio) ? p.bio.join("\n") : (p.bio || "");

    const panel = document.createElement("aside");
    panel.id = "edit-panel";
    panel.className = "edit-panel";
    panel.innerHTML = `
      <div class="edit-head">
        <strong>프로필 편집</strong>
        <button class="ep-close" title="닫기">✕</button>
      </div>
      <div class="edit-body">
        <label class="ep-field"><span>이름</span><input id="ep-username" type="text" value="${attr(p.username)}"></label>
        <label class="ep-check"><input id="ep-verified" type="checkbox" ${p.verified ? "checked" : ""}> 인증 뱃지 표시</label>
        <label class="ep-field"><span>자기소개 (한 줄에 하나씩)</span><textarea id="ep-bio" rows="3">${esc(bioText)}</textarea></label>
        <label class="ep-field"><span>아바타 이미지 URL</span><input id="ep-avatar" type="text" value="${attr(p.avatar)}" placeholder="비우면 이니셜 표시"></label>

        <div class="ep-row">
          <label class="ep-color"><span>강조색</span><input id="ep-accent" type="color" value="${attr(theme.accent || "#7c5cff")}"></label>
          <label class="ep-color"><span>보조색</span><input id="ep-accent2" type="color" value="${attr(theme.accent2 || "#22d3ee")}"></label>
          <label class="ep-color"><span>배경색</span><input id="ep-bg" type="color" value="${attr(theme.background || "#0a0a0f")}"></label>
        </div>

        <div class="ep-row">
          <label class="ep-field grow"><span>배경 종류</span>
            <select id="ep-bgtype">
              <option value="gradient" ${bgc.type === "image" || bgc.type === "video" ? "" : "selected"}>그라데이션</option>
              <option value="image" ${bgc.type === "image" ? "selected" : ""}>이미지</option>
              <option value="video" ${bgc.type === "video" ? "selected" : ""}>동영상</option>
            </select>
          </label>
          <label class="ep-field grow"><span>배경 파일/URL</span><input id="ep-bgsrc" type="text" value="${attr(bgc.src)}" placeholder="이미지/동영상일 때"></label>
        </div>

        <label class="ep-check"><input id="ep-views" type="checkbox" ${p.showViews ? "checked" : ""}> 조회수 표시</label>

        <div class="ep-links-head"><span>링크</span><button id="ep-add" class="ep-add">+ 추가</button></div>
        <div id="ep-links" class="ep-links"></div>
      </div>
      <div class="edit-foot">
        <button id="ep-logout" class="ep-btn ghost">로그아웃</button>
        <button id="ep-save" class="ep-btn primary">저장</button>
      </div>
    `;
    document.body.appendChild(panel);
    requestAnimationFrame(() => panel.classList.add("open"));

    const linksWrap = panel.querySelector("#ep-links");
    (p.links || []).forEach((l) => linksWrap.appendChild(linkRow(l)));

    // 항상 마지막에 빈 입력 줄을 하나 유지 → 입력하면 자동으로 새 줄 추가
    function ensureTrailingRow() {
      const rows = [...linksWrap.querySelectorAll(".ep-link-row")];
      const last = rows[rows.length - 1];
      const lastEmpty = last &&
        !last.querySelector(".ep-label").value.trim() &&
        !last.querySelector(".ep-url").value.trim();
      if (!last || !lastEmpty) linksWrap.appendChild(linkRow({ icon: "link", label: "", url: "" }));
    }
    ensureTrailingRow();

    panel.querySelector(".ep-close").onclick = closeEditor;
    panel.querySelector("#ep-add").onclick = () => { linksWrap.appendChild(linkRow({ icon: "link", label: "", url: "" })); };
    panel.querySelector("#ep-logout").onclick = async () => { await signOut(auth); closeEditor(); };
    panel.querySelector("#ep-save").onclick = () => save(panel);

    // 입력 시: 빈 줄 자동 보충 + 실시간 미리보기
    panel.addEventListener("input", () => {
      ensureTrailingRow();
      window.LinkSite.applyProfile(collect(panel));
    });
  }

  function linkRow(l) {
    const row = document.createElement("div");
    row.className = "ep-link-row";
    const opts = window.LinkSite.iconNames
      .map((n) => `<option value="${n}" ${n === l.icon ? "selected" : ""}>${n}</option>`).join("");
    row.innerHTML = `
      <select class="ep-icon">${opts}</select>
      <input class="ep-label" type="text" placeholder="이름" value="${attr(l.label)}">
      <input class="ep-url" type="text" placeholder="https://..." value="${attr(l.url)}">
      <button class="ep-del" title="삭제">✕</button>`;
    row.querySelector(".ep-del").onclick = () => { row.remove(); };
    return row;
  }

  function collect(panel) {
    const links = [...panel.querySelectorAll(".ep-link-row")].map((r) => ({
      icon: r.querySelector(".ep-icon").value,
      label: r.querySelector(".ep-label").value.trim(),
      url: r.querySelector(".ep-url").value.trim(),
    })).filter((l) => l.url);
    const bio = panel.querySelector("#ep-bio").value.split("\n").map((s) => s.trim()).filter(Boolean);
    return {
      username: panel.querySelector("#ep-username").value.trim() || "username",
      verified: panel.querySelector("#ep-verified").checked,
      bio,
      avatar: panel.querySelector("#ep-avatar").value.trim(),
      theme: {
        accent: panel.querySelector("#ep-accent").value,
        accent2: panel.querySelector("#ep-accent2").value,
        background: panel.querySelector("#ep-bg").value,
      },
      background: {
        type: panel.querySelector("#ep-bgtype").value,
        src: panel.querySelector("#ep-bgsrc").value.trim(),
      },
      showViews: panel.querySelector("#ep-views").checked,
      links,
      updatedAt: Date.now(),
    };
  }

  async function save(panel) {
    const data = collect(panel);
    const btn = panel.querySelector("#ep-save");
    btn.disabled = true; btn.textContent = "저장 중…";
    try {
      await setDoc(profileRef, data);
      window.LinkSite.applyProfile(data);
      toast("저장되었습니다 ✓");
      closeEditor();
    } catch (e) {
      toast("저장 실패: " + (e.code || e.message) + " (보안 규칙 확인)");
      btn.disabled = false; btn.textContent = "저장";
    }
  }
}

function closeEditor() {
  const p = document.getElementById("edit-panel");
  if (p) { p.classList.remove("open"); setTimeout(() => p.remove(), 250); }
}

// ---------------- 유틸 ----------------
function esc(s) { return String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
function attr(s) { return String(s ?? "").replace(/"/g, "&quot;"); }

let toastTimer;
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

function gearIcon() {
  return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19.4 13a7.8 7.8 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.7 7.7 0 0 0-1.7-1l-.4-2.5h-3.8l-.4 2.5a7.7 7.7 0 0 0-1.7 1l-2.4-1-2 3.4L4.6 11a7.8 7.8 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.7 7.7 0 0 0 1.7 1l.4 2.5h3.8l.4-2.5a7.7 7.7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>';
}
function pencilIcon() {
  return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
}
