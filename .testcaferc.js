

module.exports = {
  "browsers": {
    path: require("puppeteer").executablePath(),
    cmd: '--headless'
  },
  "nativeAutomation": "true",
  "concurrency": 4,
  "quarantineMode": {
    "successThreshold": 1,
    "attemptLimit": 5
  }
}