export * from "./react-ui-model";
export * from "./core-export";
export { SurveyModel as Model } from "survey-core";

export * from "../utils/responsivity-manager";
export { unwrap } from "../utils/utils";

import { checkLibraryVersion } from "survey-core";

checkLibraryVersion(`${process.env.VERSION}`, "survey-react-ui");