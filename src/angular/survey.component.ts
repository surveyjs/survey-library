import { Component, Input } from "@angular/core";
import { Observable, Subject } from "rxjs";
// import { SurveyModel } from "survey-core";

@Component({
  selector: "survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.scss"]
})
export class SurveyComponent {
  title = "SurveyJS";
  @Input() json: string;
  // model = new SurveyModel(json);
  constructor() {
    debugger;
  }
  _visible = new Subject<boolean>();
  _visibleVal = true;
  get visible() {
    return this._visibleVal;
  }
  set visible(val: boolean) {
    this._visible.next(val);
    this._visibleVal = val;
  }
  toggle() {
    this.visible = !this.visible;
  }
  time = new Observable<string>(observer => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });
}