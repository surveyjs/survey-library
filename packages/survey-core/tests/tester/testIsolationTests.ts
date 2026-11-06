import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import * as SurveyCore from "survey-core";

import { describe, expect, test } from "vitest";

// The tester ships as a separate bundle, and that only stays true while the dependency arrow points
// one way: src/tester/** may import from "survey-core", nothing else in src/** may import from src/tester/**,
// and entries/index.ts must not reach it, directly or transitively. The one file outside src/tester/
// the tester may import is src/utils/survey-async.ts, the async waiting it shares with other optional
// bundles: that file imports nothing but types from "survey-core", so it is compiled into the tester
// bundle without dragging any other source along, and the main entry does not reach it. Nothing here
// builds anything - the sources are read from disk and their import specifiers are inspected.

const packageRoot = findPackageRoot();
const srcDir = join(packageRoot, "src");
const testerDir = join(srcDir, "tester");
const entriesDir = join(packageRoot, "entries");
const testsDir = join(packageRoot, "tests", "tester");
const asyncHelperFile = join(srcDir, "utils", "survey-async.ts");
const SURVEY_CORE = "survey-core";

function findPackageRoot(): string {
  const candidates: Array<string> = [];
  let dir = process.cwd();
  for (let i = 0; i < 4; i++) {
    candidates.push(dir);
    candidates.push(join(dir, "packages", "survey-core"));
    dir = dirname(dir);
  }
  for (let i = 0; i < candidates.length; i++) {
    if (existsSync(join(candidates[i], "src", "tester", "test-runner.ts"))) return candidates[i];
  }
  throw new Error("Cannot locate the survey-core package root from " + process.cwd() + ".");
}

function toPosix(path: string): string {
  return path.replace(/\\/g, "/");
}

function getTypeScriptFiles(dir: string): Array<string> {
  const res: Array<string> = [];
  readdirSync(dir).forEach(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      getTypeScriptFiles(path).forEach(item => res.push(item));
    } else if (name.length > 3 && name.lastIndexOf(".ts") === name.length - 3 && name.indexOf(".d.ts") < 0) {
      res.push(path);
    }
  });
  return res;
}

interface IImportRecord {
  file: string;
  // The offset of the specifier in the file. The line is derived from it only when a record is
  // reported: counting it for every import made a long file with many imports quadratic to scan.
  position: number;
  source: string;
  // The names of a named import; empty for a side-effect or a namespace import. An inline "type"
  // name is left out: it is erased before a bundle exists.
  names: Array<string>;
  isTypeOnly: boolean;
}

// The clause is restricted to what an import clause may contain - names, braces, commas, "*" and
// "as". Anything else ends the match, so a declaration that carries no "from" cannot swallow the
// text after it and report a word out of a comment as a module.
const IMPORT_REGEX = /(?:^|\n)[ \t]*(?:import|export)\s+(?:type\s+)?(?:([\w$*{},\s]+?)\s+from\s+)?["']([^"']+)["']/g;

// The sources do not change while the tests run, and the checks walk the same files again and
// again: every file of src/ is scanned by one test and reached by the graph walk of each entry point.
// So a file is scanned once and a specifier is resolved once per directory, for the life of the module.
const importsCache = new Map<string, Array<IImportRecord>>();
const resolveCache = new Map<string, string>();

function getImports(file: string): Array<IImportRecord> {
  let res = importsCache.get(file);
  if (!res) {
    res = scanImports(file);
    importsCache.set(file, res);
  }
  return res;
}

// A single-pass scan of the import and re-export statements of a file. It reads the specifier and,
// for a named import, the names: a report that says only "this file imports too much" would leave
// whoever trips it to find the line themselves.
function scanImports(file: string): Array<IImportRecord> {
  const text = readFileSync(file, "utf-8");
  const res: Array<IImportRecord> = [];
  let match = IMPORT_REGEX.exec(text);
  while(!!match) {
    const clause = match[1] || "";
    res.push({
      file: file,
      position: match.index + match[0].indexOf(match[2]),
      source: match[2],
      names: getImportedNames(clause),
      isTypeOnly: /\b(?:import|export)\s+type\b/.test(match[0]),
    });
    match = IMPORT_REGEX.exec(text);
  }
  IMPORT_REGEX.lastIndex = 0;
  return res;
}

function getImportedNames(clause: string): Array<string> {
  const open = clause.indexOf("{");
  const close = clause.lastIndexOf("}");
  if (open < 0 || close < open) return [];
  return clause.substring(open + 1, close).split(",")
    .map(item => item.trim())
    // "A as B" imports A and binds it to B; the name that must exist is A.
    .map(item => item.split(/\s+as\s+/)[0].trim())
    .filter(item => !!item && item.indexOf("type ") !== 0);
}

function getRelativePath(file: string): string {
  return toPosix(file.substring(packageRoot.length + 1));
}

function isInsideTester(path: string): boolean {
  return toPosix(path).indexOf(toPosix(testerDir) + "/") === 0;
}

function isAsyncHelper(path: string): boolean {
  return toPosix(path) === toPosix(asyncHelperFile);
}

function isInsideTests(path: string): boolean {
  return toPosix(path).indexOf(toPosix(testsDir) + "/") === 0;
}

function resolveImport(record: IImportRecord): string {
  if (record.source.charAt(0) !== ".") return undefined;
  const dir = dirname(record.file);
  const key = dir + "|" + record.source;
  // An unresolved specifier is cached as undefined too, so has() and not the value tells a miss.
  if (!resolveCache.has(key)) {
    resolveCache.set(key, resolveFromDirectory(dir, record.source));
  }
  return resolveCache.get(key);
}

