import type { Comparison, ScenarioVerdict } from "../harness/node/compare.ts";
import type { KnownChange } from "../harness/node/known.ts";
import type { CommitPr } from "./pr.ts";
import type { BisectResult } from "../harness/node/bisect-step.ts";

// The Discord messages (05, D13): a payload and its files, no network. run.sh posts them from the host.
// Limits (docs.discord.com/developers, checked 2026-10-29): content 2,000 characters, 10 embeds, an embed title 256,
// description 4,096, footer 2,048, and 6,000 characters over all embeds of a message; 20 MiB per file. The number of
// files per message is not stated there: we attach at most 10.
export const limits = { content: 2000, embeds: 10, title: 256, description: 4096, footer: 2048, total: 6000, files: 10, fileBytes: 20 * 1024 * 1024 };
export const maxRangeLines = 15;
export const maxChanges = 8;
export const maxPrevious = 5;

export interface Embed {
  title?: string;
  description?: string;
  color?: number;
  footer?: { text: string };
}

export interface Payload {
  content: string;
  embeds: Array<Embed>;
  allowed_mentions: { parse: Array<string>, roles?: Array<string> };
  attachments?: Array<{ id: number, filename: string }>;
}

export interface Message {
  payload: Payload;
  // File names, in order: files[0], files[1], ...
  files: Array<string>;
}

// Terminal colour codes (a Playwright error message, a build log).
export const stripAnsi = new RegExp(String.fromCharCode(27) + "\\[[0-9;]*[A-Za-z]", "g");

