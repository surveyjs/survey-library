import { JsonObject } from "../../src/jsonobject";
import { InputMaskDateTime, getDateTimeLexems } from "../../src/mask/mask_datetime";
import { QuestionTextModel } from "../../src/question_text";

export default QUnit.module("Datetime mask");

QUnit.test("Serialize InputMaskDateTime properties", function (assert) {
  const q = new QuestionTextModel("q1");
  const jsonObject = new JsonObject();
  let json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, { name: "q1" }, "empty mask");

  q.maskType = "datetime";
  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, { name: "q1", maskType: "datetime" }, "empty datetime");

  q.maskSettings["pattern"] = "mm/dd/yyyy";
  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, {
    name: "q1",
    maskType: "datetime",
    maskSettings: {
      pattern: "mm/dd/yyyy"
    }
  }, "set pattern datetime");

  q.maskSettings.saveMaskedValue = true;
  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, {
    name: "q1",
    maskType: "datetime",
    maskSettings: {
      saveMaskedValue: true,
      pattern: "mm/dd/yyyy"
    }
  }, "saveMaskedValue datetime");

  q.maskSettings["max"] = "2000-01-01";
  q.maskSettings["min"] = "1900-01-01";
  json = jsonObject.toJsonObject(q);
  assert.deepEqual(json, {
    name: "q1",
    maskType: "datetime",
    maskSettings: {
      saveMaskedValue: true,
      pattern: "mm/dd/yyyy",
      min: "1900-01-01",
      max: "2000-01-01"
    }
  }, "min & max datetime");
});

QUnit.test("Deserialize InputMaskDateTime properties", function (assert) {
  const q = new QuestionTextModel("q1");
  const jsonObject = new JsonObject();
  jsonObject.toObject({ name: "q1" }, q);
  let maskSettings = q.maskSettings as InputMaskDateTime;
  assert.equal(q.maskType, "none");
  assert.equal(maskSettings.getType(), "masksettings");

  jsonObject.toObject({ name: "q1", maskType: "datetime" }, q);
  maskSettings = q.maskSettings as InputMaskDateTime;
  assert.equal(q.maskType, "datetime");
  assert.equal(maskSettings.getType(), "datetimemask", "datetimemask type");
  assert.equal(maskSettings.pattern, undefined, "datetime pattern");
  assert.equal(maskSettings.saveMaskedValue, false, "datetime saveMaskedValue");
  assert.equal(maskSettings.min, undefined, "datetime min");
  assert.equal(maskSettings.max, undefined, "datetime max");

  jsonObject.toObject({
    name: "q1",
    maskType: "datetime",
    maskSettings: {
      saveMaskedValue: true,
      pattern: "mm/dd/yyyy",
      min: "1900-01-01",
      max: "2000-01-01"
    }
  }, q);
  maskSettings = q.maskSettings as InputMaskDateTime;
  assert.equal(q.maskType, "datetime");
  assert.equal(maskSettings.getType(), "datetimemask", "datetimemask type");
  assert.equal(maskSettings.pattern, "mm/dd/yyyy", "datetime pattern");
  assert.equal(maskSettings.saveMaskedValue, true, "datetime saveMaskedValue");
  assert.equal(maskSettings.min, "1900-01-01", "datetime min");
  assert.equal(maskSettings.max, "2000-01-01", "datetime max");
});

QUnit.test("getDateTimeLiterals simple pattern", function (assert) {
  let result = getDateTimeLexems("m/d/yy");
  assert.equal(result.length, 5);
  assert.equal(result[0].type, "month");
  assert.equal(result[0].value, "m");
  assert.equal(result[0].count, 1);
  assert.equal(result[1].type, "separator");
  assert.equal(result[1].value, "/");
  assert.equal(result[1].count, 1);
  assert.equal(result[2].type, "day");
  assert.equal(result[2].value, "d");
  assert.equal(result[2].count, 1);
  assert.equal(result[3].type, "separator");
  assert.equal(result[3].value, "/");
  assert.equal(result[3].count, 1);
  assert.equal(result[4].type, "year");
  assert.equal(result[4].value, "y");
  assert.equal(result[4].count, 2);
});

QUnit.test("getDateTimeLiterals simple pattern", function (assert) {
  let result = getDateTimeLexems("mm/dd/yyyy");
  assert.equal(result.length, 5);
  assert.equal(result[0].type, "month");
  assert.equal(result[0].value, "m");
  assert.equal(result[0].count, 2);
  assert.equal(result[1].type, "separator");
  assert.equal(result[1].value, "/");
  assert.equal(result[1].count, 1);
  assert.equal(result[2].type, "day");
  assert.equal(result[2].value, "d");
  assert.equal(result[2].count, 2);
  assert.equal(result[3].type, "separator");
  assert.equal(result[3].value, "/");
  assert.equal(result[3].count, 1);
  assert.equal(result[4].type, "year");
  assert.equal(result[4].value, "y");
  assert.equal(result[4].count, 4);
});

QUnit.test("parseDateTime valid string mm/dd/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";

  assert.equal(maskInstance._getMaskedValue("02/14/2024"), "02/14/2024");
  assert.equal(maskInstance._getMaskedValue("2/4/2024"), "02/04/2024");
  assert.equal(maskInstance._getMaskedValue("2"), "02/dd/yyyy");
  assert.equal(maskInstance._getMaskedValue("2/"), "02/dd/yyyy");
  assert.equal(maskInstance._getMaskedValue("2/4"), "02/04/yyyy");
  assert.equal(maskInstance._getMaskedValue("2/4/"), "02/04/yyyy");
  assert.equal(maskInstance._getMaskedValue("m/4/1990"), "mm/04/1990");
  assert.equal(maskInstance._getMaskedValue("/4/1990"), "mm/04/1990");
});

QUnit.test("parseDateTime with validation mm/dd/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";

  assert.equal(maskInstance._getMaskedValue("13"), "1m/dd/yyyy");
  assert.equal(maskInstance._getMaskedValue("02/33"), "02/03/yyyy");
  assert.equal(maskInstance._getMaskedValue("03/33"), "03/3d/yyyy");
  assert.equal(maskInstance._getMaskedValue("06/30"), "06/30/yyyy");
  assert.equal(maskInstance._getMaskedValue("06/31"), "06/3d/yyyy");
  assert.equal(maskInstance._getMaskedValue("02/29/2000"), "02/29/2000");
  assert.equal(maskInstance._getMaskedValue("02/29/2001"), "02/29/200y");
});

