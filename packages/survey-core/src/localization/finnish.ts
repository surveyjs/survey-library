import { setupLocale } from "survey-core";

export var finnishSurveyStrings = {
  pagePrevText: "Edellinen",
  pageNextText: "Seuraava",
  completeText: "Valmis",
  previewText: "Esikatselu",
  editText: "Muokkaa",
  startSurveyText: "Aloita",
  otherItemText: "Muu (tarkenna)",
  noneItemText: "Ei mitään",
  refuseItemText: "Kieltäydy vastaamasta",
  dontKnowItemText: "Ei tiedä",
  selectAllItemText: "Valitse kaikki",
  deselectAllItemText: "Poista kaikkien valinta",
  progressText: "Sivu {0} / {1}",
  indexText: "{0} / {1}",
  panelDynamicProgressText: "Osio {0} / {1}",
  panelDynamicTabTextFormat: "Paneeli {panelIndex}",
  questionsProgressText: "Olet vastannut {0} / {1} kysymykseen.",
  emptySurvey: "Tässä kyselyssä ei ole yhtään näkyvillä olevaa sivua tai kysymystä.",
  completingSurvey: "Kiitos kyselyyn vastaamisesta!",
  completingSurveyBefore: "Tietojemme mukaan olet jo suorittanut tämän kyselyn.",
  loadingSurvey: "Kyselyä ladataan palvelimelta...",
  placeholder: "Valitse...",
  ratingOptionsCaption: "Arvioi napauttamalla tätä...",
  value: "arvo",
  requiredError: "Vastaa kysymykseen, kiitos.",
  requiredErrorInPanel: "Vastaa ainakin yhteen kysymykseen.",
  requiredInAllRowsError: "Vastaa kysymyksiin kaikilla riveillä.",
  eachRowUniqueError: "Jokaisella rivillä on oltava yksilöllinen arvo.",
  numericError: "Arvon tulee olla numeerinen.",
  minError: "Arvo ei saa olla pienempi kuin {0}",
  maxError: "Arvo ei saa olla suurempi kuin {0}",
  textNoDigitsAllow: "Numerot eivät ole sallittuja.",
  textMinLength: "Syötä vähintään {0} merkkiä.",
  textMaxLength: "Älä syötä yli {0} merkkiä.",
  textMinMaxLength: "Syötä vähintään {0} ja enintään {1} merkkiä.",
  minRowCountError: "Täytä vähintään {0} riviä.",
  minSelectError: "Valitse vähintään {0} vaihtoehtoa.",
  maxSelectError: "Valitse enintään {0} vaihtoehtoa.",
  numericMinMax: "Luvun '{0}' tulee olla vähintään {1} ja korkeintaan {2}.",
  numericMin: "Luvun '{0}' tulee olla vähintään {1}.",
  numericMax: "Luvun '{0}' tulee olla korkeintaan {1}.",
  invalidEmail: "Syötä validi sähköpostiosoite.",
  invalidExpression: "Lausekkeen: {0} pitäisi palauttaa 'true'.",
  urlRequestError: "Pyyntö palautti virheen {0}. {1}",
  urlGetChoicesError: "Pyyntö palautti tyhjän tiedoston tai 'path'-asetus on väärä",
  exceedMaxSize: "Tiedoston koko ei saa olla suurempi kuin {0}.",
  noUploadFilesHandler: "Tiedostoja ei voi ladata. Lisää käsittelijä onUploadFiles-tapahtumalle.",
  otherRequiredError: "Tarkenna vastaustasi tekstikenttään.",
  uploadingFile: "Tiedostoa lähetetään. Odota muutama sekunti ja yritä uudelleen.",
  loadingFile: "Ladataan...",
  chooseFile: "Valitse tiedosto(t)...",
  noFileChosen: "Ei tiedostoa valittuna",
  filePlaceholder: "Pudota tiedosto tähän tai lataa tiedosto napsauttamalla alla olevaa painiketta.",
  confirmDelete: "Haluatko poistaa osion?",
  keyDuplicationError: "Tämä arvo on jo käytössä. Syötä toinen arvo.",
  addColumn: "Lisää sarake",
  addRow: "Lisää rivi",
  removeRow: "Poista",
  noRowsText: "Ei rivejä",
  addPanel: "Lisää uusi",
  removePanel: "Poista",
  showDetails: "Näytä tiedot",
  hideDetails: "Piilota tiedot",
  choices_Item: "kohde",
  matrix_column: "Sarake",
  matrix_row: "Rivi",
  multipletext_itemname: "teksti",
  savingData: "Tietoja tallennetaan palvelimelle...",
  savingDataError: "Tapahtui virhe, emmekä voineet tallentaa kyselyn tietoja.",
  savingDataSuccess: "Tiedot tallennettiin onnistuneesti!",
  savingExceedSize: "Vastauksesi ylittää 64 kt. Pienennä tiedostojesi kokoa ja yritä uudelleen tai ota yhteyttä kyselyn omistajaan.",
  saveAgainButton: "Yritä uudelleen",
  timerMin: "min",
  timerSec: "sek",
  timerSpentAll: "Olet käyttänyt {0} tällä sivulla ja yhteensä {1}.",
  timerSpentPage: "Olet käyttänyt {0} tällä sivulla.",
  timerSpentSurvey: "Olet käyttänyt yhteensä {0}.",
  timerLimitAll: "Olet käyttänyt tällä sivulla {0} / {1} ja yhteensä {2} / {3}.",
  timerLimitPage: "Olet käyttänyt {0} / {1} tällä sivulla.",
  timerLimitSurvey: "Olet käyttänyt yhteensä {0} / {1}.",
  clearCaption: "Tyhjennä",
  signaturePlaceHolder: "Allekirjoita tähän",
  signaturePlaceHolderReadOnly: "Ei allekirjoitusta",
  chooseFileCaption: "Valitse tiedosto",
  takePhotoCaption: "Ota valokuva",
  photoPlaceholder: "Napsauta alla olevaa painiketta ottaaksesi valokuvan kameralla.",
  fileOrPhotoPlaceholder: "Vedä ja pudota tai valitse ladattava tiedosto tai ota valokuva kameralla.",
  replaceFileCaption: "Korvaa tiedosto",
  removeFileCaption: "Poista tämä tiedosto",
  booleanCheckedLabel: "Kyllä",
  booleanUncheckedLabel: "Ei",
  confirmRemoveFile: "Haluatko varmasti poistaa tämän tiedoston: {0}?",
  confirmRemoveAllFiles: "Haluatko varmasti poistaa kaikki tiedostot?",
  questionTitlePatternText: "Kysymyksen otsikko",
  modalCancelButtonText: "Peruuta",
  modalApplyButtonText: "Käytä",
  filterStringPlaceholder: "Hae kirjoittamalla...",
  emptyMessage: "Ei näytettäviä tietoja",
  noEntriesText: "Merkintöjä ei ole vielä.\nLisää uusi merkintä napsauttamalla alla olevaa painiketta.",
  noEntriesReadonlyText: "Merkintöjä ei ole.",
  tabTitlePlaceholder: "Uusi paneeli",
  more: "Enemmän",
  tagboxDoneButtonCaption: "OKEI",
  selectToRankEmptyRankedAreaText: "Kaikki valinnat asetetaan paremmuusjärjestykseen",
  selectToRankEmptyUnrankedAreaText: "Vedä ja pudota vaihtoehdot tähän luokitellaksesi ne",
  ok: "OKEI",
  cancel: "Perua"
};

