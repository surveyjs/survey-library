import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "question-skeleton",
  templateUrl: "./skeleton.component.html",
  styleUrls: ["./skeleton.component.scss"]
})
export class QuestionSkeletonComponent {
  @Input() model: any;
}

AngularComponentFactory.Instance.registerComponent("skeleton-question", QuestionSkeletonComponent);