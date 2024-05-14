const fs = require("fs");
const jsonPath = `${__dirname}/../../build/survey-angular-ui/package.json`;
const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
json["peerDependencies"]["survey-core"] = json.version;
fs.writeFileSync(jsonPath, JSON.stringify(json, undefined, 2));
