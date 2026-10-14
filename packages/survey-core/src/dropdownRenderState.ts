import type { DropdownListModel } from "./dropdownListModel";
import type { Question } from "./question";
import type { ItemValue } from "./itemvalue";
import type { LocalizableString } from "./localizablestring";
import { Action } from "./actions/action";
import { ActionContainer } from "./actions/container";
import { Helpers } from "./helpers";
import { IsTouch } from "./utils/devices";

type Constructor<T = {}> = new (...args: any[]) => T;

// Everything a renderer reads to draw a closed dropdown-like control (dropdown, tagbox, rating and button group
// in dropdown mode). It is not a Base: it holds no state of its own and only computes values.
// The question's instance reads the model through the question's backing field and never creates it. Until the model
// exists, the interaction state (focus, hint and input strings, expanded state) has the values the model reports
// right after it is created. DropdownListModel owns an instance bound to itself, and its getters delegate to it,
// so every formula exists once.
export class DropdownRenderState {
  constructor(protected question: Question, private ownerModel?: DropdownListModel) { }

  protected get model(): DropdownListModel {
    return this.ownerModel || this.question.dropdownListModelValue;
  }

  // The model mirrors these question properties, but they can drift (allowCustomChoices switched on and off again
  // keeps the model's searchEnabled on), so the model's values win once it exists.
  protected get searchEnabled(): boolean {
    const model = this.model;
    if (!!model) return model.searchEnabled;
    const allowCustomChoices = this.question.allowCustomChoices;
    if (allowCustomChoices) return allowCustomChoices;
    const searchEnabled = this.question.searchEnabled;
    return Helpers.isValueUndefined(searchEnabled) ? true : searchEnabled;
  }
  protected get allowCustomChoices(): boolean {
    const model = this.model;
    if (!!model) return model.allowCustomChoices;
    const allowCustomChoices = this.question.allowCustomChoices;
    return Helpers.isValueUndefined(allowCustomChoices) ? false : allowCustomChoices;
  }
  public get focused(): boolean {
    const model = this.model;
    return !!model ? model.focused : false;
  }
  public get hintString(): string {
    const model = this.model;
    return !!model ? model.hintString : "";
  }
  protected get inputString(): string {
    const model = this.model;
    return !!model ? model.inputString : "";
  }
  protected get inputPlaceholder(): string {
    const model = this.model;
    return !!model ? model.inputPlaceholder : this.question.placeholder;
  }
  protected get markdownMode(): boolean {
    const model = this.model;
    return !!model ? model.markdownMode : false;
  }
  public get ariaExpanded(): "true" | "false" {
    const model = this.model;
    return !!model ? model.ariaExpanded : "false";
  }
  public get ariaActivedescendant(): string {
    const model = this.model;
    return !!model ? model.ariaActivedescendant : undefined;
  }
  // The model copies it from the question on creation and on value changes only.
  public get showInputFieldComponent(): boolean {
    const model = this.model;
    return !!model ? model.showInputFieldComponent : this.question.showInputFieldComponent;
  }

  public get listElementId(): string {
    return this.question.inputId + "_list";
  }
  public get inputAvailable(): boolean {
    return this.searchEnabled || this.allowCustomChoices;
  }
  public get noTabIndex(): boolean {
    return this.question.isInputReadOnly || this.inputAvailable;
  }
  public get filterReadOnly(): boolean {
    return !this.filterStringEnabled || !this.focused;
  }
  public get filterStringEnabled(): boolean {
    return !this.question.isInputReadOnly && this.inputAvailable;
  }
  public get inputMode(): "none" | "text" {
    return IsTouch ? "none" : "text";
  }
  public get popupEnabled(): boolean {
    return !this.question.isInputReadOnly;
  }
  public get canShowSelectedItem(): boolean {
    return !this.focused || this.markdownMode || !this.searchEnabled;
  }
  public get needRenderInput(): boolean {
    return !this.question.isInputReadOnly || !!this.placeholderRendered;
  }
  public get inputStringRendered(): string {
    return this.inputString || "";
  }
  public get placeholderRendered(): string {
    return (this.hintString || this.question.readOnly || !this.question.isEmpty()) ? "" : this.inputPlaceholder;
  }

