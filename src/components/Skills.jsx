"use client";

import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/*  Only confirmed skills. `used` links each skill to the projects that use    */
/*  it. EDIT the `used` arrays so they match what you really built.            */
/* -------------------------------------------------------------------------- */

const PROJECTS = ["Nova", "Weather App", "To-do List", "Gusto", "Portfolio"];

const GROUPS = [
  {
    title: "Front-End Development",
    skills: [
      { name: "HTML", used: ["Nova", "Weather App", "To-do List"] },
      { name: "CSS", used: ["Nova", "Weather App", "To-do List"] },
      { name: "JavaScript", used: ["Nova", "Weather App", "To-do List"] },
      { name: "TypeScript", used: ["Gusto"] },
      { name: "React.js", used: ["Nova", "Gusto", "Portfolio"] },
      { name: "Next.js", used: ["Nova", "Gusto", "Portfolio"] },
      { name: "Tailwind CSS v4", used: ["Nova", "Gusto", "Portfolio"] },
    ],
  },
  {
    title: "UI Libraries",
    skills: [
      { name: "Material UI", used: ["To-do List", "Weather App"] },
      { name: "Swiper", used: ["Nova", "Gusto", "Portfolio"] },
      {
        name: "Lucide React",
        used: ["Nova", "Gusto", "Weather App", "To-do List"],
      },
      { name: "SweetAlert2", used: ["To-do List", "Weather App"] },
      { name: "React Hot Toast", used: ["To-do List", "Weather App"] },
    ],
  },
  {
    title: "APIs & Data",
    skills: [
      { name: "REST APIs", used: ["Weather App", "Nova"] },
      { name: "Fetch API", used: ["Weather App", "To-do List"] },
      { name: "Axios", used: ["Weather App", "To-do List"] },
      { name: "Local Storage", used: ["To-do List", "Nova"] },
    ],
  },
  {
    title: "Dev Tools",
    skills: [
      { name: "Git", used: PROJECTS },
      { name: "GitHub", used: PROJECTS },
      { name: "Vite", used: ["To-do List", "Weather App"] },
      { name: "npm", used: PROJECTS },
      { name: "Vercel", used: PROJECTS },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function Skills() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(null); // selected project or null

  /* Reveal blocks once. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = Array.from(section.querySelectorAll("[data-reveal]"));
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const total = GROUPS.reduce((sum, group) => sum + group.skills.length, 0);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="sk-section"
      aria-labelledby="skills-title"
    >
      <div className="sk-shell">
        <div className="sk-topline">
          <span className="sk-eyebrow">
            <span className="sk-dot" aria-hidden="true" />
            03 — Skills
          </span>
          <span className="sk-count">{total} tools</span>
        </div>

        <div className="sk-head" data-reveal style={{ "--sk-delay": "40ms" }}>
          <h2 id="skills-title" className="sk-title">
            Tools I build with<span>.</span>
          </h2>
          <p className="sk-sub">Pick a project to see which tools it used.</p>
        </div>

        {/* Project filter */}
        <div
          className="sk-filter"
          role="group"
          aria-label="Filter skills by project"
          data-reveal
          style={{ "--sk-delay": "100ms" }}
        >
          <button
            type="button"
            className={`sk-pill${active === null ? " is-on" : ""}`}
            aria-pressed={active === null}
            onClick={() => setActive(null)}
          >
            All
          </button>

          {PROJECTS.map((project) => (
            <button
              key={project}
              type="button"
              className={`sk-pill${active === project ? " is-on" : ""}`}
              aria-pressed={active === project}
              onClick={() => setActive(active === project ? null : project)}
            >
              {project}
            </button>
          ))}
        </div>

        {/* Groups */}
        <div className="sk-grid">
          {GROUPS.map((group, index) => (
            <article
              key={group.title}
              className="sk-group"
              data-reveal
              style={{ "--sk-delay": `${index * 70}ms` }}
            >
              <header className="sk-group-head">
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{group.title}</h3>
              </header>

              <ul className="sk-list">
                {group.skills.map((skill) => {
                  const match = active && skill.used.includes(active);
                  const dim = active && !match;

                  return (
                    <li
                      key={skill.name}
                      className={`sk-chip${match ? " is-match" : ""}${
                        dim ? " is-dim" : ""
                      }`}
                    >
                      {skill.name}
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
