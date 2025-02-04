import { setupLocale } from "survey-core";

export var dutchSurveyStrings = {
  pagePrevText: "Vorige",
  pageNextText: "Volgende",
  completeText: "Verzenden",
  previewText: "Voorbeeld",
  editText: "Bewerk",
  startSurveyText: "Start",
  otherItemText: "Anders, nl.",
  noneItemText: "Geen",
  refuseItemText: "Weiger te antwoorden",
  dontKnowItemText: "Weet niet",
  selectAllItemText: "Selecteer Alles",
  deselectAllItemText: "Alles deselecteren",
  progressText: "Pagina {0} van {1}",
  indexText: "{0} van {1}",
  panelDynamicProgressText: "Record {0} of {1}",
  panelDynamicTabTextFormat: "Paneel {panelIndex}",
  questionsProgressText: "Geantwoord {0}/{1} vragen",
  emptySurvey: "Er is geen zichtbare pagina of vraag in deze vragenlijst",
  completingSurvey: "Bedankt voor het invullen van de vragenlijst",
  completingSurveyBefore: "Onze gegevens tonen aan dat je deze vragenlijst reeds beantwoord hebt.",
  loadingSurvey: "De vragenlijst is aan het laden...",
  placeholder: "Kies...",
  ratingOptionsCaption: "Selecteren...",
  value: "waarde",
  requiredError: "Dit is een vereiste vraag",
  requiredErrorInPanel: "Gelieve ten minste een vraag te beantwoorden.",
  requiredInAllRowsError: "Deze vraag vereist één antwoord per rij",
  eachRowUniqueError: "Elke rij moet een unieke waarde hebben.",
  numericError: "Het antwoord moet een getal zijn",
  minError: "De waarde mag niet lager zijn dan {0}",
  maxError: "De waarde mag niet groter zijn dan {0}",
  textNoDigitsAllow: "Nummers zijn niet toegestaan.",
  textMinLength: "Vul minstens {0} karakters in",
  textMaxLength: "Gelieve minder dan {0} karakters in te vullen.",
  textMinMaxLength: "Gelieve meer dan {0} en minder dan {1} karakters in te vullen.",
  minRowCountError: "Gelieve ten minste {0} rijen in te vullen.",
  minSelectError: "Selecteer minimum {0} antwoorden",
  maxSelectError: "Selecteer niet meer dan {0} antwoorden",
  numericMinMax: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1} en kleiner of gelijk aan {2}",
  numericMin: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1}",
  numericMax: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1}",
  invalidEmail: "Vul een geldig e-mailadres in",
  invalidExpression: "De uitdrukking: {0} moet 'waar' teruggeven.",
  urlRequestError: "De vraag keerde een fout terug '{0}'. {1}",
  urlGetChoicesError: "De vraag gaf een leeg antwoord terug of de 'pad' eigenschap is niet correct",
  exceedMaxSize: "De grootte van het bestand mag niet groter zijn dan {0}",
  noUploadFilesHandler: "Bestanden kunnen niet worden geüpload. Voeg een handler toe voor de gebeurtenis 'onUploadFiles'.",
  otherRequiredError: "Vul het veld 'Anders, nl.' in",
  uploadingFile: "Uw bestand wordt geüpload. Gelieve enkele seconden te wachten en opnieuw te proberen.",
  loadingFile: "Laden...",
  chooseFile: "Kies uw bestand(en)...",
  noFileChosen: "Geen bestand gekozen",
  filePlaceholder: "Sleep het bestand naar hier",
  confirmDelete: "Wilt u deze gegevens verwijderen?",
  keyDuplicationError: "Deze waarde moet uniek zijn.",
  addColumn: "Voeg kolom toe",
  addRow: "Voeg rij toe",
  removeRow: "Verwijder",
  noRowsText: "Er zijn geen rijen.",
  addPanel: "Nieuwe toevoegen",
  removePanel: "Verwijder",
  showDetails: "Toon details",
  hideDetails: "Verberg details",
  choices_Item: "onderwerp",
  matrix_column: "Kolom",
  matrix_row: "Rij",
  multipletext_itemname: "Tekst",
  savingData: "De resultaten worden bewaard op de server...",
  savingDataError: "Er was een probleem en we konden de resultaten niet bewaren.",
  savingDataSuccess: "De resultaten werden succesvol bewaard!",
  savingExceedSize: "Uw antwoord is groter dan 64 kB. Verklein de grootte van uw bestand(en) en probeer het opnieuw of neem contact op met een enquête-eigenaar.",
  saveAgainButton: "Probeer opnieuw",
  timerMin: "minimum",
  timerSec: "sec",
  timerSpentAll: "U heeft {0} gespendeerd op deze pagina en {1} in totaal.",
  timerSpentPage: "U heeft {0} op deze pagina gespendeerd.",
  timerSpentSurvey: "U heeft in totaal {0} gespendeerd.",
  timerLimitAll: "U heeft {0} van {1} op deze pagina gespendeerd en {2} van {3} in totaal.",
  timerLimitPage: "U heeft {0} van {1} gespendeerd op deze pagina.",
  timerLimitSurvey: "U heeft {0} van {1} in het totaal.",
  clearCaption: "Verwijder",
  signaturePlaceHolder: "Hier tekenen",
  signaturePlaceHolderReadOnly: "Geen handtekening",
  chooseFileCaption: "Gekozen bestand",
  takePhotoCaption: "Foto maken",
  photoPlaceholder: "Klik op de onderstaande knop om een foto te maken met de camera.",
  fileOrPhotoPlaceholder: "Sleep en zet neer of selecteer een bestand om te uploaden of maak een foto met de camera.",
  replaceFileCaption: "Bestand vervangen",
  removeFileCaption: "Verwijder dit bestand",
  booleanCheckedLabel: "Ja",
  booleanUncheckedLabel: "Nee",
  confirmRemoveFile: "Weet u zeker dat u deze file wilt verwijderen: {0}?",
  confirmRemoveAllFiles: "Weet u zeker dat u al deze files wilt verwijderen?",
  questionTitlePatternText: "Titel van de vraag",
  modalCancelButtonText: "Annuleren",
  modalApplyButtonText: "Toepassen",
  filterStringPlaceholder: "Typ om te zoeken...",
  emptyMessage: "Geen gegevens om weer te geven",
  noEntriesText: "Er zijn nog geen inzendingen.\nKlik op de onderstaande knop om een nieuw item toe te voegen.",
  noEntriesReadonlyText: "Er zijn geen inzendingen.",
  tabTitlePlaceholder: "Nieuw paneel",
  more: "Meer",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Alle keuzes zijn gerangschikt",
  selectToRankEmptyUnrankedAreaText: "Drag en drop keuzes hier om ze te rangschikken",
  ok: "OK",
  cancel: "Annuleren"
};