// Untrusted text (commit subjects, labels, refs, log lines): Markdown escaped, URLs wrapped in <...> so they neither
// format nor unfurl. allowed_mentions stops pings; "<" is escaped too, so a mention cannot even render.
export function escapeText(text: string): string {
  // Colour codes and other control characters go first.
  const plain = String(text).replace(stripAnsi, "").split("").filter((c: string) => c === "\n" || (c.charCodeAt(0) >= 32 && c.charCodeAt(0) !== 127)).join("");
  const parts = plain.split(/(https?:\/\/[^\s<>]+)/);
  return parts.map((part: string, i: number) => (i % 2 === 1 ? "<" + part + ">" : part.replace(/([\\*_~`|>\[\]#<])/g, "\\$1"))).join("");
}

function cut(text: string, max: number): string {
  return text.length <= max ? text : text.substring(0, max - 1) + "\u2026";
}

// Lines that fit max characters, then "+N more"; hidden counts items left out before (the 15-line cut of the range).
export function fitLines(lines: Array<string>, max: number, hidden: number = 0): string {
  const res: Array<string> = [];
  let size = 0;
  for (let i = 0; i < lines.length; i++) {
    const more = "+" + (lines.length - i + hidden) + " more";
    const room = max - size - (i < lines.length - 1 || hidden > 0 ? more.length + 1 : 0);
    if (lines[i].length + 1 > room) {
      res.push(more);
      return res.join("\n");
    }
    res.push(lines[i]);
    size += lines[i].length + 1;
  }
  if (hidden > 0) res.push("+" + hidden + " more");
  return res.join("\n");
}

// The commit range as "[#NNNN](url) title" lines, at most 15.
export function rangeLines(commits: Array<CommitPr>): Array<string> {
  return commits.slice(0, maxRangeLines).map((c: CommitPr) => (c.pr ? "[#" + c.pr + "](" + c.url + ") " : "[" + c.sha.substring(0, 9) + "](" + c.url + ") ") +
    escapeText(cut(c.title, 90)));
}

export function rangeText(commits: Array<CommitPr>, max: number): string {
  return fitLines(rangeLines(commits), max, Math.max(0, commits.length - maxRangeLines));
}

export const countOrder = ["ok", "improved", "regression", "counter regression", "noisy", "slow-process", "unconfirmed", "not-run", "missing",
  "fixture changed", "new", "skipped", "unstable", "counterOnly", "no reference", "local"];

export function counts(c: Comparison): string {
  const n: { [v: string]: number } = {};
  c.verdicts.forEach((v: ScenarioVerdict) => { n[v.verdict] = (n[v.verdict] || 0) + 1; });
  return countOrder.filter((v: string) => n[v]).map((v: string) => n[v] + " " + (v === "counter regression" ? "counter" : v)).join(" \u00b7 ");
}

const pct = (v: number | undefined): string => (v === undefined || !isFinite(v) ? "" : (v >= 0 ? "+" : "") + (v * 100).toFixed(1) + "%");
const ms = (v: number | undefined): string => (v === undefined || isNaN(v) ? "?" : String(Math.round(v * 10) / 10));

export function changeLine(v: ScenarioVerdict): string {
  if (v.verdict === "counter regression") {
    const c = v.counters.filter((x: any) => x.name === v.counter)[0];
    return "**counter** `" + v.id + "` " + v.counter + " " + (c ? c.ref + " \u2192 " + c.value : "");
  }
  if (v.verdict === "missing" || v.verdict === "fixture changed") return "**" + v.verdict + "** `" + v.id + "`" + (v.reason ? " " + escapeText(cut(v.reason, 160)) : "");
  const reruns = v.rerunMedians && v.rerunMedians.length ? ", reruns " + v.rerunMedians.map(ms).join(", ") : "";
  const tags = v.tags.length ? " [" + v.tags.join(", ") + "]" : "";
  return (v.verdict === "regression" ? "**regression**" : v.verdict) + " `" + v.id + "` " + ms(v.reference) + " \u2192 " + ms(v.median) + " ms (" + pct(v.change) +
    (v.threshold !== undefined ? ", threshold " + pct(v.threshold) : "") + reruns + ")" + tags;
}

const rank: { [v: string]: number } = { "regression": 0, "counter regression": 0, "missing": 1, "fixture changed": 1, "unconfirmed": 2, "improved": 3 };

// The changes against the reference: failures first, then unconfirmed, then improvements, each by the size of the change.
export function changes(c: Comparison): Array<ScenarioVerdict> {
  return c.verdicts.filter((v: ScenarioVerdict) => rank[v.verdict] !== undefined)
    .sort((a: ScenarioVerdict, b: ScenarioVerdict) => rank[a.verdict] - rank[b.verdict] || Math.abs(b.change || 0) - Math.abs(a.change || 0));
}

export interface SuiteReport {
  suite: string;
  // "ok" or what went wrong before a comparison: "build failed", "timed out", "failed", "skipped".
  status: string;
  comparison?: Comparison;
  known?: KnownChange;
  // A known entry's first bad commit, by id, for the "still regressed" lines.
  firstBad?: { [id: string]: CommitPr | undefined };
  unstable?: Array<string>;
  buildLog?: { pkg: string, tail: Array<string> };
  notes?: Array<string>;
}

export function suiteEmbed(r: SuiteReport, max: number): Embed {
  const c = r.comparison;
  const lines: Array<string> = [];
  if (r.status !== "ok") lines.push("**" + r.status + "**");
  if (r.buildLog) lines.push("`build-" + r.buildLog.pkg + ".log`, last lines:", "```", ...r.buildLog.tail.slice(-10).map((l: string) => cut(l.replace(/`/g, "'"), 150)), "```");
  (r.notes || []).forEach((n: string) => lines.push(escapeText(n)));
  if (c) {
    if (c.newMachineKey) lines.push("new machine key `" + c.machineKey + "`: counters against the newest baseline, times not judged");
    const ch = changes(c);
    if (ch.length) {
      lines.push("__Against the reference__");
      ch.slice(0, maxChanges).forEach((v: ScenarioVerdict) => lines.push(changeLine(v)));
      if (ch.length > maxChanges) lines.push("+" + (ch.length - maxChanges) + " more");
    }
    const prev = c.verdicts.filter((v: ScenarioVerdict) => v.vsPrevious !== undefined && Math.abs(v.vsPrevious) >= 0.1)
      .sort((a: ScenarioVerdict, b: ScenarioVerdict) => Math.abs(b.vsPrevious!) - Math.abs(a.vsPrevious!));
    if (prev.length && c.previous) {
      lines.push("__Against the previous night__ (" + c.previous.date.substring(0, 10) + ")");
      prev.slice(0, maxPrevious).forEach((v: ScenarioVerdict) => lines.push("`" + v.id + "` " + pct(v.vsPrevious)));
    }
    (r.known ? r.known.still : []).forEach((s: any) => {
      const fb = r.firstBad ? r.firstBad[s.id] : undefined;
      lines.push("still regressed since " + s.entry.since.substring(0, 10) + ": `" + s.id + "`" +
        (fb ? " (first bad " + fb.sha.substring(0, 9) + (fb.pr ? " [#" + fb.pr + "](" + fb.url + ")" : "") + ")" : ""));
    });
    const rolling = c.verdicts.filter((v: ScenarioVerdict) => v.timeSource === "rolling");
    if (rolling.length) lines.push("reference: rolling since " + rolling.map((v: ScenarioVerdict) => (v.referenceSince || "").substring(0, 10) + " `" + v.id + "`").join(", "));
  }
  if (r.unstable && r.unstable.length) lines.push("unstable: " + r.unstable.map((id: string) => "`" + id + "`").join(", "));
  const failed = c ? c.failed : r.status !== "ok" && r.status !== "skipped";
  return { title: cut(r.suite + (c ? ": " + counts(c) : ""), limits.title), description: fitLines(lines, max), color: failed ? 0xd83c3e : 0x2da44e };
}

export interface ResultMessageInput {
  kind: string;
  label: string;
  ref: string;
  commit: string;
  date: string;
  durationMin: number;
  range: Array<CommitPr>;
  rangeFrom?: string | null;
  suites: Array<SuiteReport>;
  notes: Array<string>;
  roleId?: string;
  newRegression: boolean;
  footer: string;
  files: Array<string>;
}

export function statusIcon(suites: Array<SuiteReport>): string {
  if (suites.some((s: SuiteReport) => (s.comparison ? s.comparison.failed : s.status !== "ok" && s.status !== "skipped"))) return "\u274c";
  const warn = ["unconfirmed", "noisy", "slow-process", "not-run", "no reference"];
  if (suites.some((s: SuiteReport) => s.status !== "ok" || (s.comparison && s.comparison.verdicts.some((v: ScenarioVerdict) => warn.indexOf(v.verdict) > -1)))) return "\u26a0\ufe0f";
  return "\u2705";
}

function withAttachments(payload: Payload, files: Array<string>): Message {
  const list = files.slice(0, limits.files);
  payload.attachments = list.map((f: string, i: number) => ({ id: i, filename: f.split(/[\\/]/).pop() as string }));
  return { payload: payload, files: list };
}

// Shrinks descriptions until the embeds fit 6,000 characters in all.
function fitTotal(embeds: Array<Embed>): Array<Embed> {
  const size = (): number => embeds.reduce((s: number, e: Embed) => s + (e.title || "").length + (e.description || "").length + (e.footer ? e.footer.text.length : 0), 0);
  while(size() > limits.total) {
    const longest = embeds.reduce((a: Embed, b: Embed) => ((b.description || "").length > (a.description || "").length ? b : a));
    const lines = (longest.description || "").split("\n");
    longest.description = fitLines(lines.slice(0, Math.max(1, lines.length - 2)), limits.description);
    if (lines.length <= 1) longest.description = cut(longest.description, Math.max(1, (longest.description || "").length - (size() - limits.total)));
  }
  return embeds;
}

export function resultMessage(m: ResultMessageInput): Message {
  const head = statusIcon(m.suites) + " " + escapeText(m.kind) + (m.label && m.label !== m.kind ? " \u00b7 " + escapeText(m.label) : "") + " \u00b7 " + escapeText(m.ref) +
    " \u00b7 `" + m.commit.substring(0, 9) + "` \u00b7 " + m.date.substring(0, 16).replace("T", " ") + " UTC \u00b7 " + Math.round(m.durationMin) + " min";
  const countsLine = m.suites.map((s: SuiteReport) => "**" + s.suite + "** " + (s.comparison ? counts(s.comparison) : s.status)).join("\n");
  const mention = m.newRegression && m.roleId ? "\n<@&" + m.roleId + "> new regression" : "";
  const notes = m.notes.length ? "\n" + m.notes.map(escapeText).join("\n") : "";
  const content = cut(head + "\n" + countsLine + notes, limits.content - mention.length) + mention;
  const embeds: Array<Embed> = [];
  if (m.range.length) {
    embeds.push({ title: "Commits since " + (m.rangeFrom ? m.rangeFrom.substring(0, 9) : "the last run") + " (" + m.range.length + ")",
      description: rangeText(m.range, 2400) });
  }
  const used = embeds.reduce((s: number, e: Embed) => s + (e.title || "").length + (e.description || "").length, 0);
  const room = Math.floor((limits.total - used - 100 - m.footer.length) / Math.max(1, m.suites.length));
  m.suites.slice(0, limits.embeds - embeds.length).forEach((s: SuiteReport) => embeds.push(suiteEmbed(s, Math.min(limits.description, Math.max(200, room)))));
  if (embeds.length) embeds[embeds.length - 1].footer = { text: cut(m.footer, limits.footer) };
  const allowed: Payload["allowed_mentions"] = { parse: [] };
  if (mention) allowed.roles = [m.roleId as string];
  return withAttachments({ content: content, embeds: fitTotal(embeds), allowed_mentions: allowed }, m.files);
}

export interface BisectReport {
  suite: string;
  id: string;
  status: "found" | "narrowed" | "not-reproduced" | "not-in-range" | "timed out" | "skipped (budget)" | "error";
  message: string;
  result?: BisectResult;
  firstBad?: CommitPr;
  durationMin?: number;
}

// The second message: always posted when a bisect was due, whatever its outcome.
export function bisectMessage(reports: Array<BisectReport>, head: { kind: string, commit: string }, files: Array<string>): Message {
  const icon = reports.some((r: BisectReport) => r.status === "found") ? "\ud83d\udd0e" : "\u26a0\ufe0f";
  const content = cut(icon + " bisect \u00b7 " + escapeText(head.kind) + " \u00b7 `" + head.commit.substring(0, 9) + "`\n" + reports.map((r: BisectReport) => {
    const fb = r.firstBad;
    const what = r.status === "found" && fb ? "first bad `" + fb.sha.substring(0, 9) + "` " + (fb.pr ? "[#" + fb.pr + "](<" + fb.url + ">) " : "<" + fb.url + "> ") + escapeText(cut(fb.title, 120)) :
      escapeText(r.status + ": " + r.message);
    return "**" + r.suite + "** `" + r.id + "`: " + what;
  }).join("\n"), limits.content);
  const embeds = reports.slice(0, limits.embeds).map((r: BisectReport): Embed => {
    const res = r.result;
    const lines: Array<string> = [];
    if (res && res.good && res.bad) {
      lines.push("good `" + res.good.commit.substring(0, 9) + "` " + res.good.medians.map(ms).join(", ") + " \u2192 median " + ms(res.good.median));
      lines.push("bad `" + res.bad.commit.substring(0, 9) + "` " + res.bad.medians.map(ms).join(", ") + " \u2192 median " + ms(res.bad.median));
    }
    (res ? res.steps : []).forEach((s: any) => lines.push((s.bad ? "bad " : "good ") + "`" + s.commit.substring(0, 9) + "` " + s.medians.map(ms).join(", ") + " \u2192 " + ms(s.median)));
    if (res && res.unbuildable && res.unbuildable.length) lines.push("unbuildable: " + res.unbuildable.map((s: string) => "`" + s.substring(0, 9) + "`").join(", "));
    if (r.durationMin !== undefined) lines.push(Math.round(r.durationMin) + " min");
    return { title: cut(r.suite + " " + r.id + ": " + r.status, limits.title), description: fitLines(lines, 900) };
  });
  return withAttachments({ content: content, embeds: fitTotal(embeds), allowed_mentions: { parse: [] } }, files);
}

// run.sh's own posts and the infrastructure failures of nightly.ts use fixed templates with no untrusted text.
export function plainMessage(text: string, files: Array<string> = []): Message {
  return withAttachments({ content: cut(text, limits.content), embeds: [], allowed_mentions: { parse: [] } }, files);
}

// The size a message's embeds count against the 6,000 limit.
export function embedsSize(p: Payload): number {
  return p.embeds.reduce((s: number, e: Embed) => s + (e.title || "").length + (e.description || "").length + (e.footer ? e.footer.text.length : 0), 0);
}
