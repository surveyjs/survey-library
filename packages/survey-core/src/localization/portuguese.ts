import { setupLocale } from "survey-core";

export var portugueseSurveyStrings = {
  // "Previous"
  pagePrevText: "Anterior",
  // "Next"
  pageNextText: "Próximo",
  // "Complete"
  completeText: "Finalizar",
  // "Preview"
  previewText: "Pré-visualização",
  // "Edit"
  editText: "Editar",
  // "Start"
  startSurveyText: "Começar",
  // [Auto-translated] "Please leave a comment"
  commentText: "Por favor, deixe um comentário",
  // "Other (describe)"
  otherItemText: "Outros (descrever)",
  // "None"
  noneItemText: "Nenhum",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "Recusar-se a responder",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "Não sei",
  // "Select All"
  selectAllItemText: "Selecionar Todos",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "Desmarcar tudo",
  // "Page {0} of {1}"
  progressText: "Página {0} de {1}",
  // "{0} of {1}"
  indexText: "{0} de {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "Registo {0} de {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "Painel {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "Respostas {0}/{1} perguntas",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "Não há página visível ou pergunta no questionário.",
  // "Thank you for completing the survey"
  completingSurvey: "Obrigado por finalizar o questionário!",
  // "You have already completed this survey."
  completingSurveyBefore: "Os nossos registos mostram que já finalizou o questionário.",
  // "Loading Survey..."
  loadingSurvey: "O questionário está a carregar...",
  // "Select..."
  placeholder: "Selecione...",
  // "Select..."
  ratingOptionsCaption: "Selecione aqui para avaliar...",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "Selecionar...",
  // "value"
  value: "valor",
  // "Response required."
  requiredError: "Por favor, responda à pergunta.",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "Por favor, responda pelo menos a uma pergunta.",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "Por favor, responda às perguntas em todas as linhas.",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "Cada linha deve ter um valor exclusivo.",
  // "The value should be numeric."
  numericError: "O valor deve ser numérico.",
  // "The value should not be less than {0}"
  minError: "O valor não deverá ser menor que {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "Insira um valor que corresponda ao tamanho da etapa de {0}.",
  // "The value should not be greater than {0}"
  maxError: "O valor não deverá ser maior que {0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "Números não são permitidos.",
  // "Please enter at least {0} character(s)."
  textMinLength: "Por favor, insira pelo menos {0} caracteres.",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "Por favor, insira menos de {0} caracteres.",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "Por favor, insira mais de {0} e menos de {1} caracteres.",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "Preencha pelo menos {0} linhas.",
  // "Please select at least {0} option(s)."
  minSelectError: "Selecione pelo menos {0} opções.",
  // "Please select no more than {0} option(s)."
  maxSelectError: "Por favor, selecione no máximo {0} opções.",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "O '{0}' deve ser igual ou superior a {1} e igual ou menor que {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "O '{0}' deve ser igual ou superior a {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "O '{0}' deve ser igual ou inferior a {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "Por favor, insira um e-mail válido.",
  // "The expression: {0} should return 'true'."
  invalidExpression: "A expressão: {0} deve retornar 'verdadeiro'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "O pedido retornou o erro '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "O pedido não retornou dados ou o 'caminho' do pedido não está correto",
  // "The file size should not exceed {0}."
  exceedMaxSize: "O tamanho do arquivo não deve exceder {0}.",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "Os arquivos não podem ser carregados. Adicione um manipulador para o evento 'onUploadFiles'.",
  // "Response required: enter another value."
  otherRequiredError: "Por favor, insira o outro valor.",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "O seu ficheiro está a carregar. Por favor, aguarde alguns segundos e tente novamente.",
  // "Loading..."
  loadingFile: "A carregar...",
  // "Choose file(s)..."
  chooseFile: "Selecione o(s) arquivo(s)...",
  // "No file selected"
  noFileChosen: "Nenhum ficheiro escolhido",
  // "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "Arraste um ficheiro aqui ou clique no botão abaixo para carregar o ficheiro.",
  // "Are you sure you want to delete this record?"
  confirmDelete: "Tem a certeza que deseja apagar?",
  // "This value should be unique."
  keyDuplicationError: "Este valor deve ser único.",
  // "Add Column"
  addColumn: "Adicionar coluna",
  // "Add Row"
  addRow: "Adicionar linha",
  // "Remove"
  removeRow: "Remover linha",
  // "There are no rows."
  noRowsText: "Não existem linhas.",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "Linha {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "Adicionar novo",
  // "Remove"
  removePanel: "Remover",
  // [Auto-translated] "Show Details"
  showDetails: "Mostrar detalhes",
  // [Auto-translated] "Hide Details"
  hideDetails: "Ocultar detalhes",
  // "item"
  choices_Item: "item",
  // [Auto-translated] "Choice option"
  choices_Choice: "Opção de escolha",
  // "Column"
  matrix_column: "Coluna",
  // "Row"
  matrix_row: "Linha",
  // "text"
  multipletext_itemname: "texto",
  // "The results are being saved on the server..."
  savingData: "Os resultados estão a ser guardados no servidor...",
  // "An error occurred and we could not save the results."
  savingDataError: "Ocorreu um erro e não foi possível guardar os resultados.",
  // "The results were saved successfully!"
  savingDataSuccess: "Os resultados foram guardados com sucesso!",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "Sua resposta excede 64 KB. Reduza o tamanho do(s) seu(s) arquivo(s) e tente novamente ou entre em contato com o proprietário da pesquisa.",
  // "Try again"
  saveAgainButton: "Tente novamente",
  // "min"
  timerMin: "min",
  // "sec"
  timerSec: "seg",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "Você gastou {0} nesta página e {1} no total.",
  // "You have spent {0} on this page."
  timerSpentPage: "Você gastou {0} nesta página.",
  // "You have spent {0} in total."
  timerSpentSurvey: "Você gastou {0} no total.",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "Você gastou {0} de {1} nesta página e {2} de {3} no total.",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "Você gastou {0} de {1} nesta página.",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "Você gastou {0} de {1} no total.",
  // "Clear"
  clearCaption: "Limpar",
  // [Auto-translated] "Select"
  selectCaption: "Selecionar",
  // "Sign here"
  signaturePlaceHolder: "Assine aqui",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "Sem assinatura",
  // "Select File"
  chooseFileCaption: "Escolher ficheiro",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "Tirar foto",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "Clique no botão abaixo para tirar uma foto usando a câmera.",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "Arraste e solte ou selecione um arquivo para carregar ou tirar uma foto usando a câmera.",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "Substituir arquivo",
  // "Remove this file"
  removeFileCaption: "Remover este ficheiro",
  // "Yes"
  booleanCheckedLabel: "Sim",
  // "No"
  booleanUncheckedLabel: "Não",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "Tem a certeza que deseja remover este ficheiro: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "Tem a certeza que deseja remover todos os ficheiros?",
  // "Question Title"
  questionTitlePatternText: "Título da questão",
  // "Cancel"
  modalCancelButtonText: "Cancelar",
  // "Apply"
  modalApplyButtonText: "Aplicar",
  // "Type to search..."
  filterStringPlaceholder: "Digite para pesquisar...",
  // "No data to display"
  emptyMessage: "Não existe informação a mostrar",
  // [Auto-translated] "Loading..."
  loadingPage: "Carregamento...",
  // [Auto-translated] "Loading..."
  loadingData: "Carregamento...",
  // "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "Ainda não existem registos.\nClique no botão abaixo para adicionar um novo registo.",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "Sem entradas",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "Novo Painel",
  // "More"
  more: "Mais",
  // "OK"
  tagboxDoneButtonCaption: "Terminado",
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

setupLocale({ localeCode: "pt", strings: portugueseSurveyStrings, nativeName: "português", englishName: "Portuguese" });