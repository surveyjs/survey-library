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
   * In this case, you have to write the code onUploadFile event to store the file content.
   * @see SurveyModel.onUploadFile
   */
  public get storeDataAsText(): boolean {
    return this.getPropertyValue("storeDataAsText", true);
  }
  public set storeDataAsText(val: boolean) {
    this.setPropertyValue("storeDataAsText", val);
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
   * Load file programmatically.
   * @param file
   */
  public loadFile(file: File) {
    var self = this;
    if (
      this.survey &&
      !this.survey.uploadFile(this.name, file, this.storeDataAsText, function(
        status: string
      ) {
        self.isUploading = status == "uploading";
      })
    )
      return;
    this.setFileValue(file);
  }
  public previewValue: any;
  protected setFileValue(file: File) {
    if (!FileReader) return;
    if (!this.showPreview && !this.storeDataAsText) return;
    if (this.checkFileForErrors(file)) return;
    var fileReader = new FileReader();
    var self = this;
    fileReader.onload = function(e) {
      if (self.showPreview) {
        self.previewValue = self.isFileImage(file) ? fileReader.result : null;
        self.fireCallback(self.previewValueLoadedCallback);
      }
      if (self.storeDataAsText) {
        self.value = fileReader.result;
      }
    };
    fileReader.readAsDataURL(file);
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
}
JsonObject.metaData.addClass(
  "file",
  [
    "showPreview:boolean",
    "imageHeight",
    "imageWidth",
    { name: "storeDataAsText:boolean", default: true },
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
