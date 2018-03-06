import { surveyLocalization } from "../surveyStrings";

export var simplifiedChineseSurveyStrings = {
  pagePrevText: "上一页",
  pageNextText: "下一页",
  completeText: "提交问卷",
  otherItemText: "填写其他答案",
  progressText: "第 {0} 页, 共 {1} 页",
  emptySurvey: "问卷中没有问题或页面",
  completingSurvey: "感谢您的参与!",
  loadingSurvey: "问卷正在加载中...",
  optionsCaption: "请选择...",
  requiredError: "请填写此问题",
  requiredInAllRowsError: "请填写所有行中问题",
  numericError: "答案必须是个数字",
  textMinLength: "答案长度至少 {0} 个字符",
  textMaxLength: "答案长度不能超过 {0} 个字符",
  textMinMaxLength: "答案长度必须在 {0} - {1} 个字符之间",
  minRowCountError: "最少需要填写 {0} 行答案",
  minSelectError: "最少需要选择 {0} 项答案",
  maxSelectError: "最多只能选择 {0} 项答案",
  numericMinMax: "答案 '{0}' 必须大于等于 {1} 且小于等于 {2}",
  numericMin: "答案 '{0}' 必须大于等于 {1}",
  numericMax: "答案 '{0}' 必须小于等于 {1}",
  invalidEmail: "请输入有效的 Email 地址",
  urlRequestError: "载入选项时发生错误 '{0}': {1}",
  urlGetChoicesError: "未能载入有效的选项或请求参数路径有误",
  exceedMaxSize: "文件大小不能超过 {0}",
  otherRequiredError: "请完成其他问题",
  uploadingFile: "文件上传中... 请耐心等待几秒后重试",
  addRow: "添加答案",
  removeRow: "删除答案",
  choices_Item: "选项",
  matrix_column: "列",
  matrix_row: "行",
  savingData: "正在将结果保存到服务器...",
  savingDataError: "在保存结果过程中发生了错误，结果未能保存",
  savingDataSuccess: "结果保存成功!",
  saveAgainButton: "请重试"
};

surveyLocalization.locales["zh-cn"] = simplifiedChineseSurveyStrings;
surveyLocalization.localeNames["zh-cn"] = "简体中文";
