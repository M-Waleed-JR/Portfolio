"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#030303] text-white">
      {/* ================= BACKGROUND ================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-[20%]
          h-[450px]
          w-[450px]
          rounded-full
          bg-orange-600/20
          blur-[150px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-[20%]
          h-[450px]
          w-[450px]
          rounded-full
          bg-cyan-500/20
          blur-[150px]
        "
      />

      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      {/* ================= NAVBAR ================= */}

      <header
        className="
          absolute
          left-0
          right-0
          top-0
          z-50
          flex
          items-center
          justify-between
          px-6
          py-6
          sm:px-8
          md:px-12
          lg:px-16
          lg:py-8
        "
      >
        <div className="text-base font-semibold sm:text-lg">Portfolio</div>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-8 text-sm lg:flex">
          <a href="#" className="relative text-white">
            Home
            <span className="absolute -bottom-2 left-0 h-px w-full bg-white" />
          </a>

          <a
            href="#about"
            className="text-white/45 transition hover:text-white"
          >
            About
          </a>

          <a
            href="#projects"
            className="text-white/45 transition hover:text-white"
          >
            Projects
          </a>

          <a
            href="#skills"
            className="text-white/45 transition hover:text-white"
          >
            Skills
          </a>

          <a
            href="#contact"
            className="text-white/45 transition hover:text-white"
          >
            Contact
          </a>
        </nav>

        {/* Mobile Menu */}

        <button
          type="button"
          className="
            flex
            items-center
            gap-2
            text-xs
            text-white/70
            lg:hidden
          "
        >
          <span>Menu</span>

          <span className="flex flex-col gap-1">
            <span className="h-px w-5 bg-white/70" />
            <span className="h-px w-5 bg-white/70" />
          </span>
        </button>
      </header>

      {/* ================= HERO ================= */}

      <div className="relative min-h-[100svh] w-full">
        {/* ================= PORTFOLIO ================= */}

        <div
          className="
    portfolio-title
    absolute
    left-0
    right-0
    bottom-[12%]
    z-10

    overflow-hidden
    whitespace-nowrap

    text-center
    text-[18.5vw]
    font-bold
    uppercase
    leading-none
    tracking-[-0.02em]

    text-white/[0.105]

    sm:bottom-[8%]
    sm:text-[19vw]

    md:bottom-[10%]
    md:text-[16vw]
  "
        >
          Portfolio
        </div>

        {/* ================= PERSON ================= */}

        <div
          className="
            profile-image
            absolute
            bottom-0
            left-1/2
            -translate-x-1/2
            z-20

            w-[130vw]
            max-w-none

            sm:w-[105vw]

            md:w-[62vw]
            md:max-w-[950px]
          "
        >
          <Image
            src="/images/profile.png"
            alt="MO - Frontend Developer"
            width={1200}
            height={1200}
            priority
            className="block h-auto w-full"
          />
        </div>

        {/* ================= FRONTEND DEVELOPER ================= */}

        {/* ================= FRONTEND DEVELOPER ================= */}

        <div
          className="
    developer-text
    absolute
    bottom-3
    left-4
    z-30

    flex
    flex-col
    gap-0.5

    sm:bottom-6
    sm:left-6

    md:bottom-10
    md:left-10

    lg:left-16
  "
        >
          <span
            className="
      text-[8px]
      font-medium
      uppercase
      tracking-[0.2em]
      text-white/60

      sm:text-[10px]
      sm:tracking-[0.25em]
    "
          >
            Creative Developer
          </span>

          <span
            className="
      whitespace-nowrap
      text-xs
      font-semibold
      tracking-tight
      text-white

      sm:text-base
      md:text-lg
    "
          >
            Frontend Developer
          </span>
        </div>
      </div>
    </section>
  );
}
