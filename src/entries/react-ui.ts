export * from "./react-ui-model";
export * from "./core-export";
export { SurveyModel as Model, unwrap } from "survey-core";

export * from "../utils/responsivity-manager";

import { checkLibraryVersion } from "survey-core";

checkLibraryVersion(`${process.env.VERSION}`, "survey-react-ui");