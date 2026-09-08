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
          {[
            ["Use cases", "#use-cases"],
            ["How it works", "#workflow"],
            ["Supported systems", "#advantages"],
          ].map(([name, href]) => (
            <a key={name} href={href} onClick={() => setOpen(false)}>
              {name}
            </a>
          ))}
        </nav>
        <div className={s.navigationActions}>
          <a className={s.navCta} href="#use-cases">
            Explore VibeSim <ArrowUpRight size={14} />
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
