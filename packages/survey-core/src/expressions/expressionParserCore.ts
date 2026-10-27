import { Operand, Const, Variable, BinaryOperand, UnaryOperand, FunctionOperand, ArrayOperand } from "./expressions";

// The expression parser. It follows tests/expressions/oracle/grammar.pegjs rule by rule with PEG semantics:
// ordered choice, no backtracking into an alternative that already matched, and the error reported at the
// farthest position where a terminal failed, with peggy's message ("Expected ... but ... found."). A grammar
// change is made here and in grammar.pegjs. To check it, regenerate the peggy parser of the grammar
// (tests/expressions/oracle/expressionParser.ts, see ReadMe.md) and run the differential test
// (tests/expressions/expressionParserOracleTest.ts): the operand tree, and on failure the error offset and
// message, must be the same.
//
// Every terminal that fails is recorded as in peggy (except inside the whitespace rule "_", which is silent):
// the farthest position, and a bit per expectation in one of two words. A failure at a position before a
// farther failure the same rule always records can be left out; the comments say where this is done.

export class ExpressionSyntaxError extends Error {
  public location: { start: { offset: number } };
  constructor(message: string, offset: number) {
    super(message);
    this.name = "ExpressionSyntaxError";
    this.location = { start: { offset: offset } };
  }
}

export function parse(text: string): Operand {
  return new ExpressionParser(text).parseInput();
}

// Expectations of the binary operators (one word)
const OP_OR2 = 1 << 0, OP_OR = 1 << 1, OP_AND2 = 1 << 2, OP_AND = 1 << 3;
const OP_LE = 1 << 4, OP_LESSOREQUAL = 1 << 5, OP_GE = 1 << 6, OP_GREATEROREQUAL = 1 << 7;
const OP_EQ2 = 1 << 8, OP_EQUAL = 1 << 9, OP_EQ = 1 << 10, OP_NE = 1 << 11, OP_NOTEQUAL = 1 << 12;
const OP_LT = 1 << 13, OP_LESS = 1 << 14, OP_GT = 1 << 15, OP_GREATER = 1 << 16;
const OP_PLUS = 1 << 17, OP_MINUS = 1 << 18, OP_MUL = 1 << 19, OP_DIV = 1 << 20, OP_MOD = 1 << 21;
const OP_POW = 1 << 22, OP_POWER = 1 << 23;
const OP_CONTAINS2 = 1 << 24, OP_CONTAINS = 1 << 25, OP_CONTAIN = 1 << 26, OP_NOTCONTAINS = 1 << 27, OP_NOTCONTAIN = 1 << 28;
const OP_ANYOF = 1 << 29, OP_ALLOF = 1 << 30, OP_NONEOF = 1 << 31;
const OP_DESCRIPTIONS = ["\"||\"", "\"or\"", "\"&&\"", "\"and\"",
  "\"<=\"", "\"lessorequal\"", "\">=\"", "\"greaterorequal\"",
  "\"==\"", "\"equal\"", "\"=\"", "\"!=\"", "\"notequal\"",
  "\"<\"", "\"less\"", "\">\"", "\"greater\"",
  "\"+\"", "\"-\"", "\"*\"", "\"/\"", "\"%\"",
  "\"^\"", "\"power\"",
  "\"*=\"", "\"contains\"", "\"contain\"", "\"notcontains\"", "\"notcontain\"",
  "\"anyof\"", "\"allof\"", "\"noneof\""];
const OP_ALL_COMPARISON = OP_LE | OP_LESSOREQUAL | OP_GE | OP_GREATEROREQUAL | OP_EQ2 | OP_EQUAL | OP_EQ | OP_NE | OP_NOTEQUAL |
  OP_LT | OP_LESS | OP_GT | OP_GREATER;
const OP_ALL_BINFUNC = OP_CONTAINS2 | OP_CONTAINS | OP_CONTAIN | OP_NOTCONTAINS | OP_NOTCONTAIN | OP_ANYOF | OP_ALLOF | OP_NONEOF;

