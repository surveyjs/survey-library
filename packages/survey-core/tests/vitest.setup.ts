// Setup file for Vitest. Mirrors the side-effect imports and global settings
// from the Karma+QUnit entry barrel at tests/entries/test.ts.
import { afterEach, expect } from "vitest";
import "../src/localization/russian";
import "../src/localization/french";
import "../src/localization/finnish";
import "../src/localization/german";
import { settings } from "../src/settings";
import { ComponentCollection } from "../src/question_custom";
import { surveyLocalization } from "../src/surveyStrings";
import { _setIsTouch } from "../src/utils/devices";

settings.animationEnabled = false;
settings.dropdownSearchDelay = 0;

// jsdom exposes `ontouchstart` on window, which makes the device-detection
// heuristic in src/utils/devices.ts treat the test environment as a touch
// device by default. The legacy Karma/QUnit environment ran in a real desktop
// browser where `IsTouch` was false; mirror that here so behavior gated on
// `IsTouch` (e.g. `ListModel.focusFirstVisibleItem`) matches Karma. Tests
// that need touch behavior call `_setIsTouch(true)` explicitly and reset it
// in their own teardown.
_setIsTouch(false);

// jsdom does not implement matchMedia. SurveyJS responsive logic and popup
// displayMode use it. Provide a controllable registry.
if (typeof (globalThis as any).matchMedia === "undefined") {
  const __mqRegistry: Map<string, { matches: boolean, listeners: Set<(e: any) => void> }> = new Map();
  (globalThis as any).matchMedia = function (query: string) {
    let entry = __mqRegistry.get(query);
    if (!entry) {
      entry = { matches: false, listeners: new Set() };
      __mqRegistry.set(query, entry);
    }
    const captured = entry;
    return {
      get matches() { return captured.matches; },
      media: query,
      onchange: null,
      addListener(cb: (e: any) => void) { captured.listeners.add(cb); },
      removeListener(cb: (e: any) => void) { captured.listeners.delete(cb); },
      addEventListener(_t: string, cb: (e: any) => void) { captured.listeners.add(cb); },
      removeEventListener(_t: string, cb: (e: any) => void) { captured.listeners.delete(cb); },
      dispatchEvent() { return false; },
    };
  };
  (globalThis as any).__setMatchMedia = function (query: string, matches: boolean) {
    let entry = __mqRegistry.get(query);
    if (!entry) {
      entry = { matches, listeners: new Set() };
      __mqRegistry.set(query, entry);
      return;
    }
    if (entry.matches === matches) return;
    entry.matches = matches;
    entry.listeners.forEach((cb) => cb({ matches, media: query }));
  };
  if (typeof (globalThis as any).window !== "undefined") {
    (globalThis as any).window.matchMedia = (globalThis as any).matchMedia;
  }
}

// jsdom 25 does provide CSS.escape, but be defensive.
if (typeof (globalThis as any).CSS === "undefined") {
  (globalThis as any).CSS = { escape: (s: string) => String(s).replace(/[^\w-]/g, (c) => "\\" + c) };
} else if (typeof (globalThis as any).CSS.escape !== "function") {
  (globalThis as any).CSS.escape = (s: string) => String(s).replace(/[^\w-]/g, (c) => "\\" + c);
}

