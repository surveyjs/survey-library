import { setupLocale } from "survey-core";

export var slovakSurveyStrings = {
  pagePrevText: "Predchádzajúca",
  pageNextText: "Ďalej",
  completeText: "Dokončené",
  previewText: "Ukážka",
  editText: "Upraviť",
  startSurveyText: "Spustiť",
  otherItemText: "Iné (opíšte)",
  noneItemText: "Žiadne",
  refuseItemText: "Odmietnuť odpovedať",
  dontKnowItemText: "Neviem",
  selectAllItemText: "Vybrať všetky",
  deselectAllItemText: "Zrušte výber všetkých",
  progressText: "Strana {0} z {1}",
  indexText: "{0} {1}",
  panelDynamicProgressText: "Záznam {0} z {1}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "Zodpovedané otázky {0}/{1}",
  emptySurvey: "V prieskume nie je žiadna vidieľná stránka ani otázka.",
  completingSurvey: "Ďakujeme vám za dokončenie prieskumu.",
  completingSurveyBefore: "Podľa našich záznamov ste už tento prieskum dokončili.",
  loadingSurvey: "Načítanie prieskumu...",
  placeholder: "Vybrať...",
  ratingOptionsCaption: "Vybrať...",
  value: "hodnota",
  requiredError: "Požaduje sa odozva.",
  requiredErrorInPanel: "Požaduje sa odozva: zodpovedajte aspoň jednu otázku.",
  requiredInAllRowsError: "Požaduje sa odozva: zodpovedajte otázky vo všetkých riadkoch.",
  eachRowUniqueError: "Každý riadok musí mať jedinečnú hodnotu.",
  numericError: "Hodnota má byť číselná.",
  minError: "Hodnota nemá byť nižšia než {0}",
  maxError: "Hodnota nemá byť vyššia než {0}",
  textNoDigitsAllow: "Čísla nie sú povolené.",
  textMinLength: "Zadajte aspoň {0} znak(-y/-ov).",
  textMaxLength: "Nezadávajte viac než {0} znak(-y/-ov).",
  textMinMaxLength: "Zadajte aspoň {0} a nie viac než {1} znaky(-ov).",
  minRowCountError: "Vyplňte aspoň {0} riadok(-y/-ov).",
  minSelectError: "Vyberte aspoň {0} variant(-y/-ov).",
  maxSelectError: "Nevyberajte viac než {0} variant(-y/-ov).",
  numericMinMax: "„{0}“ má byť minimálne {1} a maximálne {2}",
  numericMin: "„{0}“ má byť minimálne {1}",
  numericMax: "„{0}“ má byť maximálne {1}",
  invalidEmail: "Zadajte platnú e-mailovú adresu.",
  invalidExpression: "Výraz: {0} má vrátiť hodnotu „true“.",
  urlRequestError: "Požiadavky vrátila hodnotu „{0}“. {1}",
  urlGetChoicesError: "Požiadavka vrátila prázdne údaje alebo je vlastnosť „cesta“ nesprávna",
  exceedMaxSize: "Veľkosť súboru nemá prekročiť {0}.",
  noUploadFilesHandler: "Súbory nie je možné nahrať. Pridajte obslužný program pre udalosť \"onUploadFiles\".",
  otherRequiredError: "Požaduje sa odozva: zadajte inú hodnotu.",
  uploadingFile: "Súbor sa odovzdáva. Počkajte niekoľko sekúnd a skúste to znova.",
  loadingFile: "Načítanie...",
  chooseFile: "Vyberte súbor(-y)...",
  noFileChosen: "Žiadny vybratý súbor",
  filePlaceholder: "Presuňte súbor sem alebo kliknite na nasledujúce tlačidlo a načítajte súbor.",
  confirmDelete: "Chcete záznam odstrániť?",
  keyDuplicationError: "Táto hodnota má byť jedinečná.",
  addColumn: "Pridať stĺpec",
  addRow: "Pridať riadok",
  removeRow: "Odstrániť",
  noRowsText: "K dispozícii nie sú žiadne riadky.",
  addPanel: "Pridať nové",
  removePanel: "Odstrániť",
  showDetails: "Zobraziť podrobnosti",
  hideDetails: "Skryť podrobnosti",
  choices_Item: "položka",
  matrix_column: "Stĺpec",
  matrix_row: "Riadok",
  multipletext_itemname: "text",
  savingData: "Výsledky sa ukladajú na server...",
  savingDataError: "V dôsledku chyby sa nepodarilo výsledky uložiť.",
  savingDataSuccess: "Výsledky sa úspešne uložili.",
  savingExceedSize: "Vaša odpoveď presahuje 64 kB. Zmenšite veľkosť svojich súborov a skúste to znova alebo kontaktujte vlastníka prieskumu.",
  saveAgainButton: "Skúste to znova",
  timerMin: "min",
  timerSec: "s",
  timerSpentAll: "Na tejto stránke ste strávili {0} a celkovo {1}.",
  timerSpentPage: "Na tejto stránke ste strávili {0}.",
  timerSpentSurvey: "Celkovo ste strávili {0}.",
  timerLimitAll: "Na tejto stránke ste strávili {0} z {1} a celkovo {2} z {3}.",
  timerLimitPage: "Na tejto stránke ste strávili {0} z {1}.",
  timerLimitSurvey: "Celkovo ste strávili {0} z {1}.",
  clearCaption: "Vymazať",
  signaturePlaceHolder: "Podpísať tu",
  signaturePlaceHolderReadOnly: "Bez podpisu",
  chooseFileCaption: "Vybrať súbor",
  takePhotoCaption: "Odfotiť",
  photoPlaceholder: "Kliknutím na tlačidlo nižšie nasnímate fotografiu pomocou fotoaparátu.",
  fileOrPhotoPlaceholder: "Presuňte myšou alebo vyberte súbor, ktorý chcete nahrať alebo nasnímať fotografiu pomocou fotoaparátu.",
  replaceFileCaption: "Nahradenie súboru",
  removeFileCaption: "Odstrániť tento súbor",
  booleanCheckedLabel: "Áno",
  booleanUncheckedLabel: "Nie",
  confirmRemoveFile: "Naozaj chcete odstrániť tento súbor: {0}?",
  confirmRemoveAllFiles: "Naozaj chcete odstrániť všetky súbory?",
  questionTitlePatternText: "Titul otázky",
  modalCancelButtonText: "Zrušiť",
  modalApplyButtonText: "Použiť",
  filterStringPlaceholder: "Vyhľadávanie písaním...",
  emptyMessage: "Žiadne údaje na zobrazenie",
  noEntriesText: "K dispozícii ešte nie sú žiadne zadania.\nKliknutím na nasledujúce tlačidlo pridajte nové zadanie.",
  noEntriesReadonlyText: "Nie sú k dispozícii žiadne záznamy.",
  tabTitlePlaceholder: "Nový panel",
  more: "Viacej",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Všetky možnosti sú zoradené",
  selectToRankEmptyUnrankedAreaText: "Presuňte sem voľby, aby ste ich zoradili",
  ok: "OK",
  cancel: "Zrušiť"
};

