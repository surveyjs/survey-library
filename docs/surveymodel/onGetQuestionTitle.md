`onGetQuestionTitle` event calls every time the survey needs to render the title. You may use it to modify the question title before rendering.
The example below shows how to create custom question numbering using this event.
By default you may numbering question though all survey or by page, starting from a number or char based on `survey.questionStartIndex` property.
Let's say you want to have the following numbering in question: {PageNo}.{QuestionVisibleNoOnPageAsChar}. For example the third question on the second page will be as: `2.c.`.
Here is the code you need to write:
```js
// Turn off the default showQuestionNumbers;
survey.showQuestionNumbers = "off";
// Use the event to generate the question number as {pageNo}.{questionNoOnPage}
// Where questionNoOnPage starts with 'a'
survey.onGetQuestionTitle.add(function(sender, options){
    var index = getQuestionIndexOnPage(options.question, true);
    if(index < 0) return;
    questionChar = String.fromCharCode("a".charCodeAt(0) + index);
    options.title = (options.question.page.visibleIndex + 1) + '.' + questionChar + ". " + options.title;
});
//get question index on its page, set the second parameter to true to get the index from visible questions only
function getQuestionIndexOnPage(question, onlyVisible) {
    if(!onlyVisible) return question.page.questions.indexOf(question);
    var list = [];
    //get only visbile questions
    question.page.addQuestionsToList(list, true);
    return list.indexOf(question);
}
```
Here is [the full example](https://plnkr.co/edit/ORVE7ZO5B3SzaBPW) of this functionality.
