import { Component, Input } from "@angular/core";
import { FilterAIPrompt, toCssClasses } from "survey-core";
import { BaseAngular } from "../../base-angular";

// The description of a filter, its request button - Create new filter, then Make Changes - and what
// went wrong: Create custom filter's, and the tab of an AI preset in Edit Presets.
@Component({
  selector: "sv-ng-filter-ai-prompt",
  templateUrl: "./filter-ai-prompt.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterAIPromptComponent extends BaseAngular<FilterAIPrompt> {
  @Input() prompt!: FilterAIPrompt;
  @Input() css: any;
  protected getModel(): FilterAIPrompt {
    return !!this.prompt && !this.prompt.isDisposed ? this.prompt : undefined as any;
  }
  public get formCss(): string {
    return toCssClasses(this.css.editor, this.css.aiPromptForm);
  }
}
