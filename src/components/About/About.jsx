"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  CheckCircle,
  Download,
  MessageCircle,
  Code2,
  Database,
  Boxes,
  Palette,
  Wrench,
  Search,
  X,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { smoothScrollToId } from "@/lib/smoothScroll";
import SkillLogo, { SKILL_DATA } from "./SkillIcon";
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

const CV_URL = "/Mohamed_Waleed_CV.pdf";

const GROUPS = [
  {
    id: "core",
    index: "01",
    name: "Core Front-end",
    icon: Code2,
    accent: "gold",
    colSpan: "span7",
    tagline: "Architecture, frameworks, and modern web standards",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript ES6+",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap 5",
      "Responsive Design",
    ],
  },
  {
    id: "3d",
    index: "02",
    name: "3D & Interactive",
    icon: Boxes,
    accent: "lagoon",
    colSpan: "span5",
    tagline: "WebGL, canvas scenes, and interactive 3D math",
    items: ["Three.js", "React Three Fiber", "@react-three/drei"],
  },
  {
    id: "state",
    index: "03",
    name: "State and data",
    icon: Database,
    accent: "gold",
    colSpan: "span4",
    tagline: "Global state, APIs, caching, and storage management",
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
    id: "ui",
    index: "04",
    name: "UI libraries",
    icon: Palette,
    accent: "lagoon",
    colSpan: "span4",
    tagline: "Design systems, sliders, touch carousels & feedback",
    items: [
      "Material UI",
      "Swiper",
      "Lucide React",
      "SweetAlert2",
      "React Hot Toast",
    ],
  },
  {
    id: "tools",
    index: "05",
    name: "Tools & workflow",
    icon: Wrench,
    accent: "gold",
    colSpan: "span4",
    tagline: "Version control, build automation, and deployment",
    items: ["Git", "GitHub", "Vite", "npm", "Vercel", "GitHub Pages"],
  },
];

const SKILL_PROJECT_MAP = {
  "Next.js": ["Nova", "Gusto"],
  TypeScript: ["Nova", "Gusto"],
  React: ["Nova", "Gusto", "Weather app", "To-do list"],
  "Tailwind CSS": ["Nova", "Gusto", "Weather app", "To-do list"],
  "Three.js": ["Gusto"],
  "React Three Fiber": ["Gusto"],
  "@react-three/drei": ["Gusto"],
  Axios: ["Weather app"],
  "REST APIs": ["Weather app"],
  "Fetch API": ["Weather app"],
  Vite: ["Weather app", "To-do list"],
  "Material UI": ["To-do list"],
  "Local Storage": ["To-do list", "Nova"],
  Swiper: ["Nova"],
  "Lucide React": ["Nova"],
  HTML5: ["Nova", "Gusto", "Weather app", "To-do list"],
  CSS3: ["Nova", "Gusto", "Weather app", "To-do list"],
  "JavaScript ES6+": ["Nova", "Gusto", "Weather app", "To-do list"],
  "Responsive Design": ["Nova", "Gusto", "Weather app", "To-do list"],
  Git: ["Nova", "Gusto", "Weather app", "To-do list"],
  GitHub: ["Nova", "Gusto", "Weather app", "To-do list"],
  Vercel: ["Nova", "Gusto"],
};

