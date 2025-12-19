import { setupLocale } from "survey-core";

export var teluguStrings = {
  // "Previous"
  pagePrevText: "వెనకటి",
  // "Next"
  pageNextText: "తరువాయ",
  // "Complete"
  completeText: "పూర్తి చేయండి",
  // "Preview"
  previewText: "ముందుగా వీక్షించు",
  // "Edit"
  editText: "మార్పులు చెయ్యి",
  // "Start"
  startSurveyText: "ప్రారంభించు",
  // [Auto-translated] "Please leave a comment"
  commentText: "దయచేసి ఒక వ్యాఖ్య ఇవ్వండి",
  // "Other (describe)"
  otherItemText: "ఇతరమైన(వివరించండి)",
  // [Auto-translated] "None"
  noneItemText: "ఎవరు కాదు",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "సమాధానం ఇవ్వడానికి నిరాకరించండి",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "తెలియదు",
  // "Select All"
  selectAllItemText: "అన్ని ఎంచుకో",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Deselect all",
  // "Page {0} of {1}"
  progressText: "పేజీ{0}/{1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{1} {0}[మార్చు]",
  // "{0} of {1}"
  panelDynamicProgressText: "దాఖలాలు{0}/{1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "{0}/{1} ప్రశ్నలకు జవాబు ఇవ్వడం అయినది",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "ఈ సర్వేలో పేజీలు గాని ప్రశ్నలు గాని కనబడుట లేదు",
  // "Thank you for completing the survey"
  completingSurvey: "సర్వేను ముగించి నందుకు ధన్యవాదములు",
  // "You have already completed this survey."
  completingSurveyBefore: " మీరు ఇప్పటికే సర్వేను ముగించినట్లు మా రికార్డులు చూపిస్తున్నాయి",
  // "Loading Survey..."
  loadingSurvey: "సర్వే లోడ్ అవుతుంది",
  // "Select..."
  placeholder: "ఎన్నుకోండి",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "ఎంచు...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "ఎంచు...",
  // "value"
  value: "విలువ",
  // "Response required."
  requiredError: "దయచేసి ప్రశ్నకు జవాబు ఇవ్వండి",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "దయచేసి కనీసం ఒక్క ప్రశ్నకైనా జవాబు ఇవ్వండి",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "దయచేసి అన్ని వరుసలలో ఉన్న ప్రశ్నలకు జవాబు ఇవ్వండి",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "ప్రతి వరుసకు ఒక ప్రత్యేకమైన విలువ ఉండాలి.",
  // "The value should be numeric."
  numericError: "విలువను సంఖ్యలలో తెలియజేయండి",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "విలువ {0} కంటే తక్కువగా ఉండకూడదు.",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "{0} యొక్క దశ సైజుకు జత అయ్యే విలువను దయచేసి నమోదు చేయండి.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "విలువ {0} కంటే ఎక్కువ ఉండకూడదు.",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "అంకెలు అనుమతించబడవు.",
  // "Please enter at least {0} character(s)."
  textMinLength: "దయచేసి కనీసం {0} అక్షరాలను నమోదు చేయండి",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "దయచేసి {0} కన్నా తక్కువ అక్షరాలను నమోదు చేయండి",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "దయచేసి {0} కన్నా ఎక్కువ మరియు{1} కన్నా తక్కువ అక్షరాలను నమోదు చేయండి",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "దయచేసి కనీసం {0}వరుసలను పూరించండి",
  // "Please select at least {0} option(s)."
  minSelectError: "దయచేసి కనీసం{0} రకాలను ఎన్నుకోండి",
  // "Please select no more than {0} option(s)."
  maxSelectError: "దయచేసి {0} కన్నా ఎక్కువ రకాలను ఎన్నుకో కండి",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' {1}తొ సమానంగా లేదా {1} కన్నా ఎక్కువ గా మరియు  {2}కన్నా తక్కువ ఉండాలి లెదా {2}తొ సమానంగా ఉండాలి",
  // "The '{0}' should be at least {1}"
  numericMin: "''{0}' {1}తొ  సమానంగా లేదా  {1}కన్నా ఎక్కువగా ఉండాలి",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}'  {1}  తక్కువ లేదా సమానంగా ఉండాలి",
  // "Please enter a valid e-mail address."
  invalidEmail: "దయచేసి సరైన ఈమెయిల్  నమోదు చేయండి",
  // "The expression: {0} should return 'true'."
  invalidExpression: "{0} 'నిజం' అని తిరిగివ్వాలి",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "విన్నపము {0} ని తప్పుగా గుర్తించింది {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "విన్నపము ఖాళీ డేటాని తిరిగిచ్చింది, లేదా path తప్పైన ది",
  // "The file size should not exceed {0}."
  exceedMaxSize: "ఫైల్ పరిమాణం{0} కంటే పెద్దదిగా ఉండకూడదు",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "ఫైళ్లను అప్ లోడ్ చేయలేం. దయచేసి 'ఆన్ అప్ లోడ్ ఫైల్స్' ఈవెంట్ కొరకు ఒక హ్యాండ్లర్ ని జోడించండి.",
  // "Response required: enter another value."
  otherRequiredError: "దయచేసి ఇతర విలువలను నమో దించండి",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "మీ ఫైల్ అప్లోడ్ అవుతున్నది దయచేసి కొన్ని సెకండ్లు వేచి ఉండండి మరియు మళ్లీ ప్రయత్నించండి",
  // "Loading..."
  loadingFile: "లోడ్ అవుతున్నది",
  // "Choose file(s)..."
  chooseFile: "ఫైళ్లను ఎన్నుకోండి",
  // "No file selected"
  noFileChosen: "ఏ ఫైల్ ఎన్నుకో లేదు",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "ఒక ఫైల్ ను ఇక్కడ డ్రాగ్ చేసి డ్రాప్ చేయండి లేదా అప్ లోడ్ చేయడానికి ఫైల్ ఎంచుకోవడానికి దిగువ బటన్ మీద క్లిక్ చేయండి.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "మీరు రికార్డులను తొలగించాలని అనుకుంటున్నారా",
  // "This value should be unique."
  keyDuplicationError: "విలువ ప్రత్యేకంగా ఉండాలి",
  // "Add Column"
  addColumn: "కాలం చేర్పించండి",
  // "Add Row"
  addRow: "వరుసలు చేర్పించండి",
  // "Remove"
  removeRow: "తీసేయండి",
  // [Auto-translated] "There are no rows."
  noRowsText: "వరుసలు లేవు.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Row {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "కొత్త దాన్ని చేర్పించండి",
  // "Remove"
  removePanel: "తీసేయండి",
  // [Auto-translated] "Show Details"
  showDetails: "వివరాలు చూపించు",
  // [Auto-translated] "Hide Details"
  hideDetails: "వివరాలను దాచండి",
  // "item"
  choices_Item: "వస్తువులు",
  // [Auto-translated] "Choice option"
  choices_Choice: "ఛాయిస్ ఆప్షన్",
  // "Column"
  matrix_column: "కాలం ",
  // "Row"
  matrix_row: "వరుస",
  // [Auto-translated] "text"
  multipletext_itemname: "వచనం",
  // "The results are being saved on the server..."
  savingData: "ఫలితాంశాలు సర్వర్లో సేవ్ అవుతున్నాయి",
  // "An error occurred and we could not save the results."
  savingDataError: "ఒక లోపము సంభవించినది అందుకని ఫలితాంశాలను సేవ్ చేయలేకపోయాము  ",
  // "The results were saved successfully!"
  savingDataSuccess: "ఫలితాంశాలను విజయవంతంగా సేవ్ చేసాము",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "మీ ప్రతిస్పందన 64KBని మించిపోయింది. దయచేసి మీ ఫైల్(లు) పరిమాణాన్ని తగ్గించండి మరియు మళ్లీ ప్రయత్నించండి లేదా సర్వే యజమానిని సంప్రదించండి.",
  // "Try again"
  saveAgainButton: "మళ్లీ ప్రయత్నించు",
  // "min"
  timerMin: "నిమిషాలు ",
  // "sec"
  timerSec: "సెకండ్లు",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "ఈ పేజీ పైన మీరు{0}  ఉపయోగించారు మొత్తంగా  {1} ఉపయోగించారు",
  // "You have spent {0} on this page."
  timerSpentPage: "ఈ పేజీ పైన మీరు{0} ఉపయోగించారు",
  // "You have spent {0} in total."
  timerSpentSurvey: "మీరు మొత్తంగా {0}  ఉపయోగించారు",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "ఈ పేజీ పైన మీరు {1}లో {0} భాగాన్ని ఉపయోగించారు. మోతంగా {3}లో {2} భాగాన్ని ఉపయోగించారు.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "ఈ పేజీలో మీరు {1}లోని{0} ని ఉపయోగించారు",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: " మొత్తంగా మీరు {1} లో {0} ని ఉపయోగించారు ",
  // "Clear"
  clearCaption: "స్పష్టమ్",
  // [Auto-translated] "Select"
  selectCaption: "ఎంచు",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "ఇక్కడ సంతకం చేయండి",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "సంతకం లేదు",
  // "Select File"
  chooseFileCaption: "ఫైల్ ఎంచుకోండి",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "ఫోటో తీసుకోండి",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "కెమెరాను ఉపయోగించి ఫోటో తీయడానికి దిగువ బటన్ మీద క్లిక్ చేయండి.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "కెమెరాను ఉపయోగించి ఫోటోను అప్ లోడ్ చేయడానికి లేదా తీయడానికి ఫైల్ ను డ్రాగ్ మరియు డ్రాప్ చేయండి లేదా ఎంచుకోండి.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "ఫైలు మార్చండి",
  // "Remove this file"
  removeFileCaption: "ఈ ఫైల్ తీసేయండి",
  // "Yes"
  booleanCheckedLabel: "అవును",
  // "No"
  booleanUncheckedLabel: "లేదు",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: " ఈ ఫైల్ని తీయించాలని మీరు ఖచ్చితంగా అనుకుంటున్నారా:{0} ?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "అన్ని ఫైళ్లను తీసేయాలని మీరు ఖచ్చితంగా అనుకుంటున్నారా",
  // "Question Title"
  questionTitlePatternText: "ప్రశ్న శీర్షిక",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "రద్దు",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "సరిపడు",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "శోధించడానికి టైప్ చేయండి...",
  // [Auto-translated] "No data to display"
  emptyMessage: "డిస్ ప్లే చేయడానికి డేటా లేదు",
  // [Auto-translated] "Loading..."
  loadingPage: "లోడింగ్...",
  // [Auto-translated] "Loading..."
  loadingData: "లోడింగ్...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "ఇంకా ఎంట్రీలు లేవు.\nకొత్త ఎంట్రీని జోడించడం కొరకు దిగువ బటన్ మీద క్లిక్ చేయండి.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "ఎంట్రీలు లేవు",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "కొత్త ప్యానెల్",
  // [Auto-translated] "More"
  more: "ఎక్కువ",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "సరే",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "ర్యాంకింగ్ కొరకు అన్ని ఎంపికలు ఎంపిక చేయబడతాయి.",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "వాటిని ర్యాంక్ చేయడం కొరకు ఎంపికలను ఇక్కడ డ్రాగ్ చేయండి",
  // [Auto-translated] "OK"
  ok: "సరే",
  // [Auto-translated] "Cancel"
  cancel: "రద్దు",
  // "Create \"{0}\" item..."
  createCustomItem: "\"{0}\" ఐటమ్ సృష్టించండి...",
  // [Auto-translated] "Table of contents"
  toc: "విషయ పట్టిక[మార్చు]",
  // [Auto-translated] "Progress bar"
  progressbar: "పురోగతి బార్"
};

setupLocale({ localeCode: "tel", strings: teluguStrings, nativeName: "తెలుగు", englishName: "Telugu" });