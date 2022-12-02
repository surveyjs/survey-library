import { StylesManager } from "survey-core";
import { modernThemeName } from "./theme-settings";
export * from "./theme-settings";
export * from "./cssmodern";

StylesManager.applyTheme(modernThemeName);