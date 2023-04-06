const testOnlyMessage = " :( please don't forget to remove 'test.only' testcafe statement it will disable all other tests :( ";
const debugMessage = " :( please don't forget to remove 'debug()'  :( ";

module.exports = {
  rules: {
    "no-test-only": context =>
    ({
      MemberExpression: function (node) {
        if (node.object.name === "test" && node.property.name === "only") {
          context.report(node, testOnlyMessage);
        } else if (node.object.type === "CallExpression" && node.property.name === "only" ){
          context.report(node, testOnlyMessage);
        } else if (node.object.name === "QUnit" && node.property.name === "only" ){
          context.report(node, testOnlyMessage);
        }
      }
    }),
    "no-test-debug": context =>
    ({
      MemberExpression: function (node) {
        if (node.object.name === "t" && node.property.name === "debug") {
          context.report(node, debugMessage);
        } else if (node.object.type === "CallExpression" && node.property.name === "debug" ){
          context.report(node, debugMessage);
        }
      }
    }),
  }
};