// Expectations of everything else (the other word)
const X_LPAREN = 1 << 0, X_RPAREN = 1 << 1, X_NOT = 1 << 2, X_NEGATE = 1 << 3, X_EMPTY = 1 << 4, X_NOTEMPTY = 1 << 5;
const X_UNDEFINED = 1 << 6, X_NULL = 1 << 7, X_LBRACE = 1 << 8, X_RBRACE = 1 << 9;
const X_EMPTY_SQ = 1 << 10, X_EMPTY_DQ = 1 << 11, X_SQ = 1 << 12, X_DQ = 1 << 13;
const X_LBRACKET = 1 << 14, X_RBRACKET = 1 << 15, X_COMMA = 1 << 16, X_TRUE = 1 << 17, X_FALSE = 1 << 18;
const X_HEX = 1 << 19, X_SIGN = 1 << 20, X_DOT = 1 << 21, X_ZERO = 1 << 22, X_VALUE_CHAR = 1 << 23;
const X_ESC_SQ = 1 << 24, X_ESC_DQ = 1 << 25, X_STRING_CHAR = 1 << 26, X_DIGIT = 1 << 27, X_NONZERO_DIGIT = 1 << 28;
const X_LETTER = 1 << 29, X_END = 1 << 30;
const X_DESCRIPTIONS = ["\"(\"", "\")\"", "\"!\"", "\"negate\"", "\"empty\"", "\"notempty\"",
  "\"undefined\"", "\"null\"", "\"{\"", "\"}\"",
  "\"''\"", "\"\\\"\\\"\"", "\"'\"", "\"\\\"\"",
  "\"[\"", "\"]\"", "\",\"", "\"true\"", "\"false\"",
  "\"0x\"", "[\\-]", "\".\"", "\"0\"", "[^{}]",
  "\"\\\\'\"", "\"\\\\\\\"\"", "[^\"']", "[0-9]", "[1-9]",
  "[a-zA-Z_]", "end of input"];
// The first terminals of ConstValue's alternatives: all of them fail on a character that starts none of them
const X_CONST_START = X_TRUE | X_FALSE | X_HEX | X_SIGN | X_DIGIT | X_NONZERO_DIGIT | X_ZERO | X_LETTER |
  X_EMPTY_SQ | X_EMPTY_DQ | X_SQ | X_DQ;
const X_STRING_END = X_ESC_SQ | X_ESC_DQ | X_STRING_CHAR;

function isLetter(c: number): boolean {
  return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c === 95;
}
function isDigit(c: number): boolean {
  return c >= 48 && c <= 57;
}
function isWordChar(c: number): boolean {
  return c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c === 95;
}

let nonPrintable: RegExp;
// peggy's literalEscape and unicodeEscape, for the one character a message shows as found
function escapeFoundChar(ch: string): string {
  const code = ch.codePointAt(0);
  switch(code) {
    case 92: return "\\\\";
    case 34: return "\\\"";
    case 0: return "\\0";
    case 9: return "\\t";
    case 10: return "\\n";
    case 13: return "\\r";
  }
  const hex = code.toString(16).toUpperCase();
  if (code <= 0x0F) return "\\x0" + hex;
  if (code <= 0x1F || code >= 0x7F && code <= 0x9F) return "\\x" + hex;
  if (nonPrintable === undefined) {
    // Unicode property escapes need ES2018: created on the first error, so that older engines can load the module
    try {
      nonPrintable = new RegExp("[\\p{C}\\p{Mn}\\p{Mc}]", "u");
    } catch{
      nonPrintable = null;
    }
  }
  return !!nonPrintable && nonPrintable.test(ch) ? "\\u{" + hex + "}" : ch;
}

class ExpressionParser {
  private len: number;
  private pos: number = 0;
  private maxFailPos: number = 0;
  private failedOps: number = 0;
  private failedOther: number = 0;
  private wsStart: number = -1;
  private wsEnd: number = 0;

  constructor(private text: string) {
    this.len = text.length;
  }

  public parseInput(): Operand {
    const res = this.parseExpression();
    if (res !== undefined && this.pos === this.len) return res;
    if (res !== undefined)this.failOther(this.pos, X_END);
    throw this.createError();
  }

