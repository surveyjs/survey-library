import { InputMaskDateTime, getDateTimeLexems } from "../../src/mask/mask_datetime";

export default QUnit.module("Datetime mask");

QUnit.test("getDateTimeLiterals simple pattern", function(assert) {
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

QUnit.test("getDateTimeLiterals simple pattern", function(assert) {
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

QUnit.test("parseDateTime valid string", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";

  let result = maskInstance._getMaskedValue("02/14/2024");
  assert.equal(result, "02/14/2024");

  result = maskInstance._getMaskedValue("2/4/2024");
  assert.equal(result, "02/04/2024");

  result = maskInstance._getMaskedValue("2");
  assert.equal(result, "02/dd/yyyy");

  result = maskInstance._getMaskedValue("2/");
  assert.equal(result, "02/dd/yyyy");

  result = maskInstance._getMaskedValue("2/4");
  assert.equal(result, "02/04/yyyy");

  result = maskInstance._getMaskedValue("2/4/");
  assert.equal(result, "02/04/yyyy");
});

QUnit.test("parseDateTime with validation", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";

  let result = maskInstance._getMaskedValue("13");
  assert.equal(result, "1m/dd/yyyy");

  result = maskInstance._getMaskedValue("02/33");
  assert.equal(result, "02/3d/yyyy");

  result = maskInstance._getMaskedValue("06/30");
  assert.equal(result, "06/30/yyyy");

  result = maskInstance._getMaskedValue("06/31");
  assert.equal(result, "06/3d/yyyy");

  result = maskInstance._getMaskedValue("02/29/2000");
  assert.equal(result, "02/29/2000");

  result = maskInstance._getMaskedValue("02/29/2001");
  assert.equal(result, "02/29/200y");
});

QUnit.test("parseDateTime invalid string", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";

  let result = maskInstance._getMaskedValue("02a/14/2024");
  assert.equal(result, "02/14/2024");

  result = maskInstance._getMaskedValue("2/4+/2024");
  assert.equal(result, "02/04/2024");

  result = maskInstance._getMaskedValue("2+");
  assert.equal(result, "02/dd/yyyy");

  // result = maskInstance._getMaskedValue("11/022/yyyy");
  // assert.equal(result, "11/02/yyyy");

  // result = maskInstance._getMaskedValue("11/002/yyyy");
  // assert.equal(result, "11/02/yyyy");
});

QUnit.test("get masked valid date text mm/dd/yyyy", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";
  maskInstance.dataToSave = "masked";
  assert.equal(maskInstance.getMaskedValue(""), "mm/dd/yyyy");
  assert.equal(maskInstance.getMaskedValue("1"), "1m/dd/yyyy");
  assert.equal(maskInstance.getMaskedValue("01"), "01/dd/yyyy");
  assert.equal(maskInstance.getMaskedValue("2"), "02/dd/yyyy");
  assert.equal(maskInstance.getMaskedValue("12/4"), "12/04/yyyy");
  assert.equal(maskInstance.getMaskedValue("12/34"), "12/3d/yyyy");
  assert.equal(maskInstance.getMaskedValue("12/30/198"), "12/30/198y");
  assert.equal(maskInstance.getMaskedValue("12/30/0001"), "12/30/0001");
  assert.equal(maskInstance.getMaskedValue("12/30/1987"), "12/30/1987");
});

QUnit.test("get masked valid date text m/d/yyyy", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "m/d/yyyy";
  maskInstance.dataToSave = "masked";
  assert.equal(maskInstance.getMaskedValue(""), "m/d/yyyy");
  assert.equal(maskInstance.getMaskedValue("1"), "1/d/yyyy");
  assert.equal(maskInstance.getMaskedValue("01"), "1/d/yyyy");
  assert.equal(maskInstance.getMaskedValue("2"), "2/d/yyyy");
  assert.equal(maskInstance.getMaskedValue("12/4"), "12/4/yyyy");
  assert.equal(maskInstance.getMaskedValue("12/34"), "12/3/yyyy");
  assert.equal(maskInstance.getMaskedValue("12/3/198"), "12/3/198y");
  assert.equal(maskInstance.getMaskedValue("12/3/1987"), "12/3/1987");
});

QUnit.test("parseDateTime invalid string", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "m/d/yyyy";

  assert.equal(maskInstance._getMaskedValue("2/d/yyyy"), "2/d/yyyy");
  assert.equal(maskInstance._getMaskedValue("/d/yyyy"), "m/d/yyyy");
});

QUnit.test("get masked value from ISO", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";
  assert.equal(maskInstance.getMaskedValue("2024-12-05"), "12/05/2024");
  assert.equal(maskInstance.getMaskedValue("2024-13-05"), "mm/dd/yyyy");
});

