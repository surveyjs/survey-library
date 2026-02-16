import type { DropdownListModel } from "./dropdownListModel";
import type { PopupModel } from "./popup";
import type { EventBase } from "./base";
import type { ItemValue } from "./itemvalue";
import { QuestionSelectBase } from "./question_baseselect";

type Constructor<T = {}> = new (...args: any[]) => T;

export interface IQuestionDropdownMixin {
  dropdownListModelValue: DropdownListModel;
  dropdownListModel: DropdownListModel;
  readonly popupModel: PopupModel;
  readonly showClearButton: boolean;
  onOpenedCallBack(): void;
  setIsChoicesLoading(value: boolean): void;
  clearValue(keepComment?: boolean, fromUI?: boolean): void;
  dispose(): void;
}

export function questionDropdownMixin<TBase extends Constructor<QuestionSelectBase>>(Base: TBase): TBase & Constructor<IQuestionDropdownMixin> {
  class QuestionDropdownMixinClass extends Base implements IQuestionDropdownMixin {
    dropdownListModelValue: DropdownListModel;
    private _isChoicesLoading: boolean;

    declare choicesLazyLoadEnabled: boolean;
    declare allowCustomChoices: boolean;
    declare allowClear: boolean;
    declare placeholder: string;
    declare onOpened: EventBase<any>;

    public get dropdownListModel(): DropdownListModel {
      return this.dropdownListModelValue;
    }
    public set dropdownListModel(val: DropdownListModel) {
      this.dropdownListModelValue = val;
    }

    public get popupModel(): PopupModel {
      return this.dropdownListModel.popupModel;
    }

    public get showClearButton(): boolean {
      return this.allowClear && !this.isEmpty();
    }

    protected resetReadOnlyText(): void { }

    protected updateCustomChoices(value: any, items: Array<ItemValue>): void { }

    public onOpenedCallBack(): void {
      this.onOpened.fire(this, { question: this, choices: this.choices });
    }

    protected onSelectedItemValuesUpdated(): void {
      super.onSelectedItemValuesUpdated();
      this.resetReadOnlyText();
    }

    protected hasUnknownValue(
      val: any,
      includeOther: boolean,
      isFilteredChoices: boolean,
      checkEmptyValue: boolean
    ): boolean {
      if (this.choicesLazyLoadEnabled) { return false; }
      return super.hasUnknownValue(val, includeOther, isFilteredChoices, checkEmptyValue);
    }

    protected needConvertRenderedOtherToDataValue(): boolean {
      const val = this.otherValue?.trim();
      if (!val) return false;
      return super.hasUnknownValue(val, true, false);
    }

    protected getItemIfChoicesNotContainThisValue(value: any, text?: string): any {
      if (this.choicesLazyLoadEnabled) {
        return this.createItemValue(value, text);
      } else {
        return super.getItemIfChoicesNotContainThisValue(value, text);
      }
    }

    protected onVisibleChoicesChanged(): void {
      super.onVisibleChoicesChanged();
      if (!!this.dropdownListModelValue) {
        this.dropdownListModel.updateItems();
      }
    }

    protected canAddCustomChoices(): boolean {
      return this.allowCustomChoices;
    }

    protected getIsQuestionReady(): boolean {
      return super.getIsQuestionReady() && !this._isChoicesLoading;
    }

    protected ensureQuestionIsReady(): void {
      super.ensureQuestionIsReady();
      if (!!this.dropdownListModel && this.choicesLazyLoadEnabled) {
        this.dropdownListModel.loadQuestionChoices();
      }
    }

    protected onLoadChoicesFromUrl(array: Array<ItemValue>): void {
      this.updateCustomChoices(this.value, array);
      super.onLoadChoicesFromUrl(array);
    }

    protected valueFromData(val: any): any {
      const value = super.valueFromData(val);
      if (!!this.survey && this.survey.isSettingData()) {
        this.updateCustomChoices(value, this.visibleChoices);
      }
      return value;
    }

    public setIsChoicesLoading(value: boolean): void {
      this._isChoicesLoading = value;
      this.updateIsReady();
    }

    protected supportEmptyValidation(): boolean { return true; }

    protected onBlurCore(event: any): void {
      this.dropdownListModel.onBlur(event);
      super.onBlurCore(event);
    }

    protected onFocusCore(event: any): void {
      this.dropdownListModel.onFocus(event);
      super.onFocusCore(event);
    }

    protected calcCssClasses(css: any): any {
      const classes = super.calcCssClasses(css);
      if (this.dropdownListModelValue) {
        this.dropdownListModel.updateCssClasses(classes.popup, classes.list);
      }
      return classes;
    }

    public clearValue(keepComment?: boolean, fromUI?: boolean): void {
      super.clearValue(keepComment, fromUI);
      this.dropdownListModelValue?.clear();
    }

    public dispose(): void {
      super.dispose();
      if (!!this.dropdownListModelValue) {
        this.dropdownListModelValue.dispose();
        this.dropdownListModelValue = undefined;
      }
    }
  }

  return QuestionDropdownMixinClass as any;
}
