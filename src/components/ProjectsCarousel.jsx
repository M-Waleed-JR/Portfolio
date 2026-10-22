"use client";

import { useEffect, useRef } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import styles from "./ProjectsCarousel.module.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const projects = [
  {
    id: "gusto",
    name: "GUSTO",
    type: "Restaurant website",
    description: "A restaurant website built with Next.js and TypeScript.",
    image: "/projects/gusto.webp",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    live: "https://food-app-ruddy-omega.vercel.app/",
    github: "https://github.com/M-Waleed-JR/Food-App",
    accent: "#ff987c",
  },
  {
    id: "nova",
    name: "Nova",
    type: "E-commerce",
    description:
      "A modern electronics storefront with interactive product browsing.",
    image: "/projects/nova.webp",
    stack: ["Next.js", "React", "Tailwind CSS"],
    live: "https://nova-jet-two.vercel.app/",
    github: "https://github.com/M-Waleed-JR/Nova",
    accent: "#800020",
  },
  {
    id: "weather",
    name: "Weather App",
    type: "Web application",
    description: "A weather application powered by an external API.",
    image: "/projects/weather.webp",
    stack: ["React", "Axios", "Tailwind CSS"],
    live: "https://weather-app-opal-nine-repyfja5gb.vercel.app/",
    github: "https://github.com/M-Waleed-JR/Weather-App",
    accent: "#8ca8ff",
  },
  {
    id: "todo",
    name: "To-do List",
    type: "Task management",
    description: "A task manager with persistent storage and task filtering.",
    image: "/projects/todo.webp",
    stack: ["React", "Material UI", "Local Storage"],
    live: "https://todo-list-eight-liart.vercel.app/",
    github: "https://github.com/M-Waleed-JR/Todo-List",
    accent: "#55e6c1",
  },
];

const COUNT = projects.length;

const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const RGB = projects.map((p) => hexToRgb(p.accent));
const HOSTS = projects.map((p) => new URL(p.live).hostname);

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const smooth = (x) => x * x * (3 - 2 * x);
const pad = (n) => String(n).padStart(2, "0");

