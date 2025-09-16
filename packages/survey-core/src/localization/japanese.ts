import { setupLocale } from "survey-core";

export var japaneseSurveyStrings = {
  // "Previous"
  pagePrevText: "前へ",
  // "Next"
  pageNextText: "次へ",
  // "Complete"
  completeText: "完了",
  // "Preview"
  previewText: "プレビュー",
  // "Edit"
  editText: "編集",
  // "Start"
  startSurveyText: "スタート",
  // [Auto-translated] "Please leave a comment"
  commentText: "コメントを残してください",
  // "Other (describe)"
  otherItemText: "その他（説明）",
  // "None"
  noneItemText: "なし",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "回答を拒否する",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "わからない",
  // "Select All"
  selectAllItemText: "すべて選択",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "すべて選択解除",
  // "Page {0} of {1}"
  progressText: "ページ{0}/{1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{1}の{0}",
  // "{0} of {1}"
  panelDynamicProgressText: "{1}の{0}を記録する",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Panel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "{0}/{1}問回答済",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "アンケートに表示可能な要素がありません。",
  // "Thank you for completing the survey"
  completingSurvey: "アンケートにご協力いただき、ありがとうございます。",
  // "You have already completed this survey."
  completingSurveyBefore: "このアンケートはすでに回答済みです。",
  // "Loading Survey..."
  loadingSurvey: "アンケートを読み込んでいます...",
  // "Select..."
  placeholder: "選択",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "選択。。。",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "選ぶ。。。",
  // "value"
  value: "値",
  // "Response required."
  requiredError: "回答が必要です",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "回答が必要です：少なくとも1つの質問に答えてください。",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "回答が必要です：すべての行の質問に答えてください。",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "各行に一意の値を入力してください。",
  // "The value should be numeric."
  numericError: "数字でご記入下さい",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "値は {0} 以上である必要があります",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "{0}のステップサイズに一致する値を入力してください。",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "値は {0} 以下である必要があります",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "数字は使用できません。",
  // "Please enter at least {0} character(s)."
  textMinLength: "少なくとも {0} 文字を入力してください。",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "{0} 文字以内で入力してください。",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "{0} 文字以上 {1} 文字以内で入力してください。",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "少なくとも {0} 行を入力してください。",
  // "Please select at least {0} option(s)."
  minSelectError: "少なくとも {0} 個のオプションを選択してください。",
  // "Please select no more than {0} option(s)."
  maxSelectError: "{0} 個以下の選択肢を選択してください。",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' は {1} 以上 {2} 以下である必要があります",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' は {1} 以上である必要があります",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' は {1} 以下である必要があります",
  // "Please enter a valid e-mail address."
  invalidEmail: "有効なメールアドレスを入力してください。",
  // "The expression: {0} should return 'true'."
  invalidExpression: "式: {0} は 'true' を返す必要があります。",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "リクエストはエラー '{0}' を返しました。{1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "リクエストが空のデータを返したか、'path' プロパティが正しくありません。",
  // "The file size should not exceed {0}."
  exceedMaxSize: "ファイルのサイズは{0}を超えてはいけません",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "ファイルはアップロードできません。「onUploadFiles」イベントのハンドラーを追加してください。",
  // "Response required: enter another value."
  otherRequiredError: "回答が必要です：他の値を入力してください。",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "ファイルをアップロード中です。しばらくしてから再度お試し下さい",
  // "Loading..."
  loadingFile: "読み込み中",
  // "Choose file(s)..."
  chooseFile: "ファイルを選択",
  // "No file selected"
  noFileChosen: "選択されたファイルはありません",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "ここにファイルをドラッグアンドドロップするか、下のボタンをクリックしてアップロードするファイルを選択します。",
  // "Are you sure you want to delete this record?"
  confirmDelete: "レコードを削除しますか？",
  // "This value should be unique."
  keyDuplicationError: "この値は一意でなければなりません。",
  // "Add Column"
  addColumn: "列の追加",
  // "Add Row"
  addRow: "追加行",
  // "Remove"
  removeRow: "削除",
  // [Auto-translated] "There are no rows."
  noRowsText: "行がありません。",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "行 {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "新規追加",
  // "Remove"
  removePanel: "削除",
  // [Auto-translated] "Show Details"
  showDetails: "詳細を表示",
  // [Auto-translated] "Hide Details"
  hideDetails: "詳細を非表示",
  // "item"
  choices_Item: "項目",
  // [Auto-translated] "Choice option"
  choices_Choice: "選択オプション",
  // "Column"
  matrix_column: "列",
  // "Row"
  matrix_row: "行",
  // [Auto-translated] "text"
  multipletext_itemname: "テキスト",
  // "The results are being saved on the server..."
  savingData: "結果を保存中...。",
  // "An error occurred and we could not save the results."
  savingDataError: "エラーが発生し、結果を保存できませんでした。",
  // "The results were saved successfully!"
  savingDataSuccess: "結果が正常に保存されました",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "回答が64KBを超えています。ファイルのサイズを小さくして、もう一度やり直すか、アンケートの所有者にお問い合わせください。",
  // "Try again"
  saveAgainButton: "もう一度試してみてください。",
  // "min"
  timerMin: "僅少",
  // "sec"
  timerSec: "セック",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "あなたはこのページに{0}を費やし、合計で{1}を費やしました。",
  // "You have spent {0} on this page."
  timerSpentPage: "あなたはこのページに{0}を費やしました。",
  // "You have spent {0} in total."
  timerSpentSurvey: "合計で{0}を使ったことになります。",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "このページに{1}のうち{0}を費やし、{3}のうち{2}を合計で費やしました。",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "このページで{1}の{0}を使ったことがあります。",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "合計で{1}の{0}を使ったことがあります。",
  // "Clear"
  clearCaption: "空白",
  // [Auto-translated] "Select"
  selectCaption: "選ぶ",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "ここに署名",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "署名なし",
  // "Select File"
  chooseFileCaption: "ファイルを選択",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "写真を撮る",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "下のボタンをクリックしてカメラで写真を撮影してください。",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "ファイルをドラッグ＆ドロップまたは選択してアップロードするか、カメラで写真を撮影してください。",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "ファイルを置換",
  // "Remove this file"
  removeFileCaption: "このファイルを削除",
  // "Yes"
  booleanCheckedLabel: "はい",
  // "No"
  booleanUncheckedLabel: "いいえ",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "このファイルを削除してもよろしいですか？{0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "すべてのファイルを削除してもよろしいですか？",
  // "Question Title"
  questionTitlePatternText: "質問のタイトル",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "キャンセル",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "申し込む",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "検索するタイプ...",
  // [Auto-translated] "No data to display"
  emptyMessage: "表示するデータがありません",
  // [Auto-translated] "Loading..."
  loadingPage: "積載。。。",
  // [Auto-translated] "Loading..."
  loadingData: "積載。。。",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "まだエントリーはありません。\n下のボタンをクリックして、新しいエントリを追加します。",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "エントリなし",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "新しいパネル",
  // [Auto-translated] "More"
  more: "続きを見る",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "わかりました",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "すべての選択肢がランキング用に選択されます",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "選択肢をここにドラッグしてランク付けします",
  // [Auto-translated] "OK"
  ok: "わかりました",
  // [Auto-translated] "Cancel"
  cancel: "キャンセル",
  // "Create \"{0}\" item..."
  createCustomItem: "「{0}」アイテムを作成...",
  // [Auto-translated] "Table of contents"
  toc: "目次",
  // [Auto-translated] "Progress bar"
  progressbar: "進行状況バー"
};

setupLocale({ localeCode: "ja", strings: japaneseSurveyStrings, nativeName: "日本語", englishName: "Japanese" });