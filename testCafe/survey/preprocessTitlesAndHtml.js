import { frameworks, url, initSurvey } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "preprocessTitlesAndHtml";

const json = {
  questionTitleTemplate: "{no}) {title} {require}:",
  questionStartIndex: "A",
  requiredText: "(*)",
  pages: [
    {
      title: "This is the page {pageno} of {pagecount}.",
      questions: [
        {
          type: "text",
          name: "name",
          title: "Please type your name",
          isRequired: true
        },
        {
          type: "text",
          name: "email",
          title: "Please type your e-mail",
          isRequired: true,
          validators: [{ type: "email" }]
        }
      ]
    },
    {
      title: "This is the page {pageno} of {pagecount}.",
      questions: [
        {
          type: "comment",
          name: "comment",
          title: "{name}, please tell us what is on your mind"
        }
      ]
    }
  ],
  completedHtml:
    "<p><h4>Thank you for sharing this information with us.</h4></p><p>Your name is: <b>{name}</b></p><p>Your email is: <b>{email}</b></p><p>This is what is on your mind:</p><p>{comment}</p>"
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("check title and html", async t => {
    const getFirstTitle = Selector(() => document.querySelectorAll("h5"), {
      text: "A) Please type your name (*):",
      visibilityCheck: true,
      timeout: 1000
    });
    const getSecondTitle = Selector(() => document.querySelectorAll("h5"), {
      text: "B) Please type your e-mail (*):",
      visibilityCheck: true,
      timeout: 1000
    });
    const getThirdTitle = Selector(() => document.querySelectorAll("h5"), {
      text: "C) wombat, please tell us what is on your mind :",
      visibilityCheck: true,
      timeout: 1000
    });
    const getcompletedHtml = "Thank you for sharing this information with us.Your name is: wombatYour email is: wombat@mail.mailThis is what is on your mind:fresh grasses";

    const getFirstInput = Selector(
      () => document.querySelectorAll(".sv_q_text_root")[0]
    );
    const getSecondInput = Selector(
      () => document.querySelectorAll(".sv_q_text_root")[1]
    );

    await t.hover(getFirstTitle).hover(getSecondTitle);

    await t
      .typeText(getFirstInput, "wombat")
      .typeText(getSecondInput, "wombat@mail.mail")
      .click("input[value=\"Next\"]");

    await t
      .hover(getThirdTitle)
      .typeText("textarea", "fresh grasses")
      .click("input[value=\"Complete\"]")
      .expect(Selector(".sv_completed_page").textContent).eql(getcompletedHtml);
  });
});
