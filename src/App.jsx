import { useState } from "react";
import vibeSimLogo from "./vibesim-logo.png";
import {
  Activity,
  ArrowRight,
  ArrowLeftRight,
  BadgeCheck,
  Bot,
  Boxes,
  ChartNoAxesCombined,
  Crosshair,
  Database,
  Eye,
  Gauge,
  PanelsTopLeft,
  SlidersHorizontal,
  TimerReset,
  Wrench,
  Workflow,
} from "lucide-react";

const experimentTypes = [
  {
    title: "Simulation",
    icon: Activity,
    tone: "blue",
    description:
      "Run end-to-end serving experiments and measure TTFT, TPOT, throughput, kernel popularity, and bottlenecks.",
    detail: "End-to-end performance",
  },
  {
    title: "Sweep",
    icon: SlidersHorizontal,
    tone: "green",
    description:
      "Explore multiple axes, constraints, and compound searches in parallel to tune parameters and locate turning points.",
    detail: "Parallel parameter search",
  },
  {
    title: "Timing Prediction",
    icon: TimerReset,
    tone: "violet",
    description:
      "Predict iteration-level kernel timings directly from an architecture and its inputs for focused debugging.",
    detail: "Kernel-level diagnosis",
  },
  {
    title: "Align Sim to Real",
    icon: Gauge,
    tone: "orange",
    description:
      "Calibrate VibeSim against vLLM or SGLang traces, from kernel mapping through full-system accuracy.",
    detail: "Calibrate the simulator",
  },
  {
    title: "Align Real to Sim",
    icon: ArrowLeftRight,
    tone: "cyan",
    description:
      "Compare a custom serving stack with simulation to expose and fix inefficiencies in the real framework.",
    detail: "Optimize real systems",
  },
];

const architectureLayers = [
  {
    level: "L1",
    title: "Kernels",
    description:
      "Python wrappers, profiling data, Rust registration, and the performance cache.",
  },
  {
    level: "L2",
    title: "Operations",
    description: "Kernel sequences that always execute together.",
  },
  {
    level: "L3",
    title: "Worklets",
    description: "Operation groups bounded by inter-device synchronization.",
  },
  {
    level: "L4",
    title: "Architecture",
    description: "One model paired with its parallelism configuration.",
  },
  {
    level: "L5",
    title: "Worker",
    description: "Architectures, KV cache, admission control, and request state.",
  },
  {
    level: "L6",
    title: "Pools and deployments",
    description: "Coordinated worker roles connected through message passing.",
  },
  {
    level: "L7",
    title: "Simulation infrastructure",
    description: "Request frontend, timing loop, logging, and runtime services.",
  },
];

// Keep this list aligned with analyzer/rust/src/registry.rs::SUBJECTS.
const analyzerSubjects = [
  "slo-general",
  "slo-detailed",
  "slo-goodput",
  "throughput",
  "utilization",
  "batch",
  "kernel-throughput",
  "kernel-input-distribution",
  "kernel-time-share",
  "optimality",
  "concurrency",
  "request-state",
  "workload-conservation",
  "kv-occupancy",
  "alignment-iteration",
  "alignment-timeline",
  "alignment-workload",
  "alignment-e2e",
];

const analyzerSubjectRows = [
  analyzerSubjects.filter((_, subjectIndex) => subjectIndex % 2 === 0),
  analyzerSubjects.filter((_, subjectIndex) => subjectIndex % 2 === 1),
];

const connectedComponents = [
  {
    title: "Analyzer",
    icon: ChartNoAxesCombined,
    role: "Run intelligence",
    description:
      "18 subjects turn run artifacts into reports, plots, and MCP evidence.",
    visual: "analyzer",
  },
  {
    title: "Agent",
    icon: Bot,
    role: "Development system",
    description:
      "A two-role loop develops and debugs the simulator in isolation.",
    visual: "agent",
  },
  {
    title: "UI",
    icon: PanelsTopLeft,
    role: "Shared visual workspace",
    description:
      "Joins Analyzer resources with the conversation that acts on them.",
    visual: "ui",
  },
];

