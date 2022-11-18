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

export const defaultThemeCssRules = {
  ".sv_default_css": "background-color: $body-container-background-color;",

  ".sv_default_css hr": "border-color: $border-color;",

  ".sv_default_css input[type='button'], .sv_default_css button": "color: $body-background-color; background-color: $main-color;",
  ".sv_default_css input[type='button']:hover, .sv_default_css button:hover": "background-color: $main-hover-color;",

  ".sv_default_css .sv_header": "color: $header-color;",
  ".sv_default_css .sv_custom_header": "background-color: $header-background-color;",
  ".sv_default_css .sv_container": "color: $text-color;",
  ".sv_default_css .sv_body": "background-color: $body-background-color; border-color: $main-color;",
  ".sv_default_css .sv_progress": "background-color: $border-color;",
  ".sv_default_css .sv_progress_bar": "background-color: $main-color;",

  ".sv_default_css .sv_progress-buttons__list li:before": "border-color: $progress-buttons-color; background-color: $progress-buttons-color;",
  ".sv_default_css .sv_progress-buttons__list li:after": "background-color: $progress-buttons-line-color;",
  ".sv_default_css .sv_progress-buttons__list .sv_progress-buttons__page-title": "color: $text-color;",
  ".sv_default_css .sv_progress-buttons__list .sv_progress-buttons__page-description": "color: $text-color;",
  ".sv_default_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed:before": "border-color: $main-color; background-color: $main-color;",
  ".sv_default_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed + li:after": "background-color: $progress-buttons-color",
  ".sv_default_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--current:before": "border-color: $main-color; background-color: white;",
  ".sv_default_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed.sv_progress-buttons__list-element--current:before": "border-color: $main-color; background-color: white;",

  ".sv_default_css .sv_p_root > .sv_row": "border-color: $border-color;",
  ".sv_default_css .sv_p_root > .sv_row:nth-child(odd)": "background-color: $body-background-color;",
  ".sv_default_css .sv_p_root > .sv_row:nth-child(even)": "background-color: $body-container-background-color;",

  ".sv_default_css .sv_q_other input": "color: $text-color; -webkit-text-fill-color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
  ".sv_default_css .sv_q_text_root": "color: $text-color; -webkit-text-fill-color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
  ".sv_default_css .sv_q_dropdown_control": "color: $text-input-color; border-color: $border-color; background-color: $inputs-background-color;",
  ".sv_default_css .sv_q_dropdown_control__input-field-component": "height: auto;",
  ".sv_default_css input[type='text']": "color: $text-color; -webkit-text-fill-color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
  ".sv_default_css select": "color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
  ".sv_default_css textarea": "color: $text-input-color; -webkit-text-fill-color: $text-input-color; border-color: $border-color; background-color: $inputs-background-color;",
  ".sv_default_css input:not([type='button']):not([type='reset']):not([type='submit']):not([type='image']):not([type='checkbox']):not([type='radio'])": "border: 1px solid $border-color; background-color: $inputs-background-color;color: $text-input-color; -webkit-text-fill-color: $text-input-color;",
  ".sv_default_css input:not([type='button']):not([type='reset']):not([type='submit']):not([type='image']):not([type='checkbox']):not([type='radio']):focus": "border: 1px solid $main-color;",
  ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_select_wrapper .sv_q_dropdown_control": "background-color: $inputs-background-color;",
  ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_select_wrapper .sv_q_dropdown_control:focus-within": "border: 1px solid $main-color;",
  ".sv_default_css .sv_q_other input:focus": "border-color: $main-color;",
  ".sv_default_css .sv_q_text_root:focus": "border-color: $main-color;",
  ".sv_default_css .sv_q_dropdown_control:focus": "border-color: $main-color;",
  ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_dropdown_control .sv_q_dropdown__value .sv_q_dropdown__filter-string-input[type=text]": "border: none; outline: none; padding: 0px; width: auto; display: flex; flex-grow: 1;  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; position: absolute; inset-inline-start: 0; top: 0; height: 100%; background-color: transparent;",
  ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_dropdown_control .sv_q_dropdown__value.sv_q_tagbox__value .sv_q_dropdown__filter-string-input.sv_q_tagbox__filter-string-input": "position: initial;",
  ".sv_default_css input[type='text']:focus": "border-color: $main-color;",
  '.sv_default_css .sv_container .sv_body .sv_p_root .sv_q input[type="radio"]:focus, .sv_default_css .sv_container .sv_body .sv_p_root .sv_q input[type="checkbox"]:focus': "outline: 1px dotted $main-color;",
  ".sv_default_css select:focus": "border-color: $main-color;",
  ".sv_default_css textarea:focus": "border-color: $main-color;",
  ".sv_default_css .sv_q_input.sv_q_input.sv_q_input.sv_q_tagbox.sv_q_tagbox.sv_q_tagbox:not(.sv_q_tagbox--empty)": "height: auto;",
  ".sv_default_css .sv_select_wrapper.sv_q_tagbox_wrapper::before": "height: 100%; padding: 0 1em;",

  ".sv_default_css .sv_select_wrapper": "background-color: $body-background-color;",
  ".sv_default_css .sv_select_wrapper::before": "background-color: $main-color;",

  ".sv_default_css .sv_q_rating_item.active .sv_q_rating_item_text": "background-color: $main-hover-color; border-color: $main-hover-color; color: $body-background-color;",
  ".sv_default_css .sv_q_rating_item .sv_q_rating_item_text": "border-color: $border-color;",
  ".sv_default_css .sv_q_rating_item .sv_q_rating_item_text:hover": "border-color: $main-hover-color;",

  ".sv_default_css table.sv_q_matrix tr": "border-color: $border-color;",
  ".sv_default_css table.sv_q_matrix_dropdown tr": "border-color: $border-color;",
  ".sv_default_css table.sv_q_matrix_dynamic tr": "border-color: $border-color;",

  ".sv_default_css .sv_q_m_cell_selected": "color: $body-background-color; background-color: $main-hover-color;",

  ".sv_main .sv_q_file_remove:hover": "color: $main-color;",
  ".sv_main .sv_q_file_choose_button": "color: $body-background-color; background-color: $main-color;",
  ".sv_main .sv_q_file_choose_button:hover": "background-color: $main-hover-color;",

  ".sv_main .sv_q_imgsel.checked label>div": "background-color: $main-color",

  ".sv_default_css .sv_p_description": "padding-left: 1.29em;",
  //progress bar
  ".sv_main .sv-progress": "background-color: $header-background-color;",
  ".sv_main .sv-progress__bar": "background-color: $main-color;",

  //paneldynamic
  ".sv_main .sv-paneldynamic__prev-btn.sv-paneldynamic__prev-btn--disabled, .sv_main .sv-paneldynamic__next-btn.sv-paneldynamic__next-btn--disabled": "fill: $disable-color;",
  ".sv_main .sv-paneldynamic__progress-text": "color: $progress-text-color;",
  ".sv_main .sv-paneldynamic__prev-btn, .sv_main .sv-paneldynamic__next-btn": "fill: $text-color",

  //boolean
  ".sv_main .sv-boolean__switch": "background-color: $main-color; outline-color: $main-color",
  ".sv_main .sv-boolean__slider": "background-color: $slider-color;",
  ".sv_main .sv-boolean__label--disabled": "color: $disabled-label-color;",
  ".sv_main .sv-boolean--disabled .sv-boolean__switch": "background-color: $disabled-switch-color;",
  ".sv_main .sv-boolean--disabled .sv-boolean__slider": "background-color: $disabled-slider-color;",
  //eo boolean

  //signature pad
  ".sv_main .sjs_sp_container": "border: 1px dashed $disable-color;",
  ".sv_main .sjs_sp_placeholder": "color: $foreground-light;",

  ".sv_main .sv_matrix_detail_row": "background-color: #ededed; border-top: 1px solid $header-background-color; border-bottom: 1px solid $header-background-color;",

  //action-bar
  ".sv_main .sv-action-bar-item": "color: $text-color;",
  ".sv_main .sv-action-bar-item__icon use": "fill: $foreground-light;",
  ".sv_main .sv-action-bar-item:hover": "background-color: $background-dim;",
  //eo action-bar

  //button-group
  ".sv_main .sv-button-group__item--hover:hover": "background-color: $background-dim;",
  ".sv_main .sv-button-group__item-icon use": "fill: $foreground-light;",
  ".sv_main .sv-button-group__item--selected": "color: $main-color;",
  ".sv_main .sv-button-group__item--selected .sv-button-group__item-icon use": "fill: $main-color;",
  ".sv_main .sv-button-group__item--disabled": "color: $foreground-disabled;",
  ".sv_main .sv-button-group__item--disabled .sv-button-group__item-icon use": "fill: $foreground-disabled;",
  ".sv_main .sv-button-group__item": "background: $body-background-color; border-color: $border-color;",

  //eo button-group

  ".sv_main .sv_qstn textarea": "max-width: 100%",

  //list
  "body .sv-list__input": "color: $text-input-color; border-color: $border-color; background-color: $inputs-background-color;",
  "body .sv-list__input::placeholder": "color: $foreground-light;",
  "body .sv-list__input:disabled": "color: $foreground-disabled;",
  "body .sv-list__input:disabled::placeholder": "color: $foreground-disabled;",
  "body .sv-list__item--selected": "background: rgba(25, 179, 148, 0.1); color: $foreground-disabled",
  "body .sv-list__item--selected.sv-list__item--focused": "background-color: $main-color; color: $inputs-background-color;",
  "body .sv-list__item--selected:focus": "background-color: $main-color; color: $inputs-background-color;",
  "body .sv-list__item--selected:hover": "background-color: $main-color; color: $inputs-background-color;",
  //eo list
  ".sv-skeleton-element": "background-color: $background-dim;",

  //ranking
  ".sv_main .sv-ranking-item:focus .sv-ranking-item__index": "border: 2px solid $main-color;",
  ".sv_main .sv-ranking-item__icon": "fill: $main-color;",
  "body .sv-ranking-shortcut .sv-ranking-item__icon": "fill: $main-color;"
  //eo ranking
};

StylesManager.ThemeColors[defaultThemeName] = defaultThemeColors;
StylesManager.ThemeCss[defaultThemeName] = defaultThemeCssRules;