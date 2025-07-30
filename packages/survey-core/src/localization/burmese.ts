import { setupLocale } from "survey-core";

export var burmeseStrings = {
  // "Previous"
  pagePrevText: "နောက်သို့",
  // "Next"
  pageNextText: "ရှေ့သို့",
  // "Complete"
  completeText: "ပြီးဆုံးပါပြီ",
  // "Preview"
  previewText: "ကြိုတင်ကြည့်ရှုရန်",
  // "Edit"
  editText: "တည်းဖြတ်ရန်",
  // "Start"
  startSurveyText: "စတင်ရန်",
  // "Other (describe)"
  otherItemText: "အခြား (ဖော်ပြပါ)",
  // "None"
  noneItemText: "ဘာမျှမရှိပါ",
  // "Refuse to answer"
  refuseItemText: "ဖြေဆိုရန်ငြင်းဆန်သည်",
  // "Don't know"
  dontKnowItemText: "မသိပါ",
  // "Select All"
  selectAllItemText: "အားလုံးရွေးချယ်ပါ",
  // "Deselect all"
  deselectAllItemText: "အားလုံးမရွေးချယ်ပါ",
  // "Page {0} of {1}"
  progressText: "စာမျက်နှာ {0}/{1}",
  // "{0} of {1}"
  indexText: "{0}/{1}",
  // "{0} of {1}"
  panelDynamicProgressText: "{0}/{1}",
  // "Panel {panelIndex}"
  panelDynamicTabTextFormat: "ပန်းနယ် {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "မေးခွန်းများ {0}/{1} ဖြေဆိုပြီးပြီ",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "ဒီစစ်တမ်းတွင် မြင်သာမေးခွန်းများမရှိပါ။",
  // "Thank you for completing the survey"
  completingSurvey: "စစ်တမ်းကိုပြီးမြောက်စွာဖြေဆိုပေးခဲ့သည့်အတွက်ကျေးဇူးတင်ပါသည်။",
  // "You have already completed this survey."
  completingSurveyBefore: "ဒီစစ်တမ်းကို မျှဝေပြီးသားဖြေဆိုထားပါသည်။",
  // "Loading Survey..."
  loadingSurvey: "စစ်တမ်းကိုလုပ်ဆောင်နေသည်...",
  // "Select..."
  placeholder: "ရွေးချယ်ပါ...",
  // "Select..."
  ratingOptionsCaption: "ရွေးချယ်ပါ...",
  // "value"
  value: "တန်ဖိုး",
  // "Response required."
  requiredError: "ဖြေဆိုရန်လိုအပ်ပါသည်။",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "ဖြေဆိုရန်လိုအပ်ပါသည် - အနည်းဆုံးတစ်ခုကိုဖြေဆိုပါ။",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "အတန်းအားလုံးတွင်ဖြေဆိုရန်လိုအပ်ပါသည်။",
  // "Each row must have a unique value."
  eachRowUniqueError: "အတန်းတိုင်းတွင်ထပ်တူဖြေဆိုမှုမရှိရပါ။",
  // "The value should be numeric."
  numericError: "တန်ဖိုးသည်ကိန်းဂဏန်းဖြစ်ရပါမည်။",
  // "The value should not be less than {0}"
  minError: "တန်ဖိုးသည် {0} ထက်မနည်းရပါ။",
  // "The value should not be greater than {0}"
  maxError: "တန်ဖိုးသည် {0} ထက်မကျော်ရပါ။",
  // "Numbers are not allowed."
  textNoDigitsAllow: "ကိန်းဂဏန်းများကိုခွင့်မပြုပါ။",
  // "Please enter at least {0} character(s)."
  textMinLength: "အနည်းဆုံး {0} လုံးဖြည့်စွက်ပါ။",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "အများဆုံး {0} လုံးထိသာဖြည့်စွက်ပါ။",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "အနည်းဆုံး {0} နှင့်အများဆုံး {1} လုံးဖြည့်စွက်ပါ။",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "အနည်းဆုံး {0} အတန်းဖြည့်စွက်ပါ။",
  // "Please select at least {0} option(s)."
  minSelectError: "အနည်းဆုံး {0} ရွေးချယ်ချက်များရွေးပါ။",
  // "Please select no more than {0} option(s)."
  maxSelectError: "အများဆုံး {0} ရွေးချယ်ချက်များသာရွေးပါ။",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "‘{0}’ သည် {1} နှင့် {2} အကြားဖြစ်ရမည်။",
  // "The '{0}' should be at least {1}"
  numericMin: "‘{0}’ သည် {1} ထက်မနည်းရပါ။",
  // "The '{0}' should be at most {1}"
  numericMax: "‘{0}’ သည် {1} ထက်မကျော်ရပါ။",
  // "Please enter a valid e-mail address."
  invalidEmail: "တရားဝင်သော အီးမေးလ်လိပ်စာကိုရိုက်ထည့်ပါ။",
  // "The expression: {0} should return 'true'."
  invalidExpression: "အထောက်အထား {0} သည် 'true' ပြန်သင့်သည်။",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "တောင်းဆိုမှုတွင် အမှား '{0}' ဖြစ်ခဲ့သည်။ {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "တောင်းဆိုမှုတွင်ဒေတာမရှိပါ။ သို့မဟုတ် 'path' ပိုင်ဆိုင်မှုမှာမှားနေပါသည်။",
  // "The file size should not exceed {0}."
  exceedMaxSize: "ဖိုင်အရွယ်အစားသည် {0} ထက်မကျော်ရပါ။",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "ဖိုင်များကိုအပ်လုဒ်လုပ်၍မရနိုင်ပါ။",
  // "Response required: enter another value."
  otherRequiredError: "ဖြေဆိုရန်လိုအပ်ပါသည်။ တန်ဖိုးတစ်ခုရိုက်ထည့်ပါ။",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "ဖိုင်တင်နေသည်။ မိနစ်ပိုင်းစောင့်ပြီးပြန်ကြိုးစားပါ။",
  // "Loading..."
  loadingFile: "တင်နေသည်...",
  // "Choose file(s)..."
  chooseFile: "ဖိုင်(များ) ရွေးချယ်ပါ...",
  // "No file selected"
  noFileChosen: "ဖိုင်မရွေးရသေးပါ",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "ဖိုင်တစ်ခုအားဤနေရာတွင်ဆွဲချပြီးအောက်တွင်ရှိသောခလုတ်ကိုနှိပ်ပါ။",
  // "Are you sure you want to delete this record?"
  confirmDelete: "ဤမှတ်တမ်းကိုဖျက်မည်မှာ သေချာပါသလား?",
  // "This value should be unique."
  keyDuplicationError: "ဤတန်ဖိုးသည်ထူးခြားဖြစ်ရပါမည်။",
  // "Add Column"
  addColumn: "ကော်လံထည့်ရန်",
  // "Add Row"
  addRow: "တန်းထည့်ရန်",
  // "Remove"
  removeRow: "ဖယ်ရှားရန်",
  emptyRowsText: "တန်းများမရှိပါ။",
  // "Add new"
  addPanel: "အသစ်ထည့်ပါ",
  // "Remove"
  removePanel: "ဖယ်ရှားပါ",
  // "Show Details"
  showDetails: "အသေးစိတ်ပြရန်",
  // "Hide Details"
  hideDetails: "အသေးစိတ်ဖျောက်ရန်",
  // "item"
  choices_Item: "အရာ",
  // "Column"
  matrix_column: "ကော်လံ",
  // "Row"
  matrix_row: "တန်း",
  // "text"
  multipletext_itemname: "စာသား",
  // "The results are being saved on the server..."
  savingData: "ရလဒ်များကိုဆာဗာတွင်သိမ်းဆည်းနေသည်...",
  // "An error occurred and we could not save the results."
  savingDataError: "အမှားတစ်ခုဖြစ်ပြီး ရလဒ်များကိုသိမ်းဆည်း၍မရနိုင်ပါ။",
  // "The results were saved successfully!"
  savingDataSuccess: "ရလဒ်များကိုအောင်မြင်စွာသိမ်းဆည်းပြီးပါပြီ။",
  // "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "သင့်ဖြေဆိုမှုသည် 64KB ကျော်နေပါသည်။",
  // "Try again"
  saveAgainButton: "ထပ်ကြိုးစားရန်",
  // "min"
  timerMin: "မိနစ်",
  // "sec"
  timerSec: "စက္ကန့်",
  // "Clear"
  clearCaption: "ရှင်းလင်းရန်",
  // "Sign here"
  signaturePlaceHolder: "ဤနေရာတွင်လက်မှတ်ရေးပါ",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "ဤဖိုင်အားဖယ်ရှားမည်မှာ သေချာပါသလား: {0}?",
  // "OK"
  ok: "အိုကေ",
  // "Cancel"
  cancel: "ပယ်ဖျက်ပါ"
};

setupLocale({ localeCode: "mm", strings: burmeseStrings, nativeName: "မြန်မာ", englishName: "Burmese" });