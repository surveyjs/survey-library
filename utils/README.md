# SurveyJS JSON Obfuscator

This tool is designed to obfuscate survey JSON schemas by replacing titles, descriptions, placeholders, and other meaningful texts with randomized sequences of characters. The obfuscation may be useful if you need to attach a survey JSON schema to a bug report for investigation by the SurveyJS team and want to strip the schema of all sensitive data.

![SurveyJS JSON Obfuscator](https://surveyjs.io/stay-updated/release-notes/articles/v1.12.14/json-obfuscator.png)

Usage:

1. Clone the `survey-library` GitHub repository.
2. Open the console in the root folder and build the `survey-core` bundle:

    ```
    npm run build_core
    ```

3. Run the following command:

    ```
    node .\utils\json_obfuscator.js [path\to\the\survey\json\schema.json]
    ```

This command produces a file named as the original with suffix `obf`. For example, `nps.json` → `nps.obf.json`. The obfuscated file is placed in the same folder as the original.