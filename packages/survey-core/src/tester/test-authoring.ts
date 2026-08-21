import { ISurveyTestStep, STEP_METADATA_KEYS } from "./test-json";

// What a case editor, a recorder or a test generator needs to read a step without restating the rules
// of the format. There is one rule here and the validator and the runner apply the same one: a step is
// its metadata plus exactly one command, and every other key with a defined value is that command.

export interface ISurveyTestParsedStep {
  name?: string;
  description?: string;
  // Every key that is neither metadata nor undefined, in the order the step writes them. Zero and
  // several are both reported as they are: a step that holds none or two commands is a broken step,
  // and turning it into one is what makes an editor write a case the runner refuses.
  commands: Array<string>;
  // Keys that are neither metadata nor a command because their value is undefined. The validator
  // reports each of them as "unknownStepKey".
  undefinedKeys: Array<string>;
  // Set only when "commands" holds exactly one name; so is "params", the payload of that command.
  command?: string;
  params?: any;
}

// The commands a step holds. Metadata keys never count as one.
export function getSurveyTestStepCommandNames(step: ISurveyTestStep): Array<string> {
  return parseSurveyTestStep(step).commands;
}

export function parseSurveyTestStep(step: ISurveyTestStep): ISurveyTestParsedStep {
  const res: ISurveyTestParsedStep = { commands: [], undefinedKeys: [] };
  if (!step || typeof step !== "object" || Array.isArray(step)) return res;
  if (typeof step.name === "string") res.name = step.name;
  if (typeof step.description === "string") res.description = step.description;
  Object.keys(step).forEach(key => {
    if (STEP_METADATA_KEYS.indexOf(key) > -1) return;
    if ((<any>step)[key] === undefined) {
      res.undefinedKeys.push(key);
      return;
    }
    res.commands.push(key);
  });
  if (res.commands.length === 1) {
    res.command = res.commands[0];
    res.params = (<any>step)[res.command];
  }
  return res;
}
