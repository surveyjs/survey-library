export class TextPreProcessorItem {
  public start: number;
  public end: number;
}

export class TextPreProcessorValue {
  constructor(public name: string, public returnDisplayValue: boolean) {
    this.isExists = false;
    this.canProcess = true;
  }
  public value: any;
  public isExists: boolean;
  public canProcess: boolean;
}

export class TextPreProcessor {
  private hasAllValuesOnLastRunValue: boolean = false;
  public onProcess: (textValue: TextPreProcessorValue) => void;
  constructor() {}
  public process(text: string, returnDisplayValue: boolean = false): string {
    this.hasAllValuesOnLastRunValue = true;
    if (!text) return text;
    if (!this.onProcess) return text;
    var items = this.getItems(text);
    for (var i = items.length - 1; i >= 0; i--) {
      var item = items[i];
      var name = this.getName(text.substring(item.start + 1, item.end));
      if (!name) continue;
      var textValue = new TextPreProcessorValue(name, returnDisplayValue);
      this.onProcess(textValue);
      if (!textValue.isExists) {
        if (textValue.canProcess) {
          this.hasAllValuesOnLastRunValue = false;
        }
        continue;
      }
      if (textValue.value == null) {
        textValue.value = "";
        this.hasAllValuesOnLastRunValue = false;
      }
      text =
        text.substr(0, item.start) +
        textValue.value +
        text.substr(item.end + 1);
    }
    return text;
  }
  public get hasAllValuesOnLastRun() {
    return this.hasAllValuesOnLastRunValue;
  }
  private getItems(text: string): Array<TextPreProcessorItem> {
    var items = [];
    var length = text.length;
    var start = -1;
    var ch = "";
    for (var i = 0; i < length; i++) {
      ch = text[i];
      if (ch == "{") start = i;
      if (ch == "}") {
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
}
