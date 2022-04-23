import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { SurveyAngularModule } from "survey-angular-ui";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, SurveyAngularModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