// jsdom's `Selection` does not implement the non-standard `modify()` method.
// `sanitizeEditableContent()` calls `selection.modify("extend", "forward",
// "character")` to walk a contenteditable cursor. Provide a minimal polyfill
// that supports just the (alter, direction, granularity) combinations we use:
// extend|move x left|right|forward|backward x character. Also patch
// `Selection.toString()` so cross-node ranges concatenate <br> as "\n",
// matching browser behavior the sanitizer relies on. Idempotent.
if (typeof (globalThis as any).window !== "undefined" &&
    typeof (globalThis as any).window.getSelection === "function") {
  const __sampleSel = (globalThis as any).window.getSelection();
  const __selProto = __sampleSel && Object.getPrototypeOf(__sampleSel);
  // Helper: serialize a node tree as innerText (text + br -> "\n").
  const __renderText = (node: Node): string => {
    let out = "";
    const kids = (node as any).childNodes;
    if (!kids) return out;
    for (let i = 0; i < kids.length; i++) {
      const c: any = kids[i];
      if (c.nodeType === 3 /* TEXT_NODE */) out += c.data;
      else if (c.nodeName === "BR") out += "\n";
      else if (c.nodeType === 1 /* ELEMENT_NODE */) out += __renderText(c);
    }
    return out;
  };
  // Flatten a subtree into per-character entries: 1 entry per text-node
  // char, 1 entry "\n" per <br>. Used to compute selection.toString() in a
  // way that matches real-browser behavior across mixed text/<br> ranges.
  const __flattenChars = (root: Node): string[] => {
    const out: string[] = [];
    const walk = (n: Node) => {
      if (n.nodeType === 3) {
        const d = (n as Text).data;
        for (let i = 0; i < d.length; i++) out.push(d[i]);
        return;
      }
      if (n.nodeName === "BR") { out.push("\n"); return; }
      const kids = (n as any).childNodes;
      if (!kids) return;
      for (let i = 0; i < kids.length; i++) walk(kids[i]);
    };
    walk(root);
    return out;
  };
  // Visible-text offset of (target, targetOffset) within `ancestor`. Each
  // text char and each <br> count as 1. A boundary positioned INSIDE an
  // empty <br> at offset 0 is treated as PAST the br (real-browser semantic).
  const __visibleOffset = (ancestor: Node, target: Node, targetOffset: number): number => {
    let count = 0;
    let found = false;
    const walk = (node: Node) => {
      if (found) return;
      if (node === target) {
        if (node.nodeType === 3) {
          const data = (node as Text).data;
          count += Math.min(targetOffset, data.length);
        } else if (node.nodeName === "BR") {
          count += 1;
        } else {
          const kids = (node as any).childNodes;
          for (let i = 0; i < targetOffset && i < kids.length; i++) {
            walk(kids[i]);
            if (found) return;
          }
        }
        found = true;
        return;
      }
      if (node.nodeType === 3) {
        count += (node as Text).data.length;
        return;
      }
      if (node.nodeName === "BR") {
        count += 1;
        return;
      }
      const kids = (node as any).childNodes;
      if (!kids) return;
      for (let i = 0; i < kids.length; i++) {
        walk(kids[i]);
        if (found) return;
      }
    };
    walk(ancestor);
    return count;
  };
  if (__selProto && !__selProto.__sv_polyfilled) {
    // Override toString to mirror what sanitizeEditableContent expects from
    // a real browser selection across mixed text/<br> nodes. Each char and
    // each <br>="\n" contribute one position.
    __selProto.toString = function () {
      if (this.rangeCount === 0) return "";
      const range = this.getRangeAt(0);
      const ancestor = range.commonAncestorContainer;
      const startN = __visibleOffset(ancestor, range.startContainer, range.startOffset);
      const endN = __visibleOffset(ancestor, range.endContainer, range.endOffset);
      if (endN <= startN) return "";
      const chars = __flattenChars(ancestor);
      return chars.slice(startN, endN).join("");
    };
    __selProto.modify = function (alter: string, direction: string, granularity: string) {
      if (this.rangeCount === 0) return;
      const range = this.getRangeAt(0);
      const forward = direction === "right" || direction === "forward";
      let node: Node | null = forward ? range.endContainer : range.startContainer;
      let offset = forward ? range.endOffset : range.startOffset;
      const stepForward = (): boolean => {
        while(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            const len = (node as Text).data.length;
            if (offset < len) { offset += 1; return true; }
            const parent = node.parentNode;
            if (!parent) return false;
            offset = Array.prototype.indexOf.call(parent.childNodes, node) + 1;
            node = parent;
            continue;
          }
          const elem = node as Element;
          if (offset < elem.childNodes.length) {
            const child = elem.childNodes[offset];
            if (child.nodeType === Node.TEXT_NODE) {
              if ((child as Text).data.length > 0) { node = child; offset = 1; return true; }
              offset += 1; continue;
            }
            const childEl = child as Element;
            const noChildren = !childEl.childNodes || childEl.childNodes.length === 0;
            if (noChildren) { offset += 1; return true; }
            node = childEl; offset = 0; continue;
          }
          const parent = node.parentNode;
          if (!parent) return false;
          offset = Array.prototype.indexOf.call(parent.childNodes, node) + 1;
          node = parent;
        }
        return false;
      };
      const stepBackward = (): boolean => {
        while(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            if (offset > 0) { offset -= 1; return true; }
            const parent = node.parentNode;
            if (!parent) return false;
            offset = Array.prototype.indexOf.call(parent.childNodes, node);
            node = parent;
            continue;
          }
          const elem = node as Element;
          if (offset > 0) {
            const child = elem.childNodes[offset - 1];
            if (child.nodeType === Node.TEXT_NODE) {
              const len = (child as Text).data.length;
              if (len > 0) { node = child; offset = len - 1; return true; }
              offset -= 1; continue;
            }
            const childEl = child as Element;
            const noChildren = !childEl.childNodes || childEl.childNodes.length === 0;
            if (noChildren) { offset -= 1; return true; }
            node = childEl; offset = childEl.childNodes.length; continue;
          }
          const parent = node.parentNode;
          if (!parent) return false;
          offset = Array.prototype.indexOf.call(parent.childNodes, node);
          node = parent;
        }
        return false;
      };
      if (granularity === "character") {
        if (forward) stepForward(); else stepBackward();
      } else if (granularity === "word") {
        if (node && node.nodeType === Node.TEXT_NODE) {
          const text = (node as Text).data;
          if (forward) {
            const re = /\S+/g;
            re.lastIndex = offset;
            const m = re.exec(text);
            offset = m ? m.index + m[0].length : text.length;
          } else {
            const before = text.slice(0, offset);
            const m = /\S+\s*$/.exec(before);
            offset = m ? m.index : 0;
          }
        }
      }
      if (!node) return;
      const isExtend = alter === "extend";
      if (isExtend) {
        if (forward) range.setEnd(node, offset);
        else range.setStart(node, offset);
      } else {
        range.setStart(node, offset);
        range.setEnd(node, offset);
      }
    };
    __selProto.__sv_polyfilled = true;
  }
}

