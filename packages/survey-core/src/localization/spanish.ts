import { setupLocale } from "survey-core";

export var spanishSurveyStrings = {
  pagePrevText: "Anterior",
  pageNextText: "Siguiente",
  completeText: "Completar",
  previewText: "Vista previa",
  editText: "Edita",
  startSurveyText: "Comienza",
  otherItemText: "Otro (describa)",
  noneItemText: "Ninguno",
  refuseItemText: "Negarse a responder",
  dontKnowItemText: "No sé",
  selectAllItemText: "Seleccionar todo",
  deselectAllItemText: "Anular la selección de todo",
  progressText: "Página {0} de {1}",
  indexText: "{0} de {1}",
  panelDynamicProgressText: "Registro {0} de {1}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "Respondió a {0}/{1} preguntas",
  emptySurvey: "No hay página visible o pregunta en la encuesta.",
  completingSurvey: "¡Gracias por completar la encuesta!",
  completingSurveyBefore: "Nuestros registros muestran que ya ha completado esta encuesta.",
  loadingSurvey: "La encuesta está cargando...",
  placeholder: "Seleccione...",
  ratingOptionsCaption: "Toca aquí para calificar...",
  value: "valor",
  requiredError: "Por favor conteste la pregunta.",
  requiredErrorInPanel: "Por favor, responda al menos una pregunta.",
  requiredInAllRowsError: "Por favor conteste las preguntas en cada hilera.",
  eachRowUniqueError: "Cada fila debe tener un valor único.",
  numericError: "La estimación debe ser numérica.",
  minError: "La estimación no debe ser menor que {0}",
  maxError: "La estimación no debe ser mayor que {0}",
  textNoDigitsAllow: "No se permiten números.",
  textMinLength: "Por favor entre por lo menos {0} símbolos.",
  textMaxLength: "Por favor entre menos de {0} símbolos.",
  textMinMaxLength: "Por favor entre más de {0} y menos de {1} símbolos.",
  minRowCountError: "Por favor llene por lo menos {0} hileras.",
  minSelectError: "Por favor seleccione por lo menos {0} variantes.",
  maxSelectError: "Por favor seleccione no más de {0} variantes.",
  numericMinMax: "El '{0}' debe de ser igual o más de {1} y igual o menos de {2}",
  numericMin: "El '{0}' debe ser igual o más de {1}",
  numericMax: "El '{0}' debe ser igual o menos de {1}",
  invalidEmail: "Por favor agregue un correo electrónico válido.",
  invalidExpression: "La expresión: {0} debería devolver 'verdadero'.",
  urlRequestError: "La solicitud regresó error '{0}'. {1}",
  urlGetChoicesError: "La solicitud regresó vacío de data o la propiedad 'trayectoria' no es correcta",
  exceedMaxSize: "El tamaño del archivo no debe de exceder {0}.",
  noUploadFilesHandler: "Los archivos no se pueden cargar. Agregue un controlador para el evento 'onUploadFiles'.",
  otherRequiredError: "Por favor agregue la otra estimación.",
  uploadingFile: "Su archivo se está subiendo. Por favor espere unos segundos e intente de nuevo.",
  loadingFile: "Cargando...",
  chooseFile: "Elija archivo(s)...",
  noFileChosen: "No se ha elegido ningún archivo",
  filePlaceholder: "Suelte un archivo aquí o haga clic en el botón de abajo para cargar el archivo",
  confirmDelete: "¿Quieres borrar el registro?",
  keyDuplicationError: "Este valor debe ser único.",
  addColumn: "Añadir columna",
  addRow: "Agregue una hilera",
  removeRow: "Eliminar una hilera",
  noRowsText: "No hay hileras.",
  addPanel: "Añadir nuevo",
  removePanel: "Retire",
  showDetails: "Mostrar detalles",
  hideDetails: "Ocultar detalles",
  choices_Item: "artículo",
  matrix_column: "Columna",
  matrix_row: "Hilera",
  multipletext_itemname: "texto",
  savingData: "Los resultados se están guardando en el servidor...",
  savingDataError: "Los resultados se están guardando en el servidor...",
  savingDataSuccess: "¡Los resultados se guardaron con éxito!",
  savingExceedSize: "Su respuesta supera los 64 KB. Reduzca el tamaño de su(s) archivo(s) e inténtelo de nuevo o póngase en contacto con el propietario de una encuesta.",
  saveAgainButton: "Inténtalo de nuevo.",
  timerMin: "min",
  timerSec: "sec",
  timerSpentAll: "Has gastado {0} en esta página y {1} en total.",
  timerSpentPage: "Usted ha pasado {0} en esta página.",
  timerSpentSurvey: "Has gastado en total.",
  timerLimitAll: "Has gastado {0} de {1} en esta página y {2} de {3} en total.",
  timerLimitPage: "Has gastado {0} de {1} en esta página.",
  timerLimitSurvey: "Usted ha gastado {0} de {1} en total.",
  clearCaption: "Borrar",
  signaturePlaceHolder: "Firma aqui",
  signaturePlaceHolderReadOnly: "Sin firma",
  chooseFileCaption: "Elija el archivo",
  takePhotoCaption: "Tomar foto",
  photoPlaceholder: "Haga clic en el botón de abajo para tomar una foto con la cámara.",
  fileOrPhotoPlaceholder: "Arrastre y suelte o seleccione un archivo para cargar o tomar una foto con la cámara.",
  replaceFileCaption: "Reemplazar archivo",
  removeFileCaption: "Elimina este archivo",
  booleanCheckedLabel: "Sí",
  booleanUncheckedLabel: "No",
  confirmRemoveFile: "¿Estás seguro de que quieres eliminar este archivo: {0}?",
  confirmRemoveAllFiles: "¿Estás seguro de que quieres eliminar todos los archivos?",
  questionTitlePatternText: "Título de la pregunta",
  modalCancelButtonText: "Anular",
  modalApplyButtonText: "Aplicar",
  filterStringPlaceholder: "Escribe para buscar...",
  emptyMessage: "No hay datos para mostrar",
  noEntriesText: "Aún no hay entradas.\nHaga clic en el botón de abajo para agregar una nueva entrada.",
  noEntriesReadonlyText: "No hay entradas.",
  tabTitlePlaceholder: "Nuevo panel",
  more: "Más",
  tagboxDoneButtonCaption: "De acuerdo",
  selectToRankEmptyRankedAreaText: "Todas las opciones están clasificadas",
  selectToRankEmptyUnrankedAreaText: "Arrastra y suelta opciones aquí para clasificarlas",
  ok: "De acuerdo",
  cancel: "Cancelar"
};

