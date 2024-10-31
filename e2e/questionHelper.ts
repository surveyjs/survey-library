import type { Page, Locator } from "@playwright/test";

export class Question {
  private questionValue: Locator;
  constructor(public readonly page: Page, protected name: string) {
    this.questionValue = this.page.locator("[data-name='"+ name + "']");
  }
  public get question(): Locator { return this.questionValue; }
}

export class QuestionSelect extends Question {
  public async clickByLabel(val: string): Promise<void> {
    await this.getItemByLabel(val).click();
  }
  public async clickByValue(val: string): Promise<void> {
    await this.getItemByValue(val).click();
  }
  protected getItemByLabel(val: string): Locator {
    return this.question.locator("span").filter({ hasText: val }).first();
  }
  protected getItemByValue(val: string): Locator {
    return this.question.locator("label").filter({ has: this.page.locator("input[value='" + val + "']") }).first();
  }
}
export class QuestionDropdownSelect extends Question {
  public async click(): Promise<void> {
    await this.question.locator(".sd-input.sd-dropdown").click();
  }
  public async selectItemByText(val: string): Promise<void> {
    await this.click();
    await this.question.locator("li").getByText(val).first().click();
    //await this.question.locator("li").filter({ has: this.page.getByText(val) }).first().click();
  }
}
export class QuestionSingleSelect extends QuestionSelect {
}
export class QuestionMultipleSelect extends QuestionSelect {
  public async clicksByLabel(val: Array<string>): Promise<void> {
    for(let i = 0; i < val.length; i ++) {
      await this.clickByLabel(val[i]);
    }
  }
  public async clicksByValue(val: Array<string>): Promise<void> {
    for(let i = 0; i < val.length; i ++) {
      await this.clickByValue(val[i]);
    }
  }
}
