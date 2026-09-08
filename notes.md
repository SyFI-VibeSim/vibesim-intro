# Notes

## 当前已确认的方向

- 这是用于宣传与传播的产品首页，不能只呈现内部模块说明书。
- 视觉要求：现代、好看、优雅、轻盈；避免硬核电子设备、电路、夸张科技感和过度装饰。
- 用户明确指定 design-taste-frontend；后续视觉实施以该技能为指导，用户偏好优先。
- 保留现有 VibeSim 标识；既有蓝色为品牌起点。暂定布局变化 6、动效 4、密度 3，尚非已验收设计。
- 先整理内容，再做视觉；最终文案、性能数字与发布事实核实后置。
- Agent 是核心组成，不能降级为附带功能图标；零代码 UI 也需要明确展示。
- 端到端价值：profile real → sim → explore → improve real → validate。
- 支持范围是主要差异点，必须有可见的分组展示，不能整体移到文档。
- 原五项优势仍须保留：灵活配置、高速模拟、准确估计、完整可观测性、Agent/UI 易用性。
- 七层架构与完整 Analyzer subject 列表可降优先级，放展开视图或文档。
- 页面区块数与顺序尚可调整；plan.md 的内容清单先于视觉布局定稿。

## 文案与证据边界

- 支持清单里的型号、架构与组合目前是候选内容；不能暗示所有模型、并行、部署、框架任意组合均受支持。
- “零代码”先描述常用探索操作，不把自定义 kernel 或真实框架开发宣称为无需代码。
- Agent 推进优化不等于无条件自动发布改动；正式措辞应匹配实际工作流。
- 性能、速度、准确性与真实优化收益的数字需有来源；不能把视觉占位当作结果。
- GitHub、文档、社区和快速开始的最终链接尚需核实；不虚构客户、推荐语或使用规模。

## 早期原型与参考

- Design references: https://linear.app/ai and https://cursor.com/product — product UI as the central demonstration, short scenario navigation, restrained surfaces.
- Preserve the site's English language and existing light blue identity.
- Desktop: scroll-driven sticky showcase and clickable scenario navigation. Mobile: compact scenario buttons.
- User explicitly requested visual design first; charts are layout previews, not measured or simulated results.
- Read operate-use-analyzer/SKILL.md. It applies when finalizing result claims; no Analyzer lookup or simulation is needed for this visual-only prototype.
- Dev server: npm run dev -- --port 5173. Sandbox cannot bind the port; server started with approved elevation.

## Style B decisions
- Soft neutral background #fafbf9, blue #315db4, dark green-gray text #253330.
- Broad rounded surfaces; editorial still-life paper asset rather than electronics or decorative floating labels.
- Natural task-based sentences. Plain source link label, no unsupported quickstart destination.
- Latest user instruction: sketches and color first; minor details later.

## B v2 decisions (supersedes old B)
- User explicitly requests immersive scenic backgrounds and wide headline; centered hero and dark-only theme are intentional authorized exceptions.
- Original blue tidal shoreline image from parent, inspected locally; no copying reference scenery.
- Natural title: Explore LLM serving before you deploy.
- Background #101e2b; surface #152637; text #edf2f6; accent #b9d9fa. Landscape fades into matching page background.

## B v3 设计审查

- 用户认为B最接近方向，但内容不清楚、设计不成熟；build成功不代表设计验收。
- 参考：https://www.apple.com/macbook-pro/ （大幅展示、功能分层）; https://linear.app/ （界面与工作上下文）; https://www.figma.com/ （产品动作叙事）。截图保存在/tmp，仅供本地研究，不用于网站。
- 应用design-taste-frontend + redesign-existing-projects。保持React/Vite/Tailwind原技术栈，替换有结构问题的呈现组件，保留已有锚点及场景。
- 用户明确接受深色沉浸式B，因此单深色主题是用户偏好；不强加浅色版本。
- 大背景之外需要可操作产品演示，而不是额外风景图片。示意图均明确标识，不虚构实测数字。
- 设计判断：技术产品，克制、有层次，variance6/motion4/density3。

