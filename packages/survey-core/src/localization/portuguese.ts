import { setupLocale } from "survey-core";

export var portugueseSurveyStrings = {
  pagePrevText: "Anterior",
  pageNextText: "Próximo",
  completeText: "Finalizar",
  previewText: "Pré-visualização",
  editText: "Editar",
  startSurveyText: "Começar",
  otherItemText: "Outros (descrever)",
  noneItemText: "Nenhum",
  refuseItemText: "Recusar-se a responder",
  dontKnowItemText: "Não sei",
  selectAllItemText: "Selecionar Todos",
  deselectAllItemText: "Desmarcar tudo",
  progressText: "Página {0} de {1}",
  indexText: "{0} de {1}",
  panelDynamicProgressText: "Registo {0} de {1}",
  panelDynamicTabTextFormat: "Painel {panelIndex}",
  questionsProgressText: "Respostas {0}/{1} perguntas",
  emptySurvey: "Não há página visível ou pergunta no questionário.",
  completingSurvey: "Obrigado por finalizar o questionário!",
  completingSurveyBefore: "Os nossos registos mostram que já finalizou o questionário.",
  loadingSurvey: "O questionário está a carregar...",
  placeholder: "Selecione...",
  ratingOptionsCaption: "Selecione aqui para avaliar...",
  value: "valor",
  requiredError: "Por favor, responda à pergunta.",
  requiredErrorInPanel: "Por favor, responda pelo menos a uma pergunta.",
  requiredInAllRowsError: "Por favor, responda às perguntas em todas as linhas.",
  eachRowUniqueError: "Cada linha deve ter um valor exclusivo.",
  numericError: "O valor deve ser numérico.",
  minError: "O valor não deverá ser menor que {0}",
  maxError: "O valor não deverá ser maior que {0}",
  textNoDigitsAllow: "Números não são permitidos.",
  textMinLength: "Por favor, insira pelo menos {0} caracteres.",
  textMaxLength: "Por favor, insira menos de {0} caracteres.",
  textMinMaxLength: "Por favor, insira mais de {0} e menos de {1} caracteres.",
  minRowCountError: "Preencha pelo menos {0} linhas.",
  minSelectError: "Selecione pelo menos {0} opções.",
  maxSelectError: "Por favor, selecione no máximo {0} opções.",
  numericMinMax: "O '{0}' deve ser igual ou superior a {1} e igual ou menor que {2}",
  numericMin: "O '{0}' deve ser igual ou superior a {1}",
  numericMax: "O '{0}' deve ser igual ou inferior a {1}",
  invalidEmail: "Por favor, insira um e-mail válido.",
  invalidExpression: "A expressão: {0} deve retornar 'verdadeiro'.",
  urlRequestError: "O pedido retornou o erro '{0}'. {1}",
  urlGetChoicesError: "O pedido não retornou dados ou o 'caminho' do pedido não está correto",
  exceedMaxSize: "O tamanho do arquivo não deve exceder {0}.",
  noUploadFilesHandler: "Os arquivos não podem ser carregados. Adicione um manipulador para o evento 'onUploadFiles'.",
  otherRequiredError: "Por favor, insira o outro valor.",
  uploadingFile: "O seu ficheiro está a carregar. Por favor, aguarde alguns segundos e tente novamente.",
  loadingFile: "A carregar...",
  chooseFile: "Selecione o(s) arquivo(s)...",
  noFileChosen: "Nenhum ficheiro escolhido",
  filePlaceholder: "Arraste um ficheiro aqui ou clique no botão abaixo para carregar o ficheiro.",
  confirmDelete: "Tem a certeza que deseja apagar?",
  keyDuplicationError: "Este valor deve ser único.",
  addColumn: "Adicionar coluna",
  addRow: "Adicionar linha",
  removeRow: "Remover linha",
  noRowsText: "Não existem linhas.",
  addPanel: "Adicionar novo",
  removePanel: "Remover",
  showDetails: "Mostrar detalhes",
  hideDetails: "Ocultar detalhes",
  choices_Item: "item",
  matrix_column: "Coluna",
  matrix_row: "Linha",
  multipletext_itemname: "texto",
  savingData: "Os resultados estão a ser guardados no servidor...",
  savingDataError: "Ocorreu um erro e não foi possível guardar os resultados.",
  savingDataSuccess: "Os resultados foram guardados com sucesso!",
  savingExceedSize: "Sua resposta excede 64KB. Reduza o tamanho do(s) seu(s) arquivo(s) e tente novamente ou entre em contato com o proprietário do questionário.",
  saveAgainButton: "Tente novamente",
  timerMin: "min",
  timerSec: "seg",
  timerSpentAll: "Você gastou {0} nesta página e {1} no total.",
  timerSpentPage: "Você gastou {0} nesta página.",
  timerSpentSurvey: "Você gastou {0} no total.",
  timerLimitAll: "Você gastou {0} de {1} nesta página e {2} de {3} no total.",
  timerLimitPage: "Você gastou {0} de {1} nesta página.",
  timerLimitSurvey: "Você gastou {0} de {1} no total.",
  clearCaption: "Limpar",
  signaturePlaceHolder: "Assine aqui",
  signaturePlaceHolderReadOnly: "Sem assinatura",
  chooseFileCaption: "Escolher ficheiro",
  takePhotoCaption: "Tirar foto",
  photoPlaceholder: "Clique no botão abaixo para tirar uma foto usando a câmera.",
  fileOrPhotoPlaceholder: "Arraste e solte ou selecione um arquivo para carregar ou tirar uma foto usando a câmera.",
  replaceFileCaption: "Substituir arquivo",
  removeFileCaption: "Remover este ficheiro",
  booleanCheckedLabel: "Sim",
  booleanUncheckedLabel: "Não",
  confirmRemoveFile: "Tem a certeza que deseja remover este ficheiro: {0}?",
  confirmRemoveAllFiles: "Tem a certeza que deseja remover todos os ficheiros?",
  questionTitlePatternText: "Título da questão",
  modalCancelButtonText: "Cancelar",
  modalApplyButtonText: "Aplicar",
  filterStringPlaceholder: "Digite para pesquisar...",
  emptyMessage: "Não existe informação a mostrar",
  noEntriesText: "Ainda não existem registos.\nClique no botão abaixo para adicionar um novo registo.",
  noEntriesReadonlyText: "Não há entradas.",
  tabTitlePlaceholder: "Novo Painel",
  more: "Mais",
  tagboxDoneButtonCaption: "Terminado",
  selectToRankEmptyRankedAreaText: "Todas as opções são classificadas",
  selectToRankEmptyUnrankedAreaText: "Arraste e solte as opções aqui para classificá-las",
  ok: "OKEY",
  cancel: "Cancelar"
};

setupLocale({ localeCode: "pt", strings: portugueseSurveyStrings, nativeName: "português", englishName: "Portuguese" });

// The following strings have been translated by a machine translation service
// Remove those strings that you have corrected manually
// panelDynamicTabTextFormat: "Panel {panelIndex}" => "Painel {panelIndex}"
// noEntriesReadonlyText: "There are no entries." => "Não há entradas."
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