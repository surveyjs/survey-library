var HelloApp =
    ng.core
        .Component({
            selector: 'ng-app',
            template: '<div id="surveyContainer" class="survey-container contentcontainer codecontainer">' +
            '<div id="surveyElement"></div></div>'
        })
        .Class({
            constructor: function() {
            },
            ngOnInit: function() {
                onAngularComponentInit();
            }
        });
document.addEventListener('DOMContentLoaded', function() {
    ng.platformBrowserDynamic.bootstrap(HelloApp);
});