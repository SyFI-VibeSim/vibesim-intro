import { useId, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ArrowLeftRight,
  ScanLine,
  SlidersHorizontal,
  GitBranch,
  CircleCheck,
  Cpu,
  Activity,
  Network,
  Layers,
  FileCode2,
  Timer,
  Gauge,
  MemoryStick,
  CornerDownLeft,
} from "lucide-react";
import logo from "./vibesim-logo.png";
import "./workflow.css";

const stages = [
  {
    name: "Understand the workload",
    icon: ScanLine,
    title: "Start with the system you run.",
    description:
      "Define the workload and profile the real framework to build the simulation model.",
  },
  {
    name: "Explore in simulation",
    icon: SlidersHorizontal,
    title: "Find a design worth building.",
    description:
      "Compare supported configurations within the workload and hardware constraints. Choose one improvement to test.",
  },
  {
    name: "Build with the Agent",
    icon: GitBranch,
    title: "Turn the plan into working code.",
    description:
      "The Agent implements the chosen change, checks correctness and measures the trial. The simulated target stays the reference.",
  },
  {
    name: "Align back with simulation",
    icon: ArrowLeftRight,
    title: "Understand the remaining gap.",
    description:
      "Compare the Agent-built system with the simulated target to find where the real implementation can improve further.",
  },
  {
    name: "Final validation",
    icon: CircleCheck,
    title: "Confirm the improvement in practice.",
    description:
      "Benchmark the final build against the original baseline in the real framework, using the same hardware and workload.",
  },
];

/* Each stage gets the structure its action actually has: inputs converging into
   one model, a fan out to candidates and back in to one pick, a branch off a
   baseline that stays intact, a ladder between two stacks, and two lanes
   ending in a decision. None of these carries a magnitude; they are process
   diagrams, not measurements. */

function WorkloadView() {
  return (
    <div className="wf-view wf-chain">
      <div className="wf-box">
        <strong>Your serving workload</strong>
        <p>The model, the hardware and the requests you actually serve.</p>
      </div>
      <span className="wf-arrow" aria-hidden="true" />
      <div className="wf-box">
        <strong>Profile vLLM or SGLang</strong>
        <p>Kernel traces, request metrics and MoE routing.</p>
      </div>
      <span className="wf-arrow" aria-hidden="true" />
      <div className="wf-box wf-box--out">
        <strong>Build the simulation model</strong>
        <p>Ready to explore configurations against.</p>
      </div>
    </div>
  );
}

function ExploreView() {
  return (
    <div className="wf-view wf-fan">
      <div className="wf-box wf-fan-origin">
        <strong>The system you run today</strong>
        <p>Your baseline configuration.</p>
      </div>
      <span className="wf-fan-out" aria-hidden="true">
        <i />
      </span>
      <ul className="wf-candidates">
        <li className="wf-box">
          <i className="wf-tip" aria-hidden="true" />
          <strong>Kernel and backend</strong>
        </li>
        <li className="wf-box">
          <i className="wf-tip" aria-hidden="true" />
          <strong>Parallelism</strong>
        </li>
        <li className="wf-box">
          <i className="wf-tip" aria-hidden="true" />
          <strong>Batching and KV</strong>
        </li>
      </ul>
      <span className="wf-fan-in" aria-hidden="true">
        <i />
        <i className="wf-tip" />
      </span>
      <div className="wf-box wf-box--out wf-fan-pick">
        <strong>One feasible target</strong>
        <p>The one you take forward.</p>
      </div>
      <p className="wf-view-note">
        Every candidate is compared on throughput, latency and memory use, within
        the same workload and hardware.
      </p>
    </div>
  );
}

function BuildView() {
  return (
    <div className="wf-view wf-branch">
      <p className="wf-trunk-label">
        The baseline stays intact and still runnable throughout, so every step below
        has something to be measured against.
      </p>
      <ol className="wf-gates">
        <li className="wf-box">
          <i className="wf-tip" aria-hidden="true" />
          <strong>Code change</strong>
          <p>One focused change, built by the Agent.</p>
        </li>
        <li className="wf-box">
          <i className="wf-tip" aria-hidden="true" />
          <strong>Correctness</strong>
          <p>Output and accuracy checks, before any timing.</p>
        </li>
        <li className="wf-box wf-box--out">
          <i className="wf-tip" aria-hidden="true" />
          <strong>Trial run</strong>
          <p>Measured, then held against the simulated target.</p>
        </li>
      </ol>
    </div>
  );
}

function AlignmentView() {
  return (
    <div className="wf-view wf-ladder">
      <div className="wf-lane">
        <img src={logo} alt="" />
        <strong>Simulated target</strong>
        <span>The reference</span>
      </div>
      <ul className="wf-ties">
        <li>
          <strong>Operation costs</strong>
          <p>Kernels and batch shapes</p>
        </li>
        <li>
          <strong>Execution overhead</strong>
          <p>Launch, synchronization and scheduling</p>
        </li>
        <li>
          <strong>Request performance</strong>
          <p>Throughput and latency</p>
        </li>
      </ul>
      <div className="wf-lane">
        <GitBranch size={21} strokeWidth={1.6} aria-hidden="true" />
        <strong>Agent built system</strong>
        <span>The measured implementation</span>
      </div>
      <p className="wf-view-note">
        Each tie explains part of the difference, so the remaining gap is attributed
        rather than guessed.
      </p>
    </div>
  );
}

