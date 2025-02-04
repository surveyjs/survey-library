import { setupLocale } from "survey-core";
/**
 * You don't need to translate strings that have the same value as Portuguese translation
 */
export var portugueseBrSurveyStrings = {
  pagePrevText: "Anterior",
  pageNextText: "Próximo",
  completeText: "Completar",
  previewText: "Visualizar",
  editText: "Editar",
  startSurveyText: "Começar",
  otherItemText: "Outros (descrever)",
  noneItemText: "Nenhum",
  refuseItemText: "Recusar-se a responder",
  dontKnowItemText: "Não sei",
  selectAllItemText: "Selecionar tudo",
  deselectAllItemText: "Desmarcar tudo",
  progressText: "Página {0} de {1}",
  indexText: "{0} de {1}",
  panelDynamicProgressText: "{0} de {1}",
  panelDynamicTabTextFormat: "Painel {panelIndex}",
  questionsProgressText: "Perguntas respondidas {0}/{1}",
  emptySurvey: "Não há página visível ou pergunta na pesquisa.",
  completingSurvey: "Obrigado por finalizar a pesquisa!",
  completingSurveyBefore: "Nossos registros mostram que você já finalizou a pesquisa.",
  loadingSurvey: "A pesquisa está carregando...",
  placeholder: "Selecionar...",
  ratingOptionsCaption: "Selecionar...",
  value: "valor",
  requiredError: "Por favor, responda a pergunta.",
  requiredErrorInPanel: "Por favor, responda pelo menos uma pergunta.",
  requiredInAllRowsError: "Por favor, responda as perguntas em todas as linhas.",
  eachRowUniqueError: "Cada linha deve ter um valor exclusivo.",
  numericError: "O valor deve ser numérico.",
  minError: "O valor não deve ser inferior a {0}",
  maxError: "O valor não deve ser maior que {0}",
  textNoDigitsAllow: "Números não são permitidos.",
  textMinLength: "Introduza pelo menos {0} caractere(s).",
  textMaxLength: "Introduza no máximo {0} caractere(s).",
  textMinMaxLength: "Insira pelo menos {0} e não mais do que {1} caracteres.",
  minRowCountError: "Por favor, preencha pelo menos {0} linha(s).",
  minSelectError: "Selecione pelo menos {0} variante(s).",
  maxSelectError: "Por favor, selecione não mais do que {0} opções.",
  numericMinMax: "O \"{0}\" deve ser pelo menos {1} e no máximo {2}",
  numericMin: "O \"{0}\" deve ser pelo menos {1}",
  numericMax: "O \"{0}\" deve ser no máximo {1}",
  invalidEmail: "Por favor, informe um e-mail válido.",
  invalidExpression: "A expressão: {0} deve retornar 'verdadeiro'.",
  urlRequestError: "A requisição retornou o erro '{0}'. {1}",
  urlGetChoicesError: "A requisição não retornou dados ou o 'caminho' da requisição não está correto",
  exceedMaxSize: "O tamanho do arquivo não deve exceder {0}.",
  noUploadFilesHandler: "Os arquivos não podem ser carregados. Adicione um manipulador para o evento 'onUploadFiles'.",
  otherRequiredError: "Por favor, informe o outro valor.",
  uploadingFile: "Seu arquivo está sendo carregado. Por favor, aguarde alguns segundos e tente novamente.",
  loadingFile: "Carregando...",
  chooseFile: "Escolha o(s) arquivo(s)...",
  noFileChosen: "Nenhum arquivo escolhido",
  filePlaceholder: "Arraste e solte um arquivo aqui ou clique no botão abaixo e escolha um arquivo para carregar.",
  confirmDelete: "Tem certeza que deseja deletar?",
  keyDuplicationError: "Esse valor deve ser único.",
  addColumn: "Adicionar coluna",
  addRow: "Adicionar linha",
  removeRow: "Retirar",
  noRowsText: "Não há filas.",
  addPanel: "Adicionar novo",
  removePanel: "Retirar",
  showDetails: "Mostrar detalhes",
  hideDetails: "Ocultar detalhes",
  choices_Item: "item",
  matrix_column: "Coluna",
  matrix_row: "Remar",
  multipletext_itemname: "Texto",
  savingData: "Os resultados esto sendo salvos no servidor...",
  savingDataError: "Ocorreu um erro e não foi possível salvar os resultados.",
  savingDataSuccess: "Os resultados foram salvos com sucesso!",
  savingExceedSize: "Sua resposta excede 64KB. Reduza o tamanho do(s) seu(s) arquivo(s) e tente novamente ou entre em contato com o proprietário do questionário.",
  saveAgainButton: "Tentar novamente",
  timerMin: "Min",
  timerSec: "segundo",
  timerSpentAll: "Você gastou {0} nesta página e {1} no total.",
  timerSpentPage: "Você passou {0} nesta página.",
  timerSpentSurvey: "Gastou {0} no total.",
  timerLimitAll: "Você gastou {0} de {1} nesta página e {2} de {3} no total.",
  timerLimitPage: "Você gastou {0} de {1} nesta página.",
  timerLimitSurvey: "Gastou {0} de {1} no total.",
  clearCaption: "Claro",
  signaturePlaceHolder: "Assine aqui",
  signaturePlaceHolderReadOnly: "Sem assinatura",
  chooseFileCaption: "Escolher arquivo",
  takePhotoCaption: "Tirar foto",
  photoPlaceholder: "Clique no botão abaixo para tirar uma foto usando a câmera.",
  fileOrPhotoPlaceholder: "Arraste e solte ou selecione um arquivo para carregar ou tirar uma foto usando a câmera.",
  replaceFileCaption: "Substituir arquivo",
  removeFileCaption: "Remover este arquivo",
  booleanCheckedLabel: "Sim",
  booleanUncheckedLabel: "Não",
  confirmRemoveFile: "Tem certeza que deseja remover este arquivo: {0}?",
  confirmRemoveAllFiles: "Tem certeza que deseja remover todos os arquivos?",
  questionTitlePatternText: "Título da pergunta",
  modalCancelButtonText: "Cancelar",
  modalApplyButtonText: "Aplicar",
  filterStringPlaceholder: "Digite para pesquisar...",
  emptyMessage: "Nenhum dado a ser exibido",
  noEntriesText: "Ainda não há inscrições.\nClique no botão abaixo para adicionar uma nova entrada.",
  noEntriesReadonlyText: "Não há entradas.",
  tabTitlePlaceholder: "Novo Painel",
  more: "Mais",
  tagboxDoneButtonCaption: "OKEY",
  selectToRankEmptyRankedAreaText: "Todas as opções são classificadas",
  selectToRankEmptyUnrankedAreaText: "Arraste e solte as opções aqui para classificá-las",
  ok: "OKEY",
  cancel: "Cancelar"
};

