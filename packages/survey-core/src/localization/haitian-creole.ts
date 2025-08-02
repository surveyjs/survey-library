import { setupLocale } from "survey-core";

//On behalf of @kleinfelderm (https://github.com/kleinfelderm)

export var haitianCreoleStrings = {
  // "Previous"
  pagePrevText: "Anvan",
  // "Next"
  pageNextText: "Pwochen",
  // "Complete"
  completeText: "Ranpli",
  // "Preview"
  previewText: "Preview",
  // "Edit"
  editText: "Edit",
  // "Start"
  startSurveyText: "Kòmanse",
  // [Auto-translated] "Please leave a comment"
  commentText: "Tanpri kite yon kòmantè",
  // "Other (describe)"
  otherItemText: "Lòt (dekri)",
  // "None"
  noneItemText: "Okenn",
  // "Refuse to answer"
  refuseItemText: "Refize reponn",
  // "Don't know"
  dontKnowItemText: "pa konnen",
  // "Select All"
  selectAllItemText: "Chwazi Tout",
  // "Deselect all"
  deselectAllItemText: "Deseleksyone tout",
  // "Page {0} of {1}"
  progressText: "Paj {0} nan {1}",
  // "{0} of {1}"
  indexText: "{0} nan {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "{0} nan {1}",
  // "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Reponn {0}/{1} kesyon",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Sondaj la pa genyen okenn eleman vizib.",
  // "Thank you for completing the survey"
  completingSurvey: "Mèsi paske w fin ranpli sondaj la",
  // "You have already completed this survey."
  completingSurveyBefore: "Ou te deja ranpli sondaj sa a.",
  // "Loading Survey..."
  loadingSurvey: "Chaje sondaj...",
  // "Select..."
  placeholder: "Chwazi...",
  // "Select..."
  ratingOptionsCaption: "Chwazi...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Chwazi ...",
  // "value"
  value: "valè",
  // "Response required."
  requiredError: "Repons obligatwa.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Repons obligatwa: reponn omwen yon kesyon.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Repons obligatwa: reponn kesyon nan tout ranje.",
  // "Each row must have a unique value."
  eachRowUniqueError: "Chak ranje dwe gen yon valè inik.",
  // "The value should be numeric."
  numericError: "Valè a ta dwe nimerik.",
  // "The value should not be less than {0}"
  minError: "Valè a pa ta dwe mwens pase {0}",
  // "The value should not be greater than {0}"
  maxError: "Valè a pa ta dwe pi gran pase {0}",
  // "Numbers are not allowed."
  textNoDigitsAllow: "Nimewo yo pa pèmèt.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Tanpri antre omwen {0} karaktè (yo).",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Tanpri antre pa plis pase {0} karaktè (yo).",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Tanpri antre omwen {0} e pa plis pase {1} karaktè.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Tanpri ranpli omwen {0} ranje (yo).",
  // "Please select at least {0} option(s)."
  minSelectError: "Tanpri chwazi omwen {0} opsyon (yo).",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Tanpri chwazi pa plis pase {0} opsyon (yo).",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' ta dwe omwen {1} ak pi plis {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' ta dwe omwen {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "' a{0}' ta dwe pi plis {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Tanpri antre yon adrès imel ki valab.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Ekspresyon an: {0} ta dwe retounen 'vre'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Rekèt la te retounen erè '{0}'.{1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Rekèt la te retounen done vid oswa pwopriyete 'chemen' a pa kòrèk",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Gwosè dosye a pa ta dwe depase {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Fichye yo pa ka telechaje. Tanpri ajoute yon moun kap okipe evènman 'onUploadFiles' la.",
  // "Response required: enter another value."
  otherRequiredError: "Repons obligatwa: antre yon lòt valè.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Fichye w ap telechaje. Tanpri tann plizyè segonn epi eseye ankò.",
  // "Loading..."
  loadingFile: "Chaje...",
  // "Choose file(s)..."
  chooseFile: "Chwazi fichye (yo)...",
  // "No file selected"
  noFileChosen: "Pa gen fichye chwazi",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Trennen epi depoze yon fichye isit la oswa klike sou bouton ki anba a pou chwazi yon fichye pou w telechaje.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Èske w sèten ou vle efase dosye sa a?",
  // "This value should be unique."
  keyDuplicationError: "Valè sa a ta dwe inik.",
  // "Add Column"
  addColumn: "Ajoute Kolòn",
  // "Add Row"
  addRow: "Ajoute Ranje",
  // "Remove"
  removeRow: "Retire",
  // "There are no rows."
  noRowsText: "Pa gen ranje.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Row {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Ajoute nouvo",
  // "Remove"
  removePanel: "Retire",
  // "Show Details"
  showDetails: "Montre detay",
  // "Hide Details"
  hideDetails: "Kache Detay yo",
  // "item"
  choices_Item: "atik",
  // "Choice option"
  choices_Choice: "Opsyon chwa",
  // "Column"
  matrix_column: "Kolòn",
  // "Row"
  matrix_row: "Ranje",
  // "text"
  multipletext_itemname: "tèks",
  // "The results are being saved on the server..."
  savingData: "Rezilta yo ap sove sou sèvè a...",
  // "An error occurred and we could not save the results."
  savingDataError: "Yon erè te fèt epi nou pa t 'kapab sove rezilta yo.",
  // "The results were saved successfully!"
  savingDataSuccess: "Rezilta yo te sove avèk siksè!",
  // "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Repons ou depase 64KB. Tanpri redwi gwosè fichye w la (yo) epi eseye ankò oswa kontakte pwopriyetè sondaj la.",
  // "Try again"
  saveAgainButton: "Eseye ankò",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sec",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Ou te depanse {0} sou paj sa a epi {1} an total.",
  // "You have spent {0} on this page."
  timerSpentPage: "Ou te depanse {0} sou paj sa a.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Ou te depanse {0} an total.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Ou te depanse {0} nan {1} sou paj sa a epi {2} nan {3} an total.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Ou te depanse {0} nan {1} sou paj sa a.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Ou te depanse {0} nan {1} an total.",
  // "Clear"
  clearCaption: "Klè",
  // [Auto-translated] "Select"
  selectCaption: "Chwazi",
  // "Sign here"
  signaturePlaceHolder: "Siyen isit la",
  // "No signature"
  signaturePlaceHolderReadOnly: "Pa gen siyati",
  // "Select File"
  chooseFileCaption: "Chwazi File",
  // "Take Photo"
  takePhotoCaption: "Pran Foto",
  // "Click the button below to take a photo using the camera."
  photoPlaceholder: "Klike sou bouton ki anba a pou pran yon foto ak kamera a.",
  // "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Trennen epi depoze oswa chwazi yon dosye pou w telechaje oswa pran yon foto lè l sèvi avèk kamera a.",
  // "Replace file"
  replaceFileCaption: "Ranplase fichye a",
  // "Remove this file"
  removeFileCaption: "Retire fichye sa a",
  // "Yes"
  booleanCheckedLabel: "Wi",
  // "No"
  booleanUncheckedLabel: "Non",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Èske ou sèten ou vle retire dosye sa a: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Èske w sèten ou vle retire tout fichye yo?",
  // "Question Title"
  questionTitlePatternText: "Tit kesyon",
  // "Cancel"
  modalCancelButtonText: "Anile",
  // "Apply"
  modalApplyButtonText: "Aplike",
  // "Type to search..."
  filterStringPlaceholder: "Tape pou chèche...",
  // "No data to display"
  emptyMessage: "Pa gen done pou montre",
  // "Loading..."
  loadingPage: "Chaje...",
  // "Loading..."
  loadingData: "Chaje...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Pa gen okenn antre ankò.\nKlike sou bouton ki anba a pou ajoute yon nouvo antre.",
  // "No entries"
  noEntriesReadonlyText: "Pa gen antre",
  // "New Panel"
  tabTitlePlaceholder: "Nouvo Panel",
  // "More"
  more: "Plis",
  // "OK"
  tagboxDoneButtonCaption: "OKE",
  // "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Tout chwa yo chwazi pou klasman",
  // "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Trennen chwa isit la pou klase yo",
  // "OK"
  ok: "OKE",
  // "Cancel"
  cancel: "Anile",
  // "Create \"{0}\" item..."
  createCustomItem: "Kreye \"{0}\" atik ...",
  // [Auto-translated] "Table of contents"
  toc: "Sa ki nan yon tablo",
  // [Auto-translated] "Progress bar"
  progressbar: "ba pwogrè"
};

setupLocale({ localeCode: "ht", strings: haitianCreoleStrings, nativeName: "Kreyòl ayisyen", englishName: "Haitian Creole" });