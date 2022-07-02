import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { SurveyAngularModule } from "survey-angular-ui";
import { TestComponent } from "./test.component";
import { ExampleComponent } from "./example.component";

@NgModule({
  declarations: [
    AppComponent, ExampleComponent, TestComponent
  ],
  imports: [
    BrowserModule, SurveyAngularModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
