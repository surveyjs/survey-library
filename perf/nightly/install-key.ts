import * as fs from "node:fs";
import * as path from "node:path";
import { createHash } from "node:crypto";
import { listInstalled } from "../harness/node/deps.ts";

// The install key of a package folder (D20): a sha1 of the dependency fields of its package.json plus the image tag.
// A folder is reinstalled only when its key changes, so the weekly "Release: x.y.z" version bumps cause no reinstall.
export const dependencyFields = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies", "overrides"];
export const keyFileName = ".perf-install-key";

function sorted(value: any): any {
  if (Array.isArray(value)) return value.map(sorted);
  if (!value || typeof value !== "object") return value;
  const res: any = {};
  Object.keys(value).sort().forEach((key: string) => { res[key] = sorted(value[key]); });
  return res;
}

export function installKeyOf(pkg: any, imageTag: string): string {
  const fields: any = {};
  dependencyFields.forEach((name: string) => { if (pkg[name] !== undefined) fields[name] = pkg[name]; });
  return createHash("sha1").update(JSON.stringify(sorted(fields)) + "\n" + imageTag).digest("hex");
}

export function installKeyOfDir(dir: string, imageTag: string): string {
  return installKeyOf(JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")), imageTag);
}

// The key the last successful install wrote, or undefined (never installed, or node_modules removed).
export function storedKey(dir: string): string | undefined {
  const file = path.join(dir, "node_modules", keyFileName);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim() : undefined;
}

export function writeKey(dir: string, key: string): void {
  fs.writeFileSync(path.join(dir, "node_modules", keyFileName), key + "\n");
}

export function needsInstall(dir: string, imageTag: string, reinstall?: boolean): boolean {
  return !!reinstall || storedKey(dir) !== installKeyOfDir(dir, imageTag);
}

// The full name@version list behind build.deps.fingerprint, for "dependencies changed: <list>" and the bisect ends.
export function installedList(dirs: Array<string>): Array<string> {
  const all = new Set<string>();
  dirs.forEach((dir: string) => listInstalled(dir).forEach((p: string) => all.add(p)));
  return Array.from(all).sort();
}

// "rollup 4.34.8 -> 4.35.0, +left-pad@1.3.0, -right-pad@1.0.0", at most `max` items.
export function depsDiff(before: Array<string>, after: Array<string>, max: number = 12): string {
  const split = (list: Array<string>): { [name: string]: string } => {
    const res: { [name: string]: string } = {};
    list.forEach((p: string) => {
      const at = p.lastIndexOf("@");
      res[p.substring(0, at)] = p.substring(at + 1);
    });
    return res;
  };
  const a = split(before);
  const b = split(after);
  const items: Array<string> = [];
  Object.keys(b).sort().forEach((name: string) => {
    if (a[name] === undefined) items.push("+" + name + "@" + b[name]);
    else if (a[name] !== b[name]) items.push(name + " " + a[name] + " -> " + b[name]);
  });
  Object.keys(a).sort().forEach((name: string) => { if (b[name] === undefined) items.push("-" + name + "@" + a[name]); });
  if (items.length <= max) return items.join(", ");
  return items.slice(0, max).join(", ") + ", +" + (items.length - max) + " more";
}