// jsdom does not implement HTMLElement.innerText. sanitizeEditableContent
// reads and writes it. Provide a minimal polyfill: getter renders text with
// <br> as "\n"; setter splits on "\n" and creates text/<br> children.
if (typeof (globalThis as any).window !== "undefined" &&
    typeof (globalThis as any).window.HTMLElement !== "undefined") {
  const __HEProto: any = (globalThis as any).window.HTMLElement.prototype;
  const __probe = (globalThis as any).document?.createElement?.("span");
  if (__probe && typeof (__probe as any).innerText === "undefined" && !__HEProto.__sv_innerTextPolyfilled) {
    const __renderTextEl = (node: Node): string => {
      let out = "";
      const kids = (node as any).childNodes;
      if (!kids) return out;
      for (let i = 0; i < kids.length; i++) {
        const c: any = kids[i];
        if (c.nodeType === 3) out += c.data;
        else if (c.nodeName === "BR") out += "\n";
        else if (c.nodeType === 1) out += __renderTextEl(c);
      }
      return out;
    };
    Object.defineProperty(__HEProto, "innerText", {
      configurable: true,
      get(this: HTMLElement) { return __renderTextEl(this); },
      set(this: HTMLElement, value: any) {
        while(this.firstChild)this.removeChild(this.firstChild);
        const doc = this.ownerDocument || (globalThis as any).document;
        const parts = String(value == null ? "" : value).split("\n");
        for (let i = 0; i < parts.length; i++) {
          if (i > 0)this.appendChild(doc.createElement("br"));
          if (parts[i].length > 0)this.appendChild(doc.createTextNode(parts[i]));
        }
      },
    });
    __HEProto.__sv_innerTextPolyfilled = true;
  }
}

