// Type definitions for Survey JavaScript library v0.9.11
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

declare module Survey {
    interface HashTable<T> {
        [key: string]: T;
    }
    interface ISurveyData {
        getValue(name: string): any;
        setValue(name: string, newValue: any): any;
        getComment(name: string): string;
        setComment(name: string, newValue: string): any;
    }
    interface ISurvey extends ISurveyData {
        currentPage: IPage;
        pageVisibilityChanged(page: IPage, newValue: boolean): any;
        questionVisibilityChanged(question: IQuestion, newValue: boolean): any;
        questionAdded(question: IQuestion, index: number): any;
        questionRemoved(question: IQuestion): any;
        validateQuestion(name: string): SurveyError;
        processHtml(html: string): string;
        processText(text: string): string;
        isDesignMode: boolean;
        requiredText: string;
        questionStartIndex: string;
        questionTitleTemplate: string;
        storeOthersAsComment: boolean;
        uploadFile(name: string, file: File, storeDataAsText: boolean, uploadingCallback: (status: string) => any): boolean;
    }
    interface IConditionRunner {
        runCondition(values: HashTable<any>): any;
    }
    interface IQuestion extends IConditionRunner {
        name: string;
        visible: boolean;
        hasTitle: boolean;
        setVisibleIndex(value: number): any;
        onSurveyValueChanged(newValue: any): any;
        onSurveyLoad(): any;
        supportGoNextPageAutomatic(): boolean;
    }
    interface IPage extends IConditionRunner {
        visible: boolean;
    }
    class ItemValue {
        static Separator: string;
        static setData(items: Array<ItemValue>, values: Array<any>): void;
        static getData(items: Array<ItemValue>): any;
        private itemValue;
        private itemText;
        constructor(value: any, text?: string);
        getType(): string;
        value: any;
        hasText: boolean;
        text: string;
    }
    class Base {
        getType(): string;
    }
    class SurveyError {
        getText(): string;
    }
    class Event<T extends Function, Options> {
        private callbacks;
        isEmpty: boolean;
        fire(sender: any, options: Options): void;
        add(func: T): void;
        remove(func: T): void;
    }
}

/// <reference path="base.d.ts" />
declare module Survey {
    class JsonObjectProperty {
        name: string;
        private typeValue;
        private choicesValue;
        private choicesfunc;
        className: string;
        classNamePart: string;
        baseClassName: string;
        defaultValue: any;
        onGetValue: (obj: any) => any;
        onSetValue: (obj: any, value: any, jsonConv: JsonObject) => any;
        constructor(name: string);
        type: string;
        hasToUseGetValue: (obj: any) => any;
        isDefaultValue(value: any): boolean;
        getValue(obj: any): any;
        hasToUseSetValue: (obj: any, value: any, jsonConv: JsonObject) => any;
        setValue(obj: any, value: any, jsonConv: JsonObject): void;
        getObjType(objType: string): string;
        getClassName(className: string): string;
        choices: Array<any>;
        setChoices(value: Array<any>, valueFunc: () => Array<any>): void;
    }
    class JsonMetadataClass {
        name: string;
        creator: () => any;
        parentName: string;
        static requiredSymbol: string;
        static typeSymbol: string;
        properties: Array<JsonObjectProperty>;
        requiredProperties: Array<string>;
        constructor(name: string, properties: Array<any>, creator?: () => any, parentName?: string);
        find(name: string): JsonObjectProperty;
        private createProperty(propInfo);
        private getPropertyName(propertyName);
        private makePropertyRequired(propertyName);
    }
    class JsonMetadata {
        private classes;
        private childrenClasses;
        private classProperties;
        private classRequiredProperties;
        addClass(name: string, properties: Array<any>, creator?: () => any, parentName?: string): JsonMetadataClass;
        overrideClassCreatore(name: string, creator: () => any): void;
        getProperties(name: string): Array<JsonObjectProperty>;
        createClass(name: string): any;
        getChildrenClasses(name: string, canBeCreated?: boolean): Array<JsonMetadataClass>;
        getRequiredProperties(name: string): Array<string>;
        private fillChildrenClasses(name, canBeCreated, result);
        private findClass(name);
        private fillProperties(name, list);
        private addProperty(property, list, endIndex);
        private fillRequiredProperties(name, list);
    }
    class JsonError {
        type: string;
        message: string;
        description: string;
        at: Number;
        constructor(type: string, message: string);
        getFullDescription(): string;
    }
    class JsonUnknownPropertyError extends JsonError {
        propertyName: string;
        className: string;
        constructor(propertyName: string, className: string);
    }
    class JsonMissingTypeErrorBase extends JsonError {
        baseClassName: string;
        type: string;
        message: string;
        constructor(baseClassName: string, type: string, message: string);
    }
    class JsonMissingTypeError extends JsonMissingTypeErrorBase {
        propertyName: string;
        baseClassName: string;
        constructor(propertyName: string, baseClassName: string);
    }
    class JsonIncorrectTypeError extends JsonMissingTypeErrorBase {
        propertyName: string;
        baseClassName: string;
        constructor(propertyName: string, baseClassName: string);
    }
    class JsonRequiredPropertyError extends JsonError {
        propertyName: string;
        className: string;
        constructor(propertyName: string, className: string);
    }
    class JsonObject {
        private static typePropertyName;
        private static positionPropertyName;
        private static metaDataValue;
        static metaData: JsonMetadata;
        errors: JsonError[];
        toJsonObject(obj: any): any;
        toObject(jsonObj: any, obj: any): void;
        protected toJsonObjectCore(obj: any, property: JsonObjectProperty): any;
        protected valueToJson(obj: any, result: any, property: JsonObjectProperty): void;
        protected valueToObj(value: any, obj: any, key: any, property: JsonObjectProperty): void;
        private isValueArray(value);
        private createNewObj(value, property);
        private checkNewObjectOnErrors(newObj, value, property, className);
        private addNewError(error, jsonObj);
        private valueToArray(value, obj, key, property);
        private findProperty(properties, key);
    }
}

