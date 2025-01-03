import { setupLocale } from "survey-core";

export var croatianStrings = {
  pagePrevText: "Prethodni",
  pageNextText: "Sljedeći",
  completeText: "Kompletan",
  previewText: "Pregled",
  editText: "Uređivanje",
  startSurveyText: "Početak",
  otherItemText: "Ostali (opis)",
  noneItemText: "Nitko",
  refuseItemText: "Odbijte odgovoriti",
  dontKnowItemText: "Ne znam",
  selectAllItemText: "Select All",
  deselectAllItemText: "Poništite odabir svega",
  progressText: "Stranica {0} od {1}",
  indexText: "{0} {1}",
  panelDynamicProgressText: "Zapisa {0} od {1}",
  panelDynamicTabTextFormat: "Ploča {panelIndex}",
  questionsProgressText: "Odgovorio na {0}/{1} pitanja",
  emptySurvey: "U anketi nema vidljive stranice ili pitanja.",
  completingSurvey: "Hvala vam što ste završili anketu!",
  completingSurveyBefore: "Naši zapisi pokazuju da ste već završili ovu anketu.",
  loadingSurvey: "Anketa o učitavanje...",
  placeholder: "Odaberite...",
  ratingOptionsCaption: "Odabirati...",
  value: "vrijednost",
  requiredError: "Molim vas odgovorite na pitanje.",
  requiredErrorInPanel: "Molim vas odgovorite na barem jedno pitanje.",
  requiredInAllRowsError: "Odgovorite na pitanja u svim redovima.",
  eachRowUniqueError: "Svaki redak mora imati jedinstvenu vrijednost.",
  numericError: "Vrijednost bi trebala biti brojčana.",
  minError: "Vrijednost ne smije biti manja od {0}",
  maxError: "Vrijednost ne smije biti veća od {0}",
  textNoDigitsAllow: "Brojevi nisu dopušteni.",
  textMinLength: "Unesite najmanje {0} znak(ova).",
  textMaxLength: "Unesite manje od {0} znak(ova).",
  textMinMaxLength: "Unesite više od {0} i manje od {1} znakova.",
  minRowCountError: "Molimo ispunite najmanje {0} redaka.",
  minSelectError: "Odaberite barem {0} varijante.",
  maxSelectError: "Odaberite ne više od {0} varijanti.",
  numericMinMax: "'{0}'bi trebao biti jednak ili više od {1} i jednak ili manji od {2}.",
  numericMin: "'{0}' bi trebao biti jednak ili više od {1}.",
  numericMax: "'{0}' bi trebao biti jednak ili manji od {1}",
  invalidEmail: "Unesite valjanu e-mail adresu.",
  invalidExpression: "Izraz: {0} treba vratiti 'true'.",
  urlRequestError: "Zahtjev vratio pogrešku '{0}'. {1}",
  urlGetChoicesError: "Zahtjev je vratio prazne podatke ili je 'path' svojstvo netočna.",
  exceedMaxSize: "Veličina datoteke ne smije prelaziti {0}.",
  noUploadFilesHandler: "Datoteke se ne mogu prenijeti. Dodajte rukovatelja za događaj 'onUploadFiles'.",
  otherRequiredError: "Unesite drugu vrijednost.",
  uploadingFile: "Vaša datoteka se prenosi. Pričekajte nekoliko sekundi i pokušajte ponovno.",
  loadingFile: "Učitavanje...",
  chooseFile: "Odaberite datoteku...",
  noFileChosen: "Nije odabrana datoteka",
  filePlaceholder: "Povucite i ispustite datoteku ovdje ili kliknite donji gumb i odaberite datoteku koju želite prenijeti.",
  confirmDelete: "Želite li izbrisati zapis?",
  keyDuplicationError: "Ta bi vrijednost trebala biti jedinstvena.",
  addColumn: "Dodavanje stupca",
  addRow: "Dodavanje redaka",
  removeRow: "Ukloniti",
  noRowsText: "Nema redova.",
  addPanel: "Dodavanje novih",
  removePanel: "Ukloniti",
  showDetails: "Pokaži detalje",
  hideDetails: "Sakrij detalje",
  choices_Item: "stavku",
  matrix_column: "Stupca",
  matrix_row: "Redak",
  multipletext_itemname: "Tekstualna poruka",
  savingData: "Rezultati se spremaju na poslužitelju...",
  savingDataError: "Došlo je do pogreške i nismo mogli spremiti rezultate.",
  savingDataSuccess: "Rezultati su uspješno spremljeni!",
  savingExceedSize: "Vaš odgovor premašuje 64KB. Smanjite veličinu datoteka i pokušajte ponovno ili se obratite vlasniku upitnika.",
  saveAgainButton: "Pokušaj ponovo",
  timerMin: "min",
  timerSec: "sec",
  timerSpentAll: "Vi ste proveli {0} na ovoj stranici i {1} ukupno.",
  timerSpentPage: "Potrošili ste {0} na ovu stranicu.",
  timerSpentSurvey: "You have spent {0} in total. {0}.",
  timerLimitAll: "Vi ste proveli {0} od {1} na ovoj stranici i {2} od {3} ukupno.",
  timerLimitPage: "Potrošio si {0} od {1} na ovoj stranici.",
  timerLimitSurvey: "Ukupno ste potrošili {0} od {1}.",
  clearCaption: "Očistiti",
  signaturePlaceHolder: "Potpiši ovdje",
  signaturePlaceHolderReadOnly: "Bez potpisa",
  chooseFileCaption: "Odaberite datoteku",
  takePhotoCaption: "Snimi fotografiju",
  photoPlaceholder: "Kliknite donji gumb da biste snimili fotografiju pomoću kamere.",
  fileOrPhotoPlaceholder: "Povucite i ispustite ili odaberite datoteku za prijenos ili snimanje fotografije pomoću kamere.",
  replaceFileCaption: "Zamijeni datoteku",
  removeFileCaption: "Uklonite ovu datoteku",
  booleanCheckedLabel: "Da",
  booleanUncheckedLabel: "Ne",
  confirmRemoveFile: "Jeste li sigurni da želite ukloniti ovu datoteku: {0}?",
  confirmRemoveAllFiles: "Jeste li sigurni da želite ukloniti sve datoteke?",
  questionTitlePatternText: "Naslov pitanja",
  modalCancelButtonText: "Otkazati",
  modalApplyButtonText: "Primijeniti",
  filterStringPlaceholder: "Upišite za pretraživanje...",
  emptyMessage: "Nema podataka za prikaz",
  noEntriesText: "Još nema unosa.\nKliknite donji gumb da biste dodali novi unos.",
  noEntriesReadonlyText: "Nema unosa.",
  tabTitlePlaceholder: "Nova ploča",
  more: "Više",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Svi izbori su rangirani",
  selectToRankEmptyUnrankedAreaText: "Ovdje povucite i ispustite odabire da biste ih rangirali",
  ok: "OK",
  cancel: "Otkazati"
};

