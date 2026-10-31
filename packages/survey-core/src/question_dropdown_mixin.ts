import type { DropdownListModel } from "./dropdownListModel";
import type { PopupModel } from "./popup";
import type { EventBase } from "./event";
import type { ItemValue } from "./itemvalue";
import { QuestionSelectBase } from "./question_baseselect";
import { LocalizableString } from "./localizablestring";
import { dropdownQuestionMixin, IDropdownQuestion } from "./dropdownRenderState";

type Constructor<T = {}> = new (...args: any[]) => T;

export interface IQuestionDropdownMixin extends IDropdownQuestion {
  readonly popupModel: PopupModel;
  readonly showClearButton: boolean;
  onOpenedCallBack(): void;
  setIsChoicesLoading(value: boolean): void;
  dispose(): void;
}

export function questionDropdownMixin<TBase extends Constructor<QuestionSelectBase>>(Base: TBase): TBase & Constructor<IQuestionDropdownMixin> {
  class QuestionDropdownMixinClass extends dropdownQuestionMixin(Base) implements IQuestionDropdownMixin {
    private _isChoicesLoading: boolean;

    declare choicesLazyLoadEnabled: boolean;
    declare allowCustomChoices: boolean;
    declare allowClear: boolean;
    declare placeholder: string;
    declare onOpened: EventBase<any>;

    public get popupModel(): PopupModel {
      return this.dropdownListModel.popupModel;
    }

    public get showClearButton(): boolean {
      return this.allowClear && !this.isEmpty();
    }

    public get readOnlyText(): string {
      return this.locReadOnlyText.calculatedText;
    }
    public get locReadOnlyText(): LocalizableString {
      return this.getOrCreateLocStr("readOnlyText", true, false, (locStr: LocalizableString) => {
        locStr.onGetTextCallback = (): string => {
          return this.calculateReadOnlyText() || this.placeholder;
        };
      });
    }
    protected calculateReadOnlyText(): string {
      return this.displayValue;
    }
    protected resetReadOnlyText(): void {
      this.resetPropertyValue("readOnlyText");
    }

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
      if (this.choicesLazyLoadEnabled && !!this.dropdownListModel) {
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

    protected onClearValue(): void {
      super.onClearValue();
      this.dropdownListModelValue?.clear();
    }
  }

  return QuestionDropdownMixinClass as any;
}
