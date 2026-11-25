import type { ChangedKeys } from "../conditions/conditionProcessValue";
import { Base } from "../base";
import { ISaveToJSONOptions, ISurvey } from "../base-interfaces";
import { ItemValue } from "../itemvalue";
import { JsonObject, JsonObjectProperty, Serializer } from "../jsonobject";
import { ILocalizableOwner, LocalizableString } from "../localizablestring";
import { Question, QuestionValueType } from "../question";
import { QuestionFactory } from "../questionfactory";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-filter-fields";
import { getFilterOperatorChoices } from "./filter-field-properties";

// What a Filter Control gives its fields: the locale chain for the template question's strings and
// the survey the question needs to resolve choicesByUrl, text processing and the rest.
export interface IFilterFieldOwner extends ILocalizableOwner {
  getSurvey(live?: boolean): ISurvey;
}

// The JSON of a filter field: with a target question, an override of one of its fields or a field of
// the record the target has no column for; with none, a field of the control's own.
export interface IFilterField {
  name: string;
  title?: string;
  operators?: Array<string>;
  showInQuickFilters?: boolean;
}

// One entry of a Filter Control's fields: a field of its own, or what it says about a field of its
// target question (see applyTo). The type of a field of its own (fieldType, valueType and the rest)
// is JSON only, the designer does not offer it. fieldType works the way cellType works for a
// Matrix Dropdown column: the properties of the question type that supplies the value editor
// (choices, choicesByUrl, inputType and the rest) are borrowed from that type and defined on the
// field instance, so they are authored and serialized as if they were the field's own.
export class FilterField extends Base implements ILocalizableOwner, IFilterField {
  private templateQuestionValue: Question;
  private fieldOwnerValue: IFilterFieldOwner;

  constructor(name: string) {
    super();
    this.updateTemplateQuestion(undefined, name);
  }
  public getType(): string { return "filterfield"; }

  public get templateQuestion(): Question { return this.templateQuestionValue; }

