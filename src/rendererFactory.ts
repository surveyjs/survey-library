import { Question } from "./question";

export class RendererFactory {
  public static Instance: RendererFactory = new RendererFactory();

  private renderersHash: {
    [questionType: string]: { [renderAs: string]: any },
  } = {};

  public unregisterRenderer(questionType: string, rendererAs: string) {
    delete this.renderersHash[questionType][rendererAs];
  }

  public registerRenderer(
    questionType: string,
    renderAs: string,
    renderer: any
  ) {
    if (!this.renderersHash[questionType]) {
      this.renderersHash[questionType] = {};
    }
    this.renderersHash[questionType][renderAs] = renderer;
  }

  public getRenderer(questionType: string, renderAs: string) {
    return (
      (this.renderersHash[questionType] &&
        this.renderersHash[questionType][renderAs]) ||
      "default"
    );
  }

  public getRendererByQuestion(question: Question): any {
    return this.getRenderer(question.getType(), question.renderAs);
  }
  public clear() {
    this.renderersHash = {};
  }
}
