import { surveyCss } from "./defaultCss/cssstandard";
export class StylesManager {
  private static SurveyJSStylesSheetId = "surveyjs";

  public static Styles: { [key: string]: string } = {
    // ".sv_bootstrap_css":
    //   "position: relative; width: 100%; background-color: #f4f4f4",
    // ".sv_bootstrap_css .sv_custom_header":
    //   "position: absolute; width: 100%; height: 275px; background-color: #e7e7e7;",
    // ".sv_bootstrap_css .sv_container":
    //   "max-width: 80%; margin: auto; position: relative; color: #6d7072; padding: 0 1em;",
    // ".sv_bootstrap_css .panel-body":
    //   "background-color: white; padding: 1em 1em 5em 1em; border-top: 2px solid lightgray;",
    ".sv_bootstrap_css .sv_qstn": "padding: 0.5em 1em 1.5em 1em;",
    ".sv_bootstrap_css .sv_qcbc input[type=checkbox], .sv_bootstrap_css .sv_qcbc input[type=radio]":
      "vertical-align: middle; margin-top: -1px",
    ".sv_bootstrap_css .sv_qstn fieldset": "display: block;",
    ".sv_bootstrap_css .sv_qstn  .sv_q_checkbox_inline, .sv_bootstrap_css .sv_qstn .sv_q_radiogroup_inline":
      "display: inline-block;",

    ".sv_main.sv_bootstrapmaterial_css .sv_q_radiogroup_control_label":
      "display: inline; position: static;",
    ".sv_main.sv_bootstrapmaterial_css .checkbox":
      "margin-top:10px;margin-bottom:10px;",

    ".sv_row": "clear: both;",
    ".sv_row .sv_qstn": "float: left",
    ".sv_row .sv_qstn:last-child": "float: none",
    ".sv_qstn": "display: inline-block; vertical-align: top; overflow: auto;",
    ".progress": "width: 60%;",
    ".progress-bar": "width: auto; margin-left: 2px; margin-right: 2px;",
    ".sv_p_container": "display: inline-block; vertical-align: top;",
    ".sv_qbln .checkbox-material": "margin-right: 3px;",
    ".sv_qcbx .checkbox-material": "margin-right: 5px;",
    ".sv_qcbx .checkbox label": "justify-content: left; display: inline-block;",
    ".sv_qstn .radio label": "justify-content: left; display: inline-block;",
    ".sv_qstn .sv_q_imgsel.sv_q_imagepicker_inline": "display: inline-block;",
    ".sv_qstn label.sv_q_m_label": "position: absolute; margin: 0;",
    ".sv_qstn td": "position: relative;",
    ".sv_q_mt_item_value": "float: left;",
    ".sv_qstn.sv_qstn_left": "margin-top: 0.75em;",
    ".sv_qstn .title-left": "float: left; margin-right: 1em;",
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
    ".sv_p_title_expandable": "cursor: pointer;",
    ".sv_p_title .sv_panel_icon": "float: right; margin-right: 1em;",
    ".sv_p_title .sv_panel_icon::before":
      "content: ''; background-repeat: no-repeat; background-position: center; padding: 0.5em; display: inline-block; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAxMCAxMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAgMTA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiM2RDcwNzI7fQ0KPC9zdHlsZT4NCjxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMiwyIDAsNCA1LDkgMTAsNCA4LDIgNSw1ICIvPg0KPC9zdmc+DQo=);",
    ".sv_p_title .sv_panel_icon.sv_expanded::before":
      "transform: rotate(180deg);",

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

    ".sv_qstn .sv-q-col-1":
      "width: 100%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-all;",
    ".sv_qstn .sv-q-col-2":
      "width: 50%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-all;",
    ".sv_qstn .sv-q-col-3":
      "width: 33.33333%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-all;",
    ".sv_qstn .sv-q-col-4":
      "width: 25%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-all;",
    ".sv_qstn .sv-q-col-5":
      "width: 20%; display: inline-block; padding-right: 1em; box-sizing: border-box; word-break: break-all;",

    ".sv_qstn .sv_q_file_input": "color: transparent;",

    ".sv_qstn .sv_q_imgsel label > div":
      "overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 4px; border: 1px solid lightgray; border-radius: 4px;",
    ".sv_qstn .sv_q_imgsel label > div > img, .sv_qstn .sv_q_imgsel label > div > embed":
      "display: block;",

    ".sv_qstn table tr td .sv_q_m_cell_label":
      "position: absolute; left: 0; right: 0; top: 0; bottom: 0;"
  };

