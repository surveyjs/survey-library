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
import { HtmlQuestionComponent } from "./questions/html.component";
import { RadiogroupComponent } from "./questions/radiogroup.component";
import { RadiogroupItemComponent } from "./questions/radiogroup-item.component";
import { CheckboxComponent } from "./questions/checkbox.component";
import { CheckboxItemComponent } from "./questions/checkbox-item.component";

import { ActionBarComponent } from "./components/action-bar.component";
import { ActionComponent } from "./components/action.component";
import { ActionBarItemComponent } from "./components/action-bar-item.component";
import { SelectBaseItemComponent } from "./questions/selectbase-item";
import { SelectBaseComponent } from "./questions/selectbase.component";
import { SurveyCommentComponent } from "./comment.component";

@NgModule({
  declarations: [
    SurveyComponent, PageComponent, ElementComponent, ElementContentComponent, StringViewerComponent,
    QuestionSkeletonComponent, TextQuestionComponent, RadiogroupComponent, RadiogroupItemComponent, CheckboxComponent, CheckboxItemComponent,
    ActionBarComponent, ActionComponent, ActionBarItemComponent, HtmlQuestionComponent, SelectBaseItemComponent, SelectBaseComponent, SurveyCommentComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [
    SurveyComponent
  ]
})
export class SurveyAngularModule { }
