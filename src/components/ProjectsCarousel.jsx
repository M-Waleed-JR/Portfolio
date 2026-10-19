"use client";

import { useCallback, useEffect, useRef } from "react";

const projects = [
  {
    id: "nova",
    number: "01",
    name: "Nova",
    type: "E-commerce",
    description:
      "A modern electronics storefront with interactive product browsing.",
    image: "/projects/nova.webp",
    stack: ["Next.js", "React", "Tailwind CSS"],
    live: "https://nova-jet-two.vercel.app/",
    github: "https://github.com/M-Waleed-JR/Nova",
    accent: "#a3e635",
  },
  {
    id: "weather",
    number: "02",
    name: "Weather App",
    type: "Web Application",
    description: "A weather application powered by an external API.",
    image: "/projects/weather.webp",
    stack: ["React", "Axios", "Tailwind CSS"],
    live: "https://weather-app-opal-nine-repyfja5gb.vercel.app/",
    github: "https://github.com/M-Waleed-JR/Weather-App",
    accent: "#8ca8ff",
  },
  {
    id: "todo",
    number: "03",
    name: "To-do List",
    type: "Task Management",
    description: "A task manager with persistent storage and task filtering.",
    image: "/projects/todo.webp",
    stack: ["React", "Material UI", "Local Storage"],
    live: "https://todo-list-eight-liart.vercel.app/",
    github: "https://github.com/M-Waleed-JR/Todo-List",
    accent: "#55e6c1",
  },
  {
    id: "gusto",
    number: "04",
    name: "GUSTO",
    type: "Restaurant Website",
    description: "A restaurant website built with Next.js and TypeScript.",
    image: "/projects/gusto.webp",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    live: "https://food-app-ruddy-omega.vercel.app/",
    github: "https://github.com/M-Waleed-JR/Food-App",
    accent: "#ff987c",
  },
];

// بنكرر المشاريع 3 مرات عشان اللوب يفضل مليان من غير فراغات
const items = [...projects, ...projects, ...projects].map((project, index) => ({
  ...project,
  key: `${project.id}-${index}`,
}));

const AUTO_SPEED = 38; // px / second
const HOVER_FACTOR = 0.25; // بيبطأ لما الماوس يبقى فوق كارت (مش القسم كله)
const DRAG_START = 6;
const MAX_VELOCITY = 2400;

// لازم gap = عرض الكارت في الـ CSS + المسافة بينهم
const DESKTOP = { gap: 436 }; // card 400 + 36
const MOBILE = { gap: 296 }; // card 270 + 26

