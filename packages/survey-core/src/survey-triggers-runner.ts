import { Base } from "./base";
import { Question } from "./question";
import { CalculatedValue } from "./calculatedValue";
import { PageModel } from "./page";
import { Helpers } from "./helpers";
import { settings } from "./settings";
import { SurveyTrigger } from "./trigger";

export type TriggersRunType = "trigger" | "questionTrigger" | "condition";

export interface ISurveyTriggersHost {
  triggers: Array<SurveyTrigger>;
  calculatedValues: CalculatedValue[];
  pages: PageModel[];
  canRunTriggersOrConditions(type: TriggersRunType): boolean;
  getFilteredProperties(): any;
  getQuestionByValueName(name: string): Question;
  getAllQuestions(): Question[];
  getCurrentPageQuestions(includeInvisible?: boolean): Array<Question>;
  getValue(name: string): any;
  runConditionCore(properties: any): void;
  notifyElementsOnAnyValueOrVariableChanged(name: string, questionName?: string): void;
  updateVisibleIndexes(): void;
}

export class SurveyTriggersRunner extends Base {
  private isTriggerIsRunning: boolean = false;
  private triggerKeys: any = null;
  private questionTriggersKeys: any;
  private isRunningConditionsValue: boolean = false;
  private isValueChangedOnRunningCondition: boolean = false;
  private conditionRunnerCounter: number = 0;
  public conditionUpdateVisibleIndexes: boolean = false;
  public conditionNotifyElementsOnAnyValueOrVariableChanged: boolean = false;
  private isRunningConditionOnValueChanged: boolean = false;

  private survey: ISurveyTriggersHost;

  constructor(survey: ISurveyTriggersHost) {
    super();
    this.survey = survey;
  }

  public get isRunningConditions(): boolean {
    return this.isRunningConditionsValue;
  }

  public runTriggers(): void {
    this.checkTriggers({}, false, false, false, undefined, true);
  }

  public runExpressions(): void {
    this.runConditions();
  }

  public getValueChangedKeys(): any {
    return this.isRunningConditionOnValueChanged ? this.questionTriggersKeys : undefined;
  }

