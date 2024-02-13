import { JsonObject } from "../../src/jsonobject";
import { InputMaskCurrency } from "../../src/mask/mask_currency";
import { QuestionTextModel } from "../../src/question_text";

export default QUnit.module("Currency mask");

QUnit.test("Serialize InputMaskCurrency properties", function (assert) {
  const q = new QuestionTextModel("q1");
  const jsonObject = new JsonObject();
  let json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, { name: "q1" }, "empty mask");

  q.maskType = "currencymask";
  json = jsonObject.toJsonObject(q);
  // assert.deepEqual(json, {
  //   name: "q1",
  //   maskType: "currencymask",
  //   maskSettings: {
  //     "allowNegative": true,
  //     "decimalSeparator": ".",
  //     "precision": 2,
  //     "thousandsSeparator": ","
  //   }
  // }, "init currencymask");

  const maskSettings = q.maskSettings as InputMaskCurrency;
  maskSettings.dataToSave = "masked";
  maskSettings.decimalSeparator = "-";
  maskSettings.thousandsSeparator = "*";
  maskSettings.precision = 5;
  maskSettings.allowNegative = false;
  maskSettings.min = 0;
  maskSettings.max = 1000;
  maskSettings.prefix = "$";
  maskSettings.suffix = " USD";

  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, {
    name: "q1",
    maskType: "currencymask",
    maskSettings: {
      dataToSave: "masked",
      decimalSeparator: "-",
      thousandsSeparator: "*",
      precision: 5,
      min: 0,
      max: 1000,
      prefix: "$",
      suffix: " USD"
    }
  }, "all setting is changed currencymask");
});

QUnit.test("Deserialize InputMaskCurrency properties", function (assert) {
  const q = new QuestionTextModel("q1");
  const jsonObject = new JsonObject();
  jsonObject.toObject({ name: "q1" }, q);
  let maskSettings = q.maskSettings as InputMaskCurrency;
  assert.equal(q.maskType, "none");
  assert.equal(maskSettings.getType(), "masksettings");

  jsonObject.toObject({ name: "q1", maskType: "currencymask" }, q);
  maskSettings = q.maskSettings as InputMaskCurrency;
  assert.equal(q.maskType, "currencymask");
  assert.equal(maskSettings.getType(), "currencymask", "currencymask type");
  assert.equal(maskSettings.dataToSave, "unmasked", "currencymask dataToSave");
  assert.equal(maskSettings.decimalSeparator, ".", "currencymask decimalSeparator");
  assert.equal(maskSettings.thousandsSeparator, ",", "currencymask thousandsSeparator");
  assert.equal(maskSettings.precision, 2, "currencymask precision");
  assert.equal(maskSettings.allowNegative, true, "currencymask allowNegative");
  assert.equal(maskSettings.min, undefined, "currencymask min");
  assert.equal(maskSettings.max, undefined, "currencymask max");
  assert.equal(maskSettings.prefix, undefined, "currencymask prefix");
  assert.equal(maskSettings.suffix, undefined, "currencymask suffix");

  jsonObject.toObject({
    name: "q1",
    maskType: "currencymask",
    maskSettings: {
      dataToSave: "masked",
      decimalSeparator: "-",
      thousandsSeparator: "*",
      allowNegative: true,
      precision: 5,
      min: 0,
      max: 1000,
      prefix: "$",
      suffix: " USD"
    }
  }, q);
  maskSettings = q.maskSettings as InputMaskCurrency;
  assert.equal(q.maskType, "currencymask");
  assert.equal(maskSettings.getType(), "currencymask", "currencymask type");
  assert.equal(maskSettings.dataToSave, "masked", "currencymask dataToSave");
  assert.equal(maskSettings.decimalSeparator, "-", "currencymask decimalSeparator");
  assert.equal(maskSettings.thousandsSeparator, "*", "currencymask thousandsSeparator");
  assert.equal(maskSettings.precision, 5, "currencymask precision");
  assert.equal(maskSettings.allowNegative, true, "currencymask allowNegative");
  assert.equal(maskSettings.min, 0, "currencymask min");
  assert.equal(maskSettings.max, 1000, "currencymask max");
  assert.equal(maskSettings.prefix, "$", "currencymask prefix");
  assert.equal(maskSettings.suffix, " USD", "currencymask suffix");
});