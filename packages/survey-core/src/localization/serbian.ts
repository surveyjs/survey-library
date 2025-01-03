import { setupLocale } from "survey-core";

export var serbianStrings = {
  pagePrevText: "Nazad",
  pageNextText: "Dalje",
  completeText: "Završi",
  previewText: "Pregledaj",
  editText: "Izmeni",
  startSurveyText: "Započni",
  otherItemText: "Drugo (upiši)",
  noneItemText: "Ništa",
  refuseItemText: "Odbijanje odgovora",
  dontKnowItemText: "Ne znam",
  selectAllItemText: "Izaberi sve",
  deselectAllItemText: "Poništi izbor svih",
  progressText: "Stranica {0} od {1}",
  indexText: "{0} {1}",
  panelDynamicProgressText: "Upis {0} od {1}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "Odgovoreno na {0}/{1} pitanja",
  emptySurvey: "Nema vidljivih stranica ili pitanja u anketi.",
  completingSurvey: "Hvala na popunjavanju ankete!",
  completingSurveyBefore: "Prema našim podacima, već ste popunili ovu anketu.",
  loadingSurvey: "Učitavam anketu...",
  placeholder: "Izaberi...",
  ratingOptionsCaption: "Izaberite...",
  value: "vrednost",
  requiredError: "Molimo odgovorite na ovo pitanje.",
  requiredErrorInPanel: "Molimo odgovorite na bar jedno pitanje.",
  requiredInAllRowsError: "Molimo odgovorite na pitanja u svim redovima.",
  eachRowUniqueError: "Svaki red mora imati jedinstvenu vrednost.",
  numericError: "Vrednost bi trebalo da bude numerička.",
  minError: "Vrednost ne bi trebalo da bude manja od {0}",
  maxError: "Vrednost ne bi trebalo da bude veća od {0}",
  textNoDigitsAllow: "Brojevi nisu dozvoljeni.",
  textMinLength: "Molimo unesite bar {0} znak(ov)a.",
  textMaxLength: "Molimo unesite najviše {0} znak(ov)a.",
  textMinMaxLength: "Molimo unesite najmanje {0} i ne više od {1} znak(ov)a.",
  minRowCountError: "Molimo popunite najmanje {0} red(ova).",
  minSelectError: "Molimo izaberite najmanje {0} opcija/e.",
  maxSelectError: "Molimo izaberite najviše {0} opcija/e.",
  numericMinMax: "'{0}' bi trebalo da bude najmanje {1} i najviše {2}",
  numericMin: "'{0}' bi trebalo da bude najmanje {1}",
  numericMax: "'{0}' bi trebalo da bude najviše {1}",
  invalidEmail: "Molimo unesite ispravnu e-mail adresu.",
  invalidExpression: "Izraz: {0} bi trebalo da bude tačan.",
  urlRequestError: "Zahtev je naišao na grešku '{0}'. {1}",
  urlGetChoicesError: "Zahtev nije pronašao podatke, ili je putanja netačna",
  exceedMaxSize: "Veličina fajla ne bi trebalo da prelazi {0}.",
  noUploadFilesHandler: "Nije moguće otpremiti datoteke. Dodajte rukovaoca za događaj \"onUploadFiles\".",
  otherRequiredError: "Molimo unesite drugu vrednost.",
  uploadingFile: "Fajl se šalje. Molimo sačekajte neko vreme i pokušajte ponovo.",
  loadingFile: "Učitavanje...",
  chooseFile: "Izaberite fajlove...",
  noFileChosen: "Nije izabran nijedan fajl",
  filePlaceholder: "Prevucite i otpustite datoteku ovde ili kliknite na dugme ispod i odaberite datoteku za otpremanje.",
  confirmDelete: "Da li želite da izbrišete unos?",
  keyDuplicationError: "Ova vrednost treba da bude jedinstvena.",
  addColumn: "Dodaj kolonu",
  addRow: "Dodaj red",
  removeRow: "Ukloni",
  noRowsText: "Nema redova.",
  addPanel: "Dodaj novo",
  removePanel: "Ukloni",
  showDetails: "Prikaži detalje",
  hideDetails: "Sakrij detalje",
  choices_Item: "stavka",
  matrix_column: "Kolona",
  matrix_row: "Red",
  multipletext_itemname: "tekst",
  savingData: "U toku je čuvanje podataka na serveru...",
  savingDataError: "Došlo je do greške i rezultati nisu sačuvani.",
  savingDataSuccess: "Rezultati su uspešno sačuvani!",
  savingExceedSize: "Vaš odgovor premašuje 64KB. Smanjite veličinu datoteka i pokušajte ponovo ili se obratite vlasniku ankete.",
  saveAgainButton: "Pokušajte ponovo",
  timerMin: "min",
  timerSec: "sek",
  timerSpentAll: "Proveli ste {0} na ovoj stranici i {1} ukupno.",
  timerSpentPage: "Proveli ste {0} na ovoj stranici.",
  timerSpentSurvey: "Proveli ste {0} ukupno.",
  timerLimitAll: "Proveli ste {0} od {1} na ovoj stranici i {2} od {3} ukupno.",
  timerLimitPage: "Proveli ste {0} od {1} na ovoj stranici.",
  timerLimitSurvey: "Proveli ste {0} od {1} ukupno.",
  clearCaption: "Poništi",
  signaturePlaceHolder: "Potpišite ovde",
  signaturePlaceHolderReadOnly: "Bez potpisa",
  chooseFileCaption: "Izaberi fajl",
  takePhotoCaption: "Fotografisanje",
  photoPlaceholder: "Kliknite na dugme ispod da biste snimili fotografiju pomoću fotoaparata.",
  fileOrPhotoPlaceholder: "Prevucite i otpustite ili izaberite datoteku za otpremanje ili snimanje fotografije pomoću fotoaparata.",
  replaceFileCaption: "Zameni datoteku",
  removeFileCaption: "Ukloni ovaj fajl",
  booleanCheckedLabel: "Da",
  booleanUncheckedLabel: "Ne",
  confirmRemoveFile: "Da li ste sigurni da želite da uklonite ovaj fajl: {0}?",
  confirmRemoveAllFiles: "Da li ste sigurni da želite da uklonite sve fajlove?",
  questionTitlePatternText: "Naslov pitanja",
  modalCancelButtonText: "Otkaži",
  modalApplyButtonText: "Primeni",
  filterStringPlaceholder: "Otkucajte da biste pretražili...",
  emptyMessage: "Nema podataka za prikazivanje",
  noEntriesText: "Još uvek nema stavki.\nKliknite na dugme ispod da biste dodali novu stavku.",
  noEntriesReadonlyText: "Nema stavki.",
  tabTitlePlaceholder: "Nova tabla",
  more: "Viљe",
  tagboxDoneButtonCaption: "U redu",
  selectToRankEmptyRankedAreaText: "Svi izbori su rangirani",
  selectToRankEmptyUnrankedAreaText: "Prevucite i otpustite izbor ovde da biste ih rangirali",
  ok: "U redu",
  cancel: "Otkaži"
};

