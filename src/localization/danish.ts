import { surveyLocalization } from "survey-core";

export var danishSurveyStrings = {
  pagePrevText: "Tilbage",
  pageNextText: "Videre",
  completeText: "Færdig",
  previewText: "Forpremiere",
  editText: "Redigér",
  startSurveyText: "Start",
  otherItemText: "Valgfrit svar...",
  noneItemText: "Ingen",
  selectAllItemText: "Vælg alle",
  progressText: "Side {0} af {1}",
  indexText: "{0} af {1}",
  panelDynamicProgressText: "Optag {0} af {1}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "Besvarede {0} / {1} spørgsmål",
  emptySurvey: "Der er ingen synlige spørgsmål.",
  completingSurvey: "Mange tak for din besvarelse!",
  completingSurveyBefore: "Vores data viser at du allerede har gennemført dette spørgeskema.",
  loadingSurvey: "Spørgeskemaet hentes fra serveren...",
  placeholder: "Vælg...",
  ratingOptionsCaption: "Markere...",
  value: "værdi",
  requiredError: "Besvar venligst spørgsmålet.",
  requiredErrorInPanel: "Besvar venligst mindst ét spørgsmål.",
  requiredInAllRowsError: "Besvar venligst spørgsmål i alle rækker.",
  numericError: "Angiv et tal.",
  minError: "Værdien bør ikke være mindre end {0}",
  maxError: "Værdien bør ikke være større end {0}",
  textMinLength: "Angiv mindst {0} tegn.",
  textMaxLength: "Please enter less than {0} characters.",
  textMinMaxLength: "Angiv mere end {0} og mindre end {1} tegn.",
  minRowCountError: "Udfyld mindst {0} rækker.",
  minSelectError: "Vælg venligst mindst {0} svarmulighed(er).",
  maxSelectError: "Vælg venligst færre {0} svarmuligheder(er).",
  numericMinMax: "'{0}' skal være lig med eller større end {1} og lig med eller mindre end {2}",
  numericMin: "'{0}' skal være lig med eller større end {1}",
  numericMax: "'{0}' skal være lig med eller mindre end {1}",
  invalidEmail: "Angiv venligst en gyldig e-mail adresse.",
  invalidExpression: "Udtrykket: {0} skal returnere 'true'.",
  urlRequestError: "Forespørgslen returnerede fejlen '{0}'. {1}",
  urlGetChoicesError: "Forespørgslen returnerede ingen data eller 'path' parameteren er forkert",
  exceedMaxSize: "Filstørrelsen må ikke overstige {0}.",
  otherRequiredError: "Angiv en værdi for dit valgfrie svar.",
  uploadingFile: "Din fil bliver uploadet. Vent nogle sekunder og prøv eventuelt igen.",
  loadingFile: "Indlæser...",
  chooseFile: "Vælg fil(er)...",
  noFileChosen: "Ingen fil er valgt",
  fileDragAreaPlaceholder: "Træk og slip en fil her, eller klik på knappen nedenfor, og vælg en fil, der skal uploades.",
  confirmDelete: "Vil du fjerne den?",
  keyDuplicationError: "Denne værdi skal være unik.",
  addColumn: "Tilføj kolonne",
  addRow: "Tilføj række",
  removeRow: "Fjern",
  emptyRowsText: "Der er ingen rækker.",
  addPanel: "Tilføj ny",
  removePanel: "Fjern",
  choices_Item: "valg",
  matrix_column: "Kolonne",
  matrix_row: "Række",
  multipletext_itemname: "Tekst",
  savingData: "Resultaterne bliver gemt på serveren...",
  savingDataError: "Der opstod en fejl og vi kunne ikke gemme resultatet.",
  savingDataSuccess: "Resultatet blev gemt!",
  saveAgainButton: "Prøv igen",
  timerMin: "min",
  timerSec: "sek",
  timerSpentAll: "Du har brugt {0} på denne side og {1} i alt.",
  timerSpentPage: "Du har brugt {0} på denne side.",
  timerSpentSurvey: "Du har brugt {0} i alt.",
  timerLimitAll: "Du har brugt {0} af {1} på denne side og {2} af {3} i alt.",
  timerLimitPage: "Du har brugt {0} af {1} på denne side.",
  timerLimitSurvey: "Du har brugt {0} af {1} i alt.",
  clearCaption: "Fjern",
  signaturePlaceHolder: "Tilmeld dig her",
  chooseFileCaption: "Vælg fil",
  takePhotoCaption: "Tag billede",
  cameraPlaceHolder: "Klik på knappen nedenfor for at tage et billede med kameraet.",
  fileCameraDragAreaPlaceHolder: "Træk og slip, eller vælg en fil, der skal uploades, eller tag et billede med kameraet.",
  replaceFileCaption: "Erstat fil",
  removeFileCaption: "Fjern denne fil",
  booleanCheckedLabel: "Ja",
  booleanUncheckedLabel: "Ingen",
  confirmRemoveFile: "Er du sikker på, at du vil fjerne denne fil: {0}?",
  confirmRemoveAllFiles: "Er du sikker på, at du vil fjerne alle filer?",
  questionTitlePatternText: "Spørgsmåls titel",
  modalCancelButtonText: "Aflyse",
  modalApplyButtonText: "Anvende",
  filterStringPlaceholder: "Skriv for at søge...",
  emptyMessage: "Ingen data at vise",
  noEntriesText: "Der er endnu ingen tilmeldinger.\nKlik på knappen nedenfor for at tilføje en ny post.",
  noEntriesReadonlyText: "Der er ingen poster.",
  more: "Mere",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Alle valg er rangeret",
  selectToRankEmptyUnrankedAreaText: "Træk og slip valg her for at rangere dem"
};

surveyLocalization.locales["da"] = danishSurveyStrings;
surveyLocalization.localeNames["da"] = "dansk";

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} af {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Markere..."
// minError: "The value should not be less than {0}" => "Værdien bør ikke være mindre end {0}"
// maxError: "The value should not be greater than {0}" => "Værdien bør ikke være større end {0}"
// fileDragAreaPlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Træk og slip en fil her, eller klik på knappen nedenfor, og vælg en fil, der skal uploades."
// emptyRowsText: "There are no rows." => "Der er ingen rækker."
// multipletext_itemname: "text" => "Tekst"
// signaturePlaceHolder: "Sign here" => "Tilmeld dig her"
// modalCancelButtonText: "Cancel" => "Aflyse"
// modalApplyButtonText: "Apply" => "Anvende"
// filterStringPlaceholder: "Type to search..." => "Skriv for at søge..."
// emptyMessage: "No data to display" => "Ingen data at vise"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Der er endnu ingen tilmeldinger.\nKlik på knappen nedenfor for at tilføje en ny post."
// noEntriesReadonlyText: "There are no entries." => "Der er ingen poster."
// more: "More" => "Mere"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Alle valg er rangeret"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Træk og slip valg her for at rangere dem"// takePhotoCaption: "Take Photo" => "Tag billede"
// cameraPlaceHolder: "Click the button below to take a photo using the camera." => "Klik på knappen nedenfor for at tage et billede med kameraet."
// fileCameraDragAreaPlaceHolder: "Drag and drop or select a file to upload or take a photo using the camera." => "Træk og slip, eller vælg en fil, der skal uploades, eller tag et billede med kameraet."
// replaceFileCaption: "Replace file" => "Erstat fil"