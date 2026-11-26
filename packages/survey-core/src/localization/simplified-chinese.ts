import { setupLocale } from "survey-core";

export var simplifiedChineseSurveyStrings = {
  // "Previous"
  pagePrevText: "上一页",
  // "Next"
  pageNextText: "下一页",
  // [Auto-translated] "First"
  pageFirstText: "首先",
  // [Auto-translated] "Last"
  pageLastText: "最后",
  // [Auto-translated] "of {0}"
  pagerTotalText: "{0}",
  // [Auto-translated] "Select Page"
  pagerSelectPageTitle: "选择页面",
  // [Auto-translated] "Sort by {0}"
  sortByColumnText: "按{0}排序",
  // [Auto-translated] "High - Low"
  sortHighLowText: "高 - 低",
  // [Auto-translated] "Low - High"
  sortLowHighText: "低 - 高",
  // [Auto-translated] "Alphabet, A - Z"
  sortAZText: "字母表，A - Z",
  // [Auto-translated] "Alphabet, Z - A"
  sortZAText: "字母表，Z - A",
  // [Auto-translated] "Newest first"
  sortNewestFirstText: "最新优先",
  // [Auto-translated] "Oldest first"
  sortOldestFirstText: "最年长的先",
  // [Auto-translated] "Sorted by {0}"
  sortOrderText: "按{0}排序",
  // [Auto-translated] "{0} ({1})"
  sortOrderLevelText: "{0} ({1})",
  // [Auto-translated] "{0}, then by {1}"
  sortOrderNextText: "{0}，然后{1}",
  // [Auto-translated] "Sort by"
  sortByText: "排序",
  // [Auto-translated] "Default"
  sortDefaultText: "默认",
  // [Auto-translated] "Sort field"
  sortFieldAriaLabel: "排序字段",
  // [Auto-translated] "Sort order"
  sortDirectionAriaLabel: "排序顺序",
  // [Auto-translated] "Add sort level"
  sortAddLevelText: "添加排序层级",
  // [Auto-translated] "Remove sort level {0}"
  sortRemoveLevelText: "移除排序级别{0}",
  // [Auto-translated] "Sort field {0}"
  sortLevelFieldAriaLabel: "排序字段{0}",
  // [Auto-translated] "Sort order {0}"
  sortLevelDirectionAriaLabel: "排序顺序{0}",
  // [Auto-translated] "Show all sort levels"
  sortMoreAriaLabel: "显示各种级别",
  // [Auto-translated] "Add New"
  sortAddNewText: "添加新",
  // [Auto-translated] "Move sort level {0}"
  sortMoveLevelAriaLabel: "移动排序等级{0}",
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
  // [Auto-translated] "{0} of {1}"
  panelDynamicProgressText: "{0}{1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "面板 {面板索引}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "第 {0}/{1} 题",
  // [Auto-translated] "Question {0} of {1}"
  questionPositionProgressText: "问题{0}{1}",
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
  // [Auto-translated] "You must select Yes to continue."
  requireTrueError: "您必须选择“是”才能继续。",
  // [Auto-translated] "The value is incorrect."
  incorrectValueError: "数值是错误的。",
  // [Auto-translated] "The value contains unknown keys: {0}."
  incorrectValueUnknownKeysError: "该值包含未知键：{0}。",
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
  // [Auto-translated] "Invalid input"
  invalidInputError: "无效输入",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "不允许使用数字。",
  // [Auto-translated] "Please complete the value to match the required format."
  incompletePatternError: "请填写该数值以符合所需格式。",
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
  // [Auto-translated] "Bytes, KB, MB, GB, TB"
  fileSizeUnits: "字节、KB、MB、GB、TB",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "你最多能上传的文件数量是{0}。",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "无法上传文件。请为“onUploadFiles”事件添加处理程序。",
  // "Response required: enter another value."
  otherRequiredError: "请完成其他问题",
  // [Auto-translated] "The value '{0}' is not one of the available choices."
  variableValueNotInChoices: "“{0}”这个数值并不是可选的选项之一。",
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
  // [Auto-translated] "Move row {0}"
  moveRowAriaLabel: "移动{0}行",
  // "There are no rows."
  noRowsText: "无内容",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "行 {rowIndex}",
  // [Auto-translated] "{rowTitle}"
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
  progressbar: "进度条",
  // [Auto-translated] "Page {0}"
  progressbarPage: "第{0}页",
  // [Auto-translated] "Empty"
  conditionOperatorEmpty: "空的",
  // [Auto-translated] "Not empty"
  conditionOperatorNotempty: "不是空的",
  // [Auto-translated] "Equals"
  conditionOperatorEqual: "平等",
  // [Auto-translated] "Does not equal"
  conditionOperatorNotequal: "不等于",
  // [Auto-translated] "Contains"
  conditionOperatorContains: "包含",
  // [Auto-translated] "Does not contain"
  conditionOperatorNotcontains: "不包含",
  // [Auto-translated] "Any of"
  conditionOperatorAnyof: "任一",
  // [Auto-translated] "None of"
  conditionOperatorNoneof: "一个都不行",
  // [Auto-translated] "All of"
  conditionOperatorAllof: "全部",
  // [Auto-translated] "Greater than"
  conditionOperatorGreater: "大于",
  // [Auto-translated] "Less than"
  conditionOperatorLess: "低于",
  // [Auto-translated] "Greater than or equal to"
  conditionOperatorGreaterorequal: "大于或等于",
  // [Auto-translated] "Less than or equal to"
  conditionOperatorLessorequal: "小于或等于",
  // [Auto-translated] "All Filters"
  filterAllFilters: "所有筛选器",
  // [Auto-translated] "All Filters: {0}"
  filterAllFiltersCount: "所有筛选条件：{0}",
  // [Auto-translated] "Filters"
  filterDialogTitle: "筛选器",
  // [Auto-translated] "Search"
  filterSearchLabel: "搜索",
  // [Auto-translated] "Search by {0}"
  filterSearchPlaceholder: "按{0}搜索",
  // [Auto-translated] "{0} or {1}"
  filterSearchFieldsOr: "{0}还是{1}",
  // [Auto-translated] "{0}, or {1}"
  filterSearchFieldsOrLast: "{0}，或者{1}",
  // [Auto-translated] "Show More"
  filterShowMore: "显示更多",
  // [Auto-translated] "Show Less"
  filterShowLess: "显示更少",
  // [Auto-translated] "Clear All"
  filterClearAll: "清除所有",
  // [Auto-translated] "Clear {0}"
  filterClearChip: "清{0}",
  // [Auto-translated] "Filter Presets"
  filterPreset: "滤镜预设",
  // [Auto-translated] "Save as..."
  filterSaveAs: "另存为......",
  // [Auto-translated] "Save"
  filterSaveAsSave: "保存",
  // [Auto-translated] "Add \"{0}\"..."
  filterAddCustomValue: "加上“{0}”......",
  // [Auto-translated] "Filter Presets"
  filterPresetsTitle: "滤镜预设",
  // [Auto-translated] "Show {0} items"
  filterShowResultsCount: "显示{0}项",
  // [Auto-translated] "Show 1 item"
  filterShowOneResult: "显示1件商品",
  // [Auto-translated] "Show results"
  filterShowResults: "显示结果",
  // [Auto-translated] "New Preset"
  filterAddPresetTitle: "新预设",
  // [Auto-translated] "Preset name"
  filterPresetName: "预设名称",
  // [Auto-translated] "Fields to filter by"
  filterPresetFieldsLabel: "可筛选的字段",
  // [Auto-translated] "Filter expression"
  filterPresetExpressionLabel: "过滤器表达式",
  // [Auto-translated] "A preset with this name already exists."
  filterPresetTitleExists: "已有同名预设存在。",
  // [Auto-translated] "Add at least one condition."
  filterPresetNoConditions: "至少添加一个条件。",
  // [Auto-translated] "Enter an expression."
  filterPresetNoExpression: "输入一个表达式。",
  // [Auto-translated] "The expression is not valid."
  filterPresetInvalidExpression: "该表达式无效。",
  // [Auto-translated] "Switch to Expression"
  filterEditAsText: "切换到表达式",
  // [Auto-translated] "Switch to Fields"
  filterEditAsFields: "切换到字段",
  // [Auto-translated] "Type an expression here..."
  filterExpressionPlaceholder: "在此输入表达式...",
  // [Auto-translated] "Edit Preset"
  filterEditPreset: "编辑预设",
  // [Auto-translated] "Delete"
  filterDeletePreset: "删除",
  // [Auto-translated] "Add New..."
  filterAddPreset: "添加新建...",
  // [Auto-translated] "Edit Selected..."
  filterEditSelected: "编辑已选中...",
  // [Auto-translated] "{0} Expression"
  filterPresetExpression: "{0}表达式",
  // [Auto-translated] "Edit..."
  filterEditExpression: "编辑......",
  // [Auto-translated] "Search in filters and presets"
  filterSearchInFilters: "在筛选器和预设中搜索",
  // [Auto-translated] "Nothing found, try different keywords"
  filterNothingFound: "没找到什么，试试不同关键词",
  // [Auto-translated] "Generate a filter with AI"
  filterAiPromptNew: "用 AI 生成过滤器",
  // [Auto-translated] "Edit preset with AI"
  filterAiPromptEdit: "使用 AI 编辑预设",
  // [Auto-translated] "Describe the filter you want..."
  filterAiPromptPlaceholder: "描述你想要的过滤器......",
  // [Auto-translated] "Generate Filter"
  filterAiCreate: "生成过滤器",
  // [Auto-translated] "Edit"
  filterAiEdit: "编辑",
  // [Auto-translated] "Generating..."
  filterAiCreating: "正在生成......",
  // [Auto-translated] "Editing..."
  filterAiEditing: "编辑中......",
  // [Auto-translated] "AI could not make a filter. Try again."
  filterAiError: "AI无法制作过滤器。再试一次。",
  // [Auto-translated] "AI could not make a filter of this description."
  filterAiEmpty: "AI无法做出这种描述的过滤器。",
  // [Auto-translated] "to select"
  keyboardHintSelectText: "选择",
  // [Auto-translated] "to toggle"
  keyboardHintToggleText: "切换",
  // [Auto-translated] "to navigate"
  keyboardHintNavigateText: "导航",
  // [Auto-translated] "to continue"
  keyboardHintContinueText: "继续",
  // [Auto-translated] "to submit"
  keyboardHintSubmitText: "提交",
  // [Auto-translated] "or"
  keyboardHintOrText: "或",
  // [Auto-translated] "for a new line"
  keyboardHintNewLineText: "新线路",
  // [Auto-translated] "to next option"
  keyboardHintNextItemText: "下一个选项",
  // [Auto-translated] "to move"
  keyboardHintMoveText: "搬家",
  // [Auto-translated] "to open"
  keyboardHintOpenText: "开场",
  // [Auto-translated] "to close"
  keyboardHintCloseText: "结束"
};

setupLocale({ localeCode: "zh-cn", strings: simplifiedChineseSurveyStrings, nativeName: "简体中文", englishName: "Simplified Chinese" });