import { setupLocale } from "survey-core";

export var serbianStrings = {
  // "Previous"
  pagePrevText: "Nazad",
  // "Next"
  pageNextText: "Dalje",
  // [Auto-translated] "First"
  pageFirstText: "Prvo",
  // [Auto-translated] "Last"
  pageLastText: "Poslednji",
  // [Auto-translated] "of {0}"
  pagerTotalText: "od {0}",
  // [Auto-translated] "Select Page"
  pagerSelectPageTitle: "Mapa sajta",
  // [Auto-translated] "Sort by {0}"
  sortByColumnText: "Sortiraj po {0}",
  // [Auto-translated] "High - Low"
  sortHighLowText: "Visoko - Nisko",
  // [Auto-translated] "Low - High"
  sortLowHighText: "Nisko - Visoko",
  // [Auto-translated] "Alphabet, A - Z"
  sortAZText: "Azbuka, A - Z",
  // [Auto-translated] "Alphabet, Z - A"
  sortZAText: "Abeceda, Z - A",
  // [Auto-translated] "Newest first"
  sortNewestFirstText: "Najnovije prvo",
  // [Auto-translated] "Oldest first"
  sortOldestFirstText: "Najstariji prvo",
  // [Auto-translated] "Sorted by {0}"
  sortOrderText: "Sortirano po {0}",
  // [Auto-translated] "{0} ({1})"
  sortOrderLevelText: "{0} ({1})",
  // [Auto-translated] "{0}, then by {1}"
  sortOrderNextText: "{0}, a zatim {1}",
  // [Auto-translated] "Sort by"
  sortByText: "Sortiraj po",
  // [Auto-translated] "Default"
  sortDefaultText: "Pretraživanje",
  // [Auto-translated] "Sort field"
  sortFieldAriaLabel: "Polje za sortiranje",
  // [Auto-translated] "Sort order"
  sortDirectionAriaLabel: "Redosled sortiranja",
  // [Auto-translated] "Add sort level"
  sortAddLevelText: "Dodajte nivo sortiranja",
  // [Auto-translated] "Remove sort level {0}"
  sortRemoveLevelText: "Ukloni {0} nivoa sortiranja",
  // [Auto-translated] "Sort field {0}"
  sortLevelFieldAriaLabel: "Sortiraj polje {0}",
  // [Auto-translated] "Sort order {0}"
  sortLevelDirectionAriaLabel: "Redosled sortiranja {0}",
  // [Auto-translated] "Show all sort levels"
  sortMoreAriaLabel: "Pokaži sve nivoe sortiranja",
  // [Auto-translated] "Add New"
  sortAddNewText: "Dodaj novi",
  // [Auto-translated] "Move sort level {0}"
  sortMoveLevelAriaLabel: "Premesti nivo sortiranja {0}",
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
  // [Auto-translated] "Question {0} of {1}"
  questionPositionProgressText: "Pitanje {0} {1}",
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
  // [Auto-translated] "You must select Yes to continue."
  requireTrueError: "Morate da izaberete Da da biste nastavili.",
  // [Auto-translated] "The value is incorrect."
  incorrectValueError: "Vrednost je netačna.",
  // [Auto-translated] "The value contains unknown keys: {0}."
  incorrectValueUnknownKeysError: "Vrednost sadrži nepoznate ključeve: {0}.",
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
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Unesite vrednost koja odgovara veličini koraka {0}.",
  // "The value should not be greater than {0}"
  maxError: "Vrednost ne bi trebalo da bude veća od {0}",
  // [Auto-translated] "Invalid input"
  invalidInputError: "Neispravan unos",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Brojevi nisu dozvoljeni.",
  // [Auto-translated] "Please complete the value to match the required format."
  incompletePatternError: "Molimo Vas da popunite vrednost koja odgovara potrebnom formatu.",
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
  // [Auto-translated] "Bytes, KB, MB, GB, TB"
  fileSizeUnits: "Bajtovi, KB, MB, GB, TB",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Maksimalan broj fajlova koje možete da otpremite je {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Nije moguće otpremiti datoteke. Dodajte rukovaoca za događaj \"onUploadFiles\".",
  // "Response required: enter another value."
  otherRequiredError: "Molimo unesite drugu vrednost.",
  // [Auto-translated] "The value '{0}' is not one of the available choices."
  variableValueNotInChoices: "Vrednost \"{0}\" nije jedan od dostupnih izbora.",
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
  // [Auto-translated] "Move row {0}"
  moveRowAriaLabel: "Premesti red {0}",
  // "There are no rows."
  noRowsText: "Nema redova.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Red {rovIndex}",
  // [Auto-translated] "{rowTitle}"
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
  // "Try again"
  saveAgainButton: "Pokušajte ponovo",
  // [Auto-translated] "min"
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
  progressbar: "Traka napretka",
  // [Auto-translated] "Page {0}"
  progressbarPage: "Stranica {0}",
  // [Auto-translated] "Empty"
  conditionOperatorEmpty: "Prazno",
  // [Auto-translated] "Not empty"
  conditionOperatorNotempty: "Nije prazno",
  // [Auto-translated] "Equals"
  conditionOperatorEqual: "Jednaki",
  // [Auto-translated] "Does not equal"
  conditionOperatorNotequal: "Nije jednako",
  // [Auto-translated] "Contains"
  conditionOperatorContains: "Sadrži",
  // [Auto-translated] "Does not contain"
  conditionOperatorNotcontains: "Ne sadrži",
  // [Auto-translated] "Any of"
  conditionOperatorAnyof: "Bilo koja od",
  // [Auto-translated] "None of"
  conditionOperatorNoneof: "Nijedan od",
  // [Auto-translated] "All of"
  conditionOperatorAllof: "Sve od",
  // [Auto-translated] "Greater than"
  conditionOperatorGreater: "Veće od",
  // [Auto-translated] "Less than"
  conditionOperatorLess: "Manje od",
  // [Auto-translated] "Greater than or equal to"
  conditionOperatorGreaterorequal: "Veće ili jednako",
  // [Auto-translated] "Less than or equal to"
  conditionOperatorLessorequal: "Manje ili jednako",
  // [Auto-translated] "Save"
  filterSave: "Sačuvaj",
  // [Auto-translated] "Filters"
  filterFilters: "Filteri",
  // [Auto-translated] "Filters: {0}"
  filterFiltersCount: "Filteri: {0}",
  // [Auto-translated] "Filters"
  filterDialogTitle: "Filteri",
  // [Auto-translated] "Search"
  filterSearchLabel: "Pretraga",
  // [Auto-translated] "Search by {0}"
  filterSearchPlaceholder: "Pretraži po {0}",
  // [Auto-translated] "Show More"
  filterShowMore: "Prikaži više",
  // [Auto-translated] "Show Less"
  filterShowLess: "Prikaži manje",
  // [Auto-translated] "Clear All"
  filterClearAll: "Obriši sve",
  // [Auto-translated] "Clear {0}"
  filterClearChip: "Očisti {0}",
  // [Auto-translated] "Preset"
  filterPreset: "Prethodno podešeno",
  // [Auto-translated] "Save as..."
  filterSaveAs: "Sačuvaj kao...",
  // [Auto-translated] "Save"
  filterSaveAsSave: "Sačuvaj",
  // [Auto-translated] "Add \"{0}\"..."
  filterAddCustomValue: "Dodaj \"{0}\"...",
  // [Auto-translated] "Presets"
  filterPresetsTitle: "Predefinisana podešavanja",
  // [Auto-translated] "Show {0} items"
  filterShowResultsCount: "Prikaži {0} stavke",
  // [Auto-translated] "Show 1 item"
  filterShowOneResult: "Prikaži 1 predmet",
  // [Auto-translated] "Show results"
  filterShowResults: "Prikaži rezultate",
  // [Auto-translated] "New Preset"
  filterAddPresetTitle: "Novi unapred podešen",
  // [Auto-translated] "Name"
  filterPresetName: "Ime",
  // [Auto-translated] "Contains"
  filterPresetContains: "Sadrži",
  // [Auto-translated] "A preset with this name already exists."
  filterPresetTitleExists: "Preset sa ovim imenom već postoji.",
  // [Auto-translated] "Add at least one condition."
  filterPresetNoConditions: "Dodajte bar jedan uslov.",
  // [Auto-translated] "Enter an expression."
  filterPresetNoExpression: "Unesite izraz.",
  // [Auto-translated] "The expression is not valid."
  filterPresetInvalidExpression: "Izraz nije važeći.",
  // [Auto-translated] "Edit as Expression"
  filterEditAsText: "Izmeni kao izraz",
  // [Auto-translated] "Edit as Tagbox"
  filterEditAsFields: "Izmeni kao okvir za oznake",
  // [Auto-translated] "Type an expression here..."
  filterExpressionPlaceholder: "Ovde unesite izraz...",
  // [Auto-translated] "Edit Preset"
  filterEditPreset: "Izmeni unapred podešenu postavku",
  // [Auto-translated] "Delete"
  filterDeletePreset: "Obriši",
  // [Auto-translated] "Add New..."
  filterAddPreset: "Dodaj novo...",
  // [Auto-translated] "Edit Selected..."
  filterEditSelected: "Izmeni izabrano...",
  // [Auto-translated] "{0} Expression"
  filterPresetExpression: "{0} Izraz",
  // [Auto-translated] "Edit..."
  filterEditExpression: "Izmena...",
  // [Auto-translated] "Search in Filters"
  filterSearchInFilters: "Pretraži u filterima",
  // [Auto-translated] "Nothing found, try different keywords"
  filterNothingFound: "Ništa nije pronađeno, probaj različite ključne reči",
  // [Auto-translated] "Create preset with AI"
  filterAiPromptNew: "Kreirajte predefinisanu postavku pomoću AI",
  // [Auto-translated] "Edit preset with AI"
  filterAiPromptEdit: "Uređivanje predložaka pomoću veštačke inteligencije",
  // [Auto-translated] "For example, “Coffee & Tea from Germany”"
  filterAiPromptPlaceholder: "Na primer, \"Kafa i čaj iz Nemačke\"",
  // [Auto-translated] "Create"
  filterAiCreate: "Kreiraj",
  // [Auto-translated] "Edit"
  filterAiEdit: "Izmena",
  // [Auto-translated] "Creating..."
  filterAiCreating: "Stvaranje...",
  // [Auto-translated] "Editing..."
  filterAiEditing: "Uređivanje...",
  // [Auto-translated] "AI could not make a filter. Try again."
  filterAiError: "AI nije mogao da napravi filter. Pokušaj ponovo.",
  // [Auto-translated] "AI could not make a filter of this description."
  filterAiEmpty: "AI nije mogao da napravi filter ovog opisa.",
  // [Auto-translated] "to select"
  keyboardHintSelectText: "da izaberete",
  // [Auto-translated] "to toggle"
  keyboardHintToggleText: "Da biste se prebacili",
  // [Auto-translated] "to navigate"
  keyboardHintNavigateText: "za navigaciju",
  // [Auto-translated] "to continue"
  keyboardHintContinueText: "Da nastavi",
  // [Auto-translated] "to submit"
  keyboardHintSubmitText: "Da podnese",
  // [Auto-translated] "or"
  keyboardHintOrText: "ili",
  // [Auto-translated] "for a new line"
  keyboardHintNewLineText: "za novu liniju",
  // [Auto-translated] "to next option"
  keyboardHintNextItemText: "na sledeću opciju",
  // [Auto-translated] "to move"
  keyboardHintMoveText: "da se kreće",
  // [Auto-translated] "to open"
  keyboardHintOpenText: "otvoriti",
  // [Auto-translated] "to close"
  keyboardHintCloseText: "zatvoriti"
};

setupLocale({ localeCode: "sr", strings: serbianStrings, nativeName: "srpski", englishName: "Serbian" });