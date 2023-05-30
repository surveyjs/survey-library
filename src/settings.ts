export type ISurveyEnvironment = {
  root: Document | ShadowRoot,
  rootElement: HTMLElement | ShadowRoot,
  popupMountContainer: HTMLElement | string,
  svgMountContainer: HTMLElement | string,
  stylesSheetsMountContainer: HTMLElement,
}
const document = globalThis.document;
const defaultEnvironment: ISurveyEnvironment = <ISurveyEnvironment> (!!document ? {
  root: document,

  _rootElement: document.body,
  get rootElement(): HTMLElement | ShadowRoot {
    return this._rootElement ?? document.body;
  },
  set rootElement(rootElement: HTMLElement | ShadowRoot) {
    (this._rootElement as any) = rootElement;
  },

  _popupMountContainer: document.body,
  get popupMountContainer(): HTMLElement | string {
    return this._popupMountContainer ?? document.body;
  },
  set popupMountContainer(popupMountContainer: HTMLElement | string) {
    (this._popupMountContainer as any) = popupMountContainer;
  },
  svgMountContainer: document.head,
  stylesSheetsMountContainer: document.head,
} : undefined);
const columnWidthsByType: { [index: string]: { minWidth?: string, width?: string } } = {
  "file": { minWidth: "240px" },
  "comment": { minWidth: "200px" }
};
/**
 * Global settings that apply to all surveys on the page. To specify one of the settings, use the code below:
 *
 * ```js
 * import { settings } from "survey-core";
 *
 * settings.settingName = "value";
 * ```
 */

