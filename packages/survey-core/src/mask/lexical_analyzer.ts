export type LexemTokenType = "literal" | "expression" | "or";
export interface ILexemToken {
  data: any;
  type: LexemTokenType;
  isConst?: boolean;
  quantifier?: "+" | "*";
}

export class LexicalAnalyzer {
  escapeChar = "\\";

  getLexems(str: string): Array<ILexemToken> {
    const result: Array<ILexemToken> = [];

    let prevChartIsEscaped = false;
    let prevTocken: ILexemToken;
    let currentTocken: ILexemToken;
    let bracketCounter = 0;
    let subString = "";

    for(let index = 0; index < str.length; index++) {
      const currentChar = str[index];
      currentTocken = null;

      if(bracketCounter !== 0) {
        if(currentChar === ")") {
          bracketCounter--;
          if(bracketCounter === 0) {
            currentTocken = <ILexemToken>{ data: subString, type: "expression" };
            subString = "";
          } else {
            subString += currentChar;
          }
        } else {
          subString += currentChar;
        }
      } else {
        if(prevChartIsEscaped) {
          prevChartIsEscaped = false;
          currentTocken = <ILexemToken>{ data: currentChar, isConst: true };
        } else {
          switch (currentChar) {
            case this.escapeChar:
              prevChartIsEscaped = true;
              break;
            case "|":
              currentTocken = <ILexemToken>{ data: currentChar, type: "or" };
              break;
            case "(":
              bracketCounter++;
              break;
            case "*":
              prevTocken.quantifier = "*";
              break;
            case "+":
              prevTocken.quantifier = "+";
              break;
            default:
              currentTocken = <ILexemToken>{ data: currentChar, type: "literal" };
          }
        }
      }

      if(!!currentTocken) {
        result.push(currentTocken);
      }
      prevTocken = currentTocken;
    }
    return result;
  }
}