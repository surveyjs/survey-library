var chooseTestInput = document.querySelector('#testName');
var modifications;

chooseTestInput.addEventListener('change', function() {
    var storage = SurveysStorage[chooseTestInput.value];
    if (storage.beforeRender) storage.beforeRender();
    if (storage.react_beforeRender) storage.react_beforeRender();

    var model = new Survey.ReactSurveyModel(storage.data);

    modifications = storage.modifications.concat(storage.react_modifications || []);

    ReactDOM.render(
        <App model={model} css={storage.css || {}}/>,
        document.getElementById('root')
    );
});

var Question = React.createClass({
    render: function () {
        return (
            <div>
                <Survey.Survey model={this.props.model} css={this.props.css} onComplete={onSurveyComplete}/>
            </div>
        );
    }
});

var ModButton = React.createClass({
    onClick: function() {
        var survey = this.props.model,
            mod = this.props.modification,
            q;

        if (typeof mod.value === "function") {
            mod.value(survey);
        } else {
            q = survey.getQuestionByName(mod.questionName || 'car');
            this.mergeOptions(q, mod.value);
            survey.render();
        }
    },

    mergeOptions: function (obj1, obj2){
        for (var attrname in obj2) {
            obj1[attrname] = obj2[attrname];
        }
    },

    render: function () {
        var mod = this.props.modification;
        return (
            <button id={mod.title} onClick={this.onClick}>
                {mod.title}
            </button>
        );
    }
});

var App = React.createClass({
    render: function () {
        var model = this.props.model;

        var template = modifications.map(function (item, index) {
            return (
                <ModButton key={uuid.v1()} modification={item} model={model}/>
            )
        });

        return (
            <div>
                <Question model={this.props.model} css={this.props.css}/>
                <br/><br/><hr/>
                {template}
                <hr/>
            </div>
        );
    }
});

var onSurveyComplete = function(survey) {
    window.SurveyResult = survey.data;
};