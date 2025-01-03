import { setupLocale } from "survey-core";

export var catalanSurveyStrings = {
  pagePrevText: "Anterior",
  pageNextText: "Següent",
  completeText: "Complet",
  previewText: "Preestrena",
  editText: "Editar",
  startSurveyText: "Començar",
  otherItemText: "Un altre (descrigui)",
  noneItemText: "Cap",
  refuseItemText: "Negar-se a respondre",
  dontKnowItemText: "No sé",
  selectAllItemText: "Selecciona-ho tot",
  deselectAllItemText: "Desselecciona-ho tot",
  progressText: "Pàgina {0} de {1}",
  indexText: "{0} de {1}",
  panelDynamicProgressText: "{0} de {1}",
  panelDynamicTabTextFormat: "Panell {panelIndex}",
  questionsProgressText: "Respostes {0}/{1} preguntes",
  emptySurvey: "No hi ha cap pàgina visible o pregunta a l'enquesta.",
  completingSurvey: "Gràcies per completar l'enquesta!",
  completingSurveyBefore: "Els nostres registres mostren que ja heu completat aquesta enquesta.",
  loadingSurvey: "L'enquesta s'està carregant ...",
  placeholder: "Selecciona ...",
  ratingOptionsCaption: "Seleccionar...",
  value: "valor",
  requiredError: "Si us plau contesti la pregunta.",
  requiredErrorInPanel: "Resposta necessària: respondre almenys una pregunta.",
  requiredInAllRowsError: "Si us plau contesti les preguntes de cada filera.",
  eachRowUniqueError: "Cada fila ha de tenir un valor únic.",
  numericError: "L'estimació ha de ser numèrica.",
  minError: "El valor no ha de ser inferior a {0}",
  maxError: "El valor no ha de ser superior a {0}",
  textNoDigitsAllow: "No es permeten números.",
  textMinLength: "Si us plau entre almenys {0} símbols.",
  textMaxLength: "Si us plau entre menys de {0} símbols.",
  textMinMaxLength: "Si us plau entre més de {0} i menys de {1} símbols.",
  minRowCountError: "Si us plau ompli almenys {0} fileres.",
  minSelectError: "Si us plau seleccioni almenys {0} variants.",
  maxSelectError: "Si us plau seleccioni no més de {0} variants.",
  numericMinMax: "El '{0}' deu ser igual o més de {1} i igual o menys de {2}",
  numericMin: "El '{0}' ha de ser igual o més de {1}",
  numericMax: "El '{0}' ha de ser igual o menys de {1}",
  invalidEmail: "Si us plau afegiu un correu electrònic vàlid.",
  invalidExpression: "L'expressió: {0} ha de tornar 'veritable'.",
  urlRequestError: "La sol·licitud va tornar error '{0}'. {1}",
  urlGetChoicesError: "La sol·licitud va tornar buida de dates o la propietat 'trajectòria' no és correcta",
  exceedMaxSize: "La mida de l'arxiu no pot excedir {0}.",
  noUploadFilesHandler: "No es poden carregar fitxers. Afegiu un controlador per a l'esdeveniment 'onUploadFiles'.",
  otherRequiredError: "Si us plau afegiu l'altra estimació.",
  uploadingFile: "El seu arxiu s'està pujant. Si us plau esperi uns segons i intenteu-ho de nou.",
  loadingFile: "Càrrega...",
  chooseFile: "Trieu fitxer(s)...",
  noFileChosen: "No s'ha triat cap fitxer",
  filePlaceholder: "Arrossegueu i deixeu anar un fitxer aquí o feu clic al botó següent i trieu un fitxer per carregar.",
  confirmDelete: "Vols eliminar el registre?",
  keyDuplicationError: "Aquest valor ha de ser únic.",
  addColumn: "Afegeix una columna",
  addRow: "Afegiu una filera",
  removeRow: "Eliminar una filera",
  noRowsText: "No hi ha files.",
  addPanel: "Afegeix un nou",
  removePanel: "Treure",
  showDetails: "Mostra els detalls",
  hideDetails: "Amaga els detalls",
  choices_Item: "ítem",
  matrix_column: "Columna",
  matrix_row: "Filera",
  multipletext_itemname: "SMS",
  savingData: "Els resultats s'estan guardant al servidor...",
  savingDataError: "S'ha produït un error i no hem pogut guardar els resultats.",
  savingDataSuccess: "Els resultats es van salvar amb èxit!",
  savingExceedSize: "La teva resposta supera els 64KB. Reduïu la mida dels fitxers i torneu-ho a provar o poseu-vos en contacte amb el propietari de l'enquesta.",
  saveAgainButton: "Prova una altra vegada",
  timerMin: "min",
  timerSec: "Seg",
  timerSpentAll: "Heu passat {0} en aquesta pàgina i {1} en total.",
  timerSpentPage: "Has passat {0} en aquesta pàgina.",
  timerSpentSurvey: "Has gastat {0} en total.",
  timerLimitAll: "Heu passat {0} de {1} en aquesta pàgina i {2} de {3} en total.",
  timerLimitPage: "Has passat {0} de {1} en aquesta pàgina.",
  timerLimitSurvey: "Has gastat {0} d'{1} en total.",
  clearCaption: "Clar",
  signaturePlaceHolder: "Inscriu-te aquí",
  signaturePlaceHolderReadOnly: "Sense signatura",
  chooseFileCaption: "Tria un fitxer",
  takePhotoCaption: "Fer foto",
  photoPlaceholder: "Feu clic al botó següent per fer una foto amb la càmera.",
  fileOrPhotoPlaceholder: "Arrossegueu i deixeu anar o seleccioneu un fitxer per penjar-lo o fer-ne una foto amb la càmera.",
  replaceFileCaption: "Substitueix el fitxer",
  removeFileCaption: "Suprimeix aquest fitxer",
  booleanCheckedLabel: "Sí",
  booleanUncheckedLabel: "No",
  confirmRemoveFile: "Esteu segur que voleu eliminar aquest fitxer: {0}?",
  confirmRemoveAllFiles: "Esteu segur que voleu eliminar tots els fitxers?",
  questionTitlePatternText: "Títol de la pregunta",
  modalCancelButtonText: "Cancel·lar",
  modalApplyButtonText: "Aplicar",
  filterStringPlaceholder: "Escriviu per cercar...",
  emptyMessage: "No hi ha dades per mostrar",
  noEntriesText: "Encara no hi ha entrades.\nFeu clic al botó següent per afegir una entrada nova.",
  noEntriesReadonlyText: "No hi ha entrades.",
  tabTitlePlaceholder: "Nou Panell",
  more: "Més",
  tagboxDoneButtonCaption: "D'ACORD",
  selectToRankEmptyRankedAreaText: "Totes les opcions estan classificades",
  selectToRankEmptyUnrankedAreaText: "Arrossegueu i deixeu anar les opcions aquí per classificar-les",
  ok: "D'ACORD",
  cancel: "Cancel·lar"
};

