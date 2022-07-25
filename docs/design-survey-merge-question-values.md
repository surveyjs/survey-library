# Merge Question Values

You can merge values from multiple questions into a single array or object. This functionality enables you to split complex forms into connected parts. For example, you can create a form where users enter a list of employees in one question and fill out details about them in another question. If you associate the questions with each other, their values will be merged into a single array.

To associate two questions, assign the `name` value of a main question to the `valueName` property of other questions. For example, the following code associates a [Matrix Dynamic](https://surveyjs.io/Documentation/Library?id=questionmatrixdynamicmodel) with a [Panel Dynamic](https://surveyjs.io/Documentation/Library?id=questionpaneldynamicmodel). Together they produce an `employees` array of objects. The Matrix Dynamic supplies the `employees-name` field values; the Panel Dynamic supplies the `address` and `phone` field values. 

```js
const surveyJson = {
  "elements": [{
    "type": "matrixdynamic",
    "name": "employees",
    "title": "Employees",
    "columns": [{
      "name": "employee-name",
      "cellType": "text"
    }],
  }, {
    "type": "paneldynamic",
    "name": "employee-info",
    "title": "Your employees",
    "valueName": "employees",
    "templateElements": [{
      "type": "panel",
      "name": "contacts",
      "elements": [{
        "type": "text",
        "name": "address",
        "title": "Address:"
      }, {
        "type": "text",
        "name": "phone",
        "title": "Phone:"
      }]
    }],
    "templateTitle": "Employee: {panel.employee-name}"
  }]
}
```

Matrix Dynamic and Panel Dynamic are compatible because they both produce arrays of objects. In some instances, you need to associate two or more questions that produce results in different formats and as such are incompatible. For example, the Checkbox question type produces an array of primitive values that cannot be merged with an array of objects. To force a Checkbox question to produce an array of objects, specify the [`valuePropertyName`](https://surveyjs.io/Documentation/Library?id=questioncheckboxmodel#valuePropertyName) property with a field name that should store question values. In the following example, a Checkbox question stores values in the `car` field. A Panel Dynamic adds the `years-owned` and `rating` fields to each object in the `cars` array:

```js
const surveyJson = {
  "elements": [{
    "type": "checkbox",
    "name": "cars",
    "valuePropertyName": "car",
    "title": "Which car(s) have you ever owned?",
    "choices": [ "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi",
      "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen", "Tesla" ]
  }, {
    "type": "paneldynamic",
    "name": "cars-info",
    "title": "Car Information",
    "valueName": "cars",
    "templateElements": [{
      "type": "dropdown",
      "name": "years-owned",
      "title": "How long did you own this car?",
      "choicesMin": 1,
      "choicesMax": 50
    }, {
      "type": "rating",
      "name": "rating",
      "title": "How would you rate it?",
    }],
    "templateTitle": "Car: {panel.car}"
  }]
}
```

[View example](https://surveyjs.io/Examples/Library?id=survey-shareddata)