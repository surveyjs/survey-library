import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { SurveyAngularModule } from "survey-angular-ui";
import { TestComponent } from "./components/test/test.component";
import { ExampleComponent } from "./components/example/example.component";
import { AppRoutingModule } from "./router.module";
import { TestDefaultComponent } from "./components/test/testdefault.component";
import { TestDefaultV2Component } from "./components/test/testdefaultV2.component";
import { TestModernComponent } from "./components/test/testmodern.component";
import { TestBootstrapComponent } from "./components/test/bootstrap.component";
import { TestCustomWidgetComponent } from "./components/test/customwidget.component";

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

