import { Component, Input } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { SurveyModel } from "survey-core";

@Component({
  selector: "survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.scss"]
})
export class SurveyComponent {
  title = "SurveyJS";
  @Input() json: any;
  model;
  constructor() {
    // debugger;
    this.model = new SurveyModel(this.json);
  }
  _visible = new BehaviorSubject<boolean>(true);
  get visible(): boolean {
    return this._visible.value;
  }
  set visible(val: boolean) {
    this._visible.next(val);
  }
  toggle(): void {
    this.visible = !this.visible;
  }
  time = new Observable<string>(observer => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });
}