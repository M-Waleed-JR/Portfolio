"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { smoothScrollToId } from "@/lib/smoothScroll";
import styles from "./Navbar.module.css";

const LINKS = ["Home", "About", "Projects", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const backdropRef = useRef(null);
  const tlRef = useRef(null);
  const firstRender = useRef(true);

  /* ---------- scroll + active section ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -40% 0px" },
    );

    LINKS.forEach((name) => {
      const el = document.getElementById(name.toLowerCase());
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const goToSection = useCallback((id) => {
    setOpen(false);
    setActive(id);
    document.body.style.overflow = "";
    const offset = headerRef.current?.offsetHeight ?? 80;
    requestAnimationFrame(() => {
      smoothScrollToId(id, offset);
    });
  }, []);

  /* ---------- Esc to close + close when switching to desktop ---------- */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ---------- lock page scroll while the menu is open ---------- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ---------- open / close animation ---------- */
  useEffect(() => {
    const menu = menuRef.current;
    const backdrop = backdropRef.current;
    const header = headerRef.current;
    if (!menu || !backdrop || !header) return;

    if (firstRender.current) {
      firstRender.current = false;
      gsap.set([menu, backdrop], { autoAlpha: 0 });
      return;
    }

    tlRef.current?.kill();

    const items = menu.querySelectorAll("[data-item]");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const d = (t) => (reduce ? 0.01 : t);

    if (open) {
      menu.style.top = `${header.getBoundingClientRect().bottom + 8}px`;

      tlRef.current = gsap
        .timeline()
        .fromTo(
          backdrop,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: d(0.3), ease: "power2.out" },
        )
        .fromTo(
          menu,
          { autoAlpha: 0, y: -12, scale: 0.96, transformOrigin: "100% 0%" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: d(0.45),
            ease: "power3.out",
          },
          0,
        )
        .fromTo(
          items,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: d(0.4),
            stagger: 0.05,
            ease: "power3.out",
          },
          0.12,
        );
    } else {
      tlRef.current = gsap
        .timeline()
        .to(menu, {
          autoAlpha: 0,
          y: -8,
          scale: 0.97,
          duration: d(0.25),
          ease: "power2.in",
        })
        .to(
          backdrop,
          { autoAlpha: 0, duration: d(0.25), ease: "power2.in" },
          0,
        );
    }

    return () => tlRef.current?.kill();
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.container}>
          <button
            type="button"
            className={styles.logo}
            onClick={() => goToSection("home")}
          >
            Portfolio
          </button>

          <nav className={styles.desktopNav} aria-label="Main">
            {LINKS.map((name) => {
              const id = name.toLowerCase();
              return (
                <button
                  type="button"
                  key={name}
                  className={`${styles.navLink} ${active === id ? styles.active : ""}`}
                  onClick={() => goToSection(id)}
                >
                  {name}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`${styles.menuToggle} ${open ? styles.open : ""}`}
          >
            <span className={styles.hamburger}>
              <span className={`${styles.line} ${styles.line1}`} />
              <span className={`${styles.line} ${styles.line2}`} />
              <span className={`${styles.line} ${styles.line3}`} />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={backdropRef}
        className={styles.backdrop}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <nav
        id="mobile-menu"
        ref={menuRef}
        className={styles.mobileMenu}
        aria-label="Mobile"
        aria-hidden={!open}
        inert={!open}
      >
        {LINKS.map((name) => {
          const id = name.toLowerCase();
          const isActive = active === id;
          return (
            <button
              type="button"
              key={name}
              data-item
              onClick={() => goToSection(id)}
              aria-current={isActive ? "page" : undefined}
              className={`${styles.mobileNavLink} ${isActive ? styles.mobileActive : ""}`}
            >
              {name}
              <span className={styles.dot} aria-hidden="true" />
            </button>
          );
        })}
      </nav>
    </>
  );
}
