import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { SurveyAngularModule } from "survey-angular-ui";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, SurveyAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
