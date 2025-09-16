import { setupLocale } from "survey-core";

export var malaySurveyStrings = {
  // "Previous"
  pagePrevText: "Sebelumnya",
  // "Next"
  pageNextText: "Seterusnya",
  // "Complete"
  completeText: "Selesai",
  // "Preview"
  previewText: "Pratonton",
  // "Edit"
  editText: "Edit",
  // "Start"
  startSurveyText: "Mula",
  // [Auto-translated] "Please leave a comment"
  commentText: "Sila tinggalkan komen",
  // "Other (describe)"
  otherItemText: "Lain (terangkan)",
  // "None"
  noneItemText: "Tiada",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Enggan menjawab",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Tak tahu",
  // "Select All"
  selectAllItemText: "Pilih Semua",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Nyahpilih semua",
  // "Page {0} of {1}"
  progressText: "Halaman {0} daripada {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Rekod {0} daripada {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "{0}/{1} soalan telah dijawab",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Tiada halaman atau soalan boleh dilihat dalam tinjauan.",
  // "Thank you for completing the survey"
  completingSurvey: "Terima kasih kerana melengkapkan tinjauan!",
  // "You have already completed this survey."
  completingSurveyBefore: "Rekod kami menunjukkan yang anda telah melengkapkan tinjauan ini.",
  // "Loading Survey..."
  loadingSurvey: "Memuatkan Tinjauan...",
  // "Select..."
  placeholder: "Pilih...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Pilih...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Pilih...",
  // "value"
  value: "nilai",
  // "Response required."
  requiredError: "Respons diperlukan.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Respons diperlukan: jawab sekurang-kurangnya satu soalan.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Respons diperlukan: jawab soalan dalam semua baris.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Setiap baris mesti mempunyai nilai yang unik.",
  // "The value should be numeric."
  numericError: "Nilai mestilah numerik.",
  // "The value should not be less than {0}"
  minError: "Nilai tidak boleh kurang daripada {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Sila masukkan nilai yang sepadan dengan saiz langkah {0}.",
  // "The value should not be greater than {0}"
  maxError: "Nilai tidak boleh lebih besar daripada {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Nombor tidak dibenarkan.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Sila masukkan sekurang-kurangnya {0} aksara.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Sila masukkan tidak lebih daripada {0} aksara.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Sila masukkan sekurang-kurangnya {0} dan tidak lebih daripada {1} aksara.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Sila isikan sekurang-kurangnya {0} baris.",
  // "Please select at least {0} option(s)."
  minSelectError: "Sila pilih sekurang-kurangnya {0} varian.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Sila pilih tidak lebih daripada {0} varian.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' mestilah sekurang-kurangnya {1} dan paling banyak {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' mestilah sekurang-kurangnya {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' mestilah paling banyak {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Sila masukkan alamat e-mel yang sah.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Ekspresi: {0} hendaklah mengembalikan nilai 'benar'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Permintaan mengembalikan ralat '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Permintaan mengembalikan data kosong atau ciri 'laluan' salah",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Saiz fail hendaklah tidak melebihi {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Fail tidak boleh dimuat naik. Sila tambah pengendali untuk acara 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Respons diperlukan: masukkan nilai lain.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Fail anda sedang dimuat naik. Sila tunggu beberapa saat dan cuba lagi.",
  // "Loading..."
  loadingFile: "Memuat...",
  // "Choose file(s)..."
  chooseFile: "Pilih fail...",
  // "No file selected"
  noFileChosen: "Tiada fail dipilih",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Letakkan fail di sini atau klik butang di bawah untuk memuatkan fail.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Adakah anda ingin memadamkan rekod?",
  // "This value should be unique."
  keyDuplicationError: "Nilai ini hendaklah unik.",
  // "Add Column"
  addColumn: "Tambahkan lajur",
  // "Add Row"
  addRow: "Tambahkan baris",
  // "Remove"
  removeRow: "Alih keluar",
  // "There are no rows."
  noRowsText: "Tiada baris.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Baris {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Tambah baharu",
  // "Remove"
  removePanel: "Alih keluar",
  // [Auto-translated] "Show Details"
  showDetails: "Tunjukkan Butiran",
  // [Auto-translated] "Hide Details"
  hideDetails: "Sembunyikan Butiran",
  // "item"
  choices_Item: "item",
  // [Auto-translated] "Choice option"
  choices_Choice: "Pilihan pilihan",
  // "Column"
  matrix_column: "Lajur",
  // "Row"
  matrix_row: "Baris",
  // "text"
  multipletext_itemname: "teks",
  // "The results are being saved on the server..."
  savingData: "Keputusan sedang disimpan pada pelayan...",
  // "An error occurred and we could not save the results."
  savingDataError: "Ralat berlaku dan kami tidak dapat menyimpan keputusan.",
  // "The results were saved successfully!"
  savingDataSuccess: "Keputusan berjaya disimpan!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Respons anda melebihi 64KB. Sila kurangkan saiz fail anda dan cuba lagi atau hubungi pemilik tinjauan.",
  // "Try again"
  saveAgainButton: "Cuba lagi",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "saat",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Anda telah meluangkan {0} pada halaman ini dan {1} secara keseluruhan.",
  // "You have spent {0} on this page."
  timerSpentPage: "Anda telah meluangkan {0} pada halaman ini.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Anda telah meluangkan {0} secara keseluruhan.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Anda telah meluangkan {0} daripada {1} pada halaman ini dan {2} daripada {3} secara keseluruhan.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Anda telah meluangkan {0} daripada {1} pada halaman ini.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Anda telah meluangkan {0} daripada {1} secara keseluruhan.",
  // "Clear"
  clearCaption: "Kosongkan",
  // [Auto-translated] "Select"
  selectCaption: "Pilih",
  // "Sign here"
  signaturePlaceHolder: "Tandatangan di sini",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Tiada tandatangan",
  // "Select File"
  chooseFileCaption: "Pilih fail",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Ambil gambar",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Klik butang di bawah untuk mengambil gambar menggunakan kamera.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Seret dan lepas atau pilih fail untuk memuat naik atau mengambil foto menggunakan kamera.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Gantikan fail",
  // "Remove this file"
  removeFileCaption: "Alih keluar fail ini",
  // "Yes"
  booleanCheckedLabel: "Ya",
  // "No"
  booleanUncheckedLabel: "Tidak",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Anda pasti ingin mengalih keluar fail ini: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Anda pasti ingin mengalih keluar semua fail?",
  // "Question Title"
  questionTitlePatternText: "Tajuk Soalan",
  // "Cancel"
  modalCancelButtonText: "Batal",
  // "Apply"
  modalApplyButtonText: "Guna",
  // "Type to search..."
  filterStringPlaceholder: "Taip untuk membuat carian...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Tiada data untuk dipaparkan",
  // [Auto-translated] "Loading..."
  loadingPage: "Memuatkan...",
  // [Auto-translated] "Loading..."
  loadingData: "Memuatkan...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Belum ada entri.\nKlik butang di bawah untuk menambahkan entri.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Tiada penyertaan",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Panel Baru",
  // [Auto-translated] "More"
  more: "Lebih banyak",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Semua pilihan dipilih untuk kedudukan",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Seret pilihan di sini untuk meletakkan kedudukan mereka",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Batal",
  // "Create \"{0}\" item..."
  createCustomItem: "Buat item \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Jadual kandungan",
  // [Auto-translated] "Progress bar"
  progressbar: "Bar kemajuan"
};

setupLocale({ localeCode: "ms", strings: malaySurveyStrings, nativeName: "melayu", englishName: "Malay" });