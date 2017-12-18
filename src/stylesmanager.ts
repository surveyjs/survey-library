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
    // ".sv_bootstrap_css .sv_qstn": "padding: 0.5em 1em 1.5em 1em;",

    ".sv_qstn": "display: inline-block; vertical-align: top;",
    ".progress": "width: 60%;",
    ".progress-bar": "width: auto; margin-left: 2px; margin-right: 2px;",
    ".sv_p_container": "display: inline-block; vertical-align: top;",
    ".sv_qbln .checkbox-material": "margin-right: 3px;",
    ".sv_qcbx .checkbox-material": "margin-right: 5px;",
    ".sv_qcbx .checkbox label": "justify-content: left; display: inline-block;",
    ".sv_qstn .radio label": "justify-content: left; display: inline-block;",
    ".sv_qstn label.sv_q_m_label": "position: absolute; margin: 0;",
    ".sv_q_mt_item_value": "float: left;",
    ".sv_qstn.sv_qstn_left": "margin-top: 0.75em;",
    ".sv_qstn .title-left": "float: left; margin-right: 1em;",
    ".sv_qstn .content-left": "overflow: hidden",
    ".sv_q_radiogroup_inline .sv_q_radiogroup_other": "display: inline-block;",
    ".sv_q_checkbox_inline .sv_q_checkbox_other": "display: inline-block;",
    ".sv_q_checkbox_inline, .sv_q_radiogroup_inline": "line-height: 2.5em;",
    ".form-inline .sv_q_checkbox_inline:not(:last-child)": "margin-right: 1em;",
    ".form-inline .sv_q_radiogroup_inline:not(:last-child)":
      "margin-right: 1em;",
    ".sv_qstn fieldset": "border: none; margin: 0; padding: 0;",
    "fieldset.form-inline": "display: inline-block;"
  };
  public static ThemeColors: { [key: string]: string } = {
    "$main-color": "#1ab394",
    "$main-hover-color": "#1ab394",
    "$header-background-color": "#e7e7e7",
    "$body-container-background-color": "#f4f4f4",
    "$body-background-color": "white",
    "$inputs-background-color": "white",
    "$text-color": "#6d7072",
    "$error-color": "#ed5565"
  };
  public static Theme: { [key: string]: string } = {
    ".sv_default_css": "background-color: $body-container-background-color;",
    ".sv_default_css hr": "border-color: $header-background-color;",
    ".sv_default_css input[type='button'], .sv_default_css button":
      "color: $body-background-color; background-color: $main-color;",
    ".sv_default_css input[type='button']:hover, .sv_default_css button:hover":
      "background-color: $main-hover-color;",
    ".sv_default_css .sv_custom_header":
      "background-color: $header-background-color;",
    ".sv_default_css .sv_container": "color: $text-color;",
    ".sv_default_css .sv_body":
      "background-color: $body-background-color; border-color: $main-color;",
    ".sv_default_css .sv_container .sv_body .sv_progress":
      "background-color: $header-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_progress .sv_progress_bar":
      "background-color: $main-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root > .sv_row":
      "border-color: $header-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root > .sv_row:nth-child(odd)":
      "background-color: $body-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root > .sv_row:nth-child(even)":
      "background-color: $body-container-background-color;",
    //".sv_default_css .sv_container .sv_body .sv_p_root .sv_q": "",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_other input":
      "border-color: $header-background-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_text_root":
      "border-color: $header-background-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_dropdown_control":
      "border-color: $header-background-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q input[type='text']":
      "border-color: $header-background-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q select":
      "border-color: $header-background-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q textarea":
      "border-color: $header-background-color; background-color: $inputs-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_other input:focus":
      "border-color: $main-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_text_root:focus":
      "border-color: $main-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_dropdown_control:focus":
      "border-color: $main-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q input[type='text']:focus":
      "border-color: $main-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q select:focus":
      "border-color: $main-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q textarea:focus":
      "border-color: $main-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_select_wrapper":
      "background-color: $body-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_rating .sv_q_rating_item.active .sv_q_rating_item_text":
      "background-color: $main-hover-color; border-color: $main-hover-color; color: $body-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_rating .sv_q_rating_item .sv_q_rating_item_text":
      "border-color: $header-background-color;",
    ".sv_default_css .sv_container .sv_body .sv_p_root .sv_q .sv_q_rating .sv_q_rating_item .sv_q_rating_item_text:hover":
      "border-color: $main-color;"
  };
  private sheet: CSSStyleSheet = null;

  static findSheet(styleSheetId: string) {
    for (let i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].ownerNode["id"] === styleSheetId) {
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

  public static applyTheme(themeName: string) {
    let sheet = StylesManager.findSheet(themeName);
    if (!sheet) {
      sheet = StylesManager.createSheet(themeName);
      StylesManager.initializeTheme(sheet);
    }
  }

  public static initializeTheme(sheet: CSSStyleSheet) {
    Object.keys(StylesManager.Theme).forEach(selector => {
      let cssRuleText = StylesManager.Theme[selector];
      Object.keys(StylesManager.ThemeColors).forEach(
        colorVariableName =>
          (cssRuleText = cssRuleText.replace(
            colorVariableName,
            StylesManager.ThemeColors[colorVariableName]
          ))
      );
      sheet.insertRule(".sv_main" + selector + " { " + cssRuleText + " }", 0);
    });
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
  }
}
