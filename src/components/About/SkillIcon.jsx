"use client";

import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiBootstrap,
  SiRedux,
  SiAxios,
  SiThreedotjs,
  SiMui,
  SiSwiper,
  SiGit,
  SiGithub,
  SiVite,
  SiNpm,
  SiVercel,
  SiGithubpages,
} from "react-icons/si";
import {
  TbApi,
  TbDatabase,
  TbArrowsExchange,
  TbLayersIntersect,
  TbFlame,
  TbBellRinging,
} from "react-icons/tb";
import { MonitorSmartphone, Boxes, Box, Sparkles } from "lucide-react";

export const SKILL_DATA = {
  HTML5: {
    icon: SiHtml5,
    color: "#E34F26",
  },
  CSS3: {
    icon: SiCss,
    color: "#1572B6",
  },
  "JavaScript ES6+": {
    icon: SiJavascript,
    color: "#F7DF1E",
  },
  TypeScript: {
    icon: SiTypescript,
    color: "#3178C6",
  },
  React: {
    icon: SiReact,
    color: "#61DAFB",
  },
  "Next.js": {
    icon: SiNextdotjs,
    color: "#FFFFFF",
  },
  "Tailwind CSS": {
    icon: SiTailwindcss,
    color: "#38BDF8",
  },
  "Bootstrap 5": {
    icon: SiBootstrap,
    color: "#7952B3",
  },
  "Responsive Design": {
    icon: MonitorSmartphone,
    color: "#F0A85A",
  },
  "Redux Toolkit": {
    icon: SiRedux,
    color: "#764ABC",
  },
  "Context API": {
    icon: TbLayersIntersect,
    color: "#61DAFB",
  },
  "Fetch API": {
    icon: TbArrowsExchange,
    color: "#3FB5C0",
  },
  Axios: {
    icon: SiAxios,
    color: "#5A29E4",
  },
  "REST APIs": {
    icon: TbApi,
    color: "#3FB5C0",
  },
  "Local Storage": {
    icon: TbDatabase,
    color: "#F0A85A",
  },
  "Three.js": {
    icon: SiThreedotjs,
    color: "#FFFFFF",
  },
  "React Three Fiber": {
    icon: Box,
    color: "#3FB5C0",
  },
  "@react-three/drei": {
    icon: Boxes,
    color: "#3FB5C0",
  },
  "Material UI": {
    icon: SiMui,
    color: "#007FFF",
  },
  Swiper: {
    icon: SiSwiper,
    color: "#6332F6",
  },
  "Lucide React": {
    icon: Sparkles,
    color: "#F0A85A",
  },
  SweetAlert2: {
    icon: TbBellRinging,
    color: "#F27474",
  },
  "React Hot Toast": {
    icon: TbFlame,
    color: "#FF9800",
  },
  Git: {
    icon: SiGit,
    color: "#F05032",
  },
  GitHub: {
    icon: SiGithub,
    color: "#FFFFFF",
  },
  Vite: {
    icon: SiVite,
    color: "#BD34FE",
  },
  npm: {
    icon: SiNpm,
    color: "#CB3837",
  },
  Vercel: {
    icon: SiVercel,
    color: "#FFFFFF",
  },
  "GitHub Pages": {
    icon: SiGithubpages,
    color: "#58A6FF",
  },
};

export default function SkillLogo({ skillName, className, size = 18 }) {
  const meta = SKILL_DATA[skillName];
  if (!meta) return null;
  const Icon = meta.icon;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: meta.color,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <Icon size={size} style={{ width: size, height: size }} />
    </span>
  );
}

