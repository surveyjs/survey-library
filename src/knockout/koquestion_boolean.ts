import { Serializer, QuestionFactory, QuestionBooleanModel, getOriginalEvent } from "survey-core";
import { QuestionImplementor } from "./koquestion";
export class QuestionBoolean extends QuestionBooleanModel {
  private _implementor: QuestionImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  public onSwitchClick(data: any, event: any) {
    return super.onSwitchClickModel(getOriginalEvent(event));
  }
  public onTrueLabelClick(data: any, event: any) {
    return this.onLabelClick(event, !this.swapOrder);
  }
  public onFalseLabelClick(data: any, event: any) {
    return this.onLabelClick(event, this.swapOrder);
  }
  public onKeyDown(data: any, event: any): boolean {
    return this.onKeyDownCore(event);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}
Serializer.overrideClassCreator("boolean", function () {
  return new QuestionBoolean("");
});

QuestionFactory.Instance.registerQuestion("boolean", (name) => {
  return new QuestionBoolean(name);
});
