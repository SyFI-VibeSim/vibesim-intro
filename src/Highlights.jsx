import { useEffect, useRef, useState } from "react";
import simSpeed from "./data/simSpeed.json";
import tiers from "./data/tiers.json";
import alignment from "./data/alignment.json";
import optimality from "./data/optimality.json";

/* The value section. Six claims, one per row, each paired with the evidence
   behind it. Every figure comes from a recorded result: the alignment table in
   merged PR #28, the analyzer optimality report and prediction payloads, and the
   deployment-scaling benchmark. Nothing here is invented. */

/* ---------- 1. Flexible configuration ---------- */

/* What the simulator implements today. Deliberately a list of built
   configurations, not a set of axes a visitor can multiply together. */
const coverage = [
  ["Models", ["Llama 3", "Qwen3", "Qwen3.6", "GLM 5.2", "DeepSeek V4"]],
  ["Precision", ["BF16", "FP8", "NVFP4"]],
  ["Parallelism", ["TP", "EP", "DP", "PP"]],
  [
    "Serving",
    ["Unified", "Prefill / decode", "Attention / FFN", "Speculative decoding"],
  ],
  ["Frameworks", ["vLLM", "SGLang"]],
  ["Hardware", ["H200", "B200"]],
];

function CoverageDirectory() {
  return (
    <dl className="why-directory">
      {coverage.map(([group, items]) => (
        <div key={group}>
          <dt>{group}</dt>
          <dd>
            {items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- 2. Fast simulation ---------- */

/* The benchmark is reported as a speedup against the serving time it stands in
   for, because that is the number that decides whether you can run the study. */
const simulatedMinutes = Math.round(simSpeed.simulated_ms / 60000);
const speedShapes = simSpeed.shapes.map((shape) => {
  const runs = simSpeed.runs.filter((run) => run.tier === shape.tier);
  const speedups = runs.map((run) => simSpeed.simulated_ms / (run.wall_s * 1000));
  const gpus = runs.map((run) => run.gpus);
  return {
    ...shape,
    runs: runs.length,
    minSpeed: Math.min(...speedups),
    maxSpeed: Math.max(...speedups),
    minGpus: Math.min(...gpus),
    maxGpus: Math.max(...gpus),
  };
});
const slowest = Math.min(...speedShapes.map((s) => s.minSpeed));
const fastest = Math.max(...speedShapes.map((s) => s.maxSpeed));
const maxGpus = Math.max(...simSpeed.runs.map((run) => run.gpus));

/* A log axis, because the set spans two and a half decades. */
const speedTicks = [10, 100, 1000];
const logLow = 1;
const logHigh = 3.5;
const logPos = (value) => ((Math.log10(value) - logLow) / (logHigh - logLow)) * 100;

const formatSpeed = (value) =>
  value >= 100
    ? Math.round(value).toLocaleString("en-US")
    : Math.round(value).toString();

function SpeedChart() {
  return (
    <figure className="why-figure-block">
      <figcaption className="why-figure-head">
        <strong>
          {formatSpeed(slowest)}
          <span>&times;</span> to {formatSpeed(fastest)}
          <span>&times;</span>
        </strong>
        <span>
          faster than the system being simulated, across all {simSpeed.runs.length}{" "}
          runs of {simulatedMinutes} serving minutes each
        </span>
      </figcaption>
      <div className="why-speed">
        {speedShapes.map((shape) => {
          const start = logPos(shape.minSpeed);
          const end = logPos(shape.maxSpeed);
          const gpuLabel =
            shape.minGpus === shape.maxGpus
              ? `${shape.minGpus} GPU${shape.minGpus > 1 ? "s" : ""}`
              : `${shape.minGpus} to ${shape.maxGpus} GPUs`;
          const label =
            Math.round(shape.minSpeed) === Math.round(shape.maxSpeed)
              ? `${formatSpeed(shape.maxSpeed)}×`
              : `${formatSpeed(shape.minSpeed)} to ${formatSpeed(shape.maxSpeed)}×`;
          return (
            <div className="why-speed-row" key={shape.tier}>
              <span className="why-speed-name">
                <strong>{shape.name}</strong>
                <span>{gpuLabel}</span>
              </span>
              <span className="why-speed-track">
                {speedTicks.map((tick) => (
                  <b key={tick} style={{ "--at": `${logPos(tick)}%` }} />
                ))}
                <i style={{ "--width": `${start}%` }} />
                {end > start ? (
                  <em
                    style={{ "--start": `${start}%`, "--width": `${end - start}%` }}
                  />
                ) : null}
              </span>
              <span className="why-speed-value">{label}</span>
            </div>
          );
        })}
        <div className="why-speed-axis" aria-hidden="true">
          <span />
          <span>
            {speedTicks.map((tick) => (
              <i key={tick} style={{ "--at": `${logPos(tick)}%` }}>
                {tick.toLocaleString("en-US")}&times;
              </i>
            ))}
          </span>
          <span>log scale</span>
        </div>
      </div>
    </figure>
  );
}

/* ---------- 3. Accurate predictions ---------- */

const errorAxis = alignment.axis_pct;

function AlignmentPlot() {
  return (
    <figure className="why-figure-block">
      <figcaption className="why-figure-head">
        <strong>
          {alignment.cases} of {alignment.cases}
        </strong>
        <span>
          cases accepted, {alignment.judgements} judgements, {alignment.failures}{" "}
          failures
        </span>
      </figcaption>
      <div className="why-plots">
        {alignment.metrics.map((metric) => (
          <div className="why-plot-row" key={metric.key}>
            <span className="why-plot-label">
              <strong>{metric.label}</strong>
              <span>{metric.claim}</span>
            </span>
            <div
              className="why-plot"
              role="img"
              aria-label={`${metric.label}: ${alignment.cases} cases, all ${metric.claim} of the framework run`}
            >
              <span className="why-plot-zero" />
              {metric.signed.map((value, index) => (
                <i
                  key={index}
                  style={{ "--at": `${50 + (value / errorAxis) * 50}%` }}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="why-plot-axis" aria-hidden="true">
          <span />
          <span>
            <i>&minus;{errorAxis}%</i>
            <i>the framework run</i>
            <i>+{errorAxis}%</i>
          </span>
        </div>
      </div>
    </figure>
  );
}

/* ---------- 4. Full observability ---------- */

/* One run, four grains. Each tab is a different analyzer payload from the same
   recorded experiment, drawn with the chart the data actually calls for, so no
   grain is a restatement of another. */

const TIERS = [
  { key: "run", name: "The run", detail: "End to end" },
  {
    key: "request",
    name: "Each request",
    detail: `${tiers.requestCdf[0].n} requests`,
  },
  {
    key: "iteration",
    name: "Each iteration",
    detail: `${tiers.iterations.iterations.toLocaleString("en-US")} steps`,
  },
  {
    key: "kernel",
    name: "Each kernel",
    detail: `${tiers.kernels.positions} positions`,
  },
];

const runSpanS = tiers.spanMs / 1000;
const runPeak = Math.max(...tiers.run.active);
const runPath = tiers.run.active
  .map((value, index) => {
    const x = (tiers.run.tMs[index] / tiers.spanMs) * 100;
    const y = 100 - (value / runPeak) * 100;
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  })
  .join(" ");

function RunPanel() {
  return (
    <div className="why-tier-panel">
      <div
        className="why-area"
        role="img"
        aria-label={`Requests in flight over ${runSpanS.toFixed(1)} seconds, peaking at ${runPeak}`}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="why-area-fill" d={`${runPath} L100 100 L0 100 Z`} />
          <path className="why-area-line" d={runPath} />
        </svg>
      </div>
      <div className="why-axis">
        <span>0 s</span>
        <span>Requests in flight</span>
        <span>{runSpanS.toFixed(1)} s</span>
      </div>
      <dl className="why-stats">
        {[
          [
            "Output",
            `${Math.round(tiers.run.totalTps).toLocaleString("en-US")} tok/s`,
          ],
          [
            "Concurrent",
            `${Math.round(tiers.run.meanConcurrent)} of ${tiers.run.peakConcurrent}`,
          ],
          ["GPU busy", `${(tiers.run.utilization * 100).toFixed(2)}%`],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* Each distribution gets an axis matched to its own spread. A CDF that only
   occupies the last fifth of a zero based axis shows nothing. */
function axisFor(values) {
  const lo = values[0];
  const hi = values[values.length - 1];
  const step = Math.pow(10, Math.floor(Math.log10(hi - lo))) / 5;
  return [
    lo < hi * 0.25 ? 0 : Math.floor(lo / step) * step,
    Math.ceil(hi / step) * step,
  ];
}
const cdfAxis = Object.fromEntries(
  tiers.requestCdf.map((metric) => [metric.key, axisFor(metric.x)]),
);
const formatAxis = (value) =>
  value >= 1000
    ? Math.round(value).toLocaleString("en-US")
    : String(Math.round(value));

function RequestPanel() {
  return (
    <div className="why-tier-panel">
      <div className="why-cdfs">
        {tiers.requestCdf.map((metric) => {
          const [lo, hi] = cdfAxis[metric.key];
          const at = (value) => ((value - lo) / (hi - lo)) * 100;
          const path = metric.x
            .map((value, index) => {
              const x = Math.min(Math.max(at(value), 0), 100);
              return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${(100 - metric.y[index]).toFixed(2)}`;
            })
            .join(" ");
          return (
            <div className="why-cdf" key={metric.key}>
              <span className="why-cdf-head">
                <strong>{metric.label}</strong>
                <span>
                  p50 {Math.round(metric.markers.p50).toLocaleString("en-US")}, p99{" "}
                  {Math.round(metric.markers.p99).toLocaleString("en-US")}{" "}
                  {metric.unit}
                </span>
              </span>
              <div
                className="why-cdf-plot"
                role="img"
                aria-label={`${metric.label} distribution over ${metric.n} requests, median ${Math.round(metric.markers.p50)} ${metric.unit}`}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d={path} />
                </svg>
                <i style={{ "--at": `${at(metric.markers.p50)}%` }} />
              </div>
              <span className="why-cdf-axis" aria-hidden="true">
                <i>{formatAxis(lo)}</i>
                <i>
                  {formatAxis(hi)} {metric.unit}
                </i>
              </span>
            </div>
          );
        })}
      </div>
      <p className="why-tier-note">
        Every curve is all {tiers.requestCdf[0].n} requests. The dot marks the
        median; the tail to its right is the one that breaks an SLO.
      </p>
    </div>
  );
}

/* Points are [time ms, batch tokens, prefill tokens, decode requests]. */
/* Each iteration's recorded duration against its iteration id. Points are
   [iteration id, duration ms, carries prefill, batch tokens]. A linear axis is
   enough here: the whole run sits between 10 and 97 ms. */
const iterAxis = Math.ceil(tiers.iterations.maxMs / 10) * 10;
const iterX = (id) => 2 + ((id - 1) / (tiers.iterations.iterations - 1)) * 96;
const iterY = (ms) => 4 + (ms / iterAxis) * 92;

function IterationPanel() {
  return (
    <div className="why-tier-panel">
      <div className="why-legend">
        <span>
          <i />
          Decode only
        </span>
        <span>
          <i className="is-prefill" />
          Carries prefill
        </span>
      </div>
      <div
        className="why-scatter"
        role="img"
        aria-label={`Duration of ${tiers.iterations.iterations} iterations. Decode iterations run near ${tiers.iterations.decode.medianMs.toFixed(0)} milliseconds and prefill iterations near ${tiers.iterations.prefill.medianMs.toFixed(0)}.`}
      >
        {[25, 50, 75].map((pct) => (
          <b key={pct} style={{ "--y": `${iterY((iterAxis * pct) / 100)}%` }}>
            {Math.round((iterAxis * pct) / 100)} ms
          </b>
        ))}
        {tiers.iterations.points.map(([id, ms, prefill]) => (
          <i
            key={id}
            className={prefill ? "is-prefill" : ""}
            style={{ "--x": `${iterX(id)}%`, "--y": `${iterY(ms)}%` }}
          />
        ))}
      </div>
      <div className="why-axis">
        <span>Iteration 1</span>
        <span>Iteration duration, 0 to {iterAxis} ms</span>
        <span>{tiers.iterations.iterations.toLocaleString("en-US")}</span>
      </div>
      <dl className="why-stats">
        {[
          ["Iterations", tiers.iterations.iterations.toLocaleString("en-US")],
          ["Decode, median", `${tiers.iterations.decode.medianMs.toFixed(1)} ms`],
          ["Prefill, median", `${tiers.iterations.prefill.medianMs.toFixed(1)} ms`],
          [
            "Busy",
            `${((tiers.iterations.busyMs / tiers.spanMs) * 100).toFixed(1)}%`,
          ],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="why-tier-note">
        The {tiers.iterations.prefill.count} prefill iterations cost about three
        times a decode iteration, which is what sets the latency every request
        feels. {tiers.iterations.plotted} of{" "}
        {tiers.iterations.iterations.toLocaleString("en-US")} are plotted, evenly
        sampled.
      </p>
    </div>
  );
}

const kernelMax = tiers.kernels.segments[0].share;
/* Only the positions that carry real weight are listed, so this tab stays the
   same height as the other three; the tail is summarised underneath. */
const kernelShown = tiers.kernels.segments.slice(0, 7);
const kernelRestShare =
  100 - kernelShown.reduce((sum, segment) => sum + segment.share, 0);
const kernelRestCount = tiers.kernels.positions - kernelShown.length;

function KernelPanel() {
  return (
    <div className="why-tier-panel">
      <div className="why-kernels">
        {kernelShown.map((segment) => (
          <div className="why-kernel-row" key={segment.name}>
            <span className="why-kernel-name">
              <strong>{segment.name}</strong>
              <span>
                {segment.scope ? `${segment.scope}, ` : ""}
                {segment.kind}
              </span>
            </span>
            <span className="why-kernel-track">
              <i style={{ "--width": `${(segment.share / kernelMax) * 100}%` }} />
            </span>
            <span className="why-kernel-value">{segment.share.toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <p className="why-tier-note">
        Every position in the model, ranked by its share of{" "}
        {(tiers.kernels.totalMs / 1000).toFixed(0)} GPU seconds. The other{" "}
        {kernelRestCount} account for {kernelRestShare.toFixed(1)}%.
      </p>
    </div>
  );
}

const tierPanels = {
  run: RunPanel,
  request: RequestPanel,
  iteration: IterationPanel,
  kernel: KernelPanel,
};

function DrilldownFigure() {
  const [active, setActive] = useState(TIERS[0].key);
  const tabs = useRef(null);
  const moveFocus = useRef(false);
  const Panel = tierPanels[active];

  /* Arrow keys change the tab, so focus has to follow it after React commits. */
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    tabs.current?.querySelector(`#why-tab-${active}`)?.focus();
  }, [active]);

  function onKeyDown(event) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = TIERS.findIndex((tier) => tier.key === active);
    moveFocus.current = true;
    setActive(TIERS[(index + step + TIERS.length) % TIERS.length].key);
  }

  return (
    <figure className="why-figure-block why-tiers">
      <div
        className="why-tier-tabs"
        role="tablist"
        aria-label="Level of detail"
        ref={tabs}
        onKeyDown={onKeyDown}
      >
        {TIERS.map((tier) => (
          <button
            key={tier.key}
            id={`why-tab-${tier.key}`}
            type="button"
            role="tab"
            aria-selected={active === tier.key}
            aria-controls={`why-panel-${tier.key}`}
            tabIndex={active === tier.key ? 0 : -1}
            onClick={() => setActive(tier.key)}
          >
            <strong>{tier.name}</strong>
            <span>{tier.detail}</span>
          </button>
        ))}
      </div>
      <div
        className="why-tier-body"
        id={`why-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`why-tab-${active}`}
        tabIndex={0}
        key={active}
      >
        <Panel />
      </div>
    </figure>
  );
}

/* ---------- 5. Locate inefficiencies ---------- */

const necessaryPct = optimality.necessaryFrac * 100;
const aboveBoundPct = 100 - necessaryPct;
const formatGpuSeconds = (value) =>
  value >= 0.01 ? value.toFixed(2) : value === 0 ? "0" : "<0.01";

function OptimalityFigure() {
  const [previewBucket, setPreviewBucket] = useState(null);
  const highlightedBucket =
    previewBucket ?? optimality.buckets.find((bucket) => bucket.necessary).name;
  const previewOnPointer = (event, name) => {
    if (event.pointerType === "mouse") setPreviewBucket(name);
  };

  return (
    <figure className="why-figure-block why-optimality">
      <figcaption className="why-figure-head why-figure-head--pair">
        <strong>
          {optimality.gpuUtilizationPct}% <b>utilized</b>
        </strong>
        <strong>
          {necessaryPct.toFixed(1)}% <b>required work</b>
        </strong>
        <span>
          {aboveBoundPct.toFixed(1)}% of simulated GPU time sits above the
          model-required lower bound.
        </span>
      </figcaption>
      <div
        className={`why-waterfall${highlightedBucket ? " has-selection" : ""}`}
        role="group"
        aria-label={`${optimality.totalGpuSeconds.toFixed(2)} GPU seconds split into ${optimality.buckets.length} named causes; ${necessaryPct.toFixed(0)} percent is work the model requires`}
      >
        {optimality.buckets
          .slice()
          .reverse()
          .filter((bucket) => bucket.frac > 0)
          .map((bucket) => (
            <span
              role="img"
              key={bucket.name}
              className={bucket.necessary ? "is-necessary" : ""}
              style={{ "--share": `${bucket.frac * 100}%` }}
              aria-label={`${bucket.name}: ${formatGpuSeconds(bucket.gpuSeconds)} GPU seconds, ${(bucket.frac * 100).toFixed(2)}%`}
              data-highlighted={highlightedBucket === bucket.name}
              title={`${bucket.name} · ${(bucket.frac * 100).toFixed(2)}%`}
              onPointerEnter={(event) => previewOnPointer(event, bucket.name)}
              onPointerLeave={() => setPreviewBucket(null)}
            />
          ))}
      </div>
      <dl className="why-buckets">
        {optimality.buckets.map((bucket) => (
          <div
            key={bucket.name}
            className={`why-bucket${bucket.necessary ? " is-necessary" : ""}${highlightedBucket === bucket.name ? " is-selected" : ""}`}
            tabIndex={0}
            title={bucket.description}
            onFocus={() => setPreviewBucket(bucket.name)}
            onBlur={() => setPreviewBucket(null)}
            onPointerEnter={(event) => previewOnPointer(event, bucket.name)}
            onPointerLeave={() => setPreviewBucket(null)}
          >
            <dt>{bucket.name}</dt>
            <dd>
              <b>{formatGpuSeconds(bucket.gpuSeconds)}</b> GPU&#8209;s
            </dd>
          </div>
        ))}
        <div className="why-buckets-total">
          <dt>Total held by the GPU</dt>
          <dd>
            <b>{optimality.totalGpuSeconds.toFixed(2)}</b> GPU&#8209;s
          </dd>
        </div>
      </dl>
    </figure>
  );
}

/* ---------- 6. A zero-code workflow ---------- */

/* The round trip. A person states a goal, three machine stages carry it out,
   and the result comes back to the same person. The two human ends run the
   full width and the machinery is inset between them, so the diagram shows
   where the boundary is instead of drawing five identical boxes in a row.
   No magnitudes appear here; this one is a diagram, not a measurement. */
const agentStages = [
  ["Agent", "Plans the experiment and decides what to compare"],
  ["Simulator", "Runs every configuration"],
  ["Analyzer", "Attributes the time and finds the limit"],
];

function AgentFigure() {
  return (
    <figure className="why-figure-block why-flow-block">
      <div className="why-flow">
        <blockquote className="why-flow-end why-flow-end--start">
          <span>You</span>
          <p>
            Find the request rate where Llama 3 8B stops keeping up on one H200.
          </p>
        </blockquote>
        <ol className="why-flow-stages">
          {agentStages.map(([stage, detail]) => (
            <li key={stage}>
              <strong>{stage}</strong>
              <span>{detail}</span>
            </li>
          ))}
        </ol>
        <div className="why-flow-end why-flow-end--finish">
          <span>Back to you</span>
          <p>Charts, tables and the reasoning, in front of you.</p>
        </div>
        <i className="why-flow-return" aria-hidden="true" />
      </div>
    </figure>
  );
}

/* ---------- The section ---------- */

const rows = [
  {
    id: "support",
    name: "Flexible configuration.",
    claim: "From dense models to modern MoEs.",
    body: `One simulator covers a dense model on a single H200 and a routed expert model spread over ${maxGpus} GPUs. Precision, parallelism and the serving strategy move with it, down to NVFP4 and a split between attention and FFN.`,
    note: "Each of these has been built and run. The groups are not axes to multiply together.",
    figure: <CoverageDirectory />,
  },
  {
    name: "Fast simulation.",
    claim: "Explore days of workload in minutes.",
    body: "The simulator is Rust, and speed was a goal, not a byproduct. A slow simulator stays stuck in the warmup phase and misses the steady state entirely.",
    note: "Llama 3 8B and Qwen3 235B. Simulator wall time on one host; it varies with the machine.",
    figure: <SpeedChart />,
  },
  {
    name: "Accurate predictions.",
    claim: "Calibrated against real serving frameworks.",
    body: "Kernel timings are profiled on real GPUs and every layer above only composes them. Alignment then measures a spread of cases on the real framework and calibrates the simulator against every one of them.",
    note: `${alignment.setup}. Source: merged pull request #28.`,
    figure: <AlignmentPlot />,
  },
  {
    name: "Full observability.",
    claim: "Inspect every detail in the run.",
    body: "The run, each request, each scheduler step and each kernel are all logged for analysis, not sampled and not traded off against speed. Instrumenting a real deployment to that depth would cost you the performance you were trying to measure.",
    note: `${tiers.setup}. ${tiers.workload}. The same campaign the alignment figures above come from.`,
    modifier: "why-row--wide",
    figure: <DrilldownFigure />,
  },
  {
    name: "Locate inefficiencies.",
    claim: "Break down the gap to optimal.",
    body: "Every simulated GPU second is attributed to a named cause and compared with the work the model configuration actually requires. A busy GPU is not the same as a useful one, and the breakdown tells you where to optimize.",
    note: `Simulated workload: ${optimality.setup}. ${optimality.workload}.`,
    figure: <OptimalityFigure />,
  },
  {
    name: "A zero-code workflow.",
    claim: "Describe the goal, get a solution.",
    body: "Tell the Agent what you want to find out. It sets up the experiment, reads the analysis and comes back with the tradeoff and the evidence.",
    note: "The same experiments are available from the command line and the API.",
    modifier: "why-row--flow",
    figure: <AgentFigure />,
  },
];

export function Advantages() {
  return (
    <section id="advantages" className="section why-section">
      <div className="wrap">
        <div className="section-intro">
          <h2>Explore VibeSim’s key features.</h2>
          <p>
            See the supported systems and the evidence behind simulation speed,
            prediction accuracy and analysis.
          </p>
        </div>

        <div className="why-rows">
          {rows.map((row, index) => (
            <article
              className={`why-row${index % 2 === 1 ? " why-row--flip" : ""}${
                row.modifier ? ` ${row.modifier}` : ""
              }`}
              id={row.id}
              key={row.name}
            >
              <div className="why-copy">
                <h3>
                  <span>{row.name}</span> {row.claim}
                </h3>
                <p>{row.body}</p>
                <span className="why-note">{row.note}</span>
              </div>
              <div className="why-figure">{row.figure}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
