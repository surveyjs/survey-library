if(!window["%hammerhead%"]) {
    var json =         {questions: [
            {                 type: "dropdown",
                name: "car",
                title: "What car are you driving?",
                isRequired: true,
                colCount: 0,
                choices: [
                    "None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot",
                    "Toyota", "Citroen"
                ]
 }
        ]};

    Survey.Survey.cssType = "bootstrap";

    var model = new Survey.Model(json);

    ReactDOM.render(<Survey.Survey model={model} />, document.getElementById("surveyElement"));
}