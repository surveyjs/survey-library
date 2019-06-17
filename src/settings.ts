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
  defaultLocaleName: "default"
};