// jsdom does not parse comma-separated CSS shorthand values like
// `animationDuration: "5s, 3ms"` through `getComputedStyle`, and returns the
// empty string for unset animation-* properties (real browsers default to
// "0s"/"none"). The `AnimationUtils.getAnimationDuration` helper relies on
// the round-trip and on the "0s" defaults. Wrap `window.getComputedStyle`
// with a Proxy that falls back to inline style and finally to a sane
// browser-style default for the animation-* shorthand props. Idempotent.
if (typeof (globalThis as any).window !== "undefined" &&
    typeof (globalThis as any).window.getComputedStyle === "function") {
  const __win: any = (globalThis as any).window;
  if (!__win.__sv_getComputedStyle_animationPatched) {
    const __innerGCS = __win.getComputedStyle.bind(__win);
    const __animDefaults: Record<string, string> = {
      animationDuration: "0s",
      animationDelay: "0s",
      animationName: "none",
    };
    // Real browsers normalize CSS time values to seconds for computed style
    // (e.g. `"3ms"` -> `"0.003s"`). jsdom returns the raw string. The
    // production `getMsFromRule` helper assumes the trailing unit is exactly
    // one character (an "s"), so an unnormalized `"3ms"` becomes `NaN`.
    // Normalize each comma-separated entry the same way real browsers do.
    const __normalizeAnimTime = (value: string): string => {
      if (!value) return value;
      return value.split(",").map((part) => {
        const t = part.trim();
        const m = /^(-?\d*\.?\d+)ms$/i.exec(t);
        if (m) return (parseFloat(m[1]) / 1000) + "s";
        return t;
      }).join(", ");
    };
    __win.getComputedStyle = function (el: Element, pseudo?: string | null) {
      const cs = __innerGCS(el, pseudo as any);
      return new Proxy(cs, {
        get(target, prop, receiver) {
          if (typeof prop === "string" && prop in __animDefaults) {
            let v = (target as any)[prop];
            if (!v) {
              const inline = (el as HTMLElement).style ? (el as HTMLElement).style[prop as any] : "";
              v = inline || __animDefaults[prop];
            }
            if (prop === "animationDuration" || prop === "animationDelay") {
              v = __normalizeAnimTime(v);
            }
            return v;
          }
          return Reflect.get(target, prop, receiver);
        },
      });
    };
    __win.__sv_getComputedStyle_animationPatched = true;
    if (typeof (globalThis as any).getComputedStyle === "function") {
      (globalThis as any).getComputedStyle = __win.getComputedStyle;
    }
  }
}

