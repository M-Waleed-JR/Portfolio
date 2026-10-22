let raf = 0;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function readScrollY() {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

export function smoothScrollToId(id, offset = 80) {
  if (typeof document === "undefined") return;
  document.body.style.overflow = "";

  const el = document.getElementById(id);
  if (!el) return;

  cancelAnimationFrame(raf);

  const start = readScrollY();
  const target = Math.max(0, el.getBoundingClientRect().top + start - offset);
  const distance = target - start;
  if (Math.abs(distance) < 2) return;

  const duration = Math.min(1600, Math.max(900, Math.abs(distance) * 0.65));
  const origin = performance.now();
  const scroller = document.scrollingElement || document.documentElement;

  const tick = (now) => {
    const t = Math.min(1, (now - origin) / duration);
    scroller.scrollTop = start + distance * easeInOutCubic(t);
    if (t < 1) raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
}