function ArrowUpRight() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function ProjectsCarousel() {
  const stageRef = useRef(null);
  const rootRef = useRef(null);
  const mockRef = useRef(null);
  const linkRef = useRef(null);
  const hostRef = useRef(null);
  const countRef = useRef(null);
  const shotRefs = useRef([]);
  const infoRefs = useRef([]);
  const segRefs = useRef([]);

  const st = useRef({
    g: 0, // smoothed position between projects (0 to COUNT - 1)
    active: -1,
    tx: 0,
    ty: 0,
    cx: 0,
    cy: 0,
    reduced: false,
  });

  useEffect(() => {
    const stage = stageRef.current;
    const root = rootRef.current;
    if (!stage || !root) return;

    const state = st.current;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    state.reduced = mq.matches;
    const onMq = () => {
      state.reduced = mq.matches;
    };
    mq.addEventListener("change", onMq);

    let raf = 0;
    let running = false;
    let last = performance.now();

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // 1. Scroll progress -> target position, with a hold on every project
      const rect = stage.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      const u = p * (COUNT - 1);
      const base = Math.min(Math.floor(u), COUNT - 1);
      const t = u - base;
      const e = base >= COUNT - 1 ? 0 : smooth(clamp((t - 0.25) / 0.5, 0, 1));
      const target = base + e;

      state.g = state.reduced
        ? target
        : state.g + (target - state.g) * (1 - Math.exp(-dt * 9));
      const g = state.g;

      // 2. Ambient color: blends between the accents of neighbouring projects
      const i0 = Math.min(Math.floor(g), COUNT - 1);
      const i1 = Math.min(i0 + 1, COUNT - 1);
      const f = g - i0;
      const c = RGB[i0]
        .map((v, k) => Math.round(v + (RGB[i1][k] - v) * f))
        .join(" ");
      root.style.setProperty("--accent-rgb", c);
      root.style.setProperty("--accent", `rgb(${c})`);
      root.style.setProperty("--g", g.toFixed(4));

      // 3. Screenshots: each one is revealed upwards over the previous
      shotRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = i - g;
        const open = clamp(d, 0, 1);
        el.style.clipPath = `inset(${(open * 100).toFixed(2)}% 0 0 0)`;
        const img = el.firstElementChild;
        if (img) img.style.transform = `scale(${(1 + open * 0.14).toFixed(3)})`;
      });

      // 4. Info blocks: cross-fade around the center
      infoRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = i - g;
        const v = clamp(1 - Math.abs(d) * 1.8, 0, 1);
        el.style.opacity = v.toFixed(3);
        el.style.transform = `translateY(${(d * 26).toFixed(1)}px)`;
        el.style.visibility = v < 0.01 ? "hidden" : "visible";
        el.style.pointerEvents = v > 0.5 ? "auto" : "none";
      });

      // 5. Progress segments
      segRefs.current.forEach((el, i) => {
        if (el)
          el.style.setProperty(
            "--v",
            clamp(1 - Math.abs(i - g), 0, 1).toFixed(3),
          );
      });

      // 6. Things that only change when another project takes the center
      const act = clamp(Math.round(g), 0, COUNT - 1);
      if (act !== state.active) {
        state.active = act;
        if (linkRef.current) {
          linkRef.current.href = projects[act].live;
          linkRef.current.setAttribute(
            "aria-label",
            `Open ${projects[act].name} live demo in a new tab`,
          );
        }
        if (hostRef.current) hostRef.current.textContent = HOSTS[act];
        if (countRef.current) countRef.current.textContent = pad(act + 1);
        segRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i === act) el.setAttribute("aria-current", "true");
          else el.removeAttribute("aria-current");
        });
      }

      // 7. Tilt of the browser frame follows the pointer (desktop only)
      const mock = mockRef.current;
      if (mock) {
        const wide = window.innerWidth >= 900;
        if (state.reduced) {
          state.cx = 0;
          state.cy = 0;
        } else {
          const k = 1 - Math.exp(-dt * 8);
          state.cx += (state.tx - state.cx) * k;
          state.cy += (state.ty - state.cy) * k;
        }
        const rx = wide ? 3 - state.cy * 5 : 0;
        const ry = wide ? -7 + state.cx * 8 : 0;
        mock.style.transform = `perspective(1600px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }

      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(stage);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  const handleMockMove = (event) => {
    if (st.current.reduced) return;
    const r = event.currentTarget.getBoundingClientRect();
    st.current.tx = (event.clientX - r.left) / r.width - 0.5;
    st.current.ty = (event.clientY - r.top) / r.height - 0.5;
  };

  const handleMockLeave = () => {
    st.current.tx = 0;
    st.current.ty = 0;
  };

  const jumpTo = (index) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const top = rect.top + window.scrollY;
    window.scrollTo({
      top: top + (index / (COUNT - 1)) * total,
      behavior: st.current.reduced ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="projects"
      className={`${styles.section} ${bricolage.className}`}
      aria-labelledby="projects-title"
    >
      <div ref={stageRef} className={styles.stage}>
        <div ref={rootRef} className={styles.sticky}>
          {/* Top bar */}
          <div className={styles.top}>
            <div>
              <p className={styles.kicker}>
                <span />
                Selected projects
              </p>
              <h2 id="projects-title" className={styles.title}>
                Built with purpose.
              </h2>
            </div>

            <div className={styles.progress}>
              <p className={styles.counter}>
                <span ref={countRef}>01</span>
                <small>/ {pad(COUNT)}</small>
              </p>
              <div className={styles.segs}>
                {projects.map((project, i) => (
                  <button
                    type="button"
                    key={project.id}
                    ref={(el) => {
                      segRefs.current[i] = el;
                    }}
                    className={styles.seg}
                    aria-label={`Show ${project.name}`}
                    onClick={() => jumpTo(i)}
                  >
                    <span />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Browser frame with the screenshots */}
          <div className={styles.mid}>
            <div
              className={styles.mockWrap}
              onPointerMove={handleMockMove}
              onPointerLeave={handleMockLeave}
            >
              <div className={styles.glow} aria-hidden="true" />
              <div ref={mockRef} className={styles.mock}>
                <div className={styles.browser}>
                  <i />
                  <i />
                  <i />
                  <em ref={hostRef}>{HOSTS[0]}</em>
                </div>
                <div className={styles.screen}>
                  {projects.map((project, i) => (
                    <div
                      key={project.id}
                      className={styles.shot}
                      ref={(el) => {
                        shotRefs.current[i] = el;
                      }}
                      style={{ zIndex: i + 1 }}
                    >
                      <img
                        src={project.image}
                        alt={`${project.name} website screenshot`}
                        draggable={false}
                      />
                    </div>
                  ))}
                  <a
                    ref={linkRef}
                    className={styles.mockLink}
                    href={projects[0].live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${projects[0].name} live demo in a new tab`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Big name + details */}
          <div className={styles.bottom}>
            <div className={styles.nameWindow} aria-hidden="true">
              <div className={styles.nameList}>
                {projects.map((project) => (
                  <span key={project.id} className={styles.name}>
                    {project.name}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.info}>
              {projects.map((project, i) => (
                <div
                  key={project.id}
                  className={styles.infoItem}
                  ref={(el) => {
                    infoRefs.current[i] = el;
                  }}
                >
                  <h3 className={styles.srOnly}>{project.name}</h3>
                  <p className={styles.type}>{project.type}</p>
                  <p className={styles.desc}>{project.description}</p>
                  <ul className={styles.stack}>
                    {project.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  <div className={styles.actions}>
                    <a
                      className={styles.live}
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live demo <ArrowUpRight />
                    </a>
                    <a
                      className={styles.gh}
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} GitHub repository`}
                    >
                      GitHub <ArrowUpRight />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