QUnit.test("get masked date if text with dots mm/dd/yyyy", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";

  // assert.equal(maskInstance._getMaskedValue("12.4"), "12/04/yyyy");
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

QUnit.test("get masked date if text with dots m/d/yyyy", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "m/d/yyyy";

  // assert.equal(maskInstance._getMaskedValue("12.4"), "12/04/yyyy");
  // assert.equal(maskInstance._getMaskedValue("12.34"), "12/3d/yyyy");
  assert.equal(maskInstance._getMaskedValue("12.30.198"), "12/30/198y");
  assert.equal(maskInstance._getMaskedValue("12.30.0001"), "12/30/0001");
  assert.equal(maskInstance._getMaskedValue("12.30.1987"), "12/30/1987");

  assert.equal(maskInstance._getMaskedValue("1.4"), "1/4/yyyy");
  // assert.equal(maskInstance._getMaskedValue("1.34"), "1/3d/yyyy");
  assert.equal(maskInstance._getMaskedValue("1.3.198"), "1/3/198y");
  assert.equal(maskInstance._getMaskedValue("1.3.0001"), "1/3/0001");
  assert.equal(maskInstance._getMaskedValue("1.3.1987"), "1/3/1987");
});

QUnit.test("get masked valid date text mm/dd/yyyy", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";
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

QUnit.test("get masked valid date text m/d/yyyy", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "m/d/yyyy";
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

QUnit.test("dateTime processInput serial input: insert characters", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";
  let result = maskInstance.processInput({ insertedCharacters: "1", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "leftToRight" });
  assert.equal(result.text, "1m/dd/yyyy", "type #1");
  assert.equal(result.cursorPosition, 1, "type #1");

  result = maskInstance.processInput({ insertedCharacters: "2", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yyyy", inputDirection: "leftToRight" });
  assert.equal(result.text, "12/dd/yyyy", "type 2");
  assert.equal(result.cursorPosition, 3, "type 2");

  result = maskInstance.processInput({ insertedCharacters: "5", selectionStart: 1, selectionEnd: 1, prevValue: "1m/dd/yyyy", inputDirection: "leftToRight" });
  assert.equal(result.text, "1m/dd/yyyy", "try type 5");
  assert.equal(result.cursorPosition, 1, "try type 5");

  result = maskInstance.processInput({ insertedCharacters: "3", selectionStart: 3, selectionEnd: 3, prevValue: "12/dd/yyyy", inputDirection: "leftToRight" });
  assert.equal(result.text, "12/3d/yyyy", "type 3");
  assert.equal(result.cursorPosition, 4, "type 3");

  result = maskInstance.processInput({ insertedCharacters: "7", selectionStart: 4, selectionEnd: 4, prevValue: "12/3d/yyyy", inputDirection: "leftToRight" });
  assert.equal(result.text, "12/3d/yyyy", "try type 7");
  assert.equal(result.cursorPosition, 4, "try type 7");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 4, selectionEnd: 4, prevValue: "12/3d/yyyy", inputDirection: "leftToRight" });
  assert.equal(result.text, "12/30/yyyy", "type 0");
  assert.equal(result.cursorPosition, 6, "type 0");

  result = maskInstance.processInput({ insertedCharacters: "2", selectionStart: 6, selectionEnd: 6, prevValue: "12/30/yyyy", inputDirection: "leftToRight" });
  assert.equal(result.text, "12/30/2yyy", "type year");
  assert.equal(result.cursorPosition, 7, "type year");

  result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 9, selectionEnd: 9, prevValue: "12/30/202y", inputDirection: "leftToRight" });
  assert.equal(result.text, "12/30/2024", "type 2024");
  assert.equal(result.cursorPosition, 10, "type 2024");

  result = maskInstance.processInput({ insertedCharacters: "0", selectionStart: 10, selectionEnd: 10, prevValue: "12/30/2024", inputDirection: "leftToRight" });
  assert.equal(result.text, "12/30/2024", "type 0 2024");
  assert.equal(result.cursorPosition, 10, "type 0 2024");
});

QUnit.test("dateTime processInput: insert characters", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";
  let result = maskInstance.processInput({ insertedCharacters: "4", selectionStart: 0, selectionEnd: 0, prevValue: "mm/dd/yyyy", inputDirection: "leftToRight" });
  assert.equal(result.text, "04/dd/yyyy", "type 4");
  assert.equal(result.cursorPosition, 3, "type 4");

  result = maskInstance.processInput({ insertedCharacters: "5", selectionStart: 3, selectionEnd: 3, prevValue: "04/dd/yyyy", inputDirection: "leftToRight" });
  assert.equal(result.text, "04/05/yyyy", "type 5");
  assert.equal(result.cursorPosition, 6, "type 5");

  result = maskInstance.processInput({ insertedCharacters: "1", selectionStart: 9, selectionEnd: 9, prevValue: "04/05/000y", inputDirection: "leftToRight" });
  assert.equal(result.text, "04/05/0001", "type 1");
  assert.equal(result.cursorPosition, 10, "type 1");
});

