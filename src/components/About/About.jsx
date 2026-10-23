"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Download, MessageCircle } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { smoothScrollToId } from "@/lib/smoothScroll";
import styles from "./About.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const STATEMENT =
  "Hi, I am Mohamed Waleed — Jr Front-end developer. I build responsive interfaces with React and Next.js, and I care how every screen feels, from phone to desktop.";

const KEYWORDS = new Set(["Front-end", "React", "Next.js"]);

const WORDS = STATEMENT.split(" ").map((text) => ({
  text,
  key: KEYWORDS.has(text.replace(/[.,]$/, "")),
}));

const CV_URL = "/Mohamed_Waleed%20Alsayed_Front-End%20Developer%20_resume.pdf";

const GROUPS = [
  {
    name: "Core front-end",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript ES6+",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Responsive Design",
    ],
  },
  {
    name: "State and data",
    items: [
      "Redux Toolkit",
      "Context API",
      "Fetch API",
      "Axios",
      "REST APIs",
      "Local Storage",
    ],
  },
  {
    name: "3D and interactive",
    items: ["Three.js", "React Three Fiber", "@react-three/drei"],
  },
  {
    name: "UI libraries",
    items: [
      "Material UI",
      "Swiper",
      "Lucide React",
      "SweetAlert2",
      "React Hot Toast",
    ],
  },
  {
    name: "Tools",
    items: ["Git", "GitHub", "Vite", "npm", "Vercel", "GitHub Pages"],
  },
];

const PROJECTS = [
  {
    name: "Nova",
    tech: "Next.js, TypeScript, React.js, Tailwind CSS, Swiper, Lucide React",
  },
  {
    name: "Gusto",
    tech: "Next.js, React 19, TypeScript, Tailwind CSS, Three.js, React Three Fiber",
  },
  {
    name: "Weather app",
    tech: "React.js, Vite, Axios, REST API, Tailwind CSS",
  },
  {
    name: "To-do list",
    tech: "React 19, Vite, Material UI (MUI), Tailwind CSS, Local Storage, Arabic RTL",
  },
];

/* ---------- Card tilt ---------- */

function handleCard(e) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
  el.style.setProperty("--rx", `${(y / r.height - 0.5) * -5}deg`);
  el.style.setProperty("--ry", `${(x / r.width - 0.5) * 7}deg`);
}

function resetCard(e) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}

/* ---------- Skills marquee ---------- */

