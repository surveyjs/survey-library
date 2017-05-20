/*Type definitions for Survey JavaScript library v0.12.14
Project: http://surveyjs.org/
Definitions by: Devsoft Baltic OÜ <https://github.com/surveyjs/>
*/
// Dependencies for this module:
//   ../../../../react

import * as React from 'react';

import './chunks/localization';

import "../../main.scss";
export let Version: string;

export var __assign: any;
export function __extends(thisClass: any, baseClass: any): void;
export var __decorate: (decorators: any, target: any, key: any, desc: any) => any;

export declare var surveyCss: {
    currentType: string;
    getCss: () => any;
};
export declare var defaultStandardCss: {
    root: string;
    header: string;
    body: string;
    footer: string;
    navigationButton: string;
    navigation: {
        complete: string;
        prev: string;
        next: string;
    };
    progress: string;
    progressBar: string;
    pageTitle: string;
    row: string;
    question: {
        root: string;
        title: string;
        comment: string;
        indent: number;
    };
    error: {
        root: string;
        icon: string;
        item: string;
    };
    checkbox: {
        root: string;
        item: string;
        other: string;
    };
    comment: string;
    dropdown: {
        root: string;
        control: string;
    };
    matrix: {
        root: string;
    };
    matrixdropdown: {
        root: string;
    };
    matrixdynamic: {
        root: string;
        button: string;
    };
    multipletext: {
        root: string;
        itemTitle: string;
        itemValue: string;
    };
    radiogroup: {
        root: string;
        item: string;
        label: string;
        other: string;
    };
    rating: {
        root: string;
        item: string;
    };
    text: string;
    window: {
        root: string;
        body: string;
        header: {
            root: string;
            title: string;
            button: string;
            buttonExpanded: string;
            buttonCollapsed: string;
        };
    };
};

export declare var defaultBootstrapCss: {
    root: string;
    header: string;
    body: string;
    footer: string;
    navigationButton: string;
    navigation: {
        complete: string;
        prev: string;
        next: string;
    };
    progress: string;
    progressBar: string;
    pageTitle: string;
    row: string;
    question: {
        root: string;
        title: string;
        comment: string;
        indent: number;
    };
    error: {
        root: string;
        icon: string;
        item: string;
    };
    checkbox: {
        root: string;
        item: string;
        other: string;
    };
    comment: string;
    dropdown: {
        root: string;
        control: string;
    };
    matrix: {
        root: string;
    };
    matrixdropdown: {
        root: string;
    };
    matrixdynamic: {
        root: string;
        button: string;
    };
    multipletext: {
        root: string;
        itemTitle: string;
        itemValue: string;
    };
    radiogroup: {
        root: string;
        item: string;
        label: string;
        other: string;
    };
    rating: {
        root: string;
        item: string;
    };
    text: string;
    window: {
        root: string;
        body: string;
        header: {
            root: string;
            title: string;
            button: string;
            buttonExpanded: string;
            buttonCollapsed: string;
        };
    };
};

export declare var defaultBootstrapMaterialCss: {
    root: string;
    header: string;
    body: string;
    footer: string;
    navigationButton: string;
    navigation: {
        complete: string;
        prev: string;
        next: string;
    };
    progress: string;
    progressBar: string;
    pageTitle: string;
    row: string;
    question: {
        root: string;
        title: string;
        comment: string;
        indent: number;
    };
    error: {
        root: string;
        icon: string;
        item: string;
    };
    checkbox: {
        root: string;
        item: string;
        other: string;
    };
    comment: string;
    dropdown: {
        root: string;
        control: string;
    };
    matrix: {
        root: string;
        row: string;
        label: string;
        itemValue: string;
    };
    matrixdropdown: {
        root: string;
        itemValue: string;
    };
    matrixdynamic: {
        root: string;
        button: string;
    };
    multipletext: {
        root: string;
        itemTitle: string;
        row: string;
        itemValue: string;
    };
    radiogroup: {
        root: string;
        item: string;
        label: string;
        other: string;
    };
    rating: {
        root: string;
        item: string;
    };
    text: string;
    window: {
        root: string;
        body: string;
        header: {
            root: string;
            title: string;
            button: string;
            buttonExpanded: string;
            buttonCollapsed: string;
        };
    };
};

export declare class Survey extends React.Component<any, any> implements ISurveyCreator {
    static cssType: string;
    protected survey: ReactSurveyModel;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    componentDidUpdate(): void;
    componentDidMount(): void;
    render(): JSX.Element;
    css: any;
    protected renderCompleted(): JSX.Element;
    protected renderLoading(): JSX.Element;
    protected renderSurvey(): JSX.Element;
    protected renderTitle(): JSX.Element;
    protected renderPage(): JSX.Element;
    protected renderProgress(isTop: boolean): JSX.Element;
    protected renderNavigation(): JSX.Element;
    protected renderEmptySurvey(): JSX.Element;
    protected updateSurvey(newProps: any): void;
    protected setSurveyEvents(newProps: any): void;
    createQuestionElement(question: QuestionBase): JSX.Element;
    renderError(key: string, errorText: string): JSX.Element;
    questionTitleLocation(): string;
}

export declare class ReactSurveyModel extends SurveyModel {
    renderCallback: () => void;
    constructor(jsonObj?: any);
    render(): void;
    mergeCss(src: any, dest: any): void;
    doAfterRenderSurvey(el: any): void;
    protected onLoadSurveyFromService(): void;
    protected onLoadingSurveyFromService(): void;
}

export declare class SurveyNavigationBase extends React.Component<any, any> {
    protected survey: SurveyModel;
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
}

export declare class SurveyNavigation extends SurveyNavigationBase {
    constructor(props: any);
    handlePrevClick(event: any): void;
    handleNextClick(event: any): void;
    handleCompleteClick(event: any): void;
    render(): JSX.Element;
    protected renderButton(click: any, text: string, btnClassName: string): JSX.Element;
}

export declare class SurveyPage extends React.Component<any, any> {
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    componentDidMount(): void;
    render(): JSX.Element;
    protected createRow(row: QuestionRowModel, index: number): JSX.Element;
    protected renderTitle(): JSX.Element;
}
export declare class SurveyPanel extends React.Component<any, any> {
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    componentDidMount(): void;
    render(): JSX.Element;
    protected createRow(row: QuestionRowModel, index: number): JSX.Element;
    protected renderTitle(): JSX.Element;
}
export declare class SurveyRow extends React.Component<any, any> {
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
    protected createQuestion(question: QuestionBase): JSX.Element;
}

export interface ISurveyCreator {
    createQuestionElement(question: QuestionBase): JSX.Element;
    renderError(key: string, errorText: string): JSX.Element;
    questionTitleLocation(): string;
}
export declare class SurveyQuestion extends React.Component<any, any> {
    protected question: Question;
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    protected renderQuestion(): JSX.Element;
    protected renderTitle(): JSX.Element;
    protected renderComment(): JSX.Element;
    protected renderErrors(): JSX.Element;
}
export declare class SurveyQuestionErrors extends React.Component<any, any> {
    protected question: Question;
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
}

export declare class SurveyElementBase extends React.Component<any, any> {
    static renderLocString(locStr: LocalizableString, style?: any): JSX.Element;
    protected css: any;
    protected rootCss: any;
    protected isDisplayMode: boolean;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    protected renderLocString(locStr: LocalizableString, style?: any): JSX.Element;
}
export declare class SurveyQuestionElementBase extends SurveyElementBase {
    protected questionBase: QuestionBase;
    protected creator: ISurveyCreator;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    protected shouldComponentUpdate(): boolean;
}

export declare class SurveyQuestionComment extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionCommentModel;
    componentWillReceiveProps(nextProps: any): void;
    handleOnChange(event: any): void;
    handleOnBlur(event: any): void;
    render(): JSX.Element;
}
export declare class SurveyQuestionCommentItem extends SurveyElementBase {
    constructor(props: any);
    handleOnChange(event: any): void;
    handleOnBlur(event: any): void;
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
}

