/**
 * Global survey settings
 */
export var settings = {
  /**
   * The prefix that uses to store the question comment, as {questionName} + {commentPrefix}.
   * The default
   */
  commentPrefix: "-Comment",
  /**
   * Encode parameter on calling restfull web API
   */
  webserviceEncodeParameters: true,
  /**
   * SurveyJS web service API url
   */
  surveyServiceUrl: "https://api.surveyjs.io/public/v1/Survey",
  /**
   * separator that can allow to set value and text of ItemValue object in one string as: "value|text"
   */
  itemValueSeparator: "|",
  /**
   * default locale name for localizable strings that uses during serialization, {"default": "My text", "de": "Mein Text"}
   */
  defaultLocaleName: "default",
  /**
   * Default row name for matrix (single choice)
   */
  matrixDefaultRowName: "default",
  /**
   * Default cell type for dropdown and dynamic matrices
   */
  matrixDefaultCellType: "dropdown",
  /**
   * Total value postfix for dropdown and dynamic matrices. The total value stores as: {matrixName} + {postfix}
   */
  matrixTotalValuePostFix: "-total",
  /**
   * Maximum row count in dynamic matrix
   */
  matrixMaximumRowCount: 1000,
  /**
   * Maximum panel count in dynamic panel
   */
  panelMaximumPanelCount: 100,
  /**
   * Maximum rate value count in rating question
   */
  ratingMaximumRateValueCount: 20,
  /**
   * Disable the question while choices are getting from the web service
   */
  disableOnGettingChoicesFromWeb: false,
  /**
   * Set to true to always serialize the localization string as object even if there is only one value for default locale. Instead of string "MyStr" serialize as {default: "MyStr"}
   */
  serializeLocalizableStringAsObject: false,
  /**
   * Set to false to hide empty page title in design mode
   */
  allowShowEmptyTitleInDesignMode: true,
  /**
   * Set this property to true to execute the complete trigger on value change instead of on next page.
   */
  executeCompleteTriggerOnValueChanged: false,
  /**
   * Set this property to change readOnlyCommentRenderMode: "textarea" (default) or (div)
   */
  readOnlyCommentRenderMode: "textarea",
  /**
   * Override this function, set your function, if you want to show your own dialog confirm window instead of standard browser window.
   * @param message
   */
  confirmActionFunc: function (message: string): boolean {
    return confirm(message);
  },
};
