import { setupLocale } from "survey-core";

export var swedishSurveyStrings = {
  // "Previous"
  pagePrevText: "Föregående",
  // "Next"
  pageNextText: "Nästa",
  // "Complete"
  completeText: "Slutför",
  // "Preview"
  previewText: "Förhandsvisning",
  // "Edit"
  editText: "Redigera",
  // "Start"
  startSurveyText: "Börja",
  // [Auto-translated] "Please leave a comment"
  commentText: "Lämna gärna en kommentar",
  // "Other (describe)"
  otherItemText: "Annat (beskriv)",
  // "None"
  noneItemText: "Ingen",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Vägra svara",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Vet inte",
  // "Select All"
  selectAllItemText: "Välj alla",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Avmarkera alla",
  // "Page {0} of {1}"
  progressText: "Sida {0} av {1}",
  // "{0} of {1}"
  indexText: "{0} av {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "{0} av {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "{0} / {1} frågor besvarade",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Det finns ingen synlig sida eller fråga i enkäten.",
  // "Thank you for completing the survey"
  completingSurvey: "Tack för att du genomfört enkäten!!",
  // "You have already completed this survey."
  completingSurveyBefore: "Våra register visar att du redan har slutfört denna undersökning.",
  // "Loading Survey..."
  loadingSurvey: "Enkäten laddas...",
  // "Select..."
  placeholder: "Välj...",
  // "Select..."
  ratingOptionsCaption: "Tryck här för att betygsätta...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Utvald...",
  // "value"
  value: "värde",
  // "Response required."
  requiredError: "Frågan är obligatorisk.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Vänligen svara på minst en fråga.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Var vänlig besvara frågorna på alla rader.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Varje rad måste ha ett unikt värde.",
  // "The value should be numeric."
  numericError: "Värdet ska vara numeriskt.",
  // "The value should not be less than {0}"
  minError: "Värdet får inte vara mindre än {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Ange ett värde som matchar stegstorleken för {0}.",
  // "The value should not be greater than {0}"
  maxError: "Värdet får inte vara större än {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Nummer är inte tillåtna.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Ange minst {0} tecken.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Ange färre än {0} tecken.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Ange mer än {0} och färre än {1} tecken.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Var vänlig fyll i minst {0} rader.",
  // "Please select at least {0} option(s)."
  minSelectError: "Var vänlig välj åtminstone {0} varianter.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Var vänlig välj inte fler än {0} varianter.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' ska vara lika med eller mer än {1} samt lika med eller mindre än {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' ska vara lika med eller mer än {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' ska vara lika med eller mindre än {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Var vänlig ange en korrekt e-postadress.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Uttrycket: {0} ska returnera 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Förfrågan returnerade felet '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Antingen returnerade förfrågan ingen data eller så är egenskapen 'path' inte korrekt",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Filstorleken får ej överstiga {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Filer kan inte laddas upp. Lägg till en hanterare för händelsen 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Var vänlig ange det andra värdet.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Din fil laddas upp. Var vänlig vänta några sekunder och försök sedan igen.",
  // "Loading..."
  loadingFile: "Laddar...",
  // "Choose file(s)..."
  chooseFile: "Välj fil(er) ...",
  // "No file selected"
  noFileChosen: "Ingen fil vald",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Dra och släpp en fil här eller klicka på knappen nedan för att välja en fil att ladda upp.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Vill du radera posten?",
  // "This value should be unique."
  keyDuplicationError: "Detta värde ska vara unikt.",
  // "Add Column"
  addColumn: "Lägg till kolumn",
  // "Add Row"
  addRow: "Lägg till rad",
  // "Remove"
  removeRow: "Ta bort",
  // [Auto-translated] "There are no rows."
  noRowsText: "Det finns inga rader.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Rad {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Lägg till ny",
  // "Remove"
  removePanel: "Ta bort",
  // [Auto-translated] "Show Details"
  showDetails: "Detaljer",
  // [Auto-translated] "Hide Details"
  hideDetails: "Göm detaljer",
  // "item"
  choices_Item: "Artikel",
  // [Auto-translated] "Choice option"
  choices_Choice: "Alternativ för valmöjligheter",
  // "Column"
  matrix_column: "Kolumn",
  // "Row"
  matrix_row: "Rad",
  // "text"
  multipletext_itemname: "text",
  // "The results are being saved on the server..."
  savingData: "Resultaten sparas på servern ...",
  // "An error occurred and we could not save the results."
  savingDataError: "Ett fel inträffade och vi kunde inte spara resultaten.",
  // "The results were saved successfully!"
  savingDataSuccess: "Resultaten lyckades sparas!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Ditt svar överstiger 64 kB. Minska storleken på dina filer och försök igen eller kontakta undersökningens ägare.",
  // "Try again"
  saveAgainButton: "Försök igen",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Du har spenderat {0} på den här sidan och {1} totalt.",
  // "You have spent {0} on this page."
  timerSpentPage: "Du har spenderat {0} på den här sidan.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Du har spenderat {0} totalt.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Du har spenderat {0} av {1} på den här sidan och {2} av {3} totalt.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Du har spenderat {0} av {1} på den här sidan.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Du har spenderat {0} av {1} totalt.",
  // "Clear"
  clearCaption: "Klar",
  // [Auto-translated] "Select"
  selectCaption: "Utvald",
  // "Sign here"
  signaturePlaceHolder: "Signera här",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Ingen signatur",
  // "Select File"
  chooseFileCaption: "Välj fil",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Ta foto",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Klicka på knappen nedan för att ta ett foto med kameran.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Dra och släpp eller välj en fil att ladda upp eller ta ett foto med kameran.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Ersätt fil",
  // "Remove this file"
  removeFileCaption: "Ta bort den här filen",
  // "Yes"
  booleanCheckedLabel: "Ja",
  // "No"
  booleanUncheckedLabel: "Nej",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Är du säker på att du vill ta bort den här filen: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Är du säker på att du vill ta bort alla filer?",
  // "Question Title"
  questionTitlePatternText: "Frågetitel",
  // "Cancel"
  modalCancelButtonText: "Avbryt",
  // "Apply"
  modalApplyButtonText: "Spara",
  // "Type to search..."
  filterStringPlaceholder: "Skriv för att söka...",
  // "No data to display"
  emptyMessage: "Ingen data finns",
  // [Auto-translated] "Loading..."
  loadingPage: "Lastning...",
  // [Auto-translated] "Loading..."
  loadingData: "Lastning...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Det finns inga värden än.\nKlicka på knappen nedan för att lägga till nytt värde.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Inga anmälningar",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Ny panel",
  // "More"
  more: "Mer",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OKEJ",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Alla val väljs ut för rankning",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Dra valen hit för att rangordna dem",
  // [Auto-translated] "OK"
  ok: "OKEJ",
  // [Auto-translated] "Cancel"
  cancel: "Annullera",
  // "Create \"{0}\" item..."
  createCustomItem: "Skapa \"{0}\"-objekt...",
  // [Auto-translated] "Table of contents"
  toc: "Innehållsförteckning",
  // [Auto-translated] "Progress bar"
  progressbar: "Förloppsindikator"
};

setupLocale({ localeCode: "sv", strings: swedishSurveyStrings, nativeName: "svenska", englishName: "Swedish" });