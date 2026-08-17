const courseData = [
  {
    id: "chapter-1", number: "01", title: "控制系统概述", english: "INTRODUCTION TO CONTROL SYSTEMS",
    summary: "从反馈的视角理解自动控制：辨认系统组成、信号流向与控制目标，建立后续建模和分析的共同语言。",
    duration: "35 分钟", difficulty: "入门", focus: "框图 · 反馈 · 分类",
    objectives: ["辨认开环与闭环系统", "理解负反馈的作用", "说清控制系统基本组成"],
    concepts: [
      { title: "自动控制系统", badge: "基础", text: "在无人直接参与的情况下，使被控对象的输出按照给定规律运行。核心任务是让输出跟踪输入，并抑制扰动。", bullets: ["被控量：希望被控制的物理量", "给定量：系统希望达到的目标", "扰动量：破坏系统正常运行的外部因素"] },
      { title: "开环与闭环", badge: "必会", text: "开环控制不检测输出，结构简单但抗扰能力弱；闭环控制通过反馈比较偏差，并据此修正控制作用。", bullets: ["开环：输出不影响控制作用", "闭环：输出经反馈环节返回比较点", "负反馈通常减小误差、增强鲁棒性"] },
      { title: "典型组成", badge: "结构", text: "闭环系统通常由比较元件、控制器、执行元件、被控对象和测量反馈元件构成。", bullets: ["比较元件产生偏差信号 e(t)", "控制器根据偏差形成控制量", "传感器测量输出并反馈"] },
      { title: "性能要求", badge: "三要素", text: "分析控制系统时，通常从稳定性、快速性和准确性三个维度评价，三者之间常常需要权衡。", bullets: ["稳定性是系统工作的前提", "快速性反映暂态过程持续时间", "准确性由稳态误差刻画"] }
    ],
    formulas: [
      { name: "偏差信号", meaning: "给定输入与反馈信号之差", expression: "E(s) = R(s) − B(s)", variables: "R(s)：给定输入；B(s)：反馈信号" },
      { name: "闭环传递函数", meaning: "负反馈系统从输入到输出的总体关系", expression: "Φ(s) = <span class=\"frac\"><span>G(s)</span><span>1 + G(s)H(s)</span></span>", variables: "G(s)：前向通道；H(s)：反馈通道" },
      { name: "误差传递函数", meaning: "输入作用下误差信号的传递关系", expression: "Φ<sub>e</sub>(s) = <span class=\"frac\"><span>1</span><span>1 + G(s)H(s)</span></span>", variables: "开环增益越大，低频误差通常越小" }
    ],
    example: { title: "判断恒温箱的控制方式", question: "某恒温箱设定温度为 60 ℃。温度传感器实时测量箱内温度，控制器根据温差调节加热功率。判断系统类型并指出主要组成。", steps: [
      ["识别反馈", "传感器持续测量实际温度，并将其返回给控制器，因此输出影响控制作用。"],
      ["判断类型", "系统存在反馈回路，属于闭环负反馈控制系统。"],
      ["对应组成", "设定温度是给定量，温差是偏差，控制器与加热器构成前向通道，温度传感器构成反馈环节。"]
    ], answer: "结论：这是闭环负反馈系统；其目标是使实际温度稳定跟踪 60 ℃，并抵抗开门、环境温度变化等扰动。" },
    quiz: { question: "负反馈对控制系统最典型的影响是？", options: ["增大稳态误差", "减小系统带宽", "减小误差并提高抗扰能力", "使系统必然稳定"], answer: 2, explanation: "负反馈通常能减小误差、抑制扰动并改善鲁棒性，但并不保证系统一定稳定；反馈设计不当也可能导致振荡。" }
  },
  {
    id: "chapter-2", number: "02", title: "系统数学模型", english: "MATHEMATICAL MODELLING",
    summary: "把物理系统翻译成可计算的数学模型：从微分方程到传递函数，再用结构图与信号流图描述复杂系统。",
    duration: "60 分钟", difficulty: "基础", focus: "传递函数 · 框图化简",
    objectives: ["由微分方程求传递函数", "熟练化简结构图", "理解零极点的物理含义"],
    concepts: [
      { title: "微分方程模型", badge: "建模", text: "根据各物理环节的基本定律列写动态方程，例如机械系统使用牛顿定律，电路系统使用基尔霍夫定律。", bullets: ["明确输入、输出与中间变量", "在零初始条件下进行拉氏变换", "模型阶次通常由独立储能元件数决定"] },
      { title: "传递函数", badge: "核心", text: "零初始条件下，线性定常系统输出拉氏变换与输入拉氏变换之比，只描述系统自身的动态特性。", bullets: ["与输入信号的具体形式无关", "不能表示非零初始条件的影响", "极点决定固有运动，零点影响响应形态"] },
      { title: "典型环节", badge: "必背", text: "常见模型包括比例、积分、微分、惯性、振荡和延迟环节。复杂系统可由这些基本环节组合。", bullets: ["比例环节：G(s) = K", "积分环节：G(s) = K<sub>i</sub>/s", "微分环节：G(s) = K<sub>d</sub>s", "惯性环节：G(s) = K/(Ts+1)", "振荡环节：G(s) = Kω<sub>n</sub><sup>2</sup>/(s<sup>2</sup>+2ζω<sub>n</sub>s+ω<sub>n</sub><sup>2</sup>)", "延迟环节：G(s) = e<sup>−τs</sup>"] },
      { title: "结构图与梅森公式", badge: "化简", text: "结构图强调信号的运算关系；信号流图则用节点与支路表示变量关系，可用梅森增益公式直接求总传递函数。", bullets: ["串联相乘、并联相加", "反馈回路为 G/(1±GH)", "移动比较点或引出点时需补偿增益"] }
    ],
    formulas: [
      { name: "传递函数定义", meaning: "零初始条件下系统输出与输入之比", expression: "G(s) = <span class=\"frac\"><span>C(s)</span><span>R(s)</span></span>", variables: "分母多项式的根为极点；分子多项式的根为零点" },
      { name: "典型二阶环节", meaning: "标准二阶系统的传递函数", expression: "G(s) = <span class=\"frac\"><span>ω<sub>n</sub><sup>2</sup></span><span>s<sup>2</sup> + 2ζω<sub>n</sub>s + ω<sub>n</sub><sup>2</sup></span></span>", variables: "ωₙ：自然频率；ζ：阻尼比" },
      { name: "梅森增益公式", meaning: "由信号流图求总传递函数", expression: "G = <span class=\"frac\"><span>Σ P<sub>k</sub>Δ<sub>k</sub></span><span>Δ</span></span>", variables: "Pₖ：前向通路增益；Δ：流图特征式" }
    ],
    example: { title: "RC 电路的传递函数", question: "RC 低通电路以电容电压 uᶜ(t) 为输出、输入电压 uᵣ(t) 为输入，求其传递函数。", steps: [
      ["列写物理方程", "由 KVL：uᵣ(t) = Ri(t) + uᶜ(t)，又 i(t) = C·duᶜ(t)/dt。"],
      ["消去中间变量", "代入得到 RC·duᶜ(t)/dt + uᶜ(t) = uᵣ(t)。"],
      ["拉氏变换", "在零初始条件下：(RCs + 1)Uᶜ(s) = Uᵣ(s)。"]
    ], answer: "G(s) = Uᶜ(s)/Uᵣ(s) = 1/(RCs + 1)，它是时间常数 T = RC 的一阶惯性环节。" },
    quiz: { question: "关于传递函数，下列说法正确的是？", options: ["适用于任意非线性系统", "取决于输入信号形式", "在零初始条件下定义", "能完整描述初始状态影响"], answer: 2, explanation: "传递函数针对线性定常系统，并在零初始条件下定义；它描述系统自身的输入输出动态关系。" }
  },
  {
    id: "chapter-3", number: "03", title: "时域分析法", english: "TIME-DOMAIN ANALYSIS",
    summary: "直接观察系统随时间的响应，掌握一、二阶系统的动态指标，使用劳斯判据判断稳定性，并计算稳态误差。",
    duration: "80 分钟", difficulty: "重点", focus: "动态指标 · 稳定性 · 误差",
    objectives: ["计算二阶系统性能指标", "用劳斯判据判断稳定性", "求典型输入下稳态误差"],
    modules: [
      {
        number: "01", title: "稳定性分析", english: "STABILITY ANALYSIS",
        summary: "先判断系统能否回到平衡状态。掌握稳定性的基本定义、代数判据以及参数稳定范围的求法。",
        keywords: ["稳定条件", "劳斯判据", "参数范围"],
        concept: {
          title: "稳定性是系统工作的前提",
          text: "对于线性定常连续系统，闭环系统渐近稳定的充要条件是特征方程的全部根都具有负实部，也就是所有闭环极点都位于 s 平面左半平面。劳斯判据可以在不直接求根的情况下判断右半平面根的个数。",
          bullets: ["稳定性是系统自身的结构与参数属性", "特征方程由闭环传递函数的分母得到", "劳斯表第一列符号变化次数等于右半平面根数", "出现全零行或首项为零时需要使用特殊处理"]
        },
        formulas: [
          { name: "闭环特征方程", meaning: "稳定性分析的出发点", expression: "D(s) = 1 + G(s)H(s) = 0", variables: "闭环极点是 D(s)=0 的根" },
          { name: "稳定充要条件", meaning: "连续线性定常系统的极点判据", expression: "Re(s<sub>i</sub>) &lt; 0，　i=1,2,…,n", variables: "所有特征根都必须严格位于 s 左半平面" },
          {
            name: "劳斯稳定判据", meaning: "无需直接求根，由劳斯表第一列判断系统稳定性",
            expression: "右半平面根数 = 劳斯表第一列的符号变化次数",
            variables: "系统渐近稳定 ⇔ 劳斯表第一列元素均存在且严格同号",
            notes: [
              "将特征多项式 D(s)=a<sub>n</sub>s<sup>n</sup>+a<sub>n−1</sub>s<sup>n−1</sup>+⋯+a<sub>1</sub>s+a<sub>0</sub> 按 s 的降幂排列，缺项位置补 0。",
              "s<sup>n</sup> 行依次填 a<sub>n</sub>、a<sub>n−2</sub>、a<sub>n−4</sub>、…；s<sup>n−1</sup> 行依次填 a<sub>n−1</sub>、a<sub>n−3</sub>、a<sub>n−5</sub>、…。",
              "第三行首项 b<sub>1</sub>=(a<sub>n−1</sub>a<sub>n−2</sub>−a<sub>n</sub>a<sub>n−3</sub>)/a<sub>n−1</sub>，其余元素按相同的交叉乘积规则计算，直至 s<sup>0</sup> 行。",
              "检查第一列：符号每变化一次，表示右半平面存在一个特征根；第一列没有符号变化，且不存在零元素时，系统稳定。"
            ],
            specialCases: [
              "首列首项为 0、但该行不全为 0：用一个很小的正数 ε 暂时代替 0，继续完成劳斯表，再令 ε→0⁺，根据第一列极限符号判断变化次数。",
              "某一行全部为 0：取该全零行上一行的系数构造辅助多项式 A(s)，对其求导得到 A′(s)，用 A′(s) 的系数替换全零行，再继续计算。全零行说明存在关于原点对称的根，常见情况是虚轴上的共轭根。",
              "若第一列出现 0 或全零行，系统通常处在特殊或临界情形；完成特殊处理后，仍应结合辅助多项式检查虚轴根及其重数。"
            ]
          }
        ],
        example: {
          title: "用劳斯判据求稳定参数范围",
          question: "系统闭环特征方程为 s³ + 3s² + 2s + K = 0，求系统稳定时 K 的取值范围。",
          steps: [["列出劳斯表首列", "三阶劳斯表第一列依次为 1、3、(6−K)/3、K。"], ["写出稳定条件", "系统稳定要求第一列元素严格同号。最高次项为正，因此各项均应大于零。"], ["求参数交集", "由 K>0 且 (6−K)/3>0，得到 0<K<6。"], ["检查边界", "K=0 时存在原点极点，K=6 时出现虚轴共轭根，均不属于渐近稳定。"]],
          answer: "系统渐近稳定的参数范围为 0 < K < 6。"
        }
      },
      {
        number: "02", title: "暂态性能分析", english: "TRANSIENT PERFORMANCE",
        summary: "研究系统从初始状态到稳态的过渡过程，重点掌握一、二阶系统响应以及超调量、峰值时间和调节时间。",
        keywords: ["一阶响应", "二阶响应", "动态指标"],
        visualization: "transient-response",
        concept: {
          title: "暂态响应反映系统的快与稳",
          text: "一阶惯性系统对阶跃输入呈单调指数变化，时间常数决定响应速度；欠阻尼二阶系统会产生衰减振荡，阻尼比主要影响超调，自然频率主要影响速度。分析时通常使用单位阶跃响应的动态指标进行评价。",
          bullets: ["一阶系统约在 3T 进入 5% 误差带", "0<ζ<1 时二阶系统为欠阻尼响应", "上升时间衡量初次到达目标的速度", "超调量与调节时间共同反映快速性和平稳性"]
        },
        formulas: [
          { group: "一阶系统", name: "单位阶跃响应", meaning: "一阶惯性环节从 0 单调趋近稳态值", expression: "c(t) = 1 − e<sup>−t/T</sup>", variables: "T：时间常数；标准一阶系统无超调量，也没有峰值时间" },
          { group: "一阶系统", name: "上升时间", meaning: "响应由稳态值的 10% 上升到 90% 所需时间", expression: "t<sub>r</sub> = Tln9 ≈ 2.3T", variables: "此处采用 10%→90% 的上升时间定义" },
          { group: "一阶系统", name: "调节时间", meaning: "响应进入并保持在稳态值允许误差带内的时间", expression: "t<sub>s</sub> ≈ 3T（5%）　或　4T（2%）", variables: "一阶响应单调变化，进入误差带后不会再次离开" },
          { group: "二阶欠阻尼系统", name: "典型二阶系统数学模型", meaning: "教材中的标准二阶系统微分方程", expression: "T²<span class=\"frac\"><span>d²c(t)</span><span>dt²</span></span>+2ζT<span class=\"frac\"><span>dc(t)</span><span>dt</span></span>+c(t)=r(t)", variables: "ζ：阻尼比；T：时间常数；r(t)：输入；c(t)：输出" },
          { group: "二阶欠阻尼系统", name: "传递函数的两种等价形式", meaning: "分别使用时间常数 T 和自然频率 ωn 表示", expression: "Φ(s)=<span class=\"frac\"><span>C(s)</span><span>R(s)</span></span>=<span class=\"frac\"><span>1</span><span>T²s²+2ζTs+1</span></span>=<span class=\"frac\"><span>ω<sub>n</sub>²</span><span>s²+2ζω<sub>n</sub>s+ω<sub>n</sub>²</span></span>", variables: "T=1/ωn；ωn 为无阻尼自然振荡频率，两种形式完全等价" },
          { group: "二阶欠阻尼系统", name: "单位阶跃输入下的输出", meaning: "令 R(s)=1/s 后得到输出的拉氏变换", expression: "C(s)=<span class=\"frac\"><span>ω<sub>n</sub>²</span><span>s(s²+2ζω<sub>n</sub>s+ω<sub>n</sub>²)</span></span>", variables: "该表达式是进一步计算单位阶跃时域响应和动态指标的起点" },
          { group: "二阶欠阻尼系统", name: "最大超调量", meaning: "最大峰值超过稳态值的百分比", expression: "M<sub>p</sub> = e<sup>−πζ/√(1−ζ²)</sup> × 100%", variables: "0<ζ<1；ζ 越小，超调通常越大" },
          { group: "二阶欠阻尼系统", name: "峰值时间（超调时间）", meaning: "响应第一次达到最大峰值所需时间", expression: "t<sub>p</sub> = <span class=\"frac\"><span>π</span><span>ω<sub>d</sub></span></span> = <span class=\"frac\"><span>π</span><span>ω<sub>n</sub>√(1−ζ²)</span></span>", variables: "ωd=ωn√(1−ζ²) 为阻尼振荡频率" },
          { group: "二阶欠阻尼系统", name: "上升时间", meaning: "响应从 0 第一次到达稳态值所需时间", expression: "t<sub>r</sub> = <span class=\"frac\"><span>π−β</span><span>ω<sub>d</sub></span></span>，　β=arccosζ", variables: "此处采用欠阻尼二阶系统的 0→100% 定义；需注意题目可能采用 10%→90% 定义" },
          { group: "二阶欠阻尼系统", name: "调节时间", meaning: "振荡响应最终进入并保持在允许误差带内的时间", expression: "t<sub>s</sub> ≈ <span class=\"frac\"><span>3</span><span>ζω<sub>n</sub></span></span>（5%）　或　<span class=\"frac\"><span>4</span><span>ζω<sub>n</sub></span></span>（2%）", variables: "这是包络线近似公式，适用于主导极点明显的标准二阶系统" }
        ],
        example: {
          title: "计算标准二阶系统动态指标",
          question: "标准二阶系统阻尼比 ζ=0.5，自然频率 ωₙ=4 rad/s，估算单位阶跃响应的最大超调量、峰值时间与 2% 调节时间。",
          steps: [["计算超调量", "Mₚ=exp[−πζ/√(1−ζ²)]×100%=exp(−π/√3)×100%≈16.3%。"], ["计算阻尼振荡频率", "ωd=ωₙ√(1−ζ²)=4√0.75≈3.464 rad/s。"], ["计算峰值时间", "tₚ=π/ωd≈π/3.464≈0.91 s。"], ["计算调节时间", "按 2% 误差带，tₛ≈4/(ζωₙ)=4/(0.5×4)=2 s。"]],
          answer: "最大超调量约 16.3%，峰值时间约 0.91 s，2% 调节时间约 2 s。"
        }
      },
      {
        number: "03", title: "稳态性能分析", english: "STEADY-STATE PERFORMANCE",
        summary: "关注暂态过程结束后的跟踪精度，利用终值定理、系统型别和静态误差系数计算不同输入下的稳态误差。",
        keywords: ["稳态误差", "系统型别", "误差系数"],
        visualization: "steady-state-error",
        concept: {
          title: "稳态误差衡量最终跟踪精度",
          text: "稳态误差是误差信号在时间趋于无穷时的极限。单位反馈系统中，开环传递函数在原点处的极点个数决定系统型别，并决定系统跟踪阶跃、斜坡和加速度输入的能力。使用终值定理前必须确认闭环稳定。",
          bullets: ["0 型系统对阶跃输入通常存在有限误差", "I 型系统对阶跃输入误差为零，对斜坡输入误差有限", "II 型系统对阶跃和斜坡输入误差为零", "增大低频开环增益通常能提高稳态精度"]
        },
        formulas: [
          { group: "终值定理法", name: "误差的拉氏变换", meaning: "先由闭环结构求出误差信号", expression: "E(s) = <span class=\"frac\"><span>R(s)</span><span>1+G(s)H(s)</span></span>", variables: "单位反馈时 H(s)=1；若存在扰动，应按实际结构单独列写 E(s)" },
          { group: "终值定理法", name: "稳态误差终值", meaning: "利用终值定理直接计算最终误差", expression: "e<sub>ss</sub> = lim<sub>t→∞</sub>e(t) = lim<sub>s→0</sub>sE(s)", variables: "使用前必须先确认闭环稳定，并检查终值定理的极点条件" },
          { group: "误差系数法", name: "系统型别", meaning: "由开环传递函数在原点处的极点个数 ν 决定", expression: "G(s)H(s)=<span class=\"frac\"><span>K·B(s)</span><span>s<sup>ν</sup>A(s)</span></span>", variables: "ν=0、1、2、3 分别称为 0 型、I 型、II 型、III 型系统" },
          { group: "误差系数法", name: "位置误差系数", meaning: "衡量系统跟踪阶跃输入的能力", expression: "K<sub>p</sub> = lim<sub>s→0</sub>G(s)H(s)", variables: "幅值为 R 的阶跃输入：ess=R/(1+Kp)" },
          { group: "误差系数法", name: "速度误差系数", meaning: "衡量系统跟踪斜坡输入的能力", expression: "K<sub>v</sub> = lim<sub>s→0</sub>sG(s)H(s)", variables: "斜率为 R 的斜坡输入：ess=R/Kv" },
          { group: "误差系数法", name: "加速度误差系数", meaning: "衡量系统跟踪加速度输入的能力", expression: "K<sub>a</sub> = lim<sub>s→0</sub>s²G(s)H(s)", variables: "r(t)=Rt²/2 时：ess=R/Ka" },
          { group: "误差系数法", name: "三类典型输入的误差", meaning: "稳定单位反馈系统的稳态误差汇总", expression: "阶跃：<span class=\"frac\"><span>R</span><span>1+K<sub>p</sub></span></span>　斜坡：<span class=\"frac\"><span>R</span><span>K<sub>v</sub></span></span>　加速度：<span class=\"frac\"><span>R</span><span>K<sub>a</sub></span></span>", variables: "若相应误差系数为 0，则误差为 ∞；若为 ∞，则误差为 0" }
        ],
        example: {
          title: "计算单位斜坡输入的稳态误差",
          question: "单位反馈系统的开环传递函数为 G(s)=4/[s(s+2)]。在闭环稳定的前提下，求单位阶跃和单位斜坡输入下的稳态误差。",
          steps: [["判断系统型别", "G(s) 含一个原点极点，因此系统为 I 型系统。"], ["分析阶跃输入", "I 型系统的位置误差系数 Kp=∞，故单位阶跃稳态误差为 0。"], ["计算速度误差系数", "Kv=lim(s→0)sG(s)=lim(s→0)4/(s+2)=2。"], ["计算斜坡误差", "单位斜坡输入的稳态误差 ess=1/Kv=1/2=0.5。"]],
          answer: "单位阶跃输入的稳态误差为 0；单位斜坡输入的稳态误差为 0.5。"
        }
      }
    ],
    concepts: [
      { title: "典型输入信号", badge: "基础", text: "阶跃、斜坡、加速度和脉冲信号是评价系统性能的标准测试输入，可分别考察位置、速度与加速度跟踪能力。", bullets: ["单位阶跃 R(s)=1/s", "单位斜坡 R(s)=1/s²", "单位脉冲 R(s)=1"] },
      { title: "一阶系统响应", badge: "响应", text: "一阶惯性系统对阶跃输入呈单调指数变化，时间常数 T 决定响应速度，约 3T 达到 95%，4T 达到 98.2%。", bullets: ["T 越小，响应越快", "响应无超调", "闭环极点为 −1/T"] },
      { title: "二阶系统动态性能", badge: "高频", text: "欠阻尼二阶系统会产生衰减振荡。阻尼比主要影响超调，自然频率主要影响响应速度。", bullets: ["0<ζ<1 为欠阻尼", "ζ=1 为临界阻尼", "ζ>1 为过阻尼"] },
      { title: "稳定性与稳态误差", badge: "核心", text: "连续系统稳定的充要条件是闭环极点全部位于 s 左半平面；稳态误差则反映响应最终偏离目标的程度。", bullets: ["劳斯表可避免直接求根", "系统型别由开环积分环节个数确定", "使用终值定理前必须先判稳"] }
    ],
    formulas: [
      { name: "二阶系统超调量", meaning: "欠阻尼单位阶跃响应的最大超调百分比", expression: "M<sub>p</sub> = e<sup>−πζ/√(1−ζ²)</sup> × 100%", variables: "仅适用于 0 < ζ < 1 的标准二阶系统" },
      { name: "调节时间", meaning: "响应进入并保持在允许误差带内所需时间", expression: "t<sub>s</sub> ≈ <span class=\"frac\"><span>3</span><span>ζω<sub>n</sub></span></span>（5%）　或　<span class=\"frac\"><span>4</span><span>ζω<sub>n</sub></span></span>（2%）", variables: "ζωₙ 为主导极点实部绝对值" },
      { name: "终值定理", meaning: "由拉氏表达式求稳定系统的稳态值", expression: "e(∞) = lim<sub>s→0</sub> sE(s)", variables: "前提：sE(s) 的极点均位于左半平面或原点为单极点" },
      { name: "静态误差系数", meaning: "单位反馈系统的位置、速度与加速度误差系数", expression: "K<sub>p</sub>=lim<sub>s→0</sub>G(s),　K<sub>v</sub>=lim<sub>s→0</sub>sG(s),　K<sub>a</sub>=lim<sub>s→0</sub>s²G(s)", variables: "对应阶跃、斜坡、加速度输入" }
    ],
    example: { title: "二阶系统动态指标", question: "标准二阶系统阻尼比 ζ = 0.5，自然频率 ωₙ = 4 rad/s，估算单位阶跃响应的最大超调量与 2% 调节时间。", steps: [
      ["计算超调量", "Mₚ = exp[−πζ/√(1−ζ²)]×100% = exp(−π/√3)×100%。"],
      ["得到数值", "exp(−π/√3) ≈ 0.163，因此最大超调量约为 16.3%。"],
      ["计算调节时间", "按 2% 误差带，tₛ ≈ 4/(ζωₙ) = 4/(0.5×4) = 2 s。"]
    ], answer: "最大超调量 Mₚ ≈ 16.3%，2% 调节时间 tₛ ≈ 2 s。" },
    quiz: { question: "标准欠阻尼二阶系统中，仅增大阻尼比 ζ，通常会怎样？", options: ["超调量增大", "超调量减小", "自然频率增大", "系统型别升高"], answer: 1, explanation: "在 0<ζ<1 范围内，增大阻尼比会显著减小超调量；自然频率和系统型别并不会因此自动改变。" }
  },
  {
    id: "chapter-4", number: "04", title: "根轨迹法", english: "ROOT LOCUS METHOD",
    summary: "研究开环参数变化时闭环极点如何移动。通过几何规则快速判断稳定范围、动态趋势与参数选择。",
    duration: "65 分钟", difficulty: "重点", focus: "绘制规则 · 参数设计",
    objectives: ["掌握根轨迹绘制规则", "求分离点与渐近线", "由期望极点确定系统参数"],
    modules: [
      {
        number: "01", title: "标准化与实轴轨迹", english: "SETUP & REAL-AXIS SEGMENTS",
        summary: "先把开环传递函数整理成根轨迹标准形式，确定分支的起点、终点和数量，再判定实轴上的根轨迹区段。",
        keywords: ["步骤 1–2", "零极点", "实轴判定"],
        concept: {
          title: "从开环零极点建立根轨迹骨架",
          text: "根轨迹表示根轨迹增益 K 从 0 变化到 ∞ 时，闭环特征根在 s 平面上的移动路径。绘图前必须把 K 单独提出，并准确标出所有开环零点与极点。",
          bullets: ["K=0 时根轨迹从开环极点出发", "K→∞ 时分支终止于开环零点或无穷远", "根轨迹分支数等于开环极点数 n", "整条根轨迹关于实轴对称"]
        },
        formulas: [],
        steps: [
          {
            number: "01", title: "标准化开环传递函数",
            text: "把增益 K 单独提出，将开环传递函数写成零极点乘积形式，并统计有限零点数 m 与开环极点数 n。",
            formula: "G(s)H(s)=K<span class=\"frac\"><span>∏<sub>i=1</sub><sup>m</sup>(s−z<sub>i</sub>)</span><span>∏<sub>j=1</sub><sup>n</sup>(s−p<sub>j</sub>)</span></span>",
            checks: ["根轨迹共有 n 条分支", "n 个开环极点是起点", "m 个有限开环零点是终点", "其余 n−m 条分支终止于无穷远"]
          },
          {
            number: "02", title: "确定实轴上的根轨迹",
            text: "把所有实零点与实极点从左到右标在实轴上。对任意测试区间，数该区间右侧的实零点与实极点总数。",
            formula: "右侧实零点与实极点总数为奇数　⇒　该区间属于根轨迹",
            checks: ["测试点不能选在零点或极点上", "只统计测试点右侧的实轴零极点", "根轨迹方向由开环极点指向开环零点或无穷远", "共轭复零极点不参与实轴奇偶规则计数"],
            note: "实轴规则只判断某一段是否存在根轨迹；分离点、会合点仍需在后续步骤计算。"
          }
        ]
      },
      {
        number: "02", title: "渐近线与关键点", english: "ASYMPTOTES & CRITICAL POINTS",
        summary: "确定趋于无穷远分支的方向，计算实轴分离点或会合点，并求复极点的出射角。",
        keywords: ["步骤 3–5", "渐近线", "分离点", "出射角"],
        concept: {
          title: "用几何条件补全根轨迹形状",
          text: "当有限零点少于极点时，部分分支沿渐近线走向无穷远。分离点、会合点和复极点出射角决定轨迹从实轴或复极点附近如何弯曲。",
          bullets: ["渐近线条数为 n−m", "渐近线交点位于实轴", "分离点候选必须同时位于根轨迹上", "复根附近方向由相角条件决定"]
        },
        formulas: [],
        steps: [
          {
            number: "03", title: "确定渐近线",
            text: "当 n>m 时，计算 n−m 条渐近线与实轴的交点及其角度。",
            formula: "σ<sub>a</sub>=<span class=\"frac\"><span>Σp<sub>j</sub>−Σz<sub>i</sub></span><span>n−m</span></span>　　θ<sub>k</sub>=<span class=\"frac\"><span>(2k+1)π</span><span>n−m</span></span>",
            example: "例如 n−m=4：取 k=0、1、2、3，可得 θ<sub>0</sub>=45°，θ<sub>1</sub>=135°，θ<sub>2</sub>=225°，θ<sub>3</sub>=315°。",
            checks: ["k=0,1,2,…,n−m−1", "σa 是所有渐近线在实轴上的共同交点", "角度相对于正实轴逆时针测量", "渐近线关于实轴对称"]
          },
          {
            number: "04", title: "确定分离点与会合点",
            text: "在实轴根轨迹区段中求增益 K(s) 的驻点。可由 dK/ds=0 求解，也可使用零极点倒数和公式。",
            formula: "<span class=\"sum-limits\"><span>n</span><b>Σ</b><span>j=1</span></span><span class=\"frac\"><span>1</span><span>d−p<sub>j</sub></span></span>−<span class=\"sum-limits\"><span>m</span><b>Σ</b><span>i=1</span></span><span class=\"frac\"><span>1</span><span>d−z<sub>i</sub></span></span>=0",
            checks: ["只保留位于实轴根轨迹区段上的实数解", "尝试取值代入", "代回幅值条件检查 K>0", "不满足根轨迹条件的驻点必须舍去", "两支共轭轨迹从普通实轴分离点离开时常呈 ±90°，最终以相角条件为准"]
          },
          {
            number: "05", title: "求复极点出射角",
            text: "在目标复极点附近应用根轨迹相角条件。计算其他所有零点和极点指向该复极点的向量角度。",
            formula: "θ<sub>out</sub>=180°+Σ∠(s−z<sub>i</sub>)−Σ<sub>j≠k</sub>∠(s−p<sub>j</sub>)",
            checks: ["求和时排除正在计算的目标极点本身", "角度方向应统一按逆时针为正", "结果可加减 360° 化到便于绘图的范围", "复零点的入射角可用同一相角条件类似求得"]
          }
        ]
      },
      {
        number: "03", title: "虚轴交点与完整绘图", english: "IMAGINARY-AXIS CROSSING & SKETCH",
        summary: "利用特征方程和劳斯判据确定根轨迹与虚轴的交点及临界增益，最后汇总全部规则完成对称绘图。",
        keywords: ["步骤 6–7", "劳斯判据", "临界增益", "对称绘图"],
        concept: {
          title: "用稳定边界校准根轨迹",
          text: "根轨迹穿越虚轴时，闭环系统处于临界稳定状态。把含 K 的闭环特征方程列入劳斯表，可以同时得到临界增益和虚轴交点频率。",
          bullets: ["闭环特征方程来自 1+G(s)H(s)=0", "劳斯表全零行对应关于原点对称的根", "辅助多项式可求虚轴根", "最终图形必须关于实轴对称"]
        },
        formulas: [],
        steps: [
          {
            number: "06", title: "求根轨迹与虚轴的交点",
            text: "写出含 K 的闭环特征方程并构造劳斯表。令临界稳定条件对应的第一列元素为 0，求临界增益 Kc。",
            formula: "D(s)=1+G(s)H(s)=0　　劳斯临界条件 ⇒ K=K<sub>c</sub>",
            checks: ["先将特征多项式按 s 的降幂排列", "由劳斯表求出使系统临界稳定的 Kc", "用全零行上一行构造辅助多项式", "令 s=jω 或直接解辅助方程，得到虚轴交点 ±jω"]
          },
          {
            number: "07", title: "汇总信息并完成绘图",
            text: "依次标出起点、终点、实轴区段、渐近线、分离点、出射角和虚轴交点，再按 K 增大的方向连接各分支。",
            formula: "根轨迹关于实轴对称；箭头方向：开环极点 → 开环零点或无穷远",
            checks: ["分支总数必须等于 n", "有限终点数必须等于 m", "无穷远分支数必须等于 n−m", "检查每条轨迹是否满足相角条件并保持实轴对称"]
          }
        ]
      }
    ],
    concepts: [
      { title: "根轨迹定义", badge: "核心", text: "当开环系统某一参数（通常为根轨迹增益 K）从 0 变化到 ∞ 时，闭环特征根在 s 平面上形成的轨迹。", bullets: ["起点为开环极点", "终点为开环零点或无穷远", "轨迹关于实轴对称"] },
      { title: "幅值与相角条件", badge: "判定", text: "闭环特征方程可写成 1+G(s)H(s)=0。轨迹上的点必须同时满足相角条件，增益则由幅值条件计算。", bullets: ["相角条件用于判断点是否在轨迹上", "幅值条件用于求对应 K", "负反馈根轨迹相角为奇数倍 180°"] },
      { title: "实轴与渐近线", badge: "绘制", text: "实轴上某点右侧的开环实零、极点总数为奇数时，该点属于根轨迹；多余分支沿渐近线趋于无穷。", bullets: ["渐近线条数 n−m", "交点由零极点和计算", "角度均匀分布"] },
      { title: "特殊点", badge: "计算", text: "分离点、会合点、与虚轴交点以及出射角决定根轨迹的关键形状，常与劳斯判据结合计算。", bullets: ["分离点满足 dK/ds=0", "虚轴交点决定临界稳定增益", "复极点出射角由相角条件得到"] }
    ],
    formulas: [
      { name: "根轨迹条件", meaning: "闭环极点必须满足的幅值与相角关系", expression: "|G(s)H(s)| = 1，　∠G(s)H(s) = (2k+1)π", variables: "k = 0, ±1, ±2, …" },
      { name: "渐近线交点", meaning: "趋于无穷远的根轨迹渐近线与实轴交点", expression: "σ<sub>a</sub> = <span class=\"frac\"><span>Σp<sub>i</sub> − Σz<sub>j</sub></span><span>n − m</span></span>", variables: "n：开环极点数；m：开环零点数" },
      { name: "渐近线角度", meaning: "n−m 条渐近线相对于正实轴的夹角", expression: "φ<sub>k</sub> = <span class=\"frac\"><span>(2k+1)π</span><span>n−m</span></span>", variables: "k = 0, 1, …, n−m−1" }
    ],
    example: { title: "一阶含积分系统的稳定增益", question: "单位反馈系统开环传递函数 G(s)=K/[s(s+2)(s+4)]，求根轨迹与虚轴交点对应的临界增益。", steps: [
      ["写特征方程", "1 + K/[s(s+2)(s+4)] = 0，展开为 s³ + 6s² + 8s + K = 0。"],
      ["列劳斯表", "s³ 行为 1、8；s² 行为 6、K；s¹ 行首项为 (48−K)/6。"],
      ["确定临界条件", "根轨迹穿越虚轴时 s¹ 行为零，因此 48−K=0，得到 K=48。"],
      ["求交点", "用辅助方程 6s²+48=0，得 s=±j√8=±j2√2。"]
    ], answer: "临界增益 K = 48，根轨迹在 s = ±j2√2 处穿越虚轴；0<K<48 时闭环稳定。" },
    quiz: { question: "若开环有 4 个极点、1 个有限零点，则根轨迹有几条渐近线？", options: ["1 条", "2 条", "3 条", "4 条"], answer: 2, explanation: "渐近线条数等于开环极点数与有限零点数之差，即 n−m=4−1=3。" }
  },
  {
    id: "chapter-5", number: "05", title: "频域分析法", english: "FREQUENCY-DOMAIN ANALYSIS",
    summary: "从正弦稳态响应观察系统，用 Bode 图、Nyquist 图和稳定裕度连接稳定性、快速性与抗扰能力。",
    duration: "85 分钟", difficulty: "核心", focus: "Bode 图 · Nyquist 判据",
    objectives: ["绘制典型环节 Bode 图", "应用 Nyquist 稳定判据", "读取相角与幅值裕度"],
    concepts: [
      { title: "频率特性", badge: "基础", text: "将传递函数中的 s 替换为 jω，得到幅频特性与相频特性，它描述系统对不同频率正弦信号的幅值和相位响应。", bullets: ["幅值 |G(jω)| 表示增益", "相角 ∠G(jω) 表示相位移动", "频率特性是稳态响应概念"] },
      { title: "Bode 图", badge: "高频", text: "由对数幅频和相频两张图组成。复杂传递函数可分解为典型环节，各环节曲线在对数坐标下直接相加。", bullets: ["每个一阶极点贡献 −20 dB/dec", "每个积分环节贡献 −90° 相角", "转折频率前后渐近线斜率改变"], example: { title: "积分环节与两个惯性环节的 Bode 图", given: "已知 G(s)=10/[s(0.1s+1)(0.01s+1)]，画出对数幅频与相频特性的渐近线。", formula: "L(ω)=20−20lgω−10lg[1+(0.1ω)²]−10lg[1+(0.01ω)²]　　φ(ω)=−90°−arctan(0.1ω)−arctan(0.01ω)", steps: ["分解典型环节：比例增益 K=10、一个积分环节 1/s，以及两个一阶惯性环节。", "求转折频率：ω₁=1/0.1=10 rad/s，ω₂=1/0.01=100 rad/s，并按从小到大标在横轴上。", "在 ω<10 rad/s 区间，仅积分环节决定斜率，因此 L(ω)≈20−20lgω，斜率为 −20 dB/dec；ω=1 rad/s 时取 20 dB。", "越过 ω₁=10 rad/s 后，第一个惯性极点再贡献 −20 dB/dec，总斜率变为 −40 dB/dec。", "越过 ω₂=100 rad/s 后，第二个惯性极点继续贡献 −20 dB/dec，总斜率变为 −60 dB/dec。", "按渐近线计算关键点：L(10)≈0 dB，L(100)≈−40 dB，L(1000)≈−100 dB，然后依次连接三段直线。", "相角从低频约 −90° 开始，在 ω=10 rad/s 附近下降，在 ω=100 rad/s 附近再次下降，高频最终趋近 −270°。"], chart: "bode-composite", result: "幅频图的三段斜率依次为 −20、−40、−60 dB/dec，转折点为 10 和 100 rad/s；相频图则由 −90° 经两次过渡最终趋近 −270°。" } },
      { title: "Nyquist 判据", badge: "稳定", text: "通过开环频率特性曲线对临界点 (−1,j0) 的包围情况，判断闭环右半平面极点个数。", bullets: ["必须知道开环右半平面极点数 P", "按约定方向计算环绕数 N", "闭环稳定要求 Z=0"] }
    ],
    formulas: [
      { name: "频率特性", meaning: "系统对频率为 ω 的正弦信号的稳态响应", expression: "G(jω) = A(ω)e<sup>jφ(ω)</sup>", variables: "A(ω)=|G(jω)|；φ(ω)=∠G(jω)" },
      { name: "对数幅值", meaning: "Bode 图纵轴使用分贝表示幅值", expression: "L(ω) = 20lg|G(jω)|　dB", variables: "串联系统的对数幅值可直接相加" },
      { name: "相角裕度", meaning: "幅值穿越频率处距离 −180° 的相角余量", expression: "γ = 180° + ∠G(jω<sub>c</sub>)", variables: "ωc 满足 |G(jωc)|=1，即 0 dB" },
      { name: "Nyquist 关系", meaning: "开环、环绕与闭环右半平面极点数关系", expression: "Z = P − N", variables: "本页采用顺时针环绕 (−1,j0) 为正的约定" }
    ],
    example: { title: "由频率特性求相角裕度", question: "某单位反馈系统在幅值穿越频率 ωc 处的开环相角为 −135°，求相角裕度，并粗略判断相对稳定性。", steps: [
      ["确认读取位置", "幅值穿越频率满足 |G(jωc)|=1，即对数幅值为 0 dB。"],
      ["代入定义", "γ = 180° + ∠G(jωc) = 180° − 135°。"],
      ["评价裕度", "得到 γ=45°，位于常用工程范围 30°~60° 内。"]
    ], answer: "相角裕度为 45°，系统具有较合适的相对稳定性；仍需结合幅值裕度和具体对象综合判断。" },
    quiz: { question: "Bode 幅频图中，一个一阶惯性环节在转折频率后的渐近线斜率为？", options: ["+20 dB/dec", "0 dB/dec", "−20 dB/dec", "−40 dB/dec"], answer: 2, explanation: "一阶极点在转折频率后贡献 −20 dB/dec 的斜率；二阶极点则为 −40 dB/dec。" }
  },
  {
    id: "chapter-6", number: "06", title: "系统校正与设计", english: "COMPENSATION & DESIGN",
    summary: "把分析结果转化为设计决策：使用超前、滞后与 PID 校正改善系统的动态性能、稳态精度和稳定裕度。",
    duration: "70 分钟", difficulty: "综合", focus: "串联校正 · PID",
    objectives: ["根据指标选择校正方式", "理解超前与滞后网络作用", "掌握 PID 三项的影响"],
    concepts: [
      { title: "校正的目的", badge: "设计", text: "当原系统不能同时满足稳定性、快速性与准确性要求时，引入校正装置重塑开环频率特性或根轨迹。", bullets: ["稳态精度通常需要提高低频增益", "快速性与抗噪能力涉及中高频形状", "设计本质是多目标折中"] },
      { title: "超前校正", badge: "动态", text: "提供正相角，使截止频率右移并提高相角裕度，通常改善快速性与相对稳定性，但会放大高频噪声。", bullets: ["最大超前角在几何中心频率处", "通常使带宽增大", "对稳态精度改善有限"] },
      { title: "滞后校正", badge: "精度", text: "通过提高低频段相对增益改善稳态精度，并尽量保持中频段特性，但可能使系统响应变慢。", bullets: ["主要改善低频性能", "截止频率往往左移", "需控制附加负相角"] },
      { title: "PID 控制", badge: "常用", text: "比例项响应当前误差，积分项累积历史误差，微分项预测误差变化趋势。三者组合可兼顾速度、精度和阻尼。", bullets: ["P：提高响应力度但过大会振荡", "I：消除稳态误差但可能降低稳定性", "D：增加阻尼但对噪声敏感"] }
    ],
    formulas: [
      { name: "PID 控制律", meaning: "比例、积分、微分三项并联", expression: "u(t)=K<sub>p</sub>e(t)+K<sub>i</sub>∫e(t)dt+K<sub>d</sub><span class=\"frac\"><span>de(t)</span><span>dt</span></span>", variables: "Kp：比例；Ki：积分；Kd：微分系数" },
      { name: "超前校正网络", meaning: "提供正相角并提高系统带宽", expression: "G<sub>c</sub>(s)=K<sub>c</sub><span class=\"frac\"><span>1+aTs</span><span>1+Ts</span></span>，a&gt;1", variables: "零点频率低于极点频率" },
      { name: "最大超前角", meaning: "超前网络可提供的最大正相角", expression: "sinφ<sub>m</sub>=<span class=\"frac\"><span>a−1</span><span>a+1</span></span>", variables: "最大超前角处频率 ωm=1/(T√a)" }
    ],
    example: { title: "PID 各环节的选择", question: "某位置随动系统响应速度尚可，但存在恒定负载扰动引起的稳态偏差。首先应增强 PID 中哪一项？还需关注什么风险？", steps: [
      ["识别主要问题", "恒定扰动造成非零稳态误差，当前核心目标是提高低频增益并消除静差。"],
      ["选择控制作用", "积分项会持续累积误差，直到控制量足以抵消恒定扰动，因此应适当增大 Ki。"],
      ["检查副作用", "积分作用引入额外相位滞后，过强会增加超调、延长振荡，甚至引起积分饱和。"]
    ], answer: "优先增强积分作用 Ki；随后重新检查稳定裕度、超调量，并配置抗积分饱和措施。" },
    quiz: { question: "串联超前校正最典型的作用是？", options: ["降低截止频率", "提高相角裕度与响应速度", "消除所有稳态误差", "降低高频增益"], answer: 1, explanation: "超前校正提供正相角，通常提高相角裕度并使截止频率右移，从而加快响应；它不保证消除稳态误差。" }
  },
  {
    id: "chapter-7", number: "07", title: "离散控制系统", english: "DISCRETE-TIME CONTROL SYSTEMS",
    summary: "围绕采样、Z 变换与脉冲传递函数建立离散系统模型，在 z 平面完成稳定性、暂态性能和稳态误差分析。",
    duration: "95 分钟", difficulty: "核心", focus: "Z 变换 · Jury 判据 · 稳态误差",
    objectives: ["掌握常用 Z 变换对", "判断闭环极点是否位于单位圆内", "计算离散系统稳态误差"],
    concepts: [
      { title: "采样与零阶保持", badge: "7.1", text: "采样开关每隔 T 秒读取连续信号；零阶保持器把每个采样值保持到下一次采样，是数字控制系统常见接口。", bullets: ["采样角频率 ωs=2π/T", "避免混叠需满足 ωs≥2ωmax", "零阶保持器 Gₕ(s)=(1−e⁻ᵀˢ)/s"] },
      { title: "Z 变换与差分方程", badge: "7.2–7.3", text: "Z 变换把离散序列映射到复变量 z 的代数表达式，使差分方程求解转化为代数运算。", bullets: ["X(z)=Σx(kT)z⁻ᵏ", "常用部分分式法求 Z 反变换", "差分方程也可由初值递推求解"] },
      { title: "脉冲传递函数", badge: "7.4", text: "零初始条件下 G(z)=Y(z)/R(z)。连续对象离散化时，必须对零阶保持器与对象的组合取 Z 变换。", bullets: ["G(z)=Z[Gₕ(s)G(s)]", "不能把连续 G(s) 直接做 s→z 代换", "采样点位置会影响结构图化简"] },
      { title: "稳定性与误差", badge: "7.5–7.7", text: "闭环特征根全部位于 z 平面单位圆内时系统稳定。稳定后可用终值定理或误差系数法计算稳态误差。", bullets: ["Jury 判据直接在 z 域判断", "双线性变换可映射到 w 左半平面", "Kv、Ka 中不要漏掉采样周期 T"] }
    ],
    formulas: [
      { name: "Z 变换定义", meaning: "离散序列的单边 Z 变换", expression: "X(z) = Σ<sub>k=0</sub><sup>∞</sup> x(kT)z<sup>−k</sup>", variables: "T：采样周期；z：复变量" },
      { name: "零阶保持器", meaning: "将当前采样值保持一个采样周期", expression: "G<sub>h</sub>(s) = <span class=\"frac\"><span>1 − e<sup>−Ts</sup></span><span>s</span></span>", variables: "工程离散化通常默认含采样开关与零阶保持器" },
      { name: "离散终值定理", meaning: "求稳定离散序列的稳态值", expression: "x(∞) = lim<sub>z→1</sub> (1 − z<sup>−1</sup>)X(z)", variables: "使用前必须检查相关极点满足稳定条件" },
      { name: "离散误差系数", meaning: "单位反馈离散系统的速度与加速度误差系数", expression: "K<sub>v</sub>=<span class=\"frac\"><span>1</span><span>T</span></span>lim<sub>z→1</sub>(z−1)G(z)，　K<sub>a</sub>=<span class=\"frac\"><span>1</span><span>T²</span></span>lim<sub>z→1</sub>(z−1)²G(z)", variables: "系统型别由 G(z) 中 (z−1) 因子的个数确定" }
    ],
    example: { title: "含参数二阶离散系统的稳定范围", question: "单位反馈离散系统闭环特征方程为 z² − 1.5z + K = 0，求使系统稳定的 K 取值范围。", steps: [
      ["写出二阶 Jury 条件", "对 z²+a₁z+a₂=0，稳定条件可写为 |a₂|<1 且 |a₁|<1+a₂。"],
      ["代入系数", "这里 a₁=−1.5，a₂=K，因此 |K|<1，且 1.5<1+K。"],
      ["求交集", "由第一式得 −1<K<1；由第二式得 K>0.5。两者取交集。"],
      ["边界检查", "K=1 时根位于单位圆上，只是临界稳定，不属于渐近稳定范围。"]
    ], answer: "系统稳定的参数范围为 0.5 < K < 1。" },
    quiz: { question: "离散系统渐近稳定的充要条件是？", options: ["全部闭环极点位于 s 左半平面", "全部闭环极点位于 z 单位圆内", "开环增益小于 1", "不存在复数极点"], answer: 1, explanation: "离散系统中，连续域左半平面通过 z=eˢᵀ 映射到 z 平面的单位圆内部，因此稳定要求所有闭环极点满足 |z|<1。" }
  },
  {
    id: "chapter-8", number: "08", title: "非线性控制系统", english: "NONLINEAR CONTROL SYSTEMS",
    summary: "突破线性叠加原理的限制，认识饱和、死区、继电和间隙等典型非线性，使用相平面、描述函数与李雅普诺夫方法分析系统。",
    duration: "90 分钟", difficulty: "综合", focus: "相平面 · 描述函数 · Lyapunov",
    objectives: ["识别典型非线性特性", "用相平面判断运动趋势", "用描述函数预测自振", "理解 Lyapunov 稳定性判据"],
    concepts: [
      { title: "非线性系统特征", badge: "基础", text: "系统中只要存在一个环节不满足叠加原理，就属于非线性系统。其响应与输入幅值、初始状态密切相关，局部性质不能简单推广到全局。", bullets: ["不满足比例性与可加性", "可能出现极限环、跳跃与分岔", "小范围内可在工作点附近线性化"] },
      { title: "典型非线性环节", badge: "必会", text: "工程系统中的执行器和传感器常表现出饱和、死区、继电、间隙及摩擦等非线性，它们会改变增益、产生稳态误差或引起振荡。", bullets: ["饱和：输出受到幅值限制", "死区：小输入范围内没有输出", "继电：输出在有限状态间切换"] },
      { title: "相平面法", badge: "时域", text: "对二阶自治系统，以状态变量 x₁、x₂ 为坐标绘制相轨迹。轨迹的形状和方向能直观反映平衡点稳定性与系统运动过程。", bullets: ["相轨迹通常不相交", "稳定焦点表现为向内螺旋", "闭合孤立轨迹对应极限环"] },
      { title: "描述函数与 Lyapunov", badge: "核心", text: "描述函数用基波等效增益近似分析弱非线性系统的周期振荡；Lyapunov 直接法则通过能量型函数判断平衡点稳定性，无需求出系统响应。", bullets: ["描述函数结果是近似预测", "−1/N(A) 与线性频率特性交点预示自振", "Lyapunov 法可研究局部或全局稳定性"] }
    ],
    formulas: [
      { name: "非线性状态方程", meaning: "一般非线性动态系统的状态空间表达", expression: "ẋ = f(x,u,t)，　y = g(x,u,t)", variables: "若 f、g 不满足线性关系，系统即为非线性系统" },
      { name: "相轨迹微分方程", meaning: "消去时间变量后得到相平面轨迹的斜率", expression: "<span class=\"frac\"><span>dx<sub>2</sub></span><span>dx<sub>1</sub></span></span> = <span class=\"frac\"><span>ẋ<sub>2</sub></span><span>ẋ<sub>1</sub></span></span> = <span class=\"frac\"><span>f<sub>2</sub>(x<sub>1</sub>,x<sub>2</sub>)</span><span>f<sub>1</sub>(x<sub>1</sub>,x<sub>2</sub>)</span></span>", variables: "适用于二阶自治系统；还需结合矢量方向判断运动趋势" },
      { name: "描述函数", meaning: "非线性环节在正弦输入下的基波等效复增益", expression: "N(A) = <span class=\"frac\"><span>B<sub>1</sub> + jA<sub>1</sub></span><span>A</span></span>", variables: "A：输入正弦幅值；A₁、B₁：输出基波傅里叶系数" },
      { name: "自振条件", meaning: "描述函数法预测极限环的幅值与频率", expression: "1 + G(jω)N(A) = 0　⇔　G(jω) = −<span class=\"frac\"><span>1</span><span>N(A)</span></span>", variables: "同时满足幅值条件和相角条件；结论需仿真或实验验证" },
      { name: "Lyapunov 渐近稳定条件", meaning: "利用正定函数及其沿轨迹导数判断稳定性", expression: "V(x)&gt;0，　V(0)=0，　V̇(x)&lt;0", variables: "在原点邻域成立可判局部渐近稳定；径向无界时可进一步判全局稳定" }
    ],
    example: { title: "描述函数法预测继电系统自振", question: "单位负反馈系统的线性部分为 G(s)=1/[s(s+1)(s+2)]，非线性部分是输出幅值为 M 的理想继电环节。用描述函数法估算极限环频率 ω 与输入继电环节的振幅 A。", steps: [
      ["写继电描述函数", "理想对称继电环节的描述函数为 N(A)=4M/(πA)，它是正实数，不引入附加相角。"],
      ["应用相角条件", "要求 ∠G(jω)=−180°，即 −90°−arctanω−arctan(ω/2)=−180°。"],
      ["求自振频率", "由 arctanω+arctan(ω/2)=90° 得 1−ω²/2=0，因此 ω=√2 rad/s。"],
      ["应用幅值条件", "在 ω=√2 时，|G(jω)|=1/6。由 |G|N(A)=1 得 N(A)=6，所以 4M/(πA)=6。"]
    ], answer: "描述函数法预测极限环频率 ω=√2 rad/s，振幅 A=2M/(3π)。这是基波近似结果，应再用数值仿真验证。" },
    quiz: { question: "若存在连续可微函数 V(x)，满足 V(0)=0、V(x)>0 且 V̇(x)<0，则平衡点 x=0 可以判定为？", options: ["不稳定", "临界稳定", "渐近稳定", "必然出现极限环"], answer: 2, explanation: "正定的 V(x) 配合负定的 V̇(x) 可判定原点渐近稳定；如果相关条件在全空间成立且 V 径向无界，还可进一步得到全局渐近稳定。" }
  }
];
