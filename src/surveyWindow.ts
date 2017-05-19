import {Base} from "./base";
import {SurveyModel} from "./survey";
import {LocalizableString} from "./localizablestring";

/**
 * A Model for a survey running in the Window.
 */
export class SurveyWindowModel extends Base  {
    public static surveyElementName = "windowSurveyJS";
    surveyValue: SurveyModel;
    windowElement: HTMLDivElement;
    isShowingValue: boolean;
    isExpandedValue: boolean;
    templateValue: string;

    constructor(jsonObj: any) {
        super();
        this.surveyValue = this.createSurvey(jsonObj);
        this.surveyValue.showTitle = false;
        this.windowElement = <HTMLDivElement>document.createElement("div");
    }
    public getType() : string { return "window" }
    /**
     * A survey object.
     * @see SurveyModel
     */
    public get survey(): SurveyModel { return this.surveyValue; }
    /**
     * Returns true if the window is currently showing.
     */
    public get isShowing(): boolean { return this.isShowingValue; }
    /**
     * Returns true if the window is expanded.
     * @see expand
     * @see collapse
     */
    public get isExpanded(): boolean { return this.isExpandedValue; }
    /**
     * The window and survey title.
     */
    public get title(): string { return this.survey.title; }
    public set title(value: string) { this.survey.title = value; }
    get locTitle(): LocalizableString { return this.survey.locTitle; }
    /**
     * Expand the window to show the survey.
     */
    public expand() {
        this.expandcollapse(true);
    }
    /**
     * Collapse the window and show survey title only.
     */
    public collapse() {
        this.expandcollapse(false);
    }
    protected createSurvey(jsonObj: any): SurveyModel {
        return new SurveyModel(jsonObj)
    }
    protected expandcollapse(value: boolean) {
        this.isExpandedValue = value;
    }
}
