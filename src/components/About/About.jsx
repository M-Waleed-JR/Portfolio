"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { CheckCircle, Download, Loader2, MessageCircle } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { smoothScrollToId } from "@/lib/smoothScroll";
import styles from "./About.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const STATEMENT = `Hi, I am Mohamed Waleed — Jr Front-end developer. I build responsive interfaces with React and Next.js, and I care how every screen feels, from phone to desktop.`;
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
  const stageRef = useRef(null);
  const ghostRef = useRef(null);
  const wordRefs = useRef([]);
  const cvLinkRef = useRef(null);
  const contactLinkRef = useRef(null);
  const linksRef = useRef(null);
  const [downloadStatus, setDownloadStatus] = useState("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
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
      const q = clamp(p / 0.85, 0, 1) * WORDS.length;
      wordRefs.current.forEach((el, i) => {
        if (el) el.style.setProperty("--l", clamp(q - i, 0, 1).toFixed(3));
      });
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

  /* ---------- Links entrance animation ---------- */
  useEffect(() => {
    if (reduced) return;

    const cv = cvLinkRef.current;
    const contact = contactLinkRef.current;
    if (!cv || !contact) return;

    gsap.fromTo(
      [cv, contact],
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.5,
      },
    );
  }, [reduced]);

  const handleDownload = () => {
    if (downloadStatus !== "idle") return;

    setDownloadStatus("downloading");
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((current) => {
        const next = Math.min(current + 5, 100);
        if (next === 100) clearInterval(interval);
        return next;
      });
    }, 50);

    setTimeout(() => {
      const link = document.createElement("a");
      link.href =
        "/Mohamed_Waleed%20Alsayed_Front-End%20Developer%20_resume.pdf";
      link.download = "Mohamed_Waleed_CV.pdf";
      link.click();
      setDownloadStatus("downloaded");
    }, 1050);

    setTimeout(() => {
      setDownloadStatus("idle");
      setDownloadProgress(0);
    }, 2200);
  };

  return (
    <section
      id="about"
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

        {/* 4. Links */}
        <div className={styles.container}>
          <div className={styles.links} ref={linksRef}>
            <button
              ref={cvLinkRef}
              type="button"
              onClick={handleDownload}
              disabled={downloadStatus !== "idle"}
              className={styles.downloadButton}
              aria-label="Download CV"
            >
              {downloadStatus === "idle" && (
                <>
                  <Download
                    className={styles.downloadButtonIcon}
                    aria-hidden="true"
                  />
                  <span>Download My Cv</span>
                </>
              )}
              {downloadStatus === "downloading" && (
                <span className={styles.downloadButtonStatus}>
                  <Loader2
                    className={`${styles.downloadButtonIcon} ${styles.downloadButtonSpinner}`}
                    aria-hidden="true"
                  />
                  {downloadProgress}%
                </span>
              )}
              {downloadStatus === "downloaded" && (
                <>
                  <CheckCircle
                    className={styles.downloadButtonIcon}
                    aria-hidden="true"
                  />
                  <span>Downloaded</span>
                </>
              )}
              {downloadStatus === "downloading" && (
                <span
                  className={styles.downloadButtonProgress}
                  style={{ width: `${downloadProgress}%` }}
                  aria-hidden="true"
                />
              )}
            </button>
            <a
              ref={contactLinkRef}
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                smoothScrollToId("contact");
              }}
              className={`${styles.actionLink} ${styles.contactLink}`}
            >
              <MessageCircle size={18} className={styles.downloadButtonIcon} />
              <span>Contact Me</span>
              <span className={styles.actionArrow} aria-hidden="true">
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
