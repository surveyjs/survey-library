import { LexicalAnalyzer } from "../../src/mask/lexical_analyzer";

export default QUnit.module("Lexical Analyzer");

QUnit.test("getLexems", assert => {
  const analyzer = new LexicalAnalyzer();
  let result = analyzer.getLexems("ab");
  assert.equal(result.length, 2);

  result = analyzer.getLexems("b+a");
  assert.equal(result.length, 2);

  result = analyzer.getLexems("ab*");
  assert.equal(result.length, 2);

  result = analyzer.getLexems("a|b");
  assert.equal(result.length, 3);

  result = analyzer.getLexems("\\a|b");
  assert.equal(result.length, 3);

  result = analyzer.getLexems("a|\\b");
  assert.equal(result.length, 3);

  result = analyzer.getLexems("(a|b)*abb");
  assert.equal(result.length, 4);
});