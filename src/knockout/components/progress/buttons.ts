import * as ko from "knockout";
import { PageModel } from '../../../page';
var template = require("html-loader?interpolate!val-loader!./buttons.html");
export var progressButtonsComponent: any;

ko.components.register("survey-progress-buttons", {
    viewModel: function (params: any) {
      var getListElementCss = function(index: any): string {
        return (params.model.currentPageNo === index() ?
          params.model.css.progressButtonsListElementCurrent : "") ||
          (params.model.visiblePages[index()].passed ?
            params.model.css.progressButtonsListElementPassed : "");
      };
      var clickListElement = function(page: PageModel): void {
        if (params.model['isCompleted']) return;
        if (page.visibleIndex < params.model.currentPageNo) {
          params.model.currentPageNo = page.visibleIndex;
        }
        else if (page.visibleIndex > params.model.currentPageNo) {
          var i = params.model.currentPageNo;
          for (; i < page.visibleIndex; i++) {
            if (params.model.visiblePages[i].hasErrors(true, true)) break;
            params.model.visiblePages[i].passed = true;
          }
          params.model.currentPageNo = i;
        }
      };
      return { model: params.model,
        getListElementCss: getListElementCss, clickListElement: clickListElement };
      //nodeDOMremoval чтобы отключать таймер
    },
    template: template
  });