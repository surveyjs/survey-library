// Thin CLI over the converters. The library never writes to console; this is
// the one place that prints. It reads a source form definition, converts it,
// writes the SurveyJS JSON to stdout (or --out), prints the formatted report
// to stderr, and exits non-zero when --fail-on is tripped.
//
// Usage:
//   survey-converter --from formio        form.json
//   survey-converter --from json-schema   schema.json --out survey.json
//   survey-converter --from formio form.json --fail-on unsupported,assumed --verbose

import { readFileSync, writeFileSync } from "node:fs";
import { convert as convertFormio } from "./formio/index";
import { convert as convertJsonSchema } from "./json-schema/index";
import {
  ConversionResult,
  formatReport,
  REPORT_BUCKETS,
  ReportBucket,
  shouldFail
} from "./report";
import { ConverterError } from "./errors";

type Format = "formio" | "json-schema";

interface CliArgs {
  from?: Format;
  input?: string;
  out?: string;
  failOn: ReportBucket[];
  verbose: boolean;
}

const CONVERTERS: Record<Format, (input: unknown) => ConversionResult> = {
  formio: convertFormio,
  "json-schema": convertJsonSchema
};

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { failOn: [], verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--from") {
      args.from = argv[++i] as Format;
    } else if (a === "--out") {
      args.out = argv[++i];
    } else if (a === "--fail-on") {
      args.failOn = (argv[++i] ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) as ReportBucket[];
    } else if (a === "--verbose") {
      args.verbose = true;
    } else if (!a.startsWith("-")) {
      args.input = a;
    }
  }
  return args;
}

function fail(message: string): never {
  process.stderr.write(`survey-converter: ${message}\n`);
  process.exit(2);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (!args.from) fail("--from <formio|json-schema> is required");
  if (!args.input) fail("a source file path is required");
  if (!(args.from in CONVERTERS)) fail(`unknown --from '${args.from}'`);

  const badBucket = args.failOn.find((b) => !REPORT_BUCKETS.includes(b));
  if (badBucket) fail(`unknown --fail-on bucket '${badBucket}'`);

  let raw: string;
  try {
    raw = readFileSync(args.input!, "utf8");
  } catch(e) {
    fail(`cannot read ${args.input}: ${(e as Error).message}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw!);
  } catch(e) {
    fail(`${args.input} is not valid JSON: ${(e as Error).message}`);
  }

  let result: ConversionResult;
  try {
    result = CONVERTERS[args.from!](parsed);
  } catch(e) {
    if (e instanceof ConverterError) fail(e.message);
    throw e;
  }

  const json = JSON.stringify(result.output, null, 2);
  if (args.out) {
    writeFileSync(args.out, json + "\n", "utf8");
  } else {
    process.stdout.write(json + "\n");
  }

  process.stderr.write(formatReport(result.report, { verbose: args.verbose }) + "\n");

  if (args.failOn.length > 0 && shouldFail(result.report, args.failOn)) {
    process.exit(1);
  }
}

main();
