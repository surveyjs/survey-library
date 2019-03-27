const fs = require('fs');
let jsonText = fs.readFileSync('./doc_generator/classes.json');
let classes = JSON.parse(jsonText);
let result = {
    Categories: [{
        "Name": "LibraryOverview",
        "Title": "Survey Library Overview"
    },
    {
        "Name": "Add-Survey-into-your-Web-Page",
        "Title": "Add Survey into your Web Page"
    },
    {
        "Name": "Create-a-quiz",
        "Title": "Create a quiz"
    },
    {
        "Name": "api",
        "Title": "Survey API",
        "Items": []
    }]
};

classes.forEach(function (element) {
    result.Categories[3].Items.push(
        {
            "Name": element.name.toLowerCase(),
            "Title": element.name.replace(/^question(?!$)|model|^dx/ig, '').replace(/((?<!^)[A-Z])/g, " $1")
        }
    );
});
result.Categories[3].Items.sort((a, b) => {
    return (a.Title > b.Title) ? 1 : -1;
});
let result_string = JSON.stringify(result, null, 2);

fs.writeFileSync('./doc_generator/sidebar.json', result_string);