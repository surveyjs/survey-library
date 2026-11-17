import "zone.js";
import { createComponent, importProvidersFrom, provideZoneChangeDetection, VERSION } from "@angular/core";
import type { ApplicationRef, ComponentRef } from "@angular/core";
import { createApplication } from "@angular/platform-browser";
import { SurveyModule, SurveyComponent } from "survey-angular-ui";

// The Angular page of the angular perf suite, bundled by global-setup.ts into perf/results/.cache/angular-app.js with
// this suite's pinned Angular (perf/angular) and survey-angular-ui's partial-Ivy build linked by Angular's linker.
// survey-core is window.Survey (the UMD build the page loads from /core). The app boots on page load, untimed;
// render() is the mount that page-helpers.ts times, so revs.ts adds this file to the rev hash of every browser id.
const W: any = globalThis;

let appRef: ApplicationRef | undefined;
let surveyRef: ComponentRef<SurveyComponent> | undefined;

const ready: Promise<void> = createApplication({ providers: [provideZoneChangeDetection(), importProvidersFrom(SurveyModule)] })
  .then((app: ApplicationRef) => { appRef = app; });

// The first render creates <survey> in the root element; the next ones set its model input, as a template binding
// [model] does.
function render(survey: any, root: HTMLElement): void {
  if (!appRef) throw new Error("the Angular app is not ready");
  if (!surveyRef) {
    const host = document.createElement("survey");
    root.appendChild(host);
    surveyRef = createComponent(SurveyComponent, { environmentInjector: appRef.injector, hostElement: host });
    surveyRef.setInput("model", survey);
    appRef.attachView(surveyRef.hostView);
  } else {
    surveyRef.setInput("model", survey);
  }
  surveyRef.changeDetectorRef.detectChanges();
}

W.SurveyNgPerf = { ready: ready, version: VERSION.full, render: render };
