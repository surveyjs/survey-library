import { surveyLocalization } from "../surveyStrings";

export var spanishSurveyStrings = {
  pagePrevText: "Anterior",
  pageNextText: "Siguiente",
  completeText: "Completo",
  otherItemText: "Otro (describa)",
  progressText: "Página {0} de {1}",
  emptySurvey: "No hay página visible o pregunta en la encuesta.",
  completingSurvey: "Gracias por completar la encuesta!",
  loadingSurvey: "La encuesta está cargando...",
  optionsCaption: "Seleccione...",
  requiredError: "Por favor conteste la pregunta.",
  requiredInAllRowsError: "Por favor conteste las preguntas en cada hilera.",
  numericError: "La estimación debe ser numérica.",
  textMinLength: "Por favor entre por lo menos {0} símbolos.",
  textMaxLength: "Por favor entre menos de {0} símbolos.",
  textMinMaxLength: "Por favor entre más de {0} y menos de {1} símbolos.",
  minRowCountError: "Por favor llene por lo menos {0} hileras.",
  minSelectError: "Por favor seleccione por lo menos {0} variantes.",
  maxSelectError: "Por favor seleccione no más de {0} variantes.",
  numericMinMax:
    "El '{0}' debe de ser igual o más de {1} y igual o menos de {2}",
  numericMin: "El '{0}' debe ser igual o más de {1}",
  numericMax: "El '{0}' debe ser igual o menos de {1}",
  invalidEmail: "Por favor agregue un correo electrónico válido.",
  urlRequestError: "La solicitud regresó error '{0}'. {1}",
  urlGetChoicesError:
    "La solicitud regresó vacío de data o la propiedad 'trayectoria' no es correcta",
  exceedMaxSize: "El tamaño del archivo no debe de exceder {0}.",
  otherRequiredError: "Por favor agregue la otra estimación.",
  uploadingFile:
    "Su archivo se está subiendo. Por favor espere unos segundos e intente de nuevo.",
  addRow: "Agregue una hilera",
  removeRow: "Eliminar una hilera",
  choices_firstItem: "primer artículo",
  choices_secondItem: "segundo artículo",
  choices_thirdItem: "tercera artículo",
  matrix_column: "Columna",
  matrix_row: "Hilera"
};

surveyLocalization.locales["es"] = spanishSurveyStrings;
surveyLocalization.localeNames["es"] = "español";
