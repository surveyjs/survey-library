import { surveyLocalization } from "../surveyStrings";

export var czechSurveyStrings = {
  pagePrevText: "Předchozí",
  pageNextText: "Další",
  completeText: "Hotovo",
  otherItemText: "Jiná odpověď (napište)",
  progressText: "Strana {0} z {1}",
  emptySurvey: "Průzkumu neobsahuje žádné otázky.",
  completingSurvey: "Děkujeme za vyplnění průzkumu!",
  loadingSurvey: "Probíhá načítání průzkumu...",
  optionsCaption: "Vyber...",
  requiredError: "Odpovězte prosím na otázku.",
  requiredInAllRowsError: "Odpovězte prosím na všechny otázky.",
  numericError: "V tomto poli lze zadat pouze čísla.",
  textMinLength: "Zadejte prosím alespoň {0} znaků.",
  textMaxLength: "Zadejte prosím méně než {0} znaků.",
  textMinMaxLength: "Zadejte prosím více než {0} a méně než {1} znaků.",
  minRowCountError: "Vyplňte prosím alespoň {0} řádků.",
  minSelectError: "Vyberte prosím alespoň {0} varianty.",
  maxSelectError: "Nevybírejte prosím více než {0} variant.",
  numericMinMax:
    "Odpověď '{0}' by mělo být větší nebo rovno {1} a menší nebo rovno {2}",
  numericMin: "Odpověď '{0}' by mělo být větší nebo rovno {1}",
  numericMax: "Odpověď '{0}' by mělo být menší nebo rovno {1}",
  invalidEmail: "Zadejte prosím platnou e-mailovou adresu.",
  urlRequestError: "Požadavek vrátil chybu '{0}'. {1}",
  urlGetChoicesError: "Požadavek nevrátil data nebo cesta je neplatná",
  exceedMaxSize: "Velikost souboru by neměla být větší než {0}.",
  otherRequiredError: "Zadejte prosím jinou hodnotu.",
  uploadingFile: "Váš soubor se nahrává. Zkuste to prosím za několik sekund.",
  addRow: "Přidat řádek",
  removeRow: "Odstranit"
};

surveyLocalization.locales["cz"] = czechSurveyStrings;
surveyLocalization.localeNames["cz"] = "čeština";
