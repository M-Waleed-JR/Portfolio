"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "@/components/icons";

/* -------------------------------------------------------------------------- */
/*  Content (Truthful, verified from portfolio repositories & aboutMe.md)      */
/* -------------------------------------------------------------------------- */

const STATEMENT = ["I", "build", "interfaces", "that", "feel", "alive."];

const GITHUB = "https://github.com/M-Waleed-JR";

const CURRENT_FACTS = [
  {
    label: "Core Stack",
    value: "React 19 & Next.js",
    tags: ["React 19", "Next.js", "Tailwind CSS"],
  },
  {
    label: "Current Focus",
    value: "Production-ready web applications",
    tags: ["Interactive UI", "State", "Responsive"],
  },
  {
    label: "Deepening",
    value: "TypeScript & App Router Architecture",
    tags: ["TypeScript", "REST APIs"],
  },
];

const STATS = [
  {
    value: 4,
    suffix: "+",
    label: "Projects Built",
    description: "Nova, Gusto, Weather & To-do",
    animate: true,
  },
  {
    value: 4,
    suffix: "/4",
    label: "Live on Vercel",
    description: "Tested, responsive & deployed",
    animate: true,
  },
  {
    value: 2025,
    suffix: "",
    label: "Graduated",
    description: "Computers & AI, Zagazig Univ",
    animate: false,
  },
];

