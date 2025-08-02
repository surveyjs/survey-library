import { setupLocale } from "survey-core";

export var polishSurveyStrings = {
  // "Previous"
  pagePrevText: "Wstecz",
  // "Next"
  pageNextText: "Dalej",
  // "Complete"
  completeText: "Gotowe",
  // "Preview"
  previewText: "Premiera",
  // "Edit"
  editText: "Edycja",
  // "Start"
  startSurveyText: "Start",
  // [Auto-translated] "Please leave a comment"
  commentText: "Proszę o komentarz",
  // "Other (describe)"
  otherItemText: "Inna odpowiedź (wpisz)",
  // "None"
  noneItemText: "Brak",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Odmów odpowiedzi",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Nie wiem",
  // "Select All"
  selectAllItemText: "Wybierz wszystkie",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Odznacz wszystko",
  // "Page {0} of {1}"
  progressText: "Strona {0} z {1}",
  // "{0} of {1}"
  indexText: "{0} od {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Zapis {0} z {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Odpowiedzi na {0}/{1} pytania",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Nie ma widocznych pytań.",
  // "Thank you for completing the survey"
  completingSurvey: "Dziękujemy za wypełnienie ankiety!",
  // "You have already completed this survey."
  completingSurveyBefore: "Z naszych zapisów wynika, że wypełniłeś już tę ankietę.",
  // "Loading Survey..."
  loadingSurvey: "Trwa wczytywanie ankiety...",
  // "Select..."
  placeholder: "Wybierz...",
  // "Select..."
  ratingOptionsCaption: "Kliknij tutaj, aby ocenić...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Wybrać...",
  // "value"
  value: "Wartość",
  // "Response required."
  requiredError: "Proszę odpowiedzieć na to pytanie.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Proszę odpowiedzieć na co najmniej jedno pytanie.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Proszę odpowiedzieć na wszystkie pytania.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Każdy wiersz musi mieć unikatową wartość.",
  // "The value should be numeric."
  numericError: "W tym polu można wpisać tylko liczby.",
  // "The value should not be less than {0}"
  minError: "Wartość nie powinna być mniejsza niż {0}",
  // "The value should not be greater than {0}"
  maxError: "Wartość nie powinna być większa niż {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Liczby są niedozwolone.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Proszę wpisać co najmniej {0} znaków.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Proszę wpisać mniej niż {0} znaków.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Proszę wpisać więcej niż {0} i mniej niż {1} znaków.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Proszę uzupełnić przynajmniej {0} wierszy.",
  // "Please select at least {0} option(s)."
  minSelectError: "Proszę wybrać co najmniej {0} pozycji.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Proszę wybrać nie więcej niż {0} pozycji.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "Odpowiedź '{0}' powinna być większa lub równa {1} oraz mniejsza lub równa {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "Odpowiedź '{0}' powinna być większa lub równa {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "Odpowiedź '{0}' powinna być mniejsza lub równa {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Proszę podać prawidłowy adres email.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "Wyrażenie: {0} powinno wracać 'prawdziwe'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "Żądanie zwróciło błąd '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "Żądanie nie zwróciło danych albo ścieżka jest nieprawidłowa",
  // "The file size should not exceed {0}."
  exceedMaxSize: "Rozmiar przesłanego pliku nie może przekraczać {0}.",
  // "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Nie można przesłać plików. Dodaj moduł obsługi zdarzenia \"onUploadFiles\".",
  // "Response required: enter another value."
  otherRequiredError: "Proszę podać inną odpowiedź.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Trwa przenoszenie Twojego pliku, proszę spróbować ponownie za kilka sekund.",
  // "Loading..."
  loadingFile: "Ładowanie...",
  // "Choose file(s)..."
  chooseFile: "Wybierz plik(i)...",
  // "No file selected"
  noFileChosen: "Nie wybrano żadnego pliku",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Upuść plik tutaj lub kliknij przycisk poniżej, aby załadować plik.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Chcesz skasować nagranie?",
  // "This value should be unique."
  keyDuplicationError: "Ta wartość powinna być wyjątkowa.",
  // "Add Column"
  addColumn: "Dodaj kolumnę",
  // "Add Row"
  addRow: "Dodaj wiersz",
  // "Remove"
  removeRow: "Usuń",
  // "There are no rows."
  noRowsText: "Nie ma rzędów.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Wiersz {indeks wiersza}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Dodaj panel",
  // "Remove"
  removePanel: "Usuń",
  // [Auto-translated] "Show Details"
  showDetails: "Pokaż szczegóły",
  // [Auto-translated] "Hide Details"
  hideDetails: "Ukryj szczegóły",
  // "item"
  choices_Item: "element",
  // [Auto-translated] "Choice option"
  choices_Choice: "Opcja wyboru",
  // "Column"
  matrix_column: "Kolumna",
  // "Row"
  matrix_row: "Wiersz",
  // "text"
  multipletext_itemname: "tekst",
  // "The results are being saved on the server..."
  savingData: "Zapisuję wyniki ankiety na serwerze...",
  // "An error occurred and we could not save the results."
  savingDataError: "Wystąpił błąd i wyniki nie mogły zostać zapisane.",
  // "The results were saved successfully!"
  savingDataSuccess: "Wyniki zostały poprawnie zapisane!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Twoja odpowiedź przekracza 64 KB. Zmniejsz rozmiar plików i spróbuj ponownie lub skontaktuj się z właścicielem ankiety.",
  // "Try again"
  saveAgainButton: "Spróbuj ponownie",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "sek",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Spędziłeś {0} na tej stronie a w sumie {1}.",
  // "You have spent {0} on this page."
  timerSpentPage: "Spędziłeś {0} na tej stronie.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Spędziłeś w sumie {0}.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Spędziłeś {0} z {1} na tej stronie a w sumie {2} z {3}.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Spędziłeś {0} z {1} na tej stronie",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Spędziłeś {0} z {1}.",
  // "Clear"
  clearCaption: "Wyczyść",
  // [Auto-translated] "Select"
  selectCaption: "Wybrać",
  // "Sign here"
  signaturePlaceHolder: "Podpisz tutaj",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Brak podpisu",
  // "Select File"
  chooseFileCaption: "Wybierz plik",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Zrób zdjęcie",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Kliknij przycisk poniżej, aby zrobić zdjęcie aparatem.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Przeciągnij i upuść lub wybierz plik, który chcesz przesłać lub zrobić zdjęcie za pomocą aparatu.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Zastąp plik",
  // "Remove this file"
  removeFileCaption: "Usuń ten plik",
  // "Yes"
  booleanCheckedLabel: "Tak",
  // "No"
  booleanUncheckedLabel: "Nie",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Jesteś pewien, że chcesz usunąć ten plik: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Jesteś pewien, że chcesz usunąć wszystkie pliki?",
  // "Question Title"
  questionTitlePatternText: "Tytuł pytania",
  // "Cancel"
  modalCancelButtonText: "Anulować",
  // "Apply"
  modalApplyButtonText: "Zastosować",
  // "Type to search..."
  filterStringPlaceholder: "Wpisz aby wyszukać...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Brak danych do wyświetlenia",
  // [Auto-translated] "Loading..."
  loadingPage: "Ładowania...",
  // [Auto-translated] "Loading..."
  loadingData: "Ładowania...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Nie ma jeszcze wpisów.\nKliknij przycisk poniżej, aby dodać nowy wpis.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Brak zgłoszeń",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Nowy panel",
  // [Auto-translated] "More"
  more: "Więcej",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OK",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Wszystkie opcje są wybierane do rankingu",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Przeciągnij opcje tutaj, aby je uszeregować",
  // [Auto-translated] "OK"
  ok: "OK",
  // [Auto-translated] "Cancel"
  cancel: "Anuluj",
  // "Create \"{0}\" item..."
  createCustomItem: "Utwórz element \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Spis treści",
  // [Auto-translated] "Progress bar"
  progressbar: "Pasek postępu"
};

setupLocale({ localeCode: "pl", strings: polishSurveyStrings, nativeName: "polski", englishName: "Polish" });