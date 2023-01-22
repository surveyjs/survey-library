/**
 * Global survey settings
 */
export var settings = {
  /**
   * Options for SurveyJS comparator. By default we trim strings and compare them as case insensitive. To change the behavior you can use following code:
   * settings.comparator.trimStrings = false; //"abc " will not equal to "abc". They are equal by default.
   * settings.comparator.caseSensitive = true; //"abc " will not equal to "Abc". They are equal by default.
   */
  comparator: {
    trimStrings: true,
    caseSensitive: false
  },
  expressionDisableConversionChar: "#",
  /**
   * Set this value to false, if you want to have UTC fuctions, for example setUTCHours inside our functions, like today.
   * By default it uses setHours function, with local date
   */
  useLocalTimeZone: true,
  get commentPrefix(): string { return settings.commentSuffix; },
  set commentPrefix(val: string) { settings.commentSuffix = val; },
  /**
   * The suffix that uses to store the question comment, as "questionName + commentSuffix".
   * The default value is "-Comment"
   */
  commentSuffix: "-Comment",
  /**
   * Encode parameter on calling restful web API
   */
  webserviceEncodeParameters: true,
  /**
   * Cache the result for choices getting from web services. Set this property to false, to disable the caching.
   */
  useCachingForChoicesRestful: true,
  get useCachingForChoicesRestfull() {
    return settings.useCachingForChoicesRestful;
  },
  set useCachingForChoicesRestfull(val: boolean) {
    settings.useCachingForChoicesRestful = val;
  },
  /**
   * SurveyJS web service API url
   */
  surveyServiceUrl: "https://api.surveyjs.io/public/v1/Survey",
  /**
   * separator that can allow to set value and text of ItemValue object in one string as: "value|text"
   */
  itemValueSeparator: "|",
  /**
   * Set it to true to serialize itemvalue instance always as object even if text property is empty
   * const item = new Survey.ItemValue(5);
   * item.toJSON(); //will return {value: 5}, instead of 5 by default.
   */
  itemValueAlwaysSerializeAsObject: false,
  /**
   * Set it to true to serialize itemvalue text property, even if it is empty or equals to value
   * const item = new Survey.ItemValue("item1");
   * item.toJSON(); //will return {value: item1, text: "item1"}, instead of "item1" by default.
   */
  itemValueAlwaysSerializeText: false,
  /**
   * default locale name for localizable strings that uses during serialization, {"default": "My text", "de": "Mein Text"}
   */
  defaultLocaleName: "default",
  /**
   * By default we do not store a value for a locale if it equals to "default" locale value
   */
  storeDuplicatedTranslations: false,
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
   * Set this property to false, to render matrix dynamic remove action as button.
   * It is rendered as icon in new themes ("defaultV2") by default.
   */
  matrixRenderRemoveAsIcon: true,
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
   * Set this property to false to stop showing "Compete" button when the complete trigger is going to be executed.
   */
  changeNavigationButtonsOnCompleteTrigger: true,
  /**
   * Set this property to false to execute the skip trigger on next page instead of on value change.
   */
  executeSkipTriggerOnValueChanged: true,
  /**
   * Specifies how the input field of [Comment](https://surveyjs.io/Documentation/Library?id=questioncommentmodel) questions is rendered in the read-only mode.
   * Available values:
   * "textarea" (default) - A 'textarea' element is used to render a Comment question's input field.
   * "div" - A 'div' element is used to render a Comment question's input field.
   */
  readOnlyCommentRenderMode: "textarea",
  /**
   * Specifies how the input field of [Text](https://surveyjs.io/Documentation/Library?id=questiontextmodel) questions is rendered in the read-only mode.
   * Available values:
   * "input" (default) - An 'input' element is used to render a Text question's input field.
   * "div" - A 'div' element is used to render a Text question's input field.
   */
  readOnlyTextRenderMode: "input",
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
   * Set this property to change the default value of the maxWidth constraint
   */
  maxWidth: "100%",
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
  lazyRowsRenderingStartRow: 3,
  /**
   * Notification settings
   */
  notifications: {
    lifetime: 2000
  },
  /**
   * By default checkbox and radiogroup items are ordered in rows.
   * Set it "column", and items will be ordered in columns.
   */
  showItemsInOrder: "default",
  /**
   * A value to save in survey results when respondents select the None choice item.
   */
  noneItemValue: "none",
  /**
   * Supported validators by question types. You can modify this variable to add validators for new question types or add/remove for existing question types.
   */
  supportedValidators: {
    question: ["expression"],
    comment: ["text", "regex"],
    text: ["numeric", "text", "regex", "email"],
    checkbox: ["answercount"],
    imagepicker: ["answercount"],
  },
  /**
   * Set the value as string "yyyy-mm-dd". text questions with inputType "date" will not allow to set to survey date that less than this value
   */
  minDate: "",
  /**
   * Set the value as string "yyyy-mm-dd". text questions with inputType "date" will not allow to set to survey date that greater than this value
   */
  maxDate: "",
  showModal: <
    (
      componentName: string,
      data: any,
      onApply: () => boolean,
      onCancel?: () => void,
      cssClass?: string,
      title?: string,
      displayMode?: "popup" | "overlay"
    ) => any
    >undefined,
  supportCreatorV2: false,
  showDefaultItemsInCreatorV2: true,
  /**
   * Specifies a list of custom icons.
   * Use this property to replace SurveyJS default icons (displayed in UI elements of SurveyJS Library or Creator) with your custom icons.
   * For every default icon to replace, add a key/value object with the default icon's name as a key and the name of your custom icon as a value.
   * For example: Survey.settings.customIcons["icon-redo"] = "my-own-redo-icon"
   */
  customIcons: {},
  /**
   * "entireItem" (default) | "icon"
   * For example: Survey.settings.rankingDragHandleArea = "icon"
   */
  rankingDragHandleArea: "entireItem",
  titleTags: {
    survey: "h3",
    page: "h4",
    panel: "h4",
    question: "h5",
  },
  questions: {
    inputTypes: [
      "color",
      "date",
      "datetime",
      "datetime-local",
      "email",
      "month",
      "number",
      "password",
      "range",
      "tel",
      "text",
      "time",
      "url",
      "week",
    ],
    dataList: [
      "name",
      "honorific-prefix",
      "given-name",
      "additional-name",
      "family-name",
      "honorific-suffix",
      "nickname",
      "organization-title",
      "username",
      "new-password",
      "current-password",
      "organization",
      "street-address",
      "address-line1",
      "address-line2",
      "address-line3",
      "address-level4",
      "address-level3",
      "address-level2",
      "address-level1",
      "country",
      "country-name",
      "postal-code",
      "cc-name",
      "cc-given-name",
      "cc-additional-name",
      "cc-family-name",
      "cc-number",
      "cc-exp",
      "cc-exp-month",
      "cc-exp-year",
      "cc-csc",
      "cc-type",
      "transaction-currency",
      "transaction-amount",
      "language",
      "bday",
      "bday-day",
      "bday-month",
      "bday-year",
      "sex",
      "url",
      "photo",
      "tel",
      "tel-country-code",
      "tel-national",
      "tel-area-code",
      "tel-local",
      "tel-local-prefix",
      "tel-local-suffix",
      "tel-extension",
      "email",
      "impp",
    ]
  }
};
