import { setupLocale } from "survey-core";

export var italianSurveyStrings = {
  pagePrevText: "Precedente",
  pageNextText: "Successivo",
  completeText: "Salva",
  previewText: "Anteprima",
  editText: "Modifica",
  startSurveyText: "Inizio",
  otherItemText: "Altro (descrivi)",
  noneItemText: "Nessuno",
  refuseItemText: "Rifiuta di rispondere",
  dontKnowItemText: "Non lo so",
  selectAllItemText: "Seleziona tutti",
  deselectAllItemText: "Deseleziona tutto",
  progressText: "Pagina {0} di {1}",
  indexText: "{0} da {1}",
  panelDynamicProgressText: "Record di {0} di {1}",
  panelDynamicTabTextFormat: "Pannello {panelIndex}",
  questionsProgressText: "Risposte a {0}/{1} domande",
  emptySurvey: "Non ci sono pagine o domande visibili nel questionario.",
  completingSurvey: "Grazie per aver completato il questionario!",
  completingSurveyBefore: "I nostri records mostrano che hai già completato questo questionario.",
  loadingSurvey: "Caricamento del questionario in corso...",
  placeholder: "Scegli...",
  ratingOptionsCaption: "Tocca qui per valutare...",
  value: "valore",
  requiredError: "Campo obbligatorio",
  requiredErrorInPanel: "Per Favore, rispondi ad almeno una domanda.",
  requiredInAllRowsError: "Completare tutte le righe",
  eachRowUniqueError: "Ogni riga deve avere un valore univoco.",
  numericError: "Il valore deve essere numerico",
  minError: "Il valore non deve essere inferiore a {0}",
  maxError: "Il valore non deve essere maggiore di {0}",
  textNoDigitsAllow: "I numeri non sono ammessi.",
  textMinLength: "Inserire almeno {0} caratteri",
  textMaxLength: "Lunghezza massima consentita {0} caratteri",
  textMinMaxLength: "Inserire una stringa con minimo {0} e massimo {1} caratteri",
  minRowCountError: "Completare almeno {0} righe.",
  minSelectError: "Selezionare almeno {0} varianti.",
  maxSelectError: "Selezionare massimo {0} varianti.",
  numericMinMax: "'{0}' deve essere uguale o superiore a {1} e uguale o inferiore a {2}",
  numericMin: "'{0}' deve essere uguale o superiore a {1}",
  numericMax: "'{0}' deve essere uguale o inferiore a {1}",
  invalidEmail: "Inserire indirizzo mail valido",
  invalidExpression: "L'espressione: {0} dovrebbe tornare 'vero'.",
  urlRequestError: "La richiesta ha risposto con un errore '{0}'. {1}",
  urlGetChoicesError: "La richiesta ha risposto null oppure il percorso non è corretto",
  exceedMaxSize: "Il file non può eccedere {0}",
  noUploadFilesHandler: "I file non possono essere caricati. Aggiungere un gestore per l'evento 'onUploadFiles'.",
  otherRequiredError: "Inserire il valore 'altro'",
  uploadingFile: "File in caricamento. Attendi alcuni secondi e riprova",
  loadingFile: "Caricamento...",
  chooseFile: "Selezionare file(s)...",
  noFileChosen: "Nessun file selezionato",
  filePlaceholder: "Trascina un file qui o fai clic sul pulsante in basso per caricare il file.",
  confirmDelete: "Sei sicuro di voler elminare il record?",
  keyDuplicationError: "Questo valore deve essere univoco.",
  addColumn: "Aggiungi colonna",
  addRow: "Aggiungi riga",
  removeRow: "Rimuovi riga",
  noRowsText: "Non ci sono righe.",
  addPanel: "Aggiungi riga",
  removePanel: "Elimina",
  showDetails: "Mostra dettagli",
  hideDetails: "Nascondi dettagli",
  choices_Item: "Elemento",
  matrix_column: "Colonna",
  matrix_row: "Riga",
  multipletext_itemname: "testo",
  savingData: "Salvataggio dati sul server...",
  savingDataError: "Si è verificato un errore e non è stato possibile salvare i risultati.",
  savingDataSuccess: "I risultati sono stati salvati con successo!",
  savingExceedSize: "La tua risposta supera i 64 KB. Riduci le dimensioni dei tuoi file e riprova o contatta il proprietario di un'indagine.",
  saveAgainButton: "Riprova",
  timerMin: "min",
  timerSec: "sec",
  timerSpentAll: "Hai impiegato {0} su questa pagina e {1} in totale.",
  timerSpentPage: "Hai impiegato {0} su questa pagina.",
  timerSpentSurvey: "Hai impiegato {0} in totale.",
  timerLimitAll: "Hai impiegato {0} di {1} su questa pagina e {2} di {3} in totale.",
  timerLimitPage: "Hai impiegato {0} di {1} su questa pagina.",
  timerLimitSurvey: "Hai impiegato {0} di {1} in totale.",
  clearCaption: "Cancella",
  signaturePlaceHolder: "Firmare qui",
  signaturePlaceHolderReadOnly: "Nessuna firma",
  chooseFileCaption: "Scegliere il file",
  takePhotoCaption: "Scatta foto",
  photoPlaceholder: "Fai clic sul pulsante qui sotto per scattare una foto utilizzando la fotocamera.",
  fileOrPhotoPlaceholder: "Trascina e rilascia o seleziona un file da caricare o scattare una foto utilizzando la fotocamera.",
  replaceFileCaption: "Sostituisci file",
  removeFileCaption: "Rimuovere questo file",
  booleanCheckedLabel: "Sì",
  booleanUncheckedLabel: "No",
  confirmRemoveFile: "Sei sicuro di voler elminare questo file: {0}?",
  confirmRemoveAllFiles: "Sei sicuro di voler elminare tutti i files?",
  questionTitlePatternText: "Titolo della domanda",
  modalCancelButtonText: "Annulla",
  modalApplyButtonText: "Applicare",
  filterStringPlaceholder: "Digita per cercare...",
  emptyMessage: "Nessun dato da visualizzare",
  noEntriesText: "Non ci sono ancora voci.\nFai clic sul pulsante qui sotto per aggiungere una nuova voce.",
  noEntriesReadonlyText: "Non ci sono voci.",
  tabTitlePlaceholder: "Nuovo pannello",
  more: "Più",
  tagboxDoneButtonCaption: "OK",
  selectToRankEmptyRankedAreaText: "Tutte le scelte sono classificate",
  selectToRankEmptyUnrankedAreaText: "Trascina e rilascia le scelte qui per classificarle",
  ok: "OK",
  cancel: "Annulla"
};

