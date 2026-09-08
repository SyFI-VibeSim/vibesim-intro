# Progress

## 当前状态

- 用户已将任务从新增用例区扩展为整页宣传网站重设计，目标是广告宣传、增加认知与传播。
- 用户认为已有页面与第一版聊天展示不够成熟；该原型不代表已接受的视觉方向。
- 用户要求优先讨论内容组织，暂不继续页面实施。
- 已创建 plan.md，汇总产品定位、四个组成、五项优势、Agent/UI、完整闭环、支持范围、用例、证据与参与入口。
- 已同步 goal.md 与 notes.md；本轮仅修改规划文档，没有修改页面或运行新的性能实验。
- 下一步：依据内容反馈收敛信息架构，再进入整页视觉稿。

## 已完成的早期原型

- Read the existing React/Vite site and repository instructions; initial checkout was clean.
- Started Vite on port 5173, listening on all interfaces.
- Added the visual prototype immediately after the hero: three selectable scenarios, chat messages, chart cards, and scroll-driven transitions on tall desktop screens.
- Mobile and shorter screens use manual scenario selection so content remains accessible.
- Verified production build and clean diff formatting.
- Browser checks passed: scenario selection, scroll-driven reset, no page errors, no mobile horizontal overflow. Inspected desktop and mobile screenshots and fixed oversized chart-axis icon.
- Live preview: http://10.158.48.50:5173/ (localhost:5173 on the server).
- Final copy and result provenance are deferred until the visual design is reviewed.

## Style B visual sketch

- Implemented full-page calm, soft neutral/blue style alternative in isolated worktree.
- All agreed content groups represented; Agent and zero-code workflow prominent.
- Added working scenario, product-tool and workflow selectors; system/manual theme and mobile navigation.
- Generated a calm paper research visual, saved under public/images.
- Production build passed. User now prioritizes layout and palette; detailed refinement and release checks deferred.
- Basic Playwright checks passed at 1440px and 390px: no horizontal overflow, hero asset loads, CTA visible, scenario switch and dark theme work. Captures in agent-trace/. Ready for style selection.

## B v2 completed

- Replaced old B with immersive shoreline direction on same 5175 preview.
- Entire page now deep blue/slate, redesigned open support grid and benefits composition, precise smaller-radius product panels.
- Final build passed. Desktop/mobile browser checks pass: no errors/overflow, title two lines, CTA visible, core selections and menu work.
- Stable screenshots and design/test report in agent-trace/style-b-v2*.
- Final maintenance: existing Prettier formatted App.jsx/styles.css into readable multiline code. Build passed again; visual design unchanged.

## 当前：B v3

- 已重新审阅设计技能及内容清单，实际查看Apple与Linear桌面页面。
- 主代理集中实施B，新增中性自然主视觉并重构用例、Agent/UI、支持目录等产品呈现。

## 最新用户反馈：统一对齐并适度收窄

- 用户否定92%过宽、1200px固定上限过窄，以及84%演示/76%正文的不同边界。
- 现统一为76%桌面容器，Agent区域取消额外内缩；导航、标题、演示、目录、页脚共享左右边界。
- 用例标题删除人为换行；说明改成一句简短任务描述。
- 实际检查1440/1920截图：导航与内容统一；1920下内容1459px、两侧230px。用例标题与说明各一行，三项标签同排。320–2560检查无横向溢出，核心交互正常，axe无违规，构建通过。

## 逐节重设计进行中

已对照主仓库plan.md完整清单审查B：文字列表过多、优势缺少演示、流程关系不明显、目录层次不足。继续使用原React/Vite/Tailwind栈、统一76%宽度。将补充有意义的图形与动效；等待视觉检查后记录结果。

## 逐节样式修复与检查

