import { FunctionFactory } from "../../src/functionsfactory";
import { JsonObject } from "../../src/jsonobject";
import { InputMaskDateTime, getDateTimeLexems } from "../../src/mask/mask_datetime";
import { QuestionTextModel } from "../../src/question_text";
import { SurveyModel } from "../../src/survey";
import { settings } from "../../src/settings";

import { describe, test, expect } from "vitest";
describe("Datetime mask", () => {
  test("Serialize InputMaskDateTime properties", () => {
    const q = new QuestionTextModel("q1");
    const jsonObject = new JsonObject();
    let json = jsonObject.toJsonObject(q);
    expect(json, "empty mask").toEqualValues({ name: "q1" });

    q.maskType = "datetime";
    json = jsonObject.toJsonObject(q);
    expect(json, "empty datetime").toEqualValues({ name: "q1", maskType: "datetime" });

    q.maskSettings["pattern"] = "mm/dd/yyyy";
    json = jsonObject.toJsonObject(q);
    expect(json, "set pattern datetime").toEqualValues({
      name: "q1",
      maskType: "datetime",
      maskSettings: {
        pattern: "mm/dd/yyyy"
      }
    });

    q.maskSettings.saveMaskedValue = true;
    json = jsonObject.toJsonObject(q);
    expect(json, "saveMaskedValue datetime").toEqualValues({
      name: "q1",
      maskType: "datetime",
      maskSettings: {
        saveMaskedValue: true,
        pattern: "mm/dd/yyyy"
      }
    });

    q.maskSettings["max"] = "2000-01-01";
    q.maskSettings["min"] = "1900-01-01";
    json = jsonObject.toJsonObject(q);
    expect(json, "min & max datetime").toEqualValues({
      name: "q1",
      maskType: "datetime",
      maskSettings: {
        saveMaskedValue: true,
        pattern: "mm/dd/yyyy",
        min: "1900-01-01",
        max: "2000-01-01"
      }
    });
  });

  test("Deserialize InputMaskDateTime properties", () => {
    const q = new QuestionTextModel("q1");
    const jsonObject = new JsonObject();
    jsonObject.toObject({ name: "q1" }, q);
    let maskSettings = q.maskSettings as InputMaskDateTime;
    expect(q.maskType).toLooseEqual("none");
    expect(maskSettings.getType()).toLooseEqual("masksettings");

    jsonObject.toObject({ name: "q1", maskType: "datetime" }, q);
    maskSettings = q.maskSettings as InputMaskDateTime;
    expect(q.maskType).toLooseEqual("datetime");
    expect(maskSettings.getType(), "datetimemask type").toLooseEqual("datetimemask");
    expect(maskSettings.pattern, "datetime pattern").toLooseEqual(undefined);
    expect(maskSettings.saveMaskedValue, "datetime saveMaskedValue").toLooseEqual(false);
    expect(maskSettings.min, "datetime min").toLooseEqual(undefined);
    expect(maskSettings.max, "datetime max").toLooseEqual(undefined);

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
    expect(q.maskType).toLooseEqual("datetime");
    expect(maskSettings.getType(), "datetimemask type").toLooseEqual("datetimemask");
    expect(maskSettings.pattern, "datetime pattern").toLooseEqual("mm/dd/yyyy");
    expect(maskSettings.saveMaskedValue, "datetime saveMaskedValue").toLooseEqual(true);
    expect(maskSettings.min, "datetime min").toLooseEqual("1900-01-01");
    expect(maskSettings.max, "datetime max").toLooseEqual("2000-01-01");
  });

  test("getDateTimeLiterals simple pattern", () => {
    let result = getDateTimeLexems("m/d/yy");
    expect(result.length).toLooseEqual(5);
    expect(result[0].type).toLooseEqual("month");
    expect(result[0].value).toLooseEqual("m");
    expect(result[0].count).toLooseEqual(1);
    expect(result[1].type).toLooseEqual("separator");
    expect(result[1].value).toLooseEqual("/");
    expect(result[1].count).toLooseEqual(1);
    expect(result[2].type).toLooseEqual("day");
    expect(result[2].value).toLooseEqual("d");
    expect(result[2].count).toLooseEqual(1);
    expect(result[3].type).toLooseEqual("separator");
    expect(result[3].value).toLooseEqual("/");
    expect(result[3].count).toLooseEqual(1);
    expect(result[4].type).toLooseEqual("year");
    expect(result[4].value).toLooseEqual("y");
    expect(result[4].count).toLooseEqual(2);
  });

  test("getDateTimeLiterals simple pattern", () => {
    let result = getDateTimeLexems("mm/dd/yyyy");
    expect(result.length).toLooseEqual(5);
    expect(result[0].type).toLooseEqual("month");
    expect(result[0].value).toLooseEqual("m");
    expect(result[0].count).toLooseEqual(2);
    expect(result[1].type).toLooseEqual("separator");
    expect(result[1].value).toLooseEqual("/");
    expect(result[1].count).toLooseEqual(1);
    expect(result[2].type).toLooseEqual("day");
    expect(result[2].value).toLooseEqual("d");
    expect(result[2].count).toLooseEqual(2);
    expect(result[3].type).toLooseEqual("separator");
    expect(result[3].value).toLooseEqual("/");
    expect(result[3].count).toLooseEqual(1);
    expect(result[4].type).toLooseEqual("year");
    expect(result[4].value).toLooseEqual("y");
    expect(result[4].count).toLooseEqual(4);
  });

  test("parseDateTime valid string mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    expect(maskInstance._getMaskedValue("02/14/2024")).toLooseEqual("02/14/2024");
    expect(maskInstance._getMaskedValue("2/4/2024")).toLooseEqual("02/04/2024");
    expect(maskInstance._getMaskedValue("2")).toLooseEqual("02/dd/yyyy");
    expect(maskInstance._getMaskedValue("2/")).toLooseEqual("02/dd/yyyy");
    expect(maskInstance._getMaskedValue("2/4")).toLooseEqual("02/04/yyyy");
    expect(maskInstance._getMaskedValue("2/4/")).toLooseEqual("02/04/yyyy");
    expect(maskInstance._getMaskedValue("m/4/1990")).toLooseEqual("mm/04/1990");
    expect(maskInstance._getMaskedValue("/4/1990")).toLooseEqual("mm/04/1990");
  });

  test("parseDateTime with validation mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    expect(maskInstance._getMaskedValue("13")).toLooseEqual("1m/dd/yyyy");
    expect(maskInstance._getMaskedValue("02/33")).toLooseEqual("02/03/yyyy");
    expect(maskInstance._getMaskedValue("03/33")).toLooseEqual("03/3d/yyyy");
    expect(maskInstance._getMaskedValue("06/30")).toLooseEqual("06/30/yyyy");
    expect(maskInstance._getMaskedValue("06/31")).toLooseEqual("06/3d/yyyy");
    expect(maskInstance._getMaskedValue("02/29/2000")).toLooseEqual("02/29/2000");
    expect(maskInstance._getMaskedValue("02/29/2001")).toLooseEqual("02/29/200y");
  });

  test("DateTime mask mm/dd/yyyy HH:MM", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy HH:MM";

    expect(maskInstance._getMaskedValue("10/24")).toLooseEqual("10/24/yyyy HH:MM");
    expect(maskInstance._getMaskedValue("10/24/2023 1")).toLooseEqual("10/24/2023 1H:MM");
    expect(maskInstance._getMaskedValue("10/24/2023 9")).toLooseEqual("10/24/2023 09:MM");
    expect(maskInstance._getMaskedValue("10/24/2023 13:46")).toLooseEqual("10/24/2023 13:46");

    maskInstance.pattern = "mm/dd/yyyy H:MM";
    expect(maskInstance._getMaskedValue("10/24")).toLooseEqual("10/24/yyyy H:MM");
    expect(maskInstance._getMaskedValue("10/24/2023 3:")).toLooseEqual("10/24/2023 3:MM");
    expect(maskInstance._getMaskedValue("10/24/2023 13:46")).toLooseEqual("10/24/2023 13:46");
  });

  test("parseDateTime invalid string mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    expect(maskInstance._getMaskedValue("02a/14/2024")).toLooseEqual("02/14/2024");
    expect(maskInstance._getMaskedValue("2/4+/2024")).toLooseEqual("02/04/2024");
    expect(maskInstance._getMaskedValue("2+")).toLooseEqual("02/dd/yyyy");

    expect(maskInstance._getMaskedValue("11/022/yyyy")).toLooseEqual("11/02/yyyy");
  // expect(maskInstance._getMaskedValue("11/002/yyyy")).toLooseEqual("11/02/yyyy");
  });

  test("parseDateTime invalid string m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";

    expect(maskInstance._getMaskedValue("2/d/yyyy")).toLooseEqual("2/d/yyyy");
    expect(maskInstance._getMaskedValue("/d/yyyy")).toLooseEqual("m/d/yyyy");
    expect(maskInstance._getMaskedValue("0m/d/yyyy")).toLooseEqual("m/d/yyyy");
    expect(maskInstance._getMaskedValue("10/0d/yyyy")).toLooseEqual("10/d/yyyy");
    expect(maskInstance._getMaskedValue("/5/1990")).toLooseEqual("m/5/1990");
    expect(maskInstance._getMaskedValue("12//1990")).toLooseEqual("12/d/1990");
  });

  test("_getMaskedValue matchWholeMask is false m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";

    expect(maskInstance._getMaskedValue("0", false)).toLooseEqual("");
    expect(maskInstance._getMaskedValue("1", false)).toLooseEqual("1");
    expect(maskInstance._getMaskedValue("2", false)).toLooseEqual("2/");
    expect(maskInstance._getMaskedValue("12", false)).toLooseEqual("12/");
    expect(maskInstance._getMaskedValue("5/0", false)).toLooseEqual("5/");
    expect(maskInstance._getMaskedValue("1/0", false)).toLooseEqual("1/");
    expect(maskInstance._getMaskedValue("10/0", false)).toLooseEqual("10/");
    expect(maskInstance._getMaskedValue("3/1", false)).toLooseEqual("3/1");
    expect(maskInstance._getMaskedValue("3/17", false)).toLooseEqual("3/17/");
    expect(maskInstance._getMaskedValue("3/4", false)).toLooseEqual("3/4/");
    expect(maskInstance._getMaskedValue("10/4", false)).toLooseEqual("10/4/");
  });

  test("_getMaskedValue matchWholeMask is false mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    expect(maskInstance._getMaskedValue("07/1d/2", false)).toLooseEqual("07/1d/2");
    expect(maskInstance._getMaskedValue("07/dd/2", false)).toLooseEqual("07/dd/2");
  });

  test("get getMaskedValue value from ISO mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    expect(maskInstance.getMaskedValue("2024-12-05")).toLooseEqual("12/05/2024");
    expect(maskInstance.getMaskedValue("2024-13-05")).toLooseEqual("mm/dd/yyyy");
  });

  test("get getMaskedValue value from ISO m/d/yy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yy";
    expect(maskInstance.getMaskedValue("2024-12-05")).toLooseEqual("12/5/24");
    expect(maskInstance.getMaskedValue("1988-01-05")).toLooseEqual("1/5/88");
    expect(maskInstance.getMaskedValue("2024-13-05")).toLooseEqual("m/d/yy");
  });

  test("get getMaskedValue value from ISO", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "yyyy";
    expect(maskInstance.getMaskedValue("2024")).toLooseEqual("2024");

    maskInstance.pattern = "mm/yyyy";
    expect(maskInstance.getMaskedValue("2024-09")).toLooseEqual("09/2024");

    maskInstance.pattern = "m/yyyy";
    expect(maskInstance.getMaskedValue("2024-09")).toLooseEqual("9/2024");

    maskInstance.pattern = "m/yy";
    expect(maskInstance.getMaskedValue("2024-09")).toLooseEqual("9/24");

    maskInstance.pattern = "HH:MM";
    expect(maskInstance.getMaskedValue("12:45")).toLooseEqual("12:45");
    expect(maskInstance.getMaskedValue("05:05")).toLooseEqual("05:05");

    maskInstance.pattern = "hh:MM tt";
    expect(maskInstance.getMaskedValue("12:45")).toLooseEqual("12:45 pm");
    expect(maskInstance.getMaskedValue("05:05")).toLooseEqual("05:05 am");
    expect(maskInstance.getMaskedValue("22:07")).toLooseEqual("10:07 pm");

    maskInstance.pattern = "hh:MM TT";
    expect(maskInstance.getMaskedValue("12:45")).toLooseEqual("12:45 PM");
    expect(maskInstance.getMaskedValue("05:05")).toLooseEqual("05:05 AM");
    expect(maskInstance.getMaskedValue("22:07")).toLooseEqual("10:07 PM");

    maskInstance.pattern = "hh:MM";
    expect(maskInstance.getMaskedValue("12:45")).toLooseEqual("12:45");
    expect(maskInstance.getMaskedValue("05:05")).toLooseEqual("05:05");
    expect(maskInstance.getMaskedValue("22:07")).toLooseEqual("10:07");
  });

  test("getISO_8601Format getUnmaskedValue", () => {
    const maskInstance = new InputMaskDateTime();

    maskInstance.pattern = "yyyy";
    expect(maskInstance.getUnmaskedValue("2024")).toLooseEqual("2024");

    maskInstance.pattern = "mm/yyyy";
    expect(maskInstance.getUnmaskedValue("09/2024")).toLooseEqual("2024-09");

    maskInstance.pattern = "m/yyyy";
    expect(maskInstance.getUnmaskedValue("9/2024")).toLooseEqual("2024-09");

    maskInstance.pattern = "m/yy";
    expect(maskInstance.getUnmaskedValue("9/24")).toLooseEqual("2024-09");

    maskInstance.pattern = "HH:MM";
    expect(maskInstance.getUnmaskedValue("12:45")).toLooseEqual("12:45");
    expect(maskInstance.getUnmaskedValue("05:05")).toLooseEqual("05:05");

    maskInstance.pattern = "dd/mm/yyyy HH:MM";
    expect(maskInstance.getUnmaskedValue("24/07/1998 12:45")).toLooseEqual("1998-07-24T12:45");
    expect(maskInstance.getUnmaskedValue("24/07/1998 HH:MM")).toLooseEqual("");

    maskInstance.pattern = "hh:MM tt";
    expect(maskInstance.getUnmaskedValue("12:45 pm")).toLooseEqual("12:45");
    expect(maskInstance.getUnmaskedValue("05:05 am")).toLooseEqual("05:05");
    expect(maskInstance.getUnmaskedValue("10:07 pm")).toLooseEqual("22:07");

    maskInstance.pattern = "hh:MM TT";
    expect(maskInstance.getUnmaskedValue("12:45 PM")).toLooseEqual("12:45");
    expect(maskInstance.getUnmaskedValue("05:05 AM")).toLooseEqual("05:05");
    expect(maskInstance.getUnmaskedValue("10:07 PM")).toLooseEqual("22:07");

    maskInstance.pattern = "hh:MM";
    expect(maskInstance.getUnmaskedValue("12:45")).toLooseEqual("12:45");
    expect(maskInstance.getUnmaskedValue("05:05")).toLooseEqual("05:05");
    expect(maskInstance.getUnmaskedValue("10:07")).toLooseEqual("10:07");
  });

  test("get masked date if text with dots mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    expect(maskInstance._getMaskedValue("12.4")).toLooseEqual("12/04/yyyy");
    expect(maskInstance._getMaskedValue("12.34")).toLooseEqual("12/3d/yyyy");
    expect(maskInstance._getMaskedValue("12.30.198")).toLooseEqual("12/30/198y");
    expect(maskInstance._getMaskedValue("12.30.0001")).toLooseEqual("12/30/0001");
    expect(maskInstance._getMaskedValue("12.30.1987")).toLooseEqual("12/30/1987");

  // expect(maskInstance._getMaskedValue("1.4")).toLooseEqual("01/04/yyyy");
  // expect(maskInstance._getMaskedValue("1.34")).toLooseEqual("01/3d/yyyy");
  // expect(maskInstance._getMaskedValue("1.3.198")).toLooseEqual("01/03/198y");
  // expect(maskInstance._getMaskedValue("1.3.0001")).toLooseEqual("01/03/0001");
  // expect(maskInstance._getMaskedValue("1.3.1987")).toLooseEqual("01/03/1987");
  });

  test("get masked date if text with dots m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";

    expect(maskInstance._getMaskedValue("12.4")).toLooseEqual("12/4/yyyy");
    expect(maskInstance._getMaskedValue("12.34")).toLooseEqual("12/3/yyyy");
    expect(maskInstance._getMaskedValue("12.30.198")).toLooseEqual("12/30/198y");
    expect(maskInstance._getMaskedValue("12.30.0001")).toLooseEqual("12/30/0001");
    expect(maskInstance._getMaskedValue("12.30.1987")).toLooseEqual("12/30/1987");

    expect(maskInstance._getMaskedValue("1.4")).toLooseEqual("1/4/yyyy");
    expect(maskInstance._getMaskedValue("1.34")).toLooseEqual("1/3/yyyy");
    expect(maskInstance._getMaskedValue("1.3.198")).toLooseEqual("1/3/198y");
    expect(maskInstance._getMaskedValue("1.3.0001")).toLooseEqual("1/3/0001");
    expect(maskInstance._getMaskedValue("1.3.1987")).toLooseEqual("1/3/1987");
  });

  test("get masked date if set min & max mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "2024-04-01";
    maskInstance.max = "2024-05-01";

    expect(maskInstance._getMaskedValue("05/3", false)).toLooseEqual("05/");
    expect(maskInstance._getMaskedValue("05/3", false)).toLooseEqual("05/");
  });

  test("get unmasked valid date text mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    expect(maskInstance.getUnmaskedValue("mm/dd/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("1m/dd/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("01/dd/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("02/dd/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("12/04/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("12/3d/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("12/30/198y")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("12/30/0001")).toLooseEqual("0001-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/1987")).toLooseEqual("1987-12-30");
    expect(maskInstance.getUnmaskedValue("01/03/1987")).toLooseEqual("1987-01-03");
  });

  test("get input value onBlur mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    const input = "01/01/1970";
    const unmaskedValue = maskInstance.getUnmaskedValue(input);
    expect(unmaskedValue, "unmaskedValue").toLooseEqual("1970-01-01");

    const maskedValue = maskInstance.getMaskedValue(unmaskedValue);
    expect(maskedValue, "").toLooseEqual(input);
  });

  test("get masked valid date text m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";
    expect(maskInstance.getUnmaskedValue("m/d/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("1/d/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("1/d/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("2/d/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("1/4/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("1/3/yyyy")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("1/3/198y")).toLooseEqual("");
    expect(maskInstance.getUnmaskedValue("12/30/0001")).toLooseEqual("0001-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/1987")).toLooseEqual("1987-12-30");
    expect(maskInstance.getUnmaskedValue("1/3/1987")).toLooseEqual("1987-01-03");
  });

  test("_getMaskedValue matchWholeMask m/d/yy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yy";

    expect(maskInstance.getUnmaskedValue("8/5/91")).toLooseEqual("1991-08-05");
    expect(maskInstance.getUnmaskedValue("1/3/69")).toLooseEqual("1969-01-03");
    expect(maskInstance.getUnmaskedValue("12/30/68")).toLooseEqual("2068-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/01")).toLooseEqual("2001-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/00")).toLooseEqual("2000-12-30");
  });

  test("_getMaskedValue with max m/d/yy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yy";
    maskInstance.min = "1950-05-30";
    maskInstance.max = "2024-02-27";

    expect(maskInstance.getUnmaskedValue("12/30/01")).toLooseEqual("2001-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/00")).toLooseEqual("2000-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/24")).toLooseEqual("2024-12-30");
    expect(maskInstance.getUnmaskedValue("1/3/69")).toLooseEqual("1969-01-03");
    expect(maskInstance.getUnmaskedValue("12/30/68")).toLooseEqual("1968-12-30");
    expect(maskInstance.getUnmaskedValue("8/5/91")).toLooseEqual("1991-08-05");
    expect(maskInstance.getUnmaskedValue("8/5/50")).toLooseEqual("1950-08-05");
  });

  test("dateTime processInput serial input: insert characters", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type #1").toLooseEqual("1m/dd/yyyy");
    expect(result.caretPosition, "type #1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("12/dd/yyyy");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 5").toLooseEqual("1m/dd/yyyy");
    expect(result.caretPosition, "try type 5").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "12/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 3").toLooseEqual("12/3d/yyyy");
    expect(result.caretPosition, "type 3").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "7", selectionStart: 4, selectionEnd: 4, prevValue: "12/3d/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 7").toLooseEqual("12/3d/yyyy");
    expect(result.caretPosition, "try type 7").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "12/3d/yyyy", inputDirection: "forward" });
    expect(result.value, "type 0").toLooseEqual("12/30/yyyy");
    expect(result.caretPosition, "type 0").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "12/30/yyyy", inputDirection: "forward" });
    expect(result.value, "type year").toLooseEqual("12/30/2yyy");
    expect(result.caretPosition, "type year").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 9, selectionEnd: 9, prevValue: "12/30/202y", inputDirection: "forward" });
    expect(result.value, "type 2024").toLooseEqual("12/30/2024");
    expect(result.caretPosition, "type 2024").toLooseEqual(10);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 10, selectionEnd: 10, prevValue: "12/30/2024", inputDirection: "forward" });
    expect(result.value, "type 0 2024").toLooseEqual("12/30/2024");
    expect(result.caretPosition, "type 0 2024").toLooseEqual(10);
  });

  test("dateTime processInput serial input: insert characters v2", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    let result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "04/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type #1").toLooseEqual("04/3d/yyyy");
    expect(result.caretPosition, "type #1").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "02/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type #2").toLooseEqual("02/03/yyyy");
    expect(result.caretPosition, "type #2").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 3, selectionEnd: 3, prevValue: "02/0d/yyyy", inputDirection: "forward" });
    expect(result.value, "type #3").toLooseEqual("02/05/yyyy");
    expect(result.caretPosition, "type #3").toLooseEqual(6);
  });

  test("dateTime processInput serial input: insert characters m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "m/d/yyyy", inputDirection: "forward" });
    expect(result.value, "type #1").toLooseEqual("1/d/yyyy");
    expect(result.caretPosition, "type #1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1/d/yyyy", inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("12/d/yyyy");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "1m/d/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 5").toLooseEqual("1/d/yyyy");
    expect(result.caretPosition, "try type 5").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "12/d/yyyy", inputDirection: "forward" });
    expect(result.value, "type 3").toLooseEqual("12/3/yyyy");
    expect(result.caretPosition, "type 3").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "7", selectionStart: 4, selectionEnd: 4, prevValue: "12/3/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 7").toLooseEqual("12/3/yyyy");
    expect(result.caretPosition, "try type 7").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "12/3/yyyy", inputDirection: "forward" });
    expect(result.value, "type 0").toLooseEqual("12/30/yyyy");
    expect(result.caretPosition, "type 0").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "12/30/yyyy", inputDirection: "forward" });
    expect(result.value, "type year").toLooseEqual("12/30/2yyy");
    expect(result.caretPosition, "type year").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 9, selectionEnd: 9, prevValue: "12/30/202y", inputDirection: "forward" });
    expect(result.value, "type 2024").toLooseEqual("12/30/2024");
    expect(result.caretPosition, "type 2024").toLooseEqual(10);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 10, selectionEnd: 10, prevValue: "12/30/2024", inputDirection: "forward" });
    expect(result.value, "type 0 2024").toLooseEqual("12/30/2024");
    expect(result.caretPosition, "type 0 2024").toLooseEqual(10);
  });

  test("dateTime processInput: insert characters mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    let result = maskInstance.processInput({ insertedChars: "4", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 4").toLooseEqual("04/dd/yyyy");
    expect(result.caretPosition, "type 4").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 3, selectionEnd: 3, prevValue: "04/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 5").toLooseEqual("04/05/yyyy");
    expect(result.caretPosition, "type 5").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/000y", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("04/05/0001");
    expect(result.caretPosition, "type 1").toLooseEqual(10);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 4, selectionEnd: 4, prevValue: "01/3d/1991", inputDirection: "forward" });
    expect(result.value, "try type 4").toLooseEqual("01/3d/1991");
    expect(result.caretPosition, "try type 4").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 1, selectionEnd: 1, prevValue: "1m/30/1991", inputDirection: "forward" });
    expect(result.value, "try type 3").toLooseEqual("1m/30/1991");
    expect(result.caretPosition, "try type 3").toLooseEqual(1);
  });

  test("dateTime processInput: insert characters m/d/yy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yy";
    let result = maskInstance.processInput({ insertedChars: "4", selectionStart: 0, selectionEnd: 0, prevValue: "m/d/yy", inputDirection: "forward" });
    expect(result.value, "type 4").toLooseEqual("4/d/yy");
    expect(result.caretPosition, "type 4").toLooseEqual(2);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 2, selectionEnd: 2, prevValue: "4/d/yy", inputDirection: "forward" });
    expect(result.value, "type 5").toLooseEqual("4/5/yy");
    expect(result.caretPosition, "type 5").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 4, selectionEnd: 4, prevValue: "4/5/yy", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("4/5/1y");
    expect(result.caretPosition, "type 1").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "m/d/yy", inputDirection: "forward" });
    expect(result.value, "try type 0 into month").toLooseEqual("m/d/yy");
    expect(result.caretPosition, "try type 0 into month").toLooseEqual(0);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 2, selectionEnd: 2, prevValue: "1/d/yy", inputDirection: "forward" });
    expect(result.value, "try type 0 into day").toLooseEqual("1/d/yy");
    expect(result.caretPosition, "try type 0 into day").toLooseEqual(2);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "10/d/yy", inputDirection: "forward" });
    expect(result.value, "try type 0 into day").toLooseEqual("10/d/yy");
    expect(result.caretPosition, "try type 0 into day").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 5, selectionEnd: 5, prevValue: "4/5/1y", inputDirection: "forward" });
    expect(result.value, "type 3").toLooseEqual("4/5/13");
    expect(result.caretPosition, "type 3").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 6, selectionEnd: 6, prevValue: "4/5/13", inputDirection: "forward" });
    expect(result.value, "try type 8").toLooseEqual("4/5/13");
    expect(result.caretPosition, "try type 8").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "1/3/91", inputDirection: "forward" });
    expect(result.value, "try type 4").toLooseEqual("1/3/91");
    expect(result.caretPosition, "try type 4").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 1, selectionEnd: 1, prevValue: "1/30/91", inputDirection: "forward" });
    expect(result.value, "try type 3").toLooseEqual("1/30/91");
    expect(result.caretPosition, "try type 3").toLooseEqual(1);
  });

  test("dateTime processInput: delete characters by backspace", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    let result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 9, selectionEnd: 10, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 4").toLooseEqual("04/05/202y");
    expect(result.caretPosition, "delete 4").toLooseEqual(9);

    result = maskInstance.processInput({ prevValue: "04/05/yyyy", selectionStart: 5, selectionEnd: 6, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "try delete /").toLooseEqual("04/05/yyyy");
    expect(result.caretPosition, "try delete /").toLooseEqual(5);

    result = maskInstance.processInput({ prevValue: "04/05/yyyy", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 5").toLooseEqual("04/0d/yyyy");
    expect(result.caretPosition, "delete 5").toLooseEqual(4);

    result = maskInstance.processInput({ prevValue: "04/0d/yyyy", selectionStart: 3, selectionEnd: 4, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 0").toLooseEqual("04/dd/yyyy");
    expect(result.caretPosition, "delete 0").toLooseEqual(3);

    result = maskInstance.processInput({ prevValue: "04/dd/yyyy", selectionStart: 2, selectionEnd: 3, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "try delete /").toLooseEqual("04/dd/yyyy");
    expect(result.caretPosition, "try delete /").toLooseEqual(2);

    result = maskInstance.processInput({ prevValue: "04/dd/yyyy", selectionStart: 1, selectionEnd: 2, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 4").toLooseEqual("0m/dd/yyyy");
    expect(result.caretPosition, "delete 4").toLooseEqual(1);

    result = maskInstance.processInput({ prevValue: "0m/dd/yyyy", selectionStart: 0, selectionEnd: 1, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 0").toLooseEqual("mm/dd/yyyy");
    expect(result.caretPosition, "delete 0").toLooseEqual(0);

    result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete first character").toLooseEqual("mm/dd/yyyy");
    expect(result.caretPosition, "delete first character").toLooseEqual(0);
  });

  test("dateTime processInput: editing by delete characters by backspace", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    let result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 1, selectionEnd: 2, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 4").toLooseEqual("0m/05/2024");
    expect(result.caretPosition, "delete 4").toLooseEqual(1);

    result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 1, selectionEnd: 2, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 5").toLooseEqual("0m/12/2024");
    expect(result.caretPosition, "delete 5").toLooseEqual(1);
    result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 5").toLooseEqual("04/0d/2024");
    expect(result.caretPosition, "delete 5").toLooseEqual(4);

    result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 2").toLooseEqual("05/1d/2024");
    expect(result.caretPosition, "delete 2").toLooseEqual(4);

    result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 3, selectionEnd: 4, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 1").toLooseEqual("05/2d/2024");
    expect(result.caretPosition, "delete 1").toLooseEqual(3);

    result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 7, selectionEnd: 8, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 0").toLooseEqual("05/12/224y");
    expect(result.caretPosition, "delete 0").toLooseEqual(7);
  });

  test("dateTime processInput: delete characters by backspace m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";
    let result = maskInstance.processInput({ prevValue: "2/d/yyyy", selectionStart: 0, selectionEnd: 1, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 2").toLooseEqual("m/d/yyyy");
    expect(result.caretPosition, "delete 2").toLooseEqual(0);
  });

  test("dateTime processInput: copy/paste", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    let result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "05/12/2024", inputDirection: "backward" });
    expect(result.value, "insert new value 05/12/2024").toLooseEqual("05/12/2024");
    expect(result.caretPosition, "insert new value 05/12/2024").toLooseEqual(10);

    result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "5/12/2024", inputDirection: "backward" });
    expect(result.value, "insert new value 5/12/2024").toLooseEqual("05/12/2024");
    expect(result.caretPosition, "insert new value 5/12/2024").toLooseEqual(10);

    // result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "5/1/2024", inputDirection: "backward" });
    // expect(result.value, "insert new value 5/1/2024").toLooseEqual("05/01/2024");
    // expect(result.caretPosition, "insert new value 5/1/2024").toLooseEqual(10);

    result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "10.28.1996", inputDirection: "backward" });
    expect(result.value, "empty value & insert new value 10.28.1996").toLooseEqual("10/28/1996");
    expect(result.caretPosition, "empty value & insert new value 10.28.1996").toLooseEqual(10);

    result = maskInstance.processInput({ prevValue: "5/12/2024", selectionStart: 0, selectionEnd: 0, insertedChars: "108", inputDirection: "backward" });
    expect(result.value, "insert 108").toLooseEqual("10/12/2024");
    expect(result.caretPosition, "insert 108").toLooseEqual(3);

    result = maskInstance.processInput({ prevValue: "5/12/2024", selectionStart: 0, selectionEnd: 0, insertedChars: "10.28.1996", inputDirection: "backward" });
    expect(result.value, "insert new value 10.28.1996").toLooseEqual("10/28/1996");
    expect(result.caretPosition, "insert new value 10.28.1996").toLooseEqual(10);
  });

  test("dateTime process: cursor position", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    let result = maskInstance.processInput({ insertedChars: "2", prevValue: "07/1d/yyyy", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "insert 2").toLooseEqual("07/1d/2yyy");
    expect(result.caretPosition, "insert 2").toLooseEqual(7);
  });

  test("dateTime processInput: min for datetime", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy HH:MM";
    maskInstance.min = "05/04/1982 09:15";
    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 9, selectionEnd: 9, prevValue: "05/04/198y HH:MM", inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("05/04/1982 HH:MM");
    expect(result.caretPosition, "type 2").toLooseEqual(11);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 11, selectionEnd: 11, prevValue: "05/04/1982 HH:MM", inputDirection: "forward" });
    expect(result.value, "try type 8").toLooseEqual("05/04/1982 HH:MM");
    expect(result.caretPosition, "try type 8").toLooseEqual(11);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 11, selectionEnd: 11, prevValue: "05/04/1982 HH:MM", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("05/04/1982 1H:MM");
    expect(result.caretPosition, "type 1").toLooseEqual(12);
  });

  test("dateTime processInput: min for time", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "HH:MM";
    maskInstance.min = "09:15";

    let result = maskInstance.processInput({ insertedChars: "8", selectionStart: 0, selectionEnd: 0, prevValue: "HH:MM", inputDirection: "forward" });
    expect(result.value, "try type 8").toLooseEqual("HH:MM");
    expect(result.caretPosition, "try type 8").toLooseEqual(0);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "HH:MM", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1H:MM");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1H:MM", inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("12:MM");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 3, selectionEnd: 3, prevValue: "12:MM", inputDirection: "forward" });
    expect(result.value, "type 8").toLooseEqual("12:08");
    expect(result.caretPosition, "type 8").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 3, selectionEnd: 3, prevValue: "09:MM", inputDirection: "forward" });
    expect(result.value, "try type 8").toLooseEqual("09:MM");
    expect(result.caretPosition, "try type 8").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "09:MM", inputDirection: "forward" });
    expect(result.value, "type 3").toLooseEqual("09:3M");
    expect(result.caretPosition, "type 3").toLooseEqual(4);
  });

  test("dateTime processInput: min & max for time", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "HH:MM";
    maskInstance.min = "09:15";
    maskInstance.max = "17:45";

    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "HH:MM", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1H:MM");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "9", selectionStart: 1, selectionEnd: 1, prevValue: "1H:MM", inputDirection: "forward" });
    expect(result.value, "try type 9").toLooseEqual("1H:MM");
    expect(result.caretPosition, "try type 9").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "7", selectionStart: 1, selectionEnd: 1, prevValue: "1H:MM", inputDirection: "forward" });
    expect(result.value, "type 7").toLooseEqual("17:MM");
    expect(result.caretPosition, "type 7").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 3, selectionEnd: 3, prevValue: "17:MM", inputDirection: "forward" });
    expect(result.value, "type 5").toLooseEqual("17:05");
    expect(result.caretPosition, "type 5").toLooseEqual(5);
  });

  test("dateTime processInput: min & max for 12-hour time", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM tt";
    maskInstance.min = "08:00";
    maskInstance.max = "18:00";

    let result = maskInstance.processInput({ insertedChars: "7", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "try type 7").toLooseEqual("hh:MM tt");
    expect(result.caretPosition, "try type 7").toLooseEqual(0);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1h:MM tt");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 1, selectionEnd: 1, prevValue: "1h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 0").toLooseEqual("10:MM tt");
    expect(result.caretPosition, "type 0").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toLooseEqual("10:00 tt");
    expect(result.caretPosition, "type p").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toLooseEqual("10:00 at");
    expect(result.caretPosition, "type a").toLooseEqual(7);

    maskInstance.min = "13:00";
    maskInstance.max = "17:00";
    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("01:MM tt");
    expect(result.caretPosition, "type 1").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 6").toLooseEqual("hh:MM tt");
    expect(result.caretPosition, "type 6").toLooseEqual(0);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 0").toLooseEqual("0h:MM tt");
    expect(result.caretPosition, "type 0").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "05:0M tt", inputDirection: "forward" });
    expect(result.value, "type second 0").toLooseEqual("05:00 tt");
    expect(result.caretPosition, "type second  0").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toLooseEqual("05:00 tt");
    expect(result.caretPosition, "type a").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toLooseEqual("05:00 pt");
    expect(result.caretPosition, "type p").toLooseEqual(7);

    maskInstance.min = "01:00";
    maskInstance.max = "05:00";
    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("01:MM tt");
    expect(result.caretPosition, "type 1").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 6").toLooseEqual("hh:MM tt");
    expect(result.caretPosition, "type 6").toLooseEqual(0);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 0").toLooseEqual("0h:MM tt");
    expect(result.caretPosition, "type 0").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "05:0M tt", inputDirection: "forward" });
    expect(result.value, "type second 0").toLooseEqual("05:00 tt");
    expect(result.caretPosition, "type second  0").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toLooseEqual("05:00 at");
    expect(result.caretPosition, "type a").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toLooseEqual("05:00 tt");
    expect(result.caretPosition, "type p").toLooseEqual(6);
  });

  test("dateTime processInput: min & max for 12-hour time - h", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "h:MM tt";
    maskInstance.min = "08:00";
    maskInstance.max = "18:00";

    let result = maskInstance.processInput({ insertedChars: "7", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "try type 7").toLooseEqual("h:MM tt");
    expect(result.caretPosition, "try type 7").toLooseEqual(0);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1:MM tt");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "9", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("9:MM tt");
    expect(result.caretPosition, "type 1").toLooseEqual(2);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 1, selectionEnd: 1, prevValue: "1:MM tt", inputDirection: "forward" });
    expect(result.value, "type 0").toLooseEqual("10:MM tt");
    expect(result.caretPosition, "type 0").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toLooseEqual("10:00 tt");
    expect(result.caretPosition, "type p").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toLooseEqual("10:00 at");
    expect(result.caretPosition, "type a").toLooseEqual(7);

    maskInstance.min = "13:00";
    maskInstance.max = "17:00";
    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1:MM tt");
    expect(result.caretPosition, "type 1").toLooseEqual(2);

    result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 6").toLooseEqual("h:MM tt");
    expect(result.caretPosition, "type 6").toLooseEqual(0);

    // result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    // expect(result.value, "try type 0").toLooseEqual("h:MM tt");
    // expect(result.caretPosition, "try type 0").toLooseEqual(0);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "5:0M tt", inputDirection: "forward" });
    expect(result.value, "type second 0").toLooseEqual("5:00 tt");
    expect(result.caretPosition, "type second  0").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 5, selectionEnd: 5, prevValue: "5:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toLooseEqual("5:00 tt");
    expect(result.caretPosition, "type a").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 5, selectionEnd: 5, prevValue: "5:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toLooseEqual("5:00 pt");
    expect(result.caretPosition, "type p").toLooseEqual(6);

    maskInstance.min = "01:00";
    maskInstance.max = "05:00";
    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1:MM tt");
    expect(result.caretPosition, "type 1").toLooseEqual(2);

    result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 6").toLooseEqual("h:MM tt");
    expect(result.caretPosition, "type 6").toLooseEqual(0);

    // result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    // expect(result.value, "type 0").toLooseEqual("h:MM tt");
    // expect(result.caretPosition, "type 0").toLooseEqual(0);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "5:0M tt", inputDirection: "forward" });
    expect(result.value, "type second 0").toLooseEqual("5:00 tt");
    expect(result.caretPosition, "type second  0").toLooseEqual(5);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 5, selectionEnd: 5, prevValue: "5:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toLooseEqual("5:00 at");
    expect(result.caretPosition, "type a").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 5, selectionEnd: 5, prevValue: "05:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toLooseEqual("5:00 tt");
    expect(result.caretPosition, "type p").toLooseEqual(5);
  });

  test("dateTime processInput: min for date", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "1972-02-01";
    let result = maskInstance.processInput({ insertedChars: "0", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 0").toLooseEqual("04/05/yyyy");
    expect(result.caretPosition, "try type 0").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("04/05/1yyy");
    expect(result.caretPosition, "type 1").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
    expect(result.value, "try type 1").toLooseEqual("04/05/197y");
    expect(result.caretPosition, "try type 1").toLooseEqual(9);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("04/05/1972");
    expect(result.caretPosition, "type 2").toLooseEqual(10);
  });

  test("dateTime processInput: max", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.max = "1972-02-01";
    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 2").toLooseEqual("04/05/yyyy");
    expect(result.caretPosition, "try type 2").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("04/05/1yyy");
    expect(result.caretPosition, "type 1").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
    expect(result.value, "try type 3").toLooseEqual("04/05/197y");
    expect(result.caretPosition, "try type 3").toLooseEqual(9);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("04/05/1971");
    expect(result.caretPosition, "type 1").toLooseEqual(10);
  });

  test("dateTime processInput: min & max", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "1960-01-01";
    maskInstance.max = "1980-12-31";
    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 2").toLooseEqual("04/05/yyyy");
    expect(result.caretPosition, "try type 2").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("04/05/1yyy");
    expect(result.caretPosition, "type 1").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "9", selectionStart: 8, selectionEnd: 8, prevValue: "04/05/19yy", inputDirection: "forward" });
    expect(result.value, "try type 9").toLooseEqual("04/05/19yy");
    expect(result.caretPosition, "try type 9").toLooseEqual(8);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 8, selectionEnd: 8, prevValue: "04/05/19yy", inputDirection: "forward" });
    expect(result.value, "type 8").toLooseEqual("04/05/198y");
    expect(result.caretPosition, "type 8").toLooseEqual(9);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/198y", inputDirection: "forward" });
    expect(result.value, "try type 1").toLooseEqual("04/05/198y");
    expect(result.caretPosition, "try type 1").toLooseEqual(9);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/198y", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("04/05/1980");
    expect(result.caretPosition, "type 1").toLooseEqual(10);
  });

  test("dateTime processInput: min & max medium range mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "2023-11-13";
    maskInstance.max = "2024-12-13";
    let result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 0").toLooseEqual("0m/dd/yyyy");
    expect(result.caretPosition, "type 0").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "0m/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 5").toLooseEqual("05/dd/yyyy");
    expect(result.caretPosition, "type 5").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 2").toLooseEqual("02/dd/yyyy");
    expect(result.caretPosition, "try type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1m/dd/yyyy");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("12/dd/yyyy");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 9, selectionEnd: 9, prevValue: "05/12/202y", inputDirection: "forward" });
    expect(result.value, "type 4").toLooseEqual("05/12/2024");
    expect(result.caretPosition, "type 4").toLooseEqual(10);
  });

  test("dateTime processInput: min & max medium range mm/dd/yy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yy";
    maskInstance.min = "2023-11-13";
    maskInstance.max = "2024-12-13";
    let result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yy", inputDirection: "forward" });
    expect(result.value, "type 0").toLooseEqual("0m/dd/yy");
    expect(result.caretPosition, "type 0").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "0m/dd/yy", inputDirection: "forward" });
    expect(result.value, "type 5").toLooseEqual("05/dd/yy");
    expect(result.caretPosition, "type 5").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yy", inputDirection: "forward" });
    expect(result.value, "try type 2").toLooseEqual("02/dd/yy");
    expect(result.caretPosition, "try type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yy", inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1m/dd/yy");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yy", inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("12/dd/yy");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 7, selectionEnd: 7, prevValue: "05/12/2y", inputDirection: "forward" });
    expect(result.value, "type 4").toLooseEqual("05/12/24");
    expect(result.caretPosition, "type 4").toLooseEqual(8);
  });

  test("dateTime processInput: min & max medium range leap year YYYY", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "2023-11-13";
    maskInstance.max = "2025-12-13";
    let result = maskInstance.processInput({ insertedChars: "9", selectionStart: 4, selectionEnd: 4, prevValue: "02/2d/yy", inputDirection: "forward" });
    expect(result.value, "type 9").toLooseEqual("02/29/yyyy");
    expect(result.caretPosition, "type 9").toLooseEqual(6);
  });

  test("dateTime processInput: min & max medium range leap year YY", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yy";
    maskInstance.min = "2023-11-13";
    maskInstance.max = "2025-12-13";
    let result = maskInstance.processInput({ insertedChars: "9", selectionStart: 4, selectionEnd: 4, prevValue: "02/2d/yy", inputDirection: "forward" });
    expect(result.value, "type 9").toLooseEqual("02/29/yy");
    expect(result.caretPosition, "type 9").toLooseEqual(6);
  });

  test("dateTime processInput: min & max small range", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "2024-04-01";
    maskInstance.max = "2024-05-01";

    let result = maskInstance.processInput({ insertedChars: "8", prevValue: "05/dd/yyyy", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "try type 8").toLooseEqual("05/dd/yyyy");
    expect(result.caretPosition, "try type 8").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "3", prevValue: "05/dd/yyyy", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "try type 3").toLooseEqual("05/dd/yyyy");
    expect(result.caretPosition, "try type 3").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "05/dd/yyyy", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("05/01/yyyy");
    expect(result.caretPosition, "type 1").toLooseEqual(6);
  });

  test("dateTime processInput: min & max 1 year range mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "2023-01-13";
    maskInstance.max = "2024-01-13";
    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yy", inputDirection: "forward" });
    expect(result.value, "type 0").toLooseEqual("02/dd/yyyy");
    expect(result.caretPosition, "type 0").toLooseEqual(3);
  });

  test("dateTime processInput: time", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "HH:MM";

    let result = maskInstance.processInput({ insertedChars: "1", prevValue: "HH:MM", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1H:MM");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "2", prevValue: "1H:MM", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("12:MM");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 4").toLooseEqual("12:4M");
    expect(result.caretPosition, "type 4").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "5", prevValue: "12:4M", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
    expect(result.value, "type 5").toLooseEqual("12:45");
    expect(result.caretPosition, "type 5").toLooseEqual(5);
  });

  test("dateTime processInput: time - H", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "H:MM";

    let result = maskInstance.processInput({ insertedChars: "1", prevValue: "H:MM", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1:MM");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "2", prevValue: "1:MM", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("12:MM");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 4").toLooseEqual("12:4M");
    expect(result.caretPosition, "type 4").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "5", prevValue: "12:4M", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
    expect(result.value, "type 5").toLooseEqual("12:45");
    expect(result.caretPosition, "type 5").toLooseEqual(5);
  });

  test("dateTime processInput: time 12 hours", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM TT";

    let result = maskInstance.processInput({ insertedChars: "2", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("02:MM TT");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1h:MM TT");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "3", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 3").toLooseEqual("1h:MM TT");
    expect(result.caretPosition, "type 3").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "2", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("12:MM TT");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM TT", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 4").toLooseEqual("12:4M TT");
    expect(result.caretPosition, "type 4").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "5", prevValue: "12:4M TT", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
    expect(result.value, "type 5").toLooseEqual("12:45 TT");
    expect(result.caretPosition, "type 5").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "X", prevValue: "12:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "try type X").toLooseEqual("12:45 TT");
    expect(result.caretPosition, "try type X").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "p", prevValue: "12:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "type p").toLooseEqual("12:45 PT");
    expect(result.caretPosition, "type p").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "z", prevValue: "12:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "try type z").toLooseEqual("12:45 PT");
    expect(result.caretPosition, "try type z").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "type m").toLooseEqual("12:45 PM");
    expect(result.caretPosition, "type m").toLooseEqual(8);

    maskInstance.pattern = "hh:MM tt";
    result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 pt", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "type m").toLooseEqual("12:45 pm");
    expect(result.caretPosition, "type m").toLooseEqual(8);
  });

  test("dateTime processInput: time 12 hours - a/p", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM T";

    let result = maskInstance.processInput({ insertedChars: "2", prevValue: "hh:MM T", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("02:MM T");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "hh:MM T", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1h:MM T");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "X", prevValue: "12:45 T", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "try type X").toLooseEqual("12:45 T");
    expect(result.caretPosition, "try type X").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "p", prevValue: "12:45 T", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "type p").toLooseEqual("12:45 P");
    expect(result.caretPosition, "type p").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "z", prevValue: "12:45 P", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "try type z").toLooseEqual("12:45 P");
    expect(result.caretPosition, "try type z").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 P", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "try type m").toLooseEqual("12:45 P");
    expect(result.caretPosition, "try type m").toLooseEqual(7);

    maskInstance.pattern = "hh:MM t";
    result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 p", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "try type m #2").toLooseEqual("12:45 p");
    expect(result.caretPosition, "try type m #2").toLooseEqual(7);
  });

  test("dateTime processInput: time 12 hours - h", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "h:MM TT";

    let result = maskInstance.processInput({ insertedChars: "2", prevValue: "h:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("2:MM TT");
    expect(result.caretPosition, "type 2").toLooseEqual(2);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "h:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1:MM TT");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "3", prevValue: "1:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 3").toLooseEqual("1:MM TT");
    expect(result.caretPosition, "type 3").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "2", prevValue: "1:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("12:MM TT");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM TT", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 4").toLooseEqual("12:4M TT");
    expect(result.caretPosition, "type 4").toLooseEqual(4);
  });

  test("dateTime processInput: time 12 hours v2", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM TT";

    let result = maskInstance.processInput({ insertedChars: "2", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 2").toLooseEqual("02:MM TT");
    expect(result.caretPosition, "type 2").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("1h:MM TT");
    expect(result.caretPosition, "type 1").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "3", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 3").toLooseEqual("1h:MM TT");
    expect(result.caretPosition, "type 3").toLooseEqual(1);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 1").toLooseEqual("11:MM TT");
    expect(result.caretPosition, "type 1").toLooseEqual(3);

    result = maskInstance.processInput({ insertedChars: "4", prevValue: "11:MM TT", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 4").toLooseEqual("11:4M TT");
    expect(result.caretPosition, "type 4").toLooseEqual(4);

    result = maskInstance.processInput({ insertedChars: "5", prevValue: "11:4M TT", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
    expect(result.value, "type 5").toLooseEqual("11:45 TT");
    expect(result.caretPosition, "type 5").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "X", prevValue: "11:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "try type X").toLooseEqual("11:45 TT");
    expect(result.caretPosition, "try type X").toLooseEqual(6);

    result = maskInstance.processInput({ insertedChars: "p", prevValue: "11:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "type p").toLooseEqual("11:45 PT");
    expect(result.caretPosition, "type p").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "z", prevValue: "11:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "try type z").toLooseEqual("11:45 PT");
    expect(result.caretPosition, "try type z").toLooseEqual(7);

    result = maskInstance.processInput({ insertedChars: "m", prevValue: "11:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "type m").toLooseEqual("11:45 PM");
    expect(result.caretPosition, "type m").toLooseEqual(8);

    maskInstance.pattern = "hh:MM tt";
    result = maskInstance.processInput({ insertedChars: "m", prevValue: "11:45 pt", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "type m").toLooseEqual("11:45 pm");
    expect(result.caretPosition, "type m").toLooseEqual(8);
  });

  test("getMaxDateForMonth method", () => {
    const maskInstance = new InputMaskDateTime();
    const getMaxDateForMonth = (maskInstance as any).getMaxDateForMonth.bind(maskInstance);

    // Test regular months
    expect(getMaxDateForMonth(2024, 1), "January has 31 days").toLooseEqual(31);
    expect(getMaxDateForMonth(2024, 3), "March has 31 days").toLooseEqual(31);
    expect(getMaxDateForMonth(2024, 4), "April has 30 days").toLooseEqual(30);
    expect(getMaxDateForMonth(2024, 5), "May has 31 days").toLooseEqual(31);
    expect(getMaxDateForMonth(2024, 6), "June has 30 days").toLooseEqual(30);
    expect(getMaxDateForMonth(2024, 7), "July has 31 days").toLooseEqual(31);
    expect(getMaxDateForMonth(2024, 8), "August has 31 days").toLooseEqual(31);
    expect(getMaxDateForMonth(2024, 9), "September has 30 days").toLooseEqual(30);
    expect(getMaxDateForMonth(2024, 10), "October has 31 days").toLooseEqual(31);
    expect(getMaxDateForMonth(2024, 11), "November has 30 days").toLooseEqual(30);
    expect(getMaxDateForMonth(2024, 12), "December has 31 days").toLooseEqual(31);

    // Test February in different years
    expect(getMaxDateForMonth(2024, 2), "February 2024 (leap year) has 29 days").toLooseEqual(29);
    expect(getMaxDateForMonth(2023, 2), "February 2023 (non-leap year) has 28 days").toLooseEqual(28);
    expect(getMaxDateForMonth(2000, 2), "February 2000 (leap year divisible by 400) has 29 days").toLooseEqual(29);
    expect(getMaxDateForMonth(2100, 2), "February 2100 (non-leap year divisible by 100) has 28 days").toLooseEqual(28);
    expect(getMaxDateForMonth(2020, 2), "February 2020 (leap year) has 29 days").toLooseEqual(29);
    expect(getMaxDateForMonth(2019, 2), "February 2019 (non-leap year) has 28 days").toLooseEqual(28);
  });

  test("Mask datetime with defaultValue includes seconds, #10820", () => {
    function currentDateSecondsMock() {
      return new Date("2024-09-04T12:34:56");
    }
    FunctionFactory.Instance.register("currentDateSecondsMock", currentDateSecondsMock);
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          defaultValueExpression: "currentDateSecondsMock()",
          maskType: "datetime",
          maskSettings: {
            pattern: "mm/dd/yyyy HH:MM:ss"
          }
        },
      ]
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(q1.inputValue).toLooseEqual("09/04/2024 12:34:56");
  });
  test("Mask datetime with defaultValueExpression today() and saveMaskedValue, Bug#11158", () => {
    function todayMock() {
      return new Date(2025, 3, 10);
    }
    FunctionFactory.Instance.register("todayMock", todayMock);
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "date1",
          defaultValueExpression: "todayMock()",
          maskType: "datetime",
          maskSettings: {
            saveMaskedValue: true,
            pattern: "dd.mm.yyyy"
          }
        },
      ]
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("date1");
    expect(q1.inputValue, "inputValue is masked").toLooseEqual("10.04.2025");
    expect(q1.value, "value is saved as masked").toLooseEqual("10.04.2025");
    FunctionFactory.Instance.unregister("todayMock");
  });
  test("Mask datetime with defaultValue and saveMaskedValue, Bug#11195", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "question1",
          defaultValue: "20.04.2026",
          maskType: "datetime",
          maskSettings: {
            saveMaskedValue: true,
            pattern: "dd.mm.yyyy"
          }
        }
      ]
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("question1");
    expect(q1.inputValue, "inputValue is initialized from defaultValue").toLooseEqual("20.04.2026");
    expect(q1.value, "value is initialized from defaultValue").toLooseEqual("20.04.2026");
  });
  test("Age function with datetime mask and saveMaskedValue, #11157", () => {
    const savedOnDateCreated = settings.onDateCreated;
    settings.onDateCreated = (newDate: Date, reason: string, val: any): Date => {
      if (!val) {
        return new Date(2025, 3, 10); // April 10, 2025 as "today"
      }
      return newDate;
    };
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "Date of Birth",
          valueName: "patient_dob",
          maskType: "datetime",
          maskSettings: {
            saveMaskedValue: true,
            pattern: "mm-dd-yyyy"
          }
        },
        {
          type: "expression",
          name: "Age",
          expression: "age({patient_dob})"
        }
      ]
    });
    const dobQuestion = <QuestionTextModel>survey.getQuestionByName("Date of Birth");
    const ageQuestion = survey.getQuestionByName("Age");
    dobQuestion.inputValue = "01-15-1990";
    expect(dobQuestion.value, "DOB value is stored in masked format").toLooseEqual("01-15-1990");
    expect(ageQuestion.value, "Age should be calculated as 35 via inputValue").toLooseEqual(35);
    survey.setValue("patient_dob", "01-15-2000");
    expect(ageQuestion.value, "Age should be calculated as 25 via setValue masked").toLooseEqual(25);
    survey.data = { patient_dob: "01-15-2005" };
    expect(ageQuestion.value, "Age should be calculated as 20 via survey.data masked").toLooseEqual(20);
    survey.data = { patient_dob: "1990-01-15" };
    expect(ageQuestion.value, "Age should be calculated as 35 via survey.data ISO format").toLooseEqual(35);
    settings.onDateCreated = savedOnDateCreated;
  });
});