QUnit.test("DateTime mask mm/dd/yyyy HH:MM", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy HH:MM";

  assert.equal(maskInstance._getMaskedValue("10/24"), "10/24/yyyy HH:MM");
  assert.equal(maskInstance._getMaskedValue("10/24/2023 1"), "10/24/2023 1H:MM");
  assert.equal(maskInstance._getMaskedValue("10/24/2023 9"), "10/24/2023 09:MM");
  assert.equal(maskInstance._getMaskedValue("10/24/2023 13:46"), "10/24/2023 13:46");

  maskInstance.pattern = "mm/dd/yyyy H:MM";
  assert.equal(maskInstance._getMaskedValue("10/24"), "10/24/yyyy H:MM");
  assert.equal(maskInstance._getMaskedValue("10/24/2023 3:"), "10/24/2023 3:MM");
  assert.equal(maskInstance._getMaskedValue("10/24/2023 13:46"), "10/24/2023 13:46");
});

QUnit.test("parseDateTime invalid string mm/dd/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";

  assert.equal(maskInstance._getMaskedValue("02a/14/2024"), "02/14/2024");
  assert.equal(maskInstance._getMaskedValue("2/4+/2024"), "02/04/2024");
  assert.equal(maskInstance._getMaskedValue("2+"), "02/dd/yyyy");

  assert.equal(maskInstance._getMaskedValue("11/022/yyyy"), "11/02/yyyy");
  // assert.equal(maskInstance._getMaskedValue("11/002/yyyy"), "11/02/yyyy");
});

QUnit.test("parseDateTime invalid string m/d/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "m/d/yyyy";

  assert.equal(maskInstance._getMaskedValue("2/d/yyyy"), "2/d/yyyy");
  assert.equal(maskInstance._getMaskedValue("/d/yyyy"), "m/d/yyyy");
  assert.equal(maskInstance._getMaskedValue("0m/d/yyyy"), "m/d/yyyy");
  assert.equal(maskInstance._getMaskedValue("10/0d/yyyy"), "10/d/yyyy");
  assert.equal(maskInstance._getMaskedValue("/5/1990"), "m/5/1990");
  assert.equal(maskInstance._getMaskedValue("12//1990"), "12/d/1990");
});

QUnit.test("_getMaskedValue matchWholeMask is false m/d/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "m/d/yyyy";

  assert.equal(maskInstance._getMaskedValue("0", false), "");
  assert.equal(maskInstance._getMaskedValue("1", false), "1");
  assert.equal(maskInstance._getMaskedValue("2", false), "2/");
  assert.equal(maskInstance._getMaskedValue("12", false), "12/");
  assert.equal(maskInstance._getMaskedValue("5/0", false), "5/");
  assert.equal(maskInstance._getMaskedValue("1/0", false), "1/");
  assert.equal(maskInstance._getMaskedValue("10/0", false), "10/");
  assert.equal(maskInstance._getMaskedValue("3/1", false), "3/1");
  assert.equal(maskInstance._getMaskedValue("3/17", false), "3/17/");
  assert.equal(maskInstance._getMaskedValue("3/4", false), "3/4/");
  assert.equal(maskInstance._getMaskedValue("10/4", false), "10/4/");
});

QUnit.test("_getMaskedValue matchWholeMask is false mm/dd/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";

  assert.equal(maskInstance._getMaskedValue("07/1d/2", false), "07/1d/2");
  assert.equal(maskInstance._getMaskedValue("07/dd/2", false), "07/dd/2");
});

QUnit.test("get getMaskedValue value from ISO mm/dd/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  assert.equal(maskInstance.getMaskedValue("2024-12-05"), "12/05/2024");
  assert.equal(maskInstance.getMaskedValue("2024-13-05"), "mm/dd/yyyy");
});

QUnit.test("get getMaskedValue value from ISO m/d/yy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "m/d/yy";
  assert.equal(maskInstance.getMaskedValue("2024-12-05"), "12/5/24");
  assert.equal(maskInstance.getMaskedValue("988-01-05"), "1/5/88");
  assert.equal(maskInstance.getMaskedValue("2024-13-05"), "m/d/yy");
});

QUnit.test("get getMaskedValue value from ISO", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "yyyy";
  assert.equal(maskInstance.getMaskedValue("2024"), "2024");

  maskInstance.pattern = "mm/yyyy";
  assert.equal(maskInstance.getMaskedValue("2024-09"), "09/2024");

  maskInstance.pattern = "m/yyyy";
  assert.equal(maskInstance.getMaskedValue("2024-09"), "9/2024");

  maskInstance.pattern = "m/yy";
  assert.equal(maskInstance.getMaskedValue("2024-09"), "9/24");

  maskInstance.pattern = "HH:MM";
  assert.equal(maskInstance.getMaskedValue("12:45"), "12:45");
  assert.equal(maskInstance.getMaskedValue("05:05"), "05:05");

  maskInstance.pattern = "hh:MM tt";
  assert.equal(maskInstance.getMaskedValue("12:45"), "12:45 pm");
  assert.equal(maskInstance.getMaskedValue("05:05"), "05:05 am");
  assert.equal(maskInstance.getMaskedValue("22:07"), "10:07 pm");

  maskInstance.pattern = "hh:MM TT";
  assert.equal(maskInstance.getMaskedValue("12:45"), "12:45 PM");
  assert.equal(maskInstance.getMaskedValue("05:05"), "05:05 AM");
  assert.equal(maskInstance.getMaskedValue("22:07"), "10:07 PM");

  maskInstance.pattern = "hh:MM";
  assert.equal(maskInstance.getMaskedValue("12:45"), "12:45");
  assert.equal(maskInstance.getMaskedValue("05:05"), "05:05");
  assert.equal(maskInstance.getMaskedValue("22:07"), "10:07");
});

