import { settings } from "./mask_utils";

export type TokenType = "literal" | "concat" | "or" | "repeat" | "plus";
interface IRegexToken {
  type: TokenType;
  value: any;
}
export class Node {
  data: IRegexToken;
  parent: Node | null;
  children: Array<Node> = [];

  constructor(data: IRegexToken) {
    this.data = data;
  }
  addChild(child: Node): void {
    this.children.push(child);
    child.parent = this;
  }
}
export class Tree {
  constructor(public root: Node) { }

  getRoot(): Node {
    const roots: Array<Node> = [];
    this.findRoots(this.root, roots);
    return roots[0];
  }

  findRoots(node: Node, roots: Array<Node>): void {
    if(!!node.parent) {
      this.findRoots(node.parent, roots);
    } else {
      roots.push(node);
    }
  }
}

export class SyntacticAnalyzer {
  public buildSyntacticTree(regex: string): Tree {
    return new Tree(this.syntacticAnalysis(regex));
  }

  syntacticAnalysis(str: string): Node {
    let prevChartIsEscaped = false;
    let prevChart;
    let currentTocken;
    let prevTocken;
    let leftTocken;
    let rootTocken;
    let bracketCounter = 0;
    let subString = "";

    for(let index = 0; index < str.length; index++) {
      const currentChar = str[index];
      currentTocken = null;

      if(bracketCounter !== 0) {
        if(currentChar === ")") {
          bracketCounter--;
          if(bracketCounter === 0) {
            currentTocken = this.syntacticAnalysis(subString);
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
          currentTocken = new Node({ type: "literal", value: currentChar });
        } else {
          switch (currentChar) {
            case settings.escapedChar:
              prevChartIsEscaped = true;
              break;
            case "|":
              leftTocken = prevTocken;
              prevTocken = null;
              break;
            case "(":
              bracketCounter++;
              break;
            case "*":
              currentTocken = this.createUnaryTocken("repeat", currentChar, prevTocken);
              prevTocken = null;
              break;
            case "+":
              currentTocken = this.createUnaryTocken("plus", currentChar, prevTocken);
              prevTocken = null;
              break;
            default:
              currentTocken = new Node({ type: "literal", value: currentChar });
          }
        }
      }
      if(!!currentTocken) {
        if(!!leftTocken && prevChart === "|") {
          currentTocken = this.createBinaryTocken("or", currentChar, leftTocken, currentTocken);
          rootTocken = currentTocken;
          leftTocken = null;
        } else if(!!prevTocken) {
          currentTocken = this.createBinaryTocken("concat", ".", prevTocken, currentTocken);
          rootTocken = currentTocken;
        }
      }
      prevChart = currentChar;
      prevTocken = currentTocken;
    }
    return rootTocken || currentTocken;
  }

  createUnaryTocken(tokenType: TokenType, char: string, prevTocken: Node): Node {
    const prevTockenParent = prevTocken.parent;
    const node = new Node({ type: tokenType, value: char });
    node.addChild(prevTocken);
    if(!!prevTockenParent) {
      prevTockenParent.addChild(node);
    }
    return node;
  }

  createBinaryTocken(tokenType: TokenType, char: string, leftTocken: Node, rightTocken: Node): Node {
    const node = new Node({ type: tokenType, value: char });
    node.addChild(leftTocken);
    node.addChild(rightTocken);
    return node;
  }
}