  private createError(): ExpressionSyntaxError {
    const descriptions: Array<string> = [];
    for (let i = 0; i < OP_DESCRIPTIONS.length; i++) {
      if ((this.failedOps & (1 << i)) !== 0) descriptions.push(OP_DESCRIPTIONS[i]);
    }
    for (let i = 0; i < X_DESCRIPTIONS.length; i++) {
      if ((this.failedOther & (1 << i)) !== 0) descriptions.push(X_DESCRIPTIONS[i]);
    }
    // Each expectation has its own description, so there is nothing to deduplicate
    descriptions.sort();
    const last = descriptions.length - 1;
    const expected = last === 0 ? descriptions[0] :
      (last === 1 ? descriptions[0] + " or " + descriptions[1] : descriptions.slice(0, last).join(", ") + ", or " + descriptions[last]);
    const at = this.maxFailPos;
    const found = at < this.len ? "\"" + escapeFoundChar(String.fromCodePoint(this.text.codePointAt(at))) + "\"" : "end of input";
    return new ExpressionSyntaxError("Expected " + expected + " but " + found + " found.", at);
  }

  private failOp(pos: number, expected: number): void {
    if (pos < this.maxFailPos) return;
    if (pos > this.maxFailPos) {
      this.maxFailPos = pos;
      this.failedOps = 0;
      this.failedOther = 0;
    }
    this.failedOps |= expected;
  }
  private failOther(pos: number, expected: number): void {
    if (pos < this.maxFailPos) return;
    if (pos > this.maxFailPos) {
      this.maxFailPos = pos;
      this.failedOps = 0;
      this.failedOther = 0;
    }
    this.failedOther |= expected;
  }

  private code(pos: number): number {
    return this.text.charCodeAt(pos);
  }
  // Case-insensitive keyword: `word` is lowercase ASCII letters. Only ASCII letters fold to them: the one
  // non-ASCII character that String.toLowerCase maps to an ASCII letter (U+212A to "k") is in no keyword.
  private isKeyword(pos: number, word: string): boolean {
    const text = this.text;
    for (let i = 0; i < word.length; i++) {
      if ((text.charCodeAt(pos + i) | 0x20) !== word.charCodeAt(i)) return false;
    }
    return true;
  }
  // _ "whitespace" = [ \t\n\r]*
  // After an operand, every precedence level skips the same whitespace to try its operator: the last run is remembered.
  private skipWhitespace(): void {
    const text = this.text;
    let pos = this.pos;
    if (pos === this.wsStart) {
      this.pos = this.wsEnd;
      return;
    }
    const start = pos;
    for (;;) {
      const c = text.charCodeAt(pos);
      if (c === 32 || c === 9 || c === 10 || c === 13) pos++; else break;
    }
    this.wsStart = start;
    this.wsEnd = pos;
    this.pos = pos;
  }

  // Expression = _ head:LogicOr tail:(_ OrSign _ LogicOr)* _
  private parseExpression(): Operand | null | undefined {
    const start = this.pos;
    this.skipWhitespace();
    let left = this.parseLogicOr();
    if (left === undefined) {
      this.pos = start;
      return undefined;
    }
    for (;;) {
      const save = this.pos;
      this.skipWhitespace();
      if (!this.matchOrSign()) {
        this.pos = save;
        break;
      }
      this.skipWhitespace();
      const right = this.parseLogicOr();
      if (right === undefined) {
        this.pos = save;
        break;
      }
      left = new BinaryOperand("or", left, right, true);
    }
    this.skipWhitespace();
    return left;
  }
  // OrSign = "||" / "or"i
  private matchOrSign(): boolean {
    const pos = this.pos;
    if (this.code(pos) === 124 && this.code(pos + 1) === 124) {
      this.pos = pos + 2;
      return true;
    }
    if (this.isKeyword(pos, "or")) {
      this.failOp(pos, OP_OR2);
      this.pos = pos + 2;
      return true;
    }
    this.failOp(pos, OP_OR2 | OP_OR);
    return false;
  }

