// Shared conversion report contract.
//
// One shape feeds the programmatic API, the CLI, and telemetry. It is
// versioned, serializable, and CONTENT-FREE from the first commit: it carries
// stable codes, structural pointers, and counts - never a fragment of the
// user's form (labels, option text, expressions). This is the rule that keeps
// form content out of the telemetry payload, so do not add a `value` /
// `sourceText` / `snippet` field "just for debugging" later.

/** Bump when the serialized shape changes in a non-additive way. */
export const REPORT_VERSION = 1 as const;

/**
 * Why a construct did not round-trip cleanly. The four buckets drive different
 * actions - they are not severity levels.
 */
export type ReportBucket =
  // In the source spec, but we have no rule for it yet. Our gap.
  | "unsupported"
  // Not in the source spec at all: format drift or a custom/vendor extension.
  // Different action from `unsupported` - this is the drift alarm.
  | "unknown"
  // We guessed. Renders right, may branch wrong. The dangerous one.
  | "assumed"
  // Knowingly discarded (styling, vendor metadata). Silent unless --verbose.
  | "dropped";

export interface ReportEntry {
  /** Which bucket this belongs to. */
  bucket: ReportBucket;
  /**
   * Stable, greppable code. Namespaced by converter, e.g.
   * `formio.custom-conditional`, `json-schema.if-then-else`. Never renamed
   * without a version bump - telemetry dashboards key off it.
   */
  code: string;
  /**
   * Structural pointer into the SOURCE document (a JSON Pointer or an
   * equivalent path). Locates the construct without quoting its content.
   */
  sourcePointer: string;
  /**
   * Structural path into the PRODUCED SurveyJS JSON (e.g.
   * `pages[0].elements[3].visibleIf`). This is what lets the Creator plugin
   * highlight the affected element after import. Empty string when the
   * construct produced no target node (e.g. a fully dropped field).
   */
  targetPath: string;
  /** How many times this exact (bucket, code, sourcePointer, targetPath) fired. */
  count: number;
}

export interface ConversionReport {
  version: typeof REPORT_VERSION;
  /** Converter id, e.g. `"formio"` or `"json-schema"`. */
  source: string;
  entries: ReportEntry[];
}

export interface ConversionResult<TOutput = unknown> {
  /** The produced SurveyJS survey JSON. */
  output: TOutput;
  report: ConversionReport;
}

/**
 * Accumulates report entries during a conversion, deduplicating by
 * (bucket, code, sourcePointer, targetPath) and incrementing `count`.
 *
 * Every converter threads one builder through its walk and calls the bucket
 * helpers; nothing else writes to the report directly.
 */
export class ReportBuilder {
  private readonly entries = new Map<string, ReportEntry>();

  constructor(private readonly source: string) {}

  private add(entry: Omit<ReportEntry, "count">, times = 1): void {
    const key = `${entry.bucket}\u0000${entry.code}\u0000${entry.sourcePointer}\u0000${entry.targetPath}`;
    const existing = this.entries.get(key);
    if (existing) {
      existing.count += times;
    } else {
      this.entries.set(key, { ...entry, count: times });
    }
  }

  unsupported(code: string, sourcePointer: string, targetPath = ""): void {
    this.add({ bucket: "unsupported", code, sourcePointer, targetPath });
  }

  unknown(code: string, sourcePointer: string, targetPath = ""): void {
    this.add({ bucket: "unknown", code, sourcePointer, targetPath });
  }

  assumed(code: string, sourcePointer: string, targetPath = ""): void {
    this.add({ bucket: "assumed", code, sourcePointer, targetPath });
  }

  dropped(code: string, sourcePointer: string, targetPath = ""): void {
    this.add({ bucket: "dropped", code, sourcePointer, targetPath });
  }

  build(): ConversionReport {
    return {
      version: REPORT_VERSION,
      source: this.source,
      // Stable order: bucket, then code, then source pointer.
      entries: [...this.entries.values()].sort(
        (a, b) =>
          a.bucket.localeCompare(b.bucket) ||
          a.code.localeCompare(b.code) ||
          a.sourcePointer.localeCompare(b.sourcePointer)
      )
    };
  }
}

/** Buckets that `--fail-on` understands, in reporting order. */
export const REPORT_BUCKETS: ReportBucket[] = ["unsupported", "unknown", "assumed", "dropped"];

/** Total occurrences across all entries in a bucket. */
export function bucketCount(report: ConversionReport, bucket: ReportBucket): number {
  return report.entries
    .filter((e) => e.bucket === bucket)
    .reduce((sum, e) => sum + e.count, 0);
}

/**
 * Whether the report should fail a pipeline given the buckets passed to
 * `--fail-on`. True when any named bucket has at least one occurrence.
 */
export function shouldFail(report: ConversionReport, failOn: ReportBucket[]): boolean {
  return failOn.some((bucket) => bucketCount(report, bucket) > 0);
}

/**
 * Human-readable rendering. The library NEVER writes to console by default -
 * the caller (CLI, Creator plugin, a user's script) decides what to do with
 * this string.
 */
export function formatReport(report: ConversionReport, options: { verbose?: boolean } = {}): string {
  const { verbose = false } = options;
  const lines: string[] = [];
  lines.push(`Conversion report (${report.source}, v${report.version})`);

  const shown = verbose
    ? REPORT_BUCKETS
    : REPORT_BUCKETS.filter((b) => b !== "dropped"); // `dropped` is silent unless --verbose.

  let total = 0;
  for (const bucket of shown) {
    const entries = report.entries.filter((e) => e.bucket === bucket);
    if (entries.length === 0) continue;
    const count = bucketCount(report, bucket);
    total += count;
    lines.push(`  ${bucket} (${count}):`);
    for (const e of entries) {
      const at = e.targetPath ? ` -> ${e.targetPath}` : "";
      lines.push(`    ${e.code}  @ ${e.sourcePointer}${at}  x${e.count}`);
    }
  }

  if (total === 0) {
    lines.push("  clean - every construct converted with a known rule.");
  }
  return lines.join("\n");
}
