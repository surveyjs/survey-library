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
    const data = await this.page.evaluate(() => {
      return window["survey"].data;
    });
    await expect(data).toStrictEqual(json);
  }
  public async checkVisibleQuestions(num: number): Promise<void> {
    const len = await this.page.evaluate(() => { return window["survey"].getAllQuestions(true).length; });
    await expect(num).toStrictEqual(len);
  }
  private getNavigatorButton(value: string): Locator {
    return this.page.locator("input[value='" + value + "']").last();
  }
  private async checkButtonVisibility(btnValue: string, isVisible: boolean): Promise<void> {
    const l = this.getNavigatorButton(btnValue);
    if(isVisible) {
      await expect(l.isVisible).toBeTruthy();
    } else {
      await expect(l.isHidden).toBeTruthy();
    }
  }
}