function resolveFromDirectory(dir: string, source: string): string {
  const base = resolve(dir, source);
  const candidates = [base + ".ts", base + ".tsx", join(base, "index.ts")];
  for (let i = 0; i < candidates.length; i++) {
    if (existsSync(candidates[i])) return candidates[i];
  }
  return undefined;
}

function getLine(record: IImportRecord): number {
  return readFileSync(record.file, "utf-8").substring(0, record.position).split("\n").length;
}

function formatRecord(record: IImportRecord): string {
  return getRelativePath(record.file) + ":" + getLine(record) + " imports \"" + record.source + "\"";
}

describe("The tester is isolated from the rest of the library", () => {
  test("No file of src/ outside src/tester/ imports from src/tester/", () => {
    const offenders: Array<string> = [];
    getTypeScriptFiles(srcDir).forEach(file => {
      if (isInsideTester(file)) return;
      getImports(file).forEach(record => {
        const resolved = resolveImport(record);
        if (!!resolved && isInsideTester(resolved)) offenders.push(formatRecord(record));
      });
    });
    expect(offenders, "src/tester/ must not be imported from the rest of src/").toEqual([]);
  });

  test("No public entry point reaches src/tester/, directly or transitively", () => {
    ["index.ts", "i18n.ts", "themes.ts"].forEach(name => {
      const entry = join(entriesDir, name);
      if (!existsSync(entry)) return;
      const chain = findImportChain(entry, isInsideTester);
      expect(chain, "entries/" + name + " must not reach src/tester/").toEqual(undefined);
    });
  });

  // The main bundle stays byte-for-byte the same only while it does not compile the shared helper in.
  test("No public entry point reaches src/utils/survey-async.ts, Issue#11818", () => {
    ["index.ts", "i18n.ts", "themes.ts"].forEach(name => {
      const entry = join(entriesDir, name);
      if (!existsSync(entry)) return;
      const chain = findImportChain(entry, isAsyncHelper);
      expect(chain, "entries/" + name + " must not reach src/utils/survey-async.ts").toEqual(undefined);
    });
  });

  test("src/tester/ imports nothing but its own files, the shared async helper and the survey-core package", () => {
    const offenders: Array<string> = [];
    getTypeScriptFiles(testerDir).forEach(file => {
      getImports(file).forEach(record => {
        if (record.source.charAt(0) !== ".") {
          if (record.source !== SURVEY_CORE) offenders.push(formatRecord(record));
          return;
        }
        const resolved = resolveImport(record);
        if (!resolved || !isInsideTester(resolved) && !isAsyncHelper(resolved)) offenders.push(formatRecord(record));
      });
    });
    expect(offenders, "the tester must reach the rest of the library through \"survey-core\", and must not depend on a node built-in or on any other package").toEqual([]);
  });

  // The helper is compiled into every optional bundle that imports it. A relative import would drag
  // core sources into those bundles, and a value import from "survey-core" would tie it to whichever
  // public surface that bundle sees, so only an "import type" from "survey-core" is allowed.
  test("src/utils/survey-async.ts imports nothing but types from the survey-core package, Issue#11818", () => {
    const offenders: Array<string> = [];
    getImports(asyncHelperFile).forEach(record => {
      if (record.source !== SURVEY_CORE || !record.isTypeOnly) offenders.push(formatRecord(record));
    });
    expect(offenders, "the shared async helper must import only types, and only from \"survey-core\"").toEqual([]);
  });

  // The unit tests read the tester the way its own sources do. A test that reached a src/ module
  // directly would bind a class the tester itself no longer imports, and the pair would only look
  // identical while the alias of vitest happens to resolve both to the same module.
  test("tests/tester/ reaches the library only through survey-core", () => {
    const offenders: Array<string> = [];
    getTypeScriptFiles(testsDir).forEach(file => {
      getImports(file).forEach(record => {
        if (record.source.charAt(0) !== ".") return;
        const resolved = resolveImport(record);
        if (!resolved || isInsideTester(resolved) || isInsideTests(resolved)) return;
        offenders.push(formatRecord(record));
      });
    });
    expect(offenders, "a test must import the library through \"survey-core\", not through a src/ path").toEqual([]);
  });

  // The separate bundle declares "survey-core" external, so a symbol the public surface does not
  // export becomes undefined at run time in the bundle while the unit tests, which resolve the same
  // specifier to entries/index.ts, keep passing.
  test("Everything src/tester/ imports from survey-core is exported by it", () => {
    const surface: any = SurveyCore;
    const offenders: Array<string> = [];
    getTypeScriptFiles(testerDir).concat([asyncHelperFile]).forEach(file => {
      getImports(file).forEach(record => {
        // A type is erased before the bundle exists; only a value has to be reachable at run time.
        if (record.source !== SURVEY_CORE || record.isTypeOnly) return;
        record.names.forEach(name => {
          if (surface[name] === undefined) {
            offenders.push(formatRecord(record) + " and uses \"" + name + "\", which survey-core does not export");
          }
        });
      });
    });
    expect(offenders).toEqual([]);
  });
});

function findImportChain(entry: string, isTarget: (path: string) => boolean): Array<string> {
  const visited: { [path: string]: boolean } = {};
  const stack: Array<{ file: string, chain: Array<string> }> = [{ file: entry, chain: [getRelativePath(entry)] }];
  while(stack.length > 0) {
    const current = stack.pop();
    if (visited[current.file] === true) continue;
    visited[current.file] = true;
    const records = getImports(current.file);
    for (let i = 0; i < records.length; i++) {
      const resolved = resolveImport(records[i]);
      if (!resolved) continue;
      const chain = current.chain.concat([getRelativePath(resolved)]);
      if (isTarget(resolved)) return chain;
      stack.push({ file: resolved, chain: chain });
    }
  }
  return undefined;
}
