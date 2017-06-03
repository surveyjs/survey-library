export class TextPreProcessorItem {
    public start: number;
    public end: number;
}

export class TextPreProcessor {
    private hasAllValuesOnLastRunValue : boolean = false;
    public onProcess: (name: string) => any;
    public onHasValue: (name: string) => boolean;
    constructor() { }
    public process(text: string): string {
        this.hasAllValuesOnLastRunValue = true;
        if (!text) return text;
        if (!this.onProcess) return text;
        var items = this.getItems(text);
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            var name = this.getName(text.substring(item.start + 1, item.end));
            if (!this.canProcessName(name)) continue;
            if (this.onHasValue && !this.onHasValue(name)) {
                this.hasAllValuesOnLastRunValue = false;
                continue;
            }
            var value = this.onProcess(name);
            if (value == null) {
                 value = "";
                 this.hasAllValuesOnLastRunValue = false;
            }
            text = text.substr(0, item.start) + value + text.substr(item.end + 1);
        }
        return text;
    }
    public get hasAllValuesOnLastRun() { return this.hasAllValuesOnLastRunValue; }
    private getItems(text: string): Array<TextPreProcessorItem> {
        var items = [];
        var length = text.length;
        var start = -1;
        var ch = '';
        for (var i = 0; i < length; i++) {
            ch = text[i];
            if (ch == '{') start = i;
            if (ch == '}') {
                if (start > -1) {
                    var item = new TextPreProcessorItem();
                    item.start = start;
                    item.end = i;
                    items.push(item);
                }
                start = -1;
            }
        }
        return items;
    }
    private getName(name: string): string {
        if (!name) return;
        return name.trim();
    }
    private canProcessName(name: string): boolean {
        if (!name) return false;
        for (var i = 0; i < name.length; i++) {
            var ch = name[i];
            //TODO
            if (ch == ' ' || ch == '-' || ch == '&') return false;
        }
        return true;
    }
}
