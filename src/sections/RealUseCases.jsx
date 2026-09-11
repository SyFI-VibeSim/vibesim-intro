import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import s from "./RealUseCases.module.css";
import qwenStory from "./qwenStory.json";
import { CaseInvestigation } from "./CaseInvestigation";
import qwenAfter from "../../public/case-studies/qwen-after-alignment.json";

const cases = [
  {
    id: "sglang-autotune",
    stack: "SGLang · GLM-5.2",
    title: "Tune the MoE kernels used in prefill graphs.",
    summary:
      "While aligning VibeSim with SGLang, we found that prefill MoE kernels were slower than expected. Autotuning was enabled, but it had missed the CUDA graph execution path. Tuning that path improved input throughput by 5.6%.",
    metric: "+5.6%",
    metricLabel: "input throughput vs. unpatched SGLang",
    setup: "NVFP4 · 4 × B200 · TP4",
    comparison: {
      label: "Median workload duration",
      unit: "s",
      before: "44.873",
      after: "42.503",
      beforeLabel: "Baseline",
      afterLabel: "Patched",
    },
    paragraphs: [
      "We first noticed the problem while comparing VibeSim’s predictions with SGLang measurements. Decode timings were close, but the **fused MoE kernels took longer than expected on large prefill batches**. **Turning off autotuning in our kernel benchmark reproduced the slower timings**. We then checked why SGLang was using those kernels despite having autotuning enabled.",
      "Startup autotuning was enabled, but it ran a different path from the one used by breakable prefill CUDA graphs. In graph mode, the MoE operation defers its final output step and passes a differently shaped output tensor. **FlashInfer treats that shape as a separate tuning key**, so the startup results did not apply. We added **a tuning pass inside the graph capture context**, before recording the graphs.",
      "On GLM-5.2 NVFP4 with four B200 GPUs, the patch **improved input throughput by 5.58%**. We ran 240 requests with 4,096 input tokens and 8 output tokens each, at concurrency 24. Across three warmed repeats, **median completion time fell from 44.873 to 42.503 seconds**. Both versions also answered 60 of 64 questions correctly in a small GSM8K check. The patch and reproduction instructions are in the SGLang PR below.",
    ],
    link: {
      label: "Read the SGLang PR #38560",
      href: "https://github.com/sgl-project/sglang/pull/38560",
    },
  },
  {
    id: "spec5-graphs",
    stack: "vLLM · GLM-5.2 MTP Spec",
    title: "Align CUDA graph boundaries for speculative decoding.",
    summary:
      "With 2,048-token prefill chunks and five MTP draft tokens, vLLM appeared CPU-bound during alignment. Its V1 runner filtered piecewise graph sizes to multiples of six, leaving the common 2,048-token batch to run eagerly. A 2,052-token budget restored graph replay.",
    metric: "+10.8%",
    metricLabel: "output throughput compared with the 2,048-token graph budget",
    setup: "NVFP4 · 4 × B200 · TP4 + EP4",
    plot: {
      file: "spec5-sawtooth.png",
      width: 1971,
      height: 1280,
      alt: "Spec5 diagnostic: the dashed VibeSim curve repeatedly rises and drops while the profiled vLLM GPU cadence stays flatter. A second panel expands the 12 to 95 second interval.",
      caption:
        "The timing curves that led us to investigate. The plot compares three runs, with time measured from the first iteration of each run. The lower panel zooms in on the repeated rises and drops.",
    },
    comparison: {
      label: "Observed iteration time in the profile window",
      unit: "ms",
      before: "141.048",
      after: "114.903",
      beforeLabel: "2,048 tokens",
      afterLabel: "2,052 tokens",
    },
    paragraphs: [
      "While aligning GLM-5.2 with five MTP draft tokens, we noticed that **vLLM appeared CPU-bound with the usual 2,048-token prefill chunks**. VibeSim’s timings rose and fell as the attention context grew, but the measured GPU timeline was much flatter. Looking at the trace showed that these common prefill batches were running eagerly, with **individual kernel launches instead of CUDA graph replay**.",
      "The cause was in the V1 runner’s graph-size handling. Five draft tokens require six tokens per verification step, and **the runner also filtered piecewise graph sizes to multiples of six**. With a configured limit of 2,048, the largest retained graph was only 2,034 tokens. A full 2,048-token batch could not use it. We **raised both the scheduler budget and the graph limit to 2,052**, which is divisible by six, and confirmed that piecewise replay was active again.",
      "In the inspected profile window, CUDA graph launches went from zero to 79 per rank per forward pass, while ordinary kernel launches fell from 835 to 261. **Average iteration time fell from 141.048 to 114.903 ms**. A separate run without profiling completed all 100 requests in both configurations and recorded **10.77% higher output throughput** with the new budget.",
    ],
    link: {
      label: "Explore the Spec5 implementation",
      href: "https://github.com/SyFI-VibeSim/VibeSim/pull/32",
    },
  },
  {
    id: "qwen-fusion",
    stack: "Mini-SGLang · Qwen3-235B",
    title:
      "Build a Qwen3-235B implementation in Mini-SGLang that outperforms vLLM.",
    summary:
      "Mini-SGLang had no MoE support. We built its Qwen3-235B serving path with guidance from VibeSim, then used kernel analysis to simplify execution and fuse operations. The resulting implementation delivered 25.6% higher output throughput than vLLM on our prefill-heavy benchmark.",
    metric: "+25.6%",
    metricLabel: "output throughput vs. vLLM",
    setup: "FP8 · 4 × H200 · TP4 + EP4",
    comparison: {
      label: "Measured output throughput · 256 requests at concurrency 32",
      unit: "tok/s",
      before: "80.741",
      after: "101.406",
      beforeLabel: "vLLM",
      afterLabel: "Mini-SGLang",
    },
    paragraphs: [],
  },
];

