import { StylesManager } from "survey-core";
import { orangeThemeName } from "./orange-theme-settings";
export * from "./orange-theme-settings";
export * from "./cssstandard";

StylesManager.applyTheme(orangeThemeName);