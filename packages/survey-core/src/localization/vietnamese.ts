import { setupLocale } from "survey-core";

export var vietnameseSurveyStrings = {
  // "Previous"
  pagePrevText: "Trở về",
  // "Next"
  pageNextText: "Tiếp theo",
  // "Complete"
  completeText: "Hoàn thành",
  // "Preview"
  previewText: "Xem trước",
  // "Edit"
  editText: "Chỉnh sửa",
  // "Start"
  startSurveyText: "Bắt đầu",
  // [Auto-translated] "Please leave a comment"
  commentText: "Vui lòng để lại bình luận",
  // "Other (describe)"
  otherItemText: "Khác (mô tả)",
  // "None"
  noneItemText: "Trống",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Từ chối trả lời",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Không biết",
  // "Select All"
  selectAllItemText: "Chọn tất cả",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Bỏ chọn tất cả",
  // "Page {0} of {1}"
  progressText: "Trang {0} / {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} của {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Dòng {0} / {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Bảng điều khiển {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Đã trả lời {0}/{1} câu hỏi",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Không có trang hoặc câu hỏi nào được hiển thị trong cuộc khảo sát này.",
  // "Thank you for completing the survey"
  completingSurvey: "Cảm ơn đã hoàn thành khảo sát!",
  // "You have already completed this survey."
  completingSurveyBefore: "Hồ sơ chúng tôi cho thấy rằng bạn đã hoàn thành cuộc khảo sát này.",
  // "Loading Survey..."
  loadingSurvey: "Đang tải khảo sát...",
  // "Select..."
  placeholder: "Chọn...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Lựa...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Lựa...",
  // "value"
  value: "Giá trị",
  // "Response required."
  requiredError: "Vui lòng trả lời câu hỏi.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Vui lòng trả lời ít nhất một câu hỏi.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Vui lòng trả lời các câu hỏi trên tất cả các dòng.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Mỗi hàng phải có một giá trị duy nhất.",
  // "The value should be numeric."
  numericError: "Giá trị nên là kiểu số.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Giá trị không được nhỏ hơn {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Vui lòng nhập giá trị khớp với kích thước bước của {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Giá trị không được lớn hơn {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Số không được phép.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Vui lòng nhập ít nhất {0} kí tự.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Vui lòng nhập ít hơn {0} kí tự.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Vui lòng nhập nhiều hơn {0} hoặc ít hơn {1} kí tự.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Vui lòng nhập ít nhất {0} dòng.",
  // "Please select at least {0} option(s)."
  minSelectError: "Vui lòng chọn ít nhất {0} loại.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Vui lòng không chọn nhiều hơn {0} loại.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Giá trị '{0}' nên bằng hoặc lớn hơn {1} và bằng hoặc nhỏ hơn {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "Giá trị '{0}' nên bằng hoặc lớn hơn {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "Giá trị '{0}' nên bằng hoặc nhỏ hơn {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Vui lòng điền địa chỉ email hợp lệ.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Biểu thức: {0} nên trả về 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Yêu cầu trả về lỗi '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Yêu cầu trả về dữ liệu trống hoặc thuộc tính 'path' không đúng",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Kích thước tập tin không nên vượt quá {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Không thể tải tệp lên. Vui lòng thêm trình xử lý cho sự kiện 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Vui lòng điền giá trị khác.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Tập tin đang được tải lên. Vui lòng chờ một lúc và thử lại.",
  // "Loading..."
  loadingFile: "Đang tải...",
  // "Choose file(s)..."
  chooseFile: "Chọn các tập tin...",
  // "No file selected"
  noFileChosen: "Không có tập tin nào được chọn",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Kéo và thả tệp vào đây hoặc nhấp vào nút bên dưới để chọn tệp để tải lên.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Bạn muốn xóa dòng này?",
  // "This value should be unique."
  keyDuplicationError: "Giá trị này không nên bị trùng lặp.",
  // "Add Column"
  addColumn: "Thêm cột",
  // "Add Row"
  addRow: "Thêm dòng",
  // "Remove"
  removeRow: "Xóa",
  // [Auto-translated] "There are no rows."
  noRowsText: "Không có hàng.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Hàng {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Thêm mới",
  // "Remove"
  removePanel: "Xóa",
  // [Auto-translated] "Show Details"
  showDetails: "Hiển thị chi tiết",
  // [Auto-translated] "Hide Details"
  hideDetails: "Ẩn chi tiết",
  // "item"
  choices_Item: "mục",
  // [Auto-translated] "Choice option"
  choices_Choice: "Tùy chọn lựa chọn",
  // "Column"
  matrix_column: "Cột",
  // "Row"
  matrix_row: "Dòng",
  // [Auto-translated] "text"
  multipletext_itemname: "Nhắn tin",
  // "The results are being saved on the server..."
  savingData: "Kết quả đang lưu lại trên hệ thống...",
  // "An error occurred and we could not save the results."
  savingDataError: "Có lỗi xảy ra và chúng ta không thể lưu kết quả.",
  // "The results were saved successfully!"
  savingDataSuccess: "Kết quả đã được lưu thành công!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Phản hồi của bạn vượt quá 64KB. Vui lòng giảm kích thước tệp của bạn và thử lại hoặc liên hệ với chủ sở hữu khảo sát.",
  // "Try again"
  saveAgainButton: "Thử lại",
  // "min"
  timerMin: "phút",
  // "sec"
  timerSec: "giây",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Bạn đã sử dụng {0} trên trang này và {1} trên toàn bộ.",
  // "You have spent {0} on this page."
  timerSpentPage: "Bạn đã sử dụng {0} trên trang.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Bạn đã sử dụng {0} trên toàn bộ.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Bạn đã sử dụng {0} / {1} trên trang này và {2} / {3} trên toàn bộ.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Bạn đã sử dụng {0} / {1} trên trang này.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Bạn đã sử dụng {0} / {1} trên toàn bộ.",
  // "Clear"
  clearCaption: "Xóa",
  // [Auto-translated] "Select"
  selectCaption: "Lựa",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Ký tên tại đây",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Không có chữ ký",
  // "Select File"
  chooseFileCaption: "Chọn tập tin",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Chụp ảnh",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Nhấp vào nút bên dưới để chụp ảnh bằng máy ảnh.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Kéo và thả hoặc chọn tệp để tải lên hoặc chụp ảnh bằng máy ảnh.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Thay thế tập tin",
  // "Remove this file"
  removeFileCaption: "Xóa tập tin",
  // "Yes"
  booleanCheckedLabel: "Có",
  // "No"
  booleanUncheckedLabel: "Không",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Bạn có chắc chắn muốn xóa tập tin này: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Bạn có chắc chắn muốn xóa toàn bộ tập tin?",
  // "Question Title"
  questionTitlePatternText: "Tiêu đề câu hỏi",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Hủy",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Áp dụng",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Nhập để tìm kiếm...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Không có dữ liệu để hiển thị",
  // [Auto-translated] "Loading..."
  loadingPage: "Tải...",
  // [Auto-translated] "Loading..."
  loadingData: "Tải...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Chưa có mục nhập.\nNhấp vào nút bên dưới để thêm mục mới.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Không có mục nhập",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Bảng điều khiển mới",
  // [Auto-translated] "More"
  more: "Nhiều hơn",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Tất cả các lựa chọn được chọn để xếp hạng",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Kéo các lựa chọn vào đây để xếp hạng chúng",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Hủy",
  // "Create \"{0}\" item..."
  createCustomItem: "Tạo vật phẩm \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Mục lục",
  // [Auto-translated] "Progress bar"
  progressbar: "Thanh tiến trình"
};

setupLocale({ localeCode: "vi", strings: vietnameseSurveyStrings, nativeName: "việt nam", englishName: "Vietnamese" });