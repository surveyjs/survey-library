

module.exports = {
  "browsers": [`chrome:${require("puppeteer").executablePath()}:headless`],
  "nativeAutomation": "true",
  "concurrency": 4,
  "stopOnFirstFail": true,
  "quarantineMode": {
    "successThreshold": 1,
    "attemptLimit": 5
  }
}