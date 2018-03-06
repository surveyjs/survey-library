import { surveyLocalization } from "../surveyStrings";

export var turkishSurveyStrings = {
  pagePrevText: "Geri",
  pageNextText: "İleri",
  completeText: "Anketi Tamamla",
  otherItemText: "Diğer (açıklayınız)",
  progressText: "Sayfa {0} / {1}",
  emptySurvey: "Ankette görüntülenecek sayfa ya da soru mevcut değil.",
  completingSurvey: "Anketimizi tamamladığınız için teşekkür ederiz.",
  loadingSurvey: "Anket sunucudan yükleniyor ...",
  optionsCaption: "Seçiniz ...",
  requiredError: "Lütfen soruya cevap veriniz",
  numericError: "Girilen değer numerik olmalıdır",
  textMinLength: "En az {0} sembol giriniz.",
  minRowCountError: "Lütfen en az {0} satırı doldurun.",
  minSelectError: "Lütfen en az {0} seçeneği seçiniz.",
  maxSelectError: "Lütfen {0} adetten fazla seçmeyiniz.",
  numericMinMax:
    "The '{0}' should be equal or more than {1} and equal or less than {2}",
  numericMin: "'{0}' değeri {1} değerine eşit veya büyük olmalıdır",
  numericMax: "'{0}' değeri {1} değerine eşit ya da küçük olmalıdır.",
  invalidEmail: "Lütfen geçerli bir eposta adresi giriniz.",
  urlRequestError: "Talebi şu hatayı döndü '{0}'. {1}",
  urlGetChoicesError:
    "Talep herhangi bir veri dönmedi ya da 'path' özelliği hatalı.",
  exceedMaxSize: "Dosya boyutu {0} değerini geçemez.",
  otherRequiredError: "Lütfen diğer değerleri giriniz.",
  uploadingFile:
    "Dosyanız yükleniyor. LÜtfen birkaç saniye bekleyin ve tekrar deneyin.",
  addRow: "Satır Ekle",
  removeRow: "Kaldır"
};

surveyLocalization.locales["tr"] = turkishSurveyStrings;
surveyLocalization.localeNames["tr"] = "türkçe";
