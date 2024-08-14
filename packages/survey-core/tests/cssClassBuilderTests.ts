import { CssClassBuilder } from "../src/utils/cssClassBuilder";

export default QUnit.module("cssClassBuilder");

QUnit.test("Use calculated value in expression", function (assert) {
  const builder = new CssClassBuilder();
  assert.equal(builder.toString(), "", "Empty builder returns empty string");
  builder.append("");
  assert.equal(builder.toString(), "", "Append of empty string doesn't change empty builder state");
  builder.append(null);
  assert.equal(builder.toString(), "", "Append of null doesn't change empty builder state");
  builder.append(undefined);
  assert.equal(builder.toString(), "", "Append of undefined doesn't change empty builder state");
  builder.append("class1", false);
  assert.equal(builder.toString(), "", "Append of string with false condition doesn't change empty builder state");

  builder.append("class1");
  assert.equal(builder.toString(), "class1", "Append string changes builder state");
  builder.append("");
  assert.equal(builder.toString(), "class1", "Append of empty string doesn't change builder state");
  builder.append(null);
  assert.equal(builder.toString(), "class1", "Append of null doesn't change builder state");
  builder.append(undefined);
  assert.equal(builder.toString(), "class1", "Append of undefined doesn't change builder state");
  builder.append("class1", false);
  assert.equal(builder.toString(), "class1", "Append of string with false condition doesn't change builder state");

  builder.append("class2", true);
  assert.equal(builder.toString(), "class1 class2", "Append of string with true condition changes builder state");
  builder.append("class3 class4");
  assert.equal(builder.toString(), "class1 class2 class3 class4", "Append of string with two clasess changes builder state");
  builder.append("class5 ", true);
  assert.equal(builder.toString(), "class1 class2 class3 class4 class5", "Append of space ended class trimmed");

});