QUnit.test("getISO_8601Format getUnmaskedValue", function (assert) {
  const maskInstance = new InputMaskDateTime();

  maskInstance.pattern = "yyyy";
  assert.equal(maskInstance.getUnmaskedValue("2024"), "2024");

  maskInstance.pattern = "mm/yyyy";
  assert.equal(maskInstance.getUnmaskedValue("09/2024"), "2024-09");

  maskInstance.pattern = "m/yyyy";
  assert.equal(maskInstance.getUnmaskedValue("9/2024"), "2024-09");

  maskInstance.pattern = "m/yy";
  assert.equal(maskInstance.getUnmaskedValue("9/24"), "2024-09");

  maskInstance.pattern = "HH:MM";
  assert.equal(maskInstance.getUnmaskedValue("12:45"), "12:45");
  assert.equal(maskInstance.getUnmaskedValue("05:05"), "05:05");

  maskInstance.pattern = "dd/mm/yyyy HH:MM";
  assert.equal(maskInstance.getUnmaskedValue("24/07/1998 12:45"), "1998-07-24T12:45");
  assert.equal(maskInstance.getUnmaskedValue("24/07/1998 HH:MM"), "");

  maskInstance.pattern = "hh:MM tt";
  assert.equal(maskInstance.getUnmaskedValue("12:45 pm"), "12:45");
  assert.equal(maskInstance.getUnmaskedValue("05:05 am"), "05:05");
  assert.equal(maskInstance.getUnmaskedValue("10:07 pm"), "22:07");

  maskInstance.pattern = "hh:MM TT";
  assert.equal(maskInstance.getUnmaskedValue("12:45 PM"), "12:45");
  assert.equal(maskInstance.getUnmaskedValue("05:05 AM"), "05:05");
  assert.equal(maskInstance.getUnmaskedValue("10:07 PM"), "22:07");

  maskInstance.pattern = "hh:MM";
  assert.equal(maskInstance.getUnmaskedValue("12:45"), "12:45");
  assert.equal(maskInstance.getUnmaskedValue("05:05"), "05:05");
  assert.equal(maskInstance.getUnmaskedValue("10:07"), "10:07");
});

QUnit.test("get masked date if text with dots mm/dd/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";

  assert.equal(maskInstance._getMaskedValue("12.4"), "12/04/yyyy");
  assert.equal(maskInstance._getMaskedValue("12.34"), "12/3d/yyyy");
  assert.equal(maskInstance._getMaskedValue("12.30.198"), "12/30/198y");
  assert.equal(maskInstance._getMaskedValue("12.30.0001"), "12/30/0001");
  assert.equal(maskInstance._getMaskedValue("12.30.1987"), "12/30/1987");

  // assert.equal(maskInstance._getMaskedValue("1.4"), "01/04/yyyy");
  // assert.equal(maskInstance._getMaskedValue("1.34"), "01/3d/yyyy");
  // assert.equal(maskInstance._getMaskedValue("1.3.198"), "01/03/198y");
  // assert.equal(maskInstance._getMaskedValue("1.3.0001"), "01/03/0001");
  // assert.equal(maskInstance._getMaskedValue("1.3.1987"), "01/03/1987");
});

QUnit.test("get masked date if text with dots m/d/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "m/d/yyyy";

  assert.equal(maskInstance._getMaskedValue("12.4"), "12/4/yyyy");
  assert.equal(maskInstance._getMaskedValue("12.34"), "12/3/yyyy");
  assert.equal(maskInstance._getMaskedValue("12.30.198"), "12/30/198y");
  assert.equal(maskInstance._getMaskedValue("12.30.0001"), "12/30/0001");
  assert.equal(maskInstance._getMaskedValue("12.30.1987"), "12/30/1987");

  assert.equal(maskInstance._getMaskedValue("1.4"), "1/4/yyyy");
  assert.equal(maskInstance._getMaskedValue("1.34"), "1/3/yyyy");
  assert.equal(maskInstance._getMaskedValue("1.3.198"), "1/3/198y");
  assert.equal(maskInstance._getMaskedValue("1.3.0001"), "1/3/0001");
  assert.equal(maskInstance._getMaskedValue("1.3.1987"), "1/3/1987");
});

QUnit.test("get masked date if set min & max mm/dd/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  maskInstance.min = "2024-04-01";
  maskInstance.max = "2024-05-01";

  assert.equal(maskInstance._getMaskedValue("05/3", false), "05/");
  assert.equal(maskInstance._getMaskedValue("05/3", false), "05/");
});

QUnit.test("get unmasked valid date text mm/dd/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  assert.equal(maskInstance.getUnmaskedValue("mm/dd/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("1m/dd/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("01/dd/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("02/dd/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("12/04/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("12/3d/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("12/30/198y"), "");
  assert.equal(maskInstance.getUnmaskedValue("12/30/0001"), "0001-12-30");
  assert.equal(maskInstance.getUnmaskedValue("12/30/1987"), "1987-12-30");
  assert.equal(maskInstance.getUnmaskedValue("01/03/1987"), "1987-01-03");
});

QUnit.test("get input value onBlur mm/dd/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";

  const input = "01/01/1970";
  const unmaskedValue = maskInstance.getUnmaskedValue(input);
  assert.equal(unmaskedValue, "1970-01-01", "unmaskedValue");

  const maskedValue = maskInstance.getMaskedValue(unmaskedValue);
  assert.equal(maskedValue, input, "");
});

QUnit.test("get masked valid date text m/d/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "m/d/yyyy";
  assert.equal(maskInstance.getUnmaskedValue("m/d/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("1/d/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("1/d/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("2/d/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("1/4/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("1/3/yyyy"), "");
  assert.equal(maskInstance.getUnmaskedValue("1/3/198y"), "");
  assert.equal(maskInstance.getUnmaskedValue("12/30/0001"), "0001-12-30");
  assert.equal(maskInstance.getUnmaskedValue("12/30/1987"), "1987-12-30");
  assert.equal(maskInstance.getUnmaskedValue("1/3/1987"), "1987-01-03");
});

QUnit.test("_getMaskedValue matchWholeMask m/d/yy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "m/d/yy";

  assert.equal(maskInstance.getUnmaskedValue("8/5/91"), "1991-08-05");
  assert.equal(maskInstance.getUnmaskedValue("1/3/69"), "1969-01-03");
  assert.equal(maskInstance.getUnmaskedValue("12/30/68"), "2068-12-30");
  assert.equal(maskInstance.getUnmaskedValue("12/30/01"), "2001-12-30");
  assert.equal(maskInstance.getUnmaskedValue("12/30/00"), "2000-12-30");
});

QUnit.test("_getMaskedValue with max m/d/yy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "m/d/yy";
  maskInstance.min = "1950-05-30";
  maskInstance.max = "2024-02-27";

  assert.equal(maskInstance.getUnmaskedValue("12/30/01"), "2001-12-30");
  assert.equal(maskInstance.getUnmaskedValue("12/30/00"), "2000-12-30");
  assert.equal(maskInstance.getUnmaskedValue("12/30/24"), "2024-12-30");
  assert.equal(maskInstance.getUnmaskedValue("1/3/69"), "1969-01-03");
  assert.equal(maskInstance.getUnmaskedValue("12/30/68"), "1968-12-30");
  assert.equal(maskInstance.getUnmaskedValue("8/5/91"), "1991-08-05");
  assert.equal(maskInstance.getUnmaskedValue("8/5/50"), "1950-08-05");
});

QUnit.test("dateTime processInput serial input: insert characters", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "1m/dd/yyyy", "type #1");
  assert.equal(result.caretPosition, 1, "type #1");

  result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "12/dd/yyyy", "type 2");
  assert.equal(result.caretPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "1m/dd/yyyy", "try type 5");
  assert.equal(result.caretPosition, 1, "try type 5");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "12/dd/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "12/3d/yyyy", "type 3");
  assert.equal(result.caretPosition, 4, "type 3");

  result = maskInstance.processInput({ insertedChars: "7", selectionStart: 4, selectionEnd: 4, prevValue: "12/3d/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "12/3d/yyyy", "try type 7");
  assert.equal(result.caretPosition, 4, "try type 7");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "12/3d/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "12/30/yyyy", "type 0");
  assert.equal(result.caretPosition, 6, "type 0");

  result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "12/30/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "12/30/2yyy", "type year");
  assert.equal(result.caretPosition, 7, "type year");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 9, selectionEnd: 9, prevValue: "12/30/202y", inputDirection: "forward" });
  assert.equal(result.value, "12/30/2024", "type 2024");
  assert.equal(result.caretPosition, 10, "type 2024");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 10, selectionEnd: 10, prevValue: "12/30/2024", inputDirection: "forward" });
  assert.equal(result.value, "12/30/2024", "type 0 2024");
  assert.equal(result.caretPosition, 10, "type 0 2024");
});