## 布局约束（覆盖此前宽度方案）
用户明确要求百分比、统一对齐，且84%仍偏宽。采用单一--page-width:76%；不再设演示区独立外宽。文字可自然换行，但不用br拆分用例标题；手机允许自然折行。全幅图片不受内容容器约束。设计验收以实际浏览反馈为准，不能以构建通过替代。

## 逐节重设计与真实 UI 参考
- 已实际打开localhost:5177的Resume conversation和已有GLM对话，只读查看，无发送消息或启动实验。
- 参考AgentWorkspace.tsx的用户消息、AssistantTimeline里程碑与最终答复，以及MarkdownBody.tsx的内嵌图片、表格、证据链接。旧记录的实验支持状况不作为当前功能结论。
- 用户明确要求用例只包含一轮用户提问；Agent的计划、过程、图表与解释连续排布。结果嵌在回复中，禁止左右分栏。
- 字号：桌面区块标题约63–72px、引导22px、聊天正文20–22px、图表标注14–17px；移动正文18px。统一76%外宽保持。
- 动效仅用于消息顺序、图表出现、能力切换和流程选择。Replay由用户触发，减少动效设置禁用动画。
- 本轮未生成新图片；采用已有原创景观和代码绘制的功能图解，避免无意义装饰图。
- 曾因先引用未完成样式导致预览错误；已补齐并在main.jsx显式按基础样式→细化样式加载。后续应先完整实现配套文件，再切换预览入口。

- 最新调整：删除独立Workspace区块及三项步骤选择，避免重复Agent用例。清理组件和入口，保留用例/优势中的Agent及零代码表达。

## 2026-09-07：用例证据（覆盖早期占位约定）
应用 operate-use-analyzer；新 Llama 实验另应用 operate-run-simulation。当前没有可调用的 read_analyzer_resource MCP，改为只读获取 Analyzer 精确 HTTP endpoint；服务没有返回 citation token，因此没有编造引用 token。页面下载文件保留资源 ID、配置、数值及推导边界。

### Llama 吞吐扫描
- 实验：../main/logs/20260907_0_llama3_h200_throughput；复现命令见该目录 README.md。
- Analyzer sweep：e_5ae8104896c4411080f6c7ed328ef93f，读取 /api/v1/sweeps/{id}/payload。
- 七档到达率 1/4/8/16/32/64/128 req/s；每档 512 条合成请求、1,024 输入与 256 输出；barebone unified、BF16、1 H200、80 GB KV、gpuTimeMultiplier=1。
- 使用 decode_tps，不能使用包含 prefill 的 total_tps 冒充输出吞吐。最高测试点为 32 req/s、6409.921607175169 output tok/s；64 req/s 为 6362.841996931979，mean TTFT 从 76.48378919437528 ms 增至 3204.1286917738616 ms。
- 这是实际完成的模拟实验，并非实测 serving benchmark，也不是任意工作负载下的硬件最大吞吐。

### GLM 操作归因
- 原记录：../agent-workspaces-claude/w_b04b082bda16/repo/logs/predict_3627594e221c_glm52_nvfp4_b200_tp4_ep4_decode_b32_kv8192_popularity。
- prediction p_59f165c2c22c46c6a4f8f9bd75e6a2b0；读取 descriptor、cases、cases/0/operations/0/cost-tree。临时只读 Analyzer 在 127.0.0.1:8791 服务原日志目录。
- 使用匹配 vLLM EP4 popularity 文件，不能选无 popularity 的相邻实验。
- 分母为 cases 的 19.48533058166504 ms；cost tree 按 sum、scale 和 max 的关键 rank 归并相同操作，包含重复层。前五合计 72.6977%，MoE 53.0227%；不是五次单独 kernel launch。

### 推测深度
- 原记录：../wt-glm52-spec5/logs/20260902_2_glm52_single_decode_spec_sweep/spec_depth_comparison.md。
- 接受率：../wt-glm52-spec5/logs/20260902_0_glm52_diverse100_spec5_tp8_alignment/profile_workload/spec_decode_metrics.json。
- GLM 5.2 NVFP4、8 B200、TP8+EP8、单 decode、14,830 KV、无 prefill；六份预测 ID 及原始数值均在 src/data/specDepth.json。
- expected output = 1 + 各位置无条件接受率之和；ceiling = expected output / 预测迭代秒数。深度 1–4 复用实测 Spec5 profile 前缀，而非各自独立测量。
- 深度 5 为测试范围最高预测上限，254.04080563975992 tok/s；相对深度 4 仅增约 0.71%。不含 CPU 与 scheduler 开销，不宣称真实端到端吞吐或普适最佳深度。