  // LogicOr = head:LogicAnd tail:(_ AndSign _ LogicAnd)*
  private parseLogicOr(): Operand | null | undefined {
    let left = this.parseLogicAnd();
    if (left === undefined) return undefined;
    for (;;) {
      const save = this.pos;
      this.skipWhitespace();
      if (!this.matchAndSign()) {
        this.pos = save;
        break;
      }
      this.skipWhitespace();
      const right = this.parseLogicAnd();
      if (right === undefined) {
        this.pos = save;
        break;
      }
      left = new BinaryOperand("and", left, right, true);
    }
    return left;
  }
  // AndSign = "&&" / "and"i
  private matchAndSign(): boolean {
    const pos = this.pos;
    if (this.code(pos) === 38 && this.code(pos + 1) === 38) {
      this.pos = pos + 2;
      return true;
    }
    if (this.isKeyword(pos, "and")) {
      this.failOp(pos, OP_AND2);
      this.pos = pos + 3;
      return true;
    }
    this.failOp(pos, OP_AND2 | OP_AND);
    return false;
  }

  // LogicAnd = head:CompOps tail:(_ ComparableOperators _ CompOps)*
  private parseLogicAnd(): Operand | null | undefined {
    let left = this.parseCompOps();
    if (left === undefined) return undefined;
    for (;;) {
      const save = this.pos;
      this.skipWhitespace();
      const op = this.matchComparableOperator();
      if (op === undefined) {
        this.pos = save;
        break;
      }
      this.skipWhitespace();
      const right = this.parseCompOps();
      if (right === undefined) {
        this.pos = save;
        break;
      }
      left = new BinaryOperand(op, left, right, false);
    }
    return left;
  }
  private matched(pos: number, length: number, failed: number, op: string): string {
    if (failed !== 0)this.failOp(pos, failed);
    this.pos = pos + length;
    return op;
  }
  // ComparableOperators: seven alternatives, each a symbol or a keyword, tried in the grammar's order
  private matchComparableOperator(): string | undefined {
    const pos = this.pos;
    const c = this.code(pos);
    const lower = c | 0x20;
    if (c !== 60 && c !== 62 && c !== 61 && c !== 33 && lower !== 108 && lower !== 103 && lower !== 101 && lower !== 110) {
      this.failOp(pos, OP_ALL_COMPARISON);
      return undefined;
    }
    const next = this.code(pos + 1);
    let failed = 0;
    if (c === 60 && next === 61) return this.matched(pos, 2, failed, "lessorequal");
    failed |= OP_LE;
    if (lower === 108 && this.isKeyword(pos, "lessorequal")) return this.matched(pos, 11, failed, "lessorequal");
    failed |= OP_LESSOREQUAL;
    if (c === 62 && next === 61) return this.matched(pos, 2, failed, "greaterorequal");
    failed |= OP_GE;
    if (lower === 103 && this.isKeyword(pos, "greaterorequal")) return this.matched(pos, 14, failed, "greaterorequal");
    failed |= OP_GREATEROREQUAL;
    if (c === 61 && next === 61) return this.matched(pos, 2, failed, "equal");
    failed |= OP_EQ2;
    if (lower === 101 && this.isKeyword(pos, "equal")) return this.matched(pos, 5, failed, "equal");
    failed |= OP_EQUAL;
    if (c === 61) return this.matched(pos, 1, failed, "equal");
    // The fourth alternative ("=" / "equal"i) tries "equal"i again: it fails again, with the same expectation
    failed |= OP_EQ;
    if (c === 33 && next === 61) return this.matched(pos, 2, failed, "notequal");
    failed |= OP_NE;
    if (lower === 110 && this.isKeyword(pos, "notequal")) return this.matched(pos, 8, failed, "notequal");
    failed |= OP_NOTEQUAL;
    if (c === 60) return this.matched(pos, 1, failed, "less");
    failed |= OP_LT;
    if (lower === 108 && this.isKeyword(pos, "less")) return this.matched(pos, 4, failed, "less");
    failed |= OP_LESS;
    if (c === 62) return this.matched(pos, 1, failed, "greater");
    failed |= OP_GT;
    if (lower === 103 && this.isKeyword(pos, "greater")) return this.matched(pos, 7, failed, "greater");
    this.failOp(pos, failed | OP_GREATER);
    return undefined;
  }

