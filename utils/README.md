# SurveyJS JSON Obfuscator

This tool is designed to obfuscate survey JSON schemas by replacing titles, descriptions, placeholders, and other meaningful texts with randomized sequences of characters. The obfuscation may be useful if you need to attach a survey JSON schema to a bug report for investigation by the SurveyJS team and want to strip the schema of all sensitive data.

![SurveyJS JSON Obfuscator](https://surveyjs.io/stay-updated/release-notes/articles/v1.12.14/json-obfuscator.png)

Usage:

1. Clone the `survey-library` GitHub repository.
2. Open the console in the root folder and build the `survey-core` bundle:

    ```
    cd packages/survey-core
    npm run build
    ```

3. Run the following command:

    ```
    cd ../..
    node .\utils\json_obfuscator.js [path\to\the\survey\json\schema.json]
    ```

This command produces a file named as the original with suffix `obf`. For example, `nps.json` → `nps.obf.json`. The obfuscated file is placed in the same folder as the original.

Alternatively, you can download an obfuscated JSON schema using our online Form Builder:

1. Open the [online Form Builder](https://surveyjs.io/create-free-survey) in your browser.
2. Move to the JSON Editor tab.
3. Copy and paste your survey JSON schema in the text area.
4. Click the **Download** button in the toolbar and select **Download obfuscated JSON** from the appeared drop-down menu.

![Download obfuscated JSON using online Form Builder](https://surveyjs.io/survey-creator/documentation/images/download-obfuscated-json.png)