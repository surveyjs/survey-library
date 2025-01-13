import { setupLocale } from "survey-core";

export var basqueSurveyStrings = {
  pagePrevText: "Aurrekoa",
  pageNextText: "Hurrengoa",
  completeText: "Bukatu",
  previewText: "Aurrebista",
  editText: "Editatu",
  startSurveyText: "Hasi",
  otherItemText: "Beste bat (zehaztu)",
  noneItemText: "Bat ere ez",
  refuseItemText: "Erantzuteari uko egin",
  dontKnowItemText: "Ez dakit",
  selectAllItemText: "Guztia hautatu",
  deselectAllItemText: "Guztiaren aukeraketa bertan behera utzi",
  progressText: "{1}-(e)tik {0} orrialde",
  indexText: "{1} {0}",
  panelDynamicProgressText: "{0} errigistro {1}-(e)tik",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "Erantzundako galderak {0}/{1}",
  emptySurvey: "Ez dago orrialde bistaragarririk edo ez dago galderarik.",
  completingSurvey: "Eskerrik asko galdetegia erantzuteagatik!",
  completingSurveyBefore: "Gure datuek diote dagoeneko galdetegia erantzun duzula.",
  loadingSurvey: "Galdetegia kargatzen...",
  placeholder: "Hautatu...",
  ratingOptionsCaption: "Aukeratu...",
  value: "balioa",
  requiredError: "Mesedez, galdera erantzun.",
  requiredErrorInPanel: "Mesedez, gutxienez galdera bat erantzun.",
  requiredInAllRowsError: "Mesedez, errenkadako galdera guztiak erantzun.",
  eachRowUniqueError: "Ilara bakoitzak balio bakarra izan behar du.",
  numericError: "Estimazioa zenbakizkoa izan behar du.",
  minError: "Balioa ez da {0} baino txikiagoa izan behar",
  maxError: "Balioa ez da {0} baino handiagoa izan behar",
  textNoDigitsAllow: "Ezin da zenbakirik egin.",
  textMinLength: "Mesedez, gutxienez {0} karaktere erabili behar dira.",
  textMaxLength: "Mesedez, gehienez {0} karaktere erabili behar dira.",
  textMinMaxLength: "Mesedez, gehienez {0} eta gutxienez {1} karaktere erabili behar dira.",
  minRowCountError: "Mesedez, gutxienez {0} errenkada bete.",
  minSelectError: "Mesedez, gutxienez {0} aukera hautatu.",
  maxSelectError: "Mesedez, {0} aukera baino gehiago ez hautatu.",
  numericMinMax: "El '{0}' debe de ser igual o más de {1} y igual o menos de {2}",
  numericMin: "'{0}' {1} baino handiagoa edo berdin izan behar da",
  numericMax: "'{0}' {1} baino txikiago edo berdin izan behar da",
  invalidEmail: "Mesedez, baliozko emaila idatz ezazu.",
  invalidExpression: "{0} adierazpenak 'egiazkoa' itzuli beharko luke.",
  urlRequestError: "Eskaerak '{0}' errorea itzuli du. {1}",
  urlGetChoicesError: "La solicitud regresó vacío de data o la propiedad 'trayectoria' no es correcta",
  exceedMaxSize: "Fitxategiaren tamaina ez da {0} baino handiagoa izan behar.",
  noUploadFilesHandler: "Artxiboak ezin dira kargatu. Gaineratu kontrolatzaile bat 'onUploadFiles' ekitaldirako.",
  otherRequiredError: "Mesedez, beste estimazioa gehitu.",
  uploadingFile: "Zure fitxategia igotzen ari da. Mesedez, segundo batzuk itxaron eta saiatu berriro.",
  loadingFile: "Kargatzen...",
  chooseFile: "Fitxategia(k) hautatu...",
  noFileChosen: "Ez da inolako fitxategirik hautatu",
  filePlaceholder: "Arrastatu eta askatu artxibo bat hemen edo klik egin beheko botoian eta aukeratu artxibo bat kargatzeko.",
  confirmDelete: "¿Erregistroa borratu nahi al duzu?",
  keyDuplicationError: "Balio hau bakarra izan behar du.",
  addColumn: "Zutabe bat gehitu",
  addRow: "Errenkada bat gehitu",
  removeRow: "Errenkada bat kendu",
  noRowsText: "Ez dago errenkadarik.",
  addPanel: "Berria gehitu",
  removePanel: "Kendu",
  showDetails: "Xehetasunak erakutsi",
  hideDetails: "Xehetasunak ezkutatu",
  choices_Item: "artikulua",
  matrix_column: "Zutabea",
  matrix_row: "Errenkada",
  multipletext_itemname: "testua",
  savingData: "Erantzunak zerbitzarian gordetzen ari dira...",
  savingDataError: "Erroreren bat gertatu eta erantzunak ez dira zerbitzarian gorde ahal izan.",
  savingDataSuccess: "Erantzunak egoki gorde dira!",
  savingExceedSize: "Erantzuna 64 KB-tik gorakoa da. Murriztu artxiboaren tamaina, eta berriro saiatu edo jarri harremanetan inkesta baten jabearekin.",
  saveAgainButton: "Berriro saiatu.",
  timerMin: "min",
  timerSec: "seg",
  timerSpentAll: "{0} erabili duzu orrialde honetan eta orotara {1}.",
  timerSpentPage: "Zuk {0} erabili duzu.",
  timerSpentSurvey: "Orotara gastatu duzu.",
  timerLimitAll: "{0} gastatu duzu {1}-(e)tik orrialde honetan eta orotara {2} {3}-(e)tik.",
  timerLimitPage: "{0} gastatu duzu orrialde honetan {1}-(e)tik.",
  timerLimitSurvey: "Zuk orotara {0} gastatu duzu {1}-(e)tik.",
  clearCaption: "Hustu",
  signaturePlaceHolder: "Sinatu hemen",
  signaturePlaceHolderReadOnly: "Sinadurarik gabe",
  chooseFileCaption: "Fitxategia hautatu",
  takePhotoCaption: "Argazkia hartu",
  photoPlaceholder: "Egin klik beheko botoian, kamerarekin argazki bat hartzeko.",
  fileOrPhotoPlaceholder: "Arrastatu eta askatu artxibo bat kamerarekin argazki bat kargatzeko edo hartzeko.",
  replaceFileCaption: "Artxiboa ordeztu",
  removeFileCaption: "Fitxategi hau ezabatu",
  booleanCheckedLabel: "Bai",
  booleanUncheckedLabel: "Ez",
  confirmRemoveFile: "Ziur zaude hurrengo fitxategia ezabatu nahi duzula: {0}?",
  confirmRemoveAllFiles: "Ziur al zaude fitxategi guztiak ezabatu nahi dituzula?",
  questionTitlePatternText: "Galderaren izenburua",
  modalCancelButtonText: "Ezeztatu",
  modalApplyButtonText: "Ezarri",
  filterStringPlaceholder: "Idatzi bila...",
  emptyMessage: "Ez daturik erakusteko",
  noEntriesText: "Oraindik ez sarrerarik.\nKlik beheko botoian klik egin sarrera berri bat eransteko.",
  noEntriesReadonlyText: "Ez sarrerarik.",
  tabTitlePlaceholder: "Panel berria",
  more: "Gehiago",
  tagboxDoneButtonCaption: "Ados",
  selectToRankEmptyRankedAreaText: "Aukera guztiak sailkatuta daude",
  selectToRankEmptyUnrankedAreaText: "Arrastaka eta askatzen ditu hemen sailkatzeko",
  ok: "Ados",
  cancel: "Ezeztatu"
};