QUnit.test("dateTime processInput serial input: insert characters v2", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";

  let result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "04/dd/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "04/3d/yyyy", "type #1");
  assert.equal(result.caretPosition, 4, "type #1");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "02/dd/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "02/03/yyyy", "type #2");
  assert.equal(result.caretPosition, 6, "type #2");

  result = maskInstance.processInput({ insertedChars: "5", selectionStart: 3, selectionEnd: 3, prevValue: "02/0d/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "02/05/yyyy", "type #3");
  assert.equal(result.caretPosition, 6, "type #3");
});

QUnit.test("dateTime processInput serial input: insert characters m/d/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "m/d/yyyy";
  let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "m/d/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "1/d/yyyy", "type #1");
  assert.equal(result.caretPosition, 1, "type #1");

  result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1/d/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "12/d/yyyy", "type 2");
  assert.equal(result.caretPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "1m/d/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "1/d/yyyy", "try type 5");
  assert.equal(result.caretPosition, 1, "try type 5");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "12/d/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "12/3/yyyy", "type 3");
  assert.equal(result.caretPosition, 4, "type 3");

  result = maskInstance.processInput({ insertedChars: "7", selectionStart: 4, selectionEnd: 4, prevValue: "12/3/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "12/3/yyyy", "try type 7");
  assert.equal(result.caretPosition, 4, "try type 7");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "12/3/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "12/30/yyyy", "type 0");
  assert.equal(result.caretPosition, 6, "type 0");

  result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "12/30/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "12/30/2yyy", "type year");
  assert.equal(result.caretPosition, 7, "type year");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 9, selectionEnd: 9, prevValue: "12/30/202y", inputDirection: "forward" });
  assert.equal(result.value, "12/30/2024", "type 2024");
  assert.equal(result.caretPosition, 10, "type 2024");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 10, selectionEnd: 10, prevValue: "12/30/2024", inputDirection: "forward" });
  assert.equal(result.value, "12/30/2024", "type 0 2024");
  assert.equal(result.caretPosition, 10, "type 0 2024");
});

QUnit.test("dateTime processInput: insert characters mm/dd/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  let result = maskInstance.processInput({ insertedChars: "4", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "04/dd/yyyy", "type 4");
  assert.equal(result.caretPosition, 3, "type 4");

  result = maskInstance.processInput({ insertedChars: "5", selectionStart: 3, selectionEnd: 3, prevValue: "04/dd/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "04/05/yyyy", "type 5");
  assert.equal(result.caretPosition, 6, "type 5");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/000y", inputDirection: "forward" });
  assert.equal(result.value, "04/05/0001", "type 1");
  assert.equal(result.caretPosition, 10, "type 1");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 4, selectionEnd: 4, prevValue: "01/3d/1991", inputDirection: "forward" });
  assert.equal(result.value, "01/3d/1991", "try type 4");
  assert.equal(result.caretPosition, 4, "try type 4");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 1, selectionEnd: 1, prevValue: "1m/30/1991", inputDirection: "forward" });
  assert.equal(result.value, "1m/30/1991", "try type 3");
  assert.equal(result.caretPosition, 1, "try type 3");
});

QUnit.test("dateTime processInput: insert characters m/d/yy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "m/d/yy";
  let result = maskInstance.processInput({ insertedChars: "4", selectionStart: 0, selectionEnd: 0, prevValue: "m/d/yy", inputDirection: "forward" });
  assert.equal(result.value, "4/d/yy", "type 4");
  assert.equal(result.caretPosition, 2, "type 4");

  result = maskInstance.processInput({ insertedChars: "5", selectionStart: 2, selectionEnd: 2, prevValue: "4/d/yy", inputDirection: "forward" });
  assert.equal(result.value, "4/5/yy", "type 5");
  assert.equal(result.caretPosition, 4, "type 5");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 4, selectionEnd: 4, prevValue: "4/5/yy", inputDirection: "forward" });
  assert.equal(result.value, "4/5/1y", "type 1");
  assert.equal(result.caretPosition, 5, "type 1");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "m/d/yy", inputDirection: "forward" });
  assert.equal(result.value, "m/d/yy", "try type 0 into month");
  assert.equal(result.caretPosition, 0, "try type 0 into month");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 2, selectionEnd: 2, prevValue: "1/d/yy", inputDirection: "forward" });
  assert.equal(result.value, "1/d/yy", "try type 0 into day");
  assert.equal(result.caretPosition, 2, "try type 0 into day");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "10/d/yy", inputDirection: "forward" });
  assert.equal(result.value, "10/d/yy", "try type 0 into day");
  assert.equal(result.caretPosition, 3, "try type 0 into day");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 5, selectionEnd: 5, prevValue: "4/5/1y", inputDirection: "forward" });
  assert.equal(result.value, "4/5/13", "type 3");
  assert.equal(result.caretPosition, 6, "type 3");

  result = maskInstance.processInput({ insertedChars: "8", selectionStart: 6, selectionEnd: 6, prevValue: "4/5/13", inputDirection: "forward" });
  assert.equal(result.value, "4/5/13", "try type 8");
  assert.equal(result.caretPosition, 6, "try type 8");

  result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "1/3/91", inputDirection: "forward" });
  assert.equal(result.value, "1/3/91", "try type 4");
  assert.equal(result.caretPosition, 3, "try type 4");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 1, selectionEnd: 1, prevValue: "1/30/91", inputDirection: "forward" });
  assert.equal(result.value, "1/30/91", "try type 3");
  assert.equal(result.caretPosition, 1, "try type 3");
});

