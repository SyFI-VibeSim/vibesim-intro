import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import logo from "./vibesim-logo.png";
import { UseCases } from "./Experiences";
import { Workflow } from "./Workflow";
import { Advantages } from "./Highlights";
import "./product-introduction.css";

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="VibeSim home">
      <img src={logo} alt="" />
      <span>VibeSim</span>
    </a>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="navigation">
      <div className="navigation-inner">
        <Brand />
        <nav aria-label="Main navigation" className={open ? "open" : ""}>
          {[
            ["Use cases", "#use-cases"],
            ["How it works", "#workflow"],
            ["Supported systems", "#support"],
          ].map(([name, href]) => (
            <a key={name} href={href} onClick={() => setOpen(false)}>
              {name}
            </a>
          ))}
        </nav>
        <div className="navigation-actions">
          <a className="nav-cta" href="#use-cases">
            Explore VibeSim <ArrowUpRight size={14} />
          </a>
          <button
            className="menu-toggle"
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

function Hero() {
  const previewImages = {
    original: "/images/shoreline-v3.webp",
    "datacenter-a": "/images/hero-datacenter-a.png",
    "datacenter-b": "/images/hero-datacenter-b.png",
    "datacenter-c": "/images/hero-datacenter-c.png",
  };
  const preview = new URLSearchParams(window.location.search).get("hero");
  return (
    <section className="hero" aria-labelledby="page-title">
      <img
        className="hero-image"
        src={previewImages[preview] || "/images/hero-datacenter-b.png"}
        alt=""
        fetchPriority="high"
        width="1672"
        height="941"
      />
      <div className="hero-shade" />
      <div className="hero-copy wrap">
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
        <div className="hero-actions">
          <a className="button button-primary" href="#use-cases">
            See the examples <ArrowRight size={16} />
          </a>
          <a className="hero-secondary" href="#workflow">
            See how it works <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* The product definition. Two halves, because the name only covers one of them:
   the simulator is what VibeSim can model, the Agent is what it does with it.
   Every line on the simulator side restates the coverage directory and the
   evidence rows further down the page; every line on the Agent side restates a
   step of the workflow section. Nothing here is a capability the page does not
   already back up. */
const productParts = [
  {
    name: "Simulator",
    role: "What it can model.",
    items: [
      ["Models", "Dense and mixture-of-experts, in BF16, FP8 and NVFP4"],
      ["Hardware", "H200 and B200, with TP, EP, DP and PP"],
      [
        "Serving",
        "Unified, prefill–decode, attention–FFN and speculative decoding",
      ],
      ["Results", "Throughput, TTFT and TPOT, down to time per operation"],
      [
        "Accuracy",
        "Kernel timings measured on real GPUs, calibrated against vLLM and SGLang",
      ],
    ],
    note: "Each of these has been built and run. The groups are not axes to multiply together.",
  },
  {
    name: "Agent",
    role: "What it does with it.",
    items: [
      ["Designs", "Turns a serving question into an experiment and runs it"],
      ["Searches", "Sweeps configurations and compares what comes back"],
      ["Explains", "Reads the analysis and states the tradeoff behind the answer"],
      ["Builds", "Implements the chosen change in vLLM or SGLang"],
      [
        "Validates",
        "Benchmarks it on real hardware and attributes what is still missing",
      ],
    ],
    note: "The same experiments are available from the command line and the API.",
  },
];

function ProductIntroduction() {
  return (
    <section
      className="section product-section"
      id="product"
      aria-labelledby="product-title"
    >
      <div className="wrap">
        <div className="section-intro">
          <h2 id="product-title">VibeSim. More than a simulator.</h2>
          <p>
            A simulator that predicts how a serving setup performs, and an Agent
            that uses it to build and validate the improvement in your real
            framework.
          </p>
        </div>
        <div className="product-parts">
          {productParts.map((part) => (
            <article className="product-part" key={part.name}>
              <h3>{part.name}</h3>
              <p className="product-part-role">{part.role}</p>
              <dl>
                {part.items.map(([term, detail]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
              <p className="product-part-note">{part.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <>
      <section className="closing" id="start">
        <div className="wrap">
          <h2>Start exploring your serving setup with VibeSim.</h2>
          <a className="button button-primary" href="#use-cases">
            See the examples <ArrowRight size={16} />
          </a>
        </div>
      </section>
      <footer className="wrap footer">
        <Brand />
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

export default function App() {
  const mainRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = mainRef.current.querySelectorAll(".section-intro, .why-row");
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
