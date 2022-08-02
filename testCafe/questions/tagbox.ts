import { frameworks, url, initSurvey, getListItemByText } from "../helper";
import { Selector } from "testcafe";
const title = "tagbox";

const json = {
  showQuestionNumbers: "off",
  questions: [
    {
      type: "tagbox",
      name: "question1",
      hasOther: "true",
      choices: [
        "item1",
        "item2",
        "item3",
        "item4",
        "item5",
        "item6",
        "item7",
        "item8",
        "item9",
        "item10",
        "item11",
        "item12",
        "item13",
        "item14",
        "item15",
        "item16",
        "item17",
        "item18",
        "item19",
        "item20",
        "item21",
        "item22",
        "item23",
        "item24",
        "item25",
        "item26",
        "item27"
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  const questionTagbox = Selector(".sv_q_input.sv_q_tagbox");
  const deleteItemButton = Selector(".sv_q_tagbox-item_clean-button");
  const selectedItems = Selector(".sv-tagbox__item");

  test("tagbox editing", async (t) => {
    await t
      .expect(selectedItems.count).eql(0)

      .click(questionTagbox)
      .click(getListItemByText("item20"))
      .click(getListItemByText("item10"))
      .pressKey("esc")
      .expect(selectedItems.count).eql(2)
      .expect(selectedItems.nth(0).textContent).contains("item20")
      .expect(selectedItems.nth(1).textContent).contains("item10")

      .hover(selectedItems)
      .click(deleteItemButton)
      .expect(selectedItems.count).eql(1)
      .expect(selectedItems.nth(0).textContent).contains("item10")

      .hover(selectedItems)
      .click(deleteItemButton)
      .expect(selectedItems.count).eql(0);
  });
});