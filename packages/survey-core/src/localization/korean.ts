import { setupLocale } from "survey-core";

export var koreanStrings = {
  // "Previous"
  pagePrevText: "이전",
  // "Next"
  pageNextText: "다음",
  // "Complete"
  completeText: "완료",
  // "Preview"
  previewText: "미리보기",
  // "Edit"
  editText: "수정",
  // "Start"
  startSurveyText: "시작",
  // [Auto-translated] "Please leave a comment"
  commentText: "코멘트를 남겨주세요",
  // "Other (describe)"
  otherItemText: "기타 (설명)",
  // "None"
  noneItemText: "없음",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "대답 거부",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "모르다",
  // "Select All"
  selectAllItemText: "모두 선택",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "모두 선택 해제",
  // "Page {0} of {1}"
  progressText: "페이지 {1} / {0}",
  // "{0} of {1}"
  indexText: "{0} / {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "{0} / {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "패널 {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "{0} / {1} 개의 질문에 답변함",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "설문지에 보여지는 페이지나 질문이 없습니다.",
  // "Thank you for completing the survey"
  completingSurvey: "설문조사를 완료해 주셔서 감사합니다.",
  // "You have already completed this survey."
  completingSurveyBefore: "기록에 따르면 이미 설문 조사를 마치셨습니다.",
  // "Loading Survey..."
  loadingSurvey: "설문조사가 로드중입니다...",
  // "Select..."
  placeholder: "선택...",
  // "Select..."
  ratingOptionsCaption: "등급을 매기려면 누르세요.",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "고르다...",
  // "value"
  value: "값",
  // "Response required."
  requiredError: "질문에 답하시오.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "하나 이상의 질문에 답하십시오.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "모든 행에 있는 질문에 답하십시오.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "각 행에는 고유한 값이 있어야 합니다.",
  // "The value should be numeric."
  numericError: "값은 숫자여야 합니다.",
  // "The value should not be less than {0}"
  minError: "값은 {0}보다 작으면 안됩니다.",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "{0}의 스텝 크기와 일치하는 값을 입력하십시오.",
  // "The value should not be greater than {0}"
  maxError: "값은 {0}보다 클 수 없습니다.",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "숫자는 허용되지 않습니다.",
  // "Please enter at least {0} character(s)."
  textMinLength: "답변의 길이는 최소 {0}자여야 입니다.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "답변의 길이는 {0}자를 초과 할 수 없습니다.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "답변의 길이는 {0} - {1}자 사이여야 합니다.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "최소 {0}개의 행을 채우십시오",
  // "Please select at least {0} option(s)."
  minSelectError: "최소 {0}개의 변수를 선택하십시오.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "최대 {0}개의 변수를 선택하십시오.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}'은 {1}보다 크거나 같고 {2}보다 작거나 같아야합니다.",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}'은 {1}보다 크거나 같아야합니다.",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}'은 {1}보다 작거나 같아야합니다.",
  // "Please enter a valid e-mail address."
  invalidEmail: "올바른 이메일 주소를 입력하십시오.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "표현식: {0}은 '참'이어야 합니다.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "'{0}'으로 잘못된 요청입니다. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "비어있는 데이터를 요청했거나 잘못된 속성의 경로입니다.",
  // "The file size should not exceed {0}."
  exceedMaxSize: "파일 크기가 {0}을 초과 할 수 없습니다.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "업로드할 수 있는 최대 파일 수는 {0}입니다.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "파일을 업로드할 수 없습니다. 'onUploadFiles'이벤트에 대한 핸들러를 추가하십시오.",
  // "Response required: enter another value."
  otherRequiredError: "다른 질문을 작성하십시오.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "파일 업로드 중입니다. 잠시 후 다시 시도하십시오.",
  // "Loading..."
  loadingFile: "로드 중...",
  // "Choose file(s)..."
  chooseFile: "파일 선택...",
  // "No file selected"
  noFileChosen: "선택된 파일이 없습니다.",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "파일을 여기에 놓거나 아래 버튼을 클릭하여 파일을 불러오세요.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "기록을 삭제하시겠습니까?",
  // "This value should be unique."
  keyDuplicationError: " 이 값은 고유해야합니다.",
  // "Add Column"
  addColumn: "열 추가",
  // "Add Row"
  addRow: "행 추가",
  // "Remove"
  removeRow: "제거",
  // "There are no rows."
  noRowsText: "행이 없습니다.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "행 {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "추가",
  // "Remove"
  removePanel: "제거",
  // [Auto-translated] "Show Details"
  showDetails: "세부 정보 표시",
  // [Auto-translated] "Hide Details"
  hideDetails: "세부 정보 숨기기",
  // "item"
  choices_Item: "항목",
  // [Auto-translated] "Choice option"
  choices_Choice: "선택 옵션",
  // "Column"
  matrix_column: "열",
  // "Row"
  matrix_row: "행",
  // "text"
  multipletext_itemname: "텍스트",
  // "The results are being saved on the server..."
  savingData: "결과가 서버에 저장 중입니다...",
  // "An error occurred and we could not save the results."
  savingDataError: "오류가 발생하여 결과를 저장할 수 없습니다.",
  // "The results were saved successfully!"
  savingDataSuccess: "결과가 성공적으로 저장되었습니다.",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "응답이 64KB를 초과합니다. 파일 크기를 줄이고 다시 시도하거나 설문조사 소유자에게 문의하십시오.",
  // "Try again"
  saveAgainButton: "다시 시도하세요.",
  // "min"
  timerMin: "분",
  // "sec"
  timerSec: "초",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "현재 페이지에서 {0}을 소요해 총 {1}이 걸렸습니다.",
  // "You have spent {0} on this page."
  timerSpentPage: "현재 페이지에서 {0}이 걸렸습니다.",
  // "You have spent {0} in total."
  timerSpentSurvey: "총 {0}이 걸렸습니다.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "현재 페이지에서 {0}/{1}을 소요해 총 {2}/{3}이 걸렸습니다.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "현재 페이지에서 {0}/{1}이 걸렸습니다.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "총 {0}/{1}이 걸렸습니다.",
  // "Clear"
  clearCaption: "지우기",
  // [Auto-translated] "Select"
  selectCaption: "고르다",
  // "Sign here"
  signaturePlaceHolder: "서명하세요.",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "서명 없음",
  // "Select File"
  chooseFileCaption: "파일 선택",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "사진 찍기",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "아래 버튼을 클릭하여 카메라로 사진을 찍습니다.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "업로드할 파일을 드래그 앤 드롭하거나 선택하거나 카메라를 사용하여 사진을 찍습니다.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "파일 바꾸기",
  // "Remove this file"
  removeFileCaption: "파일 제거",
  // "Yes"
  booleanCheckedLabel: "예",
  // "No"
  booleanUncheckedLabel: "아니오",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "{0} 파일을 제거 하시겠습니까?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "모든 파일을 제거 하시겠습니까?",
  // "Question Title"
  questionTitlePatternText: "질문 제목",
  // "Cancel"
  modalCancelButtonText: "취소",
  // "Apply"
  modalApplyButtonText: "적용",
  // "Type to search..."
  filterStringPlaceholder: "검색 유형...",
  // [Auto-translated] "No data to display"
  emptyMessage: "표시할 데이터가 없습니다.",
  // [Auto-translated] "Loading..."
  loadingPage: "로드...",
  // [Auto-translated] "Loading..."
  loadingData: "로드...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "아직 항목이 없습니다.\n새 항목을 추가하려면 아래 버튼을 클릭하세요.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "항목 없음",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "새 패널",
  // "More"
  more: "더보기",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "그래",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "모든 선택 항목이 순위를 위해 선택됩니다.",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "선택 항목을 여기로 드래그하여 순위를 매깁니다",
  // [Auto-translated] "OK"
  ok: "그래",
  // [Auto-translated] "Cancel"
  cancel: "취소",
  // "Create \"{0}\" item..."
  createCustomItem: "\"{0}\" 항목 만들기...",
  // [Auto-translated] "Table of contents"
  toc: "목차",
  // [Auto-translated] "Progress bar"
  progressbar: "진행률 표시줄"
};

setupLocale({ localeCode: "ko", strings: koreanStrings, nativeName: "한국어", englishName: "Korean" });