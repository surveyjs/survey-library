import { setupLocale } from "survey-core";

export var greekSurveyStrings = {
  // "Previous"
  pagePrevText: "Προηγούμενο",
  // "Next"
  pageNextText: "Επόμενο",
  // "Complete"
  completeText: "Ολοκλήρωση",
  // "Preview"
  previewText: "Προεπισκόπηση",
  // "Edit"
  editText: "Επεξεργασία",
  // "Start"
  startSurveyText: "Αρχή",
  // [Auto-translated] "Please leave a comment"
  commentText: "Παρακαλώ αφήστε ένα σχόλιο",
  // "Other (describe)"
  otherItemText: "Άλλο (παρακαλώ διευκρινίστε)",
  // "None"
  noneItemText: "Κανένας",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Αρνηθείτε να απαντήσετε",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Δεν ξέρω",
  // "Select All"
  selectAllItemText: "Επιλογή όλων",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Αποεπιλογή όλων",
  // "Page {0} of {1}"
  progressText: "Σελίδα {0} από {1}",
  // "{0} of {1}"
  indexText: "{0} από {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Εγγραφή {0} από {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Πίνακας {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Απαντήθηκαν {0} / {1} ερωτήσεις",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Δεν υπάρχει καμία ορατή σελίδα ή ορατή ερώτηση σε αυτό το ερωτηματολόγιο.",
  // "Thank you for completing the survey"
  completingSurvey: "Ευχαριστούμε για την συμπλήρωση αυτού του ερωτηματολογίου!",
  // "You have already completed this survey."
  completingSurveyBefore: "Τα αρχεία μας δείχνουν ότι έχετε ήδη ολοκληρώσει αυτήν την έρευνα.",
  // "Loading Survey..."
  loadingSurvey: "Το ερωτηματολόγιο φορτώνεται απο το διακομιστή...",
  // "Select..."
  placeholder: "Επιλέξτε...",
  // "Select..."
  ratingOptionsCaption: "Πατήστε για να βαθμολογήσετε εδώ...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Διαλέγω...",
  // "value"
  value: "τιμή",
  // "Response required."
  requiredError: "Παρακαλώ απαντήστε στην ερώτηση.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Απαντήστε σε τουλάχιστον μία ερώτηση.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Παρακαλώ απαντήστε τις ερωτήσεις σε όλες τις γραμμές.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Κάθε γραμμή πρέπει να έχει μια μοναδική τιμή.",
  // "The value should be numeric."
  numericError: "Η τιμή πρέπει να είναι αριθμητική.",
  // "The value should not be less than {0}"
  minError: "Η τιμή δεν πρέπει να είναι μικρότερη από {0}",
  // "The value should not be greater than {0}"
  maxError: "Η τιμή δεν πρέπει να είναι μεγαλύτερη από {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Οι αριθμοί δεν επιτρέπονται.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Παρακαλώ συμπληρώστε τουλάχιστον {0} χαρακτήρες.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Εισαγάγετε λιγότερους από {0} χαρακτήρες.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Εισαγάγετε περισσότερους από {0} και λιγότερους από {1} χαρακτήρες.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Παρακαλώ συμπληρώστε τουλάχιστον {0} γραμμές.",
  // "Please select at least {0} option(s)."
  minSelectError: "Παρακαλώ επιλέξτε τουλάχιστον {0} παραλλαγές.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Παρακαλώ επιλέξτε όχι παραπάνω απο {0} παραλλαγές.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Το '{0}' θα πρέπει να είναι ίσο ή μεγαλύτερο απο το {1} και ίσο ή μικρότερο απο το {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "Το '{0}' πρέπει να είναι μεγαλύτερο ή ισο με το {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "Το '{0}' πρέπει να είναι μικρότερο ή ίσο απο το {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Παρακαλώ δώστε μια αποδεκτή διεύθυνση e-mail.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Η έκφραση: {0} θα πρέπει να επιστρέψει 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Η αίτηση επέστρεψε σφάλμα '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Η αίτηση επέστρεψε κενά δεδομένα ή η ιδιότητα 'μονοπάτι/path' είναι εσφαλμένη",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Το μέγεθος του αρχείου δεν μπορεί να υπερβαίνει τα {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Δεν είναι δυνατή η αποστολή αρχείων. Προσθέστε ένα πρόγραμμα χειρισμού για το συμβάν 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Παρακαλώ συμπληρώστε την τιμή για το πεδίο 'άλλο'.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Το αρχείο σας ανεβαίνει. Παρακαλώ περιμένετε μερικά δευτερόλεπτα και δοκιμάστε ξανά.",
  // "Loading..."
  loadingFile: "Φόρτωση...",
  // "Choose file(s)..."
  chooseFile: "Επιλογή αρχείων ...",
  // "No file selected"
  noFileChosen: "Δεν έχει επιλεγεί αρχείο",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Αποθέστε το αρχείο σας εδώ ή κάντε κλικ στο κουμπί παρακάτω για να φορτώσετε το αρχείο.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Θέλετε να διαγράψετε την εγγραφή;",
  // "This value should be unique."
  keyDuplicationError: "Αυτή η τιμή πρέπει να είναι μοναδική.",
  // "Add Column"
  addColumn: "Προσθήκη στήλης",
  // "Add Row"
  addRow: "Προσθήκη γραμμής",
  // "Remove"
  removeRow: "Αφαίρεση",
  // "There are no rows."
  noRowsText: "Δεν υπάρχουν εγγραφές.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Γραμμή {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Προσθέστε νέο",
  // "Remove"
  removePanel: "Αφαίρεση",
  // [Auto-translated] "Show Details"
  showDetails: "Εμφάνιση λεπτομερειών",
  // [Auto-translated] "Hide Details"
  hideDetails: "Απόκρυψη λεπτομερειών",
  // "item"
  choices_Item: "είδος",
  // [Auto-translated] "Choice option"
  choices_Choice: "Επιλογή επιλογής",
  // "Column"
  matrix_column: "Στήλη",
  // "Row"
  matrix_row: "Γραμμή",
  // "text"
  multipletext_itemname: "κείμενο",
  // "The results are being saved on the server..."
  savingData: "Τα αποτελέσματα αποθηκεύονται στον διακομιστή ...",
  // "An error occurred and we could not save the results."
  savingDataError: "Παρουσιάστηκε σφάλμα και δεν ήταν δυνατή η αποθήκευση των αποτελεσμάτων.",
  // "The results were saved successfully!"
  savingDataSuccess: "Τα αποτελέσματα αποθηκεύτηκαν με επιτυχία!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner."
  savingExceedSize: "Η απάντησή σας υπερβαίνει τα 64KB. Μειώστε το μέγεθος των αρχείων σας και προσπαθήστε ξανά ή επικοινωνήστε με έναν κάτοχο έρευνας.",
  // "Try again"
  saveAgainButton: "Προσπάθησε ξανά",
  // "min"
  timerMin: "ελάχ",
  // "sec"
  timerSec: "δευτ",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Έχετε δαπανήσει {0} σε αυτήν τη σελίδα και {1} συνολικά.",
  // "You have spent {0} on this page."
  timerSpentPage: "Έχετε ξοδέψει {0} σε αυτήν τη σελίδα.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Έχετε ξοδέψει συνολικά {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Έχετε δαπανήσει {0} από {1} σε αυτήν τη σελίδα και {2} από {3} συνολικά.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Έχετε ξοδέψει {0} από {1} σε αυτήν τη σελίδα.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Έχετε ξοδέψει {0} από {1} συνολικά.",
  // "Clear"
  clearCaption: "Εκκαθάριση",
  // "Sign here"
  signaturePlaceHolder: "Υπογράψτε εδώ",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Χωρίς υπογραφή",
  // "Select File"
  chooseFileCaption: "Επιλέξτε αρχείο",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Λήψη φωτογραφίας",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Κάντε κλικ στο παρακάτω κουμπί για να τραβήξετε μια φωτογραφία χρησιμοποιώντας την κάμερα.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Σύρετε και αποθέστε ή επιλέξτε ένα αρχείο για αποστολή ή λήψη φωτογραφίας χρησιμοποιώντας την κάμερα.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Αντικατάσταση αρχείου",
  // "Remove this file"
  removeFileCaption: "Διαγράψτε αυτό το αρχείο",
  // "Yes"
  booleanCheckedLabel: "Ναι",
  // "No"
  booleanUncheckedLabel: "Όχι",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτό το αρχείο: {0};",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Είστε βέβαιοι ότι θέλετε να διαγράψετε όλα τα αρχεία;",
  // "Question Title"
  questionTitlePatternText: "Τίτλος ερώτησης",
  // "Cancel"
  modalCancelButtonText: "Άκυρο",
  // "Apply"
  modalApplyButtonText: "Εφαρμογή",
  // "Type to search..."
  filterStringPlaceholder: "Πληκτρολογήστε για αναζήτηση...",
  // "No data to display"
  emptyMessage: "Δεν υπάρχουν δεδομένα προς εμφάνιση",
  // [Auto-translated] "Loading..."
  loadingPage: "Φόρτωση...",
  // [Auto-translated] "Loading..."
  loadingData: "Φόρτωση...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Δεν υπάρχουν ακόμη εγγραφές.\nΚάντε κλικ στο κουμπί παρακάτω για να προσθέσετε μια νέα εγγραφή.",
  // [Auto-translated] "There are no entries."
  noEntriesReadonlyText: "Δεν υπάρχουν καταχωρήσεις.",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Νέο πάνελ",
  // "More"
  more: "Περισσότερα",
  // "OK"
  tagboxDoneButtonCaption: "ΟΚ",
  // [Auto-translated] "All choices are ranked"
  selectToRankEmptyRankedAreaText: "Όλες οι επιλογές κατατάσσονται",
  // [Auto-translated] "Drag and drop choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Σύρετε και αποθέστε επιλογές εδώ για να τις κατατάξετε",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Ακυρώνω",
  // "Create \"{0}\" item..."
  createCustomItem: "Δημιουργία στοιχείου \"{0}\"..."
};

setupLocale({ localeCode: "el", strings: greekSurveyStrings, nativeName: "ελληνικά", englishName: "Greek" });