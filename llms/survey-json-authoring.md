# SurveyJS Survey JSON Schema Authoring Guide

Generated from survey-core v2.5.34 by `survey-utils generate-doc --llm-guide`. Do not hand-edit: every fact below is extracted from the library, and the next run overwrites this file.

## Output Rules

When you are asked for a survey, reply with **one JSON object and nothing else**:

- No Markdown fences, no prose before or after, no comments, no trailing commas.
- Use only the `type` strings listed under "Question types". There are no others.
- Give every question a `name` that is unique in the document; it is the key in the result data.
- An expression may only reference the `name` of a question that exists in the document.
- Never invent property names.
- Never invent question types.
- Never use deprecated properties.
- Use enum values exactly as documented.
- Use expressions only where the property accepts expressions.
- Do not serialize default values.
- Validate the result against the survey definition JSON: https://unpkg.com/survey-core@2.5.34/surveyjs_definition.json

## Survey Structure

A survey is one JSON object. It holds `pages`, each page holds `elements`, and each element is a question or a panel. A one-page survey may put `elements` at the root instead; the library wraps them in a page.

**Minimal survey**

```json
{
  "title": "Customer Feedback",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "fullName",
          "title": "Your name"
        }
      ]
    }
  ]
}
```

`name` is required on a question, must be unique across the survey, and is the key the answer appears under in the result data and the name expressions refer to. `title` is what the respondent reads; when it is missing the `name` is shown instead.

## API Reference

TODO