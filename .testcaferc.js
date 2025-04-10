

module.exports = {
  "browsers": [`chrome:${require("puppeteer").executablePath()}:headless --window-size=1920,1080`],
  "nativeAutomation": "true",
  "concurrency": 2,
  "quarantineMode": {
    "successThreshold": 1,
    "attemptLimit": 5
  }
}