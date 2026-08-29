import { FunctionFactory } from "../../src/functionsfactory";
import { JsonObject } from "../../src/jsonobject";
import { InputMaskDateTime, getDateTimeLexems } from "../../src/mask/mask_datetime";
import { QuestionTextModel } from "../../src/question_text";
import { SurveyModel } from "../../src/survey";
import { settings } from "../../src/settings";

import { surveyLocalization } from "../../src/surveyStrings";
import { germanSurveyStrings } from "../../src/localization/german";

import { describe, test, expect, afterEach } from "vitest";
describe("Datetime mask", () => {
  test("Serialize InputMaskDateTime properties", () => {
    const q = new QuestionTextModel("q1");
    const jsonObject = new JsonObject();
    let json = jsonObject.toJsonObject(q);
    expect(json, "empty mask").toEqual({ name: "q1" });

    q.maskType = "datetime";
    json = jsonObject.toJsonObject(q);
    expect(json, "empty datetime").toEqual({ name: "q1", maskType: "datetime" });

    q.maskSettings["pattern"] = "mm/dd/yyyy";
    json = jsonObject.toJsonObject(q);
    expect(json, "set pattern datetime").toEqual({
      name: "q1",
      maskType: "datetime",
      maskSettings: {
        pattern: "mm/dd/yyyy"
      }
    });

    q.maskSettings.saveMaskedValue = true;
    json = jsonObject.toJsonObject(q);
    expect(json, "saveMaskedValue datetime").toEqual({
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
    expect(json, "min & max datetime").toEqual({
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
    expect(q.maskType).toBe("none");
    expect(maskSettings.getType()).toBe("masksettings");

    jsonObject.toObject({ name: "q1", maskType: "datetime" }, q);
    maskSettings = q.maskSettings as InputMaskDateTime;
    expect(q.maskType).toBe("datetime");
    expect(maskSettings.getType(), "datetimemask type").toBe("datetimemask");
    expect(maskSettings.pattern, "datetime pattern").toBeUndefined();
    expect(maskSettings.saveMaskedValue, "datetime saveMaskedValue").toBe(false);
    expect(maskSettings.min, "datetime min").toBeUndefined();
    expect(maskSettings.max, "datetime max").toBeUndefined();

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
    expect(q.maskType).toBe("datetime");
    expect(maskSettings.getType(), "datetimemask type").toBe("datetimemask");
    expect(maskSettings.pattern, "datetime pattern").toBe("mm/dd/yyyy");
    expect(maskSettings.saveMaskedValue, "datetime saveMaskedValue").toBe(true);
    expect(maskSettings.min, "datetime min").toBe("1900-01-01");
    expect(maskSettings.max, "datetime max").toBe("2000-01-01");
  });

  test("getDateTimeLiterals simple pattern", () => {
    let result = getDateTimeLexems("m/d/yy");
    expect(result.length).toBe(5);
    expect(result[0].type).toBe("month");
    expect(result[0].value).toBe("m");
    expect(result[0].count).toBe(1);
    expect(result[1].type).toBe("separator");
    expect(result[1].value).toBe("/");
    expect(result[1].count).toBe(1);
    expect(result[2].type).toBe("day");
    expect(result[2].value).toBe("d");
    expect(result[2].count).toBe(1);
    expect(result[3].type).toBe("separator");
    expect(result[3].value).toBe("/");
    expect(result[3].count).toBe(1);
    expect(result[4].type).toBe("year");
    expect(result[4].value).toBe("y");
    expect(result[4].count).toBe(2);
  });

  test("getDateTimeLiterals simple pattern", () => {
    let result = getDateTimeLexems("mm/dd/yyyy");
    expect(result.length).toBe(5);
    expect(result[0].type).toBe("month");
    expect(result[0].value).toBe("m");
    expect(result[0].count).toBe(2);
    expect(result[1].type).toBe("separator");
    expect(result[1].value).toBe("/");
    expect(result[1].count).toBe(1);
    expect(result[2].type).toBe("day");
    expect(result[2].value).toBe("d");
    expect(result[2].count).toBe(2);
    expect(result[3].type).toBe("separator");
    expect(result[3].value).toBe("/");
    expect(result[3].count).toBe(1);
    expect(result[4].type).toBe("year");
    expect(result[4].value).toBe("y");
    expect(result[4].count).toBe(4);
  });

  test("parseDateTime valid string mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    expect(maskInstance._getMaskedValue("02/14/2024")).toBe("02/14/2024");
    expect(maskInstance._getMaskedValue("2/4/2024")).toBe("02/04/2024");
    expect(maskInstance._getMaskedValue("2")).toBe("02/dd/yyyy");
    expect(maskInstance._getMaskedValue("2/")).toBe("02/dd/yyyy");
    expect(maskInstance._getMaskedValue("2/4")).toBe("02/04/yyyy");
    expect(maskInstance._getMaskedValue("2/4/")).toBe("02/04/yyyy");
    expect(maskInstance._getMaskedValue("m/4/1990")).toBe("mm/04/1990");
    expect(maskInstance._getMaskedValue("/4/1990")).toBe("mm/04/1990");
  });

  test("parseDateTime with validation mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    expect(maskInstance._getMaskedValue("13")).toBe("1m/dd/yyyy");
    expect(maskInstance._getMaskedValue("02/33")).toBe("02/03/yyyy");
    expect(maskInstance._getMaskedValue("03/33")).toBe("03/3d/yyyy");
    expect(maskInstance._getMaskedValue("06/30")).toBe("06/30/yyyy");
    expect(maskInstance._getMaskedValue("06/31")).toBe("06/3d/yyyy");
    expect(maskInstance._getMaskedValue("02/29/2000")).toBe("02/29/2000");
    expect(maskInstance._getMaskedValue("02/29/2001")).toBe("02/29/200y");
  });

  test("DateTime mask mm/dd/yyyy HH:MM", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy HH:MM";

    expect(maskInstance._getMaskedValue("10/24")).toBe("10/24/yyyy HH:MM");
    expect(maskInstance._getMaskedValue("10/24/2023 1")).toBe("10/24/2023 1H:MM");
    expect(maskInstance._getMaskedValue("10/24/2023 9")).toBe("10/24/2023 09:MM");
    expect(maskInstance._getMaskedValue("10/24/2023 13:46")).toBe("10/24/2023 13:46");

    maskInstance.pattern = "mm/dd/yyyy H:MM";
    expect(maskInstance._getMaskedValue("10/24")).toBe("10/24/yyyy H:MM");
    expect(maskInstance._getMaskedValue("10/24/2023 3:")).toBe("10/24/2023 3:MM");
    expect(maskInstance._getMaskedValue("10/24/2023 13:46")).toBe("10/24/2023 13:46");
  });

  test("parseDateTime invalid string mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    expect(maskInstance._getMaskedValue("02a/14/2024")).toBe("02/14/2024");
    expect(maskInstance._getMaskedValue("2/4+/2024")).toBe("02/04/2024");
    expect(maskInstance._getMaskedValue("2+")).toBe("02/dd/yyyy");

    expect(maskInstance._getMaskedValue("11/022/yyyy")).toBe("11/02/yyyy");
  // expect(maskInstance._getMaskedValue("11/002/yyyy")).toBe("11/02/yyyy");
  });

  test("parseDateTime invalid string m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";

    expect(maskInstance._getMaskedValue("2/d/yyyy")).toBe("2/d/yyyy");
    expect(maskInstance._getMaskedValue("/d/yyyy")).toBe("m/d/yyyy");
    expect(maskInstance._getMaskedValue("0m/d/yyyy")).toBe("m/d/yyyy");
    expect(maskInstance._getMaskedValue("10/0d/yyyy")).toBe("10/d/yyyy");
    expect(maskInstance._getMaskedValue("/5/1990")).toBe("m/5/1990");
    expect(maskInstance._getMaskedValue("12//1990")).toBe("12/d/1990");
  });

  test("_getMaskedValue matchWholeMask is false m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";

    expect(maskInstance._getMaskedValue("0", false)).toBe("");
    expect(maskInstance._getMaskedValue("1", false)).toBe("1");
    expect(maskInstance._getMaskedValue("2", false)).toBe("2/");
    expect(maskInstance._getMaskedValue("12", false)).toBe("12/");
    expect(maskInstance._getMaskedValue("5/0", false)).toBe("5/");
    expect(maskInstance._getMaskedValue("1/0", false)).toBe("1/");
    expect(maskInstance._getMaskedValue("10/0", false)).toBe("10/");
    expect(maskInstance._getMaskedValue("3/1", false)).toBe("3/1");
    expect(maskInstance._getMaskedValue("3/17", false)).toBe("3/17/");
    expect(maskInstance._getMaskedValue("3/4", false)).toBe("3/4/");
    expect(maskInstance._getMaskedValue("10/4", false)).toBe("10/4/");
  });

  test("_getMaskedValue matchWholeMask is false mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    expect(maskInstance._getMaskedValue("07/1d/2", false)).toBe("07/1d/2");
    expect(maskInstance._getMaskedValue("07/dd/2", false)).toBe("07/dd/2");
  });

  test("get getMaskedValue value from ISO mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    expect(maskInstance.getMaskedValue("2024-12-05")).toBe("12/05/2024");
    expect(maskInstance.getMaskedValue("2024-13-05")).toBe("mm/dd/yyyy");
  });

  test("get getMaskedValue value from ISO m/d/yy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yy";
    expect(maskInstance.getMaskedValue("2024-12-05")).toBe("12/5/24");
    expect(maskInstance.getMaskedValue("1988-01-05")).toBe("1/5/88");
    expect(maskInstance.getMaskedValue("2024-13-05")).toBe("m/d/yy");
  });

  test("get getMaskedValue value from ISO", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "yyyy";
    expect(maskInstance.getMaskedValue("2024")).toBe("2024");

    maskInstance.pattern = "mm/yyyy";
    expect(maskInstance.getMaskedValue("2024-09")).toBe("09/2024");

    maskInstance.pattern = "m/yyyy";
    expect(maskInstance.getMaskedValue("2024-09")).toBe("9/2024");

    maskInstance.pattern = "m/yy";
    expect(maskInstance.getMaskedValue("2024-09")).toBe("9/24");

    maskInstance.pattern = "HH:MM";
    expect(maskInstance.getMaskedValue("12:45")).toBe("12:45");
    expect(maskInstance.getMaskedValue("05:05")).toBe("05:05");

    maskInstance.pattern = "hh:MM tt";
    expect(maskInstance.getMaskedValue("12:45")).toBe("12:45 pm");
    expect(maskInstance.getMaskedValue("05:05")).toBe("05:05 am");
    expect(maskInstance.getMaskedValue("22:07")).toBe("10:07 pm");

    maskInstance.pattern = "hh:MM TT";
    expect(maskInstance.getMaskedValue("12:45")).toBe("12:45 PM");
    expect(maskInstance.getMaskedValue("05:05")).toBe("05:05 AM");
    expect(maskInstance.getMaskedValue("22:07")).toBe("10:07 PM");

    maskInstance.pattern = "hh:MM";
    expect(maskInstance.getMaskedValue("12:45")).toBe("12:45");
    expect(maskInstance.getMaskedValue("05:05")).toBe("05:05");
    expect(maskInstance.getMaskedValue("22:07")).toBe("10:07");
  });

  test("getISO_8601Format getUnmaskedValue", () => {
    const maskInstance = new InputMaskDateTime();

    maskInstance.pattern = "yyyy";
    expect(maskInstance.getUnmaskedValue("2024")).toBe("2024");

    maskInstance.pattern = "mm/yyyy";
    expect(maskInstance.getUnmaskedValue("09/2024")).toBe("2024-09");

    maskInstance.pattern = "m/yyyy";
    expect(maskInstance.getUnmaskedValue("9/2024")).toBe("2024-09");

    maskInstance.pattern = "m/yy";
    expect(maskInstance.getUnmaskedValue("9/24")).toBe("2024-09");

    maskInstance.pattern = "HH:MM";
    expect(maskInstance.getUnmaskedValue("12:45")).toBe("12:45");
    expect(maskInstance.getUnmaskedValue("05:05")).toBe("05:05");

    maskInstance.pattern = "dd/mm/yyyy HH:MM";
    expect(maskInstance.getUnmaskedValue("24/07/1998 12:45")).toBe("1998-07-24T12:45");
    expect(maskInstance.getUnmaskedValue("24/07/1998 HH:MM")).toBe("");

    maskInstance.pattern = "hh:MM tt";
    expect(maskInstance.getUnmaskedValue("12:45 pm")).toBe("12:45");
    expect(maskInstance.getUnmaskedValue("05:05 am")).toBe("05:05");
    expect(maskInstance.getUnmaskedValue("10:07 pm")).toBe("22:07");

    maskInstance.pattern = "hh:MM TT";
    expect(maskInstance.getUnmaskedValue("12:45 PM")).toBe("12:45");
    expect(maskInstance.getUnmaskedValue("05:05 AM")).toBe("05:05");
    expect(maskInstance.getUnmaskedValue("10:07 PM")).toBe("22:07");

    maskInstance.pattern = "hh:MM";
    expect(maskInstance.getUnmaskedValue("12:45")).toBe("12:45");
    expect(maskInstance.getUnmaskedValue("05:05")).toBe("05:05");
    expect(maskInstance.getUnmaskedValue("10:07")).toBe("10:07");
  });

  test("get masked date if text with dots mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    expect(maskInstance._getMaskedValue("12.4")).toBe("12/04/yyyy");
    expect(maskInstance._getMaskedValue("12.34")).toBe("12/3d/yyyy");
    expect(maskInstance._getMaskedValue("12.30.198")).toBe("12/30/198y");
    expect(maskInstance._getMaskedValue("12.30.0001")).toBe("12/30/0001");
    expect(maskInstance._getMaskedValue("12.30.1987")).toBe("12/30/1987");

  // expect(maskInstance._getMaskedValue("1.4")).toBe("01/04/yyyy");
  // expect(maskInstance._getMaskedValue("1.34")).toBe("01/3d/yyyy");
  // expect(maskInstance._getMaskedValue("1.3.198")).toBe("01/03/198y");
  // expect(maskInstance._getMaskedValue("1.3.0001")).toBe("01/03/0001");
  // expect(maskInstance._getMaskedValue("1.3.1987")).toBe("01/03/1987");
  });

  test("get masked date if text with dots m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";

    expect(maskInstance._getMaskedValue("12.4")).toBe("12/4/yyyy");
    expect(maskInstance._getMaskedValue("12.34")).toBe("12/3/yyyy");
    expect(maskInstance._getMaskedValue("12.30.198")).toBe("12/30/198y");
    expect(maskInstance._getMaskedValue("12.30.0001")).toBe("12/30/0001");
    expect(maskInstance._getMaskedValue("12.30.1987")).toBe("12/30/1987");

    expect(maskInstance._getMaskedValue("1.4")).toBe("1/4/yyyy");
    expect(maskInstance._getMaskedValue("1.34")).toBe("1/3/yyyy");
    expect(maskInstance._getMaskedValue("1.3.198")).toBe("1/3/198y");
    expect(maskInstance._getMaskedValue("1.3.0001")).toBe("1/3/0001");
    expect(maskInstance._getMaskedValue("1.3.1987")).toBe("1/3/1987");
  });

  test("get masked date if set min & max mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "2024-04-01";
    maskInstance.max = "2024-05-01";

    expect(maskInstance._getMaskedValue("05/3", false)).toBe("05/");
    expect(maskInstance._getMaskedValue("05/3", false)).toBe("05/");
  });

  test("get unmasked valid date text mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    expect(maskInstance.getUnmaskedValue("mm/dd/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("1m/dd/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("01/dd/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("02/dd/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("12/04/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("12/3d/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("12/30/198y")).toBe("");
    expect(maskInstance.getUnmaskedValue("12/30/0001")).toBe("0001-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/1987")).toBe("1987-12-30");
    expect(maskInstance.getUnmaskedValue("01/03/1987")).toBe("1987-01-03");
  });

  test("get input value onBlur mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    const input = "01/01/1970";
    const unmaskedValue = maskInstance.getUnmaskedValue(input);
    expect(unmaskedValue, "unmaskedValue").toBe("1970-01-01");

    const maskedValue = maskInstance.getMaskedValue(unmaskedValue);
    expect(maskedValue, "").toBe(input);
  });

  test("get masked valid date text m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";
    expect(maskInstance.getUnmaskedValue("m/d/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("1/d/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("1/d/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("2/d/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("1/4/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("1/3/yyyy")).toBe("");
    expect(maskInstance.getUnmaskedValue("1/3/198y")).toBe("");
    expect(maskInstance.getUnmaskedValue("12/30/0001")).toBe("0001-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/1987")).toBe("1987-12-30");
    expect(maskInstance.getUnmaskedValue("1/3/1987")).toBe("1987-01-03");
  });

  test("_getMaskedValue matchWholeMask m/d/yy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yy";

    expect(maskInstance.getUnmaskedValue("8/5/91")).toBe("1991-08-05");
    expect(maskInstance.getUnmaskedValue("1/3/69")).toBe("1969-01-03");
    expect(maskInstance.getUnmaskedValue("12/30/68")).toBe("2068-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/01")).toBe("2001-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/00")).toBe("2000-12-30");
  });

  test("_getMaskedValue with max m/d/yy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yy";
    maskInstance.min = "1950-05-30";
    maskInstance.max = "2024-02-27";

    expect(maskInstance.getUnmaskedValue("12/30/01")).toBe("2001-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/00")).toBe("2000-12-30");
    expect(maskInstance.getUnmaskedValue("12/30/24")).toBe("2024-12-30");
    expect(maskInstance.getUnmaskedValue("1/3/69")).toBe("1969-01-03");
    expect(maskInstance.getUnmaskedValue("12/30/68")).toBe("1968-12-30");
    expect(maskInstance.getUnmaskedValue("8/5/91")).toBe("1991-08-05");
    expect(maskInstance.getUnmaskedValue("8/5/50")).toBe("1950-08-05");
  });

  test("dateTime processInput serial input: insert characters", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type #1").toBe("1m/dd/yyyy");
    expect(result.caretPosition, "type #1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12/dd/yyyy");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 5").toBe("1m/dd/yyyy");
    expect(result.caretPosition, "try type 5").toBe(1);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "12/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 3").toBe("12/3d/yyyy");
    expect(result.caretPosition, "type 3").toBe(4);

    result = maskInstance.processInput({ insertedChars: "7", selectionStart: 4, selectionEnd: 4, prevValue: "12/3d/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 7").toBe("12/3d/yyyy");
    expect(result.caretPosition, "try type 7").toBe(4);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "12/3d/yyyy", inputDirection: "forward" });
    expect(result.value, "type 0").toBe("12/30/yyyy");
    expect(result.caretPosition, "type 0").toBe(6);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "12/30/yyyy", inputDirection: "forward" });
    expect(result.value, "type year").toBe("12/30/2yyy");
    expect(result.caretPosition, "type year").toBe(7);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 9, selectionEnd: 9, prevValue: "12/30/202y", inputDirection: "forward" });
    expect(result.value, "type 2024").toBe("12/30/2024");
    expect(result.caretPosition, "type 2024").toBe(10);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 10, selectionEnd: 10, prevValue: "12/30/2024", inputDirection: "forward" });
    expect(result.value, "type 0 2024").toBe("12/30/2024");
    expect(result.caretPosition, "type 0 2024").toBe(10);
  });

  test("dateTime processInput serial input: insert characters v2", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    let result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "04/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type #1").toBe("04/3d/yyyy");
    expect(result.caretPosition, "type #1").toBe(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "02/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type #2").toBe("02/03/yyyy");
    expect(result.caretPosition, "type #2").toBe(6);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 3, selectionEnd: 3, prevValue: "02/0d/yyyy", inputDirection: "forward" });
    expect(result.value, "type #3").toBe("02/05/yyyy");
    expect(result.caretPosition, "type #3").toBe(6);
  });

  test("dateTime processInput serial input: insert characters m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";
    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "m/d/yyyy", inputDirection: "forward" });
    expect(result.value, "type #1").toBe("1/d/yyyy");
    expect(result.caretPosition, "type #1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1/d/yyyy", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12/d/yyyy");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "1m/d/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 5").toBe("1/d/yyyy");
    expect(result.caretPosition, "try type 5").toBe(1);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "12/d/yyyy", inputDirection: "forward" });
    expect(result.value, "type 3").toBe("12/3/yyyy");
    expect(result.caretPosition, "type 3").toBe(4);

    result = maskInstance.processInput({ insertedChars: "7", selectionStart: 4, selectionEnd: 4, prevValue: "12/3/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 7").toBe("12/3/yyyy");
    expect(result.caretPosition, "try type 7").toBe(4);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "12/3/yyyy", inputDirection: "forward" });
    expect(result.value, "type 0").toBe("12/30/yyyy");
    expect(result.caretPosition, "type 0").toBe(6);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "12/30/yyyy", inputDirection: "forward" });
    expect(result.value, "type year").toBe("12/30/2yyy");
    expect(result.caretPosition, "type year").toBe(7);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 9, selectionEnd: 9, prevValue: "12/30/202y", inputDirection: "forward" });
    expect(result.value, "type 2024").toBe("12/30/2024");
    expect(result.caretPosition, "type 2024").toBe(10);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 10, selectionEnd: 10, prevValue: "12/30/2024", inputDirection: "forward" });
    expect(result.value, "type 0 2024").toBe("12/30/2024");
    expect(result.caretPosition, "type 0 2024").toBe(10);
  });

  test("dateTime processInput: insert characters mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    let result = maskInstance.processInput({ insertedChars: "4", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 4").toBe("04/dd/yyyy");
    expect(result.caretPosition, "type 4").toBe(3);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 3, selectionEnd: 3, prevValue: "04/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 5").toBe("04/05/yyyy");
    expect(result.caretPosition, "type 5").toBe(6);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/000y", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("04/05/0001");
    expect(result.caretPosition, "type 1").toBe(10);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 4, selectionEnd: 4, prevValue: "01/3d/1991", inputDirection: "forward" });
    expect(result.value, "try type 4").toBe("01/3d/1991");
    expect(result.caretPosition, "try type 4").toBe(4);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 1, selectionEnd: 1, prevValue: "1m/30/1991", inputDirection: "forward" });
    expect(result.value, "try type 3").toBe("1m/30/1991");
    expect(result.caretPosition, "try type 3").toBe(1);
  });

  test("dateTime processInput: insert characters m/d/yy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yy";
    let result = maskInstance.processInput({ insertedChars: "4", selectionStart: 0, selectionEnd: 0, prevValue: "m/d/yy", inputDirection: "forward" });
    expect(result.value, "type 4").toBe("4/d/yy");
    expect(result.caretPosition, "type 4").toBe(2);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 2, selectionEnd: 2, prevValue: "4/d/yy", inputDirection: "forward" });
    expect(result.value, "type 5").toBe("4/5/yy");
    expect(result.caretPosition, "type 5").toBe(4);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 4, selectionEnd: 4, prevValue: "4/5/yy", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("4/5/1y");
    expect(result.caretPosition, "type 1").toBe(5);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "m/d/yy", inputDirection: "forward" });
    expect(result.value, "try type 0 into month").toBe("m/d/yy");
    expect(result.caretPosition, "try type 0 into month").toBe(0);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 2, selectionEnd: 2, prevValue: "1/d/yy", inputDirection: "forward" });
    expect(result.value, "try type 0 into day").toBe("1/d/yy");
    expect(result.caretPosition, "try type 0 into day").toBe(2);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "10/d/yy", inputDirection: "forward" });
    expect(result.value, "try type 0 into day").toBe("10/d/yy");
    expect(result.caretPosition, "try type 0 into day").toBe(3);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 5, selectionEnd: 5, prevValue: "4/5/1y", inputDirection: "forward" });
    expect(result.value, "type 3").toBe("4/5/13");
    expect(result.caretPosition, "type 3").toBe(6);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 6, selectionEnd: 6, prevValue: "4/5/13", inputDirection: "forward" });
    expect(result.value, "try type 8").toBe("4/5/13");
    expect(result.caretPosition, "try type 8").toBe(6);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 3, selectionEnd: 3, prevValue: "1/3/91", inputDirection: "forward" });
    expect(result.value, "try type 4").toBe("1/3/91");
    expect(result.caretPosition, "try type 4").toBe(3);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 1, selectionEnd: 1, prevValue: "1/30/91", inputDirection: "forward" });
    expect(result.value, "try type 3").toBe("1/30/91");
    expect(result.caretPosition, "try type 3").toBe(1);
  });

  test("dateTime processInput: delete characters by backspace", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    let result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 9, selectionEnd: 10, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 4").toBe("04/05/202y");
    expect(result.caretPosition, "delete 4").toBe(9);

    result = maskInstance.processInput({ prevValue: "04/05/yyyy", selectionStart: 5, selectionEnd: 6, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "try delete /").toBe("04/05/yyyy");
    expect(result.caretPosition, "try delete /").toBe(5);

    result = maskInstance.processInput({ prevValue: "04/05/yyyy", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 5").toBe("04/0d/yyyy");
    expect(result.caretPosition, "delete 5").toBe(4);

    result = maskInstance.processInput({ prevValue: "04/0d/yyyy", selectionStart: 3, selectionEnd: 4, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 0").toBe("04/dd/yyyy");
    expect(result.caretPosition, "delete 0").toBe(3);

    result = maskInstance.processInput({ prevValue: "04/dd/yyyy", selectionStart: 2, selectionEnd: 3, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "try delete /").toBe("04/dd/yyyy");
    expect(result.caretPosition, "try delete /").toBe(2);

    result = maskInstance.processInput({ prevValue: "04/dd/yyyy", selectionStart: 1, selectionEnd: 2, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 4").toBe("0m/dd/yyyy");
    expect(result.caretPosition, "delete 4").toBe(1);

    result = maskInstance.processInput({ prevValue: "0m/dd/yyyy", selectionStart: 0, selectionEnd: 1, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 0").toBe("mm/dd/yyyy");
    expect(result.caretPosition, "delete 0").toBe(0);

    result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete first character").toBe("mm/dd/yyyy");
    expect(result.caretPosition, "delete first character").toBe(0);
  });

  test("dateTime processInput: editing by delete characters by backspace", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    let result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 1, selectionEnd: 2, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 4").toBe("0m/05/2024");
    expect(result.caretPosition, "delete 4").toBe(1);

    result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 1, selectionEnd: 2, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 5").toBe("0m/12/2024");
    expect(result.caretPosition, "delete 5").toBe(1);
    result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 5").toBe("04/0d/2024");
    expect(result.caretPosition, "delete 5").toBe(4);

    result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 4, selectionEnd: 5, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 2").toBe("05/1d/2024");
    expect(result.caretPosition, "delete 2").toBe(4);

    result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 3, selectionEnd: 4, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 1").toBe("05/2d/2024");
    expect(result.caretPosition, "delete 1").toBe(3);

    result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 7, selectionEnd: 8, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 0").toBe("05/12/224y");
    expect(result.caretPosition, "delete 0").toBe(7);
  });

  test("dateTime processInput: delete characters by backspace m/d/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "m/d/yyyy";
    let result = maskInstance.processInput({ prevValue: "2/d/yyyy", selectionStart: 0, selectionEnd: 1, insertedChars: null, inputDirection: "backward" });
    expect(result.value, "delete 2").toBe("m/d/yyyy");
    expect(result.caretPosition, "delete 2").toBe(0);
  });

  test("dateTime processInput: copy/paste", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    let result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "05/12/2024", inputDirection: "backward" });
    expect(result.value, "insert new value 05/12/2024").toBe("05/12/2024");
    expect(result.caretPosition, "insert new value 05/12/2024").toBe(10);

    result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "5/12/2024", inputDirection: "backward" });
    expect(result.value, "insert new value 5/12/2024").toBe("05/12/2024");
    expect(result.caretPosition, "insert new value 5/12/2024").toBe(10);

    // result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "5/1/2024", inputDirection: "backward" });
    // expect(result.value, "insert new value 5/1/2024").toBe("05/01/2024");
    // expect(result.caretPosition, "insert new value 5/1/2024").toBe(10);

    result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedChars: "10.28.1996", inputDirection: "backward" });
    expect(result.value, "empty value & insert new value 10.28.1996").toBe("10/28/1996");
    expect(result.caretPosition, "empty value & insert new value 10.28.1996").toBe(10);

    result = maskInstance.processInput({ prevValue: "5/12/2024", selectionStart: 0, selectionEnd: 0, insertedChars: "108", inputDirection: "backward" });
    expect(result.value, "insert 108").toBe("10/12/2024");
    expect(result.caretPosition, "insert 108").toBe(3);

    result = maskInstance.processInput({ prevValue: "5/12/2024", selectionStart: 0, selectionEnd: 0, insertedChars: "10.28.1996", inputDirection: "backward" });
    expect(result.value, "insert new value 10.28.1996").toBe("10/28/1996");
    expect(result.caretPosition, "insert new value 10.28.1996").toBe(10);
  });

  test("dateTime process: cursor position", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";

    let result = maskInstance.processInput({ insertedChars: "2", prevValue: "07/1d/yyyy", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "insert 2").toBe("07/1d/2yyy");
    expect(result.caretPosition, "insert 2").toBe(7);
  });

  test("dateTime processInput: min for datetime", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy HH:MM";
    maskInstance.min = "05/04/1982 09:15";
    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 9, selectionEnd: 9, prevValue: "05/04/198y HH:MM", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("05/04/1982 HH:MM");
    expect(result.caretPosition, "type 2").toBe(11);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 11, selectionEnd: 11, prevValue: "05/04/1982 HH:MM", inputDirection: "forward" });
    expect(result.value, "try type 8").toBe("05/04/1982 HH:MM");
    expect(result.caretPosition, "try type 8").toBe(11);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 11, selectionEnd: 11, prevValue: "05/04/1982 HH:MM", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("05/04/1982 1H:MM");
    expect(result.caretPosition, "type 1").toBe(12);
  });

  test("dateTime processInput: min for time", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "HH:MM";
    maskInstance.min = "09:15";

    let result = maskInstance.processInput({ insertedChars: "8", selectionStart: 0, selectionEnd: 0, prevValue: "HH:MM", inputDirection: "forward" });
    expect(result.value, "try type 8").toBe("HH:MM");
    expect(result.caretPosition, "try type 8").toBe(0);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "HH:MM", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1H:MM");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1H:MM", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12:MM");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 3, selectionEnd: 3, prevValue: "12:MM", inputDirection: "forward" });
    expect(result.value, "type 8").toBe("12:08");
    expect(result.caretPosition, "type 8").toBe(5);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 3, selectionEnd: 3, prevValue: "09:MM", inputDirection: "forward" });
    expect(result.value, "try type 8").toBe("09:MM");
    expect(result.caretPosition, "try type 8").toBe(3);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 3, selectionEnd: 3, prevValue: "09:MM", inputDirection: "forward" });
    expect(result.value, "type 3").toBe("09:3M");
    expect(result.caretPosition, "type 3").toBe(4);
  });

  test("dateTime processInput: min & max for time", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "HH:MM";
    maskInstance.min = "09:15";
    maskInstance.max = "17:45";

    let result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "HH:MM", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1H:MM");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "9", selectionStart: 1, selectionEnd: 1, prevValue: "1H:MM", inputDirection: "forward" });
    expect(result.value, "try type 9").toBe("1H:MM");
    expect(result.caretPosition, "try type 9").toBe(1);

    result = maskInstance.processInput({ insertedChars: "7", selectionStart: 1, selectionEnd: 1, prevValue: "1H:MM", inputDirection: "forward" });
    expect(result.value, "type 7").toBe("17:MM");
    expect(result.caretPosition, "type 7").toBe(3);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 3, selectionEnd: 3, prevValue: "17:MM", inputDirection: "forward" });
    expect(result.value, "type 5").toBe("17:05");
    expect(result.caretPosition, "type 5").toBe(5);
  });

  test("dateTime processInput: min & max for 12-hour time", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM tt";
    maskInstance.min = "08:00";
    maskInstance.max = "18:00";

    let result = maskInstance.processInput({ insertedChars: "7", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "try type 7").toBe("hh:MM tt");
    expect(result.caretPosition, "try type 7").toBe(0);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1h:MM tt");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 1, selectionEnd: 1, prevValue: "1h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 0").toBe("10:MM tt");
    expect(result.caretPosition, "type 0").toBe(3);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toBe("10:00 tt");
    expect(result.caretPosition, "type p").toBe(6);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toBe("10:00 at");
    expect(result.caretPosition, "type a").toBe(7);

    maskInstance.min = "13:00";
    maskInstance.max = "17:00";
    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("01:MM tt");
    expect(result.caretPosition, "type 1").toBe(3);

    result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 6").toBe("hh:MM tt");
    expect(result.caretPosition, "type 6").toBe(0);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 0").toBe("0h:MM tt");
    expect(result.caretPosition, "type 0").toBe(1);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "05:0M tt", inputDirection: "forward" });
    expect(result.value, "type second 0").toBe("05:00 tt");
    expect(result.caretPosition, "type second  0").toBe(6);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toBe("05:00 tt");
    expect(result.caretPosition, "type a").toBe(6);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toBe("05:00 pt");
    expect(result.caretPosition, "type p").toBe(7);

    maskInstance.min = "01:00";
    maskInstance.max = "05:00";
    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("01:MM tt");
    expect(result.caretPosition, "type 1").toBe(3);

    result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 6").toBe("hh:MM tt");
    expect(result.caretPosition, "type 6").toBe(0);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "hh:MM tt", inputDirection: "forward" });
    expect(result.value, "type 0").toBe("0h:MM tt");
    expect(result.caretPosition, "type 0").toBe(1);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 4, selectionEnd: 4, prevValue: "05:0M tt", inputDirection: "forward" });
    expect(result.value, "type second 0").toBe("05:00 tt");
    expect(result.caretPosition, "type second  0").toBe(6);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toBe("05:00 at");
    expect(result.caretPosition, "type a").toBe(7);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "05:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toBe("05:00 tt");
    expect(result.caretPosition, "type p").toBe(6);
  });

  test("dateTime processInput: min & max for 12-hour time - h", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "h:MM tt";
    maskInstance.min = "08:00";
    maskInstance.max = "18:00";

    let result = maskInstance.processInput({ insertedChars: "7", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "try type 7").toBe("h:MM tt");
    expect(result.caretPosition, "try type 7").toBe(0);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1:MM tt");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "9", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("9:MM tt");
    expect(result.caretPosition, "type 1").toBe(2);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 1, selectionEnd: 1, prevValue: "1:MM tt", inputDirection: "forward" });
    expect(result.value, "type 0").toBe("10:MM tt");
    expect(result.caretPosition, "type 0").toBe(3);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toBe("10:00 tt");
    expect(result.caretPosition, "type p").toBe(6);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 6, selectionEnd: 6, prevValue: "10:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toBe("10:00 at");
    expect(result.caretPosition, "type a").toBe(7);

    maskInstance.min = "13:00";
    maskInstance.max = "17:00";
    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1:MM tt");
    expect(result.caretPosition, "type 1").toBe(2);

    result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 6").toBe("h:MM tt");
    expect(result.caretPosition, "type 6").toBe(0);

    // result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    // expect(result.value, "try type 0").toBe("h:MM tt");
    // expect(result.caretPosition, "try type 0").toBe(0);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "5:0M tt", inputDirection: "forward" });
    expect(result.value, "type second 0").toBe("5:00 tt");
    expect(result.caretPosition, "type second  0").toBe(5);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 5, selectionEnd: 5, prevValue: "5:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toBe("5:00 tt");
    expect(result.caretPosition, "type a").toBe(5);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 5, selectionEnd: 5, prevValue: "5:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toBe("5:00 pt");
    expect(result.caretPosition, "type p").toBe(6);

    maskInstance.min = "01:00";
    maskInstance.max = "05:00";
    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1:MM tt");
    expect(result.caretPosition, "type 1").toBe(2);

    result = maskInstance.processInput({ insertedChars: "6", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    expect(result.value, "type 6").toBe("h:MM tt");
    expect(result.caretPosition, "type 6").toBe(0);

    // result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "h:MM tt", inputDirection: "forward" });
    // expect(result.value, "type 0").toBe("h:MM tt");
    // expect(result.caretPosition, "type 0").toBe(0);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 3, selectionEnd: 3, prevValue: "5:0M tt", inputDirection: "forward" });
    expect(result.value, "type second 0").toBe("5:00 tt");
    expect(result.caretPosition, "type second  0").toBe(5);

    result = maskInstance.processInput({ insertedChars: "a", selectionStart: 5, selectionEnd: 5, prevValue: "5:00 tt", inputDirection: "forward" });
    expect(result.value, "type a").toBe("5:00 at");
    expect(result.caretPosition, "type a").toBe(6);

    result = maskInstance.processInput({ insertedChars: "p", selectionStart: 5, selectionEnd: 5, prevValue: "05:00 tt", inputDirection: "forward" });
    expect(result.value, "type p").toBe("5:00 tt");
    expect(result.caretPosition, "type p").toBe(5);
  });

  test("dateTime processInput: min for date", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "1972-02-01";
    let result = maskInstance.processInput({ insertedChars: "0", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 0").toBe("04/05/yyyy");
    expect(result.caretPosition, "try type 0").toBe(6);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("04/05/1yyy");
    expect(result.caretPosition, "type 1").toBe(7);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
    expect(result.value, "try type 1").toBe("04/05/197y");
    expect(result.caretPosition, "try type 1").toBe(9);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("04/05/1972");
    expect(result.caretPosition, "type 2").toBe(10);
  });

  test("dateTime processInput: max", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.max = "1972-02-01";
    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 2").toBe("04/05/yyyy");
    expect(result.caretPosition, "try type 2").toBe(6);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("04/05/1yyy");
    expect(result.caretPosition, "type 1").toBe(7);

    result = maskInstance.processInput({ insertedChars: "3", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
    expect(result.value, "try type 3").toBe("04/05/197y");
    expect(result.caretPosition, "try type 3").toBe(9);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/197y", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("04/05/1971");
    expect(result.caretPosition, "type 1").toBe(10);
  });

  test("dateTime processInput: min & max", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "1960-01-01";
    maskInstance.max = "1980-12-31";
    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 2").toBe("04/05/yyyy");
    expect(result.caretPosition, "try type 2").toBe(6);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("04/05/1yyy");
    expect(result.caretPosition, "type 1").toBe(7);

    result = maskInstance.processInput({ insertedChars: "9", selectionStart: 8, selectionEnd: 8, prevValue: "04/05/19yy", inputDirection: "forward" });
    expect(result.value, "try type 9").toBe("04/05/19yy");
    expect(result.caretPosition, "try type 9").toBe(8);

    result = maskInstance.processInput({ insertedChars: "8", selectionStart: 8, selectionEnd: 8, prevValue: "04/05/19yy", inputDirection: "forward" });
    expect(result.value, "type 8").toBe("04/05/198y");
    expect(result.caretPosition, "type 8").toBe(9);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/198y", inputDirection: "forward" });
    expect(result.value, "try type 1").toBe("04/05/198y");
    expect(result.caretPosition, "try type 1").toBe(9);

    result = maskInstance.processInput({ insertedChars: "0", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/198y", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("04/05/1980");
    expect(result.caretPosition, "type 1").toBe(10);
  });

  test("dateTime processInput: min & max medium range mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "2023-11-13";
    maskInstance.max = "2024-12-13";
    let result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 0").toBe("0m/dd/yyyy");
    expect(result.caretPosition, "type 0").toBe(1);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "0m/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 5").toBe("05/dd/yyyy");
    expect(result.caretPosition, "type 5").toBe(3);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "try type 2").toBe("02/dd/yyyy");
    expect(result.caretPosition, "try type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1m/dd/yyyy");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yyyy", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12/dd/yyyy");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 9, selectionEnd: 9, prevValue: "05/12/202y", inputDirection: "forward" });
    expect(result.value, "type 4").toBe("05/12/2024");
    expect(result.caretPosition, "type 4").toBe(10);
  });

  test("dateTime processInput: min & max medium range mm/dd/yy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yy";
    maskInstance.min = "2023-11-13";
    maskInstance.max = "2024-12-13";
    let result = maskInstance.processInput({ insertedChars: "0", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yy", inputDirection: "forward" });
    expect(result.value, "type 0").toBe("0m/dd/yy");
    expect(result.caretPosition, "type 0").toBe(1);

    result = maskInstance.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "0m/dd/yy", inputDirection: "forward" });
    expect(result.value, "type 5").toBe("05/dd/yy");
    expect(result.caretPosition, "type 5").toBe(3);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yy", inputDirection: "forward" });
    expect(result.value, "try type 2").toBe("02/dd/yy");
    expect(result.caretPosition, "try type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yy", inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1m/dd/yy");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yy", inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12/dd/yy");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", selectionStart: 7, selectionEnd: 7, prevValue: "05/12/2y", inputDirection: "forward" });
    expect(result.value, "type 4").toBe("05/12/24");
    expect(result.caretPosition, "type 4").toBe(8);
  });

  test("dateTime processInput: min & max medium range leap year YYYY", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "2023-11-13";
    maskInstance.max = "2025-12-13";
    let result = maskInstance.processInput({ insertedChars: "9", selectionStart: 4, selectionEnd: 4, prevValue: "02/2d/yy", inputDirection: "forward" });
    expect(result.value, "type 9").toBe("02/29/yyyy");
    expect(result.caretPosition, "type 9").toBe(6);
  });

  test("dateTime processInput: min & max medium range leap year YY", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yy";
    maskInstance.min = "2023-11-13";
    maskInstance.max = "2025-12-13";
    let result = maskInstance.processInput({ insertedChars: "9", selectionStart: 4, selectionEnd: 4, prevValue: "02/2d/yy", inputDirection: "forward" });
    expect(result.value, "type 9").toBe("02/29/yy");
    expect(result.caretPosition, "type 9").toBe(6);
  });

  test("dateTime processInput: min & max small range", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "2024-04-01";
    maskInstance.max = "2024-05-01";

    let result = maskInstance.processInput({ insertedChars: "8", prevValue: "05/dd/yyyy", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "try type 8").toBe("05/dd/yyyy");
    expect(result.caretPosition, "try type 8").toBe(3);

    result = maskInstance.processInput({ insertedChars: "3", prevValue: "05/dd/yyyy", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "try type 3").toBe("05/dd/yyyy");
    expect(result.caretPosition, "try type 3").toBe(3);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "05/dd/yyyy", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 1").toBe("05/01/yyyy");
    expect(result.caretPosition, "type 1").toBe(6);
  });

  test("dateTime processInput: min & max 1 year range mm/dd/yyyy", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "mm/dd/yyyy";
    maskInstance.min = "2023-01-13";
    maskInstance.max = "2024-01-13";
    let result = maskInstance.processInput({ insertedChars: "2", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yy", inputDirection: "forward" });
    expect(result.value, "type 0").toBe("02/dd/yyyy");
    expect(result.caretPosition, "type 0").toBe(3);
  });

  test("dateTime processInput: time", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "HH:MM";

    let result = maskInstance.processInput({ insertedChars: "1", prevValue: "HH:MM", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1H:MM");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "2", prevValue: "1H:MM", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12:MM");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 4").toBe("12:4M");
    expect(result.caretPosition, "type 4").toBe(4);

    result = maskInstance.processInput({ insertedChars: "5", prevValue: "12:4M", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
    expect(result.value, "type 5").toBe("12:45");
    expect(result.caretPosition, "type 5").toBe(5);
  });

  test("dateTime processInput: time - H", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "H:MM";

    let result = maskInstance.processInput({ insertedChars: "1", prevValue: "H:MM", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1:MM");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "2", prevValue: "1:MM", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12:MM");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 4").toBe("12:4M");
    expect(result.caretPosition, "type 4").toBe(4);

    result = maskInstance.processInput({ insertedChars: "5", prevValue: "12:4M", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
    expect(result.value, "type 5").toBe("12:45");
    expect(result.caretPosition, "type 5").toBe(5);
  });

  test("dateTime processInput: time 12 hours", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM TT";

    let result = maskInstance.processInput({ insertedChars: "2", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 2").toBe("02:MM TT");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1h:MM TT");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "3", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 3").toBe("1h:MM TT");
    expect(result.caretPosition, "type 3").toBe(1);

    result = maskInstance.processInput({ insertedChars: "2", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12:MM TT");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM TT", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 4").toBe("12:4M TT");
    expect(result.caretPosition, "type 4").toBe(4);

    result = maskInstance.processInput({ insertedChars: "5", prevValue: "12:4M TT", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
    expect(result.value, "type 5").toBe("12:45 TT");
    expect(result.caretPosition, "type 5").toBe(6);

    result = maskInstance.processInput({ insertedChars: "X", prevValue: "12:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "try type X").toBe("12:45 TT");
    expect(result.caretPosition, "try type X").toBe(6);

    result = maskInstance.processInput({ insertedChars: "p", prevValue: "12:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "type p").toBe("12:45 PT");
    expect(result.caretPosition, "type p").toBe(7);

    result = maskInstance.processInput({ insertedChars: "z", prevValue: "12:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "try type z").toBe("12:45 PT");
    expect(result.caretPosition, "try type z").toBe(7);

    result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "type m").toBe("12:45 PM");
    expect(result.caretPosition, "type m").toBe(8);

    maskInstance.pattern = "hh:MM tt";
    result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 pt", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "type m").toBe("12:45 pm");
    expect(result.caretPosition, "type m").toBe(8);
  });

  test("dateTime processInput: time 12 hours - a/p", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM T";

    let result = maskInstance.processInput({ insertedChars: "2", prevValue: "hh:MM T", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 2").toBe("02:MM T");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "hh:MM T", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1h:MM T");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "X", prevValue: "12:45 T", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "try type X").toBe("12:45 T");
    expect(result.caretPosition, "try type X").toBe(6);

    result = maskInstance.processInput({ insertedChars: "p", prevValue: "12:45 T", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "type p").toBe("12:45 P");
    expect(result.caretPosition, "type p").toBe(7);

    result = maskInstance.processInput({ insertedChars: "z", prevValue: "12:45 P", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "try type z").toBe("12:45 P");
    expect(result.caretPosition, "try type z").toBe(7);

    result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 P", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "try type m").toBe("12:45 P");
    expect(result.caretPosition, "try type m").toBe(7);

    maskInstance.pattern = "hh:MM t";
    result = maskInstance.processInput({ insertedChars: "m", prevValue: "12:45 p", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "try type m #2").toBe("12:45 p");
    expect(result.caretPosition, "try type m #2").toBe(7);
  });

  test("dateTime processInput: time 12 hours - h", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "h:MM TT";

    let result = maskInstance.processInput({ insertedChars: "2", prevValue: "h:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 2").toBe("2:MM TT");
    expect(result.caretPosition, "type 2").toBe(2);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "h:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1:MM TT");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "3", prevValue: "1:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 3").toBe("1:MM TT");
    expect(result.caretPosition, "type 3").toBe(1);

    result = maskInstance.processInput({ insertedChars: "2", prevValue: "1:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 2").toBe("12:MM TT");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", prevValue: "12:MM TT", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 4").toBe("12:4M TT");
    expect(result.caretPosition, "type 4").toBe(4);
  });

  test("dateTime processInput: time 12 hours v2", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM TT";

    let result = maskInstance.processInput({ insertedChars: "2", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 2").toBe("02:MM TT");
    expect(result.caretPosition, "type 2").toBe(3);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "hh:MM TT", selectionStart: 0, selectionEnd: 0, inputDirection: "forward" });
    expect(result.value, "type 1").toBe("1h:MM TT");
    expect(result.caretPosition, "type 1").toBe(1);

    result = maskInstance.processInput({ insertedChars: "3", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 3").toBe("1h:MM TT");
    expect(result.caretPosition, "type 3").toBe(1);

    result = maskInstance.processInput({ insertedChars: "1", prevValue: "1h:MM TT", selectionStart: 1, selectionEnd: 1, inputDirection: "forward" });
    expect(result.value, "type 1").toBe("11:MM TT");
    expect(result.caretPosition, "type 1").toBe(3);

    result = maskInstance.processInput({ insertedChars: "4", prevValue: "11:MM TT", selectionStart: 3, selectionEnd: 3, inputDirection: "forward" });
    expect(result.value, "type 4").toBe("11:4M TT");
    expect(result.caretPosition, "type 4").toBe(4);

    result = maskInstance.processInput({ insertedChars: "5", prevValue: "11:4M TT", selectionStart: 4, selectionEnd: 4, inputDirection: "forward" });
    expect(result.value, "type 5").toBe("11:45 TT");
    expect(result.caretPosition, "type 5").toBe(6);

    result = maskInstance.processInput({ insertedChars: "X", prevValue: "11:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "try type X").toBe("11:45 TT");
    expect(result.caretPosition, "try type X").toBe(6);

    result = maskInstance.processInput({ insertedChars: "p", prevValue: "11:45 TT", selectionStart: 6, selectionEnd: 6, inputDirection: "forward" });
    expect(result.value, "type p").toBe("11:45 PT");
    expect(result.caretPosition, "type p").toBe(7);

    result = maskInstance.processInput({ insertedChars: "z", prevValue: "11:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "try type z").toBe("11:45 PT");
    expect(result.caretPosition, "try type z").toBe(7);

    result = maskInstance.processInput({ insertedChars: "m", prevValue: "11:45 PT", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "type m").toBe("11:45 PM");
    expect(result.caretPosition, "type m").toBe(8);

    maskInstance.pattern = "hh:MM tt";
    result = maskInstance.processInput({ insertedChars: "m", prevValue: "11:45 pt", selectionStart: 7, selectionEnd: 7, inputDirection: "forward" });
    expect(result.value, "type m").toBe("11:45 pm");
    expect(result.caretPosition, "type m").toBe(8);
  });

  test("getMaxDateForMonth method", () => {
    const maskInstance = new InputMaskDateTime();
    const getMaxDateForMonth = (maskInstance as any).getMaxDateForMonth.bind(maskInstance);

    // Test regular months
    expect(getMaxDateForMonth(2024, 1), "January has 31 days").toBe(31);
    expect(getMaxDateForMonth(2024, 3), "March has 31 days").toBe(31);
    expect(getMaxDateForMonth(2024, 4), "April has 30 days").toBe(30);
    expect(getMaxDateForMonth(2024, 5), "May has 31 days").toBe(31);
    expect(getMaxDateForMonth(2024, 6), "June has 30 days").toBe(30);
    expect(getMaxDateForMonth(2024, 7), "July has 31 days").toBe(31);
    expect(getMaxDateForMonth(2024, 8), "August has 31 days").toBe(31);
    expect(getMaxDateForMonth(2024, 9), "September has 30 days").toBe(30);
    expect(getMaxDateForMonth(2024, 10), "October has 31 days").toBe(31);
    expect(getMaxDateForMonth(2024, 11), "November has 30 days").toBe(30);
    expect(getMaxDateForMonth(2024, 12), "December has 31 days").toBe(31);

    // Test February in different years
    expect(getMaxDateForMonth(2024, 2), "February 2024 (leap year) has 29 days").toBe(29);
    expect(getMaxDateForMonth(2023, 2), "February 2023 (non-leap year) has 28 days").toBe(28);
    expect(getMaxDateForMonth(2000, 2), "February 2000 (leap year divisible by 400) has 29 days").toBe(29);
    expect(getMaxDateForMonth(2100, 2), "February 2100 (non-leap year divisible by 100) has 28 days").toBe(28);
    expect(getMaxDateForMonth(2020, 2), "February 2020 (leap year) has 29 days").toBe(29);
    expect(getMaxDateForMonth(2019, 2), "February 2019 (non-leap year) has 28 days").toBe(28);
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
    expect(q1.inputValue).toBe("09/04/2024 12:34:56");
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
    expect(q1.inputValue, "inputValue is masked").toBe("10.04.2025");
    expect(q1.value, "value is saved as masked").toBe("10.04.2025");
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
    expect(q1.inputValue, "inputValue is initialized from defaultValue").toBe("20.04.2026");
    expect(q1.value, "value is initialized from defaultValue").toBe("20.04.2026");
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
    expect(dobQuestion.value, "DOB value is stored in masked format").toBe("01-15-1990");
    expect(ageQuestion.value, "Age should be calculated as 35 via inputValue").toBe(35);
    survey.setValue("patient_dob", "01-15-2000");
    expect(ageQuestion.value, "Age should be calculated as 25 via setValue masked").toBe(25);
    survey.data = { patient_dob: "01-15-2005" };
    expect(ageQuestion.value, "Age should be calculated as 20 via survey.data masked").toBe(20);
    survey.data = { patient_dob: "1990-01-15" };
    expect(ageQuestion.value, "Age should be calculated as 35 via survey.data ISO format").toBe(35);
    settings.onDateCreated = savedOnDateCreated;
  });
});

describe("Datetime mask: localized placeholder symbols", () => {
  const enToDeSymbols = (str: string): string => str.replace(/d/g, "T").replace(/m/g, "M").replace(/y/g, "J");
  const typeDigits = (maskInstance: InputMaskDateTime, chars: string): Array<{ value: string, caretPosition: number }> => {
    const res: Array<{ value: string, caretPosition: number }> = [];
    let value = maskInstance.getMaskedValue("");
    let caret = 0;
    for (let i = 0; i < chars.length; i++) {
      const step = maskInstance.processInput({ insertedChars: chars[i], selectionStart: caret, selectionEnd: caret, prevValue: value, inputDirection: "forward" });
      value = step.value;
      caret = step.caretPosition;
      res.push({ value: value, caretPosition: caret });
    }
    return res;
  };
  const createQuestion = (maskSettings: any, locale?: string): QuestionTextModel => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime", maskSettings: maskSettings }] });
    if (!!locale) survey.locale = locale;
    return <QuestionTextModel>survey.getQuestionByName("q1");
  };

  afterEach(() => {
    surveyLocalization.currentLocale = "";
    germanSurveyStrings["maskPlaceholderDay"] = "T";
    germanSurveyStrings["maskPlaceholderMonth"] = "M";
    germanSurveyStrings["maskPlaceholderYear"] = "J";
  });

  test("Placeholder symbols are resolved by semantic role", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "dd.mm.yyyy hh:HH:MM:ss:tt:TT";
    const symbols = maskInstance["lexems"].filter(l => l.type !== "separator").map(l => maskInstance.getPlaceholderSymbol(l));
    expect(symbols.join(""), "english symbols").toBe("dmyhHMstT");

    surveyLocalization.currentLocale = "de";
    maskInstance.localeChanged();
    const deSymbols = maskInstance["lexems"].filter(l => l.type !== "separator").map(l => maskInstance.getPlaceholderSymbol(l));
    expect(deSymbols.join(""), "german symbols, unlocalized roles fall back to english").toBe("TMJhHMstT");
  });

  test("Placeholder symbols follow the current locale of a mask without a survey", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "dd.mm.yyyy";
    expect(maskInstance.getMaskedValue(""), "english").toBe("dd.mm.yyyy");

    surveyLocalization.currentLocale = "de";
    expect(maskInstance.getMaskedValue(""), "german").toBe("TT.MM.JJJJ");
  });

  test("A canonical pattern renders localized placeholder symbols", () => {
    const q = createQuestion({ pattern: "dd.mm.yyyy" });
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.getMaskedValue(""), "english").toBe("dd.mm.yyyy");
    expect(maskInstance.pattern, "the authored pattern is canonical").toBe("dd.mm.yyyy");

    q.survey.locale = "de";
    expect(maskInstance.getMaskedValue(""), "german").toBe("TT.MM.JJJJ");
    expect(maskInstance.pattern, "the authored pattern is not localized").toBe("dd.mm.yyyy");
  });

  test("Changing survey.locale at runtime updates an empty input", () => {
    const q = createQuestion({ pattern: "dd.mm.yyyy" });
    expect(q.inputValue, "english").toBe("dd.mm.yyyy");

    q.survey.locale = "de";
    expect(q.inputValue, "german").toBe("TT.MM.JJJJ");

    q.survey.locale = "";
    expect(q.inputValue, "back to english").toBe("dd.mm.yyyy");
  });

  test("A partially entered value retains its digits when placeholder symbols change", () => {
    const q = createQuestion({ pattern: "dd.mm.yyyy" });
    q.inputValue = "15.mm.yyyy";
    expect(q.inputValue, "english").toBe("15.mm.yyyy");
    expect(q.isEmpty(), "an incomplete value is not stored").toBe(true);

    q.survey.locale = "de";
    expect(q.inputValue, "german").toBe("15.MM.JJJJ");

    q.survey.locale = "";
    expect(q.inputValue, "back to english").toBe("15.mm.yyyy");
  });

  test("getParts accepts both the canonical and the displayed symbol", () => {
    const q = createQuestion({ pattern: "dd.mm.yyyy" }, "de");
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance._getMaskedValue("15.MM.JJJJ"), "german symbols").toBe("15.MM.JJJJ");
    expect(maskInstance._getMaskedValue("15.mm.yyyy"), "symbols rendered before the locale switch").toBe("15.MM.JJJJ");
    expect(maskInstance._getMaskedValue("15.12.JJJJ"), "a filled month").toBe("15.12.JJJJ");
    expect(maskInstance.getUnmaskedValue("15.12.2024"), "a complete value").toBe("2024-12-15");
  });

  test("Typing into a german-rendered mask fills the same semantic fields", () => {
    const enMask = <InputMaskDateTime>createQuestion({ pattern: "dd.mm.yyyy" }).maskSettings;
    const deMask = <InputMaskDateTime>createQuestion({ pattern: "dd.mm.yyyy" }, "de").maskSettings;
    const enSteps = typeDigits(enMask, "15122024");
    const deSteps = typeDigits(deMask, "15122024");

    for (let i = 0; i < enSteps.length; i++) {
      expect(deSteps[i].value, "displayed value after keystroke #" + i).toBe(enToDeSymbols(enSteps[i].value));
      expect(deSteps[i].caretPosition, "caret position after keystroke #" + i).toBe(enSteps[i].caretPosition);
    }
    expect(deSteps[deSteps.length - 1].value, "the german value").toBe("15.12.2024");
    expect(deMask.getUnmaskedValue(deSteps[deSteps.length - 1].value), "the unmasked value").toBe("2024-12-15");
  });

  test("Typing an invalid part is rejected in a german-rendered mask", () => {
    const deMask = <InputMaskDateTime>createQuestion({ pattern: "dd.mm.yyyy" }, "de").maskSettings;
    let res = deMask.processInput({ insertedChars: "4", selectionStart: 0, selectionEnd: 0, prevValue: "TT.MM.JJJJ", inputDirection: "forward" });
    expect(res.value, "4 completes the day").toBe("04.MM.JJJJ");
    expect(res.caretPosition, "the caret jumps to the month").toBe(3);

    res = deMask.processInput({ insertedChars: "3", selectionStart: 0, selectionEnd: 0, prevValue: "TT.MM.JJJJ", inputDirection: "forward" });
    expect(res.value, "3 is a valid first digit of a day").toBe("3T.MM.JJJJ");
    expect(res.caretPosition, "the caret moves").toBe(1);

    res = deMask.processInput({ insertedChars: "5", selectionStart: 1, selectionEnd: 1, prevValue: "3T.MM.JJJJ", inputDirection: "forward" });
    expect(res.value, "35 is not a valid day").toBe("3T.MM.JJJJ");
    expect(res.caretPosition, "the caret does not move").toBe(1);
  });

  test("A complete value and survey data are identical in both locales", () => {
    const enQuestion = createQuestion({ pattern: "dd.mm.yyyy" });
    const deQuestion = createQuestion({ pattern: "dd.mm.yyyy" }, "de");
    enQuestion.inputValue = "15.12.2024";
    deQuestion.inputValue = "15.12.2024";

    expect(enQuestion.value, "the english value").toBe("2024-12-15");
    expect(deQuestion.value, "the german value").toBe("2024-12-15");
    expect(deQuestion.survey.data, "german survey data").toEqual(enQuestion.survey.data);
  });

  test("saveMaskedValue stores a locale-independent value", () => {
    const deQuestion = createQuestion({ pattern: "dd.mm.yyyy", saveMaskedValue: true }, "de");
    deQuestion.inputValue = "15.MM.JJJJ";
    expect(deQuestion.inputValue, "the incomplete value is displayed").toBe("15.MM.JJJJ");
    expect(deQuestion.survey.data, "an incomplete value is not stored").toEqual({});

    deQuestion.inputValue = "15.12.2024";
    expect(deQuestion.survey.data, "german survey data").toEqual({ q1: "15.12.2024" });

    const enQuestion = createQuestion({ pattern: "dd.mm.yyyy", saveMaskedValue: true });
    enQuestion.inputValue = "15.12.2024";
    expect(enQuestion.survey.data, "english survey data").toEqual(deQuestion.survey.data);
  });

  test("Month and minute are both rendered as M", () => {
    const q = createQuestion({ pattern: "dd.mm.yyyy HH:MM" }, "de");
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.getMaskedValue(""), "the empty mask").toBe("TT.MM.JJJJ HH:MM");
    expect(maskInstance.getMaskedValue("2024-12-15T13:45"), "a complete value").toBe("15.12.2024 13:45");
    expect(maskInstance.getUnmaskedValue("15.12.2024 13:45"), "the unmasked value").toBe("2024-12-15T13:45");

    const steps = typeDigits(maskInstance, "151220241345");
    expect(steps[steps.length - 1].value, "the typed value").toBe("15.12.2024 13:45");
    expect(maskInstance._getMaskedValue("15.12.2024 13:MM"), "an entered month with an empty minute").toBe("15.12.2024 13:MM");
  });

  test("12/24-hour behavior and time markers are unchanged in another locale", () => {
    const mask12 = <InputMaskDateTime>createQuestion({ pattern: "hh:MM tt" }, "de").maskSettings;
    expect(mask12.getMaskedValue(""), "the 12-hour empty mask").toBe("hh:MM tt");
    expect(mask12.getMaskedValue("13:45"), "a pm value").toBe("01:45 pm");
    expect(mask12.getUnmaskedValue("01:45 pm"), "the unmasked pm value").toBe("13:45");

    const mask12Upper = <InputMaskDateTime>createQuestion({ pattern: "hh:MM TT" }, "de").maskSettings;
    expect(mask12Upper.getMaskedValue(""), "the upper case empty mask").toBe("hh:MM TT");
    expect(mask12Upper.getMaskedValue("13:45"), "an upper case pm value").toBe("01:45 PM");

    const mask24 = <InputMaskDateTime>createQuestion({ pattern: "HH:MM" }, "de").maskSettings;
    expect(mask24.getMaskedValue(""), "the 24-hour empty mask").toBe("HH:MM");
    expect(mask24.getMaskedValue("13:45"), "a 24-hour value").toBe("13:45");
  });

  test("An invalid placeholder symbol falls back to the canonical character", () => {
    const q = createQuestion({ pattern: "dd.mm.yyyy" }, "de");
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.getMaskedValue(""), "a valid symbol").toBe("TT.MM.JJJJ");

    germanSurveyStrings["maskPlaceholderDay"] = "1";
    germanSurveyStrings["maskPlaceholderMonth"] = "Mon";
    germanSurveyStrings["maskPlaceholderYear"] = "";
    maskInstance.localeChanged();
    expect(maskInstance.getMaskedValue(""), "a digit, a multi-character and an empty symbol").toBe("dd.mm.yyyy");
  });

  test("A time marker symbol that collides with entered data is invalid", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM tt";
    expect(maskInstance["isPlaceholderSymbolValid"]("v", "timeMarkerLower"), "a neutral symbol").toBe(true);
    expect(maskInstance["isPlaceholderSymbolValid"]("a", "timeMarkerLower"), "cleanTimeMarker treats it as data").toBe(false);
    expect(maskInstance["isPlaceholderSymbolValid"]("P", "timeMarkerUpper"), "cleanTimeMarker treats it as data").toBe(false);
    expect(maskInstance["isPlaceholderSymbolValid"]("m", "timeMarkerLower"), "cleanTimeMarker treats it as data").toBe(false);
    expect(maskInstance["isPlaceholderSymbolValid"]("m", "month"), "a month symbol may be any letter").toBe(true);
  });
});