function ValidationView() {
  return (
    <div className="wf-view wf-verdict">
      <ul className="wf-lanes">
        <li className="wf-box">
          <strong>Original baseline</strong>
        </li>
        <li className="wf-box">
          <strong>Final build</strong>
        </li>
      </ul>
      <span className="wf-fan-in wf-fan-in--pair" aria-hidden="true">
        <i />
        <i className="wf-tip" />
      </span>
      <div className="wf-box wf-benchmark">
        <strong>The same benchmark</strong>
        <ul className="wf-checks">
          <li>Correctness</li>
          <li>Throughput</li>
          <li>Latency</li>
          <li>Repeatability</li>
        </ul>
      </div>
      <span className="wf-fan-out" aria-hidden="true">
        <i />
      </span>
      <ul className="wf-outcomes">
        <li className="wf-box wf-box--out">
          <i className="wf-tip" aria-hidden="true" />
          <strong>Keep it</strong>
        </li>
        <li className="wf-box">
          <i className="wf-tip" aria-hidden="true" />
          <strong>Reject it</strong>
        </li>
        <li className="wf-box">
          <i className="wf-tip" aria-hidden="true" />
          <strong>Measure again</strong>
        </li>
      </ul>
      <p className="wf-view-note">
        Same hardware, same workload, and an unprofiled run for the final end to end
        numbers.
      </p>
    </div>
  );
}

const views = [WorkloadView, ExploreView, BuildView, AlignmentView, ValidationView];

export function Workflow() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const changeStage = (index, focusTab = false) => {
    setSelected(index);
    if (focusTab) document.getElementById(`${id}-step-${index}`)?.focus();
  };
  return (
    <section id="workflow" className="section workflow-section">
      <div className="wrap">
        <div className="section-intro">
          <h2>
            From real measurements
            <br className="wf-heading-break" /> to real improvements.
          </h2>
          <p>
            Explore a design, build it with the Agent, and compare it with the
            simulated target. Validate the improvement in the real framework.
          </p>
        </div>
        <div className="wf-layout">
          <div
            className="wf-stages"
            role="tablist"
            aria-label="Optimization workflow"
            aria-orientation="vertical"
            onKeyDown={(event) => {
              if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))
                return;
              event.preventDefault();
              const buttons = [...event.currentTarget.querySelectorAll("button")];
              const current = buttons.indexOf(event.target.closest("button"));
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? stages.length - 1
                    : (current +
                        (event.key === "ArrowDown" ? 1 : -1) +
                        stages.length) %
                      stages.length;
              changeStage(next, true);
            }}
          >
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <button
                  key={stage.name}
                  type="button"
                  role="tab"
                  id={`${id}-step-${index}`}
                  aria-controls={`${id}-panel`}
                  aria-selected={selected === index}
                  tabIndex={selected === index ? 0 : -1}
                  onClick={() => changeStage(index)}
                >
                  <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                  <strong>{stage.name}</strong>
                  <ArrowRight
                    className="wf-stage-arrow"
                    size={18}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          <div
            className="wf-panel"
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-step-${selected}`}
          >
            {/* Inactive views still size the shared grid, keeping navigation stationary without clipping text. */}
            <div className="wf-heading-stack">
              {stages.map((stage, index) => (
                <div
                  key={stage.name}
                  className="wf-panel-heading wf-layer"
                  data-active={selected === index}
                  aria-hidden={selected !== index}
                  inert={selected !== index}
                >
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
              ))}
            </div>
            <div className="wf-visual-stack">
              {views.map((View, index) => (
                <div
                  key={stages[index].name}
                  className="wf-visual wf-layer"
                  data-active={selected === index}
                  aria-hidden={selected !== index}
                  inert={selected !== index}
                >
                  <View />
                </div>
              ))}
            </div>
            <nav className="wf-panel-nav" aria-label="Workflow step navigation">
              <button
                type="button"
                disabled={selected === 0}
                onClick={() => changeStage(selected - 1)}
              >
                <ArrowLeft size={19} aria-hidden="true" />
                <span>Previous</span>
              </button>
              <span
                className="wf-position"
                aria-label={`Step ${selected + 1} of ${stages.length}`}
              >
                {selected + 1} / {stages.length}
              </span>
              <button
                type="button"
                aria-label={
                  selected === stages.length - 1 ? "Explore again" : "Next"
                }
                onClick={() =>
                  changeStage(selected === stages.length - 1 ? 1 : selected + 1)
                }
              >
                <span>{selected === stages.length - 1 ? "Explore" : "Next"}</span>
                {selected === stages.length - 1 ? (
                  <CornerDownLeft size={19} aria-hidden="true" />
                ) : (
                  <ArrowRight size={19} aria-hidden="true" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
