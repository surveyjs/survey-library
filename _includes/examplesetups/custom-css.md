{% capture survey_setup %}
var survey = new Survey.Model({% include surveys/questiontype-matrix.json %});
var myCss = {
        matrix: {root: "table table-striped"},
        navigationButton: "button btn-lg"   
   };

{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} css={myCss} />, document.getElementById("surveyElement"));

{% elsif page.useknockout%}
survey.css = myCss;

{% elsif page.useangular%}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey,
        css: myCss
    });
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery%}
$("#surveyElement").Survey({
    model: survey,
    css: myCss
});

{% elsif page.usevue%}
survey.css = myCss;
var app = new Vue({
    el: '#surveyElement',
    data: {
        survey: survey
    }
});

{% endif %}

{% endcapture %}

{% include live-example-code.html %}
<div>
    <p />
    <p>Set the css property to override the required css class(s).</p>
    <p>
    Currently you may override the following css classes:
    </p>
    <textarea id="surveyClasses" style="width:100%" rows="20"></textarea>
</div>
<script type="text/javascript">
    var css =  {
       "root":"",
       "header":"panel-heading",
       "body":"panel-body",
       "footer":"panel-footer",
       "navigationButton":"button btn-lg",
       "navigation":{
          "complete":"",
          "prev":"",
          "next":""
       },
       "progress":"progress center-block",
       "progressBar":"progress-bar",
       "pageTitle":"",
       "row":"",
       "question":{
          "root":"",
          "title":"",
          "comment":"form-control",
          "indent":20
       },
       "error":{
          "root":"alert alert-danger",
          "icon":"glyphicon glyphicon-exclamation-sign",
          "item":""
       },
       "checkbox":{
          "root":"form-inline",
          "item":"checkbox",
          "other":""
       },
       "comment":"form-control",
       "dropdown":"form-control",
       "matrix":{
          "root":"table table-striped"
       },
       "matrixdropdown":{
          "root":"table"
       },
       "matrixdynamic":{
          "root":"table",
          "button":"button"
       },
       "multipletext":{
          "root":"table",
          "itemTitle":"",
          "itemValue":"form-control"
       },
       "radiogroup":{
          "root":"form-inline",
          "item":"radio",
          "other":""
       },
       "rating":{
          "root":"btn-group",
          "item":"btn btn-default"
       },
       "text":"form-control",
       "window":{
          "root":"modal-content",
          "body":"modal-body",
          "header":{
             "root":"modal-header panel-title",
             "title":"pull-left",
             "button":"glyphicon pull-right",
             "buttonExpanded":"glyphicon pull-right glyphicon-chevron-up",
             "buttonCollapsed":"glyphicon pull-right glyphicon-chevron-down"
          }
       }
    };
    document.getElementById('surveyClasses').value = JSON.stringify(css, null, '\t');
</script>