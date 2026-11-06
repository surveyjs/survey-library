export class Event<CallbackFunction extends Function, Sender, Options> {
  /* The fires that reached a handler of an event with isFireCounted: the events of a survey (Base.addEvent);
     the events of other objects are mostly internal subscriptions. A handler is user code: it can change
     anything the survey holds, also inside nested objects that notify nothing. Work that relies on nothing
     having changed compares two readings of the count (QuestionPanelDynamicModel shares one template JSON
     between the panels it creates). */
  private static handledFireCount: number = 0;
  public static getHandledFireCount(): number {
    return Event.handledFireCount;
  }
  public isFireCounted: boolean;
  public onCallbacksChanged: () => void;
  protected callbacks: Array<CallbackFunction>;
  public get isEmpty(): boolean {
    return this.length === 0;
  }
  public get length(): number {
    return !!this.callbacks ? this.callbacks.length : 0;
  }
  public fireByCreatingOptions(sender: any, createOptions: () => Options): void {
    this.runCallbacks((callback: CallbackFunction): void => { callback(sender, createOptions()); });
  }
  public fire(sender: Sender, options: Options): void {
    this.runCallbacks((callback: CallbackFunction): void => { callback(sender, options); });
  }
  // Every fire that reaches handlers runs here, so it is counted once (handledFireCount).
  // It runs a copy of the list: callbacks added or removed by a callback take effect on the next fire.
  // Returns false if there is nothing to run or a callback cleared the event.
  protected runCallbacks(run: (callback: CallbackFunction) => void): boolean {
    if (!this.callbacks) return false;
    if (this.isFireCounted) {
      Event.handledFireCount++;
    }
    const callbacks = this.callbacks.slice();
    for (let i = 0; i < callbacks.length; i++) {
      run(callbacks[i]);
      if (!this.callbacks) return false;
    }
    return true;
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

export class EventAsync<Sender, Options = any> extends EventBase <Sender, Options> {
  public fire(sender: Sender, options: Options, onComplete?: () => void, onFirstAsync?: () => void): void {
    onComplete = onComplete || (() => { });
    if (!this.callbacks) {
      onComplete();
      return;
    }
    const promises: Array<Promise<any>> = [];
    const isRun = this.runCallbacks((callback: (sender: Sender, options: Options) => any): void => {
      const res = callback(sender, options);
      if (res && res instanceof Promise) {
        promises.push(res);
      }
    });
    if (!isRun) return;
    if (promises.length > 0) {
      onFirstAsync && onFirstAsync();
      Promise.all(promises).then(() => {
        onComplete();
      });
    } else {
      onComplete();
    }
  }
}