export declare class SurveyQuestionCheckbox extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionCheckboxModel;
    render(): JSX.Element;
    protected getItems(): Array<any>;
    protected readonly textStyle: any;
    protected renderItem(key: string, item: any, isFirst: boolean): JSX.Element;
}
export declare class SurveyQuestionCheckboxItem extends SurveyElementBase {
    protected question: QuestionCheckboxModel;
    protected item: ItemValue;
    protected textStyle: any;
    protected isFirst: any;
    constructor(props: any);
    protected shouldComponentUpdate(): boolean;
    componentWillReceiveProps(nextProps: any): void;
    handleOnChange(event: any): void;
    render(): JSX.Element;
    protected readonly inputStyle: any;
    protected renderCheckbox(isChecked: boolean, divStyle: any, otherItem: JSX.Element): JSX.Element;
    protected renderOther(): JSX.Element;
}

export declare class SurveyQuestionDropdown extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionDropdownModel;
    componentWillReceiveProps(nextProps: any): void;
    handleOnChange(event: any): void;
    render(): JSX.Element;
    protected renderSelect(): JSX.Element;
    protected renderOther(): JSX.Element;
}

export declare class SurveyQuestionMatrixDropdown extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionMatrixDropdownModel;
    render(): JSX.Element;
}
export declare class SurveyQuestionMatrixDropdownRow extends SurveyElementBase {
    protected creator: ISurveyCreator;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
    protected renderSelect(cell: MatrixDropdownCell): JSX.Element;
}

export declare class SurveyQuestionMatrix extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionMatrixModel;
    render(): JSX.Element;
}
export declare class SurveyQuestionMatrixRow extends SurveyElementBase {
    constructor(props: any);
    handleOnChange(event: any): void;
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
}

export declare class SurveyQuestionHtml extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionHtmlModel;
    render(): JSX.Element;
}

export declare class SurveyQuestionFile extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionFileModel;
    handleOnChange(event: any): void;
    render(): JSX.Element;
    protected renderImage(): JSX.Element;
}

export declare class SurveyQuestionMultipleText extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionMultipleTextModel;
    render(): JSX.Element;
    protected renderRow(key: string, items: Array<MultipleTextItemModel>): JSX.Element;
    protected renderItem(item: MultipleTextItemModel, isFirst: boolean): JSX.Element;
}
export declare class SurveyQuestionMultipleTextItem extends SurveyElementBase {
    constructor(props: any);
    handleOnChange(event: any): void;
    handleOnBlur(event: any): void;
    componentWillReceiveProps(nextProps: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    protected readonly mainClassName: string;
}

export declare class SurveyQuestionRadiogroup extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionRadiogroupModel;
    componentWillReceiveProps(nextProps: any): void;
    handleOnChange(event: any): void;
    render(): JSX.Element;
    protected getItems(): Array<any>;
    protected readonly textStyle: any;
    protected renderRadio(key: string, item: ItemValue, isChecked: boolean, divStyle: any, otherItem: JSX.Element, isFirst: boolean): JSX.Element;
    protected renderOther(): JSX.Element;
}

export declare class SurveyQuestionText extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionTextModel;
    componentWillReceiveProps(nextProps: any): void;
    handleOnChange(event: any): void;
    handleOnBlur(event: any): void;
    render(): JSX.Element;
}

export declare class SurveyQuestionMatrixDynamic extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionMatrixDynamicModel;
    componentWillReceiveProps(nextProps: any): void;
    handleOnRowAddClick(event: any): void;
    render(): JSX.Element;
    protected renderAddRowButton(): JSX.Element;
}
export declare class SurveyQuestionMatrixDynamicRow extends SurveyElementBase {
    protected creator: ISurveyCreator;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    handleOnRowRemoveClick(event: any): void;
    render(): JSX.Element;
    protected renderQuestion(cell: MatrixDropdownCell): JSX.Element;
    protected renderButton(): JSX.Element;
}

export declare class SurveyProgress extends SurveyNavigationBase {
    protected isTop: boolean;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    protected readonly progress: number;
    protected readonly progressText: string;
    render(): JSX.Element;
}

export declare class SurveyQuestionRating extends SurveyQuestionElementBase {
    constructor(props: any);
    protected readonly question: QuestionRatingModel;
    handleOnChange(event: any): void;
    render(): JSX.Element;
    protected renderItem(key: string, item: ItemValue, minText: JSX.Element, maxText: JSX.Element): JSX.Element;
    protected renderOther(): JSX.Element;
}

export declare class SurveyWindow extends Survey {
    constructor(props: any);
    handleOnExpanded(event: any): void;
    render(): JSX.Element;
    protected renderHeader(): JSX.Element;
    protected renderBody(): JSX.Element;
    protected updateSurvey(newProps: any): void;
}

export declare class ReactQuestionFactory {
    static Instance: ReactQuestionFactory;
    registerQuestion(questionType: string, questionCreator: (name: string) => JSX.Element): void;
    getAllTypes(): Array<string>;
    createQuestion(questionType: string, params: any): JSX.Element;
}

export declare class ValidatorResult {
        value: any;
        error: SurveyError;
        constructor(value: any, error?: SurveyError);
}
/**
    * Base SurveyJS validator class.
    */
export declare class SurveyValidator extends Base {
        text: string;
        constructor();
        protected getErrorText(name: string): string;
        protected getDefaultErrorText(name: string): string;
        validate(value: any, name?: string): ValidatorResult;
}
export interface IValidatorOwner {
        validators: Array<SurveyValidator>;
        value: any;
        getValidatorTitle(): string;
}
export declare class ValidatorRunner {
        run(owner: IValidatorOwner): SurveyError;
}
/**
    * Validate numeric values.
    */
export declare class NumericValidator extends SurveyValidator {
        minValue: number;
        maxValue: number;
        constructor(minValue?: number, maxValue?: number);
        getType(): string;
        validate(value: any, name?: string): ValidatorResult;
        protected getDefaultErrorText(name: string): any;
}
/**
    * Validate text values
    */
export declare class TextValidator extends SurveyValidator {
        minLength: number;
        maxLength: number;
        constructor(minLength?: number, maxLength?: number);
        getType(): string;
        validate(value: any, name?: string): ValidatorResult;
        protected getDefaultErrorText(name: string): any;
}
export declare class AnswerCountValidator extends SurveyValidator {
        minCount: number;
        maxCount: number;
        constructor(minCount?: number, maxCount?: number);
        getType(): string;
        validate(value: any, name?: string): ValidatorResult;
        protected getDefaultErrorText(name: string): string;
}
/**
    * Use it to validate the text by regular expressions.
    */
export declare class RegexValidator extends SurveyValidator {
        regex: string;
        constructor(regex?: string);
        getType(): string;
        validate(value: any, name?: string): ValidatorResult;
}
/**
    * Validate e-mail address in the text input
    */
export declare class EmailValidator extends SurveyValidator {
        constructor();
        getType(): string;
        validate(value: any, name?: string): ValidatorResult;
        protected getDefaultErrorText(name: string): any;
}

