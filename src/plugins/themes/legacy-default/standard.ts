import { StylesManager } from "survey-core";
import { defaultThemeName } from "./standard-theme-settings";
export * from "./standard-theme-settings";
export * from "./cssstandard";

StylesManager.applyTheme(defaultThemeName);