- 已修复缺少样式造成的文本挤压；新组件配套样式src/refinements.css已接入，生产构建通过。
- 用例改为一轮用户问题、Agent计划、内嵌结果与解释。GLM原始时间表可展开，场景切换和回放可用。
- 五项优势增加对应交互图解；UI/Agent/Simulator/Analyzer四项显式展示；五阶段闭环增加连接图；支持范围改成四个可读分组；证据区呈现用户提供的MoE占比及条件。
- 已逐一查看六个区块桌面截图。首次检查发现移动回放按钮缺少名称，已补aria-label；同时删除闭环重复的第二组标签。
- 最终检查通过：320/390/768/1024/1440/1920/2560均无横向溢出；浏览器无运行错误；移动WCAG axe无违规。验证单轮用户提问、Agent内5项GLM图表和表格、推测token选择、五项优势切换、工作空间后续步骤、真实验证阶段。
- 页面仍是待用户验收的视觉稿，不能把检查通过视为设计获认可。

- 最新调整：删除独立Workspace区块及三项步骤选择，避免重复Agent用例。清理组件和入口，保留用例/优势中的Agent及零代码表达。
- 删除后的验证：生产构建通过；浏览器确认Workspace区块不再存在，剩余内部锚点有效，无页面运行错误。

## 2026-09-07：三个 Agent 用例使用真实实验记录

- 新跑 Llama 3 8B / H200 七档负载模拟：7/7 完成 simulate、analyze、render、trace、finalize；每档 512 请求全部完成。缓存预检 0/1533 缺失，无需新 GPU profiling。
- 从原始 GLM TP4+EP4 popularity 预测的 Analyzer cases 与 cost tree 复核 19.48533058166504 ms 和五项累计耗时，替换手填数据源。
- 从用户指定 wt-glm52-spec5 定位真实深度 0–5 预测，读取六份 Analyzer 记录及实测 Spec5 接受率；删除占位搜索数据。
- 三例分别解释负载与延迟、MoE 成本归因、推测深度边际收益；保持单轮用户问题，所有图表与表格在 Agent 回复内。
- 原始数值、配置、来源 ID 与推导方法保存到 src/data 三份 JSON，并提供页面下载。
- 验证：生产构建成功；三例图表切换、展开表格（7/5/6 行）与数据下载通过；移动 axe 无违规；320/390/768/1024/1440/1920 无横向页面溢出；浏览器无运行错误。检查桌面及移动结果截图。
- 仍未代表视觉获用户认可；未改 A/C，未提交或发布。

## 选择器：按用户反馈改为图标

- 删除用户否定的缩略图表方案，使用现有 Lucide 图标，去掉额外配置文案和箭头。
- 修正方向键从当前焦点开始切换；案例内容和真实数据保持完整。
- 已检查 1440/390 实际截图；六种视口无页面溢出，键盘与案例切换通过，axe 无违规、无页面错误。

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

## 2026-09-07：三节合并为一个 why 区块，六条主张

- 删除 Experiences.jsx 的 Support 导出与 CoverageVisual，删除 Highlights.jsx 的 Evidence 导出；
  App.jsx 的 main 现在是 Hero / UseCases / Advantages / Workflow 四节。
- Highlights.jsx 重写：六条主张，每条一整行，文案与可视化左右两栏交替，偶数行文案在右并右对齐。
  #support 锚点挂在 Flexible configuration 行上，导航"Supported systems"仍然有效。
- 新增 src/data/optimality.json（真实 optimality report）与 alignment.json 的 15×3 有符号误差；
  simSpeed 改按加速比呈现。所有数字来源记在 notes.md。
- 六张图都是真实数据：分组目录、对数加速比条形、三指标误差点图、迭代缩放钻取、
  GPU-秒瀑布 + 完整归因清单、目标引用 + 三步。
- 按用户要求删除 Architecture and compatibility details 折叠块和 Coverage varies 脚注。
- 按用户要求两轮放大字号；先试过 12 栏错落宽度，用户否决后改回整行满宽 + 右对齐交替。
- 清理 styles.css 中 65 条失效规则（advantages-layout / benefits / evidence-* / support-directory /
  directory-items / cost-* / coverage-* / architecture*），CSS 产物 62.8 → 59.4 kB。备份 /tmp/styles.bak。
- 验证：生产构建通过；320/390/768/1024/1280/1440/1920/2560 无横向溢出；
  #advantages 在 390/1024/1440 三档 axe 无违规；浏览器无页面错误；
  #use-cases / #advantages / #support / #workflow 四个锚点都能解析，1024 下导航仍为一行三项。
  全文无 em dash。