  // CompOps = head:PlusMinusOps tail:(_ PlusMinusSigns _ PlusMinusOps)*
  private parseCompOps(): Operand | null | undefined {
    let left = this.parsePlusMinusOps();
    if (left === undefined) return undefined;
    for (;;) {
      const save = this.pos;
      this.skipWhitespace();
      const pos = this.pos;
      const c = this.code(pos);
      let op: string;
      if (c === 43) {
        op = "plus";
      } else if (c === 45) {
        this.failOp(pos, OP_PLUS);
        op = "minus";
      } else {
        this.failOp(pos, OP_PLUS | OP_MINUS);
        this.pos = save;
        break;
      }
      this.pos = pos + 1;
      this.skipWhitespace();
      const right = this.parsePlusMinusOps();
      if (right === undefined) {
        this.pos = save;
        break;
      }
      left = new BinaryOperand(op, left, right, true);
    }
    return left;
  }

  // PlusMinusOps = head:MulDivOps tail:(_ MulDivSigns _ MulDivOps)*
  private parsePlusMinusOps(): Operand | null | undefined {
    let left = this.parseMulDivOps();
    if (left === undefined) return undefined;
    for (;;) {
      const save = this.pos;
      this.skipWhitespace();
      const pos = this.pos;
      const c = this.code(pos);
      let op: string;
      if (c === 42) {
        op = "mul";
      } else if (c === 47) {
        this.failOp(pos, OP_MUL);
        op = "div";
      } else if (c === 37) {
        this.failOp(pos, OP_MUL | OP_DIV);
        op = "mod";
      } else {
        this.failOp(pos, OP_MUL | OP_DIV | OP_MOD);
        this.pos = save;
        break;
      }
      this.pos = pos + 1;
      this.skipWhitespace();
      const right = this.parseMulDivOps();
      if (right === undefined) {
        this.pos = save;
        break;
      }
      left = new BinaryOperand(op, left, right, true);
    }
    return left;
  }

  // MulDivOps = head:BinaryFuncOp tail:(_ PowerSigns _ BinaryFuncOp)*
  private parseMulDivOps(): Operand | null | undefined {
    let left = this.parseBinaryFuncOp();
    if (left === undefined) return undefined;
    for (;;) {
      const save = this.pos;
      this.skipWhitespace();
      const pos = this.pos;
      if (this.code(pos) === 94) {
        this.pos = pos + 1;
      } else if (this.isKeyword(pos, "power")) {
        this.failOp(pos, OP_POW);
        this.pos = pos + 5;
      } else {
        this.failOp(pos, OP_POW | OP_POWER);
        this.pos = save;
        break;
      }
      this.skipWhitespace();
      const right = this.parseBinaryFuncOp();
      if (right === undefined) {
        this.pos = save;
        break;
      }
      left = new BinaryOperand("power", left, right, true);
    }
    return left;
  }