const mod = (n, m) => ((n % m) + m) % m;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function ProjectsCarousel() {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  const s = useRef({
    pos: 0,
    vel: 0,
    target: null,
    hover: false,
    dragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastT: 0,
    moved: false,
    captured: false,
    metrics: DESKTOP,
    reduced: false,
  });

  // مكان وشكل كل كارت (2D بس: translate + rotate + scale)
  const render = useCallback(() => {
    const { pos, metrics } = s.current;
    const { gap } = metrics;
    const total = gap * items.length;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      const x = mod(i * gap - pos + total / 2, total) - total / 2;
      const n = x / gap; // 0 = في النص
      const a = Math.abs(n);

      const y = n * n * 18; // قوس خفيف لتحت
      const rotate = n * 2.4; // ميل بسيط
      const scale = 1 - Math.min(a / 3, 1) * 0.2;
      const opacity = clamp(1 - (a - 1.6) / 1.3, 0, 1);

      el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(
        1,
      )}px, ${y.toFixed(1)}px) rotate(${rotate.toFixed(
        2,
      )}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(100 - Math.round(a * 10));
      el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      el.classList.toggle("is-center", a < 0.5);
    });
  }, []);

  useEffect(() => {
    const state = s.current;
    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (state.target !== null) {
        state.pos += (state.target - state.pos) * (1 - Math.exp(-dt * 6));
        if (Math.abs(state.target - state.pos) < 0.4) {
          state.pos = state.target;
          state.target = null;
        }
      } else if (!state.dragging) {
        state.pos += state.vel * dt;
        state.vel *= Math.exp(-dt * 2.6);

        const speed = AUTO_SPEED * (state.reduced ? 0.5 : 1);
        state.pos += speed * (state.hover ? HOVER_FACTOR : 1) * dt;
      }

      render();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [render]);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 700px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      s.current.metrics = mobile.matches ? MOBILE : DESKTOP;
      s.current.reduced = reduced.matches;
    };

    update();
    mobile.addEventListener("change", update);
    reduced.addEventListener("change", update);

    return () => {
      mobile.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const release = () => {
      const state = s.current;
      if (state.dragging) {
        state.dragging = false;
        state.pointerId = null;
      }
    };

    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);

    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
    };
  }, []);

  const handlePointerDown = (event) => {
    if (event.target.closest("button")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const state = s.current;
    state.pointerId = event.pointerId;
    state.startX = state.lastX = event.clientX;
    state.startY = event.clientY;
    state.lastT = performance.now();
    state.moved = false;
    state.captured = false;
    state.target = null;
    state.vel = 0;
    state.dragging = true;
  };

  const handlePointerMove = (event) => {
    const state = s.current;
    if (state.pointerId !== event.pointerId) return;

    if (!state.moved) {
      const dist = Math.hypot(
        event.clientX - state.startX,
        event.clientY - state.startY,
      );
      if (dist < DRAG_START) return;

      state.moved = true;

      // بنمسك البوينتر بعد أول حركة بس، عشان الكليك العادي يفضل شغال
      if (stageRef.current?.setPointerCapture) {
        stageRef.current.setPointerCapture(event.pointerId);
        state.captured = true;
      }
    }

    const now = performance.now();
    const dx = event.clientX - state.lastX;
    const dt = Math.max((now - state.lastT) / 1000, 0.001);

    state.pos -= dx;
    state.vel = state.vel * 0.6 + (-dx / dt) * 0.4;

    state.lastX = event.clientX;
    state.lastT = now;
  };

  const endDrag = (event) => {
    const state = s.current;
    if (state.pointerId !== event.pointerId) return;

    state.pointerId = null;
    state.dragging = false;
    state.vel = clamp(state.vel, -MAX_VELOCITY, MAX_VELOCITY);

    if (state.captured && stageRef.current?.releasePointerCapture) {
      try {
        stageRef.current.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    }
  };

  const handleLinkClick = (event) => {
    // لو كان سحب مش كليك، منفتحش اللينك
    if (s.current.moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const step = (direction) => {
    const state = s.current;
    const { gap } = state.metrics;
    const base = state.target ?? state.pos;
    state.vel = 0;
    state.target = (Math.round(base / gap) + direction) * gap;
  };

  return (
    <section id="projects" className="work-section">
      <div className="work-heading">
        <div className="work-eyebrow">
          <span />
          SELECTED PROJECTS
        </div>

        <h2>
          Built with <span>purpose.</span>
        </h2>

        <p>A few things I’ve designed and developed.</p>
      </div>

      <div
        ref={stageRef}
        className="work-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseLeave={() => (s.current.hover = false)}
      >
        {items.map((project, index) => (
          <article
            key={project.key}
            ref={(el) => (cardRefs.current[index] = el)}
            className="work-card"
            style={{ "--accent": project.accent }}
            onMouseEnter={() => (s.current.hover = true)}
            onMouseLeave={() => (s.current.hover = false)}
          >
            {/* الكارت كله لينك للـ live demo */}
            <a
              className="work-card-link"
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              aria-label={`Open ${project.name} live demo in a new tab`}
              onClick={handleLinkClick}
            />

            <div className="work-preview">
              <img
                src={project.image}
                alt={`${project.name} website screenshot`}
                draggable={false}
              />
              <span className="work-preview-label">LIVE DEMO ↗</span>
            </div>

            <div className="work-card-body">
              <div className="work-card-meta">
                <span>{project.type}</span>
                <span>{project.number} / 04</span>
              </div>

              <h3>{project.name}</h3>
              <p className="work-description">{project.description}</p>

              <div className="work-stack">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <div className="work-card-footer">
                <span className="work-explore">
                  Explore project <span>↗</span>
                </span>

                <a
                  className="work-github"
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  aria-label={`${project.name} GitHub repository`}
                  onClick={handleLinkClick}
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="work-hint">
        DRAG TO EXPLORE <span>·</span> CLICK A CARD FOR THE LIVE DEMO
      </p>
    </section>
  );
}
