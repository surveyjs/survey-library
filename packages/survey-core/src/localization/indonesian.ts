import { setupLocale } from "survey-core";

export var indonesianStrings = {
  // "Previous"
  pagePrevText: "Sebelumnya",
  // "Next"
  pageNextText: "Selanjutnya",
  // [Auto-translated] "First"
  pageFirstText: "Pertama",
  // [Auto-translated] "Last"
  pageLastText: "Terakhir",
  // [Auto-translated] "of {0}"
  pagerTotalText: "dari {0}",
  // [Auto-translated] "Select Page"
  pagerSelectPageTitle: "Pilih Halaman",
  // [Auto-translated] "Sort by {0}"
  sortByColumnText: "Urutkan berdasarkan {0}",
  // [Auto-translated] "High - Low"
  sortHighLowText: "Tinggi - Rendah",
  // [Auto-translated] "Low - High"
  sortLowHighText: "Rendah - Tinggi",
  // [Auto-translated] "Alphabet, A - Z"
  sortAZText: "Alfabet, A - Z",
  // [Auto-translated] "Alphabet, Z - A"
  sortZAText: "Alfabet, Z - A",
  // "Newest first"
  sortNewestFirstText: "Terbaru lebih dulu",
  // "Oldest first"
  sortOldestFirstText: "Terlama lebih dulu",
  // [Auto-translated] "Sorted by {0}"
  sortOrderText: "Diurutkan berdasarkan {0}",
  // [Auto-translated] "{0} ({1})"
  sortOrderLevelText: "{0} ({1})",
  // [Auto-translated] "{0}, then by {1}"
  sortOrderNextText: "{0}, lalu {1}",
  // [Auto-translated] "Sort by"
  sortByText: "Urutkan berdasarkan",
  // "Default"
  sortDefaultText: "Bawaan",
  // [Auto-translated] "Sort field"
  sortFieldAriaLabel: "Kolom pengurutan",
  // [Auto-translated] "Sort order"
  sortDirectionAriaLabel: "Urutan pengurutan",
  // [Auto-translated] "Add sort level"
  sortAddLevelText: "Tambahkan tingkat pengurutan",
  // "Remove sort level {0}"
  sortRemoveLevelText: "Hapus tingkat pengurutan {0}",
  // "Sort field {0}"
  sortLevelFieldAriaLabel: "Kolom pengurutan {0}",
  // "Sort order {0}"
  sortLevelDirectionAriaLabel: "Urutan pengurutan {0}",
  // [Auto-translated] "Show all sort levels"
  sortMoreAriaLabel: "Tampilkan semua tingkat pengurutan",
  // [Auto-translated] "Add New"
  sortAddNewText: "Tambah Baru",
  // [Auto-translated] "Move sort level {0}"
  sortMoveLevelAriaLabel: "Pindahkan level urut {0}",
  // "Complete"
  completeText: "Selesai",
  // "Preview"
  previewText: "Pratinjau",
  // "Edit"
  editText: "Sunting",
  // "Start"
  startSurveyText: "Mulai",
  // [Auto-translated] "Please leave a comment"
  commentText: "Silakan tinggalkan komentar",
  // "Other (describe)"
  otherItemText: "Lainnya (jelaskan)",
  // "None"
  noneItemText: "Tidak Ada",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Menolak untuk menjawab",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Tidak tahu",
  // "Select All"
  selectAllItemText: "Pilih Semua",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Batalkan pilihan semua",
  // "Page {0} of {1}"
  progressText: "Halaman {0} dari {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} dari {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Rekam {0} dari {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Menjawab pertanyaan {0} / {1}",
  // "Question {0} of {1}"
  questionPositionProgressText: "Pertanyaan {0} dari {1}",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Tidak ada halaman atau pertanyaan dalam survei.",
  // "Thank you for completing the survey"
  completingSurvey: "Terima kasih telah menyelesaikan survei!",
  // "You have already completed this survey."
  completingSurveyBefore: "Catatan kami menunjukkan bahwa Anda telah menyelesaikan survei ini.",
  // "Loading Survey..."
  loadingSurvey: "Memuat survei...",
  // "Select..."
  placeholder: "Pilih...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Pilih...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Pilih...",
  // "value"
  value: "nilai",
  // "Response required."
  requiredError: "Silahkan jawab pertanyaan berikut.",
  // [Auto-translated] "You must select Yes to continue."
  requireTrueError: "Anda harus memilih Ya untuk melanjutkan.",
  // [Auto-translated] "The value is incorrect."
  incorrectValueError: "Nilainya salah.",
  // [Auto-translated] "The value contains unknown keys: {0}."
  incorrectValueUnknownKeysError: "Nilai berisi kunci yang tidak diketahui: {0}.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Silahkan jawab setidaknya satu petanyaan.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Silahkan jawab pertanyaan pada semua baris.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Setiap baris harus memiliki nilai unik.",
  // "The value should be numeric."
  numericError: "Nilai harus berupa angka.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Nilainya tidak boleh kurang dari {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Masukkan nilai yang cocok dengan ukuran langkah {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Nilai tidak boleh lebih besar dari {0}",
  // [Auto-translated] "Invalid input"
  invalidInputError: "Masukan tidak valid",
  // "Numbers are not allowed."
  textNoDigitsAllow: "Angka tidak diperbolehkan.",
  // [Auto-translated] "Please complete the value to match the required format."
  incompletePatternError: "Lengkapi nilai agar sesuai dengan format yang diperlukan.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Silahkan masukkan setidaknya {0} karakter.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Silahkan masukkan kurang {0} karakter.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "PSilahkan masukkan lebih dari {0} dan kurang dari {1} karakter.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Silahkan isi setidaknya {0} baris.",
  // "Please select at least {0} option(s)."
  minSelectError: "Silahkan pilih setidaknya {0} varian.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Silahkan pilih tidak lebih dari {0} varian.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' harus sama dengan atau lebih dari {1} dan harus sama dengan atau kurang dari {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' harus sama dengan atau lebih dari {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' harus sama dengan atau kurang dari {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Silahkan masukkan e-mail yang benar.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Ekspresi: {0} harus mengembalikan 'benar'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Permintaan mengembalikan kesalahan '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Permintaan mengembalikan data kosong atau properti 'path' salah.",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Ukuran berkas tidak boleh melebihi {0}.",
  // [Auto-translated] "Bytes, KB, MB, GB, TB"
  fileSizeUnits: "Byte, KB, MB, GB, TB",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Jumlah maksimum file yang dapat Anda unggah adalah {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "File tidak dapat diunggah. Harap tambahkan handler untuk event 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Silahkan masukkan nilai lainnnya.",
  // [Auto-translated] "The value '{0}' is not one of the available choices."
  variableValueNotInChoices: "Nilai '{0}' bukanlah salah satu pilihan yang tersedia.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Berkas Anda sedang diunggah. Silahkan tunggu beberapa saat atau coba lagi.",
  // "Loading..."
  loadingFile: "Memuat...",
  // "Choose file(s)..."
  chooseFile: "Pilih berkas...",
  // "No file selected"
  noFileChosen: "Tidak ada file yang dipilih",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Seret dan lepas file di sini atau klik tombol di bawah ini untuk memilih file yang akan diunggah.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Apakah Anda ingin menghapus catatan?",
  // "This value should be unique."
  keyDuplicationError: "Nilai harus unik.",
  // "Add Column"
  addColumn: "Tambah kolom",
  // "Add Row"
  addRow: "Tambah baris",
  // "Remove"
  removeRow: "Hapus",
  // [Auto-translated] "Move row {0}"
  moveRowAriaLabel: "Pindahkan baris {0}",
  // [Auto-translated] "There are no rows."
  noRowsText: "Tidak ada baris.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Baris {rowIndex}",
  // [Auto-translated] "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Tambah baru",
  // "Remove"
  removePanel: "Hapus",
  // [Auto-translated] "Show Details"
  showDetails: "Tampilkan Detail",
  // [Auto-translated] "Hide Details"
  hideDetails: "Sembunyikan Detail",
  // [Auto-translated] "item"
  choices_Item: "barang",
  // [Auto-translated] "Choice option"
  choices_Choice: "Opsi pilihan",
  // "Column"
  matrix_column: "Kolom",
  // "Row"
  matrix_row: "Baris",
  // [Auto-translated] "text"
  multipletext_itemname: "Teks",
  // "The results are being saved on the server..."
  savingData: "Hasil sedang disimpan pada server...",
  // "An error occurred and we could not save the results."
  savingDataError: "Kesalahan terjadi dan kami tidak dapat menyimpan hasil.",
  // "The results were saved successfully!"
  savingDataSuccess: "Hasil telah sukses disimpan!",
  // "Try again"
  saveAgainButton: "Coba lagi",
  // "min"
  timerMin: "menit",
  // "sec"
  timerSec: "detik",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Anda telah menghabiskan {0} pada halaman ini dan {1} secara keseluruhan.",
  // "You have spent {0} on this page."
  timerSpentPage: "YAnda telah menghabiskan {0} pada halaman ini.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Anda telah menghabiskan {0} secara keseluruhan.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Anda telah menghabiskan {0} dari {1} pada halaman ini dan {2} dari {3} secara keseluruhan.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Anda telah menghabiskan {0} dari {1} pada halaman ini.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Anda telah menghabiskan {0} dari {1} secara keseluruhan.",
  // "Clear"
  clearCaption: "Bersihkan",
  // [Auto-translated] "Select"
  selectCaption: "Pilih",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Tanda tangan di sini",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Tidak ada tanda tangan",
  // "Select File"
  chooseFileCaption: "Pilih File",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Ambil Foto",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Klik tombol di bawah ini untuk mengambil foto menggunakan kamera.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Seret dan lepas atau pilih file untuk diunggah atau mengambil foto menggunakan kamera.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Ganti file",
  // "Remove this file"
  removeFileCaption: "Hapus berkas ini",
  // "Yes"
  booleanCheckedLabel: "Iya",
  // "No"
  booleanUncheckedLabel: "Tidak",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Anda yakin ingin menghapus file ini: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Anda yakin ingin menghapus semua file?",
  // "Question Title"
  questionTitlePatternText: "Judul pertanyaan",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Membatalkan",
  // "Apply"
  modalApplyButtonText: "Terapkan",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Ketik untuk mencari...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Tidak ada data untuk ditampilkan",
  // "Loading..."
  loadingPage: "Memuat...",
  // "Loading..."
  loadingData: "Memuat...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Belum ada entri.\nKlik tombol di bawah ini untuk menambahkan entri baru.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Tidak ada entri",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Panel Baru",
  // "More"
  more: "Lainnya",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OKE",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Semua pilihan dipilih untuk peringkat",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Seret pilihan di sini untuk memberi peringkat",
  // [Auto-translated] "OK"
  ok: "OKE",
  // [Auto-translated] "Cancel"
  cancel: "Membatalkan",
  // "Create \"{0}\" item..."
  createCustomItem: "Buat item \"{0}\"...",
  // "Table of contents"
  toc: "Daftar isi",
  // [Auto-translated] "Progress bar"
  progressbar: "Bilah kemajuan",
  // [Auto-translated] "Page {0}"
  progressbarPage: "Halaman {0}",
  // [Auto-translated] "Empty"
  conditionOperatorEmpty: "Kosong",
  // [Auto-translated] "Not empty"
  conditionOperatorNotempty: "Tidak kosong",
  // [Auto-translated] "Equals"
  conditionOperatorEqual: "Sama",
  // [Auto-translated] "Does not equal"
  conditionOperatorNotequal: "Tidak sama",
  // [Auto-translated] "Contains"
  conditionOperatorContains: "Berisi",
  // [Auto-translated] "Does not contain"
  conditionOperatorNotcontains: "Tidak mengandung",
  // [Auto-translated] "Any of"
  conditionOperatorAnyof: "Salah satu dari",
  // "None of"
  conditionOperatorNoneof: "Tidak satu pun dari",
  // "All of"
  conditionOperatorAllof: "Semua dari",
  // [Auto-translated] "Greater than"
  conditionOperatorGreater: "Lebih besar dari",
  // [Auto-translated] "Less than"
  conditionOperatorLess: "Kurang dari",
  // [Auto-translated] "Greater than or equal to"
  conditionOperatorGreaterorequal: "Lebih besar dari atau sama dengan",
  // [Auto-translated] "Less than or equal to"
  conditionOperatorLessorequal: "Kurang dari atau sama dengan",
  // [Auto-translated] "Save"
  filterSave: "Simpan",
  // [Auto-translated] "Filters"
  filterFilters: "Filter",
  // [Auto-translated] "Filters: {0}"
  filterFiltersCount: "Filter: {0}",
  // [Auto-translated] "Filters"
  filterDialogTitle: "Filter",
  // [Auto-translated] "Search"
  filterSearchLabel: "Cari",
  // [Auto-translated] "Search by {0}"
  filterSearchPlaceholder: "Cari berdasarkan {0}",
  // [Auto-translated] "Show More"
  filterShowMore: "Tampilkan Lebih Banyak",
  // [Auto-translated] "Show Less"
  filterShowLess: "Tampilkan Lebih Sedikit",
  // [Auto-translated] "Clear All"
  filterClearAll: "Bersihkan Semua",
  // [Auto-translated] "Clear {0}"
  filterClearChip: "Bersihkan {0}",
  // [Auto-translated] "Preset"
  filterPreset: "Preset",
  // [Auto-translated] "Save as..."
  filterSaveAs: "Simpan sebagai...",
  // [Auto-translated] "Save"
  filterSaveAsSave: "Simpan",
  // [Auto-translated] "Add \"{0}\"..."
  filterAddCustomValue: "Tambahkan \"{0}\"...",
  // [Auto-translated] "Presets"
  filterPresetsTitle: "Preset",
  // "Show {0} items"
  filterShowResultsCount: "Tampilkan {0} item",
  // [Auto-translated] "Show 1 item"
  filterShowOneResult: "Tampilkan 1 item",
  // [Auto-translated] "Show results"
  filterShowResults: "Tampilkan hasil",
  // [Auto-translated] "New Preset"
  filterAddPresetTitle: "Preset Baru",
  // [Auto-translated] "Name"
  filterPresetName: "Nama",
  // [Auto-translated] "Contains"
  filterPresetContains: "Berisi",
  // [Auto-translated] "A preset with this name already exists."
  filterPresetTitleExists: "Preset dengan nama ini sudah ada.",
  // [Auto-translated] "Add at least one condition."
  filterPresetNoConditions: "Tambahkan setidaknya satu kondisi.",
  // [Auto-translated] "Enter an expression."
  filterPresetNoExpression: "Masukkan sebuah ekspresi.",
  // [Auto-translated] "The expression is not valid."
  filterPresetInvalidExpression: "Ekspresi tersebut tidak valid.",
  // [Auto-translated] "Edit as Expression"
  filterEditAsText: "Edit sebagai Ekspresi",
  // [Auto-translated] "Edit as Tagbox"
  filterEditAsFields: "Edit sebagai Tagbox",
  // [Auto-translated] "Type an expression here..."
  filterExpressionPlaceholder: "Ketik ekspresi di sini...",
  // [Auto-translated] "Edit Preset"
  filterEditPreset: "Edit Preset",
  // [Auto-translated] "Delete"
  filterDeletePreset: "Hapus",
  // [Auto-translated] "Add New..."
  filterAddPreset: "Tambahkan Baru...",
  // [Auto-translated] "Edit Selected..."
  filterEditSelected: "Edit Dipilih...",
  // "{0} Expression"
  filterPresetExpression: "Ekspresi {0}",
  // [Auto-translated] "Edit..."
  filterEditExpression: "Edit...",
  // [Auto-translated] "Search in Filters"
  filterSearchInFilters: "Cari di Filter",
  // [Auto-translated] "Nothing found, try different keywords"
  filterNothingFound: "Tidak ada yang ditemukan, coba kata kunci yang berbeda",
  // [Auto-translated] "Create preset with AI"
  filterAiPromptNew: "Buat preset dengan AI",
  // [Auto-translated] "Edit preset with AI"
  filterAiPromptEdit: "Edit preset dengan AI",
  // [Auto-translated] "For example, “Coffee & Tea from Germany”"
  filterAiPromptPlaceholder: "Misalnya, \"Kopi & Teh dari Jerman\"",
  // [Auto-translated] "Create"
  filterAiCreate: "Buat",
  // [Auto-translated] "Edit"
  filterAiEdit: "Edit",
  // [Auto-translated] "Creating..."
  filterAiCreating: "Menciptakan...",
  // "Editing..."
  filterAiEditing: "Mengedit...",
  // [Auto-translated] "AI could not make a filter. Try again."
  filterAiError: "AI tidak bisa membuat filter. Coba lagi.",
  // [Auto-translated] "AI could not make a filter of this description."
  filterAiEmpty: "AI tidak bisa membuat filter seperti ini.",
  // [Auto-translated] "to select"
  keyboardHintSelectText: "memilih",
  // [Auto-translated] "to toggle"
  keyboardHintToggleText: "untuk beralih",
  // [Auto-translated] "to navigate"
  keyboardHintNavigateText: "untuk menavigasi",
  // [Auto-translated] "to continue"
  keyboardHintContinueText: "melanjutkan",
  // [Auto-translated] "to submit"
  keyboardHintSubmitText: "mengajukan",
  // [Auto-translated] "or"
  keyboardHintOrText: "atau",
  // "for a new line"
  keyboardHintNewLineText: "untuk baris baru",
  // [Auto-translated] "to next option"
  keyboardHintNextItemText: "ke opsi berikutnya",
  // [Auto-translated] "to move"
  keyboardHintMoveText: "memindahkan",
  // [Auto-translated] "to open"
  keyboardHintOpenText: "membuka",
  // [Auto-translated] "to close"
  keyboardHintCloseText: "menutup"
};

setupLocale({ localeCode: "id", strings: indonesianStrings, nativeName: "bahasa indonesia", englishName: "Indonesian" });