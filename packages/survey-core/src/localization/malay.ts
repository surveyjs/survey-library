import { setupLocale } from "survey-core";

export var malaySurveyStrings = {
  pagePrevText: "Sebelumnya",
  pageNextText: "Seterusnya",
  completeText: "Selesai",
  previewText: "Pratonton",
  editText: "Edit",
  startSurveyText: "Mula",
  otherItemText: "Lain (terangkan)",
  noneItemText: "Tiada",
  refuseItemText: "Enggan menjawab",
  dontKnowItemText: "Tak tahu",
  selectAllItemText: "Pilih Semua",
  deselectAllItemText: "Nyahpilih semua",
  progressText: "Halaman {0} daripada {1}",
  indexText: "{0} {1}",
  panelDynamicProgressText: "Rekod {0} daripada {1}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "{0}/{1} soalan telah dijawab",
  emptySurvey: "Tiada halaman atau soalan boleh dilihat dalam tinjauan.",
  completingSurvey: "Terima kasih kerana melengkapkan tinjauan!",
  completingSurveyBefore: "Rekod kami menunjukkan yang anda telah melengkapkan tinjauan ini.",
  loadingSurvey: "Memuatkan Tinjauan...",
  placeholder: "Pilih...",
  ratingOptionsCaption: "Pilih...",
  value: "nilai",
  requiredError: "Respons diperlukan.",
  requiredErrorInPanel: "Respons diperlukan: jawab sekurang-kurangnya satu soalan.",
  requiredInAllRowsError: "Respons diperlukan: jawab soalan dalam semua baris.",
  eachRowUniqueError: "Setiap baris mesti mempunyai nilai yang unik.",
  numericError: "Nilai mestilah numerik.",
  minError: "Nilai tidak boleh kurang daripada {0}",
  maxError: "Nilai tidak boleh lebih besar daripada {0}",
  textNoDigitsAllow: "Nombor tidak dibenarkan.",
  textMinLength: "Sila masukkan sekurang-kurangnya {0} aksara.",
  textMaxLength: "Sila masukkan tidak lebih daripada {0} aksara.",
  textMinMaxLength: "Sila masukkan sekurang-kurangnya {0} dan tidak lebih daripada {1} aksara.",
  minRowCountError: "Sila isikan sekurang-kurangnya {0} baris.",
  minSelectError: "Sila pilih sekurang-kurangnya {0} varian.",
  maxSelectError: "Sila pilih tidak lebih daripada {0} varian.",
  numericMinMax: "'{0}' mestilah sekurang-kurangnya {1} dan paling banyak {2}",
  numericMin: "'{0}' mestilah sekurang-kurangnya {1}",
  numericMax: "'{0}' mestilah paling banyak {1}",
  invalidEmail: "Sila masukkan alamat e-mel yang sah.",
  invalidExpression: "Ekspresi: {0} hendaklah mengembalikan nilai 'benar'.",
  urlRequestError: "Permintaan mengembalikan ralat '{0}'. {1}",
  urlGetChoicesError: "Permintaan mengembalikan data kosong atau ciri 'laluan' salah",
  exceedMaxSize: "Saiz fail hendaklah tidak melebihi {0}.",
  noUploadFilesHandler: "Fail tidak boleh dimuat naik. Sila tambah pengendali untuk acara 'onUploadFiles'.",
  otherRequiredError: "Respons diperlukan: masukkan nilai lain.",
  uploadingFile: "Fail anda sedang dimuat naik. Sila tunggu beberapa saat dan cuba lagi.",
  loadingFile: "Memuat...",
  chooseFile: "Pilih fail...",
  noFileChosen: "Tiada fail dipilih",
  filePlaceholder: "Letakkan fail di sini atau klik butang di bawah untuk memuatkan fail.",
  confirmDelete: "Adakah anda ingin memadamkan rekod?",
  keyDuplicationError: "Nilai ini hendaklah unik.",
  addColumn: "Tambahkan lajur",
  addRow: "Tambahkan baris",
  removeRow: "Alih keluar",
  noRowsText: "Tiada baris.",
  addPanel: "Tambah baharu",
  removePanel: "Alih keluar",
  showDetails: "Tunjukkan Butiran",
  hideDetails: "Sembunyikan Butiran",
  choices_Item: "item",
  matrix_column: "Lajur",
  matrix_row: "Baris",
  multipletext_itemname: "teks",
  savingData: "Keputusan sedang disimpan pada pelayan...",
  savingDataError: "Ralat berlaku dan kami tidak dapat menyimpan keputusan.",
  savingDataSuccess: "Keputusan berjaya disimpan!",
  savingExceedSize: "Jawapan anda melebihi 64KB. Sila kurangkan saiz fail anda dan cuba lagi atau hubungi pemilik tinjauan.",
  saveAgainButton: "Cuba lagi",
  timerMin: "min",
  timerSec: "saat",
  timerSpentAll: "Anda telah meluangkan {0} pada halaman ini dan {1} secara keseluruhan.",
  timerSpentPage: "Anda telah meluangkan {0} pada halaman ini.",
  timerSpentSurvey: "Anda telah meluangkan {0} secara keseluruhan.",
  timerLimitAll: "Anda telah meluangkan {0} daripada {1} pada halaman ini dan {2} daripada {3} secara keseluruhan.",
  timerLimitPage: "Anda telah meluangkan {0} daripada {1} pada halaman ini.",
  timerLimitSurvey: "Anda telah meluangkan {0} daripada {1} secara keseluruhan.",
  clearCaption: "Kosongkan",
  signaturePlaceHolder: "Tandatangan di sini",
  signaturePlaceHolderReadOnly: "Tiada tandatangan",
  chooseFileCaption: "Pilih fail",
  takePhotoCaption: "Ambil gambar",
  photoPlaceholder: "Klik butang di bawah untuk mengambil gambar menggunakan kamera.",
  fileOrPhotoPlaceholder: "Seret dan lepas atau pilih fail untuk memuat naik atau mengambil foto menggunakan kamera.",
  replaceFileCaption: "Gantikan fail",
  removeFileCaption: "Alih keluar fail ini",
  booleanCheckedLabel: "Ya",
  booleanUncheckedLabel: "Tidak",
  confirmRemoveFile: "Anda pasti ingin mengalih keluar fail ini: {0}?",
  confirmRemoveAllFiles: "Anda pasti ingin mengalih keluar semua fail?",
  questionTitlePatternText: "Tajuk Soalan",
  modalCancelButtonText: "Batal",
  modalApplyButtonText: "Guna",
  filterStringPlaceholder: "Taip untuk membuat carian...",
  emptyMessage: "Tiada data untuk dipaparkan",
  noEntriesText: "Belum ada entri.\nKlik butang di bawah untuk menambahkan entri.",
  noEntriesReadonlyText: "Tiada penyertaan.",
  tabTitlePlaceholder: "Panel Baru",
  more: "Lebih banyak",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Semua pilihan disenaraikan",
  selectToRankEmptyUnrankedAreaText: "Seret dan lepaskan pilihan di sini untuk meletakkannya",
  ok: "OK",
  cancel: "Batal"
};

