import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

const routes = [
  { path: '**', redirectTo: '/', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }