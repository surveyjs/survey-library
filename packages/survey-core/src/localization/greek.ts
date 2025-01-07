import { setupLocale } from "survey-core";

export var greekSurveyStrings = {
  pagePrevText: "Προηγούμενο",
  pageNextText: "Επόμενο",
  completeText: "Ολοκλήρωση",
  previewText: "Προεπισκόπηση",
  editText: "Επεξεργασία",
  startSurveyText: "Αρχή",
  otherItemText: "Άλλο (παρακαλώ διευκρινίστε)",
  noneItemText: "Κανένας",
  refuseItemText: "Αρνηθείτε να απαντήσετε",
  dontKnowItemText: "Δεν ξέρω",
  selectAllItemText: "Επιλογή όλων",
  deselectAllItemText: "Αποεπιλογή όλων",
  progressText: "Σελίδα {0} από {1}",
  indexText: "{0} από {1}",
  panelDynamicProgressText: "Εγγραφή {0} από {1}",
  panelDynamicTabTextFormat: "Πίνακας {panelIndex}",
  questionsProgressText: "Απαντήθηκαν {0} / {1} ερωτήσεις",
  emptySurvey: "Δεν υπάρχει καμία ορατή σελίδα ή ορατή ερώτηση σε αυτό το ερωτηματολόγιο.",
  completingSurvey: "Ευχαριστούμε για την συμπλήρωση αυτού του ερωτηματολογίου!",
  completingSurveyBefore: "Τα αρχεία μας δείχνουν ότι έχετε ήδη ολοκληρώσει αυτήν την έρευνα.",
  loadingSurvey: "Το ερωτηματολόγιο φορτώνεται απο το διακομιστή...",
  placeholder: "Επιλέξτε...",
  ratingOptionsCaption: "Πατήστε για να βαθμολογήσετε εδώ...",
  value: "τιμή",
  requiredError: "Παρακαλώ απαντήστε στην ερώτηση.",
  requiredErrorInPanel: "Απαντήστε σε τουλάχιστον μία ερώτηση.",
  requiredInAllRowsError: "Παρακαλώ απαντήστε τις ερωτήσεις σε όλες τις γραμμές.",
  eachRowUniqueError: "Κάθε γραμμή πρέπει να έχει μια μοναδική τιμή.",
  numericError: "Η τιμή πρέπει να είναι αριθμητική.",
  minError: "Η τιμή δεν πρέπει να είναι μικρότερη από {0}",
  maxError: "Η τιμή δεν πρέπει να είναι μεγαλύτερη από {0}",
  textNoDigitsAllow: "Οι αριθμοί δεν επιτρέπονται.",
  textMinLength: "Παρακαλώ συμπληρώστε τουλάχιστον {0} χαρακτήρες.",
  textMaxLength: "Εισαγάγετε λιγότερους από {0} χαρακτήρες.",
  textMinMaxLength: "Εισαγάγετε περισσότερους από {0} και λιγότερους από {1} χαρακτήρες.",
  minRowCountError: "Παρακαλώ συμπληρώστε τουλάχιστον {0} γραμμές.",
  minSelectError: "Παρακαλώ επιλέξτε τουλάχιστον {0} παραλλαγές.",
  maxSelectError: "Παρακαλώ επιλέξτε όχι παραπάνω απο {0} παραλλαγές.",
  numericMinMax: "Το '{0}' θα πρέπει να είναι ίσο ή μεγαλύτερο απο το {1} και ίσο ή μικρότερο απο το {2}",
  numericMin: "Το '{0}' πρέπει να είναι μεγαλύτερο ή ισο με το {1}",
  numericMax: "Το '{0}' πρέπει να είναι μικρότερο ή ίσο απο το {1}",
  invalidEmail: "Παρακαλώ δώστε μια αποδεκτή διεύθυνση e-mail.",
  invalidExpression: "Η έκφραση: {0} θα πρέπει να επιστρέψει 'true'.",
  urlRequestError: "Η αίτηση επέστρεψε σφάλμα '{0}'. {1}",
  urlGetChoicesError: "Η αίτηση επέστρεψε κενά δεδομένα ή η ιδιότητα 'μονοπάτι/path' είναι εσφαλμένη",
  exceedMaxSize: "Το μέγεθος του αρχείου δεν μπορεί να υπερβαίνει τα {0}.",
  noUploadFilesHandler: "Δεν είναι δυνατή η αποστολή αρχείων. Προσθέστε ένα πρόγραμμα χειρισμού για το συμβάν 'onUploadFiles'.",
  otherRequiredError: "Παρακαλώ συμπληρώστε την τιμή για το πεδίο 'άλλο'.",
  uploadingFile: "Το αρχείο σας ανεβαίνει. Παρακαλώ περιμένετε μερικά δευτερόλεπτα και δοκιμάστε ξανά.",
  loadingFile: "Φόρτωση...",
  chooseFile: "Επιλογή αρχείων ...",
  noFileChosen: "Δεν έχει επιλεγεί αρχείο",
  filePlaceholder: "Αποθέστε το αρχείο σας εδώ ή κάντε κλικ στο κουμπί παρακάτω για να φορτώσετε το αρχείο.",
  confirmDelete: "Θέλετε να διαγράψετε την εγγραφή;",
  keyDuplicationError: "Αυτή η τιμή πρέπει να είναι μοναδική.",
  addColumn: "Προσθήκη στήλης",
  addRow: "Προσθήκη γραμμής",
  removeRow: "Αφαίρεση",
  noRowsText: "Δεν υπάρχουν εγγραφές.",
  addPanel: "Προσθέστε νέο",
  removePanel: "Αφαίρεση",
  showDetails: "Εμφάνιση λεπτομερειών",
  hideDetails: "Απόκρυψη λεπτομερειών",
  choices_Item: "είδος",
  matrix_column: "Στήλη",
  matrix_row: "Γραμμή",
  multipletext_itemname: "κείμενο",
  savingData: "Τα αποτελέσματα αποθηκεύονται στον διακομιστή ...",
  savingDataError: "Παρουσιάστηκε σφάλμα και δεν ήταν δυνατή η αποθήκευση των αποτελεσμάτων.",
  savingDataSuccess: "Τα αποτελέσματα αποθηκεύτηκαν με επιτυχία!",
  savingExceedSize: "Η απάντησή σας υπερβαίνει τα 64KB. Μειώστε το μέγεθος των αρχείων σας και προσπαθήστε ξανά ή επικοινωνήστε με έναν κάτοχο έρευνας.",
  saveAgainButton: "Προσπάθησε ξανά",
  timerMin: "ελάχ",
  timerSec: "δευτ",
  timerSpentAll: "Έχετε δαπανήσει {0} σε αυτήν τη σελίδα και {1} συνολικά.",
  timerSpentPage: "Έχετε ξοδέψει {0} σε αυτήν τη σελίδα.",
  timerSpentSurvey: "Έχετε ξοδέψει συνολικά {0}.",
  timerLimitAll: "Έχετε δαπανήσει {0} από {1} σε αυτήν τη σελίδα και {2} από {3} συνολικά.",
  timerLimitPage: "Έχετε ξοδέψει {0} από {1} σε αυτήν τη σελίδα.",
  timerLimitSurvey: "Έχετε ξοδέψει {0} από {1} συνολικά.",
  clearCaption: "Εκκαθάριση",
  signaturePlaceHolder: "Υπογράψτε εδώ",
  signaturePlaceHolderReadOnly: "Χωρίς υπογραφή",
  chooseFileCaption: "Επιλέξτε αρχείο",
  takePhotoCaption: "Λήψη φωτογραφίας",
  photoPlaceholder: "Κάντε κλικ στο παρακάτω κουμπί για να τραβήξετε μια φωτογραφία χρησιμοποιώντας την κάμερα.",
  fileOrPhotoPlaceholder: "Σύρετε και αποθέστε ή επιλέξτε ένα αρχείο για αποστολή ή λήψη φωτογραφίας χρησιμοποιώντας την κάμερα.",
  replaceFileCaption: "Αντικατάσταση αρχείου",
  removeFileCaption: "Διαγράψτε αυτό το αρχείο",
  booleanCheckedLabel: "Ναι",
  booleanUncheckedLabel: "Όχι",
  confirmRemoveFile: "Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτό το αρχείο: {0};",
  confirmRemoveAllFiles: "Είστε βέβαιοι ότι θέλετε να διαγράψετε όλα τα αρχεία;",
  questionTitlePatternText: "Τίτλος ερώτησης",
  modalCancelButtonText: "Άκυρο",
  modalApplyButtonText: "Εφαρμογή",
  filterStringPlaceholder: "Πληκτρολογήστε για αναζήτηση...",
  emptyMessage: "Δεν υπάρχουν δεδομένα προς εμφάνιση",
  noEntriesText: "Δεν υπάρχουν ακόμη εγγραφές.\nΚάντε κλικ στο κουμπί παρακάτω για να προσθέσετε μια νέα εγγραφή.",
  noEntriesReadonlyText: "Δεν υπάρχουν καταχωρήσεις.",
  tabTitlePlaceholder: "Νέο πάνελ",
  more: "Περισσότερα",
  tagboxDoneButtonCaption: "ΟΚ",
  selectToRankEmptyRankedAreaText: "Όλες οι επιλογές κατατάσσονται",
  selectToRankEmptyUnrankedAreaText: "Σύρετε και αποθέστε επιλογές εδώ για να τις κατατάξετε",
  ok: "OK",
  cancel: "Ακυρώνω"
};

