# VibeSim 宣传首页计划

## 当前页面叙事（最新）

Hero（VibeSim. More than a simulator. + 一句能力说明）→ 三个 Agent 案例 → 五步真实改进闭环 → 核心功能与证据 → 结尾入口。定位与定义都由首屏一次给完，原独立的 Product introduction 一节已按用户要求删除；随后展示能力，解释如何带回真实系统，最后提供支持范围与可信证据。真实产品/快速开始链接待提供。

## 目标与当前阶段

- 目标：宣传产品、增加认知与传播，促成试用、项目关注和参与。
- 主要受众：研究或开发 LLM serving 的工程师、研究者与基础设施团队。
- 当前阶段：整理完整内容清单，尚未确定最终区块数量与布局。
- 实施顺序：内容组织 → 整页视觉稿 → 用户反馈 → 核实支持项与结果 → 最终文案和发布检查。
- 本清单是准备呈现的内容，不是已核实的功能支持声明。

## 完整内容清单

| 内容组 | 准备呈现的内容 | 读者需要理解的事情 | 优先级 |
| --- | --- | --- | --- |
| 产品定位 | 探索、理解、优化 LLM serving；连接模拟分析与真实系统 | VibeSim 是什么，为什么与我的工作有关 | 核心 |
| 四个产品组成 | Simulator、Analyzer、Agent、UI | 四者共同构成产品；不是只有一个模拟器 | 核心 |
| Agent | 理解目标、组织实验与搜索、读取分析证据、推进开发与优化验证 | Agent 是工作流程的重要执行者，不是附带的聊天入口 | 核心 |
| 零代码 UI | 在界面内描述目标、发起实验、查看图表、选择结果继续追问和比较 | 常用探索流程可以通过界面与对话完成 | 核心 |
| 端到端闭环 | Profile real → Simulate → Explore → Improve real → Validate | 从真实测量出发，并把改进带回真实系统验证 | 核心 |
| 交互用例 | 单卡吞吐量、GLM 操作耗时分析、推测解码 token 数搜索 | 从简单到复杂的实际问题如何展开 | 核心 |
| 优势：灵活组合 | 跨模型、硬件、并行、部署、工作负载组合研究 | 可以探索多种系统方案 | 核心 |
| 优势：速度 | 高速模拟、长时间工作负载、配置搜索 | 更快比较方案，减少重复部署试验 | 核心 |
| 优势：准确性 | 实测 kernel 数据与真实 serving 框架对齐 | 预测有测量与验证依据 | 核心 |
| 优势：可观测性 | 请求、迭代、操作、kernel 层面的分析 | 能解释结果和定位瓶颈 | 核心 |
| 优势：易用性 | Agent 协作、零代码 UI、结果与对话联动 | 不必先掌握内部结构才能开始探索 | 核心 |
| 支持：模型与架构 | 模型家族和检查点；Dense、MoE、Attention 类型 | 是否覆盖我的模型 | 核心 |
| 支持：硬件与并行 | GPU 型号；TP、EP、DP、PP 等 | 是否覆盖我的硬件与并行方式 | 核心 |
| 支持：部署与执行 | Unified、PD、AFD、推测解码等 | 是否覆盖我的 serving 方案 | 核心 |
| 支持：框架 | vLLM、SGLang 等的 profiling、对齐或优化路径 | 与我的真实框架如何衔接 | 核心 |
| 支持：实验 | E2E simulation、参数 sweep、timing prediction、Sim-to-real 对齐、Real-to-sim 优化 | 有哪些研究和优化手段 | 核心 |
| 分析输出 | TTFT、TPOT、吞吐量、SLO/goodput、利用率、KV、批次/并发、kernel 占比、对齐结果等 | 能看哪些结果，能追问到多细 | 核心摘要，明细展开 |
| 可信证据 | 有来源的对齐案例、误差、模拟速度或真实改进结果 | 产品主张可以被检查 | 核心，后续补证据 |
| 扩展与内部结构 | L1-L7、kernel profiling/cache、可组合层次、Analyzer subjects、Agent 内部协作 | 有需要时能深入了解与扩展 | 次级，展开或文档 |
| 参与入口 | GitHub、快速开始、文档、社区 | 如何开始、关注、分享或贡献 | 核心，仅使用有效入口 |

## 用例范围

| 用例 | 目的 | 当前证据状态 |
| --- | --- | --- |
| Llama 3 8B / 1 × H200 / 最大吞吐量 | 展示基础使用与性能探索 | 尚无本次任务核实的结果；视觉稿使用占位 |
| GLM 5.2 NVFP4 / 4 × B200 / TP4 + EP4 / 32 decode / 8,192 KV tokens | 展示操作耗时与瓶颈分析 | 用户提供了 Analyzer 摘要；正式发布前补齐准确引用与配置来源 |
| 单请求 batch / speculative token 数搜索 | 展示配置搜索与权衡 | 最佳值未确认；视觉稿不宣称某个 token 数最优 |

## 建议内容分组（待视觉阶段确认）

不把清单每一行做成独立区块。初步组织为：

1. 首屏：产品定位和主要入口。
2. 用例：首屏后的第一个主区块，聊天式、由浅入深。
3. 优势总览：完整保留灵活、快速、准确、可观测、Agent/UI 易用五项价值。
4. 端到端闭环：从真实 profiling 到真实优化验证，并解释两种对齐方向。
5. 支持范围：模型、硬件、并行、部署、框架、实验与分析分组展示；明细可展开。
6. 可信证据与参与入口：验证素材与开始使用的路径，视觉上可拆分。

