import { setupLocale } from "survey-core";

export var germanSurveyStrings = {
  // "Previous"
  pagePrevText: "Zurück",
  // "Next"
  pageNextText: "Weiter",
  // "Complete"
  completeText: "Abschließen",
  // "Preview"
  previewText: "Vorschau",
  // "Edit"
  editText: "Bearbeiten",
  // "Start"
  startSurveyText: "Start",
  // [Auto-translated] "Please leave a comment"
  commentText: "Bitte hinterlassen Sie einen Kommentar",
  // "Other (describe)"
  otherItemText: "Sonstiges (Bitte angeben)",
  // "None"
  noneItemText: "Nichts trifft zu",
  // "Refuse to answer"
  refuseItemText: "Antwort verweigern",
  // "Don't know"
  dontKnowItemText: "Weiß ich nicht",
  // "Select All"
  selectAllItemText: "Alles auswählen",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Alle abwählen",
  // "Page {0} of {1}"
  progressText: "Seite {0} von {1}",
  // "{0} of {1}"
  indexText: "{0} von {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Eintrag {0} von {1}",
  // "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Bereich {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "{0}/{1} Fragen beantwortet",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Es sind keine Fragen vorhanden.",
  // "Thank you for completing the survey"
  completingSurvey: "Vielen Dank, dass Sie die Umfrage abgeschlossen haben!",
  // "You have already completed this survey."
  completingSurveyBefore: "Sie haben diese Umfrage bereits abgeschlossen.",
  // "Loading Survey..."
  loadingSurvey: "Umfrage wird geladen...",
  // "Select..."
  placeholder: "Bitte auswählen...",
  // "Select..."
  ratingOptionsCaption: "Tippen Sie hier, um zu bewerten...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Auswählen...",
  // "value"
  value: "Wert",
  // "Response required."
  requiredError: "Bitte beantworten Sie diese Frage.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Bitte beantworten Sie mindestens eine Frage.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Bitte beantworten Sie alle Fragen.",
  // "Each row must have a unique value."
  eachRowUniqueError: "Jede Zeile muss einen eindeutigen Wert haben.",
  // "The value should be numeric."
  numericError: "Der Wert muss eine Zahl sein.",
  // "The value should not be less than {0}"
  minError: "Der Wert sollte nicht kleiner als {0} sein",
  // "The value should not be greater than {0}"
  maxError: "Der Wert sollte nicht größer als {0} sein",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Zahlen sind nicht erlaubt.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Bitte geben Sie mindestens {0} Zeichen ein.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Bitte geben Sie nicht mehr als {0} Zeichen ein.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Bitte geben Sie mindestens {0} und maximal {1} Zeichen ein.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Bitte machen Sie in mindestens {0} Zeilen eine Eingabe.",
  // "Please select at least {0} option(s)."
  minSelectError: "Bitte wählen Sie mindestens {0} Antwort(en) aus.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Bitte wählen Sie nicht mehr als {0} Antwort(en) aus.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' muss größer oder gleich {1} und kleiner oder gleich {2} sein",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' muss größer oder gleich {1} sein",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' muss kleiner oder gleich {1} sein",
  // "Please enter a valid e-mail address."
  invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Der Ausdruck: {0} muss den Wert 'wahr' zurückgeben.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Ein Netzwerkdienst hat folgenden Fehler zurückgegeben '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Eine Netzwerkdienst hat ungültige Daten zurückgegeben",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Die Datei darf nicht größer als {0} sein.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Dateien können nicht hochgeladen werden. Fügen Sie einen Handler für das Ereignis 'onUploadFiles' hinzu.",
  // "Response required: enter another value."
  otherRequiredError: "Bitte geben Sie einen Wert an.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Bitte warten Sie bis der Upload Ihrer Dateien abgeschlossen ist.",
  // "Loading..."
  loadingFile: "Wird hochgeladen...",
  // "Choose file(s)..."
  chooseFile: "Datei(en) auswählen...",
  // "No file selected"
  noFileChosen: "Keine Datei ausgewählt",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Legen Sie hier eine Datei ab oder klicken Sie auf die Schaltfläche unten, um die Datei zu laden.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Wollen Sie den Eintrag löschen?",
  // "This value should be unique."
  keyDuplicationError: "Dieser Wert muss einmalig sein.",
  // "Add Column"
  addColumn: "Spalte hinzufügen",
  // "Add Row"
  addRow: "Zeile hinzufügen",
  // "Remove"
  removeRow: "Entfernen",
  // "There are no rows."
  noRowsText: "Es gibt keine Reihen.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Zeile {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Neu hinzufügen",
  // "Remove"
  removePanel: "Entfernen",
  // "Show Details"
  showDetails: "Details anzeigen",
  // "Hide Details"
  hideDetails: "Details ausblenden",
  // "item"
  choices_Item: "Element",
  // [Auto-translated] "Choice option"
  choices_Choice: "Wahlmöglichkeit",
  // "Column"
  matrix_column: "Spalte",
  // "Row"
  matrix_row: "Zeile",
  // "text"
  multipletext_itemname: "Text",
  // "The results are being saved on the server..."
  savingData: "Die Ergebnisse werden auf dem Server gespeichert...",
  // "An error occurred and we could not save the results."
  savingDataError: "Es ist ein Fehler aufgetreten. Die Ergebnisse konnten nicht gespeichert werden.",
  // "The results were saved successfully!"
  savingDataSuccess: "Die Ergebnisse wurden gespeichert!",
  // "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Ihre Antwort überschreitet 64 KB. Reduzieren Sie die Größe Ihrer Datei(en) und versuchen Sie es erneut, oder wenden Sie sich an den Umfragebesitzer.",
  // "Try again"
  saveAgainButton: "Erneut absenden",
  // "min"
  timerMin: "Min.",
  // "sec"
  timerSec: "Sek.",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Sie waren {0} auf dieser Seite und brauchten insgesamt {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Sie waren {0} auf dieser Seite.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Sie haben insgesamt {0} gebraucht.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Sie waren {0} von {1} auf dieser Seite und brauchten insgesamt {2} von {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Sie waren {0} von {1} auf dieser Seite.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Sie haben insgesamt {0} von {1} gebraucht.",
  // "Clear"
  clearCaption: "Auswahl entfernen",
  // "Select"
  selectCaption: "Auswählen",
  // "Sign here"
  signaturePlaceHolder: "Hier unterschreiben",
  // "No signature"
  signaturePlaceHolderReadOnly: "Keine Unterschrift",
  // "Select File"
  chooseFileCaption: "Datei auswählen",
  // "Take Photo"
  takePhotoCaption: "Foto machen",
  // "Click the button below to take a photo using the camera."
  photoPlaceholder: "Klicken Sie auf die Schaltfläche unten, um ein Foto mit der Kamera aufzunehmen.",
  // "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Ziehen Sie eine Datei per Drag & Drop oder wählen Sie sie aus, um sie hochzuladen oder machen Sie ein Foto mit der Kamera.",
  // "Replace file"
  replaceFileCaption: "Datei ersetzen",
  // "Remove this file"
  removeFileCaption: "Datei löschen",
  // "Yes"
  booleanCheckedLabel: "Ja",
  // "No"
  booleanUncheckedLabel: "Nein",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Sind Sie sicher, dass Sie diese Datei löschen möchten: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Sind Sie sicher, dass Sie alle Dateien löschen möchten?",
  // "Question Title"
  questionTitlePatternText: "Fragentitel",
  // "Cancel"
  modalCancelButtonText: "Abbrechen",
  // "Apply"
  modalApplyButtonText: "Anwenden",
  // "Type to search..."
  filterStringPlaceholder: "Tippen Sie, um zu suchen...",
  // "No data to display"
  emptyMessage: "Es gibt noch keine Daten.",
  // [Auto-translated] "Loading..."
  loadingPage: "Wird hochgeladen...",
  // [Auto-translated] "Loading..."
  loadingData: "Wird hochgeladen...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Es gibt noch keine Einträge.\nKlicken Sie auf die Schaltfläche unten, um einen neuen Eintrag hinzuzufügen.",
  // "No entries"
  noEntriesReadonlyText: "Es gibt keine Einträge.",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Neues Panel",
  // "More"
  more: "Mehr",
  // "OK"
  tagboxDoneButtonCaption: "OK",
  // "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Alle Auswahlmöglichkeiten sind in einer Rangfolge angeordnet",
  // "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Ziehen Sie die Auswahl hierher, um sie zu ordnen",
  // "OK"
  ok: "OK",
  // "Cancel"
  cancel: "Abbrechen",
  // "Create \"{0}\" item..."
  createCustomItem: "\"{0}\"-Element erstellen..."
};

setupLocale({ localeCode: "de", strings: germanSurveyStrings, nativeName: "deutsch", englishName: "German" });