  private get hintStringLC(): string {
    return this.hintString?.toLowerCase() || "";
  }
  private get inputStringLC(): string {
    return this.inputString?.toLowerCase() || "";
  }
  public get showHintPrefix(): boolean {
    return !!this.inputString && this.hintStringLC.indexOf(this.inputStringLC) > 0;
  }
  public get hintStringPrefix(): string {
    if (!this.inputString) return null;
    return this.hintString.substring(0, this.hintStringLC.indexOf(this.inputStringLC));
  }
  public get showHintString(): boolean {
    return !!this.searchEnabled && !!(this.hintStringLC || this.inputStringLC) ||
      !this.searchEnabled && this.hintStringLC && this.question.isEmpty();
  }
  public get hintStringSuffix(): string {
    return this.hintStringLC.indexOf(this.inputStringLC) >= 0 ? this.hintString.substring(this.hintStringLC.indexOf(this.inputStringLC) + this.inputStringLC.length) : "";
  }
  public get hintStringMiddle(): string {
    const start = this.hintStringLC.indexOf(this.inputStringLC);
    if (start == -1) return null;
    return this.hintString.substring(start, start + this.inputStringLC.length);
  }

  public get ariaQuestionRole(): string | undefined { return this.filterStringEnabled ? undefined : "combobox"; }
  public get ariaQuestionRequired(): "true" | "false" | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaRequired : undefined; }
  public get ariaQuestionInvalid(): "true" | "false" | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaInvalid : undefined; }
  public get ariaQuestionErrorMessage(): string | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaErrormessage : undefined; }
  public get ariaQuestionLabel(): string | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaLabel : undefined; }
  public get ariaQuestionLabelledby(): string | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaLabelledBy : undefined; }
  public get ariaQuestionDescribedby(): string | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaDescribedBy : undefined; }
  public get ariaQuestionControls(): string | undefined { return this.ariaQuestionRole && this.popupEnabled ? this.listElementId : undefined; }
  public get ariaQuestionExpanded(): "true" | "false" { return this.ariaQuestionRole ? (this.popupEnabled ? this.ariaExpanded : "false") : undefined; }
  public get ariaQuestionActivedescendant(): string | undefined { return this.ariaQuestionRole ? this.ariaActivedescendant : undefined; }

  public get ariaInputRole(): string { return this.filterStringEnabled ? "combobox" : undefined; }
  public get ariaInputRequired(): "true" | "false" { return this.ariaInputRole ? this.question.a11y_input_ariaRequired : undefined; }
  public get ariaInputInvalid(): "true" | "false" { return this.ariaInputRole ? this.question.a11y_input_ariaInvalid : undefined; }
  public get ariaInputErrorMessage(): string { return this.ariaInputRole ? this.question.a11y_input_ariaErrormessage : undefined; }
  public get ariaInputLabel(): string { return this.ariaInputRole ? this.question.a11y_input_ariaLabel : undefined; }
  public get ariaInputLabelledby(): string { return this.ariaInputRole ? this.question.a11y_input_ariaLabelledBy : undefined; }
  public get ariaInputDescribedby(): string { return this.ariaInputRole ? this.question.a11y_input_ariaDescribedBy : undefined; }
  public get ariaInputControls(): string { return this.ariaInputRole && this.popupEnabled ? this.listElementId : undefined; }
  public get ariaInputExpanded(): "true" | "false" { return this.ariaInputRole ? (this.popupEnabled ? this.ariaExpanded : "false") : undefined; }
  public get ariaInputActivedescendant(): string { return this.ariaInputRole ? this.ariaActivedescendant : undefined; }

  public getSelectedAction(): ItemValue {
    const model = this.model;
    return !!model ? model.getSelectedAction() : (this.question.selectedItem || null);
  }
  public get editorButtons(): ActionContainer {
    return this.question.dropdownEditorButtons;
  }
}

