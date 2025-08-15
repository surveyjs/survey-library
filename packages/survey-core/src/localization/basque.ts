import { setupLocale } from "survey-core";

export var basqueSurveyStrings = {
  // "Previous"
  pagePrevText: "Aurrekoa",
  // "Next"
  pageNextText: "Hurrengoa",
  // "Complete"
  completeText: "Bukatu",
  // "Preview"
  previewText: "Aurrebista",
  // "Edit"
  editText: "Editatu",
  // "Start"
  startSurveyText: "Hasi",
  // [Auto-translated] "Please leave a comment"
  commentText: "Mesedez, utzi iruzkin bat",
  // "Other (describe)"
  otherItemText: "Beste bat (zehaztu)",
  // "None"
  noneItemText: "Bat ere ez",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Erantzuteari uko egin",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Ez dakit",
  // "Select All"
  selectAllItemText: "Guztia hautatu",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Guztiaren aukeraketa bertan behera utzi",
  // "Page {0} of {1}"
  progressText: "{1}-(e)tik {0} orrialde",
  // [Auto-translated] "{0} of {1}"
  indexText: "{1} {0}",
  // "{0} of {1}"
  panelDynamicProgressText: "{0} errigistro {1}-(e)tik",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Erantzundako galderak {0}/{1}",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Ez dago orrialde bistaragarririk edo ez dago galderarik.",
  // "Thank you for completing the survey"
  completingSurvey: "Eskerrik asko galdetegia erantzuteagatik!",
  // "You have already completed this survey."
  completingSurveyBefore: "Gure datuek diote dagoeneko galdetegia erantzun duzula.",
  // "Loading Survey..."
  loadingSurvey: "Galdetegia kargatzen...",
  // "Select..."
  placeholder: "Hautatu...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Aukeratu...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Aukeratu...",
  // "value"
  value: "balioa",
  // "Response required."
  requiredError: "Mesedez, galdera erantzun.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Mesedez, gutxienez galdera bat erantzun.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Mesedez, errenkadako galdera guztiak erantzun.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Ilara bakoitzak balio bakarra izan behar du.",
  // "The value should be numeric."
  numericError: "Estimazioa zenbakizkoa izan behar du.",
  // "The value should not be less than {0}"
  minError: "Balioa ez da {0} baino txikiagoa izan behar",
  // "The value should not be greater than {0}"
  maxError: "Balioa ez da {0} baino handiagoa izan behar",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Ezin da zenbakirik egin.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Mesedez, gutxienez {0} karaktere erabili behar dira.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Mesedez, gehienez {0} karaktere erabili behar dira.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Mesedez, gehienez {0} eta gutxienez {1} karaktere erabili behar dira.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Mesedez, gutxienez {0} errenkada bete.",
  // "Please select at least {0} option(s)."
  minSelectError: "Mesedez, gutxienez {0} aukera hautatu.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Mesedez, {0} aukera baino gehiago ez hautatu.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "El '{0}' debe de ser igual o más de {1} y igual o menos de {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' {1} baino handiagoa edo berdin izan behar da",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' {1} baino txikiago edo berdin izan behar da",
  // "Please enter a valid e-mail address."
  invalidEmail: "Mesedez, baliozko emaila idatz ezazu.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "{0} adierazpenak 'egiazkoa' itzuli beharko luke.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Eskaerak '{0}' errorea itzuli du. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "La solicitud regresó vacío de data o la propiedad 'trayectoria' no es correcta",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Fitxategiaren tamaina ez da {0} baino handiagoa izan behar.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Artxiboak ezin dira kargatu. Gaineratu kontrolatzaile bat 'onUploadFiles' ekitaldirako.",
  // "Response required: enter another value."
  otherRequiredError: "Mesedez, beste estimazioa gehitu.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Zure fitxategia igotzen ari da. Mesedez, segundo batzuk itxaron eta saiatu berriro.",
  // "Loading..."
  loadingFile: "Kargatzen...",
  // "Choose file(s)..."
  chooseFile: "Fitxategia(k) hautatu...",
  // "No file selected"
  noFileChosen: "Ez da inolako fitxategirik hautatu",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Eraman artxibo bat hemen edo egin klik beheko botoian, kargatzeko artxibo bat aukeratzeko.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "¿Erregistroa borratu nahi al duzu?",
  // "This value should be unique."
  keyDuplicationError: "Balio hau bakarra izan behar du.",
  // "Add Column"
  addColumn: "Zutabe bat gehitu",
  // "Add Row"
  addRow: "Errenkada bat gehitu",
  // "Remove"
  removeRow: "Errenkada bat kendu",
  // "There are no rows."
  noRowsText: "Ez dago errenkadarik.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Fila {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Berria gehitu",
  // "Remove"
  removePanel: "Kendu",
  // [Auto-translated] "Show Details"
  showDetails: "Xehetasunak erakutsi",
  // [Auto-translated] "Hide Details"
  hideDetails: "Xehetasunak ezkutatu",
  // "item"
  choices_Item: "artikulua",
  // [Auto-translated] "Choice option"
  choices_Choice: "Aukeratzeko aukera",
  // "Column"
  matrix_column: "Zutabea",
  // "Row"
  matrix_row: "Errenkada",
  // "text"
  multipletext_itemname: "testua",
  // "The results are being saved on the server..."
  savingData: "Erantzunak zerbitzarian gordetzen ari dira...",
  // "An error occurred and we could not save the results."
  savingDataError: "Erroreren bat gertatu eta erantzunak ez dira zerbitzarian gorde ahal izan.",
  // "The results were saved successfully!"
  savingDataSuccess: "Erantzunak egoki gorde dira!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Erantzuna 64 KB-tik gorakoa da. Murriztu artxiboaren tamaina, eta berriro saiatu edo jarri harremanetan inkestaren jabearekin.",
  // "Try again"
  saveAgainButton: "Berriro saiatu.",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "seg",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "{0} erabili duzu orrialde honetan eta orotara {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Zuk {0} erabili duzu.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Orotara gastatu duzu.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "{0} gastatu duzu {1}-(e)tik orrialde honetan eta orotara {2} {3}-(e)tik.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "{0} gastatu duzu orrialde honetan {1}-(e)tik.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Zuk orotara {0} gastatu duzu {1}-(e)tik.",
  // "Clear"
  clearCaption: "Hustu",
  // [Auto-translated] "Select"
  selectCaption: "Aukeratu",
  // "Sign here"
  signaturePlaceHolder: "Sinatu hemen",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Sinadurarik gabe",
  // "Select File"
  chooseFileCaption: "Fitxategia hautatu",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Argazkia hartu",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Egin klik beheko botoian, kamerarekin argazki bat hartzeko.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Arrastatu eta askatu artxibo bat kamerarekin argazki bat kargatzeko edo hartzeko.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Artxiboa ordeztu",
  // "Remove this file"
  removeFileCaption: "Fitxategi hau ezabatu",
  // "Yes"
  booleanCheckedLabel: "Bai",
  // "No"
  booleanUncheckedLabel: "Ez",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Ziur zaude hurrengo fitxategia ezabatu nahi duzula: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Ziur al zaude fitxategi guztiak ezabatu nahi dituzula?",
  // "Question Title"
  questionTitlePatternText: "Galderaren izenburua",
  // "Cancel"
  modalCancelButtonText: "Ezeztatu",
  // "Apply"
  modalApplyButtonText: "Ezarri",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Idatzi bila...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Ez daturik erakusteko",
  // [Auto-translated] "Loading..."
  loadingPage: "Karga...",
  // [Auto-translated] "Loading..."
  loadingData: "Karga...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Oraindik ez sarrerarik.\nKlik beheko botoian klik egin sarrera berri bat eransteko.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Ez sarrerarik",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Panel berria",
  // [Auto-translated] "More"
  more: "Gehiago",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "Ados",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Aukera guztiak sailkapenerako aukeratzen dira",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Aukerak hemen dituzu sailkatzeko",
  // [Auto-translated] "OK"
  ok: "Ados",
  // [Auto-translated] "Cancel"
  cancel: "Ezeztatu",
  // "Create \"{0}\" item..."
  createCustomItem: "\"{0}\" artikulua sortzea...",
  // [Auto-translated] "Table of contents"
  toc: "Edukien taula",
  // [Auto-translated] "Progress bar"
  progressbar: "Aurrerapen barra"
};

setupLocale({ localeCode: "eu", strings: basqueSurveyStrings, nativeName: "euskara", englishName: "Basque" });