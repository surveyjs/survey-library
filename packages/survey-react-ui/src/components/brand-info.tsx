import React from "react";

export class BrandInfo extends React.Component<any, any> {
  render() {
    return (
      <div className="sv-brand-info">
        <a className="sv-brand-info__logo" href="https://surveyjs.io/?utm_source=built-in_links&utm_medium=online_survey_tool&utm_campaign=landing_page"><img src="https://surveyjs.io/Content/Images/poweredby.svg"/></a>
        <div className="sv-brand-info__text">Try and see how easy it is to <a href="https://surveyjs.io/create-survey?utm_source=built-in_links&utm_medium=online_survey_tool&utm_campaign=create_survey">create a survey</a></div>
        <div className="sv-brand-info__terms"><a href="https://surveyjs.io/TermsOfUse">Terms of Use & Privacy Statement</a></div>
      </div>
    );
  }
}