setupLocale({ localeCode: "rs", strings: serbianStrings, nativeName: "srpski", englishName: "Serbian" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Izaberite..."
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Prevucite i otpustite datoteku ovde ili kliknite na dugme ispod i odaberite datoteku za otpremanje."
// signaturePlaceHolder: "Sign here" => "Potpišite ovde"
// filterStringPlaceholder: "Type to search..." => "Otkucajte da biste pretražili..."
// emptyMessage: "No data to display" => "Nema podataka za prikazivanje"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Još uvek nema stavki.\nKliknite na dugme ispod da biste dodali novu stavku."
// noEntriesReadonlyText: "There are no entries." => "Nema stavki."
// more: "More" => "Viљe"
// tagboxDoneButtonCaption: "OK" => "U redu"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Svi izbori su rangirani"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Prevucite i otpustite izbor ovde da biste ih rangirali"// takePhotoCaption: "Take Photo" => "Fotografisanje"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Kliknite na dugme ispod da biste snimili fotografiju pomoću fotoaparata."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Prevucite i otpustite ili izaberite datoteku za otpremanje ili snimanje fotografije pomoću fotoaparata."
// replaceFileCaption: "Replace file" => "Zameni datoteku"// eachRowUniqueError: "Each row must have a unique value." => "Svaki red mora imati jedinstvenu vrednost."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Nije moguće otpremiti datoteke. Dodajte rukovaoca za događaj \"onUploadFiles\"."
// showDetails: "Show Details" => "Prikaži detalje"
// hideDetails: "Hide Details" => "Sakrij detalje"
// ok: "OK" => "U redu"
// cancel: "Cancel" => "Otkaži"
// refuseItemText: "Refuse to answer" => "Odbijanje odgovora"
// dontKnowItemText: "Don't know" => "Ne znam"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Vaš odgovor premašuje 64KB. Smanjite veličinu datoteka i pokušajte ponovo ili se obratite vlasniku ankete."
// signaturePlaceHolderReadOnly: "No signature" => "Bez potpisa"// tabTitlePlaceholder: "New Panel" => "Nova tabla"// deselectAllItemText: "Deselect all" => "Poništi izbor svih"
// textNoDigitsAllow: "Numbers are not allowed." => "Brojevi nisu dozvoljeni."