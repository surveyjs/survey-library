import { surveyLocalization } from "../surveyStrings";

export var traditionalChineseSurveyStrings = {
  pagePrevText: "上一頁",
  pageNextText: "下一頁",
  completeText: "提交問卷",
  otherItemText: "填寫其他答案",
  progressText: "第 {0} 頁, 共 {1} 頁",
  emptySurvey: "問卷中沒有問題或頁面",
  completingSurvey: "感謝您的參與!",
  loadingSurvey: "問卷載入中...",
  optionsCaption: "請選擇...",
  requiredError: "請填寫此問題",
  requiredInAllRowsError: "請填寫所有行中問題",
  numericError: "答案必須是個數字",
  textMinLength: "答案長度至少 {0} 個字元",
  textMaxLength: "答案長度不能超過 {0} 個字元",
  textMinMaxLength: "答案長度必須在 {0} - {1} 個字元之間",
  minRowCountError: "最少需要填寫 {0} 行答案",
  minSelectError: "最少需要選擇 {0} 項答案",
  maxSelectError: "最多只能選擇 {0} 項答案",
  numericMinMax: "答案 '{0}' 必須大於等於 {1} 且小於等於 {2}",
  numericMin: "答案 '{0}' 必須大於等於 {1}",
  numericMax: "答案 '{0}' 必須小於等於 {1}",
  invalidEmail: "請輸入有效的 Email 地址",
  urlRequestError: "載入選項時發生錯誤 '{0}': {1}",
  urlGetChoicesError: "未能載入有效的選項或請求參數路徑有誤",
  exceedMaxSize: "文件大小不能超過 {0}",
  otherRequiredError: "請完成其他問題",
  uploadingFile: "文件上傳中... 請耐心等待幾秒後重試",
  addRow: "添加答案",
  removeRow: "刪除答案",
  choices_Item: "選項",
  matrix_column: "列",
  matrix_row: "行",
  savingData: "正在將結果保存到服務器...",
  savingDataError: "在保存結果過程中發生了錯誤，結果未能保存",
  savingDataSuccess: "結果保存成功!",
  saveAgainButton: "請重試"
};

surveyLocalization.locales["zh-tw"] = traditionalChineseSurveyStrings;
surveyLocalization.localeNames["zh-tw"] = "繁體中文";
