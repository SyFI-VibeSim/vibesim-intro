import { useId, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ScanLine,
  Gauge,
  Search,
  UserRound,
  SquareTerminal,
} from "lucide-react";
import logo from "../vibesim-logo.png";
import s from "./UseCases.module.css";
import specDepth from "../data/specDepth.json";
import glmDecode from "../data/glmDecode.json";
import llamaThroughput from "../data/llamaThroughput.json";

export function Tabs({
  items,
  selected,
  onChange,
  label,
  className = "",
  renderItem,
  panelId,
}) {
  const id = useId();
  return (
    <div
      className={`tabs ${className}`}
      role="tablist"
      aria-label={label}
      style={{ "--selected-tab": selected }}
      onKeyDown={(event) => {
        const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        const buttons = [...event.currentTarget.querySelectorAll("button")];
        const focused = buttons.indexOf(event.target.closest("button"));
        const current = focused < 0 ? selected : focused;
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : (current + (event.key === "ArrowRight" ? 1 : -1) + items.length) %
                items.length;
        onChange(next);
        event.currentTarget.querySelectorAll("button")[next].focus();
      }}
    >
      {items.map((item, index) => (
        <button
          type="button"
          role="tab"
          key={item}
          id={`${id}-${index}`}
          aria-selected={selected === index}
          aria-label={item}
          aria-controls={panelId}
          tabIndex={selected === index ? 0 : -1}
          onClick={() => onChange(index)}
        >
          {renderItem ? renderItem(item, index) : item}
        </button>
      ))}
    </div>
  );
}

export const operations = glmDecode.operations;

