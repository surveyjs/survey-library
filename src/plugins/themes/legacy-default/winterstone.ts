import { surveyCss, StylesManager } from "survey-core";
import { defaultStandardCss } from "./cssstandard";
import { themeCssRules } from "./index";

export const themeName = "winterstone";
(<any>surveyCss)[themeName] = defaultStandardCss;

export const themeColors: { [key: string]: string } = {
  "$header-background-color": "#323232",
  "$body-container-background-color": "#f8f8f8",

  "$main-color": "#5ac8fa",
  "$main-hover-color": "#06a1e7",
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

  "$progress-buttons-color": "#acdcf2",
  "$progress-buttons-line-color": "#d4d4d4"
};

StylesManager.applyTheme(themeName, null, themeCssRules, themeColors);
surveyCss.currentType = themeName;