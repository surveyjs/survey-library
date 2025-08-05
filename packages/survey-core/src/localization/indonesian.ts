import { setupLocale } from "survey-core";

export var indonesianStrings = {
  // "Previous"
  pagePrevText: "Sebelumnya",
  // "Next"
  pageNextText: "Selanjutnya",
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
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Nilai tidak boleh lebih besar dari {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Nomor tidak diperbolehkan.",
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
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "File tidak dapat diunggah. Harap tambahkan handler untuk acara 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Silahkan masukkan nilai lainnnya.",
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
  // [Auto-translated] "There are no rows."
  noRowsText: "Tidak ada baris.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Baris {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Tambah baru",
  // "Remove"
  removePanel: "Hapus",
  // [Auto-translated] "Show Details"
  showDetails: "Tampilkan Detail",
  // [Auto-translated] "Hide Details"
  hideDetails: "Sembunyikan Detail",
  // "item"
  choices_Item: "item",
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
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Respons Anda melebihi 64KB. Harap kurangi ukuran file Anda dan coba lagi atau hubungi pemilik survei.",
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
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Berlaku",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Ketik untuk mencari...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Tidak ada data untuk ditampilkan",
  // [Auto-translated] "Loading..."
  loadingPage: "Loading...",
  // [Auto-translated] "Loading..."
  loadingData: "Loading...",
  // [Auto-translated] "No entries yet.\\nClick the button below to add a new entry."
  noEntriesText: "Belum ada entri.\\nKlik tombol di bawah ini untuk menambahkan entri baru.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Tidak ada entri",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Panel Baru",
  // [Auto-translated] "More"
  more: "Lebih",
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
  // [Auto-translated] "Table of contents"
  toc: "Indeks",
  // [Auto-translated] "Progress bar"
  progressbar: "Bilah kemajuan"
};

setupLocale({ localeCode: "id", strings: indonesianStrings, nativeName: "bahasa indonesia", englishName: "Indonesian" });