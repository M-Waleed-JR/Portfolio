"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [
  { id: "home", label: "Home", href: "/#home" },
  { id: "about", label: "About", href: "/#about" },
  { id: "projects", label: "Projects", href: "/#projects" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

// Sections sit under the fixed bar, so stop this many px above them.
// Read from the same CSS value the browser uses for native anchors.
const headerOffset = () => {
  const value = parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop,
  );

  return Number.isFinite(value) ? value : 0;
};

const clampScrollY = (value) => {
  const max = document.documentElement.scrollHeight - window.innerHeight;

  return Math.max(0, Math.min(max, value));
};

// Plain scrollTo() would inherit `scroll-behavior: smooth` from the CSS and
// fight our own frames, so opt out while we move the page ourselves.
const scrollInstantly = (top) => {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  root.style.scrollBehavior = previous;
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// Returns a cancel function so a new click (or the user's own scrolling)
// can stop an animation that is still running.
function animateScrollTo(targetY) {
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) {
    scrollInstantly(targetY);
    return () => {};
  }

  const root = document.documentElement;
  const previous = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";

  const duration = Math.min(1100, Math.max(480, Math.abs(distance) * 0.45));
  const startedAt = performance.now();
  let frame = 0;

  const restore = () => {
    root.style.scrollBehavior = previous;
  };

  const step = (now) => {
    const t = Math.min(1, (now - startedAt) / duration);
    window.scrollTo(0, startY + distance * easeOutCubic(t));

    if (t < 1) {
      frame = window.requestAnimationFrame(step);
    } else {
      frame = 0;
      restore();
    }
  };

  frame = window.requestAnimationFrame(step);

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    restore();
  };
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const stopScrollRef = useRef(() => {});

  const handleNavClick = (event, href) => {
    const hash = href.slice(href.indexOf("#") + 1);
    const target = document.getElementById(hash);

    // Target not on this page -> let the browser navigate normally.
    if (!target) {
      setOpen(false);
      return;
    }

    event.preventDefault();
    setOpen(false);
    stopScrollRef.current();

    const top = clampScrollY(
      window.scrollY + target.getBoundingClientRect().top - headerOffset(),
    );

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    stopScrollRef.current = reduce
      ? (scrollInstantly(top), () => {})
      : animateScrollTo(top);

    window.history.replaceState(null, "", `#${hash}`);
  };

  // Let the user take over at any point.
  useEffect(() => {
    const stop = () => stopScrollRef.current();

    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);

    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      stopScrollRef.current();
    };
  }, []);

  // Glass bar once the page moves + highlight the section currently in view.
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);

      const line = headerOffset() + 8;
      let current = links[0].id;

      links.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      });

      setActive((previous) => (previous === current ? previous : current));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);

      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Close the mobile panel with Escape, or when the desktop nav comes back.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <header className={scrolled ? "site-nav is-scrolled" : "site-nav"}>
        <Link
          className="site-nav-brand"
          href="/#home"
          onClick={(event) => handleNavClick(event, "/#home")}
        >
          Portfolio
        </Link>

        <nav className="site-nav-links" aria-label="Main">
          {links.map(({ id, label, href }) => (
            <Link
              key={id}
              href={href}
              className={
                active === id ? "site-nav-link is-active" : "site-nav-link"
              }
              aria-current={active === id ? "true" : undefined}
              onClick={(event) => handleNavClick(event, href)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="site-nav-menu"
          aria-expanded={open}
          aria-controls="site-nav-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? "Close" : "Menu"}</span>

          <span className="site-nav-burger" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </header>

      {open && (
        <nav
          id="site-nav-panel"
          className="site-nav-panel"
          aria-label="Mobile navigation"
        >
          <ul className="site-nav-panel-list">
            {links.map(({ id, label, href }) => (
              <li key={id}>
                <Link
                  href={href}
                  className={active === id ? "is-active" : undefined}
                  onClick={(event) => handleNavClick(event, href)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
