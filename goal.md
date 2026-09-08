# Goal

重新设计 VibeSim 宣传首页，帮助新访客理解产品、记住差异，并愿意使用、关注和分享。

完整呈现 Simulator、Analyzer、Agent、零代码 UI、真实系统优化闭环和支持范围。
当前集中完善 B 的现代、简洁、优雅视觉，并将三个 Agent 用例全部建立在可追溯的真实实验记录上。视觉尚待用户验收。

计划用例：Llama 3 8B 单 H200 吞吐量、GLM 5.2 操作耗时分析、推测解码 token 数搜索。
plan.md 是内容清单和执行计划的主文件；progress.md 记录实际进度；notes.md 记录决策和边界。

Style B scope: refine the selected direction and show useful Agent reasoning with recorded experiment results.

最新内容要求：三个案例都必须包含实际条件、实验结果和有根据的取舍，禁止占位曲线。区分模拟预测、实测接受率和推导指标，不把模拟吞吐当作真实框架实测成绩。

## 当前 B 方向
集中完善 B：中性深色、沉浸式背景、自然文案。全页导航、标题、演示、正文与页脚使用统一百分比容器和左右对齐线，桌面宽度 76%，两侧各 12%。不再使用不同宽度的展示容器，也不固定 1200px 宽屏上限。保持完整内容清单；视觉尚未获用户验收。

最新要求：对照主仓库plan.md逐节优化，放大正文与数据标注；先参考真实viz-ui，再将用例改成一轮用户提问和连续Agent答复，图表/表格嵌入聊天内部。先保证样式完整、预览稳定，再继续视觉迭代。

- 最新调整：删除独立Workspace区块及三项步骤选择，避免重复Agent用例。清理组件和入口，保留用例/优势中的Agent及零代码表达。

最新选择器要求：使用简洁图标，不使用缩略图表；保留紧凑标题、明确选中状态和统一对齐。

最新用户要求：已删除 Replay walkthrough 按钮及回放状态，并删除三例答复底部孤立的实验日期/验证状态行。来源、配置和方法留在展开详情及下载数据中，不将内部记录文案作为页面装饰。

按用户进一步反馈，已整条删除聊天底栏（Question → experiment → evidence / Explore the workflow）。不要再添加脱离对话内容的总结口号或重复导航。

## 端到端闭环重设计
按用户要求查阅实际 alignment 管线与优化技能，替换旧五个图标/输入输出文字区。以测量、模拟探索、Agent 实施、验证归因四阶段呈现；每阶段配实际数据流示意，不虚构性能结果。保留统一 76% 布局及当前图标选择器。已完成四阶段桌面/移动截图、键盘切换、六种视口与可访问性检查；等待用户视觉反馈。

## 四个阶段使用不同的图形结构
用户认可内容方向，但认为四张图结构重复。本轮只修改 Workflow.jsx 与 workflow.css：测量为横向采集分流；模拟为配置—VibeSim—约束关系图；实施为保留基线的试验分支；验证为三层对照分析。字体、颜色与外部布局统一，图形构图和进入动效分别服务各阶段含义。
已逐项检查四阶段桌面截图及手机布局；320/390/768/1024/1440/1920 无页面溢出，键盘切换正常，axe 无违规，浏览器无错误。构建通过。图形继续表示流程关系，不冒充测量数据。期间其他区域有并行修改，入口同步后重新完成构建和页面检查，没有覆盖这些修改。

按用户要求，测量图中的 vLLM / SGLang 容器改为普通圆角矩形：桌面 18px、手机 12px，去掉拱形顶部。

按用户要求删除案例选择器与用户提问之间重复的 VibeSim Agent 标题栏；保留实际 Agent 回复的身份标识。

按用户要求为 You 添加用户头像，与左侧 Agent 头像对称：桌面 40px 圆角容器，手机双方均显示 32px 头像；不恢复重复聊天标题栏。

用户选定文案 A：首屏 Understand LLM performance. / Know what to improve.；说明 Ask the VibeSim Agent to compare serving configurations, explain bottlenecks, and help test improvements in your framework.；结尾 What would you like to improve? 已应用。

