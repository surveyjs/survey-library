import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class Question {
  private questionValue: Locator;
  protected isCell: boolean;
  constructor(public readonly page: Page, protected name: string, locator?: Locator) {
    this.isCell = !!locator;
    this.questionValue = !locator ? this.page.locator("[data-name='"+ name + "']").first() : locator;
  }
  public get question(): Locator { return this.questionValue; }
  public async scrollIntoViewIfNeeded(): Promise<void> {
    if(!this.isCell) {
      await this.question.scrollIntoViewIfNeeded();
    }
  }
  public async focus(): Promise<void> {
    await this.page.evaluate(questionName => {
      const q = window["survey"].getQuestionByName(questionName);
      if(q.inputId) {
        document.getElementById(q.inputId)?.focus();
      }
      return q.value;
    }, this.name);
  }
  public async hover(locator: string | Locator): Promise<void> {
    if(typeof locator === "string") {
      locator = this.question.locator(locator).first();
    }
    await locator.hover();
  }
  public async resetFocusToBody(): Promise<void> {
    await this.page.evaluate(() => {
      document.body.focus();
    });
  }
  public async checkQuestionValue(val: any): Promise<void> {
    const questionValue = await this.page.evaluate(questionName => {
      const q = window["survey"].getQuestionByName(questionName);
      return q.value;
    }, this.name);
    await expect(questionValue).toStrictEqual(val);
  }
  public async checkPropertyValue(propName: string, val: any): Promise<void> {
    const vals = [this.name, propName];
    const propValue = await this.page.evaluate(params => {
      const q = window["survey"].getQuestionByName(params[0]);
      return q[params[1]];
    }, vals);
    await expect(propValue).toStrictEqual(val);
  }
  public async setPropertyValue(propName: string, val: any): Promise<void> {
    await this.page.evaluate(params => {
      const q = window["survey"].getQuestionByName(params[0]);
      q[params[1]] = params[2];
    }, [this.name, propName, val]);
  }
  public async hasClassIncluded(loc: Locator, isChecked: boolean, className: string): Promise<void> {
    const reg = new RegExp(className);
    if(isChecked) {
      await expect(loc).toHaveClass(reg);
    } else {
      await expect(loc).not.toHaveClass(reg);
    }
  }
  public screenShortOptions: any;
  public async toHaveScreenshot(name: string, locator?: Locator): Promise<void> {
    if(!locator) {
      locator = this.question;
    }
    await expect(locator).toHaveScreenshot(name, this.screenShortOptions);
  }
}

export class QuestionSelect extends Question {
  public async clickByText(val: string): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    await this.getItemByText(val).click();
  }
  public async clickByValue(val: string): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    await this.getItemByValue(val).click();
  }
  protected getItemByText(val: string): Locator {
    return this.question.locator("span").filter({ hasText: val }).first();
  }
  protected getItemByValue(val: string): Locator {
    return this.question.locator("label").filter({ has: this.page.locator("input[value='" + val + "']") }).first();
  }
}
export class QuestionText extends Question {
  public async fill(text: string): Promise<void> {
    this.scrollIntoViewIfNeeded();
    this.question.locator("input").fill(text);
  }
}
export class QuestionComment extends Question {
  public async fill(text: string): Promise<void> {
    this.question.locator("textarea").fill(text);
  }
}
export class QuestionDropdown extends Question {
  public async click(): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    const loc = this.question.locator(".sd-input.sd-dropdown");
    await loc.click();
  }
  public async selectItemByText(val: string): Promise<void> {
    await this.click();
    const li = this.question.locator("li").getByText(val).first();
    await li.click();
  }
}
export class QuestionRadiogroup extends QuestionSelect {
}
export class QuestionCheckbox extends QuestionSelect {
  public async clickByTexts(val: Array<string>): Promise<void> {
    for(let i = 0; i < val.length; i ++) {
      await this.clickByText(val[i]);
    }
  }
  public async clickByValues(val: Array<string>): Promise<void> {
    for(let i = 0; i < val.length; i ++) {
      await this.clickByValue(val[i]);
    }
  }
}
export class QuestionRating extends Question {
  public async clickItemByText(val: string): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    await this.question.locator("span").getByText(val).first().click();
  }
}
export class QuestionImagePicker extends Question {
  public async clickItemByValue(val: string): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    await this.question.locator("img[alt='" + val + "']").first().click();
  }
}
export class QuestionBoolean extends Question {
  public get rootLoc(): Locator { return this.question.locator("label"); }
  public async clickItemByText(val: string): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    await this.question.locator("span").getByText(val).first().click();
  }
  public async clickThumb(isTrue: boolean): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    await this.question.locator(".sd-boolean__thumb-ghost").nth(isTrue ? 1: 0).click();
  }
  /*
  public async clickSwitch(offsetX: number): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    const lb = this.question.locator(".sd-boolean-root");
    //const rect = await lb.boundingBox();
    lb.click({ position: { x: offsetX, y: 0 }, force: true });
  }
  */
  public async isClassChecked(isChecked: boolean): Promise<void> {
    await this.hasClassIncluded(this.rootLoc, isChecked, "sd-boolean--checked");
  }
}
export class QuestionHtml extends Question {
  public async checkText(val: string): Promise<void> {
    expect(this.question.locator("div").getByText(val).isVisible).toBeTruthy();
  }
}
export class QuestionExpression extends Question {
  public async checkText(val: string): Promise<void> {
    expect(this.question.locator("div").getByText(val).isVisible).toBeTruthy();
  }
}
export class QuestionFileCore extends Question {
  public async clickClear(): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    await this.question.locator("button[title='Clear']").click();
  }
}
export class QuestionFile extends QuestionFileCore {}
export class QuestionSignaturePad extends QuestionFileCore {}
export class QuestionMatrix extends Question {
  public async clickCell(rowText: string, colVal: string): Promise<void> {
    await this.scrollIntoViewIfNeeded();
    const row = this.question.locator("tr:has-text('"+ rowText +"')");
    await row.locator("td").filter({ has: this.page.locator("[value='"+ colVal + "']") }).first().click();
  }
}
export class QuestionMatrixDropdownBase extends Question {
  public async getCellQuestionLocator(rowVal: string|number, colVal: string): Promise<Locator> {
    await this.scrollIntoViewIfNeeded();
    const label = "row " + rowVal.toString() + ", column " + colVal;
    const div = this.page.locator("div[aria-label='" + label + "']");
    const cellQuestion = this.question.locator(".sd-table__question-wrapper").filter({ has: div });
    const row = this.question.locator("tr").filter({ has: div });
    row.scrollIntoViewIfNeeded();

    return cellQuestion;
  }
  public async getCellDropdown(rowVal: string|number, colVal: string): Promise<QuestionDropdown> {
    const loc = await this.getCellQuestionLocator(rowVal, colVal);
    return new QuestionDropdown(this.page, colVal, loc);
  }
}
export class QuestionMatrixDropdown extends QuestionMatrixDropdownBase {
}
export class QuestionMatrixDynamic extends QuestionMatrixDropdownBase {
}
export class QuestionMutlipleText extends Question {
  public getTextQuestion(index: number): QuestionText {
    return new QuestionText(this.page, "", this.question.locator(".sd-multipletext__item-container").nth(index));
  }
}
export class QuestionPanelDynamic extends Question {
  public async removePanel(index: number): Promise<void> {
    //TODO support list mode only so far
    await this.scrollIntoViewIfNeeded();
    const delButton = this.question.locator(".sd-paneldynamic__remove-btn").nth(index);
    await delButton.scrollIntoViewIfNeeded();
    await delButton.click();
  }
}