import { setupLocale } from "survey-core";

export var finnishSurveyStrings = {
  // "Previous"
  pagePrevText: "Edellinen",
  // "Next"
  pageNextText: "Seuraava",
  // "Complete"
  completeText: "Valmis",
  // "Preview"
  previewText: "Esikatselu",
  // "Edit"
  editText: "Muokkaa",
  // "Start"
  startSurveyText: "Aloita",
  // [Auto-translated] "Please leave a comment"
  commentText: "Jätä kommentti",
  // "Other (describe)"
  otherItemText: "Muu (tarkenna)",
  // "None"
  noneItemText: "Ei mitään",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Kieltäydy vastaamasta",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Ei tiedä",
  // "Select All"
  selectAllItemText: "Valitse kaikki",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Poista kaikki valinnat",
  // "Page {0} of {1}"
  progressText: "Sivu {0} / {1}",
  // "{0} of {1}"
  indexText: "{0} / {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Osio {0} / {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Paneeli {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Olet vastannut {0} / {1} kysymykseen.",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Tässä kyselyssä ei ole yhtään näkyvillä olevaa sivua tai kysymystä.",
  // "Thank you for completing the survey"
  completingSurvey: "Kiitos kyselyyn vastaamisesta!",
  // "You have already completed this survey."
  completingSurveyBefore: "Tietojemme mukaan olet jo suorittanut tämän kyselyn.",
  // "Loading Survey..."
  loadingSurvey: "Kyselyä ladataan palvelimelta...",
  // "Select..."
  placeholder: "Valitse...",
  // "Select..."
  ratingOptionsCaption: "Arvioi napauttamalla tätä...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Valitse...",
  // "value"
  value: "arvo",
  // "Response required."
  requiredError: "Vastaa kysymykseen, kiitos.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Vastaa ainakin yhteen kysymykseen.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Vastaa kysymyksiin kaikilla riveillä.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Jokaisella rivillä on oltava yksilöllinen arvo.",
  // "The value should be numeric."
  numericError: "Arvon tulee olla numeerinen.",
  // "The value should not be less than {0}"
  minError: "Arvo ei saa olla pienempi kuin {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Syötä arvo, joka vastaa {0} askelkokoa.",
  // "The value should not be greater than {0}"
  maxError: "Arvo ei saa olla suurempi kuin {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Numerot eivät ole sallittuja.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Syötä vähintään {0} merkkiä.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Älä syötä yli {0} merkkiä.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Syötä vähintään {0} ja enintään {1} merkkiä.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Täytä vähintään {0} riviä.",
  // "Please select at least {0} option(s)."
  minSelectError: "Valitse vähintään {0} vaihtoehtoa.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Valitse enintään {0} vaihtoehtoa.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Luvun '{0}' tulee olla vähintään {1} ja korkeintaan {2}.",
  // "The '{0}' should be at least {1}"
  numericMin: "Luvun '{0}' tulee olla vähintään {1}.",
  // "The '{0}' should be at most {1}"
  numericMax: "Luvun '{0}' tulee olla korkeintaan {1}.",
  // "Please enter a valid e-mail address."
  invalidEmail: "Syötä validi sähköpostiosoite.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Lausekkeen: {0} pitäisi palauttaa 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Pyyntö palautti virheen {0}. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Pyyntö palautti tyhjän tiedoston tai 'path'-asetus on väärä",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Tiedoston koko ei saa olla suurempi kuin {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Tiedostojen enimmäismäärä, jonka voit ladata, on {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Tiedostoja ei voi ladata. Lisää käsittelijä onUploadFiles-tapahtumalle.",
  // "Response required: enter another value."
  otherRequiredError: "Tarkenna vastaustasi tekstikenttään.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Tiedostoa lähetetään. Odota muutama sekunti ja yritä uudelleen.",
  // "Loading..."
  loadingFile: "Ladataan...",
  // "Choose file(s)..."
  chooseFile: "Valitse tiedosto(t)...",
  // "No file selected"
  noFileChosen: "Ei tiedostoa valittuna",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Pudota tiedosto tähän tai lataa tiedosto napsauttamalla alla olevaa painiketta.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Haluatko poistaa osion?",
  // "This value should be unique."
  keyDuplicationError: "Tämä arvo on jo käytössä. Syötä toinen arvo.",
  // "Add Column"
  addColumn: "Lisää sarake",
  // "Add Row"
  addRow: "Lisää rivi",
  // "Remove"
  removeRow: "Poista",
  // "There are no rows."
  noRowsText: "Ei rivejä",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Rivi {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Lisää uusi",
  // "Remove"
  removePanel: "Poista",
  // [Auto-translated] "Show Details"
  showDetails: "Näytä tiedot",
  // [Auto-translated] "Hide Details"
  hideDetails: "Piilota tiedot",
  // "item"
  choices_Item: "kohde",
  // [Auto-translated] "Choice option"
  choices_Choice: "Valintavaihtoehto",
  // "Column"
  matrix_column: "Sarake",
  // "Row"
  matrix_row: "Rivi",
  // "text"
  multipletext_itemname: "teksti",
  // "The results are being saved on the server..."
  savingData: "Tietoja tallennetaan palvelimelle...",
  // "An error occurred and we could not save the results."
  savingDataError: "Tapahtui virhe, emmekä voineet tallentaa kyselyn tietoja.",
  // "The results were saved successfully!"
  savingDataSuccess: "Tiedot tallennettiin onnistuneesti!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Vastauksesi ylittää 64 kt. Pienennä tiedostojesi kokoa ja yritä uudelleen tai ota yhteyttä kyselyn omistajaan.",
  // "Try again"
  saveAgainButton: "Yritä uudelleen",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Olet käyttänyt {0} tällä sivulla ja yhteensä {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Olet käyttänyt {0} tällä sivulla.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Olet käyttänyt yhteensä {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Olet käyttänyt tällä sivulla {0} / {1} ja yhteensä {2} / {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Olet käyttänyt {0} / {1} tällä sivulla.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Olet käyttänyt yhteensä {0} / {1}.",
  // "Clear"
  clearCaption: "Tyhjennä",
  // [Auto-translated] "Select"
  selectCaption: "Valikoida",
  // "Sign here"
  signaturePlaceHolder: "Allekirjoita tähän",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Ei allekirjoitusta",
  // "Select File"
  chooseFileCaption: "Valitse tiedosto",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Ota valokuva",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Napsauta alla olevaa painiketta ottaaksesi valokuvan kameralla.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Vedä ja pudota tai valitse ladattava tiedosto tai ota valokuva kameralla.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Korvaa tiedosto",
  // "Remove this file"
  removeFileCaption: "Poista tämä tiedosto",
  // "Yes"
  booleanCheckedLabel: "Kyllä",
  // "No"
  booleanUncheckedLabel: "Ei",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Haluatko varmasti poistaa tämän tiedoston: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Haluatko varmasti poistaa kaikki tiedostot?",
  // "Question Title"
  questionTitlePatternText: "Kysymyksen otsikko",
  // "Cancel"
  modalCancelButtonText: "Peruuta",
  // "Apply"
  modalApplyButtonText: "Käytä",
  // "Type to search..."
  filterStringPlaceholder: "Hae kirjoittamalla...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Ei näytettäviä tietoja",
  // [Auto-translated] "Loading..."
  loadingPage: "Latautuu...",
  // [Auto-translated] "Loading..."
  loadingData: "Latautuu...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Merkintöjä ei ole vielä.\nLisää uusi merkintä napsauttamalla alla olevaa painiketta.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Ei merkintöjä",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Uusi paneeli",
  // [Auto-translated] "More"
  more: "Enemmän",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "Ok",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Kaikki valinnat valitaan paremmuusjärjestykseen",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Vedä valinnat tähän asettaaksesi ne paremmuusjärjestykseen",
  // [Auto-translated] "OK"
  ok: "Ok",
  // [Auto-translated] "Cancel"
  cancel: "Peru",
  // "Create \"{0}\" item..."
  createCustomItem: "Luo \"{0}\"-kohde...",
  // [Auto-translated] "Table of contents"
  toc: "Sisällysluettelo",
  // [Auto-translated] "Progress bar"
  progressbar: "Edistymispalkki"
};

setupLocale({ localeCode: "fi", strings: finnishSurveyStrings, nativeName: "suomi", englishName: "Finnish" });