# Position-based progress in questionPerPage and inputPerPage

Issue: [surveyjs/survey-library#11938](https://github.com/surveyjs/survey-library/issues/11938)

In `questionPerPage` and `inputPerPage`, the progress bar shows the current screen divided by the number of screens the survey already walks. It does not show how many questions have been answered. `standard` and `singlePage` keep their current progress behavior.

The bar and the tag on its right stay as they are. The Figma frames (file `SSMZUWJve1zuMSeA5E5YpA`, nodes `6218:17942` and `6218:18227`) match that bar: screen 1 of 4 fills a quarter and reads "Question 1 of 4"; screen 4 of 4 fills the bar and reads "Question 4 of 4".

## Calculation

This lives in `survey-core`. UI packages keep rendering the existing linear bar.

While the survey is running in `questionPerPage` or `inputPerPage`, `getProgress()` and `progressText` use the screen position. A stored `progressBarType` does not change the formula. In design mode the survey does not walk one screen at a time, so progress stays page-based.

One method returns the position: the current screen, starting at 1, and the total number of screens.

`questionPerPage` uses the same list Next and Previous already use: visible top-level elements on visible pages, excluding the start page. A panel is one screen. The legacy `questionOnPage` value uses this same list.

`inputPerPage` uses that same outer list. Each question then adds as many screens as its single-input navigation produces: one screen for an ordinary question, and one screen per visible input that exists now for a matrix, Multiple Text, or a choice with nested questions. A summary screen counts when navigation stops on it. An input that already has a value stays in the list. The unfinished-record filter used to decide which dynamic row to open is not the progress total.

`visibleIf`, a new or removed matrix row, or a choice that reveals a nested question changes the total, because the screen list itself changed.

The percentage is `Math.floor(current * 100 / total)`.

| Position | Percentage | Text |
| --- | --- | --- |
| 1 of 4 | 25 | Question 1 of 4 |
| 4 of 4 | 100 | Question 4 of 4 |
| 1 of 3 | 33 | Question 1 of 3 |
| 1 of 1 | 100 | Question 1 of 1 |

When the total is 0, or the current element is not in the list, the percentage is 0 and the text is empty.

The text comes from a new English string, `questionPositionProgressText`: `"Question {0} of {1}"`, added to `englishStrings`. Other locales fall back to English until they define the key. `{0}` is the current screen and `{1}` is the total.

`onGetProgressText` still runs. Its `text` starts as the position string, and the event can replace it. The event still receives `questionCount`, `answeredQuestionCount`, `requiredQuestionCount`, and `requiredAnsweredQuestionCount` from `getProgressInfo()`.

`getProgressTypeComponent()` stays `sv-progress-questions`, and the root CSS modifier stays `sd-progress--questions`, so the linear bar is used and the page-button view is not. `getEffectiveProgressBarType()` returns `"questions"` in these two running modes for that same reason. The returned type selects the bar. It does not select the answered-question formula.

## Visibility

`questionPerPage` and `inputPerPage` show and hide the bar under the same conditions.

The bar is visible when all of the following hold:

- The survey state is `running`.
- `showProgressBar` is true.
- The current page is not the start page.
- `progressBarLocation` places the bar on top, on the bottom, or both, using the existing header and table-of-contents placement.
- The existing preview rule still allows it (`canShowProgressBar`).

`progressBarType` does not affect visibility. The current `inputPerPage` exception, which hides the bar unless `progressBarType` is `"questions"`, is removed. `singlePage` keeps its current rule, including that exception.

Both modes render the linear bar. Page buttons are not shown.

## Property grid

When `questionsOnPageMode` is `questionPerPage`, `inputPerPage`, or the legacy `questionOnPage`, and `showProgressBar` is true, the property grid hides:

- `progressBarType`
- `progressBarShowNavigationText`
- `progressBarShowPageNumbers`
- `progressBarNavigationTextLocation`
- `progressBarInheritWidthFrom`

Those page-button settings stay hidden even when the stored `progressBarType` is `"pages"`. `showProgressBar` and `progressBarLocation` stay visible.

For an advanced header, `progressBarLocation` omits `belowHeader` in these modes, the same way it does for the linear bar today. A value already stored as `belowHeader` is left as stored.

Switching the mode does not delete `progressBarType` or the page-button settings. In `standard` they apply again.

## Updates

The position is recalculated when the respondent moves to another screen. In `questionPerPage` that is a change of the current element. In `inputPerPage` that is a change of question or a move to the next input inside the same question. The inner move already refreshes Next and Previous through `updateNavigationElements`; progress refreshes on that same path.

A value change also recalculates progress. Answering does not move the position by itself. The same update covers list changes from `visibleIf`, added or removed rows, and nested questions of a selected choice. Locale changes, `questionsOnPageMode` changes, and page-list changes recalculate progress as they do today.

The value-change path must run in these modes. It must not take the early return that skips an update when the effective type is `"pages"`.

If the list did not change, the recalculation produces the same numbers.

## Edge cases

- Design mode keeps page progress, because one-screen navigation is off. The property grid still hides `progressBarType` and the page-button settings when the survey's `questionsOnPageMode` is one of the two modes.
- One screen reads "Question 1 of 1" and fills the bar.
- No current screen, an empty list, or a current element outside the list yields percentage 0 and empty text.
- The start page is not a screen.
- In `questionPerPage`, an HTML, image, or expression element is a screen when Next stops on it. A panel is one screen.
- In `inputPerPage`, questions inside a panel are separate screens. A dynamic matrix or dynamic panel summary is a screen when navigation stops on it. Answered inputs remain in the total.
- A stored `progressBarType` of `"questions"`, `"requiredQuestions"`, or `"correctQuestions"` does not change the text, the percentage, or visibility in these two modes, and it is not removed. It applies again in `standard`.
- `singlePage` is unchanged.

## Tests

Unit tests in `survey-core` cover this. Markup snapshots and browser tests are not required, because the bar component does not change.

Existing tests that expect answered-question progress in `questionPerPage`, or a hidden bar in `inputPerPage`, are updated to the position rules. The test where skipping an optional question leaves the bar unchanged is inverted: moving forward changes the position, and answering without moving does not.

New cases:

- Screen 1 of 4 is 25 and "Question 1 of 4". Screen 4 of 4 is 100. One screen is 100 and "Question 1 of 1". An empty list, and a current element outside the list, are 0 and empty text.
- A panel in `questionPerPage` is one step. An element hidden by `visibleIf` is outside the total until it becomes visible.
- In `inputPerPage`, moving to the next input inside the same question advances the position. Adding a row increases the total. An input that already has a value stays in the list.
- Both modes show and hide the bar under the same conditions. `singlePage` still hides it. Design mode keeps page progress.
- `progressBarType` values `questions`, `requiredQuestions`, and `correctQuestions` do not affect text, percentage, or visibility in these modes. The stored value works again in `standard`.
- The property grid hides the type and the page-button settings in these modes. An advanced header does not offer `belowHeader`.
- `onGetProgressText` can replace the text. Changing `questionsOnPageMode` at runtime switches the formula.

## Out of scope

- Restyling the bar or the tag.
- Changing progress in `standard` or `singlePage`.
- Removing `progressBarType` from the survey model.
- Translating `questionPositionProgressText` into every locale.
