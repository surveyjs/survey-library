import { StylesManager } from "survey-core";
import { bootstrapMaterialThemeName } from "./theme-settings";
export * from "./theme-settings";
export * from "./cssbootstrapmaterial";

StylesManager.applyTheme(bootstrapMaterialThemeName);