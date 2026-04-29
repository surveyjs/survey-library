/* eslint-disable no-console, no-undef */
// One-shot codemod to convert QUnit test files to Vitest.
// Used by 02-convert-batch.prompt.md / 03-convert-file.prompt.md.
// Handles synchronous assertion patterns; async/throws/skip files must be done manually.
import * as fs from "node:fs";
import * as path from "node:path";

const ASSERTION_MAP = {
  // QUnit `assert.equal` uses `==` (loose). We map to a custom `toLooseEqual`
  // matcher defined in tests/vitest.setup.ts that preserves `==` semantics.
  // This avoids manual EQUAL_LOOSE follow-ups for legacy comparisons like
  // `assert.equal(undefined, null)` or `assert.equal("0", 0)`.
  equal: "toLooseEqual",
  notEqual: { negate: true, matcher: "toLooseEqual" },
  // `strictEqual` already uses `===` in QUnit, so map to strict `toBe`.
  strictEqual: "toBe",
  notStrictEqual: { negate: true, matcher: "toBe" },
  // QUnit's `deepEqual` ignores survey-library's observable-array overrides
  // (`push`/`pop`/`shift`/`unshift`/`splice` assigned as own enumerable
  // function properties on arrays returned by `Base.createNewArray`). Vitest's
  // `toEqual` walks own enumerable keys and would fail those comparisons. Map
  // to a custom `toEqualValues` matcher (defined in tests/vitest.setup.ts)
  // that strips function-typed own properties before deep-equal.
  deepEqual: "toEqualValues",
  notDeepEqual: { negate: true, matcher: "toEqualValues" },
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
  // If the file has top-level `export function/const/class/interface/type` declarations after the
  // QUnit.module line, wrapping everything in `describe(name, () => { ... })` would put exports
  // inside an arrow body, which is illegal. In that case just remove the QUnit.module default-export
  // line and leave tests at top-level (Vitest accepts top-level test() calls).
  const modRe = /export\s+default\s+QUnit\.module\(\s*("([^"]+)"|'([^']+)')\s*\)\s*;?\s*\n/;
  const mod = src.match(modRe);
  const hasInterleavedExports = mod && /\n\s*export\s+(function|const|let|var|class|interface|type|enum)\b/.test(src.slice(mod.index + mod[0].length));
  if (hasInterleavedExports) {
    src = src.slice(0, mod.index) + src.slice(mod.index + mod[0].length);
    return src;
  }
  if (!mod) {
    // No QUnit.module declaration -- leave top-level test() calls in place (Vitest accepts them).
    return src;
  }
  let name = moduleName;
  name = mod[2] || mod[3];
  src = src.slice(0, mod.index) + `describe(${JSON.stringify(name)}, () => {\n` + src.slice(mod.index + mod[0].length);
  // Append closing
  if (!src.endsWith("\n")) src += "\n";
  src += "});\n";
  return src;
}

function convertAsyncDoneTests(src) {
  // Convert QUnit `assert.async()` / `assert.async(N)` patterns to a returned
  // Promise wrapping. Supports:
  //   - single `const done = assert.async();` with `done()` call(s) to resolve
  //   - multiple `done1 = assert.async();` ... `done6 = assert.async();`
  //   - numeric counts: `assert.async(N)` requires N calls before resolving
  // All variants are unified into a single resolve via a shared countdown:
  //   const __done = () => { if (--__remaining <= 0) resolve(); };
  // Each user-declared `done*` variable is rebound to `__done`.
  // Tests that mix assert.async with bare `assert.async` references (no decl)
  // are left for commentOutFallbacks to handle.
  const findOne = (calleeName) => {
    const out = [];
    const re = new RegExp(`\\bQUnit\\.${calleeName}\\b`, "g");
    let m;
    while((m = re.exec(src)) !== null) {
      const openIdx = src.indexOf("(", m.index + m[0].length);
      if (openIdx === -1) continue;
      const parsed = readArgs(src, openIdx);
      if (!parsed) continue;
      out.push({ start: m.index, end: parsed[1] + 1, args: parsed[0], calleeName });
    }
    return out;
  };
  const calls = [...findOne("test")];
  calls.sort((a, b) => b.start - a.start);
  for (const call of calls) {
    const fnArg = call.args[1] || "";
    const fnMatch = fnArg.match(/^(async\s+)?function\s*\(\s*assert\s*\)\s*\{([\s\S]*)\}\s*$/);
    if (!fnMatch) continue;
    const isAsync = !!fnMatch[1];
    let body = fnMatch[2];

    const declRe = /(?:const|let|var)\s+(\w+)\s*=\s*assert\.async\s*\(\s*(\d+)?\s*\)\s*;?/g;
    const decls = [];
    let m;
    while((m = declRe.exec(body)) !== null) {
      decls.push({ full: m[0], name: m[1], count: m[2] ? parseInt(m[2], 10) : 1 });
    }
    if (decls.length === 0) continue;
    // Bail if any other assert.async appears (e.g. bare reference); commentOutFallbacks handles it.
    const allAsync = body.match(/\bassert\.async\b/g) || [];
    if (allAsync.length !== decls.length) continue;

    const total = decls.reduce((s, d) => s + d.count, 0);
    for (const d of decls) {
      body = body.replace(d.full, `const ${d.name} = __done;`);
    }
    const prelude = `\n  let __remaining = ${total};\n  const __done = function() { if (--__remaining <= 0) resolve(); };\n`;
    const newFn = `${isAsync ? "async " : ""}function(assert) { return new Promise(function(resolve) {${prelude}${body}}); }`;
    const nameArg = call.args[0];
    const replacement = `QUnit.test(${nameArg}, ${newFn})`;
    src = src.slice(0, call.start) + replacement + src.slice(call.end);
  }
  return src;
}

