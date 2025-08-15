import { setupLocale } from "survey-core";

export var serbianStrings = {
  // "Previous"
  pagePrevText: "Nazad",
  // "Next"
  pageNextText: "Dalje",
  // "Complete"
  completeText: "Završi",
  // "Preview"
  previewText: "Pregledaj",
  // "Edit"
  editText: "Izmeni",
  // "Start"
  startSurveyText: "Započni",
  // [Auto-translated] "Please leave a comment"
  commentText: "Molimo ostavite komentar",
  // "Other (describe)"
  otherItemText: "Drugo (upiši)",
  // "None"
  noneItemText: "Ništa",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Odbijanje odgovora",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Ne znam",
  // "Select All"
  selectAllItemText: "Izaberi sve",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Poništi izbor svih",
  // "Page {0} of {1}"
  progressText: "Stranica {0} od {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Upis {0} od {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Odgovoreno na {0}/{1} pitanja",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Nema vidljivih stranica ili pitanja u anketi.",
  // "Thank you for completing the survey"
  completingSurvey: "Hvala na popunjavanju ankete!",
  // "You have already completed this survey."
  completingSurveyBefore: "Prema našim podacima, već ste popunili ovu anketu.",
  // "Loading Survey..."
  loadingSurvey: "Učitavam anketu...",
  // "Select..."
  placeholder: "Izaberi...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Izaberite...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Izaberite...",
  // "value"
  value: "vrednost",
  // "Response required."
  requiredError: "Molimo odgovorite na ovo pitanje.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Molimo odgovorite na bar jedno pitanje.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Molimo odgovorite na pitanja u svim redovima.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Svaki red mora imati jedinstvenu vrednost.",
  // "The value should be numeric."
  numericError: "Vrednost bi trebalo da bude numerička.",
  // "The value should not be less than {0}"
  minError: "Vrednost ne bi trebalo da bude manja od {0}",
  // "The value should not be greater than {0}"
  maxError: "Vrednost ne bi trebalo da bude veća od {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Brojevi nisu dozvoljeni.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Molimo unesite bar {0} znak(ov)a.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Molimo unesite najviše {0} znak(ov)a.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Molimo unesite najmanje {0} i ne više od {1} znak(ov)a.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Molimo popunite najmanje {0} red(ova).",
  // "Please select at least {0} option(s)."
  minSelectError: "Molimo izaberite najmanje {0} opcija/e.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Molimo izaberite najviše {0} opcija/e.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' bi trebalo da bude najmanje {1} i najviše {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' bi trebalo da bude najmanje {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' bi trebalo da bude najviše {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Molimo unesite ispravnu e-mail adresu.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Izraz: {0} bi trebalo da bude tačan.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Zahtev je naišao na grešku '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Zahtev nije pronašao podatke, ili je putanja netačna",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Veličina fajla ne bi trebalo da prelazi {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Nije moguće otpremiti datoteke. Dodajte rukovaoca za događaj \"onUploadFiles\".",
  // "Response required: enter another value."
  otherRequiredError: "Molimo unesite drugu vrednost.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Fajl se šalje. Molimo sačekajte neko vreme i pokušajte ponovo.",
  // "Loading..."
  loadingFile: "Učitavanje...",
  // "Choose file(s)..."
  chooseFile: "Izaberite fajlove...",
  // "No file selected"
  noFileChosen: "Nije izabran nijedan fajl",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Prevucite i ispustite datoteku ovde ili kliknite na dugme ispod da biste izabrali datoteku za otpremanje.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Da li želite da izbrišete unos?",
  // "This value should be unique."
  keyDuplicationError: "Ova vrednost treba da bude jedinstvena.",
  // "Add Column"
  addColumn: "Dodaj kolonu",
  // "Add Row"
  addRow: "Dodaj red",
  // "Remove"
  removeRow: "Ukloni",
  // "There are no rows."
  noRowsText: "Nema redova.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Red {rovIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Dodaj novo",
  // "Remove"
  removePanel: "Ukloni",
  // [Auto-translated] "Show Details"
  showDetails: "Prikaži detalje",
  // [Auto-translated] "Hide Details"
  hideDetails: "Sakrij detalje",
  // "item"
  choices_Item: "stavka",
  // [Auto-translated] "Choice option"
  choices_Choice: "Opcija izbora",
  // "Column"
  matrix_column: "Kolona",
  // "Row"
  matrix_row: "Red",
  // "text"
  multipletext_itemname: "tekst",
  // "The results are being saved on the server..."
  savingData: "U toku je čuvanje podataka na serveru...",
  // "An error occurred and we could not save the results."
  savingDataError: "Došlo je do greške i rezultati nisu sačuvani.",
  // "The results were saved successfully!"
  savingDataSuccess: "Rezultati su uspešno sačuvani!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Vaš odgovor prelazi 64KB. Smanjite veličinu datoteka/datoteka i pokušajte ponovo ili se obratite vlasniku ankete.",
  // "Try again"
  saveAgainButton: "Pokušajte ponovo",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Proveli ste {0} na ovoj stranici i {1} ukupno.",
  // "You have spent {0} on this page."
  timerSpentPage: "Proveli ste {0} na ovoj stranici.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Proveli ste {0} ukupno.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Proveli ste {0} od {1} na ovoj stranici i {2} od {3} ukupno.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Proveli ste {0} od {1} na ovoj stranici.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Proveli ste {0} od {1} ukupno.",
  // "Clear"
  clearCaption: "Poništi",
  // [Auto-translated] "Select"
  selectCaption: "Izaberite",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Potpišite ovde",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Bez potpisa",
  // "Select File"
  chooseFileCaption: "Izaberi fajl",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Fotografisanje",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Kliknite na dugme ispod da biste snimili fotografiju pomoću fotoaparata.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Prevucite i otpustite ili izaberite datoteku za otpremanje ili snimanje fotografije pomoću fotoaparata.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Zameni datoteku",
  // "Remove this file"
  removeFileCaption: "Ukloni ovaj fajl",
  // "Yes"
  booleanCheckedLabel: "Da",
  // "No"
  booleanUncheckedLabel: "Ne",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Da li ste sigurni da želite da uklonite ovaj fajl: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Da li ste sigurni da želite da uklonite sve fajlove?",
  // "Question Title"
  questionTitlePatternText: "Naslov pitanja",
  // "Cancel"
  modalCancelButtonText: "Otkaži",
  // "Apply"
  modalApplyButtonText: "Primeni",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Otkucajte da biste pretražili...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Nema podataka za prikazivanje",
  // [Auto-translated] "Loading..."
  loadingPage: "Učitavanje...",
  // [Auto-translated] "Loading..."
  loadingData: "Učitavanje...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Još nema unosa.\nKliknite na dugme ispod da biste dodali novi unos.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Nema unosa",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nova tabla",
  // [Auto-translated] "More"
  more: "Viљe",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "U redu",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Svi izbori su izabrani za rangiranje",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Prevucite izbore ovde da biste ih rangirali",
  // [Auto-translated] "OK"
  ok: "U redu",
  // [Auto-translated] "Cancel"
  cancel: "Otkaži",
  // "Create \"{0}\" item..."
  createCustomItem: "Kreiraj \"{0}\" stavku...",
  // [Auto-translated] "Table of contents"
  toc: "Sadržaj",
  // [Auto-translated] "Progress bar"
  progressbar: "Traka napretka"
};

setupLocale({ localeCode: "sr", strings: serbianStrings, nativeName: "srpski", englishName: "Serbian" });