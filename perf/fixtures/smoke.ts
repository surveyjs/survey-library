import { FIXTURE_KEYS, getFixture } from "./index.ts";
import { fixtureHashes } from "../harness/node/fixture-hash.ts";

// 01 check 8: Node loads the fixtures as TypeScript and prints each key with its hashes.
for (const key of FIXTURE_KEYS) {
  const h = fixtureHashes(getFixture(key));
  console.log(key + " " + h.hash + (h.dataHash ? " " + h.dataHash : ""));
}