// Editorial emphasis only; React renders each segment as text, never HTML.
function EmphasizedText({ text }) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, index) =>
      part.startsWith("**") ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    );
}

function Comparison({ comparison }) {
  return (
    <figure className={s.comparison}>
      <figcaption>{comparison.label}</figcaption>
      <div className={s.readings}>
        <div>
          <span>{comparison.beforeLabel}</span>
          <strong>
            {comparison.before}
            <small>{comparison.unit}</small>
          </strong>
        </div>
        <ArrowRight size={22} aria-hidden="true" />
        <div>
          <span>{comparison.afterLabel}</span>
          <strong>
            {comparison.after}
            <small>{comparison.unit}</small>
          </strong>
        </div>
      </div>
    </figure>
  );
}

function KernelBreakdown({ rows, after = false }) {
  const maximum = Math.max(
    ...rows.flatMap((row) => [row.measured_ms, row.simulated_ms]),
  );
  return (
    <figure className={s.kernelChart}>
      <figcaption>
        {after
          ? "Kernel timings after FA3 and native EP"
          : "Where the first implementation differed from the simulation"}
      </figcaption>
      <p className={s.chartKey}>
        Time per operation · ms ·{" "}
        {after
          ? "mean of three captured prefill iterations"
          : "mean of two steady prefill iterations"}
      </p>
      {rows.map((row) => (
        <div className={s.kernelRow} key={row.operation}>
          <h4>{row.label}</h4>
          {[
            ["simulated_ms", "Predicted"],
            ["measured_ms", "Measured"],
          ].map(([key, label]) => (
            <div className={s.kernelReading} key={key}>
              <span>{label}</span>
              <div className={s.barTrack} aria-hidden="true">
                <i
                  className={key === "measured_ms" ? s.measuredBar : s.predictedBar}
                  style={{ width: `${(row[key] / maximum) * 100}%` }}
                />
              </div>
              <strong>{row[key].toFixed(3)}</strong>
            </div>
          ))}
        </div>
      ))}
      <p className={s.chartKey}>
        {after ? (
          "Selected operation contributions after the changes. One real transformer layer, 16K prefill, four H200 GPUs. The old dispatch path is no longer executed. Other differences remained: this prediction still included a dispatch cost that was removed in the real implementation, so the chart is not evidence of complete alignment."
        ) : (
          <>
            Selected operation contributions from the original alignment export. One
            real transformer layer, 16K prefill, four H200 GPUs. The initial
            attention backends and MoE execution paths differed; these differences
            motivated the implementation changes.
          </>
        )}
      </p>
      <a
        className={s.sourceLink}
        href={`${import.meta.env.BASE_URL}case-studies/${after ? "qwen-after-alignment.json" : "qwen-kernel-breakdown.json"}`}
        download
      >
        {after
          ? "Download these operation timings"
          : "Download all 21 operation timings"}{" "}
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </figure>
  );
}

