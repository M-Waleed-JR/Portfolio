"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import styles from "./About.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const STATEMENT = ` Hi iam Mohamed Waleed Jr Front-end developer , I build responsive interfaces with React and Next.js, and I care how every screen feels, from phone to desktop.`;
const WORDS = STATEMENT.split(" ");

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
    tech: "Next.js, TypeScript,React.js, Tailwind CSS, Swiper, Lucide React",
    href: "https://nova-jet-two.vercel.app/",
  },
  {
    name: "Gusto",
    tech: "Next.js, React 19, TypeScript, Tailwind CSS, Three.js, React Three Fiber",
    href: "https://food-app-ruddy-omega.vercel.app/",
  },
  {
    name: "Weather app",
    tech: "React.js, Vite, Axios, REST API, Tailwind CSS",
    href: "https://weather-app-opal-nine-repyfja5gb.vercel.app/",
  },
  {
    name: "To-do list",
    tech: "React 19, Vite, Material UI (MUI), Tailwind CSS, Local Storage, Arabic RTL",
    href: "https://todo-list-eight-liart.vercel.app/",
  },
];

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_QUERY).matches;
}

function handleCard(e) {
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
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}

function SkillsRow({ group, index }) {
  const isEven = index % 2 === 0;
  const dir = isEven ? 1 : -1;

  const trackRef = useRef(null);
  const setRef = useRef(null);
  const [width, setWidth] = useState(0);

  const offsetRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);

  const items =
    group.items.length < 5 ? [...group.items, ...group.items] : group.items;

  useEffect(() => {
    const el = setRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.offsetWidth;
      if (w > 0) setWidth(w);
    };
    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!width || width <= 0) return;

    let rafId = 0;
    let lastTime = performance.now();
    // 50 seconds to complete 1 set loop (slow & uniform)
    const speed = width / 50;

    const updatePosition = () => {
      if (trackRef.current && width > 0) {
        const mod = ((offsetRef.current % width) + width) % width;
        const pos = -2 * width + mod;
        trackRef.current.style.transform = `translate3d(${pos}px,0,0)`;
      }
    };

    const frame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isDraggingRef.current && !isHoveredRef.current) {
        offsetRef.current += dir * speed * dt;
        updatePosition();
      }

      rafId = requestAnimationFrame(frame);
    };

    updatePosition();
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [width, dir]);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    offsetRef.current += dx;

    if (trackRef.current && width > 0) {
      const mod = ((offsetRef.current % width) + width) % width;
      const pos = -2 * width + mod;
      trackRef.current.style.transform = `translate3d(${pos}px,0,0)`;
    }
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerEnter = () => {
    isHoveredRef.current = true;
  };

  const handlePointerLeave = () => {
    isHoveredRef.current = false;
    isDraggingRef.current = false;
  };

  return (
    <div className={styles.rowBlock}>
      <h4 className={styles.rowLabel}>{group.name}</h4>
      <div
        className={styles.viewport}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className={styles.track} ref={trackRef}>
          {[0, 1, 2, 3].map((copyIndex) => (
            <ul
              key={copyIndex}
              className={styles.set}
              ref={copyIndex === 0 ? setRef : undefined}
              aria-hidden={copyIndex > 0 ? "true" : undefined}
            >
              {items.map((item, j) => (
                <li
                  key={`${item}-${copyIndex}-${j}`}
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

export default function About() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const ghostRef = useRef(null);
  const nameRef = useRef(null);
  const wordRefs = useRef([]);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;

    let raf = 0;
    const updateStatement = () => {
      const rect = stage.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 1;
      // each word lights up from base (0.55) to fully lit (1.0)
      const q = clamp(p / 0.85, 0, 1) * WORDS.length;
      wordRefs.current.forEach((el, i) => {
        if (el) el.style.setProperty("--l", clamp(q - i, 0, 1).toFixed(3));
      });
      if (nameRef.current) {
        nameRef.current.style.setProperty(
          "--n",
          clamp((p - 0.86) / 0.12, 0, 1).toFixed(3),
        );
      }
      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate3d(${-16 * p}vw,0,0)`;
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        updateStatement();
        raf = 0;
      });
    };

    updateStatement();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateStatement);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateStatement);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-title"
      className={`${styles.section} ${bricolage.className} ${reduced ? styles.reduced : ""}`}
    >
      {/* 1. Pinned statement */}
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.sticky}>
          <span ref={ghostRef} className={styles.ghost} aria-hidden="true">
            About
          </span>
          <div className={styles.statementWrap}>
            <h2 id="about-title" className={styles.statement}>
              <span className={styles.srOnly}>{STATEMENT}</span>
              {WORDS.map((word, i) => (
                <span
                  key={i}
                  className={styles.word}
                  aria-hidden="true"
                  ref={(el) => {
                    wordRefs.current[i] = el;
                  }}
                >
                  {word}
                </span>
              ))}
            </h2>
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
                <li key={p.name}>
                  <a href={p.href} target="_blank" rel="noopener noreferrer">
                    <span className={styles.pName}>{p.name}</span>
                    <span className={styles.pTech}>{p.tech}</span>
                  </a>
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

      {/* 4. Links */}
      <div className={styles.container}>
        <div className={styles.links}>
          <a href="#projects">See the projects</a>
          <a href="#contact">Contact me</a>
        </div>
      </div>
    </section>
  );
}
