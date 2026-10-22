"use client";

import { useEffect, useState } from "react";

const LINKS = ["Home", "About", "Projects", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Highlight the section currently in the middle of the screen
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
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

  // No highlight while the page is at the very top
  const isActive = (id) => scrolled && active === id;

  const linkClass = (id) =>
    `border-b-2 pb-1 transition-colors ${
      isActive(id)
        ? "border-[var(--color-ember)] text-[var(--color-ember)]"
        : "border-transparent text-white/70 hover:text-white"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#030303]/80 py-4 backdrop-blur-md" : "py-6 lg:py-8"
      }`}
    >
      <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 md:px-12 lg:px-20">
        <a
          href="#home"
          className="text-xl font-bold text-white transition-colors hover:text-[var(--color-ember)]"
        >
          Portfolio
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
          {LINKS.map((name) => (
            <a
              key={name}
              href={`#${name.toLowerCase()}`}
              className={linkClass(name.toLowerCase())}
            >
              {name}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="text-lg font-medium text-white/80 hover:text-[var(--color-ember)] lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="mx-6 mt-4 flex flex-col gap-5 rounded-lg bg-[#0a0a0a]/95 p-6 text-base font-medium backdrop-blur-xl lg:hidden">
          {LINKS.map((name) => (
            <a
              key={name}
              href={`#${name.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className={
                isActive(name.toLowerCase())
                  ? "text-[var(--color-ember)]"
                  : "text-white/70"
              }
            >
              {name}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