// jsdom's requestAnimationFrame uses setTimeout(cb, 16). Some SurveyJS code
// schedules rAF chains during synchronous test flow; Vitest tests that don't
// await time will miss the callback. Replace with a microtask-fast variant
// that still defers (so re-entrancy works) but resolves on next macrotask.
if (typeof (globalThis as any).requestAnimationFrame === "function") {
  const __origRAF = (globalThis as any).requestAnimationFrame;
  const __origCAF = (globalThis as any).cancelAnimationFrame;
  (globalThis as any).requestAnimationFrame = (cb: (t: number) => void) => {
    return setTimeout(() => cb(performance.now()), 0) as any;
  };
  (globalThis as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
  (globalThis as any).__restoreRAF = () => {
    (globalThis as any).requestAnimationFrame = __origRAF;
    (globalThis as any).cancelAnimationFrame = __origCAF;
  };
}

// jsdom does not implement ResizeObserver, but survey-library's responsive
// logic constructs `new ResizeObserver(...)` during `afterRender`. Provide a
// no-op stub so tests that don't care about responsive behavior don't crash.
// Tests that DO care can still override `window.ResizeObserver` per-test.
if (typeof (globalThis as any).ResizeObserver === "undefined") {
  (globalThis as any).ResizeObserver = class {
    observe() { /* no-op */ }
    unobserve() { /* no-op */ }
    disconnect() { /* no-op */ }
  };
}

// jsdom does not implement AnimationEvent. Tests that dispatch
// `new AnimationEvent("animationend")` need a constructible event class.
// Map it to the standard Event so handlers can still receive a plain Event.
if (typeof (globalThis as any).AnimationEvent === "undefined") {
  (globalThis as any).AnimationEvent = class extends Event {
    constructor(type: string, init?: EventInit) { super(type, init); }
  };
}

// jsdom's `getComputedStyle` returns only the element's own inline styles for
// CSS custom properties (--*) and does not walk up the tree to inherit values
// declared on ancestors (e.g. `document.documentElement`). Real browsers do
// inherit custom properties. SurveyJS rating-color logic reads theme variables
// like `--sd-rating-bad-color` from `getComputedStyle(rootElement)`, so without
// this shim those reads return "" under jsdom even when the test set them on
// `document.documentElement`. Patch only the `getPropertyValue` accessor to
// fall back to ancestor inline styles for `--*` properties.
if (typeof (globalThis as any).window !== "undefined" &&
    typeof (globalThis as any).window.getComputedStyle === "function") {
  const win: any = (globalThis as any).window;
  if (!win.__sv_getComputedStyle_customPropPatched) {
    const orig = win.getComputedStyle.bind(win);
    const lookupCustomProp = (el: Element | null, name: string): string => {
      let cur: Element | null = el;
      while(cur) {
        const inline = (cur as HTMLElement).style;
        if (inline) {
          const v = inline.getPropertyValue(name);
          if (v) return v;
        }
        cur = cur.parentElement;
      }
      return "";
    };
    win.getComputedStyle = function (el: Element, pseudo?: string | null) {
      const cs = orig(el, pseudo as any);
      const origGet = cs.getPropertyValue.bind(cs);
      cs.getPropertyValue = function (name: string) {
        const v = origGet(name);
        if (v) return v;
        if (typeof name === "string" && name.startsWith("--")) {
          return lookupCustomProp(el, name);
        }
        return v;
      };
      return cs;
    };
    win.__sv_getComputedStyle_customPropPatched = true;
    if ((globalThis as any).getComputedStyle === orig.__originalRef ||
        typeof (globalThis as any).getComputedStyle === "function") {
      (globalThis as any).getComputedStyle = win.getComputedStyle;
    }
  }
}

// jsdom does not implement HTMLCanvasElement.getContext (without the optional
// `canvas` npm package). signature_pad and rating-color logic both require a
// 2D context. Provide a minimal stub that returns no-op methods plus a
// settable `fillStyle` (rating-color logic reads back the normalized color).
// Tests that need real canvas rendering must run under Karma + real browser.
//
// `fillStyle`/`strokeStyle` mimic the real-browser color-normalization
// behavior: assigning a parseable CSS color stores the normalized form
// (`#rrggbb` for opaque, `rgba(r, g, b, a)` otherwise); assigning an
// unparseable value is silently ignored, leaving the previous value intact.
// This is what `src/question_rating.ts#getRGBColor` relies on to translate
// CSS variables (hex, named, `rgb(...)`, `rgba(...)`) into the canonical
// `[r, g, b, a]` array used to build `--sd-rating-item-color` styles.
if (typeof (globalThis as any).HTMLCanvasElement !== "undefined") {
  const proto: any = (globalThis as any).HTMLCanvasElement.prototype;
  if (!proto.__sv_getContext_stubbed) {
    // Minimal CSS named-color table covering values used by the rating-color
    // tests. Extend if other tests start exercising additional names.
    const NAMED_COLORS: Record<string, [number, number, number]> = {
      black: [0, 0, 0],
      white: [255, 255, 255],
      red: [255, 0, 0],
      green: [0, 128, 0],
      blue: [0, 0, 255],
      gold: [255, 215, 0],
      silver: [192, 192, 192],
      gray: [128, 128, 128],
      grey: [128, 128, 128],
      yellow: [255, 255, 0],
      orange: [255, 165, 0],
      transparent: [0, 0, 0],
    };
    const parseCssColor = (value: unknown): [number, number, number, number] | null => {
      if (typeof value !== "string") return null;
      const s = value.trim().toLowerCase();
      if (!s) return null;
      let m = /^#([0-9a-f]{3})$/.exec(s);
      if (m) {
        const r = parseInt(m[1][0] + m[1][0], 16);
        const g = parseInt(m[1][1] + m[1][1], 16);
        const b = parseInt(m[1][2] + m[1][2], 16);
        return [r, g, b, 1];
      }
      m = /^#([0-9a-f]{6})$/.exec(s);
      if (m) {
        return [
          parseInt(m[1].slice(0, 2), 16),
          parseInt(m[1].slice(2, 4), 16),
          parseInt(m[1].slice(4, 6), 16),
          1,
        ];
      }
      m = /^#([0-9a-f]{8})$/.exec(s);
      if (m) {
        return [
          parseInt(m[1].slice(0, 2), 16),
          parseInt(m[1].slice(2, 4), 16),
          parseInt(m[1].slice(4, 6), 16),
          parseInt(m[1].slice(6, 8), 16) / 255,
        ];
      }
      m = /^rgba?\(([^)]+)\)$/.exec(s);
      if (m) {
        const parts = m[1].split(",").map((p) => p.trim());
        if (parts.length === 3 || parts.length === 4) {
          const r = parseInt(parts[0], 10);
          const g = parseInt(parts[1], 10);
          const b = parseInt(parts[2], 10);
          const a = parts.length === 4 ? parseFloat(parts[3]) : 1;
          if (
            [r, g, b].every((v) => !isNaN(v) && v >= 0 && v <= 255) &&
            !isNaN(a) && a >= 0 && a <= 1
          ) {
            return [r, g, b, a];
          }
        }
        return null;
      }
      const named = NAMED_COLORS[s];
      if (named) return [named[0], named[1], named[2], 1];
      return null;
    };
    const formatCssColor = (rgba: [number, number, number, number]): string => {
      const [r, g, b, a] = rgba;
      if (a === 1) {
        const hex = (n: number) => n.toString(16).padStart(2, "0");
        return "#" + hex(r) + hex(g) + hex(b);
      }
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };
    const makeColorAccessor = (initial: string) => {
      let current = initial;
      return {
        get(): string { return current; },
        set(v: unknown) {
          const parsed = parseCssColor(v);
          if (parsed) current = formatCssColor(parsed);
        },
      };
    };
    proto.getContext = function (type: string) {
      if (type !== "2d") return null;
      const fillAccessor = makeColorAccessor("#000000");
      const strokeAccessor = makeColorAccessor("#000000");
      const ctx: any = {
        lineWidth: 1,
        canvas: this,
        save() { /* no-op */ },
        restore() { /* no-op */ },
        scale() { /* no-op */ },
        translate() { /* no-op */ },
        rotate() { /* no-op */ },
        beginPath() { /* no-op */ },
        closePath() { /* no-op */ },
        moveTo() { /* no-op */ },
        lineTo() { /* no-op */ },
        bezierCurveTo() { /* no-op */ },
        quadraticCurveTo() { /* no-op */ },
        arc() { /* no-op */ },
        rect() { /* no-op */ },
        fill() { /* no-op */ },
        stroke() { /* no-op */ },
        fillRect() { /* no-op */ },
        strokeRect() { /* no-op */ },
        clearRect() { /* no-op */ },
        drawImage() { /* no-op */ },
        getImageData() { return { data: new Uint8ClampedArray(4) }; },
        putImageData() { /* no-op */ },
        createImageData() { return { data: new Uint8ClampedArray(4) }; },
        setTransform() { /* no-op */ },
        getTransform() { return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }; },
        measureText() { return { width: 0 }; },
      };
      Object.defineProperty(ctx, "fillStyle", {
        configurable: true,
        enumerable: true,
        get: fillAccessor.get,
        set: fillAccessor.set,
      });
      Object.defineProperty(ctx, "strokeStyle", {
        configurable: true,
        enumerable: true,
        get: strokeAccessor.get,
        set: strokeAccessor.set,
      });
      return ctx;
    };
    proto.toDataURL = function (type?: string) {
      const t = typeof type === "string" && type.length > 0 ? type : "image/png";
      return `data:${t};base64,`;
    };
    proto.__sv_getContext_stubbed = true;
  }
}

