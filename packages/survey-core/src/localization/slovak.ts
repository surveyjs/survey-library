import { setupLocale } from "survey-core";

export var slovakSurveyStrings = {
  // "Previous"
  pagePrevText: "Predchádzajúca",
  // "Next"
  pageNextText: "Ďalej",
  // "Complete"
  completeText: "Dokončené",
  // "Preview"
  previewText: "Ukážka",
  // "Edit"
  editText: "Upraviť",
  // "Start"
  startSurveyText: "Spustiť",
  // [Auto-translated] "Please leave a comment"
  commentText: "Zanechajte komentár",
  // "Other (describe)"
  otherItemText: "Iné (opíšte)",
  // "None"
  noneItemText: "Žiadne",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Odmietnuť odpovedať",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Neviem",
  // "Select All"
  selectAllItemText: "Vybrať všetky",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Zrušte výber všetkých",
  // "Page {0} of {1}"
  progressText: "Strana {0} z {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Záznam {0} z {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Zodpovedané otázky {0}/{1}",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "V prieskume nie je žiadna vidieľná stránka ani otázka.",
  // "Thank you for completing the survey"
  completingSurvey: "Ďakujeme vám za dokončenie prieskumu.",
  // "You have already completed this survey."
  completingSurveyBefore: "Podľa našich záznamov ste už tento prieskum dokončili.",
  // "Loading Survey..."
  loadingSurvey: "Načítanie prieskumu...",
  // "Select..."
  placeholder: "Vybrať...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Vybrať...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Vybrať...",
  // "value"
  value: "hodnota",
  // "Response required."
  requiredError: "Požaduje sa odozva.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Požaduje sa odozva: zodpovedajte aspoň jednu otázku.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Požaduje sa odozva: zodpovedajte otázky vo všetkých riadkoch.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Každý riadok musí mať jedinečnú hodnotu.",
  // "The value should be numeric."
  numericError: "Hodnota má byť číselná.",
  // "The value should not be less than {0}"
  minError: "Hodnota nemá byť nižšia než {0}",
  // "The value should not be greater than {0}"
  maxError: "Hodnota nemá byť vyššia než {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Čísla nie sú povolené.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Zadajte aspoň {0} znak(-y/-ov).",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Nezadávajte viac než {0} znak(-y/-ov).",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Zadajte aspoň {0} a nie viac než {1} znaky(-ov).",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Vyplňte aspoň {0} riadok(-y/-ov).",
  // "Please select at least {0} option(s)."
  minSelectError: "Vyberte aspoň {0} variant(-y/-ov).",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Nevyberajte viac než {0} variant(-y/-ov).",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "„{0}“ má byť minimálne {1} a maximálne {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "„{0}“ má byť minimálne {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "„{0}“ má byť maximálne {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Zadajte platnú e-mailovú adresu.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Výraz: {0} má vrátiť hodnotu „true“.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Požiadavky vrátila hodnotu „{0}“. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Požiadavka vrátila prázdne údaje alebo je vlastnosť „cesta“ nesprávna",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Veľkosť súboru nemá prekročiť {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Súbory nie je možné nahrať. Pridajte obslužný program pre udalosť \"onUploadFiles\".",
  // "Response required: enter another value."
  otherRequiredError: "Požaduje sa odozva: zadajte inú hodnotu.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Súbor sa odovzdáva. Počkajte niekoľko sekúnd a skúste to znova.",
  // "Loading..."
  loadingFile: "Načítanie...",
  // "Choose file(s)..."
  chooseFile: "Vyberte súbor(-y)...",
  // "No file selected"
  noFileChosen: "Žiadny vybratý súbor",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Presuňte súbor sem alebo kliknite na nasledujúce tlačidlo a načítajte súbor.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Chcete záznam odstrániť?",
  // "This value should be unique."
  keyDuplicationError: "Táto hodnota má byť jedinečná.",
  // "Add Column"
  addColumn: "Pridať stĺpec",
  // "Add Row"
  addRow: "Pridať riadok",
  // "Remove"
  removeRow: "Odstrániť",
  // "There are no rows."
  noRowsText: "K dispozícii nie sú žiadne riadky.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Riadok {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Pridať nové",
  // "Remove"
  removePanel: "Odstrániť",
  // [Auto-translated] "Show Details"
  showDetails: "Zobraziť podrobnosti",
  // [Auto-translated] "Hide Details"
  hideDetails: "Skryť podrobnosti",
  // "item"
  choices_Item: "položka",
  // [Auto-translated] "Choice option"
  choices_Choice: "Možnosť výberu",
  // "Column"
  matrix_column: "Stĺpec",
  // "Row"
  matrix_row: "Riadok",
  // "text"
  multipletext_itemname: "text",
  // "The results are being saved on the server..."
  savingData: "Výsledky sa ukladajú na server...",
  // "An error occurred and we could not save the results."
  savingDataError: "V dôsledku chyby sa nepodarilo výsledky uložiť.",
  // "The results were saved successfully!"
  savingDataSuccess: "Výsledky sa úspešne uložili.",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner."
  savingExceedSize: "Vaša odpoveď presahuje 64 kB. Zmenšite veľkosť svojich súborov a skúste to znova alebo kontaktujte vlastníka prieskumu.",
  // "Try again"
  saveAgainButton: "Skúste to znova",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "s",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Na tejto stránke ste strávili {0} a celkovo {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Na tejto stránke ste strávili {0}.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Celkovo ste strávili {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Na tejto stránke ste strávili {0} z {1} a celkovo {2} z {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Na tejto stránke ste strávili {0} z {1}.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Celkovo ste strávili {0} z {1}.",
  // "Clear"
  clearCaption: "Vymazať",
  // "Sign here"
  signaturePlaceHolder: "Podpísať tu",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Bez podpisu",
  // "Select File"
  chooseFileCaption: "Vybrať súbor",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Odfotiť",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Kliknutím na tlačidlo nižšie nasnímate fotografiu pomocou fotoaparátu.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Presuňte myšou alebo vyberte súbor, ktorý chcete nahrať alebo nasnímať fotografiu pomocou fotoaparátu.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Nahradenie súboru",
  // "Remove this file"
  removeFileCaption: "Odstrániť tento súbor",
  // "Yes"
  booleanCheckedLabel: "Áno",
  // "No"
  booleanUncheckedLabel: "Nie",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Naozaj chcete odstrániť tento súbor: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Naozaj chcete odstrániť všetky súbory?",
  // "Question Title"
  questionTitlePatternText: "Titul otázky",
  // "Cancel"
  modalCancelButtonText: "Zrušiť",
  // "Apply"
  modalApplyButtonText: "Použiť",
  // "Type to search..."
  filterStringPlaceholder: "Vyhľadávanie písaním...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Žiadne údaje na zobrazenie",
  // [Auto-translated] "Loading..."
  loadingPage: "Nakladanie...",
  // [Auto-translated] "Loading..."
  loadingData: "Nakladanie...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "K dispozícii ešte nie sú žiadne zadania.\nKliknutím na nasledujúce tlačidlo pridajte nové zadanie.",
  // [Auto-translated] "There are no entries."
  noEntriesReadonlyText: "Nie sú k dispozícii žiadne záznamy.",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nový panel",
  // [Auto-translated] "More"
  more: "Viacej",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are ranked"
  selectToRankEmptyRankedAreaText: "Všetky možnosti sú zoradené",
  // [Auto-translated] "Drag and drop choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Presuňte sem voľby, aby ste ich zoradili",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Zrušiť",
  // "Create \"{0}\" item..."
  createCustomItem: "Vytvoriť položku \"{0}\"..."
};

setupLocale({ localeCode: "sk", strings: slovakSurveyStrings, nativeName: "Slovenčina", englishName: "Slovak" });