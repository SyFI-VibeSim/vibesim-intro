import s from "./ProductIntroduction.module.css";

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
          <h2 id="product-title">VibeSim. More than a simulator.</h2>
          <p>
            A simulator that predicts how a serving setup performs, and an Agent
            that uses it to build and validate the improvement in your real
            framework.
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
