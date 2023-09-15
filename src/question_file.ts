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

/**
 * A class that describes the File Upload question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))
 */
export class QuestionFileModel extends Question {
  @property() public isUploading: boolean = false;
  @property() isDragging: boolean = false;
  /**
   * An event that is raised after the upload state has changed.
   *
   * Parameters:
   *
   * - `sender`: `SurveyModel`\
   * A survey instance that raised the event.
   * - `options.state`: `String`\
   * The current upload state: `"empty"`, `"loading"`, `"loaded"`, or `"error"`.
   */
  public onUploadStateChanged: EventBase<QuestionFileModel> = this.addEvent<
    QuestionFileModel
  >();
  public onStateChanged: EventBase<QuestionFileModel> = this.addEvent<
    QuestionFileModel
  >();
  @propertyArray({}) public previewValue: any[];
  @property({ defaultValue: "empty" }) currentState: string;

  @property({ defaultValue: 0 }) indexToShow: number;
  @property({ defaultValue: 1, onSet: (_, target) => {
    target.updateFileNavigator();
  } }) pageSize: number;
  @property({ defaultValue: false }) containsMultiplyFiles: boolean;
  /**
   * Specifies whether users can capture and upload a photo. Applies only to mobile devices.
   *
   * Default value: `false`
   */
  @property() allowCameraAccess: boolean;
  @property({ onSet: (val: string, obj: QuestionFileModel) => {
    if(!obj.isLoadingFromJson) {
      obj.updateCurrentMode();
    }
  } }) mode: string;

  public fileNavigator: ActionContainer = new ActionContainer();
  protected prevFileAction: Action;
  protected nextFileAction: Action;
  protected fileIndexAction: Action;

  get fileNavigatorVisible(): boolean {
    const isUploading = this.isUploading;
    const containsMultipleFiles = this.containsMultiplyFiles;
    const needToShowFileNavigator = this.pageSize < this.previewValue.length;
    return !isUploading && containsMultipleFiles && needToShowFileNavigator && this.isDefaultV2Theme;
  }
  private get pagesCount() {
    return Math.ceil(this.previewValue.length / this.pageSize);
  }

