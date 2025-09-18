import { setupLocale } from "survey-core";
/**
 * You don't need to translate strings that have the same value as Portuguese translation
 */
export var portugueseBrSurveyStrings = {
  // [Auto-translated] "Previous"
  pagePrevText: "Anterior",
  // [Auto-translated] "Next"
  pageNextText: "Próximo",
  // [Auto-translated] "Complete"
  completeText: "Completar",
  // [Auto-translated] "Preview"
  previewText: "Visualizar",
  // [Auto-translated] "Edit"
  editText: "Editar",
  // [Auto-translated] "Start"
  startSurveyText: "Começar",
  // [Auto-translated] "Please leave a comment"
  commentText: "Por favor, deixe um comentário",
  // [Auto-translated] "Other (describe)"
  otherItemText: "Outros (descrever)",
  // [Auto-translated] "None"
  noneItemText: "Nenhum",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Recusar-se a responder",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Não sei",
  // [Auto-translated] "Select All"
  selectAllItemText: "Selecionar tudo",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Desmarcar tudo",
  // [Auto-translated] "Page {0} of {1}"
  progressText: "Página {0} de {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} de {1}",
  // [Auto-translated] "{0} of {1}"
  panelDynamicProgressText: "{0} de {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Painel {panelIndex}",
  // [Auto-translated] "Answered {0}/{1} questions"
  questionsProgressText: "Perguntas respondidas {0}/{1}",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Não há página visível ou pergunta na pesquisa.",
  // "Thank you for completing the survey"
  completingSurvey: "Obrigado por finalizar a pesquisa!",
  // "You have already completed this survey."
  completingSurveyBefore: "Nossos registros mostram que você já finalizou a pesquisa.",
  // "Loading Survey..."
  loadingSurvey: "A pesquisa está carregando...",
  // [Auto-translated] "Select..."
  placeholder: "Selecionar...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "Selecionar...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Selecionar...",
  // [Auto-translated] "value"
  value: "valor",
  // "Response required."
  requiredError: "Por favor, responda a pergunta.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Por favor, responda pelo menos uma pergunta.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Por favor, responda as perguntas em todas as linhas.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Cada linha deve ter um valor exclusivo.",
  // [Auto-translated] "The value should be numeric."
  numericError: "O valor deve ser numérico.",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "O valor não deve ser inferior a {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Insira um valor que corresponda ao tamanho da etapa de {0}.",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "O valor não deve ser maior que {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Números não são permitidos.",
  // [Auto-translated] "Please enter at least {0} character(s)."
  textMinLength: "Introduza pelo menos {0} caractere(s).",
  // [Auto-translated] "Please enter no more than {0} character(s)."
  textMaxLength: "Introduza no máximo {0} caractere(s).",
  // [Auto-translated] "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Insira pelo menos {0} e não mais do que {1} caracteres.",
  // [Auto-translated] "Please fill in at least {0} row(s)."
  minRowCountError: "Por favor, preencha pelo menos {0} linha(s).",
  // [Auto-translated] "Please select at least {0} option(s)."
  minSelectError: "Selecione pelo menos {0} opção(ões).",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Por favor, selecione não mais do que {0} opções.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "O \"{0}\" deve ser pelo menos {1} e no máximo {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "O \"{0}\" deve ser pelo menos {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "O \"{0}\" deve ser no máximo {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Por favor, informe um e-mail válido.",
  // [Auto-translated] "The expression: {0} should return 'true'."
  invalidExpression: "A expressão: {0} deve retornar 'verdadeiro'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "A requisição retornou o erro '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "A requisição não retornou dados ou o 'caminho' da requisição não está correto",
  // [Auto-translated] "The file size should not exceed {0}."
  exceedMaxSize: "O tamanho do arquivo não deve exceder {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Os arquivos não podem ser carregados. Adicione um manipulador para o evento 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Por favor, informe o outro valor.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "Seu arquivo está sendo carregado. Por favor, aguarde alguns segundos e tente novamente.",
  // "Loading..."
  loadingFile: "Carregando...",
  // [Auto-translated] "Choose file(s)..."
  chooseFile: "Escolha o(s) arquivo(s)...",
  // "No file selected"
  noFileChosen: "Nenhum arquivo escolhido",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Arraste e solte um arquivo aqui ou clique no botão abaixo para selecionar um arquivo para carregar.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Tem certeza que deseja deletar?",
  // "This value should be unique."
  keyDuplicationError: "Esse valor deve ser único.",
  // [Auto-translated] "Add Column"
  addColumn: "Adicionar coluna",
  // [Auto-translated] "Add Row"
  addRow: "Adicionar linha",
  // [Auto-translated] "Remove"
  removeRow: "Retirar",
  // [Auto-translated] "There are no rows."
  noRowsText: "Não há filas.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Linha {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // [Auto-translated] "Add new"
  addPanel: "Adicionar novo",
  // [Auto-translated] "Remove"
  removePanel: "Retirar",
  // [Auto-translated] "Show Details"
  showDetails: "Mostrar detalhes",
  // [Auto-translated] "Hide Details"
  hideDetails: "Ocultar detalhes",
  // [Auto-translated] "item"
  choices_Item: "item",
  // [Auto-translated] "Choice option"
  choices_Choice: "Opção de escolha",
  // [Auto-translated] "Column"
  matrix_column: "Coluna",
  // [Auto-translated] "Row"
  matrix_row: "Remar",
  // [Auto-translated] "text"
  multipletext_itemname: "Texto",
  // "The results are being saved on the server..."
  savingData: "Os resultados esto sendo salvos no servidor...",
  // "An error occurred and we could not save the results."
  savingDataError: "Ocorreu um erro e não foi possível salvar os resultados.",
  // "The results were saved successfully!"
  savingDataSuccess: "Os resultados foram salvos com sucesso!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Sua resposta excede 64 KB. Reduza o tamanho do(s) seu(s) arquivo(s) e tente novamente ou entre em contato com o proprietário da pesquisa.",
  // [Auto-translated] "Try again"
  saveAgainButton: "Tentar novamente",
  // [Auto-translated] "min"
  timerMin: "Min",
  // [Auto-translated] "sec"
  timerSec: "segundo",
  // [Auto-translated] "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Você gastou {0} nesta página e {1} no total.",
  // [Auto-translated] "You have spent {0} on this page."
  timerSpentPage: "Você passou {0} nesta página.",
  // [Auto-translated] "You have spent {0} in total."
  timerSpentSurvey: "Gastou {0} no total.",
  // [Auto-translated] "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Você gastou {0} de {1} nesta página e {2} de {3} no total.",
  // [Auto-translated] "You have spent {0} of {1} on this page."
  timerLimitPage: "Você gastou {0} de {1} nesta página.",
  // [Auto-translated] "You have spent {0} of {1} in total."
  timerLimitSurvey: "Gastou {0} de {1} no total.",
  clearCaption: "Excluir tudo",
  // [Auto-translated] "Select"
  selectCaption: "Selecionar",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "Assine aqui",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Sem assinatura",
  // "Select File"
  chooseFileCaption: "Escolher arquivo",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Tirar foto",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Clique no botão abaixo para tirar uma foto usando a câmera.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Arraste e solte ou selecione um arquivo para carregar ou tirar uma foto usando a câmera.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Substituir arquivo",
  // "Remove this file"
  removeFileCaption: "Remover este arquivo",
  // [Auto-translated] "Yes"
  booleanCheckedLabel: "Sim",
  // [Auto-translated] "No"
  booleanUncheckedLabel: "Não",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Tem certeza que deseja remover este arquivo: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Tem certeza que deseja remover todos os arquivos?",
  // [Auto-translated] "Question Title"
  questionTitlePatternText: "Título da pergunta",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "Cancelar",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "Aplicar",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "Digite para pesquisar...",
  // [Auto-translated] "No data to display"
  emptyMessage: "Nenhum dado a ser exibido",
  // [Auto-translated] "Loading..."
  loadingPage: "Carregamento...",
  // [Auto-translated] "Loading..."
  loadingData: "Carregamento...",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Ainda não há entradas.\nClique no botão abaixo para adicionar uma nova entrada.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Sem entradas",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Novo Painel",
  // [Auto-translated] "More"
  more: "Mais",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "OKEY",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "Todas as opções são selecionadas para classificação",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "Arraste as opções aqui para classificá-las",
  // [Auto-translated] "OK"
  ok: "OKEY",
  // [Auto-translated] "Cancel"
  cancel: "Cancelar",
  // "Create \"{0}\" item..."
  createCustomItem: "Criar item \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "Índice",
  // [Auto-translated] "Progress bar"
  progressbar: "Barra de progresso"
};

setupLocale({ localeCode: "pt-br", strings: portugueseBrSurveyStrings, nativeName: "português brasileiro", englishName: "Brazilian Portuguese" });