export var settings = {
  designMode: {
    showEmptyDescriptions: true,
    showEmptyTitles: true
  },
  //#region designMode section, Obsolete properties
  /**
   * Specifies whether to display an empty description for pages and panels when they are being designed in Survey Creator.
   *
   * Default value: `true`
   */
  get allowShowEmptyDescriptionInDesignMode(): boolean { return this.designMode.showEmptyDescriptions; },
  set allowShowEmptyDescriptionInDesignMode(val: boolean) { this.designMode.showEmptyDescriptions = val; },
  /**
   * Specifies whether to display an empty title for pages and panels when they are being designed in Survey Creator.
   *
   * Default value: `true`
   */
  get allowShowEmptyTitleInDesignMode(): boolean { return this.designMode.showEmptyTitles; },
  set allowShowEmptyTitleInDesignMode(val: boolean) { this.designMode.showEmptyTitles = val; },
  //#endregion

  localization: {
    useLocalTimeZone: true,
    storeDuplicatedTranslations: false,
    defaultLocaleName: "default"
  },
  //#region localization section, obsolete properties
  /**
   * Disable this property if you want internal SurveyJS functions to use methods that work with UTC date and time (`setUTCDate()` `setUTCHours()`, etc.) instead of methods that work with local date and time (`setYear`, `setHours()`, etc.).
   *
   * Default value: `true`
   */
  get useLocalTimeZone(): boolean { return this.localization.useLocalTimeZone; },
  set useLocalTimeZone(val: boolean) { this.localization.useLocalTimeZone = val; },
  /**
   * Specifies whether surveys should store translation strings that equal the translation string specified by the `"default"` key.
   *
   * Default value: `false`
   * @see settings.defaultLocaleName
   */
  get storeDuplicatedTranslations(): boolean { return this.localization.storeDuplicatedTranslations; },
  set storeDuplicatedTranslations(val: boolean) { this.localization.storeDuplicatedTranslations = val; },
  /**
   * Specifies a property key that stores a translation for the default locale.
   *
   * Default value: `"default"`
   * @see storeDuplicatedTranslations
   */
  get defaultLocaleName(): string { return this.localization.defaultLocaleName; },
  set defaultLocaleName(val: string) { this.localization.defaultLocaleName = val; },
  //#endregion
  web: {
    encodeUrlParams: true,
    cacheLoadedChoices: true,
    disableQuestionWhileLoadingChoices: false,
    surveyServiceUrl: "https://api.surveyjs.io/public/v1/Survey"
  },
  //#region web section, obsolete properties
  /**
   * Specifies whether to encode URL parameters when you access a web service.
   *
   * Default value: `true`
   */
  get webserviceEncodeParameters(): boolean { return this.web.encodeUrlParams; },
  set webserviceEncodeParameters(val: boolean) { this.web.encodeUrlParams = val; },
  /**
   * Specifies whether to cache choices loaded from a web service.
   *
   * Default value: `true`
   * @see settings.disableOnGettingChoicesFromWeb
   */
  get useCachingForChoicesRestful(): boolean { return this.web.cacheLoadedChoices; },
  set useCachingForChoicesRestful(val: boolean) { this.web.cacheLoadedChoices = val; },
  get useCachingForChoicesRestfull(): boolean { return this.web.cacheLoadedChoices; },
  set useCachingForChoicesRestfull(val: boolean) { this.web.cacheLoadedChoices = val; },
  /**
   * Disables the question while choices are being loaded from a web service.
   *
   * Default value: `false`
   * @see settings.useCachingForChoicesRestful
   */
  get disableOnGettingChoicesFromWeb(): boolean { return this.web.disableQuestionWhileLoadingChoices; },
  set disableOnGettingChoicesFromWeb(val: boolean) { this.web.disableQuestionWhileLoadingChoices = val; },
  /**
   * The URL of the SurveyJS Service API endpoint.
   */
  get surveyServiceUrl(): string { return this.web.surveyServiceUrl; },
  set surveyServiceUrl(val: string) { this.web.surveyServiceUrl = val; },
  //#endregion

  triggers: {
    changeNavigationButtonsOnComplete: true,
    executeCompleteOnValueChanged: false,
    executeSkipOnValueChanged: true
  },
  //#region triggers section, Obsolete properties
  /**
   * Specifies whether to re-evaluate an expression associated with the [Complete trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete) immediately when a question value changes. If the expression evaluates to `true`, the trigger is executed.
   *
   * Keep this property set to `false` if you want to re-evaluate the Complete trigger's expression only when the respondents navigate to another page.
   *
   * Default value: `false`
   * @see settings.changeNavigationButtonsOnCompleteTrigger
   */
  get executeCompleteTriggerOnValueChanged(): boolean { return this.triggers.executeCompleteOnValueChanged; },
  set executeCompleteTriggerOnValueChanged(val: boolean) { this.triggers.executeCompleteOnValueChanged = val; },
  /**
   * Specifies whether to replace the Next button with the Complete button when the [Complete trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete) is going to be executed.
   *
   * Default value: `true`
   * @see settings.executeCompleteTriggerOnValueChanged
   */
  get changeNavigationButtonsOnCompleteTrigger(): boolean { return this.triggers.changeNavigationButtonsOnComplete; },
  set changeNavigationButtonsOnCompleteTrigger(val: boolean) { this.triggers.changeNavigationButtonsOnComplete = val; },
  /**
   * Specifies whether to re-evaluate an expression associated with the [Skip trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#skip) immediately when a question value changes. If the expression evaluates to `true`, the trigger is executed.
   *
   * Disable this property if you want to re-evaluate the Skip trigger's expression only when the respondents navigate to another page.
   *
   * Default value: `true`
   */
  get executeSkipTriggerOnValueChanged(): boolean { return this.triggers.executeSkipOnValueChanged; },
  set executeSkipTriggerOnValueChanged(val: boolean) { this.triggers.executeSkipOnValueChanged = val; },
  //#endregion

  serialization: {
    itemValueSerializeAsObject: false,
    itemValueSerializeDisplayText: false,
    localizableStringSerializeAsObject: false
  },
  //#region serialization section, Obsolete properties
  /**
   * Enable this property if you want to serialize [`ItemValue`](https://surveyjs.io/form-library/documentation/api-reference/itemvalue) instances as objects even when they include only the `value` property.
   *
   * ```js
   * import { ItemValue, settings } from "survey-core";
   *
   * settings.itemValueAlwaysSerializeAsObject = true;
   * const item = new ItemValue(5);
   * const itemString = item.toJSON(); // Produces { value: 5 } instead of 5
   * ```
   *
   * @see settings.serializeLocalizableStringAsObject
   */
  get itemValueAlwaysSerializeAsObject(): boolean { return this.serialization.itemValueSerializeAsObject; },
  set itemValueAlwaysSerializeAsObject(val: boolean) { this.serialization.itemValueSerializeAsObject = val; },
  /**
   * Enable this property if you want to serialize the `text` property of [`ItemValue`](https://surveyjs.io/form-library/documentation/api-reference/itemvalue) objects even when it is empty or equal to the `value` property.
   *
   * ```js
   * import { ItemValue, settings } from "survey-core";
   *
   * settings.itemValueAlwaysSerializeText = true;
   * const item = new ItemValue("item1");
   * const itemString = item.toJSON(); // Produces { value: "item1", text: "item1" } instead of "item1"
   * ```
   */
  get itemValueAlwaysSerializeText(): boolean { return this.serialization.itemValueSerializeDisplayText; },
  set itemValueAlwaysSerializeText(val: boolean) { this.serialization.itemValueSerializeDisplayText = val; },
  /**
   * Enable this property if you want to serialize [`LocalizableString`](https://surveyjs.io/form-library/documentation/api-reference/localizablestring) instances as objects even when they include only a translation string for the default locale. For example, `"Custom String"` will be serialized as `{ default: "Custom String" }`.
   *
   * Default value: `false`
   * @see settings.itemValueAlwaysSerializeAsObject
   */
  get serializeLocalizableStringAsObject(): boolean { return this.serialization.localizableStringSerializeAsObject; },
  set serializeLocalizableStringAsObject(val: boolean) { this.serialization.localizableStringSerializeAsObject = val; },
  //#endregion
  lazyRender: {
    enabled: false,
    startRow: 3
  },
  //#region lazyRender section, Obsolete properties
  /**
   * Specifies whether to add questions to the DOM only when they get into the viewport.
   *
   * Default value: `false`
   *
   * > This is an experimental feature that may not work as expected in all use cases.
   */
  get lazyRowsRendering(): boolean { return this.lazyRender.enabled; },
  set lazyRowsRendering(val: boolean) { this.lazyRender.enabled = val; },
  get lazyRowsRenderingStartRow(): number { return this.lazyRender.startRow; },
  set lazyRowsRenderingStartRow(val: number) { this.lazyRender.startRow = val; },
  //#endregion
  matrix: {
    defaultCellType: "dropdown",
    defaultRowName: "default",
    totalsSuffix: "-total",
    maxRowCount: 1000,
    maxRowCountInCondition: 1,
    renderRemoveAsIcon: true,
    columnWidthsByType: columnWidthsByType,
    rateSize: "small" as "small" | "normal",
  },
  //#region matrix section, Obsolete properties
  /**
   * Specifies a property key that stores an object with default cell values in [Single-Choice Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model) questions.
   *
   * Default value: "default"
   */
  get matrixDefaultRowName(): string { return this.matrix.defaultRowName; },
  set matrixDefaultRowName(val: string) { this.matrix.defaultRowName = val; },
  /**
   * The default type of matrix cells in the [Multiple-Choice Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list) and [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model) question types.
   *
   * Default value: `"dropdown"`
   *
   * You can specify this setting for individual questions or matrix columns: [`cellType`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#cellType). Refer to the `cellType` property description for information on possible values.
   */
  get matrixDefaultCellType(): string { return this.matrix.defaultCellType; },
  set matrixDefaultCellType(val: string) { this.matrix.defaultCellType = val; },
  /**
   * A suffix added to the name of the property that stores total values. The resulting property name consists of the matrix name and the suffix.
   *
   * Default value: `"-total"`
   */
  get matrixTotalValuePostFix(): string { return this.matrix.totalsSuffix; },
  set matrixTotalValuePostFix(val: string) { this.matrix.totalsSuffix = val; },
  /**
   * A maximum number of rows in a [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model).
   *
   * Default value: 1000
   *
   * You can specify this setting for an individual Dynamic Matrix: [`maxRowCount`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#maxRowCount).
   */
  get matrixMaximumRowCount(): number { return this.matrix.maxRowCount; },
  set matrixMaximumRowCount(val: number) { this.matrix.maxRowCount = val; },
  /**
   * A maximum number of matrix rows included in the Condition drop-down menu in Survey Creator. This menu is used to configure conditional survey logic.
   *
   * Default value: 1
   *
   * If you set this property to 0, the Condition menu does not include any matrix rows. Users still can specify conditions that use matrix rows but only with Manual Entry.
   */
  get matrixMaxRowCountInCondition(): number { return this.matrix.maxRowCountInCondition; },
  set matrixMaxRowCountInCondition(val: number) { this.matrix.maxRowCountInCondition = val; },
  /**
   * Disable this property if you want to render the Remove action in Dynamic Matrix as a button. Otherwise, the action is rendered as an icon.
   *
   * Default value: `true`
   */
  get matrixRenderRemoveAsIcon(): boolean { return this.matrix.renderRemoveAsIcon; },
  set matrixRenderRemoveAsIcon(val: boolean) { this.matrix.renderRemoveAsIcon = val; },
  /**
   * Contains properties that apply to [Single-Choice](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model), [Multiple-Choice](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list), and [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model) questions.
   *
   * Nested properties:
   *
   * - `columnWidthsByType`: `Object`\
   * An object that specifies fixed and minimum column width based on the column type.\
   * Example: `settings.matrix.columnWidthsByType = { "tagbox": { minWidth: "240px", width: "300px" } }`
   *
   * - `rateSize`: `"small"` (default) | `"normal"`\
   * Specifies the size of rate values. Applies to [Rating Scale](https://surveyjs.io/form-library/examples/rating-scale/) questions within matrixes.
   */
  //#endregion
  panel: {
    maxPanelCount: 100,
    maxPanelCountInCondition: 1
  },
  //#region panel section, Obsolete properties
  /**
   * A maximum number of panels from [Dynamic Panel](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model) included in the Condition drop-down menu in Survey Creator. This menu is used to configure conditional survey logic.
   *
   * Default value: 1
   *
   * If you set this property to 0, the Condition menu does not include any panel questions. Users still can specify conditions that use panel questions but only with Manual Entry.
   */
  get panelDynamicMaxPanelCountInCondition(): number { return this.panel.maxPanelCountInCondition; },
  set panelDynamicMaxPanelCountInCondition(val: number) { this.panel.maxPanelCountInCondition = val; },
  /**
   * A maximum number of panels in [Dynamic Panel](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model).
   *
   * Default value: 100
   *
   * You can specify this setting for an individual Dynamic Panel: [`maxPanelCount`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#maxPanelCount).
   */
  get panelMaximumPanelCount(): number { return this.panel.maxPanelCount; },
  set panelMaximumPanelCount(val: number) { this.panel.maxPanelCount = val; },
  //#endregion
  readOnly: {
    commentRenderMode: "textarea",
    textRenderMode: "input"
  },
  //#region readOnly section, Obsolete properties
  /**
   * Specifies how to render the input field of [Comment](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model) questions in [read-only](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model#readOnly) mode.
   *
   * Possible values:
   *
   * - `"textarea"` (default) - Renders the input field as a disabled `<textarea>` element.
   * - `"div"` - Renders the input field as a `<div>` element with a non-editable question value within it.
   */
  get readOnlyCommentRenderMode(): string { return this.readOnly.commentRenderMode; },
  set readOnlyCommentRenderMode(val: string) { this.readOnly.commentRenderMode = val; },
  /**
   * Specifies how to render the input field of [Text](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model) questions in [read-only](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#readOnly) mode.
   *
   * Possible values:
   *
   * - `"input"` (default) - Renders the input field as a disabled `<input>` element.
   * - `"div"` - Renders the input field as a `<div>` element with a non-editable question value within it.
   */
  get readOnlyTextRenderMode(): string { return this.readOnly.textRenderMode; },
  set readOnlyTextRenderMode(val: string) { this.readOnly.textRenderMode = val; },
  //#endregion
  numbering: {
    includeQuestionsWithHiddenNumber: false,
    includeQuestionsWithHiddenTitle: false
  },
  //#region numbering section, Obsolete properties
  /**
   * Specifies whether to number questions whose [`titleLocation`](https://surveyjs.io/form-library/documentation/api-reference/question#titleLocation) property is set to `"hidden"`.
   *
   * Default value: `false`
   */
  get setQuestionVisibleIndexForHiddenTitle(): boolean { return this.numbering.includeQuestionsWithHiddenTitle; },
  set setQuestionVisibleIndexForHiddenTitle(val: boolean) { this.numbering.includeQuestionsWithHiddenTitle = val; },
  /**
   * Specifies whether to number questions whose [`hideNumber`](https://surveyjs.io/form-library/documentation/api-reference/question#hideNumber) property is enabled.
   *
   * Default value: `false`
   */
  get setQuestionVisibleIndexForHiddenNumber(): boolean { return this.numbering.includeQuestionsWithHiddenNumber; },
  set setQuestionVisibleIndexForHiddenNumber(val: boolean) { this.numbering.includeQuestionsWithHiddenNumber = val; },
  //#endregion
  /**
   * Specifies an action to perform when users press the Enter key within a survey.
   *
   * Possible values:
   *
   * - `"moveToNextEditor"` - Moves focus to the next editor.
   * - `"loseFocus"` - Removes focus from the current editor.
   * - `"default"` - Behaves as a standard `<input>` element.
   */
  enterKeyAction: "default" as "moveToNextEditor" | "loseFocus" | "default",
  /**
   * An object that configures string comparison.
   *
   * Nested properties:
   *
   * - `trimStrings`: `Boolean`\
   * Specifies whether to remove whitespace from both ends of a string before the comparison. Default value: `true`.
   *
   * - `caseSensitive`: `Boolean`\
   * Specifies whether to differentiate between capital and lower-case letters. Default value: `false`.
   */
  comparator: {
    trimStrings: true,
    caseSensitive: false
  },
  expressionDisableConversionChar: "#",
  get commentPrefix(): string { return settings.commentSuffix; },
  set commentPrefix(val: string) { settings.commentSuffix = val; },
  /**
   * A suffix added to the name of the property that stores comments.
   *
   * Default value: "-Comment"
   *
   * You can specify this setting for an individual survey: [`commentSuffix`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#commentSuffix).
   */
  commentSuffix: "-Comment",
  /**
   * A separator used in a shorthand notation that specifies a value and display text for an [`ItemValue`](https://surveyjs.io/form-library/documentation/api-reference/itemvalue) object: `"value|text"`.
   *
   * Default value: `"|"`
   */
  itemValueSeparator: "|",
  /**
   * A maximum number of rate values in a [Rating](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model) question.
   *
   * Default value: 20
   */
  ratingMaximumRateValueCount: 20,
  /**
   * Specifies whether to close the drop-down menu of a [TagBox](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/) question after a user selects a value.
   *
   * This setting applies to all TagBox questions on a page. You can use the [closeOnSelect](https://surveyjs.io/form-library/documentation/api-reference/dropdown-tag-box-model#closeOnSelect) property to specify the same setting for an individual TagBox question.
   */
  tagboxCloseOnSelect: false,
  /**
   * A property that allows you to display a custom confirm dialog instead of the standard browser dialog. Set this property to a function that renders your custom dialog window.
   * @param message A message to be displayed in the confirm dialog window.
   */
  confirmActionFunc: function (message: string): boolean {
    return confirm(message);
  },
  /**
   * A minimum width value for all survey elements.
   *
   * Default value: `"300px"`
   *
   * You can override this setting for individual elements: [`minWidth`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement#minWidth).
   */
  minWidth: "300px",
  /**
   * A maximum width value for all survey elements.
   *
   * Default value: `"100%"`
   *
   * You can override this setting for individual elements: [`maxWidth`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement#maxWidth).
   */
  maxWidth: "100%",
  /**
   * Specifies how many times surveys can re-evaluate expressions when a question value changes. This limit helps avoid recursions in expressions.
   *
   * Default value: 10
   */
  maximumConditionRunCountOnValueChanged: 10,
  /**
   * An object that configures notifications.
   *
   * Nested properties:
   *
   * - `lifetime`: `Number`\
   * Specifies a time period during which a notification is displayed; measured in milliseconds.
   */
  notifications: {
    lifetime: 2000
  },
  /**
   * Specifies the direction in which to lay out Checkbox and Radiogroup items. This setting affects the resulting UI when items are arranged in [more than one column](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#colCount).
   *
   * Possible values:
   *
   * - `"row"` (default) - Items fill the current row, then move on to the next row.
   * - `"column"` - Items fill the current column, then move on to the next column.
   */
  showItemsInOrder: "default",
  /**
   * A value to save in survey results when respondents select the None choice item.
   *
   * Default value: `"none"`
   */
  noneItemValue: "none",
  /**
   * A list of supported validators by question type.
   */
  supportedValidators: {
    question: ["expression"],
    comment: ["text", "regex"],
    text: ["numeric", "text", "regex", "email"],
    checkbox: ["answercount"],
    imagepicker: ["answercount"],
  },
  /**
   * Specifies a minimum date that users can enter into a [Text](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model) question with [`inputType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#inputType) set to `"date"` or `"datetime-local"`. Set this property to a string with the folllowing format: `"yyyy-mm-dd"`.
   */
  minDate: "",
  /**
   * Specifies a maximum date that users can enter into a [Text](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model) question with [`inputType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#inputType) set to `"date"` or `"datetime-local"`. Set this property to a string with the folllowing format: `"yyyy-mm-dd"`.
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
   * An object that specifies icon replacements. Object keys are built-in icon names. To use a custom icon, assign its name to the key of the icon you want to replace:
   *
   * ```js
   * import { settings } from "survey-core";
   *
   * settings.customIcons["icon-redo"] = "custom-redo-icon";
   * ```
   *
   * For more information about icons in SurveyJS, refer to the following help topic: [UI Icons](https://surveyjs.io/form-library/documentation/icons).
   */
  customIcons: {},
  /**
   * Specifies which part of a choice item responds to a drag gesture in Ranking questions.
   *
   * Possible values:
   *
   * - `"entireItem"` (default) - Users can use the entire choice item as a drag handle.
   * - `"icon"` - Users can only use the choice item icon as a drag handle.
   */
  rankingDragHandleArea: "entireItem",

  /**
   * Specifies environment in which SurveyJS will exist
   */
  environment: defaultEnvironment,

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
      "",
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