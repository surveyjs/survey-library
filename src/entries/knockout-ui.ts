export * from "./knockout-ui-model";
export * from "./core-export";

import { checkLibraryVersion } from "survey-core";

checkLibraryVersion(`${process.env.VERSION}`, "survey-knockout-ui");