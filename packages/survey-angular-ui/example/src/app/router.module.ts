import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TestCustomWidgetComponent } from "./components/test//customwidget.component";
import { TestDefaultComponent } from "./components/test/testdefault.component";
import { EmptyComponent } from "./components/test/empty.component";

const routes = [
  { path: "examples_test/default/angular", component: TestDefaultComponent },
  { path: "examples_test/default/angular.html", component: TestDefaultComponent },
  { path: "examples_test/customWidget/angular", component: TestCustomWidgetComponent },
  { path: "examples_test/customWidget/angular.html", component: TestCustomWidgetComponent },
  { path: "test", component: EmptyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: "enabled" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }