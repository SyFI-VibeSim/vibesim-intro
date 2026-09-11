import {
  Activity,
  FlaskConical,
  Code2,
  GitCompareArrows,
  BadgeCheck,
  ChartNoAxesCombined,
} from "lucide-react";
import s from "./Workflow.module.css";

const stages = [
  {
    title: "Understand the workload",
    icon: Activity,
    description:
      "Define the model, request mix, hardware and performance objective. Establish a baseline from the existing system.",
  },
  {
    title: "Explore in simulation",
    icon: FlaskConical,
    description:
      "Compare serving configurations and inspect operation costs to identify a promising improvement.",
  },
  {
    title: "Build with the Agent",
    icon: Code2,
    description:
      "Implement the selected change in a serving framework, from a kernel optimization to a new model implementation.",
  },
  {
    title: "Profile the change",
    icon: ChartNoAxesCombined,
    description:
      "Capture a GPU trace of the modified implementation. Inspect kernel timings, communication and idle gaps to see where execution time goes.",
  },
  {
    title: "Align back with simulation",
    icon: GitCompareArrows,
    description:
      "Compare predictions with the real implementation. Investigate differences in kernel timings, batching, communication and host overhead.",
  },
  {
    title: "Validate on real hardware",
    icon: BadgeCheck,
    description:
      "Check correctness and measure serving performance. Use the findings to confirm the improvement or guide another iteration.",
  },
];

export function Workflow() {
  return (
    <section
      id="workflow"
      className={`section ${s.workflow}`}
      aria-labelledby="workflow-title"
    >
      <div className={`wrap ${s.layout}`}>
        <div className={s.intro} data-reveal>
          <h2 id="workflow-title">
            From real measurements
            <br />
            to real improvements.
          </h2>
          <p>
            Explore in simulation, implement in a real system, and measure the
            result.
          </p>
        </div>
        <ol className={s.stages}>
          {stages.map(({ title, description, icon: Icon }, index) => (
            <li className={s.stage} key={title} data-reveal>
              <div className={s.marker} aria-hidden="true">
                <Icon size={28} />
                <span className={s.number}>0{index + 1}</span>
              </div>
              <div className={s.content}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
