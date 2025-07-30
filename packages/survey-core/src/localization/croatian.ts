import { setupLocale } from "survey-core";

export var croatianStrings = {
  // "Previous"
  pagePrevText: "Prethodni",
  // "Next"
  pageNextText: "Sljedeći",
  // "Complete"
  completeText: "Kompletan",
  // "Preview"
  previewText: "Pregled",
  // "Edit"
  editText: "Uređivanje",
  // "Start"
  startSurveyText: "Početak",
  // [Auto-translated] "Please leave a comment"
  commentText: "Molimo ostavite komentar",
  // "Other (describe)"
  otherItemText: "Ostali (opis)",
  // "None"
  noneItemText: "Nitko",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Odbijte odgovoriti",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Ne znam",
  // "Select All"
  selectAllItemText: "Select All",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Poništite odabir svega",
  // "Page {0} of {1}"
  progressText: "Stranica {0} od {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Zapisa {0} od {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Ploča {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Odgovorio na {0}/{1} pitanja",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "U anketi nema vidljive stranice ili pitanja.",
  // "Thank you for completing the survey"
  completingSurvey: "Hvala vam što ste završili anketu!",
  // "You have already completed this survey."
  completingSurveyBefore: "Naši zapisi pokazuju da ste već završili ovu anketu.",
  // "Loading Survey..."
  loadingSurvey: "Anketa o učitavanje...",
  // "Select..."
  placeholder: "Odaberite...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Odabirati...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Odabirati...",
  // "value"
  value: "vrijednost",
  // "Response required."
  requiredError: "Molim vas odgovorite na pitanje.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Molim vas odgovorite na barem jedno pitanje.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Odgovorite na pitanja u svim redovima.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Svaki redak mora imati jedinstvenu vrijednost.",
  // "The value should be numeric."
  numericError: "Vrijednost bi trebala biti brojčana.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Vrijednost ne smije biti manja od {0}",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Vrijednost ne smije biti veća od {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Brojevi nisu dopušteni.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Unesite najmanje {0} znak(ova).",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Unesite manje od {0} znak(ova).",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Unesite više od {0} i manje od {1} znakova.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Molimo ispunite najmanje {0} redaka.",
  // "Please select at least {0} option(s)."
  minSelectError: "Odaberite barem {0} varijante.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Odaberite ne više od {0} varijanti.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}'bi trebao biti jednak ili više od {1} i jednak ili manji od {2}.",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' bi trebao biti jednak ili više od {1}.",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' bi trebao biti jednak ili manji od {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Unesite valjanu e-mail adresu.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Izraz: {0} treba vratiti 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Zahtjev vratio pogrešku '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Zahtjev je vratio prazne podatke ili je 'path' svojstvo netočna.",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Veličina datoteke ne smije prelaziti {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Datoteke se ne mogu prenijeti. Dodajte rukovatelja za događaj 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Unesite drugu vrijednost.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Vaša datoteka se prenosi. Pričekajte nekoliko sekundi i pokušajte ponovno.",
  // "Loading..."
  loadingFile: "Učitavanje...",
  // "Choose file(s)..."
  chooseFile: "Odaberite datoteku...",
  // "No file selected"
  noFileChosen: "Nije odabrana datoteka",
  // [Auto-translated] "Drag and drop a file here or click the button below and choose a file to upload."
  filePlaceholder: "Povucite i ispustite datoteku ovdje ili kliknite donji gumb i odaberite datoteku koju želite prenijeti.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Želite li izbrisati zapis?",
  // "This value should be unique."
  keyDuplicationError: "Ta bi vrijednost trebala biti jedinstvena.",
  // "Add Column"
  addColumn: "Dodavanje stupca",
  // "Add Row"
  addRow: "Dodavanje redaka",
  // "Remove"
  removeRow: "Ukloniti",
  // [Auto-translated] "There are no rows."
  noRowsText: "Nema redova.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Redak {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Dodavanje novih",
  // "Remove"
  removePanel: "Ukloniti",
  // [Auto-translated] "Show Details"
  showDetails: "Pokaži detalje",
  // [Auto-translated] "Hide Details"
  hideDetails: "Sakrij detalje",
  // "item"
  choices_Item: "stavku",
  // [Auto-translated] "Choice option"
  choices_Choice: "Opcija izbora",
  // "Column"
  matrix_column: "Stupca",
  // "Row"
  matrix_row: "Redak",
  // [Auto-translated] "text"
  multipletext_itemname: "Tekstualna poruka",
  // "The results are being saved on the server..."
  savingData: "Rezultati se spremaju na poslužitelju...",
  // "An error occurred and we could not save the results."
  savingDataError: "Došlo je do pogreške i nismo mogli spremiti rezultate.",
  // "The results were saved successfully!"
  savingDataSuccess: "Rezultati su uspješno spremljeni!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner."
  savingExceedSize: "Vaš odgovor premašuje 64KB. Smanjite veličinu datoteka i pokušajte ponovno ili se obratite vlasniku upitnika.",
  // "Try again"
  saveAgainButton: "Pokušaj ponovo",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sec",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Vi ste proveli {0} na ovoj stranici i {1} ukupno.",
  // "You have spent {0} on this page."
  timerSpentPage: "Potrošili ste {0} na ovu stranicu.",
  // "You have spent {0} in total."
  timerSpentSurvey: "You have spent {0} in total. {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Vi ste proveli {0} od {1} na ovoj stranici i {2} od {3} ukupno.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Potrošio si {0} od {1} na ovoj stranici.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Ukupno ste potrošili {0} od {1}.",
  // "Clear"
  clearCaption: "Očistiti",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Potpiši ovdje",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Bez potpisa",
  // "Select File"
  chooseFileCaption: "Odaberite datoteku",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Snimi fotografiju",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Kliknite donji gumb da biste snimili fotografiju pomoću kamere.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Povucite i ispustite ili odaberite datoteku za prijenos ili snimanje fotografije pomoću kamere.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Zamijeni datoteku",
  // "Remove this file"
  removeFileCaption: "Uklonite ovu datoteku",
  // "Yes"
  booleanCheckedLabel: "Da",
  // "No"
  booleanUncheckedLabel: "Ne",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Jeste li sigurni da želite ukloniti ovu datoteku: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Jeste li sigurni da želite ukloniti sve datoteke?",
  // "Question Title"
  questionTitlePatternText: "Naslov pitanja",
  // "Cancel"
  modalCancelButtonText: "Otkazati",
  // "Apply"
  modalApplyButtonText: "Primijeniti",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Upišite za pretraživanje...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Nema podataka za prikaz",
  // [Auto-translated] "Loading..."
  loadingPage: "Učitavanje...",
  // [Auto-translated] "Loading..."
  loadingData: "Učitavanje...",
  // [Auto-translated] "There are no entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Još nema unosa.\nKliknite donji gumb da biste dodali novi unos.",
  // [Auto-translated] "There are no entries."
  noEntriesReadonlyText: "Nema unosa.",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nova ploča",
  // [Auto-translated] "More"
  more: "Više",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are ranked"
  selectToRankEmptyRankedAreaText: "Svi izbori su rangirani",
  // [Auto-translated] "Drag and drop choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Ovdje povucite i ispustite odabire da biste ih rangirali",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Otkazati",
  // "Create \"{0}\" item..."
  createCustomItem: "Stvorite \"{0}\" stavku..."
};

setupLocale({ localeCode: "hr", strings: croatianStrings, nativeName: "hrvatski", englishName: "Croatian" });