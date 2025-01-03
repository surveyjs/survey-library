import { setupLocale } from "survey-core";

export var vietnameseSurveyStrings = {
  pagePrevText: "Trở về",
  pageNextText: "Tiếp theo",
  completeText: "Hoàn thành",
  previewText: "Xem trước",
  editText: "Chỉnh sửa",
  startSurveyText: "Bắt đầu",
  otherItemText: "Khác (mô tả)",
  noneItemText: "Trống",
  refuseItemText: "Từ chối trả lời",
  dontKnowItemText: "Không biết",
  selectAllItemText: "Chọn tất cả",
  deselectAllItemText: "Bỏ chọn tất cả",
  progressText: "Trang {0} / {1}",
  indexText: "{0} của {1}",
  panelDynamicProgressText: "Dòng {0} / {1}",
  panelDynamicTabTextFormat: "Bảng điều khiển {panelIndex}",
  questionsProgressText: "Đã trả lời {0}/{1} câu hỏi",
  emptySurvey: "Không có trang hoặc câu hỏi nào được hiển thị trong cuộc khảo sát này.",
  completingSurvey: "Cảm ơn đã hoàn thành khảo sát!",
  completingSurveyBefore: "Hồ sơ chúng tôi cho thấy rằng bạn đã hoàn thành cuộc khảo sát này.",
  loadingSurvey: "Đang tải khảo sát...",
  placeholder: "Chọn...",
  ratingOptionsCaption: "Lựa...",
  value: "Giá trị",
  requiredError: "Vui lòng trả lời câu hỏi.",
  requiredErrorInPanel: "Vui lòng trả lời ít nhất một câu hỏi.",
  requiredInAllRowsError: "Vui lòng trả lời các câu hỏi trên tất cả các dòng.",
  eachRowUniqueError: "Mỗi hàng phải có một giá trị duy nhất.",
  numericError: "Giá trị nên là kiểu số.",
  minError: "Giá trị không được nhỏ hơn {0}",
  maxError: "Giá trị không được lớn hơn {0}",
  textNoDigitsAllow: "Số không được phép.",
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
  noUploadFilesHandler: "Không thể tải tệp lên. Vui lòng thêm trình xử lý cho sự kiện 'onUploadFiles'.",
  otherRequiredError: "Vui lòng điền giá trị khác.",
  uploadingFile: "Tập tin đang được tải lên. Vui lòng chờ một lúc và thử lại.",
  loadingFile: "Đang tải...",
  chooseFile: "Chọn các tập tin...",
  noFileChosen: "Không có tập tin nào được chọn",
  filePlaceholder: "Kéo và thả tệp vào đây hoặc nhấp vào nút bên dưới và chọn tệp để tải lên.",
  confirmDelete: "Bạn muốn xóa dòng này?",
  keyDuplicationError: "Giá trị này không nên bị trùng lặp.",
  addColumn: "Thêm cột",
  addRow: "Thêm dòng",
  removeRow: "Xóa",
  noRowsText: "Không có hàng.",
  addPanel: "Thêm mới",
  removePanel: "Xóa",
  showDetails: "Hiển thị chi tiết",
  hideDetails: "Ẩn chi tiết",
  choices_Item: "mục",
  matrix_column: "Cột",
  matrix_row: "Dòng",
  multipletext_itemname: "Nhắn tin",
  savingData: "Kết quả đang lưu lại trên hệ thống...",
  savingDataError: "Có lỗi xảy ra và chúng ta không thể lưu kết quả.",
  savingDataSuccess: "Kết quả đã được lưu thành công!",
  savingExceedSize: "Phản hồi của bạn vượt quá 64KB. Vui lòng giảm kích thước (các) tệp của bạn và thử lại hoặc liên hệ với chủ sở hữu khảo sát.",
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
  signaturePlaceHolder: "Ký tên tại đây",
  signaturePlaceHolderReadOnly: "Không có chữ ký",
  chooseFileCaption: "Chọn tập tin",
  takePhotoCaption: "Chụp ảnh",
  photoPlaceholder: "Nhấp vào nút bên dưới để chụp ảnh bằng máy ảnh.",
  fileOrPhotoPlaceholder: "Kéo và thả hoặc chọn tệp để tải lên hoặc chụp ảnh bằng máy ảnh.",
  replaceFileCaption: "Thay thế tập tin",
  removeFileCaption: "Xóa tập tin",
  booleanCheckedLabel: "Có",
  booleanUncheckedLabel: "Không",
  confirmRemoveFile: "Bạn có chắc chắn muốn xóa tập tin này: {0}?",
  confirmRemoveAllFiles: "Bạn có chắc chắn muốn xóa toàn bộ tập tin?",
  questionTitlePatternText: "Tiêu đề câu hỏi",
  modalCancelButtonText: "Hủy",
  modalApplyButtonText: "Áp dụng",
  filterStringPlaceholder: "Nhập để tìm kiếm...",
  emptyMessage: "Không có dữ liệu để hiển thị",
  noEntriesText: "Chưa có mục nào.\nNhấp vào nút bên dưới để thêm mục nhập mới.",
  noEntriesReadonlyText: "Không có mục.",
  tabTitlePlaceholder: "Bảng điều khiển mới",
  more: "Nhiều hơn",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Tất cả các lựa chọn được xếp hạng",
  selectToRankEmptyUnrankedAreaText: "Kéo và thả các lựa chọn vào đây để xếp hạng chúng",
  ok: "OK",
  cancel: "Hủy"
};

