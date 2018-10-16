var webkitRegExp = /(webkit)[ \/]([\w.]+)/,
  ieRegExp = /(msie) (\d{1,2}\.\d)/,
  ie11RegExp = /(trident).*rv:(\d{1,2}\.\d)/,
  msEdge = /(edge)\/((\d+)?[\w\.]+)/,
  mozillaRegExp = /(mozilla)(?:.*? rv:([\w.]+))/;
var browserFromUA = function(ua:any) {
  ua = ua.toLowerCase();
  var result: { msie?: boolean; firefox?: boolean; version?: string } = {},
    matches:any[] =
      ieRegExp.exec(ua) ||
      ie11RegExp.exec(ua) ||
      msEdge.exec(ua) ||
      (ua.indexOf("compatible") < 0 && mozillaRegExp.exec(ua)) ||
      webkitRegExp.exec(ua) ||
      [],
    browserName = matches[1],
    browserVersion = matches[2];
  if (browserName === "trident" || browserName === "edge") {
    browserName = "msie";
  } else if (browserName === "mozilla") {
    browserName = "firefox";
  }
  if (browserName) {
    (<any>result)[browserName] = true;
    result.version = browserVersion;
  }
  return result;
};

let browser = browserFromUA(navigator.userAgent);

function compareVersions(a:any, b:any) {
  var i, diff;
  var regExStrip0 = /(\.0+)+$/;
  var segmentsA = a.replace(regExStrip0, "").split(".");
  var segmentsB = b.replace(regExStrip0, "").split(".");
  var l = Math.min(segmentsA.length, segmentsB.length);

  for (i = 0; i < l; i++) {
    diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
    if (diff) {
      return diff;
    }
  }
  return segmentsA.length - segmentsB.length;
}

function isMobile() {
  return typeof window.orientation !== "undefined";
}

export { browser, compareVersions, isMobile };