验证脚本 /tmp/three-real-cases-check.mjs；截图 /tmp/real-case-{llama,glm,spec}-{desktop,mobile}.png。全部图表读取 JSON 数据；手机宽表可横向滚动并可键盘聚焦。

## 用户明确的选择器偏好
用户否定小图表导航，明确要求 icons。采用现有 lucide-react 的 Gauge、ScanLine、Search；不再把导航做成额外的数据展示区。桌面单行图标加标题，手机纵向三项；统一浅灰选中底板和淡蓝图标。截图 /tmp/case-selector-{1440,390}.png。

最新用户要求：已删除 Replay walkthrough 按钮及回放状态，并删除三例答复底部孤立的实验日期/验证状态行。来源、配置和方法留在展开详情及下载数据中，不将内部记录文案作为页面装饰。

按用户进一步反馈，已整条删除聊天底栏（Question → experiment → evidence / Explore the workflow）。不要再添加脱离对话内容的总结口号或重复导航。

## 端到端闭环重设计：来源与范围
- 设计使用 design-taste-frontend、redesign-existing-projects：现代技术产品宣传页，Geist、中性深色、统一 76% 外宽、图标导航、克制进入动效；不是新建真实工作空间 UI。
- 内容依据 main/skills/top-compose-real-framework-from-sim/SKILL.md、top-align-with-framework/SKILL.md、operate-run-alignment/SKILL.md。这里只将实际工作流转译为营销内容，没有执行真实框架改动，因此不触发优化试验的委派实施流程。
- 已核读 main/alignment/README.md、alignment/profiler/README.md、alignment/timing_predict_input/builder.py、alignment/request_population.py、launcher/alignment.py 与 alignment_config.py。真实流程区分 nsys、workload_metrics、expert_popularity；时序预测读取真实 batch 形状，完整请求运行负责 E2E 指标，模型预测与真实优化方向必须分清。
- operate-run-alignment 前部有“自动注入 multiplier”的旧表述，与后文、当前 README 和实际 launcher 不一致。以实际代码为准：模拟使用明确 worker 设置，不宣称自动吸收真实框架开销。
- 阅读 wt-glm52-spec5/progress.md 的 CUDA graph dispatch 诊断作为机制参考；该窗口存在调度差异，未拿来宣称 E2E 加速或填入虚构 A/B 数字。
- 新 Workflow.jsx + workflow.css 替换 Experiences.jsx 内旧五阶段。四个阶段：测量工作负载 → 模拟搜索 → Agent 实施 → 验证归因。原有 improve real 与 validate 的职责分别保留。
- 图形表示数据流和决策关系，不冒充实验测量图。Stage 1 区分三种证据；Stage 2 同时展示设计空间与吞吐/延迟/内存限制；Stage 3 显示单一试验、代码和正确性；Stage 4 显示匹配 A/B、三层归因和下一轮决策。
- 桌面左侧始终显示四阶段，右侧展示当前图解；手机纵向完整显示。没有新增 Replay、实验日期、来源状态条或重复底栏。
- 检查脚本 /tmp/workflow-design-check.mjs；截图 /tmp/workflow-{desktop,mobile}-{0,1,2,3}.png。四阶段切换、Up/Down/Home/End、320/390/768/1024/1440/1920 无页面溢出；axe 无违规，浏览器无错误。生产构建通过。

## 四个阶段使用不同的图形结构
用户认可内容方向，但认为四张图结构重复。本轮只修改 Workflow.jsx 与 workflow.css：测量为横向采集分流；模拟为配置—VibeSim—约束关系图；实施为保留基线的试验分支；验证为三层对照分析。字体、颜色与外部布局统一，图形构图和进入动效分别服务各阶段含义。
已逐项检查四阶段桌面截图及手机布局；320/390/768/1024/1440/1920 无页面溢出，键盘切换正常，axe 无违规，浏览器无错误。构建通过。图形继续表示流程关系，不冒充测量数据。期间其他区域有并行修改，入口同步后重新完成构建和页面检查，没有覆盖这些修改。

