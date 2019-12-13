/*Type definitions for Survey JavaScript library v1.1.24
Copyright (c) 2015-2019 Devsoft Baltic OÜ  - http://surveyjs.io/
Definitions by: Devsoft Baltic OÜ <https://github.com/surveyjs/>
*/
// Dependencies for this module:
//   ../../../../knockout

import * as ko from "knockout";

import "./chunks/localization";

import "../../main.scss";
import "../../modern.scss";
export let Version: string;

export var __assign: any;
export function __extends(thisClass: any, baseClass: any): void;
export var __decorate: (decorators: any, target: any, key: any, desc: any) => any;
export var __spreadArrays: () => any[];

export declare var surveyCss: any;
export declare var defaultStandardCss: {
    root: string;
    container: string;
    header: string;
    body: string;
    bodyEmpty: string;
    footer: string;
    navigationButton: string;
    completedPage: string;
    navigation: {
        complete: string;
        prev: string;
        next: string;
        start: string;
    };
    progress: string;
    progressBar: string;
    progressTextInBar: string;
    page: {
        root: string;
        title: string;
        description: string;
    };
    pageTitle: string;
    pageDescription: string;
    row: string;
    question: {
        mainRoot: string;
        flowRoot: string;
        header: string;
        headerLeft: string;
        content: string;
        contentLeft: string;
        titleLeftRoot: string;
        requiredText: string;
        title: string;
        number: string;
        description: string;
        comment: string;
        required: string;
        titleRequired: string;
        hasError: string;
        indent: number;
        footer: string;
        formGroup: string;
    };
    panel: {
        title: string;
        titleExpandable: string;
        icon: string;
        iconExpanded: string;
        description: string;
        container: string;
    };
    error: {
        root: string;
        icon: string;
        item: string;
        locationTop: string;
        locationBottom: string;
    };
    boolean: {
        root: string;
        item: string;
        control: string;
        itemChecked: string;
        itemIndeterminate: string;
        itemDisabled: string;
        switch: string;
        slider: string;
        label: string;
        disabledLabel: string;
    };
    checkbox: {
        root: string;
        item: string;
        itemChecked: string;
        itemInline: string;
        label: string;
        labelChecked: string;
        itemControl: string;
        itemDecorator: string;
        controlLabel: string;
        materialDecorator: string;
        other: string;
        column: string;
    };
    comment: string;
    dropdown: {
        root: string;
        control: string;
        selectWrapper: string;
        other: string;
    };
    html: {
        root: string;
    };
    matrix: {
        root: string;
        label: string;
        itemChecked: string;
        itemDecorator: string;
        cellText: string;
        cellTextSelected: string;
        cellLabel: string;
    };
    matrixdropdown: {
        root: string;
    };
    matrixdynamic: {
        root: string;
        button: string;
        buttonAdd: string;
        buttonRemove: string;
        iconAdd: string;
        iconRemove: string;
    };
    paneldynamic: {
        root: string;
        title: string;
        button: string;
        buttonAdd: string;
        buttonRemove: string;
        buttonPrev: string;
        buttonNext: string;
        progressContainer: string;
        progress: string;
        progressBar: string;
        progressText: string;
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
        itemChecked: string;
        itemInline: string;
        itemDecorator: string;
        label: string;
        labelChecked: string;
        itemControl: string;
        controlLabel: string;
        materialDecorator: string;
        other: string;
        clearButton: string;
        column: string;
    };
    imagepicker: {
        root: string;
        item: string;
        itemChecked: string;
        label: string;
        itemControl: string;
        image: string;
        itemInline: string;
        itemText: string;
        clearButton: string;
    };
    rating: {
        root: string;
        item: string;
        selected: string;
        minText: string;
        itemText: string;
        maxText: string;
        disabled: string;
    };
    text: string;
    expression: string;
    file: {
        root: string;
        placeholderInput: string;
        preview: string;
        removeButton: string;
        fileInput: string;
        removeFile: string;
        removeFileSvg: string;
        fileDecorator: string;
        fileSignBottom: string;
        removeButtonBottom: string;
    };
    saveData: {
        root: string;
        saving: string;
        error: string;
        success: string;
        saveAgainButton: string;
    };
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
    container: string;
    header: string;
    body: string;
    bodyEmpty: string;
    footer: string;
    navigationButton: string;
    completedPage: string;
    navigation: {
        complete: string;
        prev: string;
        next: string;
        start: string;
    };
    progress: string;
    progressBar: string;
    progressTextUnderBar: string;
    page: {
        root: string;
        title: string;
        description: string;
    };
    pageTitle: string;
    pageDescription: string;
    row: string;
    question: {
        mainRoot: string;
        flowRoot: string;
        header: string;
        headerLeft: string;
        content: string;
        contentLeft: string;
        titleLeftRoot: string;
        title: string;
        number: string;
        description: string;
        descriptionUnderInput: string;
        requiredText: string;
        comment: string;
        required: string;
        titleRequired: string;
        hasError: string;
        indent: number;
        formGroup: string;
    };
    panel: {
        title: string;
        titleExpandable: string;
        icon: string;
        iconExpanded: string;
        description: string;
        container: string;
    };
    error: {
        root: string;
        icon: string;
        item: string;
        locationTop: string;
        locationBottom: string;
    };
    boolean: {
        root: string;
        item: string;
        control: string;
        itemChecked: string;
        itemIndeterminate: string;
        itemDisabled: string;
        switch: string;
        slider: string;
        label: string;
        disabledLabel: string;
    };
    checkbox: {
        root: string;
        item: string;
        itemChecked: string;
        itemInline: string;
        itemControl: string;
        itemDecorator: string;
        label: string;
        labelChecked: string;
        controlLabel: string;
        materialDecorator: string;
        other: string;
        column: string;
    };
    comment: string;
    dropdown: {
        root: string;
        control: string;
        other: string;
    };
    html: {
        root: string;
    };
    matrix: {
        root: string;
        label: string;
        itemChecked: string;
        itemDecorator: string;
        cellText: string;
        cellTextSelected: string;
        cellLabel: string;
    };
    matrixdropdown: {
        root: string;
    };
    matrixdynamic: {
        root: string;
        button: string;
        buttonAdd: string;
        buttonRemove: string;
        iconAdd: string;
        iconRemove: string;
    };
    paneldynamic: {
        root: string;
        navigation: string;
        progressTop: string;
        progressBottom: string;
        title: string;
        button: string;
        buttonAdd: string;
        buttonRemove: string;
        buttonPrev: string;
        buttonNext: string;
        progressContainer: string;
        progress: string;
        progressBar: string;
        progressText: string;
    };
    multipletext: {
        root: string;
        itemTitle: string;
        itemValue: string;
    };
    radiogroup: {
        root: string;
        item: string;
        itemChecked: string;
        itemInline: string;
        label: string;
        labelChecked: string;
        itemControl: string;
        itemDecorator: string;
        controlLabel: string;
        materialDecorator: string;
        other: string;
        clearButton: string;
        column: string;
    };
    imagepicker: {
        root: string;
        item: string;
        itemChecked: string;
        itemInline: string;
        label: string;
        itemControl: string;
        image: string;
        itemText: string;
        clearButton: string;
    };
    rating: {
        root: string;
        item: string;
        selected: string;
        minText: string;
        itemText: string;
        maxText: string;
        disabled: string;
    };
    text: string;
    expression: string;
    file: {
        root: string;
        placeholderInput: string;
        preview: string;
        removeButton: string;
        fileInput: string;
        removeFile: string;
        removeFileSvg: string;
        fileDecorator: string;
        fileSignBottom: string;
        removeButtonBottom: string;
    };
    saveData: {
        root: string;
        saving: string;
        error: string;
        success: string;
        saveAgainButton: string;
    };
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
    container: string;
    header: string;
    body: string;
    bodyEmpty: string;
    footer: string;
    navigationButton: string;
    completedPage: string;
    navigation: {
        complete: string;
        prev: string;
        next: string;
        start: string;
    };
    progress: string;
    progressBar: string;
    progressTextUnderBar: string;
    page: {
        root: string;
        title: string;
        description: string;
    };
    pageTitle: string;
    pageDescription: string;
    row: string;
    question: {
        mainRoot: string;
        flowRoot: string;
        header: string;
        headerLeft: string;
        content: string;
        contentLeft: string;
        titleLeftRoot: string;
        requiredText: string;
        title: string;
        number: string;
        description: string;
        descriptionUnderInput: string;
        comment: string;
        required: string;
        titleRequired: string;
        hasError: string;
        indent: number;
        formGroup: string;
    };
    panel: {
        title: string;
        titleExpandable: string;
        icon: string;
        iconExpanded: string;
        description: string;
        container: string;
    };
    error: {
        root: string;
        icon: string;
        item: string;
        locationTop: string;
        locationBottom: string;
    };
    boolean: {
        root: string;
        item: string;
        control: string;
        itemChecked: string;
        itemIndeterminate: string;
        itemDisabled: string;
        switch: string;
        slider: string;
        label: string;
        disabledLabel: string;
    };
    checkbox: {
        root: string;
        item: string;
        itemChecked: string;
        itemInline: string;
        itemDecorator: string;
        itemControl: string;
        label: string;
        labelChecked: string;
        controlLabel: string;
        materialDecorator: string;
        other: string;
        column: string;
    };
    comment: string;
    dropdown: {
        root: string;
        control: string;
        other: string;
    };
    html: {
        root: string;
    };
    matrix: {
        root: string;
        row: string;
        label: string;
        cellText: string;
        cellTextSelected: string;
        cellLabel: string;
        itemValue: string;
        itemChecked: string;
        itemDecorator: string;
    };
    matrixdropdown: {
        root: string;
        itemValue: string;
    };
    matrixdynamic: {
        root: string;
        button: string;
        itemValue: string;
        buttonAdd: string;
        buttonRemove: string;
        iconAdd: string;
        iconRemove: string;
    };
    paneldynamic: {
        root: string;
        navigation: string;
        progressTop: string;
        progressBottom: string;
        title: string;
        button: string;
        buttonAdd: string;
        buttonRemove: string;
        buttonPrev: string;
        buttonNext: string;
        progressContainer: string;
        progress: string;
        progressBar: string;
        progressText: string;
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
        itemChecked: string;
        itemInline: string;
        itemDecorator: string;
        label: string;
        labelChecked: string;
        itemControl: string;
        controlLabel: string;
        materialDecorator: string;
        other: string;
        clearButton: string;
        column: string;
    };
    imagepicker: {
        root: string;
        item: string;
        itemChecked: string;
        itemInline: string;
        label: string;
        itemControl: string;
        image: string;
        itemText: string;
        clearButton: string;
    };
    rating: {
        root: string;
        item: string;
        selected: string;
        minText: string;
        itemText: string;
        maxText: string;
        disabled: string;
    };
    text: string;
    expression: string;
    file: {
        root: string;
        placeholderInput: string;
        preview: string;
        removeButton: string;
        fileInput: string;
        removeFile: string;
        removeFileSvg: string;
        fileDecorator: string;
        fileSignBottom: string;
        removeButtonBottom: string;
    };
    saveData: {
        root: string;
        saving: string;
        error: string;
        success: string;
        saveAgainButton: string;
    };
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

export declare var modernCss: {
    root: string;
    container: string;
    header: string;
    body: string;
    bodyEmpty: string;
    footer: string;
    navigationButton: string;
    completedPage: string;
    navigation: {
        complete: string;
        prev: string;
        next: string;
        start: string;
    };
    panel: {
        title: string;
        titleExpandable: string;
        description: string;
        container: string;
        content: string;
        icon: string;
        iconExpanded: string;
    };
    paneldynamic: {
        root: string;
        navigation: string;
        title: string;
        button: string;
        buttonRemove: string;
        buttonAdd: string;
        progressTop: string;
        progressBottom: string;
        buttonPrev: string;
        buttonNext: string;
        progressContainer: string;
        progress: string;
        progressBar: string;
        progressText: string;
        separator: string;
    };
    progress: string;
    progressBar: string;
    progressText: string;
    progressTextInBar: string;
    page: {
        root: string;
        title: string;
        description: string;
    };
    pageTitle: string;
    pageDescription: string;
    row: string;
    question: {
        mainRoot: string;
        flowRoot: string;
        asCell: string;
        header: string;
        headerLeft: string;
        headerTop: string;
        headerBottom: string;
        content: string;
        contentLeft: string;
        titleLeftRoot: string;
        titleOnAnswer: string;
        titleOnError: string;
        title: string;
        requiredText: string;
        number: string;
        description: string;
        descriptionUnderInput: string;
        comment: string;
        required: string;
        titleRequired: string;
        indent: number;
        footer: string;
        formGroup: string;
        hasError: string;
    };
    error: {
        root: string;
        icon: string;
        item: string;
        locationTop: string;
        locationBottom: string;
    };
    checkbox: {
        root: string;
        item: string;
        itemDisabled: string;
        itemChecked: string;
        itemHover: string;
        itemInline: string;
        label: string;
        labelChecked: string;
        itemControl: string;
        itemDecorator: string;
        controlLabel: string;
        materialDecorator: string;
        other: string;
        column: string;
    };
    radiogroup: {
        root: string;
        item: string;
        itemInline: string;
        label: string;
        labelChecked: string;
        itemDisabled: string;
        itemChecked: string;
        itemHover: string;
        itemControl: string;
        itemDecorator: string;
        controlLabel: string;
        materialDecorator: string;
        other: string;
        clearButton: string;
        column: string;
    };
    boolean: {
        root: string;
        item: string;
        control: string;
        itemChecked: string;
        itemIndeterminate: string;
        itemDisabled: string;
        switch: string;
        slider: string;
        label: string;
        disabledLabel: string;
    };
    text: {
        root: string;
        small: string;
        onError: string;
    };
    multipletext: {
        root: string;
        item: string;
        itemTitle: string;
        row: string;
        cell: string;
    };
    dropdown: {
        root: string;
        small: string;
        control: string;
        selectWrapper: string;
        other: string;
        onError: string;
    };
    imagepicker: {
        root: string;
        item: string;
        itemInline: string;
        itemChecked: string;
        itemDisabled: string;
        itemHover: string;
        label: string;
        itemControl: string;
        image: string;
        itemText: string;
        clearButton: string;
        other: string;
    };
    matrix: {
        tableWrapper: string;
        root: string;
        cell: string;
        headerCell: string;
        label: string;
        itemValue: string;
        itemChecked: string;
        itemDisabled: string;
        itemHover: string;
        materialDecorator: string;
        itemDecorator: string;
        cellText: string;
        cellTextSelected: string;
        cellTextDisabled: string;
    };
    matrixdropdown: {
        root: string;
        cell: string;
        headerCell: string;
    };
    matrixdynamic: {
        root: string;
        cell: string;
        headerCell: string;
        button: string;
        buttonAdd: string;
        buttonRemove: string;
        iconAdd: string;
        iconRemove: string;
    };
    rating: {
        root: string;
        item: string;
        selected: string;
        minText: string;
        itemText: string;
        maxText: string;
        disabled: string;
    };
    comment: {
        root: string;
        small: string;
    };
    expression: string;
    file: {
        root: string;
        placeholderInput: string;
        preview: string;
        fileSign: string;
        fileSignBottom: string;
        fileDecorator: string;
        fileInput: string;
        noFileChosen: string;
        chooseFile: string;
        disabled: string;
        removeButton: string;
        removeButtonBottom: string;
        removeFile: string;
        removeFileSvg: string;
        wrapper: string;
    };
    saveData: {
        root: string;
        saving: string;
        error: string;
        success: string;
        saveAgainButton: string;
    };
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

export declare class Survey extends SurveyModel {
    static cssType: string;
    onRendered: Event<(sender: SurveyModel) => any, any>;
    koCurrentPage: any;
    koIsFirstPage: any;
    koIsLastPage: any;
    dummyObservable: any;
    koState: any;
    koProgress: any;
    koProgressText: any;
    koAfterRenderPage: any;
    koCompletedState: any;
    koCompletedStateText: any;
    koCompletedStateCss: any;
    koTimerInfoText: any;
    getDataValueCore(valuesHash: any, key: string): any;
    setDataValueCore(valuesHash: any, key: string, value: any): void;
    deleteDataValueCore(valuesHash: any, key: string): void;
    constructor(jsonObj?: any, renderedElement?: any, css?: any);
    nextPageUIClick(): void;
    nextPageMouseDown(): void;
    readonly cssNavigationComplete: string;
    readonly cssNavigationPrev: string;
    readonly cssNavigationStart: string;
    readonly cssNavigationNext: string;
    readonly completedCss: string;
    css: any;
    render(element?: any): void;
    clear(clearData?: boolean, gotoFirstPage?: boolean): void;
    protected onLocaleChanged(): void;
    koEventAfterRender(element: any, survey: any): void;
    loadSurveyFromService(surveyId?: string, clientId?: string, renderedElement?: any): void;
    setCompleted(): void;
    start(): void;
    protected createNewPage(name: string): Page;
    protected getHtmlTemplate(): string;
    protected onBeforeCreating(): void;
    protected currentPageChanged(newValue: PageModel, oldValue: PageModel): void;
    pageVisibilityChanged(page: IPage, newValue: boolean): void;
    protected onLoadSurveyFromService(): void;
    protected onLoadingSurveyFromService(): void;
    protected setCompletedState(value: string, text: string): void;
    protected doTimer(): void;
}
export declare var registerTemplateEngine: (ko: any, platform: string) => void;

export declare class ImplementorBase {
    element: Base;
    constructor(element: Base);
}

export declare class QuestionRow extends QuestionRowModel {
    panel: PanelModelBase;
    koGetType: any;
    koElementAfterRender: any;
    constructor(panel: PanelModelBase);
    getElementType(el: any): "survey-panel" | "survey-question";
    koAfterRender(el: any, con: any): void;
}
export declare class PanelImplementorBase extends ImplementorBase {
    panel: PanelModelBase;
    constructor(panel: PanelModelBase);
}
export declare class Panel extends PanelModel {
    koElementType: any;
    koCss: any;
    koIsExpanded: any;
    koIsCollapsed: any;
    koErrorClass: any;
    doExpand: any;
    constructor(name?: string);
    protected createRow(): QuestionRowModel;
    protected onCreating(): void;
    protected onNumChanged(value: number): void;
    getTitleStyle(): any;
    endLoadingFromJson(): void;
}
export declare class Page extends PageModel {
    constructor(name?: string);
    protected createRow(): QuestionRowModel;
    protected createNewPanel(name: string): PanelModel;
    protected onCreating(): void;
    protected onNumChanged(value: number): void;
}

export declare class FlowPanel extends FlowPanelModel {
    koElementType: any;
    koElementAfterRender: any;
    placeHolder: string;
    constructor(name?: string);
    protected onCreating(): void;
    protected getHtmlForQuestion(question: Question): string;
}

export declare class QuestionImplementor extends ImplementorBase {
    question: Question;
    koTemplateName: any;
    koElementType: any;
    constructor(question: Question);
    protected getKoValue(): any;
    protected updateQuestion(): void;
    protected onVisibleIndexChanged(): void;
    protected onSurveyLoad(): void;
    protected getQuestionTemplate(): string;
    protected getNo(): string;
    protected updateKoDummy(): void;
    protected koQuestionAfterRender(elements: any, con: any): void;
}

export declare class QuestionSelectBaseImplementor extends QuestionImplementor {
    protected onCreated(): void;
    constructor(question: Question);
    protected readonly isOtherSelected: boolean;
}
export declare class QuestionCheckboxBaseImplementor extends QuestionSelectBaseImplementor {
    constructor(question: Question);
}

export declare class QuestionCheckbox extends QuestionCheckboxModel {
    name: string;
    koAllSelected: any;
    constructor(name: string);
    protected onValueChanged(): void;
    protected onVisibleChoicesChanged(): void;
    protected updateAllSelected(): void;
    getItemClass(item: any): any;
    getLabelClass(item: any): any;
}

export declare class QuestionComment extends QuestionCommentModel {
    name: string;
    constructor(name: string);
}

export declare class QuestionDropdown extends QuestionDropdownModel {
    name: string;
    constructor(name: string);
}

export declare class QuestionFileImplementor extends QuestionImplementor {
    koState: any;
    koHasValue: any;
    koData: any;
    koInputTitle: any;
    koChooseFileClass: any;
    constructor(question: Question);
}
export declare class QuestionFile extends QuestionFileModel {
    name: string;
    constructor(name: string);
}

export declare class QuestionHtml extends QuestionHtmlModel {
    name: string;
    constructor(name: string);
}

export declare class MatrixRow extends MatrixRowModel {
    fullName: string;
    koValue: any;
    koCellClick: any;
    constructor(item: ItemValue, fullName: string, data: IMatrixData, value: any);
    protected onValueChanged(): void;
}
export declare class QuestionMatrix extends QuestionMatrixModel {
    name: string;
    koVisibleRows: ko.ObservableArray<MatrixRowModel>;
    koVisibleColumns: ko.ObservableArray<any>;
    constructor(name: string);
    protected onColumnsChanged(): void;
    protected onRowsChanged(): void;
    onSurveyLoad(): void;
    protected createMatrixRow(item: ItemValue, fullName: string, value: any): MatrixRowModel;
    protected getVisibleRows(): Array<MatrixRowModel>;
    getItemCss(row: any, column: any): string;
}

export declare class QuestionMatrixBaseImplementor extends QuestionImplementor {
    koCellAfterRender: any;
    koRecalc: any;
    koAddRowClick: any;
    koRemoveRowClick: any;
    koIsAddRowOnTop: any;
    koIsAddRowOnBottom: any;
    koTable: any;
    constructor(question: Question);
    protected getQuestionTemplate(): string;
    protected isAddRowTop(): boolean;
    protected isAddRowBottom(): boolean;
    protected canRemoveRows(): boolean;
    protected addRow(): void;
    protected removeRow(row: MatrixDropdownRowModelBase): void;
}
export declare class QuestionMatrixDropdown extends QuestionMatrixDropdownModel {
    name: string;
    constructor(name: string);
}

export declare class QuestionMatrixDynamicImplementor extends QuestionMatrixBaseImplementor {
    constructor(question: Question);
    protected isAddRowTop(): boolean;
    protected isAddRowBottom(): boolean;
    protected canRemoveRows(): boolean;
    protected addRow(): void;
    protected removeRow(row: MatrixDynamicRowModel): void;
}
export declare class QuestionMatrixDynamic extends QuestionMatrixDynamicModel {
    name: string;
    constructor(name: string);
}

export declare class QuestionPanelDynamicImplementor extends QuestionImplementor {
    koRecalc: any;
    koAddPanelClick: any;
    koRemovePanelClick: any;
    koButtonAddCss: any;
    koButtonPrevCss: any;
    koButtonNextCss: any;
    koPrevPanelClick: any;
    koNextPanelClick: any;
    koCanAddPanel: any;
    koCanRemovePanel: any;
    koProgressText: any;
    koProgress: any;
    koPanel: any;
    koIsList: any;
    koIsProgressTop: any;
    koIsProgressBottom: any;
    koIsNextButton: any;
    koIsPrevButton: any;
    koIsRange: any;
    koRangeValue: any;
    koRangeMax: any;
    constructor(question: Question);
    protected onPanelCountChanged(): void;
    protected onRenderModeChanged(): void;
    protected onCurrentIndexChanged(): void;
    protected addPanel(): void;
    protected removePanel(val: any): void;
    protected readonly buttonAddCss: string;
    protected readonly buttonPrevCss: any;
    protected readonly buttonNextCss: any;
    protected readonly progress: string;
}
export declare class QuestionPanelDynamic extends QuestionPanelDynamicModel {
    name: string;
    constructor(name: string);
    protected createNewPanelObject(): PanelModel;
}

export declare class MultipleTextItem extends MultipleTextItemModel {
    name: any;
    constructor(name?: any, title?: string);
    protected createEditor(name: string): QuestionTextModel;
}
export declare class QuestionMultipleTextImplementor extends QuestionImplementor {
    koRows: any;
    constructor(question: Question);
    protected onColCountChanged(): void;
}
export declare class QuestionMultipleText extends QuestionMultipleTextModel {
    name: string;
    constructor(name: string);
    protected createTextItem(name: string, title: string): MultipleTextItemModel;
}

export declare class QuestionRadiogroup extends QuestionRadiogroupModel {
    name: string;
    constructor(name: string);
    getItemClass(item: any): any;
    getLabelClass(item: any): any;
    getControlLabelClass(item: any): any;
}

export declare class QuestionRating extends QuestionRatingModel {
    name: string;
    constructor(name: string);
}

export declare class QuestionText extends QuestionTextModel {
    name: string;
    constructor(name: string);
}

export declare class QuestionBooleanImplementor extends QuestionImplementor {
    question: Question;
    constructor(question: Question);
}
export declare class QuestionBoolean extends QuestionBooleanModel {
    name: string;
    constructor(name: string);
    getItemCss(row: any, column: any): any;
    getCheckedLabelCss(): string;
    getUncheckedLabelCss(): string;
}

export declare class QuestionEmpty extends QuestionEmptyModel {
    name: string;
    constructor(name: string);
}

export declare class QuestionExpressionImplementor extends QuestionImplementor {
    question: Question;
    koDisplayValue: any;
    constructor(question: Question);
}
export declare class QuestionExpression extends QuestionExpressionModel {
    name: string;
    constructor(name: string);
}

export declare class QuestionImagePicker extends QuestionImagePickerModel {
    name: string;
    constructor(name: string);
    getItemClass(item: any): string;
}

export declare class SurveyWindow extends SurveyWindowModel {
    koExpanded: any;
    koExpandedCss: any;
    doExpand: any;
    constructor(jsonObj?: any, initialModel?: SurveyModel);
    protected createSurvey(jsonObj: any): SurveyModel;
    protected closeWindowOnComplete(): void;
    protected template: string;
    protected doShowingChanged(): void;
    protected getDefaultTemplate(): string;
    readonly css: any;
}

export declare var koTemplate: any;
export declare class SurveyTemplateText {
    constructor();
    addText(newText: string, id: string, name: string): void;
    replaceText(replaceText: string, id: string, questionType?: string): void;
    protected getId(id: string, questionType: string): string;
    protected text: string;
}

/**
    * Global survey settings
    */
export declare var settings: {
        /**
            * The prefix that uses to store the question comment, as {questionName} + {commentPrefix}.
            * The default
            */
        commentPrefix: string;
        /**
            * Encode parameter on calling restfull web API
            */
        webserviceEncodeParameters: boolean;
        /**
            * SurveyJS web service API url
            */
        surveyServiceUrl: string;
        /**
            * separator that can allow to set value and text of ItemValue object in one string as: "value|text"
            */
        itemValueSeparator: string;
        /**
            * default locale name for localizable strings that uses during serialization, {"default": "My text", "de": "Mein Text"}
            */
        defaultLocaleName: string;
        /**
            * Default row name for matrix (single choice)
            */
        matrixDefaultRowName: string;
        /**
            * Default cell type for dropdown and dynamic matrices
            */
        matrixDefaultCellType: string;
        /**
            * Total value postfix for dropdown and dynamic matrices. The total value stores as: {matrixName} + {postfix}
            */
        matrixTotalValuePostFix: string;
        /**
            * Maximum row count in dynamic matrix
            */
        matrixMaximumRowCount: number;
        /**
            * Maximum panel count in dynamic panel
            */
        panelMaximumPanelCount: number;
        /**
            * Maximum rate value count in rating question
            */
        ratingMaximumRateValueCount: number;
        /**
            * Disable the question while choices are getting from the web service
            */
        disableOnGettingChoicesFromWeb: boolean;
};

export interface HashTable<T> {
    [key: string]: T;
}
export declare class Helpers {
    /**
      * A static methods that returns true if a value underfined, null, empty string or empty array.
      * @param value
      */
    static isValueEmpty(value: any): boolean;
    static isArrayContainsEqual(x: any, y: any): boolean;
    static isArraysEqual(x: any, y: any, ignoreOrder?: boolean): boolean;
    static isTwoValueEquals(x: any, y: any, ignoreOrder?: boolean): boolean;
    static randomizeArray<T>(array: Array<T>): Array<T>;
    static getUnbindValue(value: any): any;
    static isConvertibleToNumber(value: any): boolean;
    static isNumber(value: any): boolean;
    static getMaxLength(maxLength: number, surveyLength: number): any;
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
        errorOwner: ISurveyErrorOwner;
        onAsyncCompleted: (result: ValidatorResult) => void;
        constructor();
        text: string;
        readonly isValidateAllValues: boolean;
        readonly locText: LocalizableString;
        protected getErrorText(name: string): string;
        protected getDefaultErrorText(name: string): string;
        validate(value: any, name?: string, values?: any, properties?: any): ValidatorResult;
        readonly isRunning: boolean;
        readonly isAsync: boolean;
        getLocale(): string;
        getMarkdownHtml(text: string): string;
        getProcessedText(text: string): string;
        protected createCustomError(name: string): SurveyError;
        toString(): string;
}
export interface IValidatorOwner {
        getValidators(): Array<SurveyValidator>;
        validatedValue: any;
        getValidatorTitle(): string;
        getDataFilteredValues(): any;
        getDataFilteredProperties(): any;
}
export declare class ValidatorRunner {
        onAsyncCompleted: (errors: Array<SurveyError>) => void;
        run(owner: IValidatorOwner): Array<SurveyError>;
}
/**
    * Validate numeric values.
    */
export declare class NumericValidator extends SurveyValidator {
        minValue: number;
        maxValue: number;
        constructor(minValue?: number, maxValue?: number);
        getType(): string;
        validate(value: any, name?: string, values?: any, properties?: any): ValidatorResult;
        protected getDefaultErrorText(name: string): any;
}
/**
    * Validate text values.
    */
export declare class TextValidator extends SurveyValidator {
        minLength: number;
        maxLength: number;
        allowDigits: boolean;
        constructor(minLength?: number, maxLength?: number, allowDigits?: boolean);
        getType(): string;
        validate(value: any, name?: string, values?: any, properties?: any): ValidatorResult;
        protected getDefaultErrorText(name: string): any;
}
export declare class AnswerCountValidator extends SurveyValidator {
        minCount: number;
        maxCount: number;
        constructor(minCount?: number, maxCount?: number);
        getType(): string;
        validate(value: any, name?: string, values?: any, properties?: any): ValidatorResult;
        protected getDefaultErrorText(name: string): string;
}
/**
    * Use it to validate the text by regular expressions.
    */
export declare class RegexValidator extends SurveyValidator {
        regex: string;
        constructor(regex?: string);
        getType(): string;
        validate(value: any, name?: string, values?: any, properties?: any): ValidatorResult;
}
/**
    * Validate e-mail address in the text input
    */
export declare class EmailValidator extends SurveyValidator {
        constructor();
        getType(): string;
        validate(value: any, name?: string, values?: any, properties?: any): ValidatorResult;
        protected getDefaultErrorText(name: string): any;
}
/**
    * Show error if expression returns false
    */
export declare class ExpressionValidator extends SurveyValidator {
        expression: string;
        constructor(expression?: string);
        getType(): string;
        readonly isValidateAllValues: boolean;
        readonly isAsync: boolean;
        readonly isRunning: boolean;
        validate(value: any, name?: string, values?: any, properties?: any): ValidatorResult;
        protected generateError(res: boolean, value: any): ValidatorResult;
        protected getDefaultErrorText(name: string): any;
        protected ensureConditionRunner(): boolean;
}

/**
  * Array of ItemValue is used in checkox, dropdown and radiogroup choices, matrix columns and rows.
  * It has two main properties: value and text. If text is empty, value is used for displaying.
  * The text property is localizable and support markdown.
  */
export declare class ItemValue extends Base {
    [index: string]: any;
    static Separator: string;
    static createArray(locOwner: ILocalizableOwner): Array<ItemValue>;
    static setupArray(items: Array<ItemValue>, locOwner: ILocalizableOwner): void;
    static setData(items: Array<ItemValue>, values: Array<any>): void;
    static getData(items: Array<ItemValue>): any;
    static getItemByValue(items: Array<ItemValue>, val: any): ItemValue;
    static getTextOrHtmlByValue(items: Array<ItemValue>, val: any): string;
    static locStrsChanged(items: Array<ItemValue>): void;
    static runConditionsForItems(items: Array<ItemValue>, filteredItems: Array<ItemValue>, runner: ConditionRunner, values: any, properties: any, useItemExpression?: boolean): boolean;
    static runEnabledConditionsForItems(items: Array<ItemValue>, runner: ConditionRunner, values: any, properties: any): boolean;
    constructor(value: any, text?: string, typeName?: string);
    onCreating(): any;
    getType(): string;
    readonly locText: LocalizableString;
    setLocText(locText: LocalizableString): void;
    locOwner: ILocalizableOwner;
    value: any;
    readonly hasText: boolean;
    text: string;
    readonly calculatedText: string;
    getData(): any;
    toJSON(): any;
    setData(value: any): void;
    visibleIf: string;
    readonly isVisible: boolean;
    setIsVisible(val: boolean): void;
    readonly isEnabled: any;
    setIsEnabled(val: boolean): void;
    addUsedLocales(locales: Array<string>): void;
    protected getConditionRunner(isVisible: boolean): ConditionRunner;
}

export interface ISurveyData {
        getValue(name: string): any;
        setValue(name: string, newValue: any, locNotification: any): any;
        getVariable(name: string): any;
        setVariable(name: string, newValue: any): void;
        getComment(name: string): string;
        setComment(name: string, newValue: string, locNotification: any): any;
        getAllValues(): any;
        getFilteredValues(): any;
        getFilteredProperties(): any;
}
export interface ITextProcessor {
        processText(text: string, returnDisplayValue: boolean): string;
        processTextEx(text: string, returnDisplayValue: boolean, doEncoding: boolean): any;
}
export interface ISurveyErrorOwner extends ILocalizableOwner {
        getErrorCustomText(text: string, error: SurveyError): string;
}
export interface ISurvey extends ITextProcessor, ISurveyErrorOwner {
        currentPage: IPage;
        pages: Array<IPage>;
        isPageStarted(page: IPage): boolean;
        pageVisibilityChanged(page: IPage, newValue: boolean): any;
        panelVisibilityChanged(panel: IPanel, newValue: boolean): any;
        questionVisibilityChanged(question: IQuestion, newValue: boolean): any;
        questionsOrder: string;
        questionAdded(question: IQuestion, index: number, parentPanel: any, rootPanel: any): any;
        panelAdded(panel: IElement, index: number, parentPanel: any, rootPanel: any): any;
        questionRemoved(question: IQuestion): any;
        panelRemoved(panel: IElement): any;
        questionRenamed(question: IQuestion, oldName: string, oldValueName: string): any;
        validateQuestion(question: IQuestion): SurveyError;
        validatePanel(panel: IPanel): SurveyError;
        hasVisibleQuestionByValueName(valueName: string): boolean;
        questionCountByValueName(valueName: string): number;
        processHtml(html: string): string;
        getSurveyMarkdownHtml(element: Base, text: string): string;
        isDisplayMode: boolean;
        isDesignMode: boolean;
        areInvisibleElementsShowing: boolean;
        isLoadingFromJson: boolean;
        isUpdateValueTextOnTyping: boolean;
        requiredText: string;
        beforeSettingQuestionErrors(question: IQuestion, errors: Array<SurveyError>): void;
        getQuestionTitleTemplate(): string;
        getUpdatedQuestionTitle(question: IQuestion, title: string): string;
        questionStartIndex: string;
        questionTitleLocation: string;
        questionDescriptionLocation: string;
        questionErrorLocation: string;
        storeOthersAsComment: boolean;
        maxTextLength: number;
        maxOthersLength: number;
        clearValueOnDisableItems: boolean;
        uploadFiles(name: string, files: File[], uploadingCallback: (status: string, data: any) => any): any;
        downloadFile(name: string, content: string, callback: (status: string, data: any) => any): any;
        clearFiles(name: string, value: any, fileName: string, clearCallback: (status: string, data: any) => any): any;
        updateChoicesFromServer(question: IQuestion, choices: Array<any>, serverResult: any): Array<any>;
        updateQuestionCssClasses(question: IQuestion, cssClasses: any): any;
        updatePanelCssClasses(panel: IPanel, cssClasses: any): any;
        afterRenderQuestion(question: IQuestion, htmlElement: any): any;
        afterRenderPanel(panel: IElement, htmlElement: any): any;
        afterRenderPage(htmlElement: any): any;
        getQuestionByValueNameFromArray(valueName: string, name: string, index: number): IQuestion;
        matrixRowAdded(question: IQuestion): any;
        matrixBeforeRowAdded(options: {
                question: IQuestion;
                canAddRow: boolean;
        }): any;
        matrixRowRemoved(question: IQuestion, rowIndex: number, row: any): any;
        matrixAllowRemoveRow(question: IQuestion, rowIndex: number, row: any): boolean;
        matrixCellCreated(question: IQuestion, options: any): any;
        matrixAfterCellRender(question: IQuestion, options: any): any;
        matrixCellValueChanged(question: IQuestion, options: any): any;
        matrixCellValueChanging(question: IQuestion, options: any): any;
        matrixCellValidate(question: IQuestion, options: any): SurveyError;
        dynamicPanelAdded(question: IQuestion): any;
        dynamicPanelRemoved(question: IQuestion, panelIndex: number): any;
        dynamicPanelItemValueChanged(question: IQuestion, options: any): any;
        dragAndDropAllow(options: any): boolean;
}
export interface ISurveyImpl {
        geSurveyData(): ISurveyData;
        getSurvey(): ISurvey;
        getTextProcessor(): ITextProcessor;
}
export interface IConditionRunner {
        runCondition(values: HashTable<any>, properties: HashTable<any>): any;
}
export interface ISurveyElement {
        name: string;
        isVisible: boolean;
        isReadOnly: boolean;
        isPage: boolean;
        containsErrors: boolean;
        setSurveyImpl(value: ISurveyImpl): any;
        onSurveyLoad(): any;
        onFirstRendering(): any;
        getType(): string;
        setVisibleIndex(value: number): number;
        locStrsChanged(): any;
        delete(): any;
}
export interface IElement extends IConditionRunner, ISurveyElement {
        visible: boolean;
        parent: IPanel;
        renderWidth: string;
        width: string;
        rightIndent: number;
        startWithNewLine: boolean;
        isPanel: boolean;
        getPanel(): IPanel;
        getLayoutType(): string;
        isLayoutTypeSupported(layoutType: string): boolean;
        removeElement(el: IElement): boolean;
        onAnyValueChanged(name: string): any;
        updateCustomWidgets(): any;
        clearIncorrectValues(): any;
        clearErrors(): any;
}
export interface IQuestion extends IElement, ISurveyErrorOwner {
        hasTitle: boolean;
        isEmpty(): boolean;
        onSurveyValueChanged(newValue: any): any;
        updateValueFromSurvey(newValue: any): any;
        updateCommentFromSurvey(newValue: any): any;
        supportGoNextPageAutomatic(): boolean;
        clearUnusedValues(): any;
        getDisplayValue(keysAsText: boolean, value: any): any;
        getValueName(): string;
        clearValue(): any;
        clearValueIfInvisible(): any;
        isAnswerCorrect(): boolean;
        updateValueWithDefaults(): any;
        getQuestionFromArray(name: string, index: number): IQuestion;
        value: any;
}
export interface IParentElement {
        addElement(element: IElement, index: number): any;
        removeElement(element: IElement): boolean;
        isReadOnly: boolean;
}
export interface IPanel extends ISurveyElement, IParentElement {
        getChildrenLayoutType(): string;
        getQuestionTitleLocation(): string;
        parent: IPanel;
        elementWidthChanged(el: IElement): any;
        indexOf(el: IElement): number;
        elements: Array<IElement>;
}
export interface IPage extends IPanel, IConditionRunner {
        isStarted: boolean;
}
/**
    * The base class for SurveyJS objects.
    */
export declare class Base {
        static commentPrefix: string;
        static createItemValue: (item: any, type?: string) => any;
        static itemValueLocStrChanged: (arr: Array<any>) => void;
        /**
            * A static methods that returns true if a value underfined, null, empty string or empty array.
            * @param value
            */
        isValueEmpty(value: any): boolean;
        protected IsPropertyEmpty(value: any): boolean;
        protected isLoadingFromJsonValue: boolean;
        onPropertyChanged: Event<(sender: Base, options: any) => any, any>;
        getPropertyValueCoreHandler: (propertiesHash: any, name: string) => any;
        setPropertyValueCoreHandler: (propertiesHash: any, name: string, val: any) => void;
        constructor();
        /**
            * Returns the type of the object as a string as it represents in the json. It should be in lowcase.
            */
        getType(): string;
        /**
            * Returns the element template name without prefix. Typically it equals to getType().
            * @see getType
            */
        getTemplate(): string;
        /**
            * Returns true if the object is loading from Json at the current moment.
            */
        readonly isLoadingFromJson: boolean;
        startLoadingFromJson(): void;
        endLoadingFromJson(): void;
        /**
            * Deserialized the current object into JSON
            */
        toJSON(): any;
        locStrsChanged(): void;
        /**
            * Returns the property value by name
            * @param name property name
            */
        getPropertyValue(name: string, defaultValue?: any): any;
        protected getPropertyValueCore(propertiesHash: any, name: string): any;
        geValueFromHash(): any;
        protected setPropertyValueCore(propertiesHash: any, name: string, val: any): void;
        iteratePropertiesHash(func: (hash: any, key: any) => void): void;
        /**
            * set property value
            * @param name property name
            * @param val new property value
            */
        setPropertyValue(name: string, val: any): void;
        protected propertyValueChanged(name: string, oldValue: any, newValue: any): void;
        /**
            * Register a function that will be called on a property value changed.
            * @param name the property name
            * @param func the function with no parameters that will be called on property changed.
            * @param key an optional parameter. If there is already a registered function for this property witht the same key, it will be overwritten.
            */
        registerFunctionOnPropertyValueChanged(name: string, func: any, key?: string): void;
        /**
            * Register a function that will be called on a property value changed from the names list.
            * @param names the list of properties names
            * @param func the function with no parameters that will be called on property changed.
            * @param key an optional parameter. If there is already a registered function for this property witht the same key, it will be overwritten.
            */
        registerFunctionOnPropertiesValueChanged(names: Array<string>, func: any, key?: string): void;
        /**
            * Unregister notification on property value changed
            * @param name the property name
            * @param key the key with which you have registered the notification for this property. It can be null.
            */
        unRegisterFunctionOnPropertyValueChanged(name: string, key?: string): void;
        /**
            * Unregister notification on property value changed for all properties in the names list.
            * @param names the list of properties names
            * @param key the key with which you have registered the notification for this property. It can be null.
            */
        unRegisterFunctionOnPropertiesValueChanged(names: Array<string>, key?: string): void;
        createCustomLocalizableObj(name: string): void;
        protected createLocalizableString(name: string, owner: ILocalizableOwner, useMarkDown?: boolean): LocalizableString;
        getLocalizableString(name: string): LocalizableString;
        getLocalizableStringText(name: string, defaultStr?: string): string;
        setLocalizableStringText(name: string, value: string): void;
        addUsedLocales(locales: Array<string>): void;
        protected AddLocStringToUsedLocales(locStr: LocalizableString, locales: Array<string>): void;
        protected createItemValues(name: string): Array<any>;
        protected createNewArray(name: string, onPush?: any, onRemove?: any): Array<any>;
        protected getItemValueType(): string;
        protected setArray(src: any[], dest: any[], isItemValues: boolean, onPush: any): void;
        protected isTwoValueEquals(x: any, y: any, caseInSensitive?: boolean): boolean;
}
export declare class SurveyError {
        text: string;
        protected errorOwner: ISurveyErrorOwner;
        visible: boolean;
        constructor(text?: string, errorOwner?: ISurveyErrorOwner);
        readonly locText: LocalizableString;
        getText(): string;
        getErrorType(): string;
        protected getDefaultText(): string;
}
export declare class SurveyElement extends Base implements ISurveyElement {
        readOnlyChangedCallback: () => void;
        static ScrollElementToTop(elementId: string): boolean;
        static GetFirstNonTextElement(elements: any): any;
        static FocusElement(elementId: string): boolean;
        constructor(name: string);
        setSurveyImpl(value: ISurveyImpl): void;
        protected readonly surveyImpl: ISurveyImpl;
        readonly data: ISurveyData;
        /**
            * Returns the survey object.
            */
        readonly survey: ISurvey;
        /**
            * Returns true if the question in design mode right now.
            */
        readonly isDesignMode: boolean;
        readonly areInvisibleElementsShowing: boolean;
        readonly isVisible: boolean;
        readonly isReadOnly: boolean;
        /**
            * Set it to true to make an element question/panel/page readonly.
            * @see enableIf
            * @see isReadOnly
            */
        readOnly: boolean;
        protected onReadOnlyChanged(): void;
        readonly isLoadingFromJson: boolean;
        name: string;
        protected onNameChanged(oldValue: string): void;
        /**
            * The list of errors. It is created by callig hasErrors functions
            * @see hasErrors
            */
        errors: Array<SurveyError>;
        /**
            * Returns true if a question or a container (panel/page) or their chidren have an error.
            * The value can be out of date. hasErrors function should be called to get the correct value.
            */
        readonly containsErrors: boolean;
        updateContainsErrors(): void;
        protected getContainsErrors(): boolean;
        getElementsInDesign(includeHidden?: boolean): Array<IElement>;
        selectedElementInDesign: SurveyElement;
        updateCustomWidgets(): void;
        onSurveyLoad(): void;
        onFirstRendering(): void;
        endLoadingFromJson(): void;
        setVisibleIndex(index: number): number;
        readonly isPage: boolean;
        delete(): void;
        protected removeSelfFromList(list: Array<any>): void;
        protected readonly textProcessor: ITextProcessor;
        protected getProcessedHtml(html: string): string;
        protected onSetData(): void;
        protected getPage(parent: IPanel): IPage;
        protected moveToBase(parent: IPanel, container: IPanel, insertBefore?: any): boolean;
        protected setPage(parent: IPanel, val: IPage): void;
        protected copyCssClasses(dest: any, source: any): void;
}
export declare class Event<T extends Function, Options> {
        protected callbacks: Array<T>;
        readonly isEmpty: boolean;
        fire(sender: any, options: Options): void;
        clear(): void;
        add(func: T): void;
        remove(func: T): void;
        hasFunc(func: T): boolean;
}

/**
    * The calculated value is a way to define the variable in Survey Creator.
    * It has two main properties: name and expression. Based on expression the value read-only property is automatically calculated.
    * The name property should be unique though all calcualted values.
    * It uses survey.getVariable/seruvey.setVariable functions to get/set its value. The class do not store its value internally.
    * You may set includeIntoResult property to true to store this calculated value into survey result.
    */
export declare class CalculatedValue extends Base {
        constructor(name?: string, expression?: string);
        setOwner(data: ISurveyData): void;
        getType(): string;
        /**
            * The calculated value name. It should be non empty and unique.
            */
        name: string;
        /**
            * Set this property to true to include the non-empty calculated value into survey result, survey.data property.
            */
        includeIntoResult: boolean;
        /**
            * The Expression that used to calculate the value. You may use standard operators like +, -, * and /, squares (). Here is the example of accessing the question value {questionname}.
            * <br/>Example: "({quantity} * {price}) * (100 - {discount}) / 100"
            */
        expression: string;
        locCalculation(): void;
        unlocCalculation(): void;
        runExpression(values: HashTable<any>, properties: HashTable<any>): void;
        readonly value: any;
        protected setValue(val: any): void;
}

export declare class AnswerRequiredError extends SurveyError {
    text: string;
    constructor(text?: string, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    protected getDefaultText(): string;
}
export declare class OneAnswerRequiredError extends SurveyError {
    text: string;
    constructor(text?: string, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    protected getDefaultText(): string;
}
export declare class RequreNumericError extends SurveyError {
    text: string;
    constructor(text?: string, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    protected getDefaultText(): string;
}
export declare class ExceedSizeError extends SurveyError {
    constructor(maxSize: number, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    getDefaultText(): string;
}
export declare class WebRequestError extends SurveyError {
    status: string;
    response: string;
    constructor(status: string, response: string, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    protected getDefaultText(): string;
}
export declare class WebRequestEmptyError extends SurveyError {
    text: string;
    constructor(text: string, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    protected getDefaultText(): string;
}
export declare class OtherEmptyError extends SurveyError {
    text: string;
    constructor(text: string, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    protected getDefaultText(): string;
}
export declare class UploadingFileError extends SurveyError {
    text: string;
    constructor(text: string, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    protected getDefaultText(): string;
}
export declare class RequiredInAllRowsError extends SurveyError {
    text: string;
    constructor(text: string, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    protected getDefaultText(): string;
}
export declare class MinRowCountError extends SurveyError {
    minRowCount: number;
    constructor(minRowCount: number, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    protected getDefaultText(): string;
}
export declare class KeyDuplicationError extends SurveyError {
    text: string;
    constructor(text: string, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
    protected getDefaultText(): string;
}
export declare class CustomError extends SurveyError {
    text: string;
    constructor(text: string, errorOwner?: ISurveyErrorOwner);
    getErrorType(): string;
}

export interface ILocalizableOwner {
    getLocale(): string;
    getMarkdownHtml(text: string): string;
    getProcessedText(text: string): string;
}
/**
  * The class represents the string that supports multi-languages and markdown.
  * It uses in all objects where support for multi-languages and markdown is required.
  */
export declare class LocalizableString {
    owner: ILocalizableOwner;
    useMarkdown: boolean;
    static defaultLocale: string;
    onGetTextCallback: (str: string) => string;
    onStrChanged: () => void;
    sharedData: LocalizableString;
    constructor(owner: ILocalizableOwner, useMarkdown?: boolean);
    readonly locale: string;
    strChanged(): void;
    text: string;
    readonly calculatedText: string;
    readonly pureText: string;
    readonly hasHtml: boolean;
    readonly html: string;
    readonly isEmpty: boolean;
    readonly textOrHtml: string;
    readonly renderedHtml: string;
    getLocaleText(loc: string): string;
    setLocaleText(loc: string, value: string): void;
    hasNonDefaultText(): boolean;
    getLocales(): Array<string>;
    getJson(): any;
    setJson(value: any): void;
    equals(obj: any): boolean;
    onChanged(): void;
    protected onCreating(): void;
}

/**
    * A class that contains expression and html propeties. It uses in survey.completedHtmlOnCondition array.
    * If the expression returns true then html of this item uses instead of survey.completedHtml property
    * @see SurveyModel.completedHtmlOnCondition
    * @see SurveyModel.completedHtml
    */
export declare class HtmlConditionItem extends Base implements ILocalizableOwner {
        locOwner: ILocalizableOwner;
        constructor(expression?: string, html?: string);
        getType(): string;
        runCondition(values: any, properties: any): boolean;
        /**
            * The expression property. If this expression returns true, then survey will use html property to show on complete page.
            */
        expression: string;
        /**
            * The html that shows on completed ('Thank you') page. The expression should return true
            * @see expression
            */
        html: string;
        readonly locHtml: LocalizableString;
        getLocale(): string;
        getMarkdownHtml(text: string): string;
        getProcessedText(text: string): string;
}

/**
  * A definition for filling choices for checkbox, dropdown and radiogroup questions from resfull services.
  * The run method call a restfull service and results can be get on getResultCallback.
  */
export declare class ChoicesRestfull extends Base {
    static EncodeParameters: boolean;
    static clearCache(): void;
    static onBeforeSendRequest: (sender: ChoicesRestfull, options: {
        request: XMLHttpRequest;
    }) => void;
    protected processedUrl: string;
    protected processedPath: string;
    getResultCallback: (items: Array<ItemValue>) => void;
    beforeSendRequestCallback: () => void;
    updateResultCallback: (items: Array<ItemValue>, serverResult: any) => Array<ItemValue>;
    getItemValueCallback: (item: any) => any;
    error: SurveyError;
    owner: IQuestion;
    constructor();
    run(textProcessor?: ITextProcessor): void;
    readonly isRunning: boolean;
    readonly isWaitingForParameters: boolean;
    protected useChangedItemsResults(): boolean;
    protected parseResponse(response: any): any;
    protected sendRequest(): void;
    getType(): string;
    readonly isEmpty: boolean;
    getCustomPropertiesNames(): Array<string>;
    setData(json: any): void;
    getData(): any;
    url: string;
    path: string;
    valueName: string;
    titleName: string;
    allowEmptyResponse: boolean;
    readonly itemValueType: string;
    clear(): void;
    protected beforeSendRequest(): void;
    protected onLoad(result: any): void;
}

export declare class FunctionFactory {
    static Instance: FunctionFactory;
    register(name: string, func: (params: any[]) => any, isAsync?: boolean): void;
    unregister(name: string): void;
    hasFunction(name: string): boolean;
    isAsyncFunction(name: string): boolean;
    clear(): void;
    getAll(): Array<string>;
    run(name: string, params: any[], properties?: HashTable<any>): any;
}
export declare var registerFunction: (name: string, func: (params: any[]) => any, isAsync?: boolean) => void;

export declare class ExpressionRunnerBase {
    constructor(expression: string);
    expression: string;
    getVariables(): Array<string>;
    hasFunction(): boolean;
    readonly isAsync: boolean;
    canRun(): boolean;
    protected runCore(values: HashTable<any>, properties?: HashTable<any>): any;
    protected doOnComplete(res: any): void;
}
export declare class ConditionRunner extends ExpressionRunnerBase {
    onRunComplete: (result: boolean) => void;
    run(values: HashTable<any>, properties?: HashTable<any>): boolean;
    protected doOnComplete(res: any): void;
}
export declare class ExpressionRunner extends ExpressionRunnerBase {
    onRunComplete: (result: any) => void;
    run(values: HashTable<any>, properties?: HashTable<any>): any;
    protected doOnComplete(res: any): void;
}

export declare abstract class Operand {
    toString(func?: (op: Operand) => string): string;
    abstract getType(): string;
    abstract evaluate(processValue?: ProcessValue): any;
    abstract setVariables(variables: Array<string>): any;
    hasFunction(): boolean;
    hasAsyncFunction(): boolean;
    addToAsyncList(list: Array<FunctionOperand>): void;
}
export declare class BinaryOperand extends Operand {
    constructor(operatorName: string, left?: any, right?: any, isArithmeticOp?: boolean);
    getType(): string;
    readonly isArithmetic: boolean;
    readonly isConjunction: boolean;
    readonly leftOperand: any;
    readonly rightOperand: any;
    evaluate(processValue?: ProcessValue): any;
    toString(func?: (op: Operand) => string): string;
    setVariables(variables: Array<string>): void;
    hasFunction(): boolean;
    hasAsyncFunction(): boolean;
    addToAsyncList(list: Array<FunctionOperand>): void;
}
export declare class UnaryOperand extends Operand {
    constructor(expression: Operand, operatorName: string);
    getType(): string;
    toString(func?: (op: Operand) => string): string;
    evaluate(processValue?: ProcessValue): boolean;
    setVariables(variables: Array<string>): void;
}
export declare class ArrayOperand extends Operand {
    constructor(values: Array<Operand>);
    getType(): string;
    toString(func?: (op: Operand) => string): string;
    evaluate(processValue?: ProcessValue): Array<any>;
    setVariables(variables: Array<string>): void;
    hasFunction(): boolean;
    hasAsyncFunction(): boolean;
    addToAsyncList(list: Array<FunctionOperand>): void;
}
export declare class Const extends Operand {
    constructor(value: any);
    getType(): string;
    toString(func?: (op: Operand) => string): string;
    readonly correctValue: any;
    evaluate(): any;
    setVariables(variables: Array<string>): void;
    protected getCorrectValue(value: any): any;
}
export declare class Variable extends Const {
    constructor(variableName: string);
    getType(): string;
    toString(func?: (op: Operand) => string): string;
    readonly variable: string;
    evaluate(processValue?: ProcessValue): any;
    setVariables(variables: Array<string>): void;
}
export declare class FunctionOperand extends Operand {
    onAsyncReady: () => void;
    constructor(origionalValue: string, parameters: ArrayOperand);
    getType(): string;
    evaluateAsync(processValue: ProcessValue): void;
    evaluate(processValue?: ProcessValue): any;
    toString(func?: (op: Operand) => string): string;
    setVariables(variables: Array<string>): void;
    readonly isReady: boolean;
    hasFunction(): boolean;
    hasAsyncFunction(): boolean;
    addToAsyncList(list: Array<FunctionOperand>): void;
}
export declare class OperandMaker {
    static throwInvalidOperatorError(op: string): void;
    static safeToString(operand: Operand, func: (op: Operand) => string): string;
    static toOperandString(value: string): string;
    static isSpaceString(str: string): boolean;
    static isNumeric(value: string): boolean;
    static isBooleanValue(value: string): boolean;
    static unaryFunctions: HashTable<Function>;
    static binaryFunctions: HashTable<Function>;
    static operatorToString(operatorName: string): string;
    static signs: HashTable<string>;
}

export declare class ConditionsParserError {
    at: number;
    code: string;
    constructor(at: number, code: string);
}
export declare class ConditionsParser {
    createCondition(text: string): Operand;
    parseExpression(text: string): Operand;
    readonly error: ConditionsParserError;
}

export interface ValueCore {
    hasValue: boolean;
    value: any;
}
export declare class ProcessValue {
    values: HashTable<any>;
    properties: HashTable<any>;
    constructor();
    getFirstName(text: string, obj?: any): string;
    hasValue(text: string, values?: HashTable<any>): boolean;
    setValue(obj: any, text: string, value: any): void;
    getValue(text: string, values?: HashTable<any>): any;
}

export interface IObject {
    [key: string]: any;
}
export declare class JsonObjectProperty implements IObject {
    name: string;
    static getItemValuesDefaultValue: (val: any) => any;
    [key: string]: any;
    isSerializable: boolean;
    isLightSerializable: boolean;
    isCustom: boolean;
    isDynamicChoices: boolean;
    className: string;
    alternativeName: string;
    classNamePart: string;
    baseClassName: string;
    defaultValueValue: any;
    serializationProperty: string;
    maxLength: number;
    maxValue: any;
    minValue: any;
    layout: string;
    onGetValue: (obj: any) => any;
    onSetValue: (obj: any, value: any, jsonConv: JsonObject) => any;
    visibleIf: (obj: any) => boolean;
    constructor(name: string, isRequired?: boolean);
    type: string;
    isArray: boolean;
    isRequired: boolean;
    readonly hasToUseGetValue: string | ((obj: any) => any);
    defaultValue: any;
    isDefaultValue(value: any): boolean;
    getValue(obj: any): any;
    getPropertyValue(obj: any): any;
    readonly hasToUseSetValue: string | ((obj: any, value: any, jsonConv: JsonObject) => any);
    setValue(obj: any, value: any, jsonConv: JsonObject): void;
    getObjType(objType: string): string;
    getClassName(className: string): string;
    /**
      * Depricated, please use getChoices
      */
    readonly choices: Array<any>;
    readonly hasChoices: boolean;
    getChoices(obj: any, choicesCallback?: any): Array<any>;
    setChoices(value: Array<any>, valueFunc: () => Array<any>): void;
    getBaseValue(): string;
    setBaseValue(val: any): void;
    readOnly: boolean;
    isVisible(layout: string, obj?: any): boolean;
    visible: boolean;
    isLocalizable: boolean;
    mergeWith(prop: JsonObjectProperty): void;
    addDependedProperty(name: string): void;
    getDependedProperties(): Array<string>;
}
export declare class CustomPropertiesCollection {
    static addProperty(className: string, property: any): void;
    static removeProperty(className: string, propertyName: string): void;
    static addClass(className: string, parentClassName: string): void;
    static getProperties(className: string): Array<any>;
    static createProperties(obj: any): void;
}
export declare class JsonMetadataClass {
    name: string;
    creator: (json?: any) => any;
    parentName: string;
    static requiredSymbol: string;
    static typeSymbol: string;
    properties: Array<JsonObjectProperty>;
    constructor(name: string, properties: Array<any>, creator?: (json?: any) => any, parentName?: string);
    find(name: string): JsonObjectProperty;
    createProperty(propInfo: any): JsonObjectProperty;
}
export declare class JsonMetadata {
    addClass(name: string, properties: Array<any>, creator?: (json?: any) => any, parentName?: string): JsonMetadataClass;
    removeClass(name: string): void;
    overrideClassCreatore(name: string, creator: () => any): void;
    overrideClassCreator(name: string, creator: () => any): void;
    getProperties(className: string): Array<JsonObjectProperty>;
    getPropertiesByObj(obj: any): Array<JsonObjectProperty>;
    findProperty(className: string, propertyName: string): JsonObjectProperty;
    findProperties(className: string, propertyNames: Array<string>): Array<JsonObjectProperty>;
    createClass(name: string, json?: any): any;
    getChildrenClasses(name: string, canBeCreated?: boolean): Array<JsonMetadataClass>;
    getRequiredProperties(name: string): Array<string>;
    addProperties(className: string, propertiesInfos: Array<any>): void;
    addProperty(className: string, propertyInfo: any): void;
    removeProperty(className: string, propertyName: string): boolean;
    findClass(name: string): JsonMetadataClass;
    isDescendantOf(className: string, ancestorClassName: string): boolean;
    addAlterNativeClassName(name: string, alternativeName: string): void;
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
    lightSerializing: boolean;
    toJsonObject(obj: any, storeDefaults?: boolean): any;
    toObject(jsonObj: any, obj: any): void;
    toObjectCore(jsonObj: any, obj: any): void;
    protected toJsonObjectCore(obj: any, property: JsonObjectProperty, storeDefaults?: boolean): any;
    valueToJson(obj: any, result: any, property: JsonObjectProperty, storeDefaults?: boolean): void;
    protected valueToObj(value: any, obj: any, property: JsonObjectProperty): void;
}
export declare var Serializer: JsonMetadata;

export interface IMatrixDropdownData {
        value: any;
        onRowChanged(row: MatrixDropdownRowModelBase, columnName: string, newRowValue: any, isDeletingValue: boolean): void;
        onRowChanging(row: MatrixDropdownRowModelBase, columnName: string, rowValue: any): any;
        getRowIndex(row: MatrixDropdownRowModelBase): number;
        validateCell(row: MatrixDropdownRowModelBase, columnName: string, rowValue: any): SurveyError;
        columns: Array<MatrixDropdownColumn>;
        createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
        getLocale(): string;
        getMarkdownHtml(text: string): string;
        getProcessedText(text: string): string;
        getSharedQuestionByName(columnName: string, row: MatrixDropdownRowModelBase): Question;
        onTotalValueChanged(): any;
        getSurvey(): ISurvey;
}
export interface IMatrixColumnOwner extends ILocalizableOwner {
        getRequiredText(): string;
        onColumnPropertiesChanged(column: MatrixDropdownColumn): void;
        getCellType(): string;
}
export declare var matrixDropdownColumnTypes: {
        dropdown: {
                properties: string[];
                onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => void;
        };
        checkbox: {
                properties: string[];
                onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => void;
        };
        radiogroup: {
                properties: string[];
                onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => void;
        };
        text: {
                properties: string[];
                onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => void;
        };
        comment: {
                properties: string[];
                onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => void;
        };
        boolean: {
                properties: string[];
                onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => void;
        };
        expression: {
                properties: string[];
                onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => void;
        };
        rating: {
                properties: string[];
        };
};
export declare class MatrixDropdownColumn extends Base implements ILocalizableOwner {
        static getColumnTypes(): Array<string>;
        constructor(name: string, title?: string);
        getDynamicPropertyName(): string;
        getDynamicType(): string;
        getDynamicProperties(): Array<string>;
        colOwner: IMatrixColumnOwner;
        locStrsChanged(): void;
        addUsedLocales(locales: Array<string>): void;
        readonly index: number;
        setIndex(val: number): void;
        getType(): string;
        cellType: string;
        readonly templateQuestion: Question;
        readonly value: string;
        readonly isVisible: boolean;
        setIsVisible(newVal: boolean): void;
        hasVisibleCell: boolean;
        name: string;
        title: string;
        readonly locTitle: LocalizableString;
        readonly fullTitle: string;
        isRequired: boolean;
        requiredErrorText: string;
        readonly locRequiredErrorText: LocalizableString;
        readOnly: boolean;
        hasOther: boolean;
        visibleIf: string;
        enableIf: string;
        requiredIf: string;
        readonly hasCondition: boolean;
        validators: Array<SurveyValidator>;
        totalType: string;
        totalExpression: string;
        readonly hasTotal: boolean;
        totalFormat: string;
        readonly locTotalFormat: LocalizableString;
        totalMaximumFractionDigits: number;
        totalMinimumFractionDigits: number;
        totalDisplayStyle: string;
        totalCurrency: string;
        minWidth: string;
        width: string;
        colCount: number;
        getLocale(): string;
        getMarkdownHtml(text: string): string;
        getProcessedText(text: string): string;
        createCellQuestion(data: any): Question;
        updateCellQuestion(cellQuestion: Question, data: any): void;
        defaultCellTypeChanged(): void;
        protected calcCellQuestionType(): string;
        protected updateTemplateQuestion(): void;
        protected createNewQuestion(cellType: string): Question;
        protected setQuestionProperties(question: Question): void;
        protected propertyValueChanged(name: string, oldValue: any, newValue: any): void;
}
export declare class MatrixDropdownCell {
        column: MatrixDropdownColumn;
        row: MatrixDropdownRowModelBase;
        data: IMatrixDropdownData;
        constructor(column: MatrixDropdownColumn, row: MatrixDropdownRowModelBase, data: IMatrixDropdownData);
        protected createQuestion(column: MatrixDropdownColumn, row: MatrixDropdownRowModelBase, data: IMatrixDropdownData): Question;
        readonly question: Question;
        value: any;
        runCondition(values: HashTable<any>, properties: HashTable<any>): void;
}
export declare class MatrixDropdownTotalCell extends MatrixDropdownCell {
        column: MatrixDropdownColumn;
        row: MatrixDropdownRowModelBase;
        data: IMatrixDropdownData;
        constructor(column: MatrixDropdownColumn, row: MatrixDropdownRowModelBase, data: IMatrixDropdownData);
        protected createQuestion(column: MatrixDropdownColumn, row: MatrixDropdownRowModelBase, data: IMatrixDropdownData): Question;
        updateCellQuestion(): void;
        getTotalExpression(): string;
}
export declare class MatrixDropdownRowModelBase implements ISurveyData, ISurveyImpl, ILocalizableOwner, ITextProcessor {
        static RowVariableName: string;
        static OwnerVariableName: string;
        static IndexVariableName: string;
        protected data: IMatrixDropdownData;
        cells: Array<MatrixDropdownCell>;
        constructor(data: IMatrixDropdownData, value: any);
        readonly id: string;
        readonly rowName: any;
        value: any;
        readonly locText: LocalizableString;
        getAllValues(): any;
        getFilteredValues(): any;
        getFilteredProperties(): any;
        runCondition(values: HashTable<any>, properties: HashTable<any>): void;
        onAnyValueChanged(name: string): void;
        getDataValueCore(valuesHash: any, key: string): any;
        getValue(name: string): any;
        setValue(name: string, newColumnValue: any): void;
        getVariable(name: string): any;
        setVariable(name: string, newValue: any): void;
        getComment(name: string): string;
        setComment(name: string, newValue: string, locNotification: any): void;
        readonly isEmpty: boolean;
        getQuestionByColumn(column: MatrixDropdownColumn): Question;
        getQuestionByColumnName(columnName: string): Question;
        protected getSharedQuestionByName(columnName: string): Question;
        clearIncorrectValues(val: any): void;
        getLocale(): string;
        getMarkdownHtml(text: string): string;
        getProcessedText(text: string): string;
        locStrsChanged(): void;
        updateCellQuestionOnColumnChanged(column: MatrixDropdownColumn): void;
        onQuestionReadOnlyChanged(parentIsReadOnly: boolean): void;
        protected updateCellOnColumnChanged(cell: MatrixDropdownCell): void;
        protected buildCells(value: any): void;
        protected createCell(column: MatrixDropdownColumn): MatrixDropdownCell;
        geSurveyData(): ISurveyData;
        getSurvey(): ISurvey;
        protected readonly rowIndex: number;
        getTextProcessor(): ITextProcessor;
        processText(text: string, returnDisplayValue: boolean): string;
        processTextEx(text: string, returnDisplayValue: boolean): any;
}
export declare class MatrixDropdownTotalRowModel extends MatrixDropdownRowModelBase {
        constructor(data: IMatrixDropdownData);
        protected createCell(column: MatrixDropdownColumn): MatrixDropdownCell;
        setValue(name: string, newValue: any): void;
        runCondition(values: HashTable<any>, properties: HashTable<any>): void;
        protected updateCellOnColumnChanged(cell: MatrixDropdownCell): void;
}
export declare class QuestionMatrixDropdownRenderedCell {
        minWidth: string;
        width: string;
        locTitle: LocalizableString;
        cell: MatrixDropdownCell;
        row: MatrixDropdownRowModelBase;
        question: Question;
        isRemoveRow: boolean;
        matrix: QuestionMatrixDropdownModelBase;
        constructor();
        readonly hasQuestion: boolean;
        readonly hasTitle: boolean;
        readonly id: number;
}
export declare class QuestionMatrixDropdownRenderedRow {
        cells: Array<QuestionMatrixDropdownRenderedCell>;
        constructor();
        readonly id: number;
}
export declare class QuestionMatrixDropdownRenderedTable extends Base {
        matrix: QuestionMatrixDropdownModelBase;
        constructor(matrix: QuestionMatrixDropdownModelBase);
        readonly showHeader: boolean;
        readonly showFooter: boolean;
        readonly hasFooter: boolean;
        readonly hasRemoveRows: boolean;
        isRequireReset(): boolean;
        readonly headerRow: QuestionMatrixDropdownRenderedRow;
        readonly footerRow: QuestionMatrixDropdownRenderedRow;
        readonly rows: Array<QuestionMatrixDropdownRenderedRow>;
        protected build(): void;
        onAddedRow(): void;
        onRemovedRow(index: number): void;
        protected buildHeader(): void;
        protected buildFooter(): void;
        protected buildRows(): void;
}
/**
    * A base class for matrix dropdown and matrix dynamic questions.
    */
export declare class QuestionMatrixDropdownModelBase extends QuestionMatrixBaseModel<MatrixDropdownRowModelBase, MatrixDropdownColumn> implements IMatrixDropdownData {
        name: string;
        static defaultCellType: string;
        static addDefaultColumns(matrix: QuestionMatrixDropdownModelBase): void;
        protected isRowChanging: boolean;
        columnsChangedCallback: () => void;
        updateCellsCallback: () => void;
        columnLayoutChangedCallback: () => void;
        onRenderedTableResetCallback: () => void;
        onRenderedTableCreatedCallback: (table: QuestionMatrixDropdownRenderedTable) => void;
        protected createColumnValues(): any[];
        constructor(name: string);
        getType(): string;
        readonly isRowsDynamic: boolean;
        /**
            * Set columnLayout to 'vertical' to place columns vertically and rows horizontally. It makes sense when we have many columns and few rows.
            * @see columns
            * @see rowCount
            */
        columnLayout: string;
        columnsLocation: string;
        /**
            * Returns true if columns are located horizontally
            * @see columnLayout
            */
        readonly isColumnLayoutHorizontal: boolean;
        readonly hasRowText: boolean;
        getFooterText(): LocalizableString;
        readonly canRemoveRows: boolean;
        canRemoveRow(row: MatrixDropdownRowModelBase): boolean;
        protected onRowsChanged(): void;
        protected onStartRowAddingRemoving(): void;
        protected onEndRowAdding(): void;
        protected onEndRowRemoving(index: number): void;
        protected resetRenderedTable(): void;
        readonly renderedTable: QuestionMatrixDropdownRenderedTable;
        protected createRenderedTable(): QuestionMatrixDropdownRenderedTable;
        protected onMatrixRowCreated(row: MatrixDropdownRowModelBase): void;
        /**
            * Use this property to change the default cell type.
            */
        cellType: string;
        /**
            * The default column count for radiogroup and checkbox  cell types.
            */
        columnColCount: number;
        /**
            * Use this property to set the mimimum column width.
            */
        columnMinWidth: string;
        /**
            * Set this property to true to show the horizontal scroll.
            */
        horizontalScroll: boolean;
        getRequiredText(): string;
        onColumnPropertiesChanged(column: MatrixDropdownColumn): void;
        readonly hasFooter: boolean;
        protected updateHasFooter(): void;
        readonly hasTotal: boolean;
        getCellType(): string;
        getConditionJson(operator?: string, path?: string): any;
        clearIncorrectValues(): void;
        clearErrors(): void;
        runCondition(values: HashTable<any>, properties: HashTable<any>): void;
        protected shouldRunColumnExpression(): boolean;
        protected runCellsCondition(values: HashTable<any>, properties: HashTable<any>): void;
        protected runTotalsCondition(values: HashTable<any>, properties: HashTable<any>): void;
        locStrsChanged(): void;
        /**
            * Returns the column by it's name. Retuns null if a column with this name doesn't exist.
            * @param column
            */
        getColumnByName(columnName: string): MatrixDropdownColumn;
        getColumnName(columnName: string): MatrixDropdownColumn;
        /**
            * Returns the column width.
            * @param column
            */
        getColumnWidth(column: MatrixDropdownColumn): string;
        /**
            * The default choices for dropdown, checkbox and radiogroup cell types.
            */
        choices: Array<any>;
        /**
            * The default options caption for dropdown cell type.
            */
        optionsCaption: string;
        readonly locOptionsCaption: LocalizableString;
        addColumn(name: string, title?: string): MatrixDropdownColumn;
        protected getVisibleRows(): Array<MatrixDropdownRowModelBase>;
        readonly totalValue: any;
        protected getVisibleTotalRow(): MatrixDropdownRowModelBase;
        readonly visibleTotalRow: MatrixDropdownRowModelBase;
        onSurveyLoad(): void;
        /**
            * Returns the row value. If the row value is empty, the object is empty: {}.
            * @param rowIndex row index from 0 to visible row count - 1.
            */
        getRowValue(rowIndex: number): any;
        /**
            * Set the row value.
            * @param rowIndex row index from 0 to visible row count - 1.
            * @param rowValue an object {"column name": columnValue,... }
            */
        setRowValue(rowIndex: number, rowValue: any): any;
        protected generateRows(): Array<MatrixDropdownRowModelBase>;
        protected generateTotalRow(): MatrixDropdownRowModelBase;
        protected createNewValue(nullOnEmpty?: boolean): any;
        protected getRowValueCore(row: MatrixDropdownRowModelBase, questionValue: any, create?: boolean): any;
        protected getRowDisplayValue(row: MatrixDropdownRowModelBase, rowValue: any): any;
        getPlainData(options?: {
                includeEmpty?: boolean;
                calculations?: Array<{
                        propertyName: string;
                }>;
        }): any;
        protected onBeforeValueChanged(val: any): void;
        protected setQuestionValue(newValue: any): void;
        supportGoNextPageAutomatic(): boolean;
        protected getContainsErrors(): boolean;
        protected getIsAnswered(): boolean;
        hasErrors(fireCallback?: boolean, rec?: any): boolean;
        protected getIsRunningValidators(): boolean;
        getAllErrors(): Array<SurveyError>;
        protected getFirstInputElementId(): string;
        protected getFirstErrorInputElementId(): string;
        protected getFirstCellQuestion(onError: boolean): Question;
        protected onReadOnlyChanged(): void;
        createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
        protected createQuestionCore(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
        protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any;
        onAnyValueChanged(name: string): void;
        protected isObject(value: any): boolean;
        protected onCellValueChanged(row: MatrixDropdownRowModelBase, columnName: string, rowValue: any): void;
        validateCell(row: MatrixDropdownRowModelBase, columnName: string, rowValue: any): SurveyError;
        onRowChanging(row: MatrixDropdownRowModelBase, columnName: string, rowValue: any): any;
        onRowChanged(row: MatrixDropdownRowModelBase, columnName: string, newRowValue: any, isDeletingValue: boolean): void;
        getRowIndex(row: MatrixDropdownRowModelBase): number;
        getSharedQuestionByName(columnName: string, row: MatrixDropdownRowModelBase): Question;
        onTotalValueChanged(): any;
        getQuestionFromArray(name: string, index: number): IQuestion;
        getSurvey(): ISurvey;
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
        /**
            * Set this property to show it on the first column for the total row.
            */
        totalText: string;
        readonly locTotalText: LocalizableString;
        getFooterText(): LocalizableString;
        protected getDisplayValueCore(keysAsText: boolean, value: any): any;
        addConditionNames(names: Array<string>): void;
        addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void;
        clearIncorrectValues(): void;
        clearValueIfInvisible(): void;
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
        constructor(name: string);
        getType(): string;
        readonly isRowsDynamic: boolean;
        /**
            * Set it to true, to show a confirmation dialog on removing a row
            * @see ConfirmDeleteText
            */
        confirmDelete: boolean;
        /**
            * Set it to a column name and the library shows duplication error, if there are same values in different rows in the column.
            * @see keyDuplicationError
            */
        keyName: string;
        /**
            * If it is not empty, then this value is set to every new row, including rows created initially, unless the defaultValue is not empty
            * @see defaultValue
            * @see defaultValueFromLastRow
            */
        defaultRowValue: any;
        /**
            * Set it to true to copy the value into new added row from the last row. If defaultRowValue is set and this property equals to true,
            * then the value for new added row is merging.
            * @see defaultValue
            * @see defaultRowValue
            */
        defaultValueFromLastRow: boolean;
        protected isDefaultValueEmpty(): boolean;
        protected setDefaultValue(): void;
        /**
            * The number of rows in the matrix.
            * @see minRowCount
            * @see maxRowCount
            */
        rowCount: number;
        /**
            * The minimum row count. A user could not delete a row if the rowCount equals to minRowCount
            * @see rowCount
            * @see maxRowCount
            */
        minRowCount: number;
        /**
            * The maximum row count. A user could not add a row if the rowCount equals to maxRowCount
            * @see rowCount
            * @see minRowCount
            */
        maxRowCount: number;
        /**
            * Returns true, if a new row can be added.
            * @see maxRowCount
            * @see canRemoveRows
            * @see rowCount
            */
        readonly canAddRow: boolean;
        /**
            * Returns true, if row can be removed.
            * @see minRowCount
            * @see canAddRow
            * @see rowCount
            */
        readonly canRemoveRows: boolean;
        canRemoveRow(row: MatrixDropdownRowModelBase): boolean;
        /**
            * Creates and add a new row.
            */
        addRow(): void;
        protected hasRowsAsItems(): boolean;
        /**
            * Removes a row by it's index. If confirmDelete is true, show a confirmation dialog
            * @param index a row index, from 0 to rowCount - 1
            * @see removeRow
            * @see confirmDelete
            */
        removeRowUI(value: any): void;
        isRequireConfirmOnRowDelete(index: number): boolean;
        /**
            * Removes a row by it's index.
            * @param index a row index, from 0 to rowCount - 1
            */
        removeRow(index: number): void;
        /**
            * Use this property to change the default text showing in the confirmation delete dialog on removing a row.
            */
        confirmDeleteText: string;
        readonly locConfirmDeleteText: LocalizableString;
        /**
            * The duplication value error text. Set it to show the text different from the default.
            * @see keyName
            */
        keyDuplicationError: string;
        readonly locKeyDuplicationError: LocalizableString;
        /**
            * Use this property to change the default value of add row button text.
            */
        addRowText: string;
        readonly locAddRowText: LocalizableString;
        /**
            * By default the 'Add Row' button is shown on bottom if columnLayout is horizontal and on top if columnLayout is vertical. <br/>
            * You may set it to "top", "bottom" or "topBottom" (to show on top and bottom).
            * @see columnLayout
            */
        addRowLocation: string;
        readonly isAddRowOnTop: boolean;
        readonly isAddRowOnBottom: boolean;
        /**
            * Use this property to change the default value of remove row button text.
            */
        removeRowText: string;
        readonly locRemoveRowText: LocalizableString;
        protected getDisplayValueCore(keysAsText: boolean, value: any): any;
        addConditionNames(names: Array<string>): void;
        addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void;
        supportGoNextPageAutomatic(): boolean;
        readonly hasRowText: boolean;
        protected onCheckForErrors(errors: Array<SurveyError>): void;
        hasErrors(fireCallback?: boolean, rec?: any): boolean;
        protected generateRows(): Array<MatrixDynamicRowModel>;
        protected createMatrixRow(value: any): MatrixDynamicRowModel;
        protected onBeforeValueChanged(val: any): void;
        protected createNewValue(): any;
        protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any;
        protected getRowValueCore(row: MatrixDropdownRowModelBase, questionValue: any, create?: boolean): any;
}

export interface IMatrixData {
        onMatrixRowChanged(row: MatrixRowModel): void;
}
export declare class MatrixRowModel {
        fullName: string;
        protected rowValue: any;
        constructor(item: ItemValue, fullName: string, data: IMatrixData, value: any);
        readonly name: string;
        readonly text: string;
        readonly locText: LocalizableString;
        value: any;
        protected onValueChanged(): void;
}
export interface IMatrixCellsOwner extends ILocalizableOwner {
        getRows(): Array<any>;
        getColumns(): Array<any>;
}
export declare class MartrixCells {
        cellsOwner: IMatrixCellsOwner;
        constructor(cellsOwner: IMatrixCellsOwner);
        readonly isEmpty: boolean;
        setCellText(row: any, column: any, val: string): void;
        setDefaultCellText(column: any, val: string): void;
        getCellLocText(row: any, column: any): LocalizableString;
        getDefaultCellLocText(column: any, val: string): LocalizableString;
        getCellDisplayLocText(row: any, column: any): LocalizableString;
        getCellText(row: any, column: any): string;
        getDefaultCellText(column: any): string;
        getCellDisplayText(row: any, column: any): string;
        readonly rows: Array<any>;
        readonly columns: Array<any>;
        getJson(): any;
        setJson(value: any): void;
        protected createString(): LocalizableString;
}
/**
    * A Model for a simple matrix question.
    */
export declare class QuestionMatrixModel extends QuestionMatrixBaseModel<MatrixRowModel, ItemValue> implements IMatrixData, IMatrixCellsOwner {
        name: string;
        constructor(name: string);
        getType(): string;
        /**
            * Set this property to true, if you want a user to answer all rows.
            */
        isAllRowRequired: boolean;
        /**
            * Returns true, if there is at least one row.
            */
        readonly hasRows: boolean;
        /**
            * Use this property to render items in a specific order: "random" or "initial". Default is "initial".
            */
        rowsOrder: string;
        getRows(): Array<any>;
        getColumns(): Array<any>;
        protected getQuizQuestionCount(): number;
        protected getCorrectAnswerCount(): number;
        protected getVisibleRows(): Array<MatrixRowModel>;
        protected sortVisibleRows(array: Array<MatrixRowModel>): Array<MatrixRowModel>;
        endLoadingFromJson(): void;
        protected processRowsOnSet(newRows: Array<any>): MatrixRowModel[];
        /**
            * Returns the list of visible rows as model objects.
            * @see rowsVisibleIf
            */
        readonly visibleRows: Array<MatrixRowModel>;
        cells: MartrixCells;
        readonly hasCellText: boolean;
        setCellText(row: any, column: any, val: string): void;
        getCellText(row: any, column: any): string;
        setDefaultCellText(column: any, val: string): void;
        getDefaultCellText(column: any): string;
        getCellDisplayText(row: any, column: any): string;
        getCellDisplayLocText(row: any, column: any): LocalizableString;
        supportGoNextPageAutomatic(): boolean;
        protected onCheckForErrors(errors: Array<SurveyError>): void;
        protected getIsAnswered(): boolean;
        protected createMatrixRow(item: ItemValue, fullName: string, value: any): MatrixRowModel;
        protected setQuestionValue(newValue: any): void;
        protected getDisplayValueCore(keysAsText: boolean, value: any): any;
        getPlainData(options?: {
                includeEmpty?: boolean;
                calculations?: Array<{
                        propertyName: string;
                }>;
        }): any;
        addConditionNames(names: Array<string>): void;
        addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void;
        getConditionJson(operator?: string, path?: string): any;
        clearValueIfInvisible(): void;
        protected getFirstInputElementId(): string;
        onMatrixRowChanged(row: MatrixRowModel): void;
}

export interface IMultipleTextData extends ILocalizableOwner, IPanel {
        getSurvey(): ISurvey;
        getTextProcessor(): ITextProcessor;
        getAllValues(): any;
        getMultipleTextValue(name: string): any;
        setMultipleTextValue(name: string, value: any): any;
        getItemDefaultValue(name: string): any;
        getIsRequiredText(): string;
}
export declare class MultipleTextItemModel extends Base implements IValidatorOwner, ISurveyData, ISurveyImpl {
        valueChangedCallback: (newValue: any) => void;
        constructor(name?: any, title?: string);
        getType(): string;
        readonly id: string;
        /**
            * The item name.
            */
        name: string;
        readonly editor: QuestionTextModel;
        protected createEditor(name: string): QuestionTextModel;
        addUsedLocales(locales: Array<string>): void;
        locStrsChanged(): void;
        setData(data: IMultipleTextData): void;
        /**
            * Set this property to true, to make the item a required. If a user doesn't fill the item then a validation error will be generated.
            */
        isRequired: boolean;
        /**
            * Use this property to change the default input type.
            */
        inputType: string;
        /**
            * Item title. If it is empty, the item name is rendered as title. This property supports markdown.
            * @see name
            */
        title: string;
        readonly locTitle: LocalizableString;
        /**
            * Returns the text or html for rendering the title.
            */
        readonly fullTitle: string;
        /**
            * The maximim text length. If it is -1, defaul value, then the survey maxTextLength property will be used.
            * If it is 0, then the value is unlimited
            * @see SurveyModel.maxTextLength
            */
        maxLength: number;
        getMaxLength(): any;
        /**
            * The input place holder.
            */
        placeHolder: string;
        readonly locPlaceHolder: LocalizableString;
        /**
            * The custom text that will be shown on required error. Use this property, if you do not want to show the default text.
            */
        requiredErrorText: string;
        readonly locRequiredErrorText: LocalizableString;
        /**
            * The list of question validators.
            */
        validators: Array<SurveyValidator>;
        getValidators(): Array<SurveyValidator>;
        /**
            * The item value.
            */
        value: any;
        isEmpty(): boolean;
        onValueChanged(newValue: any): void;
        geSurveyData(): ISurveyData;
        getSurvey(): ISurvey;
        getTextProcessor(): ITextProcessor;
        getValue(name: string): any;
        setValue(name: string, value: any): void;
        getVariable(name: string): any;
        setVariable(name: string, newValue: any): void;
        getComment(name: string): string;
        setComment(name: string, newValue: string): void;
        getAllValues(): any;
        getFilteredValues(): any;
        getFilteredProperties(): any;
        getValidatorTitle(): string;
        validatedValue: any;
        getDataFilteredValues(): any;
        getDataFilteredProperties(): any;
}
/**
    * A Model for a multiple text question.
    */
export declare class QuestionMultipleTextModel extends Question implements IMultipleTextData, IPanel {
        name: string;
        colCountChangedCallback: () => void;
        constructor(name: string);
        getType(): string;
        setSurveyImpl(value: ISurveyImpl): void;
        readonly isAllowTitleLeft: boolean;
        onSurveyLoad(): void;
        setQuestionValue(newValue: any): void;
        onSurveyValueChanged(newValue: any): void;
        /**
            * The list of input items.
            */
        items: Array<MultipleTextItemModel>;
        /**
            * Add a new text item.
            * @param name a item name
            * @param title a item title (optional)
            */
        addItem(name: string, title?: string): MultipleTextItemModel;
        getItemByName(name: string): MultipleTextItemModel;
        addConditionNames(names: Array<string>): void;
        addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void;
        getConditionJson(operator?: string, path?: string): any;
        locStrsChanged(): void;
        supportGoNextPageAutomatic(): boolean;
        /**
            * The number of columns. Items are rendred in one line if the value is 0.
            */
        colCount: number;
        /**
            * The default text input size.
            */
        itemSize: number;
        /**
            * Returns the list of rendered rows.
            */
        getRows(): Array<any>;
        protected onValueChanged(): void;
        protected createTextItem(name: string, title: string): MultipleTextItemModel;
        protected onItemValueChanged(): void;
        protected getIsRunningValidators(): boolean;
        hasErrors(fireCallback?: boolean, rec?: any): boolean;
        getAllErrors(): Array<SurveyError>;
        clearErrors(): void;
        protected getContainsErrors(): boolean;
        protected getIsAnswered(): boolean;
        getMultipleTextValue(name: string): any;
        setMultipleTextValue(name: string, value: any): void;
        getItemDefaultValue(name: string): any;
        getSurvey(): ISurvey;
        getTextProcessor(): ITextProcessor;
        getAllValues(): any;
        getIsRequiredText(): string;
        addElement(element: IElement, index: number): void;
        removeElement(element: IElement): boolean;
        getQuestionTitleLocation(): string;
        getChildrenLayoutType(): string;
        elementWidthChanged(el: IElement): void;
        readonly elements: Array<IElement>;
        indexOf(el: IElement): number;
}

export declare class DragDropInfo {
        source: IElement;
        target: IElement;
        nestedPanelDepth: number;
        constructor(source: IElement, target: IElement, nestedPanelDepth?: number);
        destination: ISurveyElement;
        isBottom: boolean;
        isEdge: boolean;
}
export declare class QuestionRowModel extends Base {
        panel: PanelModelBase;
        constructor(panel: PanelModelBase);
        readonly elements: Array<IElement>;
        visible: boolean;
        readonly visibleElements: Array<IElement>;
        updateVisible(): void;
        addElement(q: IElement): void;
        readonly index: number;
}
/**
    * A base class for a Panel and Page objects.
    */
export declare class PanelModelBase extends SurveyElement implements IPanel, IConditionRunner, ILocalizableOwner, ISurveyErrorOwner {
        name: string;
        addElementCallback: (element: IElement) => void;
        removeElementCallback: (element: IElement) => void;
        onGetQuestionTitleLocation: () => string;
        constructor(name?: string);
        getType(): string;
        setSurveyImpl(value: ISurveyImpl): void;
        endLoadingFromJson(): void;
        /**
            * PanelModel or PageModel title property.
            * @description
            */
        title: string;
        readonly locTitle: LocalizableString;
        /**
            * PanelModel or PageModel description property. It renders under title by using smaller font. Unlike the title, description can be empty.
            * @see title
            */
        description: string;
        readonly locDescription: LocalizableString;
        locStrsChanged(): void;
        /**
            * The custom text that will be shown on required error. Use this property, if you do not want to show the default text.
            */
        requiredErrorText: string;
        readonly locRequiredErrorText: LocalizableString;
        getLocale(): string;
        getMarkdownHtml(text: string): string;
        getProcessedText(text: string): string;
        /**
            * A parent element. It is always null for the Page object and always not null for the Panel object. Panel object may contain Questions and other Panels.
            */
        parent: PanelModelBase;
        readonly depth: number;
        /**
            * An expression that returns true or false. If it returns true the Panel becomes visible and if it returns false the Panel becomes invisible. The library runs the expression on survey start and on changing a question value. If the property is empty then visible property is used.
            * @see visible
            */
        visibleIf: string;
        readonly cssClasses: any;
        /**
            * A unique element identificator. It is generated automatically.
            */
        id: string;
        /**
            * Returns true if the current object is Panel. Returns false if the current object is Page (a root Panel).
            */
        readonly isPanel: boolean;
        getPanel(): IPanel;
        getLayoutType(): string;
        isLayoutTypeSupported(layoutType: string): boolean;
        /**
            * Returns the list of all questions located in the Panel/Page, including in the nested Panels.
            * @see Question
            * @see elements
            */
        readonly questions: Array<Question>;
        /**
            * Returns the question by its name
            * @param name the question name
            */
        getQuestionByName(name: string): Question;
        /**
            * Retuns the element by its name. It works recursively.
            * @param name the element name
            */
        getElementByName(name: string): IElement;
        getQuestionByValueName(valueName: string): Question;
        /**
            * Returns question values on the current page
            */
        getValue(): any;
        /**
            * Returns question comments on the current page
            */
        getComments(): any;
        /**
            * Call this function to remove all question values from the current page/panel, that end-user will not be able to enter.
            * For example the value that doesn't exists in a radigroup/dropdown/checkbox choices or matrix rows/columns.
            * Please note, this function doesn't clear values for invisible questions or values that doesn't associated with questions.
            * @see Question.clearIncorrectValues
            */
        clearIncorrectValues(): void;
        /**
            * Call this function to clear all errors in the panel / page and all its child elements (panels and questions)
            */
        clearErrors(): void;
        /**
            * Returns the list of the elements in the object, Panel/Page. Elements can be questions or panels. The function doesn't return elements in the nested Panels.
            */
        readonly elements: Array<IElement>;
        getElementsInDesign(includeHidden?: boolean): Array<IElement>;
        /**
            * Returns true if the current element belongs to the Panel/Page. It looks in nested Panels as well.
            * @param element
            * @see PanelModel
            */
        containsElement(element: IElement): boolean;
        /**
            * Set this property to true, to require the answer at least in one question in the panel.
            */
        isRequired: boolean;
        /**
            * Returns true, if there is an error on this Page or inside the current Panel
            * @param fireCallback set it to true, to show errors in UI
            * @param focusOnFirstError set it to true to focus on the first question that doesn't pass the validation
            */
        hasErrors(fireCallback?: boolean, focusOnFirstError?: boolean, rec?: any): boolean;
        getErrorCustomText(text: string, error: SurveyError): string;
        protected hasErrorsCore(rec: any): void;
        protected getContainsErrors(): boolean;
        updateElementVisibility(): void;
        getFirstQuestionToFocus(withError?: boolean): Question;
        /**
            * Call it to focus the input on the first question
            */
        focusFirstQuestion(): void;
        /**
            * Call it to focus the input of the first question that has an error.
            */
        focusFirstErrorQuestion(): void;
        /**
            * Fill list array with the questions.
            * @param list
            * @param visibleOnly set it to true to get visible questions only
            */
        addQuestionsToList(list: Array<IQuestion>, visibleOnly?: boolean, includingDesignTime?: boolean): void;
        /**
            * Fill list array with the panels.
            * @param list
            */
        addPanelsIntoList(list: Array<IPanel>, visibleOnly?: boolean, includingDesignTime?: boolean): void;
        /**
            * Returns true if the current object is Page and it is the current page.
            */
        readonly isActive: boolean;
        updateCustomWidgets(): void;
        /**
            * Set this property different from "default" to set the specific question title location for this panel/page.
            * @see SurveyModel.questionTitleLocation
            */
        questionTitleLocation: string;
        getQuestionTitleLocation(): string;
        getChildrenLayoutType(): string;
        protected readonly root: PanelModelBase;
        protected childVisibilityChanged(): void;
        protected createRow(): QuestionRowModel;
        onSurveyLoad(): void;
        onFirstRendering(): void;
        readonly rows: Array<QuestionRowModel>;
        protected onRowsChanged(): void;
        protected onAddElement(element: IElement, index: number): void;
        protected onRemoveElement(element: IElement): void;
        protected updateRowsRemoveElementFromRow(element: IElement, row: QuestionRowModel): void;
        elementWidthChanged(el: IElement): void;
        /**
            * Returns rendered title text or html.
            */
        readonly processedTitle: string;
        protected getRenderedTitle(str: string): string;
        /**
            * Use it to get/set the object visibility.
            * @see visibleIf
            */
        visible: boolean;
        protected onVisibleChanged(): void;
        /**
            * Returns true if object is visible or survey is in design mode right now.
            */
        readonly isVisible: boolean;
        getIsPageVisible(exceptionQuestion: IQuestion): boolean;
        setVisibleIndex(index: number): number;
        /**
            * Retuns true if readOnly property is true or survey is in display mode or parent panel/page is readOnly.
            * @see SurveyModel.model
            * @see readOnly
            */
        readonly isReadOnly: boolean;
        protected onReadOnlyChanged(): void;
        /**
            * An expression that returns true or false. If it returns false the Panel/Page becomes read only and an end-user will not able to answer on qustions inside it.
            * The library runs the expression on survey start and on changing a question value. If the property is empty then readOnly property is used.
            * @see readOnly
            * @see isReadOnly
            */
        enableIf: string;
        /**
            * Add an element into Panel or Page. Returns true if the element added successfully. Otherwise returns false.
            * @param element
            * @param index element index in the elements array
            */
        addElement(element: IElement, index?: number): boolean;
        protected canAddElement(element: IElement): boolean;
        /**
            * Add a question into Panel or Page. Returns true if the question added successfully. Otherwise returns false.
            * @param question
            * @param index element index in the elements array
            */
        addQuestion(question: Question, index?: number): boolean;
        /**
            * Add a panel into Panel or Page.  Returns true if the panel added successfully. Otherwise returns false.
            * @param panel
            * @param index element index in the elements array
            */
        addPanel(panel: PanelModel, index?: number): boolean;
        /**
            * Creates a new question and adds it at location of index, by default the end of the elements list. Returns null, if the question could not be created or could not be added into page or panel.
            * @param questionType the possible values are: "text", "checkbox", "dropdown", "matrix", "html", "matrixdynamic", "matrixdropdown" and so on.
            * @param name a question name
            * @param index element index in the elements array
            */
        addNewQuestion(questionType: string, name?: string, index?: number): Question;
        /**
            * Creates a new panel and adds it into the end of the elements list. Returns null, if the panel could not be created or could not be added into page or panel.
            * @param name a panel name
            */
        addNewPanel(name?: string): PanelModel;
        /**
            * Returns the index of element parameter in the elements list.
            * @param element question or panel
            */
        indexOf(element: IElement): number;
        protected createNewPanel(name: string): PanelModel;
        /**
            * Remove an element (Panel or Question) from the elements list.
            * @param element
            * @see elements
            */
        removeElement(element: IElement): boolean;
        /**
            * Remove question  from the elements list.
            * @param question
            * @see elements
            * @see removeElement
            */
        removeQuestion(question: Question): void;
        runCondition(values: HashTable<any>, properties: HashTable<any>): void;
        onAnyValueChanged(name: string): void;
        protected dragDropAddTarget(dragDropInfo: DragDropInfo): void;
        protected dragDropFindRow(findElement: ISurveyElement): QuestionRowModel;
        dragDropMoveElement(src: IElement, target: IElement, targetIndex: number): void;
}
/**
    * A container element, similar to the Page objects. However, unlike the Page, Panel can't be a root.
    * It may contain questions and other panels.
    */
export declare class PanelModel extends PanelModelBase implements IElement {
        name: string;
        stateChangedCallback: () => void;
        constructor(name?: string);
        getType(): string;
        onSurveyLoad(): void;
        readonly isPanel: boolean;
        /**
            * Get/set the page where the panel is located.
            */
        page: IPage;
        delete(): void;
        /**
            * Set this property to "collapsed" to render only Panel title and expanded button and to "expanded" to render the collapsed button in the Panel caption
            */
        state: string;
        /**
            * Returns true if the Panel is in the collapsed state
            * @see state
            * @see collapse
            * @see isExpanded
            */
        readonly isCollapsed: boolean;
        /**
            * Returns true if the Panel is in the expanded state
            * @see state
            * @see expand
            * @see isCollapsed
            */
        readonly isExpanded: boolean;
        /**
            * Collapse the Panel
            * @see state
            */
        collapse(): void;
        /**
            * Expand the Panel
            * @see state
            */
        expand(): void;
        /**
            * Move panel to a new container Page/Panel. Add as a last element if insertBefore parameter is not used or inserted into the given index,
            * if insert parameter is number, or before the given element, if the insertBefore parameter is a question or panel
            * @param container Page or Panel to where a question is relocated.
            * @param insertBefore Use it if you want to set the panel to a specific position. You may use a number (use 0 to insert int the beginning) or element, if you want to insert before this element.
            */
        moveTo(container: IPanel, insertBefore?: any): boolean;
        protected hasErrorsCore(rec: any): void;
        protected getRenderedTitle(str: string): string;
        /**
            * The Panel width.
            */
        width: string;
        /**
            * The left indent. Set this property to increase the panel left indent.
            */
        indent: number;
        /**
            * The inner indent. Set this property to increase the panel content margin.
            */
        innerIndent: number;
        renderWidth: string;
        /**
            * The Panel renders on the new line if the property is true. If the property is false, the panel tries to render on the same line/row with a previous question/panel.
            */
        startWithNewLine: boolean;
        /**
            * The right indent of the Panel.
            */
        rightIndent: number;
        paddingLeft: string;
        innerPaddingLeft: string;
        paddingRight: string;
        protected onVisibleChanged(): void;
}

/**
  * The flow panel object. It is a container with flow layout where you can mix questions with mardown text.
  *
  */
export declare class FlowPanelModel extends PanelModel {
    static contentElementNamePrefix: string;
    contentChangedCallback: () => void;
    onGetHtmlForQuestion: (question: Question) => string;
    onCustomHtmlProducing: () => string;
    constructor(name?: string);
    getType(): string;
    getChildrenLayoutType(): string;
    onSurveyLoad(): any;
    content: string;
    readonly locContent: LocalizableString;
    html: string;
    protected onContentChanged(): any;
    produceHtml(): string;
    getQuestionFromText(str: string): Question;
    protected getHtmlForQuestion(question: Question): string;
    protected getQuestionHtmlId(question: Question): string;
    protected onAddElement(element: IElement, index: number): void;
    protected onRemoveElement(element: IElement): void;
    dragDropMoveElement(src: IElement, target: IElement, targetIndex: number): void;
    getElementContentText(element: IElement): string;
}

/**
    * The page object. It has elements collection, that contains questions and panels.
    */
export declare class PageModel extends PanelModelBase implements IPage {
        name: string;
        constructor(name?: string);
        getType(): string;
        toString(): string;
        readonly isPage: boolean;
        delete(): void;
        onFirstRendering(): void;
        /**
            * The visible index of the page. It has values from 0 to visible page count - 1.
            * @see SurveyModel.visiblePages
            * @see SurveyModel.pages
            */
        visibleIndex: number;
        /**
            * Returns true, if the page is started page in the survey. It can be shown on the start only and the end-user could not comeback to it after it passed it.
            */
        readonly isStarted: boolean;
        getIsPageVisible(exceptionQuestion: IQuestion): boolean;
        num: number;
        /**
            * Set this property to "hide" to make "Prev", "Next" and "Complete" buttons are invisible for this page. Set this property to "show" to make these buttons visible, even if survey showNavigationButtons property is false.
            * @see SurveyMode.showNavigationButtons
            */
        navigationButtonsVisibility: string;
        /**
            * The property returns true, if the page has been shown to the end-user.
            */
        readonly wasShown: boolean;
        readonly hasShown: boolean;
        setWasShown(val: boolean): void;
        /**
            * The property returns true, if the elements are randomized on the page
            * @see hasShown
            * @see questionsOrder
            * @see SurveyModel.questionsOrder
            */
        readonly areQuestionsRandomized: boolean;
        /**
            * Use this property to randomize questions. Set it to 'random' to randomize questions, 'initial' to keep them in the same order or 'default' to use the Survey questionsOrder property
            * @see SurveyModel.questionsOrder
            * @see areQuestionsRandomized
            */
        questionsOrder: string;
        /**
            * Call it to scroll to the page top.
            */
        scrollToTop(): void;
        /**
            * Time in seconds end-user spent on this page
            */
        timeSpent: number;
        /**
            * Returns the list of all panels in the page
            */
        getPanels(visibleOnly?: boolean, includingDesignTime?: boolean): Array<IPanel>;
        /**
            * The maximum time in seconds that end-user has to complete the page. If the value is 0 or less, the end-user has unlimited number of time to finish the page.
            * @see startTimer
            * @see SurveyModel.maxTimeToFinishPage
            */
        maxTimeToFinish: number;
        protected onNumChanged(value: number): void;
        protected onVisibleChanged(): void;
        dragDropStart(src: IElement, target: IElement, nestedPanelDepth?: number): void;
        dragDropMoveTo(destination: ISurveyElement, isBottom?: boolean, isEdge?: boolean): boolean;
        dragDropFinish(isCancel?: boolean): IElement;
}

export interface IConditionObject {
        name: string;
        text: string;
        question: Question;
}
/**
    * A base class for all questions.
    */
export declare class Question extends SurveyElement implements IQuestion, IConditionRunner, ILocalizableOwner, IValidatorOwner {
        name: string;
        [index: string]: any;
        customWidgetData: {
                isNeedRender: boolean;
        };
        focusCallback: () => void;
        surveyLoadCallback: () => void;
        valueChangedCallback: () => void;
        commentChangedCallback: () => void;
        validateValueCallback: () => SurveyError;
        questionTitleTemplateCallback: () => string;
        protected isReadyValue: boolean;
        /**
            * The event is fired when isReady property of question is changed.
            * <br/> options.question - the question
            * <br/> options.isReady - current value of isReady
            * <br/> options.oldIsReady - old value of isReady
            */
        onReadyChanged: Event<(sender: Question, options: any) => any, any>;
        constructor(name: string);
        getValueName(): string;
        /**
            * Use this property if you want to store the question result in the name different from the question name.
            * Question name should be unique in the survey and valueName could be not unique. It allows to share data between several questions with the same valueName.
            * The library set the value automatically if the question.name property is not valid. For example, if it contains the period '.' symbol.
            * In this case if you set the question.name property to 'x.y' then the valueName becomes 'x y'.
            */
        valueName: string;
        protected onValueNameChanged(oldValue: string): void;
        protected onNameChanged(oldValue: string): void;
        readonly isReady: boolean;
        /**
            * Get is question ready to use
            */
        choicesLoaded(): void;
        /**
            * Get/set the page where the question is located.
            */
        page: IPage;
        /**
            * Always returns false.
            */
        readonly isPanel: boolean;
        getPanel(): IPanel;
        delete(): void;
        readonly isFlowLayout: boolean;
        getLayoutType(): string;
        isLayoutTypeSupported(layoutType: string): boolean;
        /**
            * Use it to get/set the question visibility.
            * @see visibleIf
            */
        visible: boolean;
        protected onVisibleChanged(): void;
        /**
            * Use it to choose how other question values will be rendered in title if referenced in {}.
            */
        useDisplayValuesInTitle: boolean;
        /**
            * An expression that returns true or false. If it returns true the Question becomes visible and if it returns false the Question becomes invisible. The library runs the expression on survey start and on changing a question value. If the property is empty then visible property is used.
            * @see visible
            */
        visibleIf: string;
        /**
            * Returns true if the question is visible or survey is in design mode right now.
            */
        readonly isVisible: boolean;
        /**
            * Returns the visible index of the question in the survey. It can be from 0 to all visible questions count - 1
            */
        readonly visibleIndex: number;
        /**
            * Returns true if the question may have a title located on the left
            */
        readonly isAllowTitleLeft: boolean;
        /**
            * Returns the type of the object as a string as it represents in the json.
            */
        getType(): string;
        /**
            * Move question to a new container Page/Panel. Add as a last element if insertBefore parameter is not used or inserted into the given index,
            * if insert parameter is number, or before the given element, if the insertBefore parameter is a question or panel
            * @param container Page or Panel to where a question is relocated.
            * @param insertBefore Use it if you want to set the question to a specific position. You may use a number (use 0 to insert int the beginning) or element, if you want to insert before this element.
            */
        moveTo(container: IPanel, insertBefore?: any): boolean;
        setSurveyImpl(value: ISurveyImpl): void;
        getDataFilteredValues(): any;
        getDataFilteredProperties(): any;
        /**
            * A parent element. It can be panel or page.
            */
        parent: IPanel;
        protected onParentChanged(): void;
        /**
            * Returns false if the question doesn't have a title property, for example: QuestionHtmlModel, or titleLocation property equals to "hidden"
            * @see titleLocation
            */
        readonly hasTitle: boolean;
        /**
            * Set this property different from "default" to set the specific question title location for this panel/page.
            * @see SurveyModel.questionTitleLocation
            */
        titleLocation: string;
        /**
            * Return the title location based on question titleLocation property and QuestionTitleLocation of it's parents
            * @see titleLocation
            * @see PanelModelBase.QuestionTitleLocation
            * @see SurveyModel.QuestionTitleLocation
            */
        getTitleLocation(): string;
        protected getTitleLocationCore(): string;
        readonly hasTitleOnLeft: boolean;
        readonly hasTitleOnTop: boolean;
        readonly hasTitleOnBottom: boolean;
        readonly hasTitleOnLeftTop: boolean;
        readonly errorLocation: string;
        /**
            * Returns false if the question doesn't have an input element, for example: QuestionHtmlModel
            */
        readonly hasInput: boolean;
        readonly inputId: string;
        /**
            * Question title. Use survey questionTitleTemplate property to change the title question is rendered. If it is empty, then question name property is used.
            * @see SurveyModel.questionTitleTemplate
            */
        title: string;
        readonly locTitle: LocalizableString;
        /**
            * Question description. It renders under question title by using smaller font. Unlike the title, description can be empty.
            * @see title
            */
        description: string;
        readonly locDescription: LocalizableString;
        /**
            * Question description location. By default, value is "default" and it depends on survey questionDescriptionLocation property
            * You may change it to "underInput" to render it under question input or "underTitle" to rendered it under title.
            * @see description
            * @see Survey.questionDescriptionLocation
            */
        descriptionLocation: string;
        readonly hasDescriptionUnderTitle: boolean;
        readonly hasDescriptionUnderInput: boolean;
        /**
            * The custom text that will be shown on required error. Use this property, if you do not want to show the default text.
            */
        requiredErrorText: string;
        readonly locRequiredErrorText: LocalizableString;
        /**
            * Use it to get or set the comment value.
            */
        commentText: string;
        readonly locCommentText: LocalizableString;
        /**
            * Returns a copy of question errors survey. For some questions like matrix and panel dynamic it includes the errors of nested questions.
            */
        getAllErrors(): Array<SurveyError>;
        /**
            * The link to the custom widget.
            */
        readonly customWidget: QuestionCustomWidget;
        updateCustomWidget(): void;
        /**
            * Returns the rendred question title.
            */
        readonly processedTitle: string;
        /**
            * Returns the title after processing the question template.
            * @see SurveyModel.questionTitleTemplate
            */
        readonly fullTitle: string;
        getQuestionTitleTemplate(): string;
        /**
            * The Question renders on the new line if the property is true. If the property is false, the question tries to render on the same line/row with a previous question/panel.
            */
        startWithNewLine: boolean;
        /**
            * Returns all css classes that used for rendering the question. You may use survey.updateQuestionCssClasses event to override css classes for a question.
            * @see SurveyModel.updateQuestionCssClasses
            */
        readonly cssClasses: any;
        readonly cssMainRoot: any;
        protected getRootCss(classes: any): any;
        protected updateCssClasses(res: any, surveyCss: any): void;
        /**
            * Use it to set the specific width to the question like css style (%, px, em etc).
            */
        width: string;
        /**
            * The rendered width of the question.
            */
        renderWidth: string;
        /**
            * Set it different from 0 to increase the left padding.
            */
        indent: number;
        /**
            * Set it different from 0 to increase the right padding.
            */
        rightIndent: number;
        paddingLeft: string;
        paddingRight: string;
        /**
            * Move the focus to the input of this question.
            * @param onError set this parameter to true, to focus the input with the first error, other wise the first input will be focused.
            */
        focus(onError?: boolean): void;
        protected fireCallback(callback: () => void): void;
        getOthersMaxLength(): any;
        protected onCreating(): void;
        protected getFirstInputElementId(): string;
        protected getFirstErrorInputElementId(): string;
        protected getProcessedTextValue(textValue: TextPreProcessorValue): void;
        supportComment(): boolean;
        supportOther(): boolean;
        /**
            * Set this property to true, to make the question a required. If a user doesn't answer the question then a validation error will be generated.
            */
        isRequired: boolean;
        /**
            * An expression that returns true or false. If it returns true the Question becomes required and an end-user has to answer it.
            * If it returns false the Question then an end-user may not answer it the Question maybe empty.
            * The library runs the expression on survey start and on changing a question value. If the property is empty then isRequired property is used.
            * @see isRequired
            */
        requiredIf: string;
        /**
            * Set it to true, to add a comment for the question.
            */
        hasComment: boolean;
        /**
            * The unique identificator. It is generated automatically.
            */
        id: string;
        hasOther: boolean;
        protected hasOtherChanged(): void;
        readonly requireUpdateCommentValue: boolean;
        /**
            * Retuns true if readOnly property is true or survey is in display mode or parent panel/page is readOnly.
            * @see SurveyModel.model
            * @see readOnly
            */
        readonly isReadOnly: boolean;
        /**
            * An expression that returns true or false. If it returns false the Question becomes read only and an end-user will not able to answer on the qustion. The library runs the expression on survey start and on changing a question value. If the property is empty then readOnly property is used.
            * @see readOnly
            * @see isReadOnly
            */
        enableIf: string;
        /**
            * Run visibleIf and enableIf expressions. If visibleIf or/and enabledIf are not empty, then the results of performing the expression (true or false) set to the visible/readOnly properties.
            * @param values Typically survey results
            * @see visible
            * @see visibleIf
            * @see readOnly
            * @see enableIf
            */
        runCondition(values: HashTable<any>, properties: HashTable<any>): void;
        /**
            * The property returns the question number. If question is invisible then it returns empty string.
            * If visibleIndex is 1, then no is 2, or 'B' if survey.questionStartIndex is 'A'.
            * @see SurveyModel.questionStartIndex
            */
        readonly no: string;
        onSurveyLoad(): void;
        protected onSetData(): void;
        protected initDataFromSurvey(): void;
        protected initCommentFromSurvey(): void;
        /**
            * Get/Set the question value.
            * @see SurveyMode.setValue
            * @see SurveyMode.getValue
            */
        value: any;
        clearValue(): void;
        createValueCopy(): any;
        clearValueIfInvisible(): void;
        readonly displayValue: any;
        protected updateDisplayValue(): any;
        /**
            * Return the question value as a display text. For example, for dropdown, it would return the item text instead of item value.
            * @param keysAsText Set this value to true, to return key (in matrices questions) as display text as well.
            * @param value use this parameter, if you want to get display value for this value and not question.value. It is undefined by default.
            */
        getDisplayValue(keysAsText: boolean, value?: any): any;
        protected getDisplayValueCore(keyAsText: boolean, value: any): any;
        /**
            * Set the default value to the question. It will be assign to the question on loading the survey from JSON or adding a question to the survey or on setting this property of the value is empty.
            */
        defaultValue: any;
        /**
            * Returns question answer data as a plain object: with question title, name, value and displayValue.
            * For complex questions (like matrix, etc.) isNode flag is set to true and data contains array of nested objects (rows)
            * set options.includeEmpty to false if you want to skip empty answers
            */
        getPlainData(options?: {
                includeEmpty?: boolean;
                calculations?: Array<{
                        propertyName: string;
                }>;
        }): any;
        /**
            * The correct answer on the question. Set this value if you are doing a quiz.
            * @see SurveyModel.correctAnswers
            * @see SurveyModel.inCorrectAnswers
            */
        correctAnswer: any;
        readonly quizQuestionCount: number;
        readonly correctAnswerCount: number;
        protected getQuizQuestionCount(): number;
        protected getCorrectAnswerCount(): number;
        isAnswerCorrect(): boolean;
        updateValueWithDefaults(): void;
        getQuestionFromArray(name: string, index: number): IQuestion;
        getDefaultValue(): any;
        protected isDefaultValueEmpty(): boolean;
        protected setDefaultValue(): void;
        /**
            * The question comment value.
            */
        comment: string;
        protected getComment(): string;
        protected setComment(newValue: string): void;
        /**
            * Returns true if the question value is empty
            */
        isEmpty(): boolean;
        isAnswered: boolean;
        protected updateIsAnswered(): void;
        protected getIsAnswered(): boolean;
        /**
            * The list of question validators.
            */
        validators: Array<SurveyValidator>;
        getValidators(): Array<SurveyValidator>;
        addConditionNames(names: Array<string>): void;
        addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void;
        getConditionJson(operator?: string, path?: string): any;
        /**
            * Returns true if there is a validation error(s) in the question.
            * @param fireCallback set it to true to show an error in UI.
            */
        hasErrors(fireCallback?: boolean, rec?: any): boolean;
        /**
            * Returns the validation errors count.
            */
        readonly currentErrorCount: number;
        /**
            * Returns the char/string for a required question.
            * @see SurveyModel.requiredText
            */
        readonly requiredText: string;
        /**
            * Add error into the question error list.
            * @param error
            */
        addError(error: SurveyError): void;
        /**
            * Remove a particular error from the question error list.
            * @param error
            */
        removeError(error: SurveyError): void;
        protected onCheckForErrors(errors: Array<SurveyError>): void;
        protected hasRequiredError(): boolean;
        onCompletedAsyncValidators: (hasErrors: boolean) => void;
        readonly isRunningValidators: boolean;
        protected getIsRunningValidators(): boolean;
        protected runValidators(): Array<SurveyError>;
        protected raiseOnCompletedAsyncValidators(): void;
        protected setNewValue(newValue: any): void;
        protected locNotificationInData: boolean;
        protected isTextValue(): boolean;
        readonly isSurveyInputTextUpdate: boolean;
        readonly isInputTextUpdate: boolean;
        protected setNewValueInData(newValue: any): void;
        protected getValueCore(): any;
        protected setValueCore(newValue: any): void;
        protected valueFromData(val: any): any;
        protected valueToData(val: any): any;
        protected onValueChanged(): void;
        protected setNewComment(newValue: string): void;
        updateValueFromSurvey(newValue: any): void;
        updateCommentFromSurvey(newValue: any): any;
        protected setQuestionValue(newValue: any, updateIsAnswered?: boolean): void;
        onSurveyValueChanged(newValue: any): void;
        setVisibleIndex(val: number): number;
        removeElement(element: IElement): boolean;
        supportGoNextPageAutomatic(): boolean;
        /**
            * Call this function to remove values from the current question, that end-user will not be able to enter.
            * For example the value that doesn't exists in a radigroup/dropdown/checkbox choices or matrix rows/columns.
            */
        clearIncorrectValues(): void;
        /**
            * Call this function to clear all errors in the question
            */
        clearErrors(): void;
        clearUnusedValues(): void;
        onAnyValueChanged(name: string): void;
        locOwner: ILocalizableOwner;
        /**
            * Returns the current survey locale
            * @see SurveyModel.locale
            */
        getLocale(): string;
        getMarkdownHtml(text: string): string;
        getProcessedText(text: string): string;
        getErrorCustomText(text: string, error: SurveyError): string;
        getValidatorTitle(): string;
        validatedValue: any;
        getAllValues(): any;
}

/**
  * A Model for non value question. This question doesn't add any new functionality. It hides some properties, including the value.
  */
export declare class QuestionNonValue extends Question {
    name: string;
    constructor(name: string);
    getType(): string;
    readonly hasInput: boolean;
    readonly hasTitle: boolean;
    getTitleLocation(): string;
    readonly hasComment: boolean;
    getAllErrors(): Array<SurveyError>;
    supportGoNextPageAutomatic(): boolean;
    addConditionNames(names: Array<string>): void;
    addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void;
    getConditionJson(operator?: string, path?: string): any;
}

/**
  * A Model for an question that renders empty "div" tag. It used as a base class for some custom widgets
  */
export declare class QuestionEmptyModel extends Question {
    name: string;
    constructor(name: string);
    getType(): string;
}

/**
    * It is a base class for checkbox, dropdown and radiogroup questions.
    */
export declare class QuestionSelectBase extends Question {
        /**
            * Use this property to fill the choices from a restful service.
            * @see choices
            */
        choicesByUrl: ChoicesRestfull;
        constructor(name: string);
        getType(): string;
        isLayoutTypeSupported(layoutType: string): boolean;
        /**
            * Returns the other item. By using this property, you may change programmatically it's value and text.
            * @see hasOther
            */
        readonly otherItem: ItemValue;
        /**
            * Returns true if a user select the 'other' item.
            */
        readonly isOtherSelected: boolean;
        /**
            * An expression that returns true or false. It runs against each choices item and if for this item it returns true, then the item is visible otherwise the item becomes invisible. Please use {item} to get the current item value in the expression.
            * @see visibleIf
            * @see choicesEnableIf
            */
        choicesVisibleIf: string;
        /**
            * An expression that returns true or false. It runs against each choices item and if for this item it returns true, then the item is enabled otherwise the item becomes disabled. Please use {item} to get the current item value in the expression.
            * @see choicesVisibleIf
            */
        choicesEnableIf: string;
        runCondition(values: HashTable<any>, properties: HashTable<any>): void;
        isSettingDefaultValue: boolean;
        protected setDefaultValue(): void;
        protected filterItems(): boolean;
        protected runItemsCondition(values: HashTable<any>, properties: HashTable<any>): boolean;
        protected runItemsEnableCondition(values: HashTable<any>, properties: HashTable<any>): any;
        protected getHasOther(val: any): boolean;
        readonly validatedValue: any;
        protected createRestfull(): ChoicesRestfull;
        protected getComment(): string;
        protected setComment(newValue: string): void;
        renderedValue: any;
        protected setQuestionValue(newValue: any): void;
        protected setNewValue(newValue: any): void;
        protected valueFromData(val: any): any;
        protected rendredValueFromData(val: any): any;
        protected rendredValueToData(val: any): any;
        protected renderedValueFromDataCore(val: any): any;
        protected rendredValueToDataCore(val: any): any;
        protected hasUnknownValue(val: any, includeOther?: boolean): boolean;
        protected isValueDisabled(val: any): boolean;
        /**
            * If the clearIncorrectValuesCallback is set, it is used to clear incorrrect values instead of default behaviour.
            */
        clearIncorrectValuesCallback: () => void;
        /**
            * The list of items. Every item has value and text. If text is empty, the value is rendered. The item text supports markdown.
            * @see choicesByUrl
            */
        choices: Array<any>;
        hideIfChoicesEmpty: boolean;
        keepIncorrectValues: boolean;
        /**
            * Please use survey.storeOthersAsComment to change the behavior on the survey level. This property is depricated and invisible in Survey Creator.
            * By default the entered text in the others input in the checkbox/radiogroup/dropdown are stored as "question name " + "-Comment". The value itself is "question name": "others". Set this property to false, to store the entered text directly in the "question name" key.
            * Possible values are: "default", true, false
            * @see SurveyModel.storeOthersAsComment
            */
        storeOthersAsComment: any;
        protected hasOtherChanged(): void;
        /**
            * Use this property to render items in a specific order: "asc", "desc", "random". Default value is "none".
            */
        choicesOrder: string;
        /**
            * Use this property to set the different text for other item.
            */
        otherText: string;
        readonly locOtherText: LocalizableString;
        /**
            *  Use this property to set the place holder text for other or comment field  .
            */
        otherPlaceHolder: string;
        readonly locOtherPlaceHolder: LocalizableString;
        /**
            * The text that shows when the other item is choosed by the other input is empty.
            */
        otherErrorText: string;
        readonly locOtherErrorText: LocalizableString;
        /**
            * The list of items as they will be rendered. If needed items are sorted and the other item is added.
            * @see hasOther
            * @see choicesOrder
            * @see enabledChoices
            */
        readonly visibleChoices: Array<ItemValue>;
        /**
            * The list of enabled items as they will be rendered. The disabled items are not included
            * @see hasOther
            * @see choicesOrder
            * @see visibleChoices
            */
        readonly enabledChoices: Array<ItemValue>;
        protected updateVisibleChoices(): void;
        protected canUseFilteredChoices(): boolean;
        protected addToVisibleChoices(items: Array<ItemValue>): void;
        getPlainData(options?: {
                includeEmpty?: boolean;
                calculations?: Array<{
                        propertyName: string;
                }>;
        }): any;
        /**
            * Returns the text for the current value. If the value is null then returns empty string. If 'other' is selected then returns the text for other value.
            */
        protected getDisplayValueCore(keysAsText: boolean, value: any): any;
        protected getChoicesDisplayValue(items: ItemValue[], val: any): any;
        protected readonly activeChoices: Array<ItemValue>;
        protected getChoices(): Array<ItemValue>;
        supportComment(): boolean;
        supportOther(): boolean;
        protected onCheckForErrors(errors: Array<SurveyError>): void;
        setSurveyImpl(value: ISurveyImpl): void;
        protected getStoreOthersAsComment(): boolean;
        onSurveyLoad(): void;
        onAnyValueChanged(name: string): void;
        protected onBeforeSendRequest(): void;
        protected onLoadChoicesFromUrl(array: Array<ItemValue>): void;
        protected onVisibleChoicesChanged(): void;
        clearIncorrectValues(): void;
        clearValueIfInvisible(): void;
        protected clearIncorrectValuesCore(): void;
        protected canClearValueAnUnknow(val: any): boolean;
        protected clearDisabledValuesCore(): void;
        clearUnusedValues(): void;
        getColumnClass(): any;
        getLabelClass(isChecked: boolean): any;
        getControlLabelClass(isChecked: boolean): any;
        readonly columns: ItemValue[][];
        readonly hasColumns: boolean;
        choicesLoaded(): void;
}
/**
    * A base class for checkbox and radiogroup questions. It introduced a colCount property.
    */
export declare class QuestionCheckboxBase extends QuestionSelectBase {
        name: string;
        colCountChangedCallback: () => void;
        constructor(name: string);
        /**
            * The number of columns for radiogroup and checkbox questions. Items are rendred in one line if the value is 0.
            */
        colCount: number;
        protected onParentChanged(): void;
}

/**
    * A Model for a checkbox question
    */
export declare class QuestionCheckboxModel extends QuestionCheckboxBase {
        name: string;
        constructor(name: string);
        protected onCreating(): void;
        protected getFirstInputElementId(): string;
        /**
            * Returns the select all item. By using this property, you may change programmatically it's value and text.
            * @see hasSelectAll
            */
        readonly selectAllItem: ItemValue;
        /**
            * Returns the none item. By using this property, you may change programmatically it's value and text.
            * @see hasNone
            */
        readonly noneItem: ItemValue;
        /**
            * Use this property to set the different text for none item.
            */
        noneText: string;
        readonly locNoneText: LocalizableString;
        /**
            * Use this property to set the different text for Select All item.
            */
        selectAllText: string;
        readonly locSelectAllText: LocalizableString;
        /**
            * Set this property to true, to show the "Select All" item on the top. If end-user checks this item, then all items are checked.
            */
        hasSelectAll: boolean;
        /**
            * Returns true if all items are selected
            * @see toggleSelectAll
            */
        isAllSelected: boolean;
        /**
            * It will select all items, except other and none. If all items have been already selected then it will clear the value
            * @see isAllSelected
            * @see selectAll
            */
        toggleSelectAll(): void;
        /**
            * Select all items, except other and none.
            */
        selectAll(): void;
        /**
            * Set this property to true, to show the "None" item on the bottom. If end-user checks this item, all other items would be unchecked.
            */
        hasNone: boolean;
        /**
            * Returns true if item is checked
            * @param item checkbox item value
            */
        isItemSelected(item: ItemValue): boolean;
        protected setNewValue(newValue: any): void;
        protected canUseFilteredChoices(): boolean;
        protected addToVisibleChoices(items: Array<ItemValue>): void;
        protected getDisplayValueCore(keysAsText: boolean, value: any): any;
        protected clearIncorrectValuesCore(): void;
        protected clearDisabledValuesCore(): void;
        getConditionJson(operator?: string, path?: string): any;
        isAnswerCorrect(): boolean;
        protected setDefaultValueWithOthers(): void;
        protected getHasOther(val: any): boolean;
        protected valueFromData(val: any): any;
        protected renderedValueFromDataCore(val: any): any;
        protected rendredValueToDataCore(val: any): any;
        protected hasUnknownValue(val: any, includeOther?: boolean): boolean;
        getType(): string;
}

/**
    * A Model for a comment question
    */
export declare class QuestionCommentModel extends Question {
        name: string;
        constructor(name: string);
        protected isTextValue(): boolean;
        /**
            * The maximim text length. If it is -1, defaul value, then the survey maxTextLength property will be used.
            * If it is 0, then the value is unlimited
            * @see SurveyModel.maxTextLength
            */
        maxLength: number;
        getMaxLength(): any;
        /**
            * Use this property to set the input place holder.
            */
        placeHolder: string;
        readonly locPlaceHolder: LocalizableString;
        /**
            * The html rows attribute.
            */
        rows: number;
        /**
            * The html cols attribute.
            */
        cols: number;
        getType(): string;
        isEmpty(): boolean;
}

/**
    * A Model for a dropdown question
    */
export declare class QuestionDropdownModel extends QuestionSelectBase {
        name: string;
        constructor(name: string);
        /**
            * This flag controls whether to show options caption item ('Choose...').
            */
        showOptionsCaption: boolean;
        /**
            * Use this property to set the options caption different from the default value. The default value is taken from localization strings.
            */
        optionsCaption: string;
        readonly locOptionsCaption: LocalizableString;
        getType(): string;
        readonly selectedItem: ItemValue;
        supportGoNextPageAutomatic(): boolean;
        protected getChoices(): Array<ItemValue>;
        /**
            * Use this and choicesMax property to automatically add choices. For example choicesMin = 1 and choicesMax = 10 will generate ten additional choices from 1 to 10.
            * @see choicesMax
            * @see choicesStep
            */
        choicesMin: number;
        /**
            * Use this and choicesMax property to automatically add choices. For example choicesMin = 1 and choicesMax = 10 will generate ten additional choices from 1 to 10.
            * @see choicesMin
            * @see choicesStep
            */
        choicesMax: number;
        /**
            * The default value is 1. It tells the value of the iterator between choicesMin and choicesMax properties.
            * If choicesMin = 10, choicesMax = 30 and choicesStep = 10 then you will have only three additional choices: [10, 20, 30].
            * @see choicesMin
            * @see choicesMax
            */
        choicesStep: number;
}

export declare class QuestionFactory {
    static Instance: QuestionFactory;
    static readonly DefaultChoices: string[];
    static readonly DefaultColums: string[];
    static readonly DefaultRows: string[];
    registerQuestion(questionType: string, questionCreator: (name: string) => Question): void;
    unregisterElement(elementType: string): void;
    clear(): void;
    getAllTypes(): Array<string>;
    createQuestion(questionType: string, name: string): Question;
}
export declare class ElementFactory {
    static Instance: ElementFactory;
    registerElement(elementType: string, elementCreator: (name: string) => IElement): void;
    clear(): void;
    unregisterElement(elementType: string, removeFromSerializer?: boolean): void;
    getAllTypes(): Array<string>;
    createElement(elementType: string, name: string): IElement;
}

/**
    * A Model for a file question
    */
export declare class QuestionFileModel extends Question {
        name: string;
        /**
            * The event is fired after question state has been changed.
            * <br/> sender the question object that fires the event
            * <br/> options.state new question state value.
            */
        onStateChanged: Event<(sender: QuestionFileModel, options: any) => any, any>;
        previewValue: any[];
        currentState: string;
        constructor(name: string);
        getType(): string;
        /**
            * Set it to true, to show the preview for the image files.
            */
        showPreview: boolean;
        /**
            * Set it to true, to allow select multiple files.
            */
        allowMultiple: boolean;
        /**
            * The image height.
            */
        imageHeight: string;
        /**
            * The image width.
            */
        imageWidth: string;
        /**
            * Accepted file types. Passed to the 'accept' attribute of the file input tag. See https://www.w3schools.com/tags/att_input_accept.asp for more details.
            */
        acceptedTypes: string;
        /**
            * Set it to false if you do not want to serialize file content as text in the survey.data.
            * In this case, you have to write the code onUploadFiles event to store the file content.
            * @see SurveyModel.onUploadFiles
            */
        storeDataAsText: boolean;
        /**
            * Set it to true if you want to wait until files will be uploaded to your server.
            */
        waitForUpload: boolean;
        /**
            * Set it to false if you want to disable images preview.
            */
        allowImagesPreview: boolean;
        /**
            * Use this property to setup the maximum allowed file size.
            */
        maxSize: number;
        /**
            * Use this property to setup confirmation to remove file.
            */
        needConfirmRemoveFile: boolean;
        /**
            * The remove file confirmation message.
            */
        getConfirmRemoveMessage(fileName: string): string;
        /**
            * The remove all files confirmation message.
            */
        readonly confirmRemoveAllMessage: string;
        /**
            * The no file chosen caption for modern theme.
            */
        readonly noFileChosenCaption: string;
        /**
            * The choose files button caption for modern theme.
            */
        readonly chooseButtonCaption: string;
        /**
            * The clean files button caption.
            */
        readonly cleanButtonCaption: string;
        /**
            * The remove file button caption.
            */
        readonly removeFileCaption: string;
        /**
            * The input title value.
            */
        readonly inputTitle: string;
        /**
            * Clear value programmatically.
            */
        clear(doneCallback?: () => void): void;
        /**
            * Remove file item programmatically.
            */
        removeFile(content: {
                name: string;
        }): void;
        /**
            * Load multiple files programmatically.
            * @param files
            */
        loadFiles(files: File[]): void;
        canPreviewImage(fileItem: any): boolean;
        protected setQuestionValue(newValue: any): void;
        protected onCheckForErrors(errors: Array<SurveyError>): void;
        protected stateChanged(state: string): void;
        getPlainData(options?: {
                includeEmpty?: boolean;
                calculations?: Array<{
                        propertyName: string;
                }>;
        }): any;
}

/**
    * A Model for html question. Unlike other questions it doesn't have value and title.
    */
export declare class QuestionHtmlModel extends QuestionNonValue {
        name: string;
        constructor(name: string);
        getType(): string;
        /**
            * Set html to display it
            */
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
        protected getFirstInputElementId(): string;
        readonly selectedItem: ItemValue;
        /**
            * Show "clear button" flag.
            */
        showClearButton: boolean;
        readonly canShowClearButton: boolean;
        readonly clearButtonCaption: any;
        supportGoNextPageAutomatic(): boolean;
}

/**
    * A Model for a rating question.
    */
export declare class QuestionRatingModel extends Question {
        name: string;
        rateValuesChangedCallback: () => void;
        constructor(name: string);
        onSurveyLoad(): void;
        /**
            * The list of rate items. Every item has value and text. If text is empty, the value is rendered. The item text supports markdown. If it is empty the array is generated by using rateMin, rateMax and rateStep properties.
            * @see rateMin
            * @see rateMax
            * @see rateStep
            */
        rateValues: Array<any>;
        /**
            * This property is used to generate rate values if rateValues array is empty. It is the first value in the rating. The default value is 1.
            * @see rateValues
            * @see rateMax
            * @see rateStep
            */
        rateMin: number;
        /**
            * This property is used to generate rate values if rateValues array is empty. It is the last value in the rating. The default value is 5.
            * @see rateValues
            * @see rateMin
            * @see rateStep
            */
        rateMax: number;
        /**
            * This property is used to generate rate values if rateValues array is empty. It is the step value. The number of rate values are (rateMax - rateMin) / rateStep. The default value is 1.
            * @see rateValues
            * @see rateMin
            * @see rateMax
            */
        rateStep: number;
        protected getDisplayValueCore(keysAsText: boolean, value: any): any;
        readonly visibleRateValues: ItemValue[];
        getType(): string;
        supportGoNextPageAutomatic(): boolean;
        supportComment(): boolean;
        supportOther(): boolean;
        /**
            * The description of minimum (first) item.
            */
        minRateDescription: string;
        readonly locMinRateDescription: LocalizableString;
        /**
            * The description of maximum (last) item.
            */
        maxRateDescription: string;
        readonly locMaxRateDescription: LocalizableString;
}

/**
    * A Model for expression question. It is a read-only question. It calculates value based on epxression property.
    */
export declare class QuestionExpressionModel extends Question {
        name: string;
        constructor(name: string);
        getType(): string;
        /**
            * Use this property to display the value in your own format. Make sure you have "{0}" substring in your string, to display the actual value.
            */
        format: string;
        readonly locFormat: LocalizableString;
        /**
            * The Expression that used to calculate the question value. You may use standard operators like +, -, * and /, squares (). Here is the example of accessing the question value {questionname}.
            * <br/>Example: "({quantity} * {price}) * (100 - {discount}) / 100"
            */
        expression: string;
        locCalculation(): void;
        unlocCalculation(): void;
        runCondition(values: HashTable<any>, properties: HashTable<any>): void;
        /**
            * The maximum number of fraction digits to use if displayStyle is not "none". Possible values are from 0 to 20. The default value is -1 and it means that this property is not used.
            */
        maximumFractionDigits: number;
        /**
            * The minimum number of fraction digits to use if displayStyle is not "none". Possible values are from 0 to 20. The default value is -1 and it means that this property is not used.
            */
        minimumFractionDigits: number;
        protected getDisplayValueCore(keysAsText: boolean, value: any): any;
        /**
            * You may set this property to "decimal", "currency", "percent" or "date". If you set it to "currency", you may use the currency property to display the value in currency different from USD.
            * @see currency
            */
        displayStyle: string;
        /**
            * Use it to display the value in the currency differen from USD. The displayStype should be set to "currency".
            * @see displayStyle
            */
        currency: string;
        useGrouping: boolean;
        protected getValueAsStr(val: any): string;
}
export declare function getCurrecyCodes(): Array<string>;

/**
    * A Model for an input text question.
    */
export declare class QuestionTextModel extends Question {
        name: string;
        constructor(name: string);
        protected isTextValue(): boolean;
        getType(): string;
        /**
            * Use this property to change the default input type.
            */
        inputType: string;
        getValidators(): Array<SurveyValidator>;
        isLayoutTypeSupported(layoutType: string): boolean;
        /**
            * The maximim text length. If it is -1, defaul value, then the survey maxTextLength property will be used.
            * If it is 0, then the value is unlimited
            * @see SurveyModel.maxTextLength
            */
        maxLength: number;
        getMaxLength(): any;
        /**
            * The text input size
            */
        size: number;
        isEmpty(): boolean;
        supportGoNextPageAutomatic(): boolean;
        /**
            * The input place holder.
            */
        placeHolder: string;
        readonly locPlaceHolder: LocalizableString;
        protected setNewValue(newValue: any): void;
        protected correctValueType(newValue: any): any;
}

/**
    * A Model for a boolean question.
    */
export declare class QuestionBooleanModel extends Question {
        name: string;
        constructor(name: string);
        getType(): string;
        isLayoutTypeSupported(layoutType: string): boolean;
        /**
            * Returns true if the question check will be rendered in indeterminate mode. value is empty.
            */
        readonly isIndeterminate: boolean;
        readonly hasTitle: boolean;
        supportGoNextPageAutomatic(): boolean;
        /**
            * Get/set question value in 3 modes: indeterminate (value is empty), true (check is set) and false (check is unset).
            * @see valueTrue
            * @see valueFalse
            */
        checkedValue: any;
        /**
            * Set the default state of the check: "indeterminate" - default (value is empty/null), "true" - value equals valueTrue or true, "false" - value equals valueFalse or false.
            */
        defaultValue: any;
        getDefaultValue(): any;
        readonly locTitle: LocalizableString;
        /**
            * The checkbox label. If it is empty and showTitle is false then title is rendered
            * @see showTitle
            * @see title
            */
        label: string;
        readonly locLabel: LocalizableString;
        readonly locDisplayLabel: LocalizableString;
        /**
            * Set this property, if you want to have a different label for state when check is set.
            */
        labelTrue: any;
        readonly locLabelTrue: LocalizableString;
        /**
            * Set this property, if you want to have a different label for state when check is unset.
            */
        labelFalse: any;
        readonly locLabelFalse: LocalizableString;
        /**
            * Set this property to true to show the question title. It is hidden by default.
            */
        showTitle: boolean;
        /**
            * Set this property, if you want to have a different value from true when check is set.
            */
        valueTrue: any;
        /**
            * Set this property, if you want to have a different value from false when check is unset.
            */
        valueFalse: any;
        protected setDefaultValue(): void;
}

/**
    * A Model for a select image question.
    */
export declare class QuestionImagePickerModel extends QuestionCheckboxBase {
        name: string;
        constructor(name: string);
        getType(): string;
        supportGoNextPageAutomatic(): boolean;
        protected getItemValueType(): string;
        /**
            * Multi select option. If set to true, then allows to select multiple images.
            */
        multiSelect: boolean;
        /**
            * Returns true if item is checked
            * @param item image picker item value
            */
        isItemSelected(item: ItemValue): boolean;
        clearIncorrectValues(): void;
        /**
            * Show label under the image.
            */
        showLabel: boolean;
        protected getValueCore(): any;
        /**
            * The image height.
            */
        imageHeight: string;
        /**
            * The image width.
            */
        imageWidth: string;
        /**
            * The image fit mode.
            */
        imageFit: string;
        /**
            * The content mode.
            */
        contentMode: string;
}

export interface IQuestionPanelDynamicData {
        getItemIndex(item: ISurveyData): number;
        getPanelItemData(item: ISurveyData): any;
        setPanelItemData(item: ISurveyData, name: string, val: any): any;
        getSharedQuestionFromArray(name: string, panelIndex: number): Question;
        getSurvey(): ISurvey;
        getRootData(): ISurveyData;
}
export declare class QuestionPanelDynamicItem implements ISurveyData, ISurveyImpl, ITextProcessor {
        static ItemVariableName: string;
        static IndexVariableName: string;
        constructor(data: IQuestionPanelDynamicData, panel: PanelModel);
        readonly panel: PanelModel;
        setSurveyImpl(): void;
        getValue(name: string): any;
        setValue(name: string, newValue: any): void;
        getVariable(name: string): any;
        setVariable(name: string, newValue: any): void;
        getComment(name: string): string;
        setComment(name: string, newValue: string, locNotification: any): void;
        getAllValues(): any;
        getFilteredValues(): any;
        getFilteredProperties(): any;
        geSurveyData(): ISurveyData;
        getSurvey(): ISurvey;
        getTextProcessor(): ITextProcessor;
        processText(text: string, returnDisplayValue: boolean): string;
        processTextEx(text: string, returnDisplayValue: boolean): any;
}
export declare class QuestionPanelDynamicTemplateSurveyImpl implements ISurveyImpl {
        data: IQuestionPanelDynamicData;
        constructor(data: IQuestionPanelDynamicData);
        geSurveyData(): ISurveyData;
        getSurvey(): ISurvey;
        getTextProcessor(): ITextProcessor;
}
/**
    * A Model for a panel dymanic question. You setup the template panel, but adding elements (any question or a panel) and assign a text to it's title, and this panel will be used as a template on creating dynamic panels. The number of panels is defined by panelCount property.
    * An end-user may dynamically add/remove panels, unless you forbidden this.
    */
export declare class QuestionPanelDynamicModel extends Question implements IQuestionPanelDynamicData {
        name: string;
        renderModeChangedCallback: () => void;
        panelCountChangedCallback: () => void;
        currentIndexChangedCallback: () => void;
        constructor(name: string);
        setSurveyImpl(value: ISurveyImpl): void;
        getType(): string;
        readonly isAllowTitleLeft: boolean;
        removeElement(element: IElement): boolean;
        /**
            * The template Panel. This panel is used as a template on creatign dynamic panels
            * @see  templateElements
            * @see templateTitle
            * @see panelCount
            */
        readonly template: PanelModel;
        getPanel(): IPanel;
        /**
            * The template Panel elements, questions and panels.
            * @see  templateElements
            * @see template
            * @see panelCount
            */
        readonly templateElements: Array<IElement>;
        /**
            * The template Panel title property.
            * @see  templateElements
            * @see template
            * @see panelCount
            */
        templateTitle: string;
        readonly locTemplateTitle: LocalizableString;
        /**
            * The template Panel description property.
            * @see  templateElements
            * @see template
            * @see panelCount
            * @see templateTitle
            */
        templateDescription: string;
        readonly locTemplateDescription: LocalizableString;
        protected readonly items: Array<ISurveyData>;
        /**
            * The array of dynamic panels created based on panel template
            * @see template
            * @see panelCount
            */
        readonly panels: Array<PanelModel>;
        /**
            * The index of current active dynamical panel when the renderMode is not "list". If there is no dymamic panel (panelCount = 0) or renderMode equals "list" it returns -1, otherwise it returns a value from 0 to panelCount - 1.
            * @see currentPanel
            * @see panels
            * @see panelCount
            * @see renderMode
            */
        currentIndex: number;
        /**
            * The current active dynamical panel when the renderMode is not "list". If there is no dymamic panel (panelCount = 0) or renderMode equals "list" it returns null.
            * @see currenIndex
            * @see panels
            * @see panelCount
            * @see renderMode
            */
        readonly currentPanel: PanelModel;
        /**
            * Set it to true, to show a confirmation dialog on removing a panel
            * @see ConfirmDeleteText
            */
        confirmDelete: boolean;
        /**
            * Set it to a question name used in the template panel and the library shows duplication error, if there are same values in different panels of this question.
            * @see keyDuplicationError
            */
        keyName: string;
        /**
            * Use this property to change the default text showing in the confirmation delete dialog on removing a panel.
            */
        confirmDeleteText: string;
        readonly locConfirmDeleteText: LocalizableString;
        /**
            * The duplication value error text. Set it to show the text different from the default.
            * @see keyName
            */
        keyDuplicationError: string;
        readonly locKeyDuplicationError: LocalizableString;
        /**
            * Use this property to change the default previous button text. Previous button shows the previous panel, change the currentPanel, when the renderMode doesn't equal to "list".
            * @see currentPanel
            * @see currentIndex
            * @see renderMode
            */
        panelPrevText: string;
        readonly locPanelPrevText: LocalizableString;
        /**
            * Use this property to change the default next button text. Next button shows the next panel, change the currentPanel, when the renderMode doesn't equal to "list".
            * @see currentPanel
            * @see currentIndex
            * @see renderMode
            */
        panelNextText: string;
        readonly locPanelNextText: LocalizableString;
        /**
            * Use this property to change the default value of add panel button text.
            */
        panelAddText: string;
        readonly locPanelAddText: LocalizableString;
        /**
            * Use this property to change the default value of remove panel button text.
            */
        panelRemoveText: string;
        readonly locPanelRemoveText: LocalizableString;
        /**
            * Returns true when the renderMode equals to "progressTop" or "progressTopBottom"
            */
        readonly isProgressTopShowing: boolean;
        /**
            * Returns true when the renderMode equals to "progressBottom" or "progressTopBottom"
            */
        readonly isProgressBottomShowing: boolean;
        /**
            * Returns true when currentIndex is more than 0.
            * @see currenIndex
            * @see currenPanel
            */
        readonly isPrevButtonShowing: boolean;
        /**
            * Returns true when currentIndex is more than or equal 0 and less then panelCount - 1.
            * @see currenIndex
            * @see currenPanel
            * @see panelCount
            */
        readonly isNextButtonShowing: boolean;
        /**
            * Returns true when showRangeInProgress equals to true, renderMode doesn't equal to "list" and panelCount is >= 2.
            */
        readonly isRangeShowing: boolean;
        getElementsInDesign(includeHidden?: boolean): Array<IElement>;
        protected getValueCore(): any;
        protected setValueCore(newValue: any): void;
        /**
            * Use this property to get/set the number of dynamic panels.
            * @see template
            * @see minPanelCount
            * @see maxPanelCount
            * @see addPanel
            * @see removePanel
            * @see removePanelUI
            */
        panelCount: number;
        /**
            * Use this property to allow the end-user to collapse/expand the panels. It works only if the renderMode property equals to "list" and templateTitle property is not empty. The following values are available:
            * <br/> default - the default value. User can't collpase/expand panels
            * <br/> expanded - User can collpase/expand panels and all panels are expanded by default
            * <br/> collapsed - User can collpase/expand panels and all panels are collapsed by default
            * <br/> firstExpanded - User can collpase/expand panels. The first panel is expanded and others are collapsed
            * @see renderMode
            * @see templateTitle
            */
        panelsState: string;
        /**
            * The minimum panel count. A user could not delete a panel if the panelCount equals to minPanelCount
            * @see panelCount
            * @see maxPanelCount
            */
        minPanelCount: number;
        /**
            * The maximum panel count. A user could not add a panel if the panelCount equals to maxPanelCount
            * @see panelCount
            * @see minPanelCount
            */
        maxPanelCount: number;
        /**
            * Set this property to false to hide the 'Add New' button
            * @see allowRemovePanel
            */
        allowAddPanel: boolean;
        /**
            * Set this property to false to hide the 'Remove' button
            * @see allowAddPanel
            */
        allowRemovePanel: boolean;
        /**
            * Set this property different from "default" to set the specific question title location for the template questions.
            * @see SurveyModel.questionTitleLocation
            * @see PanelModelBase.questionTitleLocation
            */
        templateTitleLocation: string;
        /**
            * Use this property to show/hide the numbers in titles in questions inside a dynamic panel.
            * By default the value is "off". You may set it to "onPanel" and the first question inside a dynamic panel will start with 1 or "onSurvey" to include nested questions in dymamic panels into global survey question numbering.
            */
        showQuestionNumbers: string;
        /**
            * Shows the range from 1 to panelCount when renderMode doesn't equal to "list". Set to false to hide this element.
            * @see panelCount
            * @see renderMode
            */
        showRangeInProgress: boolean;
        /**
            * By default the property equals to "list" and all dynamic panels are rendered one by one on the page. You may change it to: "progressTop", "progressBottom" or "progressTopBottom" to render only one dynamic panel at once. The progress and navigation elements can be rendred on top, bottom or both.
            */
        renderMode: string;
        /**
            * Returns true when renderMode equals to "list".
            * @see renderMode
            */
        readonly isRenderModeList: boolean;
        setVisibleIndex(value: number): number;
        /**
            * Returns true when an end user may add a new panel. The question is not read only and panelCount less than maxPanelCount
            * @see isReadOnly
            * @see panelCount
            * @see maxPanelCount
            */
        readonly canAddPanel: boolean;
        /**
            * Returns true when an end user may remove a panel. The question is not read only and panelCount is more than minPanelCount
            * @see isReadOnly
            * @see panelCount
            * @see minPanelCount
            */
        readonly canRemovePanel: boolean;
        protected rebuildPanels(): void;
        /**
            * If it is not empty, then this value is set to every new panel, including panels created initially, unless the defaultValue is not empty
            * @see defaultValue
            * @see defaultValueFromLastRow
            */
        defaultPanelValue: any;
        /**
            * Set it to true to copy the value into new added panel from the last panel. If defaultPanelValue is set and this property equals to true,
            * then the value for new added panel is merging.
            * @see defaultValue
            * @see defaultPanelValue
            */
        defaultValueFromLastPanel: boolean;
        protected isDefaultValueEmpty(): boolean;
        protected setDefaultValue(): void;
        isEmpty(): boolean;
        /**
            * Add a new dynamic panel based on the template Panel. It checks if canAddPanel returns true and then calls addPanel method.
            * @see template
            * @see panelCount
            * @see panels
            * @see canAddPanel
            */
        addPanelUI(): PanelModel;
        /**
            * Add a new dynamic panel based on the template Panel.
            * @see template
            * @see panelCount
            * @see panels
            */
        addPanel(): PanelModel;
        /**
            * Call removePanel function. Do nothing is canRemovePanel returns false. If confirmDelete set to true, it shows the confirmation dialog first.
            * @param value a panel or panel index
            * @see removePanel
            * @see confirmDelete
            * @see confirmDeleteText
            * @see canRemovePanel
            *
            */
        removePanelUI(value: any): void;
        /**
            * Goes to the next panel in the PanelDynamic
            *
            */
        goToNextPanel(): void;
        /**
            * Goes to the previous panel in the PanelDynamic
            *
            */
        goToPrevPanel(): void;
        /**
            * Removes a dynamic panel from the panels array.
            * @param value a panel or panel index
            * @see panels
            * @see template
            */
        removePanel(value: any): void;
        locStrsChanged(): void;
        clearIncorrectValues(): void;
        clearErrors(): void;
        getQuestionFromArray(name: string, index: number): IQuestion;
        getSharedQuestionFromArray(name: string, panelIndex: number): Question;
        addConditionNames(names: Array<string>): void;
        addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void;
        getConditionJson(operator?: string, path?: string): any;
        protected onReadOnlyChanged(): void;
        onSurveyLoad(): void;
        onFirstRendering(): void;
        runCondition(values: HashTable<any>, properties: HashTable<any>): void;
        protected runPanelsCondition(values: HashTable<any>, properties: HashTable<any>): void;
        onAnyValueChanged(name: string): void;
        hasErrors(fireCallback?: boolean, rec?: any): boolean;
        protected getContainsErrors(): boolean;
        protected getIsAnswered(): boolean;
        clearValueIfInvisible(): void;
        protected getIsRunningValidators(): boolean;
        getAllErrors(): Array<SurveyError>;
        protected getDisplayValueCore(keysAsText: boolean, value: any): any;
        protected createNewPanel(): PanelModel;
        protected createAndSetupNewPanelObject(): PanelModel;
        protected createNewPanelObject(): PanelModel;
        setQuestionValue(newValue: any): void;
        onSurveyValueChanged(newValue: any): void;
        protected onSetData(): void;
        getItemIndex(item: ISurveyData): number;
        getPanelItemData(item: ISurveyData): any;
        setPanelItemData(item: ISurveyData, name: string, val: any): void;
        getSurvey(): ISurvey;
        getRootData(): ISurveyData;
        getPlainData(options?: {
                includeEmpty?: boolean;
                calculations?: Array<{
                        propertyName: string;
                }>;
        }): any;
        readonly progressText: string;
}

export declare var surveyTimerFunctions: {
    setTimeout: (func: () => any) => number;
    clearTimeout: (timerId: number) => void;
};
export declare class SurveyTimer {
    static readonly instance: SurveyTimer;
    onTimer: Event<() => any, any>;
    start(func?: () => any): void;
    stop(func?: () => any): void;
    doTimer(): void;
}

/**
    * Survey object contains information about the survey. Pages, Questions, flow logic and etc.
    */
export declare class SurveyModel extends Base implements ISurvey, ISurveyData, ISurveyImpl, ISurveyTriggerOwner, ISurveyErrorOwner, ILocalizableOwner {
        [index: string]: any;
        static platform: string;
        readonly platformName: string;
        /**
            * You may show comments input for the most of questions. The entered text in the comment input will be saved as 'question name' + 'commentPrefix'.
            * @see data
            */
        commentPrefix: string;
        /**
            * The event is fired before the survey is completed and onComplete event is fired. You may prevent the survey from completing by setting options.allowComplete to false
            * <br/> sender the survey object that fires the event
            * <br/> options.allowComplete set it false to prevent the survey from completing. The default value is true.
            * @see onComplete
            */
        onCompleting: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired after a user click on 'Complete' button and finished the survey. You may use it to send the data to your web server.
            * <br/> sender the survey object that fires the event
            * <br/> options.showDataSaving(text) call this method to show that the survey is saving the data on your server. The text is an optional parameter to show your message instead of default.
            * <br/> options.showDataSavingError(text) call this method to show that there is an error on saving the data on your server. If you want to show a custom error, use an optional text parameter.
            * <br/> options.showDataSavingSuccess(text) call this method to show that the data were successful saved on the server.
            * <br/> options.showDataSavingClear call this method to hide the text about the saving progress.
            * @see data
            * @see clearInvisibleValues
            * @see completeLastPage
            * @see surveyPostId
            */
        onComplete: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired after the survey changed it's state from "starting" to "running". The "starting" state means that survey shows the started page.
            * The firstPageIsStarted property should be set to the true, if you want to have the started page in your survey. The end-user should click on the "Start" button to start the survey.
            * @see firstPageIsStarted
            */
        onStarted: Event<(sender: SurveyModel) => any, any>;
        /**
            * The event is fired on clicking 'Next' page if sendResultOnPageNext is set to true. You may use it to save the intermediate results, for example, if your survey is large enough.
            * <br/> sender the survey object that fires the event
            * @see sendResultOnPageNext
            */
        onPartialSend: Event<(sender: SurveyModel) => any, any>;
        /**
            * The event is fired before another page becomes the current. Typically it happens when a user click on 'Next' or 'Prev' buttons.
            * <br/> sender the survey object that fires the event
            * <br/> option.oldCurrentPage the previous current/active page
            * <br/> option.newCurrentPage a new current/active page
            * <br/> option.allowChanging set it to false to disable the current page changing. It is true by default.
            * @see currentPage
            * @see currentPageNo
            * @see nextPage
            * @see prevPage
            * @see completeLastPage
            * @see onCurrentPageChanged
            **/
        onCurrentPageChanging: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired when another page becomes the current. Typically it happens when a user click on 'Next' or 'Prev' buttons.
            * <br/> sender the survey object that fires the event
            * <br/> option.oldCurrentPage the previous current/active page
            * <br/> option.newCurrentPage a new current/active page
            * @see currentPage
            * @see currentPageNo
            * @see nextPage
            * @see prevPage
            * @see completeLastPage
            * @see onCurrentPageChanging
            */
        onCurrentPageChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired before the question value is changed. It can be done via UI by a user or programmatically on calling setValue method.
            * <br/> sender the survey object that fires the event
            * <br/> options.name the value name that has being changed
            * <br/> options.question a question which question.name equals to the value name. If there are several questions with the same name, the first question is taken. If there is no such questions, the options.question is null.
            * <br/> options.oldValue old, previous value.
            * <br/> options.value a new value. You may change it
            * @see setValue
            * @see onValueChanged
            */
        onValueChanging: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired when the question value is changed. It can be done via UI by a user or programmatically on calling setValue method.
            * Please use onDynamicPanelItemValueChanged and onMatrixCellValueChanged events to handle changes a question in the Panel Dynamic and a cell question in matrices.
            * <br/> sender the survey object that fires the event
            * <br/> options.name the value name that has been changed
            * <br/> options.question a question which question.name equals to the value name. If there are several questions with the same name, the first question is taken. If there is no such questions, the options.question is null.
            * <br/> options.value a new value
            * @see setValue
            * @see onValueChanging
            * @see onDynamicPanelItemValueChanged
            * @see onMatrixCellValueChanged
            */
        onValueChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on changing a question visibility.
            * <br/> sender the survey object that fires the event
            * <br/> options.question a question which visibility has been changed
            * <br/> options.name a question name
            * <br/> options.visible a question visible boolean value
            * @see Question.visibile
            * @see Question.visibileIf
            */
        onVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on changing a page visibility.
            * <br/> sender the survey object that fires the event
            * <br/> options.page a page  which visibility has been changed
            * <br/> options.visible a page visible boolean value
            * @see PageModel.visibile
            * @see PageModel.visibileIf
            */
        onPageVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on changing a panel visibility.
            * <br/> sender the survey object that fires the event
            * <br/> options.panel a panel which visibility has been changed
            * <br/> options.visible a panel visible boolean value
            * @see PanelModel.visibile
            * @see PanelModel.visibileIf
            */
        onPanelVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on adding a new question into survey.
            * 'question': question, 'name': question.name, 'index': index, 'parentPanel': parentPanel, 'rootPanel': rootPanel
            * <br/> sender the survey object that fires the event
            * <br/> options.question a newly added question object.
            * <br/> options.name a question name
            * <br/> options.index a index of the question in the container (page or panel)
            * <br/> options.parentPanel a container where question is located. It can be page or panel.
            * <br/> options.rootPanel typically it is a page.
            * @see Question
            */
        onQuestionAdded: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on removing a question from survey
            * <br/> sender the survey object that fires the event
            * <br/> options.question a removed question object.
            * <br/> options.name a question name
            * @see Question
            */
        onQuestionRemoved: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on adding a panel into survey
            * <br/> sender the survey object that fires the event
            * <br/> options.panel a newly added panel object.
            * <br/> options.name a panel name
            * <br/> options.index a index of the panel in the container (page or panel)
            * <br/> options.parentPanel a container where question is located. It can be page or panel.
            * <br/> options.rootPanel typically it is a page.
            * @see PanelModel
            */
        onPanelAdded: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on removing a panel from survey
            * <br/> sender the survey object that fires the event
            * <br/> options.panel a removed panel object.
            * <br/> options.name a panel name
            * @see PanelModel
            */
        onPanelRemoved: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on adding a page into survey
            * <br/> sender the survey object that fires the event
            * <br/> options.page a newly added panel object.
            * @see PanelModel
            */
        onPageAdded: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on validating value in a question. Set your error to options.error and survey will show the error for the question and block completing the survey or going to the next page.
            * <br/> sender the survey object that fires the event
            * <br/> options.question a question
            * <br/> options.name a question name
            * <br/> options.value the current question value
            * <br/> options.error an error string. It is empty by default.
            * @see onServerValidateQuestions
            * @see onSettingQuestionErrors
            */
        onValidateQuestion: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired before errors are setting into question. You may add/remove/modify errors for a question.
            * <br/> sender the survey object that fires the event
            * <br/> options.question a question
            * <br/> options.errors the list of errors. The list can be empty if by default there is no errors
            * @see onValidateQuestion
            */
        onSettingQuestionErrors: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * Use this event to validate data on your server.
            * <br/> sender the survey object that fires the event
            * <br/> options.data the values of all non-empty questions on the current page. You can get a question value as options.data["myQuestionName"].
            * <br/> options.errors set your errors to this object as: options.errors["myQuestionName"] = "Error text";. It will be shown as a question error.
            * <br/> options.complete() call this function to tell survey that your server callback has been processed.
            * @see onValidateQuestion
            * @see onValidatePanel
            */
        onServerValidateQuestions: any;
        /**
            * The event is fired on validating a panel. Set your error to options.error and survey will show the error for the panel and block completing the survey or going to the next page.
            * <br/> sender the survey object that fires the event
            * <br/> options.name a panel name
            * <br/> options.error an error string. It is empty by default.
            * @see onValidateQuestion
            */
        onValidatePanel: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * Use the event to change the default error text.
            * <br/> sender the survey object that fires the event
            * <br/> options.text an error text
            * <br/> options.error an instance of SurveyError object
            * <br/> options.name the error name. The following error name are available:
            * required, requireoneanswer, requirenumeric, exceedsize, webrequest, webrequestempty, otherempty,
            * uploadingfile, requiredinallrowserror, minrowcounterror, keyduplicationerror, custom
            */
        onErrorCustomText: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * Use the this event to be notified when the survey finished validate questions on the current page. It commonly happens when a user try to go to the next page or complete the survey
            * options.questions - the list of questions that have errors
            * options.errors - the list of errors
            */
        onValidatedErrorsOnCurrentPage: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * Use this event to modify the html before rendering, for example completeHtml or loadingHtml.
            * options.html - change this html property before the library rendered it
            * @see completedHtml
            * @see loadingHtml
            */
        onProcessHtml: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * Use this event to change the question title in the code.
            * <br/> sender the survey object that fires the event
            * <br/> options.title a calcualted question title, based on question title, name, isRequired, visibleIndex (no)
            * <br/> options.question a question object.
            */
        onGetQuestionTitle: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * Use this event to process the markdown text.
            * <br/> sender the survey object that fires the event
            * <br/> options.element SurveyJS element where the string is going to be rendered. It is a question, panel, page or survey
            * <br/> options.text a text that is going to be rendered
            * <br/> options.html a html. It is null by default. Set it and survey will use it instead of options.text
            */
        onTextMarkdown: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event fires when it get response from the [dxsurvey.com](http://www.dxsurvey.com) service on saving survey results. Use it to find out if the results have been saved successful.
            * <br/> sender the survey object that fires the event
            * <br/> options.success it is true if the results were sent to the service successful
            * <br/> options.response a response from the service
            */
        onSendResult: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * Use it to get results after calling the getResult method. It returns a simple analytic from [dxsurvey.com](http://www.dxsurvey.com) service.
            * <br/> sender the survey object that fires the event
            * <br/> options.success it is true if the results were got from the service successful
            * <br/> options.data the object {AnswersCount, QuestionResult : {} }. AnswersCount is the number of posted survey results. QuestionResult is an object with all possible unique answers to the question and number of these answers.
            * <br/> options.dataList an array of objects {name, value}, where 'name' is an unique value/answer to the question and value is a number/count of such answers.
            * <br/> options.response the server response
            * @see getResult
            */
        onGetResult: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on uploading the file in QuestionFile when storeDataAsText is set to false. You may use it to change the file name or tells the library do not accept the file. There are three properties in options: options.name, options.file and options.accept.
            * <br/> sender the survey object that fires the event
            * name: name, file: file, accept: accept
            * <br/> name the file name
            * <br/> file the Javascript File object
            * <br/> accept a boolean value, true by default. Set it to false to deny this file to upload
            * @see uploadFiles
            * @see QuestionFileModel.storeDataAsText
            */
        onUploadFiles: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on downloading the file in QuestionFile. You may use it to pass the file for the preview. There are four properties in options: options.name, options.content, optins.fileValue and options.callback.
            * <br/> sender the survey object that fires the event
            * name: name, content: content, fileValue: fileValue
            * <br/> name the question name
            * <br/> content the file content
            * <br/> fileValue single file question value
            * <br/> callback a call back function to get the status on downloading the file and the downloaded file content
            * @see downloadFile
            */
        onDownloadFile: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on clearing the value in QuestionFile. You may use it to remove files stored on your server. There are three properties in options: options.name, options.value and options.callback.
            * <br/> sender the survey object that fires the event
            * name: name, value: value
            * <br/> name the question name
            * <br/> value the question value
            * <br/> fileName of the removed file, pass null to clear all files
            * <br/> callback a call back function to get the status on clearing the files operation
            * @see clearFiles
            */
        onClearFiles: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired after choices for radiogroup, checkbox and dropdown has been loaded from the RESTful service and before they are assign to the question.
            * You may change the choices, before it was assign or disable/enabled make visible/invisible question, based on loaded results
            * <br/> question - the question where loaded choices are going to be assigned
            * <br/> choices - the loaded choices. You may change them to assign the correct one
            * <br> serverResult - a result that comes from the server as it is.
            */
        onLoadChoicesFromServer: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on processing the text when it finds a text in brackets: {somevalue}. By default it uses the value of survey question values and variables.
            * For example, you may use the text processing in loading choices from the web. If your choicesByUrl.url equals to "UrlToServiceToGetAllCities/{country}/{state}",
            * you may set on this event options.value to "all" or empty string when the "state" value/question is non selected by a user.
            * <br/> name - the name of the processing value, for example, "state" in our example
            * <br/> value - the value of the processing text
            * <br/> isExists - a boolean value. Set it to true if you want to use the value and set it to false if you don't.
            */
        onProcessTextValue: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired before rendering a question. Use it to override the default question css classes.
            * There are two parameters in options: options.question and options.cssClasses
            * <br/> sender the survey object that fires the event
            * <br/> options.question a question for which you may change the css classes
            * <br/> options.cssClasses an object with css classes. For example {root: "table", button: "button"}. You may change them to your own css classes.
            */
        onUpdateQuestionCssClasses: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired before rendering a panel or page. Use it to override the default panel/page css classes.
            * There are two parameters in options: options.panel and options.cssClasses
            * <br/> sender the survey object that fires the event
            * <br/> options.panel a panel for which you may change the css classes
            * <br/> options.cssClasses an object with css classes. For example {title: "sv_p_title", description: "small"}. You may change them to your own css classes.
            */
        onUpdatePanelCssClasses: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired right after survey is rendered in DOM. options.htmlElement is the root element.
            * <br/> sender the survey object that fires the event
            * <br/> options.htmlElement a root html element binded with the survey object
            */
        onAfterRenderSurvey: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired right after a page is rendred in DOM. Use it to modify html elements. There are two parameters in options: options.currentPage, options.htmlElement
            * <br/> sender the survey object that fires the event
            * <br/> options.page a page object for which the event is fired. Typically the current/active page.
            * <br/> options.htmlElement an html element binded with the page object
            */
        onAfterRenderPage: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired right after a question is rendred in DOM. Use it to modify html elements. There are two parameters in options: options.question, options.htmlElement
            * <br/> sender the survey object that fires the event
            * <br/> options.question a question object for which the event is fired
            * <br/> options.htmlElement an html element binded with the question object
            */
        onAfterRenderQuestion: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired right after a panel is rendred in DOM. Use it to modify html elements. There are two parameters in options: options.panel, options.htmlElement
            * <br/> sender the survey object that fires the event
            * <br/> options.panel a panel object for which the event is fired
            * <br/> options.htmlElement an html element binded with the panel object
            */
        onAfterRenderPanel: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on adding a new row in Matrix Dynamic question.
            * <br/> sender the survey object that fires the event
            * <br/> options.question a matrix question.
            * @see QuestionMatrixDynamicModel
            * @see QuestionMatrixDynamicModel.visibleRows
            */
        onMatrixRowAdded: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired before adding a new row in Matrix Dynamic question.
            * <br/> sender the survey object that fires the event
            * <br/> options.question a matrix question.
            * <br/> options.canAddRow an allowing flag.
            * @see QuestionMatrixDynamicModel
            * @see QuestionMatrixDynamicModel.visibleRows
            */
        onMatrixBeforeRowAdded: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on removing a row from Matrix Dynamic question.
            * <br/> sender the survey object that fires the event
            * <br/> options.question a matrix question.
            * <br/> options.rowIndex a removed row index.
            * <br/> options.row a removed row object.
            * @see QuestionMatrixDynamicModel
            * @see QuestionMatrixDynamicModel.visibleRows
            */
        onMatrixRowRemoved: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired before rendering "Remove" button for removing a row from Matrix Dynamic question.
            * <br/> sender the survey object that fires the event
            * <br/> options.question a matrix question.
            * <br/> options.rowIndex a row index.
            * <br/> options.row a row object.
            * <br/> options.allow a boolean property. Set it to false to disable the row removing.
            * @see QuestionMatrixDynamicModel
            */
        onMatrixAllowRemoveRow: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired for every cell created in Matrix Dymic and Matrix Dropdown questions.
            * <br/> options.question - the matrix question
            * <br/> options.cell - the matrix cell
            * <br/> options.cellQuestion - the question/editor in the cell. You may customize it, change it's properties, like choices or visible.
            * <br/> options.rowValue - the value of the current row. To access the value of paticular column use: options.rowValue["columnValue"]
            * <br/> options.column - the matrix column object
            * <br/> options.columName - the matrix column name
            * <br/> options.row - the matrix row object
            * @see onMatrixBeforeRowAdded
            * @see onMatrixRowAdded
            * @see QuestionMatrixDynamicModel
            * @see QuestionMatrixDropdownModel
            */
        onMatrixCellCreated: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired for every cell after is has been rendered in DOM.
            * <br/> options.question - the matrix question
            * <br/> options.cell - the matrix cell
            * <br/> options.cellQuestion - the question/editor in the cell.
            * <br/> options.htmlElement a html element binded with the cellQuestion object
            * <br/> options.column - the matrix column object
            * <br/> options.row - the matrix row object
            * @see onMatrixCellCreated
            * @see QuestionMatrixDynamicModel
            * @see QuestionMatrixDropdownModel
            */
        onMatrixAfterCellRender: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired when cell value is changed in Matrix Dymic and Matrix Dropdown questions.
            * <br/> options.question - the matrix question
            * <br/> options.columName - the matrix column name
            * <br/> options.value - a new value
            * <br/> options.row - the matrix row object
            * <br/> options.getCellQuestion(columnName) - the function that returns the cell question by column name.
            * @see onMatrixCellValueChanging
            * @see onMatrixBeforeRowAdded
            * @see onMatrixRowAdded
            * @see QuestionMatrixDynamicModel
            * @see QuestionMatrixDropdownModel
            */
        onMatrixCellValueChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on changing cell value in Matrix Dymic and Matrix Dropdown questions. You may change the options.value property to change the value in the cell.
            * <br/> options.question - the matrix question
            * <br/> options.columName - the matrix column name
            * <br/> options.value - a new value
            * <br/> options.oldValue - the old value
            * <br/> options.row - the matrix row object
            * <br/> options.getCellQuestion(columnName) - the function that returns the cell question by column name.
            * @see onMatrixCellValueChanged
            * @see onMatrixBeforeRowAdded
            * @see onMatrixRowAdded
            * @see QuestionMatrixDynamicModel
            * @see QuestionMatrixDropdownModel
            */
        onMatrixCellValueChanging: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired when Matrix Dymic and Matrix Dropdown questions validate the cell value.
            * <br/> options.question - the matrix question
            * <br/> options.columName - the matrix column name
            * <br/> options.value - a cell value
            * <br/> options.row - the matrix row object
            * <br/> options.getCellQuestion(columnName) - the function that returns the cell question by column name.
            * @see onMatrixBeforeRowAdded
            * @see onMatrixRowAdded
            * @see QuestionMatrixDynamicModel
            * @see QuestionMatrixDropdownModel
            */
        onMatrixCellValidate: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on adding a new panel in Panel Dynamic question.
            * <br/> sender the survey object that fires the event
            * <br/> options.question a panel question.
            * @see QuestionPanelDynamicModel
            * @see QuestionPanelDynamicModel.panels
            */
        onDynamicPanelAdded: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired on removing a panel from Panel Dynamic question.
            * <br/> sender the survey object that fires the event
            * <br/> options.question a panel question.
            * <br/> options.panelIndex a removed panel index.
            * @see QuestionPanelDynamicModel
            * @see QuestionPanelDynamicModel.panels
            */
        onDynamicPanelRemoved: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired every second if the method startTimer has been called.
            * @see startTimer
            * @see timeSpent
            * @see Page.timeSpent
            */
        onTimer: Event<(sender: SurveyModel) => any, any>;
        /**
            * The event is fired before displaying a new information in the Timer Panel. Use it to change the default text.
            * <br/> options.text - the timer panel info text.
            */
        onTimerPanelInfoText: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The event is fired when item value is changed in Panel Dynamic question.
            * <br/> options.question - the panel question
            * <br/> options.panel - the dynamic panel item
            * <br/> options.name - the item name
            * <br/> options.value - a new value
            * <br/> options.itemIndex - the panel item index
            * <br/> options.itemValue - the panel item object
            * @see onDynamicPanelAdded
            * @see QuestionPanelDynamicModel
            */
        onDynamicPanelItemValueChanged: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * Use this event to define, if the answer on the question is correct or not.
            * <br/> sender the survey object that fires the event
            * <br/> options.question a question on which you have to decide if the answer is correct or not.
            * <br/> options.result return true, if the answer is correct or false if the answer is not correct. Use questions value and correctAnswer properties to return the correct value.
            * <br/> options.correctAnswers - you may change the default number of correct or incorrect answers in the question, for example for matrix, where each row is a quiz question.
            * @see Question.value
            * @see Question.correctAnswer
            */
        onIsAnswerCorrect: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * Use this event to control drag&drop operations during design mode.
            * <br/> sender the survey object that fires the event.
            * <br/> options.allow set it to false to disable dragging.
            * <br/> options.target a target element that is dragging.
            * <br/> options.source a source element. It can be null, if it is a new element, dragging from toolbox.
            * <br/> options.parent a page or panel where target element is dragging.
            * <br/> options.insertBefore an element before the target element is dragging. It can be null if parent container (page or panel) is empty or dragging an element under the last element of the container.
            * <br/> options.insertAfter an element after the target element is dragging. It can be null if parent container (page or panel) is empty or dragging element to the top of the parent container.
            * @see setDesignMode
            * @see isDesignMode
            */
        onDragDropAllow: Event<(sender: SurveyModel, options: any) => any, any>;
        /**
            * The list of errors on loading survey json. If the list is empty after loading a json then the json is correct and there is no errors in it.
            * @see JsonError
            */
        jsonErrors: Array<JsonError>;
        constructor(jsonObj?: any);
        getType(): string;
        /**
            * The list of all pages in the survey, including invisible.
            * @see PageModel
            * @see visiblePages
            */
        readonly pages: Array<PageModel>;
        /**
            * The list of triggers in the survey.
            * @see SurveyTrigger
            */
        triggers: Array<SurveyTrigger>;
        /**
            * The list of calculated values in the survey.
            * @see CalculatedValue
            */
        calculatedValues: Array<CalculatedValue>;
        /**
            * Set this property to automatically load survey Json from [dxsurvey.com](http://www.dxsurvey.com) service.
            * @see loadSurveyFromService
            */
        surveyId: string;
        /**
            * Set this property to automatically save the data into the [dxsurvey.com](http://www.dxsurvey.com) service.
            * @see onComplete
            * @see surveyShowDataSaving
            */
        surveyPostId: string;
        /**
            * Use this property as indentificator for a user, for example e-mail or unique customer id in your web application. If you are loading survey or posting survey results  from/to [dxsurvey.com](http://www.dxsurvey.com) service, then the library do not allow to run the same survey the second time. On the second run, the user will see the 'Thank you' page.
            */
        clientId: string;
        /**
            * If the property is not empty, before starting to run the survey, the library checkes if the cookie with this name exists. If it is true, the survey goes to complete mode and an user sees the 'Thank you' page. On completing the survey the cookie with this name is created.
            */
        cookieName: string;
        /**
            * Set it to true, to save results on completing every page. onPartialSend event is fired.
            * @see onPartialSend
            * @see clientId
            */
        sendResultOnPageNext: boolean;
        /**
            * Set this property to true, to show the progress on saving/sending data into the [dxsurvey.com](http://www.dxsurvey.com) service.
            * @see surveyPostId
            */
        surveyShowDataSaving: boolean;
        /**
            * On showing the next or previous page, a first input is focused, if the property set to true.
            */
        focusFirstQuestionAutomatic: boolean;
        /**
            * Set this property to false (default value is true) if you do not want to bring the focus to the first question that has error on the page.
            */
        focusOnFirstError: boolean;
        /**
            * Possible values: 'bottom' (default), 'top', 'both' and 'none'. Set it to 'none' to hide 'Prev', 'Next' and 'Complete' buttons. It makes sense if you are going to create a custom navigation or have just one page or on setting goNextPageAutomatic property.
            * @see goNextPageAutomatic
            * @see showPrevButton
            */
        showNavigationButtons: string | any;
        /**
            * Set it to false to hide the 'Prev' to disable for end-users go back to their answers.
            * @see showNavigationButtons
            */
        showPrevButton: boolean;
        /**
            * Set it to false hide survey title.
            * @see title
            */
        showTitle: boolean;
        /**
            * Set it to false to hide page titles.
            * @see PageModel.title
            */
        showPageTitles: boolean;
        /**
            * On finishing the survey the 'Thank you', page on complete, is shown. Set the property to false, to hide the 'Thank you' page.
            * @see data
            * @see onComplete
            */
        showCompletedPage: boolean;
        /**
            * A char/string that will be rendered in the title required questions.
            * @see Question.title
            */
        requiredText: string;
        /**
            * Set this property to true to make all requried errors invisible
            */
        hideRequiredErrors: boolean;
        beforeSettingQuestionErrors(question: IQuestion, errors: Array<SurveyError>): void;
        /**
            * By default the first question index is 1. You may start it from 100 or from 'A', by setting 100 or 'A' to this property.
            * @see Question.title
            * @see requiredText
            */
        questionStartIndex: string;
        /**
            * By default the entered text in the others input in the checkbox/radiogroup/dropdown are stored as "question name " + "-Comment". The value itself is "question name": "others". Set this property to false, to store the entered text directly in the "question name" key.
            * @see commentPrefix
            */
        storeOthersAsComment: boolean;
        /**
            * The default maximum length for questions like text and comment, including matrix cell questions.
            * The default value is 0, it is unlimited maxLength - 524288 characters: https://www.w3schools.com/tags/att_input_maxlength.asp
            * @see maxOthersLength
            */
        maxTextLength: number;
        /**
            * The default maximum length for question comments and others
            * The default value is 0, it is unlimited maxLength - 524288 characters: https://www.w3schools.com/tags/att_input_maxlength.asp
            * @see Question.hasComment
            * @see Question.hasOther
            * @see maxTextLength
            */
        maxOthersLength: number;
        /**
            * Set it to the one of the following constants if you want to go to the next page without pressing 'Next' button when all questions are anwered.
            * true - go next page and submit automatically
            * "autogonext" - go next page automatically but do not submit
            * false - do not go next page and not submit automatically
            * @see showNavigationButtons
            */
        goNextPageAutomatic: boolean | "autogonext";
        /**
            * Set it to false if you do not want to submit survey automatically if goNextPageAutomatic=true.
            * @see goNextPageAutomatic
            */
        allowCompleteSurveyAutomatic: boolean;
        /**
            * Change this property from 'onNextPage' to 'onValueChanged' to check erorrs on every question value changing,
            * or change it to 'onComplete' to validate all visible questions on complete button. If there is the error on some pages,
            * then the page with the first error becomes the current.
            * By default, library checks errors on changing current page to the next or on completing the survey.
            */
        checkErrorsMode: string;
        /**
            * Change this property from 'onBlur' to 'onTyping' to update the value of text questions, "text" and "comment",
            * on every key press. By default, the value is updated an input losts the focus.
            * Please note, setting to "onTyping" may lead to a performance degradation, in case you have many expressions in the survey
            */
        textUpdateMode: string;
        /**
            * Set it to 'none' to include the invisible values into the survey data.
            * </br> Set it to 'onHidden' to clear the question value when it becomes invisible. If a question has value and it was invisible initially then survey clears the value on completing.
            * </br> Leave it equals to 'onComplete', to remove from data property values of invisible questions on survey complete. In this case, the invisible questions will not be stored on the server.
            * </br> The default value is 'onComplete'.
            * @see Question.visible
            * @see onComplete
            */
        clearInvisibleValues: any;
        /**
            * Call this function to remove all question values from the survey, that end-user will not be able to enter.
            * For example the value that doesn't exists in a radigroup/dropdown/checkbox choices or matrix rows/columns.
            * Please note, this function doesn't clear values for invisible questions or values that doesn't associated with questions.
            * In fact this function just call clearIncorrectValues function of all questions in the survery
            * @see Question.clearIncorrectValues
            * @see Page.clearIncorrectValues
            * @see Panel.clearIncorrectValues
            */
        clearIncorrectValues(): void;
        /**
            * Use it to change the survey locale. By default it is empty, 'en'. You may set it to 'de' - german, 'fr' - french and so on. The library has built-in localization for several languages. The library has a multi-language support as well.
            */
        locale: string;
        /**
            * Return the array of locales that used in the current survey
            */
        getUsedLocales(): Array<string>;
        protected onLocaleChanged(): void;
        getLocale(): string;
        locStrsChanged(): void;
        getMarkdownHtml(text: string): string;
        getProcessedText(text: string): string;
        getLocString(str: string): any;
        getErrorCustomText(text: string, error: SurveyError): string;
        /**
            * Returns the text that renders when there is no any visible page and question.
            */
        readonly emptySurveyText: string;
        /**
            * Survey title.
            * @see description
            */
        title: string;
        readonly locTitle: LocalizableString;
        /**
            * Survey description. It shows under survey title
            * @see title
            */
        description: string;
        readonly locDescription: LocalizableString;
        /**
            * The html that shows on completed ('Thank you') page. Set it to change the default text.
            * @see showCompletedPage
            * @see completedHtmlOnCondition
            * @see locale
            */
        completedHtml: string;
        readonly locCompletedHtml: LocalizableString;
        /**
            * The list of html condition items. If the expression of this item returns true, then survey will use this item html instead of completedHtml
            * @see HtmlConditionItem
            * @see completeHtml
            */
        completedHtmlOnCondition: Array<HtmlConditionItem>;
        /**
            * Perform the calculation of the given expression and returns the result value
            * @param expression
            */
        runExpression(expression: string): any;
        /**
            * Perform the calculation of the given expression and true or false
            * @param expression
            */
        runCondition(expression: string): boolean;
        readonly renderedCompletedHtml: string;
        /**
            * The html that shows if the end user has already completed the survey.
            * @see clientId
            * @see locale
            */
        completedBeforeHtml: string;
        readonly locCompletedBeforeHtml: LocalizableString;
        /**
            * The html that shows on loading survey Json from the dxsurvey.com service.
            * @see surveyId
            * @see locale
            */
        loadingHtml: string;
        readonly locLoadingHtml: LocalizableString;
        /**
            * A text that renders on the 'Start' button. Set it to change the default text.
            * The start button is shown on the started page. You have to set firstPageIsStarted property to true, to have the started page.
            * @see firstPageIsStarted
            * @see locale
            */
        startSurveyText: string;
        readonly locStartSurveyText: LocalizableString;
        /**
            * A text that renders on the 'Prev' button. Set it to change the default text.
            * @see locale
            */
        pagePrevText: string;
        readonly locPagePrevText: LocalizableString;
        /**
            * A text that renders on the 'Next' button. Set it to change the default text.
            * @see locale
            */
        pageNextText: string;
        readonly locPageNextText: LocalizableString;
        /**
            * A text that renders on the 'Complete' button. Set it to change the default text.
            * @see locale
            */
        completeText: string;
        readonly locCompleteText: LocalizableString;
        /**
            * A template for a question title.
            * @see QuestionModel.title
            */
        questionTitleTemplate: string;
        /**
            * Returns the question title template
            * @see questionTitleTemplate
            * @see QuestionModel.title
            */
        getQuestionTitleTemplate(): string;
        readonly locQuestionTitleTemplate: LocalizableString;
        getUpdatedQuestionTitle(question: IQuestion, title: string): string;
        /**
            * Set this property to false to turn off the numbering on pages titles.
            */
        showPageNumbers: boolean;
        /**
            * Set this property to "off" to turn off the numbering on questions titles or "onpage" to start numbering on every page. The default value is "on".
            */
        showQuestionNumbers: string;
        /**
            * Set this property to "top" to show the progress bar on the bottom or to "bottom" to show it on the bottom.
            */
        showProgressBar: string;
        /**
            * Type of info in the progress bar: "pages" (default), "questions" or "correctQuestions".
            */
        progressBarType: string;
        readonly isShowProgressBarOnTop: boolean;
        readonly isShowProgressBarOnBottom: boolean;
        /**
            * Returns the text/html that renders as survey title.
            */
        readonly processedTitle: string;
        /**
            * Set this property to 'bottom' or 'left' to show question title under the question or on the left.
            * <br/><b>Note:</b> Some questions, for example matrixes, do not support 'left' value. The title for them will be displayed on the top.
            */
        questionTitleLocation: string;
        /**
            * Set this property to 'bottom' to show question error(s) under the question.
            */
        questionErrorLocation: string;
        /**
            * Set this property to 'underInput' to show question description under the question input instead of question title.
            */
        questionDescriptionLocation: string;
        /**
            * Set this mode to 'display' to make the survey read-only. The default value is 'edit'.
            */
        mode: string;
        /**
            * An object that stores the survey results/data. You may set it directly as { 'question name': questionValue, ... }
            * Note: If you are setting the data after creatig the survey, you may need to set the currentPageNo to 0, if you are using visibleIf properties for questions/pages/panels to ensure that you are starting from the first page.
            * @see setValue
            * @see getValue
            * @see currentPageNo
            */
        data: any;
        getAllValues(): any;
        /**
            * Returns survey result data as an array of plain objects: with question title, name, value and displayValue.
            * For complex questions (like matrix, etc.) isNode flag is set to true and data contains array of nested objects (rows)
            * set options.includeEmpty to false if you want to skip empty answers
            */
        getPlainData(options?: {
                includeEmpty?: boolean;
                calculations?: Array<{
                        propertyName: string;
                }>;
        }): any[];
        getFilteredValues(): any;
        getFilteredProperties(): any;
        getDataValueCore(valuesHash: any, key: string): any;
        setDataValueCore(valuesHash: any, key: string, value: any): void;
        deleteDataValueCore(valuesHash: any, key: string): void;
        /**
            * Returns all comments from the data.
            * @see data
            */
        readonly comments: any;
        /**
            * Returns the list of visible pages. If all pages are visible then it is the same as pages property.
            * @see pages
            * @see PageModel.visible
            * @see PageModel.visibleIf
            */
        readonly visiblePages: Array<PageModel>;
        /**
            * Returns true if there is no any page in the survey. The survey is empty.
            */
        readonly isEmpty: boolean;
        /**
            * depricated, misspelling, use pageCount property
            */
        readonly PageCount: number;
        /**
            * Returns the survey pages count.
            * @see visiblePageCount
            * @see pages
            */
        readonly pageCount: number;
        /**
            * Returns the survey visible pages count
            * @see pageCount
            * @see visiblePages
            */
        readonly visiblePageCount: number;
        /**
            * Returns the started Page. firstPageIsStarted property should be equals to true
            * @see firstPageIsStarted
            */
        readonly startedPage: PageModel;
        /**
            * Returns the current survey page. If survey is rendred then it is a page that a user can see/edit.
            */
        currentPage: any;
        /**
            * The index of the current page in the visible pages array. It starts from 0.
            */
        currentPageNo: number;
        /**
            * Use this property to randomize questions. Set it to 'random' to randomize questions, 'initial' to keep them in the same order. You can randomize questions on a specific page.
            * @see SurveyPage.questionsOrder
            */
        questionsOrder: string;
        /**
            * Set the input focus to the first question with the input.
            */
        focusFirstQuestion(): void;
        scrollToTopOnPageChange(): void;
        /**
            * Returns the current survey state: 'loading' - loading from the json, 'completed' - a user has completed the survey,
            * 'starting' - the started page is showing, running' - a user answers a questions right now, 'empty' - there is nothing to show in the current survey.
            */
        readonly state: string;
        readonly completedState: string;
        readonly completedStateText: string;
        protected setCompletedState(value: string, text: string): void;
        /**
            * Clear the survey data and state. If the survey has a 'completed' state, it will have a 'running' state.
            * @param clearData clear the data
            * @param gotoFirstPage make the first page as a current page.
            * @see data
            * @see state
            * @see currentPage
            */
        clear(clearData?: boolean, gotoFirstPage?: boolean): void;
        mergeValues(src: any, dest: any): void;
        protected updateCustomWidgets(page: PageModel): void;
        protected currentPageChanging(newValue: PageModel, oldValue: PageModel): boolean;
        protected currentPageChanged(newValue: PageModel, oldValue: PageModel): void;
        /**
            * Returns the progress that a user made by answering on the survey.
            */
        getProgress(): number;
        /**
            * Returns true if navigation buttons: 'Prev', 'Next' or 'Complete' are shown.
            */
        readonly isNavigationButtonsShowing: string;
        /**
            * Returns true if the survey in the edit mode.
            * @see mode
            */
        readonly isEditMode: boolean;
        /**
            * Returns true if the survey in the display mode.
            * @see mode
            */
        readonly isDisplayMode: boolean;
        readonly isUpdateValueTextOnTyping: boolean;
        /**
            * Returns true if the survey in the design mode. It is used by SurveyJS Editor
            * @see setDesignMode
            */
        readonly isDesignMode: boolean;
        /**
            * Call it to set the survey into the design mode.
            * @param value use true to set the survey into the design mode.
            */
        setDesignMode(value: boolean): void;
        /**
            * Set this property to true, to show all elements in the survey, regardless their visibility. It is false by default.
            */
        showInvisibleElements: boolean;
        readonly areInvisibleElementsShowing: boolean;
        /**
            * Returns true, if a user has already completed the survey on this browser and there is a cookie about it. Survey goes to 'completed' state if the function returns true.
            * @see cookieName
            * @see setCookie
            * @see deleteCookie
            * @see state
            */
        readonly hasCookie: boolean;
        /**
            * Set the cookie with cookieName in the browser. It is done automatically on survey complete if cookieName is not empty.
            * @see cookieName
            * @see hasCookie
            * @see deleteCookie
            */
        setCookie(): void;
        /**
            * Delete the cookie with cookieName in the browser.
            * @see cookieName
            * @see hasCookie
            * @see setCookie
            */
        deleteCookie(): void;
        /**
            * Set it to true, to ignore validation, like requried questions and others, on nextPage and completeLastPage functions.
            * @see nextPage
            * @see completeLastPage
            * @see mode
            */
        ignoreValidation: boolean;
        /**
            * Call it to go to the next page. It returns false, if it is the last page. If there is an error, for example required question is empty, the function returns false as well.
            * @see isCurrentPageHasErrors
            * @see prevPage
            * @see completeLastPage
            */
        nextPage(): boolean;
        /**
            * Returns true, if there is any error on the current page. For example, the required question is empty or a question validation is failed.
            * @see nextPage
            */
        readonly isCurrentPageHasErrors: boolean;
        /**
            * Returns true, if there is an error on any visible page
            * @param fireCallback set it to true, to show errors in UI
            * @param focusOnFirstError set it to true to focus on the first question that doesn't pass the validation and make the page, where question located, the current.
            */
        hasErrors(fireCallback?: boolean, focusOnFirstError?: boolean): boolean;
        /**
            * Call it to go to the previous page. It returns false if the current page is the first page already. It doesn't perform any checks, required questions can be empty.
            * @see isFirstPage
            */
        prevPage(): boolean;
        /**
            * Call it to complete the survey, if the current page is the last one. It returns false if there is an error on the page. If there is no errors on the page, it calls doComplete and returns true.
            * @see isCurrentPageHasErrors
            * @see nextPage
            * @see doComplete
            */
        completeLastPage(): boolean;
        protected doCurrentPageComplete(doComplete: boolean): boolean;
        /**
            * Set this property to true, if you want to combine all your pages in one page. Pages will be converted into panels.
            */
        isSinglePage: boolean;
        /**
            * Set this property to true, to make the first page your starting page. The end-user could not comeback to the start page and it is not count in the progress.
            */
        firstPageIsStarted: boolean;
        isPageStarted(page: IPage): boolean;
        protected onFirstPageIsStartedChanged(): void;
        origionalPages: any;
        protected onIsSinglePageChanged(): void;
        /**
            * Returns true if the current page is the first one.
            */
        readonly isFirstPage: boolean;
        readonly isShowPrevButton: boolean;
        /**
            * Returns true if the current page is the last one.
            */
        readonly isLastPage: boolean;
        /**
            * Call it to complete the survey. It writes cookie if cookieName property is not empty, set the survey into 'completed' state, fire onComplete event and sendResult into [dxsurvey.com](http://www.dxsurvey.com) service if surveyPostId property is not empty. It doesn't perform any validation, unlike completeLastPage function.
            * @see cookieName
            * @see state
            * @see onComplete
            * @see surveyPostId
            * @see completeLastPage
            */
        doComplete(): void;
        /**
            * Start the survey. Change the mode from "starting" to "running". You need to call it, if there is a started page in your survey, otherwise it does nothing.
            * @see firstPageIsStarted
            */
        start(): void;
        /**
            * Returns true, if at the current moment the question values on the current page are validating on the server.
            * @see onServerValidateQuestions
            */
        readonly isValidatingOnServer: boolean;
        protected onIsValidatingOnServerChanged(): void;
        protected doServerValidation(): boolean;
        protected doNextPage(): void;
        setCompleted(): void;
        /**
            * Returns the html for completed 'Thank you' page.
            * @see completedHtml
            */
        readonly processedCompletedHtml: string;
        /**
            * Returns the html showing that the user has already completed the survey
            * @see completedHtml
            */
        readonly processedCompletedBeforeHtml: string;
        /**
            * Returns the html that shows on loading the json.
            */
        readonly processedLoadingHtml: string;
        /**
            * Returns the text for the current progress.
            */
        readonly progressText: string;
        protected afterRenderSurvey(htmlElement: any): void;
        updateQuestionCssClasses(question: IQuestion, cssClasses: any): void;
        updatePanelCssClasses(panel: IPanel, cssClasses: any): void;
        afterRenderPage(htmlElement: any): void;
        afterRenderQuestion(question: IQuestion, htmlElement: any): void;
        afterRenderPanel(panel: IElement, htmlElement: any): void;
        matrixBeforeRowAdded(options: any): void;
        matrixRowAdded(question: IQuestion): void;
        getQuestionByValueNameFromArray(valueName: string, name: string, index: number): IQuestion;
        matrixRowRemoved(question: IQuestion, rowIndex: number, row: any): void;
        matrixAllowRemoveRow(question: IQuestion, rowIndex: number, row: any): boolean;
        matrixCellCreated(question: IQuestion, options: any): void;
        matrixAfterCellRender(question: IQuestion, options: any): void;
        matrixCellValueChanged(question: IQuestion, options: any): void;
        matrixCellValueChanging(question: IQuestion, options: any): void;
        matrixCellValidate(question: IQuestion, options: any): SurveyError;
        dynamicPanelAdded(question: IQuestion): void;
        dynamicPanelRemoved(question: IQuestion, panelIndex: number): void;
        dynamicPanelItemValueChanged(question: IQuestion, options: any): void;
        dragAndDropAllow(options: any): boolean;
        /**
            * Upload the file into server
            * @param name question name
            * @param file uploading file
            * @param storeDataAsText set it to true to encode file content into the survey results
            * @param uploadingCallback a call back function to get the status on uploading the file
            */
        uploadFiles(name: string, files: File[], uploadingCallback: (status: string, data: any) => any): void;
        /**
            * Download the file from server
            * @param name question name
            * @param fileValue single file question value
            * @param callback a call back function to get the status on downloading the file and the downloaded file content
            */
        downloadFile(questionName: string, fileValue: any, callback: (status: string, data: any) => any): void;
        /**
            * Clear files from server
            * @param name question name
            * @param value file question value
            * @param callback a call back function to get the status of the clearing operation
            */
        clearFiles(name: string, value: any, fileName: string, callback: (status: string, data: any) => any): void;
        updateChoicesFromServer(question: IQuestion, choices: Array<ItemValue>, serverResult: any): Array<ItemValue>;
        protected createSurveyService(): dxSurveyService;
        protected uploadFilesCore(name: string, files: File[], uploadingCallback: (status: string, data: any) => any): void;
        getPage(index: number): PageModel;
        /**
            * Add a page into the survey
            * @param page
            * @see addNewPage
            */
        addPage(page: PageModel): void;
        /**
            * Creates a new page and adds it into the survey. Genarates a new name if the name parameter is not set.
            * @param name a page name
            * @see addPage
            */
        addNewPage(name?: string): PageModel;
        /**
            * Remove the page from the survey
            * @param page
            */
        removePage(page: PageModel): void;
        /**
            * Returns a question by its name
            * @param name a question name
            * @param caseInsensitive
            * @see getQuestionByValueName
            */
        getQuestionByName(name: string, caseInsensitive?: boolean): Question;
        /**
            * Returns a question by its value name
            * @param valueName a question name
            * @param caseInsensitive
            * @see getQuestionByName
            * @see Question.valueName
            */
        getQuestionByValueName(valueName: string, caseInsensitive?: boolean): IQuestion;
        /**
            * Get a list of questions by their names
            * @param names the array of names
            * @param caseInsensitive
            */
        getQuestionsByNames(names: string[], caseInsensitive?: boolean): IQuestion[];
        /**
            * Returns a page on which an element (question or panel) is placed.
            * @param element Question or Panel
            */
        getPageByElement(element: IElement): PageModel;
        /**
            * Returns a page on which a question is located
            * @param question
            */
        getPageByQuestion(question: IQuestion): PageModel;
        /**
            * Returns a page by it's name.
            * @param name
            */
        getPageByName(name: string): PageModel;
        /**
            * Rertuns a list of pages by their names
            * @param names a list of pages names
            */
        getPagesByNames(names: string[]): PageModel[];
        /**
            * Returns the list of all questions in the survey
            * @param visibleOnly set it true, if you want to get only visible questions
            */
        getAllQuestions(visibleOnly?: boolean, includingDesignTime?: boolean): Array<IQuestion>;
        /**
            * Returns quiz questions. All visible questions that has input(s) widgets.
            * @see getQuizQuestionCount
            */
        getQuizQuestions(): Array<IQuestion>;
        /**
            * Returns a panel by its name
            * @param name a panel name
            * @param caseInsensitive
            * @see getQuestionByName
            */
        getPanelByName(name: string, caseInsensitive?: boolean): IPanel;
        /**
            * Returns the list of all panels in the survey
            */
        getAllPanels(visibleOnly?: boolean, includingDesignTime?: boolean): Array<IPanel>;
        protected createNewPage(name: string): PageModel;
        protected questionOnValueChanging(valueName: string, newValue: any): any;
        protected updateQuestionValue(valueName: string, newValue: any): void;
        protected notifyQuestionOnValueChanged(valueName: string, newValue: any): void;
        /**
            * Send the survey result into [dxsurvey.com](http://www.dxsurvey.com) service.
            * @param postId [dxsurvey.com](http://www.dxsurvey.com) service postId
            * @param clientId Typically a customer e-mail or an identificator
            * @param isPartialCompleted Set it to true if the survey is not completed yet and it is an intermediate results
            * @see surveyPostId
            * @see clientId
            */
        sendResult(postId?: string, clientId?: string, isPartialCompleted?: boolean): void;
        /**
            * It calls the [dxsurvey.com](http://www.dxsurvey.com) service and on callback fires onGetResult event with all answers that your users made for a question.
            * @param resultId [dxsurvey.com](http://www.dxsurvey.com) service resultId
            * @param name The question name
            * @see onGetResult
            */
        getResult(resultId: string, name: string): void;
        /**
            * Loads the survey Json from the [dxsurvey.com](http://www.dxsurvey.com) service. If clientId is not null and user has already completed the survey, the survey will go into "completedbefore" state.
            * @param surveyId [dxsurvey.com](http://www.dxsurvey.com) service surveyId
            * @param clientId indentificator for a user, for example e-mail or unique customer id in your web application.
            * @see state
            */
        loadSurveyFromService(surveyId?: string, cliendId?: string): void;
        protected onLoadingSurveyFromService(): void;
        protected onLoadSurveyFromService(): void;
        setJsonObject(jsonObj: any): void;
        endLoadingFromJson(): void;
        protected onBeforeCreating(): void;
        protected onCreating(): void;
        hasVisibleQuestionByValueName(valueName: string): boolean;
        questionCountByValueName(valueName: string): number;
        /**
            * Returns a variable value. Variable, unlike values, are not stored in the survey results.
            * @param name A variable name
            * @see SetVariable
            */
        getVariable(name: string): any;
        /**
            * Sets a variable value. Variable, unlike values, are not stored in the survey results.
            * @param name A variable name
            * @param newValue
            * @see GetVariable
            */
        setVariable(name: string, newValue: any): void;
        protected getUnbindValue(value: any): any;
        /**
            * Returns a question value
            * @param name A question name
            * @see data
            * @see setValue
            */
        getValue(name: string): any;
        /**
            * Sets a question value. It runs all triggers and conditions (visibleIf properties). Goes to the next page if goNextPageAutomatic is true and all questions on the current page are answered correctly.
            * @param name A question name
            * @param newValue
            * @see data
            * @see getValue
            * @see PageModel.visibleIf
            * @see Question.visibleIf
            * @see goNextPageAutomatic
            */
        setValue(name: string, newQuestionValue: any, locNotification?: any): void;
        protected doOnPageAdded(page: PageModel): void;
        protected tryGoNextPageAutomatic(name: string): void;
        /**
            * Returns the comment value
            * @param name
            * @see setComment
            */
        getComment(name: string): string;
        /**
            * Set the comment value
            * @param name
            * @param newValue
            * @see getComment
            */
        setComment(name: string, newValue: string, locNotification?: any): void;
        /**
            * Remove the value from the survey result.
            * @param {string} name The name of the value. Typically it is a question name
            */
        clearValue(name: string): void;
        /**
            * Set this value to true, to clear value on disable items in checkbox, dropdown and radiogroup questions.
            * By default values are not cleared on disabled the corresponded items. This property is not persisted in survey json and you have to set it in code.
            */
        clearValueOnDisableItems: boolean;
        questionVisibilityChanged(question: IQuestion, newValue: boolean): void;
        pageVisibilityChanged(page: IPage, newValue: boolean): void;
        panelVisibilityChanged(panel: IPanel, newValue: boolean): void;
        questionAdded(question: IQuestion, index: number, parentPanel: any, rootPanel: any): void;
        questionRemoved(question: IQuestion): void;
        questionRenamed(question: IQuestion, oldName: string, oldValueName: string): any;
        panelAdded(panel: IElement, index: number, parentPanel: any, rootPanel: any): void;
        panelRemoved(panel: IElement): void;
        validateQuestion(question: IQuestion): SurveyError;
        validatePanel(panel: IPanel): SurveyError;
        processHtml(html: string): string;
        processText(text: string, returnDisplayValue: boolean): string;
        processTextEx(text: string, returnDisplayValue: boolean, doEncoding: boolean): any;
        getSurveyMarkdownHtml(element: Base, text: string): string;
        /**
            * Returns the number of corrected answers on quiz
            */
        getCorrectedAnswerCount(): number;
        /**
            * Returns quiz question number. It may be different from getQuizQuestions.length because some widgets like matrix may have several questions. For example by number of rows
            * @see getQuizQuestions
            */
        getQuizQuestionCount(): number;
        /**
            * Returns the number of incorrected answers on quiz
            */
        getInCorrectedAnswerCount(): number;
        getCorrectedAnswers(): number;
        getInCorrectedAnswers(): number;
        /**
            * Set it to 'top' or 'bottom' if you want to show the Panel with information about how much time the end-user spent of the survey/page.
            * If the value doesn't equal 'none' then survey calls startTimer() method on survey rendering.
            * @see showTimerPanelMode
            * @see startTimer
            * @see stopTimer
            */
        showTimerPanel: string;
        readonly isTimerPanelShowingOnTop: boolean;
        readonly isTimerPanelShowingOnBottom: boolean;
        /**
            * Set this property to 'page' or 'survey' to show the timer information for page or survey only.
            * Use onTimerPanelInfoText event to change the default text.
            * @see showTimerPanel
            * @see onTimerPanelInfoText
            */
        showTimerPanelMode: string;
        readonly timerInfoText: string;
        /**
            * Call this method to start timer that will calculate how much time end-user spends on the survey or on pages
            * @see stopTimer
            * @see timeSpent
            */
        startTimer(): void;
        startTimerFromUI(): void;
        /**
            * Stop the timer.
            * @see startTimer
            * @see timeSpent
            */
        stopTimer(): void;
        /**
            * Returns the time in seconds end-user spends on the survey
            * @see startTimer
            * @see PageModel.timeSpent
            */
        timeSpent: number;
        /**
            * The maximum time in seconds that end-user has to complete the survey. If the value is 0 or less, the end-user has unlimited number of time to finish the survey.
            * @see startTimer
            * @see maxTimeToFinishPage
            */
        maxTimeToFinish: number;
        /**
            * The maximum time in seconds that end-user has to complete a page in the survey. If the value is 0 or less, the end-user has unlimited time. You may override this value for every page.
            * @see startTimer
            * @see maxTimeToFinish
            * @see PageModel.maxTimeToFinish
            */
        maxTimeToFinishPage: number;
        protected doTimer(): void;
        geSurveyData(): ISurveyData;
        getSurvey(): ISurvey;
        getTextProcessor(): ITextProcessor;
        getObjects(pages: string[], questions: string[]): any[];
        setTriggerValue(name: string, value: any, isVariable: boolean): void;
        copyTriggerValue(name: string, fromName: string): void;
        focusQuestion(name: string): boolean;
}

/**
    * A base class for all triggers.
    * A trigger calls a method when the expression change the result: from false to true or from true to false.
    * Please note, it runs only one changing the expression result.
    */
export declare class Trigger extends Base {
        static operatorsValue: HashTable<Function>;
        static readonly operators: HashTable<Function>;
        constructor();
        getType(): string;
        toString(): string;
        operator: string;
        value: any;
        name: string;
        expression: string;
        checkExpression(keys: any, values: HashTable<any>, properties?: HashTable<any>): void;
        check(value: any): void;
        protected onSuccess(values: HashTable<any>, properties: HashTable<any>): void;
        protected onFailure(): void;
        endLoadingFromJson(): void;
        buildExpression(): string;
}
export interface ISurveyTriggerOwner {
        getObjects(pages: string[], questions: string[]): any[];
        setCompleted(): any;
        setTriggerValue(name: string, value: any, isVariable: boolean): any;
        copyTriggerValue(name: string, fromName: string): any;
        focusQuestion(name: string): boolean;
}
/**
    * It extends the Trigger base class and add properties required for SurveyJS classes.
    */
export declare class SurveyTrigger extends Trigger {
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
        protected onSuccess(values: HashTable<any>, properties: HashTable<any>): void;
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
        protected onSuccess(values: HashTable<any>, properties: HashTable<any>): void;
}
/**
    * If expression returns true, the value from property **setValue** will be set to **setToName**
    */
export declare class SurveyTriggerSetValue extends SurveyTrigger {
        setToName: string;
        setValue: any;
        isVariable: boolean;
        constructor();
        getType(): string;
        protected onSuccess(values: HashTable<any>, properties: HashTable<any>): void;
}
/**
    * If expression returns true, the survey go to question **gotoName** and focus it.
    */
export declare class SurveyTriggerSkip extends SurveyTrigger {
        gotoName: string;
        constructor();
        getType(): string;
        protected onSuccess(values: HashTable<any>, properties: HashTable<any>): void;
}
/**
    * If expression returns true, the **runExpression** will be run. If **setToName** property is not empty then the result of **runExpression** will be set to it.
    */
export declare class SurveyTriggerRunExpression extends SurveyTrigger {
        setToName: string;
        runExpression: any;
        constructor();
        getType(): string;
        protected onSuccess(values: HashTable<any>, properties: HashTable<any>): void;
}
/**
    * If expression returns true, the value from question **fromName** will be set into **setToName**.
    */
export declare class SurveyTriggerCopyValue extends SurveyTrigger {
        setToName: string;
        fromName: any;
        constructor();
        getType(): string;
        protected onSuccess(values: HashTable<any>, properties: HashTable<any>): void;
}

/**
    * A Model for a survey running in the Window.
    */
export declare class SurveyWindowModel extends Base {
        static surveyElementName: string;
        surveyValue: SurveyModel;
        windowElement: HTMLDivElement;
        templateValue: string;
        expandedChangedCallback: () => void;
        showingChangedCallback: () => void;
        closeWindowOnCompleteCallback: () => void;
        constructor(jsonObj: any, initialModel?: SurveyModel);
        getType(): string;
        /**
            * A survey object.
            * @see SurveyModel
            */
        readonly survey: SurveyModel;
        /**
            * Set this value to negative value, for example -1, to avoid closing the window on completing the survey. Leave it equals to 0 (default value) to close the window immediately, or set it to 3, 5, 10, ... to close the window in 3, 5, 10 seconds.
            */
        closeOnCompleteTimeout: number;
        /**
            * Returns true if the window is currently showing. Set it to true to show the window and false to hide it.
            * @see show
            * @see hide
            */
        isShowing: boolean;
        /**
            * Show the window
            * @see hide
            * @see isShowing
            */
        show(): void;
        /**
            * Hide the window
            * @see show
            * @see isShowing
            */
        hide(): void;
        /**
            * Returns true if the window is expanded. Set it to true to expand the window or false to collapse it.
            * @see expand
            * @see collapse
            */
        isExpanded: boolean;
        /**
            * The window and survey title.
            */
        title: string;
        readonly locTitle: LocalizableString;
        /**
            * Expand the window to show the survey.
            */
        expand(): void;
        /**
            * Collapse the window and show survey title only.
            */
        collapse(): void;
        protected createSurvey(jsonObj: any): SurveyModel;
        protected expandcollapse(value: boolean): void;
        protected onSurveyComplete(): void;
        protected closeWindowOnComplete(): void;
}

export declare class TextPreProcessorItem {
    start: number;
    end: number;
}
export declare class TextPreProcessorValue {
    name: string;
    returnDisplayValue: boolean;
    constructor(name: string, returnDisplayValue: boolean);
    value: any;
    isExists: boolean;
    canProcess: boolean;
}
export declare class TextPreProcessor {
    onProcess: (textValue: TextPreProcessorValue) => void;
    constructor();
    process(text: string, returnDisplayValue?: boolean, doEncoding?: boolean): string;
    readonly hasAllValuesOnLastRun: boolean;
}

/**
  * The class contains methods to work with www.dxsurvey.com service.
  */
export declare class dxSurveyService {
    static serviceUrl: string;
    constructor();
    loadSurvey(surveyId: string, onLoad: (success: boolean, result: string, response: any) => void): void;
    getSurveyJsonAndIsCompleted(surveyId: string, clientId: string, onLoad: (success: boolean, surveyJson: any, result: string, response: any) => void): void;
    sendResult(postId: string, result: JSON, onSendResult: (success: boolean, response: any, request?: any) => void, clientId?: string, isPartialCompleted?: boolean): void;
    sendFile(postId: string, file: File, onSendFile: (success: boolean, response: any) => void): void;
    getResult(resultId: string, name: string, onGetResult: (success: boolean, data: any, dataList: Array<any>, response: any) => void): void;
    isCompleted(resultId: string, clientId: string, onIsCompleted: (success: boolean, result: string, response: any) => void): void;
}

export declare var englishStrings: {
    pagePrevText: string;
    pageNextText: string;
    completeText: string;
    startSurveyText: string;
    otherItemText: string;
    noneItemText: string;
    selectAllItemText: string;
    progressText: string;
    panelDynamicProgressText: string;
    questionsProgressText: string;
    emptySurvey: string;
    completingSurvey: string;
    completingSurveyBefore: string;
    loadingSurvey: string;
    optionsCaption: string;
    value: string;
    requiredError: string;
    requiredErrorInPanel: string;
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
    invalidExpression: string;
    urlRequestError: string;
    urlGetChoicesError: string;
    exceedMaxSize: string;
    otherRequiredError: string;
    uploadingFile: string;
    loadingFile: string;
    chooseFile: string;
    noFileChosen: string;
    confirmDelete: string;
    keyDuplicationError: string;
    addColumn: string;
    addRow: string;
    removeRow: string;
    addPanel: string;
    removePanel: string;
    choices_Item: string;
    matrix_column: string;
    matrix_row: string;
    savingData: string;
    savingDataError: string;
    savingDataSuccess: string;
    saveAgainButton: string;
    timerMin: string;
    timerSec: string;
    timerSpentAll: string;
    timerSpentPage: string;
    timerSpentSurvey: string;
    timerLimitAll: string;
    timerLimitPage: string;
    timerLimitSurvey: string;
    cleanCaption: string;
    clearCaption: string;
    chooseFileCaption: string;
    removeFileCaption: string;
    booleanCheckedLabel: string;
    booleanUncheckedLabel: string;
    confirmRemoveFile: string;
    confirmRemoveAllFiles: string;
};

export declare var surveyLocalization: {
    currentLocaleValue: string;
    defaultLocaleValue: string;
    locales: {
        [index: string]: any;
    };
    localeNames: {
        [index: string]: any;
    };
    supportedLocales: any[];
    currentLocale: string;
    defaultLocale: string;
    getString: (strName: string) => any;
    getLocales: () => string[];
};
export declare var surveyStrings: {
    pagePrevText: string;
    pageNextText: string;
    completeText: string;
    startSurveyText: string;
    otherItemText: string;
    noneItemText: string;
    selectAllItemText: string;
    progressText: string;
    panelDynamicProgressText: string;
    questionsProgressText: string;
    emptySurvey: string;
    completingSurvey: string;
    completingSurveyBefore: string;
    loadingSurvey: string;
    optionsCaption: string;
    value: string;
    requiredError: string;
    requiredErrorInPanel: string;
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
    invalidExpression: string;
    urlRequestError: string;
    urlGetChoicesError: string;
    exceedMaxSize: string;
    otherRequiredError: string;
    uploadingFile: string;
    loadingFile: string;
    chooseFile: string;
    noFileChosen: string;
    confirmDelete: string;
    keyDuplicationError: string;
    addColumn: string;
    addRow: string;
    removeRow: string;
    addPanel: string;
    removePanel: string;
    choices_Item: string;
    matrix_column: string;
    matrix_row: string;
    savingData: string;
    savingDataError: string;
    savingDataSuccess: string;
    saveAgainButton: string;
    timerMin: string;
    timerSec: string;
    timerSpentAll: string;
    timerSpentPage: string;
    timerSpentSurvey: string;
    timerLimitAll: string;
    timerLimitPage: string;
    timerLimitSurvey: string;
    cleanCaption: string;
    clearCaption: string;
    chooseFileCaption: string;
    removeFileCaption: string;
    booleanCheckedLabel: string;
    booleanUncheckedLabel: string;
    confirmRemoveFile: string;
    confirmRemoveAllFiles: string;
};

export declare class QuestionCustomWidget {
        name: string;
        widgetJson: any;
        htmlTemplate: string;
        constructor(name: string, widgetJson: any);
        afterRender(question: IQuestion, el: any): void;
        willUnmount(question: IQuestion, el: any): void;
        getDisplayValue(question: IQuestion, value?: any): string;
        isFit(question: IQuestion): boolean;
        activatedByChanged(activatedBy: string): void;
        readonly isDefaultRender: boolean;
        readonly pdfQuestionType: string;
        readonly pdfRender: any;
}
export declare class CustomWidgetCollection {
        static Instance: CustomWidgetCollection;
        onCustomWidgetAdded: Event<(customWidget: QuestionCustomWidget) => any, any>;
        readonly widgets: Array<QuestionCustomWidget>;
        addCustomWidget(widgetJson: any, activatedBy?: string): void;
        /**
            * Returns the way the custom wiget is activated. It can be activated by a property ("property"), question type ("type") or by new/custom question type ("customtype").
            * @param widgetName the custom widget name
            * @see setActivatedBy
            */
        getActivatedBy(widgetName: string): any;
        /**
            * Sets the way the custom wiget is activated. The activation types are: property ("property"), question type ("type") or new/custom question type ("customtype"). A custom wiget may support all or only some of this activation types.
            * @param widgetName
            * @param activatedBy there are three possible variants: "property", "type" and "customtype"
            */
        setActivatedBy(widgetName: string, activatedBy: string): void;
        clear(): void;
        getCustomWidgetByName(name: string): QuestionCustomWidget;
        getCustomWidget(question: IQuestion): QuestionCustomWidget;
}

export declare class StylesManager {
    static Styles: {
        [key: string]: string;
    };
    static Media: {
        [key: string]: {
            media: string;
            style: string;
        };
    };
    static ThemeColors: {
        [key: string]: {
            [key: string]: string;
        };
    };
    static ThemeCss: {
        [key: string]: string;
    };
    static modernThemeCss: {
        [key: string]: string;
    };
    static bootstrapThemeCss: {
        [key: string]: string;
    };
    static bootstrapmaterialThemeCss: {
        [key: string]: string;
    };
    static findSheet(styleSheetId: string): CSSStyleSheet;
    static createSheet(styleSheetId: string): CSSStyleSheet;
    static applyTheme(themeName?: string, themeSelector?: string): void;
    static Enabled: boolean;
    constructor();
    initializeStyles(sheet: CSSStyleSheet): void;
}

/**
    * A Model for a matrix base question.
    */
export declare class QuestionMatrixBaseModel<TRow, TColumn> extends Question {
        name: string;
        protected filteredColumns: Array<TColumn>;
        protected filteredRows: Array<ItemValue>;
        protected generatedVisibleRows: Array<TRow>;
        protected generatedTotalRow: TRow;
        visibleRowsChangedCallback: () => void;
        protected createColumnValues(): any;
        constructor(name: string);
        getType(): string;
        readonly isAllowTitleLeft: boolean;
        /**
            * Set this property to false, to hide table header. The default value is true.
            */
        showHeader: boolean;
        /**
            * The list of columns. A column has a value and an optional text
            */
        columns: Array<any>;
        readonly visibleColumns: Array<any>;
        /**
            * The list of rows. A row has a value and an optional text
            */
        rows: Array<any>;
        protected processRowsOnSet(newRows: Array<any>): any[];
        protected getVisibleRows(): Array<TRow>;
        /**
            * Returns the list of visible rows as model objects.
            * @see rowsVisibleIf
            */
        readonly visibleRows: Array<TRow>;
        /**
            * An expression that returns true or false. It runs against each row item and if for this item it returns true, then the item is visible otherwise the item becomes invisible. Please use {item} to get the current item value in the expression.
            * @see visibleIf
            */
        rowsVisibleIf: string;
        /**
            * An expression that returns true or false. It runs against each column item and if for this item it returns true, then the item is visible otherwise the item becomes invisible. Please use {item} to get the current item value in the expression.
            * @see rowsVisibleIf
            */
        columnsVisibleIf: string;
        runCondition(values: HashTable<any>, properties: HashTable<any>): void;
        protected filterItems(): boolean;
        protected onColumnsChanged(): void;
        protected onRowsChanged(): void;
        protected shouldRunColumnExpression(): boolean;
        protected hasRowsAsItems(): boolean;
        protected runItemsCondition(values: HashTable<any>, properties: HashTable<any>): boolean;
        clearIncorrectValues(): void;
        protected clearInvisibleValuesInRows(): void;
}

