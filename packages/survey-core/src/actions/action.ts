import { ILocalizableOwner, LocalizableString } from "../localizablestring";
import { getLocaleString } from "../surveyStrings";
import { property } from "../jsonobject";
import { IListModel, ListModel } from "../list";
import { actionModeType, IAction } from "./action-interfaces";
import { BaseAction } from "./base-action";
import { createPopupModelWithListModel } from "./utils";

export class Action extends BaseAction implements IAction, ILocalizableOwner {
  private locTitleValue: LocalizableString;
  public intersectionVisibilityObserver: IntersectionObserver;

  public innerItem: IAction;
  constructor(innerItemData: IAction) {
    super();
    const innerItem: IAction = (innerItemData instanceof Action) ? innerItemData.innerItem : innerItemData;
    this.innerItem = innerItem;
    this.locTitle = !!innerItem ? innerItem["locTitle"] : null;
    if (!!innerItem) {
      for (var key in innerItem) {
        if (key === "locTitle" || key === "title" && !!this.title) continue;
        (<any>this)[key] = (<any>innerItem)[key];
      }
    }
    if (!!this.locTitleName) {
      this.locTitleChanged();
    }
    this.locStrChangedInPopupModel();
  }
  private createLocTitle(): LocalizableString {
    return this.createLocalizableString("title", this, true);
  }
  public setSubItems(options: IListModel): void {
    this.markerIconName = "icon-next_16x16";
    this.items = [...options.items];
    if (!this.popupModel) {
      this.createPopupForSubitems(options);
    } else {
      const list: ListModel<Action> = this.popupModel.contentComponentData.model as ListModel<Action>;
      list.setItems(this.items);
    }
    this.component = this.getGroupComponentName();
  }
  private createPopupForSubitems(options: IListModel): void {
    const listOptions = Object.assign({}, options);
    listOptions.searchEnabled = false;
    const popupModel = createPopupModelWithListModel(
      listOptions,
      { horizontalPosition: "right", showPointer: false, canShrink: false }
    );
    popupModel.cssClass = "sv-popup-inner";
    this.popupModel = popupModel;
  }

  location?: string;
  protected getId(): string { return this.getPropertyValue("id"); }
  protected setId(val: string): void { this.setPropertyValue("id", val); }
  @property({ defaultValue: true }) private _visible: boolean;
  @property({
    onSet: (_, target: Action) => {
      target.locTooltipChanged();
    }
  }) locTooltipName?: string;
  @property() private _enabled: boolean;
  @property() action: (context?: any, isUserAction?: boolean) => void;
  @property() onFocus: (isMouse: boolean, event: any) => void;
  @property() _component: string;
  @property() items: any;
  @property({
    onSet: (val, target) => {
      if (target.locTitleValue.text === val) return;
      target.locTitleValue.text = val;
    }
  }) _title: string;
  protected getLocTitle(): LocalizableString {
    return this.locTitleValue;
  }
  protected setLocTitle(val: LocalizableString): void {
    if (!val && !this.locTitleValue) {
      val = this.createLocTitle();
    }
    if (!!this.locTitleValue) {
      this.locTitleValue.onStringChanged.remove(this.locTitleChanged);
    }
    this.locTitleValue = val;
    this.locTitleValue.onStringChanged.add(this.locTitleChanged);
    this.locTitleChanged();
  }
  protected getTitle(): string {
    return this._title;
  }
  protected setTitle(val: string): void {
    this._title = val;
  }
  public get locTitleName(): string {
    return this.locTitle.localizationName;
  }
  public set locTitleName(val: string) {
    this.locTitle.localizationName = val;
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.locTooltipChanged();
    this.locStrChangedInPopupModel();
  }
  public doAction(args: any): boolean {
    const evt = !!args.originalEvent ? args.originalEvent : args;
    this.action(this, evt.isTrusted);
    evt.preventDefault();
    evt.stopPropagation();
    return true;
  }
  private isMouseDown: boolean;
  public doMouseDown(args: any): void {
    this.isMouseDown = true;
  }
  public doFocus(args: any): void {
    if (!!this.onFocus) {
      const evt = !!args.originalEvent ? args.originalEvent : args;
      this.onFocus(this.isMouseDown, evt);
    }
    this.isMouseDown = false;
  }
  private locStrChangedInPopupModel(): void {
    if (!this.popupModel || !this.popupModel.contentComponentData || !this.popupModel.contentComponentData.model) return;
    const model = this.popupModel.contentComponentData.model;
    if (Array.isArray(model.actions)) {
      const actions: Array<any> = model.actions;
      actions.forEach(item => {
        if (!!(<any>item).locStrsChanged) {
          (<any>item).locStrsChanged();
        }
      });
    }
  }
  private locTitleChanged = () => {
    const val = this.locTitle.renderedHtml;
    this.setPropertyValue("_title", !!val ? val : undefined);
  };
  private locTooltipChanged(): void {
    if (!this.locTooltipName) return;
    this.tooltip = getLocaleString(this.locTooltipName, this.locTitle.locale);
  }

