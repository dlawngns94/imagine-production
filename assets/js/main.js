/* =========================================================
   IMAGINE PRODUCTION — main.js
   모든 텍스트/이미지/가격은 /data/*.json 에서 불러옵니다.
   콘텐츠 수정은 JSON 파일만 고치면 됩니다. (README.md 참고)
   ========================================================= */
(function () {
  "use strict";

  const page = document.body.dataset.page || "home";
  const app = document.getElementById("app");

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])).replace(/\n/g, "<br>");
  const won = (n) => Number(n || 0).toLocaleString("ko-KR");
  const getJSON = (name) =>
    fetch(`data/${name}.json`, { cache: "no-cache" }).then((r) => {
      if (!r.ok) throw new Error(`${name}.json ${r.status}`);
      return r.json();
    });

  /* ---------- header / footer ---------- */
  function renderHeader(site) {
    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const header = document.getElementById("site-header");
    header.innerHTML = `
      <div class="container">
        <a class="logo" href="index.html">${esc(site.companyName)}</a>
        <nav class="nav" aria-label="주 메뉴">
          <ul>
            ${site.menu
              .map((m) => `<li><a href="${esc(m.href)}" class="${m.href.toLowerCase() === current ? "is-active" : ""}">${esc(m.label)}</a></li>`)
              .join("")}
          </ul>
        </nav>
        <button class="nav-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>`;

    const toggle = header.querySelector(".nav-toggle");
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
      updateHeader();
    });

    // 이미지 위에서는 투명 헤더, 스크롤하면 흰 배경
    const hasHero = page !== "notfound";
    function updateHeader() {
      const overHero = hasHero && window.scrollY < window.innerHeight * 0.35 && !header.classList.contains("nav-open");
      header.classList.toggle("is-transparent", overHero);
    }
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  function renderFooter(site) {
    document.getElementById("site-footer").innerHTML = `
      <div class="container">
        <div class="footer-top">
          <a class="logo" href="index.html">${esc(site.companyName)}</a>
          <nav class="footer-nav">${site.menu.map((m) => `<a href="${esc(m.href)}">${esc(m.label)}</a>`).join("")}</nav>
        </div>
        <div class="footer-info">
          <span>${esc(site.companyNameKo)}</span>
          <span>대표 ${esc(site.ceo)}</span>
          <span>사업자등록번호 ${esc(site.businessNumber)}</span><br>
          <span>${esc(site.address)}</span>
          ${site.tel ? `<span>TEL ${esc(site.tel)}</span>` : ""}
          <span>${esc(site.email)}</span>
        </div>
        <div class="footer-copy">© ${new Date().getFullYear()} ${esc(site.companyName)}. All rights reserved.</div>
      </div>`;
  }

  /* ---------- HOME ---------- */
  function renderHome(site, data) {
    app.innerHTML = `
      <section class="hero" aria-label="메인 이미지">
        ${data.slides
          .map(
            (s, i) => `
          <div class="hero__slide ${i === 0 ? "is-active" : ""}">
            <img src="${esc(s.image)}" alt="${esc(s.title.replace(/\n/g, " "))}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
          </div>`
          )
          .join("")}
        <div class="hero__caption">
          <div class="container">
            <p class="eyebrow" data-cap="eyebrow"></p>
            <h1 class="h-display" data-cap="title"></h1>
            <p data-cap="text"></p>
          </div>
        </div>
        ${data.slides.length > 1 ? `<div class="hero__dots">${data.slides.map((_, i) => `<button type="button" aria-label="${i + 1}번 이미지"></button>`).join("")}</div>` : ""}
        <div class="hero__scroll">SCROLL</div>
      </section>

      <section class="section">
        <div class="container center reveal">
          <p class="eyebrow">${esc(data.intro.eyebrow)}</p>
          <h2 class="h-section">${esc(data.intro.title)}</h2>
          <p class="lead">${esc(data.intro.text)}</p>
          <div class="feature-grid">
            ${data.features
              .map(
                (f) => `
              <a class="feature-card" href="${esc(f.href)}">
                <img src="${esc(f.image)}" alt="" loading="lazy">
                <div class="feature-card__text"><strong>${esc(f.title)}</strong><span>${esc(f.sub)}</span></div>
              </a>`
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="banner">
        <img src="assets/images/brand-pavilion.jpg" alt="" loading="lazy">
        <div class="container reveal">
          <p class="eyebrow">CONTACT</p>
          <h2 class="h-section">${esc(site.tagline)}</h2>
          <a class="btn btn--light" href="contact.html">상담 문의하기</a>
        </div>
      </section>`;

    // slider
    const slides = [...app.querySelectorAll(".hero__slide")];
    const dots = [...app.querySelectorAll(".hero__dots button")];
    const caps = { eyebrow: app.querySelector('[data-cap="eyebrow"]'), title: app.querySelector('[data-cap="title"]'), text: app.querySelector('[data-cap="text"]') };
    let idx = 0, timer;
    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach((el, i) => el.classList.toggle("is-active", i === idx));
      dots.forEach((el, i) => el.classList.toggle("is-active", i === idx));
      const s = data.slides[idx];
      caps.eyebrow.textContent = s.eyebrow || "";
      caps.title.textContent = s.title || "";
      caps.text.textContent = s.text || "";
      clearTimeout(timer);
      if (slides.length > 1) timer = setTimeout(() => go(idx + 1), 6000);
    }
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    go(0);
  }

  /* ---------- sub page hero ---------- */
  const pageHero = (h) => `
    <section class="page-hero">
      <img src="${esc(h.image)}" alt="" fetchpriority="high">
      <div class="container"><h1>${esc(h.title)}</h1><p>${esc(h.sub)}</p></div>
    </section>`;

  /* ---------- BRAND ---------- */
  function renderBrand(site, d) {
    app.innerHTML = `
      ${pageHero(d.hero)}
      <section class="section">
        <div class="container split">
          <div class="reveal">
            <p class="eyebrow">${esc(d.story.eyebrow)}</p>
            <h2 class="h-section">${esc(d.story.title)}</h2>
            ${d.story.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
          </div>
          <img class="reveal" src="${esc(d.story.image)}" alt="" loading="lazy">
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          <p class="eyebrow reveal">PHILOSOPHY</p>
          <h2 class="h-section reveal">우리가 일하는 방식</h2>
          <div class="values">
            ${d.values.map((v) => `<div class="value reveal"><span class="value__no">${esc(v.no)}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div>`).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="eyebrow reveal">WHAT WE DO</p>
          <h2 class="h-section reveal">서비스</h2>
          <div class="service-grid">
            ${d.services.map((s) => `<div class="service reveal"><img src="${esc(s.image)}" alt="" loading="lazy"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("")}
          </div>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container center">
          <p class="eyebrow reveal">HISTORY</p>
          <h2 class="h-section reveal">연혁</h2>
          <ul class="history">
            ${d.history.map((h) => `<li class="reveal"><b>${esc(h.year)}</b><span>${esc(h.text)}</span></li>`).join("")}
          </ul>
        </div>
      </section>`;
  }

  /* ---------- WEDDING ---------- */
  function renderWedding(site, d) {
    app.innerHTML = `
      ${pageHero(d.hero)}
      <section class="section">
        <div class="container center">
          <p class="eyebrow reveal">PACKAGE</p>
          <h2 class="h-section reveal">웨딩 상품 안내</h2>
          <p class="notice reveal">${esc(d.notice)}</p>
          <div class="pkg-grid" style="text-align:left">
            ${d.packages
              .map(
                (p) => `
              <article class="pkg reveal ${p.featured ? "is-featured" : ""}">
                <div class="pkg__img"><img src="${esc(p.image)}" alt="" loading="lazy">${p.featured ? '<span class="pkg__badge">BEST</span>' : ""}</div>
                <div class="pkg__body">
                  <span class="pkg__name">${esc(p.name)}</span>
                  <h3 class="pkg__title">${esc(p.title)}</h3>
                  <span class="pkg__guests">${esc(p.guests)}</span>
                  <div class="pkg__divider"></div>
                  <ul>${p.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
                   <a class="btn" href="contact.html?type=wedding">견적 문의하기</a>
                </div>
              </article>`
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="section section--alt" id="estimate">
        <div class="container">
          <p class="eyebrow reveal">ESTIMATE</p>
          <h2 class="h-section reveal">예상 견적 문의</h2>
          <p class="lead reveal">원하시는 패키지와 추가 옵션을 선택해 문의해 주시면 맞춤 견적을 안내드립니다.</p>
          <div class="estimate">
            <div>
              <div class="estimate__group">
                <h3>패키지 선택</h3>
                ${d.packages
                  .map(
                    (p, i) => `
                  <label class="choice"><span><input type="radio" name="pkg" value="${esc(p.id)}" ${p.featured || (!d.packages.some((x) => x.featured) && i === 0) ? "checked" : ""}>${esc(p.title)} (${esc(p.name)})</span></label>`
                  )
                  .join("")}
              </div>
              <div class="estimate__group">
                <h3>추가 옵션</h3>
                ${d.options
                  .map((o) => `<label class="choice"><span><input type="checkbox" name="opt" value="${esc(o.id)}">${esc(o.name)}</span>${o.qty ? `<span class="qty"><button type="button" data-step="-1" data-for="${esc(o.id)}" aria-label="줄이기">−</button><input type="number" data-qty="${esc(o.id)}" value="${o.qty.default}" min="${o.qty.min}" max="${o.qty.max}" step="${o.qty.step}" inputmode="numeric"><span>${esc(o.qty.unit)}</span><button type="button" data-step="1" data-for="${esc(o.id)}" aria-label="늘리기">+</button></span>` : ""}</label>`)
                  .join("")}
              </div>
            </div>
            <aside class="summary" aria-live="polite">
              <h3>ESTIMATE</h3>
              <div class="summary__rows"></div>
              <small>선택하신 내용은 문의 양식에 자동으로 입력됩니다.</small>
              <a class="btn summary__cta" href="contact.html">선택한 내용으로 견적 문의</a>
            </aside>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="eyebrow reveal">PROCESS</p>
          <h2 class="h-section reveal">진행 절차</h2>
          <div class="process">
            ${d.process.map((s) => `<div class="process__item reveal"><b>${esc(s.step)}</b><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("")}
          </div>
        </div>
      </section>`;

    const rows = app.querySelector(".summary__rows");
    const cta = app.querySelector(".summary__cta");
    function calc() {
      const pid = app.querySelector('input[name="pkg"]:checked')?.value;
      const pkg = d.packages.find((p) => p.id === pid);
      const opts = [...app.querySelectorAll('input[name="opt"]:checked')].map((el) => { const o = d.options.find((x) => x.id === el.value); const n = app.querySelector(`[data-qty="${o.id}"]`)?.value; return { ...o, name: n ? `${o.name} ${n}${o.qty.unit}` : o.name, id: n ? `${o.id}:${n}` : o.id }; });
      const total = (pkg?.price || 0) + opts.reduce((a, o) => a + o.price, 0);
      rows.innerHTML =
        (pkg ? `<div class="summary__row"><span>${esc(pkg.title)}</span></div>` : "") +
        opts.map((o) => `<div class="summary__row"><span>${esc(o.name)}</span></div>`).join("");
      const q = new URLSearchParams({ type: "wedding", pkg: pid || "", opt: opts.map((o) => o.id).join(",") });
      cta.href = `contact.html?${q}`;
    }
    app.querySelectorAll(".estimate input").forEach((el) => el.addEventListener("change", calc));
    app.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); const inp = app.querySelector(`[data-qty="${b.dataset.for}"]`); const o = d.options.find((x) => x.id === b.dataset.for).qty; inp.value = Math.min(o.max, Math.max(o.min, (+inp.value || o.default) + (+b.dataset.step) * o.step)); app.querySelector(`input[name="opt"][value="${b.dataset.for}"]`).checked = true; calc(); }));
    app.querySelectorAll("[data-qty]").forEach((inp) => inp.addEventListener("input", () => { app.querySelector(`input[name="opt"][value="${inp.dataset.qty}"]`).checked = true; calc(); }));
    app.querySelectorAll("[data-pick]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const r = app.querySelector(`input[name="pkg"][value="${btn.dataset.pick}"]`);
        if (r) { r.checked = true; calc(); }
      })
    );
    calc();
  }

  /* ---------- CONTACT ---------- */
  async function renderContact(site) {
    app.innerHTML = `
      ${pageHero({ image: "assets/images/ph-contact.jpg", title: "CONTACT", sub: "편하게 문의해 주세요" })}
      <section class="section">
        <div class="container contact-grid">
          <div class="reveal">
            <p class="eyebrow">GET IN TOUCH</p>
            <h2 class="h-section">상상하고 계신 하루를\n들려주세요</h2>
            <p class="lead">문의를 남겨주시면 영업일 기준 1~2일 이내에 연락드리겠습니다.</p>
            <ul class="info-list">
                ${site.tel ? `<li><span>TEL</span><a href="tel:${esc(site.tel.replace(/[^0-9+]/g, ""))}">${esc(site.tel)}</a></li>` : ""}
              <li><span>EMAIL</span><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
              <li><span>HOURS</span><span>${esc(site.hours)}</span></li>
              <li><span>ADDRESS</span><span>${esc(site.address)}</span></li>
              ${site.instagram ? `<li><span>SNS</span><a href="${esc(site.instagram)}" target="_blank" rel="noopener">Instagram</a></li>` : ""}
            </ul>
          </div>
          <form class="form reveal" novalidate>
            <div class="field"><label for="f-name">이름 <em>*</em></label><input id="f-name" name="name" required autocomplete="name"></div>
            <div class="field"><label for="f-phone">연락처 <em>*</em></label><input id="f-phone" name="phone" type="tel" required autocomplete="tel"></div>
            <div class="field"><label for="f-email">이메일</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
            <div class="field"><label for="f-type">문의 유형</label>
              <select id="f-type" name="type">
                <option value="wedding">웨딩</option>
                <option value="event">행사 · 기업</option>
                <option value="film">영상 제작</option>
                <option value="etc">기타</option>
              </select>
            </div>
            <div class="field"><label for="f-date">희망 일자</label><input id="f-date" name="date" type="date"></div>
            <div class="field"><label for="f-guests">예상 인원</label><input id="f-guests" name="guests" inputmode="numeric" placeholder="예: 80명"></div>
            <div class="field field--full"><label for="f-msg">문의 내용 <em>*</em></label><textarea id="f-msg" name="message" required></textarea></div>
            <label class="agree"><input type="checkbox" name="agree" required> 개인정보 수집·이용에 동의합니다. (상담 목적, 상담 완료 후 파기)</label>
            <button class="btn btn--solid" type="submit">문의 보내기</button>
            <p class="form-msg" role="status"></p>
          </form>
        </div>
      </section>`;

    const form = app.querySelector("form");
    const msg = form.querySelector(".form-msg");

    // 웨딩 견적 페이지에서 넘어온 경우 내용 자동 입력
    const q = new URLSearchParams(location.search);
    if (q.get("type")) form.type.value = q.get("type");
    if (q.get("pkg")) {
      try {
        const w = await getJSON("wedding");
        const pkg = w.packages.find((p) => p.id === q.get("pkg"));
        const opts = (q.get("opt") || "").split(",").filter(Boolean).map((t) => { const [id, n] = t.split(":"); const o = w.options.find((x) => x.id === id); return o && { ...o, name: n ? `${o.name} ${n}${o.qty?.unit || ""}` : o.name }; }).filter(Boolean);
        const total = (pkg?.price || 0) + opts.reduce((a, o) => a + o.price, 0);
        form.message.value =
          `[선택한 견적]\n- 패키지: ${pkg ? pkg.title : "-"}\n` +
          (opts.length ? `- 옵션: ${opts.map((o) => o.name).join(", ")}\n` : "") +
           `\n추가 요청사항:\n`;
      } catch (e) { /* ignore */ }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.name.value.trim() || !form.phone.value.trim() || !form.message.value.trim()) {
        msg.textContent = "필수 항목(*)을 입력해 주세요.";
        return;
      }
      if (!form.agree.checked) {
        msg.textContent = "개인정보 수집·이용에 동의해 주세요.";
        return;
      }
      const data = Object.fromEntries(new FormData(form));
      delete data.agree;

      // 1) site.json 에 contactFormEndpoint(예: Formspree 주소)가 있으면 그곳으로 전송
      if (site.contactFormEndpoint) {
        msg.textContent = "전송 중입니다…";
        try {
          const r = await fetch(site.contactFormEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(data),
          });
          if (!r.ok) throw new Error(r.status);
          form.reset();
          msg.textContent = "문의가 접수되었습니다. 빠르게 연락드리겠습니다.";
        } catch (err) {
          msg.textContent = `전송에 실패했습니다. ${site.tel} 또는 ${site.email} 로 연락 부탁드립니다.`;
        }
        return;
      }

      // 2) 없으면 메일 앱으로 연결 (임시)
      const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
      location.href = `mailto:${site.email}?subject=${encodeURIComponent(`[홈페이지 문의] ${data.name}`)}&body=${encodeURIComponent(body)}`;
      msg.textContent = "메일 앱이 열리면 전송 버튼을 눌러주세요.";
    });
  }

  /* ---------- 404 ---------- */
  function renderNotFound() {
    app.innerHTML = `
      <section class="notfound">
        <div>
          <p class="eyebrow">PAGE NOT FOUND</p>
          <h1 class="h-display">404</h1>
          <p class="lead">요청하신 페이지를 찾을 수 없습니다.</p><br>
          <a class="btn" href="index.html">HOME</a>
        </div>
      </section>`;
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("is-visible"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- boot ---------- */
  const pageData = { home: "home", brand: "brand", wedding: "wedding" };
  Promise.all([getJSON("site"), pageData[page] ? getJSON(pageData[page]) : Promise.resolve(null)])
    .then(async ([site, data]) => {
      renderHeader(site);
      renderFooter(site);
      if (page === "home") renderHome(site, data);
      else if (page === "brand") renderBrand(site, data);
      else if (page === "wedding") renderWedding(site, data);
      else if (page === "contact") await renderContact(site);
      else renderNotFound();
      initReveal();
    })
    .catch((err) => {
      console.error(err);
      app.innerHTML = `<section class="notfound"><div><p class="eyebrow">LOADING ERROR</p><p class="lead">데이터를 불러오지 못했습니다.<br>파일을 직접 열었다면 README의 "로컬에서 미리보기" 방법으로 실행해 주세요.</p></div></section>`;
    });
})();
