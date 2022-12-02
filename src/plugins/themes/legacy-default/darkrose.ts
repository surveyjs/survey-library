import { StylesManager } from "survey-core";
import { darkroseThemeName } from "./darkrose-theme-settings";
export * from "./darkrose-theme-settings";
export * from "./cssstandard";

StylesManager.applyTheme(darkroseThemeName);