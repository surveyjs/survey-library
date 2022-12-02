import { StylesManager } from "survey-core";
import { winterThemeName } from "./winter-theme-settings";
export * from "./winter-theme-settings";
export * from "./cssstandard";

StylesManager.applyTheme(winterThemeName);