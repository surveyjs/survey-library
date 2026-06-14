import { settings } from "./settings";
import { PageModel } from "./page";
import { activateLazyRenderingChecks } from "./utils/dom-utils";

export interface ISurveyLazyRenderingHost {
  currentPage: PageModel;
  rootElement: HTMLElement;
  creator?: { rootElement?: HTMLElement };
}

export class SurveyLazyRenderingController {
  private enabledValue: boolean;
  private firstBatchSizeValue: number;
  private isSuspendedValue: boolean = false;

  private survey: ISurveyLazyRenderingHost;

  constructor(survey: ISurveyLazyRenderingHost) {
    this.survey = survey;
  }

  public get enabled(): boolean {
    return this.enabledValue === true;
  }
  public set enabled(val: boolean) {
    if (this.enabled === val) return;
    this.enabledValue = val;
    const page: PageModel = this.survey.currentPage;
    if (!!page) {
      page.updateRows();
    }
  }
  public get isLazyRendering(): boolean {
    return this.enabled || settings.lazyRender.enabled;
  }
  public get firstBatchSize(): number {
    return this.firstBatchSizeValue || settings.lazyRender.firstBatchSize;
  }
  public set firstBatchSize(val: number) {
    this.firstBatchSizeValue = val;
  }
  public get isSuspended(): boolean {
    return this.isSuspendedValue;
  }
  public suspend(): void {
    if (!this.isLazyRendering) return;
    this.isSuspendedValue = true;
  }
  public release(): void {
    if (!this.isLazyRendering) return;
    this.isSuspendedValue = false;
  }
  public updateRowsOnRemovingElements(): void {
    if (!this.isLazyRendering) return;
    const page = this.survey.currentPage;
    if (!!page) {
      const htmlElement = (this.survey.rootElement || this.survey.creator?.rootElement)?.querySelector(`#${page.id}`);
      activateLazyRenderingChecks(htmlElement);
    }
  }
}
