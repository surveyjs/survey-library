import { FunctionFactory } from "../../src/functionsfactory";
import { JsonObject, Serializer } from "../../src/jsonobject";
import { InputMaskDateTime, getDateTimeLexems } from "../../src/mask/mask_datetime";
import { getLocaleDataValue, localeData } from "../../src/locale-data";
import { QuestionMultipleTextModel } from "../../src/question_multipletext";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { QuestionTextModel } from "../../src/question_text";
import { SurveyModel } from "../../src/survey";
import { settings } from "../../src/settings";

import { surveyLocalization } from "../../src/surveyStrings";
import { germanSurveyStrings } from "../../src/localization/german";
import "../../src/localization/hungarian";

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
    expect(deSymbols.join(""), "german symbols").toBe("TMJhHmsvV");

    surveyLocalization.currentLocale = "hu";
    maskInstance.localeChanged();
    const huSymbols = maskInstance["lexems"].filter(l => l.type !== "separator").map(l => maskInstance.getPlaceholderSymbol(l));
    expect(huSymbols.join(""), "a locale without mask strings falls back to english").toBe("dmyhHMstT");
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

  test("Month and minute are told apart by the symbol case", () => {
    const q = createQuestion({ pattern: "dd.mm.yyyy HH:MM" }, "de");
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.getMaskedValue(""), "the empty mask").toBe("TT.MM.JJJJ HH:mm");
    expect(maskInstance.getMaskedValue("2024-12-15T13:45"), "a complete value").toBe("15.12.2024 13:45");
    expect(maskInstance.getUnmaskedValue("15.12.2024 13:45"), "the unmasked value").toBe("2024-12-15T13:45");

    const steps = typeDigits(maskInstance, "151220241345");
    expect(steps[steps.length - 1].value, "the typed value").toBe("15.12.2024 13:45");
    expect(maskInstance._getMaskedValue("15.12.2024 13:mm"), "an entered hour with an empty minute").toBe("15.12.2024 13:mm");
  });

  test("12/24-hour behavior and time markers are unchanged in another locale", () => {
    const mask12 = <InputMaskDateTime>createQuestion({ pattern: "hh:MM tt" }, "de").maskSettings;
    expect(mask12.getMaskedValue(""), "the 12-hour empty mask").toBe("hh:mm vv");
    expect(mask12.getMaskedValue("13:45"), "a pm value").toBe("01:45 pm");
    expect(mask12.getUnmaskedValue("01:45 pm"), "the unmasked pm value").toBe("13:45");

    const mask12Upper = <InputMaskDateTime>createQuestion({ pattern: "hh:MM TT" }, "de").maskSettings;
    expect(mask12Upper.getMaskedValue(""), "the upper case empty mask").toBe("hh:mm VV");
    expect(mask12Upper.getMaskedValue("13:45"), "an upper case pm value").toBe("01:45 PM");

    const mask24 = <InputMaskDateTime>createQuestion({ pattern: "HH:MM" }, "de").maskSettings;
    expect(mask24.getMaskedValue(""), "the 24-hour empty mask").toBe("HH:mm");
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

describe("Datetime mask: locale date preset", () => {
  const createPresetQuestion = (maskSettings: any, locale?: string): QuestionTextModel => {
    const json = { patternPreset: "localeDate", ...maskSettings };
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime", maskSettings: json }] });
    if (!!locale) survey.locale = locale;
    return <QuestionTextModel>survey.getQuestionByName("q1");
  };

  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("A locale date pattern is resolved from the locale-data registry", () => {
    expect(getLocaleDataValue("en", "datePattern"), "en").toBe("mm/dd/yyyy");
    expect(getLocaleDataValue("en-GB", "datePattern"), "a regional entry, case-insensitive").toBe("dd/mm/yyyy");
    expect(getLocaleDataValue("de", "datePattern"), "de").toBe("dd.mm.yyyy");
    expect(getLocaleDataValue("ja", "datePattern"), "ja").toBe("yyyy/mm/dd");
    expect(getLocaleDataValue("de-CH", "datePattern"), "a regional locale falls back to its language entry").toBe("dd.mm.yyyy");
    expect(getLocaleDataValue("", "datePattern"), "an empty locale resolves to english").toBe("mm/dd/yyyy");
    expect(getLocaleDataValue("zz", "datePattern"), "an unknown locale resolves to english").toBe("mm/dd/yyyy");
  });

  test("SurveyJS registry codes are the map keys, aliases are normalized", () => {
    // "mm" is Burmese and "tel" is Telugu in the SurveyJS registry; "cz" is an alias of "cs"
    expect(getLocaleDataValue("mm", "datePattern"), "burmese").toBe("dd/mm/yyyy");
    expect(getLocaleDataValue("tel", "datePattern"), "telugu").toBe("dd-mm-yyyy");
    expect(getLocaleDataValue("cz", "datePattern"), "czech via the alias").toBe("dd. mm. yyyy");
    expect(getLocaleDataValue("ht", "datePattern"), "haitian creole is curated").toBe("dd/mm/yyyy");
  });

  test("Per-field fallback and invalid entries fall through the chain", () => {
    const enData = localeData["en"];
    try {
      localeData["en"] = { ...enData, timePattern: "HH:MM" };
      localeData["zz-yy"] = { datePattern: "!!!" };
      expect(getLocaleDataValue("en-gb", "timePattern"), "a field the regional entry lacks resolves through en").toBe("HH:MM");
      expect(getLocaleDataValue("en-gb", "datePattern"), "the field it defines stays regional").toBe("dd/mm/yyyy");
      const hasDatePart = (pattern: string): boolean => getDateTimeLexems(pattern).some(l => l.type === "day" || l.type === "month" || l.type === "year");
      expect(getLocaleDataValue("zz-yy", "datePattern", hasDatePart), "an entry the validator rejects is ignored").toBe("mm/dd/yyyy");
      expect(getLocaleDataValue("zz-yy", "datePattern"), "without a validator the raw entry wins").toBe("!!!");
    } finally {
      localeData["en"] = enData;
      delete localeData["zz-yy"];
    }
  });

  test("The pinned date pattern table for every locale-data entry", () => {
    const expected: { [locale: string]: string } = {
      "ar": "dd/mm/yyyy", "bg": "dd.mm.yyyy", "ca": "dd/mm/yyyy", "cs": "dd. mm. yyyy",
      "cy": "dd/mm/yyyy", "da": "dd.mm.yyyy", "de": "dd.mm.yyyy", "el": "dd/mm/yyyy",
      "en": "mm/dd/yyyy", "en-au": "dd/mm/yyyy", "en-ca": "yyyy-mm-dd", "en-gb": "dd/mm/yyyy",
      "en-ie": "dd/mm/yyyy", "en-in": "dd/mm/yyyy", "en-nz": "dd/mm/yyyy", "en-za": "yyyy/mm/dd",
      "es": "dd/mm/yyyy", "et": "dd.mm.yyyy", "eu": "yyyy/mm/dd", "fa": "yyyy/mm/dd",
      "fi": "dd.mm.yyyy", "fil": "mm/dd/yyyy", "fr": "dd/mm/yyyy", "fr-ca": "yyyy-mm-dd",
      "fr-ch": "dd.mm.yyyy", "he": "dd.mm.yyyy", "hi": "dd/mm/yyyy", "hr": "dd. mm. yyyy",
      "ht": "dd/mm/yyyy", "hu": "yyyy. mm. dd", "id": "dd/mm/yyyy", "is": "dd.mm.yyyy",
      "it": "dd/mm/yyyy", "ja": "yyyy/mm/dd", "ka": "dd.mm.yyyy", "kk": "dd.mm.yyyy",
      "ko": "yyyy. mm. dd", "lt": "yyyy-mm-dd", "lv": "dd.mm.yyyy", "mk": "dd.mm.yyyy",
      "mm": "dd/mm/yyyy", "ms": "dd/mm/yyyy", "nl": "dd-mm-yyyy", "nl-be": "dd/mm/yyyy",
      "no": "dd.mm.yyyy", "pl": "dd.mm.yyyy", "pt": "dd/mm/yyyy", "pt-br": "dd/mm/yyyy",
      "ro": "dd.mm.yyyy", "ru": "dd.mm.yyyy", "sk": "dd. mm. yyyy", "sl": "dd. mm. yyyy",
      "sr": "dd.mm.yyyy", "sv": "yyyy-mm-dd", "sw": "dd/mm/yyyy", "tel": "dd-mm-yyyy",
      "tg": "dd/mm/yyyy", "th": "dd/mm/yyyy", "tr": "dd.mm.yyyy", "uk": "dd.mm.yyyy",
      "ur": "dd/mm/yyyy", "vi": "dd/mm/yyyy", "zh": "yyyy/mm/dd", "zh-cn": "yyyy/mm/dd",
      "zh-tw": "yyyy/mm/dd"
    };
    Object.keys(expected).forEach(loc => {
      expect(getLocaleDataValue(loc, "datePattern"), loc).toBe(expected[loc]);
    });
    Object.keys(localeData).forEach(loc => {
      expect(expected[loc], "the pinned table misses the registry entry: " + loc).toBeDefined();
      const pattern = localeData[loc].datePattern;
      const lexems = getDateTimeLexems(pattern);
      expect(lexems.some(l => l.type === "day" || l.type === "month" || l.type === "year"), loc + " is valid canonical grammar: " + pattern).toBe(true);
    });
    // the registered dictionary locales all resolve through the chain
    ["nl-BE", "pt-br", "zh-cn", "zh-tw"].forEach(loc => {
      expect(getLocaleDataValue(loc, "datePattern"), loc).toBeDefined();
    });
  });

  test("A locale date pattern is resolved without DOM or Intl access", () => {
    const globals = <any>globalThis;
    const window = globals.window;
    const document = globals.document;
    const dateTimeFormat = globals.Intl.DateTimeFormat;
    try {
      delete globals.window;
      delete globals.document;
      // a small-icu server or an edge runtime must produce the identical pattern
      globals.Intl.DateTimeFormat = function () { throw new Error("Intl must not be used at runtime"); };
      expect(getLocaleDataValue("de", "datePattern"), "resolved without Intl").toBe("dd.mm.yyyy");
      const q = createPresetQuestion({}, "de");
      expect(q.inputValue, "the mask renders without DOM or Intl").toBe("TT.MM.JJJJ");
    } finally {
      globals.window = window;
      globals.document = document;
      globals.Intl.DateTimeFormat = dateTimeFormat;
    }
  });

  test("An authored pattern outranks the preset", () => {
    const q = createPresetQuestion({ pattern: "yyyy-mm-dd" }, "de");
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.activePattern, "the authored pattern wins").toBe("yyyy-mm-dd");
    expect(q.inputValue, "rendered with the authored pattern").toBe("JJJJ-MM-TT");
  });

  test("The preset is the default for a datetime mask without settings", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime" }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.patternPreset, "the default value").toBe("localeDate");
    expect(maskInstance.activePattern, "the english locale pattern").toBe("mm/dd/yyyy");
    expect(q.inputValue, "a working mask out of the box").toBe("mm/dd/yyyy");

    survey.locale = "de";
    expect(q.inputValue, "the german mask").toBe("TT.MM.JJJJ");
    q.inputValue = "25.12.2000";
    expect(q.value, "the stored value").toBe("2000-12-25");
  });

  test("The mask degrades to inert when no pattern can be resolved", () => {
    const enData = localeData["en"];
    const maskInstance = new InputMaskDateTime();
    try {
      delete localeData["en"];
      expect(maskInstance.activePattern, "nothing resolves").toBe("");
      expect(maskInstance.getMaskedValue(""), "the empty mask").toBe("");
      let res = maskInstance.processInput({ insertedChars: "a", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
      expect(res.value, "typing a letter does not crash").toBe("");
      res = maskInstance.processInput({ insertedChars: "1", selectionStart: 0, selectionEnd: 0, prevValue: "", inputDirection: "forward" });
      expect(res.value, "typing a digit does not crash").toBe("");
    } finally {
      localeData["en"] = enData;
    }
  });

  test("An empty mask uses the locale field order and the localized placeholder symbols", () => {
    const q = createPresetQuestion({});
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.activePattern, "the english active pattern").toBe("mm/dd/yyyy");
    expect(maskInstance.getMaskedValue(""), "the english empty mask").toBe("mm/dd/yyyy");

    q.survey.locale = "de";
    expect(maskInstance.activePattern, "the german active pattern is canonical").toBe("dd.mm.yyyy");
    expect(maskInstance.getMaskedValue(""), "the german empty mask").toBe("TT.MM.JJJJ");
    expect(maskInstance.pattern, "the authored pattern is not rewritten").toBeFalsy();
  });

  test("Switching locale at runtime updates an empty input", () => {
    const q = createPresetQuestion({});
    expect(q.inputValue, "english").toBe("mm/dd/yyyy");

    q.survey.locale = "de";
    expect(q.inputValue, "german").toBe("TT.MM.JJJJ");

    q.survey.locale = "ja";
    expect(q.inputValue, "japanese").toBe("yyyy/mm/dd");

    q.survey.locale = "";
    expect(q.inputValue, "back to english").toBe("mm/dd/yyyy");
  });

  test("A partial value is preserved by semantic role when the field order changes", () => {
    const q = createPresetQuestion({});
    q.inputValue = "12/25/yyyy";
    expect(q.inputValue, "the english entry").toBe("12/25/yyyy");
    expect(q.isEmpty(), "an incomplete value is not stored").toBe(true);

    q.survey.locale = "de";
    expect(q.inputValue, "the month stays a month and the day stays a day").toBe("25.12.JJJJ");

    q.survey.locale = "ja";
    expect(q.inputValue, "a year-first locale").toBe("yyyy/12/25");

    q.survey.locale = "";
    expect(q.inputValue, "back to english").toBe("12/25/yyyy");
  });

  test("A completed value is the same date after a locale switch", () => {
    const q = createPresetQuestion({});
    q.inputValue = "12/25/2000";
    expect(q.value, "the english value").toBe("2000-12-25");
    expect(q.inputValue, "the english input").toBe("12/25/2000");

    q.survey.locale = "de";
    expect(q.value, "the value did not change").toBe("2000-12-25");
    expect(q.inputValue, "the german input").toBe("25.12.2000");
    expect(q.survey.data, "survey data is identical across locales").toEqual({ q1: "2000-12-25" });
  });

  test("saveMaskedValue rewrites the stored value into the format of the new locale", () => {
    const q = createPresetQuestion({ saveMaskedValue: true });
    q.inputValue = "12/25/2000";
    expect(q.survey.data, "the english survey data").toEqual({ q1: "12/25/2000" });

    q.survey.locale = "de";
    // the stored text is a rendering of the date, so it follows the mask instead of being
    // reinterpreted as a german date (25 would become a month otherwise)
    expect(q.survey.data, "the german survey data keeps the same date").toEqual({ q1: "25.12.2000" });
    expect(q.inputValue, "the german input").toBe("25.12.2000");

    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.getUnmaskedValue(q.value), "the stored value is still the same date").toBe("2000-12-25");
  });

  test("A locale switch does not change a stored value when the pattern is unchanged", () => {
    const q = createPresetQuestion({ saveMaskedValue: true }, "en-GB");
    q.inputValue = "25/12/2000";
    expect(q.survey.data, "the en-GB survey data").toEqual({ q1: "25/12/2000" });

    q.survey.locale = "fr";
    expect((<InputMaskDateTime>q.maskSettings).activePattern, "the same active pattern").toBe("dd/mm/yyyy");
    expect(q.survey.data, "the stored value is untouched").toEqual({ q1: "25/12/2000" });
  });

  test("Two surveys with different locales do not affect one another", () => {
    const enQuestion = createPresetQuestion({});
    const deQuestion = createPresetQuestion({}, "de");
    expect(enQuestion.inputValue, "english").toBe("mm/dd/yyyy");
    expect(deQuestion.inputValue, "german").toBe("TT.MM.JJJJ");

    enQuestion.survey.locale = "ja";
    expect(enQuestion.inputValue, "japanese").toBe("yyyy/mm/dd");
    expect(deQuestion.inputValue, "the other survey is unchanged").toBe("TT.MM.JJJJ");
  });

  test("The preset reaches a datetime mask in a multiple text item and in a matrix cell", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext", name: "q1",
          items: [{ name: "i1", maskType: "datetime", maskSettings: { patternPreset: "localeDate" } }]
        },
        {
          type: "matrixdropdown", name: "q2",
          columns: [{ name: "c1", cellType: "text", maskType: "datetime", maskSettings: { patternPreset: "localeDate" } }],
          rows: ["r1"]
        }
      ]
    });
    const editor = <QuestionTextModel>(<QuestionMultipleTextModel>survey.getQuestionByName("q1")).items[0].editor;
    const cell = <QuestionTextModel>(<QuestionMatrixDropdownModel>survey.getQuestionByName("q2")).visibleRows[0].cells[0].question;
    expect(editor.inputValue, "the english multiple text item").toBe("mm/dd/yyyy");
    expect(cell.inputValue, "the english matrix cell").toBe("mm/dd/yyyy");

    survey.locale = "de";
    expect(editor.inputValue, "the german multiple text item").toBe("TT.MM.JJJJ");
    expect(cell.inputValue, "the german matrix cell").toBe("TT.MM.JJJJ");
  });

  test("A locale with a multi-character separator is entered and parsed", () => {
    const q = createPresetQuestion({}, "cs");
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.activePattern, "the czech active pattern").toBe("dd. mm. yyyy");
    expect(maskInstance.getMaskedValue(""), "the czech empty mask").toBe("dd. mm. yyyy");
    expect(maskInstance.getMaskedValue("2000-12-25"), "a complete value").toBe("25. 12. 2000");
    expect(maskInstance.getUnmaskedValue("25. 12. 2000"), "the unmasked value").toBe("2000-12-25");
    expect(maskInstance._getMaskedValue("25. mm. yyyy"), "an entered day").toBe("25. mm. yyyy");

    q.inputValue = "25. 12. 2000";
    expect(q.value, "the stored value").toBe("2000-12-25");
  });

  test("An authored pattern with a multi-character separator keeps every separator character", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "dd - mm - yyyy";
    expect(maskInstance.getMaskedValue(""), "the empty mask").toBe("dd - mm - yyyy");
    expect(maskInstance.getMaskedValue("2000-12-25"), "a complete value").toBe("25 - 12 - 2000");
    expect(maskInstance.getUnmaskedValue("25 - 12 - 2000"), "the unmasked value").toBe("2000-12-25");
    expect(maskInstance._getMaskedValue("25 - 12 - 2000"), "a re-parsed value").toBe("25 - 12 - 2000");
  });

  test("min and max work on a preset mask without an authored pattern", () => {
    const q = createPresetQuestion({ min: "1990-01-01", max: "2010-12-31" }, "de");
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.pattern, "there is no authored pattern").toBeFalsy();
    expect(maskInstance.activePattern, "the active pattern is generated").toBe("dd.mm.yyyy");

    const minMaxProperty = Serializer.findProperty("datetimemask", "min");
    expect(minMaxProperty.isEnable(maskInstance), "min is enabled").toBe(true);
    expect(maskInstance._getMaskedValue("25.12.1980"), "a year below min is rejected").toBe("25.12.19JJ");
    expect(maskInstance._getMaskedValue("25.12.2000"), "a year in range is accepted").toBe("25.12.2000");
  });

  test("Serialize and deserialize the patternPreset property", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "datetime";
    expect((<InputMaskDateTime>q.maskSettings).patternPreset, "the default").toBe("localeDate");
    expect(q.toJSON(), "the default does not serialize").toEqual({ name: "q1", maskType: "datetime" });

    q.maskSettings["pattern"] = "mm/dd/yyyy";
    expect(q.toJSON(), "only the authored pattern serializes").toEqual({
      name: "q1",
      maskType: "datetime",
      maskSettings: { pattern: "mm/dd/yyyy" }
    });

    const q2 = new QuestionTextModel("q2");
    // tier-02-era JSON with the value spelled out still loads and equals the new default
    q2.fromJSON({ name: "q2", maskType: "datetime", maskSettings: { patternPreset: "localeDate" } });
    const maskInstance = <InputMaskDateTime>q2.maskSettings;
    expect(maskInstance.patternPreset, "the preset is loaded").toBe("localeDate");
    expect(maskInstance.pattern, "the generated pattern is not stored as the authored one").toBeFalsy();
    expect(maskInstance.activePattern, "the generated pattern is runtime state").toBe("mm/dd/yyyy");
    expect(q2.toJSON(), "it re-serializes to nothing").toEqual({ name: "q2", maskType: "datetime" });

    const presetProperty = Serializer.findProperty("datetimemask", "patternPreset");
    expect(presetProperty.visible, "hidden from the property grid for now").toBe(false);
    expect(presetProperty.getChoices(null), "the pattern sources").toEqual(["localeDate", "localeTime", "localeDateTime"]);
  });

  test("A survey without the preset keeps its authored pattern", () => {
    const q = new QuestionTextModel("q1");
    q.fromJSON({ name: "q1", maskType: "datetime", maskSettings: { pattern: "mm/dd/yyyy" } });
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime", maskSettings: { pattern: "mm/dd/yyyy" } }] });
    const surveyQuestion = <QuestionTextModel>survey.getQuestionByName("q1");

    expect(maskInstance.activePattern, "the authored pattern is active").toBe("mm/dd/yyyy");
    expect(surveyQuestion.inputValue, "the english rendering").toBe("mm/dd/yyyy");

    survey.locale = "de";
    expect((<InputMaskDateTime>surveyQuestion.maskSettings).activePattern, "the pattern does not follow the locale").toBe("mm/dd/yyyy");
    expect(surveyQuestion.inputValue, "only the placeholder symbols are localized").toBe("MM/TT/JJJJ");
  });
});