export interface HashTable<T> {
    [key: string]: T;
}
export interface ISurveyData {
    getValue(name: string): any;
    setValue(name: string, newValue: any): any;
    getComment(name: string): string;
    setComment(name: string, newValue: string): any;
}
export interface ISurvey extends ISurveyData {
    currentPage: IPage;
    pageVisibilityChanged(page: IPage, newValue: boolean): any;
    questionVisibilityChanged(question: IQuestion, newValue: boolean): any;
    questionAdded(question: IQuestion, index: number, parentPanel: any, rootPanel: any): any;
    panelAdded(panel: IElement, index: number, parentPanel: any, rootPanel: any): any;
    questionRemoved(question: IQuestion): any;
    panelRemoved(panel: IElement): any;
    validateQuestion(name: string): SurveyError;
    processHtml(html: string): string;
    processText(text: string): string;
    isDisplayMode: boolean;
    isDesignMode: boolean;
    isLoadingFromJson: boolean;
    requiredText: string;
    questionStartIndex: string;
    getQuestionTitleTemplate(): string;
    storeOthersAsComment: boolean;
    uploadFile(name: string, file: File, storeDataAsText: boolean, uploadingCallback: (status: string) => any): boolean;
    afterRenderQuestion(question: IQuestion, htmlElement: any): any;
    afterRenderPanel(panel: IElement, htmlElement: any): any;
    matrixRowAdded(question: IQuestion): any;
}
export interface IConditionRunner {
    runCondition(values: HashTable<any>): any;
}
export interface IElement extends IConditionRunner {
    name: string;
    visible: boolean;
    isVisible: boolean;
    setData(newValue: ISurveyData): any;
    rowVisibilityChangedCallback: () => void;
    startWithNewLineChangedCallback: () => void;
    renderWidth: string;
    width: string;
    rightIndent: number;
    startWithNewLine: boolean;
    isPanel: boolean;
    onSurveyLoad(): any;
    onLocaleChanged(): any;
}
export interface IQuestion extends IElement {
    hasTitle: boolean;
    setVisibleIndex(value: number): any;
    onSurveyValueChanged(newValue: any): any;
    onReadOnlyChanged(): any;
    supportGoNextPageAutomatic(): boolean;
    clearUnusedValues(): any;
}
export interface IPanel extends IElement {
}
export interface IPage extends IConditionRunner {
    visible: boolean;
    onSurveyLoad(): any;
}
/**
  * The base class for SurveyJS objects.
  */
export declare class Base {
    static isValueEmpty(value: any): boolean;
    getType(): string;
    protected isTwoValueEquals(x: any, y: any): boolean;
}
export declare class SurveyError {
    getText(): string;
}
export declare var SurveyPageId: string;
export declare class SurveyElement {
    static ScrollElementToTop(elementId: string): boolean;
    static GetFirstNonTextElement(elements: any): any;
    static FocusElement(elementId: string): boolean;
}
export declare class Event<T extends Function, Options> {
    readonly isEmpty: boolean;
    fire(sender: any, options: Options): void;
    add(func: T): void;
    remove(func: T): void;
}

/**
  * Array of ItemValue is used in checkox, dropdown and radiogroup choices, matrix columns and rows.
  * It has two main properties: value and text. If text is empty, value is used for displaying.
  * The text property is localizable and support markdown.
  */
export declare class ItemValue {
    static Separator: string;
    static createArray(locOwner: ILocalizableOwner): Array<ItemValue>;
    static setupArray(items: Array<ItemValue>, locOwner: ILocalizableOwner): void;
    static setData(items: Array<ItemValue>, values: Array<any>): void;
    static getData(items: Array<ItemValue>): any;
    static getItemByValue(items: Array<ItemValue>, val: any): ItemValue;
    static NotifyArrayOnLocaleChanged(items: Array<ItemValue>): void;
    constructor(value: any, text?: string);
    getType(): string;
    readonly locText: LocalizableString;
    locOwner: ILocalizableOwner;
    value: any;
    readonly hasText: boolean;
    text: string;
    setData(value: any): void;
}

export interface ILocalizableOwner {
    getLocale(): string;
    getMarkdownHtml(text: string): string;
}
/**
  * The class represents the string that supports multi-languages and markdown.
  * It uses in all objects where support for multi-languages and markdown is required.
  */
export declare class LocalizableString {
    owner: ILocalizableOwner;
    useMarkdown: boolean;
    static defaultLocale: string;
    onRenderedHtmlCallback: (html: string) => string;
    onGetTextCallback: (str: string) => string;
    constructor(owner: ILocalizableOwner, useMarkdown?: boolean);
    readonly locale: string;
    text: string;
    readonly pureText: any;
    readonly hasHtml: boolean;
    readonly html: string;
    readonly textOrHtml: string;
    readonly renderedHtml: string;
    getLocaleText(loc: string): string;
    setLocaleText(loc: string, value: string): void;
    getJson(): any;
    setJson(value: any): void;
    onChanged(): void;
    protected onCreating(): void;
}

/**
  * A definition for filling choices for checkbox, dropdown and radiogroup questions from resfull services.
  * The run method call a restfull service and results can be get on getREsultCallback.
  */
export declare class ChoicesRestfull extends Base {
    url: string;
    path: string;
    valueName: string;
    titleName: string;
    getResultCallback: (items: Array<ItemValue>) => void;
    error: SurveyError;
    constructor();
    run(): void;
    getType(): string;
    readonly isEmpty: boolean;
    setData(json: any): void;
    clear(): void;
    protected onLoad(result: any): void;
}

export declare class Condition {
    static operatorsValue: HashTable<Function>;
    static readonly operators: HashTable<Function>;
    left: any;
    right: any;
    operator: string;
    perform(left?: any, right?: any): boolean;
    performExplicit(left: any, right: any): boolean;
}
export declare class ConditionNode {
    children: Array<any>;
    constructor();
    connective: string;
    readonly isEmpty: boolean;
    clear(): void;
}
export declare class ConditionRunner {
    constructor(expression: string);
    expression: string;
    run(values: HashTable<any>): boolean;
}

export declare class ConditionsParser {
    parse(text: string, root: ConditionNode): boolean;
    toString(root: ConditionNode): string;
}

export declare class ProcessValue {
    constructor();
    getFirstName(text: string): string;
    hasValue(text: string, values: HashTable<any>): boolean;
    getValue(text: string, values: HashTable<any>): any;
}

export declare class AnswerRequiredError extends SurveyError {
    constructor();
    getText(): string;
}
export declare class RequreNumericError extends SurveyError {
    constructor();
    getText(): string;
}
export declare class ExceedSizeError extends SurveyError {
    constructor(maxSize: number);
    getText(): string;
}
export declare class CustomError extends SurveyError {
    constructor(text: string);
    getText(): string;
}

