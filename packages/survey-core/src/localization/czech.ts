import { setupLocale } from "survey-core";

export var czechSurveyStrings = {
  // "Previous"
  pagePrevText: "Předchozí",
  // "Next"
  pageNextText: "Další",
  // "Complete"
  completeText: "Dokončit",
  // "Preview"
  previewText: "Náhled",
  // "Edit"
  editText: "Upravit",
  // "Start"
  startSurveyText: "Začít",
  // [Auto-translated] "Please leave a comment"
  commentText: "Zanechte prosím komentář",
  // "Other (describe)"
  otherItemText: "Jiná odpověď (napište)",
  // "None"
  noneItemText: "Žádný",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Odmítnout odpovědět",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Nevím",
  // "Select All"
  selectAllItemText: "Vybrat vše",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Zrušit výběr všech",
  // "Page {0} of {1}"
  progressText: "Strana {0} z {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} z {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Záznam {0} z {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Zodpovězené otázky: {0} / {1}",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Průzkum neobsahuje žádné otázky.",
  // "Thank you for completing the survey"
  completingSurvey: "Děkujeme za vyplnění průzkumu!",
  // "You have already completed this survey."
  completingSurveyBefore: "Naše záznamy ukazují, že jste tento průzkum již dokončil/a.",
  // "Loading Survey..."
  loadingSurvey: "Probíhá načítání průzkumu...",
  // "Select..."
  placeholder: "Vyberte...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Vybrat...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Vybrat...",
  // "value"
  value: "hodnota",
  // "Response required."
  requiredError: "Odpovězte prosím na otázku.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Odpovězte prosím alespoň jednu otázku.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Odpovězte prosím na všechny otázky.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Každý řádek musí mít jedinečnou hodnotu.",
  // "The value should be numeric."
  numericError: "V tomto poli lze zadat pouze čísla.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Hodnota by neměla být menší než {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Zadejte hodnotu, která odpovídá velikosti kroku {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Hodnota by neměla být větší než {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Čísla nejsou povolena.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Zadejte prosím alespoň {0} znaků.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Zadejte prosím méně než {0} znaků.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Zadejte prosím více než {0} a méně než {1} znaků.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Vyplňte prosím alespoň {0} řádků.",
  // "Please select at least {0} option(s)."
  minSelectError: "Vyberte prosím alespoň {0} varianty.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Nevybírejte prosím více než {0} variant.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Odpověď '{0}' by mělo být větší nebo rovno {1} a menší nebo rovno {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "Odpověď '{0}' by mělo být větší nebo rovno {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "Odpověď '{0}' by mělo být menší nebo rovno {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Zadejte prosím platnou e-mailovou adresu.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Výraz: {0} by měl vrátit hodnotu „true“.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Požadavek vrátil chybu '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Požadavek nevrátil data nebo je neplatná vlastnost 'path'",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Velikost souboru by neměla být větší než {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Maximální počet souborů, které můžete nahrát, je {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Soubory nelze nahrát. Přidejte obslužnou rutinu pro událost 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Zadejte prosím jinou hodnotu.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Váš soubor se nahrává. Zkuste to prosím za několik sekund.",
  // "Loading..."
  loadingFile: "Načítání...",
  // "Choose file(s)..."
  chooseFile: "Vyberte soubory...",
  // "No file selected"
  noFileChosen: "Není zvolený žádný soubor",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Sem přetáhněte soubor nebo klikněte na tlačítko níže a vyberte soubor, který chcete nahrát.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Chcete záznam smazat?",
  // "This value should be unique."
  keyDuplicationError: "Tato hodnota by měla být unikátní.",
  // "Add Column"
  addColumn: "Přidat sloupec",
  // "Add Row"
  addRow: "Přidat řádek",
  // "Remove"
  removeRow: "Odstranit",
  // [Auto-translated] "There are no rows."
  noRowsText: "Neexistují žádné řádky.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Řádek {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Přidat nový",
  // "Remove"
  removePanel: "Odstranit",
  // [Auto-translated] "Show Details"
  showDetails: "Zobrazit podrobnosti",
  // [Auto-translated] "Hide Details"
  hideDetails: "Skrýt podrobnosti",
  // "item"
  choices_Item: "položka",
  // [Auto-translated] "Choice option"
  choices_Choice: "Možnost volby",
  // "Column"
  matrix_column: "Sloupec",
  // "Row"
  matrix_row: "Řádek",
  // [Auto-translated] "text"
  multipletext_itemname: "Text",
  // "The results are being saved on the server..."
  savingData: "Výsledky se ukládají na server...",
  // "An error occurred and we could not save the results."
  savingDataError: "Došlo k chybě a výsledky jsme nemohli uložit.",
  // "The results were saved successfully!"
  savingDataSuccess: "Výsledky byly úspěšně uloženy!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Vaše odpověď přesahuje 64 kB. Zmenšete prosím velikost svých souborů a zkuste to znovu nebo kontaktujte vlastníka průzkumu.",
  // "Try again"
  saveAgainButton: "Zkuste to znovu",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Na této stránce jste strávil/a celkem {0} z {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Na této stránce jste strávil/a {0}.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Celkem jste strávil/a {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Na této stránce jste strávil/a {0} z {1} a celkem {2} z {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Na této stránce jste strávil/a {0} z {1}.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Celkově jste strávil/a {0} z {1}.",
  // "Clear"
  clearCaption: "Vymazat",
  // [Auto-translated] "Select"
  selectCaption: "Vybrat",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Podepište se zde",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Bez podpisu",
  // "Select File"
  chooseFileCaption: "Vyberte soubor",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Pořídit fotografii",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Kliknutím na tlačítko níže pořídíte fotografii pomocí fotoaparátu.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Přetáhněte nebo vyberte soubor, který chcete nahrát nebo pořiďte fotografii pomocí fotoaparátu.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Nahradit soubor",
  // "Remove this file"
  removeFileCaption: "Odeberte tento soubor",
  // "Yes"
  booleanCheckedLabel: "Ano",
  // "No"
  booleanUncheckedLabel: "Ne",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Opravdu chcete odebrat tento soubor: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Opravdu chcete odstranit všechny soubory?",
  // "Question Title"
  questionTitlePatternText: "Název otázky",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Zrušit",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Použít",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Zadejte hledaný text...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Žádná data k zobrazení",
  // [Auto-translated] "Loading..."
  loadingPage: "Nakládka...",
  // [Auto-translated] "Loading..."
  loadingData: "Nakládka...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Zatím žádné záznamy.\nKliknutím na tlačítko níže přidáte novou položku.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Žádné vstupy",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nový panel",
  // [Auto-translated] "More"
  more: "Více",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Všechny možnosti jsou vybrány pro pořadí",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Přetažením voleb sem je seřadíte",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Zrušit",
  // "Create \"{0}\" item..."
  createCustomItem: "Vytvořte položku \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Obsah",
  // [Auto-translated] "Progress bar"
  progressbar: "Indikátor průběhu"
};

setupLocale({ localeCode: "cs", strings: czechSurveyStrings, nativeName: "čeština", englishName: "Czech" });