describe("Datetime mask: regionLocale", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("Formats resolve with regionLocale || locale; strings and symbols do not follow it", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", title: { en: "Enter a date", de: "Datum" }, maskType: "datetime" }]
    });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(q.inputValue, "no regionLocale: english order").toBe("mm/dd/yyyy");

    survey.regionLocale = "en-GB";
    expect(survey.getFormatLocale(), "the format locale").toBe("en-GB");
    expect(q.inputValue, "british order with english symbols").toBe("dd/mm/yyyy");
    expect(q.locTitle.renderedHtml, "strings follow locale").toBe("Enter a date");

    survey.regionLocale = "de";
    expect(q.inputValue, "german order, still english symbols").toBe("dd.mm.yyyy");
    expect(q.locTitle.renderedHtml, "still the english title").toBe("Enter a date");

    survey.locale = "de";
    expect(q.inputValue, "the german locale brings the german symbols").toBe("TT.MM.JJJJ");
    expect(q.locTitle.renderedHtml, "the german title").toBe("Datum");
  });

  test("Changing regionLocale rerenders and preserves a partial entry by semantic role", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime" }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    q.inputValue = "12/25/yyyy";
    expect(q.isEmpty(), "an incomplete value is not stored").toBe(true);

    survey.regionLocale = "en-GB";
    expect(q.inputValue, "day and month keep their semantic roles").toBe("25/12/yyyy");

    survey.regionLocale = "";
    expect(q.inputValue, "back to the english order").toBe("12/25/yyyy");
  });

  test("regionLocale lookups are case-insensitive and alias-aware", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime" }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");

    survey.regionLocale = "EN-GB";
    expect(q.inputValue, "upper-cased region code").toBe("dd/mm/yyyy");

    survey.regionLocale = "cz";
    expect(q.inputValue, "the cz alias resolves to czech").toBe("dd. mm. yyyy");
  });

  test("regionLocale is serializable but hidden from the property grid", () => {
    const regionLocaleProperty = Serializer.findProperty("survey", "regionLocale");
    expect(regionLocaleProperty.visible, "hidden").toBe(false);

    const survey = new SurveyModel({ regionLocale: "en-GB", elements: [{ type: "text", name: "q1", maskType: "datetime" }] });
    expect(survey.regionLocale, "loaded from JSON").toBe("en-GB");
    expect((<QuestionTextModel>survey.getQuestionByName("q1")).inputValue, "applied on load").toBe("dd/mm/yyyy");
    expect(survey.toJSON().regionLocale, "round-trips").toBe("en-GB");

    const plainSurvey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    expect(plainSurvey.toJSON().regionLocale, "the empty default does not serialize").toBeUndefined();
  });

  test("regionLocale reaches a multiple text item and a matrix cell", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext", name: "q1",
          items: [{ name: "i1", maskType: "datetime" }]
        },
        {
          type: "matrixdropdown", name: "q2",
          columns: [{ name: "c1", cellType: "text", maskType: "datetime" }],
          rows: ["r1"]
        }
      ]
    });
    const editor = <QuestionTextModel>(<QuestionMultipleTextModel>survey.getQuestionByName("q1")).items[0].editor;
    const cell = <QuestionTextModel>(<QuestionMatrixDropdownModel>survey.getQuestionByName("q2")).visibleRows[0].cells[0].question;
    expect(editor.inputValue, "the english multiple text item").toBe("mm/dd/yyyy");
    expect(cell.inputValue, "the english matrix cell").toBe("mm/dd/yyyy");

    survey.regionLocale = "en-GB";
    expect(editor.inputValue, "the british multiple text item").toBe("dd/mm/yyyy");
    expect(cell.inputValue, "the british matrix cell").toBe("dd/mm/yyyy");
  });

  test("A locale change preserves an entry that exists only in the input element", () => {
    // under the on-blur update mode masked keystrokes go into the element directly and reach
    // _inputValue only on blur; a programmatic locale change must not discard them
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime" }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const input = document.createElement("input");
    document.body.appendChild(input);
    q.afterRenderQuestionElement(input);
    try {
      const adapter: any = q["maskInputAdapter"];
      input.focus();
      input.setSelectionRange(0, 0);
      "1225".split("").forEach(ch => adapter.beforeInputHandler({ data: ch, inputType: "insertText", target: input, preventDefault: (): void => {} }));
      expect(input.value, "the in-progress entry").toBe("12/25/yyyy");
      expect(q.isEmpty(), "nothing is stored before the blur").toBe(true);

      survey.regionLocale = "en-GB";
      expect(input.value, "preserved by semantic role without a blur").toBe("25/12/yyyy");
      expect(q.inputValue, "the model followed the element").toBe("25/12/yyyy");

      survey.regionLocale = "";
      expect(input.value, "and back").toBe("12/25/yyyy");

      // without focus the element cannot be mid-entry: the model is authoritative, exactly as
      // when inputValue is assigned programmatically and the element has not rerendered yet
      input.blur();
      q.inputValue = "03/15/yyyy";
      survey.regionLocale = "en-GB";
      expect(input.value, "an unfocused element follows the model").toBe("15/03/yyyy");
    } finally {
      q.beforeDestroyQuestionElement(input);
      input.remove();
    }
  });

  test("A locale change keeps an untouched input cleared for its placeholder", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime" }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const input = document.createElement("input");
    input.placeholder = "enter a date";
    document.body.appendChild(input);
    q.afterRenderQuestionElement(input);
    try {
      expect(input.value, "the element is cleared so the placeholder shows").toBe("");

      survey.regionLocale = "en-GB";
      expect(input.value, "still cleared").toBe("");
      expect(q.inputValue, "the empty mask follows the new locale").toBe("dd/mm/yyyy");
    } finally {
      q.beforeDestroyQuestionElement(input);
      input.remove();
    }
  });
});

