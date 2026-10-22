import About from "@/components/About/About";
import Hero from "@/components/Hero/Hero";
import ProjectsCarousel from "@/components/ProjectsCarousel/ProjectsCarousel";
import Contact from "@/components/Contact/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <ProjectsCarousel />
      <Contact />
    </main>
  );
}
