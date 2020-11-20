import { SurveyModel } from './survey';

export class SurveyProgressButtonsModel {
  constructor(private survey: SurveyModel) {
  }
  public getListElementCss(index: number): string {
    if (index >= this.survey.visiblePages.length) return;
    let elementCss: string = this.survey.visiblePages[index].passed ?
      this.survey.css.progressButtonsListElementPassed : "";
    if (this.survey.currentPageNo === index) {
      elementCss += !!elementCss ? " " : "";
      elementCss += this.survey.css.progressButtonsListElementCurrent;
    }
    return elementCss;
  }
  public clickListElement(visibleIndex: number): void {
    if (this.survey.isDesignMode) return;
    if (visibleIndex < this.survey.currentPageNo) {
      this.survey.currentPageNo = visibleIndex;
    }
    else if (visibleIndex > this.survey.currentPageNo) {
      let i: number = this.survey.currentPageNo;
      for (; i < visibleIndex; i++) {
        if (this.survey.visiblePages[i].hasErrors(true, true)) break;
        this.survey.visiblePages[i].passed = true;
      }
      this.survey.currentPageNo = i;
    }
  }
}
