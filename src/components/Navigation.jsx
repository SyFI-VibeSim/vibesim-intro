import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "./Brand";
import s from "./Navigation.module.css";

export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className={s.navigation}>
      <div className={s.navigationInner}>
        <Brand />
        <nav aria-label="Main navigation" data-open={open}>
          {/* Each label names what is at the other end, so arriving confirms
              the click. Two read off the heading, "Run the study with the
              Agent." and "Explore VibeSim's key features."; the middle one
              names the section itself, five stages from profiling a real
              framework through to benchmarking the final build.

              They also have to stay short. The bar is a fixed-width flex row,
              and at 768px there is no slack. */}
          {[
            ["Run a study", "#use-cases"],
            ["E2E workflow", "#workflow"],
            ["Key features", "#advantages"],
          ].map(([name, href]) => (
            <a key={name} href={href} onClick={() => setOpen(false)}>
              {name}
            </a>
          ))}
        </nav>
        <div className={s.navigationActions}>
          {/* Not "Explore VibeSim": that is the opening of a different
              section's heading, "Explore VibeSim's key features.", so the label
              named one destination and went to another. */}
          <a className={s.navCta} href="#use-cases">
            See it run <ArrowUpRight size={14} />
          </a>
          <button
            className={s.menuToggle}
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
