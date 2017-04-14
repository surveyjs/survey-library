function init() {
    $.material.init();

    var json = { title: "Product Feedback Survey Example", showProgressBar: "top", pages: [
        {questions: [
            { type: "file", title: "Please upload your photo", name: "image", storeDataAsText: true, showPreview: true, imageWidth: 150, maxSize: 102400 },
            { type: "matrixdropdown", name: "frameworksRate", title: "Please tells us your opinion about JavaScript MVVM frameworks",
                choices: ["Excelent", "Good", "Average", "Fair", "Poor"],
                columns: [{ name: "using", title: "Do you use it?", choices: ["Yes", "No"], cellType: "radiogroup" },
                    { name: "experience", title: "How long do you use it?", choices: [{value: 5, text:"3-5 years"}, {value: 2, text:"1-2 years"}, {value: 1, text:"less then a year"}] },
                    { name: "strength", title: "What is main strength?", choices: ["Easy", "Compact", "Fast", "Powerfull"], cellType: "checkbox" },
                    { name: "knowledge", title: "Please describe your experience", cellType:"text" },
                    { name: "rate", title: "Please rate the framework itself" }],
                rows: [{ value: "angularv1", text: "angularjs v1.x" },
                    { value: "angularv2", text: "angularjs v2" },
                    { value: "knockoutjs" },
                    { value: "reactjs"}]},
            {name:"name", type:"text", title: "Please enter your name:", placeHolder:"Jon Snow", isRequired: true},
            {name:"birthdate", type:"text", inputType:"date", title: "Your birthdate:", isRequired: true},
            {name:"color", type:"text", inputType:"color", title: "Your favorite color:"},
            {name:"email", type:"text", inputType:"email", title: "Your e-mail:", placeHolder:"jon.snow@nightwatch.org", isRequired: true, validators: [{type:"email"}]},
            { type: "checkbox", name: "car", title: "What car are you driving?", isRequired: true,
                colCount: 4, choices: ["None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen"] },
            { type: "dropdown", name: "car", title: "What car are you driving?", isRequired: true, colCount: 0,
                choices: ["None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen"] },
            { type: "matrix", name: "Quality", title: "Please indicate if you agree or disagree with the following statements",
                columns: [{ value: 1, text: "Strongly Disagree" },
                    { value: 2, text: "Disagree" },
                    { value: 3, text: "Neutral" },
                    { value: 4, text: "Agree" },
                    { value: 5, text: "Strongly Agree" }],
                rows: [{ value: "affordable", text: "Product is affordable" },
                    { value: "does what it claims", text: "Product does what it claims" },
                    { value: "better then others", text: "Product is better than other products on the market" },
                    { value: "easy to use", text: "Product is easy to use" }]},
            { type: "rating", name: "satisfaction", title: "How satisfied are you with the Product?",
                mininumRateDescription: "Not Satisfied", maximumRateDescription: "Completely satisfied" },
            { type: "rating", name: "recommend friends", visibleIf: "{satisfaction} > 3",
                title: "How likely are you to recommend the Product to a friend or co-worker?",
                mininumRateDescription: "Will not recommend", maximumRateDescription: "I will recommend" },
            { type: "comment", name: "suggestions", title:"What would make you more satisfied with the Product?", }
        ]},
        {questions: [
            { type: "radiogroup", name: "price to competitors",
                title: "Compared to our competitors, do you feel the Product is",
                choices: ["Less expensive", "Priced about the same", "More expensive", "Not sure"]},
            { type: "radiogroup", name: "price", title: "Do you feel our current price is merited by our product?",
                choices: ["correct|Yes, the price is about right",
                    "low|No, the price is too low for your product",
                    "high|No, the price is too high for your product"]},
            { type: "multipletext", name: "pricelimit", title: "What is the... ",
                items: [{ name: "mostamount", title: "Most amount you would every pay for a product like ours" },
                    { name: "leastamount", title: "The least amount you would feel comfortable paying" }]}
        ]},
        { questions: [
            { type: "text", name: "email",
                title: "Thank you for taking our survey. Your survey is almost complete, please enter your email address in the box below if you wish to participate in our drawing, then press the 'Submit' button."}
        ]}
    ]};

    Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
    Survey.Survey.cssType = "bootstrap";

    var model = new Survey.Model(json);

    model.render("surveyElement");
    
}

if(!window["%hammerhead%"]) {
    init();
}