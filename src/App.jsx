import { useEffect, useRef } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./sections/Hero";
import { ProductIntroduction } from "./sections/ProductIntroduction";
import { UseCases } from "./sections/UseCases";
import { Workflow } from "./sections/Workflow";
import { Advantages } from "./sections/Advantages";
import { Closing } from "./sections/Closing";

export default function App() {
  const mainRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* Reveal targets are marked with data-reveal by the section that owns them.
       Querying by class name meant reaching into another section's internals,
       which broke silently the moment those classes became CSS Modules and
       started being hashed: the six rows in Supported systems simply stopped
       being found, and nothing rendered differently enough to notice. */
    const elements = mainRef.current.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => {
      element.classList.add("will-reveal");
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div className="site" id="top">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navigation />
      <main ref={mainRef} id="main">
        <Hero />
        <ProductIntroduction />
        <UseCases />
        <Workflow />
        <Advantages />
      </main>
      <Closing />
    </div>
  );
}
