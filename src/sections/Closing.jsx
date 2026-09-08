import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Brand } from "../components/Brand";
import s from "./Closing.module.css";

export function Closing() {
  return (
    <>
      <section className={s.closing} id="start">
        <div className="wrap">
          <h2>Start exploring your serving setup with VibeSim.</h2>
          <a className={`button button-primary`} href="#use-cases">
            See the examples <ArrowRight size={16} />
          </a>
        </div>
      </section>
      <footer className={`wrap ${s.footer}`}>
        <Brand className={s.footerBrand} />
        <span>Simulate, understand and optimize LLM serving.</span>
        <a
          href="https://github.com/SyFI-VibeSim/vibesim-intro"
          target="_blank"
          rel="noreferrer"
        >
          Page source <ArrowUpRight size={14} />
        </a>
      </footer>
    </>
  );
}
