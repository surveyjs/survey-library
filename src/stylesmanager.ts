import { surveyCss } from "./defaultCss/cssstandard";
export class StylesManager {
  private static SurveyJSStylesSheetId = "surveyjs-styles";

  public static Styles: { [key: string]: string } = {
    // ".sv_bootstrap_css":
    //   "position: relative; width: 100%; background-color: #f4f4f4",
    // ".sv_bootstrap_css .sv_custom_header":
    //   "position: absolute; width: 100%; height: 275px; background-color: #e7e7e7;",
    // ".sv_bootstrap_css .sv_container":
    //   "max-width: 80%; margin: auto; position: relative; color: #6d7072; padding: 0 1em;",
    // ".sv_bootstrap_css .panel-body":
    //   "background-color: white; padding: 1em 1em 5em 1em; border-top: 2px solid lightgray;",
    ".sv_main span": "word-break: break-word;",

    ".sv_main legend": "border: none; margin: 0;",

    ".sv_bootstrap_css .sv_qstn": "padding: 0.5em 1em 1.5em 1em;",
    ".sv_bootstrap_css .sv_qcbc input[type=checkbox], .sv_bootstrap_css .sv_qcbc input[type=radio]":
      "vertical-align: middle; margin-top: -1px",
    ".sv_bootstrap_css .sv_qstn fieldset": "display: block;",
    ".sv_bootstrap_css .sv_qstn  .sv_q_checkbox_inline, .sv_bootstrap_css .sv_qstn .sv_q_radiogroup_inline":
      "display: inline-block;",

    ".sv_bootstrap_css .sv-paneldynamic__progress-container ":
      "position: relative; margin-right: 250px; margin-left: 40px; margin-top: 10px;",

    ".sv_main.sv_bootstrapmaterial_css .sv_q_radiogroup_control_label":
      "display: inline; position: static;",
    ".sv_main.sv_bootstrapmaterial_css .checkbox":
      "margin-top:10px;margin-bottom:10px;",

    ".sv_row": "clear: both; min-width:300px;",
    ".sv_row .sv_qstn": "float: left",
    ".sv_row .sv_qstn:last-child": "float: none",
    ".sv_qstn":
      "display: vertical-align: top; overflow: auto; min-width:300px;",
    ".sv_p_container": "display: vertical-align: top; min-width:300px;",

    ".sv_q_title .sv_question_icon": "float: right; margin-right: 1em;",
    ".sv_q_title .sv_question_icon::before":
      "content: ''; background-repeat: no-repeat; background-position: center; padding: 0.5em; display: inline-block; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAxMCAxMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAgMTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiM2RDcwNzI7fQ0KPC9zdHlsZT4NCjxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMiwyIDAsNCA1LDkgMTAsNCA4LDIgNSw1ICIvPg0KPC9zdmc+DQo=);",
    ".sv_q_title .sv_question_icon.sv_expanded::before":
      "transform: rotate(180deg);",
    ".sv_qbln .checkbox-material": "margin-right: 3px;",
    ".sv_qcbx .checkbox-material": "margin-right: 5px;",
    ".sv_qcbx .checkbox label": "justify-content: left; display: inline-block;",
    ".sv_qstn .radio label": "justify-content: left; display: inline-block;",
    ".sv_qstn .sv_q_imgsel > label img": "pointer-events: none;",
    ".sv_qstn .sv_q_imgsel.sv_q_imagepicker_inline": "display: inline-block;",
    ".sv_qstn label.sv_q_m_label":
      "position: absolute; margin: 0; display: block; width: 100%;",
    ".sv_qstn td": "position: relative;",
    ".sv_q_mt": "table-layout: fixed;",
    ".sv_q_mt_label": "display: flex; align-items: center; font-weight: inherit;",
    ".sv_q_mt_title": "margin-right: 0.5em; width: 33%;",
    ".sv_q_mt_item": "flex: 1;",
    ".sv_q_mt_item_value": "float: left;",
    '[dir="rtl"] .sv_q_mt_item_value': "float: right;",
    ".sv_qstn.sv_qstn_left": "margin-top: 0.75em;",
    ".sv_qstn .title-left": "float: left; margin-right: 1em; max-width: 50%",
    '[dir="rtl"] .sv_qstn .title-left': "float: right; margin-left: 1em;",
    ".sv_qstn .content-left": "overflow: hidden",
    ".sv_q_radiogroup_inline .sv_q_radiogroup_other": "display: inline-block;",
    ".sv_q_checkbox_inline .sv_q_checkbox_other": "display: inline-block;",
    ".sv_q_checkbox_inline, .sv_q_radiogroup_inline, .sv_q_imagepicker_inline":
      "line-height: 2.5em;",
    ".form-inline .sv_q_checkbox_inline:not(:last-child)": "margin-right: 1em;",
    ".form-inline .sv_q_radiogroup_inline:not(:last-child)":
      "margin-right: 1em;",
    ".sv_imgsel .sv_q_imagepicker_inline:not(:last-child)":
      "margin-right: 1em;",
    ".sv_qstn fieldset": "border: none; margin: 0; padding: 0;",
    ".sv_qstn .sv_q_file_placeholder": "display:none",

    ".sv_p_title": "padding-left: 1em; padding-bottom: 0.3em;",
    ".sv_p_title_expandable, .sv_q_title_expandable": "cursor: pointer; position: relative; display: flex; align-items: center; padding-right: 24px;",
    ".sv_p_title_expandable::after, .sv_q_title_expandable::after": "content: \"\"; display: block;background-image: url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 21.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 10 10' style='enable-background:new 0 0 10 10;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23404040;%7D%0A%3C/style%3E%3Cpolygon class='st0' points='2,2 0,4 5,9 10,4 8,2 5,5 '/%3E%3C/svg%3E%0A\"); background-repeat: no-repeat; background-position: center center; background-size: 10px 12px; width: 24px; height: 24px; position: absolute; right: 0;",
    ".sv_p_title_expanded::after, .sv_q_title_expanded::after": "transform: rotate(180deg);",
    ".sv_p_title .sv_panel_icon": "float: right; margin-right: 1em;",
    ".sv_p_title .sv_panel_icon::before":
      "content: ''; background-repeat: no-repeat; background-position: center; padding: 0.5em; display: inline-block; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAxMCAxMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAgMTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiM2RDcwNzI7fQ0KPC9zdHlsZT4NCjxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMiwyIDAsNCA1LDkgMTAsNCA4LDIgNSw1ICIvPg0KPC9zdmc+DQo=);",
    ".sv_p_title .sv_panel_icon.sv_expanded::before":
      "transform: rotate(180deg);",
    ".sv_p_footer": "padding-left: 1em; padding-bottom: 1em;padding-top: 1em;",

    ".sv_matrix_cell_detail_button": "position: relative",
    ".sv_detail_panel_icon":
      "display: block; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px;",
    ".sv_detail_panel_icon::before":
      "content: ''; background-repeat: no-repeat; background-position: center; width: 14px; height: 14px; display: block; transform: rotate(270deg); background-image: url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 21.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 15 15' style='enable-background:new 0 0 15 15;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23FFFFFF;%7D%0A%3C/style%3E%3Cpolygon class='st0' points='14,5.5 12.6,4.1 7.5,9.1 2.4,4.1 1,5.5 7.5,12 '/%3E%3C/svg%3E%0A\");",
    ".sv_detail_panel_icon.sv_detail_expanded::before":
      "transform: rotate(0deg)",
    ".sv_matrix_empty_rows_section":
      "text-align: center; vertical-align: middle;",
    ".sv_matrix_empty_rows_text": "padding:20px",

    ".sv_q_file > input[type=file], .sv_q_file > button":
      "display: inline-block;",
    ".sv_q_file_preview":
      "display: inline-block; vertical-align: top; border: 1px solid lightgray; padding: 5px; margin-top: 10px;",
    ".sv_q_file_preview > a":
      "display: block; overflow: hidden; vertical-align: top; white-space: nowrap; text-overflow: ellipsis;",
    ".sv_q_file_remove_button": "line-height: normal;",
    ".sv_q_file_remove": "display: block; cursor: pointer;",

    ".sv_q_m_cell_text": "cursor: pointer;",

    ".sv_q_dd_other": "margin-top: 1em;",
    ".sv_q_dd_other input": "width: 100%;",

    ".sv_qstn .sv-q-col-1, .sv-question .sv-q-col-1":
      "width: 100%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-word;",
    ".sv_qstn .sv-q-col-2, .sv-question .sv-q-col-2":
      "width: calc(50% - 1em); display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-word;",
    ".sv_qstn .sv-q-col-3, .sv-question .sv-q-col-3":
      "width: calc(33.33333% - 1em); display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-word;",
    ".sv_qstn .sv-q-col-4, .sv-question .sv-q-col-4":
      "width: calc(25% - 1em); display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-word;",
    ".sv_qstn .sv-q-col-5, .sv-question .sv-q-col-5":
      "width: calc(20% - 1em); display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-word;",

    ".sv_qstn .sv-q-column-1, .sv-question .sv-q-column-1":
      "width: 100%; max-width: 100%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-word;",
    ".sv_qstn .sv-q-column-2, .sv-question .sv-q-column-2":
      "max-width: 50%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-word;",
    ".sv_qstn .sv-q-column-3, .sv-question .sv-q-column-3":
      "max-width: 33.33333%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-word;",
    ".sv_qstn .sv-q-column-4, .sv-question .sv-q-column-4":
      "max-width: 25%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-word;",
    ".sv_qstn .sv-q-column-5, .sv-question .sv-q-column-5":
      "max-width: 20%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-word;",

    ".sv_qstn .sv_q_file_input": "color: transparent;",

    ".sv_qstn .sv_q_imgsel label > div":
      "overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 4px; border: 1px solid lightgray; border-radius: 4px;",
    ".sv_qstn .sv_q_imgsel label > div > img, .sv_qstn .sv_q_imgsel label > div > embed":
      "display: block;",

    ".sv_qstn table tr td .sv_q_m_cell_label":
      "position: absolute; left: 0; right: 0; top: 0; bottom: 0;",

    "f-panel": "padding: 0.5em 1em; display: inline-block; line-height: 2em;",

    ".sv_progress_bar > span": "white-space: nowrap;",

    //progress buttons
    ".sv_progress-buttons__container-center": "text-align: center;",
    ".sv_progress-buttons__container":
      "display: inline-block; font-size: 0; width: 100%; max-width: 1100px; white-space: nowrap; overflow: hidden;",
    ".sv_progress-buttons__image-button-left":
      "display: inline-block; vertical-align: top; margin-top: 22px; font-size: 14px; width: 16px; height: 16px; cursor: pointer; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwb2x5Z29uIHBvaW50cz0iMTEsMTIgOSwxNCAzLDggOSwyIDExLDQgNyw4ICIvPg0KPC9zdmc+DQo=);",
    ".sv_progress-buttons__image-button-right":
      "display: inline-block; vertical-align: top; margin-top: 22px; font-size: 14px; width: 16px; height: 16px; cursor: pointer; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwb2x5Z29uIHBvaW50cz0iNSw0IDcsMiAxMyw4IDcsMTQgNSwxMiA5LDggIi8+DQo8L3N2Zz4NCg==);",
    ".sv_progress-buttons__image-button--hidden": "visibility: hidden;",
    ".sv_progress-buttons__list-container":
      "max-width: calc(100% - 36px); display: inline-block; overflow: hidden;",
    ".sv_progress-buttons__list":
      "display: inline-block; width: max-content; padding-left: 28px; padding-right: 28px; margin-top: 14px; margin-bottom: 14px;",
    ".sv_progress-buttons__list li":
      "width: 138px; font-size: 14px; font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; position: relative; text-align: center; vertical-align: top; display: inline-block;",
    ".sv_progress-buttons__list li:before":
      "width: 24px; height: 24px; content: ''; line-height: 30px; display: block; margin: 0 auto 10px auto; border: 3px solid; border-radius: 50%; box-sizing: content-box; cursor: pointer;",
    ".sv_progress-buttons__list li:after":
      "width: 73%; height: 3px; content: ''; position: absolute; top: 15px; left: -36.5%;",
    ".sv_progress-buttons__list li:first-child:after": "content: none;",
    ".sv_progress-buttons__list .sv_progress-buttons__page-title":
      "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: bold;",
    ".sv_progress-buttons__list .sv_progress-buttons__page-description":
      "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;",
    ".sv_progress-buttons__list li.sv_progress-buttons__list-element--nonclickable:before":
      "cursor: not-allowed;",

    // ranking
    ".sv-ranking": "outline: none; user-select: none;",
    ".sv-ranking-item":
      "cursor: pointer; position: relative;",
    ".sv-ranking-item:focus .sv-ranking-item__icon--hover":
      "visibility: hidden;",
    ".sv-ranking-item:hover .sv-ranking-item__icon--hover":
      "visibility: visible;",
    ".sv-question--disabled .sv-ranking-item:hover .sv-ranking-item__icon--hover":
      "visibility: hidden;",
    ".sv-ranking-item:focus": "outline: none;",
    ".sv-ranking-item:focus .sv-ranking-item__icon--focus":
      "visibility: visible; top: 15px;",
    ".sv-ranking-item:focus .sv-ranking-item__index":
      "background: white; border: 2px solid #19b394;",
    ".sv-ranking-item__content":
      "display: flex; align-items: center; line-height: 1em; background-color: white;padding: 5px 0px; border-radius: 100px;",
    ".sv-ranking-item__icon-container":
      "left: 0;top: 0;bottom: 0;width: 25px; flex-shrink: 0;",
    ".sv-ranking-item__icon":
      "visibility: hidden;top:20px;fill:#19b394;position: absolute;",
    ".sv-ranking-item__index":
      "display: flex; flex-shrink: 0; align-items: center; justify-content: center; background: rgba(25, 179, 148, 0.1);border-radius: 100%; border:2px solid transparent; margin-right: 16px; width: 40px; height: 40px; line-height: 1em;",
    ".sv-ranking-item__text": "display: inline-block;",
    ".sv-ranking-item__ghost":
      "display: none;background: #f3f3f3;border-radius: 100px;width: 200px;height: 55px;z-index: 1;position: absolute;left: 25px;",
    ".sv-ranking-item--ghost .sv-ranking-item__ghost": "display: block;",
    ".sv-ranking-item--ghost .sv-ranking-item__content": "visibility: hidden;",
    ".sv-ranking-item--drag .sv-ranking-item__content":
      "box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);border-radius: 100px;",
    ".sv-ranking--drag .sv-ranking-item:hover .sv-ranking-item__icon":
      "visibility: hidden;",
    ".sv-ranking-item--drag .sv-ranking-item__icon--hover":
      "visibility: visible;",
    ".sv-ranking--mobile .sv-ranking-item__icon--hover":
      "visibility:visible; fill:#9f9f9f;",
    ".sv-ranking--mobile.sv-ranking--drag .sv-ranking-item--ghost .sv-ranking-item__icon.sv-ranking-item__icon--hover":
      "visibility:hidden;",
    ".sv-ranking--disabled .sv-ranking-item:hover .sv-ranking-item__icon": "visibility: hidden;",
    ".sv-ranking--disabled": "opacity: 0.8;",
    // EO ranking

    // drag drop
    ".sv-dragged-element-shortcut": "height: 24px; min-width: 100px; border-radius: 36px; background-color: white; padding: 16px; cursor: grabbing; position: absolute; z-index: 1000; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1); font-family: 'Open Sans'; font-size: 16px; padding-left: 20px;line-height: 24px;",

    ".sv-matrixdynamic__drag-icon": "padding-top:14px",
    ".sv-matrixdynamic__drag-icon:after":
      "content: ' '; display: block; height: 6px; width: 20px; border: 1px solid #e7e7e7; box-sizing: border-box; border-radius: 10px; cursor: move; margin-top: 12px;",

    ".sv-matrix-row--drag-drop-ghost-mod td": "background-color: #f3f3f3;",
    ".sv-matrix-row--drag-drop-ghost-mod td > *": "visibility: hidden",
    //eo drag-drop

    ".sv_qstn .sv_q_select_column":
      "display: inline-block; vertical-align: top; min-width: 10%;",

    ".sv_qstn .sv_q_select_column > *:not(.sv_technical)": "display: block;",

    ".sv_main .sv_container .sv_body .sv_p_root .sv_qstn .sv_q_select_column textarea":
      "margin-left: 0; padding-left: 0; line-height: initial;",
    ".sv_main .sv-hidden": "display: none !important;",
    ".sv_main .sv-visuallyhidden":
      "position: absolute; height: 1px !important; width: 1px !important; overflow: hidden; clip: rect(1px 1px 1px 1px); clip: rect(1px, 1px, 1px, 1px);",

    // paneldynamic progress
    ".sv_main .sv-progress":
      "height: 0.19em; background-color: $header-background-color; position: relative;",
    ".sv_main .sv-progress__bar":
      "background-color: $main-color; height: 100%; position: relative;",
    // EO paneldynamic progress

    // paneldynamic
    ".sv_main .sv-paneldynamic__progress-container":
      "position: relative; display: inline-block; width: calc(100% - 250px); margin-top: 20px;",
    ".sv_main .sv-paneldynamic__add-btn": "float: right;",
    ".sv_main .sv-paneldynamic__add-btn--list-mode":
      "float: none; margin-top: 0;",
    ".sv_main .sv-paneldynamic__remove-btn": "margin-top: 1.25em;",
    ".sv_main .sv-paneldynamic__remove-btn--right":
      "margin-top: 0; margin-left: 1.25em;",
    ".sv_main .sv-paneldynamic__prev-btn, .sv_main .sv-paneldynamic__next-btn":
      "box-sizing: border-box; display: inline-block; cursor: pointer; width: 0.7em; top: -0.28em; position: absolute;",
    ".sv_main .sv-paneldynamic__prev-btn svg, .sv_main .sv-paneldynamic__next-btn svg":
      "width: 0.7em; height: 0.7em; display: block;",
    ".sv_main .sv-paneldynamic__prev-btn":
      "left: -1.3em; transform: rotate(90deg);",
    ".sv_main .sv-paneldynamic__next-btn ":
      "right: -1.3em; transform: rotate(270deg);",
    ".sv_main .sv-paneldynamic__prev-btn.sv-paneldynamic__prev-btn--disabled, .sv_main .sv-paneldynamic__next-btn.sv-paneldynamic__next-btn--disabled":
      "cursor: auto;",
    ".sv_main .sv-paneldynamic__progress-text":
      "font-weight: bold; font-size: 0.87em; margin-top: 0.69em; margin-left: 4em",
    // EO paneldynamic
    //boolean
    ".sv_main .sv-boolean__switch":
      "display: inline-block; box-sizing: border-box; width: 63px; height: 24px; margin-right: 17px; margin-left: 21px; padding: 2px 3px; vertical-align: middle; border-radius: 12px; cursor: pointer;",
    ".sv_main .sv-boolean__slider":
      "display: inline-block; width: 20px; height: 20px; transition-duration: .4s; transition-property: margin-left; border: none; border-radius: 100%;",
    ".sv_main .sv-boolean__label": "vertical-align: middle; cursor: pointer;",
    ".sv_main .sv-boolean--indeterminate  .sv-boolean__slider":
      "margin-left: calc(50% - 10px);",
    ".sv_main .sv-boolean--checked  .sv-boolean__slider":
      "margin-left: calc(100% - 20px);",
    "[dir='rtl'] .sv-boolean__label ": "float: right;",
    "[dir='rtl'] .sv-boolean--indeterminate .sv-boolean__slider":
      "margin-right: calc(50% - 0.625em);",
    "[dir='rtl'] .sv-boolean--checked .sv-boolean__slider":
      "margin-right: calc(100% - 1.25em);",
    "[dir='rtl'] .sv-boolean__switch": "float: right;",
    "[style*='direction:rtl'] .sv-boolean__label ": "float: right;",
    "[style*='direction:rtl'] .sv-boolean--indeterminate .sv-boolean__slider":
      "margin-right: calc(50% - 0.625em);",
    "[style*='direction:rtl'] .sv-boolean--checked .sv-boolean__slider":
      "margin-right: calc(100% - 1.25em);",
    "[style*='direction:rtl'] .sv-boolean__switch": "float: right;",

    // EO boolean
    ".sv_main .sv_q_num": "",
    ".sv_main .sv_q_num + span": "",

    // SignaturePad
    ".sv_main .sjs_sp_container":
      "position: relative; box-sizing: content-box;",
    ".sv_main .sjs_sp_controls": "position: absolute; left: 0; bottom: 0;",
    ".sv_main .sjs_sp_controls > button": "user-select: none;",
    ".sv_main .sjs_sp_container>div>canvas:focus": "outline: none;",
    ".sv_main .sjs_sp_placeholder":
      "display: flex;  align-items: center; justify-content: center; position: absolute; z-index: 0; user-select: none; pointer-events: none; width: 100%; height: 100%;",

    // logo
    // ".sv_main .sv_header": "white-space: nowrap;",
    ".sv_main .sv_logo": "",
    ".sv_main .sv-logo--left":
      "display: inline-block; vertical-align: top; margin-right: 2em;",
    ".sv_main .sv-logo--right": "display: inline-block; vertical-align: top; margin-left: 2em; ",
    ".sv_main .sv-logo--top":
      "display: block; width: 100%; text-align: center;",
    ".sv_main .sv-logo--bottom":
      "display: block; width: 100%; text-align: center;",
    ".sv_main .sv_header__text": "display: inline-block; vertical-align: top; max-width: 100%; width: 100%",

    ".sv_main .sv-expand-action:before": "content: \"\"; display: inline-block; background-image: url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 21.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 10 10' style='enable-background:new 0 0 10 10;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E .st0%7Bfill:%23404040;%7D%0A%3C/style%3E%3Cpolygon class='st0' points='2,2 0,4 5,9 10,4 8,2 5,5 '/%3E%3C/svg%3E%0A\"); background-repeat: no-repeat; background-position: center center; height: 10px; width: 12px; margin: auto 8px;",

    ".sv_main .sv-expand-action--expanded:before": "transform: rotate(180deg);",

    ".sv_main .sv-action-bar": "display: flex; position: relative; align-items: center; margin-left: auto; padding: 0 0 0 16px; overflow: hidden; white-space: nowrap;",
    ".sv_main .sv-action-bar-separator": "display: inline-block; width: 1px; height: 24px; vertical-align: middle; margin-right: 16px; background-color: #d6d6d6;",
    ".sv_main .sv-action-bar-item": "-webkit-appearance: none; -moz-appearance: none; appearance: none; display: flex; height: 40px; padding: 8px; box-sizing: border-box; margin-right: 16px; border: none; border-radius: 2px; background-color: transparent; cursor: pointer; line-height: 24px; font-size: 16px; overflow-x: hidden; white-space: nowrap; min-width: auto; font-weight: normal",
    ".sv_main .sv-action-bar-item__title": "vertical-align: middle; white-space: nowrap;",
    ".sv_main .sv-action-bar-item__title--with-icon": "margin-left: 8px;",
    ".sv_main .sv-action__content": "display: flex; flex-direction: row; align-items: center;",
    ".sv_main .sv-action__content > *": "flex: 0 0 auto;",
    ".sv_main .sv-action--hidden": "width: 0px; height: 0px; overflow: hidden;",
    ".sv_main .sv-action-bar-item__icon svg": "display: block;",
    ".sv_main .sv-action-bar-item:active": "opacity: 0.5;",
    ".sv_main .sv-action-bar-item:focus": "outline: none;",

    ".sv_main .sv-title-actions": "display: flex;align-items: center; width: 100%;",
    ".sv_main .sv-title-actions__title":
      "flex-wrap: wrap; max-width: 90%; min-width: 50%;",
    ".sv_main .sv-title-actions__bar": "min-width: 56px;",
    ".sv_main .sv_matrix_cell_actions .sv-action-bar":
      "margin-left: 0; padding-left: 0;",
    ".sv_main .sv_p_wrapper_in_row":
      "display: flex; flex-direction: row; align-items: center;",
    ".sv_main  .sv_p_remove_btn_right": "margin-left: 1em;",
    //button-group
    ".sv_main .sv-button-group":
      "display: flex; align-items: center; flex-direction: row; font-size: 16px; height: 48px; overflow: auto;",
    ".sv_main .sv-button-group__item":
      "display: flex; box-sizing: border-box; flex-direction: row; justify-content: center; align-items: center; width: 100%; padding: 11px 16px; line-height: 24px; border-width: 1px; border-style: solid; outline: none; font-size: 16px; font-weight: 400; cursor: pointer; overflow: hidden;",
    ".sv_main .sv-button-group__item:not(:first-of-type)": "margin-left: -1px;",
    ".sv_main .sv-button-group__item-icon": "display: block; height: 24px;",
    ".sv_main .sv-button-group__item--selected": "font-weight: 600;",
    ".sv_main .sv-button-group__item-decorator":
      "display: flex; align-items: center; max-width: 100%;",
    ".sv_main  .sv-button-group__item-icon + .sv-button-group__item-caption":
      "margin-left: 8px",
    ".sv_main .sv-button-group__item-caption": "display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;",
    ".sv_main .sv-button-group__item--disabled": "color: cursor: default;",
    //eo button-group
    //popup
    "sv-popup": "display: block; position: absolute; z-index: -1;",
    ".sv-popup": "position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; outline: none; z-index: 2;",
    ".sv-popup__container": "filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1)); position: absolute; padding: 0;",
    ".sv-popup__body-content": "background-color: var(--background, #fff); border-radius: calc(0.5 * var(--base-unit, 8px)); width: 100%; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; max-height: 90vh; max-width: 90vw;",
    ".sv-popup--modal": "display: flex; align-items: center; justify-content: center;",
    ".sv-popup--modal .sv-popup__container": "position: static;",
    ".sv-popup--modal .sv-popup__body-content": "padding: calc(4 * var(--base-unit, 8px));",
    ".sv-popup--overlay": "width: 100%;",
    ".sv-popup--overlay .sv-popup__container": "background: rgba(144, 144, 144, 0.5); max-width: 100vw; max-height: calc(100vh - 1 * var(--base-unit, 8px)); height: calc(100vh - 1 * var(--base-unit, 8px)); width: 100%; padding-top: calc(2 * var(--base-unit, 8px)); border: unset;",
    ".sv-popup__shadow": "width: 100%; height: 100%;",
    ".sv-popup--overlay .sv-popup__body-content": "border-radius: calc(2 * var(--base-unit, 8px)) calc(2 * var(--base-unit, 8px)) 0px 0px; background: var(--background, #fff); box-shadow: 0px calc(1 * var(--base-unit, 8px)) calc(2 * var(--base-unit, 8px)) rgba(0, 0, 0, 0.1); padding: calc(3 * var(--base-unit, 8px)) calc(2 * var(--base-unit, 8px)) calc(2 * var(--base-unit, 8px)); height: calc(100% - calc(1 * var(--base-unit, 8px))); max-height: 100vh; max-width: 100vw;",
    ".sv-popup--overlay .sv-popup__scrolling-content": "height: calc(100% - (10 * var(--base-unit, 8px)));",
    ".sv-popup--overlay .sv-popup__body-footer": "margin-top: calc(2 * var(--base-unit, 8px));",
    ".sv-popup--overlay .sv-popup__body-footer-item": "width: 100%;",
    ".sv-popup--overlay .sv-popup__button--cancel": "background-color: var(--primary, #19b394); border: 2px solid var(--primary, #19b394); color: var(--primary-foreground, #fff);",
    ".sv-popup__scrolling-content": "height: 100%; overflow: auto;",
    ".sv-popup__scrolling-content::-webkit-scrollbar": "height: 6px; width: 6px; background-color: var(--background-dim, #f3f3f3);",
    ".sv-popup__scrolling-content::-webkit-scrollbar-thumb": "background: var(--primary-light, rgba(25, 179, 148, 0.1));",
    ".sv-popup__content": "min-width: 100%;",
    ".sv-popup--show-pointer.sv-popup--top .sv-popup__pointer": "transform: translate(calc(-1 * var(--base-unit, 8px))) rotate(180deg);",
    ".sv-popup--show-pointer.sv-popup--bottom .sv-popup__pointer": "transform: translate(calc(-1 * var(--base-unit, 8px)), calc(-1 * var(--base-unit, 8px)));",
    ".sv-popup--show-pointer.sv-popup--right": "transform: translate(calc(1 * var(--base-unit, 8px)));",
    ".sv-popup--show-pointer.sv-popup--right .sv-popup__pointer": "transform: translate(-12px, -4px) rotate(-90deg);",
    ".sv-popup--show-pointer.sv-popup--left": "transform: translate(calc(-1 * var(--base-unit, 8px)));",
    ".sv-popup--show-pointer.sv-popup--left .sv-popup__pointer": "transform: translate(-4px, -4px) rotate(90deg);",
    ".sv-popup__pointer": "display: block; position: absolute;",
    ".sv-popup__pointer:after": "content: ' '; display: block; width: 0; height: 0; border-left: calc(1 * var(--base-unit, 8px)) solid transparent; border-right: calc(1 * var(--base-unit, 8px)) solid transparent; border-bottom: calc(1 * var(--base-unit, 8px)) solid var(--background, #fff); align-self: center;",
    ".sv-popup__body-header": "font-family: Open Sans; font-size: calc(3 * var(--base-unit, 8px)); line-height: calc(4 * var(--base-unit, 8px)); font-style: normal; font-weight: 700; margin-bottom: calc(2 * var(--base-unit, 8px)); color: var(--foreground, #161616);",
    ".sv-popup__body-footer": "display: flex; margin-top: calc(4 * var(--base-unit, 8px));",
    ".sv-popup__body-footer-item:first-child": "margin-left: auto;",
    ".sv-popup__body-footer-item + .sv-popup__body-footer-item": "margin-left: calc(1 * var(--base-unit, 8px));",
    ".sv-popup__button": "padding: calc(2 * var(--base-unit, 8px)) calc(6 * var(--base-unit, 8px)); background: var(--background, #fff); box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15); border-radius: 4px; margin: 2px; cursor: pointer; font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-style: normal; font-weight: 600; font-size: calc(2 * var(--base-unit, 8px)); line-height: calc(3 * var(--base-unit, 8px)); text-align: center; color: var(--primary, #19b394); border: none; outline: none;",
    ".sv-popup__button:hover": "box-shadow: 0 0 0 2px var(--primary, #19b394);",
    ".sv-popup__button:disabled": "color: var(--foreground-disabled, rgba(#161616, 0.16)); cursor: default;",
    ".sv-popup__button:disabled:hover":
      "box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15);",
    ".sv-popup__button.sv-popup__button--apply": "background-color: var(--primary, #19b394); color: var(--primary-foreground, #fff);",
    ".sv-popup__button.sv-popup__button--apply:disabled": "background-color: var(--background-dim, #f3f3f3);",
    //eo popup
    //list
    ".sv-list":
      "padding: 0; margin: 0; background: var(--background, #fff); font-family: 'Open Sans'; list-style-type: none;",
    ".sv-list__item":
      "width: 100%; box-sizing: border-box; padding: calc(1 * 8px) calc(2 * 8px); cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;",
    ".sv-list__item-icon":
      "float: left; width: calc(3 * 8px); height: calc(3 * 8px); margin-right: calc(2 * 8px);",
    ".sv-list__item-icon svg": "display: block;",
    ".sv-list__item-icon use": "fill: #909090;",
    ".sv-list__item:not(.sv-list__item--selected):hover":
      "background-color: var(--background-dim, #f3f3f3);",
    ".sv-list__item--selected": "background-color: var(--primary, #19b394); color: var(--primary-foreground, #fff);",
    ".sv-list__item--selected .sv-list__item-icon use": "fill: var(--primary-foreground, #fff);",
    ".sv-list__item--disabled": "color: var(--foreground-disabled, rgba(#161616, 0.16)); cursor: default; pointer-events: none;",
    ".sv-list__item span": "white-space: nowrap;",
    ".sv-list__container": "position: relative;",
    ".sv-list__filter": "position: sticky; top: 0; border-bottom: 1px solid rgba(0, 0, 0, 0.16); background: var(--background, #fff);",
    ".sv-list__input": "-webkit-appearance: none; -moz-appearance: none; appearance: none; display: block; box-sizing: border-box; width: 100%; line-height: 24px; padding-left: 56px; padding-right: 24px; padding-top: 16px; padding-bottom: 16px; outline: none; font-size: 1em; border: 1px solid transparent;",
    ".sv-list__filter-icon": "display: block; position: absolute; top: 16px; left: 16px;",
    ".sv-list__filter-icon .sv-svg-icon": "width: 24px; height: 24px;",
    //eo list
    ".sv-skeleton-element": "min-height: 50px;",
  };

