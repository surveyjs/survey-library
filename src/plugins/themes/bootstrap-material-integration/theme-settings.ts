import { StylesManager, surveyCss } from "survey-core";
import { setMediaStyles, setStyles } from "../common-theme-settings";
import { defaultCss } from "./cssbootstrapmaterial";

export const bootstrapMaterialThemeName = "bootstrapmaterial";
(<any>surveyCss)[bootstrapMaterialThemeName] = defaultCss;

export const bootstrapMaterialThemeColors: { [key: string]: string } = {
  "$main-color": "#18a689",
  "$text-color": "#404040;",
  "$text-input-color": "#404040;",
  "$progress-text-color": "#9d9d9d",
  "$disable-color": "#dbdbdb",
  "$header-background-color": "#e7e7e7",

  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$body-background-color": "#ffffff",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",

  "$progress-buttons-color": "#8dd6c7",
  "$progress-buttons-line-color": "#d4d4d4",
};

export const bootstrapMaterialThemeCssRules = {
  ".sv_main.sv_bootstrapmaterial_css .form-group.is-focused .form-control": "linear-gradient(0deg, $main-color 2px, $main-color 0),linear-gradient(0deg, #D2D2D2 1px, transparent 0);",
  ".sv_main.sv_bootstrapmaterial_css .sv_qstn": "margin-bottom: 1rem;",
  ".sv_main.sv_bootstrapmaterial_css .sv_qstn label.sv_q_m_label": "height: 100%;",

  ".sv_main.sv_bootstrapmaterial_css .sv_q_image": "display: inline-block;",
  ".sv_main .sv_row .sv_qstn:first-child:last-child": "flex: none !important;",
  ".sv_main .sv_row .sv_p_container:first-child:last-child": "flex: none !important;",

  ".sv_main.sv_bootstrapmaterial_css .checkbox input[type=checkbox]:checked + .checkbox-material .check": "border-color: $main-color;",
  ".sv_main.sv_bootstrapmaterial_css label.checkbox-inline input[type=checkbox]:checked + .checkbox-material .check": "border-color: $main-color;",
  ".sv_main.sv_bootstrapmaterial_css .checkbox input[type=checkbox]:checked + .checkbox-material .check:before": "color: $main-color;",
  ".sv_main.sv_bootstrapmaterial_css label.checkbox-inline input[type=checkbox]:checked + .checkbox-material .check:before": "color: $main-color;",

  ".sv_main.sv_bootstrapmaterial_css .radio input[type=radio]:checked ~ .circle": "border-color: $main-color;",
  ".sv_main.sv_bootstrapmaterial_css label.radio-inline input[type=radio]:checked ~ .circle": "border-color: $main-color;",
  ".sv_main.sv_bootstrapmaterial_css .radio input[type=radio]:checked ~ .check": "background-color: $main-color;",
  ".sv_main.sv_bootstrapmaterial_css label.radio-inline input[type=radio]:checked ~ .check": "background-color: $main-color;",
  ".sv_main.sv_bootstrapmaterial_css .btn-default.active": "background-color: $main-color; color: $body-background-color;",
  ".sv_main.sv_bootstrapmaterial_css .btn-default:active": "background-color: $main-color; color: $body-background-color;",
  ".sv_main.sv_bootstrapmaterial_css .btn-secondary.active": "background-color: $main-color; color: $body-background-color;",
  ".sv_main.sv_bootstrapmaterial_css .btn-secondary:active": "background-color: $main-color; color: $body-background-color;",
  ".sv_main.sv_bootstrapmaterial_css .open>.dropdown-toggle.btn-default": "background-color: $main-color; color: $body-background-color;",
  ".sv_main.sv_bootstrapmaterial_css input[type='button'].btn-primary, .sv_main.sv_bootstrapmaterial_css button.btn-primary": "color: $body-background-color; background-color: $main-color;",
  ".sv_main.sv_bootstrapmaterial_css input[type='button'].btn-primary:hover, .sv_main.sv_bootstrapmaterial_css button.btn-primary:hover": "background-color: $main-hover-color;",
  ".sv_main .sv_q_imgsel.checked label>div": "background-color: $main-color;",

  ".sv_main.sv_bootstrapmaterial_css .sv_q_file_remove:hover": "color: $main-color;",

  ".sv_main.sv_bootstrapmaterial_css .form-group input[type=file]": "position: relative; opacity: 1;",
  ".sv_main.sv_bootstrapmaterial_css .progress": "width: 60%; height: 1.5em;",
  ".sv_main.sv_bootstrapmaterial_css .progress-bar": "width: auto; margin-left: 2px; margin-right: 2px;",

  //progress bar
  ".sv_main .sv-progress": "background-color: $header-background-color;",
  ".sv_main .sv-progress__bar": "background-color: $main-color;",

  //progress buttons
  ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li:before": "border-color: $progress-buttons-color; background-color: $progress-buttons-color;",
  ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li:after": "background-color: $progress-buttons-line-color;",
  ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list .sv_progress-buttons__page-title": "color: $text-color;",
  ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list .sv_progress-buttons__page-description": "color: $text-color;",
  ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed:before": "border-color: $main-color; background-color: $main-color;",
  ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed + li:after": "background-color: $progress-buttons-color",
  ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--current:before": "border-color: $main-color; background-color: white;",
  ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed.sv_progress-buttons__list-element--current:before": "border-color: $main-color; background-color: white;",

  //paneldynamic
  ".sv_main .sv-paneldynamic__prev-btn.sv-paneldynamic__prev-btn--disabled, .sv_main .sv-paneldynamic__next-btn.sv-paneldynamic__next-btn--disabled": "fill: $disable-color;",
  ".sv_main .sv-paneldynamic__progress-text": "color: $progress-text-color;",
  ".sv_main .sv-paneldynamic__prev-btn, .sv_main .sv-paneldynamic__next-btn": "fill: $text-color",

  //boolean
  ".sv_main .sv-boolean .checkbox-decorator": "display: none;",
  ".sv_main .sv-boolean__switch": "background-color: $main-color;",
  ".sv_main .sv-boolean__slider": "background-color: $slider-color;",
  ".sv_main .sv-boolean__label.sv-boolean__label--disabled": "color: $disabled-label-color;",
  ".sv_main .sv-boolean__label": "color: $text-color;",
  ".sv_main .sv-boolean--disabled .sv-boolean__switch": "background-color: $disabled-switch-color;",
  ".sv_main .sv-boolean--disabled  .sv-boolean__slider": "background-color: $disabled-slider-color;",
  //eo boolean
  ".sv_main .sv_matrix_detail_row": "background-color: #ededed; border-top: 1px solid $header-background-color; border-bottom: 1px solid $header-background-color;",

  //signature pad
  ".sv_main .sjs_sp_container": "border: 1px dashed $disable-color;",
  ".sv_main .sjs_sp_placeholder": "color: $foreground-light;",

  ".sv_main .sv-action-bar-item": "color: $text-color;",
  ".sv_main .sv-action-bar-item__icon use": "fill: $foreground-light;",
  ".sv_main .sv-action-bar-item:hover": "background-color: $background-dim;",

  ".sv-skeleton-element": "background-color: $background-dim;",
};

setStyles();
setMediaStyles();

StylesManager.ThemeColors[bootstrapMaterialThemeName] = bootstrapMaterialThemeColors;
StylesManager.ThemeCss[bootstrapMaterialThemeName] = bootstrapMaterialThemeCssRules;