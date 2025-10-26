import { Action, IAction } from "./actions/action";
import { ActionContainer } from "./actions/container";
import { ComputedUpdater } from "./base";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export class NavigationActionBar extends ActionContainer {
  private _updateNavigationItemCssCallback: () => void;

  constructor(private survey: SurveyModel) {
    super();
    this.locOwner = survey;
    this.setItems(this.createNavigationActions());
    this.updateCss();
  }

  protected createNavigationActions(): Array<IAction> {
    const defaultComponent = "sv-nav-btn";
    const navStart = new Action({
      id: "sv-nav-start",
      visible: <any>new ComputedUpdater<boolean>(() => this.survey.isStartPageActive),
      visibleIndex: 10,
      locTitle: this.survey.locStartSurveyText,
      action: () => this.survey.start(),
      component: defaultComponent
    });
    const navPrev = new Action({
      id: "sv-nav-prev",
      visible: <any>new ComputedUpdater<boolean>(() => this.survey.isShowPrevButton),
      visibleIndex: 20,
      data: {
        mouseDown: () => this.survey.navigationMouseDown(),
      },
      locTitle: this.survey.locPagePrevText,
      action: () => this.survey.performPrevious(),
      component: defaultComponent
    });
    const navNext = new Action({
      id: "sv-nav-next",
      visible: <any>new ComputedUpdater<boolean>(() => this.survey.isShowNextButton),
      visibleIndex: 30,
      data: {
        mouseDown: () => this.survey.nextPageMouseDown(),
      },
      locTitle: this.survey.locPageNextText,
      action: () => this.survey.nextPageUIClick(),
      component: defaultComponent
    });
    const navPreview = new Action({
      id: "sv-nav-preview",
      visible: <any>new ComputedUpdater<boolean>(() => this.survey.isPreviewButtonVisible),
      visibleIndex: 40,
      data: {
        mouseDown: () => this.survey.navigationMouseDown(),
      },
      locTitle: this.survey.locPreviewText,
      action: () => this.survey.showPreview(),
      component: defaultComponent
    });
    const navComplete = new Action({
      id: "sv-nav-complete",
      visible: <any>new ComputedUpdater<boolean>(() => this.survey.isCompleteButtonVisible),
      visibleIndex: 50,
      data: {
        mouseDown: () => this.survey.navigationMouseDown(),
      },
      locTitle: this.survey.locCompleteText,
      action: () => this.survey.waitAndExecute(() => this.survey.tryComplete()),
      component: defaultComponent
    });
    this._updateNavigationItemCssCallback = () => {
      navStart.innerCss = this.cssNavigationStart;
      navPrev.innerCss = this.cssNavigationPrev;
      navNext.innerCss = this.cssNavigationNext;
      navPreview.innerCss = this.cssNavigationPreview;
      navComplete.innerCss = this.cssNavigationComplete;
    };
    return [navStart, navPrev, navNext, navPreview, navComplete];
  }

  private getNavigationCss(main: string, btn: string) {
    return new CssClassBuilder().append(main)
      .append(btn).toString();
  }

  public get cssNavigationComplete() {
    return this.getNavigationCss(
      this.cssSurveyNavigationButton,
      this.survey.css.navigation.complete
    );
  }
  public get cssNavigationPreview() {
    return this.getNavigationCss(
      this.cssSurveyNavigationButton,
      this.survey.css.navigation.preview
    );
  }
  public get cssNavigationPrev() {
    return this.getNavigationCss(
      this.cssSurveyNavigationButton,
      this.survey.css.navigation.prev
    );
  }
  public get cssNavigationStart() {
    return this.getNavigationCss(
      this.cssSurveyNavigationButton,
      this.survey.css.navigation.start
    );
  }
  public get cssNavigationNext() {
    return this.getNavigationCss(
      this.cssSurveyNavigationButton,
      this.survey.css.navigation.next
    );
  }
  private get cssSurveyNavigationButton(): string {
    return new CssClassBuilder().append(this.survey.css.navigationButton).append(this.survey.css.bodyNavigationButton).toString();
  }

  public updateCss() {
    this.cssClasses = this.survey.css.actionBar;
    this.containerCss = this.survey.css.footer;
    this._updateNavigationItemCssCallback();
  }
  public addAction(val: IAction): Action {
    if (!val.component) {
      val.component = "sv-nav-btn";
    }
    if (!val.innerCss) {
      val.innerCss = this.cssSurveyNavigationButton;
    }
    const originalActionFunc = val.action;
    val.action = () => {
      this.survey.waitAndExecute(() => originalActionFunc());
    };
    return super.addAction(val);
  }
}