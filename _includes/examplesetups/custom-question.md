{% if page.useangular %}
<h1>This feature is not supported yet. Please use knockout and react versions.</h1>

{% elsif page.usejquery %}
<h1>This feature is not supported yet.  Please use knockout and react versions.</h1>

{% elsif page.usevue %}
<h1>This feature is not supported yet.  Please use knockout and react versions.</h1>

{% else %}

{% if page.useknockout %}

{% capture ko_template %}
{% include templates/custom-question.html %}
{% endcapture %}

{% endif %}

{% capture survey_code_0 %}
// implements class inheritance
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

{% endcapture %}

{% capture survey_code %}
// implements question model
var QuestionEmojiModel = (function (_super) {

    __extends(QuestionEmojiModel, _super);

    function QuestionEmojiModel(name) {
        var _this = _super.call(this, name) || this;
        _this.rates = [];
        _this.rateValuesChangedCallback = function() {};
        return _this;
    }

    Object.defineProperty(QuestionEmojiModel.prototype, "rateValues", {
        get: function () { return this.rates; },
        set: function (newValue) {
            Survey.ItemValue.setData(this.rates, newValue);
            this.fireCallback(this.rateValuesChangedCallback);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(QuestionEmojiModel.prototype, "visibleRateValues", {
        get: function () {
            if (this.rateValues.length > 0)
                return this.rateValues;
            return QuestionEmojiModel.defaultRateValues;
        },
        enumerable: true,
        configurable: true
    });

    //"emoji" - identificator that will json serializer what question to create.
    QuestionEmojiModel.prototype.getType = function () {
        return "emoji";
    };

    QuestionEmojiModel.prototype.supportComment = function () { return true; };
    QuestionEmojiModel.prototype.supportOther = function () { return true; };
    QuestionEmojiModel.prototype.supportGoNextPageAutomatic = function () { return true; };

    return QuestionEmojiModel;
}(Survey.Question));

//static props
QuestionEmojiModel.defaultRateValues = [];

Survey.defaultStandardCss.emoji = {root: "sv_q_emoji", item: "sv_q_emoji_item"};
Survey.defaultBootstrapCss.emoji = {root: "btn-group", item: "btn btn-default"};

Survey.ItemValue.setData(QuestionEmojiModel.defaultRateValues, [1, 2, 3, 4, 5]);

//add class and it's properties into json meta data.
Survey.JsonObject.metaData.addClass(
    "emoji", //"emoji" - question type identificator

    //list of properties with their types (string is default) and other options.
    //For example: choices option will used by survey editor. There will be a dropdown editor with 5 options.
    [
        "hasComment:boolean",
        {
            name: "rateValues:itemvalues",
            onGetValue: function (obj) { return ItemValue.getData(obj.rateValues); },
            onSetValue: function (obj, value) { obj.rateValues = value; }
        }
    ],

    function () { return new QuestionEmojiModel(""); }, //json deserializer will call this function to create the object

    "question" //tell json serializer that we are inherited from 'question' class and we want to use all 'question' properties as well.
);

//Register the class as a quesiton. Survey editor will know it is a question and it will show it in question toolbox.
Survey.QuestionFactory.Instance.registerQuestion("emoji", (name) => { return new QuestionEmojiModel(name); });

{% endcapture %}

{% capture survey_code_1 %}
{% if page.usereact %}
var SurveyQuestionEmoji = (function (_super) {

    __extends(SurveyQuestionEmoji, _super);

    function SurveyQuestionEmoji(props) {
        var _this = _super.call(this, props) || this;
        _this.question = props.question;
        _this.css = props.css;
        _this.rootCss = props.rootCss;
        _this.handleOnChange = _this.handleOnChange.bind(_this);
        return _this;
    }
    SurveyQuestionEmoji.prototype.handleOnChange = function (event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    };
    SurveyQuestionEmoji.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
    };
    SurveyQuestionEmoji.prototype.render = function () {
        if (!this.question) return null;
        var values = [];
        for (var i = 0; i < this.question.visibleRateValues.length; i++) {
            values.push(this.renderItem("value" + i, this.question.visibleRateValues[i]));
        }
        var comment = this.question.hasOther ? this.renderOther() : null;
        return (
            <div className={this.css.root}>
                {values}
                {comment}
            </div>
        );
    };
    SurveyQuestionEmoji.prototype.renderItem = function (key, item) {
        var isChecked = this.question.value == item.value;
        var className = this.css.item;
        var emojiStyle = {
            "fontSize": "100px"
        };

        if (isChecked) {
            className += " active";
            emojiStyle["backgroundColor"] = "#18a689";
        } else {
            emojiStyle["backgroundColor"] = "#fff";
        }

        var style = {"display": "none"};

        return <label key={key} className={className}>
            <input
                type="radio"
                style={style}
                name={this.question.name}
                value={item.value}
                checked={this.question.value == item.value}
                onChange={this.handleOnChange}
            />
            <span style={emojiStyle}>{item.text}</span>
        </label>;
    };
    SurveyQuestionEmoji.prototype.renderOther = function () {
        return (
            <div className={this.css.other}>
                <SurveyQuestionCommentItem  question={this.question} css={this.rootCss} />
            </div>
        );
    };

    return SurveyQuestionEmoji;
}(React.Component));

//Tell json serializer to create exactly this class. Override it from the model that doesn't have any rendering functionality.
Survey.ReactQuestionFactory.Instance.registerQuestion("emoji", (props) => {
    return React.createElement(SurveyQuestionEmoji, props);
});

{% elsif page.useknockout %}
var QuestionEmojiImplementor = (function (_super) {

    __extends(QuestionEmojiImplementor, _super);

    function QuestionEmojiImplementor(question) {
        var _this = _super.call(this, question) || this;
        _this.koVisibleRateValues = ko.observableArray(_this.getValues());
        _this.question["koVisibleRateValues"] = _this.koVisibleRateValues;
        _this.koChange = function (val) { _this.koValue(val.itemValue); };
        _this.question["koChange"] = _this.koChange;
        _this.question.rateValuesChangedCallback = function () { _this.onRateValuesChanged(); };
        _this.question["koGetCss"] = function (val) {
            var css = _this.question.itemCss;
            return _this.question["koValue"]() == val.value ? css + " active" : css;
        };
        _this.question["koGetEmojiStyle"] = function (data) {
            return _this.question["koValue"]() == data.value ?
                {backgroundColor:"#18a689", fontSize: "100px"} :
                {backgroundColor:"#fff", fontSize: "100px"};
        };
        return _this;
    }

    QuestionEmojiImplementor.prototype.onRateValuesChanged = function () {
        this.koVisibleRateValues(this.getValues());
    };
    QuestionEmojiImplementor.prototype.getValues = function () {
        return this.question.visibleRateValues;
    };

    return QuestionEmojiImplementor;
}(Survey.QuestionImplementor));

var QuestionEmoji = (function (_super) {

    __extends(QuestionEmoji, _super);

    function QuestionEmoji(name) {
        var _this = _super.call(this, name) || this;
        _this.name = name;
        new QuestionEmojiImplementor(_this);
        return _this;
    }

    QuestionEmoji.prototype.onSetData = function () {
        this.itemCss = this.data["css"].emoji.item;
        this.itemCss = this.data["css"].emoji.item;
    };

    return QuestionEmoji;
}(QuestionEmojiModel));

Survey.JsonObject.metaData.overrideClassCreatore("emoji", function () { return new QuestionEmoji(""); });
Survey.QuestionFactory.Instance.registerQuestion("emoji", (name) => { return new QuestionEmoji(name); });

{% endif %}

{% endcapture %}

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