function commentOutFallbacks(src) {
  // Find every QUnit.test( and QUnit.skip( call. If its argument body contains assert.async or assert.throws,
  // replace the entire call with a marker comment + the original call wrapped in /* */.
  const findOne = (calleeName) => {
    const out = [];
    const re = new RegExp(`\\bQUnit\\.${calleeName}\\b`, "g");
    let m;
    while((m = re.exec(src)) !== null) {
      const openIdx = src.indexOf("(", m.index + m[0].length);
      if (openIdx === -1) continue;
      const parsed = readArgs(src, openIdx);
      if (!parsed) continue;
      out.push({ start: m.index, end: parsed[1] + 1, args: parsed[0], calleeName });
    }
    return out;
  };
  const calls = [...findOne("test"), ...findOne("skip")];
  calls.sort((a, b) => b.start - a.start);
  const fallbacks = [];
  for (const call of calls) {
    const body = call.args[1] || "";
    let reason = null;
    if (/\bassert\.async\b/.test(body)) reason = "ASYNC_DONE";
    else if (/\bassert\.throws\b/.test(body)) reason = "THROWS_SHAPE";
    if (!reason) continue;
    const original = src.slice(call.start, call.end);
    // strip optional trailing semicolon when it sits on the same line
    let trailing = "";
    if (src[call.end] === ";") trailing = ";";
    const nameArg = call.args[0];
    const nameClean = nameArg.replace(/^['"`]|['"`]$/g, "");
    const marker = `// VITEST-MIGRATION: MANUAL -- ${reason}: contains ${reason === "ASYNC_DONE" ? "assert.async()" : "assert.throws(...)"}, manual rewrite required\n/*\n${original}${trailing}\n*/`;
    src = src.slice(0, call.start) + marker + src.slice(call.end + trailing.length);
    fallbacks.push({ name: nameClean, reason });
  }
  return { src, fallbacks };
}

function stripSingletonCleanup(src) {
  // Strip "<Singleton>.Instance.clear();" calls that appear ONLY immediately
  // before the closing `});` of a test body. The global afterEach() in
  // tests/vitest.setup.ts handles cleanup; per-test trailing cleanup is
  // redundant and is unsafe to keep when an earlier expect() throws (the
  // line is then skipped). Mid-test `.clear()` calls are real assertions
  // about cleanup behavior and MUST be preserved -- e.g. tests that call
  // `clear()` between two assertion blocks to verify partial cleanup. We
  // therefore restrict stripping to the trailing position only.
  //
  // Patterns (must immediately precede the closing `});` of the test body):
  //   ComponentCollection.Instance.clear();
  //   ComponentCollection.Instance.clear(true);
  //
  // Add new singletons here when more are managed in vitest.setup.ts.
  const patterns = [
    /^([ \t]*ComponentCollection\.Instance\.clear\s*\([^)]*\)\s*;?\s*\n)(?=[ \t]*\}\s*\)\s*;?\s*\n)/gm,
  ];
  let count = 0;
  for (const re of patterns) {
    src = src.replace(re, () => { count++; return ""; });
  }
  return { src, stripped: count };
}

function convertFile(filePath) {
  let src = fs.readFileSync(filePath, "utf8");
  if (!/QUnit\.module/.test(src) && !/QUnit\.test\b/.test(src)) {
    return { skipped: true, reason: "no QUnit.module or QUnit.test" };
  }
  if (/QUnit\.begin\b|QUnit\.done\b/.test(src)) {
    return { skipped: true, reason: "uses QUnit.begin/done" };
  }
  let fallbacks = [];
  src = convertAsyncDoneTests(src);
  if (/\bassert\.async\b|\bassert\.throws\b/.test(src)) {
    const r = commentOutFallbacks(src);
    src = r.src;
    fallbacks = r.fallbacks;
  }
  src = convertAssertions(src);
  src = convertTestDefs(src);
  const cleanup = stripSingletonCleanup(src);
  src = cleanup.src;
  src = addImportAndDescribe(src);
  fs.writeFileSync(filePath, src, "utf8");
  return { ok: true, fallbacks, strippedCleanups: cleanup.stripped };
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
