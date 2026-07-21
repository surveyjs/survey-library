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
 *
 * Options:
 *   defaultsPath - path to the generated base-theme.ts (or a JSON file with
 *                  a cssVariables map) used as the single source of defaults.
 */
export default function sjs2Fallbacks(opts = {}) {
  const defaults = loadDefaults(opts.defaultsPath);
  const BARE_VAR = /var\(\s*(--[\w-]+)\s*\)/g;
  const cache = Object.create(null);

  function expandValue(value, stack) {
    return value.replace(BARE_VAR, (full, name) => {
      if (defaults[name] === undefined || stack.has(name)) return full; // unknown var or cycle
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
        decl.value = expandValue(decl.value, new Set());
      }
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
