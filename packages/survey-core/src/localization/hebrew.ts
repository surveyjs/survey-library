import { setupLocale } from "survey-core";

export var hebrewSurveyStrings = {
  // "Previous"
  pagePrevText: "אחורה",
  // "Next"
  pageNextText: "קדימה",
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
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "הערך לא צריך להיות גדול מ- {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "מספרים אינם מותרים.",
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
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "לא ניתן להעלות קבצים. אנא הוסף מטפל לאירוע 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "נא להזין נתונים בשדה \"אחר\"",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "הקובץ שלך נטען. המתן מספר שניות ונסה שוב.",
  // "Loading..."
  loadingFile: "טוען...",
  // "Choose file(s)..."
  chooseFile: "לבחור קבצים...",
  // "No file selected"
  noFileChosen: "לא נבחר קובץ",
  // [Auto-translated] "Drag and drop a file here or click the button below and choose a file to upload."
  filePlaceholder: "גרור ושחרר קובץ לכאן או לחץ על הלחצן למטה ובחר קובץ להעלאה.",
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
  // [Auto-translated] "There are no rows."
  noRowsText: "אין שורות.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "שורה {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
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
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner."
  savingExceedSize: "תגובתך עולה על 64KB. הקטן את גודל הקבצים שלך ונסה שוב או פנה לבעלים של סקר.",
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
  // [Auto-translated] "There are no entries yet.\nClick the button below to add a new entry."
  noEntriesText: "אין עדיין ערכים.\nלחץ על הלחצן למטה כדי להוסיף ערך חדש.",
  // [Auto-translated] "There are no entries."
  noEntriesReadonlyText: "אין ערכים.",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "פאנל חדש",
  // [Auto-translated] "More"
  more: "עוד",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "אוקיי",
  // [Auto-translated] "All choices are ranked"
  selectToRankEmptyRankedAreaText: "כל האפשרויות מדורגות",
  // [Auto-translated] "Drag and drop choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "גרור ושחרר אפשרויות לכאן כדי לדרג אותן",
  // [Auto-translated] "OK"
  ok: "אוקיי",
  // [Auto-translated] "Cancel"
  cancel: "ביטל",
  // "Create \"{0}\" item..."
  createCustomItem: "צור פריט \"{0}\"..."
};

setupLocale({ localeCode: "he", strings: hebrewSurveyStrings, nativeName: "עברית", englishName: "Hebrew", rtl: true });