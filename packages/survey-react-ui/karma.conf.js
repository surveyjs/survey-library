module.exports = function (config) {
  config.set({
    basePath: "./",
    frameworks: ["qunit"],
    files: ["tests/bundle/test.js"],
    exclude: [],
    captureTimeout: 210000,
    browserDisconnectTimeout: 100000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 100000,
    junitReporter: {
      outputDir: "tmp/testresults/",
      outputFile: "test-results.xml"
    },
    reporters: ["progress", "dots", "junit"],
    browsers: ["ChromeHeadlessNoSandbox"],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: [
          "--no-sandbox",
          "--disable-gpu",
          "--no-default-browser-check",
          "--no-first-run",
          "--disable-default-apps",
          "--disable-popup-blocking",
          "--disable-translate",
          "--disable-background-timer-throttling",
          "--disable-renderer-backgrounding",
          "--disable-device-discovery-notifications",
          "--disable-web-security"
        ]
      }
    },
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity
  });
};