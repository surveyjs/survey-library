# SurveyJS Form Library Localization

This topic describes how to add a new dictionary or update an existing dictionary to localize your survey or form. Refer to the following help topic for information on how to configure survey localization in your application: [Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization).

## Add a New Dictionary

Follow the steps below to add a new localization dictionary:

1. Fork the [`survey-library`](https://github.com/surveyjs/survey-library) repository.
2. Create a new file in the [`packages/survey-core/src/localization`](../localization/) directory and name it `[language name].ts`, for example, `french.ts`.
3. Copy the content from the [`english.ts`](../localization/english.ts) file and uncomment the first and last lines.
4. Translate required strings.
5. Open the [`entries/chunks/localization.ts`](../../entries/chunks/localization.ts) file and import your file in it for Webpack. For example, the following code imports the `french.ts` file:
  
    ```js
    import "../../src/localization/french";
    ```

6. [Rebuild the library](../../README.md#build-survey-model-from-sources).
7. *(Optional)* Create a [pull request](https://github.com/surveyjs/survey-library/pulls) to share your dictionary with the community. After the PR is merged, your localization will be included in the next official release.

## Update an Existing Dictionary

Follow the steps below to update an existing localization dictionary:

1. Fork the [`survey-library`](https://github.com/surveyjs/survey-library) repository.
2. Open the [`packages/survey-core/src/localization`](../localization/) directory and find the required dictionary.
3. Change required translations.
4. Delete the `[Auto-translated]` prefix from the comments above the translations you changed.
5. [Rebuild the library](../../README.md#build-survey-model-from-sources).
6. *(Optional)* Create a [pull request](https://github.com/surveyjs/survey-library/pulls) to share your translations with the community. After the PR is merged, your localization will be included in the next official release.
