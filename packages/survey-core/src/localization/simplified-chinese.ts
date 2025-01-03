import { setupLocale } from "survey-core";

export var simplifiedChineseSurveyStrings = {
  pagePrevText: "上一页",
  pageNextText: "下一页",
  completeText: "提交问卷",
  previewText: "预览",
  editText: "编辑",
  startSurveyText: "开始问卷",
  otherItemText: "填写其他答案",
  noneItemText: "无",
  refuseItemText: "拒绝回答",
  dontKnowItemText: "不知道",
  selectAllItemText: "选择全部",
  deselectAllItemText: "取消全选",
  progressText: "第 {0} 页, 共 {1} 页",
  indexText: "{1}{0}",
  panelDynamicProgressText: "{0} of {1}",
  panelDynamicTabTextFormat: "面板 {面板索引}",
  questionsProgressText: "第 {0}/{1} 题",
  emptySurvey: "问卷中没有问题或页面",
  completingSurvey: "感谢您的参与!",
  completingSurveyBefore: "你已完成问卷.",
  loadingSurvey: "问卷正在加载中...",
  placeholder: "请选择...",
  ratingOptionsCaption: "选择。。。",
  value: "值",
  requiredError: "请填写此问题",
  requiredErrorInPanel: "至少回答一题.",
  requiredInAllRowsError: "请填写所有行中问题",
  eachRowUniqueError: "每行必须具有唯一值。",
  numericError: "答案必须是个数字",
  minError: "该值不能小于 {0}",
  maxError: "该值不能大于 {0}",
  textNoDigitsAllow: "不允许使用数字。",
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
  invalidExpression: "公式: {0} 无效.",
  urlRequestError: "载入选项时发生错误 '{0}': {1}",
  urlGetChoicesError: "未能载入有效的选项或请求参数路径有误",
  exceedMaxSize: "文件大小不能超过 {0}",
  noUploadFilesHandler: "无法上传文件。请为“onUploadFiles”事件添加处理程序。",
  otherRequiredError: "请完成其他问题",
  uploadingFile: "文件上传中... 请耐心等待几秒后重试",
  loadingFile: "加载...",
  chooseFile: "选择文件...",
  noFileChosen: "未选择文件",
  filePlaceholder: "将文件拖放到此处或单击下面的按钮并选择要上传的文件。",
  confirmDelete: "删除记录?",
  keyDuplicationError: "主键不能重复",
  addColumn: "添加列",
  addRow: "添加行",
  removeRow: "删除答案",
  noRowsText: "无内容",
  addPanel: "新添",
  removePanel: "删除",
  showDetails: "显示详细信息",
  hideDetails: "隐藏详细信息",
  choices_Item: "选项",
  matrix_column: "列",
  matrix_row: "行",
  multipletext_itemname: "文本",
  savingData: "正在将结果保存到服务器...",
  savingDataError: "在保存结果过程中发生了错误，结果未能保存",
  savingDataSuccess: "结果保存成功!",
  savingExceedSize: "您的回复超过 64KB。请减小文件的大小，然后重试或联系调查所有者。",
  saveAgainButton: "请重试",
  timerMin: "分",
  timerSec: "秒",
  timerSpentAll: "本页用时 {0} 总计用时{1} .",
  timerSpentPage: "本页用时{0} .",
  timerSpentSurvey: "总计用时 {0} .",
  timerLimitAll: "本页用时 {0} 共 {1}， 总计用时 {2} 共 {3} .",
  timerLimitPage: "本页用时 {0} 共 {1} .",
  timerLimitSurvey: "总计用时 {0} 共 {1}.",
  clearCaption: "清除",
  signaturePlaceHolder: "在此签名",
  signaturePlaceHolderReadOnly: "无签名",
  chooseFileCaption: "选择文件",
  takePhotoCaption: "拍照",
  photoPlaceholder: "单击下面的按钮使用相机拍照。",
  fileOrPhotoPlaceholder: "拖放或选择要上传的文件或使用相机拍摄照片。",
  replaceFileCaption: "替换文件",
  removeFileCaption: "移除文件",
  booleanCheckedLabel: "是",
  booleanUncheckedLabel: "否",
  confirmRemoveFile: "删除文件: {0}?",
  confirmRemoveAllFiles: "删除所有文件?",
  questionTitlePatternText: "标题",
  modalCancelButtonText: "取消",
  modalApplyButtonText: "确定",
  filterStringPlaceholder: "键入以搜索...",
  emptyMessage: "没有要显示的数据",
  noEntriesText: "尚无条目。\n单击下面的按钮以添加新条目。",
  noEntriesReadonlyText: "没有条目。",
  tabTitlePlaceholder: "新面板",
  more: "更多",
  tagboxDoneButtonCaption: "还行",
  selectToRankEmptyRankedAreaText: "所有选择均已排名",
  selectToRankEmptyUnrankedAreaText: "将选项拖放到此处进行排名",
  ok: "还行",
  cancel: "取消"
};

setupLocale({ localeCode: "zh-cn", strings: simplifiedChineseSurveyStrings, nativeName: "简体中文", englishName: "Simplified Chinese" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{1}{0}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "面板 {面板索引}"
// ratingOptionsCaption: "Select..." => "选择。。。"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "将文件拖放到此处或单击下面的按钮并选择要上传的文件。"
// signaturePlaceHolder: "Sign here" => "在此签名"
// filterStringPlaceholder: "Type to search..." => "键入以搜索..."
// emptyMessage: "No data to display" => "没有要显示的数据"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "尚无条目。\n单击下面的按钮以添加新条目。"
// noEntriesReadonlyText: "There are no entries." => "没有条目。"
// more: "More" => "更多"
// tagboxDoneButtonCaption: "OK" => "还行"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "所有选择均已排名"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "将选项拖放到此处进行排名"// takePhotoCaption: "Take Photo" => "拍照"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "单击下面的按钮使用相机拍照。"
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "拖放或选择要上传的文件或使用相机拍摄照片。"
// replaceFileCaption: "Replace file" => "替换文件"// eachRowUniqueError: "Each row must have a unique value." => "每行必须具有唯一值。"
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "无法上传文件。请为“onUploadFiles”事件添加处理程序。"
// showDetails: "Show Details" => "显示详细信息"
// hideDetails: "Hide Details" => "隐藏详细信息"
// ok: "OK" => "还行"
// cancel: "Cancel" => "取消"
// refuseItemText: "Refuse to answer" => "拒绝回答"
// dontKnowItemText: "Don't know" => "不知道"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "您的回复超过 64KB。请减小文件的大小，然后重试或联系调查所有者。"
// signaturePlaceHolderReadOnly: "No signature" => "无签名"// tabTitlePlaceholder: "New Panel" => "新面板"// deselectAllItemText: "Deselect all" => "取消全选"
// textNoDigitsAllow: "Numbers are not allowed." => "不允许使用数字。"