setupLocale({ localeCode: "it", strings: italianSurveyStrings, nativeName: "italiano", englishName: "Italian" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Pannello {panelIndex}"
// emptyMessage: "No data to display" => "Nessun dato da visualizzare"
// noEntriesReadonlyText: "There are no entries." => "Non ci sono voci."
// more: "More" => "Più"
// tagboxDoneButtonCaption: "OK" => "OK"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Tutte le scelte sono classificate"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Trascina e rilascia le scelte qui per classificarle"// takePhotoCaption: "Take Photo" => "Scatta foto"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Fai clic sul pulsante qui sotto per scattare una foto utilizzando la fotocamera."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Trascina e rilascia o seleziona un file da caricare o scattare una foto utilizzando la fotocamera."
// replaceFileCaption: "Replace file" => "Sostituisci file"// eachRowUniqueError: "Each row must have a unique value." => "Ogni riga deve avere un valore univoco."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "I file non possono essere caricati. Aggiungere un gestore per l'evento 'onUploadFiles'."
// showDetails: "Show Details" => "Mostra dettagli"
// hideDetails: "Hide Details" => "Nascondi dettagli"
// ok: "OK" => "OK"
// cancel: "Cancel" => "Annulla"
// refuseItemText: "Refuse to answer" => "Rifiuta di rispondere"
// dontKnowItemText: "Don't know" => "Non lo so"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "La tua risposta supera i 64 KB. Riduci le dimensioni dei tuoi file e riprova o contatta il proprietario di un'indagine."
// signaturePlaceHolderReadOnly: "No signature" => "Nessuna firma"// tabTitlePlaceholder: "New Panel" => "Nuovo pannello"// deselectAllItemText: "Deselect all" => "Deseleziona tutto"
// textNoDigitsAllow: "Numbers are not allowed." => "I numeri non sono ammessi."