function AnalyzerSubjectReel() {
  return (
    <div
      className="subject-reel"
      aria-label={`Analyzer subjects: ${analyzerSubjects.join(", ")}`}
      tabIndex="0"
    >
      {analyzerSubjectRows.map((subjectRow) => (
        <div className="subject-reel__row" key={subjectRow[0]}>
          <div className="subject-reel__track">
            {[false, true].map((isDuplicate) => (
              <div
                className="subject-reel__group"
                key={isDuplicate ? "duplicate" : "primary"}
                aria-hidden={isDuplicate || undefined}
              >
                {subjectRow.map((subject) => (
                  <span key={subject}>{subject}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentLoop() {
  return (
    <div
      className="system-agent-loop"
      role="img"
      aria-label="Orchestrator delegates a task to the Implementor, and the Implementor returns evidence to the Orchestrator"
    >
      <div className="system-agent-loop__role system-agent-loop__role--orchestrator">
        <Workflow aria-hidden="true" strokeWidth={1.8} />
        <span>Orchestrator</span>
      </div>
      <div className="system-agent-loop__handoffs" aria-hidden="true">
        <div>
          <span>Task</span>
          <i>→</i>
        </div>
        <div>
          <i>←</i>
          <span>Evidence</span>
        </div>
      </div>
      <div className="system-agent-loop__role system-agent-loop__role--implementor">
        <Bot aria-hidden="true" strokeWidth={1.8} />
        <span>Implementor</span>
      </div>
    </div>
  );
}

function UiContextLinks() {
  return (
    <div
      className="ui-context-links"
      role="img"
      aria-label="The UI displays Analyzer artifacts and sends selected result context to the Agent"
    >
      <div className="ui-context-links__source">
        <ChartNoAxesCombined aria-hidden="true" strokeWidth={1.8} />
        <strong>Analyzer</strong>
        <span>Runs + predictions</span>
      </div>
      <ArrowLeftRight aria-hidden="true" strokeWidth={1.8} />
      <div className="ui-context-links__hub">
        <PanelsTopLeft aria-hidden="true" strokeWidth={1.8} />
        <span>Explore + select</span>
      </div>
      <ArrowLeftRight aria-hidden="true" strokeWidth={1.8} />
      <div className="ui-context-links__source">
        <Bot aria-hidden="true" strokeWidth={1.8} />
        <strong>Agent</strong>
        <span>Selected context</span>
      </div>
    </div>
  );
}

function ConnectedComponentVisual({ visual }) {
  if (visual === "analyzer") {
    return <AnalyzerSubjectReel />;
  }
  if (visual === "agent") {
    return <AgentLoop />;
  }
  return <UiContextLinks />;
}

const advantages = [
  {
    title: "Flexible configuration",
    icon: Boxes,
    tone: "blue",
    summary:
      "Model serving systems across architectures, parallelism strategies, and cluster deployments without rebuilding the simulator.",
  },
  {
    title: "High-speed simulation",
    icon: Gauge,
    tone: "green",
    summary:
      "Study steady-state behavior over days or weeks of workload without deploying the serving system at production scale.",
  },
  {
    title: "Accurate estimation",
    icon: Crosshair,
    tone: "violet",
    summary:
      "Ground predictions in measured kernels and calibrate the complete model against real serving frameworks.",
  },
  {
    title: "Full observability",
    icon: Eye,
    tone: "orange",
    summary:
      "Inspect every iteration and request with a level of visibility that production serving systems cannot provide.",
  },
  {
    title: "Agent-friendly interface",
    icon: Bot,
    tone: "cyan",
    summary:
      "Use hierarchical skills, automated alignment, and a web UI to develop and optimize serving systems without learning VibeSim internals.",
  },
];

function LogoMark() {
  return (
    <span className="logo-crop" role="img" aria-label="VibeSim logo mark">
      <img
        className="logo-crop__source"
        src={vibeSimLogo}
        alt=""
        aria-hidden="true"
      />
    </span>
  );
}

function Hero() {
  return (
    <main className="hero">
      <div className="hero__glow hero__glow--blue" aria-hidden="true" />
      <div className="hero__glow hero__glow--violet" aria-hidden="true" />

      <section className="hero__content" aria-labelledby="page-title">
        <div className="brand-lockup">
          <LogoMark />
          <h1 id="page-title" className="brand-name">
            VibeSim
          </h1>
        </div>

        <p className="tagline">
          <span>Simulate.</span>
          <span>Understand.</span>
          <span>Optimize.</span>
          <span>
            LLM Serving at <strong>Scale.</strong>
          </span>
        </p>
      </section>
    </main>
  );
}

function ExperimentCard({ experiment, index }) {
  const Icon = experiment.icon;

  return (
    <article className={`experiment-card experiment-card--${experiment.tone}`}>
      <div className="experiment-card__topline">
        <span className="experiment-card__number">0{index + 1}</span>
        <span className="experiment-card__detail">{experiment.detail}</span>
      </div>
      <div className="experiment-card__icon" aria-hidden="true">
        <Icon strokeWidth={1.8} />
      </div>
      <h3>{experiment.title}</h3>
      <p>{experiment.description}</p>
      <div className="experiment-card__rule" aria-hidden="true" />
    </article>
  );
}

function Experiments() {
  return (
    <section className="experiments" aria-labelledby="experiments-title">
      <div className="section-heading">
        <div className="section-heading__title">
          <span className="section-heading__icon" aria-hidden="true">
            <Workflow strokeWidth={1.8} />
          </span>
          <h2 id="experiments-title">What VibeSim can do</h2>
        </div>
        <p>
          Move fluidly from broad configuration search to kernel-level diagnosis,
          then close the loop between simulation and production.
        </p>
      </div>

      <div className="experiment-grid">
        {experimentTypes.map((experiment, index) => (
          <ExperimentCard
            key={experiment.title}
            experiment={experiment}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

function Components() {
  return (
    <section className="components" aria-labelledby="components-title">
      <div className="section-heading">
        <div className="section-heading__title">
          <span className="section-heading__icon" aria-hidden="true">
            <Boxes strokeWidth={1.8} />
          </span>
          <h2 id="components-title">The system behind every experiment</h2>
        </div>
        <p>
          VibeSim connects measured kernels to complete serving systems, then
          carries each run into analysis, agent workflows, and the UI.
        </p>
      </div>

      <div className="components-layout">
        <article className="simulator-core">
          <div className="simulator-core__heading">
            <span>Simulator core</span>
            <strong>Seven composable layers</strong>
          </div>

          <div className="layer-stack">
            {architectureLayers.map((architectureLayer) => (
              <div className="layer-row" key={architectureLayer.level}>
                <span className="layer-row__level">
                  {architectureLayer.level}
                </span>
                <div>
                  <h3>{architectureLayer.title}</h3>
                  <p>{architectureLayer.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="connected-components" aria-label="Connected systems">
          {connectedComponents.map((connectedComponent) => {
            const Icon = connectedComponent.icon;

            return (
              <article className="connected-component" key={connectedComponent.title}>
                <div className="connected-component__heading">
                  <div>
                    <h3>{connectedComponent.title}</h3>
                    <strong>{connectedComponent.role}</strong>
                  </div>
                  <div className="connected-component__icon" aria-hidden="true">
                    <Icon strokeWidth={1.8} />
                  </div>
                </div>

                <p className="connected-component__description">
                  {connectedComponent.description}
                </p>

                <ConnectedComponentVisual visual={connectedComponent.visual} />
              </article>
            );
          })}
        </aside>
      </div>
    </section>
  );
}

function AdvantageVisual({ advantageIndex }) {
  if (advantageIndex === 0) {
    return (
      <div className="configuration-visual advantage-detail__visual">
        <div className="configuration-axes">
          <div className="configuration-axis">
            <span>Model</span>
            <div className="configuration-models">
              <strong>Llama 3 8B</strong>
              <strong>Qwen3 235B</strong>
              <strong>Qwen3.6 35B-A3B</strong>
              <strong>GLM-5.2</strong>
            </div>
          </div>
          <div className="configuration-axis">
            <span>Parallelism</span>
            <div className="configuration-chips">
              <strong>TP</strong>
              <strong>EP</strong>
              <strong>DP</strong>
              <strong>PP</strong>
            </div>
          </div>
          <div className="configuration-axis">
            <span>Deployment</span>
            <strong>Unified</strong>
            <strong>PD</strong>
            <strong>AFD</strong>
          </div>
        </div>
        <div className="configuration-output">
          <Boxes aria-hidden="true" strokeWidth={1.8} />
          <div>
            <span>Composable by design</span>
            <strong>Change one axis while reusing the rest of the stack.</strong>
          </div>
        </div>
      </div>
    );
  }

  if (advantageIndex === 1) {
    return (
      <div className="speed-visual advantage-detail__visual">
        <div className="speed-metrics">
          <div className="speed-metric">
            <strong>2,500×</strong>
            <span>Small models</span>
          </div>
          <div className="speed-metric">
            <strong>200×</strong>
            <span>GLM-5.2 scale</span>
          </div>
          <div className="speed-metric">
            <strong>50-100×</strong>
            <span>PD and AFD</span>
          </div>
        </div>
        <div className="speed-horizon">
          <Gauge aria-hidden="true" strokeWidth={1.8} />
          <div>
            <span>Long-horizon simulation</span>
            <strong>Study days or weeks of workload, then sweep configurations in parallel.</strong>
          </div>
        </div>
      </div>
    );
  }

  if (advantageIndex === 2) {
    const evidenceStages = [
      { label: "GPU kernels", icon: Activity },
      { label: "profile.db", icon: Database },
      { label: "Timing cache", icon: TimerReset },
      { label: "Calibration", icon: Crosshair },
    ];

    return (
      <div className="accuracy-visual advantage-detail__visual">
        <div className="evidence-chain">
          {evidenceStages.map((evidenceStage, evidenceStageIndex) => {
            const EvidenceIcon = evidenceStage.icon;

            return (
              <div className="evidence-chain__item" key={evidenceStage.label}>
                <div className="evidence-stage">
                  <EvidenceIcon aria-hidden="true" strokeWidth={1.8} />
                  <span>{evidenceStage.label}</span>
                </div>
                {evidenceStageIndex < evidenceStages.length - 1 && (
                  <ArrowRight className="evidence-arrow" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
        <div className="accuracy-result">
          <strong>&lt;10%</strong>
          <div>
            <span>Typical time-prediction error</span>
            <p>Validated against vLLM and SGLang across most configurations.</p>
          </div>
        </div>
      </div>
    );
  }

  if (advantageIndex === 3) {
    return (
      <div className="observability-visual advantage-detail__visual">
        <div className="trace-canvas">
          <div className="trace-canvas__header">
            <div>
              <span>Trace scope</span>
              <strong>One simulated iteration</strong>
            </div>
            <span>CostTree + request state</span>
          </div>

          <div className="trace-axis" aria-hidden="true">
            <span>t0</span><span>t1</span><span>t2</span><span>t3</span><span>t4</span>
          </div>

          <div className="trace-timeline" aria-label="Schematic synchronized event trace">
            <div className="trace-cursor" aria-hidden="true" />
            <div className="trace-swimlane">
              <span>Kernel</span>
              <div className="trace-track">
                <i style={{ "--event-start": "3%", "--event-width": "16%" }}>QKV</i>
                <i style={{ "--event-start": "21%", "--event-width": "25%" }}>Attention</i>
                <i style={{ "--event-start": "48%", "--event-width": "16%" }}>All-reduce</i>
                <i style={{ "--event-start": "66%", "--event-width": "30%" }}>MLP</i>
              </div>
            </div>
            <div className="trace-swimlane">
              <span>Request</span>
              <div className="trace-track">
                <i style={{ "--event-start": "0%", "--event-width": "13%" }}>Queued</i>
                <i style={{ "--event-start": "14%", "--event-width": "32%" }}>Prefill</i>
                <i style={{ "--event-start": "47%", "--event-width": "42%" }}>Decode</i>
                <i style={{ "--event-start": "90%", "--event-width": "10%" }}>Done</i>
              </div>
            </div>
            <div className="trace-swimlane">
              <span>Worker</span>
              <div className="trace-track">
                <i style={{ "--event-start": "8%", "--event-width": "14%" }}>Admit</i>
                <i style={{ "--event-start": "23%", "--event-width": "66%" }}>Execute</i>
                <i style={{ "--event-start": "90%", "--event-width": "10%" }}>Release</i>
              </div>
            </div>
          </div>
        </div>

        <aside className="trace-coverage" aria-label="Observability coverage">
          <span>Coverage</span>
          <div className="trace-coverage__item">
            <strong>Every</strong>
            <span>kernel timing</span>
          </div>
          <div className="trace-coverage__item">
            <strong>Every</strong>
            <span>iteration</span>
          </div>
          <div className="trace-coverage__item">
            <strong>Every</strong>
            <span>request state</span>
          </div>
        </aside>

        <div className="observability-note">
          <Eye aria-hidden="true" strokeWidth={1.8} />
          <div>
            <strong>Full-fidelity logging</strong>
            <span>Deep visibility without reducing simulation speed.</span>
          </div>
        </div>
      </div>
    );
  }

  const agentStages = ["Explore", "Integrate", "Simulate", "Analyze", "Optimize"];

  return (
    <div className="agent-visual advantage-detail__visual">
      <div className="agent-loop">
        {agentStages.map((agentStage, agentStageIndex) => (
          <div className="agent-loop__item" key={agentStage}>
            <span>{agentStage}</span>
            {agentStageIndex < agentStages.length - 1 && (
              <ArrowRight aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
      <div className="agent-surfaces">
        <div>
          <Wrench aria-hidden="true" strokeWidth={1.8} />
          <span>Agent</span>
          <strong>Hierarchical skills drive implementation and optimization.</strong>
        </div>
        <ArrowLeftRight className="agent-surfaces__bridge" aria-hidden="true" />
        <div>
          <PanelsTopLeft aria-hidden="true" strokeWidth={1.8} />
          <span>Web UI</span>
          <strong>Results become context for interactive debugging.</strong>
        </div>
      </div>
    </div>
  );
}

function Advantages() {
  const [selectedAdvantageIndex, setSelectedAdvantageIndex] = useState(0);
  const selectedAdvantage = advantages[selectedAdvantageIndex];
  const SelectedAdvantageIcon = selectedAdvantage.icon;

  return (
    <section className="advantages" aria-labelledby="advantages-title">
      <div className="section-heading">
        <div className="section-heading__title">
          <span className="section-heading__icon" aria-hidden="true">
            <BadgeCheck strokeWidth={1.8} />
          </span>
          <h2 id="advantages-title">Five advantages of VibeSim</h2>
        </div>
        <p>
          Configure broadly, simulate quickly, validate accurately, inspect every
          detail, and work through an agent-ready interface.
        </p>
      </div>

      <div className="advantages-layout">
        <div className="advantage-selector" role="tablist" aria-label="VibeSim advantages">
          {advantages.map((advantage, advantageIndex) => {
            const AdvantageIcon = advantage.icon;
            const isSelected = advantageIndex === selectedAdvantageIndex;

            return (
              <button
                className={`advantage-selector__card advantage-selector__card--${advantage.tone}${isSelected ? " is-selected" : ""}`}
                id={`advantage-tab-${advantageIndex}`}
                key={advantage.title}
                type="button"
                role="tab"
                aria-controls="advantage-detail"
                aria-selected={isSelected}
                onClick={() => setSelectedAdvantageIndex(advantageIndex)}
              >
                <span className="advantage-selector__icon" aria-hidden="true">
                  <AdvantageIcon strokeWidth={1.8} />
                </span>
                <span>{advantage.title}</span>
              </button>
            );
          })}
        </div>

        <article
          className={`advantage-detail advantage-detail--${selectedAdvantage.tone}`}
          id="advantage-detail"
          role="tabpanel"
          aria-labelledby={`advantage-tab-${selectedAdvantageIndex}`}
        >
          <div className="advantage-detail__content" key={selectedAdvantage.title}>
            <div className="advantage-detail__heading">
              <div className="advantage-detail__icon" aria-hidden="true">
                <SelectedAdvantageIcon strokeWidth={1.65} />
              </div>
              <h3>{selectedAdvantage.title}</h3>
            </div>
            <p className="advantage-detail__summary">{selectedAdvantage.summary}</p>
            <AdvantageVisual advantageIndex={selectedAdvantageIndex} />
          </div>
        </article>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section className="use-cases" aria-labelledby="use-cases-title">
      <div className="section-heading">
        <div className="section-heading__title">
          <span className="section-heading__icon" aria-hidden="true">
            <Wrench strokeWidth={1.8} />
          </span>
          <h2 id="use-cases-title">VibeSim in Practice</h2>
        </div>
        <p>
          Turn simulator evidence into concrete kernel changes, serving
          implementations, and workload-aware scheduling decisions.
        </p>
      </div>

      <div className="use-case-grid">
        <article className="use-case-card use-case-card--roofline">
          <div className="use-case-card__heading">
            <span className="use-case-card__icon" aria-hidden="true">
              <Crosshair strokeWidth={1.8} />
            </span>
            <h3>Find kernel optimization opportunities</h3>
          </div>
          <p>
            Optimal Analyze compares measured operators with their hardware
            limits, ranks lost wall-clock time, and gives the agent a concrete
            target to improve.
          </p>

          <div className="roofline-case">
            <div className="optimization-loop" aria-label="Optimization workflow">
              <div>
                <span>Measure</span>
                <strong>Operator time</strong>
              </div>
              <ArrowRight aria-hidden="true" strokeWidth={1.8} />
              <div>
                <span>Analyze</span>
                <strong>Rank headroom</strong>
              </div>
              <ArrowRight aria-hidden="true" strokeWidth={1.8} />
              <div>
                <span>Improve</span>
                <strong>Patch and verify</strong>
              </div>
            </div>
            <div className="optimization-target">
              <Crosshair aria-hidden="true" strokeWidth={1.8} />
              <div>
                <span>Example target</span>
                <strong>MLA QKV fusion</strong>
                <small>Fuse q_lora and kv_lora to remove a launch and memory traffic.</small>
              </div>
            </div>
          </div>
        </article>

        <article className="use-case-card use-case-card--framework">
          <div className="use-case-card__heading">
            <span className="use-case-card__icon" aria-hidden="true">
              <Workflow strokeWidth={1.8} />
            </span>
            <h3>Compose a faster framework</h3>
          </div>
          <p>
            Use simulation targets to build a real serving path, then measure it
            against an established engine under the same workload.
          </p>

          <div className="framework-comparison">
            <div>
              <span>Our framework</span>
              <strong>1.588 req/s</strong>
            </div>
            <div>
              <span>vLLM</span>
              <strong>1.261 req/s</strong>
            </div>
          </div>
          <div className="framework-result">
            <strong>+25.9%</strong>
            <span>Qwen3 235B, 4× H200, 256 matched requests</span>
          </div>
        </article>

        <article className="use-case-card use-case-card--policy">
          <div className="use-case-card__copy">
            <div className="use-case-card__heading">
              <span className="use-case-card__icon" aria-hidden="true">
                <SlidersHorizontal strokeWidth={1.8} />
              </span>
              <h3>Choose an admission policy</h3>
            </div>
            <p>
              Replay long agent sessions to see how queue order changes prefix
              reuse, completed requests, latency, and starvation risk.
            </p>
            <span className="policy-context">GLM-5.2, two simulated hours, concurrency cap 512</span>
          </div>

          <div className="policy-comparison" aria-label="GLM-5.2 admission policy comparison">
            <div>
              <span>Session-start</span>
              <strong>2,995</strong>
              <small>requests finished</small>
            </div>
            <div>
              <span>FIFO</span>
              <strong>2,293</strong>
              <small>requests finished</small>
            </div>
            <div className="is-leading">
              <span>Longest-prefix</span>
              <strong>5,248</strong>
              <small>+75.2%, needs anti-starvation</small>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Hero />
      <Experiments />
      <Components />
      <Advantages />
      <UseCases />
    </>
  );
}
