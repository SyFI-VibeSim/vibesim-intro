import {
  UserRound,
  Activity,
  ScanSearch,
  Code2,
  BadgeCheck,
  ArrowUpRight,
} from "lucide-react";
import logo from "../servingstudio-symbol.svg";
import s from "./CaseInvestigation.module.css";
import { qwenRounds } from "./qwenInvestigation";

const sglangRounds = [
  {
    request: "Align ServingStudio Sim with SGLang for GLM-5.2 on four B200 GPUs.",
    steps: [
      {
        icon: Activity,
        title: "Compare the kernel timings",
        body: "I profiled SGLang and compared its kernel timings with ServingStudio Sim's predictions for the same inputs. Decode timings were close, but the MoE kernels took longer during prefill. I focused on those kernels to understand the difference.",
      },
      {
        icon: ScanSearch,
        title: "The same inputs lead to different kernel choices",
        body: "SGLang was using a different MoE kernel configuration from the one in our benchmark. When I disabled autotuning in the benchmark, I reproduced the slower timings seen in SGLang. That was unexpected: SGLang had autotuning enabled, so I needed to check why its prefill kernels were not benefiting from it.",
      },
    ],
    finding:
      "The slower prefill timings appear to come from the choice of MoE kernel. Autotuning is enabled in SGLang, but this execution path seems to be missing its results.",
  },
  {
    request:
      "Please check whether this is an issue in SGLang. If it is, fix it and profile again to see whether the gap closes.",
    steps: [
      {
        icon: ScanSearch,
        title: "Startup tuning misses the CUDA graph path",
        body: "I found that startup autotuning and prefill CUDA graphs do not call the MoE kernel in quite the same way. During graph execution, SGLang postpones the final output step, which changes the output tensor shape. FlashInfer uses that shape to look up tuning results. The results collected at startup therefore do not apply to this call.",
      },
      {
        icon: Code2,
        title: "Tune the path that prefill actually uses",
        body: "I added a tuning pass inside the graph capture context, before the graphs are recorded. This lets autotuning see the same MoE call that prefill will use. I then profiled the modified implementation again and ran a serving benchmark to check whether the change improved performance.",
      },
      {
        icon: BadgeCheck,
        title: "The serving benchmark improves",
        body: "I tested 240 requests, each with 4,096 input tokens and 8 output tokens, at concurrency 24. Across three warmed runs, median completion time fell from 44.873 s to 42.503 s, corresponding to 5.6% higher input throughput. Both versions also answered 60 of 64 questions correctly in a small GSM8K check.",
        showOutcome: true,
      },
    ],
    finding:
      "The prefill graph path was not covered by startup autotuning. Tuning that path improved serving performance in this benchmark. The PR includes the fix and instructions for reproducing the result.",
  },
];

