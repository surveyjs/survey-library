/* eslint-disable no-console, no-undef */
// One-shot codemod to convert QUnit test files to Vitest.
// Used by 02-convert-batch.prompt.md / 03-convert-file.prompt.md.
// Handles synchronous assertion patterns; async/throws/skip files must be done manually.
import * as fs from "node:fs";
import * as path from "node:path";

const ASSERTION_MAP = {
  equal: "toBe",
  strictEqual: "toBe",
  deepEqual: "toEqual",
  notEqual: { negate: true, matcher: "toBe" },
  notDeepEqual: { negate: true, matcher: "toEqual" },
  ok: "toBeTruthy",
  notOk: "toBeFalsy",
};

// Match a balanced top-level argument list inside parentheses.
// Returns [args, endIndex] or null. Starts at index of "(".
function readArgs(src, openIdx) {
  if (src[openIdx] !== "(") return null;
  let depth = 0;
  let i = openIdx;
  let argStart = openIdx + 1;
  const args = [];
  let inStr = null;
  let inTpl = false;
  while(i < src.length) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") { i += 2; continue; }
      if (c === inStr) inStr = null;
      i++;
      continue;
    }
    if (inTpl) {
      if (c === "\\") { i += 2; continue; }
      if (c === "`") inTpl = false;
      i++;
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; i++; continue; }
    if (c === "`") { inTpl = true; i++; continue; }
    if (c === "(" || c === "[" || c === "{") { depth++; i++; continue; }
    if (c === ")" || c === "]" || c === "}") {
      depth--;
      if (depth === 0 && c === ")") {
        args.push(src.slice(argStart, i).trim());
        return [args.filter(a => a.length > 0), i];
      }
      i++;
      continue;
    }
    if (c === "," && depth === 1) {
      args.push(src.slice(argStart, i).trim());
      argStart = i + 1;
      i++;
      continue;
    }
    i++;
  }
  return null;
}

function findCalls(src, name) {
  const re = new RegExp(`\\bassert\\.${name}\\b`, "g");
  const out = [];
  let m;
  while((m = re.exec(src)) !== null) {
    const openIdx = src.indexOf("(", m.index + m[0].length);
    if (openIdx === -1) continue;
    // Ensure only whitespace between identifier and (
    const between = src.slice(m.index + m[0].length, openIdx);
    if (between.trim() !== "") continue;
    const parsed = readArgs(src, openIdx);
    if (!parsed) continue;
    out.push({ start: m.index, end: parsed[1] + 1, args: parsed[0], name });
  }
  return out;
}

function convertAssertions(src) {
  const calls = [];
  for (const name of Object.keys(ASSERTION_MAP)) {
    calls.push(...findCalls(src, name));
  }
  calls.sort((a, b) => b.start - a.start); // back-to-front to preserve indices
  for (const call of calls) {
    const cfg = ASSERTION_MAP[call.name];
    const negate = typeof cfg === "object" && cfg.negate;
    const matcher = typeof cfg === "object" ? cfg.matcher : cfg;
    let replacement;
    const a = call.args;
    if (call.name === "ok" || call.name === "notOk") {
      // assert.ok(x, msg?) -> expect(x, msg?).toBeTruthy()
      const target = a[0];
      const msg = a[1];
      replacement = msg
        ? `expect(${target}, ${msg}).${matcher}()`
        : `expect(${target}).${matcher}()`;
    } else {
      // 2 or 3 args
      const target = a[0];
      const expected = a[1];
      const msg = a[2];
      const negStr = negate ? ".not" : "";
      replacement = msg
        ? `expect(${target}, ${msg})${negStr}.${matcher}(${expected})`
        : `expect(${target})${negStr}.${matcher}(${expected})`;
    }
    src = src.slice(0, call.start) + replacement + src.slice(call.end);
  }
  return src;
}