按用户要求，测量图中的 vLLM / SGLang 容器改为普通圆角矩形：桌面 18px、手机 12px，去掉拱形顶部。

按用户要求删除案例选择器与用户提问之间重复的 VibeSim Agent 标题栏；保留实际 Agent 回复的身份标识。

按用户要求为 You 添加用户头像，与左侧 Agent 头像对称：桌面 40px 圆角容器，手机双方均显示 32px 头像；不恢复重复聊天标题栏。

用户选定文案 A：首屏 Understand LLM performance. / Know what to improve.；说明 Ask the VibeSim Agent to compare serving configurations, explain bottlenecks, and help test improvements in your framework.；结尾 What would you like to improve? 已应用。

## why 区块的数据来源（每个数字都可追溯）
- 覆盖范围：main/simulator/src/arch/*.rs、main/model/config/*.json、main/simulator/src/deployment/。
  只宣传 H200 与 B200（用户指定），不列全部 GPU 目录。
- 速度：用户提供的 21 行部署扩展基准，存 src/data/simSpeed.json。每次运行都模拟同样的
  2,000,000 ms（33 分钟）服务。页面按用户要求展示**加速比**而不是墙上秒数：
  simulated_ms / (wall_s × 1000)，范围 14× 到 2,770×，对数轴。
  **未决事项：这 21 次测量所在的主机没有记录**，页面上写的是"某一台主机的模拟器墙上时间，随机器变化"。
  发布前需要补上主机型号。
- 对齐精度：已合并 PR #28（feat(glm52): add SGLang NVFP4 TP4 alignment）的对比表，
  GLM 5.2 NVFP4 / 4 × B200 / SGLang TP4，15 例全部接受，195 judgements，0 FAIL，0 golden drift。
  存 src/data/alignment.json，含三个指标各 15 个**有符号**误差值：kernel（2.0–5.4% 绝对）、
  e2e_mean（全部在 7% 内）、output_tps（全部在 8% 内）。
  没有采用 PR #21 的 declared exceptions（如 TTFT +35.14%），也没有在页面上放 server_ttft
  这一列（其中有 +27.26% 的离群值）；页面只展示 PR #28 自己在结论里宣称的三个指标。
- 必要工作（第六条主张）：main/logs/20260907_0_llama3_h200_throughput/rate128/reports/optimality_report.json，
  与页面用例区同一次实验（Llama 3 8B BF16，1 × H200，512 请求，1024 in / 256 out，128 req/s）。
  存 src/data/optimality.json。cluster.buckets 以 GPU-秒计，精确加回 real = 20.643573：
  hardware_necessary 9.594 (46.5%)、hardware_gap 4.420 (21.4%)、fusion 4.042 (19.6%)、
  batching 2.109 (10.2%)、excess_over_necessary 0.453 (2.2%)、idle 0.0248 (0.12%)、
  imbalance ≈0、communication 0（单卡，本来就没有跨卡通信）。
  卡片的叙事就是这组数字的反差：**GPU 利用率 99.86%，但其中 53.5% 是可避免的**。
  必要工作下界由 model/work 独立标注器从模型配置本身推出，刻意不依赖模拟器的算子拆分
  （main/model/work/README.md）。
- 可观测性钻取：src/data/glmDecode.json，一次 GLM 5.2 NVFP4 / 4 × B200 / batch 32 的解码迭代，
  19.485 ms，NVFP4 fused MoE 10.332 ms = 53.02%，前五项合计 72.70%。
  图形是"整条迭代 → 放大到占一半的那个算子"的两级缩放，不是装饰性层级图。

## why 区块被否决的几个方案（不要再做）
- SystemPicker（模型 × 硬件 × 并行 × 服务方式的交互选择器）：被用户否决，因为它暗示任意组合。
- 用 GLM 53% 成本占比当精度证据：那是成本拆分，不是精度，已换成 PR #28 的真实误差。
- 把三节内容直接堆在一起：用户明确要求重新设计。
- 六卡 bento（三行不等分）：用户改为"一条主张一整行"。
- 12 栏错落宽度（各行宽度和贴边不同）：试过，用户觉得奇怪，改回整行满宽，
  改用**右侧文案右对齐**来表达左右交替。
- Architecture and compatibility details 折叠块 + Coverage varies 脚注：用户认为是无信息的怪东西，已整段删除。

## why 区块的排版尺度
用户两次说字号太小。当前桌面：主张标题 clamp(31,2.9vw,44)px，正文 22px，小字 17px，
图表大数字 clamp(38,3.4vw,50)px，图内标签 18–20px，坐标轴 16px。行内边距 clamp(44,4.2vw,70)px。
区块允许占更多纵向空间。

## 首屏数据中心背景候选
用户要求保留暗色电影感，生成几张更贴近数据中心的首屏图供选择；结尾风景图保持原样。使用内置 imagegen 生成建筑外景、机房内部、玻璃反射三种方向，并准备实际首屏对照预览。尚未替换默认首屏。

首屏图片候选已完成（内置 image_gen）：
- A 建筑与地景：public/images/hero-datacenter-a.png。
- B 机房与光线：public/images/hero-datacenter-b.png。
- C 玻璃与倒影：public/images/hero-datacenter-c.png。
完整生成提示词：public/designs/hero-image-prompts.json。原始生成文件保留在 /home/kanzhu/.codex/generated_images/01a07d1f-91ec-79e2-92e3-2b246926b6ad/。
对照页 /designs/hero-images.html 支持 A/B/C/原版切换、查看原图和实际整页预览。仅白名单 ?hero=datacenter-a/b/c 改变首屏；默认首屏与 closing::before 继续使用 shoreline-v3.webp，等待用户选图。
已检查三张完整首屏桌面和手机截图、图片成功加载、候选切换、默认图及结尾图保持；无浏览器错误，构建通过。测试 /tmp/hero-image-options-check.mjs。图片是生成的概念背景，不宣称 VibeSim 自有数据中心。

用户已选定首屏候选 B（机房与光线），默认 Hero 改用 public/images/hero-datacenter-b.png。结尾继续使用 shoreline-v3.webp；比较页原版入口改为 ?hero=original。

支持目录：按用户要求将 Qwen3、Qwen3.6 分成独立条目，精度标签 bf16 更正为 BF16；FP8、NVFP4 保留。

用户更新结尾文案：Start exploring your serving setup with VibeSim. 替换 What would you like to improve?。

案例聊天：按用户要求在 Experiment plan 与结果之间新增执行块，吞吐量及配置搜索显示 Running simulation…，瓶颈分析显示 Running time prediction…。沿用暗色背景、圆角和现有图标；配置搜索说明实际依据为迭代预测与实测接受率。静态案例展示，不发起新的模拟任务。生产构建通过，三个案例均已验证执行块顺序，1440/390 视口无溢出和浏览器错误。

Necessary work 交互：时间块与归因条目使用同一个选中状态，点击任意一端可联动高亮，再次点击取消；原生按钮支持 Enter/Space 和可见焦点。所有非零时间块按原始占比绘制，极小/零项可通过条目选中，不人为放大图形。已检查 1440/390 截图、双向联动、取消选择、键盘操作、零项、页面溢出及 axe；无错误，构建通过。

Optimality 核实与排版修复：已阅读 main/analyzer/rust/src/optimality/README.md、levels.rs 与 run.rs。页面所有 GPU 秒/占比逐项匹配原始 optimality_report.json，99.88% 匹配 busy/real 四舍五入；这是 simulation_run，非端到端实测。通信为去除通信叶子后的差额，单卡为零；fusion 为 segmented necessary 与 scope-fused necessary 两个理论下界之差，不是直接实测未融合耗时。改为 required work、Fusion gap 等准确名称，删除保证可回收 headroom 的措辞。用户指出的是视觉拥挤：列表改为单列、固定名称/数值列间距、统一行距，移除第 2/3 项特殊零边距；头部两个指标各自独立成列，保留双向高亮。320/390/768/1024/1440/1920 无行间或名称/数值碰撞及溢出；桌面/手机截图已查看，键盘、axe、构建通过。Analyzer MCP 当前不可用，本次以原始报告与源码进行本地审计，无伪造引用 token。

通信项定义再次核实：用户质疑 Inter-GPU communication 是否真实存在。README.md:15 的原词是 communication（R4 ignore network，通信叶子置零）；prepare.rs:204 的 is_communication_kind 包含 all_reduce、all_gather、reduce_scatter、moe_alltoall、send/recv 等，并明确排除 moe_alltoall_prepare。fold.rs:301 实施通信叶子置零，levels.rs:205 以 per_config_best-ignore_network 计算桶。Inter-GPU communication 是页面改写，不是 README 原文；此口径也包含被整体归类的融合通信 kernel，不能解释成纯链路传输时长。此轮仅核实与说明，未再次改页面。

纠正 optimality 展示顺序：此前前端排列没有遵循 README，是展示错误。现在严格按 analyzer/rust/src/optimality/README.md:11–18 的逐级差额顺序排列图块及列表：idle → imbalance → batching → communication → hardware_gap → excess_over_necessary → fusion → hardware_necessary。Communication 恢复文档用词；每项新增原始 key，数值逐项核对报告不变，必要工作下界放最后。构建和浏览器顺序/高亮检查通过。

用户澄清最终顺序：下方 breakdown 的 README 扣减顺序已经正确，保留 idle→…→hardware_necessary；仅横条使用相反的堆叠顺序，让必需工作从左侧起。之前将两者混为一谈是误解。修复文字联动：移除覆盖整行的按钮伪元素，真实整行接收点击，按钮支持键盘；文字/数值悬停预览对应图块，点击持久选择，移开恢复已选项，再次点击取消。已实际验证文本 hover、文字 click、数值 click、移开后保持、键盘取消、桌面/移动布局、axe 和构建。

用户最终交互要求：只悬停，不点击固定。已删除 selectedBucket、点击处理和按钮/aria-pressed 语义；文字行与图块 hover 联动，移开或失焦默认仅高亮 model-required lower bound。保留文字行键盘 focus/blur 的等价预览。横条顺序与 breakdown 顺序保持上一轮确认不变。构建通过，浏览器验证默认高亮、文字及图块 hover、点击后移开不残留、focus/blur 恢复均通过。

按用户要求将功能区标题 Compare ideas before deployment. 改为 Explore VibeSim’s key features.，明确这一节介绍产品核心功能。仅改标题，diff 检查通过。

工作流补全 alignment 闭环：按用户要求，新增独立 Align with measurements 阶段，放在测量之后、探索之前；验证页增加 Align the new measurements 按钮，返回该阶段并转移键盘焦点。标题说明与验证说明明确实测→对齐→探索→实施→验证→回到对齐。依据 main/alignment/README.md、alignment/profiler/README.md、top-align-with-framework 与 operate-run-alignment 技能：匹配模型/硬件/请求，先核对算子覆盖与 kernel timing，再检查 GPU cycle/launch gaps，最后对比 unprofiled E2E throughput/TTFT/TPOT；不宣称自动调参消除一切误差。新增独立双列实测/模拟对照示意，无虚构数值。320/390/768/1024/1440/1920 五阶段无溢出，返回闭环、键盘、axe、构建通过；已查看桌面与手机对齐面板及手机验证面板截图。

工作流最终用户定稿（覆盖前述错误方向/删步记录）：Understand the workload → Explore in simulation → Build with the Agent → Align back with simulation → Final validation。第四步是新增在 Agent 实施后的 Align framework to VibeSim：模拟保持优化参考，核对 Agent 产物的实测与模拟目标，归因剩余 kernel/batching/host overhead，寻找继续改进真实系统的方向；不是先把模拟调到实测，也不能取代最终验证。第五步独立保留真实框架、真实硬件上的最终 correctness 与 unprofiled E2E baseline/trial benchmark（throughput/TTFT/TPOT），确认收益与波动后决定保留/拒绝/继续测量，最终返回探索。已完整读取 top-compose-real-framework-from-sim 的 Direction invariant 与 Tick/Tock/Probe：仅作为营销流程内容依据，没有运行实际实现周期。对齐页按钮进入 Final validation；最终页按钮回 Explore。用户纠正了此前方向误读和误删最终验证，本轮保留明确的五步。生产构建、五阶段六视口、键盘、两个导航按钮、axe 均通过，已查看桌面/移动最终验证截图。

工作流视觉简化最终状态（覆盖临时横向布局建议，用户明确保留左右布局）：保留左侧五步导航＋右侧卡片，重做卡片内部。Understand workload 严格为三个部分：Your serving workload（Model/Hardware/Requests 和指定说明）→ Profile vLLM or SGLang（Kernel traces/Request metrics/MoE routing）→ Build the simulation model。仅该步使用两个简单向下箭头；其他步骤分别是配置/指标对照、Agent 交付记录、目标/实测差距分析、真实框架验证表，无复杂连线或重复总结段。五步及正确 alignment 方向、独立最终实测保持。共用 Previous/Next 导航，最后 Explore 回到第二步。各标题和视觉层采用 intrinsic CSS grid 叠放（不可见层 inert/aria-hidden），所有步骤同宽同高且导航不移动，不裁切也无内滚动。最初 320px 最后一页 Explore again 换行造成15px跳动，已缩短可见按钮为 Explore（aria-label 保留 Explore again）并修复导航列宽。六视口逐步验证尺寸一致、导航坐标一致、无溢出，1440px 五张面板均 676.81×797.44px；构建、五步 axe、前后导航、循环与键盘检查通过。已查看桌面/移动第一步、桌面探索和对齐截图。

案例选择器增强可见性：保留 Gauge/ScanLine/Search 图标与三个标题，桌面字号22px、按钮高76px、图标26px；未选中项提高亮度，选中项采用浅蓝底深色字。手机19px/66px，最窄屏17px保持单行；768–900px 改纵排避免长标题挤压。已查看1440/390截图，320/390/768/900/1024/1280/1440全部文字不溢出，三个选项切换与axe通过。

用户将第一个案例标签改为 Find maximum throughput。已应用，六种视口检查完整显示。

独立产品页审查（用户明确要求 subagent judge；只审查，未改页面）：product_page_review 实看桌面1440×1000和手机390×844并切换案例。结论：视觉基础已成立，三类问题＋聊天内真实结果最清楚；发布缺口是所有主CTA仅跳案例，无真正使用/快速开始入口；证据缺公开报告/PR链接与判定条件，部分标题/模拟vs预测表述范围需核对；中段各项同等篇幅导致手机约18屏、完整五步到约第15屏才出现；缺真实产品UI使用演示与社交分享元信息。保留首屏、暗色/字号/留白、三案例和五步结构。用户进一步问能力是否讲清：主代理认为三案例明确，但首屏缺直接产品定义，真实代码实施→对齐→最终实测能力埋得较深，需强化主线而非加更多功能章节。待讨论，不擅自实施审查建议。

整页叙事调整：用户认可 VibeSim. More than a simulator. 定位引导，并要求改善整页故事。已新增 Hero 后的简短定位区，以 Simulate / Understand / Improve 三个动作解释 Simulator、Analyzer 和 Agent 实施/真实验证能力；开放排版、不增加大型卡片，保持76%对齐。页面顺序现为 Hero → Product introduction → Use cases → Workflow → Key features/evidence → Closing，将真实改进闭环提前到案例后。保留用户已确认的五步及数据/交互。案例说明改为直接解释 Agent 设置实验与读结果，功能区恢复独立的 Explore VibeSim’s key features.，避免与 workflow 标题重复。发现并修复现有支持目录连续 nowrap 条目及 why-row--wide 在手机覆盖单列规则导致的横向溢出；未改数据。新增区桌面/手机截图已查看，六视口无页面溢出，三个能力链接和axe通过，生产构建通过。主CTA尚未接实际产品/快速开始链接，未编造入口。

标题与案例选择器微调：移除 Product introduction 单独偏小的标题字号/行高/字距，沿用公共章节标题样式。实测1440px两节均63.36px，390px均40px。案例选中底色改为深蓝灰 #303b4d，边框 #53647f，浅色文字与图标。桌面和手机浏览器已核验。

## 首屏文案与第一节的取舍
- 主代理给出的判断：H1 应承担“承诺”，第一节承担“定义”；`More than a simulator.` 是否定式定位，对没听过 VibeSim 的访客第一秒是空的。用户听取后仍选择把它放到 H1，并顺势删掉第一节——即由 Hero 一次性完成定位与定义。这是用户决定，已执行。
- 因此页面现在没有任何“产品由 Simulator / Analyzer / Agent / 零代码 UI 四部分组成”的显式说明，这一层信息只能从三个案例和五步工作流间接读出。若后续觉得能力交代不够，应回到这里补，而不是再加功能章节。
- 输入空间（模型/精度/并行/部署/框架/硬件）目前仍只出现在页面最底部 key features 第一行 Flexible configuration，首屏之后很久才出现。
- 原三个箭头链接的落点核对结果（供以后不要重犯）：#use-cases 的标题是 Ask the VibeSim Agent.、#advantages 的标题是 Explore VibeSim's key features.，都与 Simulate / Understand 对不上；key features 六行里只有第一行有 id="support"，其余五行无锚点，任何深链都需要先补 id。

## 两个「with the Agent」的分工（避免再撞车）
Use cases = `Run the study with the Agent.`：提问 → 设计实验 → 跑 → 读分析 → 给取舍，全程在模拟里。
Workflow = `From real measurements to real improvements.`，其说明含 “build it with the Agent”：改真实框架代码，再回真机验证。
以后若再调这两节标题，必须保持 run the study（研究）与 build the change（实施）的先后与区别，不要两节都只说 “with the Agent”。

## 第一节的职责边界（两盒结构）
- 结构由用户指定：一个 Simulator 盒 + 一个 Agent 盒，各自列核心能力。左侧是「能建模什么」（名词类目：Models / Hardware / Serving / Results / Accuracy），右侧是「拿它做什么」（动词：Designs / Searches / Explains / Builds / Validates）。名词对动词的非对称是有意的，不要改成两侧同构。
- 每一条都必须在页面别处有支撑：Simulator 侧 = 底部 coverage 目录 + accuracy 行的 alignment 依据；Agent 侧 = Workflow 五步。往里加新条目前，先确认页面下方能兜住。
- Simulator 盒脚注沿用既有约束原文「Each of these has been built and run. The groups are not axes to multiply together.」，不得删——目录并排列出会天然暗示任意组合。
- Agent 盒脚注保留 CLI / API 那句，避免「零代码」被读成只能用界面。

## 字号只有一个来源
- 全页字号定义在 styles.css 的 :root 阶梯里。改字号改那里，不要在组件里写 px。--fs-fine 是下限（16px，手机也不降），承载坐标轴、caption、表格、脚注、导航这些最容易被写小的文字。
- 阶梯在 1279/1023/767 整体收缩，所以组件通常不需要自己写窄屏字号。仍然保留自有断点字号的只有一类：尺寸由控件宽度决定而非由阶梯决定（如 .case-selector.tabs button 在 768–1100 与 ≤359 的挤压区间、.wf-stages strong 在窄导航列），这些位置都写了注释说明。
- 手机上柱状图柱顶数值是隐藏而不是缩小：一列只有约 45px，放不下任何可读字号。信息在下方读数、aria-label 和展开表格里都有，不算丢失。
- .why-tier-panel 的 min-height 是四个 tab 的等高锁；任何改动字号、行距或内边距之后都必须重测，否则切 tab 会跳。逐区间实测值见 progress.md。

## 并发修改警告
2026-09-07 17:41–17:45 期间有另一个进程在同一 worktree 改 src/Workflow.jsx 与 src/workflow.css，把第二步的 fan 图从纵向三列重做成横向五列。按系统提示未回退。已做两件事：把对方新代码里两处 raw px（17px/16px）接回 token；删掉我此前为旧纵向布局写的 ≤600px .wf-candidates 覆盖——它会破坏新布局（新版连接线位置依赖 var(--g)，被我的 gap:18px 打乱）。以后在这个 worktree 动 workflow.* 之前先确认没有其他 agent 在写。
