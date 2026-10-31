import type { PerfPage } from "../harness/scenario.ts";

// The page helpers that take part in a browser sample's time (03, the clock): the end of the framework update, the
// settle, the UI triggers, rendering. revs.ts adds this file's source to the rev hash of every browser id, so a change
// here asks for a rev bump. Bundled into the page by page-entry.ts.
const W: any = globalThis;
const hop = (): Promise<void> => new Promise((resolve: () => void) => {
  const channel = new MessageChannel();
  channel.port1.onmessage = (): void => resolve();
  channel.port2.postMessage(0);
});
export const frame = (): Promise<void> => new Promise((resolve: () => void) => requestAnimationFrame(() => resolve()));
export const delay = (ms: number): Promise<void> => new Promise((resolve: () => void) => setTimeout(resolve, ms));

export function rootElement(): any {
  return document.getElementById("root");
}

let reactRoot: any;
let shown: any;

function mount(survey: any): void {
  if (W.SurveyReact) {
    if (!reactRoot) reactRoot = W.ReactDOMClient.createRoot(rootElement());
    reactRoot.render(W.React.createElement(W.SurveyReact.Survey, { model: survey }));
  } else {
    W.SurveyUI.renderSurvey(survey, rootElement());
  }
}

// The end of the framework update (03): two MessageChannel hops (React 19 posts its render task from a microtask),
// then a forced layout.
export async function updated(): Promise<void> {
  await hop();
  await hop();
  rootElement().getBoundingClientRect();
  return void document.body.offsetHeight;
}

// Settle, untimed: 250 ms for the action-bar timers, an idle callback (timeout 1 s), one frame.
export async function settle(): Promise<void> {
  await delay(250);
  await new Promise((resolve: () => void) => (W.requestIdleCallback ? W.requestIdleCallback(() => resolve(), { timeout: 1000 }) : setTimeout(resolve, 0)));
  await frame();
}

function setNative(el: any, value: string): void {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const desc = Object.getOwnPropertyDescriptor(proto, "value") as PropertyDescriptor;
  (desc.set as (v: string) => void).call(el, value);
}

const fire = (el: any, type: string): void => { el.dispatchEvent(new Event(type, { bubbles: true })); };

export const page: PerfPage = {
  framework: W.SurveyReact ? "react" : "survey-js-ui",
  show: async(survey: any): Promise<void> => {
    const previous = shown;
    mount(survey);
    shown = survey;
    await updated();
    if (previous && previous !== survey && !previous.isDisposed) previous.dispose();
    await settle();
  },
  render: async(survey: any): Promise<void> => {
    mount(survey);
    shown = survey;
    await updated();
  },
  updated: updated,
  click: async(selector: string): Promise<void> => {
    const el = document.querySelector(selector) as any;
    if (!el) throw new Error("No element for " + selector);
    el.click();
    await updated();
  },
  // Not focused; the native setter, so React's value tracker sees the change.
  commit: async(el: any, value: string): Promise<void> => {
    setNative(el, value);
    fire(el, "input");
    fire(el, "change");
    await updated();
  },
  type: async(el: any, text: string): Promise<void> => {
    for (let i = 0; i < text.length; i++) {
      setNative(el, el.value + text.charAt(i));
      fire(el, "input");
      el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: text.charAt(i) }));
    }
    fire(el, "change");
    await updated();
  },
  query: (selector: string): any => document.querySelector(selector),
  queryAll: (selector: string): Array<any> => Array.prototype.slice.call(document.querySelectorAll(selector))
};
