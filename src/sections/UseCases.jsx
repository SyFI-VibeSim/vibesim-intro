import { useState } from "react";
import { useStudyReplay } from "../hooks/useStudyReplay";
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
import { Tabs } from "../components/Tabs";
import { KernelBandwidthFollowUp } from "./KernelBandwidthFollowUp";
import s from "./UseCases.module.css";
import specDepth from "../data/specDepth.json";
import glmDecode from "../data/glmDecode.json";
import llamaThroughput from "../data/llamaThroughput.json";

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

const bestSpecDepth = specDepth.rows.reduce((best, item) =>
  item.throughput > best.throughput ? item : best,
);
const deepestSpecDepth = specDepth.rows.at(-1);
const specBaseline = specDepth.rows.find((item) => item.depth === 0);

function SpeculationSearch() {
  const [depth, setDepth] = useState(bestSpecDepth.depth);
  const row =
    specDepth.rows.find((item) => item.depth === depth) ?? specDepth.rows[0];
  const maximum = Math.max(...specDepth.rows.map((item) => item.throughput));
  return (
    <div className={`${s.speculationSearch} ${s.specSweep}`}>
      <div className={s.chartMeta}>
        <span>Decode throughput · output tok/s</span>
        <span>Higher is better</span>
      </div>
      <div
        className={s.specSweepChart}
        style={{ "--depth-count": specDepth.rows.length }}
        aria-label="Single-request decode throughput by speculative depth"
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
          <dt>Decode throughput</dt>
          <dd>
            {row.throughput.toFixed(1)} <span>tok/s</span>
          </dd>
        </div>
        <div>
          <dt>Time per output token</dt>
          <dd>
            {row.tpotMs.toFixed(2)} <span>ms</span>
          </dd>
        </div>
        <div>
          <dt>Accepted draft tokens</dt>
          <dd>
            {row.acceptance
              ? (row.acceptance.mean_acceptance_length - 1).toFixed(2)
              : "0"}
            <span> / round</span>
          </dd>
        </div>
      </dl>
      <p className="caption">
        4 × B200 · TP4 + EP4 · one request at a time · median of seven requests.
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
                <th>Time per token (ms)</th>
                <th>Accepted drafts / round</th>
                <th>Throughput (tok/s)</th>
              </tr>
            </thead>
            <tbody>
              {specDepth.rows.map((item) => (
                <tr key={item.depth}>
                  <td>{item.depth === 0 ? "Off" : item.depth}</td>
                  <td>{item.tpotMs.toFixed(3)}</td>
                  <td>
                    {item.acceptance
                      ? (item.acceptance.mean_acceptance_length - 1).toFixed(3)
                      : "0"}
                  </td>
                  <td>{item.throughput.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={s.specMethod}>
          Each request has 16,384 input and 2,048 output tokens. Throughput is
          calculated from the engine decode duration, excluding the first token. The
          first request is warmup; the following seven determine the median.
        </p>
        <p className={s.specMethod}>
          At depth 8, the acceptance rates for positions 1–8 are 91.8%, 64.9%,
          30.6%, 15.5%, 11.7%, 7.1%, 6.3% and 5.5%. Each rate is the accepted count
          at that position divided by all draft rounds. Acceptance counters cover
          all eight requests and are collected separately for each depth.
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
    model: "GLM-5.2 NVFP4",
    setup: "4 × B200 · TP4 + EP4",
    question:
      "With 32 decode requests at 8K context, which GLM-5.2 operations take the most time?",
    action: "Group operation costs across all repeated layers.",
    answer:
      "Fused MoE takes 53% of this decode iteration. Inspect its cost before deciding what to optimize.",
    title: "See where each millisecond goes.",
    detail:
      "Follow an iteration down to its most expensive operations. Keep the configuration beside the result.",
  },
  {
    label: "Search configurations",
    model: "GLM-5.2 NVFP4",
    setup: "4 × B200 · TP4 + EP4",
    question:
      "For GLM-5.2 on four B200s, which speculative depth gives the best single-request decode throughput? At depth 8, acceptance by position is 91.8%, 64.9%, 30.6%, 15.5%, 11.7%, 7.1%, 6.3% and 5.5%.",
    action: "Sweep draft lengths and account for acceptance.",
    answer: `Depth ${bestSpecDepth.depth} has the highest throughput in this sweep, at ${bestSpecDepth.throughput.toFixed(1)} tok/s. Increasing draft depth further does not improve the result.`,
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
      "At 64 requests/s, output throughput is still about 6,363 tok/s, but mean first-token latency grows from 76 ms at 32 requests/s to 3.20 seconds at 64. For this workload, extra load creates waiting rather than useful throughput. Check the latency target before choosing an operating point near 32 requests/s.",
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
      "I’ll vary the number of MTP draft tokens while keeping the model, four B200 GPUs and requests fixed, then compare decode throughput and how many drafts are accepted.",
    execution: "Comparing draft depths…",
    executionDetail: "Keeping the workload fixed and comparing decode throughput.",
    steps: [
      "Send the same eight requests through req-frontend, one at a time",
      "Exclude the first request from the throughput summary",
      "Compare draft depths and inspect acceptance at each position",
    ],
    conclusion: `Depth ${bestSpecDepth.depth} reaches ${bestSpecDepth.throughput.toFixed(1)} tok/s, ${(bestSpecDepth.throughput / specBaseline.throughput).toFixed(2)} times the throughput without speculation. At depth ${deepestSpecDepth.depth}, throughput falls to ${deepestSpecDepth.throughput.toFixed(1)} tok/s. Later draft positions are accepted less often, so the additional work brings diminishing returns. These results apply to this request set; the best depth can change with the workload.`,
  },
];

// Hidden suffixes retain the final line wrapping throughout the replay.
function ReplayText({ text, chars = text.length }) {
  return (
    <>
      <span>{text.slice(0, chars)}</span>
      <span style={{ visibility: "hidden" }} aria-hidden="true">
        {text.slice(chars)}
      </span>
    </>
  );
}

function reveal(visible) {
  return {
    style: { visibility: visible ? undefined : "hidden" },
    "aria-hidden": !visible,
    inert: !visible,
  };
}

const caseIcons = [Gauge, ScanLine, Search];

export function UseCases() {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  const story = agentStories[selected];
  const replay = useStudyReplay(
    selected,
    story.intro,
    example.answer,
    story.steps.length,
    story.conclusion,
    example.question,
  );
  return (
    <section id="use-cases" className={`section ${s.examplesSection}`}>
      <div className="wrap">
        <div className="section-intro" data-reveal>
          <h2>Run the study with the Agent.</h2>
          <p>
            Bring a serving question. The Agent designs the experiment, runs it,
            reads the analysis and comes back with the tradeoff.
          </p>
        </div>
        <Tabs
          label="Serving studies"
          items={examples.map((e) => e.label)}
          selected={selected}
          onChange={setSelected}
          className={`tabs ${s.exampleTabs} ${s.caseSelector}`}
          panelId="case-conversation"
          labelFor={(label) => label}
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
          ref={replay.ref}
          data-replay-stage={replay.stage}
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
                  <p aria-label={example.question}>
                    {example.question
                      .trim()
                      .split(/\s+/)
                      .map((word, index) => (
                        <span
                          key={index}
                          aria-hidden="true"
                          style={{
                            visibility:
                              replay.stage === -1 && index >= replay.chars
                                ? "hidden"
                                : "visible",
                          }}
                        >
                          {index > 0 ? " " : ""}
                          {word}
                        </span>
                      ))}
                  </p>
                </div>
              </div>
              <div className={s.userAvatar} aria-hidden="true">
                <UserRound size={23} strokeWidth={1.7} />
              </div>
            </div>
            <div className={s.replyStack}>
              {replay.stage === 0 && (
                <article className={s.agentTurn}>
                  <div className={s.agentAvatar}>
                    <img src={logo} alt="" />
                  </div>
                  <div className={s.agentTurnContent}>
                    <h3>VibeSim Agent</h3>
                    <div
                      className={`${s.agentMessage} ${s.thinking}`}
                      role="status"
                    >
                      <span>Thinking</span>
                      <span className={s.thinkingDots} aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  </div>
                </article>
              )}
              <article className={s.agentTurn} {...reveal(replay.stage >= 1)}>
                <div className={s.agentAvatar}>
                  <img src={logo} alt="" />
                </div>
                <div className={s.agentTurnContent}>
                  <h3>VibeSim Agent</h3>
                  <div className={s.agentMessage}>
                    <p className={s.agentIntro}>
                      <ReplayText
                        text={story.intro}
                        chars={replay.stage === 1 ? replay.chars : undefined}
                      />
                    </p>
                    <details
                      className={s.agentProgress}
                      open
                      {...reveal(replay.stage >= 2)}
                    >
                      <summary>
                        <Check size={19} />
                        <span>Experiment plan</span>
                        <ChevronDown size={18} />
                      </summary>
                      <ol>
                        {story.steps.map((step, index) => (
                          <li
                            key={step}
                            {...reveal(replay.stage >= 2 && index < replay.plans)}
                          >
                            <Check size={17} />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </details>
                    <div
                      className={s.agentExecution}
                      {...reveal(replay.stage >= 3)}
                    >
                      <SquareTerminal
                        size={22}
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                      <div>
                        <p className={s.agentExecutionTitle}>
                          <span {...reveal(replay.stage < 4)}>
                            {story.execution}
                          </span>
                          <span {...reveal(replay.stage >= 4)}>
                            {selected === 0
                              ? "Simulation complete"
                              : selected === 2
                                ? "Sweep complete"
                                : "Time prediction complete"}
                          </span>
                        </p>
                        <p className={s.agentExecutionDetail}>
                          {story.executionDetail}
                        </p>
                      </div>
                    </div>
                    <div className={s.agentAnswer} {...reveal(replay.stage >= 4)}>
                      <p>
                        <ReplayText
                          text={example.answer}
                          chars={replay.stage === 4 ? replay.chars : undefined}
                        />
                      </p>
                      <div className={s.chartReveal} {...reveal(replay.stage >= 5)}>
                        <div className={s.chartClip}>
                          <figure className={s.exampleResult}>
                            {selected !== 1 && (
                              <div className={s.exampleContext}>
                                <span>{example.model}</span>
                                <span>{example.setup}</span>
                              </div>
                            )}
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
                              <OperationChart />
                            ) : (
                              <SpeculationSearch />
                            )}
                          </figure>
                        </div>
                      </div>
                      <p
                        className={s.agentConclusion}
                        {...reveal(replay.stage >= 6)}
                      >
                        <ReplayText
                          text={story.conclusion}
                          chars={replay.stage === 6 ? replay.chars : undefined}
                        />
                      </p>
                      {selected === 1 && (
                        <details
                          className={s.inlineEvidence}
                          {...reveal(replay.stage >= 7)}
                        >
                          <summary>
                            View the recorded operation times{" "}
                            <ChevronDown size={17} />
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
                            {glmDecode.topFiveShare.toFixed(2)}% of the iteration.
                            Costs follow the critical rank and include repeated
                            layers.
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
                </div>
              </article>
            </div>
            {selected === 1 && (
              <div {...reveal(replay.stage >= 7)}>
                <KernelBandwidthFollowUp />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
