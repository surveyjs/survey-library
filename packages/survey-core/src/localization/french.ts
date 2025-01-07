import { setupLocale } from "survey-core";

export var frenchSurveyStrings = {
  pagePrevText: "Précédent",
  pageNextText: "Suivant",
  completeText: "Terminer",
  previewText: "Aperçu",
  editText: "Modifier",
  startSurveyText: "Commencer",
  otherItemText: "Autre (préciser)",
  noneItemText: "Aucun",
  refuseItemText: "Refuser de répondre",
  dontKnowItemText: "Sais pas",
  selectAllItemText: "Tout sélectionner",
  deselectAllItemText: "Désélectionner tout",
  progressText: "Page {0} sur {1}",
  indexText: "{0} sur {1}",
  panelDynamicProgressText: "Enregistrement {0} sur {1}",
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  questionsProgressText: "{0}/{1} question(s) répondue(s)",
  emptySurvey: "Il n'y a ni page visible ni question visible dans ce questionnaire",
  completingSurvey: "Merci d'avoir répondu au questionnaire !",
  completingSurveyBefore: "Nos données indiquent que vous avez déjà rempli ce questionnaire.",
  loadingSurvey: "Le questionnaire est en cours de chargement...",
  placeholder: "Choisissez...",
  ratingOptionsCaption: "Appuyez ici pour noter...",
  value: "valeur",
  requiredError: "La réponse à cette question est obligatoire.",
  requiredErrorInPanel: "Merci de répondre au moins à une question.",
  requiredInAllRowsError: "Toutes les lignes sont obligatoires",
  eachRowUniqueError: "Chaque ligne doit avoir une valeur unique.",
  numericError: "La réponse doit être un nombre.",
  minError: "La valeur ne doit pas être inférieure à {0}",
  maxError: "La valeur ne doit pas être supérieure à {0}",
  textNoDigitsAllow: "Les numéros ne sont pas autorisés.",
  textMinLength: "Merci de saisir au moins {0} caractères.",
  textMaxLength: "Merci de saisir moins de {0} caractères.",
  textMinMaxLength: "Merci de saisir entre {0} et {1} caractères.",
  minRowCountError: "Merci de compléter au moins {0} lignes.",
  minSelectError: "Merci de sélectionner au minimum {0} réponses.",
  maxSelectError: "Merci de sélectionner au maximum {0} réponses.",
  numericMinMax: "Votre réponse '{0}' doit être supérieure ou égale à {1} et inférieure ou égale à {2}",
  numericMin: "Votre réponse '{0}' doit être supérieure ou égale à {1}",
  numericMax: "Votre réponse '{0}' doit être inférieure ou égale à {1}",
  invalidEmail: "Merci d'entrer une adresse mail valide.",
  invalidExpression: "L'expression: {0} doit retourner 'true'.",
  urlRequestError: "La requête a renvoyé une erreur '{0}'. {1}",
  urlGetChoicesError: "La requête a renvoyé des données vides ou la propriété 'path' est incorrecte",
  exceedMaxSize: "La taille du fichier ne doit pas excéder {0}.",
  noUploadFilesHandler: "Les fichiers ne peuvent pas être téléchargés. Veuillez ajouter un gestionnaire pour l’événement 'onUploadFiles'.",
  otherRequiredError: "Merci de préciser le champ 'Autre'.",
  uploadingFile: "Votre fichier est en cours de chargement. Merci d'attendre quelques secondes et de réessayer.",
  loadingFile: "Chargement...",
  chooseFile: "Ajouter des fichiers...",
  noFileChosen: "Aucun fichier ajouté",
  filePlaceholder: "Déposez un fichier ici ou cliquez sur le bouton ci-dessous pour charger le fichier.",
  confirmDelete: "Voulez-vous supprimer cet enregistrement ?",
  keyDuplicationError: "Cette valeur doit être unique.",
  addColumn: "Ajouter une colonne",
  addRow: "Ajouter une ligne",
  removeRow: "Supprimer",
  noRowsText: "Il n'y a pas de lignes.",
  addPanel: "Ajouter",
  removePanel: "Supprimer",
  showDetails: "Afficher les détails",
  hideDetails: "Masquer les détails",
  choices_Item: "item",
  matrix_column: "Colonne",
  matrix_row: "Ligne",
  multipletext_itemname: "texte",
  savingData: "Les résultats sont en cours de sauvegarde sur le serveur...",
  savingDataError: "Une erreur est survenue et a empêché la sauvegarde des résultats.",
  savingDataSuccess: "Les résultats ont bien été enregistrés !",
  savingExceedSize: "Votre réponse dépasse 64 Ko. Veuillez réduire la taille de votre ou vos fichiers et réessayer ou contacter un propriétaire de sondage.",
  saveAgainButton: "Réessayer",
  timerMin: "min",
  timerSec: "sec",
  timerSpentAll: "Vous avez passé {0} sur cette page et {1} au total.",
  timerSpentPage: "Vous avez passé {0} sur cette page.",
  timerSpentSurvey: "Vous avez passé {0} au total.",
  timerLimitAll: "Vous avez passé {0} sur {1} sur cette page et {2} sur {3} au total.",
  timerLimitPage: "Vous avez passé {0} sur {1} sur cette page.",
  timerLimitSurvey: "Vous avez passé {0} sur {1} au total.",
  clearCaption: "Vider",
  signaturePlaceHolder: "Signez ici",
  signaturePlaceHolderReadOnly: "Pas de signature",
  chooseFileCaption: "Ajouter un fichier",
  takePhotoCaption: "Prendre une photo",
  photoPlaceholder: "Cliquez sur le bouton ci-dessous pour prendre une photo à l’aide de l’appareil photo.",
  fileOrPhotoPlaceholder: "Faites glisser et déposez ou sélectionnez un fichier à télécharger ou à prendre une photo à l’aide de l’appareil photo.",
  replaceFileCaption: "Remplacer le fichier",
  removeFileCaption: "Enlever ce fichier",
  booleanCheckedLabel: "Oui",
  booleanUncheckedLabel: "Non",
  confirmRemoveFile: "Êtes-vous certains de vouloir supprimer ce fichier : {0}?",
  confirmRemoveAllFiles: "Êtes-vous certains de vouloir supprimer tous les fichiers?",
  questionTitlePatternText: "Titre de la question",
  modalCancelButtonText: "Annuler",
  modalApplyButtonText: "Appliquer",
  filterStringPlaceholder: "Tapez pour rechercher...",
  emptyMessage: "Aucune donnée à afficher",
  noEntriesText: "Il n'y a pas encore d'entrées.\nCliquez sur le bouton ci-dessous pour ajouter une nouvelle entrée.",
  noEntriesReadonlyText: "Il n’y a pas d’entrées.",
  tabTitlePlaceholder: "Nouveau panneau",
  more: "Plus",
  tagboxDoneButtonCaption: "D’ACCORD",
  selectToRankEmptyRankedAreaText: "Tous les choix sont classés",
  selectToRankEmptyUnrankedAreaText: "Faites glisser et déposez les choix ici pour les classer",
  ok: "D’ACCORD",
  cancel: "Annuler"
};

