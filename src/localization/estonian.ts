import { surveyLocalization } from "survey-core";

export var estonianSurveyStrings = {
  pagePrevText: "Tagasi",
  pageNextText: "Edasi",
  completeText: "Lõpeta",
  previewText: "Eelvaade",
  editText: "Muuda",
  startSurveyText: "Alusta",
  otherItemText: "Muu (täpsusta)",
  noneItemText: "Mitte midagi",
  selectAllItemText: "Vali kõik",
  progressText: "Lehekülg {0}/{1}",
  indexText: "{0} {1}",
  panelDynamicProgressText: "Kirje {0}/{1}",
  panelDynamicTabTextFormat: "Paneel {panelIndex}",
  questionsProgressText: "Vastatud {0} küsimust {1}-st",
  emptySurvey: "Selles uuringus ei ole ühtki nähtavat lehekülge või küsimust.",
  completingSurvey: "Aitäh, et vastasid ankeedile!",
  completingSurveyBefore: "Meie andmetel oled sa sellele ankeedile juba vastanud.",
  loadingSurvey: "Laen ankeeti...",
  placeholder: "Vali...",
  ratingOptionsCaption: "Valima...",
  value: "väärtus",
  requiredError: "Palun vasta küsimusele.",
  requiredErrorInPanel: "Palun vasta vähemalt ühele küsimusele.",
  requiredInAllRowsError: "Palun anna vastus igal real.",
  numericError: "See peaks olema numbriline väärtus.",
  minError: "Väärtus ei tohiks olla väiksem kui {0}",
  maxError: "Väärtus ei tohiks olla suurem kui {0}",
  textMinLength: "Palun sisesta vähemalt {0} tähemärki.",
  textMaxLength: "Palun ära sisesta rohkem kui {0} tähemärki.",
  textMinMaxLength: "Sisesta palun {0} - {1} tähemärki.",
  minRowCountError: "Sisesta plaun vähemalt {0} rida.",
  minSelectError: "Palun vali vähemalt {0} varianti.",
  maxSelectError: "Palun vali kõige rohkem {0} varianti.",
  numericMinMax: "'{0}' peaks olema võrdne või suurem kui {1} ja võrdne või väiksem kui {2}",
  numericMin: "'{0}' peaks olema võrdne või suurem kui {1}",
  numericMax: "'{0}' peaks olema võrnde või väiksem kui {1}",
  invalidEmail: "Sisesta palun korrektne e-posti aadress.",
  invalidExpression: "Avaldis: {0} peaks tagastama tõese.",
  urlRequestError: "Taotlus tagastas vea „{0}”. {1}",
  urlGetChoicesError: "Taotlus tagastas tühjad andmed või atribuut 'path' on vale",
  exceedMaxSize: "Faili suurus ei tohi ületada {0}.",
  otherRequiredError: "Sisesta palun muu vastus.",
  uploadingFile: "Sinu fail laeb üles. Palun oota mõned sekundid ning proovi seejärel uuesti.",
  loadingFile: "Laen...",
  chooseFile: "Vali fail(id)...",
  noFileChosen: "Faili pole valitud",
  fileDragAreaPlaceholder: "Pukseerige fail siia või klõpsake allolevat nuppu ja valige üleslaaditav fail.",
  confirmDelete: "Kas tahad kirje kustutada?",
  keyDuplicationError: "See väärtus peab olema unikaalne.",
  addColumn: "Lisa veerg",
  addRow: "Lisa rida",
  removeRow: "Eemalda",
  emptyRowsText: "Ridu pole.",
  addPanel: "Lisa uus",
  removePanel: "Eemalda",
  choices_Item: "üksus",
  matrix_column: "Veerg",
  matrix_row: "Rida",
  multipletext_itemname: "Tekst",
  savingData: "Salvestan andmed serveris...",
  savingDataError: "Tekkis viga ning me ei saanud vastuseid salvestada.",
  savingDataSuccess: "Vastuste salvestamine õnnestus!",
  saveAgainButton: "Proovi uuesti",
  timerMin: "min",
  timerSec: "sek",
  timerSpentAll: "Oled veetnud {0} sellel lehel ning kokku {1}.",
  timerSpentPage: "Oled veetnud {0} sellel lehel.",
  timerSpentSurvey: "Oled veetnud {0} kokku.",
  timerLimitAll: "Oled kulutanud {0} võimalikust {1} sellel lehel ning {2} võimalikust {3} kokku.",
  timerLimitPage: "Oled kulutanud {0} võimalikust {1} sellel lehel.",
  timerLimitSurvey: "Oled kulutanud {0} võimalikust {1} koguajast.",
  clearCaption: "Puhasta",
  signaturePlaceHolder: "Allkirjasta siin",
  chooseFileCaption: "Vali fail",
  removeFileCaption: "Eemalda see fail",
  booleanCheckedLabel: "Jah",
  booleanUncheckedLabel: "Ei",
  confirmRemoveFile: "Oled sa kindel, et soovid selle faili eemaldada: {0}?",
  confirmRemoveAllFiles: "Oled sa kindel, et soovid eemaldada kõik failid?",
  questionTitlePatternText: "Küsimuse pealkiri",
  modalCancelButtonText: "Tühistama",
  modalApplyButtonText: "Kohaldata",
  filterStringPlaceholder: "Tippige otsimiseks...",
  emptyMessage: "Kuvatavaid andmeid pole",
  noEntriesText: "Sissekandeid veel ei ole.\nUue kirje lisamiseks klõpsake allolevat nuppu.",
  noEntriesReadonlyText: "Kirjeid ei ole.",
  more: "Rohkem",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Kõik valikud on järjestatud",
  selectToRankEmptyUnrankedAreaText: "Lohistage valikuid siia, et neid järjestada"
};

surveyLocalization.locales["et"] = estonianSurveyStrings;
surveyLocalization.localeNames["et"] = "eesti keel";

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Paneel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Valima..."
// minError: "The value should not be less than {0}" => "Väärtus ei tohiks olla väiksem kui {0}"
// maxError: "The value should not be greater than {0}" => "Väärtus ei tohiks olla suurem kui {0}"
// fileDragAreaPlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Pukseerige fail siia või klõpsake allolevat nuppu ja valige üleslaaditav fail."
// emptyRowsText: "There are no rows." => "Ridu pole."
// multipletext_itemname: "text" => "Tekst"
// signaturePlaceHolder: "Sign here" => "Allkirjasta siin"
// modalCancelButtonText: "Cancel" => "Tühistama"
// modalApplyButtonText: "Apply" => "Kohaldata"
// filterStringPlaceholder: "Type to search..." => "Tippige otsimiseks..."
// emptyMessage: "No data to display" => "Kuvatavaid andmeid pole"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Sissekandeid veel ei ole.\nUue kirje lisamiseks klõpsake allolevat nuppu."
// noEntriesReadonlyText: "There are no entries." => "Kirjeid ei ole."
// more: "More" => "Rohkem"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Kõik valikud on järjestatud"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Lohistage valikuid siia, et neid järjestada"