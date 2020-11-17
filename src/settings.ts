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
   * Cache the result for choices getting from web services. Set this property to false, to disable the caching.
   */
  useCachingForChoicesRestfull: true,
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
   * Maximum rowCount that returns in addConditionObjectsByContext function
   */
  matrixMaxRowCountInCondition: 1,
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
   * Set to false to hide empty page title and description in design mode
   */
  allowShowEmptyTitleInDesignMode: true,
  /**
   * Set to false to hide empty page description in design mode
   */
  allowShowEmptyDescriptionInDesignMode: true,
  /**
   * Set this property to true to execute the complete trigger on value change instead of on next page.
   */
  executeCompleteTriggerOnValueChanged: false,
  /**
   * Set this property to false to execute the skip trigger on next page instead of on value change.
   */
  executeSkipTriggerOnValueChanged: true,
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
  /**
   * Set this property to change the default value of the minWidth constraint
   */
  minWidth: "300px",
  /**
   * Set this property to change the default value of the minWidth constraint
   */
  maxWidth: "initial",
  /**
   * This property tells how many times survey re-run expressions on value changes during condition running. We need it to avoid recursions in the expressions
   */
  maximumConditionRunCountOnValueChanged: 10,
  /**
   * By default visibleIndex for question with titleLocation = "hidden" is -1, and survey doesn't count these questions when set questions numbers.
   * Set it true, and a question next to a question with hidden title will increase it's number.
   */
  setQuestionVisibleIndexForHiddenTitle: false,
  /**
   * By default visibleIndex for question with hideNumber = true is -1, and survey doesn't count these questions when set questions numbers.
   * Set it true, and a question next to a question with hidden title number will increase it's number.
   */
  setQuestionVisibleIndexForHiddenNumber: false,
  /**
   * By default all rows are rendered no matters whwther they are visible.
   * Set it true, and survey markup rows will be rendered only if they are visible in viewport.
   * This feature is experimantal and might do not support all the use cases.
   */
  lazyRowsRendering: false,
};