setupLocale({ localeCode: "fr", strings: frenchSurveyStrings, nativeName: "français", englishName: "French" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Panel {panelIndex}"
// emptyMessage: "No data to display" => "Aucune donnée à afficher"
// noEntriesReadonlyText: "There are no entries." => "Il n’y a pas d’entrées."
// more: "More" => "Plus"
// tagboxDoneButtonCaption: "OK" => "D’ACCORD"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Tous les choix sont classés"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Faites glisser et déposez les choix ici pour les classer"// takePhotoCaption: "Take Photo" => "Prendre une photo"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Cliquez sur le bouton ci-dessous pour prendre une photo à l’aide de l’appareil photo."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Faites glisser et déposez ou sélectionnez un fichier à télécharger ou à prendre une photo à l’aide de l’appareil photo."
// replaceFileCaption: "Replace file" => "Remplacer le fichier"// eachRowUniqueError: "Each row must have a unique value." => "Chaque ligne doit avoir une valeur unique."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Les fichiers ne peuvent pas être téléchargés. Veuillez ajouter un gestionnaire pour l’événement 'onUploadFiles'."
// showDetails: "Show Details" => "Afficher les détails"
// hideDetails: "Hide Details" => "Masquer les détails"
// ok: "OK" => "D’ACCORD"
// cancel: "Cancel" => "Annuler"
// refuseItemText: "Refuse to answer" => "Refuser de répondre"
// dontKnowItemText: "Don't know" => "Sais pas"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Votre réponse dépasse 64 Ko. Veuillez réduire la taille de votre ou vos fichiers et réessayer ou contacter un propriétaire de sondage."
// signaturePlaceHolderReadOnly: "No signature" => "Pas de signature"// tabTitlePlaceholder: "New Panel" => "Nouveau panneau"// deselectAllItemText: "Deselect all" => "Désélectionner tout"
// textNoDigitsAllow: "Numbers are not allowed." => "Les numéros ne sont pas autorisés."