  public static Media: { [key: string]: { media: string, style: string } } = {
    ".sv_qstn fieldset .sv-q-col-1": {
      style: "width: 100%;",
      media: "@media only screen and (max-width: 480px)",
    },
    ".sv_qstn fieldset .sv-q-col-2": {
      style: "width: 100%;",
      media: "@media only screen and (max-width: 480px)",
    },
    ".sv_qstn fieldset .sv-q-col-3": {
      style: "width: 100%;",
      media: "@media only screen and (max-width: 480px)",
    },
    ".sv_qstn fieldset .sv-q-col-4": {
      style: "width: 100%;",
      media: "@media only screen and (max-width: 480px)",
    },
    ".sv_qstn fieldset .sv-q-col-5": {
      style: "width: 100%;",
      media: "@media only screen and (max-width: 480px)",
    },

    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn": {
      style: "display: block; width: 100% !important;",
      media: "@media (max-width: 600px)",
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .title-left": {
      style: "float: none;",
      media: "@media (max-width: 600px)",
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .sv_q_radiogroup_inline, .sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .sv_q_checkbox_inline, .sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .sv_q_imagepicker_inline": {
      style: "display: block;",
      media: "@media (max-width: 600px)",
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table": {
      style: "display: block;",
      media: "@media (max-width: 600px)",
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table thead": {
      style: "display: none;",
      media: "@media (max-width: 600px)",
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table tbody, .sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table tr, .sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table td": {
      style: "display: block;",
      media: "@media (max-width: 600px)",
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table:not(.sv_q_matrix) td:before": {
      style: "content: attr(data-responsive-title);",
      media: "@media (max-width: 600px)",
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.sv_q_matrix td:after": {
      style: "content: attr(data-responsive-title); padding-left: 1em",
      media: "@media (max-width: 600px)",
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .radio label, .sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .checkbox label": {
      style: "line-height: 12px; vertical-align: top;",
      media: "@media (max-width: 600px)",
    },
    ".sv_qstn label.sv_q_m_label": {
      style: "display: inline;",
      media: "@media (max-width: 600px)",
    },
    ".sv_main .sv_custom_header": {
      style: "display: none;",
      media: "@media (max-width: 1300px)",
    },
    ".sv_main .sv_container .sv_header h3": {
      style: "font-size: 1.5em;",
      media: "@media (max-width: 1300px)",
    },
    ".sv_main .sv_container .sv_header h3 span": {
      style: "font-size: 0.75em;",
      media: "@media (max-width: 700px)",
    },

