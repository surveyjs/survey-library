export class ItemValue {
    public static Separator = '|';
    public static setData(items: Array<ItemValue>, values: Array<any>) {
        items.length = 0;
        for (var i = 0; i < values.length; i++) {
            var value = values[i];
            var item = new ItemValue(null);
            if (typeof (value.value) !== 'undefined') {
                var exception = null;
                if (typeof (value.getType) !== 'undefined' && value.getType() == 'itemvalue') {
                    value.itemValue = value.itemValue;
                    item.itemText = value.itemText;
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
                result.push({ value: item.value, text: item.text });
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
    private static itemValueProp = [ "text", "value", "hasText"];
    private static copyAttributes(src: any, dest: any, exceptons: Array<string>) {
        for (var key in src) {
            if ((typeof src[key] == 'function')) continue;
            if (exceptons && exceptons.indexOf(key) > -1) continue;
            dest[key] = src[key];
        }
    }
    private itemValue: any;
    private itemText: string;
    constructor(value: any, text: string = null) {
        this.text = text;
        this.value = value;
    }
    public getType(): string { return "itemvalue"; }
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
    public get hasText(): boolean { return this.itemText ? true : false; }
    public get text(): string {
        if (this.hasText) return this.itemText;
        if (this.value) return this.value.toString();
        return null;
    }
    public set text(newText: string) {
        this.itemText = newText;
    }
}
