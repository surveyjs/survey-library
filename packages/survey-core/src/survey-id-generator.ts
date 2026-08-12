export class SurveyIdGenerator {
  // Null-prototype map: a prefix comes from getIdPrefix()/getType(), which for a custom component is
  // an author-chosen name. A plain object would let "toString"/"constructor"/"__proto__" collide
  // with Object.prototype and corrupt generation.
  private counters: { [prefix: string]: number } = Object.create(null);
  public next(prefix: string): string {
    const n = this.counters[prefix] || 0;
    this.counters[prefix] = n + 1;
    return prefix + "_" + n;
  }
}
