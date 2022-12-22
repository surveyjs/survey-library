import { StylesManager, surveyCss } from "survey-core";
import { defaultStandardCss } from "./cssstandard";

export const defaultThemeName = "default";
(<any>surveyCss)[defaultThemeName] = defaultStandardCss;

export const defaultThemeColors: { [key: string]: string } = {
  "$header-background-color": "#e7e7e7",
  "$body-container-background-color": "#f4f4f4",

  "$main-color": "#1ab394",
  "$main-hover-color": "#0aa384",
  "$body-background-color": "white",
  "$inputs-background-color": "white",
  "$text-color": "#6d7072",
  "$text-input-color": "#6d7072",
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

  "$progress-buttons-color": "#8dd9ca",
  "$progress-buttons-line-color": "#d4d4d4"
};

export const defaultThemeCssRules = {};

StylesManager.ThemeColors[defaultThemeName] = defaultThemeColors;
StylesManager.ThemeCss[defaultThemeName] = defaultThemeCssRules;