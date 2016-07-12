import { Selector } from 'testcafe';
const assert = require('assert');


const fixtures = [ 
     { postfix: 'Knockout', subPath: 'examples' }, 
     { postfix: 'React', subPath: 'examplesreact' } ]; 

 
fixtures.forEach(({ postfix, subPath }) => { 
     fixture `Test Radiogroup question (${postfix})` 
         .page `http://surveyjs.org/${subPath}/questiontype-radiogroup.html`; 

    test("Show others item and change it's text", async t => {
        await t
            .typeText('#tOtherText', 'My Others', { replace: true })
        await t 
            .click("#cbShowOthers");
        var othersRadio = await t.select('input[type="radio"][value="other"]');
        assert.ok(othersRadio, "Others is shown");
        var othersText = await t.select('input[type="radio"][value="other"] + span');
        assert.ok(othersText, "My Others");
    });

    test('Change column count', async t => {
        for(var colCount = 0; colCount <=4; colCount++ ) {
            await t 
                .click('#selColCount')
                .click('#selColCount > option[value="' + colCount + '"]');
            var firstRadio = await t.select('div.radio');
            var parent = await t.select('h5');
            var rate = Math.round(parent.offsetWidth / firstRadio.offsetWidth);
            if(colCount == 0)  
                assert.ok(rate > 5, colCount, "colCount = " + colCount + ". Rate is: " + rate);
            else assert.equal(rate, colCount, "colCount = " + colCount + ". Rate is: " + rate);
        }
    });

    test('Change choices order', async t => {
        var choices= ["asc", "desc", "none"];
        var results=["Audi", "Volkswagen", "None"];
        for(var i = 0; i < choices.length; i++ ) {
            await t 
                .click('#selChoiceOrder')
                .click('#selChoiceOrder > option[value="' + choices[i] + '"]');
            var firstRadio = await t.select('input[type="radio"]');
            assert.equal(firstRadio.value, results[i], "choice order = " + choices[i] + ". First radio is: " + firstRadio.innterText);
        }
    });

    test('Check requre and set value test', async t => {
        await t 
            .click('[value=Complete]');
        const divError = await t.select('.alert-danger');
        assert.notStrictEqual(divError.offsetParent, null, 'The error is shown');

        await t 
            .click('[value=Audi]')
            .click('[value=Complete]');
        const divRes = await t.select('#survey_result');
        assert.equal(divRes.innerText, 'The results are: {"car":"Audi"}', "Audi was selected");
    });
});