export function OperationChart({ focus = false }) {
  return (
    <div className={`${s.operationChart} ${focus ? s.operationChartFocus : ""}`}>
      {operations.map((op, index) => (
        <div className={s.operation} key={op.name}>
          <div className={s.operationLabel}>
            <span>{op.name}</span>
            <strong>
              {op.time.toFixed(2)} <small>ms</small>
            </strong>
          </div>
          <div className={s.operationBar} style={{ "--bar-width": `${op.share}%` }}>
            <i />
            <span>{op.share.toFixed(1)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ThroughputChart() {
  const [point, setPoint] = useState(4);
  const row = llamaThroughput.rows[point];
  const maximum = Math.max(...llamaThroughput.rows.map((item) => item.decode_tps));
  return (
    <div className={s.llamaSweep}>
      <div className={s.chartMeta}>
        <span>Simulated output throughput · tok/s</span>
        <span>512 requests · BF16</span>
      </div>
      <div
        className={`${s.specSweepChart} ${s.llamaSweepChart}`}
        aria-label="Simulated output throughput versus incoming requests per second"
      >
        {llamaThroughput.rows.map((item, index) => (
          <button
            key={item.requestRate}
            type="button"
            aria-pressed={point === index}
            aria-label={`${item.requestRate} requests per second: ${item.decode_tps.toFixed(0)} output tokens per second`}
            onClick={() => setPoint(index)}
          >
            <strong>{Math.round(item.decode_tps).toLocaleString("en-US")}</strong>
            <div className={s.specColumn}>
              <i
                style={{
                  "--column-height": `${(100 * item.decode_tps) / maximum}%`,
                }}
              />
            </div>
            <span>{item.requestRate}</span>
          </button>
        ))}
      </div>
      <div className={s.chartAxis}>Incoming requests per second</div>
      <dl className={s.specSweepMetrics}>
        <div>
          <dt>Output throughput</dt>
          <dd>
            {Math.round(row.decode_tps).toLocaleString("en-US")} <span>tok/s</span>
          </dd>
        </div>
        <div>
          <dt>Mean first-token latency</dt>
          <dd>
            {row.ttft_mean_ms < 1000
              ? row.ttft_mean_ms.toFixed(1)
              : (row.ttft_mean_ms / 1000).toFixed(2)}{" "}
            <span>{row.ttft_mean_ms < 1000 ? "ms" : "s"}</span>
          </dd>
        </div>
        <div>
          <dt>Mean time per output token</dt>
          <dd>
            {row.tpot_mean_ms.toFixed(1)} <span>ms/token</span>
          </dd>
        </div>
      </dl>
      <p className="caption">
        1,024 input + 256 output tokens per request. All 512 requests complete at
        every load.
      </p>
      <details className={s.inlineEvidence}>
        <summary>
          View the workload and results <ChevronDown size={17} />
        </summary>
        <div className={s.operationTableWrap} tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th>Load (req/s)</th>
                <th>Output tok/s</th>
                <th>Mean TTFT (ms)</th>
                <th>Mean TPOT (ms)</th>
              </tr>
            </thead>
            <tbody>
              {llamaThroughput.rows.map((item) => (
                <tr key={item.requestRate}>
                  <td>{item.requestRate}</td>
                  <td>{item.decode_tps.toFixed(1)}</td>
                  <td>{item.ttft_mean_ms.toFixed(1)}</td>
                  <td>{item.tpot_mean_ms.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={s.specMethod}>
          A VibeSim unified-worker simulation with one H200, BF16, an 80 GB KV
          budget and fixed-length synthetic requests. These results compare the
          tested loads; they do not establish a universal maximum or a measured
          serving-framework benchmark.
        </p>
        <a
          className="text-link"
          download="llama3-h200-throughput-evidence.json"
          href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(llamaThroughput, null, 2))}`}
        >
          Download experiment data <ArrowRight size={17} />
        </a>
      </details>
    </div>
  );
}

function SpeculationSearch() {
  const [depth, setDepth] = useState(5);
  const row = specDepth.rows[depth];
  const maximum = Math.max(...specDepth.rows.map((item) => item.throughput));
  return (
    <div className={`${s.speculationSearch} ${s.specSweep}`}>
      <div className={s.chartMeta}>
        <span>Derived decode ceiling · output tok/s</span>
        <span>Higher is better</span>
      </div>
      <div
        className={s.specSweepChart}
        aria-label="Derived single-request throughput ceiling by speculative depth"
      >
        {specDepth.rows.map((item) => (
          <button
            key={item.depth}
            type="button"
            aria-pressed={depth === item.depth}
            aria-label={`${item.depth === 0 ? "No speculation" : `${item.depth} draft tokens`}: ${item.throughput.toFixed(1)} output tokens per second`}
            onClick={() => setDepth(item.depth)}
          >
            <strong>{item.throughput.toFixed(1)}</strong>
            <div className={s.specColumn}>
              <i
                style={{
                  "--column-height": `${(item.throughput / maximum) * 100}%`,
                }}
              />
            </div>
            <span>{item.depth === 0 ? "Off" : item.depth}</span>
          </button>
        ))}
      </div>
      <div className={s.chartAxis}>Draft tokens per iteration</div>
      <dl className={s.specSweepMetrics}>
        <div>
          <dt>Predicted iteration</dt>
          <dd>
            {row.iterationMs.toFixed(2)} <span>ms</span>
          </dd>
        </div>
        <div>
          <dt>Expected output</dt>
          <dd>
            {row.expectedTokens.toFixed(2)} <span>tokens / iteration</span>
          </dd>
        </div>
        <div>
          <dt>Versus no speculation</dt>
          <dd>
            {(row.throughput / specDepth.rows[0].throughput).toFixed(2)}
            <span>×</span>
          </dd>
        </div>
      </dl>
      <p className="caption">
        One decode request · 14,830 prefix KV tokens · no prefill. Uses the measured
        Spec5 acceptance profile.
      </p>
      <details className={s.inlineEvidence}>
        <summary>
          View the comparison and method <ChevronDown size={17} />
        </summary>
        <div className={s.operationTableWrap} tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th>Draft tokens</th>
                <th>Iteration (ms)</th>
                <th>Output tokens / iter</th>
                <th>Ceiling (tok/s)</th>
              </tr>
            </thead>
            <tbody>
              {specDepth.rows.map((item) => (
                <tr key={item.depth}>
                  <td>{item.depth === 0 ? "Off" : item.depth}</td>
                  <td>{item.iterationMs.toFixed(3)}</td>
                  <td>{item.expectedTokens.toFixed(3)}</td>
                  <td>{item.throughput.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={s.specMethod}>
          Expected output = 1 + the sum of per-position acceptance rates up to the
          chosen depth. Divide by the predicted iteration time to get the decode
          ceiling.
        </p>
        <p className={s.specMethod}>
          Depths 1–4 reuse the corresponding prefix of the measured Spec5 acceptance
          profile. These are kernel critical-path ceilings, excluding scheduler and
          CPU overhead. Acceptance may change in an actual deployment.
        </p>
        <a
          className="text-link"
          download="glm52-spec-depth-evidence.json"
          href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(specDepth, null, 2))}`}
        >
          Download experiment data <ArrowRight size={17} />
        </a>
      </details>
    </div>
  );
}

const examples = [
  {
    label: "Find maximum throughput",
    model: "Llama 3 8B",
    setup: "1 × H200",
    question:
      "How much output throughput can Llama 3 8B deliver on one H200 with 1,024 input and 256 output tokens per request?",
    action: "Compare concurrency under the same workload.",
    answer:
      "The highest output throughput in this sweep is about 6,410 tok/s at 32 incoming requests per second. Pushing the load higher does not improve throughput.",
    title: "Find the throughput limit.",
    detail:
      "Start with a model and GPU. Compare serving configurations before setting up a real deployment.",
  },
  {
    label: "Understand a bottleneck",
    model: "GLM 5.2 NVFP4",
    setup: "4 × B200 · TP4 + EP4",
    question:
      "With 32 decode requests at 8K context, which GLM 5.2 operations take the most time?",
    action: "Group operation costs across all repeated layers.",
    answer:
      "Fused MoE takes 53% of this decode iteration. Inspect its cost before deciding what to optimize.",
    title: "See where each millisecond goes.",
    detail:
      "Follow an iteration down to its most expensive operations. Keep the configuration beside the result.",
  },
  {
    label: "Search configurations",
    model: "GLM 5.2 NVFP4",
    setup: "8 × B200 · TP8 + EP8",
    question:
      "For GLM 5.2 on 8 B200s, how does speculative depth affect single-request decode throughput at 14,830 KV tokens?",
    action: "Sweep draft lengths and account for acceptance.",
    answer:
      "Five draft tokens give the highest ceiling among the tested depths. Most of the gain is already reached at three; the curve flattens after that.",
    title: "Compare the options that matter.",
    detail:
      "Turn a tuning question into a focused search. Understand the tradeoff before choosing a configuration.",
  },
];

const agentStories = [
  {
    execution: "Running simulation…",
    executionDetail: "Comparing seven arrival rates on one H200.",
    intro:
      "I’ll keep the BF16 model and request lengths fixed, then increase the arrival rate. I’ll compare output throughput with first-token latency so we can see where extra load stops helping.",
    steps: [
      "Use 512 requests, each with 1,024 input and 256 output tokens",
      "Simulate arrival rates of 1, 4, 8, 16, 32, 64 and 128 requests/s",
      "Compare Analyzer output throughput, TTFT and TPOT",
    ],
    conclusion:
      "At 64 requests/s, output throughput is still about 6,363 tok/s, but mean first-token latency grows from 76 ms to 3.20 seconds. For this workload, extra load creates waiting rather than useful throughput. Check the latency target before choosing an operating point near 32 requests/s.",
  },
  {
    intro:
      "I’ll use the matching vLLM EP4 popularity profile and aggregate operation costs across all repeated model layers.",
    execution: "Running time prediction…",
    executionDetail: "Calculating operation costs for one decode iteration.",
    steps: [
      "Keep 32 decode requests at 8,192 KV tokens each",
      "Predict one iteration with NVFP4 and TP4 + EP4",
      "Rank the operation costs across the full model",
    ],
    conclusion:
      "Fused MoE contributes 53.02% of the iteration, over nine times the sparse attention cost. Start by checking expert routing balance and the fused MoE path before tuning attention. These totals include repeated layers; they are not individual kernel-launch times.",
  },
  {
    intro:
      "I’ll compare no speculation with one to five MTP draft tokens, keeping the model, eight B200 GPUs and context fixed. I’ll use the measured acceptance profile to account for rejected drafts.",
    execution: "Running simulation…",
    executionDetail:
      "Comparing draft lengths using iteration predictions and measured acceptance.",
    steps: [
      "Fix one decode request at 14,830 prefix KV tokens, with no prefill",
      "Read the six Analyzer predictions for no-spec and depths 1–5",
      "Combine iteration cost with measured per-position acceptance",
    ],
    conclusion:
      "The derived ceiling rises from 98.4 tok/s without speculation to 254.0 tok/s at depth 5. Depth 3 already reaches 245.9 tok/s; adding the fifth draft token improves on depth 4 by only 0.71%. These are fixed-context kernel ceilings, not measured end-to-end serving throughput.",
  },
];

const caseIcons = [Gauge, ScanLine, Search];

export function UseCases() {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  const story = agentStories[selected];
  return (
    <section id="use-cases" className={`section ${s.examplesSection}`}>
      <div className="wrap">
        <div className="section-intro">
          <h2>Run the study with the Agent.</h2>
          <p>
            Bring a serving question. The Agent designs the experiment, runs it,
            reads the analysis and comes back with the tradeoff.
          </p>
        </div>
        <Tabs
          label="Serving examples"
          items={examples.map((e) => e.label)}
          selected={selected}
          onChange={setSelected}
          className={`${s.exampleTabs} ${s.caseSelector}`}
          panelId="case-conversation"
          renderItem={(label, index) => {
            const Icon = caseIcons[index];
            return (
              <>
                <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>{label}</span>
              </>
            );
          }}
        />
        <div
          id="case-conversation"
          className={s.conversationDemo}
          role="tabpanel"
          aria-label={example.label}
        >
          <div className={s.chatTranscript} key={selected}>
            <div className={s.chatUserTurn}>
              <div className={s.userTurnContent}>
                <h3>You</h3>
                <div className={s.userMessage}>
                  <p>{example.question}</p>
                </div>
              </div>
              <div className={s.userAvatar} aria-hidden="true">
                <UserRound size={23} strokeWidth={1.7} />
              </div>
            </div>
            <article className={s.agentTurn}>
              <div className={s.agentAvatar}>
                <img src={logo} alt="" />
              </div>
              <div className={s.agentTurnContent}>
                <h3>VibeSim Agent</h3>
                <p className={s.agentIntro}>{story.intro}</p>
                <details className={s.agentProgress} open>
                  <summary>
                    <Check size={19} />
                    <span>Experiment plan</span>
                    <ChevronDown size={18} />
                  </summary>
                  <ol>
                    {story.steps.map((step, i) => (
                      <li key={step} style={{ "--delay": `${i * 140}ms` }}>
                        <Check size={17} />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </details>
                <div className={s.agentExecution}>
                  <SquareTerminal size={22} strokeWidth={1.6} aria-hidden="true" />
                  <div>
                    <p className={s.agentExecutionTitle}>{story.execution}</p>
                    <p className={s.agentExecutionDetail}>
                      {story.executionDetail}
                    </p>
                  </div>
                </div>
                <div className={s.agentAnswer}>
                  <p>{example.answer}</p>
                  <figure className={s.exampleResult}>
                    <div className={s.exampleContext}>
                      <span>{example.model}</span>
                      <span>{example.setup}</span>
                    </div>
                    <div className={s.resultHeading}>
                      <h3>
                        {selected === 0
                          ? "Throughput and the cost of extra load"
                          : selected === 1
                            ? "The five most expensive operations"
                            : "Throughput versus draft length"}
                      </h3>
                      {selected === 1 && (
                        <div className={s.iterationTotal}>
                          <strong>19.49</strong>
                          <span>ms / iteration</span>
                        </div>
                      )}
                    </div>
                    {selected === 0 ? (
                      <ThroughputChart />
                    ) : selected === 1 ? (
                      <>
                        <OperationChart />
                        <figcaption>
                          32 concurrent decode requests · 8,192 KV tokens per
                          request
                        </figcaption>
                      </>
                    ) : (
                      <SpeculationSearch />
                    )}
                  </figure>
                  <p className={s.agentConclusion}>{story.conclusion}</p>
                  {selected === 1 && (
                    <details className={s.inlineEvidence}>
                      <summary>
                        View the recorded operation times <ChevronDown size={17} />
                      </summary>
                      <div className={s.operationTableWrap} tabIndex={0}>
                        <table>
                          <thead>
                            <tr>
                              <th>Operation</th>
                              <th>Time</th>
                              <th>Share</th>
                            </tr>
                          </thead>
                          <tbody>
                            {operations.map((op) => (
                              <tr key={op.name}>
                                <td>{op.name}</td>
                                <td>{op.time.toFixed(3)} ms</td>
                                <td>{op.share.toFixed(2)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className={s.specMethod}>
                        The five groups account for{" "}
                        {glmDecode.topFiveShare.toFixed(2)}% of the iteration. Costs
                        follow the critical rank and include repeated layers.
                      </p>
                      <a
                        className="text-link"
                        download="glm52-decode-evidence.json"
                        href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(glmDecode, null, 2))}`}
                      >
                        Download experiment data <ArrowRight size={17} />
                      </a>
                    </details>
                  )}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
