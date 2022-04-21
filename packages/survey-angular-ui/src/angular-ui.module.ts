import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SurveyComponent } from "./survey.component";
import { PageComponent } from "./page.component";
import { ElementComponent } from "./element.component";
import { ElementContentComponent } from "./element-content.component";
import { StringViewerComponent } from "./string-viewer.component";
import { QuestionSkeletonComponent } from "./components/skeleton.component";
import { TextQuestionComponent } from "./questions/text.component";

@NgModule({
  declarations: [
    SurveyComponent, PageComponent, ElementComponent, ElementContentComponent, StringViewerComponent,
    QuestionSkeletonComponent, TextQuestionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SurveyComponent
  ]
})
export class SurveyAngularModule { }