QUnit.test("dateTime processInput: delete characters by backspace", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  let result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 9, selectionEnd: 10, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "04/05/202y", "delete 4");
  assert.equal(result.caretPosition, 9, "delete 4");

  result = maskInstance.processInput({ prevValue: "04/05/yyyy", selectionStart: 5, selectionEnd: 6, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "04/05/yyyy", "try delete /");
  assert.equal(result.caretPosition, 5, "try delete /");

  result = maskInstance.processInput({ prevValue: "04/05/yyyy", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "04/0d/yyyy", "delete 5");
  assert.equal(result.caretPosition, 4, "delete 5");

  result = maskInstance.processInput({ prevValue: "04/0d/yyyy", selectionStart: 3, selectionEnd: 4, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "04/dd/yyyy", "delete 0");
  assert.equal(result.caretPosition, 3, "delete 0");

  result = maskInstance.processInput({ prevValue: "04/dd/yyyy", selectionStart: 2, selectionEnd: 3, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "04/dd/yyyy", "try delete /");
  assert.equal(result.caretPosition, 2, "try delete /");

  result = maskInstance.processInput({ prevValue: "04/dd/yyyy", selectionStart: 1, selectionEnd: 2, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "0m/dd/yyyy", "delete 4");
  assert.equal(result.caretPosition, 1, "delete 4");

  result = maskInstance.processInput({ prevValue: "0m/dd/yyyy", selectionStart: 0, selectionEnd: 1, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "mm/dd/yyyy", "delete 0");
  assert.equal(result.caretPosition, 0, "delete 0");

  result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "mm/dd/yyyy", "delete first character");
  assert.equal(result.caretPosition, 0, "delete first character");
});

QUnit.test("dateTime processInput: editing by delete characters by backspace", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  let result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 1, selectionEnd: 2, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "0m/05/2024", "delete 4");
  assert.equal(result.caretPosition, 1, "delete 4");

  result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 1, selectionEnd: 2, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "0m/12/2024", "delete 5");
  assert.equal(result.caretPosition, 1, "delete 5");

  result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "04/0d/2024", "delete 5");
  assert.equal(result.caretPosition, 4, "delete 5");

  result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "05/1d/2024", "delete 2");
  assert.equal(result.caretPosition, 4, "delete 2");

  result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 3, selectionEnd: 4, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "05/2d/2024", "delete 1");
  assert.equal(result.caretPosition, 3, "delete 1");

  result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 7, selectionEnd: 8, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "05/12/224y", "delete 0");
  assert.equal(result.caretPosition, 7, "delete 0");
});

QUnit.test("dateTime processInput: delete characters by backspace m/d/yyyy", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "m/d/yyyy";
  let result = maskInstance.processInput({ prevValue: "2/d/yyyy", selectionStart: 0, selectionEnd: 1, insertedChars: null, inputDirection: "backward" });
  assert.equal(result.value, "m/d/yyyy", "delete 2");
  assert.equal(result.caretPosition, 0, "delete 2");
});

QUnit.test("dateTime processInput: copy/paste", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  let result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "05/12/2024", inputDirection: "backward" });
  assert.equal(result.value, "05/12/2024", "insert new value 05/12/2024");
  assert.equal(result.caretPosition, 10, "insert new value 05/12/2024");

  result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "5/12/2024", inputDirection: "backward" });
  assert.equal(result.value, "05/12/2024", "insert new value 5/12/2024");
  assert.equal(result.caretPosition, 10, "insert new value 5/12/2024");

  // result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "5/1/2024", inputDirection: "backward" });
  // assert.equal(result.value, "05/01/2024", "insert new value 5/1/2024");
  // assert.equal(result.caretPosition, 10, "insert new value 5/1/2024");

  result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "10.28.1996", inputDirection: "backward" });
  assert.equal(result.value, "10/28/1996", "empty value & insert new value 10.28.1996");
  assert.equal(result.caretPosition, 10, "empty value & insert new value 10.28.1996");

  result = maskInstance.processInput({ prevValue: "5/12/2024", selectionStart: 0, selectionEnd: 0, insertedChars: "108", inputDirection: "backward" });
  assert.equal(result.value, "10/12/2024", "insert 108");
  assert.equal(result.caretPosition, 3, "insert 108");

  result = maskInstance.processInput({ prevValue: "5/12/2024", selectionStart: 0, selectionEnd: 0, insertedChars: "10.28.1996", inputDirection: "backward" });
  assert.equal(result.value, "10/28/1996", "insert new value 10.28.1996");
  assert.equal(result.caretPosition, 10, "insert new value 10.28.1996");
});

QUnit.test("dateTime process: cursor position", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";

  let result = maskInstance.processInput({ insertedChars: "2", prevValue: "07/1d/yyyy", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
  assert.equal(result.value, "07/1d/2yyy", "insert 2");
  assert.equal(result.caretPosition, 7, "insert 2");
});

QUnit.test("dateTime processInput: min for datetime", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy HH:MM";
  maskInstance.min = "05/04/1982 09:15";
  let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 9, selectionEnd: 9, prevValue: "05/04/198y HH:MM", inputDirection: "forward" });
  assert.equal(result.value, "05/04/1982 HH:MM", "type 2");
  assert.equal(result.caretPosition, 11, "type 2");

  result = maskInstance.processInput({ insertedChars: "8", selectionStart: 11, selectionEnd: 11, prevValue: "05/04/1982 HH:MM", inputDirection: "forward" });
  assert.equal(result.value, "05/04/1982 HH:MM", "try type 8");
  assert.equal(result.caretPosition, 11, "try type 8");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 11, selectionEnd: 11, prevValue: "05/04/1982 HH:MM", inputDirection: "forward" });
  assert.equal(result.value, "05/04/1982 1H:MM", "type 1");
  assert.equal(result.caretPosition, 12, "type 1");
});

