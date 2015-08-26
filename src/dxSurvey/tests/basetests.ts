/// <reference path="../sources/base.ts" />
module dxSurvey.Tests {
    QUnit.module("Base");

    QUnit.test("Event no parameters", function (assert) {
        var event = new dxSurvey.Event<() => any, any>();
        var counter = 0;
        var func = () => { counter++; };
        event.add(func);
        event.fire(null, null);
        assert.equal(counter, 1, "function called one time");
        event.remove(func);
        event.fire(null, null);
        assert.equal(counter, 1, "function should not be called the second time");
    });
    QUnit.test("Event with parameters", function (assert) {
        var event = new dxSurvey.Event<(s: number, params) => any, any>();
        var counter = 0;
        event.add((s: number, params) => { counter += s; params.allow = true; });
        var options = { allow: false };
        assert.equal(options.allow, false, "Initial options.allow == false");
        event.fire(5, options);
        assert.equal(options.allow, true, "function should change allow to true");
        assert.equal(counter, 5, "function should increase counter on 5");
    });
}