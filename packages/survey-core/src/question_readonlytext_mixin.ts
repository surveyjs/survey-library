import { LocalizableString } from "./localizablestring";
import { Question } from "./question";

type Constructor<T = {}> = new (...args: any[]) => T;

export interface IQuestionReadOnlyTextMixin {
  readonly readOnlyText: string;
  readonly locReadOnlyText: LocalizableString;
}

export function questionReadOnlyTextMixin<TBase extends Constructor<Question>>(Base: TBase): TBase & Constructor<IQuestionReadOnlyTextMixin> {
  class QuestionReadOnlyTextMixinClass extends Base implements IQuestionReadOnlyTextMixin {
    declare placeholder: string;

    public get readOnlyText(): string {
      return this.locReadOnlyText.calculatedText;
    }
    public get locReadOnlyText(): LocalizableString {
      return this.getOrCreateLocStr("readOnlyText", true, false, (locStr: LocalizableString) => {
        locStr.onGetTextCallback = (): string => {
          return this.getReadOnlyText();
        };
      });
    }
    protected getReadOnlyText(): string {
      return this.displayValue || this.placeholder;
    }
    protected resetReadOnlyText(): void {
      this.resetPropertyValue("readOnlyText");
    }
  }

  return QuestionReadOnlyTextMixinClass as any;
}