setupLocale({ localeCode: "nl", strings: dutchSurveyStrings, nativeName: "nederlands", englishName: "Dutch" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} van {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Paneel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Selecteren..."
// minError: "The value should not be less than {0}" => "De waarde mag niet lager zijn dan {0}"
// maxError: "The value should not be greater than {0}" => "De waarde mag niet groter zijn dan {0}"
// noRowsText: "There are no rows." => "Er zijn geen rijen."
// multipletext_itemname: "text" => "Sms"
// modalCancelButtonText: "Cancel" => "Annuleren"
// modalApplyButtonText: "Apply" => "Toepassen"
// filterStringPlaceholder: "Type to search..." => "Typ om te zoeken..."
// emptyMessage: "No data to display" => "Geen gegevens om weer te geven"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Er zijn nog geen inzendingen.\nKlik op de onderstaande knop om een nieuw item toe te voegen."
// noEntriesReadonlyText: "There are no entries." => "Er zijn geen inzendingen."
// more: "More" => "Meer"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Alle keuzes zijn gerangschikt"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Drag en drop keuzes hier om ze te rangschikken"// takePhotoCaption: "Take Photo" => "Foto maken"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Klik op de onderstaande knop om een foto te maken met de camera."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Sleep en zet neer of selecteer een bestand om te uploaden of maak een foto met de camera."
// replaceFileCaption: "Replace file" => "Bestand vervangen"// eachRowUniqueError: "Each row must have a unique value." => "Elke rij moet een unieke waarde hebben."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Bestanden kunnen niet worden geüpload. Voeg een handler toe voor de gebeurtenis 'onUploadFiles'."
// showDetails: "Show Details" => "Toon details"
// hideDetails: "Hide Details" => "Verberg details"
// ok: "OK" => "OK"
// cancel: "Cancel" => "Annuleren"
// refuseItemText: "Refuse to answer" => "Weiger te antwoorden"
// dontKnowItemText: "Don't know" => "Weet niet"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Uw antwoord is groter dan 64 kB. Verklein de grootte van uw bestand(en) en probeer het opnieuw of neem contact op met een enquête-eigenaar."
// signaturePlaceHolderReadOnly: "No signature" => "Geen handtekening"// tabTitlePlaceholder: "New Panel" => "Nieuw paneel"// deselectAllItemText: "Deselect all" => "Alles deselecteren"
// textNoDigitsAllow: "Numbers are not allowed." => "Nummers zijn niet toegestaan."