function convertTestDefs(src) {
  // Convert QUnit.test( and QUnit.skip( call sites -- rename then strip the `assert` parameter
  // from the function passed as 2nd argument.
  const findOne = (calleeName) => {
    const out = [];
    const re = new RegExp(`\\bQUnit\\.${calleeName}\\b`, "g");
    let m;
    while((m = re.exec(src)) !== null) {
      const openIdx = src.indexOf("(", m.index + m[0].length);
      if (openIdx === -1) continue;
      const parsed = readArgs(src, openIdx);
      if (!parsed) continue;
      out.push({ start: m.index, end: parsed[1] + 1, openIdx, args: parsed[0], calleeName });
    }
    return out;
  };
  const calls = [...findOne("test"), ...findOne("skip")];
  calls.sort((a, b) => b.start - a.start);
  for (const call of calls) {
    const newName = call.calleeName === "skip" ? "test.skip" : "test";
    if (call.args.length < 2) continue;
    const nameArg = call.args[0];
    let fnArg = call.args[1];
    fnArg = stripAssertParam(fnArg);
    const replacement = `${newName}(${nameArg}, ${fnArg})`;
    src = src.slice(0, call.start) + replacement + src.slice(call.end);
  }
  return src;
}

function stripAssertParam(fnSrc) {
  // Patterns:
  //   function (assert) { ... }
  //   function(assert) { ... }
  //   async function (assert) { ... }
  //   (assert) => { ... }
  //   async (assert) => { ... }
  //   function (\n  assert\n) { ... }  -> handled by relaxed regex
  // Replace `assert` parameter with empty.
  let out = fnSrc;
  out = out.replace(/^(async\s+)?function\s*\(\s*assert\s*\)/, (_, a) => `${a || ""}() =>`.trim());
  // Above transformed `function (assert)` to `() =>` but with leading async support; if it was already function form
  // we now need to convert function body to arrow. But arrow doesn't have `function` keyword.
  // Actually let's just convert to arrow always.
  if (/^(async\s+)?function/.test(fnSrc)) {
    out = fnSrc.replace(/^(async\s+)?function\s*\(\s*assert\s*\)\s*/, (_, a) => `${a ? "async " : ""}() => `);
  } else {
    out = fnSrc.replace(/^(async\s+)?\(\s*assert\s*\)\s*=>/, (_, a) => `${a ? "async " : ""}() =>`);
  }
  return out;
}

function addImportAndDescribe(src, moduleName) {
  // Determine which Vitest helpers to import (test, describe, expect; add async helpers as needed)
  const helpers = new Set(["describe", "test", "expect"]);
  const importLine = `import { ${[...helpers].join(", ")} } from "vitest";\n`;
  // Find where to insert: after the last existing import statement at top.
  const importRe = /^(import[^;]*;\s*\n)+/m;
  const m = src.match(importRe);
  if (m) {
    src = src.slice(0, m.index + m[0].length) + importLine + src.slice(m.index + m[0].length);
  } else {
    src = importLine + src;
  }
  // Wrap rest of body in describe(moduleName, () => { ... })
  // Strategy: find the `export default QUnit.module(...)` line, replace with the wrapper open.
  const modRe = /export\s+default\s+QUnit\.module\(\s*("([^"]+)"|'([^']+)')\s*\)\s*;?\s*\n/;
  const mod = src.match(modRe);
  let name = moduleName;
  if (mod) {
    name = mod[2] || mod[3];
    src = src.slice(0, mod.index) + `describe(${JSON.stringify(name)}, () => {\n` + src.slice(mod.index + mod[0].length);
  } else {
    src += `\ndescribe(${JSON.stringify(name || "module")}, () => {\n`;
  }
  // Append closing
  if (!src.endsWith("\n")) src += "\n";
  src += "});\n";
  return src;
}

function convertFile(filePath) {
  let src = fs.readFileSync(filePath, "utf8");
  if (!/QUnit\.module/.test(src)) {
    return { skipped: true, reason: "no QUnit.module" };
  }
  // Disallow files with async/throws/skip/begin/done
  if (/assert\.async\b|assert\.throws\b|QUnit\.begin\b|QUnit\.done\b/.test(src)) {
    return { skipped: true, reason: "needs manual review (async/throws)" };
  }
  src = convertAssertions(src);
  src = convertTestDefs(src);
  src = addImportAndDescribe(src);
  fs.writeFileSync(filePath, src, "utf8");
  return { ok: true };
}

const files = process.argv.slice(2);
for (const f of files) {
  const abs = path.resolve(f);
  try {
    const r = convertFile(abs);
    console.log(JSON.stringify({ file: f, ...r }));
  } catch(e) {
    console.log(JSON.stringify({ file: f, error: e.message }));
  }
}