  // BinaryFuncOp = head:Factor tail:(_ BinFunctions _ Factor?)*
  private parseBinaryFuncOp(): Operand | null | undefined {
    let left = this.parseFactor();
    if (left === undefined) return undefined;
    for (;;) {
      const save = this.pos;
      this.skipWhitespace();
      const op = this.matchBinFunction();
      if (op === undefined) {
        this.pos = save;
        break;
      }
      this.skipWhitespace();
      const right = this.parseFactor();
      left = new BinaryOperand(op, left, right === undefined ? null : right, false);
    }
    return left;
  }
  // BinFunctions = ("*=" / "contains"i / "contain"i) / ("notcontains"i / "notcontain"i) / "anyof"i / "allof"i / "noneof"i
  private matchBinFunction(): string | undefined {
    const pos = this.pos;
    const c = this.code(pos);
    const lower = c | 0x20;
    if (c !== 42 && lower !== 99 && lower !== 110 && lower !== 97) {
      this.failOp(pos, OP_ALL_BINFUNC);
      return undefined;
    }
    let failed = 0;
    if (c === 42 && this.code(pos + 1) === 61) return this.matched(pos, 2, failed, "contains");
    failed |= OP_CONTAINS2;
    if (this.isKeyword(pos, "contains")) return this.matched(pos, 8, failed, "contains");
    failed |= OP_CONTAINS;
    if (this.isKeyword(pos, "contain")) return this.matched(pos, 7, failed, "contains");
    failed |= OP_CONTAIN;
    if (this.isKeyword(pos, "notcontains")) return this.matched(pos, 11, failed, "notcontains");
    failed |= OP_NOTCONTAINS;
    if (this.isKeyword(pos, "notcontain")) return this.matched(pos, 10, failed, "notcontains");
    failed |= OP_NOTCONTAIN;
    if (this.isKeyword(pos, "anyof")) return this.matched(pos, 5, failed, "anyof");
    failed |= OP_ANYOF;
    if (this.isKeyword(pos, "allof")) return this.matched(pos, 5, failed, "allof");
    failed |= OP_ALLOF;
    if (this.isKeyword(pos, "noneof")) return this.matched(pos, 6, failed, "noneof");
    this.failOp(pos, failed | OP_NONEOF);
    return undefined;
  }

  // Factor
  //   = "(" _ expr:Expression _ ")"?
  //   / FunctionOp
  //   / ("!" / "negate"i) _ expr:Factor
  //   / expr:Atom op:(_ @UnFunctions)?
  //   / ArrayOp
  private parseFactor(): Operand | null | undefined {
    const start = this.pos;
    const c = this.code(start);
    if (c === 40) {
      this.pos = start + 1;
      this.skipWhitespace();
      const expr = this.parseExpression();
      if (expr !== undefined) {
        this.skipWhitespace();
        this.matchClosing(41, X_RPAREN);
        return expr;
      }
      this.pos = start;
    } else {
      this.failOther(start, X_LPAREN);
    }
    // FunctionOp = name:LettersAndDigits "(" params:Sequence ")"?
    if (isLetter(c)) {
      const end = this.scanWord(start);
      if (this.code(end) === 40) {
        const name = this.text.substring(start, end);
        this.pos = end + 1;
        const params = this.parseSequence();
        this.matchClosing(41, X_RPAREN);
        return new FunctionOperand(name, params);
      }
      this.failOther(end, X_LPAREN);
    } else {
      this.failOther(start, X_LETTER);
    }
    let afterNegate = -1;
    if (c === 33) {
      afterNegate = start + 1;
    } else if ((c | 0x20) === 110 && this.isKeyword(start, "negate")) {
      this.failOther(start, X_NOT);
      afterNegate = start + 6;
    } else {
      this.failOther(start, X_NOT | X_NEGATE);
    }
    if (afterNegate >= 0) {
      this.pos = afterNegate;
      this.skipWhitespace();
      const expr = this.parseFactor();
      if (expr !== undefined) return new UnaryOperand(expr, "negate");
      this.pos = start;
    }
    const atom = this.parseAtom();
    if (atom !== undefined) {
      // UnFunctions = "empty"i / "notempty"i
      const save = this.pos;
      this.skipWhitespace();
      const pos = this.pos;
      if (this.isKeyword(pos, "empty")) {
        this.pos = pos + 5;
        return new UnaryOperand(atom, "empty");
      }
      if (this.isKeyword(pos, "notempty")) {
        this.failOther(pos, X_EMPTY);
        this.pos = pos + 8;
        return new UnaryOperand(atom, "notempty");
      }
      this.failOther(pos, X_EMPTY | X_NOTEMPTY);
      this.pos = save;
      return atom;
    }
    // ArrayOp = "[" sequence:Sequence "]"?
    if (c === 91) {
      this.pos = start + 1;
      const sequence = this.parseSequence();
      this.matchClosing(93, X_RBRACKET);
      return sequence;
    }
    this.failOther(start, X_LBRACKET);
    return undefined;
  }
  // An optional ")" or "]"
  private matchClosing(c: number, expected: number): void {
    if (this.code(this.pos) === c) {
      this.pos++;
    } else {
      this.failOther(this.pos, expected);
    }
  }
  // LettersAndDigits = Letters (Digits Letters*)*, called on a letter. It ends at the first character that is not
  // [a-zA-Z_0-9], where both Letters and Digits fail; the failures before that position are left out.
  private scanWord(start: number): number {
    const text = this.text;
    let end = start + 1;
    while(isWordChar(text.charCodeAt(end))) end++;
    this.failOther(end, X_LETTER | X_DIGIT);
    return end;
  }