export class DropdownMultiSelectRenderState extends DropdownRenderState {
  public get filterString(): string {
    const model = this.model;
    return !!model ? model.filterString : "";
  }
  // Without a list model, the question's selected items decide alone: the list has no focused item yet,
  // and its selected actions are a subset of the selected items.
  public get filterStringPlaceholder(): string {
    const model: any = this.model;
    if (!!model) return model.filterStringPlaceholder;
    const placeholder = this.question.selectedItems.length > 0 ? undefined : this.question.placeholder;
    return Helpers.isValueUndefined(placeholder) ? "" : placeholder;
  }
  public get needRenderInput(): boolean {
    return !this.question.isInputReadOnly || !!this.filterStringPlaceholder;
  }
}

// The chevron and clear buttons of a dropdown-like control. They belong to the question, so a closed control renders
// them without a DropdownListModel. Their state is updated on events rather than with ComputedUpdater: a ComputedUpdater
// registers a keyed handler on the page and the survey, and keyed registration scans every handler already registered,
// which is quadratic in the number of questions.
export class DropdownEditorButtons extends ActionContainer {
  public static readonly questionPropertiesToUpdate = ["value", "readOnly", "isInputReadOnly", "isDesignMode", "forceIsInputReadOnly", "allowClear"];
  private chevronButton: Action;
  private clearButton: Action;
  private survey: any;
  private surveyPropertyChangedHandler = (sender: any, options: any) => {
    if (options.name === "state") {
      this.updateState();
    }
  };

  constructor(private question: Question, locSelectCaption: LocalizableString, locClearCaption: LocalizableString,
    getModel: () => DropdownListModel) {
    super();
    this.locOwner = question;
    this.containerCss = question.cssClasses?.group;
    this.setActionsAppearance({ mode: "tertiary", style: "neutral", size: "small" });

    this.chevronButton = new Action({
      id: "chevron",
      css: "sd-editor-chevron-button",
      iconName: question.cssClasses.chevronButtonIconId || "icon-chevron",
      iconSize: "auto",
      showTitle: false,
      locTitle: locSelectCaption,
      disableTabStop: true,
      enabled: !question.isInputReadOnly,
      visible: !question.isPreviewStyle,
      action: (context: any) => {
        getModel().onClick();
      }
    });

    this.clearButton = new Action({
      id: "clear",
      css: "sd-editor-clean-button",
      iconName: question.cssClasses.cleanButtonIconId || "icon-cancel-24x24",
      iconSize: "auto",
      showTitle: false,
      locTitle: locClearCaption,
      disableTabStop: true,
      enabled: !question.isInputReadOnly,
      visible: this.isClearButtonVisible,
      action: (context: any) => {
        getModel().onClear();
      }
    });

    this.setItems([this.clearButton, this.chevronButton]);
    this.survey = question.survey;
    if (!!this.survey) {
      this.survey.onPropertyChanged.add(this.surveyPropertyChangedHandler);
    }
  }
  private get isClearButtonVisible(): boolean {
    return this.question.allowClear && !this.question.isEmpty() && !this.question.isReadOnly;
  }
  public updateState(): void {
    this.chevronButton.setEnabled(!this.question.isInputReadOnly);
    this.chevronButton.setVisible(!this.question.isPreviewStyle);
    this.clearButton.setEnabled(!this.question.isInputReadOnly);
    this.clearButton.setVisible(this.isClearButtonVisible);
  }
  public dispose(): void {
    if (!!this.survey) {
      this.survey.onPropertyChanged.remove(this.surveyPropertyChangedHandler);
      this.survey = undefined;
    }
    super.dispose();
  }
}
export interface IDropdownQuestion {
  dropdownListModelValue: DropdownListModel;
  dropdownListModel: DropdownListModel;
  readonly dropdownRenderState: DropdownRenderState;
  readonly dropdownEditorButtons: DropdownEditorButtons;
  getDropdownLocCaption(name: "selectCaption" | "clearCaption"): LocalizableString;
}