- 页面其余区块（UseCases / Workflow）有并行修改，本轮只动 Highlights.jsx、Experiences.jsx 尾部、
  App.jsx 的 observer 选择器、refinements.css 的 .why-* 段和 styles.css 的死规则，没有覆盖它们。
- 仍是待用户验收的视觉稿；未提交、未发布。

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

首屏接管产品定义、删除 Product introduction：Hero H1 改为 VibeSim. / More than a simulator.，副标题改为 Simulate any serving setup, see exactly where the time goes, and let the Agent build and validate the change on real hardware.。整节删除 ProductIntroduction 组件、mount 点与 src/product-introduction.css，清理 App.jsx 中 Check/ChevronDown/Gauge/SlidersHorizontal/ScanLine/MessagesSquare/Crosshair 七个早已未使用的图标导入；全仓无 product-introduction / product-capabilities 残留引用。生产构建通过（1592 modules，CSS 69.43 kB）。1440/1920/768/390/320 实测无浏览器错误；Hero→Ask the VibeSim Agent 过渡已查看桌面截图，背景渐隐后留白充足，未调整 examples-section 间距。手机 390 三行标题（VibeSim. / More than a / simulator.）已查看，可接受。
遗留（非本轮改动引入，未处理）：390px 下 workflow-section scrollWidth 393 > 390，全页横向多 3px；320px 的表格溢出是既有可横向滚动区域，属预期。

Use cases 节标题：`Ask the VibeSim Agent.` → `Run the study with the Agent.`，说明同步改为 Bring a serving question. The Agent designs the experiment, runs it, reads the analysis and comes back with the tradeoff.。仅改 Experiences.jsx 的 section-intro 两行，未动案例数据、选择器与聊天结构。生产构建通过；1440/1920/768/390/320 无浏览器错误，桌面标题单行、说明两行，390 标题折为 Run the study / with the Agent. 已查看截图。横向溢出仍为既有的 390px workflow-section 3px 与 320px 表格可滚动区，本轮未引入新增。

恢复 Hero 标题并重做第一节为 Simulator / Agent 两盒：H1 与副标题原样恢复。新增 src/product-introduction.css 与 App.jsx 内 ProductIntroduction（id="product"，沿用公共 .section/.wrap/.section-intro）。两盒同宽同底色（#121315、1px #303237、24px 圆角），各 5 条 dt/dd；dl 用 flex:1 让两侧脚注对齐同一基线。
断点：>1180 术语与说明左右分栏（112px 术语列）；901–1180 两盒仍并排但盒内改为术语在上（原 108px 术语列把说明挤成四行，已修）；≤900 两盒纵向堆叠；≤420 缩小内边距与圆角。
实测 1440/1920 两盒等高（708.2 / 625.4），1024 等高 838.8，768/390/320 堆叠。六视口无浏览器错误；#product 区域 axe 零违规；生产构建通过。已查看 1440/1024/390 截图，每条说明最多两行。
遗留（均非本轮引入，未处理）：① 390px 全页横向多 3px，来自 workflow-section；② 320px 表格溢出属既有可横滚区；③ axe 全页 1 条 moderate「region」——closing 区块 #start 位于 </main> 之外，不在任何 landmark 内，属既有结构问题。

全页字号系统化（三步）：

