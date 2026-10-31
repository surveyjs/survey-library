import * as os from "node:os";

// The machine block of the result file and its key: a slug of os, CPU model, host cores, Node major, Chromium
// major and PERF_MACHINE_EXTRA (00, Result file). Results with different keys are never compared.
export interface MachineInfo {
  key: string;
  os: string;
  cpu: string;
  cores: number;
  availableParallelism: number;
  node: string;
  chromium: string | null;
  extra: string;
}

export function slug(text: string): string {
  return text.toLowerCase().replace(/\(r\)|\(tm\)/g, "").replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function machineKey(info: Omit<MachineInfo, "key">): string {
  const major = (v: string | null): string => (v || "none").split(".")[0];
  return slug([info.os, info.cpu, info.cores + "c", "node" + major(info.node), "chromium" + major(info.chromium), info.extra].filter((s: string) => !!s).join("-"));
}

export function machineInfo(options: { chromium?: string | null, extra?: string } = {}): MachineInfo {
  const cpus = os.cpus();
  const info = {
    os: os.platform() + "-" + os.release().split(".")[0],
    cpu: cpus.length > 0 ? cpus[0].model.trim() : "unknown",
    cores: cpus.length,
    availableParallelism: typeof os.availableParallelism === "function" ? os.availableParallelism() : cpus.length,
    node: process.versions.node,
    chromium: options.chromium || null,
    extra: options.extra || ""
  };
  return Object.assign({ key: machineKey(info) }, info);
}
