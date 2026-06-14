import { IElement } from "./base-interfaces";
import { Helpers } from "./helpers";
import { Serializer } from "./jsonobject";
import { PageModel } from "./page";

export interface ISurveyPageStructureHost {
  pages: Array<PageModel>;
  visiblePages: Array<PageModel>;
  currentPage: PageModel;
  isSinglePage: boolean;
  isShowingPreview: boolean;
  singleInputController: { currentSingleElement: IElement };
}

export class SurveyPageStructureController {
  private pageContainerValue: PageModel;
  private gotoPageFromPreview: PageModel;
  private changeCurrentPageFromPreviewValue: boolean;

  private survey: ISurveyPageStructureHost;

  constructor(survey: ISurveyPageStructureHost) {
    this.survey = survey;
  }

  public get pageContainer(): PageModel {
    return this.pageContainerValue;
  }
  public get changeCurrentPageFromPreview(): boolean {
    return this.changeCurrentPageFromPreviewValue;
  }
  public notifyPreviewCancelled(currentPage: PageModel): void {
    this.gotoPageFromPreview = currentPage;
  }
  public updatePagesContainer(): void {
    const survey = this.survey;
    const singleName = "single-page";
    const previewName = "preview-page";
    let rootPage: PageModel = undefined;
    if (survey.isSinglePage) {
      const cPage = this.pageContainerValue;
      if (cPage && cPage.name === previewName) {
        rootPage = <PageModel>cPage.elements[0];
        this.disposeContainerPage();
      } else {
        rootPage = this.createRootPage(singleName, survey.pages);
      }
    }
    if (survey.isShowingPreview) {
      rootPage = this.createRootPage(previewName, rootPage ? [rootPage] : survey.pages);
    }
    if (rootPage) {
      rootPage.setSurveyImpl(<any>survey);
      this.pageContainerValue = rootPage;
      survey.currentPage = rootPage;
      if (!!survey.singleInputController.currentSingleElement) {
        survey.visiblePages.forEach(page => page.updateRows());
      }
    }
    let isCurrentPageSet = false;
    if (!survey.isSinglePage && !survey.isShowingPreview) {
      this.disposeContainerPage();
      let curPage = this.gotoPageFromPreview;
      this.gotoPageFromPreview = null;
      const vpCount = this.survey.visiblePages.length;
      if (Helpers.isValueEmpty(curPage) && vpCount > 0) {
        curPage = survey.visiblePages[vpCount - 1];
      }
      if (!!curPage) {
        isCurrentPageSet = true;
        this.changeCurrentPageFromPreviewValue = true;
        survey.currentPage = curPage;
        this.changeCurrentPageFromPreviewValue = false;
      }
    }
    if (!survey.currentPage && survey.visiblePages.length > 0 && !isCurrentPageSet) {
      survey.currentPage = survey.visiblePages[0];
    }
    if (survey.isShowingPreview) {
      survey.pages.forEach(page => {
        page.onFirstRendering();
      });
    }
    survey.pages.forEach(page => {
      if (page.wasRendered) {
        page.updateElementCss(true);
      }
    });
  }
  private createRootPage(name: string, pages: Array<PageModel>): PageModel {
    const container = Serializer.createClass("page");
    container.name = name;
    container.isPageContainer = true;
    pages.forEach(page => {
      if (!page.isStartPage) {
        container.addElement(page);
      }
    });
    return container;
  }
  private disposeContainerPage(): void {
    let cPage = this.pageContainerValue;
    const elements = [].concat(cPage.elements);
    elements.forEach(el => cPage.removeElement(el));
    cPage.dispose();
    this.pageContainerValue = undefined;
  }
}
