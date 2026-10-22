"use client";

import Image from "next/image";

import { Montserrat } from "next/font/google";

const portfolioFont = Montserrat({
  subsets: ["latin"],
  weight: ["800"],
});

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

      {/* ================= HERO ================= */}

      <div className="relative min-h-[100svh] w-full">
        {/* ================= PORTFOLIO ================= */}
        <div
          className={`
    ${portfolioFont.className}
    portfolio-title
    pointer-events-none
    select-none
    absolute
    left-0
    right-0
    bottom-[15%]
    z-10

    overflow-hidden
    whitespace-nowrap

    text-center
    text-[24vw]
    leading-[1.1]
    tracking-[-0.05em]

    sm:bottom-[8%]
    sm:text-[21vw]
    sm:tracking-[-0.03em]

    md:bottom-[6%]
    md:text-[21vw]
  `}
        >
          Portfolio
        </div>

        {/* ================= PROFILE IMAGE ================= */}

        <div
          className="
    profile-image
    absolute
    bottom-[-4%]
    left-1/2
    -translate-x-1/2
    z-20

    w-[210vw]
    max-w-none

    sm:bottom-0
    sm:w-[110vw]

    md:w-[65vw]
    md:max-w-[950px]

    lg:w-[66vw]
    lg:max-w-[1250px]

    xl:w-[68vw]
    xl:max-w-[1400px]
  "
        >
          <Image
            src="/images/profile.png"
            alt="MO - Frontend Developer"
            width={1200}
            height={1200}
            priority
            className="block h-auto w-full object-contain object-bottom"
          />
        </div>
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
