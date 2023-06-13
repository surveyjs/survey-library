// This dictionary contains 14 untranslated or inherited localization strings.
// These strings are commented out. Uncomment and edit them if you want to add your translations.
import { surveyLocalization } from "survey-core";

export var vietnameseSurveyStrings = {
  pagePrevText: "Trở về",
  pageNextText: "Tiếp theo",
  completeText: "Hoàn thành",
  previewText: "Xem trước",
  editText: "Chỉnh sửa",
  startSurveyText: "Bắt đầu",
  otherItemText: "Khác (mô tả)",
  noneItemText: "Trống",
  selectAllItemText: "Chọn tất cả",
  progressText: "Trang {0} / {1}",
  // indexText: "{0} of {1}",
  panelDynamicProgressText: "Dòng {0} / {1}",
  questionsProgressText: "Đã trả lời {0}/{1} câu hỏi",
  emptySurvey: "Không có trang hoặc câu hỏi nào được hiển thị trong cuộc khảo sát này.",
  completingSurvey: "Cảm ơn đã hoàn thành khảo sát!",
  completingSurveyBefore: "Hồ sơ chúng tôi cho thấy rằng bạn đã hoàn thành cuộc khảo sát này.",
  loadingSurvey: "Đang tải khảo sát...",
  placeholder: "Chọn...",
  // ratingOptionsCaption: "Select...",
  value: "Giá trị",
  requiredError: "Vui lòng trả lời câu hỏi.",
  requiredErrorInPanel: "Vui lòng trả lời ít nhất một câu hỏi.",
  requiredInAllRowsError: "Vui lòng trả lời các câu hỏi trên tất cả các dòng.",
  numericError: "Giá trị nên là kiểu số.",
  // minError: "The value should not be less than {0}",
  // maxError: "The value should not be greater than {0}",
  textMinLength: "Vui lòng nhập ít nhất {0} kí tự.",
  textMaxLength: "Vui lòng nhập ít hơn {0} kí tự.",
  textMinMaxLength: "Vui lòng nhập nhiều hơn {0} hoặc ít hơn {1} kí tự.",
  minRowCountError: "Vui lòng nhập ít nhất {0} dòng.",
  minSelectError: "Vui lòng chọn ít nhất {0} loại.",
  maxSelectError: "Vui lòng không chọn nhiều hơn {0} loại.",
  numericMinMax: "Giá trị '{0}' nên bằng hoặc lớn hơn {1} và bằng hoặc nhỏ hơn {2}",
  numericMin: "Giá trị '{0}' nên bằng hoặc lớn hơn {1}",
  numericMax: "Giá trị '{0}' nên bằng hoặc nhỏ hơn {1}",
  invalidEmail: "Vui lòng điền địa chỉ email hợp lệ.",
  invalidExpression: "Biểu thức: {0} nên trả về 'true'.",
  urlRequestError: "Yêu cầu trả về lỗi '{0}'. {1}",
  urlGetChoicesError: "Yêu cầu trả về dữ liệu trống hoặc thuộc tính 'path' không đúng",
  exceedMaxSize: "Kích thước tập tin không nên vượt quá {0}.",
  otherRequiredError: "Vui lòng điền giá trị khác.",
  uploadingFile: "Tập tin đang được tải lên. Vui lòng chờ một lúc và thử lại.",
  loadingFile: "Đang tải...",
  chooseFile: "Chọn các tập tin...",
  noFileChosen: "Không có tập tin nào được chọn",
  // fileDragAreaPlaceholder: "Drop a file here or click the button below to load the file.",
  confirmDelete: "Bạn muốn xóa dòng này?",
  keyDuplicationError: "Giá trị này không nên bị trùng lặp.",
  addColumn: "Thêm cột",
  addRow: "Thêm dòng",
  removeRow: "Xóa",
  // emptyRowsText: "There are no rows.",
  addPanel: "Thêm mới",
  removePanel: "Xóa",
  choices_Item: "mục",
  matrix_column: "Cột",
  matrix_row: "Dòng",
  // multipletext_itemname: "text",
  savingData: "Kết quả đang lưu lại trên hệ thống...",
  savingDataError: "Có lỗi xảy ra và chúng ta không thể lưu kết quả.",
  savingDataSuccess: "Kết quả đã được lưu thành công!",
  saveAgainButton: "Thử lại",
  timerMin: "phút",
  timerSec: "giây",
  timerSpentAll: "Bạn đã sử dụng {0} trên trang này và {1} trên toàn bộ.",
  timerSpentPage: "Bạn đã sử dụng {0} trên trang.",
  timerSpentSurvey: "Bạn đã sử dụng {0} trên toàn bộ.",
  timerLimitAll: "Bạn đã sử dụng {0} / {1} trên trang này và {2} / {3} trên toàn bộ.",
  timerLimitPage: "Bạn đã sử dụng {0} / {1} trên trang này.",
  timerLimitSurvey: "Bạn đã sử dụng {0} / {1} trên toàn bộ.",
  clearCaption: "Xóa",
  // signaturePlaceHolder: "Sign here",
  chooseFileCaption: "Chọn tập tin",
  removeFileCaption: "Xóa tập tin",
  booleanCheckedLabel: "Có",
  booleanUncheckedLabel: "Không",
  confirmRemoveFile: "Bạn có chắc chắn muốn xóa tập tin này: {0}?",
  confirmRemoveAllFiles: "Bạn có chắc chắn muốn xóa toàn bộ tập tin?",
  questionTitlePatternText: "Tiêu đề câu hỏi",
  // modalCancelButtonText: "Cancel",
  // modalApplyButtonText: "Apply",
  // filterStringPlaceholder: "Type to search...",
  // emptyMessage: "No data to display",
  // noEntriesText: "There are no entries yet.\nClick the button below to add a new entry.",
  // more: "More"
};

//Uncomment these two lines on creating a translation file. You should replace "en" and enStrings with your locale ("fr", "de" and so on) and your variable.
surveyLocalization.locales["vi"] = vietnameseSurveyStrings;
surveyLocalization.localeNames["vi"] = "Việt Nam";
