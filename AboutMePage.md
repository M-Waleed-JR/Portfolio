You are a senior creative front-end developer and UI designer who builds award-level portfolio websites (Awwwards / Godly quality). Design and build a new "About" section for my personal portfolio.

## Project context

- Stack: Next.js (App Router), React, Tailwind CSS. JavaScript (.jsx), not TypeScript.
- File to create: components/About.jsx. Put any custom CSS I need in globals.css, clearly separated and commented.
- Theme: near-black background (#050505 to #0a0a0a), warm orange accent (around #ff7a3d), white text with muted gray secondary text. Dark, cinematic, premium.
- The Hero section above it has a dark portrait of me with a huge faint translucent "Portfolio" word behind it. The About section must feel like the same website: same mood, same type scale, same orange accent.
- Icons come from "@/components/icons" (ArrowDown, ArrowUpRight). Image path: /images/profile.png. Use next/image.
- The section id must be "about" (the navbar links to #about). Navbar order: Home, About, Projects, Skills, Contact.

## About me (use this real content, do not invent facts)

- Name: Mohamed Waleed Alsayed Mansour. Early-career Front-End Developer from Egypt.
- Graduated 2025, Faculty of Computers and Information, Zagazig University.
- Looking for my first Junior Front-End Developer role.
- Focus: React.js and Next.js.
- Experience comes from personal projects that I built and deployed on Vercel: Nova (electronics e-commerce storefront), Weather App (external REST API), To-do List (persists in Local Storage), Gusto (restaurant website, Next.js).
- English: B2 (self-reported).
- GitHub: https://github.com/M-Waleed-JR
- Tools: HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS, Material UI, Swiper, Axios, Fetch API, Git, GitHub, Vite, npm, Vercel.

## What is wrong with my current About (avoid all of this)

- Two long paragraphs of text: too much reading.
- The same portrait photo I already used in the Hero, shown again in a plain card.
- A boring table of facts and a plain list of skill chips that looks like every junior portfolio.

## Design goals

1. Memorable at first glance, not a template. Someone scrolling quickly should stop here.
2. Very little text. One huge statement sentence as the visual centerpiece (for example "I build interfaces that feel alive."), with a short supporting line of two sentences at most.
3. Luxury through restraint: lots of empty space, very large typography, thin 1px borders (white at 8 to 10% opacity), orange used only in a few small places.
4. Tell a story, not a list. Include a small horizontal or vertical timeline: Graduated 2025, first projects, Nova, Gusto, now (open to junior roles).
5. Animated number counters (projects built, technologies used, projects deployed) instead of a facts table. Use only numbers that are true.
6. A "Currently" card: what I am learning, what I am building, availability ("Open to junior roles" with a small pulsing orange dot).
7. Skills should be proof, not a claim. Show them as a compact "Toolkit" block where each skill group is linked to the project that used it (for example REST APIs → Weather App, Local Storage → To-do List, Next.js → Gusto and this Portfolio, React → Nova). Keep it compact and elegant, not a wall of chips.
8. Do not repeat the Hero photo as a plain card. Either use no photo, or use it in a completely different treatment (for example a small circular crop with an orange ring, a duotone or grayscale-to-color on hover, or a small detail inside the "Currently" card).

## Interaction and motion (pick a few, do them well)

- A soft orange spotlight / radial glow that follows the mouse across the section's dark background (disabled on touch devices).
- Staggered reveal on scroll using IntersectionObserver (fade + translate up, 600 to 800ms, ease-out), consistent with the rest of the site.
- Large statement text where words highlight or change color progressively as the user scrolls.
- Subtle hover states on cards (border brightens to orange, slight lift).
- Counters animate once when they enter the viewport.
- Respect prefers-reduced-motion: show everything instantly with no animation.
- Use only CSS transforms and opacity for animation. No heavy libraries (no GSAP, no Framer Motion) unless they clearly improve the result; if you use one, tell me why.

## Layout

- Desktop: asymmetrical editorial grid (12 columns), max width around 1280px, generous vertical padding (at least 120px top and bottom).
- Mobile: single column, fully responsive from 360px wide, no horizontal scroll, touch-friendly buttons (min 44px height), mouse effects removed.
- Include a topline label "01 — About" with a small orange dot, matching the numbered-section style.
- End with two buttons: "View projects" (solid orange) and "GitHub" (ghost, with the ArrowUpRight icon).

## Quality requirements

- Semantic HTML (section, h2, h3, dl or ul where appropriate), aria-labelledby on the section, aria-hidden on decorative elements, alt text on images.
- Good contrast (WCAG AA) for all text.
- Clean, readable, commented code. No unused code, no placeholder lorem ipsum, no fake statistics, no fake testimonials.
- The component must be a client component ("use client") only if it needs hooks.
- Performance: no layout shift, images sized properly, animations don't cause jank.

## Output format

1. A short explanation (5 to 8 lines) of the design concept and why it stands out.
2. The full code of components/About.jsx.
3. The full CSS to paste into globals.css (or Tailwind classes inline, your choice, but be consistent).
4. A short list of anything I need to adjust (image path, numbers, colors).
   Give me the complete working code in one go, not snippets.
