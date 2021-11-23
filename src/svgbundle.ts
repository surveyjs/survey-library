export var SvgBundleViewModel: any;

if (!!(<any>global).document) {
  var svgTemplate = require("html-loader?interpolate!val-loader!./svgbundle.html");
  var templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.appendChild(templateHolder);
}