/// <reference path="base.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class ChoicesRestfull extends Base {
        url: string;
        path: string;
        valueName: string;
        titleName: string;
        getResultCallback: (items: Array<ItemValue>) => void;
        error: SurveyError;
        constructor();
        run(): void;
        getType(): string;
        isEmpty: boolean;
        setData(json: any): void;
        clear(): void;
        protected onLoad(result: any): void;
        private onError(status, response);
        private getResultAfterPath(result);
        private getPathes();
        private getValue(item);
        private getTitle(item);
    }
}

/// <reference path="base.d.ts" />
/// <reference path="conditions.d.ts" />
declare module Survey {
    class ConditionsParser {
        private text;
        private root;
        private expressionNodes;
        private node;
        private at;
        private length;
        parse(text: string, root: ConditionNode): boolean;
        toString(root: ConditionNode): string;
        private toStringCore(value);
        private nodeToString(node);
        private conditionToString(condition);
        private operationToString(op);
        private isNumeric(value);
        private parseText();
        private readConditions();
        private readCondition();
        private readExpression();
        private ch;
        private skip();
        private isSpace(c);
        private isQuotes(c);
        private isOperatorChar(c);
        private isBrackets(c);
        private readString();
        private isNoRightOperation(op);
        private readOperator();
        private readConnective();
        private pushExpression();
        private popExpression();
        private addCondition(c);
        private addConnective(con);
    }
}

/// <reference path="conditionsParser.d.ts" />
declare module Survey {
    class Condition {
        static operatorsValue: HashTable<Function>;
        static operators: HashTable<Function>;
        private opValue;
        left: any;
        right: any;
        operator: string;
        perform(left?: any, right?: any): boolean;
        private getPureValue(val);
    }
    class ConditionNode {
        private connectiveValue;
        children: Array<any>;
        constructor();
        connective: string;
        isEmpty: boolean;
        clear(): void;
    }
    class ConditionRunner {
        private expressionValue;
        private root;
        private values;
        constructor(expression: string);
        expression: string;
        run(values: HashTable<any>): boolean;
        private runNode(node);
        private runNodeCondition(value);
        private runCondition(condition);
    }
}

declare module Survey {
    class dxSurveyService {
        static serviceUrl: string;
        constructor();
        loadSurvey(surveyId: string, onLoad: (success: boolean, result: string, response: any) => void): void;
        sendResult(postId: string, result: JSON, onSendResult: (success: boolean, response: any) => void, clientId?: string, isPartialCompleted?: boolean): void;
        sendFile(postId: string, file: File, onSendFile: (success: boolean, response: any) => void): void;
        getResult(resultId: string, name: string, onGetResult: (success: boolean, data: any, dataList: Array<any>, response: any) => void): void;
        isCompleted(resultId: string, clientId: string, onIsCompleted: (success: boolean, result: string, response: any) => void): void;
    }
}

declare module Survey {
    var surveyLocalization: {
        currentLocale: string;
        locales: {};
        getString: (strName: string) => any;
        getLocales: () => string[];
    };
    var surveyStrings: {
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
        numericError: string;
        textMinLength: string;
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
    };
}

/// <reference path="base.d.ts" />
/// <reference path="surveyStrings.d.ts" />
declare module Survey {
    class AnswerRequiredError extends SurveyError {
        constructor();
        getText(): string;
    }
    class RequreNumericError extends SurveyError {
        constructor();
        getText(): string;
    }
    class ExceedSizeError extends SurveyError {
        private maxSize;
        constructor(maxSize: number);
        getText(): string;
        private getTextSize();
    }
    class CustomError extends SurveyError {
        private text;
        constructor(text: string);
        getText(): string;
    }
}

/// <reference path="base.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class QuestionBase extends Base implements IQuestion, IConditionRunner {
        name: string;
        private static questionCounter;
        private static getQuestionId();
        protected data: ISurveyData;
        protected survey: ISurvey;
        private conditionRunner;
        visibleIf: string;
        private idValue;
        private visibleValue;
        startWithNewLine: boolean;
        private visibleIndexValue;
        width: string;
        private renderWidthValue;
        indent: number;
        rightIndent: number;
        focusCallback: () => void;
        renderWidthChangedCallback: () => void;
        rowVisibilityChangedCallback: () => void;
        visibilityChangedCallback: () => void;
        visibleIndexChangedCallback: () => void;
        constructor(name: string);
        visible: boolean;
        visibleIndex: number;
        hasErrors(fireCallback?: boolean): boolean;
        hasTitle: boolean;
        hasComment: boolean;
        id: string;
        renderWidth: string;
        focus(): void;
        setData(newValue: ISurveyData): void;
        protected fireCallback(callback: () => void): void;
        protected onSetData(): void;
        protected onCreating(): void;
        runCondition(values: HashTable<any>): void;
        onSurveyValueChanged(newValue: any): void;
        onSurveyLoad(): void;
        setVisibleIndex(value: number): void;
        supportGoNextPageAutomatic(): boolean;
    }
}

/// <reference path="questionbase.d.ts" />
/// <reference path="base.d.ts" />
declare module Survey {
    class QuestionFactory {
        static Instance: QuestionFactory;
        static DefaultChoices: string[];
        private creatorHash;
        registerQuestion(questionType: string, questionCreator: (name: string) => QuestionBase): void;
        getAllTypes(): Array<string>;
        createQuestion(questionType: string, name: string): QuestionBase;
    }
}

