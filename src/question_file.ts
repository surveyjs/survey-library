import { Question } from "./question";
import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { EventBase } from "./base";
import { UploadingFileError, ExceedSizeError } from "./error";
import { surveyLocalization } from "./surveyStrings";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { confirmAction, detectIEOrEdge, loadFileFromBase64 } from "./utils/utils";
import { ActionContainer } from "./actions/container";
import { Action } from "./actions/action";
import { Helpers } from "./helpers";

/**
 * A class that describes the File question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-file/ (linkStyle))
 */
export class QuestionFileModel extends Question {
  private isUploading: boolean = false;
  @property() isDragging: boolean = false;
  /**
   * An event that is raised after the upload state has changed.
   *
   * Parameters:
   *
   * - `sender` - A question instance that raised the event.
   * - `options.state` - Current upload state: `"empty"`, `"loading"`, `"loaded"`, or `"error"`.
   */
  public onStateChanged: EventBase<QuestionFileModel> = this.addEvent<
    QuestionFileModel
  >();
  @property() public previewValue: any[] = [];
  @property({ defaultValue: "empty" }) currentState: string;

  @property({ defaultValue: 0 }) indexToShow: number;
  @property({ defaultValue: false }) containsMultiplyFiles: boolean;

  public mobileFileNavigator: ActionContainer = new ActionContainer();
  protected prevFileAction: Action;
  protected nextFileAction: Action;
  protected fileIndexAction: Action;