1. 删死 CSS：JSX 已不存在的 52 个类（workspace-* / product-roles / support-directory / cost-ring / evidence-* / directory-items / chart-columns / chart-observation / draft-* / setup-grid / wf-node-* 等）。用 postcss 按选择器精确删除，多选择器规则只摘死的那部分：215 条规则、10 处选择器。CSS 2868 → 2101 行。删除前后渲染完全一致（78 种组合、20 个字号不变），证明删掉的都是不生效的。
2. 建 :root 阶梯并全量映射：203 处 font-size 声明改为 var(--fs-*)，其中冗余的断点覆盖直接删除（阶梯已负责收缩）。styles.css 里被 refinements.css 覆盖的死值一并清掉，消除两处真相打架。校验：组件里已无任何 raw px 字号。
3. 收尾：手机上两个柱状图的柱顶数值原为 10px/12px，改为隐藏而非缩小（选中值在下方大字、按钮有 aria-label、展开表格有全量数据）；spec-sweep-metrics 的读数与单位加 nowrap，不再拆行。
   结果：1440 与 390 均为 12 个字号、最小 16px（原 20 个字号、最小 14px、78 种组合 → 63 种）。
   连带修复：.why-tier-panel 四个 tab 的等高 min-height 按新字号逐区间重测（681/708/844/654/742/1016/1041），此前 768/1024/1440 三档偏小会导致切 tab 跳动。窄屏横向溢出 320px +46→0、360px +36→0、390px +28→0。
   验证：320/390/480/768/1024/1280/1440/1920 八个视口全部 pageOverflow=0，五个工作流面板每档等高，无浏览器错误，axe 仅剩既有的 #start region 一条，生产构建通过（CSS 68.4 → 53.9 kB）。

可维护性重构（进行中，每步都过 25 张截图比对）：

0. 建标尺。`.refactor/shoot.cjs` 拍 25 个状态，`.refactor/diff.cjs` 报通道差幅度而非像素数，基线取自重构前提交 5073551 的独立 worktree。噪声底噪 4/255。
1. 上工具链（64f08fd）。Prettier + Stylelint(stylelint-config-standard)，加 format / format:check / lint:css 三个脚本，全仓格式化单独一个提交。此前 Experiences.jsx 最长行 829 字符、refinements.css 424 字符，而 App.jsx 和 workflow.css 都 ≤96，同一个仓库两种写法，不先统一后面每个 diff 都没法读。
2. 补齐缺的比例尺。颜色（cafdc87）：四个样式表里 133 个 hex 字面量，同一个颜色最多有九种写法（#15171b / #151618 / #15171a / #16191e / #17181b 全是同一个卡片底色），按每通道 6/255 以内合并成 66 个 token，透明与不透明绝不跨界合并（#fff0 和 #ffffff04 一个是不可见一个是 hover 底色）。圆角（c3244d3）：23 个值收成 7 档，最重的两档保持原值不动（卡片和图节点 12px、大容器 24px），没有任何一处移动超过 4px。字号（58e630c）：workflow.css 是最后还有 raw px 的文件，4 处接回阶梯，其中 .wf-lanes strong / .wf-outcomes strong 原为 17px，而其他所有图节点标题都是 --fs-sm 18px，stage 5 是唯一的例外，改正后该张截图 1.02% 像素变化，是修正不是回归。
   导航修复（8d1f6d1，用户报的独立问题）：Supported systems 指向 #support，落点是一个 scroll-margin-top 为 0 的 .why-row，会贴到 y=0 把章节标题滚掉；改指 #advantages 并给 .why-row 加 76px scroll-margin-top，三个链接现在落点一致。
3. 移除 Tailwind，改写显式 reset（a7a7d1c）。全仓 JSX 零个 utility class，但页面排版实际依赖 preflight，所以不能直接删。新增 src/styles/reset.css，只抄页面真正渲染的元素，承重的七条逐条注释了理由（见 notes.md）。验证方式是把 HEAD 单独 checkout 构建后拍一份再 diff：25 张里 23 张逐字节相同，另两张一共差 4 个像素，全在 x=34、两条 1px 分隔线的左端点，幅度 15/255，图是 678×675。没有一张尺寸变化——这正是能抓住 reset 漏规则的判据。CSS 产物 74.99 → 54.41 kB（gzip 16.71 → 10.91），计划里估的是 preflight 的 4,586 字节，实际 v4 的 theme 变量也在输出，省下的是样式表的 27%。

待办：4. 拆文件并转 CSS Modules（Workflow → Advantages → UseCases → Hero → Closing，refinements.css 与 product-introduction.css 就地解散）；5. 去重（三份 ARIA tab 合成一个 components/Tabs.jsx 带 orientation prop，流程图基元抽进 components/Flow.module.css 用 composes 共享，删 5 条死掉的 .wf-* 选择器）。
