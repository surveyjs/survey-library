import { setupLocale } from "survey-core";

export var dutchSurveyStrings = {
  // "Previous"
  pagePrevText: "Vorige",
  // "Next"
  pageNextText: "Volgende",
  // "Complete"
  completeText: "Verzenden",
  // "Preview"
  previewText: "Voorbeeld",
  // "Edit"
  editText: "Bewerk",
  // "Start"
  startSurveyText: "Start",
  // [Auto-translated] "Please leave a comment"
  commentText: "Laat een reactie achter",
  // "Other (describe)"
  otherItemText: "Anders, nl.",
  // "None"
  noneItemText: "Geen",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Weiger te antwoorden",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Weet niet",
  // "Select All"
  selectAllItemText: "Selecteer Alles",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Alles deselecteren",
  // "Page {0} of {1}"
  progressText: "Pagina {0} van {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} van {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Record {0} of {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Paneel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Geantwoord {0}/{1} vragen",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Er is geen zichtbare pagina of vraag in deze vragenlijst",
  // "Thank you for completing the survey"
  completingSurvey: "Bedankt voor het invullen van de vragenlijst",
  // "You have already completed this survey."
  completingSurveyBefore: "Onze gegevens tonen aan dat je deze vragenlijst reeds beantwoord hebt.",
  // "Loading Survey..."
  loadingSurvey: "De vragenlijst is aan het laden...",
  // "Select..."
  placeholder: "Kies...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Selecteren...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Selecteren...",
  // "value"
  value: "waarde",
  // "Response required."
  requiredError: "Dit is een vereiste vraag",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Gelieve ten minste een vraag te beantwoorden.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Deze vraag vereist één antwoord per rij",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Elke rij moet een unieke waarde hebben.",
  // "The value should be numeric."
  numericError: "Het antwoord moet een getal zijn",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "De waarde mag niet lager zijn dan {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Voer een waarde in die overeenkomt met de stapgrootte van {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "De waarde mag niet groter zijn dan {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Nummers zijn niet toegestaan.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Vul minstens {0} karakters in",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Gelieve minder dan {0} karakters in te vullen.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Gelieve meer dan {0} en minder dan {1} karakters in te vullen.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Gelieve ten minste {0} rijen in te vullen.",
  // "Please select at least {0} option(s)."
  minSelectError: "Selecteer minimum {0} antwoorden",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Selecteer niet meer dan {0} antwoorden",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1} en kleiner of gelijk aan {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Vul een geldig e-mailadres in",
  // "The expression: {0} should return 'true'."
  invalidExpression: "De uitdrukking: {0} moet 'waar' teruggeven.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "De vraag keerde een fout terug '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "De vraag gaf een leeg antwoord terug of de 'pad' eigenschap is niet correct",
  // "The file size should not exceed {0}."
  exceedMaxSize: "De grootte van het bestand mag niet groter zijn dan {0}",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Het maximale aantal bestanden dat je kunt uploaden is {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Bestanden kunnen niet worden geüpload. Voeg een handler toe voor de gebeurtenis 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Vul het veld 'Anders, nl.' in",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Uw bestand wordt geüpload. Gelieve enkele seconden te wachten en opnieuw te proberen.",
  // "Loading..."
  loadingFile: "Laden...",
  // "Choose file(s)..."
  chooseFile: "Kies uw bestand(en)...",
  // "No file selected"
  noFileChosen: "Geen bestand gekozen",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Sleep het bestand naar hier",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Wilt u deze gegevens verwijderen?",
  // "This value should be unique."
  keyDuplicationError: "Deze waarde moet uniek zijn.",
  // "Add Column"
  addColumn: "Voeg kolom toe",
  // "Add Row"
  addRow: "Voeg rij toe",
  // "Remove"
  removeRow: "Verwijder",
  // [Auto-translated] "There are no rows."
  noRowsText: "Er zijn geen rijen.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Rij {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Nieuwe toevoegen",
  // "Remove"
  removePanel: "Verwijder",
  // [Auto-translated] "Show Details"
  showDetails: "Toon details",
  // [Auto-translated] "Hide Details"
  hideDetails: "Verberg details",
  // "item"
  choices_Item: "onderwerp",
  // [Auto-translated] "Choice option"
  choices_Choice: "Keuze optie",
  // "Column"
  matrix_column: "Kolom",
  // "Row"
  matrix_row: "Rij",
  // [Auto-translated] "text"
  multipletext_itemname: "Tekst",
  // "The results are being saved on the server..."
  savingData: "De resultaten worden bewaard op de server...",
  // "An error occurred and we could not save the results."
  savingDataError: "Er was een probleem en we konden de resultaten niet bewaren.",
  // "The results were saved successfully!"
  savingDataSuccess: "De resultaten werden succesvol bewaard!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Uw antwoord is groter dan 64 kB. Verklein de grootte van uw bestanden en probeer het opnieuw of neem contact op met de eigenaar van de enquête.",
  // "Try again"
  saveAgainButton: "Probeer opnieuw",
  // "min"
  timerMin: "minimum",
  // "sec"
  timerSec: "sec",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "U heeft {0} gespendeerd op deze pagina en {1} in totaal.",
  // "You have spent {0} on this page."
  timerSpentPage: "U heeft {0} op deze pagina gespendeerd.",
  // "You have spent {0} in total."
  timerSpentSurvey: "U heeft in totaal {0} gespendeerd.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "U heeft {0} van {1} op deze pagina gespendeerd en {2} van {3} in totaal.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "U heeft {0} van {1} gespendeerd op deze pagina.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "U heeft {0} van {1} in het totaal.",
  // "Clear"
  clearCaption: "Verwijder",
  // [Auto-translated] "Select"
  selectCaption: "Selecteren",
  // "Sign here"
  signaturePlaceHolder: "Hier tekenen",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Geen handtekening",
  // "Select File"
  chooseFileCaption: "Gekozen bestand",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Foto maken",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Klik op de onderstaande knop om een foto te maken met de camera.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Sleep en zet neer of selecteer een bestand om te uploaden of maak een foto met de camera.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Bestand vervangen",
  // "Remove this file"
  removeFileCaption: "Verwijder dit bestand",
  // "Yes"
  booleanCheckedLabel: "Ja",
  // "No"
  booleanUncheckedLabel: "Nee",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Weet u zeker dat u deze file wilt verwijderen: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Weet u zeker dat u al deze files wilt verwijderen?",
  // "Question Title"
  questionTitlePatternText: "Titel van de vraag",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Annuleren",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Toepassen",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Typ om te zoeken...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Geen gegevens om weer te geven",
  // [Auto-translated] "Loading..."
  loadingPage: "Laden...",
  // [Auto-translated] "Loading..."
  loadingData: "Laden...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Nog geen inschrijvingen.\nKlik op de onderstaande knop om een nieuw item toe te voegen.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Geen inzendingen",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nieuw paneel",
  // [Auto-translated] "More"
  more: "Meer",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Alle keuzes zijn geselecteerd voor rangschikking",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Sleep keuzes hierheen om ze te rangschikken",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Annuleren",
  // "Create \"{0}\" item..."
  createCustomItem: "Maak een \"{0}\" item...",
  // [Auto-translated] "Table of contents"
  toc: "Inhoudsopgave",
  // [Auto-translated] "Progress bar"
  progressbar: "Voortgangsbalk"
};

setupLocale({ localeCode: "nl", strings: dutchSurveyStrings, nativeName: "nederlands", englishName: "Dutch" });