import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SurveyComponent } from "./survey.component";
import { PageComponent } from "./page.component";
import { ElementComponent } from "./element.component";
import { StringViewerComponent } from "./string-viewer.component";

@NgModule({
  declarations: [
    SurveyComponent, PageComponent, ElementComponent, StringViewerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SurveyComponent
  ]
})
export class SurveyAngularModule { }
