import { Serializer } from "../jsonobject";

function hideProperty(className: string, propertyName: string): void {
  const prop = Serializer.findProperty(className, propertyName);
  if (!prop) return;
  prop.visible = false;
  prop.isSerializable = false;
}

function removeChoice(className: string, propertyName: string, choice: string): void {
  const prop = Serializer.findProperty(className, propertyName);
  if (!prop) return;
  const choices = prop.getChoices(null);
  if (!Array.isArray(choices)) return;
  prop.setChoices(choices.filter((item: any) => item !== choice));
}

export function setupThemeAdapter(adapter: "mui" | "bootstrap" | "shadcn"): void {
  if (adapter !== "mui" && adapter !== "bootstrap" && adapter !== "shadcn") return;

  Serializer.findProperty("survey", "questionDescriptionLocation").defaultValue = "underInput";
  Serializer.findProperty("survey", "questionErrorLocation").defaultValue = "bottom";

  hideProperty("survey", "questionErrorLocation");
  hideProperty("question", "errorLocation");

  if (adapter === "mui") {
    removeChoice("survey", "questionDescriptionLocation", "underTitle");
    removeChoice("question", "descriptionLocation", "underTitle");
    hideProperty("survey", "questionTitleLocation");
    hideProperty("question", "titleLocation");
  }
}