  get mobileFileNavigatorVisible(): boolean {
    return this.isMobile && this.containsMultiplyFiles;
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
        this.indexToShow = this.previewValue.length && ((this.indexToShow - 1 + this.previewValue.length) % this.previewValue.length) || 0;
        this.fileIndexAction.title = this.getFileIndexCaption();
      }
    });
    this.nextFileAction = new Action({
      id: "nextPage",
      iconSize: 16,
      action: () => {
        this.indexToShow = this.previewValue.length && ((this.indexToShow + 1) % this.previewValue.length) || 0;
        this.fileIndexAction.title = this.getFileIndexCaption();
      }
    });
    this.mobileFileNavigator.actions = [this.prevFileAction, this.fileIndexAction, this.nextFileAction];
  }

  protected updateElementCssCore(cssClasses: any): void {
    super.updateElementCssCore(cssClasses);
    this.prevFileAction.iconName = this.cssClasses.leftIconId;
    this.nextFileAction.iconName = this.cssClasses.rightIconId;
    //this.mobileFileNavigator.cssClasses = this.survey.getCss().actionBar;
  }
  private getFileIndexCaption(): string {
    return this.getLocalizationFormatString("indexText", this.indexToShow + 1, this.previewValue.length);
  }

  public isPreviewVisible(index: number) {
    return !this.isMobile || index === this.indexToShow;
  }

  public getType(): string {
    return "file";
  }
  public clearOnDeletingContainer() {
    if (!this.survey) return;
    this.survey.clearFiles(this, this.name, this.value, null, () => { });
  }
  /**
   * Disable this property only to implement a custom preview.
   *
   * [View "Custom Preview" Demo](https://surveyjs.io/form-library/examples/file-custom-preview/ (linkStyle))
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
  public get allowMultiple() {
    return this.getPropertyValue("allowMultiple", false);
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
  @property({ localizable: { defaultStr: "clearCaption" } }) clearButtonCaption: string;
  @property({ localizable: { defaultStr: "removeFileCaption" } }) removeFileCaption: string;
  @property({ localizable: { defaultStr: "loadingFile" } }) loadingFileTitle: string;
  @property({ localizable: { defaultStr: "chooseFile" } }) chooseFileTitle: string;
  @property({ localizable: { defaultStr: "fileDragAreaPlaceholder" } }) dragAreaPlaceholder: string;

  get inputTitle(): string {
    if (this.isUploading) return this.loadingFileTitle;
    if (this.isEmpty()) return this.chooseFileTitle;
    return " ";
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

  get multipleRendered() {
    return this.allowMultiple ? "multiple" : undefined;
  }
  get showRemoveButton() {
    return !this.isReadOnly && !this.isEmpty() && this.cssClasses.removeButton;
  }
  get showRemoveButtonBottom() {
    return !this.isReadOnly && !this.isEmpty() && this.cssClasses.removeButtonBottom;
  }
  defaultImage(data: any) {
    return !this.canPreviewImage(data) && !!this.cssClasses.defaultImage;
  }
  get imageWidthRendered() {
    return this.imageWidth + "px";
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
            this.value = oldValue.filter((f) => !Helpers.isTwoValueEquals(f, content, true));
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

    this.stateChanged("loading");

    var loadFilesProc = () => {
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
    this.previewValue = [];
    var state =
      (!Array.isArray(newValue) && !!newValue) ||
        (Array.isArray(newValue) && newValue.length > 0)
        ? this.showPreview
          ? "loading"
          : "loaded"
        : "empty";
    this.stateChanged(state);
    if (!this.showPreview || !newValue) return;
    var newValues = Array.isArray(newValue)
      ? newValue
      : !!newValue
        ? [newValue]
        : [];

    if (this.storeDataAsText) {
      newValues.forEach((value) => {
        var content = value.content || value;
        this.previewValue = this.previewValue.concat([
          {
            name: value.name,
            type: value.type,
            content: content,
          },
        ]);
      });
      if (state === "loading") this.stateChanged("loaded");
    } else {
      if (!!this._previewLoader) {
        this._previewLoader.dispose();
      }
      this._previewLoader = new FileLoader(this, (status, loaded) => {
        if (status === "loaded") {
          this.previewValue = loaded;
        }
        this.stateChanged("loaded");
        this._previewLoader.dispose();
        this._previewLoader = undefined;
      });
      this._previewLoader.load(newValues);
    }
    this.indexToShow = this.previewValue.length > 0 ? (this.indexToShow > 0 ? this.indexToShow - 1 : 0) : 0;
    this.fileIndexAction.title = this.getFileIndexCaption();
    this.containsMultiplyFiles = this.previewValue.length > 1;
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true) {
    super.setQuestionValue(newValue, updateIsAnswered);
    this.loadPreview(newValue);
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
    if (!file) return false;
    const imagePrefix = "data:image";
    var subStr = file.content && file.content.substring(0, imagePrefix.length);
    subStr = subStr && subStr.toLowerCase();
    var result =
      subStr === imagePrefix ||
      (!!file.type && file.type.toLowerCase().indexOf("image/") === 0);
    return result;
  }
  public getPlainData(
    options: {
      includeEmpty?: boolean,
      calculations?: Array<{
        propertyName: string,
      }>,
    } = {
      includeEmpty: true,
    }
  ) {
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
  public supportComment(): boolean {
    return true;
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
  //#region
  // web-based methods
  private rootElement: HTMLElement;
  afterRender(el: HTMLElement) {
    this.rootElement = el;
    super.afterRender(el);
  }
  private dragCounter: number = 0;
  onDragEnter = (event: any) => {
    if (!this.isInputReadOnly) {
      event.preventDefault();
      this.isDragging = true;
      this.dragCounter ++;
    }
  }
  onDragOver = (event: any) => {
    if (this.isInputReadOnly) {
      event.returnValue = false;
      return false;
    }
    event.dataTransfer.dropEffect = "copy";
    event.preventDefault();
  }
  onDrop = (event: any) => {
    if (!this.isInputReadOnly) {
      this.isDragging = false;
      this.dragCounter = 0;
      event.preventDefault();
      let src = event.dataTransfer;
      this.onChange(src);
    }
  }
  onDragLeave = (event: any) => {
    if (!this.isInputReadOnly) {
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
    var src = event.currentTarget || event.srcElement;
    if (this.needConfirmRemoveFile) {
      var isConfirmed = confirmAction(this.confirmRemoveAllMessage);
      if (!isConfirmed) return;
    }
    if(this.rootElement) {
      this.rootElement.querySelectorAll("input")[0].value = "";
    }
    this.clear();
  }
  doRemoveFile(data: any) {
    if (this.needConfirmRemoveFile) {
      var isConfirmed = confirmAction(
        this.getConfirmRemoveMessage(data.name)
      );
      if (!isConfirmed) return;
    }
    this.removeFileByContent(data);
  }
  doDownloadFile = (event: any, data: any) => {
    if (detectIEOrEdge()) {
      event.preventDefault();
      loadFileFromBase64(data.content, data.name);
    }
  }
  //#endregion
}
Serializer.addClass(
  "file",
  [
    { name: "showCommentArea:switch", layout: "row", visible: true },
    {
      name: "commentText",
      dependsOn: "showCommentArea",
      visibleIf: function (obj: any) {
        return obj.hasComment;
      },
      serializationProperty: "locCommentText",
      layout: "row",
    },
    {
      name: "commentPlaceholder",
      alternativeName: "commentPlaceHolder",
      serializationProperty: "locCommentPlaceholder",
      dependsOn: "showCommentArea",
      visibleIf: function (obj: any) {
        return obj.hasComment;
      },
    },
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
    files.forEach((value) => {
      if (this.fileQuestion.survey) {
        this.fileQuestion.survey.downloadFile(this.fileQuestion, this.fileQuestion.name, value, (status, data) => {
          if (!this.fileQuestion || !this.callback) {
            return;
          }
          if (status === "success") {
            this.loaded.push({
              content: data,
              name: value.name,
              type: value.type,
            });
            if (this.loaded.length === files.length) {
              this.callback("loaded", this.loaded);
            }
          } else {
            this.callback("error", this.loaded);
          }
        });
      }
    });
  }
  dispose(): void {
    this.fileQuestion = undefined;
    this.callback = undefined;
  }
}