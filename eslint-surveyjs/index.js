module.exports = {
  rules: {
    "no-test-only": context =>
    ({
      MemberExpression: function (node) {
        if (node.object.name === "test" && node.property.name === "only") {
          context.report(node, " :( please don't forget to remove 'test.only' testcafe statement it will disable all other tests :( ");
        }
      }
    }),
  }
};