    ".sv_main.sv_bootstrap_css .sv-progress__text": {
      style: "margin-left: 8em;",
      media: "@media (min-width: 768px)",
    },

    ".sv_row": {
      style: " display: flex; flex-wrap: wrap;",
      media: "@supports (display: flex)",
    },

    ".sv-row > .sv-row__panel, .sv-row__question:not(:last-child)": {
      style: "float: left;",
      media:
        "@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)",
    },

    "[dir='rtl'],[style*='direction:rtl'] .sv-row__question:not(:last-child)": {
      style: "float: right;",
      media:
        "@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)",
    },

    ".sv-row > .sv-row__panel, .sv-row__question": {
      style: "width: 100% !important; padding-right: 0 !important;",
      media: "@media only screen and (max-width: 600px)",
    },
  };

  public static ThemeColors: { [key: string]: { [key: string]: string } } = {
    default: {
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
    },
    orange: {
      "$header-background-color": "#4a4a4a",
      "$body-container-background-color": "#f8f8f8",

      "$main-color": "#f78119",
      "$main-hover-color": "#e77109",
      "$body-background-color": "white",
      "$inputs-background-color": "white",
      "$text-color": "#4a4a4a",
      "$text-input-color": "#4a4a4a",
      "$header-color": "#f78119",
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

      "$progress-buttons-color": "#f7b781",
      "$progress-buttons-line-color": "#d4d4d4"
    },
    darkblue: {
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
    },
    darkrose: {
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
    },
    stone: {
      "$header-background-color": "#cdccd2",
      "$body-container-background-color": "#efedf4",

      "$main-color": "#0f0f33",
      "$main-hover-color": "#191955",
      "$body-background-color": "white",
      "$inputs-background-color": "white",
      "$text-color": "#0f0f33",
      "$text-input-color": "#0f0f33",
      "$header-color": "#0f0f33",
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

      "$progress-buttons-color": "#747491",
      "$progress-buttons-line-color": "#d4d4d4"
    },
    winter: {
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
    },
    winterstone: {
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
    },
    modern: {
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
    },
    bootstrap: {
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
      "$foreground-light": "#909090",
      "$foreground-disabled": "#161616",
      "$background-dim": "#f3f3f3",

      "$progress-buttons-color": "#8dd6c7",
      "$progress-buttons-line-color": "#d4d4d4",
    },
    bootstrapmaterial: {
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
    }
  };

  public static ThemeCss: { [key: string]: string } = {
    ".sv_default_css": "background-color: $body-container-background-color;",

    ".sv_default_css hr": "border-color: $border-color;",

    ".sv_default_css input[type='button'], .sv_default_css button":
      "color: $body-background-color; background-color: $main-color;",
    ".sv_default_css input[type='button']:hover, .sv_default_css button:hover":
      "background-color: $main-hover-color;",

    ".sv_default_css .sv_header": "color: $header-color;",
    ".sv_default_css .sv_custom_header":
      "background-color: $header-background-color;",
    ".sv_default_css .sv_container": "color: $text-color;",
    ".sv_default_css .sv_body":
      "background-color: $body-background-color; border-color: $main-color;",
    ".sv_default_css .sv_progress": "background-color: $border-color;",
    ".sv_default_css .sv_progress_bar": "background-color: $main-color;",

    ".sv_default_css .sv_progress-buttons__list li:before":
      "border-color: $progress-buttons-color; background-color: $progress-buttons-color;",
    ".sv_default_css .sv_progress-buttons__list li:after": "background-color: $progress-buttons-line-color;",
    ".sv_default_css .sv_progress-buttons__list .sv_progress-buttons__page-title": "color: $text-color;",
    ".sv_default_css .sv_progress-buttons__list .sv_progress-buttons__page-description": "color: $text-color;",
    ".sv_default_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed:before":
      "border-color: $main-color; background-color: $main-color;",
    ".sv_default_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed + li:after":
      "background-color: $progress-buttons-color",
    ".sv_default_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--current:before":
      "border-color: $main-color; background-color: white;",
    ".sv_default_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed.sv_progress-buttons__list-element--current:before":
      "border-color: $main-color; background-color: white;",

    ".sv_default_css .sv_p_root > .sv_row": "border-color: $border-color;",
    ".sv_default_css .sv_p_root > .sv_row:nth-child(odd)":
      "background-color: $body-background-color;",
    ".sv_default_css .sv_p_root > .sv_row:nth-child(even)":
      "background-color: $body-container-background-color;",

    ".sv_default_css .sv_q_other input":
      "color: $text-color; -webkit-text-fill-color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_q_text_root":
      "color: $text-color; -webkit-text-fill-color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_q_dropdown_control":
      "color: $text-input-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css input[type='text']":
      "color: $text-color; -webkit-text-fill-color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css select":
      "color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css textarea":
      "color: $text-input-color; -webkit-text-fill-color: $text-input-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css input:not([type='button']):not([type='reset']):not([type='submit']):not([type='image']):not([type='checkbox']):not([type='radio'])":
      "border: 1px solid $border-color; background-color: $inputs-background-color;color: $text-input-color; -webkit-text-fill-color: $text-input-color;",
    ".sv_default_css input:not([type='button']):not([type='reset']):not([type='submit']):not([type='image']):not([type='checkbox']):not([type='radio']):focus":
      "border: 1px solid $main-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_select_wrapper .sv_q_dropdown_control ":
      "background-color: $inputs-background-color;",
    ".sv_default_css .sv_q_other input:focus": "border-color: $main-color;",
    ".sv_default_css .sv_q_text_root:focus": "border-color: $main-color;",
    ".sv_default_css .sv_q_dropdown_control:focus":
      "border-color: $main-color;",
    ".sv_default_css input[type='text']:focus": "border-color: $main-color;",
    '.sv_default_css .sv_container .sv_body .sv_p_root .sv_q input[type="radio"]:focus, .sv_default_css .sv_container .sv_body .sv_p_root .sv_q input[type="checkbox"]:focus':
      "outline: 1px dotted $main-color;",
    ".sv_default_css select:focus": "border-color: $main-color;",
    ".sv_default_css textarea:focus": "border-color: $main-color;",

    ".sv_default_css .sv_select_wrapper":
      "background-color: $body-background-color;",
    ".sv_default_css .sv_select_wrapper::before":
      "background-color: $main-color;",

    ".sv_default_css .sv_q_rating_item.active .sv_q_rating_item_text":
      "background-color: $main-hover-color; border-color: $main-hover-color; color: $body-background-color;",
    ".sv_default_css .sv_q_rating_item .sv_q_rating_item_text":
      "border-color: $border-color;",
    ".sv_default_css .sv_q_rating_item .sv_q_rating_item_text:hover":
      "border-color: $main-hover-color;",

    ".sv_default_css table.sv_q_matrix tr": "border-color: $border-color;",
    ".sv_default_css table.sv_q_matrix_dropdown tr":
      "border-color: $border-color;",
    ".sv_default_css table.sv_q_matrix_dynamic tr":
      "border-color: $border-color;",

    ".sv_default_css .sv_q_m_cell_selected":
      "color: $body-background-color; background-color: $main-hover-color;",

    ".sv_main .sv_q_file_remove:hover": "color: $main-color;",
    ".sv_main .sv_q_file_choose_button":
      "color: $body-background-color; background-color: $main-color;",
    ".sv_main .sv_q_file_choose_button:hover":
      "background-color: $main-hover-color;",

    ".sv_main .sv_q_imgsel.checked label>div": "background-color: $main-color",

    ".sv_default_css .sv_p_description": "padding-left: 1.29em;",
    //progress bar
    ".sv_main .sv-progress": "background-color: $header-background-color;",
    ".sv_main .sv-progress__bar": "background-color: $main-color;",

    //paneldynamic
    ".sv_main .sv-paneldynamic__prev-btn.sv-paneldynamic__prev-btn--disabled, .sv_main .sv-paneldynamic__next-btn.sv-paneldynamic__next-btn--disabled":
      "fill: $disable-color;",
    ".sv_main .sv-paneldynamic__progress-text": "color: $progress-text-color;",
    ".sv_main .sv-paneldynamic__prev-btn, .sv_main .sv-paneldynamic__next-btn":
      "fill: $text-color",

    //boolean
    ".sv_main .sv-boolean__switch": "background-color: $main-color;",
    ".sv_main .sv-boolean__slider": "background-color: $slider-color;",
    ".sv_main .sv-boolean__label--disabled": "color: $disabled-label-color;",
    ".sv_main .sv-boolean--disabled .sv-boolean__switch":
      "background-color: $disabled-switch-color;",
    ".sv_main .sv-boolean--disabled .sv-boolean__slider":
      "background-color: $disabled-slider-color;",
    //eo boolean

    //signature pad
    ".sv_main .sjs_sp_container": "border: 1px dashed $disable-color;",
    ".sv_main .sjs_sp_placeholder": "color: $foreground-light;",

    ".sv_main .sv_matrix_detail_row":
      "background-color: #ededed; border-top: 1px solid $header-background-color; border-bottom: 1px solid $header-background-color;",

    //action-bar
    ".sv_main .sv-action-bar-item": "color: $text-color;",
    ".sv_main .sv-action-bar-item__icon use": "fill: $foreground-light;",
    ".sv_main .sv-action-bar-item:hover": "background-color: $background-dim;",
    //eo action-bar

    //button-group
    ".sv_main .sv-button-group__item--hover:hover":
      "background-color: $background-dim;",
    ".sv_main .sv-button-group__item-icon use": "fill: $foreground-light;",
    ".sv_main .sv-button-group__item--selected": "color: $main-color;",
    ".sv_main .sv-button-group__item--selected .sv-button-group__item-icon use":
      "fill: $main-color;",
    ".sv_main .sv-button-group__item--disabled": "color: $foreground-disabled;",
    ".sv_main .sv-button-group__item--disabled .sv-button-group__item-icon use":
      "fill: $foreground-disabled;",
    ".sv_main .sv-button-group__item":
      "background: $body-background-color; border-color: $border-color;",

    //eo button-group

    ".sv_main .sv_qstn textarea": "max-width: 100%",

    //list
    ".sv-list__input": "color: $text-input-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv-list__input::placeholder": "color: $foreground-light;",
    ".sv-list__input:focus": "border-color: $main-color;",
    ".sv-list__input:disabled": "color: $foreground-disabled;",
    ".sv-list__input:disabled::placeholder": "color: $foreground-disabled;",
    //eo list
    ".sv-skeleton-element": "background-color: $background-dim;",
  };

  public static modernThemeCss: { [key: string]: string } = {
    // ".sv-paneldynamic__add-btn": "background-color: $add-button-color;",
    // ".sv-paneldynamic__remove-btn": "background-color: $remove-button-color;",
    ".sv-boolean__switch": "background-color: $main-color;",
    ".sv-boolean__slider": "background-color: $slider-color;",
    ".sv-boolean__label--disabled": "color: $disabled-label-color;",
    ".sv-boolean--disabled .sv-boolean__switch":
      "background-color: $disabled-switch-color;",
    ".sv-boolean--disabled .sv-boolean__slider":
      "background-color: $disabled-slider-color;",

    ".sv-btn": "color: $button-text-color;",
    ".sv-btn--navigation": "background-color: $main-color",
    ".sv-checkbox__svg": "border-color: $border-color; fill: transparent;",
    ".sv-checkbox--allowhover:hover .sv-checkbox__svg":
      "background-color: $main-hover-color; fill: $checkmark-color;",
    ".sv-checkbox--checked .sv-checkbox__svg":
      "background-color: $main-color; fill: $checkmark-color;",
    ".sv-checkbox--checked.sv-checkbox--disabled .sv-checkbox__svg":
      "background-color: $disable-color; fill: $checkmark-color;",
    ".sv-checkbox--disabled .sv-checkbox__svg": "border-color: $disable-color;",
    ".sv-comment": "border-color: $text-border-color; max-width: 100%;",
    ".sv-comment:focus": "border-color: $main-color;",
    ".sv-completedpage":
      "color: $text-color; background-color: $body-container-background-color;",
    ".sv-container-modern": "color: $text-color;",
    ".sv-container-modern__title": "color: $main-color;",
    ".sv-description": "color: $disabled-text-color;",
    ".sv-dropdown": "border-bottom: 0.06em solid $text-border-color;",
    ".sv-dropdown:focus": "border-color: $dropdown-border-color;",
    ".sv-dropdown--error": "border-color: $error-color; color: $error-color;",
    ".sv-dropdown--error::placeholder": "color: $error-color;",
    ".sv-dropdown--error::-ms-input-placeholder": "color: $error-color;",
    ".sv-file__decorator":
      "background-color: $body-container-background-color;",
    ".sv-file__clean-btn": "background-color: $remove-button-color;",
    ".sv-file__choose-btn:not(.sv-file__choose-btn--disabled)":
      "background-color: $add-button-color;",
    ".sv-file__choose-btn--disabled": "background-color: $disable-color;",
    ".sv-file__remove-svg": "fill: #ff1800;",
    ".sv-file__sign a": "color: $text-color;",
    ".sv-imagepicker__item--allowhover:hover .sv-imagepicker__image":
      "background-color: $main-hover-color; border-color: $main-hover-color;",
    ".sv-imagepicker__item--checked .sv-imagepicker__image":
      "background-color: $main-color; border-color: $main-color;",
    ".sv-imagepicker__item--disabled.sv-imagepicker__item--checked .sv-imagepicker__image":
      "background-color: $disable-color; border-color: $disable-color;",
    ".sv-item__control:focus + .sv-item__decorator":
      "border-color: $main-color;",
    ".sv-matrix__text--checked":
      "color: $matrix-text-checked-color; background-color: $main-color;",
    ".sv-matrix__text--disabled.sv-matrix__text--checked":
      "background-color: $disable-color;",
    ".sv-matrixdynamic__add-btn": "background-color: $add-button-color;",
    ".sv-matrixdynamic__remove-btn": "background-color: $remove-button-color;",
    ".sv-paneldynamic__add-btn": "background-color: $add-button-color;",
    ".sv-paneldynamic__remove-btn": "background-color: $remove-button-color;",
    ".sv-paneldynamic__prev-btn": "fill: $text-color;",
    ".sv-paneldynamic__next-btn": "fill: $text-color;",
    ".sv-paneldynamic__prev-btn.sv-paneldynamic__prev-btn--disabled": "fill: $disable-color;",
    ".sv-paneldynamic__next-btn.sv-paneldynamic__next-btn--disabled": "fill: $disable-color;",
    ".sv-paneldynamic__progress-text": "color: $progress-text-color;",
    ".sv-progress": "background-color: $header-background-color;",
    ".sv-progress__bar": "background-color: $main-color;",
    ".sv-progress__text": "color: $progress-text-color;",
    ".sv_progress-buttons__list li:before":
      "border-color: $progress-buttons-color; background-color: $progress-buttons-color;",
    ".sv_progress-buttons__list li:after": "background-color: $progress-buttons-line-color;",
    ".sv_progress-buttons__list .sv_progress-buttons__page-title": "color: $text-color;",
    ".sv_progress-buttons__list .sv_progress-buttons__page-description": "color: $text-color;",
    ".sv_progress-buttons__list li.sv_progress-buttons__list-element--passed:before":
      "border-color: $main-color; background-color: $main-color;",
    ".sv_progress-buttons__list li.sv_progress-buttons__list-element--passed + li:after":
      "background-color: $progress-buttons-color",
    ".sv_progress-buttons__list li.sv_progress-buttons__list-element--current:before":
      "border-color: $main-color; background-color: white;",
    ".sv_progress-buttons__list li.sv_progress-buttons__list-element--passed.sv_progress-buttons__list-element--current:before":
      "border-color: $main-color; background-color: white;",
    ".sv-question__erbox": "color: $error-color;",
    ".sv-question__title--answer":
      "background-color: $answer-background-color;",
    ".sv-question__title--error": "background-color: $error-background-color;",
    ".sv-panel__title--error": "background-color: $error-background-color;",
    ".sv-radio__svg": "border-color: $border-color; fill: transparent;",
    ".sv-radio--allowhover:hover .sv-radio__svg": "fill: $border-color;",
    ".sv-radio--checked .sv-radio__svg":
      "border-color: $radio-checked-color; fill: $radio-checked-color;",
    ".sv-radio--disabled .sv-radio__svg": "border-color: $disable-color;",
    ".sv-radio--disabled.sv-radio--checked .sv-radio__svg":
      "fill: $disable-color;",
    ".sv-rating": "color: $text-color;",
    ".sv-rating input:focus + .sv-rating__min-text + .sv-rating__item-text, .sv-rating input:focus + .sv-rating__item-text":
      "outline-color: $main-color;",
    ".sv-rating__item-text":
      "color: $main-hover-color; border: solid 0.1875em $main-hover-color;",
    ".sv-rating__item-text:hover":
      "background-color: $main-hover-color; color: $body-background-color;",
    ".sv-rating__item--selected .sv-rating__item-text":
      "background-color: $main-color; color: $body-background-color; border-color: $main-color;",
    ".sv-rating--disabled .sv-rating__item-text":
      "color: $disable-color; border-color: $disable-color;",
    ".sv-rating--disabled .sv-rating__item-text:hover":
      "background-color: transparent;",
    ".sv-rating--disabled .sv-rating__item-text:hover .sv-rating__item--selected .sv-rating__item-text":
      "background-color: $disable-color; color: $body-background-color;",
    "::-webkit-scrollbar": "background-color: $main-hover-color;",
    "::-webkit-scrollbar-thumb": "background: $main-color;",
    ".sv-selectbase__clear-btn": "background-color: $clean-button-color;",
    ".sv-table": "background-color: rgba($main-hover-color, 0.1);",
    ".sv-text:focus": "border-color: $main-color;",
    '.sv-text[type="date"]::-webkit-calendar-picker-indicator':
      "color: transparent; background: transparent;",
    ".sv-text--error": "color: $error-color; border-color: $error-color;",
    ".sv-text--error::placeholder": "color: $error-color;",
    ".sv-text--error::-ms-placeholder": "color: $error-color;",
    ".sv-text--error:-ms-placeholder": "color: $error-color;",
    "input.sv-text, textarea.sv-comment, select.sv-dropdown":
      "color: $text-input-color; background-color: $inputs-background-color;",
    ".sv-text::placeholder": "color: $text-input-color;",
    ".sv-text::-ms-placeholder": "color: $text-input-color;",
    ".sv-text:-ms-placeholder": "color: $text-input-color;",
    ".sv-table__row--detail": "background-color: $header-background-color;",
    //signature pad
    ".sjs_sp_container": "border: 1px dashed $disable-color;",
    ".sjs_sp_placeholder": "color: $foreground-light;",

    //drag-drop
    ".sv-matrixdynamic__drag-icon": "padding-top:16px",
    ".sv-matrixdynamic__drag-icon:after":
      "content: ' '; display: block; height: 6px; width: 20px; border: 1px solid $border-color; box-sizing: border-box; border-radius: 10px; cursor: move; margin-top: 12px;",
    ".sv-matrix__drag-drop-ghost-position-top, .sv-matrix__drag-drop-ghost-position-bottom":
      "position: relative;",
    ".sv-matrix__drag-drop-ghost-position-top::after, .sv-matrix__drag-drop-ghost-position-bottom::after":
      "content: ''; width: 100%; height: 4px; background-color: var(--primary, #19b394); position: absolute; left: 0;",
    ".sv-matrix__drag-drop-ghost-position-top::after": "top: 0;",
    ".sv-matrix__drag-drop-ghost-position-bottom::after": "bottom: 0;",
    //eo drag-drop
    ".sv-skeleton-element": "background-color: $background-dim;",
  };

  public static bootstrapThemeCss: { [key: string]: string } = {
    ".sv_main .sv_q_imgsel.checked label>div": "background-color: $main-color",
    ".sv_main .sv_p_description": "padding-left: 1.66em;",
    ".sv_main .sv_qstn_error_bottom": "margin-top: 20px; margin-bottom: 0;",
    ".sv_main .progress": "width: 60%;",
    ".sv_main .progress-bar":
      "width: auto; margin-left: 2px; margin-right: 2px;",
    ".sv_main .table>tbody>tr>td": "min-width: 90px;",
    ".sv_main f-panel .sv_qstn": "padding: 0; vertical-align: middle;",

    ".sv_main .sv_q_image": "display: inline-block;",
    ".sv_main .sv_row .sv_qstn:first-child:last-child":
      "flex: none !important;",
    ".sv_main .sv_row .sv_p_container:first-child:last-child":
      "flex: none !important;",

    //progress bar
    ".sv_main .sv-progress": "background-color: $header-background-color;",
    ".sv_main .sv-progress__bar": "background-color: $main-color;",

    //progress buttons
    ".sv_main .sv_progress-buttons__list li:before":
      "border-color: $progress-buttons-color; background-color: $progress-buttons-color;",
    ".sv_main .sv_progress-buttons__list li:after": "background-color: $progress-buttons-line-color;",
    ".sv_main .sv_progress-buttons__list .sv_progress-buttons__page-title": "color: $text-color;",
    ".sv_main .sv_progress-buttons__list .sv_progress-buttons__page-description": "color: $text-color;",
    ".sv_main .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed:before":
      "border-color: $main-color; background-color: $main-color;",
    ".sv_main .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed + li:after":
      "background-color: $progress-buttons-color",
    ".sv_main .sv_progress-buttons__list li.sv_progress-buttons__list-element--current:before":
      "border-color: $main-color; background-color: white;",
    ".sv_main .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed.sv_progress-buttons__list-element--current:before":
      "border-color: $main-color; background-color: white;",

    //paneldynamic
    ".sv_main .sv-paneldynamic__prev-btn.sv-paneldynamic__prev-btn--disabled, .sv_main .sv-paneldynamic__next-btn.sv-paneldynamic__next-btn--disabled":
      "fill: $disable-color;",
    ".sv_main .sv-paneldynamic__progress-text": "color: $progress-text-color;",
    ".sv_main .sv-paneldynamic__prev-btn, .sv_main .sv-paneldynamic__next-btn":
      "fill: $text-color",

    //boolean
    ".sv_main .sv-boolean__switch": "background-color: $main-color;",
    ".sv_main .sv-boolean__slider": "background-color: $slider-color;",
    ".sv_main .sv-boolean__label--disabled": "color: $disabled-label-color;",
    ".sv_main .sv-boolean--disabled .sv-boolean__switch":
      "background-color: $disabled-switch-color;",
    ".sv_main .sv-boolean--disabled  .sv-boolean__slider":
      "background-color: $disabled-slider-color;",
    //eo boolean

    //signature pad
    ".sv_main .sjs_sp_container": "border: 1px dashed $disable-color;",
    ".sv_main .sjs_sp_placeholder": "color: $foreground-light;",

    ".sv_main .sv_matrix_detail_row":
      "background-color: #ededed; border-top: 1px solid $header-background-color; border-bottom: 1px solid $header-background-color;",

    ".sv_main .sv-action-bar-item": "color: $text-color;",
    ".sv_main .sv-action-bar-item__icon use": "fill: $foreground-light;",
    ".sv_main .sv-action-bar-item:hover": "background-color: $background-dim;",

    ".sv-skeleton-element": "background-color: $background-dim;",
  };

  public static bootstrapmaterialThemeCss: { [key: string]: string } = {
    ".sv_main.sv_bootstrapmaterial_css .form-group.is-focused .form-control":
      "linear-gradient(0deg, $main-color 2px, $main-color 0),linear-gradient(0deg, #D2D2D2 1px, transparent 0);",
    ".sv_main.sv_bootstrapmaterial_css .sv_qstn": "margin-bottom: 1rem;",
    ".sv_main.sv_bootstrapmaterial_css .sv_qstn label.sv_q_m_label":
      "height: 100%;",

    ".sv_main.sv_bootstrapmaterial_css .sv_q_image": "display: inline-block;",
    ".sv_main .sv_row .sv_qstn:first-child:last-child":
      "flex: none !important;",
    ".sv_main .sv_row .sv_p_container:first-child:last-child":
      "flex: none !important;",

    ".sv_main.sv_bootstrapmaterial_css .checkbox input[type=checkbox]:checked + .checkbox-material .check":
      "border-color: $main-color;",
    ".sv_main.sv_bootstrapmaterial_css label.checkbox-inline input[type=checkbox]:checked + .checkbox-material .check":
      "border-color: $main-color;",
    ".sv_main.sv_bootstrapmaterial_css .checkbox input[type=checkbox]:checked + .checkbox-material .check:before":
      "color: $main-color;",
    ".sv_main.sv_bootstrapmaterial_css label.checkbox-inline input[type=checkbox]:checked + .checkbox-material .check:before":
      "color: $main-color;",

    ".sv_main.sv_bootstrapmaterial_css .radio input[type=radio]:checked ~ .circle":
      "border-color: $main-color;",
    ".sv_main.sv_bootstrapmaterial_css label.radio-inline input[type=radio]:checked ~ .circle":
      "border-color: $main-color;",
    ".sv_main.sv_bootstrapmaterial_css .radio input[type=radio]:checked ~ .check":
      "background-color: $main-color;",
    ".sv_main.sv_bootstrapmaterial_css label.radio-inline input[type=radio]:checked ~ .check":
      "background-color: $main-color;",
    ".sv_main.sv_bootstrapmaterial_css .btn-default.active":
      "background-color: $main-color; color: $body-background-color;",
    ".sv_main.sv_bootstrapmaterial_css .btn-default:active":
      "background-color: $main-color; color: $body-background-color;",
    ".sv_main.sv_bootstrapmaterial_css .btn-secondary.active":
      "background-color: $main-color; color: $body-background-color;",
    ".sv_main.sv_bootstrapmaterial_css .btn-secondary:active":
      "background-color: $main-color; color: $body-background-color;",
    ".sv_main.sv_bootstrapmaterial_css .open>.dropdown-toggle.btn-default":
      "background-color: $main-color; color: $body-background-color;",
    ".sv_main.sv_bootstrapmaterial_css input[type='button'].btn-primary, .sv_main.sv_bootstrapmaterial_css button.btn-primary":
      "color: $body-background-color; background-color: $main-color;",
    ".sv_main.sv_bootstrapmaterial_css input[type='button'].btn-primary:hover, .sv_main.sv_bootstrapmaterial_css button.btn-primary:hover":
      "background-color: $main-hover-color;",
    ".sv_main .sv_q_imgsel.checked label>div": "background-color: $main-color;",

    ".sv_main.sv_bootstrapmaterial_css .sv_q_file_remove:hover":
      "color: $main-color;",

    ".sv_main.sv_bootstrapmaterial_css .form-group input[type=file]":
      "position: relative; opacity: 1;",
    ".sv_main.sv_bootstrapmaterial_css .progress": "width: 60%; height: 1.5em;",
    ".sv_main.sv_bootstrapmaterial_css .progress-bar":
      "width: auto; margin-left: 2px; margin-right: 2px;",

    //progress bar
    ".sv_main .sv-progress": "background-color: $header-background-color;",
    ".sv_main .sv-progress__bar": "background-color: $main-color;",

    //progress buttons
    ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li:before":
      "border-color: $progress-buttons-color; background-color: $progress-buttons-color;",
    ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li:after": "background-color: $progress-buttons-line-color;",
    ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list .sv_progress-buttons__page-title": "color: $text-color;",
    ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list .sv_progress-buttons__page-description": "color: $text-color;",
    ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed:before":
      "border-color: $main-color; background-color: $main-color;",
    ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed + li:after":
      "background-color: $progress-buttons-color",
    ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--current:before":
      "border-color: $main-color; background-color: white;",
    ".sv_main.sv_bootstrapmaterial_css .sv_progress-buttons__list li.sv_progress-buttons__list-element--passed.sv_progress-buttons__list-element--current:before":
      "border-color: $main-color; background-color: white;",

    //paneldynamic
    ".sv_main .sv-paneldynamic__prev-btn.sv-paneldynamic__prev-btn--disabled, .sv_main .sv-paneldynamic__next-btn.sv-paneldynamic__next-btn--disabled":
      "fill: $disable-color;",
    ".sv_main .sv-paneldynamic__progress-text": "color: $progress-text-color;",
    ".sv_main .sv-paneldynamic__prev-btn, .sv_main .sv-paneldynamic__next-btn":
      "fill: $text-color",

    //boolean
    ".sv_main .sv-boolean .checkbox-decorator": "display: none;",
    ".sv_main .sv-boolean__switch": "background-color: $main-color;",
    ".sv_main .sv-boolean__slider": "background-color: $slider-color;",
    ".sv_main .sv-boolean__label.sv-boolean__label--disabled":
      "color: $disabled-label-color;",
    ".sv_main .sv-boolean__label": "color: $text-color;",
    ".sv_main .sv-boolean--disabled .sv-boolean__switch":
      "background-color: $disabled-switch-color;",
    ".sv_main .sv-boolean--disabled  .sv-boolean__slider":
      "background-color: $disabled-slider-color;",
    //eo boolean
    ".sv_main .sv_matrix_detail_row":
      "background-color: #ededed; border-top: 1px solid $header-background-color; border-bottom: 1px solid $header-background-color;",

    //signature pad
    ".sv_main .sjs_sp_container": "border: 1px dashed $disable-color;",
    ".sv_main .sjs_sp_placeholder": "color: $foreground-light;",

    ".sv_main .sv-action-bar-item": "color: $text-color;",
    ".sv_main .sv-action-bar-item__icon use": "fill: $foreground-light;",
    ".sv_main .sv-action-bar-item:hover": "background-color: $background-dim;",

    ".sv-skeleton-element": "background-color: $background-dim;",
  };

  private sheet: CSSStyleSheet = null;

  static findSheet(styleSheetId: string): any {
    if (typeof document === "undefined") return null;
    for (let i = 0; i < document.styleSheets.length; i++) {
      if (
        !!document.styleSheets[i].ownerNode &&
        (<any>document).styleSheets[i].ownerNode["id"] === styleSheetId
      ) {
        return <CSSStyleSheet>document.styleSheets[i];
      }
    }
    return null;
  }

  static createSheet(styleSheetId: string) {
    let style = document.createElement("style");
    style.id = styleSheetId;
    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return <CSSStyleSheet>style.sheet;
  }

  public static applyTheme(
    themeName: string = "default",
    themeSelector: string = ".sv_main"
  ) {
    let ThemeCss: any;

    if (themeName === "modern") themeSelector = ".sv-root-modern ";
    if (themeName === "defaultV2") {
      surveyCss.currentType = themeName;
      return;
    }
    if (
      ["bootstrap", "bootstrapmaterial", "modern"].indexOf(themeName) !== -1
    ) {
      ThemeCss = (<any>StylesManager)[themeName + "ThemeCss"];
      surveyCss.currentType = themeName;
    } else {
      ThemeCss = StylesManager.ThemeCss;
      surveyCss.currentType = "standard";
    }

    if (StylesManager.Enabled) {
      const styleSheetId = (themeName + themeSelector).trim();
      let sheet = StylesManager.findSheet(styleSheetId);
      if (!sheet) {
        sheet = StylesManager.createSheet(styleSheetId);
        const theme = StylesManager.ThemeColors[themeName] ||
          StylesManager.ThemeColors["default"];

        Object.keys(ThemeCss).forEach((selector) => {
          let cssRuleText = ThemeCss[selector];
          Object.keys(theme).forEach(
            (colorVariableName) => (cssRuleText = cssRuleText.replace(new RegExp("\\" + colorVariableName, "g"), theme[colorVariableName]))
          );
          try {
            sheet.insertRule(
              themeSelector + selector + " { " + cssRuleText + " }",
              0
            );
          } catch (e) { }
        });
      }
    }
  }

  public static Enabled = true;

  constructor() {
    if (StylesManager.Enabled) {
      this.sheet = StylesManager.findSheet(StylesManager.SurveyJSStylesSheetId);
      if (!this.sheet) {
        this.sheet = StylesManager.createSheet(
          StylesManager.SurveyJSStylesSheetId
        );
        this.initializeStyles(this.sheet);
      }
    }
  }

  public initializeStyles(sheet: CSSStyleSheet) {
    if (StylesManager.Enabled) {
      Object.keys(StylesManager.Styles).forEach((selector) => {
        try {
          sheet.insertRule(
            selector + " { " + StylesManager.Styles[selector] + " }",
            0
          );
        } catch (e) { }
      });
      Object.keys(StylesManager.Media).forEach((selector) => {
        try {
          sheet.insertRule(
            StylesManager.Media[selector].media +
            " { " +
            selector +
            " { " +
            StylesManager.Media[selector].style +
            " } }",
            0
          );
        } catch (e) { }
      });
    }
  }
}
