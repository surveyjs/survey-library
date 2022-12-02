import { StylesManager } from "survey-core";
import { darkblueThemeName } from "./darkblue-theme-settings";
export * from "./darkblue-theme-settings";
export * from "./cssstandard";

StylesManager.applyTheme(darkblueThemeName);