const specRounds = [
  {
    request:
      "Align ServingStudio Sim with vLLM for GLM-5.2 with five speculative tokens on four B200 GPUs.",
    steps: [
      {
        icon: Activity,
        title: "Align the kernel timings first",
        body: "I started by checking whether ServingStudio Sim could predict how long vLLM's kernels take for the same inputs. The first comparison revealed differences in how we modeled speculative decoding: the draft model processed a different batch than we assumed, and its MoE kernels used BF16 rather than NVFP4. I corrected both in the simulator and repeated the comparison. The predicted timings now follow the measurements closely across most of the run, with some differences remaining during decode.",
        figure: {
          file: "spec5-kernel-alignment.png",
          width: 1600,
          height: 720,
          alt: "Measured kernel-path timings and ServingStudio Sim predictions across all 943 captured iterations, showing recurring workload changes and remaining timing differences.",
          caption:
            "Kernel-path comparison after the draft-model corrections, expanded to all 943 captured iterations (0–942). The wider view also exposes remaining decode-stage differences. Collective arrival waiting is excluded; this is not the full physical GPU busy time.",
        },
      },
      {
        icon: Activity,
        title: "The overall GPU time still does not agree",
        body: "The kernel comparison looked much better, but it did not explain the full iteration. The measured GPU busy time remained longer than predicted. Over a wider interval, the prediction rose and fell with the workload while the measured GPU timeline stayed much flatter. I checked the timing definitions and the original trace before attributing this difference to the model.",
        figure: {
          file: "spec5-sawtooth.png",
          width: 1971,
          height: 1280,
          alt: "The ServingStudio Sim prediction repeatedly rises and falls while the measured vLLM GPU timeline remains flatter.",
          caption:
            "The wider comparison that prompted a closer look at the trace. The lower panel expands the interval from 12 to 95 seconds.",
        },
      },
      {
        icon: ScanSearch,
        title: "The GPUs reach communication at different times",
        body: "The trace shows that the GPUs do not start corresponding collective operations together. In iteration 200, their first kernels start within 0.772 ms of one another, yet waiting at collectives adds up to 26.001 ms. The delay therefore accumulates during the iteration. This is the part of the trace I would inspect next.",
      },
    ],
    finding:
      "The kernel timings alone do not explain the extra GPU time. The GPUs spend additional time waiting for one another at communication operations; the next question is what makes them arrive at different times.",
  },
  {
    request:
      "I looked at that part of the trace. There are a lot of individual kernel launches, so I suspect CPU launch overhead. Is this running eagerly while the non-speculative path uses CUDA graphs? Please investigate and fix the cause.",
    steps: [
      {
        icon: Activity,
        title: "Yes, this path is running eagerly",
        body: "I checked the CUDA API calls. In iterations 376–400, the speculative path makes 835 individual kernel launches per GPU per forward pass and no graph launches. The equivalent non-speculative path uses piecewise CUDA graphs. This supports your suspicion that CPU launch overhead is contributing to the delay.",
      },
      {
        icon: ScanSearch,
        title: "The batch falls just outside the captured graph sizes",
        body: "With five speculative tokens, vLLM processes six positions per decode request. Its graph-size filtering keeps sizes compatible with that width. In this run, the configured limit is 2,048 tokens, but the largest retained graph is only 2,034. The common 2,048-token batches therefore fall back to eager execution.",
      },
      {
        icon: Code2,
        title: "Adjust the boundary and profile again",
        body: "I raised both the scheduler budget and the graph limit to 2,052, which is divisible by six. Raising only the graph limit did not work because vLLM capped it at the scheduler budget. The new profile confirms that graph replay is restored: the same diagnostic window now has 79 graph launches and 261 individual kernel launches per GPU per forward pass.",
      },
      {
        icon: BadgeCheck,
        title: "Check whether the change improves performance",
        body: "Average iteration time in the diagnostic window fell from 141.048 ms to 114.903 ms. I then extended the analysis beyond that window and ran a separate benchmark without profiling. Both benchmark runs completed all 100 requests, and the 2,052-token configuration achieved 10.77% higher output throughput. Speculative acceptance also changed between the runs, so this throughput result is supporting evidence rather than a controlled measurement of graph replay alone.",
        showOutcome: true,
      },
    ],
    finding:
      "The investigation led from a timing discrepancy to a graph-size boundary in vLLM. Adjusting that boundary restored graph replay and reduced the observed delay. Some decode-kernel and scheduling differences remained, so this did not establish complete simulator alignment.",
  },
];

export function CaseInvestigation({ caseId, outcome, charts = {} }) {
  const rounds =
    caseId === "qwen-fusion"
      ? qwenRounds
      : caseId === "spec5-graphs"
        ? specRounds
        : sglangRounds;
  return (
    <section className={s.investigation} aria-labelledby="investigation-title">
      <header className={s.heading}>
        <h3 id="investigation-title">Inside the investigation</h3>
        <p>A simplified account of our team's work with the Agent.</p>
      </header>
      <ol className={s.rounds}>
        {rounds.map((round) => (
          <li className={s.round} key={round.request}>
            <div className={s.human}>
              <div className={s.role}>
                <UserRound size={20} aria-hidden="true" /> Our team
              </div>
              <p>{round.request}</p>
            </div>
            <div className={s.agent}>
              <div className={s.role}>
                <img src={logo} alt="" width="24" height="24" /> Agent
              </div>
              <ol className={s.steps}>
                {round.steps.map(
                  ({ icon: Icon, title, body, figure, chart, showOutcome }) => (
                    <li className={s.step} key={title}>
                      <Icon size={20} aria-hidden="true" />
                      <div>
                        <h4>{title}</h4>
                        <p>{body}</p>
                        {chart && charts[chart]}
                        {figure && (
                          <figure className={s.figure}>
                            <a
                              href={`${import.meta.env.BASE_URL}case-studies/${figure.file}`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Open full-size graph: ${title}`}
                            >
                              <img
                                src={`${import.meta.env.BASE_URL}case-studies/${figure.file}`}
                                width={figure.width}
                                height={figure.height}
                                alt={figure.alt}
                              />
                            </a>
                            <figcaption>{figure.caption}</figcaption>
                            <a
                              className={s.figureLink}
                              href={`${import.meta.env.BASE_URL}case-studies/${figure.file}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open full-size graph{" "}
                              <ArrowUpRight size={16} aria-hidden="true" />
                            </a>
                          </figure>
                        )}
                        {showOutcome && outcome}
                      </div>
                    </li>
                  ),
                )}
              </ol>
              <div className={s.finding}>
                <strong>Conclusion</strong>
                <p>{round.finding}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