setupLocale({ localeCode: "ms", strings: malaySurveyStrings, nativeName: "melayu", englishName: "Malay" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Pilih..."
// emptyMessage: "No data to display" => "Tiada data untuk dipaparkan"
// noEntriesReadonlyText: "There are no entries." => "Tiada penyertaan."
// more: "More" => "Lebih banyak"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Semua pilihan disenaraikan"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Seret dan lepaskan pilihan di sini untuk meletakkannya"// takePhotoCaption: "Take Photo" => "Ambil gambar"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Klik butang di bawah untuk mengambil gambar menggunakan kamera."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Seret dan lepas atau pilih fail untuk memuat naik atau mengambil foto menggunakan kamera."
// replaceFileCaption: "Replace file" => "Gantikan fail"// eachRowUniqueError: "Each row must have a unique value." => "Setiap baris mesti mempunyai nilai yang unik."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Fail tidak boleh dimuat naik. Sila tambah pengendali untuk acara 'onUploadFiles'."
// showDetails: "Show Details" => "Tunjukkan Butiran"
// hideDetails: "Hide Details" => "Sembunyikan Butiran"
// ok: "OK" => "OK"
// cancel: "Cancel" => "Batal"
// refuseItemText: "Refuse to answer" => "Enggan menjawab"
// dontKnowItemText: "Don't know" => "Tak tahu"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Jawapan anda melebihi 64KB. Sila kurangkan saiz fail anda dan cuba lagi atau hubungi pemilik tinjauan."
// signaturePlaceHolderReadOnly: "No signature" => "Tiada tandatangan"// tabTitlePlaceholder: "New Panel" => "Panel Baru"// deselectAllItemText: "Deselect all" => "Nyahpilih semua"
// textNoDigitsAllow: "Numbers are not allowed." => "Nombor tidak dibenarkan."