import { setupLocale } from "survey-core";

export var catalanSurveyStrings = {
  // "Previous"
  pagePrevText: "Anterior",
  // "Next"
  pageNextText: "Següent",
  // "Complete"
  completeText: "Complet",
  // [Auto-translated] "Preview"
  previewText: "Preestrena",
  // [Auto-translated] "Edit"
  editText: "Editar",
  // [Auto-translated] "Start"
  startSurveyText: "Començar",
  // [Auto-translated] "Please leave a comment"
  commentText: "Si us plau, deixa un comentari",
  // "Other (describe)"
  otherItemText: "Un altre (descrigui)",
  // [Auto-translated] "None"
  noneItemText: "Cap",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Negar-se a respondre",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "No sé",
  // [Auto-translated] "Select All"
  selectAllItemText: "Selecciona-ho tot",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Desselecciona-ho tot",
  // "Page {0} of {1}"
  progressText: "Pàgina {0} de {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} de {1}",
  // [Auto-translated] "{0} of {1}"
  panelDynamicProgressText: "{0} de {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panell {panelIndex}",
  // [Auto-translated] "Answered {0}/{1} questions"
  questionsProgressText: "Respostes {0}/{1} preguntes",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "No hi ha cap pàgina visible o pregunta a l'enquesta.",
  // "Thank you for completing the survey"
  completingSurvey: "Gràcies per completar l'enquesta!",
  // [Auto-translated] "Our records show that you have already completed this survey."
  completingSurveyBefore: "Els nostres registres mostren que ja heu completat aquesta enquesta.",
  // "Loading Survey..."
  loadingSurvey: "L'enquesta s'està carregant ...",
  // "Select..."
  placeholder: "Selecciona ...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Seleccionar...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Seleccionar...",
  // [Auto-translated] "value"
  value: "valor",
  // "Response required."
  requiredError: "Si us plau contesti la pregunta.",
  // [Auto-translated] "Response required: answer at least one question."
  requiredErrorInPanel: "Resposta necessària: respondre almenys una pregunta.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Si us plau contesti les preguntes de cada filera.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Cada fila ha de tenir un valor únic.",
  // "The value should be numeric."
  numericError: "L'estimació ha de ser numèrica.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "El valor no ha de ser inferior a {0}",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "El valor no ha de ser superior a {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "No es permeten números.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Si us plau entre almenys {0} símbols.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Si us plau entre menys de {0} símbols.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Si us plau entre més de {0} i menys de {1} símbols.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Si us plau ompli almenys {0} fileres.",
  // "Please select at least {0} option(s)."
  minSelectError: "Si us plau seleccioni almenys {0} variants.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Si us plau seleccioni no més de {0} variants.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "El '{0}' deu ser igual o més de {1} i igual o menys de {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "El '{0}' ha de ser igual o més de {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "El '{0}' ha de ser igual o menys de {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Si us plau afegiu un correu electrònic vàlid.",
  // [Auto-translated] "The expression: {0} should return 'true'."
  invalidExpression: "L'expressió: {0} ha de tornar 'veritable'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "La sol·licitud va tornar error '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "La sol·licitud va tornar buida de dates o la propietat 'trajectòria' no és correcta",
  // "The file size should not exceed {0}."
  exceedMaxSize: "La mida de l'arxiu no pot excedir {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "No es poden carregar fitxers. Afegiu un controlador per a l'esdeveniment 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Si us plau afegiu l'altra estimació.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "El seu arxiu s'està pujant. Si us plau esperi uns segons i intenteu-ho de nou.",
  // [Auto-translated] "Loading..."
  loadingFile: "Càrrega...",
  // [Auto-translated] "Choose file(s)..."
  chooseFile: "Trieu fitxer(s)...",
  // [Auto-translated] "No file chosen"
  noFileChosen: "No s'ha triat cap fitxer",
  // [Auto-translated] "Drag and drop a file here or click the button below and choose a file to upload."
  filePlaceholder: "Arrossegueu i deixeu anar un fitxer aquí o feu clic al botó següent i trieu un fitxer per carregar.",
  // [Auto-translated] "Do you want to delete the record?"
  confirmDelete: "Vols eliminar el registre?",
  // [Auto-translated] "This value should be unique."
  keyDuplicationError: "Aquest valor ha de ser únic.",
  // [Auto-translated] "Add Column"
  addColumn: "Afegeix una columna",
  // "Add Row"
  addRow: "Afegiu una filera",
  // "Remove"
  removeRow: "Eliminar una filera",
  // [Auto-translated] "There are no rows."
  noRowsText: "No hi ha files.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Fila {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // [Auto-translated] "Add new"
  addPanel: "Afegeix un nou",
  // [Auto-translated] "Remove"
  removePanel: "Treure",
  // [Auto-translated] "Show Details"
  showDetails: "Mostra els detalls",
  // [Auto-translated] "Hide Details"
  hideDetails: "Amaga els detalls",
  // [Auto-translated] "item"
  choices_Item: "ítem",
  // [Auto-translated] "Choice option"
  choices_Choice: "Opció d'elecció",
  // "Column"
  matrix_column: "Columna",
  // "Row"
  matrix_row: "Filera",
  // [Auto-translated] "text"
  multipletext_itemname: "SMS",
  // [Auto-translated] "The results are being saved on the server..."
  savingData: "Els resultats s'estan guardant al servidor...",
  // [Auto-translated] "An error occurred and we could not save the results."
  savingDataError: "S'ha produït un error i no hem pogut guardar els resultats.",
  // [Auto-translated] "The results were saved successfully!"
  savingDataSuccess: "Els resultats es van salvar amb èxit!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner."
  savingExceedSize: "La teva resposta supera els 64KB. Reduïu la mida dels fitxers i torneu-ho a provar o poseu-vos en contacte amb el propietari de l'enquesta.",
  // [Auto-translated] "Try again"
  saveAgainButton: "Prova una altra vegada",
  // [Auto-translated] "min"
  timerMin: "min",
  // [Auto-translated] "sec"
  timerSec: "Seg",
  // [Auto-translated] "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Heu passat {0} en aquesta pàgina i {1} en total.",
  // [Auto-translated] "You have spent {0} on this page."
  timerSpentPage: "Has passat {0} en aquesta pàgina.",
  // [Auto-translated] "You have spent {0} in total."
  timerSpentSurvey: "Has gastat {0} en total.",
  // [Auto-translated] "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Heu passat {0} de {1} en aquesta pàgina i {2} de {3} en total.",
  // [Auto-translated] "You have spent {0} of {1} on this page."
  timerLimitPage: "Has passat {0} de {1} en aquesta pàgina.",
  // [Auto-translated] "You have spent {0} of {1} in total."
  timerLimitSurvey: "Has gastat {0} d'{1} en total.",
  // [Auto-translated] "Clear"
  clearCaption: "Clar",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Inscriu-te aquí",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Sense signatura",
  // [Auto-translated] "Choose file"
  chooseFileCaption: "Tria un fitxer",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Fer foto",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Feu clic al botó següent per fer una foto amb la càmera.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Arrossegueu i deixeu anar o seleccioneu un fitxer per penjar-lo o fer-ne una foto amb la càmera.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Substitueix el fitxer",
  // [Auto-translated] "Remove this file"
  removeFileCaption: "Suprimeix aquest fitxer",
  // [Auto-translated] "Yes"
  booleanCheckedLabel: "Sí",
  // [Auto-translated] "No"
  booleanUncheckedLabel: "No",
  // [Auto-translated] "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Esteu segur que voleu eliminar aquest fitxer: {0}?",
  // [Auto-translated] "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Esteu segur que voleu eliminar tots els fitxers?",
  // [Auto-translated] "Question Title"
  questionTitlePatternText: "Títol de la pregunta",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Cancel·lar",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Aplicar",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Escriviu per cercar...",
  // [Auto-translated] "No data to display"
  emptyMessage: "No hi ha dades per mostrar",
  // [Auto-translated] "Loading..."
  loadingPage: "Càrrega...",
  // [Auto-translated] "Loading..."
  loadingData: "Càrrega...",
  // [Auto-translated] "There are no entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Encara no hi ha entrades.\nFeu clic al botó següent per afegir una entrada nova.",
  // [Auto-translated] "There are no entries."
  noEntriesReadonlyText: "No hi ha entrades.",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nou Panell",
  // [Auto-translated] "More"
  more: "Més",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "D'ACORD",
  // [Auto-translated] "All choices are ranked"
  selectToRankEmptyRankedAreaText: "Totes les opcions estan classificades",
  // [Auto-translated] "Drag and drop choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Arrossegueu i deixeu anar les opcions aquí per classificar-les",
  // [Auto-translated] "OK"
  ok: "D'ACORD",
  // [Auto-translated] "Cancel"
  cancel: "Cancel·lar",
  // "Create \"{0}\" item..."
  createCustomItem: "Crea un element \"{0}\"..."
};

setupLocale({ localeCode: "ca", strings: catalanSurveyStrings, nativeName: "català", englishName: "Catalan" });