setupLocale({ localeCode: "pt-br", strings: portugueseBrSurveyStrings, nativeName: "português brasileiro", englishName: "Brazilian Portuguese" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// pagePrevText: "Previous" => "Anterior"
// pageNextText: "Next" => "Próximo"
// completeText: "Complete" => "Completar"
// previewText: "Preview" => "Visualizar"
// editText: "Edit" => "Editar"
// startSurveyText: "Start" => "Começar"
// otherItemText: "Other (describe)" => "Outros (descrever)"
// noneItemText: "None" => "Nenhum"
// selectAllItemText: "Select All" => "Selecionar tudo"
// progressText: "Page {0} of {1}" => "Página {0} de {1}"
// indexText: "{0} of {1}" => "{0} de {1}"
// panelDynamicProgressText: "{0} of {1}" => "{0} de {1}"
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Painel {panelIndex}"
// questionsProgressText: "Answered {0}/{1} questions" => "Perguntas respondidas {0}/{1}"
// placeholder: "Select..." => "Selecionar..."
// ratingOptionsCaption: "Select..." => "Selecionar..."
// value: "value" => "valor"
// numericError: "The value should be numeric." => "O valor deve ser numérico."
// minError: "The value should not be less than {0}" => "O valor não deve ser inferior a {0}"
// maxError: "The value should not be greater than {0}" => "O valor não deve ser maior que {0}"
// textMinLength: "Please enter at least {0} character(s)." => "Introduza pelo menos {0} caractere(s)."
// textMaxLength: "Please enter no more than {0} character(s)." => "Introduza no máximo {0} caractere(s)."
// textMinMaxLength: "Please enter at least {0} and no more than {1} characters." => "Insira pelo menos {0} e não mais do que {1} caracteres."
// minRowCountError: "Please fill in at least {0} row(s)." => "Por favor, preencha pelo menos {0} linha(s)."
// minSelectError: "Please select at least {0} variant(s)." => "Selecione pelo menos {0} variante(s)."
// numericMinMax: "The '{0}' should be at least {1} and at most {2}" => "O \"{0}\" deve ser pelo menos {1} e no máximo {2}"
// numericMin: "The '{0}' should be at least {1}" => "O \"{0}\" deve ser pelo menos {1}"
// numericMax: "The '{0}' should be at most {1}" => "O \"{0}\" deve ser no máximo {1}"
// invalidExpression: "The expression: {0} should return 'true'." => "A expressão: {0} deve retornar 'verdadeiro'."
// exceedMaxSize: "The file size should not exceed {0}." => "O tamanho do arquivo não deve exceder {0}."
// chooseFile: "Choose file(s)..." => "Escolha o(s) arquivo(s)..."
// filePlaceholder: "Drag and drop a file here or click the button below and choose a file to upload." => "Arraste e solte um arquivo aqui ou clique no botão abaixo e escolha um arquivo para carregar."
// addColumn: "Add Column" => "Adicionar coluna"
// addRow: "Add Row" => "Adicionar linha"
// removeRow: "Remove" => "Retirar"
// noRowsText: "There are no rows." => "Não há filas."
// addPanel: "Add new" => "Adicionar novo"
// removePanel: "Remove" => "Retirar"
// choices_Item: "item" => "item"
// matrix_column: "Column" => "Coluna"
// matrix_row: "Row" => "Remar"
// multipletext_itemname: "text" => "Texto"
// saveAgainButton: "Try again" => "Tentar novamente"
// timerMin: "min" => "Min"
// timerSec: "sec" => "segundo"
// timerSpentAll: "You have spent {0} on this page and {1} in total." => "Você gastou {0} nesta página e {1} no total."
// timerSpentPage: "You have spent {0} on this page." => "Você passou {0} nesta página."
// timerSpentSurvey: "You have spent {0} in total." => "Gastou {0} no total."
// timerLimitAll: "You have spent {0} of {1} on this page and {2} of {3} in total." => "Você gastou {0} de {1} nesta página e {2} de {3} no total."
// timerLimitPage: "You have spent {0} of {1} on this page." => "Você gastou {0} de {1} nesta página."
// timerLimitSurvey: "You have spent {0} of {1} in total." => "Gastou {0} de {1} no total."
// clearCaption: "Clear" => "Claro"
// signaturePlaceHolder: "Sign here" => "Assine aqui"
// booleanCheckedLabel: "Yes" => "Sim"
// booleanUncheckedLabel: "No" => "Não"
// questionTitlePatternText: "Question Title" => "Título da pergunta"
// modalCancelButtonText: "Cancel" => "Cancelar"
// modalApplyButtonText: "Apply" => "Aplicar"
// filterStringPlaceholder: "Type to search..." => "Digite para pesquisar..."
// emptyMessage: "No data to display" => "Nenhum dado a ser exibido"
// noEntriesText: "There are no entries yet.\nClick the button below to add a new entry." => "Ainda não há inscrições.\nClique no botão abaixo para adicionar uma nova entrada."
// noEntriesReadonlyText: "There are no entries." => "Não há entradas."
// more: "More" => "Mais"
// tagboxDoneButtonCaption: "OK" => "OKEY"
// selectToRankEmptyRankedAreaText: "All choices are ranked" => "Todas as opções são classificadas"
// selectToRankEmptyUnrankedAreaText: "Drag and drop choices here to rank them" => "Arraste e solte as opções aqui para classificá-las"// takePhotoCaption: "Take Photo" => "Tirar foto"
// photoPlaceholder: "Click the button below to take a photo using the camera." => "Clique no botão abaixo para tirar uma foto usando a câmera."
// fileOrPhotoPlaceholder: "Drag and drop or select a file to upload or take a photo using the camera." => "Arraste e solte ou selecione um arquivo para carregar ou tirar uma foto usando a câmera."
// replaceFileCaption: "Replace file" => "Substituir arquivo"// eachRowUniqueError: "Each row must have a unique value." => "Cada linha deve ter um valor exclusivo."
// noUploadFilesHandler: "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event." => "Os arquivos não podem ser carregados. Adicione um manipulador para o evento 'onUploadFiles'."
// showDetails: "Show Details" => "Mostrar detalhes"
// hideDetails: "Hide Details" => "Ocultar detalhes"
// ok: "OK" => "OKEY"
// cancel: "Cancel" => "Cancelar"
// refuseItemText: "Refuse to answer" => "Recusar-se a responder"
// dontKnowItemText: "Don't know" => "Não sei"// savingExceedSize: "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact a survey owner." => "Sua resposta excede 64KB. Reduza o tamanho do(s) seu(s) arquivo(s) e tente novamente ou entre em contato com o proprietário do questionário."
// signaturePlaceHolderReadOnly: "No signature" => "Sem assinatura"// tabTitlePlaceholder: "New Panel" => "Novo Painel"// deselectAllItemText: "Deselect all" => "Desmarcar tudo"
// textNoDigitsAllow: "Numbers are not allowed." => "Números não são permitidos."