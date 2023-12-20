import { LexicalAnalyzer, ILexemToken } from "./lexical_analyzer";

export type TokenType = "literal" | "concat" | "or" | "repeat" | "plus";
interface IRegexToken {
  type: TokenType;
  value: any;
  lexem?: ILexemToken;
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
  analyzer = new LexicalAnalyzer();

  public buildSyntacticTree(regex: string): Tree {
    return new Tree(this.syntacticAnalysis(regex));
  }

  syntacticAnalysis(str: string): Node {
    let prevLexem;
    let currentTocken;
    let prevTocken;
    let leftTocken;
    let rootTocken;

    let lexems = this.analyzer.getLexems(str);

    for(let index = 0; index < lexems.length; index++) {
      const currentLexem = lexems[index];
      currentTocken = null;

      switch (currentLexem.type) {
        case "expression":
          currentTocken = this.syntacticAnalysis(currentLexem.data);
          break;
        case "or":
          leftTocken = prevTocken;
          prevTocken = null;
          break;
        case "literal":
          currentTocken = new Node({ type: "literal", value: currentLexem.data, lexem: currentLexem });
          break;
        default:
          currentTocken = new Node({ type: "literal", value: currentLexem.data, lexem: currentLexem });
      }
      if(!!currentLexem.quantifier) {
        currentTocken = this.createUnaryTocken(currentLexem.quantifier === "*" ? "repeat" : "plus", currentLexem.data, currentTocken);
      }

      if(!!currentTocken) {
        if(!!leftTocken && prevLexem.type === "or") {
          currentTocken = this.createBinaryTocken("or", currentLexem.data, leftTocken, currentTocken);
          rootTocken = currentTocken;
          leftTocken = null;
        } else if(!!prevTocken) {
          currentTocken = this.createBinaryTocken("concat", ".", prevTocken, currentTocken);
          rootTocken = currentTocken;
        }
      }
      prevLexem = currentLexem;
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