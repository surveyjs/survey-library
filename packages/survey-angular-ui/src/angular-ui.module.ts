import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SurveyComponent } from "./survey.component";
import { PageComponent } from "./page.component";
import { ElementComponent } from "./element.component";
import { ElementContentComponent } from "./element-content.component";
import { StringViewerComponent } from "./string-viewer.component";
import { QuestionSkeletonComponent } from "./components/skeleton.component";
import { TextQuestionComponent } from "./questions/text.component";
import { RadiogroupComponent } from "./questions/radiogroup.component";
import { RadiogroupItemComponent } from "./questions/radiogroup-item.component";

import { ActionBarComponent } from "./components/action-bar.component";
import { ActionComponent } from "./components/action.component";
import { ActionBarItemComponent } from "./components/action-bar-item.component";

@NgModule({
  declarations: [
    SurveyComponent, PageComponent, ElementComponent, ElementContentComponent, StringViewerComponent,
    QuestionSkeletonComponent, TextQuestionComponent, RadiogroupComponent, RadiogroupItemComponent,
    ActionBarComponent, ActionComponent, ActionBarItemComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [
    SurveyComponent
  ]
})
export class SurveyAngularModule { }
