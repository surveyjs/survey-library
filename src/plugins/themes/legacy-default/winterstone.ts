import { StylesManager } from "survey-core";
import { winterstoneThemeName } from "./winterstone-theme-settings";
export * from "./winterstone-theme-settings";
export * from "./cssstandard";

StylesManager.applyTheme(winterstoneThemeName);