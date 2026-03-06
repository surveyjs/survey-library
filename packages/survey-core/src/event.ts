export class Event<CallbackFunction extends Function, Sender, Options> {
  public onCallbacksChanged: () => void;
  protected callbacks: Array<CallbackFunction>;
  public get isEmpty(): boolean {
    return this.length === 0;
  }
  public get length(): number {
    return !!this.callbacks ? this.callbacks.length : 0;
  }
  public fireByCreatingOptions(sender: any, createOptions: () => Options): void {
    if (!this.callbacks) return;
    for (var i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i](sender, createOptions());
      if (!this.callbacks) return;
    }
  }
  public fire(sender: Sender, options: Options): void {
    if (!this.callbacks) return;
    const callbacks = [].concat(this.callbacks);
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i](sender, options);
      if (!this.callbacks) return;
    }
  }
  public clear(): void {
    this.callbacks = undefined;
  }
  public add(func: CallbackFunction): void {
    if (this.hasFunc(func)) return;
    if (!this.callbacks) {
      this.callbacks = new Array<CallbackFunction>();
    }
    this.callbacks.push(func);
    this.fireCallbackChanged();
  }
  public remove(func: CallbackFunction): void {
    if (this.hasFunc(func)) {
      var index = this.callbacks.indexOf(func, 0);
      this.callbacks.splice(index, 1);
      this.fireCallbackChanged();
    }
  }
  public hasFunc(func: CallbackFunction): boolean {
    if (this.callbacks == null) return false;
    return this.callbacks.indexOf(func, 0) > -1;
  }
  private fireCallbackChanged(): void {
    if (!!this.onCallbacksChanged) {
      this.onCallbacksChanged();
    }
  }
}

export class EventBase<Sender, Options = any> extends Event<
  (sender: Sender, options: Options) => any,
  Sender,
  Options
> { }
