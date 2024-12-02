import { ItemValue } from "./itemvalue";
import { QuestionRadiogroupModel } from "./question_radiogroup";
import { Helpers } from "./helpers";
import { Serializer } from "./jsonobject";
import { PanelModel } from "./panel";
import { getLocaleString } from "./surveyStrings";

export class MaxdiffModel extends PanelModel {
  public getType(): string {
    return "maxdiff";
  }

  /**
   * choices are used to generate the maxdiff pairs.
   */
  public set choices(val: Array<ItemValue>) {
    val = Helpers.randomizeArray(val);
    for (let i = 0; i < val.length - 1; i+=2) {
      const opt1 = val[i];
      const opt2 = val[i + 1];
      const name = `${this.name}::${opt1.value}__x__${opt2.value}`;
      const question = new QuestionRadiogroupModel(name);
      question.title = this.title;
      question.choices = [opt1, opt2];
      question.isRequired = true;
      this.elements.push(question);
    }
  }
}

Serializer.addClass(
  "maxdiff",
  [
    {
      name: "choices:itemvalue[]", uniqueProperty: "value",
      baseValue: function () {
        return getLocaleString("choices_Item");
      },
    },
  ],
  function () {
    return new MaxdiffModel();
  },
  "panel"
);