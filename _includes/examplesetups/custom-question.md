{% if page.useangular %}
<h1>This feature is not supported yet</h1>

{% elsif page.usejquery %}
<h1>This feature is not supported yet</h1>

{% else %}

{% capture survey_setup %}

var survey = new Survey.Model({% include {{page.dataFile}} %});

{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));

{% elsif page.useknockout %}
survey.render("surveyElement");

{% endif %}

{% endcapture %}

{% include live-example-code.html %}

{% endif %}