  public static Media: { [key: string]: { media: string; style: string } } = {
    ".sv_qstn fieldset .sv-q-col-1": {
      style: "width: 100%;",
      media: "@media only screen and (max-width: 480px)"
    },
    ".sv_qstn fieldset .sv-q-col-2": {
      style: "width: 100%;",
      media: "@media only screen and (max-width: 480px)"
    },
    ".sv_qstn fieldset .sv-q-col-3": {
      style: "width: 100%;",
      media: "@media only screen and (max-width: 480px)"
    },
    ".sv_qstn fieldset .sv-q-col-4": {
      style: "width: 100%;",
      media: "@media only screen and (max-width: 480px)"
    },
    ".sv_qstn fieldset .sv-q-col-5": {
      style: "width: 100%;",
      media: "@media only screen and (max-width: 480px)"
    },

    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn": {
      style: "display: block; width: 100% !important;",
      media: "@media (max-width: 600px)"
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .title-left": {
      style: "float: none;",
      media: "@media (max-width: 600px)"
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .sv_q_radiogroup_inline, .sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .sv_q_checkbox_inline, .sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .sv_q_imagepicker_inline": {
      style: "display: block;",
      media: "@media (max-width: 600px)"
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table": {
      style: "display: block;",
      media: "@media (max-width: 600px)"
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table thead": {
      style: "display: none;",
      media: "@media (max-width: 600px)"
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table tbody, .sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table tr, .sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table td": {
      style: "display: block;",
      media: "@media (max-width: 600px)"
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.table:not(.sv_q_matrix) td:before": {
      style: "content: attr(headers);",
      media: "@media (max-width: 600px)"
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn table.sv_q_matrix td:after": {
      style: "content: attr(headers); padding-left: 1em",
      media: "@media (max-width: 600px)"
    },
    ".sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .radio label, .sv_main .sv_container .panel-body.card-block .sv_row .sv_qstn .checkbox label": {
      style: "line-height: 12px; vertical-align: top;",
      media: "@media (max-width: 600px)"
    }
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
      "$header-color": "#6d7072",
      "$border-color": "#e7e7e7",

