import { surveyCss, StylesManager } from "survey-core";
import { defaultStandardCss } from "./cssstandard";
import { standardThemeCssRules } from "./standard-theme-settings";

export const winterThemeName = "winter";
(<any>surveyCss)[winterThemeName] = defaultStandardCss;

export const winterThemeColors: { [key: string]: string } = {
  "$header-background-color": "#82b8da",
  "$body-container-background-color": "#dae1e7",

  "$main-color": "#3c3b40",
  "$main-hover-color": "#1e1d20",
  "$body-background-color": "white",
  "$inputs-background-color": "white",
  "$text-color": "#000",
  "$text-input-color": "#000",
  "$header-color": "#000",
  "$border-color": "#e7e7e7",

  "$error-color": "#ed5565",
  "$error-background-color": "#fd6575",

  "$disable-color": "#dbdbdb",
  "$progress-text-color": "#9d9d9d",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",

  "$progress-buttons-color": "#d1c9f5",
  "$progress-buttons-line-color": "#d4d4d4"
};

StylesManager.ThemeColors[winterThemeName] = winterThemeColors;
StylesManager.ThemeCss[winterThemeName] = standardThemeCssRules;