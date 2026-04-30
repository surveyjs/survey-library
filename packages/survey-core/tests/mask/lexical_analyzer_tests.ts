import { LexicalAnalyzer } from "../../src/mask/lexical_analyzer";

import { describe, test, expect } from "vitest";
describe("Lexical Analyzer", () => {
  test("getLexems", () => {
    const analyzer = new LexicalAnalyzer();
    let result = analyzer.getLexems("ab");
    expect(result.length).toLooseEqual(2);

    result = analyzer.getLexems("b+a");
    expect(result.length).toLooseEqual(2);

    result = analyzer.getLexems("ab*");
    expect(result.length).toLooseEqual(2);

    result = analyzer.getLexems("a|b");
    expect(result.length).toLooseEqual(3);

    result = analyzer.getLexems("\\a|b");
    expect(result.length).toLooseEqual(3);

    result = analyzer.getLexems("a|\\b");
    expect(result.length).toLooseEqual(3);

    result = analyzer.getLexems("(a|b)*abb");
    expect(result.length).toLooseEqual(4);
  });
});
