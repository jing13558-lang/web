const state = {
  activeChapter: 0,
  activeTab: "concepts",
  completed: new Set(JSON.parse(localStorage.getItem("control-lab-progress") || "[]"))
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icons = {
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg>'
};

const chapterFormulaMap = {
  "chapter-1": [[0], [1, 2], [0, 1], [1, 2]],
  "chapter-2": [[0], [0, 1], [1], [2]],
  "chapter-4": [[0], [0], [1, 2], [0, 1, 2]],
  "chapter-5": [[0], [1], [3], [2]],
  "chapter-6": [[0], [1, 2], [1, 2], [0]],
  "chapter-7": [[0, 1], [0], [1], [2, 3]],
  "chapter-8": [[0], [0], [1], [2, 3, 4]]
};

function renderNavigation() {
  $("#chapter-list").innerHTML = courseData.map((chapter, index) => `
    <button class="chapter-link ${index === state.activeChapter ? "active" : ""} ${state.completed.has(chapter.id) ? "done" : ""}" data-chapter="${index}" type="button">
      <span class="chapter-number">${chapter.number}</span>
      <span class="chapter-name">${chapter.title}</span>
      <span class="chapter-status">${state.completed.has(chapter.id) ? "✓" : ""}</span>
    </button>
  `).join("");

  $$(".chapter-link").forEach(button => button.addEventListener("click", () => {
    selectChapter(Number(button.dataset.chapter));
    closeSidebar();
  }));
  updateProgress();
}

function renderHero(chapter) {
  const complete = state.completed.has(chapter.id);
  const hero = $("#chapter-hero");
  hero.dataset.number = chapter.number;
  hero.innerHTML = `
    <div class="eyebrow">Chapter ${chapter.number}</div>
    <h1 class="hero-title">${chapter.title}</h1>
    <p class="hero-english">${chapter.english}</p>
    <p class="hero-summary">${chapter.summary}</p>
    <div class="hero-meta">
      <span class="meta-pill"><i></i>${chapter.duration}</span>
      <span class="meta-pill"><i></i>${chapter.difficulty}</span>
      <span class="meta-pill"><i></i>${chapter.focus}</span>
      <button class="complete-btn ${complete ? "done" : ""}" id="complete-btn" type="button">${complete ? "✓ 已完成本章" : "标记为已完成"}</button>
    </div>
  `;
  $("#complete-btn").addEventListener("click", () => toggleComplete(chapter.id));
}

function sectionIntro(title, copy, count) {
  return `<div class="section-intro"><div><h2>${title}</h2><p>${copy}</p></div><span class="count-tag">${String(count).padStart(2, "0")} ITEMS</span></div>`;
}

function renderConcepts(chapter) {
  $("#panel-concepts").innerHTML = sectionIntro("构建知识骨架", "先建立直觉，再记住条件与结论。每个概念卡都对应本章的一类典型问题。", chapter.concepts.length) + `
    <div class="concept-grid">
      ${chapter.concepts.map((concept, index) => `
        <article class="concept-card">
          <div class="card-index"><span>CONCEPT / ${String(index + 1).padStart(2, "0")}</span><span>${concept.badge}</span></div>
          <h3>${concept.title}</h3>
          <p>${concept.text}</p>
          <ul>${concept.bullets.map(item => `<li>${item}</li>`).join("")}</ul>
        </article>
      `).join("")}
      <div class="objectives"><strong>学完本章，你应该能够</strong><div class="objectives-list">${chapter.objectives.map(item => `<span>${item}</span>`).join("")}</div></div>
    </div>
  `;
}

function renderFormulas(chapter) {
  $("#panel-formulas").innerHTML = sectionIntro("核心公式手册", "公式不是孤立结论：先看适用场景，再核对变量定义和成立条件。", chapter.formulas.length) + `
    <div class="formula-stack">
      ${chapter.formulas.map((formula, index) => `
        <article class="formula-card">
          <div class="formula-info"><small>FORMULA / ${String(index + 1).padStart(2, "0")}</small><h3>${formula.name}</h3><p>${formula.meaning}</p></div>
          <div class="formula-box">
            <div class="formula-expression">${formula.expression}</div>
            <div class="variable-note">${formula.variables}</div>
            <button class="copy-formula" type="button" aria-label="复制公式">${icons.copy}</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
  $$(".copy-formula", $("#panel-formulas")).forEach(button => button.addEventListener("click", async () => {
    const text = button.parentElement.querySelector(".formula-expression").innerText;
    try { await navigator.clipboard.writeText(text); showToast("公式已复制"); }
    catch { showToast("请长按公式手动复制"); }
  }));
}

function renderExample(chapter) {
  const ex = chapter.example;
  $("#panel-example").innerHTML = sectionIntro("典型例题", "按照“识别模型—选择方法—代入计算—检查结论”的顺序，形成稳定的解题路径。", 1) + `
    <article class="example-card">
      <div class="example-head">
        <span class="example-label">WORKED EXAMPLE</span>
        <h3>${ex.title}</h3>
        <p>${ex.question}</p>
        <button class="reveal-btn" id="reveal-solution" type="button">展开解题过程 <span>↓</span></button>
      </div>
      <div class="solution" id="solution">
        ${ex.steps.map((step, index) => `<div class="step"><span class="step-no">${index + 1}</span><div><h4>${step[0]}</h4><p>${step[1]}</p></div></div>`).join("")}
        <div class="example-answer"><strong>最终结论：</strong>${ex.answer}</div>
      </div>
    </article>
  `;
  $("#reveal-solution").addEventListener("click", event => {
    const solution = $("#solution");
    const visible = solution.classList.toggle("visible");
    event.currentTarget.innerHTML = visible ? "收起解题过程 <span>↑</span>" : "展开解题过程 <span>↓</span>";
  });
}

function renderQuiz(chapter) {
  const quiz = chapter.quiz;
  const letters = ["A", "B", "C", "D"];
  $("#panel-quiz").innerHTML = sectionIntro("随堂自测", "用一道关键题检查理解。提交后会立即显示结果与解析。", 1) + `
    <article class="quiz-card">
      <div class="quiz-top"><span>QUICK CHECK</span><small>单项选择题</small></div>
      <h3 class="quiz-question">${quiz.question}</h3>
      <div class="quiz-options">${quiz.options.map((option, index) => `<button class="quiz-option" data-index="${index}" type="button"><span class="option-letter">${letters[index]}</span><span>${option}</span></button>`).join("")}</div>
      <div class="quiz-feedback" id="quiz-feedback"></div>
    </article>
  `;
  $$(".quiz-option", $("#panel-quiz")).forEach(option => option.addEventListener("click", () => {
    if ($(".quiz-option.correct", $("#panel-quiz"))) return;
    const selected = Number(option.dataset.index);
    $$(".quiz-option", $("#panel-quiz")).forEach((item, index) => {
      item.disabled = true;
      if (index === quiz.answer) item.classList.add("correct");
    });
    if (selected !== quiz.answer) option.classList.add("wrong");
    const feedback = $("#quiz-feedback");
    feedback.innerHTML = `<strong>${selected === quiz.answer ? "回答正确。" : "再想一步。"}</strong> ${quiz.explanation}`;
    feedback.classList.add("visible");
  }));
}

function renderSwitcher(index) {
  const previous = courseData[index - 1];
  const next = courseData[index + 1];
  $("#chapter-switcher").innerHTML = `
    <a class="switch-btn prev ${previous ? "" : "disabled"}" href="${previous ? `#${previous.id}` : "#"}" data-switch="${index - 1}"><span class="switch-arrow">←</span><span><small>PREVIOUS</small><strong>${previous?.title || ""}</strong></span></a>
    <a class="switch-btn next ${next ? "" : "disabled"}" href="${next ? `#${next.id}` : "#"}" data-switch="${index + 1}"><span><small>NEXT</small><strong>${next?.title || ""}</strong></span><span class="switch-arrow">→</span></a>
  `;
  $$("[data-switch]", $("#chapter-switcher")).forEach(link => link.addEventListener("click", event => {
    event.preventDefault(); selectChapter(Number(link.dataset.switch), true);
  }));
}

function transientResponseVisual() {
  return `
    <figure class="performance-visual">
      <figcaption><strong>动态指标图解</strong><span>曲线仅用于说明指标定义，不代表特定参数下的精确响应。</span></figcaption>
      <div class="response-chart-grid">
        <div class="response-chart">
          <div class="chart-title"><strong>一阶系统</strong><span>单调响应，无超调</span></div>
          <svg viewBox="0 0 460 270" role="img" aria-label="一阶系统阶跃响应的上升时间和调节时间示意图">
            <defs><marker id="arrow-first" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="currentColor"/></marker></defs>
            <path class="chart-axis" d="M48 222V28M48 222H430"/>
            <path class="chart-band" d="M48 68H430M48 76H430"/>
            <path class="chart-guide" d="M48 207H60M48 84H200M60 222V207M200 222V84M310 222V76"/>
            <path class="response-curve" d="M48 222C78 176 105 143 138 119C178 91 221 78 278 73C334 69 382 68 430 68"/>
            <path class="chart-measure" d="M60 196H200" marker-end="url(#arrow-first)"/>
            <path class="chart-measure secondary" d="M48 244H310" marker-end="url(#arrow-first)"/>
            <g class="chart-text"><text x="15" y="72">1.0</text><text x="17" y="88">90%</text><text x="17" y="211">10%</text><text x="124" y="191">tᵣ</text><text x="170" y="260">tₛ</text><text x="316" y="91">2% 误差带</text><text x="416" y="242">t</text><text x="23" y="29">c(t)</text></g>
          </svg>
          <p><b>tᵣ</b>：10%→90% 的时间；<b>tₛ</b>：进入误差带后不再离开的时间。</p>
        </div>
        <div class="response-chart">
          <div class="chart-title"><strong>二阶欠阻尼系统</strong><span>振荡衰减，存在超调</span></div>
          <svg viewBox="0 0 460 270" role="img" aria-label="二阶欠阻尼系统阶跃响应的超调量、峰值时间、上升时间和调节时间示意图">
            <defs><marker id="arrow-second" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="currentColor"/></marker></defs>
            <path class="chart-axis" d="M48 222V28M48 222H430"/>
            <path class="chart-steady" d="M48 112H430"/>
            <path class="chart-band" d="M48 108H430M48 116H430"/>
            <path class="response-curve" d="M48 222C72 215 88 175 112 132C132 96 151 61 180 55C211 49 228 87 248 114C269 142 288 136 309 116C328 99 349 103 367 113C387 124 408 115 430 112"/>
            <path class="chart-guide" d="M120 222V112M180 222V55M334 222V116M180 55H232"/>
            <path class="chart-measure" d="M226 110V58" marker-end="url(#arrow-second)"/>
            <path class="chart-measure secondary" d="M48 244H120" marker-end="url(#arrow-second)"/>
            <path class="chart-measure secondary" d="M48 258H180" marker-end="url(#arrow-second)"/>
            <path class="chart-measure secondary" d="M48 230H334" marker-end="url(#arrow-second)"/>
            <circle class="peak-dot" cx="180" cy="55" r="4"/>
            <g class="chart-text"><text x="15" y="116">1.0</text><text x="235" y="80">Mₚ</text><text x="83" y="241">tᵣ</text><text x="120" y="267">tₚ</text><text x="219" y="226">tₛ</text><text x="343" y="102">2% 误差带</text><text x="416" y="242">t</text><text x="23" y="29">c(t)</text></g>
          </svg>
          <p><b>Mₚ</b>：峰值超出稳态值的比例；<b>tₚ</b>：达到首个峰值的时间。</p>
        </div>
      </div>
    </figure>
  `;
}

function steadyStateErrorTable() {
  const frac = (top, bottom) => `<span class="frac"><span>${top}</span><span>${bottom}</span></span>`;
  return `
    <figure class="error-table-figure">
      <figcaption>
        <div><strong>系统型别与稳态误差速查表</strong><span>单位负反馈、闭环稳定，输入幅值或斜率系数为 R</span></div>
        <small>K 表示对应型别下有限且非零的误差系数</small>
      </figcaption>
      <div class="error-table-scroll">
        <table class="error-coefficient-table">
          <thead>
            <tr><th rowspan="2">系统型别</th><th colspan="3">静态误差系数</th><th colspan="3">稳态误差 e<sub>ss</sub></th></tr>
            <tr><th>K<sub>p</sub></th><th>K<sub>v</sub></th><th>K<sub>a</sub></th><th>阶跃<br><small>r(t)=R</small></th><th>斜坡<br><small>r(t)=Rt</small></th><th>加速度<br><small>r(t)=Rt²/2</small></th></tr>
          </thead>
          <tbody>
            <tr><th>0 型</th><td>K</td><td>0</td><td>0</td><td>${frac("R", "1+K")}</td><td class="infinite">∞</td><td class="infinite">∞</td></tr>
            <tr><th>I 型</th><td class="infinite">∞</td><td>K</td><td>0</td><td class="zero">0</td><td>${frac("R", "K")}</td><td class="infinite">∞</td></tr>
            <tr><th>II 型</th><td class="infinite">∞</td><td class="infinite">∞</td><td>K</td><td class="zero">0</td><td class="zero">0</td><td>${frac("R", "K")}</td></tr>
            <tr><th>III 型</th><td class="infinite">∞</td><td class="infinite">∞</td><td class="infinite">∞</td><td class="zero">0</td><td class="zero">0</td><td class="zero">0</td></tr>
          </tbody>
        </table>
      </div>
      <p class="table-note"><b>使用顺序：</b>先判断闭环稳定 → 数开环原点极点确定系统型别 → 计算对应误差系数 → 根据输入类型查表。</p>
    </figure>
  `;
}

function moduleVisualization(module) {
  if (module.visualization === "transient-response") return transientResponseVisual();
  return "";
}

function formulaCardMarkup(formula, index) {
  return `
    <article class="formula-card">
      <div class="formula-info"><small>FORMULA / ${String(index + 1).padStart(2, "0")}</small><h3>${formula.name}</h3><p>${formula.meaning}</p></div>
      <div class="formula-box">
        <div class="formula-expression">${formula.expression}</div>
        <div class="variable-note">${formula.variables}</div>
        <button class="copy-formula" type="button" aria-label="复制公式">${icons.copy}</button>
      </div>
      ${formula.notes ? `
        <div class="formula-explanation">
          <div class="explanation-section">
            <h4>劳斯表的构造与判断</h4>
            <ol>${formula.notes.map(note => `<li>${note}</li>`).join("")}</ol>
          </div>
          <div class="routh-special-cases">
            <h4>特殊情况处理</h4>
            <ul>${formula.specialCases.map(item => `<li>${item}</li>`).join("")}</ul>
          </div>
        </div>
      ` : ""}
    </article>
  `;
}

function moduleFormulaCards(formulas, module) {
  const hasGroups = formulas.some(formula => formula.group);
  if (!hasGroups) return formulas.map((formula, index) => formulaCardMarkup(formula, index)).join("");
  const groups = [];
  formulas.forEach((formula, index) => {
    const name = formula.group || "相关公式";
    let group = groups.find(item => item.name === name);
    if (!group) { group = { name, formulas: [] }; groups.push(group); }
    group.formulas.push({ formula, index });
  });
  const groupDescriptions = {
    "一阶系统": "单调趋近稳态值",
    "二阶欠阻尼系统": "振荡衰减并可能产生超调",
    "终值定理法": "从 E(s) 直接求最终误差",
    "误差系数法": "按系统型别和输入类型快速计算"
  };
  return groups.map((group, groupIndex) => `
    <section class="formula-group">
      <div class="formula-group-head"><span>${String(groupIndex + 1).padStart(2, "0")}</span><div><strong>${group.name}</strong><small>${groupDescriptions[group.name] || "本板块相关公式"}</small></div></div>
      <div class="formula-group-cards">${group.formulas.map(item => formulaCardMarkup(item.formula, item.index)).join("")}</div>
      ${group.name === "误差系数法" && module?.visualization === "steady-state-error" ? steadyStateErrorTable() : ""}
    </section>
  `).join("");
}

function bindModuleFormulaCopy() {
  $$(".copy-formula", $("#panel-concepts")).forEach(button => button.addEventListener("click", async () => {
    const text = button.parentElement.querySelector(".formula-expression").innerText;
    try { await navigator.clipboard.writeText(text); showToast("公式已复制"); }
    catch { showToast("请长按公式手动复制"); }
  }));
}

function learningStepsMarkup(steps) {
  return `
    <div class="root-locus-timeline">
      ${steps.map(step => `
        <article class="root-locus-step">
          <div class="root-step-rail"><span>${step.number}</span></div>
          <div class="root-step-content">
            <small>ROOT LOCUS STEP ${step.number}</small>
            <h3>${step.title}</h3>
            <p>${step.text}</p>
            ${step.formula ? `<div class="root-step-formula">${step.formula}</div>` : ""}
            ${step.example ? `<div class="root-step-example">${step.example}</div>` : ""}
            <div class="root-step-checks">${step.checks.map(item => `<p${["根轨迹方向由开环极点指向开环零点或无穷远", "尝试取值代入"].includes(item) ? ` class="root-step-emphasis"` : ""}>${item}</p>`).join("")}</div>
            ${step.note ? `<div class="root-step-note"><b>注意：</b>${step.note}</div>` : ""}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function getChapterModules(chapter) {
  if (chapter.id === "chapter-4" && Array.isArray(chapter.modules)) {
    return [{
      number: "01",
      title: "根轨迹七步绘制法",
      english: "SEVEN-STEP ROOT LOCUS METHOD",
      summary: "从开环传递函数标准化开始，依次确定实轴轨迹、渐近线、分离点、出射角和虚轴交点，最后完成整幅根轨迹。",
      keywords: ["完整七步", "按序绘制", "公式与检查"],
      concept: {
        title: "按照固定顺序完成根轨迹",
        text: "根轨迹绘制不是零散套公式，而是逐步补全几何信息。前一步的零极点和实轴判断会直接影响后续渐近线、分离点与出射角，因此应严格按顺序计算并在每一步检查条件。",
        bullets: ["K=0 时从开环极点出发", "K→∞ 时到达开环零点或无穷远", "全部分支关于实轴对称", "最终分支数必须等于开环极点数 n"]
      },
      formulas: [],
      steps: chapter.modules.flatMap(module => module.steps || [])
    }];
  }
  if (Array.isArray(chapter.modules)) return chapter.modules;
  const formulaMap = chapterFormulaMap[chapter.id] || [];
  return chapter.concepts.map((concept, index) => {
    const formulaIndexes = formulaMap[index] || [Math.min(index, chapter.formulas.length - 1)];
    return {
      number: String(index + 1).padStart(2, "0"),
      title: concept.title,
      english: "LEARNING MODULE",
      summary: concept.text,
      keywords: [concept.badge, `${concept.bullets.length} 个要点`, `${formulaIndexes.length} 组公式`],
      concept,
      formulas: formulaIndexes.map(formulaIndex => chapter.formulas[formulaIndex]).filter(Boolean)
    };
  });
}

function renderModuleHub(chapter) {
  const modules = getChapterModules(chapter);
  const panel = $("#panel-concepts");
  panel.innerHTML = sectionIntro("章节学习板块", "选择一个板块进入学习。每个板块内部按照“核心概念 → 相关公式”的顺序组织。", modules.length) + `
    <div class="module-hub">
      ${modules.map((module, index) => `
        <button class="module-entry" data-module="${index}" type="button">
          <span class="module-entry-no">${module.number}</span>
          <span class="module-entry-body">
            <small>${module.english}</small>
            <strong>${module.title}</strong>
            <span>${module.summary}</span>
            <span class="module-keywords">${module.keywords.map(item => `<i>${item}</i>`).join("")}</span>
          </span>
          <span class="module-entry-arrow">↗</span>
        </button>
      `).join("")}
    </div>
  `;
  $$(".module-entry", panel).forEach(button => button.addEventListener("click", () => {
    renderModuleDetail(chapter, Number(button.dataset.module));
    $("#chapter-hero").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
}

function bodeExampleChart() {
  const xTicks = [[58, "0.1"], [198, "1"], [338, "10"], [478, "100"], [618, "1000"]];
  const verticals = xTicks.map(([x, label]) => `<line x1="${x}" y1="35" x2="${x}" y2="430"/><text x="${x}" y="452" text-anchor="middle">${label}</text>`).join("");
  return `
    <figure class="bode-example-chart">
      <figcaption><strong>Bode 图</strong><span>橙色实线为精确响应，青色虚线为分段渐近线</span></figcaption>
      <svg viewBox="0 0 680 470" role="img" aria-label="组合系统的对数幅频图与相频图">
        <g class="bode-grid">${verticals}
          <line x1="58" y1="47" x2="635" y2="47"/><line x1="58" y1="89" x2="635" y2="89"/><line x1="58" y1="132" x2="635" y2="132"/><line x1="58" y1="195" x2="635" y2="195"/>
          <line x1="58" y1="283" x2="635" y2="283"/><line x1="58" y1="350" x2="635" y2="350"/><line x1="58" y1="418" x2="635" y2="418"/>
        </g>
        <g class="bode-axes">
          <line x1="58" y1="25" x2="58" y2="210"/><line x1="58" y1="210" x2="642" y2="210"/>
          <line x1="58" y1="260" x2="58" y2="430"/><line x1="58" y1="430" x2="642" y2="430"/>
        </g>
        <g class="bode-labels">
          <text x="18" y="31">L/dB</text><text x="14" y="51">40</text><text x="14" y="93">0</text><text x="8" y="136">−40</text><text x="3" y="199">−100</text>
          <text x="18" y="265">φ/°</text><text x="7" y="287">−90</text><text x="1" y="354">−180</text><text x="1" y="422">−270</text><text x="596" y="467">ω/(rad/s)</text>
          <text x="338" y="23" text-anchor="middle" class="turn-label">ω₁=10</text><text x="478" y="23" text-anchor="middle" class="turn-label">ω₂=100</text>
        </g>
        <polyline class="bode-asymptote" points="58,47 198,68 338,89 478,132 618,195"/>
        <path class="bode-curve" d="M58 47 C132 56 176 64 198 68 C258 74 305 82 338 92 C392 105 439 121 478 135 C530 155 575 179 618 195"/>
        <path class="phase-curve" d="M58 284 C150 285 205 291 252 306 C293 319 317 332 338 337 C382 350 430 371 478 382 C525 397 570 412 618 414"/>
        <g class="bode-points"><circle cx="338" cy="92" r="4"/><circle cx="478" cy="135" r="4"/><circle cx="338" cy="337" r="4"/><circle cx="478" cy="382" r="4"/></g>
        <g class="bode-annotations"><text x="351" y="84">约 −3 dB</text><text x="490" y="128">约 −43 dB</text><text x="349" y="329">约 −141°</text><text x="489" y="375">约 −219°</text><text x="104" y="40">−20 dB/dec</text><text x="351" y="119">−40 dB/dec</text><text x="504" y="169">−60 dB/dec</text></g>
      </svg>
    </figure>`;
}

function renderModuleDetail(chapter, moduleIndex) {
  const modules = getChapterModules(chapter);
  const module = modules[moduleIndex];
  const panel = $("#panel-concepts");
  panel.innerHTML = `
    <div class="module-detail-head">
      <button class="module-back" id="module-back" type="button">← 返回板块总览</button>
      <span>${module.number} / ${String(modules.length).padStart(2, "0")}</span>
    </div>
    <section class="module-detail-hero">
      <small>${module.english}</small>
      <h2>${module.title}</h2>
      <p>${module.summary}</p>
      <div class="module-keywords">${module.keywords.map(item => `<i>${item}</i>`).join("")}</div>
    </section>

    <section class="learning-block concept-block">
      <div class="learning-block-label"><span>01</span><small>CONCEPT</small><strong>核心概念</strong></div>
      <div class="learning-block-content">
        <h3>${module.concept.title}</h3>
        <p>${module.concept.text}</p>
        <ul>${module.concept.bullets.map(item => `<li>${item}</li>`).join("")}</ul>
      </div>
    </section>

    ${module.steps ? `
      <section class="learning-block steps-learning-block">
        <div class="learning-block-label"><span>02</span><small>STEPS</small><strong>绘制步骤</strong></div>
        <div class="learning-block-content">
          <p class="block-guidance">按顺序完成各步，并在每一步使用对应的判定条件检查结果。</p>
          ${learningStepsMarkup(module.steps)}
        </div>
      </section>
    ` : `
      <section class="learning-block formula-learning-block">
        <div class="learning-block-label"><span>02</span><small>FORMULAS</small><strong>相关公式</strong></div>
        <div class="learning-block-content">
          <p class="block-guidance">这些公式只服务于当前板块，先确认适用条件，再进行计算。</p>
          ${moduleVisualization(module)}
          <div class="formula-stack">${moduleFormulaCards(module.formulas, module)}</div>
        </div>
      </section>
    `}

    ${module.concept.example ? `
      <section class="learning-block module-example-learning-block">
        <div class="learning-block-label"><span>03</span><small>EXAMPLE</small><strong>简单例子</strong></div>
        <div class="learning-block-content">
          <article class="module-example-card">
            <small>WORKED EXAMPLE</small>
            <h3>${module.concept.example.title}</h3>
            <p>${module.concept.example.given}</p>
            <div class="module-example-formula">${module.concept.example.formula}</div>
            <ol>${module.concept.example.steps.map(item => `<li>${item}</li>`).join("")}</ol>
            ${module.concept.example.chart === "bode-composite" ? bodeExampleChart() : ""}
            <div class="module-example-result"><b>画图结果：</b>${module.concept.example.result}</div>
          </article>
        </div>
      </section>
    ` : ""}

    <nav class="module-pager">
      <button class="module-page-btn ${moduleIndex === 0 ? "disabled" : ""}" data-module-page="${moduleIndex - 1}" type="button">← ${modules[moduleIndex - 1]?.title || ""}</button>
      <button class="module-page-btn next ${moduleIndex === modules.length - 1 ? "disabled" : ""}" data-module-page="${moduleIndex + 1}" type="button">${modules[moduleIndex + 1]?.title || ""} →</button>
    </nav>
  `;
  $("#module-back").addEventListener("click", () => renderModuleHub(chapter));
  $$("[data-module-page]", panel).forEach(button => button.addEventListener("click", () => {
    const nextIndex = Number(button.dataset.modulePage);
    if (nextIndex >= 0 && nextIndex < modules.length) {
      renderModuleDetail(chapter, nextIndex);
      $("#chapter-hero").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }));
  bindModuleFormulaCopy();
}

function renderChapter(index) {
  const chapter = courseData[index];
  renderHero(chapter);
  $(".tab-sticky").hidden = true;
  state.activeTab = "concepts";
  $$(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.id === "panel-concepts"));
  renderModuleHub(chapter);
  $("#panel-formulas").innerHTML = "";
  $("#panel-example").innerHTML = "";
  $("#panel-quiz").innerHTML = "";
  renderSwitcher(index);
  renderNavigation();
  document.title = `${chapter.title} · Control Lab`;
}

function selectChapter(index, scroll = true) {
  if (index < 0 || index >= courseData.length) return;
  state.activeChapter = index;
  history.replaceState(null, "", `#${courseData[index].id}`);
  renderChapter(index);
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchTab(tabName) {
  state.activeTab = tabName;
  $$(".tab").forEach(tab => tab.classList.toggle("active", tab.dataset.tab === tabName));
  $$(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.id === `panel-${tabName}`));
}

function toggleComplete(id) {
  state.completed.has(id) ? state.completed.delete(id) : state.completed.add(id);
  localStorage.setItem("control-lab-progress", JSON.stringify([...state.completed]));
  renderHero(courseData[state.activeChapter]);
  renderNavigation();
  showToast(state.completed.has(id) ? "本章已完成，继续保持" : "已取消完成标记");
}

function updateProgress() {
  const percent = Math.round((state.completed.size / courseData.length) * 100);
  $("#progress-percent").textContent = `${percent}%`;
  $("#progress-bar").style.width = `${percent}%`;
  $("#progress-detail").textContent = `已完成 ${state.completed.size} / ${courseData.length} 章`;
}

function setupSearch() {
  const input = $("#global-search");
  const results = $("#search-results");
  const box = $(".search-box");
  const performSearch = () => {
    const query = input.value.trim().toLowerCase();
    if (!query) { results.hidden = true; return; }
    const matches = courseData.filter(chapter => {
      const visibleContent = getChapterModules(chapter).map(module => [
        module.title,
        module.summary,
        module.keywords,
        module.concept.title,
        module.concept.text,
        module.concept.bullets,
        module.formulas.map(formula => [formula.name, formula.meaning, formula.variables]),
        module.steps?.map(step => [step.title, step.text, step.formula, step.checks, step.note])
      ]);
      return JSON.stringify([chapter.title, chapter.summary, chapter.focus, visibleContent]).toLowerCase().includes(query);
    });
    results.innerHTML = matches.length ? matches.map(chapter => `
      <button class="search-result" data-result="${courseData.indexOf(chapter)}" type="button">
        <span class="result-no">${chapter.number}</span><span class="result-copy"><strong>${chapter.title}</strong><small>${chapter.focus} · ${chapter.summary}</small></span>
      </button>`).join("") : `<div class="empty-search">没有找到相关内容，换个关键词试试。</div>`;
    results.hidden = false;
    $$(".search-result", results).forEach(item => item.addEventListener("click", () => {
      selectChapter(Number(item.dataset.result)); input.value = ""; results.hidden = true; box.classList.remove("mobile-open");
    }));
  };
  input.addEventListener("input", performSearch);
  box.addEventListener("click", () => { if (window.innerWidth <= 640) { box.classList.add("mobile-open"); input.focus(); } });
  document.addEventListener("click", event => {
    if (!box.contains(event.target) && !results.contains(event.target)) { results.hidden = true; box.classList.remove("mobile-open"); }
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); box.classList.add("mobile-open"); input.focus(); }
    if (event.key === "Escape") { results.hidden = true; input.blur(); box.classList.remove("mobile-open"); }
  });
}

function setupTheme() {
  const saved = localStorage.getItem("control-lab-theme");
  if (saved) document.documentElement.dataset.theme = saved;
  $("#theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("control-lab-theme", next);
  });
}

function closeSidebar() {
  $("#sidebar").classList.remove("open");
  $("#sidebar-backdrop").classList.remove("show");
}

function setupSidebar() {
  $("#menu-toggle").addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
    $("#sidebar-backdrop").classList.toggle("show");
  });
  $("#sidebar-backdrop").addEventListener("click", closeSidebar);
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function init() {
  setupTheme();
  setupSearch();
  setupSidebar();
  $$(".tab").forEach(tab => tab.addEventListener("click", () => switchTab(tab.dataset.tab)));
  const hashIndex = courseData.findIndex(chapter => `#${chapter.id}` === location.hash);
  state.activeChapter = hashIndex >= 0 ? hashIndex : 0;
  renderChapter(state.activeChapter);
}

init();
