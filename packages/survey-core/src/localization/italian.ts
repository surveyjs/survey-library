import { setupLocale } from "survey-core";

export var italianSurveyStrings = {
  // "Previous"
  pagePrevText: "Precedente",
  // "Next"
  pageNextText: "Successivo",
  // "Complete"
  completeText: "Salva",
  // "Preview"
  previewText: "Anteprima",
  // "Edit"
  editText: "Modifica",
  // "Start"
  startSurveyText: "Inizio",
  // [Auto-translated] "Please leave a comment"
  commentText: "Si prega di lasciare un commento",
  // "Other (describe)"
  otherItemText: "Altro (descrivi)",
  // "None"
  noneItemText: "Nessuno",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Rifiuta di rispondere",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Non lo so",
  // "Select All"
  selectAllItemText: "Seleziona tutti",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Deseleziona tutto",
  // "Page {0} of {1}"
  progressText: "Pagina {0} di {1}",
  // "{0} of {1}"
  indexText: "{0} da {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Record di {0} di {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Pannello {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Risposte a {0}/{1} domande",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Non ci sono pagine o domande visibili nel questionario.",
  // "Thank you for completing the survey"
  completingSurvey: "Grazie per aver completato il questionario!",
  // "You have already completed this survey."
  completingSurveyBefore: "I nostri records mostrano che hai già completato questo questionario.",
  // "Loading Survey..."
  loadingSurvey: "Caricamento del questionario in corso...",
  // "Select..."
  placeholder: "Scegli...",
  // "Select..."
  ratingOptionsCaption: "Tocca qui per valutare...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Selezionare...",
  // "value"
  value: "valore",
  // "Response required."
  requiredError: "Campo obbligatorio",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Per Favore, rispondi ad almeno una domanda.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Completare tutte le righe",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Ogni riga deve avere un valore univoco.",
  // "The value should be numeric."
  numericError: "Il valore deve essere numerico",
  // "The value should not be less than {0}"
  minError: "Il valore non deve essere inferiore a {0}",
  // "The value should not be greater than {0}"
  maxError: "Il valore non deve essere maggiore di {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "I numeri non sono ammessi.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Inserire almeno {0} caratteri",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Lunghezza massima consentita {0} caratteri",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Inserire una stringa con minimo {0} e massimo {1} caratteri",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Completare almeno {0} righe.",
  // "Please select at least {0} option(s)."
  minSelectError: "Selezionare almeno {0} varianti.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Selezionare massimo {0} varianti.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' deve essere uguale o superiore a {1} e uguale o inferiore a {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' deve essere uguale o superiore a {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' deve essere uguale o inferiore a {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Inserire indirizzo mail valido",
  // "The expression: {0} should return 'true'."
  invalidExpression: "L'espressione: {0} dovrebbe tornare 'vero'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "La richiesta ha risposto con un errore '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "La richiesta ha risposto null oppure il percorso non è corretto",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Il file non può eccedere {0}",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "I file non possono essere caricati. Aggiungere un gestore per l'evento 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Inserire il valore 'altro'",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "File in caricamento. Attendi alcuni secondi e riprova",
  // "Loading..."
  loadingFile: "Caricamento...",
  // "Choose file(s)..."
  chooseFile: "Selezionare file(s)...",
  // "No file selected"
  noFileChosen: "Nessun file selezionato",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Trascina un file qui o fai clic sul pulsante in basso per caricare il file.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Sei sicuro di voler elminare il record?",
  // "This value should be unique."
  keyDuplicationError: "Questo valore deve essere univoco.",
  // "Add Column"
  addColumn: "Aggiungi colonna",
  // "Add Row"
  addRow: "Aggiungi riga",
  // "Remove"
  removeRow: "Rimuovi riga",
  // "There are no rows."
  noRowsText: "Non ci sono righe.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Riga {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Aggiungi riga",
  // "Remove"
  removePanel: "Elimina",
  // [Auto-translated] "Show Details"
  showDetails: "Mostra dettagli",
  // [Auto-translated] "Hide Details"
  hideDetails: "Nascondi dettagli",
  // "item"
  choices_Item: "Elemento",
  // [Auto-translated] "Choice option"
  choices_Choice: "Opzione di scelta",
  // "Column"
  matrix_column: "Colonna",
  // "Row"
  matrix_row: "Riga",
  // "text"
  multipletext_itemname: "testo",
  // "The results are being saved on the server..."
  savingData: "Salvataggio dati sul server...",
  // "An error occurred and we could not save the results."
  savingDataError: "Si è verificato un errore e non è stato possibile salvare i risultati.",
  // "The results were saved successfully!"
  savingDataSuccess: "I risultati sono stati salvati con successo!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner."
  savingExceedSize: "La tua risposta supera i 64 KB. Riduci le dimensioni dei tuoi file e riprova o contatta il proprietario di un'indagine.",
  // "Try again"
  saveAgainButton: "Riprova",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sec",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Hai impiegato {0} su questa pagina e {1} in totale.",
  // "You have spent {0} on this page."
  timerSpentPage: "Hai impiegato {0} su questa pagina.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Hai impiegato {0} in totale.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Hai impiegato {0} di {1} su questa pagina e {2} di {3} in totale.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Hai impiegato {0} di {1} su questa pagina.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Hai impiegato {0} di {1} in totale.",
  // "Clear"
  clearCaption: "Cancella",
  // "Sign here"
  signaturePlaceHolder: "Firmare qui",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Nessuna firma",
  // "Select File"
  chooseFileCaption: "Scegliere il file",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Scatta foto",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Fai clic sul pulsante qui sotto per scattare una foto utilizzando la fotocamera.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Trascina e rilascia o seleziona un file da caricare o scattare una foto utilizzando la fotocamera.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Sostituisci file",
  // "Remove this file"
  removeFileCaption: "Rimuovere questo file",
  // "Yes"
  booleanCheckedLabel: "Sì",
  // "No"
  booleanUncheckedLabel: "No",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Sei sicuro di voler elminare questo file: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Sei sicuro di voler elminare tutti i files?",
  // "Question Title"
  questionTitlePatternText: "Titolo della domanda",
  // "Cancel"
  modalCancelButtonText: "Annulla",
  // "Apply"
  modalApplyButtonText: "Applicare",
  // "Type to search..."
  filterStringPlaceholder: "Digita per cercare...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Nessun dato da visualizzare",
  // [Auto-translated] "Loading..."
  loadingPage: "Caricamento...",
  // [Auto-translated] "Loading..."
  loadingData: "Caricamento...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Non ci sono ancora voci.\nFai clic sul pulsante qui sotto per aggiungere una nuova voce.",
  // [Auto-translated] "There are no entries."
  noEntriesReadonlyText: "Non ci sono voci.",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nuovo pannello",
  // [Auto-translated] "More"
  more: "Più",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are ranked"
  selectToRankEmptyRankedAreaText: "Tutte le scelte sono classificate",
  // [Auto-translated] "Drag and drop choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Trascina e rilascia le scelte qui per classificarle",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Annulla",
  // "Create \"{0}\" item..."
  createCustomItem: "Crea un articolo \"{0}\"..."
};

setupLocale({ localeCode: "it", strings: italianSurveyStrings, nativeName: "italiano", englishName: "Italian" });