import { Component, Input } from "@angular/core";

@Component({
  selector: "question-skeleton",
  templateUrl: "./skeleton.component.html",
  styleUrls: ["./skeleton.component.scss"]
})
export class QuestionSkeletonComponent {
  @Input() model: any;
}