/// <reference path="questionbase.d.ts" />
/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class QuestionRowModel {
        page: PageModel;
        question: QuestionBase;
        private visibleValue;
        visibilityChangedCallback: () => void;
        constructor(page: PageModel, question: QuestionBase);
        questions: Array<QuestionBase>;
        visible: boolean;
        updateVisible(): void;
        addQuestion(q: QuestionBase): void;
        protected onVisibleChanged(): void;
        setWidth(): void;
        private onRowVisibilityChanged();
        private getVisibleCount();
        private isQuestionVisible(q);
        private calcVisible();
    }
    class PageModel extends Base implements IPage, IConditionRunner {
        name: string;
        private rowValues;
        private conditionRunner;
        questions: Array<QuestionBase>;
        data: ISurvey;
        visibleIf: string;
        title: string;
        visibleIndex: number;
        private numValue;
        private visibleValue;
        constructor(name?: string);
        rows: Array<QuestionRowModel>;
        isActive: boolean;
        isQuestionVisible(question: QuestionBase): boolean;
        protected createRow(question: QuestionBase): QuestionRowModel;
        private isDesignMode;
        private buildRows();
        onRowVisibilityChanged(row: QuestionRowModel): void;
        processedTitle: string;
        num: number;
        visible: boolean;
        getType(): string;
        isVisible: boolean;
        addQuestion(question: QuestionBase, index?: number): void;
        addNewQuestion(questionType: string, name: string): QuestionBase;
        removeQuestion(question: QuestionBase): void;
        scrollToFirstQuestion(): void;
        hasErrors(fireCallback?: boolean, focuseOnFirstError?: boolean): boolean;
        addQuestionsToList(list: Array<IQuestion>, visibleOnly?: boolean): void;
        runCondition(values: HashTable<any>): void;
        protected onNumChanged(value: number): void;
    }
}

/// <reference path="base.d.ts" />
/// <reference path="error.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class ValidatorResult {
        value: any;
        error: SurveyError;
        constructor(value: any, error?: SurveyError);
    }
    class SurveyValidator extends Base {
        text: string;
        constructor();
        protected getErrorText(name: string): string;
        protected getDefaultErrorText(name: string): string;
        validate(value: any, name?: string): ValidatorResult;
    }
    interface IValidatorOwner {
        validators: Array<SurveyValidator>;
        value: any;
        getValidatorTitle(): string;
    }
    class ValidatorRunner {
        run(owner: IValidatorOwner): SurveyError;
    }
    class NumericValidator extends SurveyValidator {
        minValue: number;
        maxValue: number;
        constructor(minValue?: number, maxValue?: number);
        getType(): string;
        validate(value: any, name?: string): ValidatorResult;
        protected getDefaultErrorText(name: string): any;
        private isNumber(value);
    }
    class TextValidator extends SurveyValidator {
        minLength: number;
        constructor(minLength?: number);
        getType(): string;
        validate(value: any, name?: string): ValidatorResult;
        protected getDefaultErrorText(name: string): any;
    }
    class AnswerCountValidator extends SurveyValidator {
        minCount: number;
        maxCount: number;
        constructor(minCount?: number, maxCount?: number);
        getType(): string;
        validate(value: any, name?: string): ValidatorResult;
        protected getDefaultErrorText(name: string): string;
    }
    class RegexValidator extends SurveyValidator {
        regex: string;
        constructor(regex?: string);
        getType(): string;
        validate(value: any, name?: string): ValidatorResult;
    }
    class EmailValidator extends SurveyValidator {
        private re;
        constructor();
        getType(): string;
        validate(value: any, name?: string): ValidatorResult;
        protected getDefaultErrorText(name: string): any;
    }
}

