import { setupLocale } from "survey-core";

export var welshSurveyStrings = {
  // "Previous"
  pagePrevText: "Blaenorol",
  // "Next"
  pageNextText: "Nesaf",
  // "Complete"
  completeText: "Cwblhau",
  // "Preview"
  previewText: "Rhagolwg",
  // "Edit"
  editText: "Golygu",
  // "Start"
  startSurveyText: "Dechrau",
  // [Auto-translated] "Please leave a comment"
  commentText: "Gadewch sylw os gwelwch yn dda",
  // "Other (describe)"
  otherItemText: "Arall (disgrifiwch)",
  // "None"
  noneItemText: "Dim",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Gwrthod ateb",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Ddim yn gwybod",
  // "Select All"
  selectAllItemText: "Dewis y Cyfan ",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Dad-ddethol yr holl",
  // "Page {0} of {1}"
  progressText: "Tudalen {0} o {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} o {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Cofnod {0} o {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Wedi ateb {0}/{1} cwestiwn",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Does dim modd gweld tudalen na chwestiwn yn yr arolwg.",
  // "Thank you for completing the survey"
  completingSurvey: "Diolch am lenwi’r holiadur!",
  // "You have already completed this survey."
  completingSurveyBefore: "Rydych chi wedi llenwi’r arolwg hwn yn barod yn ôl ein cofnodion.",
  // "Loading Survey..."
  loadingSurvey: "Wrthi’n Llwytho’r Arolwg...",
  // "Select..."
  placeholder: "Dewiswch...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Dewis...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Dewis...",
  // "value"
  value: "gwerth",
  // "Response required."
  requiredError: "Atebwch y cwestiwn.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Atebwch o leiaf un cwestiwn.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Atebwch y cwestiynau ym mhob rhes.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Rhaid i bob rhes fod â gwerth unigryw.",
  // "The value should be numeric."
  numericError: "Dylai’r gwerth fod yn rhif.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "Ni ddylai'r gwerth fod yn llai na {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Rhowch werth sy'n cyfateb i faint cam {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "Ni ddylai'r gwerth fod yn fwy na {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Ni chaniateir rhifau.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Rhowch o leiaf {0} nod.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Rhowch lai na {0} nod.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Rhowch o leiaf {0} nod ond dim mwy na {1}.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Llenwch o leiaf {0} rhes.",
  // "Please select at least {0} option(s)."
  minSelectError: "Dewiswch o leiaf {0} amrywiolyn.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Peidiwch â dewis mwy na {0} amrywiolyn.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Dylai’r '{0}' fod yr un fath â {1} neu’n fwy, a’r fath â {2} neu’n llai",
  // "The '{0}' should be at least {1}"
  numericMin: "Dylai’r '{0}' fod yr un fath â {1} neu’n fwy",
  // "The '{0}' should be at most {1}"
  numericMax: "Dylai’r '{0}' fod yr un fath â {1} neu’n llai",
  // "Please enter a valid e-mail address."
  invalidEmail: "Rhowch gyfeiriad e-bost dilys.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Dylai’r mynegiad {0} arwain at 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Roedd y cais wedi arwain at y gwall '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Roedd y cais wedi arwain at ddata gwag neu mae priodwedd y ‘path’ yn anghywir ",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Ddylai’r ffeil ddim bod yn fwy na {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Ni ellir llwytho ffeiliau i fyny. Ychwanegwch handler ar gyfer y digwyddiad 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Rhowch y gwerth arall.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Mae eich ffeil wrthi’n llwytho i fyny. Arhoswch ychydig o eiliadau a rhoi cynnig arall arni.",
  // "Loading..."
  loadingFile: "Wrthi’n llwytho...",
  // "Choose file(s)..."
  chooseFile: "Dewiswch ffeil(iau)...",
  // "No file selected"
  noFileChosen: "Heb ddewis ffeil ",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Llusgwch a gollwng ffeil yma neu cliciwch ar y botwm isod i ddewis ffeil i'w llwytho i fyny.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Ydych chi am ddileu’r cofnod?",
  // "This value should be unique."
  keyDuplicationError: "Dylai’r gwerth hwn fod yn unigryw.",
  // "Add Column"
  addColumn: "Ychwanegu colofn ",
  // "Add Row"
  addRow: "Ychwanegu rhes",
  // "Remove"
  removeRow: "Tynnu",
  // [Auto-translated] "There are no rows."
  noRowsText: "Nid oes unrhyw ffraeau.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Rhes {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Ychwanegu o’r newydd",
  // "Remove"
  removePanel: "Tynnu",
  // [Auto-translated] "Show Details"
  showDetails: "Dangos manylion",
  // [Auto-translated] "Hide Details"
  hideDetails: "Manylion Cuddio",
  // "item"
  choices_Item: "eitem",
  // [Auto-translated] "Choice option"
  choices_Choice: "Dewis opsiwn",
  // "Column"
  matrix_column: "Colofn",
  // "Row"
  matrix_row: "Rhes",
  // [Auto-translated] "text"
  multipletext_itemname: "Testun",
  // "The results are being saved on the server..."
  savingData: "Mae’r canlyniadau’n cael eu cadw ar y gweinydd...",
  // "An error occurred and we could not save the results."
  savingDataError: "Roedd gwall a doedd dim modd cadw’r canlyniadau.",
  // "The results were saved successfully!"
  savingDataSuccess: "Wedi llwyddo i gadw’r canlyniadau!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Mae eich ymateb yn fwy na 64KB. Lleihau maint eich ffeil(iau) a cheisiwch eto neu cysylltwch â pherchennog yr arolwg.",
  // "Try again"
  saveAgainButton: "Rhowch gynnig arall arni",
  // "min"
  timerMin: "mun",
  // "sec"
  timerSec: "eil",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Rydych chi wedi treulio {0} ar y dudalen hon a {1} gyda’i gilydd.",
  // "You have spent {0} on this page."
  timerSpentPage: "Rydych chi wedi treulio {0} ar y dudalen hon.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Rydych chi wedi treulio {0} gyda’i gilydd.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Rydych chi wedi treulio {0} o {1} ar y dudalen hon a {2} o {3} gyda’i gilydd.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Rydych chi wedi treulio {0} o {1} ar y dudalen hon.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Rydych chi wedi treulio {0} o {1} gyda’i gilydd.",
  // "Clear"
  clearCaption: "Clirio",
  // [Auto-translated] "Select"
  selectCaption: "Dewis",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Arwydd yma",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Dim llofnod",
  // "Select File"
  chooseFileCaption: "Dewiswch ffeil ",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Tynnu Llun",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Cliciwch y botwm isod i dynnu llun gan ddefnyddio'r camera.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Llusgwch a gollwng neu dewiswch ffeil i lanlwytho neu dynnu llun gan ddefnyddio'r camera.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Amnewid ffeil",
  // "Remove this file"
  removeFileCaption: "Tynnu’r ffeil hon ",
  // "Yes"
  booleanCheckedLabel: "Iawn",
  // "No"
  booleanUncheckedLabel: "Na",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Ydych chi’n siŵr eich bod am dynnu’r ffeil hon: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Ydych chi’n siŵr eich bod am dynnu pob ffeil?",
  // "Question Title"
  questionTitlePatternText: "Teitl y Cwestiwn ",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Canslo",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Cynnig",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Teipiwch i chwilio...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Dim data i'w arddangos",
  // [Auto-translated] "Loading..."
  loadingPage: "Llwytho...",
  // [Auto-translated] "Loading..."
  loadingData: "Llwytho...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Dim cofnodion eto.\nCliciwch y botwm isod i ychwanegu cofnod newydd.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Dim cofnodion",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Panel newydd",
  // [Auto-translated] "More"
  more: "Rhagor",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OCÊ",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Dewisir pob dewis ar gyfer graddio",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Llusgwch ddewisiadau yma i'w graddio",
  // [Auto-translated] "OK"
  ok: "OCÊ",
  // [Auto-translated] "Cancel"
  cancel: "Canslo",
  // "Create \"{0}\" item..."
  createCustomItem: "Creu eitem \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Tabl cynnwys",
  // [Auto-translated] "Progress bar"
  progressbar: "Bar cynnydd"
};

setupLocale({ localeCode: "cy", strings: welshSurveyStrings, nativeName: "cymraeg", englishName: "Welsh" });