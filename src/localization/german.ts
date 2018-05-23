import { surveyLocalization } from "../surveyStrings";

export var germanSurveyStrings = {
  pagePrevText: "Zurück",
  pageNextText: "Weiter",
  completeText: "Absenden",
  progressText: "Seite {0} von {1}",
  emptySurvey: "Es gibt keine sichtbare Frage.",
  completingSurvey: "Vielen Dank für die Beantwortung des Fragebogens!",
  loadingSurvey: "Der Fragebogen wird vom Server geladen...",
  otherItemText: "Benutzerdefinierte Antwort...",
  optionsCaption: "Wählen...",
  requiredError: "Bitte beantworten Sie diese Frage.",
  numericError: "Der Wert sollte eine Zahl sein.",
  textMinLength: "Bitte geben Sie mindestens {0} Zeichen ein.",
  minSelectError: "Bitte wählen Sie mindestens {0} Einträge.",
  maxSelectError: "Bitte wählen Sie nicht mehr als {0} Einträge.",
  numericMinMax:
    "'{0}' sollte gleich oder größer sein als {1} und gleich oder kleiner als {2}.",
  numericMin: "'{0}' sollte gleich oder größer sein als {1}.",
  numericMax: "'{0}' sollte gleich oder kleiner als {1} sein.",
  invalidEmail: "Bitte geben Sie eine gültige E-Mail Adresse ein.",
  exceedMaxSize: "Die Dateigröße darf {0} nicht überschreiten.",
  otherRequiredError: "Bitte geben Sie Ihre benutzerdefinierte Antwort ein.",
  addRow: "Reihe hinzufügen",
  removeRow: "Löschen"
};

surveyLocalization.locales["de"] = germanSurveyStrings;
surveyLocalization.localeNames["de"] = "deutsch";