  //ILocalizableOwner
  getLocale(): string { return this.owner ? this.owner.getLocale() : ""; }
  getMarkdownHtml(text: string, name: string, item?: any): string { return this.owner ? this.owner.getMarkdownHtml(text, name, item) : undefined; }
  getProcessedText(text: string): string { return this.owner ? this.owner.getProcessedText(text) : text; }
  getRenderer(name: string): string { return this.owner ? this.owner.getRenderer(name) : null; }
  getRendererContext(locStr: LocalizableString): any { return this.owner ? this.owner.getRendererContext(locStr) : locStr; }

  public setVisible(val: boolean): void {
    if (this.visible !== val) {
      this._visible = val;
    }
  }
  public getVisible(): boolean {
    return this._visible;
  }

  public enabledIf?: () => boolean;
  public setEnabled(val: boolean): void {
    this._enabled = val;
  }
  public getEnabled(): boolean {
    if (this.enabledIf) return this.enabledIf();
    return this._enabled;
  }
  public setComponent(val: string): void {
    this._component = val;
  }
  public getComponent(): string {
    return this._component;
  }
  protected getGroupComponentName() {
    return "sv-list-item-group";
  }

  public initLoadingIndicatorVisibilityObserver(handler: (isVisible: boolean) => void) {
    if (typeof IntersectionObserver !== "undefined") {
      this.intersectionVisibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const isIntersecting = entry.isIntersecting;
          handler(isIntersecting);
        });
      }, ({ trackVisibility: true, delay: 100 }) as any);
    }
  }

  public dispose(): void {
    if (!!this.locTitleValue) {
      this.locTitleValue.onStringChanged.remove(this.locTitleChanged);
    }
    this.locTitleChanged = undefined;
    this.action = undefined;
    super.dispose();
    if (this.popupModel) {
      this.popupModel.dispose();
    }
    if (this.intersectionVisibilityObserver) {
      this.intersectionVisibilityObserver.disconnect();
      this.intersectionVisibilityObserver = undefined;
    }
  }
  public updateDimension(mode: actionModeType, htmlElement: HTMLElement, calcDimension: (el: HTMLElement) => number): void {
    const property = mode == "small" ? "minDimension" : "maxDimension";
    if (htmlElement) {
      const actionContainer = htmlElement;
      if (actionContainer.classList.contains("sv-action--hidden")) {
        actionContainer.classList.remove("sv-action--hidden");
        this[property] = calcDimension(htmlElement);
        actionContainer.classList.add("sv-action--hidden");
      } else {
        this[property] = calcDimension(htmlElement);
      }
    }
  }

  public needUpdateMaxDimension: boolean = false;
  public needUpdateMinDimension: boolean = false;
  public updateModeCallback: (mode: actionModeType, callback: (mode: actionModeType, el: HTMLElement) => void) => void;
  public afterRenderCallback: () => void;
  public afterRender(): void {
    this.afterRenderCallback && this.afterRenderCallback();
  }
  public updateMode(mode: actionModeType, callback: (mode: actionModeType, el: HTMLElement) => void): void {
    if (this.updateModeCallback) {
      this.updateModeCallback(mode, callback);
    } else {
      this.afterRenderCallback = () => {
        this.updateModeCallback(mode, callback);
        this.afterRenderCallback = undefined;
      };
    }
  }
  public updateDimensions(calcDimension: (htmlElement: HTMLElement) => number, callback: () => void, modeToCalculate?: actionModeType): void {
    const mode = !modeToCalculate || (modeToCalculate == "large" && this.mode !== "small") ? this.mode : modeToCalculate;
    this.updateMode(mode, (mode, htmlElement) => {
      this.updateDimension(mode, htmlElement, calcDimension);
      if (!modeToCalculate) {
        this.updateMode(mode !== "small" ? "small" : "large", (mode, htmlElement) => {
          this.updateDimension(mode, htmlElement, calcDimension);
          callback();
        });
      } else {
        callback();
      }
    });
  }
}

ListModel.defaultAction = Action;