import { setupLocale } from "survey-core";

export var hebrewSurveyStrings = {
  pagePrevText: "אחורה",
  pageNextText: "קדימה",
  completeText: "סיום",
  previewText: "תצוגה מקדימה",
  editText: "לַעֲרוֹך",
  startSurveyText: "הַתחָלָה",
  otherItemText: "אחר (נא לתאר)",
  noneItemText: "אף אחד",
  refuseItemText: "מסרבים לענות",
  dontKnowItemText: "לא יודע",
  selectAllItemText: "בחר הכל",
  deselectAllItemText: "בטל את הבחירה בהכל",
  progressText: "דף {0} מתוך {1}",
  indexText: "{0} מתוך {1}",
  panelDynamicProgressText: "הקלטה {0} מתוך {1}",
  panelDynamicTabTextFormat: "לוח {panelIndex}",
  questionsProgressText: "ענה על שאלות",
  emptySurvey: "אין שאלות",
  completingSurvey: "תודה על מילוי השאלון!",
  completingSurveyBefore: "הרשומות שלנו מראות שכבר סיימת את הסקר הזה.",
  loadingSurvey: "טעינה מהשרת...",
  placeholder: "בחר...",
  ratingOptionsCaption: "בחר...",
  value: "ערך",
  requiredError: "אנא השב על השאלה",
  requiredErrorInPanel: "אנא ענה לפחות על שאלה אחת.",
  requiredInAllRowsError: "אנא ענה על שאלות בכל השורות.",
  eachRowUniqueError: "לכל שורה חייב להיות ערך ייחודי.",
  numericError: "התשובה צריכה להיות מספר.",
  minError: "הערך לא צריך להיות קטן מ {0}",
  maxError: "הערך לא צריך להיות גדול מ- {0}",
  textNoDigitsAllow: "מספרים אינם מותרים.",
  textMinLength: "הזן לפחות {0} תווים.",
  textMaxLength: "הזן פחות מ- {0} תווים.",
  textMinMaxLength: "הזן יותר מ- {0} ופחות מ- {1} תווים.",
  minRowCountError: "אנא מלא לפחות {0} שורות.",
  minSelectError: "בחר לפחות {0} אפשרויות.",
  maxSelectError: "בחר עד {0} אפשרויות.",
  numericMinMax: "'{0}' חייב להיות שווה או גדול מ {1}, ושווה ל- {2} או פחות מ- {}}",
  numericMin: "'{0}' חייב להיות שווה או גדול מ {1}",
  numericMax: "'{0}' חייב להיות שווה או קטן מ {1}",
  invalidEmail: "הזן כתובת דוא\"ל חוקית.",
  invalidExpression: "הביטוי: {0} צריך להחזיר 'אמת'.",
  urlRequestError: "הבקשה החזירה את השגיאה '{0}'. {1}",
  urlGetChoicesError: "הבקשה החזירה נתונים ריקים או שהמאפיין 'נתיב' שגוי",
  exceedMaxSize: "גודל הקובץ לא יעלה על {0}.",
  noUploadFilesHandler: "לא ניתן להעלות קבצים. אנא הוסף מטפל לאירוע 'onUploadFiles'.",
  otherRequiredError: "נא להזין נתונים בשדה \"אחר\"",
  uploadingFile: "הקובץ שלך נטען. המתן מספר שניות ונסה שוב.",
  loadingFile: "טוען...",
  chooseFile: "לבחור קבצים...",
  noFileChosen: "לא נבחר קובץ",
  filePlaceholder: "גרור ושחרר קובץ לכאן או לחץ על הלחצן למטה ובחר קובץ להעלאה.",
  confirmDelete: "האם אתה רוצה למחוק את הרשומה?",
  keyDuplicationError: "ערך זה צריך להיות ייחודי.",
  addColumn: "הוסף עמודה",
  addRow: "להוסיף שורה",
  removeRow: "לְהַסִיר",
  noRowsText: "אין שורות.",
  addPanel: "הוסף חדש",
  removePanel: "לְהַסִיר",
  showDetails: "הראה פרטים",
  hideDetails: "הסתר פרטים",
  choices_Item: "פריט",
  matrix_column: "טור",
  matrix_row: "שׁוּרָה",
  multipletext_itemname: "טקסט",
  savingData: "התוצאות נשמרות בשרת ...",
  savingDataError: "אירעה שגיאה ולא הצלחנו לשמור את התוצאות.",
  savingDataSuccess: "התוצאות נשמרו בהצלחה!",
  savingExceedSize: "תגובתך עולה על 64KB. הקטן את גודל הקבצים שלך ונסה שוב או פנה לבעלים של סקר.",
  saveAgainButton: "נסה שוב",
  timerMin: "דקה",
  timerSec: "שניות",
  timerSpentAll: "הוצאת {0} בדף זה ובסך הכל {1}.",
  timerSpentPage: "הוצאת {0} בדף זה.",
  timerSpentSurvey: "הוצאת סכום כולל של {0}.",
  timerLimitAll: "הוצאת {0} מתוך {1} בדף זה ו- {2} מתוך {3} בסך הכל.",
  timerLimitPage: "הוצאת {0} מתוך {1} בדף זה.",
  timerLimitSurvey: "הוצאת סכום כולל של {0} מתוך {1}.",
  clearCaption: "לנקות",
  signaturePlaceHolder: "חתום כאן",
  signaturePlaceHolderReadOnly: "אין חתימה",
  chooseFileCaption: "בחר קובץ",
  takePhotoCaption: "צלם תמונה",
  photoPlaceholder: "לחץ על הלחצן למטה כדי לצלם תמונה באמצעות המצלמה.",
  fileOrPhotoPlaceholder: "גרור ושחרר או בחר קובץ כדי להעלות או לצלם תמונה באמצעות המצלמה.",
  replaceFileCaption: "החלפת קובץ",
  removeFileCaption: "הסר קובץ זה",
  booleanCheckedLabel: "כן",
  booleanUncheckedLabel: "לא",
  confirmRemoveFile: "האם אתה בטוח שברצונך להסיר קובץ זה: {0}?",
  confirmRemoveAllFiles: "האם אתה בטוח שברצונך להסיר את כל הקבצים?",
  questionTitlePatternText: "כותרת שאלה",
  modalCancelButtonText: "ביטל",
  modalApplyButtonText: "החל",
  filterStringPlaceholder: "הקלד כדי לחפש...",
  emptyMessage: "אין נתונים להצגה",
  noEntriesText: "אין עדיין ערכים.\nלחץ על הלחצן למטה כדי להוסיף ערך חדש.",
  noEntriesReadonlyText: "אין ערכים.",
  tabTitlePlaceholder: "פאנל חדש",
  more: "עוד",
  tagboxDoneButtonCaption: "אוקיי",
  selectToRankEmptyRankedAreaText: "כל האפשרויות מדורגות",
  selectToRankEmptyUnrankedAreaText: "גרור ושחרר אפשרויות לכאן כדי לדרג אותן",
  ok: "אוקיי",
  cancel: "ביטל"
};

