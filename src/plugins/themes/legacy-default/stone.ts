import { StylesManager } from "survey-core";
import { stoneThemeName } from "./stone-theme-settings";
export * from "./stone-theme-settings";
export * from "./cssstandard";

StylesManager.applyTheme(stoneThemeName);