setupLocale({ localeCode: "es", strings: spanishSurveyStrings, nativeName: "español", englishName: "Spanish" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// emptyMessage: "No data to display" => "No hay datos para mostrar"
// noEntriesReadonlyText: "There are no entries." => "No hay entradas."
// more: "More" => "Más"
// tagboxDoneButtonCaption: "OK" => "De acuerdo"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Todas las opciones están clasificadas"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Arrastra y suelta opciones aquí para clasificarlas"// takePhotoCaption: "Take Photo" => "Tomar foto"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Haga clic en el botón de abajo para tomar una foto con la cámara."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Arrastre y suelte o seleccione un archivo para cargar o tomar una foto con la cámara."
// replaceFileCaption: "Replace file" => "Reemplazar archivo"// eachRowUniqueError: "Each row must have a unique value." => "Cada fila debe tener un valor único."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Los archivos no se pueden cargar. Agregue un controlador para el evento 'onUploadFiles'."
// showDetails: "Show Details" => "Mostrar detalles"
// hideDetails: "Hide Details" => "Ocultar detalles"
// ok: "OK" => "De acuerdo"
// cancel: "Cancel" => "Cancelar"
// refuseItemText: "Refuse to answer" => "Negarse a responder"
// dontKnowItemText: "Don't know" => "No sé"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Su respuesta supera los 64 KB. Reduzca el tamaño de su(s) archivo(s) e inténtelo de nuevo o póngase en contacto con el propietario de una encuesta."
// signaturePlaceHolderReadOnly: "No signature" => "Sin firma"// tabTitlePlaceholder: "New Panel" => "Nuevo panel"// deselectAllItemText: "Deselect all" => "Anular la selección de todo"
// textNoDigitsAllow: "Numbers are not allowed." => "No se permiten números."