import { frameworks, url, initSurvey, getSurveyResult, getData, test, expect } from "../helper";

const title = "multiple comments support in select questions";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 800, height: 600 });
    });
    test("single matrix vs multiple selection", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "matrix",
            "name": "q1",
            "rows": ["row1", "row2"],
            "columns": ["col1", "col2", "col3"],
            "isMultipleSelect": true
          }
        ]
      });
      const checks = page.locator(".sd-item__decorator");
      expect(await checks.count()).toEqual(6);
      await checks.nth(0).click({ force: true });
      await checks.nth(1).click({ force: true });
      await checks.nth(3).click({ force: true });
      await checks.nth(5).click({ force: true });
      expect(await getData(page)).toEqual({
        "q1": {
          "row1": ["col1", "col2"],
          "row2": ["col1", "col3"]
        }
      });
      await checks.nth(0).click({ force: true });
      await checks.nth(2).click({ force: true });
      await checks.nth(3).click({ force: true });
      await checks.nth(4).click({ force: true });
      expect(await getData(page)).toEqual({
        "q1": {
          "row1": ["col2", "col3"],
          "row2": ["col3", "col2"]
        }
      });
    });
    test("matrix-rubric vs multiple selection", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "matrix",
            "name": "q1",
            "rows": ["row1", "row2"],
            "columns": ["col1", "col2", "col3"],
            "cells": {
              "row1": {
                "col1": "Text-1",
                "col2": "Text-2",
                "col3": "Text-3"
              },
              "row2": {
                "col1": "Text-4",
                "col2": "Text-5",
                "col3": "Text-6"
              }
            },
            "isMultipleSelect": true
          }
        ]
      });
      const checks = page.locator(".sd-item__decorator");
      const tLocator = (no: number) => page.locator("span").getByText(`Text-${no}`);
      await tLocator(1).click({ force: true });
      await tLocator(2).click({ force: true });
      await tLocator(4).click({ force: true });
      await tLocator(6).click({ force: true });
      expect(await getData(page)).toEqual({
        "q1": {
          "row1": ["col1", "col2"],
          "row2": ["col1", "col3"]
        }
      });
      await tLocator(1).click({ force: true });
      await tLocator(3).click({ force: true });
      await tLocator(4).click({ force: true });
      await tLocator(5).click({ force: true });
      expect(await getData(page)).toEqual({
        "q1": {
          "row1": ["col2", "col3"],
          "row2": ["col3", "col2"]
        }
      });
    });
  });
});