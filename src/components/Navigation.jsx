import { ArrowUpRight } from "lucide-react";
import { Brand } from "./Brand";
import s from "./Navigation.module.css";

export function Navigation({ page = "overview" }) {
  const base = import.meta.env.BASE_URL;
  return (
    <header className={s.navigation}>
      <div className={s.navigationInner}>
        <Brand />
        <nav aria-label="Main navigation">
          {[
            ["overview", "Overview", base],
            ["features", "Features", `${base}features.html`],
            ["architecture", "Architecture", `${base}architecture.html`],
          ].map(([id, name, href]) => (
            <a key={id} href={href} aria-current={page === id ? "page" : undefined}>
              {name}
            </a>
          ))}
        </nav>
        <div className={s.navigationActions}>
          <a
            className={s.github}
            href="https://github.com/SyFI-VibeSim/VibeSim"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a className={s.navCta} href={`${base}#use-cases`}>
            Get started <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