function QuantizationTable({ table }) {
  return (
    <figure className={s.evidenceTable}>
      <figcaption>{table.caption}</figcaption>
      <table>
        <thead>
          <tr>
            {table.headers.map((header) => (
              <th key={header} scope="col">
                {header === "Measured time" ? "Time" : header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th scope="row" key={cell}>
                    {cell}
                  </th>
                ) : (
                  <td key={cell}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function RealUseCases() {
  const [active, setActive] = useState(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [active]);

  return (
    <section
      className="section wrap"
      id="real-use-cases"
      aria-labelledby="real-use-cases-title"
    >
      <div className="section-intro" data-reveal>
        <h2 id="real-use-cases-title">Performance gains in practice.</h2>
        <p>
          From a surprising timing gap to a change in a real serving engine. Three
          investigations guided by VibeSim.
        </p>
      </div>
      <div className={s.grid}>
        {cases.map((item) => (
          <article className={s.card} key={item.id}>
            <p className={s.stack}>{item.stack}</p>
            <h3>{item.title}</h3>
            <p className={s.summary}>{item.summary}</p>
            <div className={s.metric}>
              <strong>{item.metric}</strong>
              <span>{item.metricLabel}</span>
            </div>
            <p className={s.setup}>{item.setup}</p>
            <button
              className={s.readMore}
              type="button"
              aria-haspopup="dialog"
              aria-label={`Read more: ${item.title}`}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setActive(item);
              }}
            >
              Read more <ArrowUpRight size={19} aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
      {active && (
        <dialog
          ref={dialogRef}
          className={s.dialog}
          aria-labelledby="case-story-title"
          onCancel={() => setActive(null)}
          onClose={() => setActive(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              const bounds = event.currentTarget.getBoundingClientRect();
              if (
                event.clientX < bounds.left ||
                event.clientX > bounds.right ||
                event.clientY < bounds.top ||
                event.clientY > bounds.bottom
              )
                setActive(null);
            }
          }}
        >
          <div className={s.dialogBar}>
            <span>{active.stack}</span>
            <button
              type="button"
              aria-label="Close case study"
              onClick={() => setActive(null)}
              autoFocus
            >
              <X size={24} />
            </button>
          </div>
          <article className={s.story}>
            <h2 id="case-story-title">{active.title}</h2>
            <p className={s.setup}>{active.setup}</p>
            {
              <CaseInvestigation
                caseId={active.id}
                outcome={<Comparison comparison={active.comparison} />}
                charts={{
                  kernels: (
                    <KernelBreakdown
                      rows={qwenStory.find((chapter) => chapter.chart).chart}
                    />
                  ),
                  after: <KernelBreakdown rows={qwenAfter.rows} after />,
                  quantization: (
                    <QuantizationTable
                      table={qwenStory.find((chapter) => chapter.table).table}
                    />
                  ),
                }}
              />
            }
            {active.plot && active.id !== "spec5-graphs" && (
              <figure className={s.plot}>
                <a
                  href={`${import.meta.env.BASE_URL}case-studies/${active.plot.file}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open full-size graph: ${active.stack}`}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}case-studies/${active.plot.file}`}
                    width={active.plot.width}
                    height={active.plot.height}
                    alt={active.plot.alt}
                  />
                </a>
                <figcaption>{active.plot.caption}</figcaption>
                <a
                  className={s.sourceLink}
                  href={`${import.meta.env.BASE_URL}case-studies/${active.plot.file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open full-size graph <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </figure>
            )}
            {(active.id === "sglang-autotune" || active.id === "spec5-graphs"
              ? []
              : active.paragraphs
            ).map((body) => (
              <div className={s.passage} key={body}>
                <p>
                  <EmphasizedText text={body} />
                </p>
              </div>
            ))}
            {active.chapters?.map((chapter) => (
              <section className={s.passage} key={chapter.title}>
                <h3>{chapter.title}</h3>
                {chapter.paragraphs.map((body) => (
                  <p key={body}>
                    <EmphasizedText text={body} />
                  </p>
                ))}
                {chapter.chart && <KernelBreakdown rows={chapter.chart} />}
                {chapter.table && (
                  <figure className={s.evidenceTable}>
                    <figcaption>{chapter.table.caption}</figcaption>
                    <table>
                      <thead>
                        <tr>
                          {chapter.table.headers.map((header) => (
                            <th key={header} scope="col">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {chapter.table.rows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, index) =>
                              index === 0 ? (
                                <th scope="row" key={cell}>
                                  {cell}
                                </th>
                              ) : (
                                <td key={cell}>{cell}</td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </figure>
                )}
              </section>
            ))}
            {active.link && (
              <a
                className={s.sourceLink}
                href={active.link.href}
                target="_blank"
                rel="noreferrer"
              >
                {active.link.label}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            )}
          </article>
        </dialog>
      )}
    </section>
  );
}
