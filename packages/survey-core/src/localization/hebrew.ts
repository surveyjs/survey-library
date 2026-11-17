import { setupLocale } from "survey-core";

export var hebrewSurveyStrings = {
  // "Previous"
  pagePrevText: "אחורה",
  // "Next"
  pageNextText: "קדימה",
  // [Auto-translated] "First"
  pageFirstText: "ראשונה",
  // [Auto-translated] "Last"
  pageLastText: "אחרון",
  // [Auto-translated] "of {0}"
  pagerTotalText: "של {0}",
  // [Auto-translated] "Select Page"
  pagerSelectPageTitle: "Select Page",
  // [Auto-translated] "Sort by {0}"
  sortByColumnText: "מיין לפי {0}",
  // [Auto-translated] "High - Low"
  sortHighLowText: "גבוה-נמוך",
  // [Auto-translated] "Low - High"
  sortLowHighText: "נמוך - גבוה",
  // [Auto-translated] "Alphabet, A - Z"
  sortAZText: "אלפבית, A - Z",
  // [Auto-translated] "Alphabet, Z - A"
  sortZAText: "אלפבית, Z - A",
  // [Auto-translated] "Newest first"
  sortNewestFirstText: "החדש הראשון",
  // [Auto-translated] "Oldest first"
  sortOldestFirstText: "הראשונה הוותיקה ביותר",
  // [Auto-translated] "Sorted by {0}"
  sortOrderText: "ממויין לפי {0}",
  // [Auto-translated] "{0} ({1})"
  sortOrderLevelText: "{0} ({1})",
  // [Auto-translated] "{0}, then by {1}"
  sortOrderNextText: "{0}, ואז עד {1}",
  // [Auto-translated] "Sort by"
  sortByText: "מיין לפי",
  // [Auto-translated] "Default"
  sortDefaultText: "ברירת מחדל",
  // [Auto-translated] "Sort field"
  sortFieldAriaLabel: "שדה מיון",
  // [Auto-translated] "Sort order"
  sortDirectionAriaLabel: "סדר מיון",
  // [Auto-translated] "Add sort level"
  sortAddLevelText: "הוספת רמת מיון",
  // [Auto-translated] "Remove sort level {0}"
  sortRemoveLevelText: "הסר את רמת המיון {0}",
  // [Auto-translated] "Sort field {0}"
  sortLevelFieldAriaLabel: "שדה מיון {0}",
  // [Auto-translated] "Sort order {0}"
  sortLevelDirectionAriaLabel: "סדר מיון {0}",
  // [Auto-translated] "Show all sort levels"
  sortMoreAriaLabel: "הצג את כל רמות המיון",
  // [Auto-translated] "Add New"
  sortAddNewText: "הוסף חדש",
  // [Auto-translated] "Move sort level {0}"
  sortMoveLevelAriaLabel: "מיון מהלך ברמת {0}",
  // "Complete"
  completeText: "סיום",
  // "Preview"
  previewText: "תצוגה מקדימה",
  // "Edit"
  editText: "לַעֲרוֹך",
  // "Start"
  startSurveyText: "הַתחָלָה",
  // [Auto-translated] "Please leave a comment"
  commentText: "אנא השאירו תגובה",
  // "Other (describe)"
  otherItemText: "אחר (נא לתאר)",
  // "None"
  noneItemText: "אף אחד",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "מסרבים לענות",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "לא יודע",
  // "Select All"
  selectAllItemText: "בחר הכל",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "בטל את הבחירה בהכל",
  // "Page {0} of {1}"
  progressText: "דף {0} מתוך {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} מתוך {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "הקלטה {0} מתוך {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "לוח {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "ענה על שאלות",
  // [Auto-translated] "Question {0} of {1}"
  questionPositionProgressText: "שאלה {0} {1}",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "אין שאלות",
  // "Thank you for completing the survey"
  completingSurvey: "תודה על מילוי השאלון!",
  // "You have already completed this survey."
  completingSurveyBefore: "הרשומות שלנו מראות שכבר סיימת את הסקר הזה.",
  // "Loading Survey..."
  loadingSurvey: "טעינה מהשרת...",
  // "Select..."
  placeholder: "בחר...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "בחר...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "בחר...",
  // "value"
  value: "ערך",
  // "Response required."
  requiredError: "אנא השב על השאלה",
  // [Auto-translated] "You must select Yes to continue."
  requireTrueError: "עליך לבחור כן כדי להמשיך.",
  // [Auto-translated] "The value is incorrect."
  incorrectValueError: "הערך שגוי.",
  // [Auto-translated] "The value contains unknown keys: {0}."
  incorrectValueUnknownKeysError: "הערך מכיל מפתחות לא ידועים: {0}.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "אנא ענה לפחות על שאלה אחת.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "אנא ענה על שאלות בכל השורות.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "לכל שורה חייב להיות ערך ייחודי.",
  // "The value should be numeric."
  numericError: "התשובה צריכה להיות מספר.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "הערך לא צריך להיות קטן מ {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "הזן ערך התואם לגודל הצעד של {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "הערך לא צריך להיות גדול מ- {0}",
  // [Auto-translated] "Invalid input"
  invalidInputError: "קלט שגוי",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "מספרים אינם מותרים.",
  // [Auto-translated] "Please complete the value to match the required format."
  incompletePatternError: "אנא מלא את הערך כדי להתאים לפורמט הנדרש.",
  // "Please enter at least {0} character(s)."
  textMinLength: "הזן לפחות {0} תווים.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "הזן פחות מ- {0} תווים.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "הזן יותר מ- {0} ופחות מ- {1} תווים.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "אנא מלא לפחות {0} שורות.",
  // "Please select at least {0} option(s)."
  minSelectError: "בחר לפחות {0} אפשרויות.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "בחר עד {0} אפשרויות.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' חייב להיות שווה או גדול מ {1}, ושווה ל- {2} או פחות מ- {}}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' חייב להיות שווה או גדול מ {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' חייב להיות שווה או קטן מ {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "הזן כתובת דוא\"ל חוקית.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "הביטוי: {0} צריך להחזיר 'אמת'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "הבקשה החזירה את השגיאה '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "הבקשה החזירה נתונים ריקים או שהמאפיין 'נתיב' שגוי",
  // "The file size should not exceed {0}."
  exceedMaxSize: "גודל הקובץ לא יעלה על {0}.",
  // [Auto-translated] "Bytes, KB, MB, GB, TB"
  fileSizeUnits: "בתים, KB, MB, GB, TB",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "המספר המקסימלי של קבצים שאתה יכול להעלות הוא {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "לא ניתן להעלות קבצים. אנא הוסף מטפל לאירוע 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "נא להזין נתונים בשדה \"אחר\"",
  // [Auto-translated] "The value '{0}' is not one of the available choices."
  variableValueNotInChoices: "הערך '{0}' אינו אחת מהאפשרויות הזמינות.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "הקובץ שלך נטען. המתן מספר שניות ונסה שוב.",
  // "Loading..."
  loadingFile: "טוען...",
  // "Choose file(s)..."
  chooseFile: "לבחור קבצים...",
  // "No file selected"
  noFileChosen: "לא נבחר קובץ",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "גרור ושחרר קובץ כאן או לחץ על הכפתור למטה כדי לבחור קובץ להעלאה.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "האם אתה רוצה למחוק את הרשומה?",
  // "This value should be unique."
  keyDuplicationError: "ערך זה צריך להיות ייחודי.",
  // "Add Column"
  addColumn: "הוסף עמודה",
  // "Add Row"
  addRow: "להוסיף שורה",
  // "Remove"
  removeRow: "לְהַסִיר",
  // [Auto-translated] "Move row {0}"
  moveRowAriaLabel: "הזז שורה {0}",
  // [Auto-translated] "There are no rows."
  noRowsText: "אין שורות.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "שורה {rowIndex}",
  // [Auto-translated] "{rowTitle}"
  rowNameTemplateTitle: "{כותרת_שורה}",
  // "Add new"
  addPanel: "הוסף חדש",
  // "Remove"
  removePanel: "לְהַסִיר",
  // [Auto-translated] "Show Details"
  showDetails: "הראה פרטים",
  // [Auto-translated] "Hide Details"
  hideDetails: "הסתר פרטים",
  // "item"
  choices_Item: "פריט",
  // [Auto-translated] "Choice option"
  choices_Choice: "אפשרות בחירה",
  // "Column"
  matrix_column: "טור",
  // "Row"
  matrix_row: "שׁוּרָה",
  // [Auto-translated] "text"
  multipletext_itemname: "טקסט",
  // "The results are being saved on the server..."
  savingData: "התוצאות נשמרות בשרת ...",
  // "An error occurred and we could not save the results."
  savingDataError: "אירעה שגיאה ולא הצלחנו לשמור את התוצאות.",
  // "The results were saved successfully!"
  savingDataSuccess: "התוצאות נשמרו בהצלחה!",
  // "Try again"
  saveAgainButton: "נסה שוב",
  // "min"
  timerMin: "דקה",
  // "sec"
  timerSec: "שניות",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "הוצאת {0} בדף זה ובסך הכל {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "הוצאת {0} בדף זה.",
  // "You have spent {0} in total."
  timerSpentSurvey: "הוצאת סכום כולל של {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "הוצאת {0} מתוך {1} בדף זה ו- {2} מתוך {3} בסך הכל.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "הוצאת {0} מתוך {1} בדף זה.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "הוצאת סכום כולל של {0} מתוך {1}.",
  // "Clear"
  clearCaption: "לנקות",
  // [Auto-translated] "Select"
  selectCaption: "בחר",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "חתום כאן",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "אין חתימה",
  // "Select File"
  chooseFileCaption: "בחר קובץ",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "צלם תמונה",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "לחץ על הלחצן למטה כדי לצלם תמונה באמצעות המצלמה.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "גרור ושחרר או בחר קובץ כדי להעלות או לצלם תמונה באמצעות המצלמה.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "החלפת קובץ",
  // "Remove this file"
  removeFileCaption: "הסר קובץ זה",
  // "Yes"
  booleanCheckedLabel: "כן",
  // "No"
  booleanUncheckedLabel: "לא",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "האם אתה בטוח שברצונך להסיר קובץ זה: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "האם אתה בטוח שברצונך להסיר את כל הקבצים?",
  // "Question Title"
  questionTitlePatternText: "כותרת שאלה",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "ביטל",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "החל",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "הקלד כדי לחפש...",
  // [Auto-translated] "No data to display"
  emptyMessage: "אין נתונים להצגה",
  // [Auto-translated] "Loading..."
  loadingPage: "טעינת...",
  // [Auto-translated] "Loading..."
  loadingData: "טעינת...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "עדיין אין כניסות.\nלחץ על הכפתור למטה כדי להוסיף ערך חדש.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "אין כניסות",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "פאנל חדש",
  // [Auto-translated] "More"
  more: "עוד",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "אוקיי",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "כל האפשרויות נבחרות לדירוג",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "גרור אפשרויות לכאן כדי לדרג אותן",
  // [Auto-translated] "OK"
  ok: "אוקיי",
  // [Auto-translated] "Cancel"
  cancel: "ביטל",
  // "Create \"{0}\" item..."
  createCustomItem: "צור פריט \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "תוכן עניינים",
  // [Auto-translated] "Progress bar"
  progressbar: "מד התקדמות",
  // [Auto-translated] "Page {0}"
  progressbarPage: "עמוד {0}",
  // [Auto-translated] "Empty"
  conditionOperatorEmpty: "ריק",
  // [Auto-translated] "Not empty"
  conditionOperatorNotempty: "לא ריק",
  // [Auto-translated] "Equals"
  conditionOperatorEqual: "שווים",
  // [Auto-translated] "Does not equal"
  conditionOperatorNotequal: "לא שווה",
  // [Auto-translated] "Contains"
  conditionOperatorContains: "מכיל",
  // [Auto-translated] "Does not contain"
  conditionOperatorNotcontains: "אינו מכיל",
  // [Auto-translated] "Any of"
  conditionOperatorAnyof: "כל אחד מ-",
  // [Auto-translated] "None of"
  conditionOperatorNoneof: "אף אחד מ-",
  // [Auto-translated] "All of"
  conditionOperatorAllof: "הכל",
  // [Auto-translated] "Greater than"
  conditionOperatorGreater: "גדול מ",
  // [Auto-translated] "Less than"
  conditionOperatorLess: "פחות מ",
  // [Auto-translated] "Greater than or equal to"
  conditionOperatorGreaterorequal: "גדול או שווה ל-",
  // [Auto-translated] "Less than or equal to"
  conditionOperatorLessorequal: "קטן או שווה ל-",
  // [Auto-translated] "Save"
  filterSave: "שמור",
  // [Auto-translated] "Filters"
  filterFilters: "מסננים",
  // [Auto-translated] "Filters: {0}"
  filterFiltersCount: "מסננים: {0}",
  // [Auto-translated] "Filters"
  filterDialogTitle: "מסננים",
  // [Auto-translated] "Search"
  filterSearchLabel: "חיפוש",
  // [Auto-translated] "Search by {0}"
  filterSearchPlaceholder: "חיפוש לפי {0}",
  // [Auto-translated] "Show More"
  filterShowMore: "הצג עוד",
  // [Auto-translated] "Show Less"
  filterShowLess: "הצג פחות",
  // [Auto-translated] "Clear All"
  filterClearAll: "נקה הכל",
  // [Auto-translated] "Clear {0}"
  filterClearChip: "נקה {0}",
  // [Auto-translated] "Preset"
  filterPreset: "פריסט",
  // [Auto-translated] "Save as..."
  filterSaveAs: "חסוך כ...",
  // [Auto-translated] "Save"
  filterSaveAsSave: "שמור",
  // [Auto-translated] "Add \"{0}\"..."
  filterAddCustomValue: "הוסף \"{0}\"...",
  // [Auto-translated] "Presets"
  filterPresetsTitle: "פריסטים",
  // [Auto-translated] "Show {0} items"
  filterShowResultsCount: "הצג פריטים {0}",
  // [Auto-translated] "Show 1 item"
  filterShowOneResult: "הצג פריט אחד",
  // [Auto-translated] "Show results"
  filterShowResults: "הצג תוצאות",
  // [Auto-translated] "New Preset"
  filterAddPresetTitle: "פריסט חדש",
  // [Auto-translated] "Name"
  filterPresetName: "שם",
  // [Auto-translated] "Contains"
  filterPresetContains: "מכיל",
  // [Auto-translated] "A preset with this name already exists."
  filterPresetTitleExists: "פריסט בשם זה כבר קיים.",
  // [Auto-translated] "Add at least one condition."
  filterPresetNoConditions: "הוסף לפחות תנאי אחד.",
  // [Auto-translated] "Enter an expression."
  filterPresetNoExpression: "הזן ביטוי.",
  // [Auto-translated] "The expression is not valid."
  filterPresetInvalidExpression: "הביטוי אינו תקף.",
  // [Auto-translated] "Edit as Expression"
  filterEditAsText: "ערוך כביטוי",
  // [Auto-translated] "Edit as Tagbox"
  filterEditAsFields: "ערוך כתיבת תגיות",
  // [Auto-translated] "Type an expression here..."
  filterExpressionPlaceholder: "הקלד כאן ביטוי...",
  // [Auto-translated] "Edit Preset"
  filterEditPreset: "ערוך פריסט",
  // [Auto-translated] "Delete"
  filterDeletePreset: "מחק",
  // [Auto-translated] "Add New..."
  filterAddPreset: "הוסף חדש...",
  // [Auto-translated] "Edit Selected..."
  filterEditSelected: "ערוך נבחר...",
  // [Auto-translated] "{0} Expression"
  filterPresetExpression: "ביטוי {0}",
  // [Auto-translated] "Edit..."
  filterEditExpression: "עריכה...",
  // [Auto-translated] "Search in Filters"
  filterSearchInFilters: "חיפוש במסננים",
  // [Auto-translated] "Nothing found, try different keywords"
  filterNothingFound: "לא נמצא כלום, נסה מילות מפתח שונות",
  // [Auto-translated] "Create preset with AI"
  filterAiPromptNew: "צור פריסט עם בינה מלאכותית",
  // [Auto-translated] "Edit preset with AI"
  filterAiPromptEdit: "ערוך פריסט עם בינה מלאכותית",
  // [Auto-translated] "For example, “Coffee & Tea from Germany”"
  filterAiPromptPlaceholder: "לדוגמה, \"קפה ותה מגרמניה\"",
  // [Auto-translated] "Create"
  filterAiCreate: "צור",
  // [Auto-translated] "Edit"
  filterAiEdit: "עריכה",
  // [Auto-translated] "Creating..."
  filterAiCreating: "יוצר...",
  // [Auto-translated] "Editing..."
  filterAiEditing: "עריכה...",
  // [Auto-translated] "AI could not make a filter. Try again."
  filterAiError: "בינה מלאכותית לא הצליחה ליצור פילטר. נסה שוב.",
  // [Auto-translated] "AI could not make a filter of this description."
  filterAiEmpty: "ה-AI לא הצליח ליצור מסנן לתיאור הזה.",
  // [Auto-translated] "to select"
  keyboardHintSelectText: "לבחור",
  // [Auto-translated] "to toggle"
  keyboardHintToggleText: "להחליף",
  // [Auto-translated] "to navigate"
  keyboardHintNavigateText: "לנווט",
  // [Auto-translated] "to continue"
  keyboardHintContinueText: "להמשיך",
  // [Auto-translated] "to submit"
  keyboardHintSubmitText: "להגיש",
  // [Auto-translated] "or"
  keyboardHintOrText: "או",
  // [Auto-translated] "for a new line"
  keyboardHintNewLineText: "לקו חדש",
  // [Auto-translated] "to next option"
  keyboardHintNextItemText: "לאפשרות הבאה",
  // [Auto-translated] "to move"
  keyboardHintMoveText: "לזוז",
  // [Auto-translated] "to open"
  keyboardHintOpenText: "לפתוח",
  // [Auto-translated] "to close"
  keyboardHintCloseText: "לסיים"
};

setupLocale({ localeCode: "he", strings: hebrewSurveyStrings, nativeName: "עברית", englishName: "Hebrew", rtl: true });
