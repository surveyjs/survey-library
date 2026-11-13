import { ChangeDetectorRef, Component, ViewEncapsulation } from "@angular/core";
import * as SurveyCore from "survey-core";
import { TestComponent } from "./test.component";

// The custom widgets, jQuery and icheck load only on this page, so the other test pages do not pay for them.
// icheck is a jQuery plugin that reads window.jQuery when it is evaluated. icheck 1.0.2 calls $.isFunction,
// which jQuery 4 (the version npm installs here) no longer has, so the page loads jQuery 3.
let customWidgetsLoaded: Promise<void> | undefined;
function loadCustomWidgets(): Promise<void> {
  if (!customWidgetsLoaded) {
    customWidgetsLoaded = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("jQuery did not load"));
      document.head.appendChild(script);
    })
      .then(() => Promise.all([import("surveyjs-widgets"), import("icheck")]))
      .then(([widgetsModule]) => {
        const widgets: any = (<any>widgetsModule).default || widgetsModule;
        widgets.sortablejs(SurveyCore);
        widgets.icheck(SurveyCore, (<any>window).jQuery);
      });
  }
  return customWidgetsLoaded;
}

@Component({
  selector: "test-default",
  templateUrl: "./test.component.html",
  styleUrls: ["./customwidget.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestCustomWidgetComponent extends TestComponent {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    loadCustomWidgets();
  }
}