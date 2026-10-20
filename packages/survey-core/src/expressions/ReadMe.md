## Usage grammar.pegjs

### Command (from packages/survey-core) to generate parser [grammar.pegjs](https://github.com/surveyjs/surveyjs/tree/master/src/expressions/grammar.pegjs)

[pegconfig.json](https://github.com/surveyjs/surveyjs/tree/master/src/expressions/pegconfig.json) is necessary to use `type-script` plugin

```
node ./node_modules/peggy/bin/peggy.js --plugin ./node_modules/ts-pegjs/dist/tspegjs.js --extra-options-file src/expressions/pegconfig.json -o src/expressions/expressionParser.ts src/expressions/grammar.pegjs
```

Do not pass `--cache`: memoizing every rule at every position makes parsing several times slower on this grammar.
