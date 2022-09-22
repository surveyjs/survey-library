export * from "./vue-ui-model";
export * from "./core-export";
export { SurveyModel as Model } from "survey-core";

import { checkLibraryVersion } from "survey-core";

checkLibraryVersion(`${process.env.VERSION}`, "survey-vue-ui");