import { setupLocale } from "survey-core";

export var traditionalChineseSurveyStrings = {
  // "Previous"
  pagePrevText: "上一頁",
  // "Next"
  pageNextText: "下一頁",
  // "Complete"
  completeText: "提交問卷",
  // [Auto-translated] "Preview"
  previewText: "預覽",
  // [Auto-translated] "Edit"
  editText: "編輯",
  // [Auto-translated] "Start"
  startSurveyText: "開始",
  // [Auto-translated] "Please leave a comment"
  commentText: "請發表評論",
  // "Other (describe)"
  otherItemText: "填寫其他答案",
  // [Auto-translated] "None"
  noneItemText: "沒有",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "拒絕回答",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "不知道",
  // [Auto-translated] "Select All"
  selectAllItemText: "全選",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "取消全選",
  // "Page {0} of {1}"
  progressText: "第 {0} 頁, 共 {1} 頁",
  // [Auto-translated] "{0} of {1}"
  indexText: "{1}{0}",
  // [Auto-translated] "{0} of {1}"
  panelDynamicProgressText: "{1}{0}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "面板 {面板索引}",
  // [Auto-translated] "Answered {0}/{1} questions"
  questionsProgressText: "回答了{0}/{1}問題",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "問卷中沒有問題或頁面",
  // "Thank you for completing the survey"
  completingSurvey: "感謝您的參與!",
  // [Auto-translated] "You have already completed this survey."
  completingSurveyBefore: "您已經完成了此調查。",
  // "Loading Survey..."
  loadingSurvey: "問卷載入中...",
  // "Select..."
  placeholder: "請選擇...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "選擇。。。",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "選擇。。。",
  // [Auto-translated] "value"
  value: "價值",
  // "Response required."
  requiredError: "請填寫此問題",
  // [Auto-translated] "Response required: answer at least one question."
  requiredErrorInPanel: "需要回答：至少回答一個問題。",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "請填寫所有行中問題",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "每行必須具有唯一值。",
  // "The value should be numeric."
  numericError: "答案必須是個數字",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "該值不應小於 {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "請輸入與步長相符的值{0}。",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "該值不應大於 {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "不允許使用數位。",
  // "Please enter at least {0} character(s)."
  textMinLength: "答案長度至少 {0} 個字元",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "答案長度不能超過 {0} 個字元",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "答案長度必須在 {0} - {1} 個字元之間",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "最少需要填寫 {0} 行答案",
  // "Please select at least {0} option(s)."
  minSelectError: "最少需要選擇 {0} 項答案",
  // "Please select no more than {0} option(s)."
  maxSelectError: "最多只能選擇 {0} 項答案",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "答案 '{0}' 必須大於等於 {1} 且小於等於 {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "答案 '{0}' 必須大於等於 {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "答案 '{0}' 必須小於等於 {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "請輸入有效的 Email 地址",
  // [Auto-translated] "The expression: {0} should return 'true'."
  invalidExpression: "表達式：{0}應返回「true」。",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "載入選項時發生錯誤 '{0}': {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "未能載入有效的選項或請求參數路徑有誤",
  // "The file size should not exceed {0}."
  exceedMaxSize: "文件大小不能超過 {0}",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "你最多只能上傳檔案數量{0}。",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "無法上傳檔。請為「onUploadFiles」事件添加處理程式。",
  // "Response required: enter another value."
  otherRequiredError: "請完成其他問題",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "文件上傳中... 請耐心等待幾秒後重試",
  // [Auto-translated] "Loading..."
  loadingFile: "裝載。。。",
  // [Auto-translated] "Choose file(s)..."
  chooseFile: "選擇檔案...",
  // [Auto-translated] "No file selected"
  noFileChosen: "未選擇檔案",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "將檔案拖放到此處或按下下面的按鈕選擇要上傳的檔。",
  // [Auto-translated] "Are you sure you want to delete this record?"
  confirmDelete: "您確定要刪除此記錄嗎？",
  // [Auto-translated] "This value should be unique."
  keyDuplicationError: "此值應該是唯一的。",
  // [Auto-translated] "Add Column"
  addColumn: "添加列",
  // "Add Row"
  addRow: "添加答案",
  // "Remove"
  removeRow: "刪除答案",
  // [Auto-translated] "There are no rows."
  noRowsText: "沒有行。",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "行 {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // [Auto-translated] "Add new"
  addPanel: "新增",
  // [Auto-translated] "Remove"
  removePanel: "刪除",
  // [Auto-translated] "Show Details"
  showDetails: "顯示詳細資訊",
  // [Auto-translated] "Hide Details"
  hideDetails: "隱藏詳細資訊",
  // "item"
  choices_Item: "選項",
  // [Auto-translated] "Choice option"
  choices_Choice: "Choice 選項",
  // "Column"
  matrix_column: "列",
  // "Row"
  matrix_row: "行",
  // [Auto-translated] "text"
  multipletext_itemname: "發簡訊",
  // "The results are being saved on the server..."
  savingData: "正在將結果保存到服務器...",
  // "An error occurred and we could not save the results."
  savingDataError: "在保存結果過程中發生了錯誤，結果未能保存",
  // "The results were saved successfully!"
  savingDataSuccess: "結果保存成功!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "您的回復超過 64KB。請減小檔的大小，然後重試或聯繫調查擁有者。",
  // "Try again"
  saveAgainButton: "請重試",
  // [Auto-translated] "min"
  timerMin: "最小",
  // [Auto-translated] "sec"
  timerSec: "秒",
  // [Auto-translated] "You have spent {0} on this page and {1} in total."
  timerSpentAll: "您在此頁面上花費了{0}，總共{1}。",
  // [Auto-translated] "You have spent {0} on this page."
  timerSpentPage: "您在此頁面上花費了{0}。",
  // [Auto-translated] "You have spent {0} in total."
  timerSpentSurvey: "你總共花了{0}。",
  // [Auto-translated] "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "您在此頁面上花費了{0}{1}，總共花費了{2}{3}。",
  // [Auto-translated] "You have spent {0} of {1} on this page."
  timerLimitPage: "您在此頁面上花費了{0}{1}。",
  // [Auto-translated] "You have spent {0} of {1} in total."
  timerLimitSurvey: "您總共花費了{1}的{0}。",
  // [Auto-translated] "Clear"
  clearCaption: "清楚",
  // [Auto-translated] "Select"
  selectCaption: "選擇",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "在此簽名",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "無簽名",
  // [Auto-translated] "Select File"
  chooseFileCaption: "選擇檔案",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "拍照",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "按下下面的按鈕使用相機拍照。",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "拖放或選擇要上傳的檔或使用相機拍攝照片。",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "替換檔",
  // [Auto-translated] "Remove this file"
  removeFileCaption: "刪除此檔",
  // [Auto-translated] "Yes"
  booleanCheckedLabel: "是的",
  // [Auto-translated] "No"
  booleanUncheckedLabel: "不",
  // [Auto-translated] "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "是否確實要刪除此檔：{0}？",
  // [Auto-translated] "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "是否確實要刪除所有檔？",
  // [Auto-translated] "Question Title"
  questionTitlePatternText: "問題標題",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "取消",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "應用",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "鍵入以搜尋...",
  // [Auto-translated] "No data to display"
  emptyMessage: "沒有要顯示的數據",
  // [Auto-translated] "Loading..."
  loadingPage: "裝載。。。",
  // [Auto-translated] "Loading..."
  loadingData: "裝載。。。",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "還沒有條目。\n單擊下面的按鈕添加新條目。",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "暫無條目",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "新面板",
  // [Auto-translated] "More"
  more: "更多",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "還行",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "所有選項均被選中進行排名",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "將選項拖到此處以對其進行排名",
  // [Auto-translated] "OK"
  ok: "還行",
  // [Auto-translated] "Cancel"
  cancel: "取消",
  // "Create \"{0}\" item..."
  createCustomItem: "建立 {0} 項目...",
  // [Auto-translated] "Table of contents"
  toc: "目錄",
  // [Auto-translated] "Progress bar"
  progressbar: "進度條"
};

setupLocale({ localeCode: "zh-tw", strings: traditionalChineseSurveyStrings, nativeName: "繁體中文", englishName: "Tranditional Chinese" });