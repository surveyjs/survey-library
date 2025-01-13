import { setupLocale } from "survey-core";

export var georgianSurveyStrings = {
  pagePrevText: "უკან",
  pageNextText: "შემდეგ",
  completeText: "დასრულება",
  previewText: "გადახედვა",
  editText: "რედაქტირება",
  startSurveyText: "დაქოქვა",
  otherItemText: "სხვა (გთხოვთ მიუთითეთ)",
  noneItemText: "არცერთი",
  refuseItemText: "უარი პასუხზე",
  dontKnowItemText: "არ ვიცი",
  selectAllItemText: "ყველას მონიშნა",
  deselectAllItemText: "ყველას არჩევა",
  progressText: "გვერდი {0} / {1}",
  indexText: "{1} {0}",
  panelDynamicProgressText: "{1} {0}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "უპასუხეთ {0}/{1} კითხვებს",
  emptySurvey: "არცერთი კითხვა არ არის.",
  completingSurvey: "გმადლობთ კითხვარის შევსებისთვის!",
  completingSurveyBefore: "ჩვენი ჩანაწერები აჩვენებს, რომ თქვენ უკვე დაასრულეთ ეს გამოკითხვა.",
  loadingSurvey: "ჩატვირთვა სერვერიდან...",
  placeholder: "არჩევა...",
  ratingOptionsCaption: "აირჩიეთ...",
  value: "ღირებულება",
  requiredError: "გთხოვთ უპასუხეთ კითხვას.",
  requiredErrorInPanel: "საჭიროა პასუხი: უპასუხეთ მინიმუმ ერთ კითხვას.",
  requiredInAllRowsError: "საჭიროა პასუხი: უპასუხეთ კითხვებს ყველა რიგში.",
  eachRowUniqueError: "თითოეულ რიგს უნდა ჰქონდეს უნიკალური მნიშვნელობა.",
  numericError: "პასუხი უნდა იყოს რიცხვი.",
  minError: "ღირებულება არ უნდა იყოს ნაკლები {0}",
  maxError: "ღირებულება არ უნდა იყოს {0}",
  textNoDigitsAllow: "ნომრები არ არის დაშვებული.",
  textMinLength: "გთხოვთ შეიყვანეთ არანაკლებ {0} სიმბოლო.",
  textMaxLength: "გთხოვთ, შეიყვანოთ არაუმეტეს {0} სიმბოლო(ებ)ი.",
  textMinMaxLength: "გთხოვთ, შეიყვანოთ მინიმუმ {0} და არაუმეტეს {1} სიმბოლო.",
  minRowCountError: "გთხოვთ შეავსოთ მინიმუმ {0} რიგი( ებ)ი.",
  minSelectError: "გთხოვთ აირჩიეთ არანაკლებ {0} ვარიანტი.",
  maxSelectError: "გთხოვთ აირჩიეთ არაუმეტეს {0} ვარიანტი.",
  numericMinMax: "'{0}' უნდა იყოს მეტი ან ტოლი, ვიდრე {1}, და ნაკლები ან ტოლი ვიდრე {2}",
  numericMin: "'{0}' უნდა იყოს მეტი ან ტოლი ვიდრე {1}",
  numericMax: "'{0}' უნდა იყოს ნაკლები ან ტოლი ვიდრე {1}",
  invalidEmail: "გთხოვთ შეიყვანოთ ელ. ფოსტის რეალური მისამართი.",
  invalidExpression: "გამოთქმა: {0} უნდა დაბრუნდეს \"ჭეშმარიტი\".",
  urlRequestError: "მოთხოვნა დაუბრუნდა შეცდომას '{0}'. {1}",
  urlGetChoicesError: "მოთხოვნამ დაუბრუნა ცარიელი მონაცემები ან \"ბილიკის\" ქონება არასწორია",
  exceedMaxSize: "ფაილის ზომა არ უნდა აღემატებოდეს {0}.",
  noUploadFilesHandler: "ფაილების ატვირთვა შეუძლებელია. გთხოვთ, დაამატოთ დამმუშავებელი 'onUploadFiles' ღონისძიებისთვის.",
  otherRequiredError: "საჭიროა პასუხი: შეიყვანეთ სხვა მნიშვნელობა.",
  uploadingFile: "თქვენი ფაილი ატვირთვაა. გთხოვთ დაელოდოთ რამდენიმე წამს და კიდევ სცადოთ.",
  loadingFile: "იტვირთება...",
  chooseFile: "აირჩიეთ ფაილი...",
  noFileChosen: "ფაილის არჩევა არ არის",
  filePlaceholder: "გადაიტანეთ და ჩამოაგდეთ ფაილი აქ ან დააჭირეთ ქვემოთ მოცემულ ღილაკს და აირჩიეთ ფაილი ასატვირთად.",
  confirmDelete: "გსურთ ჩანაწერის წაშლა?",
  keyDuplicationError: "ეს მნიშვნელობა უნდა იყოს უნიკალური.",
  addColumn: "სვეტის დამატება",
  addRow: "რიგის დამატება",
  removeRow: "წაშლა",
  noRowsText: "რიგები არ არის.",
  addPanel: "ახალი დამატება",
  removePanel: "წაშლა",
  showDetails: "დეტალების ჩვენება",
  hideDetails: "დეტალების დამალვა",
  choices_Item: "ნივთი",
  matrix_column: "სვეტი",
  matrix_row: "რიგი",
  multipletext_itemname: "ტექსტი",
  savingData: "შედეგები ინახება სერვერზე...",
  savingDataError: "დაფიქსირდა შეცდომა და შედეგი ვერ შევინახავდით.",
  savingDataSuccess: "შედეგები წარმატებით გადაარჩინეს!",
  savingExceedSize: "თქვენი პასუხი აღემატება 64KB. გთხოვთ, შეამციროთ თქვენი ფაილ(ებ)ის ზომა და სცადოთ ხელახლა ან დაუკავშირდეთ გამოკითხვის მფლობელს.",
  saveAgainButton: "კიდევ სცადე",
  timerMin: "წთ",
  timerSec: "წმ",
  timerSpentAll: "თქვენ დახარჯეთ {0} ამ გვერდზე და ჯამში {1}.",
  timerSpentPage: "თქვენ {0} დახარჯეთ ამ გვერდზე.",
  timerSpentSurvey: "თქვენ სულ {0} დახარჯეთ.",
  timerLimitAll: "თქვენ დახარჯეთ {1} {0} ამ გვერდზე და ჯამში {3} {2}.",
  timerLimitPage: "თქვენ ამ გვერდზე {1} {0} დახარჯეთ.",
  timerLimitSurvey: "თქვენ სულ {1} {0} დახარჯეთ.",
  clearCaption: "მოწმენდილი ცა",
  signaturePlaceHolder: "შესვლა აქ",
  signaturePlaceHolderReadOnly: "ხელმოწერა არ არის",
  chooseFileCaption: "ვაუჩერის ნახვა",
  takePhotoCaption: "გადაიღეთ ფოტო",
  photoPlaceholder: "დააჭირეთ ქვემოთ მოცემულ ღილაკს, რომ გადაიღოთ ფოტო კამერის გამოყენებით.",
  fileOrPhotoPlaceholder: "გადაიტანეთ და ჩამოაგდეთ ან შეარჩიეთ ფაილი კამერის გამოყენებით ფოტოს ასატვირთად ან გადასაღებად.",
  replaceFileCaption: "ფაილის შეცვლა",
  removeFileCaption: "ამ ფაილის წაშლა",
  booleanCheckedLabel: "დიახ",
  booleanUncheckedLabel: "არა",
  confirmRemoveFile: "დარწმუნებული ხართ, რომ გსურთ ამ ფაილის წაშლა: {0}?",
  confirmRemoveAllFiles: "დარწმუნებული ხართ, რომ გსურთ ყველა ფაილის წაშლა?",
  questionTitlePatternText: "კითხვის სათაური",
  modalCancelButtonText: "გაუქმება",
  modalApplyButtonText: "მიღება",
  filterStringPlaceholder: "ჩაწერეთ ძებნა...",
  emptyMessage: "მონაცემები არ არის საჩვენებლად",
  noEntriesText: "ჯერ არ არის ჩანაწერები.\nდააჭირეთ ქვემოთ მოცემულ ღილაკს, რომ დაამატოთ ახალი ჩანაწერი.",
  noEntriesReadonlyText: "არ არსებობს ჩანაწერები.",
  tabTitlePlaceholder: "ახალი პანელი",
  more: "სრულად",
  tagboxDoneButtonCaption: "კარგი",
  selectToRankEmptyRankedAreaText: "ყველა არჩევანი რანჟირებულია",
  selectToRankEmptyUnrankedAreaText: "გადაიტანეთ და ჩამოაგდეთ არჩევანი აქ, რომ დაასახელოთ ისინი",
  ok: "კარგი",
  cancel: "გაუქმება"
};

