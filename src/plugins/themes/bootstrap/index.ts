import { StylesManager } from "survey-core";
import { bootstrapThemeName } from "./theme-settings";
export * from "./theme-settings";
export * from "./cssbootstrap";

StylesManager.applyTheme(bootstrapThemeName);