// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function (config) {
  config.set({
    basePath: "./",
    preprocessors: {
      "../../tests/markup/snapshots/*.snap.html": ["html2js"]
    },
    files: [
      "../../tests/markup/snapshots/*.snap.html"
    ],
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("karma-webpack"),
      require("@angular-devkit/build-angular/plugins/karma"),
      require('karma-html2js-preprocessor')
    ],
    html2JsPreprocessor: {
      processPath: function(filePath) {
        return filePath.replace(/.*\/markup\/snapshots/, "./snapshots");
      }
    },
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "../../coverage/angular-ui"),
      subdir: ".",
      reporters: [
        { type: "html" },
        { type: "text-summary" }
      ]
    },
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true
  });
};
