import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/26934/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
});
const issues = [];

async function check(viewport, name) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.on("pageerror", error => issues.push(`${name}: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") issues.push(`${name}: ${message.text()}`); });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  if (name === "desktop") {
    if (await page.locator(".chapter-link").count() !== 8) issues.push("desktop: expected 8 chapters");
    for (let chapterIndex = 0; chapterIndex < 8; chapterIndex += 1) {
      await page.click(`.chapter-link[data-chapter="${chapterIndex}"]`);
      const expectedMinimum = chapterIndex === 3 ? 1 : 3;
      if (await page.locator(".module-entry").count() < expectedMinimum) issues.push(`desktop: chapter ${chapterIndex + 1} has too few modules`);
      if (await page.locator(".tab-sticky").isVisible()) issues.push(`desktop: legacy tabs visible in chapter ${chapterIndex + 1}`);
    }
    await page.click('.chapter-link[data-chapter="3"]');
    if (await page.locator(".module-entry").count() !== 1) issues.push("desktop: root-locus chapter should have one module");
    await page.click('.module-entry[data-module="0"]');
    if (await page.locator(".root-locus-step").count() !== 7) issues.push("desktop: root-locus module should contain seven steps");
    if (await page.locator(".root-locus-step .root-step-formula").count() !== 7) issues.push("desktop: each root-locus step should include its formula or rule");
    if (await page.locator(".formula-learning-block").count()) issues.push("desktop: legacy root-locus formulas are still visible");
    await page.click("#module-back");
    await page.click('.chapter-link[data-chapter="2"]');
    if (await page.locator(".module-entry").count() !== 3) issues.push("desktop: expected 3 time-domain modules");
    await page.click('.module-entry[data-module="0"]');
    if (await page.locator(".formula-explanation").count() !== 1) issues.push("desktop: detailed Routh explanation is missing");
    if (!(await page.locator(".routh-special-cases").textContent()).includes("ε")) issues.push("desktop: zero-leading-element handling is missing");
    await page.click("#module-back");
    await page.click('.module-entry[data-module="1"]');
    if ((await page.locator(".module-detail-hero h2").textContent()) !== "暂态性能分析") issues.push("desktop: transient module did not open");
    if (await page.locator(".learning-block").count() !== 2) issues.push("desktop: module should contain only concept and formulas");
    if (await page.locator(".response-chart").count() !== 2) issues.push("desktop: first and second order response charts are missing");
    if (await page.locator(".formula-group").count() !== 2) issues.push("desktop: first and second order formulas are not separated");
    if (await page.locator(".formula-group .formula-card").count() !== 10) issues.push("desktop: transient performance formulas are incomplete");
    if (await page.getByText("传递函数的两种等价形式", { exact: true }).count() !== 1) issues.push("desktop: equivalent second-order transfer functions are missing");
    if (await page.getByText("单位阶跃输入下的输出", { exact: true }).count() !== 1) issues.push("desktop: unit-step output transform is missing");
    if (await page.locator(".example-learning-block").count()) issues.push("desktop: examples should not be rendered");
    await page.click("#module-back");
    await page.click('.module-entry[data-module="2"]');
    if (await page.locator(".error-coefficient-table tbody tr").count() !== 4) issues.push("desktop: steady-state error table is incomplete");
    if (await page.locator(".formula-group").count() !== 2) issues.push("desktop: steady-state methods are not separated");
    if (await page.locator(".formula-group").nth(1).locator(".error-table-figure").count() !== 1) issues.push("desktop: error table should follow the coefficient method");
    if (await page.locator(".formula-group .formula-card").count() !== 7) issues.push("desktop: steady-state error formulas are incomplete");
    if (await page.getByText("位置误差系数", { exact: true }).count() !== 1) issues.push("desktop: Kp formula is missing");
    if (await page.getByText("速度误差系数", { exact: true }).count() !== 1) issues.push("desktop: Kv formula is missing");
    if (await page.getByText("加速度误差系数", { exact: true }).count() !== 1) issues.push("desktop: Ka formula is missing");
    await page.click("#module-back");
    await page.click('.chapter-link[data-chapter="0"]');
    await page.click('.module-entry[data-module="0"]');
    if (await page.locator(".learning-block").count() !== 2) issues.push("desktop: derived module structure is incorrect");
    await page.fill("#global-search", "Jury");
    if (await page.locator(".search-result").count() < 1) issues.push("desktop: search returned no result");
  } else {
    await page.click("#menu-toggle");
    if (!(await page.locator("#sidebar").evaluate(el => el.classList.contains("open")))) issues.push("mobile: menu did not open");
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) issues.push(`${name}: horizontal overflow detected`);
  await page.close();
}

await check({ width: 1440, height: 1000 }, "desktop");
await check({ width: 390, height: 844 }, "mobile");
await browser.close();

console.log(JSON.stringify({ ok: issues.length === 0, issues }, null, 2));
process.exitCode = issues.length ? 1 : 0;
