import config from "../../playwright.config";
if (config.webServer && !Array.isArray(config.webServer)) {
  config.webServer.command = "npm run serve:example:prod";
}
export default config;
