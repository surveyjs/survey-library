import { setupLocale } from "survey-core";

export var norwegianSurveyStrings = {
  // "Previous"
  pagePrevText: "Forrige",
  // "Next"
  pageNextText: "Neste",
  // "Complete"
  completeText: "Fullfør",
  // "Preview"
  previewText: "Forhåndsvisning",
  // "Edit"
  editText: "Redigere",
  // "Start"
  startSurveyText: "Start",
  // [Auto-translated] "Please leave a comment"
  commentText: "Legg igjen en kommentar",
  // "Other (describe)"
  otherItemText: "Annet (beskriv)",
  // "None"
  noneItemText: "Ingen",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Nekter å svare",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Vet ikke",
  // "Select All"
  selectAllItemText: "Velg alle",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Fjern merket for alle",
  // "Page {0} of {1}"
  progressText: "Side {0} av {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} av {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Ta opp {0} av {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Besvarte {0} / {1} spørsmål",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Det er ingen synlig side eller spørsmål i undersøkelsen.",
  // "Thank you for completing the survey"
  completingSurvey: "Takk for at du fullførte undersøkelsen!",
  // "You have already completed this survey."
  completingSurveyBefore: "Våre data viser at du allerede har gjennomført denne undersøkelsen.",
  // "Loading Survey..."
  loadingSurvey: "Undersøkelsen laster...",
  // "Select..."
  placeholder: "Velg...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Velge...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Velge...",
  // "value"
  value: "verdi",
  // "Response required."
  requiredError: "Vennligst svar på spørsmålet.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Vennligst svar på minst ett spørsmål.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Vennligst svar på spørsmål i alle rader.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Hver rad må ha en unik verdi.",
  // "The value should be numeric."
  numericError: "Verdien skal være numerisk.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Verdien bør ikke være mindre enn {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Angi en verdi som samsvarer med trinnstørrelsen på {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Verdien bør ikke være større enn {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Tall er ikke tillatt.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Vennligst skriv inn minst {0} tegn.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Vennligst skriv inn mindre enn {0} tegn.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Vennligst skriv inn mer enn {0} og mindre enn {1} tegn.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Vennligst fyll inn minst {0} rader.",
  // "Please select at least {0} option(s)."
  minSelectError: "Vennligst velg minst {0} varianter.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Vennligst ikke velg mer enn {0} varianter.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' bør være lik eller mer enn {1} og lik eller mindre enn {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' bør være lik eller mer enn {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' bør være lik eller mindre enn {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Vennligst skriv inn en gyldig e-post adresse.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Uttrykket: {0} skal returnere 'sant'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Forespørselen returnerte feilen '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Forespørselen returnerte tomme data, eller 'sti' -egenskapen er feil",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Filstørrelsen bør ikke overstige {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Maksimalt antall filer du kan laste opp er {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Filer kan ikke lastes opp. Legg til et behandlingsprogram for onUploadFiles-hendelsen.",
  // "Response required: enter another value."
  otherRequiredError: "Vennligst skriv inn den andre verdien.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Filen din lastes opp. Vennligst vent noen sekunder og prøv igjen.",
  // "Loading..."
  loadingFile: "Laster inn ...",
  // "Choose file(s)..."
  chooseFile: "Velg fil (er) ...",
  // "No file selected"
  noFileChosen: "Ingen fil valgt",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Dra og slipp en fil her eller klikk på knappen nedenfor for å velge en fil du vil laste opp.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Ønsker du å slette posten?",
  // "This value should be unique."
  keyDuplicationError: "Denne verdien skal være unik.",
  // "Add Column"
  addColumn: "Legg til kolonne",
  // "Add Row"
  addRow: "Legg til rad",
  // "Remove"
  removeRow: "Fjern",
  // [Auto-translated] "There are no rows."
  noRowsText: "Det er ingen rader.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Rad {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Legg til ny",
  // "Remove"
  removePanel: "Fjerne",
  // [Auto-translated] "Show Details"
  showDetails: "Vis detaljer",
  // [Auto-translated] "Hide Details"
  hideDetails: "Skjul detaljer",
  // "item"
  choices_Item: "element",
  // [Auto-translated] "Choice option"
  choices_Choice: "Valg alternativ",
  // "Column"
  matrix_column: "Kolonne",
  // "Row"
  matrix_row: "Rad",
  // [Auto-translated] "text"
  multipletext_itemname: "Tekst",
  // "The results are being saved on the server..."
  savingData: "Resultatene lagres på serveren ...",
  // "An error occurred and we could not save the results."
  savingDataError: "Det oppsto en feil, og vi kunne ikke lagre resultatene.",
  // "The results were saved successfully!"
  savingDataSuccess: "Resultatene ble lagret!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Svaret ditt overstiger 64 kB. Reduser størrelsen på filen(e) og prøv på nytt eller kontakt eieren av undersøkelsen.",
  // "Try again"
  saveAgainButton: "Prøv igjen",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Du har tilbrakt {0} på denne siden og {1} totalt.",
  // "You have spent {0} on this page."
  timerSpentPage: "Du har tilbrakt {0} på denne siden.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Du har tilbrakt {0} totalt.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Du har tilbrakt {0} av {1} på denne siden og totalt {2} av {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Du har tilbrakt {0} av {1} på denne siden.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Du har tilbrakt {0} av {1} totalt.",
  // "Clear"
  clearCaption: "Klar",
  // [Auto-translated] "Select"
  selectCaption: "Velge",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Logg inn her",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Ingen signatur",
  // "Select File"
  chooseFileCaption: "Velg Fil",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Ta bilde",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Klikk på knappen nedenfor for å ta et bilde med kameraet.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Dra og slipp eller velg en fil for å laste opp eller ta et bilde med kameraet.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Erstatt fil",
  // "Remove this file"
  removeFileCaption: "Fjern denne filen",
  // "Yes"
  booleanCheckedLabel: "Ja",
  // "No"
  booleanUncheckedLabel: "Nei",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Er du sikker på at du vil fjerne denne filen: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Er du sikker på at du vil fjerne alle filene?",
  // "Question Title"
  questionTitlePatternText: "Spørsmålstittel",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Annullere",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Bruke",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Skriv for å søke ...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Ingen data å vise",
  // [Auto-translated] "Loading..."
  loadingPage: "Lasting...",
  // [Auto-translated] "Loading..."
  loadingData: "Lasting...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Ingen oppføringer ennå.\nKlikk på knappen nedenfor for å legge til en ny oppføring.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Ingen oppføringer",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nytt panel",
  // [Auto-translated] "More"
  more: "Mer",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Alle valg er valgt for rangering",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Dra valg hit for å rangere dem",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Annullere",
  // "Create \"{0}\" item..."
  createCustomItem: "Lag \"{0}\" element...",
  // [Auto-translated] "Table of contents"
  toc: "Innhold",
  // [Auto-translated] "Progress bar"
  progressbar: "Fremdriftsindikator"
};

setupLocale({ localeCode: "no", strings: norwegianSurveyStrings, nativeName: "norsk", englishName: "Norwegian" });