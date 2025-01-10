import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class Survey {
  public readonly completeButtonValue = "Complete";
  public readonly nextButtonValue = "Next";
  constructor(public readonly page: Page) {
  }
  public async nextPage(): Promise<void> {
    await this.getNavigatorButton(this.nextButtonValue).click();
  }
  public async complete(): Promise<void> {
    await this.getNavigatorButton(this.completeButtonValue).click();
  }
  public async checkNextButtonVisibility(isVisible: boolean): Promise<void> {
    await this.checkButtonVisibility(this.nextButtonValue, isVisible);
  }
  public async checkCompleteButtonVisibility(isVisible: boolean): Promise<void> {
    await this.checkButtonVisibility(this.completeButtonValue, isVisible);
  }
  public async checkData(json: any): Promise<void> {
    await this.doDataCheck(json);
  }
  public async checkQuestionValue(questionName: string, value: any): Promise<void> {
    await this.doDataCheck(value, questionName);
  }
  public async checkVisibleQuestions(num: number): Promise<void> {
    const len = await this.page.evaluate(() => { return window["survey"].getAllQuestions(true).length; });
    expect(num).toStrictEqual(len);
  }
  public async checkIfCssClassExists(className: string, shouldExists: boolean): Promise<void> {
    const classExists = await this.page.evaluate(className => {
      return !!document.querySelector(`.${className}`);
    }, className);
    if(shouldExists) {
      expect(classExists).toBeTruthy();
    } else {
      expect(classExists).toBeFalsy();
    }
  }
  public getNavigatorButton(value: string): Locator {
    return this.page.locator("input[value='" + value + "']").last();
  }
  private async checkButtonVisibility(btnValue: string, isVisible: boolean): Promise<void> {
    const l = this.getNavigatorButton(btnValue);
    if(isVisible) {
      expect(l.isVisible).toBeTruthy();
    } else {
      expect(l.isHidden).toBeTruthy();
    }
  }
  private async doDataCheck(json: any, questionName?: string): Promise<void> {
    const data = await this.page.evaluate(() => {
      return window["survey"].data;
    });
    const checkData = !!questionName ? data[questionName] : data;
    await expect(checkData).toStrictEqual(json);
  }
}