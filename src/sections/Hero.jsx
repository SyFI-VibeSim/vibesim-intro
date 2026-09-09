import { ArrowRight, ArrowUpRight } from "lucide-react";
import s from "./Hero.module.css";

export function Hero() {
  /* These live in public/, so they are not import-resolved and Vite cannot
     rewrite them: the base prefix has to be applied here. It is "/" in dev and
     "/vibesim-intro/" in the published build. */
  const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`;
  const previewImages = {
    original: asset("shoreline-v3.webp"),
    "datacenter-a": asset("hero-datacenter-a.webp"),
    "datacenter-b": asset("hero-datacenter-b.webp"),
    "datacenter-c": asset("hero-datacenter-c.webp"),
  };
  const preview = new URLSearchParams(window.location.search).get("hero");
  const image = previewImages[preview] || asset("hero-datacenter-b.webp");
  return (
    <section className={s.hero} aria-labelledby="page-title">
      <img
        className={s.heroImage}
        src={image}
        srcSet={
          preview === "original"
            ? undefined
            : `${image.replace(".webp", "-960.webp")} 960w, ${image} 1672w`
        }
        sizes="100vw"
        alt=""
        fetchPriority="high"
        width="1672"
        height="941"
      />
      <div className={s.heroShade} />
      <div className={`${s.heroCopy} wrap`}>
        <h1 id="page-title">
          Know how fast LLM serving can go.
          <br />
          Then make it go that fast.
        </h1>
        {/* The headline states the ambition; this line states what actually
            happens. The Agent goes after the gap and the real benchmark decides
            how much of it came back — the page never promises all of it does. */}
        <p>
          VibeSim measures every simulated GPU second against the work your model
          really requires. The Agent goes after the difference and validates what it
          wins on real hardware.
        </p>
        <div className={s.heroActions}>
          <a className={`button button-primary`} href="#use-cases">
            See the Agent run a study <ArrowRight size={16} />
          </a>
          <a
            className={s.heroSecondary}
            href={`${import.meta.env.BASE_URL}features.html`}
          >
            Explore VibeSim features <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
