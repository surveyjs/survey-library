import { setupLocale } from "survey-core";

export var slovenianStrings = {
  // "Previous"
  pagePrevText: "Prejšnja",
  // "Next"
  pageNextText: "Naslednja",
  // "Complete"
  completeText: "Zaključi",
  // "Preview"
  previewText: "Predogled",
  // "Edit"
  editText: "Uredi",
  // "Start"
  startSurveyText: "Začni",
  // [Auto-translated] "Please leave a comment"
  commentText: "Prosimo, pustite komentar",
  // "Other (describe)"
  otherItemText: "Drugo (opišite)",
  // "None"
  noneItemText: "Noben",
  // "Refuse to answer"
  refuseItemText: "Zavrni odgovor",
  // "Don't know"
  dontKnowItemText: "Ne vem",
  // "Select All"
  selectAllItemText: "Izberi vse",
  // "Deselect all"
  deselectAllItemText: "Odstrani izbiro",
  // "Page {0} of {1}"
  progressText: "Stran {0} od {1}",
  // "{0} of {1}"
  indexText: "{0} od {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "{0} od {1}",
  // "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Plošča {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Odgovorjeno {0}/{1} vprašanj",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Anketa ne vsebuje vidnih elementov.",
  // "Thank you for completing the survey"
  completingSurvey: "Hvala, ker ste izpolnili anketo",
  // "You have already completed this survey."
  completingSurveyBefore: "To anketo ste že izpolnili.",
  // "Loading Survey..."
  loadingSurvey: "Nalaganje ankete...",
  // "Select..."
  placeholder: "Izberite...",
  // "Select..."
  ratingOptionsCaption: "Izberite...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Izbrati...",
  // "value"
  value: "vrednost",
  // "Response required."
  requiredError: "Odgovor je obvezen.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Obvezen odgovor: odgovorite na vsaj eno vprašanje.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Obvezen odgovor: odgovorite na vsa vprašanja v vrsticah.",
  // "Each row must have a unique value."
  eachRowUniqueError: "Vsaka vrstica mora imeti edinstveno vrednost.",
  // "The value should be numeric."
  numericError: "Vrednost mora biti številčna.",
  // "The value should not be less than {0}"
  minError: "Vrednost ne sme biti manjša od {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Vnesite vrednost, ki se ujema z velikostjo koraka {0}.",
  // "The value should not be greater than {0}"
  maxError: "Vrednost ne sme biti večja od {0}",
  // "Numbers are not allowed."
  textNoDigitsAllow: "Številke niso dovoljene.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Vnesite vsaj {0} znakov.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Vnesite največ {0} znakov.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Vnesite vsaj {0} in največ {1} znakov.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Izpolnite vsaj {0} vrstic.",
  // "Please select at least {0} option(s)."
  minSelectError: "Izberite vsaj {0} možnosti.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Izberite največ {0} možnosti.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' mora biti vsaj {1} in največ {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' mora biti vsaj {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' mora biti največ {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Vnesite veljaven e-poštni naslov.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Izraz: {0} mora vrniti 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Zahteva je vrnila napako '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Zahteva je vrnila prazne podatke ali lastnost 'path' ni pravilna.",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Velikost datoteke ne sme presegati {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Datotek ni mogoče naložiti. Dodajte obravnavo za dogodek 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Obvezen odgovor: vnesite drugo vrednost.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Vaša datoteka se nalaga. Počakajte nekaj sekund in poskusite znova.",
  // "Loading..."
  loadingFile: "Nalaganje...",
  // "Choose file(s)..."
  chooseFile: "Izberite datoteko...",
  // "No file selected"
  noFileChosen: "Ni izbrane datoteke",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Povlecite in spustite datoteko tukaj ali kliknite spodnji gumb za izbiro datoteke za nalaganje.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Ste prepričani, da želite izbrisati ta zapis?",
  // "This value should be unique."
  keyDuplicationError: "Ta vrednost mora biti edinstvena.",
  // "Add Column"
  addColumn: "Dodaj stolpec",
  // "Add Row"
  addRow: "Dodaj vrstico",
  // "Remove"
  removeRow: "Odstrani",
  // "There are no rows."
  noRowsText: "Ni vrstic.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Vrstica {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Dodaj novo",
  // "Remove"
  removePanel: "Odstrani",
  // "Show Details"
  showDetails: "Prikaži podrobnosti",
  // "Hide Details"
  hideDetails: "Skrij podrobnosti",
  // "item"
  choices_Item: "postavka",
  // "Choice option"
  choices_Choice: "Možnost izbire",
  // "Column"
  matrix_column: "Stolpec",
  // "Row"
  matrix_row: "Vrstica",
  // "text"
  multipletext_itemname: "besedilo",
  // "The results are being saved on the server..."
  savingData: "Rezultati se shranjujejo na strežnik...",
  // "An error occurred and we could not save the results."
  savingDataError: "Prišlo je do napake in rezultatov ni bilo mogoče shraniti.",
  // "The results were saved successfully!"
  savingDataSuccess: "Rezultati so bili uspešno shranjeni!",
  // "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Vaš odgovor presega 64 KB. Zmanjšajte velikost datotek in poskusite znova ali se obrnite na lastnika ankete.",
  // "Try again"
  saveAgainButton: "Poskusite znova",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Na tej strani ste porabili {0}, skupno {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Na tej strani ste porabili {0}.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Skupaj ste porabili {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Na tej strani ste porabili {0} od {1} in skupno {2} od {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Na tej strani ste porabili {0} od {1}.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Skupaj ste porabili {0} od {1}.",
  // "Clear"
  clearCaption: "Počisti",
  // [Auto-translated] "Select"
  selectCaption: "Izbrati",
  // "Sign here"
  signaturePlaceHolder: "Podpišite se tukaj",
  // "No signature"
  signaturePlaceHolderReadOnly: "Ni podpisa",
  // "Select File"
  chooseFileCaption: "Izberi datoteko",
  // "Take Photo"
  takePhotoCaption: "Slikaj",
  // "Click the button below to take a photo using the camera."
  photoPlaceholder: "Kliknite spodnji gumb, da posnamete fotografijo s kamero.",
  // "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Povlecite in spustite datoteko za nalaganje ali posnemite fotografijo s kamero.",
  // "Replace file"
  replaceFileCaption: "Zamenjaj datoteko",
  // "Remove this file"
  removeFileCaption: "Odstrani to datoteko",
  // "Yes"
  booleanCheckedLabel: "Da",
  // "No"
  booleanUncheckedLabel: "Ne",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Ste prepričani, da želite odstraniti to datoteko: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Ste prepričani, da želite odstraniti vse datoteke?",
  // "Question Title"
  questionTitlePatternText: "Naslov vprašanja",
  // "Cancel"
  modalCancelButtonText: "Prekliči",
  // "Apply"
  modalApplyButtonText: "Uporabi",
  // "Type to search..."
  filterStringPlaceholder: "Vnesite za iskanje...",
  // "No data to display"
  emptyMessage: "Ni podatkov za prikaz",
  // [Auto-translated] "Loading..."
  loadingPage: "Nakladanje...",
  // [Auto-translated] "Loading..."
  loadingData: "Nakladanje...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Ni še vnosov.\nKliknite spodnji gumb za dodajanje novega vnosa.",
  // "No entries"
  noEntriesReadonlyText: "Ni vnosov",
  // "New Panel"
  tabTitlePlaceholder: "Nova plošča",
  // "More"
  more: "Več",
  // "OK"
  tagboxDoneButtonCaption: "V redu",
  // "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Vse možnosti so izbrane za razvrščanje",
  // "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Povlecite izbire sem, da jih razvrstite",
  // "OK"
  ok: "V redu",
  // "Cancel"
  cancel: "Prekliči",
  // "Create \"{0}\" item..."
  createCustomItem: "Ustvari element »{0}« ...",
  // [Auto-translated] "Table of contents"
  toc: "Kazalo vsebine",
  // [Auto-translated] "Progress bar"
  progressbar: "Vrstica napredovanja"
};
setupLocale({ localeCode: "sl", strings: slovenianStrings, nativeName: "slovenščina", englishName: "Slovenian" });