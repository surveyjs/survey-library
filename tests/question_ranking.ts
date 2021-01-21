import { QuestionRankingModel } from "../src/question_ranking";

export default QUnit.module("question ranking");

QUnit.test("Ranking: ", function (assert) {
  const items = ["one", "two", "three"];
  const model = new QuestionRankingModel("test");

  model.moveArrayItemBack(items, 1);
  assert.deepEqual(items, ["two", "one", "three"], "moveArrayItemBack is ok");

  model.moveArrayItemForward(items, 0);
  assert.deepEqual(
    items,
    ["one", "two", "three"],
    "moveArrayItemForward is ok"
  );
});
