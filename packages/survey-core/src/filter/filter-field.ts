import { Base } from "../base";
import { JsonObject, JsonObjectProperty, Serializer } from "../jsonobject";
import { LocalizableString } from "../localizablestring";
import { Question, QuestionValueType } from "../question";
import { QuestionFactory } from "../questionfactory";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-fields";

// One field a Filter Control offers in standalone mode: the author declares it here instead of
// taking it from a Dynamic Matrix or a Dynamic Panel. fieldType works the way cellType works for a
// Matrix Dropdown column: the properties of the question type that supplies the value editor
// (choices, choicesByUrl, inputType and the rest) are borrowed from that type and defined on the
// field instance, so they are authored and serialized as if they were the field's own.
export class FilterField extends Base {
  private templateQuestionValue: Question;

  constructor(name: string) {
    super();
    this.updateTemplateQuestion(undefined, name);
  }
  public getType(): string { return "filterfield"; }

  public get templateQuestion(): Question { return this.templateQuestionValue; }

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
  }
  public getOriginalObj(): Base { return this.templateQuestion; }
  getClassNameProperty(): string { return "fieldType"; }
  getDynamicPropertyName(): string { return "fieldType"; }
  // "" short-circuits Serializer.getDynamicPropertiesByTypes (jsonobject.ts:1060), so a field with
  // no fieldType exposes none of the fallback text question's properties.
  getDynamicType(): string { return this.fieldType || ""; }

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

  public getFilterField(): IDynamicDataFilterField {
    const q = this.templateQuestion;
    return {
      name: this.name, valueName: this.getValueName(), locTitle: this.locTitle,
      valueType: this.valueType, fieldType: this.fieldType, templateQuestion: q
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
  { name: "title", serializationProperty: "locTitle", dependsOn: "name", visible: false },
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
], () => new FilterField(""));