  // Sequence = head:Expression? tail:(_ "," _ Expression)*; without a head, the tail is consumed and dropped
  private parseSequence(): ArrayOperand {
    const head = this.parseExpression();
    const values: Array<Operand> = head !== undefined ? [head] : undefined;
    for (;;) {
      const save = this.pos;
      this.skipWhitespace();
      if (this.code(this.pos) !== 44) {
        this.failOther(this.pos, X_COMMA);
        this.pos = save;
        break;
      }
      this.pos++;
      this.skipWhitespace();
      const expr = this.parseExpression();
      if (expr === undefined) {
        this.pos = save;
        break;
      }
      if (!!values) values.push(expr);
    }
    return new ArrayOperand(values || []);
  }

  // Atom
  //   = _ ("undefined" / "null")
  //   / _ value:ConstValue
  //   / _ "{" value:ValueInput "}"
  private parseAtom(): Operand | null | undefined {
    const start = this.pos;
    this.skipWhitespace();
    const pos = this.pos;
    const text = this.text;
    if (text.startsWith("undefined", pos)) {
      this.pos = pos + 9;
      return null;
    }
    if (text.startsWith("null", pos)) {
      this.failOther(pos, X_UNDEFINED);
      this.pos = pos + 4;
      return null;
    }
    this.failOther(pos, X_UNDEFINED | X_NULL);
    const value = this.parseConstValue();
    if (value !== undefined) return new Const(value);
    if (this.code(pos) === 123) {
      // ValueInput = $[^{}]+
      let end = pos + 1;
      for (;;) {
        const c = text.charCodeAt(end);
        if (c === 123 || c === 125 || end >= this.len) break;
        end++;
      }
      this.failOther(end, X_VALUE_CHAR);
      if (end > pos + 1) {
        if (this.code(end) === 125) {
          this.pos = end + 1;
          return new Variable(text.substring(pos + 1, end));
        }
        this.failOther(end, X_RBRACE);
      }
    } else {
      this.failOther(pos, X_LBRACE);
    }
    this.pos = start;
    return undefined;
  }

