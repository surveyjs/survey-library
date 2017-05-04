import {frameworks, url, setOptions, initSurvey, addExternalDependencies, getSurveyResult} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const title = `icheckmatrix`;

const json = { questions: [
    { type: "matrix", renderAs:"icheckmatrix", isRequired:true, name: "Quality", title: "Please indicate if you agree or disagree with the following statements",
        columns: [{ value: 1, text: "Strongly Disagree" },
            { value: 2, text: "Disagree" },
            { value: 3, text: "Neutral" },
            { value: 4, text: "Agree" },
            { value: 5, text: "Strongly Agree" }],
        rows: [{ value: "affordable", text: "Product is affordable" },
            { value: "does what it claims", text: "Product does what it claims" },
            { value: "better then others", text: "Product is better than other products on the market" },
            { value: "easy to use", text: "Product is easy to use" }]}
]};

const getWidgetConfig = function(framework) {
    var widget;

    if (framework == 'knockout') {
        widget = {
            name: "icheck",
            isDefaultRender: true,
            isFit : function(question) { return question["renderAs"] === 'icheckmatrix'; },
            afterRender: function(question, el) {
                $(el).find('input').data({"iCheck": undefined});
                $(el).find('input').iCheck({
                    checkboxClass: 'iradio_square-blue',
                    radioClass: 'iradio_square-blue'
                });
                $(el).find('input').on('ifChecked', function(event) {
                    question.generatedVisibleRows.forEach(function(row, index, rows) {
                        if (row.fullName === event.target.name) {
                            row.value = event.target.value
                        }
                    });
                });
                var select = function() {
                    question.generatedVisibleRows.forEach(function(row, index, rows) {
                        if (row.value) {
                            $(el).find("input[name='" + row.fullName  + "'][value=" + row.value + "]").iCheck('check');
                        }
                    });
                };
                question.valueChangedCallback = select;
                select();
            }
        }
    }
    else if (framework === 'react' || framework === 'jquery' || framework === 'angular') {
        widget = {
            name: "icheck",
            isDefaultRender: true,
            isFit : function(question) { return question.getType() === 'matrix'; },
            afterRender: function(question, el) {
                $(el).find('input').data({"iCheck": undefined});
                $(el).find('input').iCheck({
                    checkboxClass: 'iradio_square-blue',
                    radioClass: 'iradio_square-blue'
                });
                $(el).find('input').on('ifChecked', function(event) {
                    question.generatedVisibleRows.forEach(function(row, index, rows) {
                        if (row.fullName === event.target.name) {
                            row.value = event.target.value
                        }
                    });
                });
                var select = function() {
                    question.generatedVisibleRows.forEach(function(row, index, rows) {
                        if (row.value) {
                            $(el).find("input[name='" + row.fullName  + "'][value=" + row.value + "]").iCheck('check');
                        }
                    });
                }
                question.valueChangedCallback = select;
                select();
            }
        }
    }
    else if (framework == 'vue') {
        widget = {
            name: "icheckmatrix",
            isFit : function(question) { return question["renderAs"] === 'icheckmatrix'; }
        }
        Vue.component(widget.name, {
            props: ['question', 'css', 'isEditMode'],
            template:
            `<table :class="css.matrix.root">
                <thead>
                    <tr>
                        <th v-show="question.hasRows"></th>
                        <th v-for="column in question.columns">{{ column.text}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in question.visibleRows">
                        <td v-show="question.hasRows">{{ row.text}}</td>
                        <td v-for="(column, columnIndex) in question.columns">
                            <input type="radio" :name="row.fullName" v-model="row.value" :value="column.value" :disabled="question.isReadOnly" :id="(columnIndex === 0) && (rowIndex === 0) ? question.inputId : ''"/>
                        </td>
                    </tr>
                </tbody>
            </table>`,
            mounted: function () {
                var vm = this;
                $(vm.$el).find('input').iCheck({
                    checkboxClass: 'iradio_square-blue',
                    radioClass: 'iradio_square-blue',
                    increaseArea: '20%' // optional
                });
                $(vm.$el).find('input').on('ifChecked', function(event) {
                    vm.question.generatedVisibleRows.forEach(function(row, index, rows) {
                        if (row.fullName === event.target.name) {
                            row.value = event.target.value
                        }
                    });
                });
                var select = function() {
                    vm.question.generatedVisibleRows.forEach(function(row, index, rows) {
                        if (row.value) {
                            $(vm.$el).find("input[name='" + row.fullName  + "'][value=" + row.value + "]").iCheck('check');
                        }
                    });
                };
                vm.question.valueChangedCallback = select;
                select();
            }
        })
    }

    return {
        widget: widget,
        questionType: 'matrix',
        renderAs: 'icheckmatrix'
    }
};

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}/customWidget.html`

        .beforeEach( async ctx => {
            await initSurvey(framework, json, "bootstrap", getWidgetConfig);
        });

    test(`check integrity`, async t => {
        const getCount = ClientFunction(() =>
            document.querySelectorAll("ins.iCheck-helper").length);

        assert.equal(await getCount(), 20);
    });

    test(`choose empty`, async t => {
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf('Please answer the question'));
        let position;
        let surveyResult;

        await t
            .click(`input[value=Complete]`);

        position = await getPosition();
        assert.notEqual(position, -1);

        surveyResult = await getSurveyResult();
        assert.equal(typeof surveyResult, `undefined`);
    });

    test(`choose value`, async t => {
        let surveyResult;

        await t
            .click(`table tr:nth-child(1) td:nth-child(3) ins`)
            .click(`table tr:nth-child(2) td:nth-child(4) ins`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult.Quality, {affordable: '2', 'does what it claims': '3'});
    });
});
