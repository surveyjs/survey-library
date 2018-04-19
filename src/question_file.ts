import { Question } from "./question";
import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { SurveyError } from "./base";
import { CustomError, ExceedSizeError } from "./error";
import { surveyLocalization } from "./surveyStrings";

/**
 * A Model for a file question
 */
export class QuestionFileModel extends Question {
  private isUploading: boolean = false;
  previewValueLoadedCallback: () => void;
  public previewValue: any[] = [];
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
    return this.getPropertyValue("showPreview", false);
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
  // /**
  //  * Set it to true if you want to wait until files will be uploaded to your server.
  //  */
  // public get waitForUpload(): boolean {
  //   return this.getPropertyValue("waitForUpload", false);
  // }
  // public set waitForUpload(val: boolean) {
  //   this.setPropertyValue("waitForUpload", val);
  // }
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
   * Clear value programmatically.
   */
  public clear() {
    this.value = undefined;
    this.previewValue = [];
    this.fireCallback(this.previewValueLoadedCallback);
  }
  /**
   * Load multiple files programmatically.
   * @param files
   */
  public loadFiles(files: File[]) {
    if (!this.survey) {
      return;
    }
    if (files.every(file => this.checkFileForErrors(file))) {
      return;
    }
    this.value = [];
    if (this.storeDataAsText) {
      files.forEach(file => {
        let fileReader = new FileReader();
        fileReader.onload = e => {
          this.value = (this.value || []).concat([
            { name: file.name, type: file.type, content: fileReader.result }
          ]);
        };
        fileReader.readAsDataURL(file);
      });
    } else {
      this.survey.uploadFiles(this.name, files, (status, data) => {
        this.isUploading = status === "uploading";
        if (status === "success") {
          this.value = data.map(r => {
            return {
              name: r.file.name,
              type: r.file.type,
              content: r.content
            };
          });
        }
      });
    }
  }
  protected setNewValue(newValue: any) {
    super.setNewValue(newValue);
    this.previewValue = [];
    var newValues = Array.isArray(newValue)
      ? newValue
      : !!newValue
        ? [newValue]
        : [];
    newValues.forEach(value => {
      var content = value.content || value;
      if (this.showPreview) {
        if (this.storeDataAsText) {
          if (this.isFileContentImage(content)) {
            this.previewValue = this.previewValue.concat([content]);
            this.fireCallback(this.previewValueLoadedCallback);
          }
        } else {
          this.survey.downloadFile(this.name, content, (status, data) => {
            if (status === "success") {
              this.previewValue = this.previewValue.concat([data]);
              this.fireCallback(this.previewValueLoadedCallback);
            }
          });
        }
      }
    });
  }
  protected onCheckForErrors(errors: Array<SurveyError>) {
    super.onCheckForErrors(errors);
    if (this.isUploading) {
      errors.push(
        new CustomError(surveyLocalization.getString("uploadingFile"))
      );
    }
  }
  private checkFileForErrors(file: File): boolean {
    var errorLength = this.errors ? this.errors.length : 0;
    this.errors = [];
    if (this.maxSize > 0 && file.size > this.maxSize) {
      this.errors.push(new ExceedSizeError(this.maxSize));
    }
    if (errorLength != this.errors.length || this.errors.length > 0) {
      this.fireCallback(this.errorsChangedCallback);
    }
    return this.errors.length > 0;
  }
  private isFileImage(file: File) {
    if (!file || !file.type) return;
    var str = file.type.toLowerCase();
    return str.indexOf("image") == 0;
  }
  private isFileContentImage(fileContent: string) {
    if (!fileContent) return;
    var str = fileContent.toLowerCase();
    return str.indexOf("data:image") == 0;
  }
}
JsonObject.metaData.addClass(
  "file",
  [
    "showPreview:boolean",
    "allowMultiple:boolean",
    "imageHeight",
    "imageWidth",
    { name: "storeDataAsText:boolean", default: true },
    // { name: "waitForUpload:boolean", default: false },
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