describe("Datetime mask: locale time and datetime presets", () => {
  const createPresetQuestion = (maskSettings: any, locale?: string): QuestionTextModel => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime", maskSettings: maskSettings }] });
    if (!!locale) survey.locale = locale;
    return <QuestionTextModel>survey.getQuestionByName("q1");
  };

  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("The pinned time pattern table for every locale-data entry", () => {
    // 12-hour only where the locale writes the marker as the latin AM/PM the mask accepts
    const hours12 = ["en", "en-au", "en-ca", "en-in", "en-nz", "fil"];
    Object.keys(localeData).forEach(loc => {
      const expected = hours12.indexOf(loc) !== -1 ? "hh:MM TT" : "HH:MM";
      expect(getLocaleDataValue(loc, "timePattern"), loc).toBe(expected);
      expect(localeData[loc].timePattern, "every entry defines a time pattern: " + loc).toBeDefined();
    });
    expect(getLocaleDataValue("de-CH", "timePattern"), "a regional locale falls back to its language").toBe("HH:MM");
    expect(getLocaleDataValue("zz", "timePattern"), "an unknown locale resolves to english").toBe("hh:MM TT");
    expect(localeData["en"].datePattern, "en defines every shipped field").toBeDefined();
    expect(localeData["en"].timePattern, "en defines every shipped field").toBeDefined();
  });

  test("The localeTime preset renders the locale time pattern", () => {
    const usQuestion = createPresetQuestion({ patternPreset: "localeTime" });
    expect(usQuestion.inputValue, "the english empty mask").toBe("hh:MM TT");
    usQuestion.inputValue = "03:30 PM";
    expect(usQuestion.value, "the stored value").toBe("15:30");

    const deQuestion = createPresetQuestion({ patternPreset: "localeTime" }, "de");
    expect(deQuestion.inputValue, "the german empty mask is 24-hour").toBe("HH:mm");
    deQuestion.inputValue = "15:30";
    expect(deQuestion.value, "the stored value is identical across locales").toBe("15:30");
  });

  test("The localeDateTime preset composes the date and the time pattern", () => {
    const usMask = <InputMaskDateTime>createPresetQuestion({ patternPreset: "localeDateTime" }).maskSettings;
    expect(usMask.activePattern, "the composed english pattern").toBe("mm/dd/yyyy hh:MM TT");
    expect(usMask.getMaskedValue("2000-12-25T15:30:00"), "a complete english value").toBe("12/25/2000 03:30 PM");
    expect(usMask.getUnmaskedValue("12/25/2000 03:30 PM"), "the unmasked value").toBe("2000-12-25T15:30");

    const csMask = <InputMaskDateTime>createPresetQuestion({ patternPreset: "localeDateTime" }, "cs").maskSettings;
    expect(csMask.activePattern, "a multi-character separator survives the composition").toBe("dd. mm. yyyy HH:MM");
    expect(csMask.getMaskedValue("2000-12-25T15:30:00"), "a complete czech value").toBe("25. 12. 2000 15:30");
    expect(csMask.getUnmaskedValue("25. 12. 2000 15:30"), "the unmasked value").toBe("2000-12-25T15:30");
  });

  test("The time presets follow regionLocale and are outranked by an authored pattern", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", maskType: "datetime", maskSettings: { patternPreset: "localeTime" } }]
    });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(q.inputValue, "english").toBe("hh:MM TT");

    survey.regionLocale = "en-GB";
    expect(q.inputValue, "the british format locale").toBe("HH:MM");

    const authored = <InputMaskDateTime>createPresetQuestion({ patternPreset: "localeTime", pattern: "HH:MM:ss" }).maskSettings;
    expect(authored.activePattern, "the authored pattern wins").toBe("HH:MM:ss");
  });

  test("A preset value is resolved whatever its case", () => {
    const cases: Array<[string, string]> = [
      ["localedate", "dd.mm.yyyy"],
      ["LOCALEDATE", "dd.mm.yyyy"],
      ["localetime", "HH:MM"],
      ["localedatetime", "dd.mm.yyyy HH:MM"],
      ["localeDateTime", "dd.mm.yyyy HH:MM"]
    ];
    cases.forEach(([preset, pattern]) => {
      const q = createPresetQuestion({ patternPreset: preset }, "de");
      expect((<InputMaskDateTime>q.maskSettings).activePattern, preset).toBe(pattern);
    });
  });

  test("An unrecognized preset leaves the mask without a pattern", () => {
    const q = createPresetQuestion({ patternPreset: "localeWeek" }, "de");
    const maskInstance = <InputMaskDateTime>q.maskSettings;
    expect(maskInstance.activePattern, "no pattern is generated").toBe("");
    expect(maskInstance.getMaskedValue(""), "the empty mask").toBe("");
    expect(q.inputValue, "the rendered input").toBe("");

    maskInstance.pattern = "dd.mm.yyyy";
    expect(maskInstance.activePattern, "an authored pattern still applies").toBe("dd.mm.yyyy");
    expect(maskInstance.getMaskedValue(""), "the empty mask").toBe("TT.MM.JJJJ");
  });

  test("An invalid locale time pattern falls through the chain", () => {
    const deData = localeData["de"];
    try {
      // a date lexem, a marker the mask cannot parse because it precedes the hour, and a
      // pattern without a minute are all rejected in favour of the english entry
      ["dd/mm/yyyy", "tt hh:MM", "HH"].forEach(pattern => {
        localeData["de"] = { ...deData, timePattern: pattern };
        const maskInstance = <InputMaskDateTime>createPresetQuestion({ patternPreset: "localeTime" }, "de").maskSettings;
        expect(maskInstance.activePattern, "rejected: " + pattern).toBe("hh:MM TT");
      });

      localeData["de"] = { ...deData, timePattern: "HH:MM:ss" };
      const withSeconds = <InputMaskDateTime>createPresetQuestion({ patternPreset: "localeTime" }, "de").maskSettings;
      expect(withSeconds.activePattern, "a valid entry with seconds is accepted").toBe("HH:MM:ss");
    } finally {
      localeData["de"] = deData;
    }
  });

  test("A partial time is converted between the 12- and the 24-hour clock", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", maskType: "datetime", maskSettings: { patternPreset: "localeTime" } }]
    });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    q.inputValue = "03:30 pm";
    expect(q.isEmpty(), "an incomplete marker entry is not stored").toBe(false);

    survey.regionLocale = "de";
    expect(q.inputValue, "3:30 pm is 15:30 on a 24-hour clock").toBe("15:30");

    survey.regionLocale = "";
    expect(q.inputValue, "and back again").toBe("03:30 PM");
  });

  test("Midnight and noon survive the 12/24-hour conversion", () => {
    const mask12 = new InputMaskDateTime();
    mask12.pattern = "hh:MM TT";
    const mask24 = new InputMaskDateTime();
    mask24.pattern = "HH:MM";

    const to24 = (entered: string): string => mask24.getMaskedValueByFragments(mask12.getInputFragments(entered), true);
    expect(to24("12:30 AM"), "12:30 am is 00:30").toBe("00:30");
    expect(to24("12:30 PM"), "12:30 pm is 12:30").toBe("12:30");
    expect(to24("03:30 PM"), "3:30 pm is 15:30").toBe("15:30");
    expect(to24("03:30 AM"), "3:30 am is 03:30").toBe("03:30");

    const to12 = (entered: string): string => mask12.getMaskedValueByFragments(mask24.getInputFragments(entered), false);
    expect(to12("00:30"), "00:30 is 12:30 am").toBe("12:30 AM");
    expect(to12("12:30"), "12:30 is 12:30 pm").toBe("12:30 PM");
    expect(to12("15:30"), "15:30 is 3:30 pm, not a rejected hour").toBe("03:30 PM");
    expect(to12("09:30"), "09:30 is 9:30 am").toBe("09:30 AM");
  });

  test("An ambiguous partial hour is kept as entered", () => {
    const mask12 = new InputMaskDateTime();
    mask12.pattern = "hh:MM tt";
    const mask24 = new InputMaskDateTime();
    mask24.pattern = "HH:MM";

    // no marker yet: the entry means either of two times, so the hour is not converted
    expect(mask24.getMaskedValueByFragments(mask12.getInputFragments("03:30 tt"), true), "12-hour without a marker").toBe("03:30");
    // "1" may still become 13, so it is restored as the single digit it is - the second digit
    // is still the placeholder symbol, exactly as it was before the switch
    expect(mask12.getMaskedValueByFragments(mask24.getInputFragments("1H:30"), false), "a half-typed 24-hour hour").toBe("1h:30 tt");
  });

  test("A 12-hour value round-trips through midnight", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM TT";
    expect(maskInstance.getMaskedValue("00:45"), "midnight is rendered as 12 am").toBe("12:45 AM");
    expect(maskInstance.getMaskedValue("12:45"), "noon is rendered as 12 pm").toBe("12:45 PM");
    expect(maskInstance.getUnmaskedValue("12:45 AM"), "12:45 am is the zero hour").toBe("00:45");
    expect(maskInstance.getUnmaskedValue("12:45 PM"), "12:45 pm is noon").toBe("12:45");
    expect(maskInstance.getUnmaskedValue(maskInstance.getMaskedValue("00:45")), "the round trip").toBe("00:45");
  });

  test("Unmasking an entry that stops before the time marker does not crash", () => {
    const maskInstance = new InputMaskDateTime();
    maskInstance.pattern = "hh:MM tt";
    expect(maskInstance.getUnmaskedValue(""), "an empty entry").toBe("");
    expect(maskInstance.getUnmaskedValue("03:"), "an entry that stops mid-mask").toBe("");
    // a complete hour and minute make a time; an absent marker reads as the morning, as before
    expect(maskInstance.getUnmaskedValue("03:30"), "an entry without the marker part").toBe("03:30");
    expect(maskInstance.getUnmaskedValue("03:30 tt"), "an unfilled marker").toBe("03:30");

    const dateTimeMask = <InputMaskDateTime>createPresetQuestion({ patternPreset: "localeDateTime" }).maskSettings;
    expect(dateTimeMask.getUnmaskedValue("12/25/2000"), "only the date half is entered").toBe("");
  });

  test("min and max work on a time preset without an authored pattern", () => {
    const maskInstance = <InputMaskDateTime>createPresetQuestion({ patternPreset: "localeTime", min: "09:00", max: "17:00" }, "de").maskSettings;
    expect(maskInstance.activePattern, "the generated pattern").toBe("HH:MM");
    expect(Serializer.findProperty("datetimemask", "min").isEnable(maskInstance), "min is enabled").toBe(true);
    expect(maskInstance._getMaskedValue("10:30"), "a time in range").toBe("10:30");
    expect(maskInstance._getMaskedValue("23:30"), "an hour above max is rejected").toBe("HH:30");
  });

  test("The time presets serialize because they are not the default", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "datetime";
    (<InputMaskDateTime>q.maskSettings).patternPreset = "localeDateTime";
    expect(q.toJSON(), "a non-default preset serializes").toEqual({
      name: "q1",
      maskType: "datetime",
      maskSettings: { patternPreset: "localeDateTime" }
    });

    const q2 = new QuestionTextModel("q2");
    q2.fromJSON({ name: "q2", maskType: "datetime", maskSettings: { patternPreset: "localeTime" } });
    expect((<InputMaskDateTime>q2.maskSettings).activePattern, "loaded from JSON").toBe("hh:MM TT");
  });
});
