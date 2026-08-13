import { createCaseError, ISurveyTestContext, ISurveyTestTarget, SurveyTestTargetKind } from "./test-context";
import { SurveyTestIssueCodes } from "./test-result";

// Exactly one accepted type per command and per check. Nothing in the format changes meaning
// according to the type it was handed: the Creator renders one property editor per entry from the
// declared type, and a type-switch payload would have to be re-derived by the editor, the renderer,
// the validator and the docs.
export type SurveyTestPayloadType =
  "string" | "number" | "boolean" | "stringArray" | "nameMap" | "value" | "none";

export interface ISurveyTestCommand {
  name: string;
  // May target "survey"; default false.
  allowSurvey?: boolean;
  // May target an element; default true.
  allowElement?: boolean;
  // "checks" means the payload is a check map. Only "expect" declares it.
  paramsKind?: "params" | "checks";
  payloadType: SurveyTestPayloadType;
  run(context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void;
}

export function isValidTestPayload(type: SurveyTestPayloadType, val: any): boolean {
  switch(type) {
    case "string": return typeof val === "string";
    case "number": return typeof val === "number" && isFinite(val);
    case "boolean": return typeof val === "boolean";
    case "stringArray": return Array.isArray(val) && val.every(item => typeof item === "string");
    case "nameMap": return !!val && typeof val === "object" && !Array.isArray(val);
    case "value": return val !== undefined;
    case "none": return val === true;
  }
  return false;
}

export function getTestPayloadTypeText(type: SurveyTestPayloadType): string {
  switch(type) {
    case "string": return "a string";
    case "number": return "a number";
    case "boolean": return "a boolean";
    case "stringArray": return "an array of strings";
    case "nameMap": return "an object that maps a name to a value";
    case "value": return "a question value";
    case "none": return "true";
  }
  return type;
}

export function isCommandAllowedForKind(command: ISurveyTestCommand, kind: SurveyTestTargetKind): boolean {
  if (kind === "survey") return command.allowSurvey === true;
  return command.allowElement !== false;
}

export class SurveyTestCommandFactory {
  public static Instance: SurveyTestCommandFactory = new SurveyTestCommandFactory();
  private commands: { [name: string]: ISurveyTestCommand } = {};
  public register(command: ISurveyTestCommand): void {
    this.commands[command.name] = command;
  }
  public unregister(name: string): void {
    delete this.commands[name];
  }
  public get(name: string): ISurveyTestCommand {
    return this.commands[name];
  }
  // Sorted and stable: the Builder editor populates its dropdowns from it.
  public getNames(): Array<string> {
    return Object.keys(this.commands).sort();
  }
  public getNamesForKind(kind: SurveyTestTargetKind): Array<string> {
    return this.getNames().filter(name => isCommandAllowedForKind(this.commands[name], kind));
  }
}

// The value goes in through the question, which routes it into SurveyModel.setValue for a top-level
// question and into the owning panel or matrix row for a nested one. Triggers, setValueIf and
// calculated values therefore run exactly as they do for a respondent, at every nesting level.
// Prompt 03 adds the feasibility rules (current page, visible, editable, value enterable) and the
// leaf-by-leaf walk for composite questions as a guard at the head of run(), before any model change.
SurveyTestCommandFactory.Instance.register({
  name: "set",
  allowSurvey: false,
  allowElement: true,
  payloadType: "value",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
    if (target.kind !== "question") {
      throw createCaseError(SurveyTestIssueCodes.commandNotApplicable,
        "The \"set\" command applies to a question, but the target \"" + target.name + "\" is a " +
        target.kind + ".", { target: target.name, data: { command: "set", kind: target.kind } });
    }
    target.obj.value = params;
  },
});
