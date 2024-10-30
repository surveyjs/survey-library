const minimist = require("minimist");

// eslint-disable-next-line no-undef
const args = minimist(process.argv.slice(2));
const environment = args.env;

export const frameworks = environment
  ? [environment]
  : ["knockout", "react", "vue"/*, "jquery-ui"*/];

// eslint-disable-next-line no-console
console.log("Frameworks: " + frameworks.join(", "));
export const url = "http://127.0.0.1:8080/examples_test/default/";
export const urlV2 = "http://127.0.0.1:8080/examples_test/defaultV2/";
export const url_test = "http://127.0.0.1:8080/examples_test/";
export const FLOAT_PRECISION = 0.01;

export const applyTheme = async (page, theme: string) => {
  await page.evaluate((theme) => {
    window["Survey"].StylesManager.applyTheme(theme);
  }, theme);
};