QUnit.test("dateTime processInput: min for time", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "HH:MM";
  maskInstance.min = "09:15";

  let result = maskInstance.processInput({ insertedChars: "8", selectionStart: 0, selectionEnd: 0, prevValue: "HH:MM", inputDirection: "forward" });
  assert.equal(result.value, "HH:MM", "try type 8");
  assert.equal(result.caretPosition, 0, "try type 8");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "HH:MM", inputDirection: "forward" });
  assert.equal(result.value, "1H:MM", "type 1");
  assert.equal(result.caretPosition, 1, "type 1");

  result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1H:MM", inputDirection: "forward" });
  assert.equal(result.value, "12:MM", "type 2");
  assert.equal(result.caretPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedChars: "8", selectionStart: 3, selectionEnd: 3, prevValue: "12:MM", inputDirection: "forward" });
  assert.equal(result.value, "12:08", "type 8");
  assert.equal(result.caretPosition, 5, "type 8");

  result = maskInstance.processInput({ insertedChars: "8", selectionStart: 3, selectionEnd: 3, prevValue: "09:MM", inputDirection: "forward" });
  assert.equal(result.value, "09:MM", "try type 8");
  assert.equal(result.caretPosition, 3, "try type 8");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "09:MM", inputDirection: "forward" });
  assert.equal(result.value, "09:3M", "type 3");
  assert.equal(result.caretPosition, 4, "type 3");
});

QUnit.test("dateTime processInput: min & max for time", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "HH:MM";
  maskInstance.min = "09:15";
  maskInstance.max = "17:45";

  let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "HH:MM", inputDirection: "forward" });
  assert.equal(result.value, "1H:MM", "type 1");
  assert.equal(result.caretPosition, 1, "type 1");

  result = maskInstance.processInput({ insertedChars: "9", selectionStart: 1, selectionEnd: 1, prevValue: "1H:MM", inputDirection: "forward" });
  assert.equal(result.value, "1H:MM", "try type 9");
  assert.equal(result.caretPosition, 1, "try type 9");

  result = maskInstance.processInput({ insertedChars: "7", selectionStart: 1, selectionEnd: 1, prevValue: "1H:MM", inputDirection: "forward" });
  assert.equal(result.value, "17:MM", "type 7");
  assert.equal(result.caretPosition, 3, "type 7");

  result = maskInstance.processInput({ insertedChars: "5", selectionStart: 3, selectionEnd: 3, prevValue: "17:MM", inputDirection: "forward" });
  assert.equal(result.value, "17:05", "type 5");
  assert.equal(result.caretPosition, 5, "type 5");
});

QUnit.test("dateTime processInput: min & max for 12-hour time", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "hh:MM tt";
  maskInstance.min = "08:00";
  maskInstance.max = "18:00";

  let result = maskInstance.processInput({ insertedChars: "7", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "hh:MM tt", "try type 7");
  assert.equal(result.caretPosition, 0, "try type 7");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "1h:MM tt", "type 1");
  assert.equal(result.caretPosition, 1, "type 1");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 1, selectionEnd: 1, prevValue: "1h:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "10:MM tt", "type 0");
  assert.equal(result.caretPosition, 3, "type 0");

  result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "10:00 tt", "type p");
  assert.equal(result.caretPosition, 6, "type p");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "10:00 at", "type a");
  assert.equal(result.caretPosition, 7, "type a");

  maskInstance.min = "13:00";
  maskInstance.max = "17:00";
  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "01:MM tt", "type 1");
  assert.equal(result.caretPosition, 3, "type 1");

  result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "hh:MM tt", "type 6");
  assert.equal(result.caretPosition, 0, "type 6");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "0h:MM tt", "type 0");
  assert.equal(result.caretPosition, 1, "type 0");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "05:0M tt", inputDirection: "forward" });
  assert.equal(result.value, "05:00 tt", "type second 0");
  assert.equal(result.caretPosition, 6, "type second  0");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "05:00 tt", "type a");
  assert.equal(result.caretPosition, 6, "type a");

  result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "05:00 pt", "type p");
  assert.equal(result.caretPosition, 7, "type p");

  maskInstance.min = "01:00";
  maskInstance.max = "05:00";
  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "01:MM tt", "type 1");
  assert.equal(result.caretPosition, 3, "type 1");

  result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "hh:MM tt", "type 6");
  assert.equal(result.caretPosition, 0, "type 6");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "0h:MM tt", "type 0");
  assert.equal(result.caretPosition, 1, "type 0");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "05:0M tt", inputDirection: "forward" });
  assert.equal(result.value, "05:00 tt", "type second 0");
  assert.equal(result.caretPosition, 6, "type second  0");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "05:00 at", "type a");
  assert.equal(result.caretPosition, 7, "type a");

  result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "05:00 tt", "type p");
  assert.equal(result.caretPosition, 6, "type p");
});

