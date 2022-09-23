import { surveyLocalization } from "survey-core";
/**
 * You don't need to translate strings that have the same value as Portuguese translation
 */
export var portugueseBrSurveyStrings = {
  emptySurvey: "Não há página visível ou pergunta na pesquisa.",
  completingSurvey: "Obrigado por finalizar a pesquisa!",
  completingSurveyBefore:
    "Nossos registros mostram que você já finalizou a pesquisa.",
  loadingSurvey: "A pesquisa está carregando...",
  requiredError: "Por favor, responda a pergunta.",
  requiredErrorInPanel: "Por favor, responda pelo menos uma pergunta.",
  requiredInAllRowsError:
    "Por favor, responda as perguntas em todas as linhas.",
  maxSelectError: "Por favor, selecione não mais do que {0} opções.",
  invalidEmail: "Por favor, informe um e-mail válido.",
  urlRequestError: "A requisição retornou o erro '{0}'. {1}",
  urlGetChoicesError:
    "A requisição não retornou dados ou o 'caminho' da requisição não está correto",
  otherRequiredError: "Por favor, informe o outro valor.",
  uploadingFile:
    "Seu arquivo está sendo carregado. Por favor, aguarde alguns segundos e tente novamente.",
  loadingFile: "Carregando...",
  noFileChosen: "Nenhum arquivo escolhido",
  confirmDelete: "Tem certeza que deseja deletar?",
  keyDuplicationError: "Esse valor deve ser único.",
  savingData: "Os resultados esto sendo salvos no servidor...",
  savingDataError: "Ocorreu um erro e não foi possível salvar os resultados.",
  savingDataSuccess: "Os resultados foram salvos com sucesso!",
  chooseFileCaption: "Escolher arquivo",
  removeFileCaption: "Remover este arquivo",
  confirmRemoveFile: "Tem certeza que deseja remover este arquivo: {0}?",
  confirmRemoveAllFiles: "Tem certeza que deseja remover todos os arquivos?",
};

surveyLocalization.locales["pt-br"] = portugueseBrSurveyStrings;
surveyLocalization.localeNames["pt-br"] = "português brasileiro";