const CATEGORY_TABS = [
  { id: "all", label: "All Stack", count: 29 },
  { id: "core", label: "Core Front-end", count: 9 },
  { id: "3d", label: "3D & Interactive", count: 3 },
  { id: "state", label: "State & Data", count: 6 },
  { id: "ui", label: "UI Libraries", count: 5 },
  { id: "tools", label: "Tools", count: 6 },
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

/* ---------- Skills Bento Card ---------- */

function SkillCard({
  group,
  isSingleCategory,
  searchQuery,
  activeSkill,
  setActiveSkill,
}) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const isLagoon = group.accent === "lagoon";
  const query = searchQuery.trim().toLowerCase();
  const IconComponent = group.icon;

  const currentHovered = hoveredItem || activeSkill;

  return (
    <article
      className={`${styles.skillCard} ${
        isSingleCategory ? styles.span12 : styles[group.colSpan]
      } ${isLagoon ? styles.skillCardLagoon : ""}`}
      onPointerMove={handleCard}
      onPointerLeave={(e) => {
        resetCard(e);
        setHoveredItem(null);
      }}
    >
      <div>
        <div className={styles.cardHeader}>
          <div className={styles.cardMeta}>
            <span
              className={`${styles.cardIconWrap} ${
                isLagoon ? styles.cardIconWrapLagoon : ""
              }`}
              aria-hidden="true"
            >
              <IconComponent className={styles.categoryIcon} />
            </span>
            <span className={styles.cardIndex}>{group.index}</span>
          </div>
          <span className={styles.cardBadge}>
            {group.items.length} {group.items.length === 1 ? "skill" : "skills"}
          </span>
        </div>

        <h4 className={styles.cardTitle}>{group.name}</h4>
        <p className={styles.cardTagline}>{group.tagline}</p>

        <div className={styles.chipList}>
          {group.items.map((item) => {
            const isMatched = query && item.toLowerCase().includes(query);
            const isDimmed = query && !isMatched;
            const isItemActive = currentHovered === item;
            const skillMeta = SKILL_DATA[item];
            const brandColor = skillMeta?.color || "var(--gold)";

            return (
              <span
                key={item}
                className={`${styles.skillChip} ${
                  isLagoon ? styles.skillChipLagoon : ""
                } ${isMatched ? styles.skillChipMatched : ""} ${
                  isDimmed ? styles.skillChipDimmed : ""
                } ${isItemActive ? styles.skillChipActive : ""}`}
                style={{
                  "--chip-accent": brandColor,
                }}
                onMouseEnter={() => {
                  setHoveredItem(item);
                  setActiveSkill(item);
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setActiveSkill(null);
                }}
                tabIndex={0}
                onFocus={() => {
                  setHoveredItem(item);
                  setActiveSkill(item);
                }}
                onBlur={() => {
                  setHoveredItem(null);
                  setActiveSkill(null);
                }}
              >
                <SkillLogo
                  skillName={item}
                  className={styles.skillLogo}
                  size={18}
                />
                <span className={styles.skillName}>{item}</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className={styles.cardFooter}>
        {hoveredItem ? (
          <div className={styles.contextHint}>
            <SkillLogo skillName={hoveredItem} size={16} />
            <span className={styles.contextHighlight}>{hoveredItem}</span>
            {SKILL_PROJECT_MAP[hoveredItem] ? (
              <>
                <span className={styles.contextSep}>— Used in:</span>
                <span className={styles.projectBadgesWrap}>
                  {SKILL_PROJECT_MAP[hoveredItem].map((proj) => (
                    <span key={proj} className={styles.contextProjectBadge}>
                      {proj}
                    </span>
                  ))}
                </span>
              </>
            ) : (
              <span className={styles.contextNote}>— Production ready</span>
            )}
          </div>
        ) : (
          <div className={styles.contextHint}>
            <span className={styles.contextDefault}>
              Hover any skill to see project usage
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------- Section ---------- */

export default function About() {
  const statementRef = useRef(null);
  const [shown, setShown] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSkill, setActiveSkill] = useState(null);

  const filteredGroups = useMemo(() => {
    let list = GROUPS;
    if (selectedCategory !== "all") {
      list = list.filter((g) => g.id === selectedCategory);
    }
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list
      .map((g) => {
        const matchingItems = g.items.filter((item) =>
          item.toLowerCase().includes(q),
        );
        return {
          ...g,
          hasMatch: matchingItems.length > 0,
          matchingCount: matchingItems.length,
        };
      })
      .filter((g) => g.hasMatch);
  }, [selectedCategory, searchQuery]);

  const totalMatches = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.toLowerCase().trim();
    let count = 0;
    GROUPS.forEach((g) => {
      g.items.forEach((item) => {
        if (item.toLowerCase().includes(q)) count++;
      });
    });
    return count;
  }, [searchQuery]);

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

      {/* 3. Skills Bento Section */}
      <div className={styles.skills}>
        <div className={styles.container}>
          <div className={styles.skillsHeader}>
            <div className={styles.skillsTopRow}>
              <div className={styles.skillsTitleGroup}>
                <span className={styles.skillsOverline}>
                  <span
                    className={styles.skillsOverlineDot}
                    aria-hidden="true"
                  />
                  Tech Stack & Capabilities
                </span>
                <h3 className={styles.skillsTitle}>Skills & Technologies</h3>
                <p className={styles.skillsSub}>
                  A curated breakdown of my tools, frameworks, and workflows.
                  Everything is battle-tested in real production projects.
                </p>
              </div>

              <div className={styles.searchWrap}>
                <Search className={styles.searchIcon} aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter skills (e.g. React, Next.js)..."
                  className={styles.searchInput}
                  aria-label="Filter skills"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className={styles.searchClear}
                    aria-label="Clear search"
                  >
                    <X className={styles.clearIcon} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <div className={styles.skillsControls}>
              <div
                className={styles.filterTabs}
                role="tablist"
                aria-label="Skills categories"
              >
                {CATEGORY_TABS.map((tab) => {
                  const isActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`${styles.filterTab} ${
                        isActive ? styles.filterTabActive : ""
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={styles.filterTabCount}>{tab.count}</span>
                    </button>
                  );
                })}
              </div>

              {searchQuery.trim() && (
                <span className={styles.searchStatus}>
                  {totalMatches === 0
                    ? `No skills matching "${searchQuery}"`
                    : `Found ${totalMatches} ${
                        totalMatches === 1 ? "skill" : "skills"
                      }`}
                </span>
              )}
            </div>
          </div>

          <div className={styles.bentoGrid}>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <SkillCard
                  key={group.id}
                  group={group}
                  isSingleCategory={selectedCategory !== "all"}
                  searchQuery={searchQuery}
                  activeSkill={activeSkill}
                  setActiveSkill={setActiveSkill}
                />
              ))
            ) : (
              <div className={styles.noMatches}>
                <p>No technologies match &ldquo;{searchQuery}&rdquo;</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={`${styles.btn} ${styles.btnGhost}`}
                  style={{
                    minWidth: "8rem",
                    height: "2.5rem",
                    marginTop: "1rem",
                  }}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