优势负责概括价值；用例、闭环、支持范围和证据负责展开，不重复堆砌同一段文案。
Agent 在用例与闭环中持续出现；零代码交互由用例和易用性优势呈现，不再单设工作空间展示区。

## 执行计划

- [x] 汇总会话中的目标、约束和完整内容清单。
- [ ] 根据内容反馈收敛分组、主次与页面节奏。
- [ ] 按 design-taste-frontend 审查现有品牌、布局、内容和 SEO 基线。
- [ ] 制作整页视觉稿，保留品牌标识，以留白、排版和交互建立层次。
- [ ] 在预览服务器检查桌面、移动端、键盘操作、减少动效与主题表现。
- [ ] 收集用户对视觉的反馈并修改。
- [ ] 核实功能支持边界、有效入口、性能结果与来源，定稿文案。
- [ ] 完成构建、视觉、可访问性与发布前检查。

## Style B implementation
- Full-page alternative now available for layout and color comparison.
- Prioritize user review of composition and palette before wording, verified support matrix, actual product screenshots and release validation.

## B v2 immersive redesign
- [x] Replace old pale split hero and theme with full-width original shore imagery and deep blue/slate theme.
- [x] Preserve examples, Agent/UI, advantages, real-to-sim workflow, support and evidence.
- [x] Verify responsive layout and core interaction; build production bundle.
- [ ] Gather visual feedback before release-content verification and comprehensive performance/accessibility audit.

## B v3：集中重设计

用户否定此前整体完成度，当前只推进 B，A/C不再同步修改。

内容验收：
- 首屏：准确说明产品 + 沉浸式原创背景，中性近黑底，不再深蓝底铺满。
- 用例：三个可切换问题，结果占主要面积；全部使用已完成实验数据，Agent解释条件、结论和取舍，图表与表格嵌在答复内。
- 优势：五项价值单独可辨认，保持快速、灵活、准确、可观测、易用。
- Agent/UI：由用例中的单轮问题、Agent计划和内嵌证据体现；浏览记录不启动实际实验，不恢复已删除的独立工作空间区块。
- 闭环：五阶段各有输入、行动与产物，直接表达profile real到验证真实改进。
- 支持：模型、硬件/并行、部署/框架、实验/分析四类，核心项可见，边界和内层详情可展开。
- 可信度：解释测量/假设/对齐如何支撑预测，不伪造验证指标。

视觉：Geist自托管字体，#0c0d0f中性近黑；结果展示比容器装饰重要；一个蓝色交互色；每段布局不同，间距服从内容。
研究：实际浏览并截图 Apple MacBook Pro、Linear；读取 Figma 首页与两份设计技能。借鉴展示尺度、渐进展开和界面叙事，不复制图像与版式。

## 当前布局修订
- [x] 统一导航、各区块及页脚的百分比容器：桌面76%，平板88%，手机两侧20px。
- [x] 删除用例标题强制换行，缩短重复说明。
- [ ] 用户视觉验收；实际文案与功能证据继续后置。

## B 当前主线：逐节视觉与表达重做
保留全页76%容器及对齐。按已确认清单重做：动态用例结果；五项优势可视化；Agent/UI任务执行关系；五阶段端到端闭环图；分组支持目录；有来源的预测解释。图片服务于探索概念，图表与流程表达功能。禁止添加虚构性能证据。当前只修改B，旧方案比较阶段已结束。
- [x] 查看真实viz-ui已有对话及消息组件，使用单轮问题与Agent进展/证据组织。
- [x] 完成逐节图解、聊天内嵌结果、字体调整，修复中间预览缺失样式。
- [x] 六区块桌面截图检查、七种视口布局、交互、axe及构建验证。

## 删除重复的工作空间区块
用户认为“Your experiment, in one workspace.”没有额外价值，已从B删除，连同三项步骤选择与重复演示。相关导航和链接改指现有用例或端到端闭环；不增加替代区块。

## 三个用例改用实验数据（2026-09-07）
- [x] Llama 3 8B：完成单 H200、BF16、1,024 输入 / 256 输出、512 请求的七档到达率扫描，结合输出吞吐、TTFT、TPOT说明饱和后的排队代价。
- [x] GLM 5.2：定位原始 TP4+EP4 popularity 预测，通过 Analyzer cost tree 复核全部五项耗时，解释优先调查 MoE 的依据。
- [x] 推测解码：采用 wt-glm52-spec5 的单请求、14,830 KV、TP8+EP8、深度 0–5 实验，结合实测接受率说明收益递减。
- [x] 每例提供可展开结果、适用条件和 JSON 数据下载；不将固定上下文解码上限称为实测端到端吞吐。
- [x] 构建、三例交互、数据下载、移动可访问性、六种视口及桌面/移动截图检查。
- [ ] 用户验收视觉；核实剩余支持范围及发布入口。

## 案例选择器修订
- [x] 按用户反馈撤掉缩略图表和辅助说明，改用 Gauge / ScanLine / Search 图标加标题。
- [x] 桌面为紧凑分段导航，手机为三行完整标题；选中底板轻微滑动，尊重减少动效设置。

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