// ---------------------------------------------------------------------------
// Custom matchers that bridge QUnit semantics into Vitest.
// ---------------------------------------------------------------------------
// QUnit's `assert.equal(a, b)` uses `==` (loose equality), while Vitest's
// `expect(a).toBe(b)` uses `Object.is` (strict). The migration codemod maps
// `assert.equal` -> `expect().toLooseEqual()` so that legacy comparisons like
// `assert.equal(undefined, null)` or `assert.equal("0", 0)` keep their
// original semantics. New tests should prefer `toBe`/`toEqual` directly.
expect.extend({
  toLooseEqual(received: unknown, expected: unknown) {
    // eslint-disable-next-line eqeqeq
    const pass = received == expected;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${this.utils.printReceived(received)} not to loosely equal ${this.utils.printExpected(expected)}`
          : `expected ${this.utils.printReceived(received)} to loosely equal ${this.utils.printExpected(expected)}`,
    };
  },
  // Mirrors QUnit's `assert.deepEqual` for survey-library observable arrays.
  // `Base.createNewArray` overrides `push`/`pop`/`shift`/`unshift`/`splice` as
  // own enumerable function properties on the array. Vitest's `toEqual` walks
  // own enumerable string keys, so a plain `[1, 2]` literal never matches an
  // observable `[1, 2, push, pop, shift, unshift, splice]`. QUnit's
  // `deepEqual` happened to ignore them. `toEqualValues` strips function-typed
  // own properties recursively before delegating to Vitest's deep-equal.
  toEqualValues(received: unknown, expected: unknown) {
    // Compare arrays ignoring own non-index function-typed properties
    // (`push`/`pop`/`shift`/`unshift`/`splice` overrides on
    // `Base.createNewArray`-produced observable arrays). Falls back to
    // `this.equals` for everything else, which preserves Vitest's normal
    // diff output and handles cycles correctly.
    const arrayValuesEqual = (
      a: unknown,
      b: unknown,
      customTesters: unknown[]
    ): boolean | undefined => {
      const aIsArr = Array.isArray(a);
      const bIsArr = Array.isArray(b);
      if (!aIsArr && !bIsArr) return undefined;
      if (!aIsArr || !bIsArr) return false;
      if ((a as unknown[]).length !== (b as unknown[]).length) return false;
      for (let i = 0; i < (a as unknown[]).length; i++) {
        if (!this.equals((a as unknown[])[i], (b as unknown[])[i], customTesters as never)) {
          return false;
        }
      }
      return true;
    };
    const pass = this.equals(received, expected, [arrayValuesEqual] as never);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${this.utils.printReceived(received)} not to deeply equal ${this.utils.printExpected(expected)} (ignoring array function properties)`
          : `expected values to be deeply equal (ignoring array function properties):\n${this.utils.diff(expected, received) ?? ""}`,
    };
  },
});

