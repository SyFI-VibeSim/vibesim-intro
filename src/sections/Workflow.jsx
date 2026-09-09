import s from "./Workflow.module.css";

const stages = [
  {
    title: "Understand the workload",
    description:
      "Define the model, request mix, hardware and performance objective. Establish a baseline from the existing system.",
  },
  {
    title: "Explore in simulation",
    description:
      "Compare serving configurations and inspect operation costs to identify a promising improvement.",
  },
  {
    title: "Build with the Agent",
    description:
      "Implement the selected change in a serving framework, from a kernel optimization to a new model implementation.",
  },
  {
    title: "Align back with simulation",
    description:
      "Compare predictions with the real implementation. Investigate differences in kernel timings, batching, communication and host overhead.",
  },
  {
    title: "Validate on real hardware",
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
          {stages.map((stage, index) => (
            <li className={s.stage} key={stage.title}>
              <span className={s.number} aria-hidden="true">
                0{index + 1}
              </span>
              <div className={s.content}>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
