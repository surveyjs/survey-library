import { SurveyModel } from "@/survey";
import { JsonObject } from "@/jsonobject";


test("Serialize two pages", function() {
  var survey = new SurveyModel();
  survey.addNewPage("Page 1");
  survey.addNewPage("Page 2");
  var jsObj = new JsonObject().toJsonObject(survey);
  console.log(jsObj)
  expect(JSON.stringify(jsObj)).toBe('{"pages":[{"name":"Page 1"},{"name":"Page 2"}]}',"serialize two pages")
});