declare module Survey {
    class TextPreProcessor {
        onProcess: (name: string) => any;
        onHasValue: (name: string) => boolean;
        constructor();
        process(text: string): string;
        private getItems(text);
        private getName(name);
        private canProcessName(name);
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="error.d.ts" />
/// <reference path="validator.d.ts" />
/// <reference path="jsonobject.d.ts" />
/// <reference path="questionbase.d.ts" />
/// <reference path="textPreProcessor.d.ts" />
declare module Survey {
    class Question extends QuestionBase implements IValidatorOwner {
        name: string;
        private titleValue;
        private questionValue;
        private questionComment;
        private isRequiredValue;
        private hasCommentValue;
        private hasOtherValue;
        private commentTextValue;
        private textPreProcessor;
        errors: Array<SurveyError>;
        validators: Array<SurveyValidator>;
        valueChangedCallback: () => void;
        commentChangedCallback: () => void;
        errorsChangedCallback: () => void;
        titleChangedCallback: () => void;
        constructor(name: string);
        hasTitle: boolean;
        title: string;
        processedTitle: string;
        fullTitle: string;
        protected canProcessedTextValues(name: string): boolean;
        protected getProcessedTextValue(name: string): any;
        supportComment(): boolean;
        supportOther(): boolean;
        isRequired: boolean;
        hasComment: boolean;
        commentText: string;
        hasOther: boolean;
        protected no: string;
        protected onSetData(): void;
        value: any;
        comment: string;
        protected getComment(): string;
        protected setComment(newValue: string): void;
        isEmpty(): boolean;
        hasErrors(fireCallback?: boolean): boolean;
        requiredText: string;
        private checkForErrors(fireCallback);
        protected onCheckForErrors(errors: Array<SurveyError>): void;
        protected hasRequiredError(): boolean;
        protected runValidators(): SurveyError;
        private isValueChangedInSurvey;
        protected setNewValue(newValue: any): void;
        protected setNewValueInData(newValue: any): void;
        private getValueCore();
        private setValueCore(newValue);
        protected valueFromData(val: any): any;
        protected valueToData(val: any): any;
        protected onValueChanged(): void;
        protected setNewComment(newValue: string): void;
        onSurveyValueChanged(newValue: any): void;
        getValidatorTitle(): string;
    }
}

/// <reference path="jsonobject.d.ts" />
/// <reference path="surveyStrings.d.ts" />
declare module Survey {
    class QuestionSelectBase extends Question {
        private commentValue;
        protected cachedValue: any;
        otherItem: ItemValue;
        choicesValues: Array<ItemValue>;
        choicesByUrl: ChoicesRestfull;
        otherErrorText: string;
        storeOthersAsComment: boolean;
        choicesOrderValue: string;
        choicesChangedCallback: () => void;
        constructor(name: string);
        isOtherSelected: boolean;
        protected getHasOther(val: any): boolean;
        protected getComment(): string;
        private isSettingComment;
        protected setComment(newValue: string): void;
        protected valueFromData(val: any): any;
        protected valueToData(val: any): any;
        protected valueFromDataCore(val: any): any;
        protected valueToDataCore(val: any): any;
        protected hasUnknownValue(val: any): boolean;
        choices: Array<any>;
        choicesOrder: string;
        otherText: string;
        visibleChoices: Array<ItemValue>;
        supportComment(): boolean;
        supportOther(): boolean;
        protected onCheckForErrors(errors: Array<SurveyError>): void;
        protected getStoreOthersAsComment(): boolean;
        onSurveyLoad(): void;
        private onLoadChoicesFromUrl(array);
        private sortVisibleChoices(array);
        private sortArray(array, mult);
        private randomizeArray(array);
    }
    class QuestionCheckboxBase extends QuestionSelectBase {
        name: string;
        private colCountValue;
        colCountChangedCallback: () => void;
        constructor(name: string);
        colCount: number;
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class QuestionCheckboxModel extends QuestionCheckboxBase {
        name: string;
        constructor(name: string);
        protected getHasOther(val: any): boolean;
        protected valueFromDataCore(val: any): any;
        protected valueToDataCore(val: any): any;
        getType(): string;
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class QuestionCommentModel extends Question {
        name: string;
        rows: number;
        cols: number;
        constructor(name: string);
        getType(): string;
        isEmpty(): boolean;
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class QuestionDropdownModel extends QuestionSelectBase {
        name: string;
        private optionsCaptionValue;
        constructor(name: string);
        optionsCaption: string;
        getType(): string;
        supportGoNextPageAutomatic(): boolean;
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class QuestionFileModel extends Question {
        name: string;
        private showPreviewValue;
        private isUploading;
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
        private checkFileForErrors(file);
        private isFileImage(file);
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class QuestionHtmlModel extends QuestionBase {
        name: string;
        private htmlValue;
        constructor(name: string);
        getType(): string;
        html: string;
        processedHtml: string;
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    interface IMatrixData {
        onMatrixRowChanged(row: MatrixRowModel): any;
    }
    class MatrixRowModel extends Base {
        name: any;
        text: string;
        fullName: string;
        private data;
        protected rowValue: any;
        constructor(name: any, text: string, fullName: string, data: IMatrixData, value: any);
        value: any;
        protected onValueChanged(): void;
    }
    class QuestionMatrixModel extends Question implements IMatrixData {
        name: string;
        private columnsValue;
        private rowsValue;
        private isRowChanging;
        private generatedVisibleRows;
        constructor(name: string);
        getType(): string;
        hasRows: boolean;
        columns: Array<any>;
        rows: Array<any>;
        visibleRows: Array<MatrixRowModel>;
        protected createMatrixRow(name: any, text: string, fullName: string, value: any): MatrixRowModel;
        protected onValueChanged(): void;
        onMatrixRowChanged(row: MatrixRowModel): void;
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class QuestionRadiogroupModel extends QuestionCheckboxBase {
        name: string;
        constructor(name: string);
        getType(): string;
        supportGoNextPageAutomatic(): boolean;
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class QuestionTextModel extends Question {
        name: string;
        size: number;
        constructor(name: string);
        getType(): string;
        isEmpty(): boolean;
        supportGoNextPageAutomatic(): boolean;
    }
}

/// <reference path="question.d.ts" />
/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
/// <reference path="question_dropdown.d.ts" />
/// <reference path="question_checkbox.d.ts" />
/// <reference path="question_radiogroup.d.ts" />
/// <reference path="question_text.d.ts" />
/// <reference path="question_comment.d.ts" />
/// <reference path="question_baseselect.d.ts" />
declare module Survey {
    interface IMatrixDropdownData {
        onRowChanged(cell: MatrixDropdownRowModelBase, newRowValue: any): any;
        columns: Array<MatrixDropdownColumn>;
        createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
    }
    class MatrixDropdownColumn extends Base {
        name: string;
        private choicesValue;
        private titleValue;
        optionsCaption: string;
        isRequired: boolean;
        hasOther: boolean;
        minWidth: string;
        cellType: string;
        private colCountValue;
        constructor(name: string, title?: string);
        getType(): string;
        title: string;
        choices: Array<any>;
        colCount: number;
    }
    class MatrixDropdownCell {
        column: MatrixDropdownColumn;
        row: MatrixDropdownRowModelBase;
        private questionValue;
        constructor(column: MatrixDropdownColumn, row: MatrixDropdownRowModelBase, data: IMatrixDropdownData);
        question: Question;
        value: any;
    }
    class MatrixDropdownRowModelBase implements ISurveyData {
        protected data: IMatrixDropdownData;
        private rowValues;
        private rowComments;
        private isSettingValue;
        cells: Array<MatrixDropdownCell>;
        constructor(data: IMatrixDropdownData, value: any);
        rowName: any;
        value: any;
        getValue(name: string): any;
        setValue(name: string, newValue: any): void;
        getComment(name: string): string;
        setComment(name: string, newValue: string): void;
        isEmpty: boolean;
        private buildCells();
        protected createCell(column: MatrixDropdownColumn): MatrixDropdownCell;
    }
    class QuestionMatrixDropdownModelBase extends Question implements IMatrixDropdownData {
        name: string;
        private columnsValue;
        private choicesValue;
        private optionsCaptionValue;
        private isRowChanging;
        protected generatedVisibleRows: Array<MatrixDropdownRowModelBase>;
        private cellTypeValue;
        private columnColCountValue;
        columnMinWidth: string;
        horizontalScroll: boolean;
        columnsChangedCallback: () => void;
        updateCellsCallbak: () => void;
        constructor(name: string);
        getType(): string;
        columns: Array<MatrixDropdownColumn>;
        cellType: string;
        columnColCount: number;
        getColumnTitle(column: MatrixDropdownColumn): string;
        getColumnWidth(column: MatrixDropdownColumn): string;
        choices: Array<any>;
        optionsCaption: string;
        addColumn(name: string, title?: string): MatrixDropdownColumn;
        visibleRows: Array<MatrixDropdownRowModelBase>;
        protected generateRows(): Array<MatrixDropdownRowModelBase>;
        protected createMatrixRow(name: any, text: string, value: any): MatrixDropdownRowModelBase;
        protected createNewValue(curValue: any): any;
        protected getRowValue(row: MatrixDropdownRowModelBase, questionValue: any, create?: boolean): any;
        protected onValueChanged(): void;
        hasErrors(fireCallback?: boolean): boolean;
        private hasErrorInColumns(fireCallback);
        createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
        protected createQuestionCore(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
        protected getQuestionName(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): string;
        protected getColumnChoices(column: MatrixDropdownColumn): Array<any>;
        protected getColumnOptionsCaption(column: MatrixDropdownColumn): string;
        protected createDropdown(name: string, column: MatrixDropdownColumn): QuestionDropdownModel;
        protected createCheckbox(name: string, column: MatrixDropdownColumn): QuestionCheckboxModel;
        protected createRadiogroup(name: string, column: MatrixDropdownColumn): QuestionRadiogroupModel;
        protected createText(name: string, column: MatrixDropdownColumn): QuestionTextModel;
        protected createComment(name: string, column: MatrixDropdownColumn): QuestionCommentModel;
        protected createCellQuestion(questionType: string, name: string): Question;
        protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any;
        onRowChanged(row: MatrixDropdownRowModelBase, newRowValue: any): void;
    }
}

/// <reference path="question.d.ts" />
/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
/// <reference path="question_matrixdropdownbase.d.ts" />
declare module Survey {
    class MatrixDropdownRowModel extends MatrixDropdownRowModelBase {
        name: any;
        text: string;
        constructor(name: any, text: string, data: IMatrixDropdownData, value: any);
        rowName: any;
    }
    class QuestionMatrixDropdownModel extends QuestionMatrixDropdownModelBase implements IMatrixDropdownData {
        name: string;
        private rowsValue;
        constructor(name: string);
        getType(): string;
        rows: Array<any>;
        protected generateRows(): Array<MatrixDropdownRowModel>;
        protected createMatrixRow(name: any, text: string, value: any): MatrixDropdownRowModel;
    }
}

/// <reference path="question.d.ts" />
/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
/// <reference path="question_matrixdropdownbase.d.ts" />
declare module Survey {
    class MatrixDynamicRowModel extends MatrixDropdownRowModelBase {
        index: number;
        constructor(index: number, data: IMatrixDropdownData, value: any);
        rowName: string;
    }
    class QuestionMatrixDynamicModel extends QuestionMatrixDropdownModelBase implements IMatrixDropdownData {
        name: string;
        static MaxRowCount: number;
        private rowCounter;
        private rowCountValue;
        private addRowTextValue;
        minRowCount: number;
        rowCountChangedCallback: () => void;
        constructor(name: string);
        getType(): string;
        rowCount: number;
        addRow(): void;
        removeRow(index: number): void;
        addRowText: string;
        removeRowText: any;
        cachedVisibleRows: Array<MatrixDropdownRowModelBase>;
        protected onCheckForErrors(errors: Array<SurveyError>): void;
        private hasErrorInRows();
        protected generateRows(): Array<MatrixDynamicRowModel>;
        protected createMatrixRow(value: any): MatrixDynamicRowModel;
        protected createNewValue(curValue: any): any;
        protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any;
        private getRowValueByIndex(questionValue, index);
        protected getRowValue(row: MatrixDropdownRowModelBase, questionValue: any, create?: boolean): any;
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    interface IMultipleTextData {
        getMultipleTextValue(name: string): any;
        setMultipleTextValue(name: string, value: any): any;
    }
    class MultipleTextItemModel extends Base implements IValidatorOwner {
        name: any;
        private data;
        private titleValue;
        validators: Array<SurveyValidator>;
        constructor(name?: any, title?: string);
        getType(): string;
        setData(data: IMultipleTextData): void;
        title: string;
        value: any;
        onValueChanged(newValue: any): void;
        getValidatorTitle(): string;
    }
    class QuestionMultipleTextModel extends Question implements IMultipleTextData {
        name: string;
        private colCountValue;
        colCountChangedCallback: () => void;
        itemSize: number;
        private itemsValues;
        constructor(name: string);
        getType(): string;
        items: Array<MultipleTextItemModel>;
        AddItem(name: string, title?: string): MultipleTextItemModel;
        colCount: number;
        getRows(): Array<any>;
        private isMultipleItemValueChanging;
        protected onValueChanged(): void;
        protected createTextItem(name: string, title: string): MultipleTextItemModel;
        protected onItemValueChanged(): void;
        protected runValidators(): SurveyError;
        getMultipleTextValue(name: string): any;
        setMultipleTextValue(name: string, value: any): void;
    }
}

/// <reference path="questionfactory.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class QuestionRatingModel extends Question {
        name: string;
        static defaultRateValues: ItemValue[];
        private rates;
        mininumRateDescription: string;
        maximumRateDescription: string;
        rateValuesChangedCallback: () => void;
        constructor(name: string);
        rateValues: Array<any>;
        visibleRateValues: ItemValue[];
        getType(): string;
        supportComment(): boolean;
        supportOther(): boolean;
        supportGoNextPageAutomatic(): boolean;
    }
}

/// <reference path="base.d.ts" />
/// <reference path="jsonobject.d.ts" />
declare module Survey {
    class Trigger extends Base {
        static operatorsValue: HashTable<Function>;
        static operators: HashTable<Function>;
        private opValue;
        value: any;
        constructor();
        operator: string;
        check(value: any): void;
        protected onSuccess(): void;
        protected onFailure(): void;
    }
    interface ISurveyTriggerOwner {
        getObjects(pages: string[], questions: string[]): any[];
        doComplete(): any;
        setTriggerValue(name: string, value: any, isVariable: boolean): any;
    }
    class SurveyTrigger extends Trigger {
        name: string;
        protected owner: ISurveyTriggerOwner;
        constructor();
        setOwner(owner: ISurveyTriggerOwner): void;
        isOnNextPage: boolean;
    }
    class SurveyTriggerVisible extends SurveyTrigger {
        pages: string[];
        questions: string[];
        constructor();
        getType(): string;
        protected onSuccess(): void;
        protected onFailure(): void;
        private onTrigger(func);
        protected onItemSuccess(item: any): void;
        protected onItemFailure(item: any): void;
    }
    class SurveyTriggerComplete extends SurveyTrigger {
        constructor();
        getType(): string;
        isOnNextPage: boolean;
        protected onSuccess(): void;
    }
    class SurveyTriggerSetValue extends SurveyTrigger {
        setToName: string;
        setValue: any;
        isVariable: boolean;
        constructor();
        getType(): string;
        protected onSuccess(): void;
    }
}

/// <reference path="base.d.ts" />
/// <reference path="page.d.ts" />
/// <reference path="trigger.d.ts" />
/// <reference path="jsonobject.d.ts" />
/// <reference path="dxSurveyService.d.ts" />
/// <reference path="textPreProcessor.d.ts" />
declare module Survey {
    class SurveyModel extends Base implements ISurvey, ISurveyTriggerOwner {
        surveyId: string;
        surveyPostId: string;
        clientId: string;
        cookieName: string;
        sendResultOnPageNext: boolean;
        commentPrefix: string;
        title: string;
        showNavigationButtons: boolean;
        showTitle: boolean;
        showPageTitles: boolean;
        completedHtml: string;
        requiredText: string;
        questionStartIndex: string;
        questionTitleTemplate: string;
        showProgressBar: string;
        storeOthersAsComment: boolean;
        goNextPageAutomatic: boolean;
        pages: Array<PageModel>;
        triggers: Array<SurveyTrigger>;
        clearInvisibleValues: boolean;
        private currentPageValue;
        private valuesHash;
        private variablesHash;
        private pagePrevTextValue;
        private pageNextTextValue;
        private completeTextValue;
        private showPageNumbersValue;
        private showQuestionNumbersValue;
        private questionTitleLocationValue;
        private localeValue;
        private isCompleted;
        private isLoading;
        private processedTextValues;
        private textPreProcessor;
        onComplete: Event<(sender: SurveyModel) => any, any>;
        onCurrentPageChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        onValueChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        onVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        onPageVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        onQuestionAdded: Event<(sender: SurveyModel, options: any) => any, any>;
        onQuestionRemoved: Event<(sender: SurveyModel, options: any) => any, any>;
        onValidateQuestion: Event<(sender: SurveyModel, options: any) => any, any>;
        onProcessHtml: Event<(sender: SurveyModel, options: any) => any, any>;
        onSendResult: Event<(sender: SurveyModel, options: any) => any, any>;
        onGetResult: Event<(sender: SurveyModel, options: any) => any, any>;
        onUploadFile: Event<(sender: SurveyModel, options: any) => any, any>;
        jsonErrors: Array<JsonError>;
        mode: string;
        constructor(jsonObj?: any);
        getType(): string;
        locale: string;
        getLocString(str: string): any;
        emptySurveyText: string;
        pagePrevText: string;
        pageNextText: string;
        completeText: string;
        showPageNumbers: boolean;
        showQuestionNumbers: string;
        questionTitleLocation: string;
        data: any;
        comments: any;
        visiblePages: Array<PageModel>;
        isEmpty: boolean;
        PageCount: number;
        visiblePageCount: number;
        currentPage: PageModel;
        state: string;
        clear(): void;
        protected mergeValues(src: any, dest: any): void;
        protected currentPageChanged(newValue: PageModel, oldValue: PageModel): void;
        getProgress(): number;
        isDesignMode: boolean;
        hasCookie: boolean;
        setCookie(): void;
        deleteCookie(): void;
        nextPage(): boolean;
        isCurrentPageHasErrors: boolean;
        prevPage(): boolean;
        completeLastPage(): boolean;
        isFirstPage: boolean;
        isLastPage: boolean;
        doComplete(): void;
        protected setCompleted(): void;
        processedCompletedHtml: string;
        processedLoadingHtml: string;
        progressText: string;
        uploadFile(name: string, file: File, storeDataAsText: boolean, uploadingCallback: (status: string) => any): boolean;
        protected uploadFileCore(name: string, file: File, uploadingCallback: (status: string) => any): void;
        getPage(index: number): PageModel;
        addPage(page: PageModel): void;
        addNewPage(name: string): PageModel;
        removePage(page: PageModel): void;
        getQuestionByName(name: string, caseInsensitive?: boolean): IQuestion;
        getQuestionsByNames(names: string[], caseInsensitive?: boolean): IQuestion[];
        getPageByQuestion(question: IQuestion): PageModel;
        getPageByName(name: string): PageModel;
        getPagesByNames(names: string[]): PageModel[];
        getAllQuestions(visibleOnly?: boolean): Array<IQuestion>;
        protected createNewPage(name: string): PageModel;
        private notifyQuestionOnValueChanged(name, newValue);
        private notifyAllQuestionsOnValueChanged();
        protected doSurveyValueChanged(question: IQuestion, newValue: any): void;
        private checkOnPageTriggers();
        private getCurrentPageQuestions();
        private checkTriggers(name, newValue, isOnNextPage);
        private doQuestionsOnLoad();
        private runConditions();
        private runConditionsForList(list);
        sendResult(postId?: string, clientId?: string, isPartialCompleted?: boolean): void;
        getResult(resultId: string, name: string): void;
        loadSurveyFromService(surveyId?: string): void;
        protected onLoadingSurveyFromService(): void;
        protected onLoadSurveyFromService(): void;
        private updateVisibleIndexes();
        private updatePageVisibleIndexes(showIndex);
        private updateQuestionVisibleIndexes(questions, showIndex);
        private setJsonObject(jsonObj);
        protected onBeforeCreating(): void;
        protected onCreating(): void;
        private updateProcessedTextValues();
        private addQuestionToProcessedTextValues(question);
        private getProcessedTextValue(name);
        private clearInvisibleQuestionValues();
        getVariable(name: string): any;
        setVariable(name: string, newValue: any): void;
        private getUnbindValue(value);
        getValue(name: string): any;
        setValue(name: string, newValue: any): void;
        private isValueEqual(name, newValue);
        private isTwoValueEquals(x, y);
        private tryGoNextPageAutomatic(name);
        getComment(name: string): string;
        setComment(name: string, newValue: string): void;
        questionVisibilityChanged(question: IQuestion, newValue: boolean): void;
        pageVisibilityChanged(page: IPage, newValue: boolean): void;
        questionAdded(question: IQuestion, index: number): void;
        questionRemoved(question: IQuestion): void;
        validateQuestion(name: string): SurveyError;
        processHtml(html: string): string;
        processText(text: string): string;
        getObjects(pages: string[], questions: string[]): any[];
        setTriggerValue(name: string, value: any, isVariable: boolean): void;
    }
}

declare module Survey {
    class SurveyWindowModel extends Base {
        static surveyElementName: string;
        surveyValue: SurveyModel;
        windowElement: HTMLDivElement;
        isShowingValue: boolean;
        isExpandedValue: boolean;
        titleValue: string;
        templateValue: string;
        constructor(jsonObj: any);
        getType(): string;
        survey: SurveyModel;
        isShowing: boolean;
        isExpanded: boolean;
        title: string;
        expand(): void;
        collapse(): void;
        protected createSurvey(jsonObj: any): SurveyModel;
        protected expandcollapse(value: boolean): void;
    }
}

/// <reference path="../surveyStrings.d.ts" />
declare module Survey {
}

/// <reference path="../surveyStrings.d.ts" />
declare module Survey {
}

/// <reference path="../surveyStrings.d.ts" />
declare module Survey {
}

/// <reference path="../surveyStrings.d.ts" />
declare module Survey {
}

declare module Survey {
    var defaultStandardCss: {
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
            item: string;
        };
        checkbox: {
            root: string;
            item: string;
            other: string;
        };
        comment: string;
        dropdown: string;
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
            other: string;
        };
        rating: {
            root: string;
            item: string;
        };
        text: string;
    };
}

/// <reference path="../page.d.ts" />
declare module Survey {
    class QuestionRow extends QuestionRowModel {
        page: PageModel;
        question: QuestionBase;
        koVisible: any;
        constructor(page: PageModel, question: QuestionBase);
        protected onVisibleChanged(): void;
        koAfterRender(el: any, con: any): void;
    }
    class Page extends PageModel {
        koNo: any;
        constructor(name?: string);
        protected createRow(question: QuestionBase): QuestionRowModel;
        protected onCreating(): void;
        protected onNumChanged(value: number): void;
    }
}

/// <reference path="../questionbase.d.ts" />
declare module Survey {
    class QuestionImplementorBase {
        question: QuestionBase;
        koVisible: any;
        koErrors: any;
        koMarginLeft: any;
        koPaddingRight: any;
        koRenderWidth: any;
        constructor(question: QuestionBase);
        protected onVisibilityChanged(): void;
        protected onRenderWidthChanged(): void;
        private getIndentSize(indent);
    }
}

/// <reference path="../question.d.ts" />
/// <reference path="koquestionbase.d.ts" />
declare module Survey {
    class QuestionImplementor extends QuestionImplementorBase {
        question: Question;
        private isUpdating;
        private koDummy;
        koValue: any;
        koComment: any;
        koTitle: any;
        constructor(question: Question);
        protected onValueChanged(): void;
        protected onCommentChanged(): void;
        protected onVisibilityChanged(): void;
        protected onVisibleIndexChanged(): void;
        protected onErrorsChanged(): void;
        protected createkoValue(): any;
        protected setkoValue(newValue: any): void;
        protected updateValue(newValue: any): void;
        protected updateComment(newValue: any): void;
        protected getNo(): string;
    }
}

/// <reference path="koquestion.d.ts" />
declare module Survey {
    class QuestionSelectBaseImplementor extends QuestionImplementor {
        private koChoiceChangedCount;
        koOtherVisible: any;
        koVisibleChoices: any;
        constructor(question: Question);
        protected isOtherSelected: boolean;
    }
    class QuestionCheckboxBaseImplementor extends QuestionSelectBaseImplementor {
        koWidth: any;
        constructor(question: Question);
        protected onColCountChanged(): void;
        protected colWidth: string;
        private koAfterRender(el, con);
    }
}

/// <reference path="../question_checkbox.d.ts" />
/// <reference path="koquestion_baseselect.d.ts" />
declare module Survey {
    class QuestionCheckbox extends QuestionCheckboxModel {
        name: string;
        constructor(name: string);
    }
}

/// <reference path="../question_comment.d.ts" />
declare module Survey {
    class QuestionComment extends QuestionCommentModel {
        name: string;
        constructor(name: string);
    }
}

/// <reference path="../question_dropdown.d.ts" />
declare module Survey {
    class QuestionDropdown extends QuestionDropdownModel {
        name: string;
        constructor(name: string);
    }
}

/// <reference path="../question_file.d.ts" />
/// <reference path="koquestion.d.ts" />
declare module Survey {
    class QuestionFile extends QuestionFileModel {
        name: string;
        constructor(name: string);
    }
}

/// <reference path="../question_html.d.ts" />
/// <reference path="koquestionbase.d.ts" />
declare module Survey {
    class QuestionHtml extends QuestionHtmlModel {
        name: string;
        constructor(name: string);
    }
}

/// <reference path="../question_matrix.d.ts" />
declare module Survey {
    class MatrixRow extends MatrixRowModel {
        name: any;
        text: string;
        fullName: string;
        private isValueUpdating;
        koValue: any;
        constructor(name: any, text: string, fullName: string, data: IMatrixData, value: any);
        protected onValueChanged(): void;
    }
    class QuestionMatrix extends QuestionMatrixModel {
        name: string;
        constructor(name: string);
        protected createMatrixRow(name: any, text: string, fullName: string, value: any): MatrixRowModel;
    }
}

/// <reference path="../question_matrixdropdown.d.ts" />
/// <reference path="../question_matrixdropdownbase.d.ts" />
declare module Survey {
    class QuestionMatrixDropdown extends QuestionMatrixDropdownModel {
        name: string;
        constructor(name: string);
    }
}

/// <reference path="../question_matrixdynamic.d.ts" />
/// <reference path="../question_matrixdropdownbase.d.ts" />
declare module Survey {
    class QuestionMatrixDynamicImplementor extends QuestionImplementor {
        koRows: any;
        koRecalc: any;
        koAddRowClick: any;
        koRemoveRowClick: any;
        koOverflowX: any;
        constructor(question: Question);
        protected onUpdateCells(): void;
        protected onColumnChanged(): void;
        protected onRowCountChanged(): void;
        protected addRow(): void;
        protected removeRow(row: MatrixDynamicRowModel): void;
    }
    class QuestionMatrixDynamic extends QuestionMatrixDynamicModel {
        name: string;
        constructor(name: string);
    }
}

/// <reference path="../question_multipletext.d.ts" />
declare module Survey {
    class MultipleTextItem extends MultipleTextItemModel {
        name: any;
        private isKOValueUpdating;
        koValue: any;
        constructor(name?: any, title?: string);
        onValueChanged(newValue: any): void;
    }
    class QuestionMultipleTextImplementor extends QuestionImplementor {
        koRows: any;
        constructor(question: Question);
        protected onColCountChanged(): void;
    }
    class QuestionMultipleText extends QuestionMultipleTextModel {
        name: string;
        constructor(name: string);
        protected createTextItem(name: string, title: string): MultipleTextItemModel;
    }
}

/// <reference path="../question_radiogroup.d.ts" />
declare module Survey {
    class QuestionRadiogroup extends QuestionRadiogroupModel {
        name: string;
        constructor(name: string);
    }
}

/// <reference path="../question_rating.d.ts" />
declare module Survey {
    class QuestionRating extends QuestionRatingModel {
        name: string;
        itemCss: string;
        constructor(name: string);
        protected onSetData(): void;
    }
}

/// <reference path="../question_text.d.ts" />
declare module Survey {
    class QuestionText extends QuestionTextModel {
        name: string;
        constructor(name: string);
    }
}

/// <reference path="../survey.d.ts" />
declare module Survey {
    class SurveyBase extends SurveyModel {
        private renderedElement;
        private cssValue;
        onRendered: Event<(sender: SurveyModel) => any, any>;
        koCurrentPage: any;
        koIsFirstPage: any;
        koIsLastPage: any;
        dummyObservable: any;
        koState: any;
        koProgress: any;
        koProgressText: any;
        constructor(jsonObj?: any, renderedElement?: any, css?: any);
        cssNavigationComplete: string;
        cssNavigationPrev: string;
        cssNavigationNext: string;
        private getNavigationCss(main, btn);
        css: any;
        render(element?: any): void;
        loadSurveyFromService(surveyId?: string, renderedElement?: any): void;
        protected setCompleted(): void;
        protected createNewPage(name: string): Page;
        protected createCssObject(): any;
        protected getTemplate(): string;
        protected onBeforeCreating(): void;
        protected currentPageChanged(newValue: PageModel, oldValue: PageModel): void;
        protected onLoadSurveyFromService(): void;
        protected onLoadingSurveyFromService(): void;
        private applyBinding();
        private updateKoCurrentPage();
    }
}

/// <reference path="../surveyWindow.d.ts" />
/// <reference path="kosurvey.d.ts" />
declare module Survey {
    class SurveyWindowBase extends SurveyWindowModel {
        koExpanded: any;
        doExpand: any;
        constructor(jsonObj: any);
        protected createSurvey(jsonObj: any): SurveyModel;
        protected expandcollapse(value: boolean): void;
        protected template: string;
        show(): void;
        protected getDefaultTemplate(): string;
        hide(): void;
        private changeExpanded();
        private onComplete();
    }
}

declare module Survey {
    class SurveyTemplateTextBase {
        constructor();
        replaceText(replaceText: string, id: string, questionType?: string): void;
        protected getId(id: string, questionType: string): string;
        protected text: string;
    }
}

declare module template.ko {
    var html: string;
}

/// <reference path="template.ko.html.d.ts" />
/// <reference path="../kosurvey.d.ts" />
/// <reference path="../../defaultCss/cssstandard.d.ts" />
declare module Survey {
    class Survey extends SurveyBase {
        constructor(jsonObj?: any, renderedElement?: any, css?: any);
        protected getTemplate(): string;
        protected createCssObject(): any;
    }
}

/// <reference path="../koSurveyWindow.d.ts" />
/// <reference path="koSurveyStandard.d.ts" />
declare module Survey {
    class SurveyWindow extends SurveyWindowBase {
        koExpanded: any;
        doExpand: any;
        constructor(jsonObj: any);
        protected createSurvey(jsonObj: any): SurveyModel;
        protected getDefaultTemplate(): string;
    }
}

declare module template.window.ko {
    var html: string;
}

/// <reference path="template.ko.html.d.ts" />
/// <reference path="../templateText.d.ts" />
declare module Survey {
    class SurveyTemplateText extends SurveyTemplateTextBase {
        protected text: string;
    }
}
