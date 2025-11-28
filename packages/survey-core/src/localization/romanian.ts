import { setupLocale } from "survey-core";

export var romanianSurveyStrings = {
  // "Previous"
  pagePrevText: "Precedent",
  // "Next"
  pageNextText: "Următor",
  // "Complete"
  completeText: "Finalizare",
  // "Preview"
  previewText: "previzualizare",
  // "Edit"
  editText: "Editați",
  // "Start"
  startSurveyText: "start",
  // [Auto-translated] "Please leave a comment"
  commentText: "Vă rugăm să lăsați un comentariu",
  // "Other (describe)"
  otherItemText: "Altul(precizaţi)",
  // "None"
  noneItemText: "Nici unul",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Refuză să răspundă",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Nu ştiu",
  // "Select All"
  selectAllItemText: "Selectează tot",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Deselectează tot",
  // "Page {0} of {1}"
  progressText: "Pagina {0} din {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} de {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Înregistrare {0} din {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panou {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Răspunsuri la {0} / {1} întrebări",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Nu sunt întrebări pentru acest chestionar",
  // "Thank you for completing the survey"
  completingSurvey: "Vă mulţumim pentru timpul acordat!",
  // "You have already completed this survey."
  completingSurveyBefore: "Din înregistrările noastre reiese că ați completat deja acest chestionar.",
  // "Loading Survey..."
  loadingSurvey: "Chestionarul se încarcă...",
  // "Select..."
  placeholder: "Alegeţi...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Alege...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Alege...",
  // "value"
  value: "valoare",
  // "Response required."
  requiredError: "Răspunsul la această întrebare este obligatoriu.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Vă rugăm să răspundeți la cel puțin o întrebare.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Toate răspunsurile sunt obligatorii",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Fiecare rând trebuie să aibă o valoare unică.",
  // "The value should be numeric."
  numericError: "Răspunsul trebuie să fie numeric.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Valoarea nu trebuie să fie mai mică de {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Introduceți o valoare care se potrivește cu dimensiunea pasului {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Valoarea nu trebuie să fie mai mare de {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Numerele nu sunt permise.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Trebuie să introduceți minim {0} caractere.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Trebuie să introduceți maxim {0} caractere.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Trebuie să introduceți mai mult de {0} și mai puțin de {1} caractere.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Trebuie să completați minim {0} rânduri.",
  // "Please select at least {0} option(s)."
  minSelectError: "Trebuie să selectați minim {0} opţiuni.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Trebuie să selectați maxim {0} opţiuni.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Răspunsul '{0}' trebuie să fie mai mare sau egal ca {1} şî mai mic sau egal cu {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "Răspunsul '{0}' trebuie să fie mai mare sau egal ca {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "Răspunsul '{0}' trebuie să fie mai mic sau egal ca {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Trebuie să introduceţi o adresa de email validă.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Expresia: {0} ar trebui să returneze „adevărat”.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Request-ul a returnat eroarea '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Request-ul nu a returnat date sau proprietatea 'path' este incorectă",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Dimensiunea fişierului nu trebuie să depăşească {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Numărul maxim de fișiere pe care le poți încărca este {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Fișierele nu pot fi încărcate. Vă rugăm să adăugați un handler pentru evenimentul \"onUploadFiles\".",
  // "Response required: enter another value."
  otherRequiredError: "Trebuie să completați câmpul 'Altul'.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Fișierul dumneavoastră este în curs de încărcare. Vă rugăm așteptați câteva secunde și reveniți apoi.",
  // "Loading..."
  loadingFile: "Se încarcă...",
  // "Choose file(s)..."
  chooseFile: "Alege fisierele...",
  // "No file selected"
  noFileChosen: "Niciun fișier ales",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Trageți și plasați un fișier aici sau faceți clic pe butonul de mai jos pentru a selecta un fișier de încărcat.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Sunteți sigur că doriți să ștergeți înregistrarea?",
  // "This value should be unique."
  keyDuplicationError: "Valoarea trebuie să fie unică.",
  // "Add Column"
  addColumn: "Adăugați coloană",
  // "Add Row"
  addRow: "Adăugare rând",
  // "Remove"
  removeRow: "Ștergere",
  // [Auto-translated] "There are no rows."
  noRowsText: "Nu există rânduri.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Rând {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Adăugare",
  // "Remove"
  removePanel: "Ștergere",
  // [Auto-translated] "Show Details"
  showDetails: "Arată detalii",
  // [Auto-translated] "Hide Details"
  hideDetails: "Ascunde detalii",
  // "item"
  choices_Item: "opțiune",
  // [Auto-translated] "Choice option"
  choices_Choice: "Opțiune de alegere",
  // "Column"
  matrix_column: "Coloană",
  // "Row"
  matrix_row: "Rând",
  // [Auto-translated] "text"
  multipletext_itemname: "Text",
  // "The results are being saved on the server..."
  savingData: "Rezultatele sunt în curs de salvare...",
  // "An error occurred and we could not save the results."
  savingDataError: "A intervenit o eroare, rezultatele nu au putut fi salvate.",
  // "The results were saved successfully!"
  savingDataSuccess: "Rezultatele au fost salvate cu succes!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Răspunsul tău depășește 64KB. Vă rugăm să reduceți dimensiunea fișierelor și să încercați din nou sau să contactați proprietarul sondajului.",
  // "Try again"
  saveAgainButton: "Încercați din nou",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sec",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Ați petrecut {0} pe această pagină și {1} în total.",
  // "You have spent {0} on this page."
  timerSpentPage: "Ați petrecut {0} pe această pagină.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Ați petrecut {0} în total.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Ați petrecut {0} din {1} pe această pagină și {2} din {3} în total.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Ați petrecut {0} din {1} pe această pagină.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Ați petrecut {0} din {1} în total.",
  // "Clear"
  clearCaption: "clar",
  // [Auto-translated] "Select"
  selectCaption: "Alege",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Semnează aici",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Fără semnătură",
  // "Select File"
  chooseFileCaption: "Alege fișierul",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Faceți o fotografie",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Faceți clic pe butonul de mai jos pentru a face o fotografie folosind camera.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Glisați și fixați sau selectați un fișier pentru a încărca sau a face o fotografie folosind camera.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Înlocuire fișier",
  // "Remove this file"
  removeFileCaption: "Eliminați acest fișier",
  // "Yes"
  booleanCheckedLabel: "da",
  // "No"
  booleanUncheckedLabel: "Nu",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Sigur doriți să eliminați acest fișier: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Sigur doriți să eliminați toate fișierele?",
  // "Question Title"
  questionTitlePatternText: "Titlul intrebarii",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Anula",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Aplica",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Tastați pentru a căuta...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Nu există date de afișat",
  // [Auto-translated] "Loading..."
  loadingPage: "Încărcare...",
  // [Auto-translated] "Loading..."
  loadingData: "Încărcare...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Încă nu există înscrieri.\nFaceți clic pe butonul de mai jos pentru a adăuga o nouă intrare.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Fără intrări",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Panou nou",
  // [Auto-translated] "More"
  more: "Mai mult",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Toate opțiunile sunt selectate pentru clasare",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Trageți opțiunile aici pentru a le clasifica",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Anula",
  // "Create \"{0}\" item..."
  createCustomItem: "Creați un articol \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Cuprins",
  // [Auto-translated] "Progress bar"
  progressbar: "Bara de progres"
};

setupLocale({ localeCode: "ro", strings: romanianSurveyStrings, nativeName: "română", englishName: "Romanian" });