  public checkOnPageTriggers(isOnComplete: boolean): void {
    var questions = this.survey.getCurrentPageQuestions(true);
    var values: { [index: string]: any } = {};
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];
      var name = question.getValueName();
      values[name] = this.survey.getValue(name);
    }
    var caclValues = this.survey.calculatedValues;
    for (var i = 0; i < caclValues.length; i++) {
      values[caclValues[i].name] = caclValues[i].value;
    }
    this.checkTriggers(values, true, isOnComplete);
  }

  public checkTriggers(
    key: any,
    isOnNextPage: boolean,
    isOnComplete: boolean = false,
    isOnNavigation: boolean = false,
    name?: string,
    runAll: boolean = false
  ): void {
    if (!this.survey.canRunTriggersOrConditions("trigger")) return;
    if (this.isTriggerIsRunning) {
      for (var k in key) {
        this.triggerKeys[k] = key[k];
      }
      return;
    }
    let isQuestionInvalid = false;
    if (!isOnComplete && name && this.hasRequiredValidQuestionTrigger) {
      const question = <Question>this.survey.getQuestionByValueName(name);
      isQuestionInvalid = question && !question.validate(false);
    }
    this.isTriggerIsRunning = true;
    this.triggerKeys = key;
    const properties = this.survey.getFilteredProperties();
    const options = {
      isOnNextPage: isOnNextPage,
      isOnComplete: isOnComplete,
      isOnNavigation: isOnNavigation,
      keys: this.triggerKeys,
      properties: properties,
      runAll: false
    };
    let originalKeys = Helpers.createCopy(this.triggerKeys);
    const maxIterations = 3;
    for (let i = 0; i < maxIterations; i++) {
      options.runAll = runAll && i === 0;
      this.runSurveyTriggers(options, isQuestionInvalid);
      if (
        !this.survey.canRunTriggersOrConditions("trigger") ||
        Helpers.isTwoValueEquals(originalKeys, this.triggerKeys)
      )
        break;
      this.triggerKeys = Helpers.createDiff(this.triggerKeys, originalKeys);
      originalKeys = Helpers.createCopy(this.triggerKeys);
    }
    this.isTriggerIsRunning = false;
  }

  private runSurveyTriggers(options: any, isQuestionInvalid: boolean): void {
    for (let i = 0; i < this.survey.triggers.length; i++) {
      const trigger = this.survey.triggers[i];
      if (isQuestionInvalid && trigger.requireValidQuestion) continue;
      options.keys = this.triggerKeys;
      trigger.checkExpression(options);
    }
  }

  public checkTriggersAndRunConditions(
    name: string,
    newValue: any,
    oldValue: any
  ): void {
    var triggerKeys: { [index: string]: any } = {};
    triggerKeys[name] = { newValue: newValue, oldValue: oldValue };
    this.runConditionOnValueChanged(name, newValue);
    this.checkTriggers(triggerKeys, false, false, false, name);
  }

  private get hasRequiredValidQuestionTrigger(): boolean {
    for (let i = 0; i < this.survey.triggers.length; i++) {
      if (this.survey.triggers[i].requireValidQuestion) return true;
    }
    return false;
  }

  private runConditions(): void {
    if (
      !this.survey.canRunTriggersOrConditions("condition") ||
      this.isRunningConditions
    )
      return;
    this.isRunningConditionsValue = true;
    var properties = this.survey.getFilteredProperties();
    this.runConditionsCore(properties);
    this.isRunningConditionsValue = false;
    if (
      this.isValueChangedOnRunningCondition &&
      this.conditionRunnerCounter < settings.maxConditionRunCountOnValueChanged
    ) {
      this.isValueChangedOnRunningCondition = false;
      this.conditionRunnerCounter++;
      this.runConditions();
    } else {
      this.isValueChangedOnRunningCondition = false;
      this.conditionRunnerCounter = 0;
      if (this.conditionUpdateVisibleIndexes) {
        this.conditionUpdateVisibleIndexes = false;
        this.survey.updateVisibleIndexes();
      }
      if (this.conditionNotifyElementsOnAnyValueOrVariableChanged) {
        this.conditionNotifyElementsOnAnyValueOrVariableChanged = false;
        this.survey.notifyElementsOnAnyValueOrVariableChanged("");
      }
      if (!this.isRunningConditionOnValueChanged) {
        this.questionTriggersKeys = undefined;
      }
    }
  }

  private runConditionOnValueChanged(name: string, value: any): void {
    if (!this.questionTriggersKeys) {
      this.questionTriggersKeys = {};
    }
    this.questionTriggersKeys[name] = value;
    if (this.isRunningConditions) {
      this.isValueChangedOnRunningCondition = true;
    } else {
      this.isRunningConditionOnValueChanged = true;
      this.runConditions();
      this.isRunningConditionOnValueChanged = false;
      this.runQuestionsTriggers(name, value);
      this.questionTriggersKeys = undefined;
    }
  }

  private runConditionsCore(properties: any): void {
    var pages = this.survey.pages;
    for (var i = 0; i < this.survey.calculatedValues.length; i++) {
      this.survey.calculatedValues[i].resetCalculation();
    }
    for (var i = 0; i < this.survey.calculatedValues.length; i++) {
      this.survey.calculatedValues[i].doCalculation(
        this.survey.calculatedValues,
        properties
      );
    }
    this.survey.runConditionCore(properties);
    for (let i = 0; i < pages.length; i++) {
      pages[i].runCondition(properties);
    }
  }

  private runQuestionsTriggers(name: string, value: any): void {
    if (!this.survey.canRunTriggersOrConditions("questionTrigger")) return;
    const questions = this.survey.getAllQuestions();
    questions.forEach(q => {
      q.runTriggers(name, value, this.questionTriggersKeys);
    });
  }

}
