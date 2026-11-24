// A compile-time fixture, not a unit test: vitest does not type-check and nothing else in the package
// type-checks the tests, so `npm run test:types` compiles this file on its own.
// It guards the public export of ExpressionItem, the base class of HtmlConditionItem and UrlConditionItem.
// The classes are imported from the entry chunk, not from src, so a missing export fails the compile.
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { ExpressionItem, HtmlConditionItem, UrlConditionItem } from "../../entries/chunks/model";

const htmlItem: ExpressionItem = new HtmlConditionItem("{q1} = 1", "html");
const urlItem: ExpressionItem = new UrlConditionItem("{q1} = 2", "https://surveyjs.io");
const isItem: boolean = htmlItem instanceof ExpressionItem && urlItem instanceof ExpressionItem;

export { isItem };
