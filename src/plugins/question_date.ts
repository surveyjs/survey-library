import { QuestionFactory } from "../questionfactory";
import { JsonObject } from "../jsonobject";
import { Question } from "../question";

// Use the Question class as a base class.
export default class QuestionDateModel extends Question {
  //Define properties
  public showOtherMonths: boolean = false;
  public selectOtherMonths: boolean = false;
  public showButtonPanel: boolean = false;
  public changeMonth: boolean = false;
  public changeYear: boolean = false;
  public numberOfMonths: number = 1;
  public minDate: string = "";
  public maxDate: string = "";
  constructor(public name: string) {
    super(name);
  }
  //"date" - identificator that will json serializer what question to create.
  public getType(): string {
    return "date";
  }
  //Script that will make from a text input a jquery Date editor.
  public getjQueryScript(selectorId: string): string {
    var json = this.getOptions();
    return "$('#" + selectorId + "').datepicker(" + JSON.stringify(json) + ");";
  }
  private getOptions(): any {
    var options: { [index: string]: any } = {};
    if (this.showOtherMonths) options["showOtherMonths"] = this.showOtherMonths;
    if (this.selectOtherMonths)
      options["selectOtherMonths"] = this.selectOtherMonths;
    if (this.showButtonPanel) options["showButtonPanel"] = this.showButtonPanel;
    if (this.changeMonth) options["changeMonth"] = this.changeMonth;
    if (this.changeYear) options["changeYear"] = this.changeYear;
    if (this.numberOfMonths > 1)
      options["numberOfMonths"] = this.numberOfMonths;
    if (this.minDate) options["minDate"] = "'" + this.minDate + "'";
    if (this.minDate) options["maxDate"] = "'" + this.maxDate + "'";

    return options;
  }
  supportGoNextPageAutomatic() {
    return true;
  }
}
//add class and it's properties into json meta data.
JsonObject.metaData.addClass(
  "date", //"date" - question type identificator
  //list of properties with their types (string is default) and other options.
  //For example: choices option will used by survey editor. There will be a dropdown editor with 5 options.
  [
    "showOtherMonths:boolean",
    "selectOtherMonths:boolean",
    "showButtonPanel:boolean",
    "changeMonth:boolean",
    "changeYear:boolean",
    { name: "numberOfMonths", default: 1, choices: [1, 2, 3, 4, 5] },
    "minDate",
    "maxDate"
  ],
  //json deserializer will call this function to create the object
  function() {
    return new QuestionDateModel("");
  },
  //tell json serializer that we are inherited from 'question' class and we want to use all 'question' properties as well.
  "question"
);

//Register the class as a question. Survey editor will know it is a question and it will show it in question toolbox.
QuestionFactory.Instance.registerQuestion("date", name => {
  return new QuestionDateModel(name);
});
