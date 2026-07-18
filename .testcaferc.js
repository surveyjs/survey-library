

module.exports = {
  "browsers": [`chrome:${require("puppeteer").executablePath()}:headless --no-sandbox --disable-dev-shm-usage`],
  "nativeAutomation": "true",
  "concurrency": 4,
  "quarantineMode": {
    "successThreshold": 1,
    "attemptLimit": 5
  }
}