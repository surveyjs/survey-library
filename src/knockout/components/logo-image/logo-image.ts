import * as ko from "knockout";
const template: string = require("./logo-image.html");
export let LogoImageViewModel: any;

ko.components.register("logo-image", {
  viewModel: {
    createViewModel: (params: any) => {
      return { survey: params };
    },
  },
  template: template
});
