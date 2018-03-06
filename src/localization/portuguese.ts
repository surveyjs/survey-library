import { surveyLocalization } from "../surveyStrings";

export var portugueseSurveyStrings = {
  pagePrevText: "Anterior",
  pageNextText: "Próximo",
  completeText: "Finalizar",
  otherItemText: "Outros (descrever)",
  progressText: "Pagina {0} de {1}",
  emptySurvey: "Não há página visível ou pergunta na pesquisa.",
  completingSurvey: "Obrigado por finalizar a pesquisa!",
  completingSurveyBefore:
    "Nossos registros mostram que você já finalizou a pesquisa.",
  loadingSurvey: "A pesquisa está carregando...",
  optionsCaption: "Selecione...",
  value: "valor",
  requiredError: "Por favor, responda a pergunta.",
  requiredInAllRowsError:
    "Por favor, responda as perguntas em todas as linhas.",
  numericError: "O valor deve ser numérico.",
  textMinLength: "Por favor, insira pelo menos {0} caracteres.",
  textMaxLength: "Por favor, insira menos de {0} caracteres.",
  textMinMaxLength: "Por favor, insira mais de {0} e menos de {1} caracteres.",
  minRowCountError: "Preencha pelo menos {0} linhas.",
  minSelectError: "Selecione pelo menos {0} opções.",
  maxSelectError: "Por favor, selecione não mais do que {0} opções.",
  numericMinMax:
    "O '{0}' deve ser igual ou superior a {1} e igual ou menor que {2}",
  numericMin: "O '{0}' deve ser igual ou superior a {1}",
  numericMax: "O '{0}' deve ser igual ou inferior a {1}",
  invalidEmail: "Por favor, informe um e-mail válido.",
  urlRequestError: "A requisição retornou o erro '{0}'. {1}",
  urlGetChoicesError:
    "A requisição não retornou dados ou o 'caminho' da requisição não está correto",
  exceedMaxSize: "O tamanho do arquivo não deve exceder {0}.",
  otherRequiredError: "Por favor, informe o outro valor.",
  uploadingFile:
    "Seu arquivo está sendo carregado. Por favor, aguarde alguns segundos e tente novamente.",
  addRow: "Adicionar linha",
  removeRow: "Remover linha",
  addPanel: "Adicionar novo",
  removePanel: "Remover",
  choices_Item: "item",
  matrix_column: "Coluna",
  matrix_row: "Linha",
  savingData: "Os resultados esto sendo salvos no servidor...",
  savingDataError: "Ocorreu um erro e não foi possível salvar os resultados.",
  savingDataSuccess: "Os resultados foram salvos com sucesso!",
  saveAgainButton: "Tente novamente"
};

surveyLocalization.locales["pt"] = portugueseSurveyStrings;
surveyLocalization.localeNames["pt"] = "português";