setupLocale({ localeCode: "fi", strings: finnishSurveyStrings, nativeName: "suomi", englishName: "Finnish" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Paneeli {panelIndex}"
// emptyMessage: "No data to display" => "Ei näytettäviä tietoja"
// noEntriesReadonlyText: "There are no entries." => "Merkintöjä ei ole."
// more: "More" => "Enemmän"
// tagboxDoneButtonCaption: "OK" => "OKEI"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Kaikki valinnat asetetaan paremmuusjärjestykseen"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Vedä ja pudota vaihtoehdot tähän luokitellaksesi ne"// takePhotoCaption: "Take Photo" => "Ota valokuva"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Napsauta alla olevaa painiketta ottaaksesi valokuvan kameralla."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Vedä ja pudota tai valitse ladattava tiedosto tai ota valokuva kameralla."
// replaceFileCaption: "Replace file" => "Korvaa tiedosto"// eachRowUniqueError: "Each row must have a unique value." => "Jokaisella rivillä on oltava yksilöllinen arvo."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Tiedostoja ei voi ladata. Lisää käsittelijä onUploadFiles-tapahtumalle."
// showDetails: "Show Details" => "Näytä tiedot"
// hideDetails: "Hide Details" => "Piilota tiedot"
// ok: "OK" => "OKEI"
// cancel: "Cancel" => "Perua"
// refuseItemText: "Refuse to answer" => "Kieltäydy vastaamasta"
// dontKnowItemText: "Don't know" => "Ei tiedä"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Vastauksesi ylittää 64 kt. Pienennä tiedostojesi kokoa ja yritä uudelleen tai ota yhteyttä kyselyn omistajaan."
// signaturePlaceHolderReadOnly: "No signature" => "Ei allekirjoitusta"// tabTitlePlaceholder: "New Panel" => "Uusi paneeli"// deselectAllItemText: "Deselect all" => "Poista kaikkien valinta"
// textNoDigitsAllow: "Numbers are not allowed." => "Numerot eivät ole sallittuja."