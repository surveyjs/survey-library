## Usage grammar.pegjs

### Command (from project root) to generate parser [grammar.pegjs](https://github.com/surveyjs/surveyjs/tree/master/src/expressions/grammar.pegjs)

```
pegjs --plugin ./node_modules/ts-pegjs/src/tspegjs --extra-options-file src/expressions/pegconfig.json -o src/expressions/expressionParser.ts --cache src/expressions/grammar.pegjs
```

[pegconfig.json](https://github.com/surveyjs/surveyjs/tree/master/src/expressions/pegconfig.json) is necessary to use `type-script` plugin

```
node ./node_modules/pegjs/bin/pegjs --plugin ./node_modules/ts-pegjs/src/tspegjs --extra-options-file src/expressions/pegconfig.json -o src/expressions/expressionParser.ts --cache src/expressions/grammar.pegjs
```

Build command for peggy

```
node ./node_modules/peggy/bin/peggy --plugin ./node_modules/ts-pegjs/dist/tspegjs.js --extra-options-file src/expressions/pegconfig.json -o src/expressions/expressionParser.ts --cache src/expressions/grammar.pegjs
```
