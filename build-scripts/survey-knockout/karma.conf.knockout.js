var karmaKonf = require("../karma.conf");

module.exports = function(config) {
  karmaKonf(config);  
  config.set({
    basePath: "../../",
    files: ["tests/markup/question_knockout_tests.ts"],
  });
};
