import type { Page, Locator } from "@playwright/test";

export class Question {
  private questionValue: Locator;
  constructor(public readonly page: Page, name: string) {
    this.questionValue = this.page.locator("[data-name='"+ name + "']");
  }
  public get question(): Locator { return this.questionValue; }
}

export class QuestionSelect {
  private questionValue: Locator;
  constructor(public readonly page: Page, name: string) {
    this.questionValue = this.page.locator("[data-name='"+ name + "']");
  }
  public get question(): Locator { return this.questionValue; }
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
