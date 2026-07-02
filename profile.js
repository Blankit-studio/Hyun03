// ============================================================
//  프로필 페이지: ?u=아이디 로 프로필을 불러와 표시.
//  본인(소유자)이 보면 편집 패널이 열립니다.
// ============================================================
import { configured, onAuth, getProfileByUsername, saveProfile } from "./core.js";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const uname = (params.get("u") || "").toLowerCase();
const wantEdit = params.get("edit") === "1";

// 아이디가 없으면 랜딩으로
if (!uname) location.replace("index.html");

let profile = null;       // 현재 프로필 데이터
let currentUser = null;   // 로그인 사용자
let isOwner = false;

// 캐시로 첫 화면 깜빡임 방지
try {
  const cached = JSON.parse(localStorage.getItem("cachedp_" + uname) || "null");
  if (cached) { window.LinkSite.applyProfile(cached); window.LinkSite.reveal(); }
} catch { /* 무시 */ }

// 프로필 로드
(async function load() {
  if (!configured) { showNotFound("Firebase 설정이 필요합니다", "firebase-config.js 를 설정하세요."); return; }
  try {
    const p = await getProfileByUsername(uname);
    if (!p) { showNotFound(); return; }
    profile = p;
    try { localStorage.setItem("cachedp_" + uname, JSON.stringify(p)); } catch { /* 무시 */ }
    window.LinkSite.applyProfile(p);
    window.LinkSite.reveal();
    refreshOwnerUI();
  } catch (e) {
    // 비공개 프로필을 남이 열면 권한 오류가 날 수 있음
    showNotFound("이 프로필은 비공개예요", "소유자만 볼 수 있습니다.");
  }
})();

onAuth((user) => { currentUser = user; refreshOwnerUI(); });

function refreshOwnerUI() {
  isOwner = !!(currentUser && profile && currentUser.uid === profile.uid);
  $("admin-btn").hidden = !isOwner;
  $("share-btn").hidden = !isOwner;
  if (isOwner && wantEdit && !document.getElementById("edit-panel")) openEditor();
}

function showNotFound(title, desc) {
  $("app").style.display = "none";
  if (title) $("nf-title").textContent = title;
  if (desc) $("nf-desc").textContent = desc;
  $("notfound").hidden = false;
}

// 편집 버튼 / 공유 버튼
$("admin-btn").addEventListener("click", () => { if (isOwner) openEditor(); });
$("share-btn").addEventListener("click", async () => {
  const url = location.origin + location.pathname + "?u=" + encodeURIComponent(uname);
  try { await navigator.clipboard.writeText(url); toast("프로필 링크를 복사했어요 ✓"); }
  catch { toast(url); }
});

// ---------------- 편집 패널 ----------------
function openEditor() {
  renderEditor(profile || window.LinkSite.getProfile());
}

function renderEditor(p) {
  closeEditor();
  p = p || {};
  const baseline = JSON.parse(JSON.stringify(p));
  const theme = p.theme || {};
  const bgc = p.background || {};
  const bioText = Array.isArray(p.bio) ? p.bio.join("\n") : (p.bio || "");

  const backdrop = document.createElement("div");
  backdrop.id = "edit-backdrop";
  backdrop.className = "edit-backdrop";
  document.body.appendChild(backdrop);

  const panel = document.createElement("aside");
  panel.id = "edit-panel";
  panel.className = "edit-panel";
  panel.innerHTML = `
    <div class="edit-head">
      <strong>프로필 편집</strong>
      <button class="ep-close" title="닫기">✕</button>
    </div>
    <div class="edit-body">
      <div class="ep-handle">@${esc(p.username || uname)}</div>
      <label class="ep-field"><span>표시 이름</span><input id="ep-name" type="text" value="${attr(p.displayName)}"></label>
      <label class="ep-check"><input id="ep-verified" type="checkbox" ${p.verified ? "checked" : ""}> 인증 뱃지 표시</label>
      <label class="ep-check"><input id="ep-public" type="checkbox" ${p.public !== false ? "checked" : ""}> 공개 (목록에 노출)</label>
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
      <button id="ep-cancel" class="ep-btn ghost">닫기</button>
      <button id="ep-save" class="ep-btn primary">저장</button>
    </div>
  `;
  document.body.appendChild(panel);
  requestAnimationFrame(() => { backdrop.classList.add("open"); panel.classList.add("open"); });

  const linksWrap = panel.querySelector("#ep-links");
  (p.links || []).forEach((l) => linksWrap.appendChild(linkRow(l)));

  function ensureTrailingRow() {
    const rows = [...linksWrap.querySelectorAll(".ep-link-row")];
    const last = rows[rows.length - 1];
    const lastEmpty = last &&
      !last.querySelector(".ep-label").value.trim() &&
      !last.querySelector(".ep-url").value.trim();
    if (!last || !lastEmpty) linksWrap.appendChild(linkRow({ icon: "link", label: "", url: "" }));
  }
  ensureTrailingRow();

  function discardAndClose() {
    window.LinkSite.applyProfile(baseline);
    closeEditor();
  }
  panel.querySelector(".ep-close").onclick = discardAndClose;
  panel.querySelector("#ep-cancel").onclick = discardAndClose;
  backdrop.onclick = discardAndClose;
  epKeyHandler = (e) => { if (e.key === "Escape") discardAndClose(); };
  document.addEventListener("keydown", epKeyHandler);

  panel.querySelector("#ep-add").onclick = () => { linksWrap.appendChild(linkRow({ icon: "link", label: "", url: "" })); };
  panel.querySelector("#ep-save").onclick = () => save(panel);

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
  row.querySelector(".ep-del").onclick = () => {
    const panel = row.closest("#edit-panel");
    row.remove();
    if (panel) panel.dispatchEvent(new Event("input"));
  };
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
    username: (profile && profile.username) || uname,
    displayName: panel.querySelector("#ep-name").value.trim() || uname,
    verified: panel.querySelector("#ep-verified").checked,
    public: panel.querySelector("#ep-public").checked,
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
  };
}

async function save(panel) {
  const data = collect(panel);
  const btn = panel.querySelector("#ep-save");
  btn.disabled = true; btn.textContent = "저장 중…";
  try {
    await saveProfile(currentUser.uid, data);
    profile = { ...profile, ...data };
    try { localStorage.setItem("cachedp_" + uname, JSON.stringify(profile)); } catch { /* 무시 */ }
    window.LinkSite.applyProfile(profile);
    toast("저장되었습니다 ✓");
    closeEditor();
  } catch (e) {
    toast("저장 실패: " + (e.code || e.message));
    btn.disabled = false; btn.textContent = "저장";
  }
}

let epKeyHandler = null;
function closeEditor() {
  const p = document.getElementById("edit-panel");
  const b = document.getElementById("edit-backdrop");
  if (p) { p.classList.remove("open"); setTimeout(() => p.remove(), 250); }
  if (b) { b.classList.remove("open"); setTimeout(() => b.remove(), 250); }
  if (epKeyHandler) { document.removeEventListener("keydown", epKeyHandler); epKeyHandler = null; }
  // URL 의 edit=1 정리
  if (params.get("edit")) history.replaceState(null, "", "profile.html?u=" + encodeURIComponent(uname));
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
  toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
}
