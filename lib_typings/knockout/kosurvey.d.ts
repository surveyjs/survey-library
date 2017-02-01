// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { SurveyModel } from "../survey";
import { IPage, Event } from "../base";
import { Page } from "./kopage";
import { PageModel } from "../page";
export declare class Survey extends SurveyModel {
    static cssType: string;
    private renderedElement;
    onRendered: Event<(sender: SurveyModel) => any, any>;
    private isFirstRender;
    koCurrentPage: any;
    koIsFirstPage: any;
    koIsLastPage: any;
    koIsNavigationButtonsShowing: any;
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
    protected getTemplate(): string;
    protected onBeforeCreating(): void;
    protected currentPageChanged(newValue: PageModel, oldValue: PageModel): void;
    pageVisibilityChanged(page: IPage, newValue: boolean): void;
    protected onLoadSurveyFromService(): void;
    protected onLoadingSurveyFromService(): void;
    private applyBinding();
    private updateKoCurrentPage();
    private updateCurrentPageQuestions();
}
