import { ArrowRight, ArrowUpRight } from "lucide-react";
import s from "./Hero.module.css";

export function Hero() {
  /* These live in public/, so they are not import-resolved and Vite cannot
     rewrite them: the base prefix has to be applied here. It is "/" in dev and
     "/vibesim-intro/" in the published build. */
  const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`;
  const previewImages = {
    original: asset("shoreline-v3.webp"),
    "datacenter-a": asset("hero-datacenter-a.png"),
    "datacenter-b": asset("hero-datacenter-b.png"),
    "datacenter-c": asset("hero-datacenter-c.png"),
  };
  const preview = new URLSearchParams(window.location.search).get("hero");
  return (
    <section className={s.hero} aria-labelledby="page-title">
      <img
        className={s.heroImage}
        src={previewImages[preview] || asset("hero-datacenter-b.png")}
        alt=""
        fetchPriority="high"
        width="1672"
        height="941"
      />
      <div className={s.heroShade} />
      <div className={`${s.heroCopy} wrap`}>
        <h1 id="page-title">
          Know how fast it can go.
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
        {/* Both labels name what is at the other end. "See the examples" did
            not: nothing in that section is called an example, it is three
            studies the Agent runs. The workflow section is five numbered
            stages, and its pager says so. */}
        <div className={s.heroActions}>
          <a className={`button button-primary`} href="#use-cases">
            See the Agent run a study <ArrowRight size={16} />
          </a>
          <a className={s.heroSecondary} href="#workflow">
            See the five stages <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
