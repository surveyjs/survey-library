## The expression parser

`expressionParserCore.ts` is the expression parser and the source of truth. It is hand-written and follows the PEG grammar
[`tests/expressions/oracle/grammar.pegjs`](../../tests/expressions/oracle/grammar.pegjs) rule by rule, with PEG semantics (ordered
choice, the error at the farthest failure) and peggy's error messages.

The grammar is not compiled into `src`. A parser generated from it by [peggy](https://peggyjs.org/),
`tests/expressions/oracle/expressionParser.ts`, is the test oracle: `tests/expressions/expressionParserOracleTest.ts` compares both
parsers on generated inputs (the operand tree, or the error offset and message).

### Changing the grammar

1. Make the change in both `expressionParserCore.ts` and `tests/expressions/oracle/grammar.pegjs`. A new terminal also needs its
   expectation bit and description in `expressionParserCore.ts`.
2. Regenerate the oracle (from `packages/survey-core`).
   [`pegconfig.json`](../../tests/expressions/oracle/pegconfig.json) is necessary to use the `ts-pegjs` plugin:

   ```
   node ./node_modules/peggy/bin/peggy.js --plugin ./node_modules/ts-pegjs/dist/tspegjs.js --extra-options-file tests/expressions/oracle/pegconfig.json -o tests/expressions/oracle/expressionParser.ts tests/expressions/oracle/grammar.pegjs
   ```

   Do not pass `--cache`: memoizing every rule at every position makes parsing several times slower on this grammar.
3. Run the differential test and the expression tests:

   ```
   npx vitest run tests/expressions/
   ```