declare module "vitest" {
  interface Assertion<T = any> {
    toLooseEqual(expected: unknown): T;
    toEqualValues(expected: unknown): T;
  }
  interface AsymmetricMatchersContaining {
    toLooseEqual(expected: unknown): unknown;
    toEqualValues(expected: unknown): unknown;
  }
}

// ---------------------------------------------------------------------------
// Generalizable singleton cleanup.
// ---------------------------------------------------------------------------
// QUnit tests historically called `ComponentCollection.Instance.clear()` (and
// similar resets) on the trailing line of every test that mutated a singleton.
// When an assertion failed before that line, the cleanup was skipped and the
// next test inherited the leaked state. QUnit hid this because it isolates
// per-module differently; Vitest runs all tests in a file sequentially in the
// same V8 isolate, so leaks propagate.
//
// To make conversion safe AND deterministic, this `afterEach` resets every
// known global singleton after every test, regardless of pass/fail. Tests no
// longer need to call `.clear()` themselves -- the codemod strips trailing
// `.clear()` lines for the same reason.
//
// To register a new singleton for cleanup, add a reset call below.
const __defaultLocale = surveyLocalization.defaultLocale;
afterEach(() => {
  // ComponentCollection: registered custom question types (including internal:true)
  ComponentCollection.Instance.clear(true);
  // surveyLocalization: tests sometimes flip the default locale
  surveyLocalization.defaultLocale = __defaultLocale;
  // settings: re-apply our test defaults in case a test mutated them
  settings.animationEnabled = false;
  settings.dropdownSearchDelay = 0;
});
