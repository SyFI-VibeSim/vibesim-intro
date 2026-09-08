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
import { Tabs } from "../components/Tabs";
import logo from "../vibesim-logo.png";
import s from "./Workflow.module.css";

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
    <div className={`${s.view} ${s.chain}`}>
      <div className={s.box}>
        <strong>Your serving workload</strong>
        <p>The model, the hardware and the requests you actually serve.</p>
      </div>
      <span className={s.arrow} aria-hidden="true" />
      <div className={s.box}>
        <strong>Profile vLLM or SGLang</strong>
        <p>Kernel traces, request metrics and MoE routing.</p>
      </div>
      <span className={s.arrow} aria-hidden="true" />
      <div className={`${s.box} ${s.boxOut}`}>
        <strong>Build the simulation model</strong>
        <p>Ready to explore configurations against.</p>
      </div>
    </div>
  );
}

function ExploreView() {
  return (
    <div className={`${s.view} ${s.fan}`}>
      <div className={`${s.box} ${s.fanOrigin}`}>
        <strong>The system you run today</strong>
        <p>Your baseline configuration.</p>
      </div>
      <span className={s.fanOut} aria-hidden="true">
        <i />
      </span>
      <ul className={s.candidates}>
        <li className={s.box}>
          <i className={s.tip} aria-hidden="true" />
          <strong>Kernel and backend</strong>
        </li>
        <li className={s.box}>
          <i className={s.tip} aria-hidden="true" />
          <strong>Parallelism</strong>
        </li>
        <li className={s.box}>
          <i className={s.tip} aria-hidden="true" />
          <strong>Batching and KV</strong>
        </li>
      </ul>
      <span className={s.fanIn} aria-hidden="true">
        <i />
        <i className={s.tip} />
      </span>
      <div className={`${s.box} ${s.boxOut} ${s.fanPick}`}>
        <strong>One feasible target</strong>
        <p>The one you take forward.</p>
      </div>
      <p className={s.viewNote}>
        Every candidate is compared on throughput, latency and memory use, within
        the same workload and hardware.
      </p>
    </div>
  );
}

function BuildView() {
  return (
    <div className={`${s.view} ${s.branch}`}>
      <p className={s.trunkLabel}>
        The baseline stays intact and still runnable throughout, so every step below
        has something to be measured against.
      </p>
      <ol className={s.gates}>
        <li className={s.box}>
          <i className={s.tip} aria-hidden="true" />
          <strong>Code change</strong>
          <p>One focused change, built by the Agent.</p>
        </li>
        <li className={s.box}>
          <i className={s.tip} aria-hidden="true" />
          <strong>Correctness</strong>
          <p>Output and accuracy checks, before any timing.</p>
        </li>
        <li className={`${s.box} ${s.boxOut}`}>
          <i className={s.tip} aria-hidden="true" />
          <strong>Trial run</strong>
          <p>Measured, then held against the simulated target.</p>
        </li>
      </ol>
    </div>
  );
}

function AlignmentView() {
  return (
    <div className={`${s.view} ${s.ladder}`}>
      <div className={s.lane}>
        <img src={logo} alt="" />
        <strong>Simulated target</strong>
        <span>The reference</span>
      </div>
      <ul className={s.ties}>
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
      <div className={s.lane}>
        <GitBranch size={21} strokeWidth={1.6} aria-hidden="true" />
        <strong>Agent built system</strong>
        <span>The measured implementation</span>
      </div>
      <p className={s.viewNote}>
        Each tie explains part of the difference, so the remaining gap is attributed
        rather than guessed.
      </p>
    </div>
  );
}

function ValidationView() {
  return (
    <div className={`${s.view} ${s.verdict}`}>
      <ul className={s.lanes}>
        <li className={s.box}>
          <strong>Original baseline</strong>
        </li>
        <li className={s.box}>
          <strong>Final build</strong>
        </li>
      </ul>
      <span className={`${s.fanIn} ${s.fanInPair}`} aria-hidden="true">
        <i />
        <i className={s.tip} />
      </span>
      <div className={`${s.box} ${s.benchmark}`}>
        <strong>The same benchmark</strong>
        <ul className={s.checks}>
          <li>Correctness</li>
          <li>Throughput</li>
          <li>Latency</li>
          <li>Repeatability</li>
        </ul>
      </div>
      <span className={s.fanOut} aria-hidden="true">
        <i />
      </span>
      <ul className={s.outcomes}>
        <li className={`${s.box} ${s.boxOut}`}>
          <i className={s.tip} aria-hidden="true" />
          <strong>Keep it</strong>
        </li>
        <li className={s.box}>
          <i className={s.tip} aria-hidden="true" />
          <strong>Reject it</strong>
        </li>
        <li className={s.box}>
          <i className={s.tip} aria-hidden="true" />
          <strong>Measure again</strong>
        </li>
      </ul>
      <p className={s.viewNote}>
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
  return (
    <section id="workflow" className="section">
      <div className="wrap">
        <div className="section-intro" data-reveal>
          <h2>
            From real measurements
            <br className={s.headingBreak} /> to real improvements.
          </h2>
          <p>
            Explore a design, build it with the Agent, and compare it with the
            simulated target. Validate the improvement in the real framework.
          </p>
        </div>
        <div className={s.layout}>
          <Tabs
            items={stages}
            selected={selected}
            onChange={setSelected}
            label="Optimization workflow"
            orientation="vertical"
            className={s.stages}
            tabId={(stage, index) => `${id}-step-${index}`}
            panelId={`${id}-panel`}
            renderItem={(stage) => {
              const Icon = stage.icon;
              return (
                <>
                  <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                  <strong>{stage.name}</strong>
                  <ArrowRight
                    className={s.stageArrow}
                    size={18}
                    aria-hidden="true"
                  />
                </>
              );
            }}
          />
          <div
            className={s.panel}
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-step-${selected}`}
          >
            {/* Inactive views still size the shared grid, keeping navigation stationary without clipping text. */}
            <div className={s.headingStack}>
              {stages.map((stage, index) => (
                <div
                  key={stage.name}
                  className={`${s.panelHeading} ${s.layer}`}
                  data-active={selected === index}
                  aria-hidden={selected !== index}
                  inert={selected !== index}
                >
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
              ))}
            </div>
            <div className={s.visualStack}>
              {views.map((View, index) => (
                <div
                  key={stages[index].name}
                  className={`${s.visual} ${s.layer}`}
                  data-active={selected === index}
                  aria-hidden={selected !== index}
                  inert={selected !== index}
                >
                  <View />
                </div>
              ))}
            </div>
            <nav className={s.panelNav} aria-label="Workflow step navigation">
              <button
                type="button"
                disabled={selected === 0}
                onClick={() => setSelected(selected - 1)}
              >
                <ArrowLeft size={19} aria-hidden="true" />
                <span>Previous</span>
              </button>
              <span
                className={s.position}
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
                  setSelected(selected === stages.length - 1 ? 1 : selected + 1)
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