export declare class JsonObjectProperty {
    name: string;
    className: string;
    alternativeName: string;
    classNamePart: string;
    baseClassName: string;
    defaultValue: any;
    readOnly: boolean;
    visible: boolean;
    isLocalizable: boolean;
    serializationProperty: string;
    onGetValue: (obj: any) => any;
    onSetValue: (obj: any, value: any, jsonConv: JsonObject) => any;
    constructor(name: string);
    type: string;
    readonly hasToUseGetValue: string | ((obj: any) => any);
    isDefaultValue(value: any): boolean;
    getValue(obj: any): any;
    getPropertyValue(obj: any): any;
    readonly hasToUseSetValue: string | ((obj: any, value: any, jsonConv: JsonObject) => any);
    setValue(obj: any, value: any, jsonConv: JsonObject): void;
    getObjType(objType: string): string;
    getClassName(className: string): string;
    readonly choices: Array<any>;
    setChoices(value: Array<any>, valueFunc: () => Array<any>): void;
}
export declare class JsonMetadataClass {
    name: string;
    creator: () => any;
    parentName: string;
    static requiredSymbol: string;
    static typeSymbol: string;
    properties: Array<JsonObjectProperty>;
    requiredProperties: Array<string>;
    constructor(name: string, properties: Array<any>, creator?: () => any, parentName?: string);
    find(name: string): JsonObjectProperty;
    createProperty(propInfo: any): JsonObjectProperty;
}
export declare class JsonMetadata {
    addClass(name: string, properties: Array<any>, creator?: () => any, parentName?: string): JsonMetadataClass;
    overrideClassCreatore(name: string, creator: () => any): void;
    getProperties(className: string): Array<JsonObjectProperty>;
    findProperty(className: string, propertyName: string): JsonObjectProperty;
    createClass(name: string): any;
    getChildrenClasses(name: string, canBeCreated?: boolean): Array<JsonMetadataClass>;
    getRequiredProperties(name: string): Array<string>;
    addProperty(className: string, propertyInfo: any): void;
    removeProperty(className: string, propertyName: string): boolean;
    findClass(name: string): JsonMetadataClass;
}
export declare class JsonError {
    type: string;
    message: string;
    description: string;
    at: Number;
    constructor(type: string, message: string);
    getFullDescription(): string;
}
export declare class JsonUnknownPropertyError extends JsonError {
    propertyName: string;
    className: string;
    constructor(propertyName: string, className: string);
}
export declare class JsonMissingTypeErrorBase extends JsonError {
    baseClassName: string;
    type: string;
    message: string;
    constructor(baseClassName: string, type: string, message: string);
}
export declare class JsonMissingTypeError extends JsonMissingTypeErrorBase {
    propertyName: string;
    baseClassName: string;
    constructor(propertyName: string, baseClassName: string);
}
export declare class JsonIncorrectTypeError extends JsonMissingTypeErrorBase {
    propertyName: string;
    baseClassName: string;
    constructor(propertyName: string, baseClassName: string);
}
export declare class JsonRequiredPropertyError extends JsonError {
    propertyName: string;
    className: string;
    constructor(propertyName: string, className: string);
}
export declare class JsonObject {
    static readonly metaData: JsonMetadata;
    errors: JsonError[];
    toJsonObject(obj: any): any;
    toObject(jsonObj: any, obj: any): void;
    protected toJsonObjectCore(obj: any, property: JsonObjectProperty): any;
    protected valueToJson(obj: any, result: any, property: JsonObjectProperty): void;
    protected valueToObj(value: any, obj: any, key: any, property: JsonObjectProperty): void;
}

export interface IMatrixDropdownData {
    onRowChanged(cell: MatrixDropdownRowModelBase, newRowValue: any): any;
    columns: Array<MatrixDropdownColumn>;
    createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
    getLocale(): string;
    getMarkdownHtml(text: string): string;
}
export interface IMatrixColumnOwner extends ILocalizableOwner {
    getRequiredText(): string;
}
export declare class MatrixDropdownColumn extends Base implements ILocalizableOwner {
    name: string;
    isRequired: boolean;
    hasOther: boolean;
    minWidth: string;
    choicesByUrl: ChoicesRestfull;
    colOwner: IMatrixColumnOwner;
    validators: Array<SurveyValidator>;
    constructor(name: string, title?: string);
    getType(): string;
    choicesOrder: string;
    inputType: string;
    cellType: string;
    title: string;
    readonly fullTitle: string;
    getFullTitle(str: string): string;
    readonly locTitle: LocalizableString;
    optionsCaption: string;
    readonly locOptionsCaption: LocalizableString;
    placeHolder: string;
    readonly locPlaceHolder: LocalizableString;
    choices: Array<any>;
    colCount: number;
    getLocale(): string;
    getMarkdownHtml(text: string): string;
    onLocaleChanged(): void;
}
export declare class MatrixDropdownCell {
    column: MatrixDropdownColumn;
    row: MatrixDropdownRowModelBase;
    constructor(column: MatrixDropdownColumn, row: MatrixDropdownRowModelBase, data: IMatrixDropdownData);
    readonly question: Question;
    value: any;
}
export declare class MatrixDropdownRowModelBase implements ISurveyData, ILocalizableOwner {
    protected data: IMatrixDropdownData;
    cells: Array<MatrixDropdownCell>;
    constructor(data: IMatrixDropdownData, value: any);
    readonly id: string;
    readonly rowName: any;
    value: any;
    getValue(name: string): any;
    setValue(name: string, newValue: any): void;
    getComment(name: string): string;
    setComment(name: string, newValue: string): void;
    readonly isEmpty: boolean;
    getLocale(): string;
    getMarkdownHtml(text: string): string;
    onLocaleChanged(): void;
    protected createCell(column: MatrixDropdownColumn): MatrixDropdownCell;
}
/**
  * A base class for matrix dropdown and matrix dynamic questions.
  */
