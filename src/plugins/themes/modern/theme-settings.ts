import { StylesManager, surveyCss } from "survey-core";
import { modernCss } from "./cssmodern";
import { setMediaStyles, setStyles } from "../common-theme-settings"; // need for typigs

export const modernThemeName = "modern";
(<any>surveyCss)[modernThemeName] = modernCss;

export const modernThemeColors: { [key: string]: string } = {
  "$main-color": "#1ab394",
  "$add-button-color": "#1948b3",
  "$remove-button-color": "#ff1800",
  "$disable-color": "#dbdbdb",
  "$progress-text-color": "#9d9d9d",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$error-color": "#d52901",
  "$text-color": "#404040",
  "$light-text-color": "#fff",
  "$button-text-color": "#fff",
  "$checkmark-color": "#fff",
  "$matrix-text-checked-color": "#fff",

  "$progress-buttons-color": "#8dd9ca",
  "$progress-buttons-line-color": "#d4d4d4",

  "$text-input-color": "#404040",
  "$inputs-background-color": "transparent",
  "$main-hover-color": "#9f9f9f",
  "$body-container-background-color": "#f4f4f4",
  "$text-border-color": "#d4d4d4",
  "$disabled-text-color": "rgba(64, 64, 64, 0.5)",
  "$border-color": "rgb(64, 64, 64, 0.5)",
  "$dropdown-border-color": "#d4d4d4",
  "$header-background-color": "#e7e7e7",
  "$answer-background-color": "rgba(26, 179, 148, 0.2)",
  "$error-background-color": "rgba(213, 41, 1, 0.2)",
  "$radio-checked-color": "#404040",
  "$clean-button-color": "#1948b3",
  "$body-background-color": "#ffffff",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",
};

StylesManager.ThemeColors[modernThemeName] = modernThemeColors;
StylesManager.ThemeSelector[modernThemeName] = ".sv-root-modern ";