  // ConstValue = LogicValue / ArithmeticValue / LettersAndDigits / "''" / "\"\"" / "'" AnyInput "'" / "\"" AnyInput "\""
  // Returns undefined when it does not match.
  private parseConstValue(): any {
    const pos = this.pos;
    const c = this.code(pos);
    const lower = c | 0x20;
    if (!isLetter(c) && !isDigit(c) && c !== 45 && c !== 39 && c !== 34) {
      this.failOther(pos, X_CONST_START);
      return undefined;
    }
    // LogicValue = "true"i / "false"i
    if (lower === 116 && this.isKeyword(pos, "true")) {
      this.pos = pos + 4;
      return true;
    }
    if (lower === 102 && this.isKeyword(pos, "false")) {
      this.failOther(pos, X_TRUE);
      this.pos = pos + 5;
      return false;
    }
    this.failOther(pos, X_TRUE | X_FALSE);
    const num = this.parseArithmeticValue(pos, c);
    if (num !== undefined) return num;
    if (isLetter(c)) {
      const end = this.scanWord(pos);
      this.pos = end;
      return this.text.substring(pos, end);
    }
    this.failOther(pos, X_LETTER);
    const next = this.code(pos + 1);
    if (c === 39 && next === 39) {
      this.pos = pos + 2;
      return "";
    }
    if (c === 34 && next === 34) {
      this.failOther(pos, X_EMPTY_SQ);
      this.pos = pos + 2;
      return "";
    }
    this.failOther(pos, X_EMPTY_SQ | X_EMPTY_DQ);
    if (c === 39) {
      const value = this.parseString(pos, 39, X_SQ);
      if (value !== undefined) return value;
    } else {
      this.failOther(pos, X_SQ);
    }
    if (c === 34) {
      const value = this.parseString(pos, 34, X_DQ);
      if (value !== undefined) return value;
    } else {
      this.failOther(pos, X_DQ);
    }
    return undefined;
  }
  // "'" value:AnyInput "'" or "\"" value:AnyInput "\"", at the opening quote.
  // AnyInput = AnyCharacters+, AnyCharacters = "\\'" / "\\\"" / [^\"\']: a string ends at either quote.
  // It stops where all three fail; the failures before that position are left out.
  private parseString(start: number, quote: number, expectedQuote: number): string | undefined {
    const text = this.text;
    const len = this.len;
    let pos = start + 1;
    let value = "";
    let chunk = pos;
    for (;;) {
      const c = text.charCodeAt(pos);
      if (c === 92) {
        const next = text.charCodeAt(pos + 1);
        if (next === 39 || next === 34) {
          value += text.substring(chunk, pos) + (next === 39 ? "'" : "\"");
          pos += 2;
          chunk = pos;
          continue;
        }
      }
      if (c === 39 || c === 34 || pos >= len) break;
      pos++;
    }
    this.failOther(pos, X_STRING_END);
    if (pos === start + 1) return undefined;
    if (text.charCodeAt(pos) !== quote) {
      this.failOther(pos, expectedQuote);
      return undefined;
    }
    this.pos = pos + 1;
    return "'" + value + text.substring(chunk, pos) + "'";
  }

  // ArithmeticValue = "0x" Digits / sign:[-]? num:Number
  private parseArithmeticValue(start: number, c: number): number | undefined {
    if (c === 48 && this.code(start + 1) === 120) {
      const end = this.scanDigits(start + 2);
      if (end > start + 2) {
        this.pos = end;
        return parseInt(this.text.substring(start, end), 16);
      }
    } else {
      this.failOther(start, X_HEX);
    }
    let pos = start;
    if (c === 45) {
      pos++;
    } else {
      this.failOther(start, X_SIGN);
    }
    const num = this.parseNumber(pos);
    if (num === undefined) {
      this.pos = start;
      return undefined;
    }
    return c === 45 ? -num : num;
  }
  // Number = Digits "." Digits / NonZeroDigits Digits? / "0"
  private parseNumber(start: number): number | undefined {
    const text = this.text;
    const intEnd = this.scanDigits(start);
    if (intEnd > start) {
      if (text.charCodeAt(intEnd) === 46) {
        const end = this.scanDigits(intEnd + 1);
        if (end > intEnd + 1) {
          this.pos = end;
          return parseFloat(text.substring(start, end));
        }
      } else {
        this.failOther(intEnd, X_DOT);
      }
    }
    const c = text.charCodeAt(start);
    if (c >= 49 && c <= 57) {
      let end = start + 1;
      while(true) {
        const d = text.charCodeAt(end);
        if (d >= 49 && d <= 57) end++; else break;
      }
      this.failOther(end, X_NONZERO_DIGIT);
      end = this.scanDigits(end);
      this.pos = end;
      return parseInt(text.substring(start, end), 10);
    }
    this.failOther(start, X_NONZERO_DIGIT);
    if (c === 48) {
      this.pos = start + 1;
      return 0;
    }
    this.failOther(start, X_ZERO);
    return undefined;
  }
  // Digits = [0-9]+: returns the end (start when there is no digit), where [0-9] fails
  private scanDigits(start: number): number {
    const text = this.text;
    let end = start;
    while(isDigit(text.charCodeAt(end))) end++;
    this.failOther(end, X_DIGIT);
    return end;
  }
}
