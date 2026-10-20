// A re-entrancy flag: active while any run is in progress, however it exits. Runs nest: an inner run
// that ends leaves the outer one active. Work that waits for the outermost run to end goes in a
// finally around run, checking isActive.
export class Scope {
  private depth: number = 0;
  public get isActive(): boolean {
    return this.depth > 0;
  }
  public run<T>(func: () => T): T {
    this.depth++;
    try {
      return func();
    } finally {
      this.depth--;
    }
  }
}
// A value in force for the extent of a run: a nested run puts its own, and the outer one's comes back
// when it exits, however it exits. Outside every run the value is the initial one.
export class ValueScope<T> {
  constructor(private current: T = undefined) { }
  public get value(): T {
    return this.current;
  }
  public run<R>(value: T, func: () => R): R {
    const prev = this.current;
    this.current = value;
    try {
      return func();
    } finally {
      this.current = prev;
    }
  }
}
