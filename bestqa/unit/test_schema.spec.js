import { SurveyModel } from "@/survey" // this will load SurveyModel otherwise, schema is `null` 
import { Serializer } from "@/jsonobject";



test("Serialize gen schema", function() {
  Serializer.findClass;
  var schema = Serializer.generateSchema();
  console.log(schema)
});