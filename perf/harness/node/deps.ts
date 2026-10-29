import * as fs from "node:fs";
import * as path from "node:path";
import { createHash } from "node:crypto";

// The dependency fingerprint (D20): name@version of the external packages installed in the given package folders.
// Linked packages (survey-core in a UI package is a junction to its build), file: entries and the folders' own
// versions are left out, so a release bump changes nothing.
export interface DepsInfo {
  // null when no package folder was given (an npm build has no build dependencies here).
  fingerprint: string | null;
  versions: { [name: string]: string };
}

export const reportedPackages = ["rollup", "terser", "esbuild", "typescript", "@rollup/plugin-terser", "@rollup/plugin-typescript"];

export function listInstalled(packageDir: string): Array<string> {
  const res: Array<string> = [];
  const nm = path.join(packageDir, "node_modules");
  if (!fs.existsSync(nm)) return res;
  const add = (dir: string, name: string): void => {
    const full = path.join(dir, name);
    let stat: fs.Stats;
    try {
      stat = fs.lstatSync(full);
    } catch(e) {
      return;
    }
    if (stat.isSymbolicLink() || !stat.isDirectory()) return;
    const pkgFile = path.join(full, "package.json");
    if (!fs.existsSync(pkgFile)) return;
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
      if (pkg.name && pkg.version) res.push(pkg.name + "@" + pkg.version);
    } catch(e) {
      // An unreadable package.json is left out of the fingerprint.
    }
  };
  for (const entry of fs.readdirSync(nm)) {
    if (entry.charAt(0) === ".") continue;
    if (entry.charAt(0) === "@") {
      const scope = path.join(nm, entry);
      if (!fs.statSync(scope).isDirectory()) continue;
      for (const sub of fs.readdirSync(scope)) add(scope, sub);
    } else {
      add(nm, entry);
    }
  }
  return res;
}

export function dependencyInfo(packageDirs: Array<string>): DepsInfo {
  const all = new Set<string>();
  packageDirs.forEach((dir: string) => listInstalled(dir).forEach((p: string) => all.add(p)));
  const list = Array.from(all).sort();
  const versions: { [name: string]: string } = {};
  list.forEach((p: string) => {
    const at = p.lastIndexOf("@");
    const name = p.substring(0, at);
    if (reportedPackages.indexOf(name) > -1 && !versions[name]) versions[name] = p.substring(at + 1);
  });
  if (packageDirs.length === 0) return { fingerprint: null, versions: versions };
  return { fingerprint: createHash("sha1").update(list.join("\n")).digest("hex"), versions: versions };
}
