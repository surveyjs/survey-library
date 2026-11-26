import { setupLocale } from "survey-core";

export var malaySurveyStrings = {
  // "Previous"
  pagePrevText: "Sebelumnya",
  // "Next"
  pageNextText: "Seterusnya",
  // [Auto-translated] "First"
  pageFirstText: "Pertama",
  // [Auto-translated] "Last"
  pageLastText: "Terakhir",
  // [Auto-translated] "of {0}"
  pagerTotalText: "{0}",
  // [Auto-translated] "Select Page"
  pagerSelectPageTitle: "Pilih Halaman",
  // [Auto-translated] "Sort by {0}"
  sortByColumnText: "Susun mengikut {0}",
  // [Auto-translated] "High - Low"
  sortHighLowText: "Tinggi - Rendah",
  // [Auto-translated] "Low - High"
  sortLowHighText: "Rendah - Tinggi",
  // [Auto-translated] "Alphabet, A - Z"
  sortAZText: "Abjad, A - Z",
  // [Auto-translated] "Alphabet, Z - A"
  sortZAText: "Abjad, Z - A",
  // [Auto-translated] "Newest first"
  sortNewestFirstText: "Yang terbaru pertama",
  // [Auto-translated] "Oldest first"
  sortOldestFirstText: "Yang paling tua dahulu",
  // [Auto-translated] "Sorted by {0}"
  sortOrderText: "Disusun mengikut {0}",
  // [Auto-translated] "{0} ({1})"
  sortOrderLevelText: "{0} ({1})",
  // [Auto-translated] "{0}, then by {1}"
  sortOrderNextText: "{0}, kemudian oleh {1}",
  // [Auto-translated] "Sort by"
  sortByText: "Susun mengikut",
  // [Auto-translated] "Default"
  sortDefaultText: "Lalai",
  // [Auto-translated] "Sort field"
  sortFieldAriaLabel: "Medan Sort",
  // [Auto-translated] "Sort order"
  sortDirectionAriaLabel: "Susunan susun",
  // [Auto-translated] "Add sort level"
  sortAddLevelText: "Tambah tahap pengisihan",
  // [Auto-translated] "Remove sort level {0}"
  sortRemoveLevelText: "Buang tahap pengisihan {0}",
  // [Auto-translated] "Sort field {0}"
  sortLevelFieldAriaLabel: "Susun medan {0}",
  // [Auto-translated] "Sort order {0}"
  sortLevelDirectionAriaLabel: "Susunan {0}",
  // [Auto-translated] "Show all sort levels"
  sortMoreAriaLabel: "Paparkan semua tahap susunan",
  // [Auto-translated] "Add New"
  sortAddNewText: "Tambah Baru",
  // [Auto-translated] "Move sort level {0}"
  sortMoveLevelAriaLabel: "Pindahkan tahap susun {0}",
  // "Complete"
  completeText: "Selesai",
  // "Preview"
  previewText: "Pratonton",
  // [Auto-translated] "Edit"
  editText: "Suntingan",
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
  // [Auto-translated] "Question {0} of {1}"
  questionPositionProgressText: "Soalan {0} {1}",
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
  // [Auto-translated] "You must select Yes to continue."
  requireTrueError: "Anda mesti memilih Ya untuk meneruskan.",
  // [Auto-translated] "The value is incorrect."
  incorrectValueError: "Nilainya salah.",
  // [Auto-translated] "The value contains unknown keys: {0}."
  incorrectValueUnknownKeysError: "Nilai mengandungi kunci tidak diketahui: {0}.",
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
  // [Auto-translated] "Invalid input"
  invalidInputError: "Input tidak sah",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Nombor tidak dibenarkan.",
  // [Auto-translated] "Please complete the value to match the required format."
  incompletePatternError: "Sila lengkapkan nilai untuk dipadankan dengan format yang diperlukan.",
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
  // [Auto-translated] "Bytes, KB, MB, GB, TB"
  fileSizeUnits: "Bait, KB, MB, GB, TB",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Bilangan maksimum fail yang boleh anda muat naik ialah {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Fail tidak boleh dimuat naik. Sila tambah pengendali untuk acara 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Respons diperlukan: masukkan nilai lain.",
  // [Auto-translated] "The value '{0}' is not one of the available choices."
  variableValueNotInChoices: "Nilai '{0}' bukanlah salah satu pilihan yang tersedia.",
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
  // [Auto-translated] "Move row {0}"
  moveRowAriaLabel: "Gerakkan baris {0}",
  // "There are no rows."
  noRowsText: "Tiada baris.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Baris {rowIndex}",
  // [Auto-translated] "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Tambah baharu",
  // "Remove"
  removePanel: "Alih keluar",
  // [Auto-translated] "Show Details"
  showDetails: "Tunjukkan Butiran",
  // [Auto-translated] "Hide Details"
  hideDetails: "Sembunyikan Butiran",
  // [Auto-translated] "item"
  choices_Item: "Item",
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
  // "Try again"
  saveAgainButton: "Cuba lagi",
  // [Auto-translated] "min"
  timerMin: "minit",
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
  progressbar: "Bar kemajuan",
  // [Auto-translated] "Page {0}"
  progressbarPage: "Halaman {0}",
  // [Auto-translated] "Empty"
  conditionOperatorEmpty: "kosong",
  // [Auto-translated] "Not empty"
  conditionOperatorNotempty: "Tidak kosong",
  // [Auto-translated] "Equals"
  conditionOperatorEqual: "Sama",
  // [Auto-translated] "Does not equal"
  conditionOperatorNotequal: "Tidak sama",
  // [Auto-translated] "Contains"
  conditionOperatorContains: "Mengandungi",
  // [Auto-translated] "Does not contain"
  conditionOperatorNotcontains: "Tidak mengandungi",
  // [Auto-translated] "Any of"
  conditionOperatorAnyof: "Mana-mana",
  // [Auto-translated] "None of"
  conditionOperatorNoneof: "Tiada satu pun",
  // [Auto-translated] "All of"
  conditionOperatorAllof: "Semua",
  // [Auto-translated] "Greater than"
  conditionOperatorGreater: "Lebih besar daripada",
  // [Auto-translated] "Less than"
  conditionOperatorLess: "Kurang daripada",
  // [Auto-translated] "Greater than or equal to"
  conditionOperatorGreaterorequal: "Lebih besar atau sama dengan",
  // [Auto-translated] "Less than or equal to"
  conditionOperatorLessorequal: "Kurang daripada atau sama dengan",
  // [Auto-translated] "All Filters"
  filterAllFilters: "Semua Penapis",
  // [Auto-translated] "All Filters: {0}"
  filterAllFiltersCount: "Semua Penapis: {0}",
  // [Auto-translated] "Filters"
  filterDialogTitle: "Penapis",
  // [Auto-translated] "Search"
  filterSearchLabel: "Carian",
  // [Auto-translated] "Search by {0}"
  filterSearchPlaceholder: "Cari mengikut {0}",
  // [Auto-translated] "{0} or {1}"
  filterSearchFieldsOr: "{0} atau {1}",
  // [Auto-translated] "{0}, or {1}"
  filterSearchFieldsOrLast: "{0}, atau {1}",
  // [Auto-translated] "Show More"
  filterShowMore: "Tunjukkan Lebih Banyak",
  // [Auto-translated] "Show Less"
  filterShowLess: "Tunjukkan Kurang",
  // [Auto-translated] "Clear All"
  filterClearAll: "Kosongkan semua",
  // [Auto-translated] "Clear {0}"
  filterClearChip: "Bersihkan {0}",
  // [Auto-translated] "Filter Presets"
  filterPreset: "Pratetap Penapis",
  // [Auto-translated] "Save as..."
  filterSaveAs: "Simpan sebagai...",
  // [Auto-translated] "Save"
  filterSaveAsSave: "Simpan",
  // [Auto-translated] "Add \"{0}\"..."
  filterAddCustomValue: "Tambah \"{0}\"...",
  // [Auto-translated] "Filter Presets"
  filterPresetsTitle: "Pratetap Penapis",
  // [Auto-translated] "Show {0} items"
  filterShowResultsCount: "Tunjukkan item {0}",
  // [Auto-translated] "Show 1 item"
  filterShowOneResult: "Tunjukkan 1 item",
  // [Auto-translated] "Show results"
  filterShowResults: "Tunjukkan keputusan",
  // [Auto-translated] "New Preset"
  filterAddPresetTitle: "Pratetap Baru",
  // [Auto-translated] "Preset name"
  filterPresetName: "Nama pratetap",
  // [Auto-translated] "Fields to filter by"
  filterPresetFieldsLabel: "Medan untuk ditapis mengikut",
  // [Auto-translated] "Filter expression"
  filterPresetExpressionLabel: "Ekspresi penapis",
  // [Auto-translated] "A preset with this name already exists."
  filterPresetTitleExists: "Pratetap dengan nama ini sudah wujud.",
  // [Auto-translated] "Add at least one condition."
  filterPresetNoConditions: "Tambah sekurang-kurangnya satu syarat.",
  // [Auto-translated] "Enter an expression."
  filterPresetNoExpression: "Masukkan satu ungkapan.",
  // [Auto-translated] "The expression is not valid."
  filterPresetInvalidExpression: "Ungkapan ini tidak sah.",
  // [Auto-translated] "Switch to Expression"
  filterEditAsText: "Beralih ke Ekspresi",
  // [Auto-translated] "Switch to Fields"
  filterEditAsFields: "Beralih ke Medan",
  // [Auto-translated] "Type an expression here..."
  filterExpressionPlaceholder: "Taip ungkapan di sini...",
  // [Auto-translated] "Edit Preset"
  filterEditPreset: "Sunting Pratetap",
  // [Auto-translated] "Delete"
  filterDeletePreset: "Padam",
  // [Auto-translated] "Add New..."
  filterAddPreset: "Tambah Baru...",
  // [Auto-translated] "Edit Selected..."
  filterEditSelected: "Edit Dipilih...",
  // [Auto-translated] "{0} Expression"
  filterPresetExpression: "{0} Ekspresi",
  // [Auto-translated] "Edit..."
  filterEditExpression: "Sunting...",
  // [Auto-translated] "Search in filters and presets"
  filterSearchInFilters: "Cari dalam penapis dan pratetap",
  // [Auto-translated] "Nothing found, try different keywords"
  filterNothingFound: "Tiada apa-apa ditemui, cuba kata kunci yang berbeza",
  // [Auto-translated] "Generate a filter with AI"
  filterAiPromptNew: "Jana penapis dengan AI",
  // [Auto-translated] "Edit preset with AI"
  filterAiPromptEdit: "Edit pratetap dengan AI",
  // [Auto-translated] "Describe the filter you want..."
  filterAiPromptPlaceholder: "Terangkan penapis yang anda mahu...",
  // [Auto-translated] "Generate Filter"
  filterAiCreate: "Jana Penapis",
  // [Auto-translated] "Edit"
  filterAiEdit: "Edit",
  // [Auto-translated] "Generating..."
  filterAiCreating: "Menghasilkan...",
  // [Auto-translated] "Editing..."
  filterAiEditing: "Menyunting...",
  // [Auto-translated] "AI could not make a filter. Try again."
  filterAiError: "AI tidak dapat membuat penapis. Cuba lagi.",
  // [Auto-translated] "AI could not make a filter of this description."
  filterAiEmpty: "AI tidak dapat membuat penapis seperti ini.",
  // [Auto-translated] "to select"
  keyboardHintSelectText: "untuk memilih",
  // [Auto-translated] "to toggle"
  keyboardHintToggleText: "untuk togol",
  // [Auto-translated] "to navigate"
  keyboardHintNavigateText: "untuk menavigasi",
  // [Auto-translated] "to continue"
  keyboardHintContinueText: "untuk meneruskan",
  // [Auto-translated] "to submit"
  keyboardHintSubmitText: "untuk menghantar",
  // [Auto-translated] "or"
  keyboardHintOrText: "atau",
  // [Auto-translated] "for a new line"
  keyboardHintNewLineText: "untuk barisan baru",
  // [Auto-translated] "to next option"
  keyboardHintNextItemText: "ke pilihan seterusnya",
  // [Auto-translated] "to move"
  keyboardHintMoveText: "untuk bergerak",
  // [Auto-translated] "to open"
  keyboardHintOpenText: "membuka",
  // [Auto-translated] "to close"
  keyboardHintCloseText: "menutup"
};

setupLocale({ localeCode: "ms", strings: malaySurveyStrings, nativeName: "melayu", englishName: "Malay" });