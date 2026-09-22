import Nav from "@/components/Nav";
import Avatars from "@/components/Avatar";
import Whoami from "@/components/Whoami";
import ProjectBlock from "@/components/ProjectBlock";
import SkillsBand from "@/components/SkillsBand";
import MusicSection from "@/components/MusicSection";
import Footer from "@/components/Footer";
import PointerProbe from "@/components/PointerProbe";
import Kiriban from "@/components/Kiriban";
import { projects } from "@/lib/projects";
import { ROLES } from "@/lib/profile";

export default function Home() {
  return (
    <>
      <span id="top" />
      <Nav />
      <main>
        <section className="hero">
          <div className="container">
            <Avatars />
            <p className="hero__label">
              <strong>0266st / 0168th</strong>
              {ROLES.map((role) => (
                <span key={role} className="hero__role">
                  {role}
                </span>
              ))}
            </p>
            <Whoami />
          </div>
        </section>

        <SkillsBand />

        <section id="products" className="projects">
          <div className="container">
            <h2 className="section-title">Products</h2>
            {projects.map((project, i) => (
              <ProjectBlock key={project.slug} project={project} reverse={i % 2 === 1} />
            ))}
            <p className="projects__more">&hellip;and more in development!</p>
          </div>
        </section>

        <MusicSection />
      </main>
      <Footer />
      <Kiriban />
      <PointerProbe />
    </>
  );
}
