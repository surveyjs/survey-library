import { setupLocale } from "survey-core";

export var spanishSurveyStrings = {
  // "Previous"
  pagePrevText: "Anterior",
  // "Next"
  pageNextText: "Siguiente",
  // "Complete"
  completeText: "Completar",
  // "Preview"
  previewText: "Vista previa",
  // "Edit"
  editText: "Edita",
  // "Start"
  startSurveyText: "Comienza",
  // [Auto-translated] "Please leave a comment"
  commentText: "Por favor, deja un comentario",
  // "Other (describe)"
  otherItemText: "Otro (describa)",
  // "None"
  noneItemText: "Ninguno",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Negarse a responder",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "No sé",
  // "Select All"
  selectAllItemText: "Seleccionar todo",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Anular la selección de todo",
  // "Page {0} of {1}"
  progressText: "Página {0} de {1}",
  // "{0} of {1}"
  indexText: "{0} de {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Registro {0} de {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Respondió a {0}/{1} preguntas",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "No hay página visible o pregunta en la encuesta.",
  // "Thank you for completing the survey"
  completingSurvey: "¡Gracias por completar la encuesta!",
  // "You have already completed this survey."
  completingSurveyBefore: "Nuestros registros muestran que ya ha completado esta encuesta.",
  // "Loading Survey..."
  loadingSurvey: "La encuesta está cargando...",
  // "Select..."
  placeholder: "Seleccione...",
  // "Select..."
  ratingOptionsCaption: "Toca aquí para calificar...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Escoger...",
  // "value"
  value: "valor",
  // "Response required."
  requiredError: "Por favor conteste la pregunta.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Por favor, responda al menos una pregunta.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Por favor conteste las preguntas en cada hilera.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Cada fila debe tener un valor único.",
  // "The value should be numeric."
  numericError: "La estimación debe ser numérica.",
  // "The value should not be less than {0}"
  minError: "La estimación no debe ser menor que {0}",
  // "The value should not be greater than {0}"
  maxError: "La estimación no debe ser mayor que {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "No se permiten números.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Por favor entre por lo menos {0} símbolos.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Por favor entre menos de {0} símbolos.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Por favor entre más de {0} y menos de {1} símbolos.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Por favor llene por lo menos {0} hileras.",
  // "Please select at least {0} option(s)."
  minSelectError: "Por favor seleccione por lo menos {0} variantes.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Por favor seleccione no más de {0} variantes.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "El '{0}' debe de ser igual o más de {1} y igual o menos de {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "El '{0}' debe ser igual o más de {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "El '{0}' debe ser igual o menos de {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Por favor agregue un correo electrónico válido.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "La expresión: {0} debería devolver 'verdadero'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "La solicitud regresó error '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "La solicitud regresó vacío de data o la propiedad 'trayectoria' no es correcta",
  // "The file size should not exceed {0}."
  exceedMaxSize: "El tamaño del archivo no debe de exceder {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Los archivos no se pueden cargar. Agregue un controlador para el evento 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Por favor agregue la otra estimación.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Su archivo se está subiendo. Por favor espere unos segundos e intente de nuevo.",
  // "Loading..."
  loadingFile: "Cargando...",
  // "Choose file(s)..."
  chooseFile: "Elija archivo(s)...",
  // "No file selected"
  noFileChosen: "No se ha elegido ningún archivo",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Suelte un archivo aquí o haga clic en el botón de abajo para cargar el archivo",
  // "Are you sure you want to delete this record?"
  confirmDelete: "¿Quieres borrar el registro?",
  // "This value should be unique."
  keyDuplicationError: "Este valor debe ser único.",
  // "Add Column"
  addColumn: "Añadir columna",
  // "Add Row"
  addRow: "Agregue una hilera",
  // "Remove"
  removeRow: "Eliminar una hilera",
  // "There are no rows."
  noRowsText: "No hay hileras.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Fila {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Añadir nuevo",
  // "Remove"
  removePanel: "Retire",
  // [Auto-translated] "Show Details"
  showDetails: "Mostrar detalles",
  // [Auto-translated] "Hide Details"
  hideDetails: "Ocultar detalles",
  // "item"
  choices_Item: "artículo",
  // [Auto-translated] "Choice option"
  choices_Choice: "Opción de elección",
  // "Column"
  matrix_column: "Columna",
  // "Row"
  matrix_row: "Hilera",
  // "text"
  multipletext_itemname: "texto",
  // "The results are being saved on the server..."
  savingData: "Los resultados se están guardando en el servidor...",
  // "An error occurred and we could not save the results."
  savingDataError: "Los resultados se están guardando en el servidor...",
  // "The results were saved successfully!"
  savingDataSuccess: "¡Los resultados se guardaron con éxito!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner."
  savingExceedSize: "Su respuesta supera los 64 KB. Reduzca el tamaño de su(s) archivo(s) e inténtelo de nuevo o póngase en contacto con el propietario de una encuesta.",
  // "Try again"
  saveAgainButton: "Inténtalo de nuevo.",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sec",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Has gastado {0} en esta página y {1} en total.",
  // "You have spent {0} on this page."
  timerSpentPage: "Usted ha pasado {0} en esta página.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Has gastado en total.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Has gastado {0} de {1} en esta página y {2} de {3} en total.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Has gastado {0} de {1} en esta página.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Usted ha gastado {0} de {1} en total.",
  // "Clear"
  clearCaption: "Borrar",
  // "Sign here"
  signaturePlaceHolder: "Firma aqui",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Sin firma",
  // "Select File"
  chooseFileCaption: "Elija el archivo",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Tomar foto",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Haga clic en el botón de abajo para tomar una foto con la cámara.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Arrastre y suelte o seleccione un archivo para cargar o tomar una foto con la cámara.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Reemplazar archivo",
  // "Remove this file"
  removeFileCaption: "Elimina este archivo",
  // "Yes"
  booleanCheckedLabel: "Sí",
  // "No"
  booleanUncheckedLabel: "No",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "¿Estás seguro de que quieres eliminar este archivo: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "¿Estás seguro de que quieres eliminar todos los archivos?",
  // "Question Title"
  questionTitlePatternText: "Título de la pregunta",
  // "Cancel"
  modalCancelButtonText: "Anular",
  // "Apply"
  modalApplyButtonText: "Aplicar",
  // "Type to search..."
  filterStringPlaceholder: "Escribe para buscar...",
  // [Auto-translated] "No data to display"
  emptyMessage: "No hay datos para mostrar",
  // [Auto-translated] "Loading..."
  loadingPage: "Carga...",
  // [Auto-translated] "Loading..."
  loadingData: "Carga...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Aún no hay entradas.\nHaga clic en el botón de abajo para agregar una nueva entrada.",
  // [Auto-translated] "There are no entries."
  noEntriesReadonlyText: "No hay entradas.",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nuevo panel",
  // [Auto-translated] "More"
  more: "Más",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "De acuerdo",
  // [Auto-translated] "All choices are ranked"
  selectToRankEmptyRankedAreaText: "Todas las opciones están clasificadas",
  // [Auto-translated] "Drag and drop choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Arrastra y suelta opciones aquí para clasificarlas",
  // [Auto-translated] "OK"
  ok: "De acuerdo",
  // [Auto-translated] "Cancel"
  cancel: "Cancelar",
  // "Create \"{0}\" item..."
  createCustomItem: "Crear artículo \"{0}\"..."
};

setupLocale({ localeCode: "es", strings: spanishSurveyStrings, nativeName: "español", englishName: "Spanish" });