setupLocale({ localeCode: "eu", strings: basqueSurveyStrings, nativeName: "euskara", englishName: "Basque" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// indexText: "{0} of {1}" => "{1} {0}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// ratingOptionsCaption: "Select..." => "Aukeratu..."
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Arrastatu eta askatu artxibo bat hemen edo klik egin beheko botoian eta aukeratu artxibo bat kargatzeko."
// filterStringPlaceholder: "Type to search..." => "Idatzi bila..."
// emptyMessage: "No data to display" => "Ez daturik erakusteko"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Oraindik ez sarrerarik.\nKlik beheko botoian klik egin sarrera berri bat eransteko."
// noEntriesReadonlyText: "There are no entries." => "Ez sarrerarik."
// more: "More" => "Gehiago"
// tagboxDoneButtonCaption: "OK" => "Ados"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Aukera guztiak sailkatuta daude"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Arrastaka eta askatzen ditu hemen sailkatzeko"// takePhotoCaption: "Take Photo" => "Argazkia hartu"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Egin klik beheko botoian, kamerarekin argazki bat hartzeko."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Arrastatu eta askatu artxibo bat kamerarekin argazki bat kargatzeko edo hartzeko."
// replaceFileCaption: "Replace file" => "Artxiboa ordeztu"// eachRowUniqueError: "Each row must have a unique value." => "Ilara bakoitzak balio bakarra izan behar du."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Artxiboak ezin dira kargatu. Gaineratu kontrolatzaile bat 'onUploadFiles' ekitaldirako."
// showDetails: "Show Details" => "Xehetasunak erakutsi"
// hideDetails: "Hide Details" => "Xehetasunak ezkutatu"
// ok: "OK" => "Ados"
// cancel: "Cancel" => "Ezeztatu"
// refuseItemText: "Refuse to answer" => "Erantzuteari uko egin"
// dontKnowItemText: "Don't know" => "Ez dakit"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Erantzuna 64 KB-tik gorakoa da. Murriztu artxiboaren tamaina, eta berriro saiatu edo jarri harremanetan inkesta baten jabearekin."
// signaturePlaceHolderReadOnly: "No signature" => "Sinadurarik gabe"// tabTitlePlaceholder: "New Panel" => "Panel berria"// deselectAllItemText: "Deselect all" => "Guztiaren aukeraketa bertan behera utzi"
// textNoDigitsAllow: "Numbers are not allowed." => "Ezin da zenbakirik egin."