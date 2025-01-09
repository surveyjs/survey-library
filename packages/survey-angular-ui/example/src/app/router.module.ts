import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TestCustomWidgetComponent } from "./components/test//customwidget.component";
import { TestDefaultV2Component } from "./components/test/testdefaultV2.component";
import { EmptyComponent } from "./components/test/empty.component";

const routes = [
  { path: "examples_test/defaultV2/angular", component: TestDefaultV2Component },
  { path: "examples_test/defaultV2/angular.html", component: TestDefaultV2Component },
  { path: "examples_test/customWidget/angular", component: TestCustomWidgetComponent },
  { path: "examples_test/customWidget/angular.html", component: TestCustomWidgetComponent },
  { path: "test", component: EmptyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: "enabled" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }