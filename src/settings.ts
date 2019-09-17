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
  surveyServiceUrl: "https://dxsurveyapi.azurewebsites.net/api/Survey",
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
  disableOnGettingChoicesFromWeb: false
};
