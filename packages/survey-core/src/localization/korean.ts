import { setupLocale } from "survey-core";

export var koreanStrings = {
  pagePrevText: "이전",
  pageNextText: "다음",
  completeText: "완료",
  previewText: "미리보기",
  editText: "수정",
  startSurveyText: "시작",
  otherItemText: "기타 (설명)",
  noneItemText: "없음",
  refuseItemText: "대답 거부",
  dontKnowItemText: "모르다",
  selectAllItemText: "모두 선택",
  deselectAllItemText: "모두 선택 해제",
  progressText: "페이지 {1} / {0}",
  indexText: "{0} / {1}",
  panelDynamicProgressText: "{0} / {1}",
  panelDynamicTabTextFormat: "패널 {panelIndex}",
  questionsProgressText: "{0} / {1} 개의 질문에 답변함",
  emptySurvey: "설문지에 보여지는 페이지나 질문이 없습니다.",
  completingSurvey: "설문조사를 완료해 주셔서 감사합니다.",
  completingSurveyBefore: "기록에 따르면 이미 설문 조사를 마치셨습니다.",
  loadingSurvey: "설문조사가 로드중입니다...",
  placeholder: "선택...",
  ratingOptionsCaption: "등급을 매기려면 누르세요.",
  value: "값",
  requiredError: "질문에 답하시오.",
  requiredErrorInPanel: "하나 이상의 질문에 답하십시오.",
  requiredInAllRowsError: "모든 행에 있는 질문에 답하십시오.",
  eachRowUniqueError: "각 행에는 고유한 값이 있어야 합니다.",
  numericError: "값은 숫자여야 합니다.",
  minError: "값은 {0}보다 작으면 안됩니다.",
  maxError: "값은 {0}보다 클 수 없습니다.",
  textNoDigitsAllow: "숫자는 허용되지 않습니다.",
  textMinLength: "답변의 길이는 최소 {0}자여야 입니다.",
  textMaxLength: "답변의 길이는 {0}자를 초과 할 수 없습니다.",
  textMinMaxLength: "답변의 길이는 {0} - {1}자 사이여야 합니다.",
  minRowCountError: "최소 {0}개의 행을 채우십시오",
  minSelectError: "최소 {0}개의 변수를 선택하십시오.",
  maxSelectError: "최대 {0}개의 변수를 선택하십시오.",
  numericMinMax: "'{0}'은 {1}보다 크거나 같고 {2}보다 작거나 같아야합니다.",
  numericMin: "'{0}'은 {1}보다 크거나 같아야합니다.",
  numericMax: "'{0}'은 {1}보다 작거나 같아야합니다.",
  invalidEmail: "올바른 이메일 주소를 입력하십시오.",
  invalidExpression: "표현식: {0}은 '참'이어야 합니다.",
  urlRequestError: "'{0}'으로 잘못된 요청입니다. {1}",
  urlGetChoicesError: "비어있는 데이터를 요청했거나 잘못된 속성의 경로입니다.",
  exceedMaxSize: "파일 크기가 {0}을 초과 할 수 없습니다.",
  noUploadFilesHandler: "파일을 업로드할 수 없습니다. 'onUploadFiles'이벤트에 대한 핸들러를 추가하십시오.",
  otherRequiredError: "다른 질문을 작성하십시오.",
  uploadingFile: "파일 업로드 중입니다. 잠시 후 다시 시도하십시오.",
  loadingFile: "로드 중...",
  chooseFile: "파일 선택...",
  noFileChosen: "선택된 파일이 없습니다.",
  filePlaceholder: "파일을 여기에 놓거나 아래 버튼을 클릭하여 파일을 불러오세요.",
  confirmDelete: "기록을 삭제하시겠습니까?",
  keyDuplicationError: " 이 값은 고유해야합니다.",
  addColumn: "열 추가",
  addRow: "행 추가",
  removeRow: "제거",
  noRowsText: "행이 없습니다.",
  addPanel: "추가",
  removePanel: "제거",
  showDetails: "세부 정보 표시",
  hideDetails: "세부 정보 숨기기",
  choices_Item: "항목",
  matrix_column: "열",
  matrix_row: "행",
  multipletext_itemname: "텍스트",
  savingData: "결과가 서버에 저장 중입니다...",
  savingDataError: "오류가 발생하여 결과를 저장할 수 없습니다.",
  savingDataSuccess: "결과가 성공적으로 저장되었습니다.",
  savingExceedSize: "응답이 64KB를 초과합니다. 파일 크기를 줄인 후 다시 시도하거나 설문조사 소유자에게 문의하세요.",
  saveAgainButton: "다시 시도하세요.",
  timerMin: "분",
  timerSec: "초",
  timerSpentAll: "현재 페이지에서 {0}을 소요해 총 {1}이 걸렸습니다.",
  timerSpentPage: "현재 페이지에서 {0}이 걸렸습니다.",
  timerSpentSurvey: "총 {0}이 걸렸습니다.",
  timerLimitAll: "현재 페이지에서 {0}/{1}을 소요해 총 {2}/{3}이 걸렸습니다.",
  timerLimitPage: "현재 페이지에서 {0}/{1}이 걸렸습니다.",
  timerLimitSurvey: "총 {0}/{1}이 걸렸습니다.",
  clearCaption: "지우기",
  signaturePlaceHolder: "서명하세요.",
  signaturePlaceHolderReadOnly: "서명 없음",
  chooseFileCaption: "파일 선택",
  takePhotoCaption: "사진 찍기",
  photoPlaceholder: "아래 버튼을 클릭하여 카메라로 사진을 찍습니다.",
  fileOrPhotoPlaceholder: "업로드할 파일을 드래그 앤 드롭하거나 선택하거나 카메라를 사용하여 사진을 찍습니다.",
  replaceFileCaption: "파일 바꾸기",
  removeFileCaption: "파일 제거",
  booleanCheckedLabel: "예",
  booleanUncheckedLabel: "아니오",
  confirmRemoveFile: "{0} 파일을 제거 하시겠습니까?",
  confirmRemoveAllFiles: "모든 파일을 제거 하시겠습니까?",
  questionTitlePatternText: "질문 제목",
  modalCancelButtonText: "취소",
  modalApplyButtonText: "적용",
  filterStringPlaceholder: "검색 유형...",
  emptyMessage: "표시할 데이터가 없습니다.",
  noEntriesText: "아직 항목이 없습니다.\n새 항목을 추가하려면 아래 버튼을 클릭하세요.",
  noEntriesReadonlyText: "항목이 없습니다.",
  tabTitlePlaceholder: "새 패널",
  more: "더보기",
  tagboxDoneButtonCaption: "그래",
  selectToRankEmptyRankedAreaText: "모든 선택 항목이 순위가 매겨집니다.",
  selectToRankEmptyUnrankedAreaText: "여기에 선택 항목을 끌어다 놓아 순위를 매깁니다.",
  ok: "그래",
  cancel: "취소"
};

