import { setupLocale } from "survey-core";

//On behalf of @kleinfelderm (https://github.com/kleinfelderm)

export var haitianCreoleStrings = {
  // "Previous"
  pagePrevText: "Anvan",
  // "Next"
  pageNextText: "Pwochen",
  // [Auto-translated] "First"
  pageFirstText: "Premye",
  // [Auto-translated] "Last"
  pageLastText: "Denye",
  // [Auto-translated] "of {0}"
  pagerTotalText: "nan {0}",
  // [Auto-translated] "Select Page"
  pagerSelectPageTitle: "Chwazi paj",
  // [Auto-translated] "Sort by {0}"
  sortByColumnText: "Triye pa {0}",
  // [Auto-translated] "High - Low"
  sortHighLowText: "Segondè - Low",
  // [Auto-translated] "Low - High"
  sortLowHighText: "Ba - Segondè",
  // [Auto-translated] "Alphabet, A - Z"
  sortAZText: "Alfabè, A - Z",
  // [Auto-translated] "Alphabet, Z - A"
  sortZAText: "Alfabè, Z - Yon",
  // [Auto-translated] "Newest first"
  sortNewestFirstText: "Dernye premye",
  // [Auto-translated] "Oldest first"
  sortOldestFirstText: "Pi ansyen premye",
  // [Auto-translated] "Sorted by {0}"
  sortOrderText: "Triye pa {0}",
  // [Auto-translated] "{0} ({1})"
  sortOrderLevelText: "{0} ({1})",
  // [Auto-translated] "{0}, then by {1}"
  sortOrderNextText: "{0}, Lè sa a, pa {1}",
  // [Auto-translated] "Sort by"
  sortByText: "Triye pa",
  // [Auto-translated] "Default"
  sortDefaultText: "Default",
  // [Auto-translated] "Sort field"
  sortFieldAriaLabel: "Triye jaden",
  // [Auto-translated] "Sort order"
  sortDirectionAriaLabel: "Sòt lòd",
  // [Auto-translated] "Add sort level"
  sortAddLevelText: "Ajoute triye nivo",
  // [Auto-translated] "Remove sort level {0}"
  sortRemoveLevelText: "Retire triye {0}",
  // [Auto-translated] "Sort field {0}"
  sortLevelFieldAriaLabel: "Sòt jaden {0}",
  // [Auto-translated] "Sort order {0}"
  sortLevelDirectionAriaLabel: "Sòt lòd {0}",
  // [Auto-translated] "Show all sort levels"
  sortMoreAriaLabel: "Montre tout nivo sòt",
  // [Auto-translated] "Add New"
  sortAddNewText: "Ajoute nouvo",
  // [Auto-translated] "Move sort level {0}"
  sortMoveLevelAriaLabel: "Deplase sòt nivo {0}",
  // "Complete"
  completeText: "Ranpli",
  // [Auto-translated] "Preview"
  previewText: "Preview",
  // [Auto-translated] "Edit"
  editText: "modifye",
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
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Reponn {0}/{1} kesyon",
  // [Auto-translated] "Question {0} of {1}"
  questionPositionProgressText: "Kesyon {0} {1}",
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
  // [Auto-translated] "You must select Yes to continue."
  requireTrueError: "Ou dwe chwazi Wi pou kontinye.",
  // [Auto-translated] "The value is incorrect."
  incorrectValueError: "Valè a pa kòrèk",
  // [Auto-translated] "The value contains unknown keys: {0}."
  incorrectValueUnknownKeysError: "Valè a gen kle enkoni: {0}.",
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
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Tanpri antre yon valè ki matche ak gwosè a etap nan {0}.",
  // "The value should not be greater than {0}"
  maxError: "Valè a pa ta dwe pi gran pase {0}",
  // [Auto-translated] "Invalid input"
  invalidInputError: "Opinyon envalid",
  // "Numbers are not allowed."
  textNoDigitsAllow: "Nimewo yo pa pèmèt.",
  // [Auto-translated] "Please complete the value to match the required format."
  incompletePatternError: "Tanpri ranpli valè a matche fòma obligatwa a.",
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
  // [Auto-translated] "Bytes, KB, MB, GB, TB"
  fileSizeUnits: "Bytes, KB, MB, GB, TB",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "Nimewo a maksimòm nan dosye ou ka telechaje se {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Fichye yo pa ka telechaje. Tanpri ajoute yon moun kap okipe evènman 'onUploadFiles' la.",
  // "Response required: enter another value."
  otherRequiredError: "Repons obligatwa: antre yon lòt valè.",
  // [Auto-translated] "The value '{0}' is not one of the available choices."
  variableValueNotInChoices: "Valè '{0}' se pa youn nan chwa ki disponib",
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
  // [Auto-translated] "Move row {0}"
  moveRowAriaLabel: "Deplase ranje {0}",
  // "There are no rows."
  noRowsText: "Pa gen ranje.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Row {rowIndex}",
  // [Auto-translated] "{rowTitle}"
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
  // "Try again"
  saveAgainButton: "Eseye ankò",
  // [Auto-translated] "min"
  timerMin: "min",
  // [Auto-translated] "sec"
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
  progressbar: "ba pwogrè",
  // [Auto-translated] "Page {0}"
  progressbarPage: "Paj {0}",
  // [Auto-translated] "Empty"
  conditionOperatorEmpty: "Vid",
  // [Auto-translated] "Not empty"
  conditionOperatorNotempty: "Pa vid",
  // [Auto-translated] "Equals"
  conditionOperatorEqual: "Egal",
  // [Auto-translated] "Does not equal"
  conditionOperatorNotequal: "Pa egal",
  // [Auto-translated] "Contains"
  conditionOperatorContains: "Gen ladan",
  // [Auto-translated] "Does not contain"
  conditionOperatorNotcontains: "Pa gen ladan",
  // [Auto-translated] "Any of"
  conditionOperatorAnyof: "Nenpòt nan",
  // [Auto-translated] "None of"
  conditionOperatorNoneof: "Okenn nan yo",
  // [Auto-translated] "All of"
  conditionOperatorAllof: "Tout",
  // [Auto-translated] "Greater than"
  conditionOperatorGreater: "Pi gwo pase",
  // [Auto-translated] "Less than"
  conditionOperatorLess: "Mwens pase",
  // [Auto-translated] "Greater than or equal to"
  conditionOperatorGreaterorequal: "Pi gran oswa egal a",
  // [Auto-translated] "Less than or equal to"
  conditionOperatorLessorequal: "Pi piti oswa egal a",
  // [Auto-translated] "Save"
  filterSave: "Sove",
  // [Auto-translated] "Filters"
  filterFilters: "Filtè",
  // [Auto-translated] "Filters: {0}"
  filterFiltersCount: "Filtè: {0}",
  // [Auto-translated] "Filters"
  filterDialogTitle: "Filtè",
  // [Auto-translated] "Search"
  filterSearchLabel: "Rechèch",
  // [Auto-translated] "Search by {0}"
  filterSearchPlaceholder: "Chèche pa {0}",
  // [Auto-translated] "Show More"
  filterShowMore: "Montre plis",
  // [Auto-translated] "Show Less"
  filterShowLess: "Montre mwens",
  // [Auto-translated] "Clear All"
  filterClearAll: "Efase Tout",
  // [Auto-translated] "Clear {0}"
  filterClearChip: "Klè {0}",
  // [Auto-translated] "Preset"
  filterPreset: "Predefini",
  // [Auto-translated] "Save as..."
  filterSaveAs: "Sove kòm...",
  // [Auto-translated] "Save"
  filterSaveAsSave: "Sove",
  // [Auto-translated] "Add \"{0}\"..."
  filterAddCustomValue: "Ajoute \"{0}\"...",
  // [Auto-translated] "Presets"
  filterPresetsTitle: "Predefini",
  // [Auto-translated] "Show {0} items"
  filterShowResultsCount: "Montre {0} atik yo",
  // [Auto-translated] "Show 1 item"
  filterShowOneResult: "Montre 1 atik",
  // [Auto-translated] "Show results"
  filterShowResults: "Montre rezilta yo",
  // [Auto-translated] "New Preset"
  filterAddPresetTitle: "Nouvo Preset",
  // [Auto-translated] "Name"
  filterPresetName: "Fe-apel",
  // [Auto-translated] "Contains"
  filterPresetContains: "Gen ladan",
  // [Auto-translated] "A preset with this name already exists."
  filterPresetTitleExists: "Yon preset ak non sa a deja egziste.",
  // [Auto-translated] "Add at least one condition."
  filterPresetNoConditions: "Ajoute omwen yon kondisyon.",
  // [Auto-translated] "Enter an expression."
  filterPresetNoExpression: "Antre yon ekspresyon.",
  // [Auto-translated] "The expression is not valid."
  filterPresetInvalidExpression: "Ekspresyon an pa valab.",
  // [Auto-translated] "Edit as Expression"
  filterEditAsText: "Modifye kòm Ekspresyon",
  // [Auto-translated] "Edit as Tagbox"
  filterEditAsFields: "Modifye kòm Tagbox",
  // [Auto-translated] "Type an expression here..."
  filterExpressionPlaceholder: "Tape yon ekspresyon isit la...",
  // [Auto-translated] "Edit Preset"
  filterEditPreset: "Modifye Predefini",
  // [Auto-translated] "Delete"
  filterDeletePreset: "Efase",
  // [Auto-translated] "Add New..."
  filterAddPreset: "Ajoute Nouvo...",
  // [Auto-translated] "Edit Selected..."
  filterEditSelected: "Edit Chwazi...",
  // [Auto-translated] "{0} Expression"
  filterPresetExpression: "{0} Ekspresyon",
  // [Auto-translated] "Edit..."
  filterEditExpression: "Edit...",
  // [Auto-translated] "Search in Filters"
  filterSearchInFilters: "Chèche nan Filtè yo",
  // [Auto-translated] "Nothing found, try different keywords"
  filterNothingFound: "Pa jwenn anyen, eseye diferan mo kle",
  // [Auto-translated] "Create preset with AI"
  filterAiPromptNew: "Kreye preset ak AI",
  // [Auto-translated] "Edit preset with AI"
  filterAiPromptEdit: "Modifye preset ak AI",
  // [Auto-translated] "For example, “Coffee & Tea from Germany”"
  filterAiPromptPlaceholder: "Pa egzanp, \"Kafe & Te soti Almay\"",
  // [Auto-translated] "Create"
  filterAiCreate: "Kreye",
  // [Auto-translated] "Edit"
  filterAiEdit: "Edit",
  // [Auto-translated] "Creating..."
  filterAiCreating: "Kreyasyon...",
  // [Auto-translated] "Editing..."
  filterAiEditing: "Edite...",
  // [Auto-translated] "AI could not make a filter. Try again."
  filterAiError: "AI pa t ka fè yon filtè. Eseye ankò.",
  // [Auto-translated] "AI could not make a filter of this description."
  filterAiEmpty: "AI pa t ka fè yon filtè konsa.",
  // [Auto-translated] "to select"
  keyboardHintSelectText: "pou chwazi",
  // [Auto-translated] "to toggle"
  keyboardHintToggleText: "pou vire",
  // [Auto-translated] "to navigate"
  keyboardHintNavigateText: "pou navige",
  // [Auto-translated] "to continue"
  keyboardHintContinueText: "pou kontinye",
  // [Auto-translated] "to submit"
  keyboardHintSubmitText: "pou soumèt",
  // [Auto-translated] "or"
  keyboardHintOrText: "oswa",
  // [Auto-translated] "for a new line"
  keyboardHintNewLineText: "pou yon nouvo liy",
  // [Auto-translated] "to next option"
  keyboardHintNextItemText: "nan pwochen opsyon",
  // [Auto-translated] "to move"
  keyboardHintMoveText: "pou avanse pou pi",
  // [Auto-translated] "to open"
  keyboardHintOpenText: "pou louvri",
  // [Auto-translated] "to close"
  keyboardHintCloseText: "femen"
};

setupLocale({ localeCode: "ht", strings: haitianCreoleStrings, nativeName: "Kreyòl ayisyen", englishName: "Haitian Creole" });