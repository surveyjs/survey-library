import { SyntacticAnalyzer, Tree } from "../../src/mask/syntactic_analyzer";

export default QUnit.module("Syntactic Analyzer");

// (a|b)*abb#
// abc|(c|(de))
// b+a

QUnit.test("syntacticAnalysisRegex b+a", assert => {
  const analyzer = new SyntacticAnalyzer();
  const tree: Tree = analyzer.buildSyntacticTree("b+a");
  const rootNode = tree.getRoot();

  assert.equal(rootNode.data.type, "concat");
  assert.equal(rootNode.children.length, 2, "concat");
  assert.equal(rootNode.parent, undefined);

  assert.equal(rootNode.children[0].data.type, "plus");
  assert.equal(rootNode.children[0].children.length, 1, "plus");
  assert.equal(rootNode.children[0].children[0].data.type, "literal");
  assert.equal(rootNode.children[0].children[0].data.value, "b");
  assert.equal(rootNode.children[0].children[0].children.length, 0);

  assert.equal(rootNode.children[1].data.type, "literal");
  assert.equal(rootNode.children[1].data.value, "a");
  assert.equal(rootNode.children[1].children.length, 0);
});
QUnit.test("syntacticAnalysisRegex ab*", assert => {
  const analyzer = new SyntacticAnalyzer();
  const tree: Tree = analyzer.buildSyntacticTree("ab*");
  const rootNode = tree.getRoot();

  assert.equal(rootNode.data.type, "concat");
  assert.equal(rootNode.children.length, 2, "concat");
  assert.equal(rootNode.parent, undefined);

  assert.equal(rootNode.children[0].data.type, "literal");
  assert.equal(rootNode.children[0].data.value, "a");
  assert.equal(rootNode.children[0].children.length, 0);

  assert.equal(rootNode.children[1].data.type, "repeat");
  assert.equal(rootNode.children[1].children.length, 1, "repeat");
  assert.equal(rootNode.children[1].children[0].data.type, "literal");
  assert.equal(rootNode.children[1].children[0].data.value, "b");
  assert.equal(rootNode.children[1].children[0].children.length, 0);
});
QUnit.test("syntactic tree a|b", assert => {
  const analyzer = new SyntacticAnalyzer();
  const tree: Tree = analyzer.buildSyntacticTree("a|b");
  const rootNode = tree.getRoot();

  assert.equal(rootNode.data.type, "or");
  assert.equal(rootNode.children.length, 2, "or");
  assert.equal(rootNode.parent, undefined);

  assert.equal(rootNode.children[0].data.type, "literal");
  assert.equal(rootNode.children[0].data.value, "a");
  assert.equal(rootNode.children[0].children.length, 0);

  assert.equal(rootNode.children[1].data.type, "literal");
  assert.equal(rootNode.children[1].data.value, "b");
  assert.equal(rootNode.children[1].children.length, 0);
});
QUnit.test("syntactic tree (a|b)*", assert => {
  const analyzer = new SyntacticAnalyzer();
  const tree: Tree = analyzer.buildSyntacticTree("(a|b)*");
  const rootNode = tree.getRoot();

  assert.equal(rootNode.data.type, "repeat");
  assert.equal(rootNode.children.length, 1, "repeat");
  assert.equal(rootNode.parent, undefined);

  assert.equal(rootNode.children[0].data.type, "or");
  assert.equal(rootNode.children[0].children.length, 2, "or");
  assert.equal(rootNode.children[0].parent, rootNode);

  assert.equal(rootNode.children[0].children[0].data.type, "literal");
  assert.equal(rootNode.children[0].children[0].data.value, "a");
  assert.equal(rootNode.children[0].children[0].children.length, 0);

  assert.equal(rootNode.children[0].children[1].data.type, "literal");
  assert.equal(rootNode.children[0].children[1].data.value, "b");
  assert.equal(rootNode.children[0].children[1].children.length, 0);
});
