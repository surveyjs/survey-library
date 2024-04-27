import { IPlainDataOptions } from "./base-interfaces";
import { IQuestionPlainData, Question } from "./question";
import { property, propertyArray, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { EventBase, ComputedUpdater } from "./base";
import { UploadingFileError, ExceedSizeError } from "./error";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { classesToSelector, confirmActionAsync, detectIEOrEdge, isElementVisible, loadFileFromBase64 } from "./utils/utils";
import { ActionContainer } from "./actions/container";
import { Action } from "./actions/action";
import { Helpers } from "./helpers";
import { Camera } from "./utils/camera";
import { LocalizableString } from "./localizablestring";
import { settings } from "./settings";
import { getRenderedSize } from "./utils/utils";
import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";

export function dataUrl2File(dataUrl: string, fileName: string, type: string) {
  const str = atob(dataUrl.split(",")[1]);
  const buffer = new Uint8Array(str.split("").map(c => c.charCodeAt(0))).buffer;
  return new File([buffer], fileName, { type: type });
}
/**
 * A base class for question types that support file upload: `QuestionFileModel` and `QuestionSignaturePadModel`.
 */
export class QuestionFileModelBase extends Question {
  @property() public isUploading: boolean = false;
  @property({ defaultValue: "empty" }) currentState: string;
  /**
   * An event that is raised after the upload state has changed.
   *
   * Parameters:
   *
   * - `sender`: `SurveyModel`\
   * A survey instance that raised the event.
   * - `options.state`: `string`\
   * The current upload state: `"empty"`, `"loading"`, `"loaded"`, or `"error"`.
   */
  public onUploadStateChanged: EventBase<QuestionFileModelBase> = this.addEvent<
    QuestionFileModelBase
  >();
  public onStateChanged: EventBase<QuestionFileModelBase> = this.addEvent<
    QuestionFileModelBase
  >();
  protected stateChanged(state: string) {
    if (this.currentState == state) {
      return;
    }
    if (state === "loading") {
      this.isUploading = true;
    }
    if (state === "loaded") {
      this.isUploading = false;
    }
    if (state === "error") {
      this.isUploading = false;
    }
    this.currentState = state;
    this.onStateChanged.fire(this, { state: state });
    this.onUploadStateChanged.fire(this, { state: state });
  }
  public get showLoadingIndicator(): boolean {
    return this.isUploading && this.isDefaultV2Theme;
  }
  /**
   * Specifies whether to store file or signature content as text in `SurveyModel`'s [`data`](https://surveyjs.io/form-library/documentation/surveymodel#data) property.
   *
   * If you disable this property, implement `SurveyModel`'s [`onUploadFiles`](https://surveyjs.io/form-library/documentation/surveymodel#onUploadFiles) event handler to specify how to store file content.
   */
  public get storeDataAsText(): boolean {
    return this.getPropertyValue("storeDataAsText");
  }
  public set storeDataAsText(val: boolean) {
    this.setPropertyValue("storeDataAsText", val);
  }
  /**
     * Enable this property if you want to wait until files are uploaded to complete the survey.
     *
     * Default value: `false`
     */
  public get waitForUpload(): boolean {
    return this.getPropertyValue("waitForUpload");
  }
  public set waitForUpload(val: boolean) {
    this.setPropertyValue("waitForUpload", val);
  }

  public clearValue(): void {
    this.clearOnDeletingContainer();
    super.clearValue();
  }
  public clearOnDeletingContainer() {
    if (!this.survey) return;
    this.survey.clearFiles(this, this.name, this.value, null, () => { });
  }

  protected onCheckForErrors(
    errors: Array<SurveyError>,
    isOnValueChanged: boolean
  ) {
    super.onCheckForErrors(errors, isOnValueChanged);
    if (this.isUploading && this.waitForUpload) {
      errors.push(
        new UploadingFileError(
          this.getLocalizationString("uploadingFile"),
          this
        )
      );
    }
  }
  protected uploadFiles(files: File[]) {
    if (this.survey) {
      this.stateChanged("loading");
      this.survey.uploadFiles(this, this.name, files, (arg1: any, arg2: any) => {
        if (Array.isArray(arg1)) {
          this.setValueFromResult(arg1);
          if (Array.isArray(arg2)) {
            arg2.forEach(error => this.errors.push(new UploadingFileError(error, this)));
            this.stateChanged("error");
          }
        }
        if (arg1 === "success" && Array.isArray(arg2)) {
          this.setValueFromResult(arg2);
        }
        if (arg1 === "error") {
          if (typeof (arg2) === "string") {
            this.errors.push(new UploadingFileError(arg2, this));
          }
          if (Array.isArray(arg2) && arg2.length > 0) {
            arg2.forEach(error => this.errors.push(new UploadingFileError(error, this)));
          }
          this.stateChanged("error");
        }
        this.stateChanged("loaded");
      });
    }
  }
}

/**
 * A class that describes the File Upload question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))
 */
export class QuestionFileModel extends QuestionFileModelBase {
  @property() isDragging: boolean = false;
  @propertyArray({}) public previewValue: any[];

  @property({ defaultValue: 0 }) indexToShow: number;
  @property({
    defaultValue: 1, onSet: (_, target) => {
      target.updateFileNavigator();
    }
  }) pageSize: number;
  @property({ defaultValue: false }) containsMultiplyFiles: boolean;
  @property() allowCameraAccess: boolean;
  /**
   * Specifies the source of uploaded files.
   *
   * Possible values:
   *
   * - `"file"` (default) - Allows respondents to select a local file.
   * - `"camera"` - Allows respondents to capture and upload a photo.
   * - `"file-camera"` - Allows respondents to select a local file or capture a photo.
   * @see filePlaceholder
   * @see photoPlaceholder
   * @see fileOrPhotoPlaceholder
   */
  @property({
    onSet: (val: string, obj: QuestionFileModel) => {
      if (!obj.isLoadingFromJson) {
        obj.updateCurrentMode();
      }
    }
  }) sourceType: string;

  public fileNavigator: ActionContainer = new ActionContainer();
  protected prevFileAction: Action;
  protected nextFileAction: Action;
  protected fileIndexAction: Action;
  public closeCameraAction: Action;
  public takePictureAction: Action;
  public changeCameraAction: Action;
  public chooseFileAction: Action;
  public startCameraAction: Action;
  public cleanAction: Action;
  public actionsContainer: ActionContainer;

  get fileNavigatorVisible(): boolean {
    const isUploading = this.isUploading;
    const isPlayingVideo = this.isPlayingVideo;
    const containsMultipleFiles = this.containsMultiplyFiles;
    const needToShowFileNavigator = this.pageSize < this.previewValue.length;
    return !isUploading && !isPlayingVideo && containsMultipleFiles && needToShowFileNavigator && this.isDefaultV2Theme;
  }
  private get pagesCount() {
    return Math.ceil(this.previewValue.length / this.pageSize);
  }

  get actionsContainerVisible(): boolean {
    const isUploading = this.isUploading;
    const isPlayingVideo = this.isPlayingVideo;
    const isDefaultV2Theme = this.isDefaultV2Theme;
    return !isUploading && !isPlayingVideo && isDefaultV2Theme;
  }

  constructor(name: string) {
    super(name);
    this.createLocalizableString("takePhotoCaption", this, false, true);
    this.createLocalizableString("clearCaption", this, false, true);
    this.actionsContainer = new ActionContainer();
    this.actionsContainer.locOwner = this;
    this.fileIndexAction = new Action({
      id: "fileIndex",
      title: this.getFileIndexCaption(),
      enabled: false
    });
    this.prevFileAction = new Action({
      id: "prevPage",
      iconSize: 16,
      action: () => {
        this.indexToShow = this.previewValue.length && ((this.indexToShow - 1 + this.pagesCount) % this.pagesCount) || 0;
        this.fileIndexAction.title = this.getFileIndexCaption();
      }
    });
    this.nextFileAction = new Action({
      id: "nextPage",
      iconSize: 16,
      action: () => {
        this.indexToShow = this.previewValue.length && ((this.indexToShow + 1) % this.pagesCount) || 0;
        this.fileIndexAction.title = this.getFileIndexCaption();
      }
    });
    this.takePictureAction = new Action({
      iconName: "icon-takepicture",
      id: "sv-file-take-picture",
      iconSize: "auto",
      innerCss: <string>(new ComputedUpdater<string>(() => new CssClassBuilder().append(this.cssClasses.contextButton).append(this.cssClasses.takePictureButton).toString()) as any),
      locTitle: this.locTakePhotoCaption,
      showTitle: false,
      action: () => {
        this.snapPicture();
      }
    });
    this.closeCameraAction = new Action({
      iconName: "icon-closecamera",
      id: "sv-file-close-camera",
      iconSize: "auto",
      innerCss: <string>(new ComputedUpdater<string>(() => new CssClassBuilder().append(this.cssClasses.contextButton).append(this.cssClasses.closeCameraButton).toString()) as any),
      action: () => {
        this.stopVideo();
      }
    });
    this.changeCameraAction = new Action({
      iconName: "icon-changecamera",
      id: "sv-file-change-camera",
      iconSize: "auto",
      innerCss: <string>(new ComputedUpdater<string>(() => new CssClassBuilder().append(this.cssClasses.contextButton).append(this.cssClasses.changeCameraButton).toString()) as any),
      visible: <boolean>(new ComputedUpdater<boolean>(() => this.canFlipCamera()) as any),
      action: () => {
        this.flipCamera();
      }
    });
    this.chooseFileAction = new Action({
      iconName: "icon-choosefile",
      id: "sv-file-choose-file",
      iconSize: "auto",
      data: { question: this },
      enabledIf: () => !this.isInputReadOnly,
      component: "sv-file-choose-btn"
    });
    this.startCameraAction = new Action({
      iconName: "icon-takepicture_24x24",
      id: "sv-file-start-camera",
      iconSize: "auto",
      locTitle: this.locTakePhotoCaption,
      showTitle: <boolean>(new ComputedUpdater<boolean>(() => !this.isAnswered) as any),
      enabledIf: () => !this.isInputReadOnly,
      action: () => {
        this.startVideo();
      }
    });
    this.cleanAction = new Action({
      iconName: "icon-clear",
      id: "sv-file-clean",
      iconSize: "auto",
      locTitle: this.locClearButtonCaption,
      showTitle: false,
      enabledIf: () => !this.isInputReadOnly,
      innerCss: <string>(new ComputedUpdater<string>(() => this.cssClasses.removeButton) as any),
      action: () => {
        this.doClean();
      }
    });
    [this.closeCameraAction, this.changeCameraAction, this.takePictureAction].forEach((action) => {
      action.cssClasses = {};
    });
    this.registerFunctionOnPropertiesValueChanged(["sourceType", "currentMode", "isAnswered"], () => {
      this.updateActionsVisibility();
    });
    this.actionsContainer.actions = [this.chooseFileAction, this.startCameraAction, this.cleanAction];
    this.fileNavigator.actions = [this.prevFileAction, this.fileIndexAction, this.nextFileAction];
  }
  public get videoId(): string { return this.id + "_video"; }
  public get hasVideoUI(): boolean { return this.currentMode !== "file"; }
  public get hasFileUI(): boolean { return this.currentMode !== "camera"; }
  private videoStream: MediaStream;
  public startVideo(): void {
    if (this.currentMode === "file" || this.isDesignMode || this.isPlayingVideo) return;
    this.setIsPlayingVideo(true);
    setTimeout(() => {
      this.startVideoInCamera();
    }, 0);
  }

  private startVideoInCamera(): void {
    this.camera.startVideo(this.videoId, (stream: MediaStream) => {
      this.videoStream = stream;
      if (!stream) {
        this.stopVideo();
      }
    }, getRenderedSize(this.imageWidth), getRenderedSize(this.imageHeight));
  }
  public stopVideo(): void {
    this.setIsPlayingVideo(false);
    this.closeVideoStream();
  }
  public snapPicture(): void {
    if (!this.isPlayingVideo) return;
    const blobCallback = (blob: Blob | null): void => {
      if (blob) {
        const file = new File([blob], "snap_picture.png", { type: "image/png" });
        this.loadFiles([file]);
      }
    };
    this.camera.snap(this.videoId, blobCallback);
    this.stopVideo();
  }
  @property() private canFlipCameraValue: boolean = undefined;
  public canFlipCamera(): boolean {
    if (this.canFlipCameraValue === undefined) {
      this.canFlipCameraValue = this.camera.canFlip((res: boolean) => {
        this.canFlipCameraValue = res;
      });
    }
    return this.canFlipCameraValue;
  }
  public flipCamera(): void {
    if (!this.canFlipCamera()) return;
    this.closeVideoStream();
    this.camera.flip();
    this.startVideoInCamera();
  }
  private closeVideoStream(): void {
    if (!!this.videoStream) {
      this.videoStream.getTracks().forEach(track => {
        track.stop();
      });
      this.videoStream = undefined;
    }
  }
  public onHidingContent(): void {
    super.onHidingContent();
    this.stopVideo();
  }
  protected updateElementCssCore(cssClasses: any): void {
    super.updateElementCssCore(cssClasses);
    this.prevFileAction.iconName = this.cssClasses.leftIconId;
    this.nextFileAction.iconName = this.cssClasses.rightIconId;
    //this.mobileFileNavigator.cssClasses = this.survey.getCss().actionBar;
  }
  private getFileIndexCaption(): string {
    return this.getLocalizationFormatString("indexText", this.indexToShow + 1, this.pagesCount);
  }
  private updateFileNavigator() {
    this.indexToShow = this.previewValue.length && ((this.indexToShow + this.pagesCount) % this.pagesCount) || 0;
    this.fileIndexAction.title = this.getFileIndexCaption();
  }
  private prevPreviewLength = 0;
  private previewValueChanged() {
    if (this.previewValue.length !== this.prevPreviewLength) {
      if (this.previewValue.length > 0) {
        if (this.prevPreviewLength > this.previewValue.length) {
          this.indexToShow = this.indexToShow >= this.pagesCount && this.indexToShow > 0 ? this.pagesCount - 1 : this.indexToShow;
        } else {
          this.indexToShow = Math.floor(this.prevPreviewLength / this.pageSize);
        }
      } else {
        this.indexToShow = 0;
      }
    }
    this.fileIndexAction.title = this.getFileIndexCaption();
    this.containsMultiplyFiles = this.previewValue.length > 1;
    if (this.previewValue.length > 0 && !this.calculatedGapBetweenItems && !this.calculatedItemWidth) {
      setTimeout(() => {
        this.processResponsiveness(0, this._width);
      });
    }
    this.prevPreviewLength = this.previewValue.length;
  }
  public isPreviewVisible(index: number) {
    const isFileNavigatorVisible = this.fileNavigatorVisible;
    const isPreviewVisible = (this.indexToShow * this.pageSize <= index && index < (this.indexToShow + 1) * this.pageSize);
    return !isFileNavigatorVisible || isPreviewVisible;
  }

  public getType(): string {
    return "file";
  }
  /**
   * Disable this property only to implement a custom preview.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/file-custom-preview/ (linkStyle))
   * @see allowImagesPreview
   */
  public get showPreview() {
    return this.getPropertyValue("showPreview");
  }
  public set showPreview(val: boolean) {
    this.setPropertyValue("showPreview", val);
  }
  /**
   * Specifies whether users can upload multiple files.
   *
   * Default value: `false`
   */
  public get allowMultiple(): boolean {
    return this.getPropertyValue("allowMultiple");
  }
  public set allowMultiple(val: boolean) {
    this.setPropertyValue("allowMultiple", val);
  }
  /**
   * The image height.
   */
  public get imageHeight(): string {
    return this.getPropertyValue("imageHeight");
  }
  public set imageHeight(val: string) {
    this.setPropertyValue("imageHeight", val);
  }
  /**
   * The image width.
   */
  public get imageWidth(): string {
    return this.getPropertyValue("imageWidth");
  }
  public set imageWidth(val: string) {
    this.setPropertyValue("imageWidth", val);
  }
  /**
   * An [accept](https://www.w3schools.com/tags/att_input_accept.asp) attribute value for the underlying `<input>` element.
   */
  public get acceptedTypes(): string {
    return this.getPropertyValue("acceptedTypes");
  }
  public set acceptedTypes(val: string) {
    this.setPropertyValue("acceptedTypes", val);
  }
  /**
   * Specifies whether to show a preview of image files.
   */
  public get allowImagesPreview(): boolean {
    return this.getPropertyValue("allowImagesPreview");
  }
  public set allowImagesPreview(val: boolean) {
    this.setPropertyValue("allowImagesPreview", val);
  }
  /**
   * Maximum allowed file size, measured in bytes.
   *
   * Default value: 0 (unlimited)
   */
  public get maxSize(): number {
    return this.getPropertyValue("maxSize");
  }
  public set maxSize(val: number) {
    this.setPropertyValue("maxSize", val);
  }
  public chooseFile(event: MouseEvent): void {
    if (!DomDocumentHelper.isAvailable()) return;

    const inputElement = DomDocumentHelper.getDocument().getElementById(this.inputId) as HTMLInputElement;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (inputElement) {
      if (this.survey) {
        this.survey.chooseFiles(inputElement, files => this.loadFiles(files), { element: this, elementType: this.getType(), propertyName: this.name });
      } else {
        inputElement.click();
      }
    }
  }
  /**
   * Specifies whether users should confirm file deletion.
   *
   * Default value: `false`
   */
  public get needConfirmRemoveFile(): boolean {
    return this.getPropertyValue("needConfirmRemoveFile");
  }
  public set needConfirmRemoveFile(val: boolean) {
    this.setPropertyValue("needConfirmRemoveFile", val);
  }
  public getConfirmRemoveMessage(fileName: string): string {
    return (<any>this.confirmRemoveMessage).format(fileName);
  }
  @property({ localizable: { defaultStr: "confirmRemoveFile" } }) confirmRemoveMessage: string;
  @property({ localizable: { defaultStr: "confirmRemoveAllFiles" } }) confirmRemoveAllMessage: string;
  @property({ localizable: { defaultStr: "noFileChosen" } }) noFileChosenCaption: string;
  @property({ localizable: { defaultStr: "chooseFileCaption" } }) chooseButtonCaption: string;
  public get takePhotoCaption(): string { return this.getLocalizableStringText("takePhotoCaption"); }
  public set takePhotoCaption(val: string) { this.setLocalizableStringText("takePhotoCaption", val); }
  public get locTakePhotoCaption(): LocalizableString { return this.getLocalizableString("takePhotoCaption"); }
  @property({ localizable: { defaultStr: "replaceFileCaption" } }) replaceButtonCaption: string;
  @property({ localizable: { defaultStr: "removeFileCaption" } }) removeFileCaption: string;
  @property({ localizable: { defaultStr: "loadingFile" } }) loadingFileTitle: string;
  @property({ localizable: { defaultStr: "chooseFile" } }) chooseFileTitle: string;

  public get clearButtonCaption(): string {
    return this.getLocalizableStringText("clearCaption");
  }
  public set clearButtonCaption(value: string) {
    this.setLocalizableStringText("clearCaption", value);
  }
  get locClearButtonCaption(): LocalizableString {
    return this.getLocalizableString("clearCaption");
  }

  /**
   * A placeholder text displayed when the File Upload question doesn't contain any files or photos to upload. Applies only when [`sourceType`](#sourceType) value is `"file-camera"`.
   * @see filePlaceholder
   * @see photoPlaceholder
   */
  @property({ localizable: { defaultStr: "fileOrPhotoPlaceholder" } }) fileOrPhotoPlaceholder: string;
  /**
   * A placeholder text displayed when the File Upload question doesn't contain any photos to upload. Applies only when the [`sourceType`](#sourceType) value is `"camera"`.
   * @see filePlaceholder
   * @see fileOrPhotoPlaceholder
   */
  @property({ localizable: { defaultStr: "photoPlaceholder" } }) photoPlaceholder: string;
  /**
   * A placeholder text displayed when the File Upload question doesn't contain any files to upload. Applies only when the [`sourceType`](#sourceType) value is `"file"`.
   * @see photoPlaceholder
   * @see fileOrPhotoPlaceholder
   */
  @property({ localizable: { defaultStr: "filePlaceholder" } }) filePlaceholder: string;

  @property() locRenderedPlaceholderValue: LocalizableString;
  public get locRenderedPlaceholder(): LocalizableString {
    if (this.locRenderedPlaceholderValue === undefined) {
      this.locRenderedPlaceholderValue = <LocalizableString><unknown>(new ComputedUpdater<LocalizableString>(() => {
        const isReadOnly = this.isReadOnly;
        const hasFileUI = (!this.isDesignMode && this.hasFileUI) || (this.isDesignMode && this.sourceType != "camera");
        const hasVideoUI = (!this.isDesignMode && this.hasVideoUI) || (this.isDesignMode && this.sourceType != "file");
        let renderedPlaceholder: LocalizableString;
        if (isReadOnly) {
          renderedPlaceholder = this.locNoFileChosenCaption;
        }
        else if (hasFileUI && hasVideoUI) {
          renderedPlaceholder = this.locFileOrPhotoPlaceholder;
        }
        else if (hasFileUI) {
          renderedPlaceholder = this.locFilePlaceholder;
        }
        else {
          renderedPlaceholder = this.locPhotoPlaceholder;
        }
        return renderedPlaceholder;
      }));
    }
    return this.locRenderedPlaceholderValue;
  }
  public get currentMode(): string {
    return this.getPropertyValue("currentMode", this.sourceType);
  }
  public get isPlayingVideo(): boolean {
    return this.getPropertyValue("isPlayingVideo", false);
  }
  private setIsPlayingVideo(show: boolean): void {
    this.setPropertyValue("isPlayingVideo", show);
  }
  private updateCurrentMode(): void {
    if (!this.isDesignMode) {
      if (this.sourceType !== "file") {
        this.camera.hasCamera((res: boolean) => {
          this.setPropertyValue("currentMode", res && this.isDefaultV2Theme ? this.sourceType : "file");
        });
      } else {
        this.setPropertyValue("currentMode", this.sourceType);
      }
    }
  }
  private updateActionsVisibility() {
    const isDesignMode = this.isDesignMode;
    this.chooseFileAction.visible = (!isDesignMode && this.hasFileUI) || (isDesignMode && this.sourceType !== "camera");
    this.startCameraAction.visible = (!isDesignMode && this.hasVideoUI) || (isDesignMode && this.sourceType !== "file");
    this.cleanAction.visible = !!this.isAnswered;
  }
  get inputTitle(): string {
    if (this.isUploading) return this.loadingFileTitle;
    if (this.isEmpty()) return this.chooseFileTitle;
    return " ";
  }

  public get chooseButtonText() {
    return this.isEmpty() || this.allowMultiple ? this.chooseButtonCaption : this.replaceButtonCaption;
  }

  public clear(doneCallback?: () => void) {
    if (!this.survey) return;
    this.containsMultiplyFiles = false;
    this.survey.clearFiles(
      this,
      this.name,
      this.value,
      null,
      (status, data) => {
        if (status === "success") {
          this.value = undefined;
          this.errors = [];
          !!doneCallback && doneCallback();
          this.indexToShow = 0;
          this.fileIndexAction.title = this.getFileIndexCaption();
        }
      }
    );
  }
  public get renderCapture(): string {
    return this.allowCameraAccess ? "user" : undefined;
  }

  get multipleRendered() {
    return this.allowMultiple ? "multiple" : undefined;
  }
  //todo: remove it in V2
  public get showChooseButton(): boolean {
    return !this.isReadOnly && !this.isDefaultV2Theme;
  }
  //
  public get showFileDecorator(): boolean {
    const isPlayingVideo = this.isPlayingVideo;
    const showLoadingIndicator = this.showLoadingIndicator;
    return !isPlayingVideo && !showLoadingIndicator;
  }
  public get allowShowPreview(): boolean {
    const isShowLoadingIndicator = this.showLoadingIndicator;
    const isPlayingVideo = this.isPlayingVideo;
    return !isShowLoadingIndicator && !isPlayingVideo;
  }
  public get showPreviewContainer(): boolean {
    return this.previewValue && this.previewValue.length > 0;
  }
  //todo: remove in V2
  get showRemoveButtonCore(): boolean {
    const showLoadingIndicator = this.showLoadingIndicator;
    const isReadOnly = this.isReadOnly;
    const isEmpty = this.isEmpty();
    return !isReadOnly && !isEmpty && !showLoadingIndicator && !this.isDefaultV2Theme;
  }
  get showRemoveButton(): boolean {
    return this.showRemoveButtonCore && this.cssClasses.removeButton;
  }
  get showRemoveButtonBottom(): boolean {
    const cssClasses = new CssClassBuilder().append(this.cssClasses.removeButtonBottom).append(this.cssClasses.contextButton).toString();
    return this.showRemoveButtonCore && cssClasses as any;
  }
  //
  defaultImage(data: any) {
    return !this.canPreviewImage(data) && !!this.cssClasses.defaultImage;
  }

  /**
   * Removes a file with a specified name.
   */
  public removeFile(name: string) {
    this.removeFileByContent(this.value.filter((f: any) => f.name === name)[0]);
  }
  protected removeFileByContent(content: any) {
    if (!this.survey) return;
    this.survey.clearFiles(
      this,
      this.name,
      this.value,
      content.name,
      (status, data) => {
        if (status === "success") {
          var oldValue = this.value;
          if (Array.isArray(oldValue)) {
            this.value = oldValue.filter((f) => !Helpers.isTwoValueEquals(f, content, true, false, false));
          } else {
            this.value = undefined;
          }
        }
      }
    );
  }

  protected setValueFromResult(arg: any) {
    this.value = (this.value || []).concat(
      arg.map((r: any) => {
        return {
          name: r.file.name,
          type: r.file.type,
          content: r.content,
        };
      })
    );
  }
  /**
   * Loads multiple files into the question.
   * @param files An array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects.
   */
  public loadFiles(files: File[]) {
    if (!this.survey) {
      return;
    }
    this.errors = [];
    if (!this.allFilesOk(files)) {
      return;
    }

    var loadFilesProc = () => {
      this.stateChanged("loading");
      var content = <Array<any>>[];
      if (this.storeDataAsText) {
        files.forEach((file) => {
          let fileReader = new FileReader();
          fileReader.onload = (e) => {
            content = content.concat([
              { name: file.name, type: file.type, content: fileReader.result },
            ]);
            if (content.length === files.length) {
              this.value = (this.value || []).concat(content);
            }
          };
          fileReader.readAsDataURL(file);
        });
      } else {
        this.uploadFiles(files);
      }
    };
    if (this.allowMultiple) {
      loadFilesProc();
    } else {
      this.clear(loadFilesProc);
    }
  }
  private cameraValue: Camera;

  protected get camera(): Camera {
    if (!this.cameraValue) {
      this.cameraValue = new Camera();
    }
    return this.cameraValue;
  }
  public canPreviewImage(fileItem: any): boolean {
    return this.allowImagesPreview && !!fileItem && this.isFileImage(fileItem);
  }
  protected loadPreview(newValue: any): void {
    this.previewValue.splice(0, this.previewValue.length);
    if (!this.showPreview || !newValue) return;
    var newValues = Array.isArray(newValue)
      ? newValue
      : !!newValue
        ? [newValue]
        : [];

    if (this.storeDataAsText) {
      newValues.forEach((value) => {
        var content = value.content || value;
        this.previewValue.push(
          {
            name: value.name,
            type: value.type,
            content: content,
          },
        );
      });
    } else {
      if (!!this._previewLoader) {
        this._previewLoader.dispose();
      }
      this.isFileLoading = true;
      this._previewLoader = new FileLoader(this, (status, loaded) => {
        if (status === "loaded") {
          loaded.forEach((val) => {
            this.previewValue.push(val);
          });
          this.previewValueChanged();
        }
        this.isFileLoading = false;
        this._previewLoader.dispose();
        this._previewLoader = undefined;
      });
      this._previewLoader.load(newValues);
    }
    this.previewValueChanged();
  }
  private isFileLoadingValue: boolean;
  protected get isFileLoading(): boolean { return this.isFileLoadingValue; }
  protected set isFileLoading(val: boolean) {
    this.isFileLoadingValue = val;
    this.updateIsReady();
  }
  protected getIsQuestionReady(): boolean {
    return super.getIsQuestionReady() && !this.isFileLoading;
  }
  private allFilesOk(files: File[]): boolean {
    var errorLength = this.errors ? this.errors.length : 0;
    (files || []).forEach((file) => {
      if (this.maxSize > 0 && file.size > this.maxSize) {
        this.errors.push(new ExceedSizeError(this.maxSize, this));
      }
    });
    return errorLength === this.errors.length;
  }
  private isFileImage(file: {
    content: string,
    name?: string,
    type?: string,
  }): boolean {
    if (!file || !file.content || !file.content.substring) return false;
    const imagePrefix = "data:image";
    var subStr = file.content && file.content.substring(0, imagePrefix.length);
    subStr = subStr && subStr.toLowerCase();
    var result =
      subStr === imagePrefix ||
      (!!file.type && file.type.toLowerCase().indexOf("image/") === 0);
    return result;
  }
  public getPlainData(
    options: IPlainDataOptions = {
      includeEmpty: true,
    }
  ): IQuestionPlainData {
    var questionPlainData = super.getPlainData(options);
    if (!!questionPlainData && !this.isEmpty()) {
      questionPlainData.isNode = false;
      var values = Array.isArray(this.value) ? this.value : [this.value];
      questionPlainData.data = values.map((dataValue, index) => {
        return {
          name: index,
          title: "File",
          value: (dataValue.content && dataValue.content) || dataValue,
          displayValue: (dataValue.name && dataValue.name) || dataValue,
          getString: (val: any) =>
            typeof val === "object" ? JSON.stringify(val) : val,
          isNode: false,
        };
      });
    }
    return questionPlainData;
  }
  public getImageWrapperCss(data: any): string {
    return new CssClassBuilder().append(this.cssClasses.imageWrapper).append(this.cssClasses.imageWrapperDefaultImage, this.defaultImage(data)).toString();
  }
  protected getActionsContainerCss(css: any): string {
    return new CssClassBuilder()
      .append(css.actionsContainer)
      .append(css.actionsContainerAnswered, this.isAnswered)
      .toString();
  }
  public getRemoveButtonCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.removeFileButton)
      .append(this.cssClasses.contextButton)
      .toString();
  }
  public getChooseFileCss(): string {
    const isAnswered = this.isAnswered;
    return new CssClassBuilder()
      .append(this.cssClasses.chooseFile)
      .append(this.cssClasses.controlDisabled, this.isReadOnly)
      .append(this.cssClasses.chooseFileAsText, !isAnswered)
      .append(this.cssClasses.chooseFileAsTextDisabled, !isAnswered && this.isInputReadOnly)
      .append(this.cssClasses.contextButton, isAnswered)
      .append(this.cssClasses.chooseFileAsIcon, isAnswered)
      .toString();
  }
  public getReadOnlyFileCss(): string {
    return new CssClassBuilder()
      .append("form-control")
      .append(this.cssClasses.placeholderInput)
      .toString();
  }
  public get fileRootCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootDisabled, this.isDisabledStyle)
      .append(this.cssClasses.rootReadOnly, this.isReadOnlyStyle)
      .append(this.cssClasses.rootPreview, this.isPreviewStyle)
      .append(this.cssClasses.rootDragging, this.isDragging)
      .append(this.cssClasses.rootAnswered, this.isAnswered)
      .append(this.cssClasses.single, !this.allowMultiple)
      .append(this.cssClasses.singleImage, !this.allowMultiple && this.isAnswered && this.canPreviewImage(this.value[0]))
      .append(this.cssClasses.mobile, this.isMobile)
      .toString();
  }
  public getFileDecoratorCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.fileDecorator)
      .append(this.cssClasses.onError, this.hasCssError())
      .append(this.cssClasses.fileDecoratorDrag, this.isDragging)
      .toString();
  }

  private onChange(src: any) {
    if (!DomWindowHelper.isFileReaderAvailable()) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    let allowCount = this.allowMultiple ? src.files.length : 1;
    for (let i = 0; i < allowCount; i++) {
      files.push(src.files[i]);
    }
    src.value = "";
    this.loadFiles(files);
  }

  protected onChangeQuestionValue(newValue: any): void {
    super.onChangeQuestionValue(newValue);
    this.stateChanged(this.isEmpty() ? "empty" : "loaded");
    if (!this.isLoadingFromJson) {
      this.loadPreview(newValue);
    }
  }
  protected calcCssClasses(css: any): any {
    const classes = super.calcCssClasses(css);
    this.actionsContainer.cssClasses = css.actionBar;
    this.actionsContainer.cssClasses.itemWithTitle = this.actionsContainer.cssClasses.item;
    this.actionsContainer.cssClasses.item = "";
    this.actionsContainer.cssClasses.itemAsIcon = classes.contextButton;
    this.actionsContainer.containerCss = classes.actionsContainer;
    return classes;
  }
  //todo remove in v2
  public updateElementCss(reNew?: boolean): void {
    super.updateElementCss(reNew);
    this.updateCurrentMode();
  }
  public onSurveyLoad(): void {
    super.onSurveyLoad();
    this.updateCurrentMode();
    this.updateActionsVisibility();
    this.loadPreview(this.value);
  }
  protected needResponsiveness(): boolean {
    return this.supportResponsiveness() && this.isDefaultV2Theme;
  }
  protected supportResponsiveness(): boolean {
    return true;
  }
  protected getObservedElementSelector(): string {
    return classesToSelector(this.cssClasses.dragArea);
  }
  private getFileListSelector(): string {
    return classesToSelector(this.cssClasses.fileList);
  }
  private calcAvailableItemsCount = (availableWidth: number, itemWidth: number, gap: number): number => {
    let itemsCount = Math.floor(availableWidth / (itemWidth + gap));
    if ((itemsCount + 1) * (itemWidth + gap) - gap <= availableWidth) itemsCount++;
    return itemsCount;
  };
  private calculatedGapBetweenItems: number;
  private calculatedItemWidth: number;
  private _width: number;
  public triggerResponsiveness(hard?: boolean): void {
    if (hard) {
      this.calculatedGapBetweenItems = undefined;
      this.calculatedItemWidth = undefined;
    }
    super.triggerResponsiveness();
  }
  protected processResponsiveness(_: number, availableWidth: number): boolean {
    this._width = availableWidth;
    if (this.rootElement) {
      if ((!this.calculatedGapBetweenItems || !this.calculatedItemWidth) && this.allowMultiple) {
        const fileListSelector = this.getFileListSelector();
        const fileListElement = fileListSelector ? this.rootElement.querySelector(this.getFileListSelector()) : undefined;
        if (fileListElement) {
          this.calculatedGapBetweenItems = Math.ceil(Number.parseFloat(DomDocumentHelper.getComputedStyle(fileListElement).gap));
          const firstVisibleItem = Array.from(fileListElement.children).filter((_, index) => this.isPreviewVisible(index))[0];
          if (firstVisibleItem) {
            this.calculatedItemWidth = Math.ceil(Number.parseFloat(DomDocumentHelper.getComputedStyle(firstVisibleItem).width));
          }
        }
      }
    }
    if (this.calculatedGapBetweenItems && this.calculatedItemWidth) {
      this.pageSize = this.calcAvailableItemsCount(availableWidth, this.calculatedItemWidth, this.calculatedGapBetweenItems);
      return true;
    }
    return false;
  }
  //#region
  // web-based methods
  private rootElement: HTMLElement;
  private canDragDrop(): boolean { return !this.isInputReadOnly && this.currentMode !== "camera" && !this.isPlayingVideo; }
  afterRender(el: HTMLElement): void {
    this.rootElement = el;
    super.afterRender(el);
  }
  private dragCounter: number = 0;
  onDragEnter = (event: any) => {
    if (this.canDragDrop()) {
      event.preventDefault();
      this.isDragging = true;
      this.dragCounter++;
    }
  }
  onDragOver = (event: any) => {
    if (!this.canDragDrop()) {
      event.returnValue = false;
      return false;
    }
    event.dataTransfer.dropEffect = "copy";
    event.preventDefault();
  }
  onDrop = (event: any) => {
    if (this.canDragDrop()) {
      this.isDragging = false;
      this.dragCounter = 0;
      event.preventDefault();
      let src = event.dataTransfer;
      this.onChange(src);
    }
  }
  onDragLeave = (event: any) => {
    if (this.canDragDrop()) {
      this.dragCounter--;
      if (this.dragCounter === 0) {
        this.isDragging = false;
      }
    }
  }
  doChange = (event: any) => {
    var src = event.target || event.srcElement;
    this.onChange(src);
  }
  doClean = () => {
    if (this.needConfirmRemoveFile) {
      confirmActionAsync(this.confirmRemoveAllMessage, () => { this.clearFilesCore(); }, undefined, this.getLocale(), this.survey.rootElement);
      return;
    }
    this.clearFilesCore();
  }
  private clearFilesCore(): void {
    if (this.rootElement) {
      const input = this.rootElement.querySelectorAll("input")[0];
      if (input) {
        input.value = "";
      }
    }
    this.clear();
  }
  doRemoveFile(data: any) {
    if (this.needConfirmRemoveFile) {
      confirmActionAsync(this.getConfirmRemoveMessage(data.name), () => { this.removeFileCore(data); }, undefined, this.getLocale(), this.survey.rootElement);
      return;
    }
    this.removeFileCore(data);
  }
  private removeFileCore(data: any): void {
    const previewIndex = this.previewValue.indexOf(data);
    this.removeFileByContent(previewIndex === -1 ? data : this.value[previewIndex]);
  }
  doDownloadFile = (event: any, data: any) => {
    if (detectIEOrEdge()) {
      event.preventDefault();
      loadFileFromBase64(data.content, data.name);
    }
  }
  //#endregion
  public dispose(): void {
    this.cameraValue = undefined;
    this.closeVideoStream();
    super.dispose();
  }
}
Serializer.addClass(
  "file",
  [
    { name: "showCommentArea:switch", layout: "row", visible: true, category: "general" },
    { name: "showPreview:boolean", default: true },
    "allowMultiple:boolean",
    {
      name: "allowImagesPreview:boolean",
      default: true,
      dependsOn: "showPreview",
      visibleIf: (obj: any) => {
        return !!obj.showPreview;
      },
    },
    "imageHeight",
    "imageWidth",
    "acceptedTypes",
    { name: "storeDataAsText:boolean", default: true },
    { name: "waitForUpload:boolean", default: false },
    { name: "maxSize:number", default: 0 },
    { name: "defaultValue", visible: false },
    { name: "correctAnswer", visible: false },
    { name: "validators", visible: false },
    { name: "needConfirmRemoveFile:boolean" },
    { name: "sourceType", choices: ["file", "camera", "file-camera"], default: "file", category: "general", visible: true, visibleIf: () => settings.supportCreatorV2 },
    { name: "fileOrPhotoPlaceholder:text", serializationProperty: "locFileOrPhotoPlaceholder", category: "general", visibleIf: () => settings.supportCreatorV2 },
    { name: "photoPlaceholder:text", serializationProperty: "locPhotoPlaceholder", category: "general", visibleIf: () => settings.supportCreatorV2 },
    { name: "filePlaceholder:text", serializationProperty: "locFilePlaceholder", category: "general", visibleIf: () => settings.supportCreatorV2 },
    { name: "allowCameraAccess:switch", category: "general", visible: false },
  ],
  function () {
    return new QuestionFileModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("file", (name) => {
  return new QuestionFileModel(name);
});

export class FileLoader {
  constructor(private fileQuestion: QuestionFileModel, private callback: (status: string, files: any[]) => void) {
  }
  loaded: any[] = [];
  load(files: Array<any>): void {
    let downloadedCount = 0;
    this.loaded = new Array(files.length);
    files.forEach((value, index) => {
      if (this.fileQuestion.survey) {
        this.fileQuestion.survey.downloadFile(this.fileQuestion, this.fileQuestion.name, value, (status, data) => {
          if (!this.fileQuestion || !this.callback) {
            return;
          }
          if (status === "success") {
            this.loaded[index] = {
              content: data,
              name: value.name,
              type: value.type,
            };
            downloadedCount++;
            if (downloadedCount === files.length) {
              this.callback("loaded", this.loaded);
            }
          } else {
            this.callback("error", this.loaded);
          }
        });
      }
    });
  }
  public dispose(): void {
    this.fileQuestion = undefined;
    this.callback = undefined;
  }
}