import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TestBootstrapComponent } from "./components/test/bootstrap.component";
import { TestCustomWidgetComponent } from "./components/test//customwidget.component";
import { TestDefaultComponent } from "./components/test//testdefault.component";
import { TestDefaultV2Component } from "./components/test/testdefaultV2.component";
import { TestModernComponent } from "./components/test/testmodern.component";
import { EmptyComponent } from "./components/test/empty.component";

const routes = [
  { path: "examples_test/default/angular", component: TestDefaultComponent },
  { path: "examples_test/default/angular.html", component: TestDefaultComponent },
  { path: "examples_test/defaultV2/angular", component: TestDefaultV2Component },
  { path: "examples_test/defaultV2/angular.html", component: TestDefaultV2Component },
  { path: "examples_test/modern/angular", component: TestModernComponent },
  { path: "examples_test/modern/angular.html", component: TestModernComponent },
  { path: "examples_test/bootstrap/angular", component: TestBootstrapComponent },
  { path: "examples_test/bootstrap/angular.html", component: TestBootstrapComponent },
  { path: "examples_test/customWidget/angular", component: TestCustomWidgetComponent },
  { path: "examples_test/customWidget/angular.html", component: TestCustomWidgetComponent },
  { path: "test", component: EmptyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: "enabled" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }