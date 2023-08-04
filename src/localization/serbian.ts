import { surveyLocalization } from "survey-core";

export var serbianStrings = {
  pagePrevText: "Nazad",
  pageNextText: "Dalje",
  completeText: "Završi",
  previewText: "Pregledaj",
  editText: "Izmeni",
  startSurveyText: "Započni",
  otherItemText: "Drugo (upiši)",
  noneItemText: "Ništa",
  selectAllItemText: "Izaberi sve",
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
  numericError: "Vrednost bi trebalo da bude numerička.",
  minError: "Vrednost ne bi trebalo da bude manja od {0}",
  maxError: "Vrednost ne bi trebalo da bude veća od {0}",
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
  otherRequiredError: "Molimo unesite drugu vrednost.",
  uploadingFile: "Fajl se šalje. Molimo sačekajte neko vreme i pokušajte ponovo.",
  loadingFile: "Učitavanje...",
  chooseFile: "Izaberite fajlove...",
  noFileChosen: "Nije izabran nijedan fajl",
  fileDragAreaPlaceholder: "Prevucite i otpustite datoteku ovde ili kliknite na dugme ispod i odaberite datoteku za otpremanje.",
  confirmDelete: "Da li želite da izbrišete unos?",
  keyDuplicationError: "Ova vrednost treba da bude jedinstvena.",
  addColumn: "Dodaj kolonu",
  addRow: "Dodaj red",
  removeRow: "Ukloni",
  emptyRowsText: "Nema redova.",
  addPanel: "Dodaj novo",
  removePanel: "Ukloni",
  choices_Item: "stavka",
  matrix_column: "Kolona",
  matrix_row: "Red",
  multipletext_itemname: "tekst",
  savingData: "U toku je čuvanje podataka na serveru...",
  savingDataError: "Došlo je do greške i rezultati nisu sačuvani.",
  savingDataSuccess: "Rezultati su uspešno sačuvani!",
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
  chooseFileCaption: "Izaberi fajl",
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
  more: "Viљe",
  tagboxDoneButtonCaption: "U redu",
  selectToRankEmptyRankedAreaText: "Svi izbori su rangirani",
  selectToRankEmptyUnrankedAreaText: "Prevucite i otpustite izbor ovde da biste ih rangirali"
};

//Uncomment these two lines on creating a translation file. You should replace "en" and enStrings with your locale ("fr", "de" and so on) and your variable.
surveyLocalization.locales["rs"] = serbianStrings;
surveyLocalization.localeNames["rs"] = "Srpski";

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Izaberite..."
// fileDragAreaPlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Prevucite i otpustite datoteku ovde ili kliknite na dugme ispod i odaberite datoteku za otpremanje."
// signaturePlaceHolder: "Sign here" => "Potpišite ovde"
// filterStringPlaceholder: "Type to search..." => "Otkucajte da biste pretražili..."
// emptyMessage: "No data to display" => "Nema podataka za prikazivanje"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Još uvek nema stavki.\nKliknite na dugme ispod da biste dodali novu stavku."
// noEntriesReadonlyText: "There are no entries." => "Nema stavki."
// more: "More" => "Viљe"
// tagboxDoneButtonCaption: "OK" => "U redu"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Svi izbori su rangirani"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Prevucite i otpustite izbor ovde da biste ih rangirali"