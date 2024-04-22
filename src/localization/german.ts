import { surveyLocalization } from "survey-core";

export var germanSurveyStrings = {
  pagePrevText: "Zurück",
  pageNextText: "Weiter",
  completeText: "Abschließen",
  previewText: "Vorschau",
  editText: "Bearbeiten",
  startSurveyText: "Start",
  otherItemText: "Sonstiges (Bitte angeben)",
  noneItemText: "Nichts trifft zu",
  refuseItemText: "Verweigern Sie die Antwort",
  dontKnowItemText: "Weiß ich nicht",
  selectAllItemText: "Alles auswählen",
  progressText: "Seite {0} von {1}",
  indexText: "{0} von {1}",
  panelDynamicProgressText: "Eintrag {0} von {1}",
  panelDynamicTabTextFormat: "Bereich {panelIndex}",
  questionsProgressText: "{0}/{1} Fragen beantwortet",
  emptySurvey: "Es sind keine Fragen vorhanden.",
  completingSurvey: "Vielen Dank, dass Sie die Umfrage abgeschlossen haben!",
  completingSurveyBefore: "Aus unseren Unterlagen geht hervor, dass Sie diese Umfrage bereits abgeschlossen haben.",
  loadingSurvey: "Umfrage wird geladen...",
  placeholder: "Bitte auswählen...",
  ratingOptionsCaption: "Tippen Sie hier, um zu bewerten...",
  value: "Wert",
  requiredError: "Bitte beantworten Sie diese Frage.",
  requiredErrorInPanel: "Bitte beantworten Sie mindestens eine Frage.",
  requiredInAllRowsError: "Bitte beantworten Sie alle Fragen.",
  eachRowUniqueError: "Jede Zeile muss einen eindeutigen Wert haben.",
  numericError: "Der Wert muss eine Zahl sein.",
  minError: "Der Wert sollte nicht kleiner als {0} sein",
  maxError: "Der Wert sollte nicht größer als {0} sein",
  textMinLength: "Bitte geben Sie mindestens {0} Zeichen ein.",
  textMaxLength: "Bitte geben Sie nicht mehr als {0} Zeichen ein.",
  textMinMaxLength: "Bitte geben Sie mindestens {0} und maximal {1} Zeichen ein.",
  minRowCountError: "Bitte machen Sie in mindestens {0} Zeilen eine Eingabe.",
  minSelectError: "Bitte wählen Sie mindestens {0} Antwort(en) aus.",
  maxSelectError: "Bitte wählen Sie nicht mehr als {0} Antwort(en) aus.",
  numericMinMax: "'{0}' muss größer oder gleich {1} und kleiner oder gleich {2} sein",
  numericMin: "'{0}' muss größer oder gleich {1} sein",
  numericMax: "'{0}' muss kleiner oder gleich {1} sein",
  invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  invalidExpression: "Der Ausdruck: {0} muss den Wert 'wahr' zurückgeben.",
  urlRequestError: "Ein Netzwerkdienst hat folgenden Fehler zurückgegeben '{0}'. {1}",
  urlGetChoicesError: "Eine Netzwerkdienst hat ungültige Daten zurückgegeben",
  exceedMaxSize: "Die Datei darf nicht größer als {0} sein.",
  noUploadFilesHandler: "Dateien können nicht hochgeladen werden. Fügen Sie einen Handler für das Ereignis 'onUploadFiles' hinzu.",
  otherRequiredError: "Bitte geben Sie einen Wert an.",
  uploadingFile: "Bitte warten Sie bis der Upload Ihrer Dateien abgeschlossen ist.",
  loadingFile: "Wird hochgeladen...",
  chooseFile: "Datei(en) auswählen...",
  noFileChosen: "Keine Datei ausgewählt",
  filePlaceholder: "Legen Sie hier eine Datei ab oder klicken Sie auf die Schaltfläche unten, um die Datei zu laden.",
  confirmDelete: "Wollen Sie den Eintrag löschen?",
  keyDuplicationError: "Dieser Wert muss einmalig sein.",
  addColumn: "Spalte hinzufügen",
  addRow: "Zeile hinzufügen",
  removeRow: "Entfernen",
  emptyRowsText: "Es gibt keine Reihen.",
  addPanel: "Neu hinzufügen",
  removePanel: "Entfernen",
  showDetails: "Details anzeigen",
  hideDetails: "Details ausblenden",
  choices_Item: "Element",
  matrix_column: "Spalte",
  matrix_row: "Zeile",
  multipletext_itemname: "Text",
  savingData: "Die Ergebnisse werden auf dem Server gespeichert...",
  savingDataError: "Es ist ein Fehler aufgetreten. Die Ergebnisse konnten nicht gespeichert werden.",
  savingDataSuccess: "Die Ergebnisse wurden gespeichert!",
  savingExceedSize: "Ihre Antwort überschreitet 64 KB. Reduzieren Sie die Größe Ihrer Datei(en) und versuchen Sie es erneut, oder wenden Sie sich an einen Umfragebesitzer.",
  saveAgainButton: "Erneut absenden",
  timerMin: "Min.",
  timerSec: "Sek.",
  timerSpentAll: "Sie waren {0} auf dieser Seite und brauchten insgesamt {1}.",
  timerSpentPage: "Sie waren {0} auf dieser Seite.",
  timerSpentSurvey: "Sie haben insgesamt {0} gebraucht.",
  timerLimitAll: "Sie waren {0} von {1} auf dieser Seite und brauchten insgesamt {2} von {3}.",
  timerLimitPage: "Sie waren {0} von {1} auf dieser Seite.",
  timerLimitSurvey: "Sie haben insgesamt {0} von {1} gebraucht.",
  clearCaption: "Auswahl entfernen",
  signaturePlaceHolder: "Hier unterschreiben",
  signaturePlaceHolderReadOnly: "Keine Unterschrift",
  chooseFileCaption: "Datei auswählen",
  takePhotoCaption: "Foto machen",
  photoPlaceholder: "Klicken Sie auf die Schaltfläche unten, um ein Foto mit der Kamera aufzunehmen.",
  fileOrPhotoPlaceholder: "Ziehen Sie eine Datei per Drag & Drop oder wählen Sie sie aus, um sie hochzuladen oder ein Foto mit der Kamera aufzunehmen.",
  replaceFileCaption: "Datei ersetzen",
  removeFileCaption: "Datei löschen",
  booleanCheckedLabel: "Ja",
  booleanUncheckedLabel: "Nein",
  confirmRemoveFile: "Sind Sie sicher, dass Sie diese Datei löschen möchten: {0}?",
  confirmRemoveAllFiles: "Sind Sie sicher, dass Sie alle Dateien löschen möchten?",
  questionTitlePatternText: "Fragentitel",
  modalCancelButtonText: "Abbrechen",
  modalApplyButtonText: "Anwenden",
  filterStringPlaceholder: "Tippe um zu suchen...",
  emptyMessage: "Es gibt noch keine Daten.",
  noEntriesText: "Es gibt noch keine Einträge.\nKlicken Sie auf die Schaltfläche unten, um einen neuen Eintrag hinzuzufügen.",
  noEntriesReadonlyText: "Es gibt keine Einträge.",
  more: "Mehr",
  tagboxDoneButtonCaption: "OKAY",
  selectToRankEmptyRankedAreaText: "Alle Auswahlmöglichkeiten sind in einer Rangfolge angeordnet",
  selectToRankEmptyUnrankedAreaText: "Ziehen Sie die Auswahl hierher, um sie zu ordnen",
  ok: "OKAY",
  cancel: "Abbrechen"
};

surveyLocalization.locales["de"] = germanSurveyStrings;
surveyLocalization.localeNames["de"] = "deutsch";

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Bereich {panelIndex}"
// noEntriesReadonlyText: "There are no entries." => "Es gibt keine Einträge."
// tagboxDoneButtonCaption: "OK" => "OKAY"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Alle Auswahlmöglichkeiten sind in einer Rangfolge angeordnet"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Ziehen Sie die Auswahl hierher, um sie zu ordnen"// takePhotoCaption: "Take Photo" => "Foto machen"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Klicken Sie auf die Schaltfläche unten, um ein Foto mit der Kamera aufzunehmen."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Ziehen Sie eine Datei per Drag & Drop oder wählen Sie sie aus, um sie hochzuladen oder ein Foto mit der Kamera aufzunehmen."
// replaceFileCaption: "Replace file" => "Datei ersetzen"// eachRowUniqueError: "Each row must have a unique value." => "Jede Zeile muss einen eindeutigen Wert haben."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Dateien können nicht hochgeladen werden. Fügen Sie einen Handler für das Ereignis 'onUploadFiles' hinzu."
// showDetails: "Show Details" => "Details anzeigen"
// hideDetails: "Hide Details" => "Details ausblenden"
// ok: "OK" => "OKAY"
// cancel: "Cancel" => "Abbrechen"
// refuseItemText: "Refuse to answer" => "Verweigern Sie die Antwort"
// dontKnowItemText: "Don't know" => "Weiß ich nicht"
// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Ihre Antwort überschreitet 64 KB. Reduzieren Sie die Größe Ihrer Datei(en) und versuchen Sie es erneut, oder wenden Sie sich an einen Umfragebesitzer."
// signaturePlaceHolderReadOnly: "No signature" => "Keine Unterschrift"