setupLocale({ localeCode: "ko", strings: koreanStrings, nativeName: "한국어", englishName: "Korean" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "패널 {panelIndex}"
// emptyMessage: "No data to display" => "표시할 데이터가 없습니다."
// noEntriesReadonlyText: "There are no entries." => "항목이 없습니다."
// tagboxDoneButtonCaption: "OK" => "그래"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "모든 선택 항목이 순위가 매겨집니다."
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "여기에 선택 항목을 끌어다 놓아 순위를 매깁니다."// takePhotoCaption: "Take Photo" => "사진 찍기"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "아래 버튼을 클릭하여 카메라로 사진을 찍습니다."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "업로드할 파일을 드래그 앤 드롭하거나 선택하거나 카메라를 사용하여 사진을 찍습니다."
// replaceFileCaption: "Replace file" => "파일 바꾸기"// eachRowUniqueError: "Each row must have a unique value." => "각 행에는 고유한 값이 있어야 합니다."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "파일을 업로드할 수 없습니다. 'onUploadFiles'이벤트에 대한 핸들러를 추가하십시오."
// showDetails: "Show Details" => "세부 정보 표시"
// hideDetails: "Hide Details" => "세부 정보 숨기기"
// ok: "OK" => "그래"
// cancel: "Cancel" => "취소"
// refuseItemText: "Refuse to answer" => "대답 거부"
// dontKnowItemText: "Don't know" => "모르다"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "응답이 64KB를 초과합니다. 파일 크기를 줄인 후 다시 시도하거나 설문조사 소유자에게 문의하세요."
// signaturePlaceHolderReadOnly: "No signature" => "서명 없음"// tabTitlePlaceholder: "New Panel" => "새 패널"// deselectAllItemText: "Deselect all" => "모두 선택 해제"
// textNoDigitsAllow: "Numbers are not allowed." => "숫자는 허용되지 않습니다."