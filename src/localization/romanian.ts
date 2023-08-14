import { surveyLocalization } from "survey-core";

export var romanianSurveyStrings: any = {
  pagePrevText: "Precedent",
  pageNextText: "Următor",
  completeText: "Finalizare",
  previewText: "previzualizare",
  editText: "Editați",
  startSurveyText: "start",
  otherItemText: "Altul(precizaţi)",
  noneItemText: "Nici unul",
  selectAllItemText: "Selectează tot",
  progressText: "Pagina {0} din {1}",
  indexText: "{0} de {1}",
  panelDynamicProgressText: "Înregistrare {0} din {1}",
  panelDynamicTabTextFormat: "Panou {panelIndex}",
  questionsProgressText: "Răspunsuri la {0} / {1} întrebări",
  emptySurvey: "Nu sunt întrebări pentru acest chestionar",
  completingSurvey: "Vă mulţumim pentru timpul acordat!",
  completingSurveyBefore: "Din înregistrările noastre reiese că ați completat deja acest chestionar.",
  loadingSurvey: "Chestionarul se încarcă...",
  placeholder: "Alegeţi...",
  ratingOptionsCaption: "Alege...",
  value: "valoare",
  requiredError: "Răspunsul la această întrebare este obligatoriu.",
  requiredErrorInPanel: "Vă rugăm să răspundeți la cel puțin o întrebare.",
  requiredInAllRowsError: "Toate răspunsurile sunt obligatorii",
  numericError: "Răspunsul trebuie să fie numeric.",
  minError: "Valoarea nu trebuie să fie mai mică de {0}",
  maxError: "Valoarea nu trebuie să fie mai mare de {0}",
  textMinLength: "Trebuie să introduceți minim {0} caractere.",
  textMaxLength: "Trebuie să introduceți maxim {0} caractere.",
  textMinMaxLength: "Trebuie să introduceți mai mult de {0} și mai puțin de {1} caractere.",
  minRowCountError: "Trebuie să completați minim {0} rânduri.",
  minSelectError: "Trebuie să selectați minim {0} opţiuni.",
  maxSelectError: "Trebuie să selectați maxim {0} opţiuni.",
  numericMinMax: "Răspunsul '{0}' trebuie să fie mai mare sau egal ca {1} şî mai mic sau egal cu {2}",
  numericMin: "Răspunsul '{0}' trebuie să fie mai mare sau egal ca {1}",
  numericMax: "Răspunsul '{0}' trebuie să fie mai mic sau egal ca {1}",
  invalidEmail: "Trebuie să introduceţi o adresa de email validă.",
  invalidExpression: "Expresia: {0} ar trebui să returneze „adevărat”.",
  urlRequestError: "Request-ul a returnat eroarea '{0}'. {1}",
  urlGetChoicesError: "Request-ul nu a returnat date sau proprietatea 'path' este incorectă",
  exceedMaxSize: "Dimensiunea fişierului nu trebuie să depăşească {0}.",
  otherRequiredError: "Trebuie să completați câmpul 'Altul'.",
  uploadingFile: "Fișierul dumneavoastră este în curs de încărcare. Vă rugăm așteptați câteva secunde și reveniți apoi.",
  loadingFile: "Se încarcă...",
  chooseFile: "Alege fisierele...",
  noFileChosen: "Niciun fișier ales",
  fileDragAreaPlaceholder: "Glisați și fixați un fișier aici sau faceți clic pe butonul de mai jos și alegeți un fișier de încărcat.",
  confirmDelete: "Sunteți sigur că doriți să ștergeți înregistrarea?",
  keyDuplicationError: "Valoarea trebuie să fie unică.",
  addColumn: "Adăugați coloană",
  addRow: "Adăugare rând",
  removeRow: "Ștergere",
  emptyRowsText: "Nu există rânduri.",
  addPanel: "Adăugare",
  removePanel: "Ștergere",
  choices_Item: "opțiune",
  matrix_column: "Coloană",
  matrix_row: "Rând",
  multipletext_itemname: "Text",
  savingData: "Rezultatele sunt în curs de salvare...",
  savingDataError: "A intervenit o eroare, rezultatele nu au putut fi salvate.",
  savingDataSuccess: "Rezultatele au fost salvate cu succes!",
  saveAgainButton: "Încercați din nou",
  timerMin: "min",
  timerSec: "sec",
  timerSpentAll: "Ați petrecut {0} pe această pagină și {1} în total.",
  timerSpentPage: "Ați petrecut {0} pe această pagină.",
  timerSpentSurvey: "Ați petrecut {0} în total.",
  timerLimitAll: "Ați petrecut {0} din {1} pe această pagină și {2} din {3} în total.",
  timerLimitPage: "Ați petrecut {0} din {1} pe această pagină.",
  timerLimitSurvey: "Ați petrecut {0} din {1} în total.",
  clearCaption: "clar",
  signaturePlaceHolder: "Semnează aici",
  chooseFileCaption: "Alege fișierul",
  removeFileCaption: "Eliminați acest fișier",
  booleanCheckedLabel: "da",
  booleanUncheckedLabel: "Nu",
  confirmRemoveFile: "Sigur doriți să eliminați acest fișier: {0}?",
  confirmRemoveAllFiles: "Sigur doriți să eliminați toate fișierele?",
  questionTitlePatternText: "Titlul intrebarii",
  modalCancelButtonText: "Anula",
  modalApplyButtonText: "Aplica",
  filterStringPlaceholder: "Tastați pentru a căuta...",
  emptyMessage: "Nu există date de afișat",
  noEntriesText: "Nu există încă intrări.\nFaceți clic pe butonul de mai jos pentru a adăuga o intrare nouă.",
  noEntriesReadonlyText: "Nu există intrări.",
  more: "Mai mult",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Toate opțiunile sunt clasificate",
  selectToRankEmptyUnrankedAreaText: "Glisați și fixați opțiunile aici pentru a le clasifica"
};

surveyLocalization.locales["ro"] = romanianSurveyStrings;
surveyLocalization.localeNames["ro"] = "română";

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} de {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panou {panelIndex}"
// ratingOptionsCaption: "Select..." => "Alege..."
// minError: "The value should not be less than {0}" => "Valoarea nu trebuie să fie mai mică de {0}"
// maxError: "The value should not be greater than {0}" => "Valoarea nu trebuie să fie mai mare de {0}"
// fileDragAreaPlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Glisați și fixați un fișier aici sau faceți clic pe butonul de mai jos și alegeți un fișier de încărcat."
// emptyRowsText: "There are no rows." => "Nu există rânduri."
// multipletext_itemname: "text" => "Text"
// signaturePlaceHolder: "Sign here" => "Semnează aici"
// modalCancelButtonText: "Cancel" => "Anula"
// modalApplyButtonText: "Apply" => "Aplica"
// filterStringPlaceholder: "Type to search..." => "Tastați pentru a căuta..."
// emptyMessage: "No data to display" => "Nu există date de afișat"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Nu există încă intrări.\nFaceți clic pe butonul de mai jos pentru a adăuga o intrare nouă."
// noEntriesReadonlyText: "There are no entries." => "Nu există intrări."
// more: "More" => "Mai mult"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Toate opțiunile sunt clasificate"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Glisați și fixați opțiunile aici pentru a le clasifica"