function SkillsRow({ group, index }) {
  const dir = index % 2 === 0 ? 1 : -1;

  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const setRef = useRef(null);
  const [width, setWidth] = useState(0);
  const visibleRef = useRef(false);

  const offsetRef = useRef(0);
  const hoveredRef = useRef(false);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);

  const items =
    group.items.length < 5 ? [...group.items, ...group.items] : group.items;

  // Measure one copy of the list
  useEffect(() => {
    const el = setRef.current;
    if (!el) return;

    const measure = () => {
      if (el.offsetWidth > 0) setWidth(el.offsetWidth);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);

    return () => ro.disconnect();
  }, []);

  // Only animate while the row is on screen
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const render = (w) => {
    if (!trackRef.current || w <= 0) return;
    const mod = ((offsetRef.current % w) + w) % w;
    trackRef.current.style.transform = `translate3d(${mod - w}px,0,0)`;
  };

  // Auto-scroll loop
  useEffect(() => {
    if (width <= 0) return;

    const speed = width / 50;
    let last = performance.now();
    let rafId = 0;

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (visibleRef.current && !draggingRef.current && !hoveredRef.current) {
        offsetRef.current += dir * speed * dt;
        render(width);
      }
      rafId = requestAnimationFrame(frame);
    };

    render(width);
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [width, dir]);

  const onDown = (e) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e) => {
    if (!draggingRef.current) return;
    offsetRef.current += e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    render(width);
  };

  const onUp = (e) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div className={styles.rowBlock}>
      <h4 className={styles.rowLabel}>{group.name}</h4>
      <div
        ref={viewportRef}
        className={styles.viewport}
        onPointerEnter={() => (hoveredRef.current = true)}
        onPointerLeave={() => {
          hoveredRef.current = false;
          draggingRef.current = false;
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className={styles.track} ref={trackRef}>
          {[0, 1, 2].map((copy) => (
            <ul
              key={copy}
              className={styles.set}
              ref={copy === 0 ? setRef : undefined}
              aria-hidden={copy > 0 ? "true" : undefined}
            >
              {items.map((item, j) => (
                <li
                  key={`${item}-${j}`}
                  className={`${styles.item} ${j % 2 === 1 ? styles.outline : ""}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Section ---------- */

export default function About() {
  const statementRef = useRef(null);
  const [shown, setShown] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Play the intro once, when the statement scrolls into view
  useEffect(() => {
    const el = statementRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleDownload = () => {
    if (downloaded) return;
    const link = document.createElement("a");
    link.href = CV_URL;
    link.download = "Mohamed_Waleed_CV.pdf";
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className={`${styles.section} ${bricolage.className} ${shown ? styles.shown : ""}`}
    >
      {/* 1. Statement */}
      <div className={styles.hero}>
        <span className={styles.ghost} aria-hidden="true">
          About
        </span>

        <div
          ref={statementRef}
          className={styles.statementWrap}
          style={{ "--count": WORDS.length }}
        >
          <h2 id="about-title" className={styles.statement}>
            <span className={styles.srOnly}>{STATEMENT}</span>
            {WORDS.map((w, i) => (
              <span key={i} className={styles.word} aria-hidden="true">
                <span
                  className={`${styles.wordInner} ${w.key ? styles.key : ""}`}
                  style={{ "--i": i }}
                >
                  {w.text}
                </span>
              </span>
            ))}
          </h2>

          <span className={styles.rule} aria-hidden="true" />

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleDownload}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              {downloaded ? (
                <CheckCircle className={styles.btnIcon} aria-hidden="true" />
              ) : (
                <Download className={styles.btnIcon} aria-hidden="true" />
              )}
              <span>{downloaded ? "Downloaded" : "Download My Cv"}</span>
            </button>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId("contact");
              }}
              className={`${styles.btn} ${styles.btnGhost}`}
            >
              <MessageCircle className={styles.btnIcon} aria-hidden="true" />
              <span>Contact Me</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Cards */}
      <div className={styles.container}>
        <div className={styles.cards}>
          <article
            className={`${styles.card} ${styles.cEdu}`}
            onPointerMove={handleCard}
            onPointerLeave={resetCard}
          >
            <h3 className={styles.cardLabel}>Education</h3>
            <p className={styles.cardMain}>
              Faculty of Computers and Information
            </p>
            <p className={styles.cardSub}>Zagazig University, class of 2025</p>
          </article>

          <article
            className={`${styles.card} ${styles.cProjects}`}
            onPointerMove={handleCard}
            onPointerLeave={resetCard}
          >
            <h3 className={styles.cardLabel}>Personal projects</h3>
            <ul className={styles.projects}>
              {PROJECTS.map((p) => (
                <li key={p.name} className={styles.pItem}>
                  <span className={styles.pName}>{p.name}</span>
                  <span className={styles.pTech}>{p.tech}</span>
                </li>
              ))}
            </ul>
          </article>

          <article
            className={`${styles.card} ${styles.cGoal}`}
            onPointerMove={handleCard}
            onPointerLeave={resetCard}
          >
            <h3 className={styles.cardLabel}>Looking for</h3>
            <p className={styles.cardMain}>Junior Front-End Developer roles</p>
            <p className={styles.cardSub}>
              English B2. Interfaces in English LTR and native Arabic RTL.
            </p>
          </article>
        </div>
      </div>

      {/* 3. Skills marquee */}
      <div className={styles.skills}>
        <div className={styles.container}>
          <h3 className={styles.skillsTitle}>Skills</h3>
        </div>
        {GROUPS.map((group, i) => (
          <SkillsRow key={group.name} group={group} index={i} />
        ))}
      </div>
    </section>
  );
}