setupLocale({ localeCode: "ka", strings: georgianSurveyStrings, nativeName: "ქართული", englishName: "Georgian" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// previewText: "Preview" => "გადახედვა"
// editText: "Edit" => "რედაქტირება"
// startSurveyText: "Start" => "დაქოქვა"
// noneItemText: "None" => "არცერთი"
// selectAllItemText: "Select All" => "ყველას მონიშნა"
// indexText: "{0} of {1}" => "{1} {0}"
// panelDynamicProgressText: "{0} of {1}" => "{1} {0}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// questionsProgressText: "Answered {0}/{1} questions" => "უპასუხეთ {0}/{1} კითხვებს"
// completingSurveyBefore: "Our records show that you have already completed this survey." => "ჩვენი ჩანაწერები აჩვენებს, რომ თქვენ უკვე დაასრულეთ ეს გამოკითხვა."
// ratingOptionsCaption: "Select..." => "აირჩიეთ..."
// value: "value" => "ღირებულება"
// requiredErrorInPanel: "Response required: answer at least one question." => "საჭიროა პასუხი: უპასუხეთ მინიმუმ ერთ კითხვას."
// requiredInAllRowsError: "Response required: answer questions in all rows." => "საჭიროა პასუხი: უპასუხეთ კითხვებს ყველა რიგში."
// minError: "The value should not be less than {0}" => "ღირებულება არ უნდა იყოს ნაკლები {0}"
// maxError: "The value should not be greater than {0}" => "ღირებულება არ უნდა იყოს {0}"
// textMaxLength: "Please enter no more than {0} character(s)." => "გთხოვთ, შეიყვანოთ არაუმეტეს {0} სიმბოლო(ებ)ი."
// textMinMaxLength: "Please enter at least {0} and no more than {1} characters." => "გთხოვთ, შეიყვანოთ მინიმუმ {0} და არაუმეტეს {1} სიმბოლო."
// minRowCountError: "Please fill in at least {0} row(s)." => "გთხოვთ შეავსოთ მინიმუმ {0} რიგი( ებ)ი."
// invalidExpression: "The expression: {0} should return 'true'." => "გამოთქმა: {0} უნდა დაბრუნდეს \"ჭეშმარიტი\"."
// urlRequestError: "The request returned error '{0}'. {1}" => "მოთხოვნა დაუბრუნდა შეცდომას '{0}'. {1}"
// urlGetChoicesError: "The request returned empty data or the 'path' property is incorrect" => "მოთხოვნამ დაუბრუნა ცარიელი მონაცემები ან \"ბილიკის\" ქონება არასწორია"
// exceedMaxSize: "The file size should not exceed {0}." => "ფაილის ზომა არ უნდა აღემატებოდეს {0}."
// otherRequiredError: "Response required: enter another value." => "საჭიროა პასუხი: შეიყვანეთ სხვა მნიშვნელობა."
// uploadingFile: "Your file is uploading. Please wait several seconds and try again." => "თქვენი ფაილი ატვირთვაა. გთხოვთ დაელოდოთ რამდენიმე წამს და კიდევ სცადოთ."
// loadingFile: "Loading..." => "იტვირთება..."
// chooseFile: "Choose file(s)..." => "აირჩიეთ ფაილი..."
// noFileChosen: "No file chosen" => "ფაილის არჩევა არ არის"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "გადაიტანეთ და ჩამოაგდეთ ფაილი აქ ან დააჭირეთ ქვემოთ მოცემულ ღილაკს და აირჩიეთ ფაილი ასატვირთად."
// confirmDelete: "Do you want to delete the record?" => "გსურთ ჩანაწერის წაშლა?"
// keyDuplicationError: "This value should be unique." => "ეს მნიშვნელობა უნდა იყოს უნიკალური."
// addColumn: "Add Column" => "სვეტის დამატება"
// addRow: "Add Row" => "რიგის დამატება"
// removeRow: "Remove" => "წაშლა"
// noRowsText: "There are no rows." => "რიგები არ არის."
// addPanel: "Add new" => "ახალი დამატება"
// removePanel: "Remove" => "წაშლა"
// choices_Item: "item" => "ნივთი"
// matrix_column: "Column" => "სვეტი"
// matrix_row: "Row" => "რიგი"
// multipletext_itemname: "text" => "ტექსტი"
// savingData: "The results are being saved on the server..." => "შედეგები ინახება სერვერზე..."
// savingDataError: "An error occurred and we could not save the results." => "დაფიქსირდა შეცდომა და შედეგი ვერ შევინახავდით."
// savingDataSuccess: "The results were saved successfully!" => "შედეგები წარმატებით გადაარჩინეს!"
// saveAgainButton: "Try again" => "კიდევ სცადე"
// timerMin: "min" => "წთ"
// timerSec: "sec" => "წმ"
// timerSpentAll: "You have spent {0} on this page and {1} in total." => "თქვენ დახარჯეთ {0} ამ გვერდზე და ჯამში {1}."
// timerSpentPage: "You have spent {0} on this page." => "თქვენ {0} დახარჯეთ ამ გვერდზე."
// timerSpentSurvey: "You have spent {0} in total." => "თქვენ სულ {0} დახარჯეთ."
// timerLimitAll: "You have spent {0} of {1} on this page and {2} of {3} in total." => "თქვენ დახარჯეთ {1} {0} ამ გვერდზე და ჯამში {3} {2}."
// timerLimitPage: "You have spent {0} of {1} on this page." => "თქვენ ამ გვერდზე {1} {0} დახარჯეთ."
// timerLimitSurvey: "You have spent {0} of {1} in total." => "თქვენ სულ {1} {0} დახარჯეთ."
// clearCaption: "Clear" => "მოწმენდილი ცა"
// signaturePlaceHolder: "Sign here" => "შესვლა აქ"
// chooseFileCaption: "Choose file" => "ვაუჩერის ნახვა"
// removeFileCaption: "Remove this file" => "ამ ფაილის წაშლა"
// booleanCheckedLabel: "Yes" => "დიახ"
// booleanUncheckedLabel: "No" => "არა"
// confirmRemoveFile: "Are you sure that you want to remove this file: {0}?" => "დარწმუნებული ხართ, რომ გსურთ ამ ფაილის წაშლა: {0}?"
// confirmRemoveAllFiles: "Are you sure that you want to remove all files?" => "დარწმუნებული ხართ, რომ გსურთ ყველა ფაილის წაშლა?"
// questionTitlePatternText: "Question Title" => "კითხვის სათაური"
// modalCancelButtonText: "Cancel" => "გაუქმება"
// modalApplyButtonText: "Apply" => "მიღება"
// filterStringPlaceholder: "Type to search..." => "ჩაწერეთ ძებნა..."
// emptyMessage: "No data to display" => "მონაცემები არ არის საჩვენებლად"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "ჯერ არ არის ჩანაწერები.\nდააჭირეთ ქვემოთ მოცემულ ღილაკს, რომ დაამატოთ ახალი ჩანაწერი."
// noEntriesReadonlyText: "There are no entries." => "არ არსებობს ჩანაწერები."
// more: "More" => "სრულად"
// tagboxDoneButtonCaption: "OK" => "კარგი"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "ყველა არჩევანი რანჟირებულია"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "გადაიტანეთ და ჩამოაგდეთ არჩევანი აქ, რომ დაასახელოთ ისინი"// takePhotoCaption: "Take Photo" => "გადაიღეთ ფოტო"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "დააჭირეთ ქვემოთ მოცემულ ღილაკს, რომ გადაიღოთ ფოტო კამერის გამოყენებით."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "გადაიტანეთ და ჩამოაგდეთ ან შეარჩიეთ ფაილი კამერის გამოყენებით ფოტოს ასატვირთად ან გადასაღებად."
// replaceFileCaption: "Replace file" => "ფაილის შეცვლა"// eachRowUniqueError: "Each row must have a unique value." => "თითოეულ რიგს უნდა ჰქონდეს უნიკალური მნიშვნელობა."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "ფაილების ატვირთვა შეუძლებელია. გთხოვთ, დაამატოთ დამმუშავებელი 'onUploadFiles' ღონისძიებისთვის."
// showDetails: "Show Details" => "დეტალების ჩვენება"
// hideDetails: "Hide Details" => "დეტალების დამალვა"
// ok: "OK" => "კარგი"
// cancel: "Cancel" => "გაუქმება"
// refuseItemText: "Refuse to answer" => "უარი პასუხზე"
// dontKnowItemText: "Don't know" => "არ ვიცი"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "თქვენი პასუხი აღემატება 64KB. გთხოვთ, შეამციროთ თქვენი ფაილ(ებ)ის ზომა და სცადოთ ხელახლა ან დაუკავშირდეთ გამოკითხვის მფლობელს."
// signaturePlaceHolderReadOnly: "No signature" => "ხელმოწერა არ არის"// tabTitlePlaceholder: "New Panel" => "ახალი პანელი"// deselectAllItemText: "Deselect all" => "ყველას არჩევა"
// textNoDigitsAllow: "Numbers are not allowed." => "ნომრები არ არის დაშვებული."