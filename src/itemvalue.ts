import {ILocalizableOwner, LocalizableString} from "./localizablestring";

export class ItemValue {
    public static Separator = '|';
    public static createArray(locOwner: ILocalizableOwner): Array<ItemValue> {
        var items: Array<ItemValue> = [];
        ItemValue.setupArray(items, locOwner);
        return items;
    }
    public static setupArray(items: Array<ItemValue>, locOwner: ILocalizableOwner) {
        items.push = function(value): number {
            var result = Array.prototype.push.call(this, value);
            value.locOwner = locOwner;
            return result;
        };
        items.splice = function (start?: number, deleteCount?: number, ...items: ItemValue[]): ItemValue[] {
            var result = Array.prototype.splice.call(this, start, deleteCount, ... items);
            if(!items) items = [];
            for(var i = 0; i < items.length; i ++) {
                items[i].locOwner = locOwner;
            }
            return result;
        };
    }
    public static setData(items: Array<ItemValue>, values: Array<any>) {
        items.length = 0;
        for (var i = 0; i < values.length; i++) {
            var value = values[i];
            var item = new ItemValue(null);
            if (typeof (value.value) !== 'undefined') {
                var exception = null;
                if (ItemValue.isObjItemValue(value)) {
                    value.itemValue = value.itemValue;
                    item.locText.setJson(value.locText.getJson());
                    exception = ItemValue.itemValueProp;
                }
                ItemValue.copyAttributes(value, item, exception);
            } else {
                item.value = value;
            }
            items.push(item);
        }
    }
    public static getData(items: Array<ItemValue>): any {
        var result = new Array();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.hasText) {
                result.push({ value: item.value, text: item.locText.getJson() });
            } else {
                result.push(item.value);
            }
        }
        return result;
    }
    public static getItemByValue(items: Array<ItemValue>, val: any): ItemValue {
        for (var i = 0; i < items.length; i ++) {
            if (items[i].value == val) return items[i];
        }
        return null;
    }
    private static isObjItemValue(obj: any) { return typeof (obj.getType) !== 'undefined' && obj.getType() == 'itemvalue'}
    private static itemValueProp = [ "text", "value", "hasText", "locOwner", "locText"];
    private static copyAttributes(src: any, dest: any, exceptons: Array<string>) {
        for (var key in src) {
            if ((typeof src[key] == 'function')) continue;
            if (exceptons && exceptons.indexOf(key) > -1) continue;
            if(key == "text" && ItemValue.isObjItemValue(dest)) {
                dest.locText.setJson(src[key]);
            } else {
                dest[key] = src[key];    
            }  
        }
    }
    private itemValue: any;
    private locText: LocalizableString;
    constructor(value: any, text: string = null) {
        this.locText = new LocalizableString(null);
        if(text) this.locText.text = text;
        this.value = value;
    }
    public getType(): string { return "itemvalue"; }
    public get locOwner() : ILocalizableOwner { return this.locText.owner; }
    public set locOwner(value: ILocalizableOwner) {
        this.locText.owner = value;
    }
    public get value(): any { return this.itemValue; }
    public set value(newValue: any) {
        this.itemValue = newValue;
        if (!this.itemValue) return;
        var str: string = this.itemValue.toString();
        var index = str.indexOf(ItemValue.Separator);
        if (index > -1) {
            this.itemValue = str.slice(0, index);
            this.text = str.slice(index + 1);
        }
    }
    public get hasText(): boolean { return this.locText.text ? true : false; }
    public get text(): string {
        if (this.hasText) return this.locText.text;
        if (this.value) return this.value.toString();
        return null;
    }
    public set text(newText: string) {
        this.locText.text = newText;
    }
}
