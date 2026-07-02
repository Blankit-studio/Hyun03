(function () {
  "use strict";

  // ---------- SVG 아이콘 모음 ----------
  const ICONS = {
    github: '<path d="M12 .5C5.4.5 0 5.9 0 12.6c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 5 18.3 5.3 18.3 5.3c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 24 12.6C24 5.9 18.6.5 12 .5z"/>',
    instagram: '<path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7 .1 5.7.1 4.8.3 4.1.6c-.8.3-1.4.7-2.1 1.4C1.3 2.7.9 3.3.6 4.1.3 4.8.1 5.7.1 7 0 8.3 0 8.7 0 12s0 3.7.1 5c.1 1.3.2 2.2.5 2.9.3.8.7 1.4 1.4 2.1.7.7 1.3 1.1 2.1 1.4.7.3 1.6.5 2.9.5 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.2 2.9-.5.8-.3 1.4-.7 2.1-1.4.7-.7 1.1-1.3 1.4-2.1.3-.7.5-1.6.5-2.9.1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.2-2.2-.5-2.9-.3-.8-.7-1.4-1.4-2.1-.7-.7-1.3-1.1-2.1-1.4-.7-.3-1.6-.5-2.9-.5C15.7 0 15.3 0 12 0z"/><path d="M12 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/><circle cx="18.4" cy="5.6" r="1.4"/>',
    twitter: '<path d="M23.6 4.6a8.7 8.7 0 0 1-2.5.7 4.3 4.3 0 0 0 1.9-2.4c-.8.5-1.8.9-2.7 1.1a4.3 4.3 0 0 0-7.3 3.9A12.2 12.2 0 0 1 4.2 3.4a4.3 4.3 0 0 0 1.3 5.7c-.7 0-1.3-.2-1.9-.5v.1c0 2.1 1.5 3.8 3.5 4.2a4.3 4.3 0 0 1-1.9.1 4.3 4.3 0 0 0 4 3 8.6 8.6 0 0 1-6.3 1.8 12.2 12.2 0 0 0 6.6 1.9c7.9 0 12.2-6.5 12.2-12.2v-.6c.8-.6 1.5-1.3 2.1-2.2z"/>',
    x: '<path d="M18.2 2.3h3.3l-7.2 8.2L23 21.7h-6.6l-5.2-6.8-6 6.8H1.9l7.7-8.8L1 2.3h6.8l4.7 6.2 5.7-6.2zm-1.2 17.4h1.8L7.1 4.2H5.2l11.8 15.5z"/>',
    youtube: '<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/>',
    tiktok: '<path d="M16.6 5.8a4.3 4.3 0 0 1-1-2.8h-3.4v13.8a2.5 2.5 0 1 1-1.8-2.4V11a5.9 5.9 0 1 0 5.2 5.8V9.4a7.6 7.6 0 0 0 4.4 1.4V7.4a4.3 4.3 0 0 1-3.4-1.6z"/>',
    discord: '<path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5a18.3 18.3 0 0 1 4.4 1.4 16.2 16.2 0 0 0-13 0A18.3 18.3 0 0 1 10.9 3l-.3-.5A19.8 19.8 0 0 0 5.7 4.4 20.6 20.6 0 0 0 2.2 18.1a19.9 19.9 0 0 0 6 3l.5-.7a13 13 0 0 1-2-.9l.5-.4a14.2 14.2 0 0 0 12.1 0l.5.4a13 13 0 0 1-2 1l.5.7a19.9 19.9 0 0 0 6-3 20.6 20.6 0 0 0-3.5-13.7zM8.9 14.8a1.9 1.9 0 0 1 0-3.8 1.9 1.9 0 0 1 0 3.8zm6.2 0a1.9 1.9 0 0 1 0-3.8 1.9 1.9 0 0 1 0 3.8z"/>',
    twitch: '<path d="M4 1L2 5v15h5v3h3l3-3h4l5-5V1H4zm17 12l-3 3h-5l-3 3v-3H6V3h15v10zm-5-7v6h-2V6h2zm-5 0v6H9V6h2z"/>',
    linkedin: '<path d="M22.2 0H1.8C.8 0 0 .8 0 1.8v20.4C0 23.2.8 24 1.8 24h20.4c1 0 1.8-.8 1.8-1.8V1.8C24 .8 23.2 0 22.2 0zM7.1 20.5H3.6V9h3.5v11.5zM5.3 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1zm15.2 13.1H17v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.5V9H13v1.6h.05c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3z"/>',
    facebook: '<path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/>',
    telegram: '<path d="M23.9 3.7l-3.6 17c-.3 1.2-1 1.5-2 .9l-5.5-4-2.6 2.6c-.3.3-.5.5-1.1.5l.4-5.6L21.3 5.2c.4-.4-.1-.6-.7-.2L7.5 13.3 2 11.6c-1.2-.4-1.2-1.2.2-1.7L22.5 2c1-.4 1.8.2 1.4 1.7z"/>',
    spotify: '<path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.5 17.3a.7.7 0 0 1-1 .2c-2.8-1.7-6.3-2.1-10.4-1.1a.7.7 0 1 1-.3-1.5c4.5-1 8.4-.6 11.5 1.3.4.2.4.7.2 1.1zm1.5-3.3a.9.9 0 0 1-1.2.3c-3.2-2-8-2.5-11.8-1.4a.9.9 0 1 1-.5-1.7c4.3-1.3 9.6-.7 13.3 1.6.4.2.5.8.2 1.2zm.1-3.4C15.8 8.3 8.5 8.1 4.8 9.2a1 1 0 1 1-.6-2C8.5 5.9 16.5 6.2 20.6 8.6a1 1 0 1 1-1 1.7z"/>',
    soundcloud: '<path d="M1.2 12.7c-.1 0-.1.1-.1.2l-.3 2.6.3 2.5c0 .1 0 .2.1.2s.2-.1.2-.2l.3-2.5-.3-2.6c0-.1-.1-.2-.2-.2zm2.3-1.1c-.1 0-.2.1-.2.2l-.4 3.7.4 3.6c0 .1.1.2.2.2s.2-.1.2-.2l.4-3.6-.4-3.7c0-.1-.1-.2-.2-.2zm17.3.2c-.4 0-.8.1-1.1.2-.2-2.7-2.5-4.9-5.3-4.9-.7 0-1.4.2-2 .4-.2.1-.3.2-.3.4v8.9c0 .2.2.4.4.4h8.3a2.7 2.7 0 0 0 0-5.4zM6 11.2c-.1 0-.2.1-.2.3l-.3 4 .3 3.8c0 .2.1.3.2.3s.2-.1.2-.3l.4-3.8-.4-4c0-.2-.1-.3-.2-.3zm2.4-.7c-.2 0-.3.1-.3.3l-.3 4.7.3 3.7c0 .2.1.3.3.3s.3-.1.3-.3l.4-3.7-.4-4.7c0-.2-.1-.3-.3-.3zm2.4-.3c-.2 0-.3.2-.3.3l-.3 5 .3 3.7c0 .2.1.3.3.3s.3-.1.3-.3l.3-3.7-.3-5c0-.2-.1-.3-.3-.3z"/>',
    threads: '<path d="M17.3 11.2c-.1 0-.2-.1-.3-.1-.2-3.2-1.9-5-4.8-5-1.7 0-3.2.8-4 2.2l1.6 1.1c.6-1 1.5-1.2 2.4-1.2 1.5 0 2.6.9 2.8 2.6-.7-.1-1.4-.2-2.2-.1-2.5.1-4.1 1.6-4 3.6.1 1.7 1.6 2.9 3.5 2.9 1.7 0 3.5-.8 4.2-3.1.4.6.7 1.4.8 2.3 0 .8-.4 2.9-3.6 4.1l.7 1.8c2.6-1 4.7-3.1 4.7-6 0-1.5-.6-2.8-1.5-3.8 0-.5-.2-1.1-.5-1.6zm-4.6 5.4c-1 0-2-.5-2-1.4 0-1 1.2-1.4 2.4-1.4.5 0 .9 0 1.4.1-.2 1.7-1 2.7-1.8 2.7z"/>',
    kakao: '<path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.2 4.7 6.6-.2.7-.7 2.6-.8 3-.1.5.2.5.4.4.2-.1 2.6-1.8 3.6-2.5.7.1 1.4.2 2.1.2 5.5 0 10-3.5 10-7.7S17.5 3 12 3z"/>',
    email: '<path d="M22 4H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.2l-10 6.3L2 8.2V6l10 6.3L22 6v2.2z"/>',
    website: '<path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm8.9 7h-3.4a15.6 15.6 0 0 0-1.4-3.6A9.6 9.6 0 0 1 20.9 7zM12 2.3a13.9 13.9 0 0 1 2 4.7h-4a13.9 13.9 0 0 1 2-4.7zM2.6 14a9.5 9.5 0 0 1 0-4h3.9a18 18 0 0 0 0 4zm.9 2.4h3.4a15.6 15.6 0 0 0 1.4 3.6A9.6 9.6 0 0 1 3.5 16.4zm3.4-9.4H3.5a9.6 9.6 0 0 1 4.8-3.6A15.6 15.6 0 0 0 7 7zM12 21.7a13.9 13.9 0 0 1-2-4.7h4a13.9 13.9 0 0 1-2 4.7zm2.5-7.3h-5a16.2 16.2 0 0 1 0-4h5a16.2 16.2 0 0 1 0 4zm.2 5.6a15.6 15.6 0 0 0 1.4-3.6h3.4a9.6 9.6 0 0 1-4.8 3.6zm2.8-6h3.9a9.5 9.5 0 0 1 0 4h-3.9a18 18 0 0 0 0-4z"/>',
    link: '<path d="M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7h-4a5 5 0 0 0 0 10h4v-1.9h-4A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8v2zm5-6v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10h-4z"/>',
  };
  const aliasIcon = { tweet: "x" };
  function getIcon(name) { return ICONS[aliasIcon[name] || name] || ICONS.link; }

  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // 상태
  let revealed = false;      // 입장 완료 여부
  let current = {};          // 현재 프로필

  // 기본 프로필 (config.js) 과 병합
  function withDefaults(p) {
    const d = window.PROFILE_CONFIG || {};
    p = p || {};
    return {
      username: p.username ?? d.username ?? "username",
      verified: p.verified ?? d.verified ?? false,
      bio: p.bio ?? d.bio ?? [],
      avatar: p.avatar ?? d.avatar ?? "",
      theme: Object.assign({}, d.theme, p.theme),
      background: Object.assign({}, d.background, p.background),
      showViews: p.showViews ?? d.showViews ?? false,
      links: p.links ?? d.links ?? [],
    };
  }

  // ---------- 프로필 적용 (재호출 가능) ----------
  function applyProfile(raw) {
    const cfg = withDefaults(raw);
    current = cfg;

    // 테마
    if (cfg.theme.accent) root.style.setProperty("--accent", cfg.theme.accent);
    if (cfg.theme.accent2) root.style.setProperty("--accent2", cfg.theme.accent2);
    if (cfg.theme.background) root.style.setProperty("--bg", cfg.theme.background);

    // 배경
    const bg = $("bg");
    const b = cfg.background || { type: "gradient" };
    root.style.setProperty("--bg-blur", (b.blur ?? 6) + "px");
    root.style.setProperty("--dim", String(b.dim ?? 0.5));
    bg.className = "bg";
    bg.style.backgroundImage = "";
    bg.innerHTML = "";
    if (b.type === "image" && b.src) {
      bg.style.backgroundImage = `url("${b.src}")`;
    } else if (b.type === "video" && b.src) {
      const v = document.createElement("video");
      v.src = b.src; v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true;
      bg.appendChild(v);
    } else {
      bg.classList.add("gradient");
    }

    // 아바타
    const img = $("avatar-img"), fb = $("avatar-fallback");
    if (cfg.avatar) {
      img.src = cfg.avatar; img.hidden = false; fb.hidden = true;
      img.onerror = () => { img.hidden = true; fb.hidden = false; fb.textContent = (cfg.username || "?").charAt(0).toUpperCase(); };
    } else {
      img.hidden = true; fb.hidden = false; fb.textContent = (cfg.username || "?").charAt(0).toUpperCase();
    }

    // 이름 / 뱃지
    $("username-text").textContent = cfg.username;
    $("verified-badge").hidden = !cfg.verified;
    document.title = cfg.username + " · 링크 모음";

    // 링크
    const linksEl = $("links");
    linksEl.innerHTML = "";
    if (!(cfg.links || []).length) {
      const d = document.createElement("div");
      d.className = "links-empty";
      d.textContent = "등록된 링크가 없습니다";
      linksEl.appendChild(d);
    }
    (cfg.links || []).forEach((l) => {
      const a = document.createElement("a");
      a.className = "link";
      a.href = l.url || "#";
      a.target = (l.url || "").startsWith("mailto:") ? "_self" : "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML =
        `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${getIcon(l.icon)}</svg>` +
        `<span class="label">${escapeHtml(l.label || l.icon || "링크")}</span>` +
        `<svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>`;
      linksEl.appendChild(a);
    });

    // 조회수
    if (cfg.showViews) $("views").hidden = false; else $("views").hidden = true;

    // 바이오 렌더 (정적)
    renderBio();

    // 입장이 끝난 뒤 데이터가 갱신되면 링크를 즉시 표시(재애니메이션 없음)
    if (revealed) document.querySelectorAll(".link").forEach((el) => el.classList.add("in"));
  }

  // ---------- 링크 첫 등장 (1회) ----------
  function animateLinks() {
    document.querySelectorAll(".link").forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), 60 * i + 80);
    });
  }

  // ---------- 바이오 (정적 표시) ----------
  function renderBio() {
    const target = $("bio-text");
    const lines = Array.isArray(current.bio) ? current.bio : (current.bio ? [current.bio] : []);
    target.textContent = lines.filter(Boolean).join("  ·  ");
  }

  // ---------- 조회수 카운터 (localStorage) ----------
  function bumpViews() {
    if (!current.showViews) return;
    const key = "profile_views_" + (current.username || "default");
    let n = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, String(n));
    $("views-count").textContent = n.toLocaleString();
  }

  // ---------- 입장 ----------
  function reveal() {
    if (revealed) return;
    revealed = true;
    // 첫 페인트 이후에 클래스를 붙여야 페이드인 트랜지션이 확실히 동작
    requestAnimationFrame(() => requestAnimationFrame(() => $("app").classList.add("show")));
    animateLinks();
    bumpViews();
  }

  // ---------- 부팅 ----------
  function boot() {
    // 마지막으로 본 프로필을 캐시해 두었다가 먼저 그려서
    // Firestore 로딩 전 기본값이 번쩍이는 현상을 방지
    let initial = window.PROFILE_CONFIG || {};
    try {
      const cached = localStorage.getItem("cached_profile_v1");
      if (cached) initial = JSON.parse(cached);
    } catch { /* 캐시가 깨졌으면 기본값 사용 */ }
    applyProfile(initial);
    reveal();
  }

  // 외부(Firebase 모듈)에서 사용할 API 노출
  window.LinkSite = {
    ICONS,
    iconNames: Object.keys(ICONS),
    applyProfile,
    getProfile: () => current,
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
