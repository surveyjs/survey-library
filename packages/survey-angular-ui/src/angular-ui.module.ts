import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SurveyComponent } from "./survey.component";

@NgModule({
  declarations: [
    SurveyComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SurveyComponent
  ]
})
export class SurveyAngularModule { }
