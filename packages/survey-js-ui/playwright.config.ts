import config from "../../playwright.config";
if(config.webServer && !Array.isArray(config.webServer)) {
  config.webServer.command = "npx http-server --silent";
}
export default config;