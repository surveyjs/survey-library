import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test Survey navigation custom buttons",
      json: {
        questions: [
          {
            "type": "html",
            "name": "q1",
            "html": "<div></div>"
          }
        ]
      },
      event: "onAfterRenderSurvey",
      initSurvey: (survey) => {
        survey.navigationBar.setItems([]);
        survey.addNavigationItem({
          id: "custom-action",
          title: "Custom Action",
          tooltip: "Custom Tooltip"
        });
      },
      getElement: (el) => {
        return <HTMLElement>el?.querySelector("form");
      },
      snapshot: "survey-navigation"
    }, {
      name: "Test Survey theme css variables",
      json: {
        questions: [
          {
            "type": "html",
            "name": "q1",
            "html": "<div></div>"
          }
        ]
      },
      event: "onAfterRenderSurvey",
      initSurvey: (survey) => {
        survey.applyTheme({ cssVariables: { "--sjs-test": "val" } });
      },
      getSnapshot: el => {
        el.innerHTML = "";
        el.removeAttribute("data-bind");
        return el.outerHTML;
      },
      snapshot: "survey-theme-variables"
    }, {
      name: "Test Survey backgroundImage",
      json: {
        backgroundImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABQCAYAAAC6aDOxAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATkSURBVHgB5ZxNUhNBFIBf9xBBccFWQulwAvEAUuEEFidQTyCsXIonUE+gN9AbEEOVW3DnjlhGXRo3EBKm2+7AxEmnf2aGzLxX8G0IMxNIPV5/3fNeDwCE+XX78Q4gw4EovUZrQwA8AWRIBuj3UivmDfGRAfQBGZIBklzsS4AYGDsCZMgFqLe8+XYcHIVk0AVkFoAQP+9s7oGEF+n3USK7gAyZDNJSVl9eZY9JSLqADAMCaClPvJOhedJB/3wkMsgWHAW6oDXoAcpKOYuUEn2K16BK2pTyFBx/itegZZBNylm4wJ/iNSgZdCnlj9JzjWT4U7wGJYMcUp6+ZhR9BwLUHiCXlE1GyzdwiHmlPE1/vd8mMYvVlkEhKWdRUzyJGUxTSwblkXIWCmWOlFoCJFRwIId3JhAoc6RUPsS0lNWXjSLvoVDmSKk0QLqmzPxStg4lCmWOlMoCpKUsGXvjvEDAnusUhTJHSiUBSmvK7ivkh+ESf6derNjOrg6+kFgkaioJkLiYsWLrSQnd4a1otzFySpuMoDVzD5BXyjo4km/pRaDg9gBRKXOkzDVAISknjO+uD9pd/XrhXDywXkSkzJEytwDlkfL9k/anzG+ObZepAJPKoLksFMMrZfmhOTh4PX2MbegxZ7n2+mVQHinPHpbWGUwVyq6Xg/JK2XLO+p7BUvQVCHGltoqWss87CfDtKe9cooekyrpjII6U8LZ0BhWWcobzhQI3rngcrZ12dktJupyU/6Nmqhgoc6GGbf2yVAaVkXIWJh1rICLIc76drtcKByhQvug7pTwFK1T+qBOWwM7aqD1ZahQKUHClDPx5Gnnvh2D2m1RstJRXzzrvssdyz2JayqwhDp0XKCk3B53XQJTjldbK4lAcejoqR82TziPzYC5Jh6TMpPy06pEyBRojsef15qWUTXINsZCUzxaj50AY3W7yqSErZZNggOYjZTx+3G21wNNuMqVs4g3QvKSMhVZDJMR713mblE2ckr72UlZqaJ521kM/xyrpGyLlLciBdYjdZCmbzAwxLWWWb4NBrahadXvt9CD4V9dS5kLsOy8oqIapDMrR6EMjT78+j5SLenMSoGD5Apsc/XrvxiylBl2+gIKMJV109wUGoWL+eGOWvLqUTcYBKrz7AgHm2TMU2pg1lvKo3HqNl9l9gUGSRH9tx4Mbs5SUfSvlECQeRUjRi7tbQ/HHds72WILrEYYULeUy3slC6nGohXNnJlszoAopm5AKkHQU0mz9eu9u2StI2YTU82K6Xy9tg97YcVallE1oPXHo6tcD66avq5ayCakMCvXrQ+u1sZTnXGGg5aBAv74OKZvQyiBPv74XVbNSDhEBEcbDh8kdy6l+lKi7RICXrvcqKW89GLa/QQWQGWKBfn1tUjYhEyBPv97ZZCxTvigKoQAV7Ncr74wWeeVlX0KzWIF+vW9j1pyhk0EF+vVcymd1tZvIBEjdb+XLICXle4ODz1ATlBaKwQyqQ8omJALUW26Fs6cmKZvQ+NcUIf/UKGUTEgGKEvHQd75OKc/8bqAA96yia5ayCY0hJllsP16/lE1oZBCT8cwxJCmb0AiQeR+GKGUT9ADpVg8YayBMKZugB2im1YMsZRP0AGXXQBSkbIIeoMkaiIiUTQhImsWUpGyCHiBV5ogpSZkcvaXNp0CYf3BxyTNPele9AAAAAElFTkSuQmCC",
        backgroundImageFit: "cover",
        backgroundImageAttachment: "fixed",
        backgroundOpacity: 0.4,
        questions: [
          {
            "type": "html",
            "name": "q1",
            "html": "<div></div>"
          }
        ]
      },
      event: "onAfterRenderSurvey",
      initSurvey(survey) {
        survey["needRenderIcons"] = false;
      },
      getSnapshot: el => {
        return el.children[0].children[0].outerHTML;
      },
      snapshot: "survey-theme-backgroundImage"
    },
    {
      name: "Test survey logo (attribute sizes)",
      json: {
        "logo": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
        "logoPosition": "right",
        "logoWidth": "200px",
        "logoHeight": "300px",
        "title": "Test",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ]
          }
        ]
      },
      event: "onAfterRenderHeader",
      snapshot: "survey-logo-attribute-sizes",
      getElement: (el) => {
        return <HTMLElement>el?.querySelector(".sv_logo");
      }
    },
    {
      name: "Test survey logo (style sizes)",
      json: {
        "logo": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
        "logoPosition": "right",
        "logoWidth": "30%",
        "logoHeight": "auto",
        "title": "Test",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ]
          }
        ]
      },
      event: "onAfterRenderHeader",
      snapshot: "survey-logo-style-sizes",
      getElement: (el) => {
        return <HTMLElement>el?.querySelector(".sv_logo");
      }
    },
    {
      name: "Test survey description",
      json: {
        "title": "Test",
        "description": "Description",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ]
          }
        ]
      },
      event: "onAfterRenderHeader",
      snapshot: "survey-header"
    },
    {
      name: "Test survey description - header advanced mode",
      json: {
        "title": "Test",
        "description": "Description",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ]
          }
        ],
        "headerView": "advanced"
      },
      event: "onAfterRenderSurvey",
      getElement: el => {
        return <HTMLElement>el?.querySelector(".sv-header__cell.sv-header__cell--middle.sv-header__cell--right") as HTMLElement;
      },
      snapshot: "survey-header-advanced"
    },
    {
      name: "Test survey description - header advanced mode mobile",
      json: {
        "title": "Test",
        "description": "Description",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ]
          }
        ],
        "headerView": "advanced"
      },
      event: "onAfterRenderSurvey",
      initSurvey: survey => survey.setIsMobile(true),
      getElement: el => {
        return <HTMLElement>el?.querySelector(".sv-header--mobile");
      },
      snapshot: "survey-header-advanced-mobile"
    }
  ]);