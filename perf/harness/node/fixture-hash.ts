import { createHash } from "node:crypto";

// The fixture hashes of the result file and the report: sha1 of JSON.stringify(json) and of JSON.stringify(data).
export function sha1(text: string): string {
  return createHash("sha1").update(text).digest("hex");
}

export function fixtureHashes(fixture: { json: any, data?: any }): { hash: string, dataHash?: string } {
  const res: { hash: string, dataHash?: string } = { hash: sha1(JSON.stringify(fixture.json)) };
  if (fixture.data !== undefined) res.dataHash = sha1(JSON.stringify(fixture.data));
  return res;
}
