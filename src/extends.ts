export function __extends (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = __extends;
}

exports.__extends = __extends;