QUnit.test("dateTime processInput: delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";
  let result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 9, selectionEnd: 10, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "04/05/202y", "delete 4");
  assert.equal(result.cursorPosition, 9, "delete 4");

  result = maskInstance.processInput({ prevValue: "04/05/yyyy", selectionStart: 5, selectionEnd: 6, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "04/05/yyyy", "try delete /");
  assert.equal(result.cursorPosition, 5, "try delete /");

  result = maskInstance.processInput({ prevValue: "04/05/yyyy", selectionStart: 4, selectionEnd: 5, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "04/0d/yyyy", "delete 5");
  assert.equal(result.cursorPosition, 4, "delete 5");

  result = maskInstance.processInput({ prevValue: "04/0d/yyyy", selectionStart: 3, selectionEnd: 4, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "04/dd/yyyy", "delete 0");
  assert.equal(result.cursorPosition, 3, "delete 0");

  result = maskInstance.processInput({ prevValue: "04/dd/yyyy", selectionStart: 2, selectionEnd: 3, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "04/dd/yyyy", "try delete /");
  assert.equal(result.cursorPosition, 2, "try delete /");

  result = maskInstance.processInput({ prevValue: "04/dd/yyyy", selectionStart: 1, selectionEnd: 2, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "0m/dd/yyyy", "delete 4");
  assert.equal(result.cursorPosition, 1, "delete 4");

  result = maskInstance.processInput({ prevValue: "0m/dd/yyyy", selectionStart: 0, selectionEnd: 1, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "mm/dd/yyyy", "delete 0");
  assert.equal(result.cursorPosition, 0, "delete 0");

  result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "mm/dd/yyyy", "delete first character");
  assert.equal(result.cursorPosition, 0, "delete first character");
});

QUnit.test("dateTime processInput: editing by delete characters by backspace", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";
  let result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 1, selectionEnd: 2, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "0m/05/2024", "delete 4");
  assert.equal(result.cursorPosition, 1, "delete 4");

  result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 1, selectionEnd: 2, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "0m/12/2024", "delete 5");
  assert.equal(result.cursorPosition, 1, "delete 5");

  result = maskInstance.processInput({ prevValue: "04/05/2024", selectionStart: 4, selectionEnd: 5, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "04/0d/2024", "delete 5");
  assert.equal(result.cursorPosition, 4, "delete 5");

  result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 4, selectionEnd: 5, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "05/1d/2024", "delete 2");
  assert.equal(result.cursorPosition, 4, "delete 2");

  // result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 3, selectionEnd: 4, insertedCharacters: null, inputDirection: "rightToLeft" });
  // assert.equal(result.text, "05/d2/2024", "delete 1");
  // assert.equal(result.cursorPosition, 3, "delete 1");

  result = maskInstance.processInput({ prevValue: "05/12/2024", selectionStart: 7, selectionEnd: 8, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "05/12/224y", "delete 0");
  assert.equal(result.cursorPosition, 7, "delete 0");
});

QUnit.test("dateTime processInput: delete characters by backspace m/d/yyyy", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "m/d/yyyy";
  let result = maskInstance.processInput({ prevValue: "2/d/yyyy", selectionStart: 0, selectionEnd: 1, insertedCharacters: null, inputDirection: "rightToLeft" });
  assert.equal(result.text, "m/d/yyyy", "delete 2");
  assert.equal(result.cursorPosition, 0, "delete 2");
});

QUnit.test("dateTime processInput: copy/paste", function(assert) {
  const maskInstance = new InputMaskDateTime();
  maskInstance.mask = "mm/dd/yyyy";
  let result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedCharacters: "05/12/2024", inputDirection: "rightToLeft" });
  assert.equal(result.text, "05/12/2024", "insert new value 05/12/2024");
  assert.equal(result.cursorPosition, 10, "insert new value 05/12/2024");

  result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedCharacters: "5/12/2024", inputDirection: "rightToLeft" });
  assert.equal(result.text, "05/12/2024", "insert new value 5/12/2024");
  assert.equal(result.cursorPosition, 10, "insert new value 5/12/2024");

  // result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedCharacters: "5/1/2024", inputDirection: "rightToLeft" });
  // assert.equal(result.text, "05/01/2024", "insert new value 5/1/2024");
  // assert.equal(result.cursorPosition, 10, "insert new value 5/1/2024");

  result = maskInstance.processInput({ prevValue: "mm/dd/yyyy", selectionStart: 0, selectionEnd: 0, insertedCharacters: "10.28.1996", inputDirection: "rightToLeft" });
  assert.equal(result.text, "10/28/1996", "empty value & insert new value 10.28.1996");
  assert.equal(result.cursorPosition, 10, "empty value & insert new value 10.28.1996");

  result = maskInstance.processInput({ prevValue: "5/12/2024", selectionStart: 0, selectionEnd: 0, insertedCharacters: "108", inputDirection: "rightToLeft" });
  assert.equal(result.text, "10/12/2024", "insert 108");
  assert.equal(result.cursorPosition, 3, "insert 108");

  result = maskInstance.processInput({ prevValue: "5/12/2024", selectionStart: 0, selectionEnd: 0, insertedCharacters: "10.28.1996", inputDirection: "rightToLeft" });
  assert.equal(result.text, "10/28/1996", "insert new value 10.28.1996");
  assert.equal(result.cursorPosition, 10, "insert new value 10.28.1996");
});