function init() {
    var json = {
        questions: [
            {
                name: "name",
                type: "text",
                title: "Please enter your name:",
                placeHolder: "Jon Snow",
                isRequired: true
            }, {
                name: "birthdate",
                type: "text",
                inputType: "date",
                title: "Your birthdate:",
                isRequired: true
            }, {
                name: "color",
                type: "text",
                inputType: "color",
                title: "Your favorite color:"
            }, {
                name: "email",
                type: "text",
                inputType: "email",
                title: "Your e-mail:",
                placeHolder: "jon.snow@nightwatch.org",
                isRequired: true,
                validators: [
                    {
                        type: "email"
                    }
                ]
            },
            {
                type: "dropdown",
                name: "cars",
                title: "What car are you driving?",
                isRequired: true,
                hasNone: true,
                colCount: 4,
                choices: [
                    "Ford",
                    "Vauxhall",
                    "Volkswagen",
                    "Nissan",
                    "Audi",
                    "Mercedes-Benz",
                    "BMW",
                    "Peugeot",
                    "Toyota",
                    "Citroen"
                ]
            },
            {
                type: "checkbox",
                name: "car",
                title: "What car are you driving?",
                isRequired: true,
                hasNone: true,
                colCount: 4,
                choices: [
                    "Ford",
                    "Vauxhall",
                    "Volkswagen",
                    "Nissan",
                    "Audi",
                    "Mercedes-Benz",
                    "BMW",
                    "Peugeot",
                    "Toyota",
                    "Citroen"
                ]
            },
            {
                type: "radiogroup",
                name: "carss",
                title: "What car are you driving?",
                isRequired: true,
                colCount: 4,
                choices: [
                    "None",
                    "Ford",
                    "Vauxhall",
                    "Volkswagen",
                    "Nissan",
                    "Audi",
                    "Mercedes-Benz",
                    "BMW",
                    "Peugeot",
                    "Toyota",
                    "Citroen"
                ]
            }

        ]
    };

    Survey.StylesManager.applyTheme('bem');
    var model = new Survey.Model(json);
    window.survey = model;

    model.render("surveyElement");

}

if (!window["%hammerhead%"]) {
    init();
}