setupLocale({ localeCode: "sk", strings: slovakSurveyStrings, nativeName: "slovak", englishName: "Slovak" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Vybrať..."
// emptyMessage: "No data to display" => "Žiadne údaje na zobrazenie"
// noEntriesReadonlyText: "There are no entries." => "Nie sú k dispozícii žiadne záznamy."
// more: "More" => "Viacej"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Všetky možnosti sú zoradené"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Presuňte sem voľby, aby ste ich zoradili"// takePhotoCaption: "Take Photo" => "Odfotiť"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Kliknutím na tlačidlo nižšie nasnímate fotografiu pomocou fotoaparátu."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Presuňte myšou alebo vyberte súbor, ktorý chcete nahrať alebo nasnímať fotografiu pomocou fotoaparátu."
// replaceFileCaption: "Replace file" => "Nahradenie súboru"// eachRowUniqueError: "Each row must have a unique value." => "Každý riadok musí mať jedinečnú hodnotu."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Súbory nie je možné nahrať. Pridajte obslužný program pre udalosť \"onUploadFiles\"."
// showDetails: "Show Details" => "Zobraziť podrobnosti"
// hideDetails: "Hide Details" => "Skryť podrobnosti"
// ok: "OK" => "OK"
// cancel: "Cancel" => "Zrušiť"
// refuseItemText: "Refuse to answer" => "Odmietnuť odpovedať"
// dontKnowItemText: "Don't know" => "Neviem"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Vaša odpoveď presahuje 64 kB. Zmenšite veľkosť svojich súborov a skúste to znova alebo kontaktujte vlastníka prieskumu."
// signaturePlaceHolderReadOnly: "No signature" => "Bez podpisu"// tabTitlePlaceholder: "New Panel" => "Nový panel"// deselectAllItemText: "Deselect all" => "Zrušte výber všetkých"
// textNoDigitsAllow: "Numbers are not allowed." => "Čísla nie sú povolené."