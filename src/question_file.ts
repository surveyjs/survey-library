import { Question } from "./question";
import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { EventBase } from "./base";
import { UploadingFileError, ExceedSizeError } from "./error";
import { surveyLocalization } from "./surveyStrings";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { confirmAction, detectIEOrEdge, loadFileFromBase64 } from "./utils/utils";

/**
 * A Model for a file question
 */
export class QuestionFileModel extends Question {
  private isUploading: boolean = false;
  @property() isDragging: boolean = false;
  /**
   * The event is fired after question state has been changed.
   * <br/> sender the question object that fires the event
   * <br/> options.state new question state value.
   */
  public onStateChanged: EventBase<QuestionFileModel> = this.addEvent<
    QuestionFileModel
  >();
  public previewValue: any[] = [];
  @property({ defaultValue: "empty" }) currentState: string;
  constructor(name: string) {
    super(name);
  }
  public getType(): string {
    return "file";
  }
  public clearOnDeletingContainer() {
    if (!this.survey) return;
    this.survey.clearFiles(this, this.name, this.value, null, () => {});
  }
  /**
   * Set it to true, to show the preview for the image files.
   */
  public get showPreview() {
    return this.getPropertyValue("showPreview");
  }
  public set showPreview(val: boolean) {
    this.setPropertyValue("showPreview", val);
  }
  /**
   * Set it to true, to allow select multiple files.
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
   * Accepted file types. Passed to the 'accept' attribute of the file input tag. See https://www.w3schools.com/tags/att_input_accept.asp for more details.
   */
  public get acceptedTypes(): string {
    return this.getPropertyValue("acceptedTypes");
  }
  public set acceptedTypes(val: string) {
    this.setPropertyValue("acceptedTypes", val);
  }
  /**
   * Set it to false if you do not want to serialize file content as text in the survey.data.
   * In this case, you have to write the code onUploadFiles event to store the file content.
   * @see SurveyModel.onUploadFiles
   */
  public get storeDataAsText(): boolean {
    return this.getPropertyValue("storeDataAsText");
  }
  public set storeDataAsText(val: boolean) {
    this.setPropertyValue("storeDataAsText", val);
  }
  /**
   * Set it to true if you want to wait until files will be uploaded to your server.
   */
  public get waitForUpload(): boolean {
    return this.getPropertyValue("waitForUpload");
  }
  public set waitForUpload(val: boolean) {
    this.setPropertyValue("waitForUpload", val);
  }
  /**
   * Set it to false if you want to disable images preview.
   */
  public get allowImagesPreview(): boolean {
    return this.getPropertyValue("allowImagesPreview");
  }
  public set allowImagesPreview(val: boolean) {
    this.setPropertyValue("allowImagesPreview", val);
  }
  /**
   * Use this property to setup the maximum allowed file size.
   */
  public get maxSize(): number {
    return this.getPropertyValue("maxSize");
  }
  public set maxSize(val: number) {
    this.setPropertyValue("maxSize", val);
  }
  /**
   * Use this property to setup confirmation to remove file.
   */
  public get needConfirmRemoveFile(): boolean {
    return this.getPropertyValue("needConfirmRemoveFile");
  }
  public set needConfirmRemoveFile(val: boolean) {
    this.setPropertyValue("needConfirmRemoveFile", val);
  }
  /**
   * The remove file confirmation message.
   */
  public getConfirmRemoveMessage(fileName: string): string {
    return (<any>this.confirmRemoveMessage).format(fileName);
  }
  /**
   * The remove file confirmation message template.
   */
  @property({ localizable: { defaultStr: "confirmRemoveFile" } }) confirmRemoveMessage: string;
  /**
   * The remove all files confirmation message.
   */
  @property({ localizable: { defaultStr: "confirmRemoveAllFiles" } }) confirmRemoveAllMessage: string;
  /**
   * The no file chosen caption for modern theme.
   */
  @property({ localizable: { defaultStr: "noFileChosen" } }) noFileChosenCaption: string;
  /**
   * The choose files button caption for modern theme.
   */
  @property({ localizable: { defaultStr: "chooseFileCaption" } }) chooseButtonCaption: string;
  /**
   * The clean files button caption.
   */
  @property({ localizable: { defaultStr: "cleanCaption" } }) cleanButtonCaption: string;
  /**
   * The remove file button caption.
   */
  @property({ localizable: { defaultStr: "removeFileCaption" } }) removeFileCaption: string;
  /**
   * The loading file input title.
   */
  @property({ localizable: { defaultStr: "loadingFile" } }) loadingFileTitle: string;
  /**
  * The choose file input title.
  */
  @property({ localizable: { defaultStr: "chooseFile" } }) chooseFileTitle: string;
  @property({ localizable: { defaultStr: "fileDragAreaPlaceholder" } }) dragAreaPlaceholder: string;
  /**
   * The input title value.
   */
  get inputTitle(): string {
    if (this.isUploading) return this.loadingFileTitle;
    if (this.isEmpty()) return this.chooseFileTitle;
    return " ";
  }
  /**
   * Clear value programmatically.
   */
  public clear(doneCallback?: () => void) {
    if (!this.survey) return;
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
        }
      }
    );
  }
  /**
   * Remove file item programmatically.
   */
  public removeFile(content: { name: string }) {
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
            this.value = oldValue.filter((f) => f.name !== content.name);
          } else {
            this.value = undefined;
          }
        }
      }
    );
  }
  /**
   * Load multiple files programmatically.
   * @param files
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
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true) {
    super.setQuestionValue(newValue, updateIsAnswered);
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
      newValues.forEach((value) => {
        var content = value.content || value;
        if (this.survey) {
          this.survey.downloadFile(this.name, value, (status, data) => {
            if (status === "success") {
              this.previewValue = this.previewValue.concat([
                {
                  content: data,
                  name: value.name,
                  type: value.type,
                },
              ]);
              if (this.previewValue.length === newValues.length) {
                this.stateChanged("loaded");
              }
            } else {
              this.stateChanged("error");
            }
          });
        }
      });
    }
  }
  protected onCheckForErrors(
    errors: Array<SurveyError>,
    isOnValueChanged: boolean
  ) {
    super.onCheckForErrors(errors, isOnValueChanged);
    if (this.isUploading && this.waitForUpload) {
      errors.push(
        new UploadingFileError(
          surveyLocalization.getString("uploadingFile"),
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
    var subStr = file.content && file.content.substr(0, imagePrefix.length);
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
    return new CssClassBuilder()
      .append(this.cssClasses.chooseFile)
      .append(this.cssClasses.controlDisabled, this.isReadOnly)
      .append(this.cssClasses.chooseFileAsText, !this.isAnswered)
      .append(this.cssClasses.chooseFileAsIcon, this.isAnswered)
      .toString();
  }
  public getReadOnlyFileCss(): string {
    return new CssClassBuilder()
      .append("form-control")
      .append(this.cssClasses.placeholderInput)
      .toString();
  }
  public getFileRootCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.single, !this.allowMultiple)
      .append(this.cssClasses.singleImage, !this.allowMultiple && this.isAnswered && this.canPreviewImage(this.value[0]))
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
  onDragOver = (event: any) => {
    if (this.isInputReadOnly) {
      event.returnValue = false;
      return false;
    }
    this.isDragging = true;
    event.dataTransfer.dropEffect = "copy";
    event.preventDefault();
  }
  onDrop = (event: any) => {
    if (!this.isInputReadOnly) {
      this.isDragging = false;
      event.preventDefault();
      let src = event.dataTransfer;
      this.onChange(src);
    }
  }
  onDragLeave = (event: any) => {
    if (!this.isInputReadOnly) {
      this.isDragging = false;
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
    src.parentElement.querySelectorAll("input")[0].value = "";
    this.clear();
  }
  doRemoveFile(data: any) {
    if (this.needConfirmRemoveFile) {
      var isConfirmed = confirmAction(
        this.getConfirmRemoveMessage(data.name)
      );
      if (!isConfirmed) return;
    }
    this.removeFile(data);
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
    { name: "hasComment:switch", layout: "row" },
    {
      name: "commentText",
      dependsOn: "hasComment",
      visibleIf: function(obj: any) {
        return obj.hasComment;
      },
      serializationProperty: "locCommentText",
      layout: "row",
    },
    {
      name: "commentPlaceHolder",
      serializationProperty: "locCommentPlaceHolder",
      dependsOn: "hasComment",
      visibleIf: function(obj: any) {
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
  function() {
    return new QuestionFileModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("file", (name) => {
  return new QuestionFileModel(name);
});
