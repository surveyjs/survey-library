import { Serializer } from "../jsonobject";

function hideProperty(className: string, propertyName: string): void {
  const prop = Serializer.findProperty(className, propertyName);
  if (!prop) return;
  prop.visible = false;
  prop.isSerializable = false;
}

export function setupThemeAdapter(adapter: "mui" | "bootstrap" | "shadcn"): void {
  if (adapter !== "mui" && adapter !== "bootstrap" && adapter !== "shadcn") return;

  Serializer.findProperty("survey", "questionDescriptionLocation").defaultValue = "underInput";
  Serializer.findProperty("survey", "questionErrorLocation").defaultValue = "bottom";

  hideProperty("survey", "questionErrorLocation");
  hideProperty("question", "errorLocation");

  if (adapter === "mui") {
    hideProperty("survey", "questionDescriptionLocation");
    hideProperty("question", "descriptionLocation");
  }
}
