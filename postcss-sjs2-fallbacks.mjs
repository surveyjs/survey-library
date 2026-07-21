import { readFileSync } from "node:fs";

/**
 * PostCSS plugin: bakes base-theme defaults into the compiled CSS as nested
 * var() fallback chains, so the runtime does not need to declare ~1500 custom
 * properties on the survey root (declared custom properties are inherited by
 * every element and make browser DevTools' Elements > Styles panel very slow).
 *
 *   var(--sjs2-color-fg)
 *     -> var(--sjs2-color-fg, var(--sjs2-palette-gray-900, #161616))
 *
 * - Only bare references without a fallback are touched; all other syntax
 *   (existing fallbacks, calc(), color-mix(), rgba(from ...)) stays untouched.
 * - Fallbacks are nested chains, not flattened literals, so overriding a
 *   variable at ANY level of the token chain (semantic, component, primitive)
 *   still takes effect - a defined variable always beats a fallback.
 * - Applies to every declaration value, including custom-property declarations
 *   (adapter values that reference base variables need the fallback too).
 * - A bare var(--sjs2-*) reference whose variable has no default in
 *   defaultsPath FAILS THE BUILD: nothing can be baked in, so the reference
 *   would resolve to nothing at runtime. The error lists every such variable
 *   and where it is used.
 *
 * Options:
 *   defaultsPath - path to the generated base-theme.ts (or a JSON file with
 *                  a cssVariables map) used as the single source of defaults.
 */
// TEMPORARY exclusion list: --sjs2-* variables that are known to be used
// without a fallback and have no default in base-theme. They do NOT fail the
// build. Remove each entry once the SCSS is fixed (the variable gets a default
// in the base theme or an explicit fallback at the usage site). The goal is an
// empty list.
const KNOWN_VARIABLES_WITHOUT_FALLBACK = [
  "--sjs2-color-bg-accent-primary",
  "--sjs2-color-bg-accent-secondary",
  "--sjs2-color-component-slider-readonly-thumb-border",
  "--sjs2-color-utility-surface-survey-panelless",
  "--sjs2-layout-control-action-xx-small-icon-horizontal",
  "--sjs2-layout-control-action-xx-small-icon-vertical",
  "--sjs2-radius-semantic-form-item",
  "--sjs2-size-icon-small",
  "--sjs2-spacing-x50",
];

export default function sjs2Fallbacks(opts = {}) {
  const defaults = loadDefaults(opts.defaultsPath);
  const BARE_VAR = /var\(\s*(--[\w-]+)\s*\)/g;
  const SJS2_PREFIX = "--sjs2-";
  const cache = Object.create(null);
  // --sjs2-* references that stay without a fallback because the variable has
  // no default in defaultsPath: variable name -> Set of usage locations.
  const variablesWithoutFallback = new Map();
  let currentDecl = null;

  // "<name>-reset" variables are declared at runtime (createResetVariablesStyle
  // in base-theme-init.ts derives them from the computed value of "<name>"), so
  // they intentionally have no build-time default to bake in.
  function isRuntimeDeclared(name) {
    const RESET_SUFFIX = "-reset";
    return name.endsWith(RESET_SUFFIX) && defaults[name.slice(0, -RESET_SUFFIX.length)] !== undefined;
  }

  function reportVariableWithoutFallback(name) {
    if (!name.startsWith(SJS2_PREFIX) || isRuntimeDeclared(name)) return;
    if (KNOWN_VARIABLES_WITHOUT_FALLBACK.indexOf(name) !== -1) return;
    let locations = variablesWithoutFallback.get(name);
    if (!locations) {
      locations = new Set();
      variablesWithoutFallback.set(name, locations);
    }
    if (currentDecl && currentDecl.source && currentDecl.source.start) {
      locations.add(`${currentDecl.source.input.from}:${currentDecl.source.start.line} (${currentDecl.prop})`);
    }
  }

  function expandValue(value, stack) {
    return value.replace(BARE_VAR, (full, name) => {
      if (defaults[name] === undefined) {
        reportVariableWithoutFallback(name);
        return full; // unknown var - no fallback to bake in
      }
      if (stack.has(name)) return full; // cycle
      return `var(${name}, ${expandName(name, stack)})`;
    });
  }

  function expandName(name, stack) {
    if (cache[name] !== undefined) return cache[name];
    const next = new Set(stack);
    next.add(name);
    const result = expandValue(defaults[name], next);
    if (stack.size === 0) cache[name] = result; // cache only full (top-level) expansions
    return result;
  }

  return {
    postcssPlugin: "sjs2-fallbacks",
    Declaration(decl) {
      if (decl.value && decl.value.indexOf("var(--sjs2-") !== -1) {
        currentDecl = decl;
        decl.value = expandValue(decl.value, new Set());
        currentDecl = null;
      }
    },
    // Fail the build if any --sjs2-* variable is referenced without a fallback
    // and has no default to bake in: such a reference resolves to nothing at
    // runtime. Fix it by adding the variable to the base theme defaults
    // (defaultsPath) or by writing an explicit fallback in the source SCSS.
    OnceExit() {
      if (variablesWithoutFallback.size === 0) return;
      const details = Array.from(variablesWithoutFallback.keys()).sort().map((name) => {
        const locations = Array.from(variablesWithoutFallback.get(name))
          .map((location) => `\n      used at ${location}`)
          .join("");
        return `  ${name}${locations}`;
      });
      throw new Error(
        `sjs2-fallbacks: ${variablesWithoutFallback.size} --sjs2-* variable(s) are used without a fallback ` +
        `and have no default value in ${opts.defaultsPath}.\n` +
        "Add each variable to the base theme defaults or give the reference an explicit fallback:\n" +
        details.join("\n")
      );
    },
  };
}
sjs2Fallbacks.postcss = true;

function loadDefaults(path) {
  if (!path) throw new Error("sjs2-fallbacks: defaultsPath option is required");
  const text = readFileSync(path, "utf8");
  // base-theme.ts is auto-generated as "// comment\nexport default { <pure JSON> };"
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`sjs2-fallbacks: cannot parse defaults from ${path}`);
  const theme = JSON.parse(text.slice(start, end + 1));
  const variables = theme.cssVariables || theme;
  if (!variables || Object.keys(variables).length === 0) {
    throw new Error(`sjs2-fallbacks: no cssVariables found in ${path}`);
  }
  return variables;
}
