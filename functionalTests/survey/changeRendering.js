// TODO this example disable, uncomment for enable

/*
import {frameworks, url, setOptions, initSurvey, getSurveyResult} from "../helper";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const title = `changeRendering`;

const setupSurvey = ClientFunction((framework) => {
    const setupKnockout = function() {
        var survey = new Survey.Survey({ title: "Tell us, what technologies do you use?", pages: [
            { name:"page1", questions: [
                { type: "radiogroup", choices: [ "Yes", "No" ], isRequired: true, name: "frameworkUsing",title: "Do you use any front-end framework like Bootstrap?" },
                { type: "checkbox", choices: ["Bootstrap","Foundation"], hasOther: true, isRequired: true, name: "framework", title: "What front-end framework do you use?", visible: false }
            ]},
            { name: "page2", questions: [
                { type: "radiogroup", choices: ["Yes","No"],isRequired: true, name: "mvvmUsing", title: "Do you use any MVVM framework?" },
                { type: "checkbox", choices: [ "AngularJS", "KnockoutJS", "React" ], hasOther: true, isRequired: true, name: "mvvm", title: "What MVVM framework do you use?", visible: false } ] },
            { name: "page3",questions: [
                { type: "comment", name: "about", title: "Please tell us about your main requirements for Survey library" } ] }
        ],
            triggers: [
                { type: "visible", operator: "equal", value: "Yes", name: "frameworkUsing", questions: ["framework"]},
                { type: "visible", operator: "equal", value: "Yes", name: "mvvmUsing", questions: ["mvvm"]}
            ]
        }, "surveyElement");

        new Survey.SurveyTemplateText().replaceText('<div class="btn-group"><!-- ko foreach: { data: question.visibleChoices, as: "item", afterRender: question.koAfterRender}  --> <label class="btn btn-default" data-bind="css:{active: $data.value == question.value}, style:{width: question.koWidth}">   <input type="radio" style="display:none;" data-bind="attr: {name: question.name, value: item.value}, checked: question.value" /> <span data-bind="text: item.text"></span></label><!-- /ko --><div data-bind="visible:question.hasOther"><div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.isOtherSelected } }"></div></div></div>', "question", "radiogroup");
        new Survey.SurveyTemplateText().replaceText('<div class="btn-group"><!-- ko foreach: { data: question.visibleChoices, as: "item", afterRender: question.koAfterRender}  --> <label class="btn btn-default" data-bind="css:{active: question.value.indexOf($data.value) > -1}, style:{width: question.koWidth}">   <input style="display:none;" type="checkbox" data-bind="attr: {name: question.name, value: item.value}, checked: question.value" /> <span data-bind="text: item.text"></span></label><!-- /ko --><div data-bind="visible:question.hasOther"><div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.isOtherSelected } }"></div></div></div>', "question", "checkbox");

        survey.onComplete.add(function() {
            window["SurveyResult"] = survey.data;
        });

        survey.render();
    };

    const setupReact = function() {
        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }

        function _possibleConstructorReturn(self, call) {
            if (!self) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return call && (typeof call === "object" || typeof call === "function") ? call : self;
        }

        function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
        }

        var MySurveyQuestionRadiogroup = function (_Survey$SurveyQuestio) {
            _inherits(MySurveyQuestionRadiogroup, _Survey$SurveyQuestio);

            function MySurveyQuestionRadiogroup() {
                _classCallCheck(this, MySurveyQuestionRadiogroup);

                return _possibleConstructorReturn(this, (MySurveyQuestionRadiogroup.__proto__ || Object.getPrototypeOf(MySurveyQuestionRadiogroup)).apply(this, arguments));
            }

            _createClass(MySurveyQuestionRadiogroup, [{
                key: "render",
                value: function render() {
                    if (!this.question) return null;
                    return React.createElement("form", {className: "btn-group", ref: "toggleInput"}, this.getItems());
                }
            }, {
                key: "renderRadio",
                value: function renderRadio(key, item, isChecked, divStyle, otherItem) {
                    var className = "btn btn-default";
                    if (isChecked) className += " active";
                    if (!divStyle) divStyle = {display: "none"};
                    return React.createElement("label", {
                        key: key,
                        style: divStyle,
                        className: className
                    }, React.createElement("input", {
                        type: "radio",
                        checked: isChecked,
                        value: item.value,
                        onChange: this.handleOnChange,
                        style: {display: "none"}
                    }), React.createElement("span", {}, item.text), otherItem);
                }
            }]);

            return MySurveyQuestionRadiogroup;
        }(Survey.SurveyQuestionRadiogroup);

        var MySurveyQuestionCheckboxItem = function (_Survey$SurveyQuestio2) {
            _inherits(MySurveyQuestionCheckboxItem, _Survey$SurveyQuestio2);

            function MySurveyQuestionCheckboxItem() {
                _classCallCheck(this, MySurveyQuestionCheckboxItem);

                return _possibleConstructorReturn(this, (MySurveyQuestionCheckboxItem.__proto__ || Object.getPrototypeOf(MySurveyQuestionCheckboxItem)).apply(this, arguments));
            }

            _createClass(MySurveyQuestionCheckboxItem, [{
                key: "renderCheckbox",
                value: function renderCheckbox(isChecked, divStyle, otherItem) {
                    var className = "btn btn-default";
                    if (isChecked) className += " active";
                    return React.createElement("label", {
                        className: className,
                        style: divStyle
                    }, React.createElement("input", {
                        type: "checkbox",
                        checked: isChecked,
                        onChange: this.handleOnChange,
                        style: {display: "none"}
                    }), React.createElement("span", {}, this.item.text), otherItem);
                }
            }]);

            return MySurveyQuestionCheckboxItem;
        }(Survey.SurveyQuestionCheckboxItem);

        var MySurveyQuestionCheckbox = function (_Survey$SurveyQuestio3) {
            _inherits(MySurveyQuestionCheckbox, _Survey$SurveyQuestio3);

            function MySurveyQuestionCheckbox() {
                _classCallCheck(this, MySurveyQuestionCheckbox);

                return _possibleConstructorReturn(this, (MySurveyQuestionCheckbox.__proto__ || Object.getPrototypeOf(MySurveyQuestionCheckbox)).apply(this, arguments));
            }

            _createClass(MySurveyQuestionCheckbox, [{
                key: "render",
                value: function render() {
                    if (!this.question) return null;
                    return React.createElement("div", {className: "btn-group", ref: "toggleInput"}, this.getItems());
                }
            }, {
                key: "renderItem",
                value: function renderItem(key, item) {
                    return React.createElement(MySurveyQuestionCheckboxItem, {
                        key: key,
                        question: this.question,
                        item: item,
                        css: this.css,
                        rootCss: this.rootCss
                    });
                }
            }]);

            return MySurveyQuestionCheckbox;
        }(Survey.SurveyQuestionCheckbox);

        Survey.ReactQuestionFactory.Instance.registerQuestion("checkbox", function (props) {
            return React.createElement(MySurveyQuestionCheckbox, props);
        });

        Survey.ReactQuestionFactory.Instance.registerQuestion("radiogroup", function (props) {
            return React.createElement(MySurveyQuestionRadiogroup, props);
        });

        ReactDOM.render(React.createElement(Survey.Survey, { model: survey }), document.getElementById("surveyElement"));
    };

    const setupVue = function() {};

    const setupAngular = function() {};

    if (framework === "knockout") {
        setupKnockout();
    } else if (framework === "react") {
        setupReact();
    } else if (framework === "vue") {
        setupVue();
    }
});

const json = {
    title: "Tell us, what technologies do you use?", pages: [
    { name:"page1", questions: [
            { type: "radiogroup", choices: [ "Yes", "No" ], isRequired: true, name: "frameworkUsing",title: "Do you use any front-end framework like Bootstrap?" },
            { type: "checkbox", choices: ["Bootstrap","Foundation"], hasOther: true, isRequired: true, name: "framework", title: "What front-end framework do you use?", visible: false }
        ]},
        { name: "page2", questions: [
            { type: "radiogroup", choices: ["Yes","No"],isRequired: true, name: "mvvmUsing", title: "Do you use any MVVM framework?" },
            { type: "checkbox", choices: [ "AngularJS", "KnockoutJS", "React" ], hasOther: true, isRequired: true, name: "mvvm", title: "What MVVM framework do you use?", visible: false } ] },
        { name: "page3",questions: [
            { type: "comment", name: "about", title: "Please tell us about your main requirements for Survey library" } ] }
    ],
    triggers: [
        { type: "visible", operator: "equal", value: "Yes", name: "frameworkUsing", questions: ["framework"]},
        { type: "visible", operator: "equal", value: "Yes", name: "mvvmUsing", questions: ["mvvm"]}
    ]
};

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await initSurvey(framework, json);
            await setupSurvey(framework);
        });

    if (framework === "react" || framework === "knockout") {
        test(`check new elements rendering`, async t => {
            const getBtn = Selector(index => document.querySelectorAll('.btn-group .btn')[index - 1]);
            let surveyResult;

            await t
                .click(getBtn(1))
                .hover(getBtn(2))
                .hover(getBtn(3))
                .hover(getBtn(4))
                .hover(getBtn(5));

            await t
                .click(getBtn(3))
                .click(`input[value=Next]`);

            await t
                .click(getBtn(2))
                .click(`input[value=Next]`)
                .click(`input[value=Complete]`);

            surveyResult = await getSurveyResult();
            await t.expect(surveyResult).eql({
                "frameworkUsing":"Yes",
                "framework":["Bootstrap"],
                "mvvmUsing":"No"
            });
        });
    }
});*/
