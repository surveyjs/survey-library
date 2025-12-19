import { setupLocale } from "survey-core";

export var simplifiedChineseSurveyStrings = {
  // "Previous"
  pagePrevText: "上一页",
  // "Next"
  pageNextText: "下一页",
  // "Complete"
  completeText: "提交问卷",
  // "Preview"
  previewText: "预览",
  // "Edit"
  editText: "编辑",
  // "Start"
  startSurveyText: "开始问卷",
  // [Auto-translated] "Please leave a comment"
  commentText: "请发表评论",
  // "Other (describe)"
  otherItemText: "填写其他答案",
  // "None"
  noneItemText: "无",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "拒绝回答",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "不知道",
  // "Select All"
  selectAllItemText: "选择全部",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "取消全选",
  // "Page {0} of {1}"
  progressText: "第 {0} 页, 共 {1} 页",
  // "{0} of {1}"
  indexText: "第 {0} 页，共 {1} 页",
  // "{0} of {1}"
  panelDynamicProgressText: "{0} of {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "面板 {面板索引}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "第 {0}/{1} 题",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "问卷中没有问题或页面",
  // "Thank you for completing the survey"
  completingSurvey: "感谢您的参与!",
  // "You have already completed this survey."
  completingSurveyBefore: "你已完成问卷.",
  // "Loading Survey..."
  loadingSurvey: "问卷正在加载中...",
  // "Select..."
  placeholder: "请选择...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "选择。。。",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "选择。。。",
  // "value"
  value: "值",
  // "Response required."
  requiredError: "请填写此问题",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "至少回答一题.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "请填写所有行中问题",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "每行必须具有唯一值。",
  // "The value should be numeric."
  numericError: "答案必须是个数字",
  // "The value should not be less than {0}"
  minError: "该值不能小于 {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "请输入与{0}步长相匹配的值。",
  // "The value should not be greater than {0}"
  maxError: "该值不能大于 {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "不允许使用数字。",
  // "Please enter at least {0} character(s)."
  textMinLength: "答案长度至少 {0} 个字符",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "答案长度不能超过 {0} 个字符",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "答案长度必须在 {0} - {1} 个字符之间",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "最少需要填写 {0} 行答案",
  // "Please select at least {0} option(s)."
  minSelectError: "最少需要选择 {0} 项答案",
  // "Please select no more than {0} option(s)."
  maxSelectError: "最多只能选择 {0} 项答案",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "答案 '{0}' 必须大于等于 {1} 且小于等于 {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "答案 '{0}' 必须大于等于 {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "答案 '{0}' 必须小于等于 {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "请输入有效的 Email 地址",
  // "The expression: {0} should return 'true'."
  invalidExpression: "公式: {0} 无效.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "载入选项时发生错误 '{0}': {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "未能载入有效的选项或请求参数路径有误",
  // "The file size should not exceed {0}."
  exceedMaxSize: "文件大小不能超过 {0}",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "你最多能上传的文件数量是{0}。",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "无法上传文件。请为“onUploadFiles”事件添加处理程序。",
  // "Response required: enter another value."
  otherRequiredError: "请完成其他问题",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "文件上传中... 请耐心等待几秒后重试",
  // "Loading..."
  loadingFile: "加载...",
  // "Choose file(s)..."
  chooseFile: "选择文件...",
  // "No file selected"
  noFileChosen: "未选择文件",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "将文件拖放到此处或单击下面的按钮选择要上传的文件。",
  // "Are you sure you want to delete this record?"
  confirmDelete: "删除记录?",
  // "This value should be unique."
  keyDuplicationError: "主键不能重复",
  // "Add Column"
  addColumn: "添加列",
  // "Add Row"
  addRow: "添加行",
  // "Remove"
  removeRow: "删除答案",
  // "There are no rows."
  noRowsText: "无内容",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "行 {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "新添",
  // "Remove"
  removePanel: "删除",
  // [Auto-translated] "Show Details"
  showDetails: "显示详细信息",
  // [Auto-translated] "Hide Details"
  hideDetails: "隐藏详细信息",
  // "item"
  choices_Item: "选项",
  // [Auto-translated] "Choice option"
  choices_Choice: "Choice 选项",
  // "Column"
  matrix_column: "列",
  // "Row"
  matrix_row: "行",
  // "text"
  multipletext_itemname: "文本",
  // "The results are being saved on the server..."
  savingData: "正在将结果保存到服务器...",
  // "An error occurred and we could not save the results."
  savingDataError: "在保存结果过程中发生了错误，结果未能保存",
  // "The results were saved successfully!"
  savingDataSuccess: "结果保存成功!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "您的回复超过 64KB。请减小文件的大小，然后重试或联系调查所有者。",
  // "Try again"
  saveAgainButton: "请重试",
  // "min"
  timerMin: "分",
  // "sec"
  timerSec: "秒",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "本页用时 {0} 总计用时{1} .",
  // "You have spent {0} on this page."
  timerSpentPage: "本页用时{0} .",
  // "You have spent {0} in total."
  timerSpentSurvey: "总计用时 {0} .",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "本页用时 {0} 共 {1}， 总计用时 {2} 共 {3} .",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "本页用时 {0} 共 {1} .",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "总计用时 {0} 共 {1}.",
  // "Clear"
  clearCaption: "清除",
  // [Auto-translated] "Select"
  selectCaption: "选择",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "在此签名",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "无签名",
  // "Select File"
  chooseFileCaption: "选择文件",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "拍照",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "单击下面的按钮使用相机拍照。",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "拖放或选择要上传的文件或使用相机拍摄照片。",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "替换文件",
  // "Remove this file"
  removeFileCaption: "移除文件",
  // "Yes"
  booleanCheckedLabel: "是",
  // "No"
  booleanUncheckedLabel: "否",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "删除文件: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "删除所有文件?",
  // "Question Title"
  questionTitlePatternText: "标题",
  // "Cancel"
  modalCancelButtonText: "取消",
  // "Apply"
  modalApplyButtonText: "确定",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "键入以搜索...",
  // [Auto-translated] "No data to display"
  emptyMessage: "没有要显示的数据",
  // [Auto-translated] "Loading..."
  loadingPage: "装载。。。",
  // [Auto-translated] "Loading..."
  loadingData: "装载。。。",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "还没有条目。\n单击下面的按钮添加新条目。",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "暂无条目",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "新面板",
  // [Auto-translated] "More"
  more: "更多",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "还行",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "所有选项均被选中进行排名",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "将选项拖到此处以对其进行排名",
  // [Auto-translated] "OK"
  ok: "还行",
  // [Auto-translated] "Cancel"
  cancel: "取消",
  // "Create \"{0}\" item..."
  createCustomItem: "创建 {0} 项...",
  // [Auto-translated] "Table of contents"
  toc: "目录",
  // [Auto-translated] "Progress bar"
  progressbar: "进度条"
};

setupLocale({ localeCode: "zh-cn", strings: simplifiedChineseSurveyStrings, nativeName: "简体中文", englishName: "Simplified Chinese" });