      "$error-color": "#ed5565",
      "$error-background-color": "#fd6575"
    },
    orange: {
      "$header-background-color": "#4a4a4a",
      "$body-container-background-color": "#f8f8f8",

      "$main-color": "#f78119",
      "$main-hover-color": "#e77109",
      "$body-background-color": "white",
      "$inputs-background-color": "white",
      "$text-color": "#4a4a4a",
      "$header-color": "#f78119",
      "$border-color": "#e7e7e7",

      "$error-color": "#ed5565",
      "$error-background-color": "#fd6575"
    },
    darkblue: {
      "$header-background-color": "#d9d8dd",
      "$body-container-background-color": "#f6f7f2",

      "$main-color": "#3c4f6d",
      "$main-hover-color": "#2c3f5d",
      "$body-background-color": "white",
      "$inputs-background-color": "white",
      "$text-color": "#4a4a4a",
      "$header-color": "#6d7072",
      "$border-color": "#e7e7e7",

      "$error-color": "#ed5565",
      "$error-background-color": "#fd6575"
    },
    darkrose: {
      "$header-background-color": "#ddd2ce",
      "$body-container-background-color": "#f7efed",

      "$main-color": "#68656e",
      "$main-hover-color": "#58555e",
      "$body-background-color": "white",
      "$inputs-background-color": "white",
      "$text-color": "#4a4a4a",
      "$header-color": "#6d7072",
      "$border-color": "#e7e7e7",

      "$error-color": "#ed5565",
      "$error-background-color": "#fd6575"
    },
    stone: {
      "$header-background-color": "#cdccd2",
      "$body-container-background-color": "#efedf4",

      "$main-color": "#0f0f33",
      "$main-hover-color": "#191955",
      "$body-background-color": "white",
      "$inputs-background-color": "white",
      "$text-color": "#0f0f33",
      "$header-color": "#0f0f33",
      "$border-color": "#e7e7e7",

      "$error-color": "#ed5565",
      "$error-background-color": "#fd6575"
    },
    winter: {
      "$header-background-color": "#82b8da",
      "$body-container-background-color": "#dae1e7",

      "$main-color": "#3c3b40",
      "$main-hover-color": "#1e1d20",
      "$body-background-color": "white",
      "$inputs-background-color": "white",
      "$text-color": "#000",
      "$header-color": "#000",
      "$border-color": "#e7e7e7",

      "$error-color": "#ed5565",
      "$error-background-color": "#fd6575"
    },
    winterstone: {
      "$header-background-color": "#323232",
      "$body-container-background-color": "#f8f8f8",

      "$main-color": "#5ac8fa",
      "$main-hover-color": "#06a1e7",
      "$body-background-color": "white",
      "$inputs-background-color": "white",
      "$text-color": "#000",
      "$header-color": "#fff",
      "$border-color": "#e7e7e7",

      "$error-color": "#ed5565",
      "$error-background-color": "#fd6575"
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

    ".sv_default_css .sv_p_root > .sv_row": "border-color: $border-color;",
    ".sv_default_css .sv_p_root > .sv_row:nth-child(odd)":
      "background-color: $body-background-color;",
    ".sv_default_css .sv_p_root > .sv_row:nth-child(even)":
      "background-color: $body-container-background-color;",

    ".sv_default_css .sv_q_other input":
      "color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_q_text_root":
      "color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_q_dropdown_control":
      "color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css input[type='text']":
      "color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css select":
      "color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css textarea":
      "color: $text-color; border-color: $border-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_q_other input:focus": "border-color: $main-color;",
    ".sv_default_css .sv_q_text_root:focus": "border-color: $main-color;",
    ".sv_default_css .sv_q_dropdown_control:focus":
      "border-color: $main-color;",
    ".sv_default_css input[type='text']:focus": "border-color: $main-color;",
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

    ".sv_main .sv_q_imgsel.checked label>div": "background-color: $main-color"
  };

  public static bootstrapThemeCss: { [key: string]: string } = {
    ".sv_main .sv_q_imgsel.checked label>div": "background-color: $main-color"
  };

  public static bootstrapmaterialThemeCss: { [key: string]: string } = {
    ".sv_main.sv_bootstrapmaterial_css .form-group.is-focused .form-control":
      "background-image: linear-gradient($main-color, $main-color), linear-gradient(#D2D2D2, #D2D2D2);",
    ".sv_main.sv_bootstrapmaterial_css .form-group.is-focused label":
      "color:$main-color;",

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
      "position: relative; opacity: 1;"
  };

  private sheet: CSSStyleSheet = null;

  static findSheet(styleSheetId: string) {
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
    let ThemeCss:any;
    if (["bootstrap", "bootstrapmaterial"].indexOf(themeName) !== -1) {
      ThemeCss = (<any>StylesManager)[themeName + "ThemeCss"];
      surveyCss.currentType = themeName;
    } else {
      ThemeCss = StylesManager.ThemeCss;
      surveyCss.currentType = "standard";
    }

    let sheet = StylesManager.findSheet(themeName + themeSelector);
    if (!sheet) {
      sheet = StylesManager.createSheet(themeName + themeSelector);
      let theme =
        StylesManager.ThemeColors[themeName] ||
        StylesManager.ThemeColors["default"];

      Object.keys(ThemeCss).forEach(selector => {
        let cssRuleText = ThemeCss[selector];
        Object.keys(theme).forEach(
          colorVariableName =>
            (cssRuleText = cssRuleText.replace(
              new RegExp("\\" + colorVariableName, "g"),
              theme[colorVariableName]
            ))
        );
        sheet.insertRule(
          themeSelector + selector + " { " + cssRuleText + " }",
          0
        );
      });
    }
  }

  constructor() {
    this.sheet = StylesManager.findSheet(StylesManager.SurveyJSStylesSheetId);
    if (!this.sheet) {
      this.sheet = StylesManager.createSheet(
        StylesManager.SurveyJSStylesSheetId
      );
      this.initializeStyles(this.sheet);
    }
  }

  public initializeStyles(sheet: CSSStyleSheet) {
    Object.keys(StylesManager.Styles).forEach(selector =>
      sheet.insertRule(
        selector + " { " + StylesManager.Styles[selector] + " }",
        0
      )
    );
    Object.keys(StylesManager.Media).forEach(selector => {
      sheet.insertRule(
        StylesManager.Media[selector].media +
          " { " +
          selector +
          " { " +
          StylesManager.Media[selector].style +
          " } }",
        0
      );
    });
  }
}
