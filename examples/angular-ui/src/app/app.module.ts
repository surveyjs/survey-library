import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { SurveyAngularModule } from "survey-angular-ui";
import { TestComponent } from "./test.component";
import { ExampleComponent } from "./example.component";
import { AppRoutingModule } from "./router.module";
import { TestDefaultComponent } from "./testdefault.component";
import { TestDefaultV2Component } from "./testdefaultV2.component";
import { TestModernComponent } from "./testmodern.component";
import { TestBootstrapComponent } from "./bootstrap.component";
import { TestCustomWidgetComponent } from "./customwidget.component";

@NgModule({
  declarations: [
    AppComponent, ExampleComponent, TestComponent, TestDefaultComponent, TestDefaultV2Component, TestModernComponent, TestBootstrapComponent, TestCustomWidgetComponent
  ],
  imports: [
    BrowserModule, SurveyAngularModule, FormsModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

