import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';


@NgModule({
  imports: [RouterModule.forRoot([], { anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }