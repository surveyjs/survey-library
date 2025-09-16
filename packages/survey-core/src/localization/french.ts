import { setupLocale } from "survey-core";

export var frenchSurveyStrings = {
  // "Previous"
  pagePrevText: "Précédent",
  // "Next"
  pageNextText: "Suivant",
  // "Complete"
  completeText: "Terminer",
  // "Preview"
  previewText: "Aperçu",
  // "Edit"
  editText: "Modifier",
  // "Start"
  startSurveyText: "Commencer",
  // [Auto-translated] "Please leave a comment"
  commentText: "S'il vous plaît laissez un commentaire",
  // "Other (describe)"
  otherItemText: "Autre (préciser)",
  // "None"
  noneItemText: "Aucun",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Refuser de répondre",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Sais pas",
  // "Select All"
  selectAllItemText: "Tout sélectionner",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Désélectionner tout",
  // "Page {0} of {1}"
  progressText: "Page {0} sur {1}",
  // "{0} of {1}"
  indexText: "{0} sur {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Enregistrement {0} sur {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "{0}/{1} question(s) répondue(s)",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Il n'y a ni page visible ni question visible dans ce questionnaire",
  // "Thank you for completing the survey"
  completingSurvey: "Merci d'avoir répondu au questionnaire !",
  // "You have already completed this survey."
  completingSurveyBefore: "Nos données indiquent que vous avez déjà rempli ce questionnaire.",
  // "Loading Survey..."
  loadingSurvey: "Le questionnaire est en cours de chargement...",
  // "Select..."
  placeholder: "Choisissez...",
  // "Select..."
  ratingOptionsCaption: "Appuyez ici pour noter...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Choisir...",
  // "value"
  value: "valeur",
  // "Response required."
  requiredError: "La réponse à cette question est obligatoire.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Merci de répondre au moins à une question.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Toutes les lignes sont obligatoires",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Chaque ligne doit avoir une valeur unique.",
  // "The value should be numeric."
  numericError: "La réponse doit être un nombre.",
  // "The value should not be less than {0}"
  minError: "La valeur ne doit pas être inférieure à {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Entrez une valeur qui correspond à la taille du pas de {0}.",
  // "The value should not be greater than {0}"
  maxError: "La valeur ne doit pas être supérieure à {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Les numéros ne sont pas autorisés.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Merci de saisir au moins {0} caractères.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Merci de saisir moins de {0} caractères.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Merci de saisir entre {0} et {1} caractères.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Merci de compléter au moins {0} lignes.",
  // "Please select at least {0} option(s)."
  minSelectError: "Merci de sélectionner au minimum {0} réponses.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Merci de sélectionner au maximum {0} réponses.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Votre réponse '{0}' doit être supérieure ou égale à {1} et inférieure ou égale à {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "Votre réponse '{0}' doit être supérieure ou égale à {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "Votre réponse '{0}' doit être inférieure ou égale à {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Merci d'entrer une adresse mail valide.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "L'expression: {0} doit retourner 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "La requête a renvoyé une erreur '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "La requête a renvoyé des données vides ou la propriété 'path' est incorrecte",
  // "The file size should not exceed {0}."
  exceedMaxSize: "La taille du fichier ne doit pas excéder {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Les fichiers ne peuvent pas être téléchargés. Veuillez ajouter un gestionnaire pour l'événement 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Merci de préciser le champ 'Autre'.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Votre fichier est en cours de chargement. Merci d'attendre quelques secondes et de réessayer.",
  // "Loading..."
  loadingFile: "Chargement...",
  // "Choose file(s)..."
  chooseFile: "Ajouter des fichiers...",
  // "No file selected"
  noFileChosen: "Aucun fichier ajouté",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Déposez un fichier ici ou cliquez sur le bouton ci-dessous pour charger le fichier.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Voulez-vous supprimer cet enregistrement ?",
  // "This value should be unique."
  keyDuplicationError: "Cette valeur doit être unique.",
  // "Add Column"
  addColumn: "Ajouter une colonne",
  // "Add Row"
  addRow: "Ajouter une ligne",
  // "Remove"
  removeRow: "Supprimer",
  // "There are no rows."
  noRowsText: "Il n'y a pas de lignes.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Ligne {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Ajouter",
  // "Remove"
  removePanel: "Supprimer",
  // [Auto-translated] "Show Details"
  showDetails: "Afficher les détails",
  // [Auto-translated] "Hide Details"
  hideDetails: "Masquer les détails",
  // "item"
  choices_Item: "item",
  // [Auto-translated] "Choice option"
  choices_Choice: "Option au choix",
  // "Column"
  matrix_column: "Colonne",
  // "Row"
  matrix_row: "Ligne",
  // "text"
  multipletext_itemname: "texte",
  // "The results are being saved on the server..."
  savingData: "Les résultats sont en cours de sauvegarde sur le serveur...",
  // "An error occurred and we could not save the results."
  savingDataError: "Une erreur est survenue et a empêché la sauvegarde des résultats.",
  // "The results were saved successfully!"
  savingDataSuccess: "Les résultats ont bien été enregistrés !",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Votre réponse dépasse 64 Ko. Veuillez réduire la taille de vos fichiers et réessayer ou contacter le propriétaire du sondage.",
  // "Try again"
  saveAgainButton: "Réessayer",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sec",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Vous avez passé {0} sur cette page et {1} au total.",
  // "You have spent {0} on this page."
  timerSpentPage: "Vous avez passé {0} sur cette page.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Vous avez passé {0} au total.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Vous avez passé {0} sur {1} sur cette page et {2} sur {3} au total.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Vous avez passé {0} sur {1} sur cette page.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Vous avez passé {0} sur {1} au total.",
  // "Clear"
  clearCaption: "Vider",
  // [Auto-translated] "Select"
  selectCaption: "Choisir",
  // "Sign here"
  signaturePlaceHolder: "Signez ici",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Pas de signature",
  // "Select File"
  chooseFileCaption: "Ajouter un fichier",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Prendre une photo",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Cliquez sur le bouton ci-dessous pour prendre une photo à l'aide de l'appareil photo.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Faites glisser et déposez ou sélectionnez un fichier à télécharger ou à prendre une photo à l’aide de l’appareil photo.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Remplacer le fichier",
  // "Remove this file"
  removeFileCaption: "Enlever ce fichier",
  // "Yes"
  booleanCheckedLabel: "Oui",
  // "No"
  booleanUncheckedLabel: "Non",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Êtes-vous certains de vouloir supprimer ce fichier : {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Êtes-vous certains de vouloir supprimer tous les fichiers?",
  // "Question Title"
  questionTitlePatternText: "Titre de la question",
  // "Cancel"
  modalCancelButtonText: "Annuler",
  // "Apply"
  modalApplyButtonText: "Appliquer",
  // "Type to search..."
  filterStringPlaceholder: "Tapez pour rechercher...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Aucune donnée à afficher",
  // [Auto-translated] "Loading..."
  loadingPage: "Chargement...",
  // [Auto-translated] "Loading..."
  loadingData: "Chargement...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Il n'y a pas encore d'entrées.\nCliquez sur le bouton ci-dessous pour ajouter une nouvelle entrée.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Aucune entrée",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nouveau panneau",
  // [Auto-translated] "More"
  more: "Plus",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "D’ACCORD",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Tous les choix sont sélectionnés pour le classement",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Faites glisser les choix ici pour les classer",
  // [Auto-translated] "OK"
  ok: "D’ACCORD",
  // [Auto-translated] "Cancel"
  cancel: "Annuler",
  // "Create \"{0}\" item..."
  createCustomItem: "Créez un élément \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Table des matières",
  // [Auto-translated] "Progress bar"
  progressbar: "Barre de progression"
};

setupLocale({ localeCode: "fr", strings: frenchSurveyStrings, nativeName: "français", englishName: "French" });