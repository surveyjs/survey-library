import {
  Serializer,
  QuestionFactory,
  QuestionRankingModel,
  ItemValue,
} from "survey-core";
import { QuestionImplementor } from "./koquestion";

export class QuestionRanking extends QuestionRankingModel {
  private _implementor: QuestionImplementor;
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
  public koHandleKeydown = (data: ItemValue, event: KeyboardEvent) => {
    this.handleKeydown(event, data);
    return true;
  };
  public koHandlePointerDown = (data: ItemValue, event: PointerEvent) => {
    if(!this.survey.isDesignMode) event.preventDefault();
    this.handlePointerDown(event, data, <HTMLElement>event.currentTarget);
    return true;
  };
  public koHandlePointerUp = (data: ItemValue, event: PointerEvent) => {
    if(!this.survey.isDesignMode) event.preventDefault();
    this.handlePointerUp(event, data, <HTMLElement>event.currentTarget);
    return true;
  };
}

Serializer.overrideClassCreator("ranking", function() {
  return new QuestionRanking("");
});
QuestionFactory.Instance.registerQuestion("ranking", (name) => {
  const q = new QuestionRanking(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
