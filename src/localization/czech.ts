import { surveyLocalization } from "survey-core";

export var czechSurveyStrings = {
  pagePrevText: "Předchozí",
  pageNextText: "Další",
  completeText: "Dokončit",
  previewText: "Náhled",
  editText: "Upravit",
  startSurveyText: "Začít",
  otherItemText: "Jiná odpověď (napište)",
  noneItemText: "Žádný",
  selectAllItemText: "Vybrat vše",
  progressText: "Strana {0} z {1}",
  indexText: "{0} z {1}",
  panelDynamicProgressText: "Záznam {0} z {1}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "Zodpovězené otázky: {0} / {1}",
  emptySurvey: "Průzkum neobsahuje žádné otázky.",
  completingSurvey: "Děkujeme za vyplnění průzkumu!",
  completingSurveyBefore: "Naše záznamy ukazují, že jste tento průzkum již dokončil/a.",
  loadingSurvey: "Probíhá načítání průzkumu...",
  placeholder: "Vyberte...",
  ratingOptionsCaption: "Vybrat...",
  value: "hodnota",
  requiredError: "Odpovězte prosím na otázku.",
  requiredErrorInPanel: "Odpovězte prosím alespoň jednu otázku.",
  requiredInAllRowsError: "Odpovězte prosím na všechny otázky.",
  numericError: "V tomto poli lze zadat pouze čísla.",
  minError: "Hodnota by neměla být menší než {0}",
  maxError: "Hodnota by neměla být větší než {0}",
  textMinLength: "Zadejte prosím alespoň {0} znaků.",
  textMaxLength: "Zadejte prosím méně než {0} znaků.",
  textMinMaxLength: "Zadejte prosím více než {0} a méně než {1} znaků.",
  minRowCountError: "Vyplňte prosím alespoň {0} řádků.",
  minSelectError: "Vyberte prosím alespoň {0} varianty.",
  maxSelectError: "Nevybírejte prosím více než {0} variant.",
  numericMinMax: "Odpověď '{0}' by mělo být větší nebo rovno {1} a menší nebo rovno {2}",
  numericMin: "Odpověď '{0}' by mělo být větší nebo rovno {1}",
  numericMax: "Odpověď '{0}' by mělo být menší nebo rovno {1}",
  invalidEmail: "Zadejte prosím platnou e-mailovou adresu.",
  invalidExpression: "Výraz: {0} by měl vrátit hodnotu „true“.",
  urlRequestError: "Požadavek vrátil chybu '{0}'. {1}",
  urlGetChoicesError: "Požadavek nevrátil data nebo je neplatná vlastnost 'path'",
  exceedMaxSize: "Velikost souboru by neměla být větší než {0}.",
  otherRequiredError: "Zadejte prosím jinou hodnotu.",
  uploadingFile: "Váš soubor se nahrává. Zkuste to prosím za několik sekund.",
  loadingFile: "Načítání...",
  chooseFile: "Vyberte soubory...",
  noFileChosen: "Není zvolený žádný soubor",
  fileDragAreaPlaceholder: "Přetáhněte sem soubor nebo klikněte na tlačítko níže a vyberte soubor, který chcete nahrát.",
  confirmDelete: "Chcete záznam smazat?",
  keyDuplicationError: "Tato hodnota by měla být unikátní.",
  addColumn: "Přidat sloupec",
  addRow: "Přidat řádek",
  removeRow: "Odstranit",
  emptyRowsText: "Neexistují žádné řádky.",
  addPanel: "Přidat nový",
  removePanel: "Odstranit",
  choices_Item: "položka",
  matrix_column: "Sloupec",
  matrix_row: "Řádek",
  multipletext_itemname: "Text",
  savingData: "Výsledky se ukládají na server...",
  savingDataError: "Došlo k chybě a výsledky jsme nemohli uložit.",
  savingDataSuccess: "Výsledky byly úspěšně uloženy!",
  saveAgainButton: "Zkuste to znovu",
  timerMin: "min",
  timerSec: "sek",
  timerSpentAll: "Na této stránce jste strávil/a celkem {0} z {1}.",
  timerSpentPage: "Na této stránce jste strávil/a {0}.",
  timerSpentSurvey: "Celkem jste strávil/a {0}.",
  timerLimitAll: "Na této stránce jste strávil/a {0} z {1} a celkem {2} z {3}.",
  timerLimitPage: "Na této stránce jste strávil/a {0} z {1}.",
  timerLimitSurvey: "Celkově jste strávil/a {0} z {1}.",
  clearCaption: "Vymazat",
  signaturePlaceHolder: "Podepište se zde",
  chooseFileCaption: "Vyberte soubor",
  removeFileCaption: "Odeberte tento soubor",
  booleanCheckedLabel: "Ano",
  booleanUncheckedLabel: "Ne",
  confirmRemoveFile: "Opravdu chcete odebrat tento soubor: {0}?",
  confirmRemoveAllFiles: "Opravdu chcete odstranit všechny soubory?",
  questionTitlePatternText: "Název otázky",
  modalCancelButtonText: "Zrušit",
  modalApplyButtonText: "Použít",
  filterStringPlaceholder: "Zadejte hledaný text...",
  emptyMessage: "Žádná data k zobrazení",
  noEntriesText: "Zatím nejsou žádné záznamy.\nKliknutím na tlačítko níže přidáte novou položku.",
  noEntriesReadonlyText: "Nejsou zde žádné položky.",
  more: "Více",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Všechny možnosti jsou seřazeny",
  selectToRankEmptyUnrankedAreaText: "Přetáhněte volby zde a seřaďte je"
};

surveyLocalization.locales["cs"] = czechSurveyStrings;
surveyLocalization.localeNames["cs"] = "čeština";

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} z {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Vybrat..."
// minError: "The value should not be less than {0}" => "Hodnota by neměla být menší než {0}"
// maxError: "The value should not be greater than {0}" => "Hodnota by neměla být větší než {0}"
// fileDragAreaPlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Přetáhněte sem soubor nebo klikněte na tlačítko níže a vyberte soubor, který chcete nahrát."
// emptyRowsText: "There are no rows." => "Neexistují žádné řádky."
// multipletext_itemname: "text" => "Text"
// signaturePlaceHolder: "Sign here" => "Podepište se zde"
// modalCancelButtonText: "Cancel" => "Zrušit"
// modalApplyButtonText: "Apply" => "Použít"
// filterStringPlaceholder: "Type to search..." => "Zadejte hledaný text..."
// emptyMessage: "No data to display" => "Žádná data k zobrazení"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Zatím nejsou žádné záznamy.\nKliknutím na tlačítko níže přidáte novou položku."
// noEntriesReadonlyText: "There are no entries." => "Nejsou zde žádné položky."
// more: "More" => "Více"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Všechny možnosti jsou seřazeny"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Přetáhněte volby zde a seřaďte je"