const TIMELINE = [
  {
    year: "2021 — 2025",
    title: "B.Sc. Computer Science",
    institution: "Zagazig University",
    description:
      "Graduated from Faculty of Computers and Information with solid foundations in algorithms, data structures, and web technologies.",
    tag: "Education",
  },
  {
    year: "2025",
    title: "First React & API Apps",
    institution: "Weather & To-Do Apps",
    description:
      "Built interactive projects featuring REST API consumption, local storage persistence, filtering, and responsive Arabic RTL layout.",
    tag: "Foundations",
  },
  {
    year: "2026",
    title: "Full-Scale Applications",
    institution: "Nova & Gusto Platforms",
    description:
      "Architected Nova (e-commerce storefront with quick-view modal) and Gusto (restaurant landing platform built with Next.js).",
    tag: "Production",
  },
  {
    year: "Present",
    title: "Junior Front-End Role",
    institution: "Open for Opportunities",
    description:
      "Actively seeking my first junior front-end position to build elegant, high-performance web products with an engineering team.",
    tag: "Available",
    current: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                      */
/* -------------------------------------------------------------------------- */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

/* Counts up once when the number scrolls into view. */
function Counter({ value, suffix = "", animate, reduced }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate || reduced) return;

    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1200;
        const start = performance.now();

        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setCount(Math.round(eased * value));
          if (t < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, animate, reduced]);

  return (
    <span ref={ref}>
      {!animate || reduced ? value : count}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function About() {
  const sectionRef = useRef(null);
  const statementRef = useRef(null);
  const spotRef = useRef(null);

  const reduced = usePrefersReducedMotion();
  const [activeWords, setActiveWords] = useState(0);

  /* Reveal blocks once, with staggered animation */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = Array.from(section.querySelectorAll("[data-reveal]"));

    if (reduced) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [reduced]);

  /* Light the statement word by word while it moves up the viewport */
  useEffect(() => {
    const statement = statementRef.current;
    if (!statement || reduced) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const rect = statement.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const start = viewport * 0.92;
      const end = viewport * 0.38;
      const progress = Math.min(
        1,
        Math.max(0, (start - rect.top) / (start - end)),
      );
      const next = Math.round(progress * STATEMENT.length);

      setActiveWords((current) => (current === next ? current : next));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  /* Soft ember light that follows the cursor on desktop pointer devices */
  useEffect(() => {
    const section = sectionRef.current;
    const spot = spotRef.current;
    if (!section || !spot) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      spot.style.setProperty("--spot-x", `${x}px`);
      spot.style.setProperty("--spot-y", `${y}px`);
    };

    const handleMove = (event) => {
      if (!finePointer.matches) return;

      const rect = section.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;

      if (!frame) frame = requestAnimationFrame(paint);
    };

    const handleEnter = () => {
      if (finePointer.matches) section.classList.add("has-spotlight");
    };

    const handleLeave = () => section.classList.remove("has-spotlight");

    section.addEventListener("pointermove", handleMove);
    section.addEventListener("pointerenter", handleEnter);
    section.addEventListener("pointerleave", handleLeave);

    return () => {
      section.removeEventListener("pointermove", handleMove);
      section.removeEventListener("pointerenter", handleEnter);
      section.removeEventListener("pointerleave", handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`ab-section${reduced ? " is-reduced" : ""}`}
      aria-labelledby="about-title"
    >
      <div ref={spotRef} className="ab-spotlight" aria-hidden="true" />

      <div className="ab-shell">
        {/* Topline Bar */}
        <header className="ab-topline">
          <div className="ab-eyebrow">
            <span className="ab-dot" aria-hidden="true" />
            <span>01 — About</span>
          </div>
          <div className="ab-location-badge">
            <span className="ab-location-dot" aria-hidden="true" />
            <span>Egypt • Available Worldwide</span>
          </div>
        </header>

        {/* Hero editorial grid: Statement + Bento Profile Card */}
        <div className="ab-main">
          {/* Left Column: Big Statement + Narrative + CTAs */}
          <div className="ab-narrative" data-reveal style={{ "--ab-delay": "50ms" }}>
            <h2 id="about-title" className="ab-statement" ref={statementRef}>
              {STATEMENT.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className={[
                    "ab-word",
                    index < activeWords ? "is-lit" : "",
                    word === "alive." ? "ab-word--accent" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {word}
                  {index < STATEMENT.length - 1 ? " " : ""}
                </span>
              ))}
            </h2>

            <p className="ab-bio">
              Early-career front-end developer from Egypt, building modern web applications
              with React and Next.js. Fresh computer science graduate focused on crafting fluid,
              accessible user interfaces and ready for my first junior role.
            </p>

            <div className="ab-actions">
              <a className="ab-btn ab-btn--solid" href="#projects">
                View projects
                <ArrowDown />
              </a>

              <a
                className="ab-btn ab-btn--ghost"
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Profile
                <ArrowUpRight />
              </a>
            </div>
          </div>

          {/* Right Column: Glassmorphic Bento Profile Card */}
          <aside
            className="ab-card"
            data-reveal
            style={{ "--ab-delay": "140ms" }}
          >
            {/* Ambient Card Glow */}
            <div className="ab-card-glow" aria-hidden="true" />

            {/* Profile Header */}
            <div className="ab-profile">
              <span className="ab-avatar">
                <Image
                  src="/images/profile.png"
                  alt="Portrait of Mohamed Waleed"
                  fill
                  sizes="62px"
                  className="ab-avatar-img"
                />
              </span>

              <div className="ab-profile-info">
                <div className="ab-profile-name-row">
                  <span className="ab-card-name">M.Waleed</span>
                  <span className="ab-verified-badge" title="Verified developer">
                    Junior Dev
                  </span>
                </div>
                <span className="ab-card-role">Front-End Developer</span>
              </div>
            </div>

            {/* Live Availability Status */}
            <div className="ab-status-card">
              <div className="ab-status-dot-wrap" aria-hidden="true">
                <span className="ab-status-ping" />
                <span className="ab-status-dot" />
              </div>
              <div className="ab-status-content">
                <span className="ab-status-label">Current Status</span>
                <span className="ab-status-title">Open to Junior Roles</span>
              </div>
            </div>

            {/* Bento Fact Rows with Tech Badges */}
            <div className="ab-facts">
              {CURRENT_FACTS.map((fact) => (
                <div key={fact.label} className="ab-fact-item">
                  <div className="ab-fact-header">
                    <span className="ab-fact-label">{fact.label}</span>
                    <span className="ab-fact-value">{fact.value}</span>
                  </div>
                  <div className="ab-fact-tags">
                    {fact.tags.map((tag) => (
                      <span key={tag} className="ab-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Interactive Career Journey Timeline */}
        <div className="ab-timeline-section" data-reveal style={{ "--ab-delay": "80ms" }}>
          <div className="ab-timeline-header">
            <div>
              <span className="ab-section-subtitle">Roadmap & Milestones</span>
              <h3 className="ab-timeline-title">The Journey So Far</h3>
            </div>
            <p className="ab-timeline-caption">
              From university foundations to shipping real production applications.
            </p>
          </div>

          <ol className="ab-timeline-grid">
            {TIMELINE.map((step, idx) => (
              <li
                key={step.title}
                className={`ab-timeline-card${step.current ? " is-current" : ""}`}
              >
                <div className="ab-timeline-top">
                  <span className="ab-timeline-badge">{step.tag}</span>
                  <span className="ab-timeline-year">{step.year}</span>
                </div>

                <div className="ab-timeline-node" aria-hidden="true">
                  <span className="ab-timeline-dot" />
                  {idx < TIMELINE.length - 1 && <span className="ab-timeline-line" />}
                </div>

                <h4 className="ab-timeline-heading">{step.title}</h4>
                <p className="ab-timeline-institution">{step.institution}</p>
                <p className="ab-timeline-desc">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Enhanced Stats Bento Grid */}
        <dl className="ab-stats" data-reveal style={{ "--ab-delay": "100ms" }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="ab-stat-card">
              <div className="ab-stat-card-glow" aria-hidden="true" />
              <dt className="ab-stat-label">{stat.label}</dt>
              <dd className="ab-stat-num">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  animate={stat.animate}
                  reduced={reduced}
                />
              </dd>
              <p className="ab-stat-desc">{stat.description}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
