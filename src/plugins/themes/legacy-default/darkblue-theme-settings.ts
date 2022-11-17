import { StylesManager, surveyCss } from "survey-core";
import { defaultStandardCss } from "./cssstandard";
import { standardThemeCssRules } from "./standard-theme-settings";

export const darkblueThemeName = "darkblue";
(<any>surveyCss)[darkblueThemeName] = defaultStandardCss;

export const darkblueThemeColors: { [key: string]: string } = {
  "$header-background-color": "#d9d8dd",
  "$body-container-background-color": "#f6f7f2",

  "$main-color": "#3c4f6d",
  "$main-hover-color": "#2c3f5d",
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

  "$progress-buttons-color": "#839ec9",
  "$progress-buttons-line-color": "#d4d4d4"
};

StylesManager.ThemeColors[darkblueThemeName] = darkblueThemeColors;
StylesManager.ThemeCss[darkblueThemeName] = standardThemeCssRules;