setupLocale({ localeCode: "ca", strings: catalanSurveyStrings, nativeName: "català", englishName: "Catalan" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// previewText: "Preview" => "Preestrena"
// editText: "Edit" => "Editar"
// startSurveyText: "Start" => "Començar"
// noneItemText: "None" => "Cap"
// selectAllItemText: "Select All" => "Selecciona-ho tot"
// indexText: "{0} of {1}" => "{0} de {1}"
// panelDynamicProgressText: "{0} of {1}" => "{0} de {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panell {panelIndex}"
// questionsProgressText: "Answered {0}/{1} questions" => "Respostes {0}/{1} preguntes"
// completingSurveyBefore: "Our records show that you have already completed this survey." => "Els nostres registres mostren que ja heu completat aquesta enquesta."
// ratingOptionsCaption: "Select..." => "Seleccionar..."
// value: "value" => "valor"
// requiredErrorInPanel: "Response required: answer at least one question." => "Resposta necessària: respondre almenys una pregunta."
// minError: "The value should not be less than {0}" => "El valor no ha de ser inferior a {0}"
// maxError: "The value should not be greater than {0}" => "El valor no ha de ser superior a {0}"
// invalidExpression: "The expression: {0} should return 'true'." => "L'expressió: {0} ha de tornar 'veritable'."
// loadingFile: "Loading..." => "Càrrega..."
// chooseFile: "Choose file(s)..." => "Trieu fitxer(s)..."
// noFileChosen: "No file chosen" => "No s'ha triat cap fitxer"
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Arrossegueu i deixeu anar un fitxer aquí o feu clic al botó següent i trieu un fitxer per carregar."
// confirmDelete: "Do you want to delete the record?" => "Vols eliminar el registre?"
// keyDuplicationError: "This value should be unique." => "Aquest valor ha de ser únic."
// addColumn: "Add Column" => "Afegeix una columna"
// noRowsText: "There are no rows." => "No hi ha files."
// addPanel: "Add new" => "Afegeix un nou"
// removePanel: "Remove" => "Treure"
// choices_Item: "item" => "ítem"
// multipletext_itemname: "text" => "SMS"
// savingData: "The results are being saved on the server..." => "Els resultats s'estan guardant al servidor..."
// savingDataError: "An error occurred and we could not save the results." => "S'ha produït un error i no hem pogut guardar els resultats."
// savingDataSuccess: "The results were saved successfully!" => "Els resultats es van salvar amb èxit!"
// saveAgainButton: "Try again" => "Prova una altra vegada"
// timerMin: "min" => "min"
// timerSec: "sec" => "Seg"
// timerSpentAll: "You have spent {0} on this page and {1} in total." => "Heu passat {0} en aquesta pàgina i {1} en total."
// timerSpentPage: "You have spent {0} on this page." => "Has passat {0} en aquesta pàgina."
// timerSpentSurvey: "You have spent {0} in total." => "Has gastat {0} en total."
// timerLimitAll: "You have spent {0} of {1} on this page and {2} of {3} in total." => "Heu passat {0} de {1} en aquesta pàgina i {2} de {3} en total."
// timerLimitPage: "You have spent {0} of {1} on this page." => "Has passat {0} de {1} en aquesta pàgina."
// timerLimitSurvey: "You have spent {0} of {1} in total." => "Has gastat {0} d'{1} en total."
// clearCaption: "Clear" => "Clar"
// signaturePlaceHolder: "Sign here" => "Inscriu-te aquí"
// chooseFileCaption: "Choose file" => "Tria un fitxer"
// removeFileCaption: "Remove this file" => "Suprimeix aquest fitxer"
// booleanCheckedLabel: "Yes" => "Sí"
// booleanUncheckedLabel: "No" => "No"
// confirmRemoveFile: "Are you sure that you want to remove this file: {0}?" => "Esteu segur que voleu eliminar aquest fitxer: {0}?"
// confirmRemoveAllFiles: "Are you sure that you want to remove all files?" => "Esteu segur que voleu eliminar tots els fitxers?"
// questionTitlePatternText: "Question Title" => "Títol de la pregunta"
// modalCancelButtonText: "Cancel" => "Cancel·lar"
// modalApplyButtonText: "Apply" => "Aplicar"
// filterStringPlaceholder: "Type to search..." => "Escriviu per cercar..."
// emptyMessage: "No data to display" => "No hi ha dades per mostrar"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Encara no hi ha entrades.\nFeu clic al botó següent per afegir una entrada nova."
// noEntriesReadonlyText: "There are no entries." => "No hi ha entrades."
// more: "More" => "Més"
// tagboxDoneButtonCaption: "OK" => "D'ACORD"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Totes les opcions estan classificades"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Arrossegueu i deixeu anar les opcions aquí per classificar-les"// takePhotoCaption: "Take Photo" => "Fer foto"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Feu clic al botó següent per fer una foto amb la càmera."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Arrossegueu i deixeu anar o seleccioneu un fitxer per penjar-lo o fer-ne una foto amb la càmera."
// replaceFileCaption: "Replace file" => "Substitueix el fitxer"// eachRowUniqueError: "Each row must have a unique value." => "Cada fila ha de tenir un valor únic."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "No es poden carregar fitxers. Afegiu un controlador per a l'esdeveniment 'onUploadFiles'."
// showDetails: "Show Details" => "Mostra els detalls"
// hideDetails: "Hide Details" => "Amaga els detalls"
// ok: "OK" => "D'ACORD"
// cancel: "Cancel" => "Cancel·lar"
// refuseItemText: "Refuse to answer" => "Negar-se a respondre"
// dontKnowItemText: "Don't know" => "No sé"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "La teva resposta supera els 64KB. Reduïu la mida dels fitxers i torneu-ho a provar o poseu-vos en contacte amb el propietari de l'enquesta."
// signaturePlaceHolderReadOnly: "No signature" => "Sense signatura"// tabTitlePlaceholder: "New Panel" => "Nou Panell"// deselectAllItemText: "Deselect all" => "Desselecciona-ho tot"
// textNoDigitsAllow: "Numbers are not allowed." => "No es permeten números."