QUnit.test("dateTime processInput: min & max for 12-hour time - h", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "h:MM tt";
  maskInstance.min = "08:00";
  maskInstance.max = "18:00";

  let result = maskInstance.processInput({ insertedChars: "7", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "h:MM tt", "try type 7");
  assert.equal(result.caretPosition, 0, "try type 7");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "1:MM tt", "type 1");
  assert.equal(result.caretPosition, 1, "type 1");

  result = maskInstance.processInput({ insertedChars: "9", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "9:MM tt", "type 1");
  assert.equal(result.caretPosition, 2, "type 1");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 1, selectionEnd: 1, prevValue: "1:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "10:MM tt", "type 0");
  assert.equal(result.caretPosition, 3, "type 0");

  result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "10:00 tt", "type p");
  assert.equal(result.caretPosition, 6, "type p");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "10:00 at", "type a");
  assert.equal(result.caretPosition, 7, "type a");

  maskInstance.min = "13:00";
  maskInstance.max = "17:00";
  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "1:MM tt", "type 1");
  assert.equal(result.caretPosition, 2, "type 1");

  result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "h:MM tt", "type 6");
  assert.equal(result.caretPosition, 0, "type 6");

  // result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
  // assert.equal(result.value, "h:MM tt", "try type 0");
  // assert.equal(result.caretPosition, 0, "try type 0");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "5:0M tt", inputDirection: "forward" });
  assert.equal(result.value, "5:00 tt", "type second 0");
  assert.equal(result.caretPosition, 5, "type second  0");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 5, selectionEnd: 5, prevValue: "5:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "5:00 tt", "type a");
  assert.equal(result.caretPosition, 5, "type a");

  result = maskInstance.processInput({ insertedChars: "p", selectionStart: 5, selectionEnd: 5, prevValue: "5:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "5:00 pt", "type p");
  assert.equal(result.caretPosition, 6, "type p");

  maskInstance.min = "01:00";
  maskInstance.max = "05:00";
  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "1:MM tt", "type 1");
  assert.equal(result.caretPosition, 2, "type 1");

  result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
  assert.equal(result.value, "h:MM tt", "type 6");
  assert.equal(result.caretPosition, 0, "type 6");

  // result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
  // assert.equal(result.value, "h:MM tt", "type 0");
  // assert.equal(result.caretPosition, 0, "type 0");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "5:0M tt", inputDirection: "forward" });
  assert.equal(result.value, "5:00 tt", "type second 0");
  assert.equal(result.caretPosition, 5, "type second  0");

  result = maskInstance.processInput({ insertedChars: "a", selectionStart: 5, selectionEnd: 5, prevValue: "5:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "5:00 at", "type a");
  assert.equal(result.caretPosition, 6, "type a");

  result = maskInstance.processInput({ insertedChars: "p", selectionStart: 5, selectionEnd: 5, prevValue: "05:00 tt", inputDirection: "forward" });
  assert.equal(result.value, "5:00 tt", "type p");
  assert.equal(result.caretPosition, 5, "type p");
});

QUnit.test("dateTime processInput: min for date", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  maskInstance.min = "1972-02-01";
  let result = maskInstance.processInput({ insertedChars: "0", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "04/05/yyyy", "try type 0");
  assert.equal(result.caretPosition, 6, "try type 0");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "04/05/1yyy", "type 1");
  assert.equal(result.caretPosition, 7, "type 1");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
  assert.equal(result.value, "04/05/197y", "try type 1");
  assert.equal(result.caretPosition, 9, "try type 1");

  result = maskInstance.processInput({ insertedChars: "2", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
  assert.equal(result.value, "04/05/1972", "type 2");
  assert.equal(result.caretPosition, 10, "type 2");
});

QUnit.test("dateTime processInput: max", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  maskInstance.max = "1972-02-01";
  let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "04/05/yyyy", "try type 2");
  assert.equal(result.caretPosition, 6, "try type 2");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "04/05/1yyy", "type 1");
  assert.equal(result.caretPosition, 7, "type 1");

  result = maskInstance.processInput({ insertedChars: "3", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
  assert.equal(result.value, "04/05/197y", "try type 3");
  assert.equal(result.caretPosition, 9, "try type 3");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
  assert.equal(result.value, "04/05/1971", "type 1");
  assert.equal(result.caretPosition, 10, "type 1");
});

QUnit.test("dateTime processInput: min & max", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  maskInstance.min = "1960-01-01";
  maskInstance.max = "1980-12-31";
  let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "04/05/yyyy", "try type 2");
  assert.equal(result.caretPosition, 6, "try type 2");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
  assert.equal(result.value, "04/05/1yyy", "type 1");
  assert.equal(result.caretPosition, 7, "type 1");

  result = maskInstance.processInput({ insertedChars: "9", selectionStart: 8, selectionEnd: 8, prevValue: "04/05/19yy", inputDirection: "forward" });
  assert.equal(result.value, "04/05/19yy", "try type 9");
  assert.equal(result.caretPosition, 8, "try type 9");

  result = maskInstance.processInput({ insertedChars: "8", selectionStart: 8, selectionEnd: 8, prevValue: "04/05/19yy", inputDirection: "forward" });
  assert.equal(result.value, "04/05/198y", "type 8");
  assert.equal(result.caretPosition, 9, "type 8");

  result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/198y", inputDirection: "forward" });
  assert.equal(result.value, "04/05/198y", "try type 1");
  assert.equal(result.caretPosition, 9, "try type 1");

  result = maskInstance.processInput({ insertedChars: "0", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/198y", inputDirection: "forward" });
  assert.equal(result.value, "04/05/1980", "type 1");
  assert.equal(result.caretPosition, 10, "type 1");
});

QUnit.test("dateTime processInput: min & max small range", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "mm/dd/yyyy";
  maskInstance.min = "2024-04-01";
  maskInstance.max = "2024-05-01";

  let result = maskInstance.processInput({ insertedChars: "8", prevValue: "05/dd/yyyy", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
  assert.equal(result.value, "05/dd/yyyy", "try type 8");
  assert.equal(result.caretPosition, 3, "try type 8");

  result = maskInstance.processInput({ insertedChars: "3", prevValue: "05/dd/yyyy", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
  assert.equal(result.value, "05/dd/yyyy", "try type 3");
  assert.equal(result.caretPosition, 3, "try type 3");

  result = maskInstance.processInput({ insertedChars: "1", prevValue: "05/dd/yyyy", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
  assert.equal(result.value, "05/01/yyyy", "type 1");
  assert.equal(result.caretPosition, 6, "type 1");
});

QUnit.test("dateTime processInput: time", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "HH:MM";

  let result = maskInstance.processInput({ insertedChars: "1", prevValue: "HH:MM", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
  assert.equal(result.value, "1H:MM", "type 1");
  assert.equal(result.caretPosition, 1, "type 1");

  result = maskInstance.processInput({ insertedChars: "2", prevValue: "1H:MM", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
  assert.equal(result.value, "12:MM", "type 2");
  assert.equal(result.caretPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
  assert.equal(result.value, "12:4M", "type 4");
  assert.equal(result.caretPosition, 4, "type 4");

  result = maskInstance.processInput({ insertedChars: "5", prevValue: "12:4M", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
  assert.equal(result.value, "12:45", "type 5");
  assert.equal(result.caretPosition, 5, "type 5");
});

QUnit.test("dateTime processInput: time - H", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "H:MM";

  let result = maskInstance.processInput({ insertedChars: "1", prevValue: "H:MM", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
  assert.equal(result.value, "1:MM", "type 1");
  assert.equal(result.caretPosition, 1, "type 1");

  result = maskInstance.processInput({ insertedChars: "2", prevValue: "1:MM", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
  assert.equal(result.value, "12:MM", "type 2");
  assert.equal(result.caretPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
  assert.equal(result.value, "12:4M", "type 4");
  assert.equal(result.caretPosition, 4, "type 4");

  result = maskInstance.processInput({ insertedChars: "5", prevValue: "12:4M", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
  assert.equal(result.value, "12:45", "type 5");
  assert.equal(result.caretPosition, 5, "type 5");
});

QUnit.test("dateTime processInput: time 12 hours", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "hh:MM TT";

  let result = maskInstance.processInput({ insertedChars: "2", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
  assert.equal(result.value, "02:MM TT", "type 2");
  assert.equal(result.caretPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedChars: "1", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
  assert.equal(result.value, "1h:MM TT", "type 1");
  assert.equal(result.caretPosition, 1, "type 1");

  result = maskInstance.processInput({ insertedChars: "3", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
  assert.equal(result.value, "1h:MM TT", "type 3");
  assert.equal(result.caretPosition, 1, "type 3");

  result = maskInstance.processInput({ insertedChars: "2", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
  assert.equal(result.value, "12:MM TT", "type 2");
  assert.equal(result.caretPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM TT", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
  assert.equal(result.value, "12:4M TT", "type 4");
  assert.equal(result.caretPosition, 4, "type 4");

  result = maskInstance.processInput({ insertedChars: "5", prevValue: "12:4M TT", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
  assert.equal(result.value, "12:45 TT", "type 5");
  assert.equal(result.caretPosition, 6, "type 5");

  result = maskInstance.processInput({ insertedChars: "X", prevValue: "12:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
  assert.equal(result.value, "12:45 TT", "try type X");
  assert.equal(result.caretPosition, 6, "try type X");

  result = maskInstance.processInput({ insertedChars: "p", prevValue: "12:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
  assert.equal(result.value, "12:45 PT", "type p");
  assert.equal(result.caretPosition, 7, "type p");

  result = maskInstance.processInput({ insertedChars: "z", prevValue: "12:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
  assert.equal(result.value, "12:45 PT", "try type z");
  assert.equal(result.caretPosition, 7, "try type z");

  result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
  assert.equal(result.value, "12:45 PM", "type m");
  assert.equal(result.caretPosition, 8, "type m");

  maskInstance.pattern = "hh:MM tt";
  result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 pt", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
  assert.equal(result.value, "12:45 pm", "type m");
  assert.equal(result.caretPosition, 8, "type m");
});

QUnit.test("dateTime processInput: time 12 hours - a/p", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "hh:MM T";

  let result = maskInstance.processInput({ insertedChars: "2", prevValue: "hh:MM T", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
  assert.equal(result.value, "02:MM T", "type 2");
  assert.equal(result.caretPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedChars: "1", prevValue: "hh:MM T", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
  assert.equal(result.value, "1h:MM T", "type 1");
  assert.equal(result.caretPosition, 1, "type 1");

  result = maskInstance.processInput({ insertedChars: "X", prevValue: "12:45 T", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
  assert.equal(result.value, "12:45 T", "try type X");
  assert.equal(result.caretPosition, 6, "try type X");

  result = maskInstance.processInput({ insertedChars: "p", prevValue: "12:45 T", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
  assert.equal(result.value, "12:45 P", "type p");
  assert.equal(result.caretPosition, 7, "type p");

  result = maskInstance.processInput({ insertedChars: "z", prevValue: "12:45 P", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
  assert.equal(result.value, "12:45 P", "try type z");
  assert.equal(result.caretPosition, 7, "try type z");

  result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 P", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
  assert.equal(result.value, "12:45 P", "try type m");
  assert.equal(result.caretPosition, 7, "try type m");

  maskInstance.pattern = "hh:MM t";
  result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 p", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
  assert.equal(result.value, "12:45 p", "try type m #2");
  assert.equal(result.caretPosition, 7, "try type m #2");
});

QUnit.test("dateTime processInput: time 12 hours - h", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "h:MM TT";

  let result = maskInstance.processInput({ insertedChars: "2", prevValue: "h:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
  assert.equal(result.value, "2:MM TT", "type 2");
  assert.equal(result.caretPosition, 2, "type 2");

  result = maskInstance.processInput({ insertedChars: "1", prevValue: "h:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
  assert.equal(result.value, "1:MM TT", "type 1");
  assert.equal(result.caretPosition, 1, "type 1");

  result = maskInstance.processInput({ insertedChars: "3", prevValue: "1:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
  assert.equal(result.value, "1:MM TT", "type 3");
  assert.equal(result.caretPosition, 1, "type 3");

  result = maskInstance.processInput({ insertedChars: "2", prevValue: "1:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
  assert.equal(result.value, "12:MM TT", "type 2");
  assert.equal(result.caretPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM TT", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
  assert.equal(result.value, "12:4M TT", "type 4");
  assert.equal(result.caretPosition, 4, "type 4");
});

QUnit.test("dateTime processInput: time 12 hours v2", function (assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.pattern = "hh:MM TT";

  let result = maskInstance.processInput({ insertedChars: "2", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
  assert.equal(result.value, "02:MM TT", "type 2");
  assert.equal(result.caretPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedChars: "1", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
  assert.equal(result.value, "1h:MM TT", "type 1");
  assert.equal(result.caretPosition, 1, "type 1");

  result = maskInstance.processInput({ insertedChars: "3", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
  assert.equal(result.value, "1h:MM TT", "type 3");
  assert.equal(result.caretPosition, 1, "type 3");

  result = maskInstance.processInput({ insertedChars: "1", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
  assert.equal(result.value, "11:MM TT", "type 1");
  assert.equal(result.caretPosition, 3, "type 1");

  result = maskInstance.processInput({ insertedChars: "4", prevValue: "11:MM TT", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
  assert.equal(result.value, "11:4M TT", "type 4");
  assert.equal(result.caretPosition, 4, "type 4");

  result = maskInstance.processInput({ insertedChars: "5", prevValue: "11:4M TT", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
  assert.equal(result.value, "11:45 TT", "type 5");
  assert.equal(result.caretPosition, 6, "type 5");

  result = maskInstance.processInput({ insertedChars: "X", prevValue: "11:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
  assert.equal(result.value, "11:45 TT", "try type X");
  assert.equal(result.caretPosition, 6, "try type X");

  result = maskInstance.processInput({ insertedChars: "p", prevValue: "11:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
  assert.equal(result.value, "11:45 PT", "type p");
  assert.equal(result.caretPosition, 7, "type p");

  result = maskInstance.processInput({ insertedChars: "z", prevValue: "11:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
  assert.equal(result.value, "11:45 PT", "try type z");
  assert.equal(result.caretPosition, 7, "try type z");

  result = maskInstance.processInput({ insertedChars: "m", prevValue: "11:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
  assert.equal(result.value, "11:45 PM", "type m");
  assert.equal(result.caretPosition, 8, "type m");

  maskInstance.pattern = "hh:MM tt";
  result = maskInstance.processInput({ insertedChars: "m", prevValue: "11:45 pt", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
  assert.equal(result.value, "11:45 pm", "type m");
  assert.equal(result.caretPosition, 8, "type m");
});