setupLocale({ localeCode: "hr", strings: croatianStrings, nativeName: "hrvatski", englishName: "Croatian" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{0} {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Ploča {panelIndex}"
// ratingOptionsCaption: "Select..." => "Odabirati..."
// minError: "The value should not be less than {0}" => "Vrijednost ne smije biti manja od {0}"
// maxError: "The value should not be greater than {0}" => "Vrijednost ne smije biti veća od {0}"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Povucite i ispustite datoteku ovdje ili kliknite donji gumb i odaberite datoteku koju želite prenijeti."
// noRowsText: "There are no rows." => "Nema redova."
// multipletext_itemname: "text" => "Tekstualna poruka"
// signaturePlaceHolder: "Sign here" => "Potpiši ovdje"
// filterStringPlaceholder: "Type to search..." => "Upišite za pretraživanje..."
// emptyMessage: "No data to display" => "Nema podataka za prikaz"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Još nema unosa.\nKliknite donji gumb da biste dodali novi unos."
// noEntriesReadonlyText: "There are no entries." => "Nema unosa."
// more: "More" => "Više"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Svi izbori su rangirani"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Ovdje povucite i ispustite odabire da biste ih rangirali"// takePhotoCaption: "Take Photo" => "Snimi fotografiju"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Kliknite donji gumb da biste snimili fotografiju pomoću kamere."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Povucite i ispustite ili odaberite datoteku za prijenos ili snimanje fotografije pomoću kamere."
// replaceFileCaption: "Replace file" => "Zamijeni datoteku"// eachRowUniqueError: "Each row must have a unique value." => "Svaki redak mora imati jedinstvenu vrijednost."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Datoteke se ne mogu prenijeti. Dodajte rukovatelja za događaj 'onUploadFiles'."
// showDetails: "Show Details" => "Pokaži detalje"
// hideDetails: "Hide Details" => "Sakrij detalje"
// ok: "OK" => "OK"
// cancel: "Cancel" => "Otkazati"
// refuseItemText: "Refuse to answer" => "Odbijte odgovoriti"
// dontKnowItemText: "Don't know" => "Ne znam"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Vaš odgovor premašuje 64KB. Smanjite veličinu datoteka i pokušajte ponovno ili se obratite vlasniku upitnika."
// signaturePlaceHolderReadOnly: "No signature" => "Bez potpisa"// tabTitlePlaceholder: "New Panel" => "Nova ploča"// deselectAllItemText: "Deselect all" => "Poništite odabir svega"
// textNoDigitsAllow: "Numbers are not allowed." => "Brojevi nisu dopušteni."