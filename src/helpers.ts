export interface HashTable<T> {
    [key: string]: T;
}

export class Helpers {
    /**
     * A static methods that returns true if a value underfined, null, empty string or empty array.
     * @param value 
     */
    public static isValueEmpty(value: any) {
        if (Array.isArray(value) && value.length === 0) return true;
        if(value && (typeof value === 'string' || value instanceof String)) {
            value = value.trim();
        }
        return !value && value !== 0 && value !== false;
    }
}
if (!String.prototype["format"]) {
    String.prototype["format"] = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}