// The plumbing shared by every question that renders as a dropdown: the lazily created DropdownListModel,
// the render state, the editor buttons, focus/blur, css and dispose.
export function dropdownQuestionMixin<TBase extends Constructor<Question>>(Base: TBase): TBase & Constructor<IDropdownQuestion> {
  class DropdownQuestionClass extends Base implements IDropdownQuestion {
    dropdownListModelValue: DropdownListModel;
    private dropdownRenderStateValue: DropdownRenderState;
    private dropdownEditorButtonsValue: DropdownEditorButtons;

    public get dropdownListModel(): DropdownListModel {
      return this.getDropdownListModel();
    }
    public set dropdownListModel(val: DropdownListModel) {
      this.setDropdownListModel(val);
    }
    protected getDropdownListModel(): DropdownListModel {
      if (!this.dropdownListModelValue && !this.isDisposed && this.canCreateDropdownListModel()) {
        this.dropdownListModelValue = this.createDropdownListModel();
      }
      return this.dropdownListModelValue;
    }
    protected setDropdownListModel(val: DropdownListModel): void {
      this.dropdownListModelValue = val;
      this.onDropdownListModelAssigned();
    }
    // An editable control switching to the compact (dropdown) renderer mounts the popup on the next render.
    // Create the model before that render, as the popup would otherwise create it inside the render: building its list
    // re-owns the choice items, which notifies the item texts that are still rendered.
    protected onBeforeSetCompactRenderer(): void {
      super.onBeforeSetCompactRenderer();
      if (!this.dropdownListModelValue && !this.isDisposed && !this.isInputReadOnly) {
        this.dropdownListModelValue = this.createDropdownListModel();
      }
    }
    protected canCreateDropdownListModel(): boolean { return true; }
    protected createDropdownListModel(): DropdownListModel { return undefined; }
    protected onDropdownListModelAssigned(): void { }

    public get dropdownRenderState(): DropdownRenderState {
      if (!this.dropdownRenderStateValue) {
        this.dropdownRenderStateValue = this.createDropdownRenderState();
      }
      return this.dropdownRenderStateValue;
    }
    protected createDropdownRenderState(): DropdownRenderState {
      return new DropdownRenderState(this);
    }

    public get dropdownEditorButtons(): DropdownEditorButtons {
      if (!this.dropdownEditorButtonsValue) {
        this.dropdownEditorButtonsValue = new DropdownEditorButtons(this,
          this.getDropdownLocCaption("selectCaption"), this.getDropdownLocCaption("clearCaption"),
          () => this.dropdownListModel);
      }
      return this.dropdownEditorButtonsValue;
    }
    // Not exposed as locSelectCaption/locClearCaption: QuestionDropdownModel.inputActionBar reads locSelectCaption.
    public getDropdownLocCaption(name: "selectCaption" | "clearCaption"): LocalizableString {
      return this.getLocalizableString(name) || this.createLocalizableString(name, this, false, true);
    }
    protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
      super.onPropertyValueChanged(name, oldValue, newValue);
      if (!!this.dropdownEditorButtonsValue && DropdownEditorButtons.questionPropertiesToUpdate.indexOf(name) > -1) {
        this.dropdownEditorButtonsValue.updateState();
      }
      // A rendered control becomes editable: the next render mounts the popup. Create the model now, for the same reason
      // as in onBeforeSetCompactRenderer.
      if (name === "isInputReadOnly" && !newValue && !!this.dropdownRenderStateValue && this.canCreateDropdownListModel()) {
        this.getDropdownListModel();
      }
    }
    public updateElementCss(reNew?: boolean): void {
      super.updateElementCss(reNew);
      if (!!this.dropdownEditorButtonsValue) {
        this.dropdownEditorButtonsValue.containerCss = this.cssClasses.group;
      }
    }

    protected onBlurCore(event: any): void {
      this.dropdownListModelValue?.onBlur(event);
      super.onBlurCore(event);
    }
    protected onFocusCore(event: any): void {
      if (this.canCreateDropdownListModel()) {
        this.dropdownListModel?.onFocus(event);
      }
      super.onFocusCore(event);
    }
    protected calcCssClasses(css: any): any {
      const classes = super.calcCssClasses(css);
      if (this.dropdownListModelValue) {
        this.dropdownListModelValue.updateCssClasses(classes.popup, classes.list);
      }
      return classes;
    }
    public dispose(): void {
      super.dispose();
      if (!!this.dropdownListModelValue) {
        this.dropdownListModelValue.dispose();
        this.dropdownListModelValue = undefined;
      }
      if (!!this.dropdownEditorButtonsValue) {
        this.dropdownEditorButtonsValue.dispose();
        this.dropdownEditorButtonsValue = undefined;
      }
    }
  }
  return DropdownQuestionClass as any;
}
