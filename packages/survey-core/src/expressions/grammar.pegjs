{
  function buildBinaryOperand(head: Operand, tail: Array<any>, isArithmeticOp: boolean = false) {
    return tail.reduce(
      function(result, elements) {
        return new BinaryOperand(elements[1], result, elements[3], isArithmeticOp);
      }, 
      head);
  }

  function flattenArray(array: Array<any>): Array<any> {
    return [].concat.apply([], array);
  }
}

Expression
  = _ head:LogicOr tail:(_ OrSign _ LogicOr)* _ {
    return buildBinaryOperand(head, tail, true);
  }

OrSign
  = ("||" / "or"i) { return "or"; }

LogicOr
  = head:LogicAnd tail:(_ AndSign _ LogicAnd)* {
    return buildBinaryOperand(head, tail, true);
  }

AndSign
  = ("&&" / "and"i) { return "and"; }

LogicAnd
  = head:CompOps tail:(_ ComparableOperators _ CompOps)* {
    return buildBinaryOperand(head, tail);
  }

ComparableOperators
  = ("<=" / "lessorequal"i)             { return "lessorequal"; }
  / (">=" / "greaterorequal"i)          { return "greaterorequal"; }
  / ("==" / "equal"i)                   { return "equal"; }
  / ("=" / "equal"i)                    { return "equal"; }
  / ("!=" / "notequal"i)                { return "notequal"; }
  / ("<" / "less"i)                     { return "less"; }
  / (">" / "greater"i)                  { return "greater"; }

CompOps
  = head:PlusMinusOps tail:(_ PlusMinusSigns _ PlusMinusOps)* {
    return buildBinaryOperand(head, tail, true);
  }

PlusMinusSigns
  = "+" { return "plus";  }
  / "-" { return "minus"; }

PlusMinusOps
  = head:MulDivOps tail:(_ MulDivSigns _ MulDivOps)* {
    return buildBinaryOperand(head, tail, true);
  }

MulDivSigns
  = "*" { return "mul"; }
  / "/" { return "div"; }
  / "%" { return "mod"; }

MulDivOps
  = head:BinaryFuncOp tail:(_ PowerSigns _ BinaryFuncOp)* {
    return buildBinaryOperand(head, tail, true);
  }

PowerSigns
  = ("^" / "power"i) { return "power"; }

BinaryFuncOp
  = head:Factor tail:(_ BinFunctions _ Factor?)* {
    return buildBinaryOperand(head, tail);
  }

BinFunctions
  = ("*=" / "contains"i / "contain"i) { return "contains"; }
  / ("notcontains"i / "notcontain"i)  { return "notcontains"; }
  / ("anyof"i)  {return "anyof"; }
  / ("allof"i)  {return "allof"; }

Factor
  = "(" _ expr:Expression _ ")"? { return expr; }
  / FunctionOp
  / UnaryFunctionOp
  / Atom
  / ArrayOp

FunctionOp
  = name:LettersAndDigits "(" params:Sequence ")"? { return new FunctionOperand(name, params); }

UnaryFunctionOp
  = ("!" / "negate"i) _ expr:Expression  { return new UnaryOperand(expr, "negate"); }
  / expr:Atom _ op:UnFunctions           { return new UnaryOperand(expr, op); }

UnFunctions
  = ("empty"i)    { return "empty"; }
  / ("notempty"i) { return "notempty"; }

Atom 
  = _ ("undefined" / "null") { return null; }
  / _ value:ConstValue       { return new Const(value); }
  / _ "{" value:ValueInput "}" { return new Variable(value); }

ConstValue
  = value:LogicValue  { return value; }
  / value:ArithmeticValue  { return value; }
  / value:LettersAndDigits  { return value; }
  / "''" {return ""; }
  / "\"\"" {return ""; }
  / "'" value:AnyInput "'" { return "'" + value + "'"; }
  / "\"" value:AnyInput "\"" { return "'" + value + "'"; }

ArrayOp
  = "[" sequence:Sequence "]" { return sequence; }

Sequence
  = expr:Expression? tail:(_ "," _ Expression)* {
    if (expr == null)
      return new ArrayOperand([]);

    var array = [expr];
    if (Array.isArray(tail)) {
      var flatten = flattenArray(tail);
      for (var i = 3; i < flatten.length; i += 4) {
        array.push(flatten[i]);
      }
    }

    return new ArrayOperand(array);
  }

LogicValue
  = "true"i  { return true; }
  / "false"i { return false; }

ArithmeticValue
  = "0x" Digits          { return parseInt(text(), 16); } 
  / sign:[-]? num:Number { return sign == null ? num : -num; }
  
Number
  = Digits "." Digits     { return parseFloat(text()); }
  / NonZeroDigits Digits? { return parseInt(text(), 10); }
  / "0"                   { return 0; }

ValueInput
  = chars:ValueCharacters+ { return chars.join(""); }

AnyInput
  = chars:AnyCharacters+ { return chars.join(""); }

AnyCharacters
  = "\\'"       { return "'"; }
  / "\\\""      { return "\""; }
  / [^\"\'] { return text(); }

ValueCharacters
  = [^\{\}] { return text(); }

LettersAndDigits
  = Letters (Digits Letters*)* { return text(); }

Digits
  = [0-9]+

NonZeroDigits
  = [1-9]+

Letters
  = [a-zA-Z_]+

_ "whitespace"
  = [ \t\n\r]*
