import { setupLocale } from "survey-core";

export var turkishSurveyStrings = {
  // "Previous"
  pagePrevText: "Önceki",
  // "Next"
  pageNextText: "Sonraki",
  // "Complete"
  completeText: "Tamamla",
  // "Preview"
  previewText: "Önizleme",
  // "Edit"
  editText: "Düzenle",
  // "Start"
  startSurveyText: "Başlat",
  //  [Auto-translated] "Please leave a comment"
  commentText: "Lütfen bir yorum bırakın",
  // "Other (describe)"
  otherItemText: "Diğer (açıklayınız)",
  // "None"
  noneItemText: "Hiçbiri",
  //  [Auto-translated] "Refuse to answer"
  refuseItemText: "Cevap vermeyi reddet",
  //  [Auto-translated] "Don't know"
  dontKnowItemText: "Bilmiyorum",
  // "Select All"
  selectAllItemText: "Tümünü Seç",
  //  [Auto-translated] "Deselect all"
  deselectAllItemText: "Tümünün seçimini kaldır",
  // "Page {0} of {1}"
  progressText: "Sayfa {0}/{1}",
  // "{0} of {1}"
  indexText: "{0}/{1}",
  // "{0} of {1}"
  panelDynamicProgressText: "{0}/{1}",
  // "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "{0}/{1} soru yanıtlandı",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Ankette görüntülenecek sayfa ya da soru mevcut değil.",
  // "Thank you for completing the survey"
  completingSurvey: "Anketi tamamladığınız için teşekkür ederiz",
  // "You have already completed this survey."
  completingSurveyBefore: "Kayıtlarımız bu anketi zaten tamamladığınızı gösteriyor.",
  // "Loading Survey..."
  loadingSurvey: "Anket Yükleniyor...",
  // "Select..."
  placeholder: "Seçiniz...",
  // "Select..."
  ratingOptionsCaption: "Seçiniz...",
  //  [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Seçmek...",
  // "value"
  value: "değer",
  // "Response required."
  requiredError: "Lütfen soruya cevap verin.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Lütfen en az bir soruyu yanıtlayın.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Lütfen tüm satırlardaki soruları cevaplayın.",
  //  [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Her satırın benzersiz bir değeri olmalıdır.",
  // "The value should be numeric."
  numericError: "Değer sayısal olmalıdır.",
  // "The value should not be less than {0}"
  minError: "Değer {0}'den küçük olmamalıdır",
  // "The value should not be greater than {0}"
  maxError: "Değer {0}'dan büyük olmamalıdır",
  //  [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Numaralara izin verilmez.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Lütfen en az {0} karakter girin.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Lütfen en fazla {0} karakter girin.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Lütfen {0}’den fazla ve {1}’den az karakter girin.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Lütfen en az {0} satırı doldurun.",
  // "Please select at least {0} option(s)."
  minSelectError: "Lütfen en az {0} seçeneği seçin.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Lütfen en fazla {0} seçeneği seçin.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}', {1}'e eşit veya daha büyük ve {2}'ye eşit veya daha küçük olmalıdır",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' değeri {1} değerine eşit veya büyük olmalıdır",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' değeri {1} değerine eşit ya da küçük olmalıdır.",
  // "Please enter a valid e-mail address."
  invalidEmail: "Lütfen geçerli bir e-posta adresi girin.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "İfade: {0} 'true' döndürmelidir.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "İstek '{0}' hatasını döndürdü. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "İstek boş veri döndürdü veya 'path' özelliği yanlış",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Dosya boyutu {0} değerini geçemez.",
  //  [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Dosyalar yüklenemiyor. Lütfen 'onUploadFiles' olayı için bir işleyici ekleyin.",
  // "Response required: enter another value."
  otherRequiredError: "Lütfen diğer değerleri girin.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Dosyanız yükleniyor. Lütfen birkaç saniye bekleyin ve tekrar deneyin.",
  // "Loading..."
  loadingFile: "Yükleniyor...",
  // "Choose file(s)..."
  chooseFile: "Dosyaları seçin...",
  // "No file selected"
  noFileChosen: "Dosya seçili değil",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Buraya bir dosya bırakın veya dosyayı yüklemek için aşağıdaki düğmeyi tıklayın.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Kaydı silmek istiyor musunuz?",
  // "This value should be unique."
  keyDuplicationError: "Bu değer benzersiz olmalıdır.",
  // "Add Column"
  addColumn: "Sütun Ekle",
  // "Add Row"
  addRow: "Satır Ekle",
  // "Remove"
  removeRow: "Kaldır",
  // "There are no rows."
  noRowsText: "Satır yok.",
  //  [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Satır {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Yeni ekle",
  // "Remove"
  removePanel: "Kaldır",
  //  [Auto-translated] "Show Details"
  showDetails: "Detayları göster",
  //  [Auto-translated] "Hide Details"
  hideDetails: "Detayları Gizle",
  // "item"
  choices_Item: "öğe",
  //  [Auto-translated] "Choice option"
  choices_Choice: "Seçim seçeneği",
  // "Column"
  matrix_column: "Sütun",
  // "Row"
  matrix_row: "Satır",
  // "text"
  multipletext_itemname: "metin",
  // "The results are being saved on the server..."
  savingData: "Sonuçlar sunucuya kaydediliyor...",
  // "An error occurred and we could not save the results."
  savingDataError: "Bir hata oluştu ve sonuçlar kaydedilemedi.",
  // "The results were saved successfully!"
  savingDataSuccess: "Sonuçlar başarıyla kaydedildi!",
  //  [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner."
  savingExceedSize: "Yanıtınız 64 KB'ı aşıyor. Lütfen dosyalarınızın boyutunu küçültün ve tekrar deneyin veya bir anket sahibiyle iletişime geçin.",
  // "Try again"
  saveAgainButton: "Tekrar deneyin",
  // "min"
  timerMin: "dakika",
  // "sec"
  timerSec: "saniye",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Bu sayfada {0} ve toplamda {1} harcadınız.",
  // "You have spent {0} on this page."
  timerSpentPage: "Bu sayfaya {0} harcadınız.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Toplamda {0} harcadınız.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Bu sayfaya {0}/{1} ve toplamda {2}/{3} harcadınız.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Bu sayfaya {0}/{1} harcadınız.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Toplamda {0}/{1} harcadınız.",
  // "Clear"
  clearCaption: "Temizle",
  // "Sign here"
  signaturePlaceHolder: "Burayı imzalayın",
  //  [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "İmza yok",
  // "Select File"
  chooseFileCaption: "Dosya seçin",
  //  [Auto-translated] "Take Photo"
  takePhotoCaption: "Fotoğraf Çekin",
  //  [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Kamerayı kullanarak fotoğraf çekmek için aşağıdaki düğmeyi tıklayın.",
  //  [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Kamerayı kullanarak fotoğraf yüklemek veya fotoğraf çekmek için bir dosyayı sürükleyip bırakın veya seçin.",
  //  [Auto-translated] "Replace file"
  replaceFileCaption: "Dosyayı değiştir",
  // "Remove this file"
  removeFileCaption: "Bu dosyayı kaldır",
  // "Yes"
  booleanCheckedLabel: "Evet",
  // "No"
  booleanUncheckedLabel: "Hayır",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Bu dosyayı kaldırmak istediğinizden emin misiniz: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Tüm dosyaları kaldırmak istediğinizden emin misiniz?",
  // "Question Title"
  questionTitlePatternText: "Soru Başlığı",
  // "Cancel"
  modalCancelButtonText: "İptal",
  // "Apply"
  modalApplyButtonText: "Uygula",
  // "Type to search..."
  filterStringPlaceholder: "Aramak için yazın...",
  // "No data to display"
  emptyMessage: "Görüntülenecek veri yok",
  //  [Auto-translated] "Loading..."
  loadingPage: "Yükleme...",
  //  [Auto-translated] "Loading..."
  loadingData: "Yükleme...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Henüz giriş yok.\nYeni bir giriş eklemek için aşağıdaki düğmeyi tıklayın.",
  // "No entries"
  noEntriesReadonlyText: "Giriş yok.",
  //  [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Yeni Panel",
  // "More"
  more: "Daha fazla",
  // "OK"
  tagboxDoneButtonCaption: "TAMAM",
  // "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Tüm seçenekler sıralanmıştır",
  // "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Seçimleri sıralamak için buraya sürükleyip bırakın",
  //  [Auto-translated] "OK"
  ok: "TAMAM",
  //  [Auto-translated] "Cancel"
  cancel: "İptal",
  // "Create \"{0}\" item..."
  createCustomItem: "\"{0}\" öğesi oluştur..."
};

setupLocale({ localeCode: "tr", strings: turkishSurveyStrings, nativeName: "türkçe", englishName: "Turkish" });