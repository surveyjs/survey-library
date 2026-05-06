import { SyntacticAnalyzer, Tree } from "../../src/mask/syntactic_analyzer";

import { describe, test, expect } from "vitest";
describe("Syntactic Analyzer", () => {
// (a|b)*abb#
// abc|(c|(de))
// b+a

  test("syntacticAnalysisRegex b+a", () => {
    const analyzer = new SyntacticAnalyzer();
    const tree: Tree = analyzer.buildSyntacticTree("b+a");
    const rootNode = tree.getRoot();

    expect(rootNode.data.type).toBe("concat");
    expect(rootNode.children.length, "concat").toBe(2);
    expect(rootNode.parent).toBeUndefined();

    expect(rootNode.children[0].data.type).toBe("plus");
    expect(rootNode.children[0].children.length, "plus").toBe(1);
    expect(rootNode.children[0].children[0].data.type).toBe("literal");
    expect(rootNode.children[0].children[0].data.value).toBe("b");
    expect(rootNode.children[0].children[0].children.length).toBe(0);

    expect(rootNode.children[1].data.type).toBe("literal");
    expect(rootNode.children[1].data.value).toBe("a");
    expect(rootNode.children[1].children.length).toBe(0);
  });
  test("syntacticAnalysisRegex ab*", () => {
    const analyzer = new SyntacticAnalyzer();
    const tree: Tree = analyzer.buildSyntacticTree("ab*");
    const rootNode = tree.getRoot();

    expect(rootNode.data.type).toBe("concat");
    expect(rootNode.children.length, "concat").toBe(2);
    expect(rootNode.parent).toBeUndefined();

    expect(rootNode.children[0].data.type).toBe("literal");
    expect(rootNode.children[0].data.value).toBe("a");
    expect(rootNode.children[0].children.length).toBe(0);

    expect(rootNode.children[1].data.type).toBe("repeat");
    expect(rootNode.children[1].children.length, "repeat").toBe(1);
    expect(rootNode.children[1].children[0].data.type).toBe("literal");
    expect(rootNode.children[1].children[0].data.value).toBe("b");
    expect(rootNode.children[1].children[0].children.length).toBe(0);
  });
  test("syntactic tree a|b", () => {
    const analyzer = new SyntacticAnalyzer();
    const tree: Tree = analyzer.buildSyntacticTree("a|b");
    const rootNode = tree.getRoot();

    expect(rootNode.data.type).toBe("or");
    expect(rootNode.children.length, "or").toBe(2);
    expect(rootNode.parent).toBeUndefined();

    expect(rootNode.children[0].data.type).toBe("literal");
    expect(rootNode.children[0].data.value).toBe("a");
    expect(rootNode.children[0].children.length).toBe(0);

    expect(rootNode.children[1].data.type).toBe("literal");
    expect(rootNode.children[1].data.value).toBe("b");
    expect(rootNode.children[1].children.length).toBe(0);
  });
  test("syntactic tree (a|b)*", () => {
    const analyzer = new SyntacticAnalyzer();
    const tree: Tree = analyzer.buildSyntacticTree("(a|b)*");
    const rootNode = tree.getRoot();

    expect(rootNode.data.type).toBe("repeat");
    expect(rootNode.children.length, "repeat").toBe(1);
    expect(rootNode.parent).toBeUndefined();

    expect(rootNode.children[0].data.type).toBe("or");
    expect(rootNode.children[0].children.length, "or").toBe(2);
    expect(rootNode.children[0].parent).toBe(rootNode);

    expect(rootNode.children[0].children[0].data.type).toBe("literal");
    expect(rootNode.children[0].children[0].data.value).toBe("a");
    expect(rootNode.children[0].children[0].children.length).toBe(0);

    expect(rootNode.children[0].children[1].data.type).toBe("literal");
    expect(rootNode.children[0].children[1].data.value).toBe("b");
    expect(rootNode.children[0].children[1].children.length).toBe(0);
  });
});
