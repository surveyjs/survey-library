export class KeySequenceBuffer {
  private value: string = "";
  private timer: any;
  public get text(): string {
    return this.value;
  }
  public append(char: string): string {
    this.cancelTimer();
    this.value += char;
    return this.value;
  }
  public waitAndApply(apply: (code: string) => void, timeout: number): void {
    this.cancelTimer();
    this.timer = setTimeout(() => {
      const code = this.value;
      this.reset();
      apply(code);
    }, timeout);
  }
  public reset(): void {
    this.cancelTimer();
    this.value = "";
  }
  private cancelTimer(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
  }
}
