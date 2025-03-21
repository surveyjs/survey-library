import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { SurveyModule } from "survey-angular-ui";
import { TestComponent } from "./components/test/test.component";
import { ExampleComponent } from "./components/example/example.component";
import { AppRoutingModule } from "./router.module";
import { AngularItemTemplateComponent } from "./components/itemTemplateComponent";
import { AngularItemContentTemplateComponent } from "./components/itemContentTemplateComponent";
import { TestDefaultComponent } from "./components/test/testdefault.component";
import { TestCustomWidgetComponent } from "./components/test/customwidget.component";
import { CustomActionComponent } from "./components/test-custom-components/action-custom.component";
import { EmptyComponent } from "./components/test/empty.component";

@NgModule({
  declarations: [
    AppComponent, ExampleComponent, TestComponent, TestDefaultComponent,
    TestCustomWidgetComponent,
    AngularItemTemplateComponent,
    AngularItemContentTemplateComponent,
    CustomActionComponent, EmptyComponent
  ],
  imports: [
    BrowserModule, SurveyModule, FormsModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  static declaration = [AngularItemTemplateComponent, AngularItemContentTemplateComponent, CustomActionComponent]
}

