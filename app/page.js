import About from "@/components/About";
import Hero from "@/components/Hero";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <ProjectsCarousel />
    </main>
  );
}
