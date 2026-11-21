(function () {
  const slides = Array.from(document.querySelectorAll(".slide[data-slide]"));
  if (!slides.length) return;
  const pageLabel = document.getElementById("page-label");
  const dots = document.getElementById("dots");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  let index = 0;
  let touchX = null;

  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "第 " + (i + 1) + " 頁");
    b.addEventListener("click", () => go(i));
    dots.appendChild(b);
  });

  function parseHash() {
    const h = (location.hash || "").replace("#", "");
    if (h === "sources") {
      const el = document.querySelector('.slide[data-slide="sources"]');
      return el ? slides.indexOf(el) : 0;
    }
    const n = parseInt(h, 10);
    if (n >= 1 && n <= slides.length) return n - 1;
    return 0;
  }

  function go(i, push) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, k) => s.classList.toggle("active", k === index));
    dots.querySelectorAll("button").forEach((b, k) => b.classList.toggle("current", k === index));
    const id = slides[index].getAttribute("data-slide");
    const label = id === "sources" ? "資料來源" : index + 1 + " / 14";
    if (pageLabel) pageLabel.textContent = label;
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
    if (push !== false) {
      const hash = id === "sources" ? "sources" : String(index + 1);
      history.replaceState(null, "", "#" + hash);
    }
    window.dispatchEvent(new CustomEvent("slidechange", { detail: { index, id } }));
    slides[index].scrollTop = 0;
  }

  prevBtn && prevBtn.addEventListener("click", () => go(index - 1));
  nextBtn && nextBtn.addEventListener("click", () => go(index + 1));

  document.addEventListener("keydown", (e) => {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(slides.length - 1);
    }
  });

  const area = document.querySelector(".slides");
  area.addEventListener("touchstart", (e) => {
    if (e.changedTouches[0]) touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  area.addEventListener("touchend", (e) => {
    if (touchX == null || !e.changedTouches[0]) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) < 50) return;
    go(dx < 0 ? index + 1 : index - 1);
  }, { passive: true });

  window.addEventListener("hashchange", () => go(parseHash(), false));
  go(parseHash(), false);
})();
