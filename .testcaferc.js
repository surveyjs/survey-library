

module.exports = {
  "browsers": [`chrome:${require("puppeteer").executablePath()}:headless --window-size=1920,1080`],
  "nativeAutomation": "true",
  "concurrency": 4,
  "quarantineMode": {
    "successThreshold": 1,
    "attemptLimit": 5
  }
}