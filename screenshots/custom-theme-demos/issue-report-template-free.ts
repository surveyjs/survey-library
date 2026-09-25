export const survey = {
  "title": "Report an Issue",
  "description": "This form is designed to report issues and propose suggestions for improvement. Your feedback is invaluable in helping us make our services better and resolve issues promptly. Please complete the form below in as much detail as possible.",
  "completedHtml": "<div style=\"max-width:688px;text-align:center;margin:16px auto;\">\n\n<div style=\"padding:0 24px;\">\n<h4>Thank you.</h4>\n<p>Your message has been sent successfully.</p>\n</div>\n\n</div>\n\n",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "panel",
          "name": "issue-report",
          "elements": [
            {
              "type": "text",
              "name": "issue-title",
              "width": "100%",
              "minWidth": "auto",
              "title": "Title"
            },
            {
              "type": "comment",
              "name": "issue-details",
              "width": "100%",
              "minWidth": "auto",
              "title": "Details",
              "maxLength": 512,
              "rows": 6,
              "placeholder": "Introduce the problem and expand on what you put in the title. Describe what you tried, what you expected to happen, and what actually resulted.",
              "autoGrow": true,
              "allowResize": false
            },
            {
              "type": "rating",
              "name": "issue-priority",
              "title": "Level of priority",
              "autoGenerate": false,
              "rateCount": 3,
              "rateValues": [
                {
                  "value": 1,
                  "text": "Low"
                },
                {
                  "value": 2,
                  "text": "Medium"
                },
                {
                  "value": 3,
                  "text": "High"
                }
              ]
            },
            {
              "type": "file",
              "name": "attached-files",
              "title": "Attachments",
              "allowMultiple": true,
              "filePlaceholder": "Click the button below to select files to upload."
            },
            {
              "type": "text",
              "name": "email",
              "width": "100%",
              "minWidth": "auto",
              "title": "Email address"
            }
          ],
          "width": "100%"
        }
      ]
    }
  ],
  "questionDescriptionLocation": "underInput",
  "questionErrorLocation": "bottom",
  "completeText": "Submit",
  "widthMode": "static",
  "width": "720"
};

export const theme = {
  "themeName": "custom",
  "colorPalette": "light",
  "isPanelless": false,
  "backgroundImage": "https://api.surveyjs.io/private/Surveys/files?name=7784247a-6d78-4801-9480-dc22fbed404f",
  "backgroundImageFit": "auto",
  "backgroundImageAttachment": "fixed",
  "backgroundOpacity": 1,
  "cssVariables": {
    "--sjs-editorpanel-hovercolor": "rgba(189, 236, 235, 1)",
    "--sjs-questionpanel-hovercolor": "rgba(189, 236, 235, 1)",
    "--sjs-corner-radius": "8px",
    "--sjs-base-unit": "8px",
    "--sjs-shadow-small": "0px 0px 0px 2px rgba(53, 52, 48, 1),2px 2px 0px 2px rgba(53, 52, 48, 1)",
    "--sjs-font-questiontitle-color": "rgba(14, 13, 8, 1)",
    "--sjs-font-questiondescription-color": "rgba(53, 52, 48, 1)",
    "--sjs-shadow-inner": "inset 0px 0px 0px 2px rgba(53, 52, 48, 1)",
    "--sjs-font-editorfont-color": "rgba(14, 13, 8, 1)",
    "--sjs-font-editorfont-placeholdercolor": "rgba(14, 13, 8, 0.5)",
    "--sjs-border-default": "rgba(53, 52, 48, 1)",
    "--sjs-border-light": "rgba(53, 52, 48, 1)",
    "--sjs-general-backcolor": "rgba(252, 246, 232, 1)",
    "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
    "--sjs-general-backcolor-dim-light": "rgba(255, 255, 255, 0.99)",
    "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)",
    "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
    "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
    "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.1)",
    "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.1)",
    "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
    "--sjs-special-red-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-green": "rgba(25, 179, 148, 1)",
    "--sjs-special-green-light": "rgba(25, 179, 148, 0.1)",
    "--sjs-special-green-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-blue": "rgba(67, 127, 217, 1)",
    "--sjs-special-blue-light": "rgba(67, 127, 217, 0.1)",
    "--sjs-special-blue-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-yellow": "rgba(255, 152, 20, 1)",
    "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)",
    "--sjs-special-yellow-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-general-backcolor-dim": "#FCF6E8",
    "--sjs-primary-backcolor": "rgba(53, 52, 48, 1)",
    "--sjs-primary-backcolor-dark": "rgba(100, 99, 94, 1)",
    "--sjs-primary-backcolor-light": "rgba(53, 52, 48, 0.1)",
    "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
    "--sjs-special-red": "rgba(229, 10, 62, 1)",
    "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)",
    "--sjs-font-headertitle-color": "rgba(14, 13, 8, 1)",
    "--sjs-font-headerdescription-weight": "600",
    "--sjs-font-headerdescription-size": "16px",
    "--sjs-font-headerdescription-color": "rgba(14, 13, 8, 1)",
    "--sjs-font-headertitle-weight": "700",
    "--sjs-font-pagetitle-weight": "700"
  },
  "header": {
    "height": 208,
    "textAreaWidth": 544
  },
  "headerView": "advanced"
};
