import {Base, SurveyError} from "./base";
import {ItemValue} from "./itemvalue";
import {JsonObject} from "./jsonobject";
import {surveyLocalization} from "./surveyStrings";
import {CustomError} from "./error";
/**
 * A definition for filling choices for checkbox, dropdown and radiogroup questions from resfull services.
 * The run method call a restfull service and results can be get on getREsultCallback.
 */
export class ChoicesRestfull extends Base {
    public url: string = "";
    public path: string = "";
    public valueName: string = "";
    public titleName: string = "";
    public getResultCallback: (items: Array<ItemValue>) => void;
    public error: SurveyError = null;
    private static itemsResult = {};
    private static getCachedItemsResult(obj: ChoicesRestfull): boolean {
        var hash = obj.objHash;
        var res = ChoicesRestfull.itemsResult[hash];
        if(!res) return false;
        if(obj.getResultCallback) {
            obj.getResultCallback(res);
        }
        return true;
    }
    constructor() {
        super();
    }
    public run() {
        if (!this.url || !this.getResultCallback) return;
        if(ChoicesRestfull.getCachedItemsResult(this)) return;
        this.error = null;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var self = this;
        xhr.onload = function () {
            if (xhr.status == 200) {
                self.onLoad(JSON.parse(xhr.response));
            } else {
                self.onError(xhr.statusText, xhr.responseText);
            }
        };
        xhr.send();
    }
    public getType(): string { return "choicesByUrl"; }
    public get isEmpty(): boolean {
        return !this.url && !this.path && !this.valueName && !this.titleName;
    }
    public setData(json: any) {
        this.clear();
        if (json.url) this.url = json.url;
        if (json.path) this.path = json.path;
        if (json.valueName) this.valueName = json.valueName;
        if (json.titleName) this.titleName = json.titleName;
    }
    public clear() {
        this.url = "";
        this.path = "";
        this.valueName = "";
        this.titleName = "";
    }
    protected onLoad(result: any) {
        var items = [];
        result = this.getResultAfterPath(result);
        if (result && result["length"]) {
            for (var i = 0; i < result.length; i++) {
                var itemValue = result[i];
                if (!itemValue) continue;
                var value = this.getValue(itemValue);
                var title = this.getTitle(itemValue);
                items.push(new ItemValue(value, title));
            }
        } else {
            this.error = new CustomError(surveyLocalization.getString("urlGetChoicesError"));
        }
        ChoicesRestfull.itemsResult[this.objHash] = items;
        this.getResultCallback(items);
    }
    private onError(status: string, response: string) {
        this.error = new CustomError(surveyLocalization.getString("urlRequestError")["format"](status, response));
        this.getResultCallback([]);
    }
    private getResultAfterPath(result: any) {
        if (!result) return result;
        if (!this.path) return result;
        var pathes = this.getPathes();
        for (var i = 0; i < pathes.length; i++) {
            result = result[pathes[i]];
            if (!result) return null;
        }
        return result;
    }
    private getPathes(): Array<string> {
        var pathes = [];
        if (this.path.indexOf(';') > -1) {
            pathes = this.path.split(';');
        } else {
            pathes = this.path.split(',');
        }
        if (pathes.length == 0) pathes.push(this.path);
        return pathes;
    }
    private getValue(item: any): any {
        if (this.valueName) return item[this.valueName];
        var len = Object.keys(item).length;
        if (len < 1) return null;
        return item[Object.keys(item)[0]];
    }
    private getTitle(item: any): any {
        if (!this.titleName) return null;
        return item[this.titleName];
    }
    private get objHash() { return this.url + ";" + this.path + ";" + this.valueName + ";" + this.titleName; }
}
JsonObject.metaData.addClass("choicesByUrl", ["url", "path", "valueName", "titleName"], function () { return new ChoicesRestfull(); });
