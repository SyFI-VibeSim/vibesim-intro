import s from "./ProductIntroduction.module.css";

/* The simulation foundation and Agent workflow share the capabilities and
   evidence presented in the sections below. */
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
    note: "Everything listed here has been built and run, but not every combination across the rows is tested.",
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

export function ProductIntroduction() {
  return (
    <section
      className={`section ${s.productSection}`}
      id="product"
      aria-labelledby="product-title"
    >
      <div className="wrap">
        <div className="section-intro" data-reveal>
          <h2 id="product-title">A simulator to predict. An Agent to act.</h2>
          <p>
            ServingStudio combines simulation grounded in real GPU measurements
            with an Agent that explores configurations, explains performance,
            and builds and validates improvements in real serving frameworks.
          </p>
        </div>
        <div className={s.productParts}>
          {productParts.map((part) => (
            <article className={s.productPart} key={part.name}>
              <h3>{part.name}</h3>
              <p className={s.productPartRole}>{part.role}</p>
              <dl>
                {part.items.map(([term, detail]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
              <p className={s.productPartNote}>{part.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
