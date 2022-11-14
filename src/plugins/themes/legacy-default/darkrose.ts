import { surveyCss, StylesManager } from "survey-core";
import { defaultStandardCss } from "./cssstandard";
import { themeCssRules } from "./index";

export const themeName = "darkrose";
(<any>surveyCss)[themeName] = defaultStandardCss;

export const themeColors: { [key: string]: string } = {
  "$header-background-color": "#ddd2ce",
  "$body-container-background-color": "#f7efed",

  "$main-color": "#68656e",
  "$main-hover-color": "#58555e",
  "$body-background-color": "white",
  "$inputs-background-color": "white",
  "$text-color": "#4a4a4a",
  "$text-input-color": "#4a4a4a",
  "$header-color": "#6d7072",
  "$border-color": "#e7e7e7",

  "$error-color": "#ed5565",
  "$error-background-color": "#fd6575",

  "$progress-text-color": "#9d9d9d",
  "$disable-color": "#dbdbdb",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",

  "$progress-buttons-color": "#c6bed4",
  "$progress-buttons-line-color": "#d4d4d4"
};

StylesManager.applyTheme(themeName, null, themeCssRules, themeColors);
surveyCss.currentType = themeName;