  constructor(name: string) {
    super(name);
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
    this.fileNavigator.actions = [this.prevFileAction, this.fileIndexAction, this.nextFileAction];
  }
  public get videoId(): string { return this.id + "_video"; }
  public get hasVideoUI(): boolean { return this.currentMode !== "file"; }
  public get hasFileUI(): boolean { return this.currentMode !== "camera"; }
  private videoStream: MediaStream;
  public startVideo(): void {
    if(this.currentMode === "file" || this.isDesignMode || this.isPlayingVideo) return;
    this.setIsPlayingVideo(true);
    this.startVideoInCamera();
  }
  private startVideoInCamera(): void {
    new Camera().startVideo(this.videoId, (stream: MediaStream) => {
      this.videoStream = stream;
      if(!stream) {
        this.stopVideo();
      }
    }, this.imageWidth, this.imageHeight);
  }
  public stopVideo(): void {
    this.setIsPlayingVideo(false);
    this.closeVideoStream();
  }
  public snapPicture(): void {
    if(!this.isPlayingVideo) return;
    const blobCallback = (blob: Blob | null): void => {
      if(blob) {
        const file = new File([blob], "snap_picture.png", { type: "image/png" });
        this.loadFiles([file]);
      }
    };
    new Camera().snap(this.videoId, blobCallback);
    this.stopVideo();
  }
  public canFlipCamera(): boolean {
    return this.isPlayingVideo && new Camera().canFlip();
  }
  public flipCamera(): void {
    if(!this.canFlipCamera()) return;
    this.closeVideoStream();
    new Camera().flip();
    this.startVideoInCamera();
  }
  private closeVideoStream(): void {
    if(!!this.videoStream) {
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
    if(this.previewValue.length !== this.prevPreviewLength) {
      if(this.previewValue.length > 0) {
        if(this.prevPreviewLength > this.previewValue.length) {
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
    if(this.previewValue.length > 0 && !this.calculatedGapBetweenItems && !this.calculatedItemWidth) {
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
  public clearValue(): void {
    this.clearOnDeletingContainer();
    super.clearValue();
  }
  public clearOnDeletingContainer() {
    if (!this.survey) return;
    this.survey.clearFiles(this, this.name, this.value, null, () => { });
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
   * Specifies whether to store file content as text in `SurveyModel`'s [`data`](https://surveyjs.io/form-library/documentation/surveymodel#data) property.
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
  @property({ localizable: { defaultStr: "replaceFileCaption" } }) replaceButtonCaption: string;
  @property({ localizable: { defaultStr: "clearCaption" } }) clearButtonCaption: string;
  @property({ localizable: { defaultStr: "removeFileCaption" } }) removeFileCaption: string;
  @property({ localizable: { defaultStr: "loadingFile" } }) loadingFileTitle: string;
  @property({ localizable: { defaultStr: "chooseFile" } }) chooseFileTitle: string;
  @property({ localizable: { defaultStr: "fileDragAreaPlaceholder" } }) dragAreaPlaceholder: string;

  @property() renderedPlaceholderValue: string;
  public get renderedPlaceholder(): string {
    if(this.renderedPlaceholderValue === undefined) {
      this.renderedPlaceholderValue = <string><unknown>(new ComputedUpdater<string>(() => {
        const dragAreaText = this.dragAreaPlaceholder;
        const readOnlyText = this.noFileChosenCaption;
        return this.isReadOnly ? readOnlyText : dragAreaText;
      }));
    }
    return this.renderedPlaceholderValue;
  }
  public get currentMode(): string {
    return this.getPropertyValue("currentMode", this.mode);
  }
  public get isPlayingVideo(): boolean {
    return this.getPropertyValue("isPlayingVideo", false);
  }
  private setIsPlayingVideo(show: boolean): void {
    this.setPropertyValue("isPlayingVideo", show);
  }
  private updateCurrentMode(): void {
    if(!this.isDesignMode) {
      if(this.mode !== "file") {
        new Camera().hasCamera((res: boolean) => {
          this.setPropertyValue("currentMode", res ? this.mode : "file");
        });
      } else {
        this.setPropertyValue("currentMode", this.mode);
      }
    }
  }
  get inputTitle(): string {
    if (this.isUploading) return this.loadingFileTitle;
    if (this.isEmpty()) return this.chooseFileTitle;
    return " ";
  }

  public get chooseButtonText () {
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
  public get showChooseButton(): boolean {
    return !this.showLoadingIndicator;
  }
  public get showLoadingIndicator(): boolean {
    return this.isUploading && this.isDefaultV2Theme;
  }
  public get allowShowPreview(): boolean {
    return this.previewValue && this.previewValue.length > 0 && !this.showLoadingIndicator;
  }
  get showRemoveButtonCore(): boolean {
    const showLoadingIndicator = this.showLoadingIndicator;
    const isReadOnly = this.isReadOnly;
    const isEmpty = this.isEmpty();
    return !isReadOnly && !isEmpty && !showLoadingIndicator;
  }
  get showRemoveButton(): boolean {
    return this.showRemoveButtonCore && this.cssClasses.removeButton;
  }
  get showRemoveButtonBottom(): boolean {
    return this.showRemoveButtonCore && this.cssClasses.removeButtonBottom;
  }
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
        if (this.survey) {
          this.survey.uploadFiles(this, this.name, files, (status, data) => {
            if (status === "error") {
              this.stateChanged("error");
            }
            if (status === "success") {
              this.value = (this.value || []).concat(
                data.map((r: any) => {
                  return {
                    name: r.file.name,
                    type: r.file.type,
                    content: r.content,
                  };
                })
              );
            }
          });
        }
      }
    };
    if (this.allowMultiple) {
      loadFilesProc();
    } else {
      this.clear(loadFilesProc);
    }
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
      this.isReadyValue = false;
      this._previewLoader = new FileLoader(this, (status, loaded) => {
        if (status === "loaded") {
          loaded.forEach((val) => {
            this.previewValue.push(val);
          });
          this.previewValueChanged();
        }
        this.isReady = true;
        this._previewLoader.dispose();
        this._previewLoader = undefined;
      });
      this._previewLoader.load(newValues);
    }
    this.previewValueChanged();
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
  protected stateChanged(state: string) {
    if(this.currentState == state) {
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
  public getChooseFileCss(): string {
    const isAnswered = this.isAnswered;
    return new CssClassBuilder()
      .append(this.cssClasses.chooseFile)
      .append(this.cssClasses.controlDisabled, this.isReadOnly)
      .append(this.cssClasses.chooseFileAsText, !isAnswered)
      .append(this.cssClasses.chooseFileAsTextDisabled, !isAnswered && this.isInputReadOnly)
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
      .append(this.cssClasses.rootDragging, this.isDragging)
      .append(this.cssClasses.single, !this.allowMultiple)
      .append(this.cssClasses.singleImage, !this.allowMultiple && this.isAnswered && this.canPreviewImage(this.value[0]))
      .append(this.cssClasses.mobile, this.isMobile)
      .toString();
  }
  public getFileDecoratorCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.fileDecorator)
      .append(this.cssClasses.onError, this.errors.length > 0)
      .append(this.cssClasses.fileDecoratorDrag, this.isDragging)
      .toString();
  }

  private onChange(src: any) {
    if (!(<any>window)["FileReader"]) return;
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
    if(!this.isLoadingFromJson) {
      this.loadPreview(newValue);
    }
  }

  endLoadingFromJson(): void {
    super.endLoadingFromJson();
    this.updateCurrentMode();
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
    if(hard) {
      this.calculatedGapBetweenItems = undefined;
      this.calculatedItemWidth = undefined;
    }
    super.triggerResponsiveness();
  }
  protected processResponsiveness(_: number, availableWidth: number): boolean {
    this._width = availableWidth;
    if(this.rootElement) {
      if((!this.calculatedGapBetweenItems || !this.calculatedItemWidth) && this.allowMultiple) {
        const fileListSelector = this.getFileListSelector();
        const fileListElement = fileListSelector ? this.rootElement.querySelector(this.getFileListSelector()) : undefined;
        if(fileListElement) {
          this.calculatedGapBetweenItems = Math.ceil(Number.parseFloat(window.getComputedStyle(fileListElement).gap));
          const firstVisibleItem = Array.from(fileListElement.children).filter((_, index) => this.isPreviewVisible(index))[0];
          if(firstVisibleItem) {
            this.calculatedItemWidth = Math.ceil(Number.parseFloat(window.getComputedStyle(firstVisibleItem).width));
          }
        }
      }
    }
    if(this.calculatedGapBetweenItems && this.calculatedItemWidth) {
      this.pageSize = this.calcAvailableItemsCount(availableWidth, this.calculatedItemWidth, this.calculatedGapBetweenItems);
      return true;
    }
    return false;
  }
  //#region
  // web-based methods
  private rootElement: HTMLElement;
  private canDragDrop(): boolean { return !this.isInputReadOnly && this.currentState !== "camera" && !this.isPlayingVideo; }
  afterRender(el: HTMLElement): void {
    this.rootElement = el;
    super.afterRender(el);
  }
  private dragCounter: number = 0;
  onDragEnter = (event: any) => {
    if (this.canDragDrop()) {
      event.preventDefault();
      this.isDragging = true;
      this.dragCounter ++;
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
      this.dragCounter --;
      if(this.dragCounter === 0) {
        this.isDragging = false;
      }
    }
  }
  doChange = (event: any) => {
    var src = event.target || event.srcElement;
    this.onChange(src);
  }
  doClean = (event: any) => {
    if (this.needConfirmRemoveFile) {
      confirmActionAsync(this.confirmRemoveAllMessage, () => { this.clearFilesCore(); });
      return;
    }
    this.clearFilesCore();
  }
  private clearFilesCore(): void {
    if(this.rootElement) {
      this.rootElement.querySelectorAll("input")[0].value = "";
    }
    this.clear();
  }
  doRemoveFile(data: any) {
    if (this.needConfirmRemoveFile) {
      confirmActionAsync(this.getConfirmRemoveMessage(data.name), () => { this.removeFileCore(data); });
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
    { name: "allowImagesPreview:boolean", default: true },
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
    { name: "allowCameraAccess:switch", category: "general" },
    { name: "mode", choices: ["file", "camera", "both"], default: "file", category: "general", visible: false }
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
            downloadedCount ++;
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