var webkitRegExp = /(webkit)[ \/]([\w.]+)/,
    ieRegExp = /(msie) (\d{1,2}\.\d)/,
    ie11RegExp = /(trident).*rv:(\d{1,2}\.\d)/,
    msEdge = /(edge)\/((\d+)?[\w\.]+)/,
    mozillaRegExp = /(mozilla)(?:.*? rv:([\w.]+))/;
var browserFromUA = function(ua) {
    ua = ua.toLowerCase();
    var result: { msie?: boolean, version?: string } = {},
        matches = ieRegExp.exec(ua) || ie11RegExp.exec(ua) || msEdge.exec(ua) || ua.indexOf("compatible") < 0 && mozillaRegExp.exec(ua) || webkitRegExp.exec(ua) || [],
        browserName = matches[1],
        browserVersion = matches[2];
    if (browserName === "trident" || browserName === "edge")
        browserName = "msie";
    if (browserName) {
        result[browserName] = true;
        result.version = browserVersion
    }
    return result
};

let browser = browserFromUA(navigator.userAgent);

export {
    browser
};