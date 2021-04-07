import { QuestionButtonGroupModel, Serializer } from "@/question_buttongroup.ts"


var json = {
    questions: [
        {
            type: "buttongroup",
            name: "radio",
            title: "Question with Button Group",
            renderAs: "button-group",
            choices: ["Choice 1", "Choice 2"],
        },
    ],
};
test("bg", () => {
    console.log(new QuestionButtonGroupModel())
    expect(1).toBe(1)
})