setupLocale({ localeCode: "vi", strings: vietnameseSurveyStrings, nativeName: "việt nam", englishName: "Vietnamese" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} của {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Bảng điều khiển {panelIndex}"
// ratingOptionsCaption: "Select..." => "Lựa..."
// minError: "The value should not be less than {0}" => "Giá trị không được nhỏ hơn {0}"
// maxError: "The value should not be greater than {0}" => "Giá trị không được lớn hơn {0}"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Kéo và thả tệp vào đây hoặc nhấp vào nút bên dưới và chọn tệp để tải lên."
// noRowsText: "There are no rows." => "Không có hàng."
// multipletext_itemname: "text" => "Nhắn tin"
// signaturePlaceHolder: "Sign here" => "Ký tên tại đây"
// modalCancelButtonText: "Cancel" => "Hủy"
// modalApplyButtonText: "Apply" => "Áp dụng"
// filterStringPlaceholder: "Type to search..." => "Nhập để tìm kiếm..."
// emptyMessage: "No data to display" => "Không có dữ liệu để hiển thị"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Chưa có mục nào.\nNhấp vào nút bên dưới để thêm mục nhập mới."
// noEntriesReadonlyText: "There are no entries." => "Không có mục."
// more: "More" => "Nhiều hơn"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Tất cả các lựa chọn được xếp hạng"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Kéo và thả các lựa chọn vào đây để xếp hạng chúng"// takePhotoCaption: "Take Photo" => "Chụp ảnh"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Nhấp vào nút bên dưới để chụp ảnh bằng máy ảnh."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Kéo và thả hoặc chọn tệp để tải lên hoặc chụp ảnh bằng máy ảnh."
// replaceFileCaption: "Replace file" => "Thay thế tập tin"// eachRowUniqueError: "Each row must have a unique value." => "Mỗi hàng phải có một giá trị duy nhất."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Không thể tải tệp lên. Vui lòng thêm trình xử lý cho sự kiện 'onUploadFiles'."
// showDetails: "Show Details" => "Hiển thị chi tiết"
// hideDetails: "Hide Details" => "Ẩn chi tiết"
// ok: "OK" => "OK"
// cancel: "Cancel" => "Hủy"// refuseItemText: "Refuse to answer" => "Từ chối trả lời"
// dontKnowItemText: "Don't know" => "Không biết"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Phản hồi của bạn vượt quá 64KB. Vui lòng giảm kích thước (các) tệp của bạn và thử lại hoặc liên hệ với chủ sở hữu khảo sát."
// signaturePlaceHolderReadOnly: "No signature" => "Không có chữ ký"// tabTitlePlaceholder: "New Panel" => "Bảng điều khiển mới"// deselectAllItemText: "Deselect all" => "Bỏ chọn tất cả"
// textNoDigitsAllow: "Numbers are not allowed." => "Số không được phép."