## 合并 why 区块：三节并一节，六条主张
用户要求把 Advantages（Compare ideas before deployment）、Support（Supported models and systems）、
Evidence（See what the prediction is based on）合并为一个区块，页面从 6 个顶层区块降到 4 个
（Hero / Use cases / Why / Workflow）。要求是重新设计，不是三节取并集排队。

六条主张（五条原有 + 用户指定新增的第六条 optimality）：
1. Flexible configuration  2. Fast simulation  3. Measured predictions
4. Full observability      5. Necessary work（新增）  6. A zero-code workflow

硬约束：
- 不得暗示任意可组合。产品不是全组合支持，页面必须写明"每一项是已实现的配置，不是任意组合"。
- 每张卡必须配真实可视化，不要装饰图；数字必须有来源，不得编造量级。
- optimality 用大白话表达，不出现 R0–R7 术语。
- 字号要大，可以占更多空间（用户两次强调）。
- 布局：一条主张一整行，左右两栏（文案 + 可视化）左右交替；右侧文案右对齐。卡片保持整行宽度。

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

## 首屏承担产品定义，删除独立介绍节
用户判定原 H1 `Understand LLM performance. / Know what to improve.` 过于平淡（换成任何 profiler 都成立），选择把 `VibeSim. More than a simulator.` 提升为 Hero 主标题，并整节删除其下的 Product introduction。
主代理提示过否定式定位的风险（要先知道它是模拟器才懂“不止于此”），用户确认后按用户决定执行。
现 Hero 副标题承担原第一节全部内容：Simulate any serving setup, see exactly where the time goes, and let the Agent build and validate the change on real hardware.
页面顺序变为 Hero → Use cases → Workflow → Key features/evidence → Closing，从 5 个顶层区块降到 4 个。
同时解决了原三个箭头链接落点不实的问题（Simulate→#use-cases 实为 Agent 区、Understand→#advantages 实为通用功能区）：链接随该节一并删除，不再有第四个目录。

## Use cases 节标题改为 Run the study with the Agent.
原 `Ask the VibeSim Agent.` 被用户否定。两个问题：H1 已经是 `VibeSim.`，紧接着又出现一次品牌名；且该标题只是在给下方聊天控件贴标签，没有主张。
用户方向是「do the work with the Agent」，最终选定 `Run the study with the Agent.`——把 work 点实为 study，与下一节 Workflow 的 “build it with the Agent” 划清界限：本节是在模拟里做完一次研究，下一节才是改真实框架并回真机验证。
说明改为 Bring a serving question. The Agent designs the experiment, runs it, reads the analysis and comes back with the tradeoff.

## 恢复 Hero 标题与第一节，第一节改为 Simulator / Agent 两个盒子
用户判定删掉第一节之后「没把 VibeSim 是什么讲清楚」，要求恢复原 H1 与第一节。H1 已原样恢复为 Understand LLM performance. / Know what to improve.，副标题一并恢复。
第一节不按原样恢复内容——原来的三个动词 Simulate / Understand / Improve 本身就没有描述产品，链接落点也是错的。按用户给的结构重做：并排两个盒子，左 Simulator「What it can model.」，右 Agent「What it does with it.」，各列五条核心能力。
两个盒子本身就在论证标题那句 More than a simulator：产品的另一半不是模拟器。
内容全部取自页面已有事实——Simulator 侧对应底部 coverage 目录与 accuracy/alignment 行，Agent 侧对应五步工作流；不新增未被页面支撑的能力主张。保留「不是任意组合」的既有免责说明。

## 全页字号统一为一套 CSS 变量阶梯
用户要求：整页扫一遍字号一致性，用变量控制，且不许再有 "Simulated output throughput · tok/s"、"Output throughput" 这类看不清的小字。
建立 :root 的单一阶梯：--fs-fine / sm / md / lg / xl / 2xl / 3xl / h2 / h2-closing / h1，外加 --fs-num / num-lg / num-xl 三档数字。--fs-fine=16px 是硬下限，全页不得更小。阶梯在 1279 / 1023 / 767 三个断点整体收缩，组件因此几乎不需要自己写窄屏字号。
