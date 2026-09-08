import { ArrowRight, ArrowUpRight } from "lucide-react";
import s from "./Hero.module.css";

export function Hero() {
  const previewImages = {
    original: "/images/shoreline-v3.webp",
    "datacenter-a": "/images/hero-datacenter-a.png",
    "datacenter-b": "/images/hero-datacenter-b.png",
    "datacenter-c": "/images/hero-datacenter-c.png",
  };
  const preview = new URLSearchParams(window.location.search).get("hero");
  return (
    <section className={s.hero} aria-labelledby="page-title">
      <img
        className={s.heroImage}
        src={previewImages[preview] || "/images/hero-datacenter-b.png"}
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
        <div className={s.heroActions}>
          <a className={`button button-primary`} href="#use-cases">
            See the examples <ArrowRight size={16} />
          </a>
          <a className={s.heroSecondary} href="#workflow">
            See how it works <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