setupLocale({ localeCode: "he", strings: hebrewSurveyStrings, nativeName: "עברית", englishName: "Hebrew", rtl: true });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} מתוך {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "לוח {panelIndex}"
// ratingOptionsCaption: "Select..." => "בחר..."
// minError: "The value should not be less than {0}" => "הערך לא צריך להיות קטן מ {0}"
// maxError: "The value should not be greater than {0}" => "הערך לא צריך להיות גדול מ- {0}"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "גרור ושחרר קובץ לכאן או לחץ על הלחצן למטה ובחר קובץ להעלאה."
// noRowsText: "There are no rows." => "אין שורות."
// multipletext_itemname: "text" => "טקסט"
// signaturePlaceHolder: "Sign here" => "חתום כאן"
// modalCancelButtonText: "Cancel" => "ביטל"
// modalApplyButtonText: "Apply" => "החל"
// filterStringPlaceholder: "Type to search..." => "הקלד כדי לחפש..."
// emptyMessage: "No data to display" => "אין נתונים להצגה"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "אין עדיין ערכים.\nלחץ על הלחצן למטה כדי להוסיף ערך חדש."
// noEntriesReadonlyText: "There are no entries." => "אין ערכים."
// more: "More" => "עוד"
// tagboxDoneButtonCaption: "OK" => "אוקיי"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "כל האפשרויות מדורגות"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "גרור ושחרר אפשרויות לכאן כדי לדרג אותן"// takePhotoCaption: "Take Photo" => "צלם תמונה"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "לחץ על הלחצן למטה כדי לצלם תמונה באמצעות המצלמה."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "גרור ושחרר או בחר קובץ כדי להעלות או לצלם תמונה באמצעות המצלמה."
// replaceFileCaption: "Replace file" => "החלפת קובץ"// eachRowUniqueError: "Each row must have a unique value." => "לכל שורה חייב להיות ערך ייחודי."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "לא ניתן להעלות קבצים. אנא הוסף מטפל לאירוע 'onUploadFiles'."
// showDetails: "Show Details" => "הראה פרטים"
// hideDetails: "Hide Details" => "הסתר פרטים"
// ok: "OK" => "אוקיי"
// cancel: "Cancel" => "ביטל"
// refuseItemText: "Refuse to answer" => "מסרבים לענות"
// dontKnowItemText: "Don't know" => "לא יודע"
// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "תגובתך עולה על 64KB. הקטן את גודל הקבצים שלך ונסה שוב או פנה לבעלים של סקר."
// signaturePlaceHolderReadOnly: "No signature" => "אין חתימה"// tabTitlePlaceholder: "New Panel" => "פאנל חדש"// deselectAllItemText: "Deselect all" => "בטל את הבחירה בהכל"
// textNoDigitsAllow: "Numbers are not allowed." => "מספרים אינם מותרים."