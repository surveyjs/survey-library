/**
 * Generates deterministic, SSR-safe raw element ids for a single survey (or any standalone root
 * owner). One instance is held per `SurveyModel`; detached objects fall back to a shared
 * module-default instance (see `Base.defaultIdGenerator`).
 *
 * The generator keeps a **separate counter per prefix** (`sq`, `sp`, `svd`, ...) rather than one
 * shared running number. A question's number therefore depends only on how many questions preceded
 * it - independent of validators, panels, actions, or items - so the server and the client produce
 * identical ids as long as same-type elements keep the same relative order (which the JSON tree
 * pins). The id is `prefix + "_" + n`, so different prefixes never collide even though their
 * number-spaces overlap.
 *
 * The generator produces the raw, un-namespaced `id`. The survey's `renderedIdPrefix`/`renderedIdSuffix` wrapping is
 * applied later, in `Base.renderedId`, so the raw `id` stays stable and test-friendly.
 *
 * `uniqueId` (used for framework `key`s and creation-order sorting, never rendered to the DOM by
 * itself) is drawn from a single per-instance numeric counter - it needs global creation order
 * within the survey, not per-prefix numbering.
 */
export class SurveyIdGenerator {
  // Null-prototype map: a prefix comes from getIdPrefix()/getType(), which for a custom component is
  // an author-chosen name. A plain object would let "toString"/"constructor"/"__proto__" collide
  // with Object.prototype and corrupt generation.
  private counters: { [prefix: string]: number } = Object.create(null);
  /**
   * Returns the next raw id for the given `prefix` (the value of `Base.getIdPrefix()`).
   */
  public next(prefix: string): string {
    const n = this.counters[prefix] || 0;
    this.counters[prefix] = n + 1;
    return prefix + "_" + n;
  }
}
