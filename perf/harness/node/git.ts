import { execFileSync } from "node:child_process";

// Commits for the result file: the runner's own (commit), the target's (PERF_TARGET_COMMIT).
export function git(cwd: string, args: Array<string>): string {
  return execFileSync("git", args, { cwd: cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

export function headCommit(cwd: string): string | null {
  try {
    return git(cwd, ["rev-parse", "HEAD"]);
  } catch(e) {
    return null;
  }
}
