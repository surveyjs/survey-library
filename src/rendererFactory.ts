import { Question } from "./question";

export class RendererFactory {
  public static Instance: RendererFactory = new RendererFactory();

  private renderersHash: {
    [questionType: string]: { [renderAs: string]: any },
  } = {};
  private defaultHash: { [questionType: string]: string } = {};

  public unregisterRenderer(questionType: string, rendererAs: string): void {
    delete this.renderersHash[questionType][rendererAs];
    if(this.defaultHash[questionType] === rendererAs) {
      delete this.defaultHash[questionType];
    }
  }

  public registerRenderer(questionType: string, renderAs: string, renderer: any, useAsDefault: boolean = false): void {
    if (!this.renderersHash[questionType]) {
      this.renderersHash[questionType] = {};
    }
    this.renderersHash[questionType][renderAs] = renderer;
    if(useAsDefault) {
      this.defaultHash[questionType] = renderAs;
    }
  }

  public getRenderer(questionType: string, renderAs: string): string {
    return (this.renderersHash[questionType] && this.renderersHash[questionType][renderAs]) ||
        this.defaultHash[questionType] && this.renderersHash[questionType][this.defaultHash[questionType]]
        || "default";
  }

  public getRendererByQuestion(question: Question): any {
    return this.getRenderer(question.getType(), question.renderAs);
  }
  public clear(): void {
    this.renderersHash = {};
  }
}
