# Keyboard hints

Hints under a question name the keyboard commands that already select a value or confirm it. A chip is shown only when that command would do that action now. Issue: [surveyjs/survey-library#11587](https://github.com/surveyjs/survey-library/issues/11587).

## API

`survey.showKeyboardHints: boolean`, default `false`, serialized on `SurveyModel` the same way as `choiceShortcutsEnabled`. There is no per-question override.

Letter badges stay on `choiceShortcutsEnabled`. This flag does not turn them on, and `choiceShortcutsEnabled` does not render this row.

No new key handlers. Long Text already inserts a line on Shift+Enter and confirms on Enter when auto-advance accepts it. The hint reports that behavior.

## Model

`Question.getKeyboardHints(): IKeyboardHint[]`.

The base implementation returns `[]`. A question type overrides it and calls the same checks as its key handler. The renderer does not decide which chip is active. The method does not read DOM focus, and it does not call `requestAutoAdvance` or `tryGoNextPageAutomaticCore`. Those methods schedule navigation.

Return `[]` when any of these is true:

- `showKeyboardHints` is not `true`
- the question is in design mode
- the question is read-only or in preview (`isReadOnly`)
- `inMatrixMode` is `true`
- the question has no survey, or a dropdown-like question has no popup model yet

Otherwise return every slot the question can show under the current survey settings, including slots that are currently inactive. An inactive slot stays in the array so the row width does not change.

```ts
interface IKeyboardHintKey {
  label: string;
  shortcut: string;
  visible: boolean;
}

interface IKeyboardHint {
  keys: IKeyboardHintKey[];
  text: string;
}
```

`label` is the chip face. `shortcut` is the `aria-keyshortcuts` token. `text` is the localized action, already resolved. `visible` is `false` when the key would not perform that action right now.

A group with two keys puts the localized word “or” between them. If one key is inactive, “or” is inactive too. Both keep their layout boxes.

Chip order inside a question is the order in the table below.

## Where the row is rendered

The row is the last child of the question content, after the input and the comment, above the error block. React, Vue, Angular, and the framework-free renderer all read `getKeyboardHints()` and render the same structure. A composite question does not add a second row; the inner question that owns the keys returns the list.

Questions on a page, in a panel, and in a dynamic panel row get a row. A question inside a matrix cell does not.

## Rendering

Reuse `.sd-item__shortcut-key` for each chip: height 24, radius 4, padding 4 by 8, semibold 12/16, and the existing `--sjs2-color-component-shortcut-key-*` tokens. The action label is regular 12/16. Gap between a chip and its label is 8px. Gap between hint groups is 24px. The row has 12px padding at the bottom. The row class is `sd-question__keyboard-hints`.

An inactive chip, and an inactive “or”, use `visibility: hidden`. They are not removed from the layout. The row does not animate.

For dropdown and tagbox the row is wide enough for both popup states. Switching the popup hides and shows chips inside that reserved width.

The row has `aria-hidden="true"`. Each choice input, or the question’s single input, gets `aria-keyshortcuts` built from the shortcuts of the visible keys that apply to that control.

## Key faces

These faces are not localized.

| Face | `aria-keyshortcuts` |
|---|---|
| `Enter ↵` | `Enter` |
| `Space` | `Space` |
| `Shift+Enter` | `Shift+Enter` |
| `Tab` | `Tab` |
| `Esc` | `Escape` |
| `↓` | `ArrowDown` |
| `↑↓` | `ArrowUp ArrowDown` |
| `↑↓←→` | `ArrowUp ArrowDown ArrowLeft ArrowRight` |

## Localized actions

Add these keys to `packages/survey-core/src/localization/english.ts` and to every other file in that folder. English is the source. Other dictionaries include a translation, with the English phrase in the comment. Missing keys already fall back to English; the keys are still added everywhere so each shipped dictionary contains them.

| Key | English |
|---|---|
| `keyboardHintSelectText` | to select |
| `keyboardHintSubmitText` | to submit |
| `keyboardHintOrText` | or |
| `keyboardHintNewLineText` | to add a line |
| `keyboardHintNextItemText` | to the next item |
| `keyboardHintMoveText` | to move |
| `keyboardHintOpenText` | to open |
| `keyboardHintCloseText` | to close |

## Hint table

A slot exists only in the situations listed. `visible` follows the last column. “Always” means the slot exists and is visible whenever the row itself exists.

| Question | Chip | Action | Visible when |
|---|---|---|---|
| Radio | `↑↓←→` | to select | always |
| Radio | `Enter ↵` | to submit | `autoAdvanceEnabled` is on, the value is not empty, and the selected item does not show a comment area. The slot exists whenever `autoAdvanceEnabled` is on |
| Image picker, single | `↑↓←→` | to select | always. The input type is `radio` |
| Image picker, single | `Enter ↵` | to submit | `autoAdvanceEnabled` is on and the value is not empty. The slot exists whenever `autoAdvanceEnabled` is on |
| Checkbox | `Tab` | to the next item | always |
| Checkbox | `Space` | to select | always |
| Checkbox | `Enter ↵` | to submit | `autoAdvanceEnabled` is on and the value is not empty. The slot exists whenever `autoAdvanceEnabled` is on |
| Image picker, `multiSelect` | `Tab` | to the next item | always. The input type is `checkbox` |
| Image picker, `multiSelect` | `Space` | to select | always |
| Image picker, `multiSelect` | `Enter ↵` | to submit | `autoAdvanceEnabled` is on and the value is not empty. The slot exists whenever `autoAdvanceEnabled` is on |
| Boolean, radio or switch | `↑↓←→` | to select | always |
| Boolean, checkbox | `Space` | to select | always |
| Boolean, checkbox | `Enter ↵` | to submit | `autoAdvanceEnabled` is on and the value is not empty. Enter confirms from the checkbox. The slot exists whenever `autoAdvanceEnabled` is on |
| Dropdown | `↓` | to open | the popup is closed. The slot always exists |
| Dropdown | `Space`, `Enter ↵` | to select | the popup is open. `Space` is hidden while it would type into the search. `Enter` is hidden while it would clear the value instead of selecting. The slot always exists |
| Dropdown | `Esc` | to close | the popup is open and the popup is closed |
| Tagbox | `↓` | to open | same rule as dropdown |
| Tagbox | `Enter ↵` | to submit | the popup is closed, `autoAdvanceEnabled` is on, and the value is not empty. The slot exists whenever `autoAdvanceEnabled` is on |
| Tagbox | `Space`, `Enter ↵` | to select | the popup is open. `Space` is hidden while it would type into the search. `Enter` stays visible while the popup is open, including when dropdown would clear on Enter. The slot always exists |
| Tagbox | `Esc` | to close | the popup is open and the popup is closed |
| Rating | `Enter ↵` | to submit | `autoAdvanceEnabled` is on and the question is editable. Enter commits the focused item and auto-advance moves on. Digits stay on the rating buttons and are not repeated here |
| Ranking | `Tab` | to the next item | always |
| Ranking | `↑↓` | to move | always. Left and right do not move an item |
| Ranking | `Space` | to select | `selectToRank` is on. The slot exists only in that mode |
| Ranking | `Enter ↵` | to submit | `autoAdvanceEnabled` is on and the value is not empty. The slot exists whenever `autoAdvanceEnabled` is on |
| Single-line text | `Enter ↵` | to submit | the input supports auto-advance, `autoAdvanceEnabled` is on, and the value is not empty. The slot exists when both of those settings allow it. Date input and text that updates while typing have no slot |
| Long text | `Shift+Enter` | to add a line | `autoAdvanceEnabled` is on, the device is not touch, and `acceptCarriageReturn` is on. The slot exists only in that case |
| Long text | `Enter ↵` | to submit | `autoAdvanceEnabled` is on, the device is not touch, the value is not empty, and the pre-timer checks in `tryGoNextPageAutomaticCore` would schedule navigation. The hint reads that decision through a method that does not start the timer. The slot exists whenever `autoAdvanceEnabled` is on and the device is not touch |
| Matrix as a whole, and every other question type | — | — | no row |

`Backspace` is not a hint. Closed dropdown Enter stays `enterKeyAction` and is not a submit hint.

Radio and single image picker change the value with the arrow keys, which is the native radio-group behavior. Checkbox and multi-select image picker move between items with Tab; Space checks the focused item. Boolean rendered as radio or switch uses the arrow keys. Boolean rendered as a checkbox uses Space.

Ranking moves between items with Tab. Up and down change an item’s position. With `selectToRank`, Space also takes an item into the list or puts it back.

Dropdown and tagbox open the popup with ArrowDown. Enter and Space select while the popup is open, except where the table hides a key. Escape closes the popup, and that chip stays visible while the popup is closed as well. ArrowDown’s chip stays in the row and becomes hidden while the popup is open. There is no separate hint for moving the highlight.

## Tests

Unit tests in survey-core cover `getKeyboardHints()` for every row of the table: which slots exist, and which keys are `visible`, for an empty value, a filled value, an open popup, a closed popup, `autoAdvanceEnabled` turned off, a touch device for Long Text, and `acceptCarriageReturn: false`.

One test checks that `showKeyboardHints` does not create letter badges, and that `choiceShortcutsEnabled` does not create this row.

One markup snapshot covers a radio question: the row is `aria-hidden`, and the Enter chip is present but hidden while the value is empty.

Existing tests keep covering the key handlers. This work does not add an end-to-end run per question type.

## Out of scope

- A hint for a key that does not perform the labeled action.
- New navigation commands, including Backspace to return.
- Hiding the row until the first keydown.
- Per-question `showKeyboardHints`.
- Letter badges. They stay on `choiceShortcutsEnabled`.
