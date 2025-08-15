import { setupLocale } from "survey-core";

export var georgianSurveyStrings = {
  // "Previous"
  pagePrevText: "უკან",
  // "Next"
  pageNextText: "შემდეგ",
  // "Complete"
  completeText: "დასრულება",
  // [Auto-translated] "Preview"
  previewText: "გადახედვა",
  // [Auto-translated] "Edit"
  editText: "რედაქტირება",
  // [Auto-translated] "Start"
  startSurveyText: "დაქოქვა",
  // [Auto-translated] "Please leave a comment"
  commentText: "გთხოვთ დატოვოთ კომენტარი",
  // "Other (describe)"
  otherItemText: "სხვა (გთხოვთ მიუთითეთ)",
  // [Auto-translated] "None"
  noneItemText: "არცერთი",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "უარი პასუხზე",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "არ ვიცი",
  // [Auto-translated] "Select All"
  selectAllItemText: "ყველას მონიშნა",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "ყველას არჩევა",
  // "Page {0} of {1}"
  progressText: "გვერდი {0} / {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{1} {0}",
  // [Auto-translated] "{0} of {1}"
  panelDynamicProgressText: "{1} {0}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // [Auto-translated] "Answered {0}/{1} questions"
  questionsProgressText: "უპასუხეთ {0}/{1} კითხვებს",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "არცერთი კითხვა არ არის.",
  // "Thank you for completing the survey"
  completingSurvey: "გმადლობთ კითხვარის შევსებისთვის!",
  // [Auto-translated] "You have already completed this survey."
  completingSurveyBefore: "თქვენ უკვე დაასრულეთ ეს გამოკითხვა.",
  // "Loading Survey..."
  loadingSurvey: "ჩატვირთვა სერვერიდან...",
  // "Select..."
  placeholder: "არჩევა...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "აირჩიეთ...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "აირჩიეთ...",
  // [Auto-translated] "value"
  value: "ღირებულება",
  // "Response required."
  requiredError: "გთხოვთ უპასუხეთ კითხვას.",
  // [Auto-translated] "Response required: answer at least one question."
  requiredErrorInPanel: "საჭიროა პასუხი: უპასუხეთ მინიმუმ ერთ კითხვას.",
  // [Auto-translated] "Response required: answer questions in all rows."
  requiredInAllRowsError: "საჭიროა პასუხი: უპასუხეთ კითხვებს ყველა რიგში.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "თითოეულ რიგს უნდა ჰქონდეს უნიკალური მნიშვნელობა.",
  // "The value should be numeric."
  numericError: "პასუხი უნდა იყოს რიცხვი.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "ღირებულება არ უნდა იყოს ნაკლები {0}",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "ღირებულება არ უნდა იყოს {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "ნომრები არ არის დაშვებული.",
  // "Please enter at least {0} character(s)."
  textMinLength: "გთხოვთ შეიყვანეთ არანაკლებ {0} სიმბოლო.",
  // [Auto-translated] "Please enter no more than {0} character(s)."
  textMaxLength: "გთხოვთ, შეიყვანოთ არაუმეტეს {0} სიმბოლო(ებ)ი.",
  // [Auto-translated] "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "გთხოვთ, შეიყვანოთ მინიმუმ {0} და არაუმეტეს {1} სიმბოლო.",
  // [Auto-translated] "Please fill in at least {0} row(s)."
  minRowCountError: "გთხოვთ შეავსოთ მინიმუმ {0} რიგი( ებ)ი.",
  // "Please select at least {0} option(s)."
  minSelectError: "გთხოვთ აირჩიეთ არანაკლებ {0} ვარიანტი.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "გთხოვთ აირჩიეთ არაუმეტეს {0} ვარიანტი.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' უნდა იყოს მეტი ან ტოლი, ვიდრე {1}, და ნაკლები ან ტოლი ვიდრე {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' უნდა იყოს მეტი ან ტოლი ვიდრე {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' უნდა იყოს ნაკლები ან ტოლი ვიდრე {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "გთხოვთ შეიყვანოთ ელ. ფოსტის რეალური მისამართი.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "გამოთქმა: {0} უნდა დაბრუნდეს \"ჭეშმარიტი\".",
  // [Auto-translated] "The request returned error '{0}'. {1}"
  urlRequestError: "მოთხოვნა დაუბრუნდა შეცდომას '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "მოთხოვნამ დაუბრუნა ცარიელი მონაცემები ან \"ბილიკის\" ქონება არასწორია",
  // [Auto-translated] "The file size should not exceed {0}."
  exceedMaxSize: "ფაილის ზომა არ უნდა აღემატებოდეს {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "ფაილების ატვირთვა შეუძლებელია. გთხოვთ, დაამატოთ დამმუშავებელი 'onUploadFiles' ღონისძიებისთვის.",
  // [Auto-translated] "Response required: enter another value."
  otherRequiredError: "საჭიროა პასუხი: შეიყვანეთ სხვა მნიშვნელობა.",
  // [Auto-translated] "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "თქვენი ფაილი ატვირთვაა. გთხოვთ დაელოდოთ რამდენიმე წამს და კიდევ სცადოთ.",
  // [Auto-translated] "Loading..."
  loadingFile: "იტვირთება...",
  // [Auto-translated] "Choose file(s)..."
  chooseFile: "აირჩიეთ ფაილი...",
  // [Auto-translated] "No file selected"
  noFileChosen: "ფაილი არ არის არჩეული",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "გადაიტანეთ და ჩამოაგდეთ ფაილი აქ ან დააჭირეთ ქვემოთ მოცემულ ღილაკს, რომ აირჩიოთ ფაილი ასატვირთად.",
  // [Auto-translated] "Are you sure you want to delete this record?"
  confirmDelete: "დარწმუნებული ხართ, რომ გსურთ ამ ჩანაწერის წაშლა?",
  // [Auto-translated] "This value should be unique."
  keyDuplicationError: "ეს მნიშვნელობა უნდა იყოს უნიკალური.",
  // [Auto-translated] "Add Column"
  addColumn: "სვეტის დამატება",
  // [Auto-translated] "Add Row"
  addRow: "რიგის დამატება",
  // [Auto-translated] "Remove"
  removeRow: "წაშლა",
  // [Auto-translated] "There are no rows."
  noRowsText: "რიგები არ არის.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Row {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // [Auto-translated] "Add new"
  addPanel: "ახალი დამატება",
  // [Auto-translated] "Remove"
  removePanel: "წაშლა",
  // [Auto-translated] "Show Details"
  showDetails: "დეტალების ჩვენება",
  // [Auto-translated] "Hide Details"
  hideDetails: "დეტალების დამალვა",
  // [Auto-translated] "item"
  choices_Item: "ნივთი",
  // [Auto-translated] "Choice option"
  choices_Choice: "არჩევანის ვარიანტი",
  // [Auto-translated] "Column"
  matrix_column: "სვეტი",
  // [Auto-translated] "Row"
  matrix_row: "რიგი",
  // [Auto-translated] "text"
  multipletext_itemname: "ტექსტი",
  // [Auto-translated] "The results are being saved on the server..."
  savingData: "შედეგები ინახება სერვერზე...",
  // [Auto-translated] "An error occurred and we could not save the results."
  savingDataError: "დაფიქსირდა შეცდომა და შედეგი ვერ შევინახავდით.",
  // [Auto-translated] "The results were saved successfully!"
  savingDataSuccess: "შედეგები წარმატებით გადაარჩინეს!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "თქვენი პასუხი აღემატება 64KB. გთხოვთ, შეამციროთ თქვენი ფაილ(ებ)ის ზომა და სცადოთ ხელახლა ან დაუკავშირდეთ გამოკითხვის მფლობელს.",
  // [Auto-translated] "Try again"
  saveAgainButton: "კიდევ სცადე",
  // [Auto-translated] "min"
  timerMin: "წთ",
  // [Auto-translated] "sec"
  timerSec: "წმ",
  // [Auto-translated] "You have spent {0} on this page and {1} in total."
  timerSpentAll: "თქვენ დახარჯეთ {0} ამ გვერდზე და ჯამში {1}.",
  // [Auto-translated] "You have spent {0} on this page."
  timerSpentPage: "თქვენ {0} დახარჯეთ ამ გვერდზე.",
  // [Auto-translated] "You have spent {0} in total."
  timerSpentSurvey: "თქვენ სულ {0} დახარჯეთ.",
  // [Auto-translated] "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "თქვენ დახარჯეთ {1} {0} ამ გვერდზე და ჯამში {3} {2}.",
  // [Auto-translated] "You have spent {0} of {1} on this page."
  timerLimitPage: "თქვენ ამ გვერდზე {1} {0} დახარჯეთ.",
  // [Auto-translated] "You have spent {0} of {1} in total."
  timerLimitSurvey: "თქვენ სულ {1} {0} დახარჯეთ.",
  // [Auto-translated] "Clear"
  clearCaption: "მოწმენდილი ცა",
  // [Auto-translated] "Select"
  selectCaption: "აირჩიე",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "შესვლა აქ",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "ხელმოწერა არ არის",
  // [Auto-translated] "Select File"
  chooseFileCaption: "აირჩიეთ ფაილი",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "გადაიღეთ ფოტო",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "დააჭირეთ ქვემოთ მოცემულ ღილაკს, რომ გადაიღოთ ფოტო კამერის გამოყენებით.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "გადაიტანეთ და ჩამოაგდეთ ან შეარჩიეთ ფაილი კამერის გამოყენებით ფოტოს ასატვირთად ან გადასაღებად.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "ფაილის შეცვლა",
  // [Auto-translated] "Remove this file"
  removeFileCaption: "ამ ფაილის წაშლა",
  // [Auto-translated] "Yes"
  booleanCheckedLabel: "დიახ",
  // [Auto-translated] "No"
  booleanUncheckedLabel: "არა",
  // [Auto-translated] "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "დარწმუნებული ხართ, რომ გსურთ ამ ფაილის წაშლა: {0}?",
  // [Auto-translated] "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "დარწმუნებული ხართ, რომ გსურთ ყველა ფაილის წაშლა?",
  // [Auto-translated] "Question Title"
  questionTitlePatternText: "კითხვის სათაური",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "გაუქმება",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "მიღება",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "ჩაწერეთ ძებნა...",
  // [Auto-translated] "No data to display"
  emptyMessage: "მონაცემები არ არის საჩვენებლად",
  // [Auto-translated] "Loading..."
  loadingPage: "იტვირთება...",
  // [Auto-translated] "Loading..."
  loadingData: "იტვირთება...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "ჯერ არ არის ჩანაწერები.\nდააჭირეთ ქვემოთ მოცემულ ღილაკს, რომ დაამატოთ ახალი ჩანაწერი.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "ჩანაწერები არ არის",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "ახალი პანელი",
  // [Auto-translated] "More"
  more: "სრულად",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "კარგი",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "ყველა არჩევანი შეირჩევა რეიტინგისთვის",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "გადაიტანეთ არჩევანი აქ, რომ დაასახელოთ ისინი",
  // [Auto-translated] "OK"
  ok: "კარგი",
  // [Auto-translated] "Cancel"
  cancel: "გაუქმება",
  // "Create \"{0}\" item..."
  createCustomItem: "შექმენით \"{0}\" ელემენტი...",
  // [Auto-translated] "Table of contents"
  toc: "სარჩევი",
  // [Auto-translated] "Progress bar"
  progressbar: "პროგრესის ბარი"
};

setupLocale({ localeCode: "ka", strings: georgianSurveyStrings, nativeName: "ქართული", englishName: "Georgian" });