export declare class QuestionMatrixDropdownModelBase extends Question implements IMatrixDropdownData {
    name: string;
    static addDefaultColumns(matrix: QuestionMatrixDropdownModelBase): void;
    protected generatedVisibleRows: Array<MatrixDropdownRowModelBase>;
    columnMinWidth: string;
    horizontalScroll: boolean;
    columnsChangedCallback: () => void;
    updateCellsCallback: () => void;
    constructor(name: string);
    getType(): string;
    columns: Array<MatrixDropdownColumn>;
    cellType: string;
    columnColCount: number;
    getRequiredText(): string;
    onLocaleChanged(): void;
    getColumnWidth(column: MatrixDropdownColumn): string;
    choices: Array<any>;
    optionsCaption: string;
    readonly locOptionsCaption: LocalizableString;
    addColumn(name: string, title?: string): MatrixDropdownColumn;
    readonly visibleRows: Array<MatrixDropdownRowModelBase>;
    getRowValue(rowIndex: number): any;
    setRowValue(rowIndex: number, rowValue: any): any;
    protected generateRows(): Array<MatrixDropdownRowModelBase>;
    protected createNewValue(curValue: any): any;
    protected getRowValueCore(row: MatrixDropdownRowModelBase, questionValue: any, create?: boolean): any;
    protected onBeforeValueChanged(val: any): void;
    protected onValueChanged(): void;
    supportGoNextPageAutomatic(): boolean;
    hasErrors(fireCallback?: boolean): boolean;
    protected getFirstInputElementId(): string;
    protected getFirstErrorInputElementId(): string;
    protected getFirstCellQuestion(onError: boolean): Question;
    createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
    protected createQuestionCore(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
    protected getQuestionName(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): string;
    protected getColumnChoices(column: MatrixDropdownColumn): Array<any>;
    protected getColumnOptionsCaption(column: MatrixDropdownColumn): string;
    protected createDropdown(name: string, column: MatrixDropdownColumn): QuestionDropdownModel;
    protected createCheckbox(name: string, column: MatrixDropdownColumn): QuestionCheckboxModel;
    protected createRadiogroup(name: string, column: MatrixDropdownColumn): QuestionRadiogroupModel;
    protected setSelectBaseProperties(question: QuestionSelectBase, column: MatrixDropdownColumn): void;
    protected createText(name: string, column: MatrixDropdownColumn): QuestionTextModel;
    protected createComment(name: string, column: MatrixDropdownColumn): QuestionCommentModel;
    protected createCellQuestion(questionType: string, name: string): Question;
    protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any;
    onRowChanged(row: MatrixDropdownRowModelBase, newRowValue: any): void;
}

export declare class MatrixDropdownRowModel extends MatrixDropdownRowModelBase {
    name: string;
    constructor(name: string, item: ItemValue, data: IMatrixDropdownData, value: any);
    readonly rowName: string;
    readonly text: string;
    readonly locText: LocalizableString;
}
/**
  * A Model for a matrix dropdown question. You may use a dropdown, checkbox, radiogroup, text and comment questions as a cell editors.
  */
export declare class QuestionMatrixDropdownModel extends QuestionMatrixDropdownModelBase implements IMatrixDropdownData {
    name: string;
    constructor(name: string);
    getType(): string;
    rows: Array<any>;
    onLocaleChanged(): void;
    protected generateRows(): Array<MatrixDropdownRowModel>;
    protected createMatrixRow(item: ItemValue, value: any): MatrixDropdownRowModel;
}

export declare class MatrixDynamicRowModel extends MatrixDropdownRowModelBase {
    index: number;
    constructor(index: number, data: IMatrixDropdownData, value: any);
    readonly rowName: string;
}
/**
  * A Model for a matrix dymanic question. You may use a dropdown, checkbox, radiogroup, text and comment questions as a cell editors.
  * An end-user may dynamically add/remove rows, unlike in matrix dropdown question.
  */
export declare class QuestionMatrixDynamicModel extends QuestionMatrixDropdownModelBase implements IMatrixDropdownData {
    name: string;
    static MaxRowCount: number;
    rowCountChangedCallback: () => void;
    constructor(name: string);
    getType(): string;
    rowCount: number;
    minRowCount: number;
    maxRowCount: number;
    readonly canAddRow: boolean;
    readonly canRemoveRow: boolean;
    addRow(): void;
    removeRow(index: number): void;
    addRowText: string;
    readonly locAddRowText: LocalizableString;
    removeRowText: string;
    readonly locRemoveRowText: LocalizableString;
    supportGoNextPageAutomatic(): boolean;
    readonly cachedVisibleRows: Array<MatrixDropdownRowModelBase>;
    protected onCheckForErrors(errors: Array<SurveyError>): void;
    protected generateRows(): Array<MatrixDynamicRowModel>;
    protected createMatrixRow(value: any): MatrixDynamicRowModel;
    protected onBeforeValueChanged(val: any): void;
    protected createNewValue(curValue: any): any;
    protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any;
    protected getRowValueCore(row: MatrixDropdownRowModelBase, questionValue: any, create?: boolean): any;
}

export interface IMatrixData {
    onMatrixRowChanged(row: MatrixRowModel): any;
}
export declare class MatrixRowModel extends Base {
    fullName: string;
    protected rowValue: any;
    constructor(item: ItemValue, fullName: string, data: IMatrixData, value: any);
    readonly name: string;
    readonly text: string;
    readonly locText: LocalizableString;
    value: any;
    protected onValueChanged(): void;
}
/**
  * A Model for a simple matrix question.
  */
export declare class QuestionMatrixModel extends Question implements IMatrixData {
    name: string;
    isAllRowRequired: boolean;
    constructor(name: string);
    getType(): string;
    readonly hasRows: boolean;
    columns: Array<any>;
    rows: Array<any>;
    readonly visibleRows: Array<MatrixRowModel>;
    onLocaleChanged(): void;
    supportGoNextPageAutomatic(): boolean;
    protected onCheckForErrors(errors: Array<SurveyError>): void;
    protected createMatrixRow(item: ItemValue, fullName: string, value: any): MatrixRowModel;
    protected onValueChanged(): void;
    onMatrixRowChanged(row: MatrixRowModel): void;
}

export interface IMultipleTextData {
    getMultipleTextValue(name: string): any;
    setMultipleTextValue(name: string, value: any): any;
    getIsRequiredText(): string;
    getLocale(): string;
    getMarkdownHtml(text: string): string;
}
export declare class MultipleTextItemModel extends Base implements IValidatorOwner, ILocalizableOwner {
    isRequired: boolean;
    onValueChangedCallback: (newValue: any) => void;
    validators: Array<SurveyValidator>;
    constructor(name?: any, title?: string);
    getType(): string;
    name: string;
    setData(data: IMultipleTextData): void;
    inputType: string;
    title: string;
    readonly locTitle: LocalizableString;
    readonly fullTitle: string;
    protected getFullTitle(str: string): string;
    placeHolder: string;
    readonly locPlaceHolder: LocalizableString;
    onLocaleChanged(): void;
    value: any;
    onValueChanged(newValue: any): void;
    getValidatorTitle(): string;
    getLocale(): string;
    getMarkdownHtml(text: string): string;
}
/**
  * A Model for a multiple text question.
  */
export declare class QuestionMultipleTextModel extends Question implements IMultipleTextData {
    name: string;
    colCountChangedCallback: () => void;
    itemSize: number;
    constructor(name: string);
    getType(): string;
    items: Array<MultipleTextItemModel>;
    addItem(name: string, title?: string): MultipleTextItemModel;
    onLocaleChanged(): void;
    supportGoNextPageAutomatic(): boolean;
    colCount: number;
    getRows(): Array<any>;
    protected onValueChanged(): void;
    protected createTextItem(name: string, title: string): MultipleTextItemModel;
    protected onItemValueChanged(): void;
    protected runValidators(): SurveyError;
    hasErrors(fireCallback?: boolean): boolean;
    protected hasErrorInItems(fireCallback: boolean): boolean;
    getMultipleTextValue(name: string): any;
    setMultipleTextValue(name: string, value: any): void;
    getIsRequiredText(): string;
}

export declare class QuestionRowModel {
        panel: PanelModelBase;
        visibilityChangedCallback: () => void;
        constructor(panel: PanelModelBase);
        elements: Array<IElement>;
        readonly questions: Array<IElement>;
        visible: boolean;
        updateVisible(): void;
        addElement(q: IElement): void;
        protected onVisibleChanged(): void;
}
/**
    * A base class for a Panel and Page objects.
    */
export declare class PanelModelBase extends Base implements IConditionRunner, ILocalizableOwner {
        name: string;
        parent: PanelModelBase;
        visibleIf: string;
        rowsChangedCallback: () => void;
        visibleIndex: number;
        constructor(name?: string);
        data: ISurvey;
        title: string;
        readonly locTitle: LocalizableString;
        getLocale(): string;
        getMarkdownHtml(text: string): string;
        readonly id: string;
        readonly isPanel: boolean;
        readonly questions: Array<QuestionBase>;
        readonly elements: Array<IElement>;
        containsElement(element: IElement): boolean;
        hasErrors(fireCallback?: boolean, focuseOnFirstError?: boolean): boolean;
        addQuestionsToList(list: Array<IQuestion>, visibleOnly?: boolean): void;
        readonly rows: Array<QuestionRowModel>;
        readonly isActive: boolean;
        protected readonly root: PanelModelBase;
        protected createRow(): QuestionRowModel;
        onSurveyLoad(): void;
        protected readonly isLoadingFromJson: boolean;
        protected onRowsChanged(): void;
        readonly processedTitle: string;
        protected getRendredTitle(str: string): string;
        visible: boolean;
        protected onVisibleChanged(): void;
        readonly isVisible: boolean;
        getIsPageVisible(exceptionQuestion: IQuestion): boolean;
        addElement(element: IElement, index?: number): void;
        addQuestion(question: QuestionBase, index?: number): void;
        addPanel(panel: PanelModel, index?: number): void;
        addNewQuestion(questionType: string, name: string): QuestionBase;
        addNewPanel(name: string): PanelModel;
        protected createNewPanel(name: string): PanelModel;
        removeElement(element: IElement): boolean;
        removeQuestion(question: QuestionBase): void;
        runCondition(values: HashTable<any>): void;
        onLocaleChanged(): void;
}
/**
    * A container element, similar to the Page objects. However, unlike the Page, Panel can't be a root.
    * It may contain questions and other panels.
    */
export declare class PanelModel extends PanelModelBase implements IElement {
        name: string;
        width: string;
        renderWidthChangedCallback: () => void;
        rowVisibilityChangedCallback: () => void;
        startWithNewLineChangedCallback: () => void;
        constructor(name?: string);
        getType(): string;
        setData(newValue: ISurveyData): void;
        readonly isPanel: boolean;
        innerIndent: number;
        renderWidth: string;
        startWithNewLine: boolean;
        rightIndent: number;
        protected onVisibleChanged(): void;
}

/**
  * The page object. It has elements collection, that contains questions and panels.
  */
export declare class PageModel extends PanelModelBase implements IPage {
    name: string;
    constructor(name?: string);
    getType(): string;
    num: number;
    navigationButtonsVisibility: string;
    protected getRendredTitle(str: string): string;
    focusFirstQuestion(): void;
    focusFirstErrorQuestion(): void;
    scrollToTop(): void;
    protected onNumChanged(value: number): void;
    protected onVisibleChanged(): void;
}

/**
  * Extends question base class with title, value, errors and other functionality
  */
export declare class Question extends QuestionBase implements IValidatorOwner {
    name: string;
    errors: Array<SurveyError>;
    validators: Array<SurveyValidator>;
    valueChangedCallback: () => void;
    commentChangedCallback: () => void;
    errorsChangedCallback: () => void;
    titleChangedCallback: () => void;
    constructor(name: string);
    readonly hasTitle: boolean;
    readonly hasInput: boolean;
    readonly inputId: string;
    title: string;
    readonly locTitle: LocalizableString;
    readonly locCommentText: LocalizableString;
    onLocaleChanged(): void;
    readonly processedTitle: string;
    readonly fullTitle: string;
    focus(onError?: boolean): void;
    protected getFirstInputElementId(): string;
    protected getFirstErrorInputElementId(): string;
    protected canProcessedTextValues(name: string): boolean;
    protected getProcessedTextValue(name: string): any;
    supportComment(): boolean;
    supportOther(): boolean;
    isRequired: boolean;
    hasComment: boolean;
    commentText: string;
    hasOther: boolean;
    protected hasOtherChanged(): void;
    readonly isReadOnly: boolean;
    readOnly: boolean;
    onReadOnlyChanged(): void;
    protected readonly no: string;
    protected onSetData(): void;
    value: any;
    comment: string;
    protected getComment(): string;
    protected setComment(newValue: string): void;
    isEmpty(): boolean;
    hasErrors(fireCallback?: boolean): boolean;
    readonly currentErrorCount: number;
    readonly requiredText: string;
    addError(error: SurveyError): void;
    protected onCheckForErrors(errors: Array<SurveyError>): void;
    protected hasRequiredError(): boolean;
    protected runValidators(): SurveyError;
    protected setNewValue(newValue: any): void;
    protected setNewValueInData(newValue: any): void;
    protected valueFromData(val: any): any;
    protected valueToData(val: any): any;
    protected onValueChanged(): void;
    protected setNewComment(newValue: string): void;
    onSurveyValueChanged(newValue: any): void;
    getValidatorTitle(): string;
}

/**
  * A base class for all questions. QuestionBase doesn't have information about title, values, errors and so on.
  * Those properties are defined in the Question class.
  */
export declare class QuestionBase extends Base implements IQuestion, IConditionRunner, ILocalizableOwner {
    name: string;
    protected data: ISurveyData;
    customWidget: QuestionCustomWidget;
    customWidgetData: {
        isNeedRender: boolean;
    };
    visibleIf: string;
    width: string;
    localeChanged: Event<(sender: QuestionBase) => any, any>;
    focusCallback: () => void;
    renderWidthChangedCallback: () => void;
    rowVisibilityChangedCallback: () => void;
    startWithNewLineChangedCallback: () => void;
    visibilityChangedCallback: () => void;
    visibleIndexChangedCallback: () => void;
    readOnlyChangedCallback: () => void;
    constructor(name: string);
    readonly isPanel: boolean;
    visible: boolean;
    readonly isVisible: boolean;
    readonly isReadOnly: boolean;
    readonly visibleIndex: number;
    hasErrors(fireCallback?: boolean): boolean;
    readonly currentErrorCount: number;
    readonly hasTitle: boolean;
    readonly hasInput: boolean;
    readonly hasComment: boolean;
    readonly id: string;
    startWithNewLine: boolean;
    renderWidth: string;
    indent: number;
    rightIndent: number;
    focus(onError?: boolean): void;
    setData(newValue: ISurveyData): void;
    readonly survey: ISurvey;
    protected fireCallback(callback: () => void): void;
    protected onSetData(): void;
    protected onCreating(): void;
    runCondition(values: HashTable<any>): void;
    onSurveyValueChanged(newValue: any): void;
    onSurveyLoad(): void;
    setVisibleIndex(value: number): void;
    supportGoNextPageAutomatic(): boolean;
    clearUnusedValues(): void;
    onLocaleChanged(): void;
    onReadOnlyChanged(): void;
    getLocale(): string;
    getMarkdownHtml(text: string): string;
}

/**
    * It is a base class for checkbox, dropdown and radiogroup questions.
    */
export declare class QuestionSelectBase extends Question {
        protected cachedValue: any;
        choicesByUrl: ChoicesRestfull;
        storeOthersAsComment: boolean;
        choicesChangedCallback: () => void;
        constructor(name: string);
        readonly otherItem: ItemValue;
        readonly isOtherSelected: boolean;
        protected getHasOther(val: any): boolean;
        protected createRestfull(): ChoicesRestfull;
        protected getComment(): string;
        protected setComment(newValue: string): void;
        protected setNewValue(newValue: any): void;
        protected valueFromData(val: any): any;
        protected valueToData(val: any): any;
        protected valueFromDataCore(val: any): any;
        protected valueToDataCore(val: any): any;
        protected hasUnknownValue(val: any): boolean;
        choices: Array<any>;
        protected hasOtherChanged(): void;
        choicesOrder: string;
        otherText: string;
        otherErrorText: string;
        readonly locOtherText: LocalizableString;
        readonly locOtherErrorText: LocalizableString;
        readonly visibleChoices: Array<ItemValue>;
        supportComment(): boolean;
        supportOther(): boolean;
        protected onCheckForErrors(errors: Array<SurveyError>): void;
        onLocaleChanged(): void;
        protected getStoreOthersAsComment(): boolean;
        onSurveyLoad(): void;
        clearUnusedValues(): void;
}
/**
    * A base class for checkbox and radiogroup questions. It introduced a colCount property.
    */
export declare class QuestionCheckboxBase extends QuestionSelectBase {
        name: string;
        colCountChangedCallback: () => void;
        constructor(name: string);
        colCount: number;
}

/**
  * A Model for a checkbox question
  */
export declare class QuestionCheckboxModel extends QuestionCheckboxBase {
    name: string;
    constructor(name: string);
    protected getHasOther(val: any): boolean;
    protected valueFromData(val: any): any;
    protected valueFromDataCore(val: any): any;
    protected valueToDataCore(val: any): any;
    getType(): string;
}

/**
  * A Model for a comment question
  */
export declare class QuestionCommentModel extends Question {
    name: string;
    rows: number;
    cols: number;
    constructor(name: string);
    placeHolder: string;
    readonly locPlaceHolder: LocalizableString;
    getType(): string;
    isEmpty(): boolean;
}

/**
  * A Model for a dropdown question
  */
export declare class QuestionDropdownModel extends QuestionSelectBase {
    name: string;
    constructor(name: string);
    optionsCaption: string;
    readonly locOptionsCaption: LocalizableString;
    getType(): string;
    onLocaleChanged(): void;
    supportGoNextPageAutomatic(): boolean;
}

export declare class QuestionFactory {
    static Instance: QuestionFactory;
    static readonly DefaultChoices: string[];
    static readonly DefaultColums: string[];
    static readonly DefaultRows: string[];
    registerQuestion(questionType: string, questionCreator: (name: string) => QuestionBase): void;
    clear(): void;
    getAllTypes(): Array<string>;
    createQuestion(questionType: string, name: string): QuestionBase;
}
export declare class ElementFactory {
    static Instance: ElementFactory;
    registerElement(elementType: string, elementCreator: (name: string) => IElement): void;
    clear(): void;
    getAllTypes(): Array<string>;
    createElement(elementType: string, name: string): IElement;
}

/**
  * A Model for a file question
  */
export declare class QuestionFileModel extends Question {
    name: string;
    previewValueLoadedCallback: () => void;
    imageHeight: string;
    imageWidth: string;
    storeDataAsText: boolean;
    maxSize: number;
    constructor(name: string);
    getType(): string;
    showPreview: boolean;
    loadFile(file: File): void;
    previewValue: any;
    protected setFileValue(file: File): void;
    protected onCheckForErrors(errors: Array<SurveyError>): void;
}

/**
  * A Model for html question. Unlike other questions it doesn't have value and title.
  */
export declare class QuestionHtmlModel extends QuestionBase {
    name: string;
    constructor(name: string);
    getType(): string;
    html: string;
    readonly locHtml: LocalizableString;
    readonly processedHtml: string;
}

/**
  * A Model for a radiogroup question.
  */
export declare class QuestionRadiogroupModel extends QuestionCheckboxBase {
    name: string;
    constructor(name: string);
    getType(): string;
    supportGoNextPageAutomatic(): boolean;
}

/**
  * A Model for a rating question.
  */
export declare class QuestionRatingModel extends Question {
    name: string;
    static defaultRateValues: ItemValue[];
    rateValuesChangedCallback: () => void;
    constructor(name: string);
    rateValues: Array<any>;
    readonly visibleRateValues: ItemValue[];
    getType(): string;
    supportGoNextPageAutomatic(): boolean;
    supportComment(): boolean;
    supportOther(): boolean;
    minRateDescription: string;
    readonly locMinRateDescription: LocalizableString;
    maxRateDescription: string;
    readonly locMaxRateDescription: LocalizableString;
}

/**
  * A Model for an input text question.
  */
export declare class QuestionTextModel extends Question {
    name: string;
    size: number;
    constructor(name: string);
    getType(): string;
    inputType: string;
    isEmpty(): boolean;
    supportGoNextPageAutomatic(): boolean;
    placeHolder: string;
    readonly locPlaceHolder: LocalizableString;
    protected setNewValue(newValue: any): void;
    protected correctValueType(newValue: any): any;
}

/**
    * Survey object contains information about the survey. Pages, Questions, flow logic and etc.
    */
export declare class SurveyModel extends Base implements ISurvey, ISurveyTriggerOwner, ILocalizableOwner {
        surveyId: string;
        surveyPostId: string;
        clientId: string;
        /**
            * If the property is not empty, before starting to run the survey, the library checkes if the cookie with this name exists. If it is true, the survey goes to complete mode and an user sees the 'Thank you' page. On completing the survey the cookie with this name is created.
            */
        cookieName: string;
        sendResultOnPageNext: boolean;
        /**
            * You may show comments input for the most of questions. The entered text in the comment input will be saved as 'question name' + 'commentPrefix'.
            */
        commentPrefix: string;
        /**
            * On showing the next or previous page, a first input is focused, if the property set to true.
            */
        focusFirstQuestionAutomatic: boolean;
        /**
            * Set it to false to hide 'Prev', 'Next' and 'Complete' buttons. It makes sense if you are going to create a custom navigation or have just one page or on setting goNextPageAutomatic property.
            * @see goNextPageAutomatic
            */
        showNavigationButtons: boolean;
        /**
            * Set it to false hide survey title.
            */
        showTitle: boolean;
        /**
            * Set it to false to hide page titles.
            */
        showPageTitles: boolean;
        /**
            * On finishing the survey the 'Thank you', page on complete, is shown. Set the property to false, to hide the 'Thank you' page.
            */
        showCompletedPage: boolean;
        /**
            * A char/string that will be rendered in the title required questions.
            */
        requiredText: string;
        /**
            * By default the first question index is 1. You may start it from 100 or from 'A', by setting 100 or 'A' to this property.
            */
        questionStartIndex: string;
        storeOthersAsComment: boolean;
        goNextPageAutomatic: boolean;
        pages: Array<PageModel>;
        triggers: Array<SurveyTrigger>;
        clearInvisibleValues: boolean;
        onComplete: Event<(sender: SurveyModel) => any, any>;
        onPartialSend: Event<(sender: SurveyModel) => any, any>;
        onCurrentPageChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        onValueChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        onVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        onPageVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        onQuestionAdded: Event<(sender: SurveyModel, options: any) => any, any>;
        onQuestionRemoved: Event<(sender: SurveyModel, options: any) => any, any>;
        onPanelAdded: Event<(sender: SurveyModel, options: any) => any, any>;
        onPanelRemoved: Event<(sender: SurveyModel, options: any) => any, any>;
        onValidateQuestion: Event<(sender: SurveyModel, options: any) => any, any>;
        onServerValidateQuestions: (sender: SurveyModel, options: any) => any;
        onProcessHtml: Event<(sender: SurveyModel, options: any) => any, any>;
        onTextMarkdown: Event<(sender: SurveyModel, options: any) => any, any>;
        onSendResult: Event<(sender: SurveyModel, options: any) => any, any>;
        onGetResult: Event<(sender: SurveyModel, options: any) => any, any>;
        onUploadFile: Event<(sender: SurveyModel, options: any) => any, any>;
        onAfterRenderSurvey: Event<(sender: SurveyModel, options: any) => any, any>;
        onAfterRenderPage: Event<(sender: SurveyModel, options: any) => any, any>;
        onAfterRenderQuestion: Event<(sender: SurveyModel, options: any) => any, any>;
        onAfterRenderPanel: Event<(sender: SurveyModel, options: any) => any, any>;
        onMatrixRowAdded: Event<(sender: SurveyModel, options: any) => any, any>;
        jsonErrors: Array<JsonError>;
        constructor(jsonObj?: any);
        getType(): string;
        locale: string;
        getLocale(): string;
        getMarkdownHtml(text: string): any;
        getLocString(str: string): any;
        readonly emptySurveyText: string;
        title: string;
        readonly locTitle: LocalizableString;
        completedHtml: string;
        readonly locCompletedHtml: LocalizableString;
        pagePrevText: string;
        readonly locPagePrevText: LocalizableString;
        pageNextText: string;
        readonly locPageNextText: LocalizableString;
        completeText: string;
        readonly locCompleteText: LocalizableString;
        questionTitleTemplate: string;
        getQuestionTitleTemplate(): string;
        readonly locQuestionTitleTemplate: LocalizableString;
        showPageNumbers: boolean;
        showQuestionNumbers: string;
        showProgressBar: string;
        readonly processedTitle: string;
        questionTitleLocation: string;
        mode: string;
        data: any;
        protected _setDataValue(data: any, key: string): void;
        readonly comments: any;
        readonly visiblePages: Array<PageModel>;
        readonly isEmpty: boolean;
        /**
            * depricated, misspelling, use pageCount property
            */
        readonly PageCount: number;
        readonly pageCount: number;
        readonly visiblePageCount: number;
        currentPage: PageModel;
        currentPageNo: number;
        focusFirstQuestion(): void;
        readonly state: string;
        clear(clearData?: boolean, gotoFirstPage?: boolean): void;
        protected mergeValues(src: any, dest: any): void;
        protected updateCustomWidgets(page: PageModel): void;
        protected currentPageChanged(newValue: PageModel, oldValue: PageModel): void;
        getProgress(): number;
        readonly isNavigationButtonsShowing: boolean;
        readonly isEditMode: boolean;
        readonly isDisplayMode: boolean;
        readonly isDesignMode: boolean;
        setDesignMode(value: boolean): void;
        readonly hasCookie: boolean;
        setCookie(): void;
        deleteCookie(): void;
        nextPage(): boolean;
        readonly isCurrentPageHasErrors: boolean;
        prevPage(): boolean;
        completeLastPage(): boolean;
        readonly isFirstPage: boolean;
        readonly isLastPage: boolean;
        doComplete(): void;
        readonly isValidatingOnServer: boolean;
        protected onIsValidatingOnServerChanged(): void;
        protected doServerValidation(): boolean;
        protected doNextPage(): void;
        protected setCompleted(): void;
        readonly processedCompletedHtml: string;
        readonly processedLoadingHtml: string;
        readonly progressText: string;
        protected afterRenderSurvey(htmlElement: any): void;
        afterRenderPage(htmlElement: any): void;
        afterRenderQuestion(question: IQuestion, htmlElement: any): void;
        afterRenderPanel(panel: IElement, htmlElement: any): void;
        matrixRowAdded(question: IQuestion): void;
        uploadFile(name: string, file: File, storeDataAsText: boolean, uploadingCallback: (status: string) => any): boolean;
        protected uploadFileCore(name: string, file: File, uploadingCallback: (status: string) => any): void;
        getPage(index: number): PageModel;
        addPage(page: PageModel): void;
        addNewPage(name: string): PageModel;
        removePage(page: PageModel): void;
        getQuestionByName(name: string, caseInsensitive?: boolean): IQuestion;
        getQuestionsByNames(names: string[], caseInsensitive?: boolean): IQuestion[];
        getPageByElement(element: IElement): PageModel;
        getPageByQuestion(question: IQuestion): PageModel;
        getPageByName(name: string): PageModel;
        getPagesByNames(names: string[]): PageModel[];
        getAllQuestions(visibleOnly?: boolean): Array<IQuestion>;
        protected createNewPage(name: string): PageModel;
        protected doSurveyValueChanged(question: IQuestion, newValue: any): void;
        sendResult(postId?: string, clientId?: string, isPartialCompleted?: boolean): void;
        getResult(resultId: string, name: string): void;
        loadSurveyFromService(surveyId?: string): void;
        protected onLoadingSurveyFromService(): void;
        protected onLoadSurveyFromService(): void;
        readonly isLoadingFromJson: boolean;
        protected onBeforeCreating(): void;
        protected onCreating(): void;
        getVariable(name: string): any;
        setVariable(name: string, newValue: any): void;
        protected getUnbindValue(value: any): any;
        getValue(name: string): any;
        setValue(name: string, newValue: any): void;
        protected tryGoNextPageAutomatic(name: string): void;
        getComment(name: string): string;
        setComment(name: string, newValue: string): void;
        /**
            * Remove the value from the survey result.
            * @param {string} name The name of the value. Typically it is a question name
            */
        clearValue(name: string): void;
        questionVisibilityChanged(question: IQuestion, newValue: boolean): void;
        pageVisibilityChanged(page: IPage, newValue: boolean): void;
        questionAdded(question: IQuestion, index: number, parentPanel: any, rootPanel: any): void;
        questionRemoved(question: IQuestion): void;
        panelAdded(panel: IElement, index: number, parentPanel: any, rootPanel: any): void;
        panelRemoved(panel: IElement): void;
        validateQuestion(name: string): SurveyError;
        processHtml(html: string): string;
        processText(text: string): string;
        getObjects(pages: string[], questions: string[]): any[];
        setTriggerValue(name: string, value: any, isVariable: boolean): void;
}

/**
    * A base class for all triggers.
    * A trigger calls a method when the expression change the result: from false to true or from true to false.
    * Please note, it runs only one changing the expression result.
    */
export declare class Trigger extends Base {
        static operatorsValue: HashTable<Function>;
        static readonly operators: HashTable<Function>;
        value: any;
        constructor();
        operator: string;
        check(value: any): void;
        protected onSuccess(): void;
        protected onFailure(): void;
}
export interface ISurveyTriggerOwner {
        getObjects(pages: string[], questions: string[]): any[];
        doComplete(): any;
        setTriggerValue(name: string, value: any, isVariable: boolean): any;
}
/**
    * It extends the Trigger base class and add properties required for SurveyJS classes.
    */
export declare class SurveyTrigger extends Trigger {
        name: string;
        protected owner: ISurveyTriggerOwner;
        constructor();
        setOwner(owner: ISurveyTriggerOwner): void;
        readonly isOnNextPage: boolean;
}
/**
    * If expression returns true, it makes questions/pages visible.
    * Ohterwise it makes them invisible.
    */
export declare class SurveyTriggerVisible extends SurveyTrigger {
        pages: string[];
        questions: string[];
        constructor();
        getType(): string;
        protected onSuccess(): void;
        protected onFailure(): void;
        protected onItemSuccess(item: any): void;
        protected onItemFailure(item: any): void;
}
/**
    * If expression returns true, it completes the survey.
    */
export declare class SurveyTriggerComplete extends SurveyTrigger {
        constructor();
        getType(): string;
        readonly isOnNextPage: boolean;
        protected onSuccess(): void;
}
export declare class SurveyTriggerSetValue extends SurveyTrigger {
        setToName: string;
        setValue: any;
        isVariable: boolean;
        constructor();
        getType(): string;
        protected onSuccess(): void;
}

/**
  * A Model for a survey running in the Window.
  */
export declare class SurveyWindowModel extends Base {
    static surveyElementName: string;
    surveyValue: SurveyModel;
    windowElement: HTMLDivElement;
    isShowingValue: boolean;
    isExpandedValue: boolean;
    templateValue: string;
    constructor(jsonObj: any);
    getType(): string;
    readonly survey: SurveyModel;
    readonly isShowing: boolean;
    readonly isExpanded: boolean;
    title: string;
    readonly locTitle: LocalizableString;
    expand(): void;
    collapse(): void;
    protected createSurvey(jsonObj: any): SurveyModel;
    protected expandcollapse(value: boolean): void;
}

export declare class TextPreProcessorItem {
    start: number;
    end: number;
}
export declare class TextPreProcessor {
    onProcess: (name: string) => any;
    onHasValue: (name: string) => boolean;
    constructor();
    process(text: string): string;
}

/**
  * The class contains methods to work with www.dxsurvey.com service.
  */
export declare class dxSurveyService {
    static serviceUrl: string;
    constructor();
    loadSurvey(surveyId: string, onLoad: (success: boolean, result: string, response: any) => void): void;
    sendResult(postId: string, result: JSON, onSendResult: (success: boolean, response: any) => void, clientId?: string, isPartialCompleted?: boolean): void;
    sendFile(postId: string, file: File, onSendFile: (success: boolean, response: any) => void): void;
    getResult(resultId: string, name: string, onGetResult: (success: boolean, data: any, dataList: Array<any>, response: any) => void): void;
    isCompleted(resultId: string, clientId: string, onIsCompleted: (success: boolean, result: string, response: any) => void): void;
}

export declare var surveyLocalization: {
    currentLocale: string;
    locales: {};
    getString: (strName: string) => any;
    getLocales: () => string[];
};
export declare var surveyStrings: {
    pagePrevText: string;
    pageNextText: string;
    completeText: string;
    otherItemText: string;
    progressText: string;
    emptySurvey: string;
    completingSurvey: string;
    loadingSurvey: string;
    optionsCaption: string;
    requiredError: string;
    requiredInAllRowsError: string;
    numericError: string;
    textMinLength: string;
    textMaxLength: string;
    textMinMaxLength: string;
    minRowCountError: string;
    minSelectError: string;
    maxSelectError: string;
    numericMinMax: string;
    numericMin: string;
    numericMax: string;
    invalidEmail: string;
    urlRequestError: string;
    urlGetChoicesError: string;
    exceedMaxSize: string;
    otherRequiredError: string;
    uploadingFile: string;
    addRow: string;
    removeRow: string;
    choices_firstItem: string;
    choices_secondItem: string;
    choices_thirdItem: string;
    matrix_column: string;
    matrix_row: string;
};

export declare class QuestionCustomWidget {
    name: string;
    widgetJson: any;
    htmlTemplate: string;
    constructor(name: string, widgetJson: any);
    afterRender(question: IQuestion, el: any): void;
    willUnmount(question: IQuestion, el: any): void;
    isFit(question: IQuestion): boolean;
}
export declare class CustomWidgetCollection {
    static Instance: CustomWidgetCollection;
    onCustomWidgetAdded: Event<(customWidget: QuestionCustomWidget) => any, any>;
    readonly widgets: Array<QuestionCustomWidget>;
    addCustomWidget(widgetJson: any): void;
    clear(): void;
    getCustomWidget(question: IQuestion): QuestionCustomWidget;
}