setupLocale({ localeCode: "gr", strings: greekSurveyStrings, nativeName: "ελληνικά", englishName: "Greek" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Πίνακας {panelIndex}"
// noEntriesReadonlyText: "There are no entries." => "Δεν υπάρχουν καταχωρήσεις."
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Όλες οι επιλογές κατατάσσονται"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Σύρετε και αποθέστε επιλογές εδώ για να τις κατατάξετε"// takePhotoCaption: "Take Photo" => "Λήψη φωτογραφίας"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Κάντε κλικ στο παρακάτω κουμπί για να τραβήξετε μια φωτογραφία χρησιμοποιώντας την κάμερα."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Σύρετε και αποθέστε ή επιλέξτε ένα αρχείο για αποστολή ή λήψη φωτογραφίας χρησιμοποιώντας την κάμερα."
// replaceFileCaption: "Replace file" => "Αντικατάσταση αρχείου"// eachRowUniqueError: "Each row must have a unique value." => "Κάθε γραμμή πρέπει να έχει μια μοναδική τιμή."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Δεν είναι δυνατή η αποστολή αρχείων. Προσθέστε ένα πρόγραμμα χειρισμού για το συμβάν 'onUploadFiles'."
// showDetails: "Show Details" => "Εμφάνιση λεπτομερειών"
// hideDetails: "Hide Details" => "Απόκρυψη λεπτομερειών"
// ok: "OK" => "OK"
// cancel: "Cancel" => "Ακυρώνω"
// refuseItemText: "Refuse to answer" => "Αρνηθείτε να απαντήσετε"
// dontKnowItemText: "Don't know" => "Δεν ξέρω"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Η απάντησή σας υπερβαίνει τα 64KB. Μειώστε το μέγεθος των αρχείων σας και προσπαθήστε ξανά ή επικοινωνήστε με έναν κάτοχο έρευνας."
// signaturePlaceHolderReadOnly: "No signature" => "Χωρίς υπογραφή"// tabTitlePlaceholder: "New Panel" => "Νέο πάνελ"// deselectAllItemText: "Deselect all" => "Αποεπιλογή όλων"
// textNoDigitsAllow: "Numbers are not allowed." => "Οι αριθμοί δεν επιτρέπονται."