/// <reference path="../src/base.ts" />
/// <reference path="../src/choicesRestfull.ts" />
module Survey.Tests {
    QUnit.module("choicesRestfull");

    class ChoicesRestfullTester extends ChoicesRestfull {
        public runJson(json: any) {
            this.onLoad(json);
        }
    }

    QUnit.test("Load countries", function (assert) {
        var test = new ChoicesRestfullTester();
        var items = [];
        test.getResultCallback = function (res: Array<ItemValue>) { items = res; };
        var json = getCountries();
        test.path = "RestResponse;result";
        test.runJson(json);
        assert.equal(items.length, 5, "there are 5 countries");
        assert.equal(items[0].value, "Afghanistan", "the first country is Afghanistan");
        assert.equal(items[4].value, "American Samoa", "the fifth country is American Samoa");
    });
    function getCountries(): any {
        return {
            "RestResponse": {
                "messages": ["More webservices are available at http://www.groupkt.com/post/f2129b88/services.htm", "Total [249] records found."],
                "result": [{
                    "name": "Afghanistan",
                    "alpha2_code": "AF",
                    "alpha3_code": "AFG"
                }, {
                        "name": "Åland Islands",
                        "alpha2_code": "AX",
                        "alpha3_code": "ALA"
                    }, {
                        "name": "Albania",
                        "alpha2_code": "AL",
                        "alpha3_code": "ALB"
                    }, {
                        "name": "Algeria",
                        "alpha2_code": "DZ",
                        "alpha3_code": "DZA"
                    }, {
                        "name": "American Samoa",
                        "alpha2_code": "AS",
                        "alpha3_code": "ASM"
                    }]
            }
        };
    }
}