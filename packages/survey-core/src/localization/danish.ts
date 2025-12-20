import { setupLocale } from "survey-core";

export var danishSurveyStrings = {
  // "Previous"
  pagePrevText: "Tilbage",
  // "Next"
  pageNextText: "Videre",
  // "Complete"
  completeText: "Færdig",
  // "Preview"
  previewText: "Forpremiere",
  // "Edit"
  editText: "Redigér",
  // "Start"
  startSurveyText: "Start",
  // [Auto-translated] "Please leave a comment"
  commentText: "Efterlad venligst en kommentar",
  // "Other (describe)"
  otherItemText: "Valgfrit svar...",
  // "None"
  noneItemText: "Ingen",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Nægt at svare",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Ved ikke",
  // "Select All"
  selectAllItemText: "Vælg alle",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Fravælg alle",
  // "Page {0} of {1}"
  progressText: "Side {0} af {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} af {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Optag {0} af {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Besvarede {0} / {1} spørgsmål",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Der er ingen synlige spørgsmål.",
  // "Thank you for completing the survey"
  completingSurvey: "Mange tak for din besvarelse!",
  // "You have already completed this survey."
  completingSurveyBefore: "Vores data viser at du allerede har gennemført dette spørgeskema.",
  // "Loading Survey..."
  loadingSurvey: "Spørgeskemaet hentes fra serveren...",
  // "Select..."
  placeholder: "Vælg...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Markere...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Markere...",
  // "value"
  value: "værdi",
  // "Response required."
  requiredError: "Besvar venligst spørgsmålet.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Besvar venligst mindst ét spørgsmål.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Besvar venligst spørgsmål i alle rækker.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Hver række skal have en entydig værdi.",
  // "The value should be numeric."
  numericError: "Angiv et tal.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Værdien bør ikke være mindre end {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Indtast en værdi, der matcher trinstørrelsen på {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Værdien bør ikke være større end {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Numre er ikke tilladt.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Angiv mindst {0} tegn.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Please enter less than {0} characters.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Angiv mere end {0} og mindre end {1} tegn.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Udfyld mindst {0} rækker.",
  // "Please select at least {0} option(s)."
  minSelectError: "Vælg venligst mindst {0} svarmulighed(er).",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Vælg venligst færre {0} svarmuligheder(er).",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' skal være lig med eller større end {1} og lig med eller mindre end {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' skal være lig med eller større end {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' skal være lig med eller mindre end {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Angiv venligst en gyldig e-mail adresse.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Udtrykket: {0} skal returnere 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Forespørgslen returnerede fejlen '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Forespørgslen returnerede ingen data eller 'path' parameteren er forkert",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Filstørrelsen må ikke overstige {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Det maksimale antal filer, du kan uploade, er {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Filer kan ikke uploades. Tilføj en handler for hændelsen 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Angiv en værdi for dit valgfrie svar.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Din fil bliver uploadet. Vent nogle sekunder og prøv eventuelt igen.",
  // "Loading..."
  loadingFile: "Indlæser...",
  // "Choose file(s)..."
  chooseFile: "Vælg fil(er)...",
  // "No file selected"
  noFileChosen: "Ingen fil er valgt",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Træk og slip en fil her, eller klik på knappen nedenfor for at vælge en fil, der skal uploades.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Vil du fjerne den?",
  // "This value should be unique."
  keyDuplicationError: "Denne værdi skal være unik.",
  // "Add Column"
  addColumn: "Tilføj kolonne",
  // "Add Row"
  addRow: "Tilføj række",
  // "Remove"
  removeRow: "Fjern",
  // [Auto-translated] "There are no rows."
  noRowsText: "Der er ingen rækker.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Række {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Tilføj ny",
  // "Remove"
  removePanel: "Fjern",
  // [Auto-translated] "Show Details"
  showDetails: "Vis detaljer",
  // [Auto-translated] "Hide Details"
  hideDetails: "Skjul detaljer",
  // "item"
  choices_Item: "valg",
  // [Auto-translated] "Choice option"
  choices_Choice: "Valgmulighed",
  // "Column"
  matrix_column: "Kolonne",
  // "Row"
  matrix_row: "Række",
  // [Auto-translated] "text"
  multipletext_itemname: "Tekst",
  // "The results are being saved on the server..."
  savingData: "Resultaterne bliver gemt på serveren...",
  // "An error occurred and we could not save the results."
  savingDataError: "Der opstod en fejl og vi kunne ikke gemme resultatet.",
  // "The results were saved successfully!"
  savingDataSuccess: "Resultatet blev gemt!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Dit svar overstiger 64 KB. Reducer størrelsen på dine filer, og prøv igen, eller kontakt ejeren af undersøgelsen.",
  // "Try again"
  saveAgainButton: "Prøv igen",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Du har brugt {0} på denne side og {1} i alt.",
  // "You have spent {0} on this page."
  timerSpentPage: "Du har brugt {0} på denne side.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Du har brugt {0} i alt.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Du har brugt {0} af {1} på denne side og {2} af {3} i alt.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Du har brugt {0} af {1} på denne side.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Du har brugt {0} af {1} i alt.",
  // "Clear"
  clearCaption: "Fjern",
  // [Auto-translated] "Select"
  selectCaption: "Markere",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Tilmeld dig her",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Ingen underskrift",
  // "Select File"
  chooseFileCaption: "Vælg fil",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Tag billede",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Klik på knappen nedenfor for at tage et billede med kameraet.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Træk og slip, eller vælg en fil, der skal uploades, eller tag et billede med kameraet.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Erstat fil",
  // "Remove this file"
  removeFileCaption: "Fjern denne fil",
  // "Yes"
  booleanCheckedLabel: "Ja",
  // "No"
  booleanUncheckedLabel: "Ingen",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Er du sikker på, at du vil fjerne denne fil: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Er du sikker på, at du vil fjerne alle filer?",
  // "Question Title"
  questionTitlePatternText: "Spørgsmåls titel",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Aflyse",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Anvende",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Skriv for at søge...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Ingen data at vise",
  // [Auto-translated] "Loading..."
  loadingPage: "Pålæsning...",
  // [Auto-translated] "Loading..."
  loadingData: "Pålæsning...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Ingen tilmeldinger endnu.\nKlik på knappen nedenfor for at tilføje en ny post.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Ingen poster",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nyt panel",
  // [Auto-translated] "More"
  more: "Mere",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Alle valg er udvalgt til rangering",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Træk valgmuligheder her for at rangere dem",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Aflyse",
  // "Create \"{0}\" item..."
  createCustomItem: "Opret \"{0}\" element...",
  // [Auto-translated] "Table of contents"
  toc: "Indholdsfortegnelse",
  // [Auto-translated] "Progress bar"
  progressbar: "Statuslinje"
};

setupLocale({ localeCode: "da", strings: danishSurveyStrings, nativeName: "dansk", englishName: "Danish" });