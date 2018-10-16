import { Question } from "./question";
import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { SurveyError, Event } from "./base";
import { CustomError, ExceedSizeError } from "./error";
import { surveyLocalization } from "./surveyStrings";

/**
 * A Model for a file question
 */
export class QuestionFileModel extends Question {
  private isUploading: boolean = false;
  /**
   * The event is fired after question state has been changed.
   * <br/> sender the question object that fires the event
   * <br/> options.state new question state value.
   */
  public onStateChanged: Event<
    (sender: QuestionFileModel, options: any) => any,
    any
  > = new Event<(sender: QuestionFileModel, options: any) => any, any>();
  public previewValue: any[] = [];
  public currentState = "empty";
  constructor(public name: string) {
    super(name);
  }
  public getType(): string {
    return "file";
  }
  /**
   * Set it to true, to show the preview for the image files.
   */
  public get showPreview() {
    return this.getPropertyValue("showPreview", true);
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
    return this.getPropertyValue("storeDataAsText", true);
  }
  public set storeDataAsText(val: boolean) {
    this.setPropertyValue("storeDataAsText", val);
  }
  /**
   * Set it to true if you want to wait until files will be uploaded to your server.
   */
  public get waitForUpload(): boolean {
    return this.getPropertyValue("waitForUpload", false);
  }
  public set waitForUpload(val: boolean) {
    this.setPropertyValue("waitForUpload", val);
  }
  /**
   * Use this property to setup the maximum allowed file size.
   */
  public get maxSize(): number {
    return this.getPropertyValue("maxSize", 0);
  }
  public set maxSize(val: number) {
    this.setPropertyValue("maxSize", val);
  }
  /**
   * The clean files value button caption.
   */
  get cleanButtonCaption(): string {
    return surveyLocalization.getString("cleanCaption");
  }
  /**
   * The remove file button caption.
   */
  get removeFileCaption(): string {
    return surveyLocalization.getString("removeFileCaption");
  }
  /**
   * The input title value.
   */
  get inputTitle(): string {
    if (this.isUploading) return surveyLocalization.getString("loadingFile");
    if (this.isEmpty()) return surveyLocalization.getString("chooseFile");
    return " ";
  }
  /**
   * Clear value programmatically.
   */
  public clear() {
    this.survey.clearFiles(this.name, this.value, null, (status, data) => {
      if (status === "success") {
        this.value = undefined;
        this.errors = [];
      }
    });
  }
  /**
   * Remove file item programmatically.
   */
  public removeFile(content: { name: string }) {
    this.survey.clearFiles(
      this.name,
      this.value,
      content.name,
      (status, data) => {
        if (status === "success") {
          var oldValue = this.value;
          if (Array.isArray(oldValue)) {
            this.value = oldValue.filter(f => f.name !== content.name);
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
    var content = <Array<any>>[];
    if (this.storeDataAsText) {
      files.forEach(file => {
        let fileReader = new FileReader();
        fileReader.onload = e => {
          content = content.concat([
            { name: file.name, type: file.type, content: fileReader.result }
          ]);
          if (content.length === files.length) {
            this.value = (this.value || []).concat(content);
          }
        };
        fileReader.readAsDataURL(file);
      });
    } else {
      this.survey.uploadFiles(this.name, files, (status, data) => {
        if (status === "error") {
          this.stateChanged("error");
        }
        if (status === "success") {
          this.value = (this.value || []).concat(
            data.map((r:any) => {
              return {
                name: r.file.name,
                type: r.file.type,
                content: r.content
              };
            })
          );
        }
      });
    }
  }
  public canPreviewImage(fileItem: any): boolean {
    return !!fileItem && this.isFileImage(fileItem);
  }
  protected setNewValue(newValue: any) {
    super.setNewValue(newValue);
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
      newValues.forEach(value => {
        var content = value.content || value;
        this.previewValue = this.previewValue.concat([
          {
            name: value.name,
            type: value.type,
            content: content
          }
        ]);
      });
      if (state === "loading") this.stateChanged("loaded");
    } else {
      newValues.forEach(value => {
        var content = value.content || value;
        this.survey.downloadFile(this.name, value, (status, data) => {
          if (status === "success") {
            this.previewValue = this.previewValue.concat([
              {
                content: data,
                name: value.name,
                type: value.type
              }
            ]);
            if (this.previewValue.length === newValues.length) {
              this.stateChanged("loaded");
            }
          } else {
            this.stateChanged("error");
          }
        });
      });
    }
  }
  protected onCheckForErrors(errors: Array<SurveyError>) {
    super.onCheckForErrors(errors);
    if (this.isUploading && this.waitForUpload) {
      errors.push(
        new CustomError(surveyLocalization.getString("uploadingFile"), this)
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
    this.currentState = state;
    this.onStateChanged.fire(this, { state: state });
  }
  private allFilesOk(files: File[]): boolean {
    var errorLength = this.errors ? this.errors.length : 0;
    (files || []).forEach(file => {
      if (this.maxSize > 0 && file.size > this.maxSize) {
        this.errors.push(new ExceedSizeError(this.maxSize));
      }
    });
    return errorLength === this.errors.length;
  }
  private isFileImage(file: {
    content: string;
    name?: string;
    type?: string;
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
}
JsonObject.metaData.addClass(
  "file",
  [
    { name: "showPreview:boolean", default: true },
    "allowMultiple:boolean",
    "imageHeight",
    "imageWidth",
    "acceptedTypes",
    { name: "storeDataAsText:boolean", default: true },
    { name: "waitForUpload:boolean", default: false },
    "maxSize:number"
  ],
  function() {
    return new QuestionFileModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("file", name => {
  return new QuestionFileModel(name);
});
