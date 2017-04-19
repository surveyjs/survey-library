import {frameworks, url, setOptions, initSurvey, addExternalDependencies, getSurveyResult} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const title = `imagepicker`;

const json = { questions: [
    { type: 'dropdown', name: 'choosepicture', renderAs: 'imagepicker', title: 'What animal would you like to see first ?',
        choices: [
            {value: 'lion', text: 'http://surveyjs.org/images/image-picker/lion.jpg'},
            {value: 'giraffe', text: 'http://surveyjs.org/images/image-picker/giraffe.jpg'},
            {value: 'panda', text: 'http://surveyjs.org/images/image-picker/panda.jpg'},
            {value: 'camel', text: 'http://surveyjs.org/images/image-picker/camel.jpg'}
        ]
    }
]};

const getWidgetConfig = function(framework) {
    var widget;

    if (framework !== 'vue') {
        widget = {
            name: 'imagepicker',
            isFit : function(question) { return question["renderAs"] === 'imagepicker'; },
            isDefaultRender: true,
            afterRender: function(question, el) {
                var $el = $(el);

                var options = $el.find('option');
                for (var i=1; i<options.length; i++) {
                    options[i].dataset['imgSrc'] = options[i].text;
                }
                $el.imagepicker({
                    hide_select : true,
                    show_label  : false,
                    selected: function(opts) {
                        question.value = opts.picker.select[0].value;
                    }
                })
            }
        };
    } else {
        var widget = {
            name: "imagepicker",
            isFit : function(question) { return question["renderAs"] === 'imagepicker'; },
        }

        Vue.component(widget.name, {
            props: ['question', 'css', 'isEditMode'],
            template: `
                <select :id="question.inputId" v-model="question.value">
                    <option v-for="(item, index) in question.visibleChoices" :value="item.value">{{ item.text}}</option>
                </select>
            `,
            mounted: function () {
                var vm = this;
                var $el = $(vm.$el);
                var options = $el.find('option');
                for (var i=0; i<options.length; i++) {
                    options[i].dataset["imgSrc"] = options[i].text;
                }
                $el.imagepicker({
                    hide_select : true,
                    show_label  : false,
                    selected: function(opts) {
                        vm.question.value = opts.picker.select[0].value;
                    }
                })
            }
        })
    }

    return {
        widget: widget,
        questionType: 'dropdown',
        renderAs: 'imagepicker'
    }
};

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}/customWidget.html`

        .beforeEach( async ctx => {
            await initSurvey(framework, json, "bootstrap", getWidgetConfig);
        });

    test(`test`, async t => {
        await t
            .hover(`.image_picker_image`)
    })
});