  // The control that owns this field. The template question's locOwner is the field itself, so
  // every localization call arrives here and is forwarded to the owner.
  public get fieldOwner(): IFilterFieldOwner { return this.fieldOwnerValue; }
  public set fieldOwner(val: IFilterFieldOwner) {
    this.fieldOwnerValue = val;
    this.locTitle.strChanged();
  }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.fieldOwner ? this.fieldOwner.getSurvey(live) : null;
  }
  // The control a designer's row of getDesignFieldEntries() stands for a field of, while the entry is not
  // in its fields. Not fieldOwner: an entry that is not in fields knows no survey, so a change to it is
  // no change of the survey (nothing for undo) until the designer adds it to fields.
  public designOwner: IFilterFieldOwner;
  public getLocale(): string {
    return !!this.fieldOwner ? this.fieldOwner.getLocale() : "";
  }
  public getMarkdownHtml(text: string, name: string, item?: any): string {
    return !!this.fieldOwner ? this.fieldOwner.getMarkdownHtml(text, name, item) : undefined;
  }
  public getRenderer(name: string, item?: ItemValue): string {
    return !!this.fieldOwner ? this.fieldOwner.getRenderer(name, item) : null;
  }
  public getRendererContext(locStr: LocalizableString, item?: ItemValue): any {
    return !!this.fieldOwner ? this.fieldOwner.getRendererContext(locStr, item) : locStr;
  }
  public getProcessedText(text: string): string {
    return !!this.fieldOwner ? this.fieldOwner.getProcessedText(text, this) : text;
  }
  // Base.locStrsChanged walks an object's own localizableStrings, and a field owns none: locTitle
  // belongs to the template question. Without this a locale change leaves field titles stale.
  public locStrsChanged(changes?: ChangedKeys): void {
    super.locStrsChanged(changes);
    this.templateQuestion.locStrsChanged(changes);
  }
  // Same reason: survey.getUsedLocales() would not see the title translations otherwise.
  public addUsedLocales(locales: Array<string>): void {
    super.addUsedLocales(locales);
    this.templateQuestion.addUsedLocales(locales);
  }

  public get name(): string { return this.templateQuestion.name; }
  public set name(val: string) { this.templateQuestion.name = val; }
  public get title(): string { return this.templateQuestion.title; }
  public set title(val: string) { this.templateQuestion.title = val; }
  public get locTitle(): LocalizableString { return this.templateQuestion.locTitle; }
  public get valueName(): string { return this.templateQuestion.valueName; }
  public set valueName(val: string) { this.templateQuestion.valueName = val; }
  // The variable the expression uses: {valueName}, falling back to {name}.
  public getValueName(): string { return this.templateQuestion.getValueName(); }

  // The template question is loaded from JSON through this object, so it never sees the end of the
  // load on its own: without this a select question keeps an empty visibleChoices and reports the
  // wrong value type.
  endLoadingFromJson(): void {
    super.endLoadingFromJson();
    this.templateQuestion.endLoadingFromJson();
    this.templateQuestion.onGetSurvey = () => this.getSurvey();
  }
  public getOriginalObj(): Base { return this.templateQuestion; }
  // The whole JSON of the field. Not Base.toJSON: JsonObject writes an object that has getData by
  // getData, which gives the name alone - here the properties are written one by one, the borrowed
  // ones of fieldType too (as ItemValue.toJSON does).
  public toJSON(options?: ISaveToJSONOptions): any {
    const res: any = {};
    const jsonObj = new JsonObject();
    const props = Serializer.getProperties(this.getType()).concat(Serializer.getDynamicPropertiesByObj(this));
    props.forEach((prop: JsonObjectProperty): void => { jsonObj.valueToJson(this, res, prop, options); });
    return res;
  }
  // A field that says nothing but its name is written as the name: fields: ["country", { name: "amount",
  // title: "Sum" }] - the way an ItemValue with no text is written as its value.
  public getData(options?: ISaveToJSONOptions): any {
    const json = this.toJSON(options);
    const keys = Object.keys(json);
    return keys.length === 1 && keys[0] === "name" ? json.name : json;
  }
  getClassNameProperty(): string { return "fieldType"; }
  getDynamicPropertyName(): string { return "fieldType"; }
  // "" short-circuits Serializer.getDynamicPropertiesByTypes (jsonobject.ts:1060), so a field with
  // no fieldType exposes none of the fallback text question's properties.
  getDynamicType(): string { return this.fieldType || ""; }

  // Whether this field appears in the Filter Control's quick filters.
  public get showInQuickFilters(): boolean { return this.getPropertyValue("showInQuickFilters"); }
  public set showInQuickFilters(val: boolean) { this.setPropertyValue("showInQuickFilters", val); }

  // The operators the field offers, see getFilterFieldOperators. The field's own property and not the
  // template question's: that one is replaced whenever fieldType changes.
  public get operators(): Array<string> { return this.getPropertyValue("operators"); }
  public set operators(val: Array<string>) { this.setPropertyValue("operators", val); }

  public get fieldType(): string { return this.getPropertyValue("fieldType"); }
  public set fieldType(val: string) {
    val = !val ? "" : val.toLocaleLowerCase();
    if (val === this.fieldType) return;
    this.updateTemplateQuestion(val);
    this.setPropertyValue("fieldType", val);
  }

  public get valueType(): QuestionValueType {
    // Read-only while fieldType is set: the real type is the created question's.
    if (!!this.fieldType) return this.templateQuestion.getValueType();
    return this.getPropertyValue("valueType");
  }
  public set valueType(val: QuestionValueType) {
    // Ignored and not stored: clearing fieldType must not resurrect a value written while it was set.
    if (!!this.fieldType) return;
    this.setPropertyValue("valueType", val);
  }

  // A field of the target as this entry overrides it: the entry's title when it has one, its operators
  // when it names any, and whether the field shows in the quick filters. The type, the choices and the
  // variable stay the target's.
  public applyTo(field: IDynamicDataFilterField): IDynamicDataFilterField {
    const operators = this.operators;
    return Object.assign({}, field, {
      locTitle: this.locTitle.isEmpty ? field.locTitle : this.locTitle,
      operators: Array.isArray(operators) && operators.length > 0 ? operators : field.operators,
      showInQuickFilters: this.showInQuickFilters
    });
  }

  // fieldType is the RESOLVED type and not the authored one: a field with no fieldType runs on a
  // text question, so "text" is what supplies its editor. The bound path reports the resolved type
  // too (dynamic-data/dynamic-data-filter-fields.ts, collectFilterFields), and a renderer that switches on fieldType
  // must see one contract from both of them. getDynamicType() keeps answering "" - that one decides
  // which properties the field borrows, which is a different question.
  public getFilterField(): IDynamicDataFilterField {
    const q = this.templateQuestion;
    return {
      name: this.name, valueName: this.getValueName(), locTitle: this.locTitle,
      valueType: this.valueType, fieldType: this.fieldType || q.getType(), templateQuestion: q,
      // Typeless only when no fieldType was authored - a fieldType that happens to resolve to the
      // same question type ("text") was still a deliberate choice and keeps its full operator set.
      isTypeless: !this.fieldType, showInQuickFilters: this.showInQuickFilters, operators: this.operators
    };
  }

  // Unlike the column's updateTemplateQuestion there is no "the type did not change" guard here: the
  // transition "" -> "text" keeps the question type and changes the dynamic type, and skipping the
  // run would silently drop every borrowed property. The setter guards on fieldType instead.
  protected updateTemplateQuestion(newFieldType?: string, name?: string): void {
    const fieldType = newFieldType || "";
    // The setter stores fieldType only after this call, so this is still the previous one.
    const prevFieldType = this.fieldType;
    if (this.templateQuestion) {
      this.removeProperties(prevFieldType);
    }
    this.templateQuestionValue = this.createNewQuestion(fieldType);
    this.templateQuestion.locOwner = this;
    this.addProperties(fieldType);
    if (!!name) {
      this.name = name;
    }
    this.templateQuestion.onPropertyChanged.add((sender: Base, options: any): void => {
      this.propertyValueChanged(options.name, options.oldValue, options.newValue, options.arrayChanges, options.target);
    });
    this.templateQuestion.onNestedPropertyChanged.add((sender: Base, options: any): void => {
      this.onNestedPropertyChanged.fire(this, options);
      this.propertyValueChanged(options.name, options.newValue, options.newValue);
    });
    this.templateQuestion.onItemValuePropertyChanged.add((sender: Base, options: any): void => {
      this.onItemValuePropertyChanged.fire(this, options);
      this.propertyValueChanged(options.propertyName, options.oldValue, options.newValue);
    });
    this.templateQuestion.isContentElement = true;
    if (!this.isLoadingFromJson) {
      this.templateQuestion.onGetSurvey = () => this.getSurvey();
    }
    this.templateQuestion.locTitle.strChanged();
  }
  // "" is not a registered class either, so a field with no fieldType gets the same text question the
  // unknown types fall back to. It is what makes name/title/valueName work before a type is picked.
  protected createNewQuestion(fieldType: string): Question {
    let question = <Question>Serializer.createClass(fieldType);
    if (!question) {
      question = <Question>Serializer.createClass("text");
    }
    question.loadingOwner = this;
    question.isEditableTemplateElement = true;
    this.setQuestionProperties(question);
    return question;
  }
  // Carries the previous template over so that name, title and valueName survive a fieldType change.
  protected setQuestionProperties(question: Question): void {
    if (!this.templateQuestion) return;
    const storeDefaults = this.templateQuestion.getType() === question.getType();
    const json = new JsonObject().toJsonObject(this.templateQuestion, storeDefaults);
    json.type = question.getType();
    new JsonObject().toObject(json, question);
  }
  // An empty dynamic type borrows nothing, and it must not fall back to getDynamicType(): while the
  // setter runs, fieldType still holds the previous value.
  private getProperties(fieldType: string): Array<JsonObjectProperty> {
    if (!fieldType) return [];
    return Serializer.getDynamicPropertiesByObj(this, fieldType);
  }
  private removeProperties(fieldType: string): void {
    const properties = this.getProperties(fieldType);
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      delete (<any>this)[prop.name];
      if (prop.serializationProperty) {
        delete (<any>this)[prop.serializationProperty];
      }
    }
  }
  private addProperties(fieldType: string): void {
    const props = this.getProperties(fieldType);
    Serializer.addDynamicPropertiesIntoObj(this, this.templateQuestion, props);
  }
}

Serializer.addClass("filterfield", [
  { name: "!name", isUnique: true },
  { name: "title", serializationProperty: "locTitle", dependsOn: "name" },
  { name: "valueName", visible: false },
  {
    name: "valueType", default: "string", visible: false,
    choices: ["string", "number", "boolean", "date", "array", "object"],
    // Read-only while fieldType is set - the created question answers it - so nothing of it is
    // stored: the JSON keeps only what was authored for a field that has no fieldType.
    onSerializeValue: (obj: any): any => {
      if (!!obj.fieldType) return undefined;
      const val = obj.getPropertyValue("valueType");
      return val === "string" ? undefined : val;
    }
  },
  {
    name: "fieldType", default: "", visible: false,
    choices: () => { const res = QuestionFactory.Instance.getAllTypes(); res.splice(0, 0, ""); return res; }
  },
  // The operators the field takes, those of the target's field an entry overrides included.
  // dependsOn: the operators offered are those of the field the entry names (the Creator's details).
  { name: "operators:string[]", dependsOn: "name", choices: (obj: any): Array<string> => getFilterOperatorChoices(obj) },
  { name: "showInQuickFilters:boolean", default: true },
], () => new FilterField(""));
