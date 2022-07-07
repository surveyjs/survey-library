import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ExampleComponent } from "./example.component";
import { TestDefaultComponent } from "./testdefault.component";
import { TestDefaultV2Component } from "./testdefaultV2.component";
import { TestModernComponent } from "./testmodern.component";

const routes = [
  { path: "examples_test/default/angular", component: TestDefaultComponent },
  { path: "examples_test/defaultV2/angular", component: TestDefaultV2Component },
  { path: "examples_test/modern/angular", component: TestModernComponent }

]

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }