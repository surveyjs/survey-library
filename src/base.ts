module Survey {
    export interface HashTable<T> {
        [key: string]: T;
    }
    export interface ISurvey {
        getValue(name: string): any;
        setValue(name: string, newValue: any);
        getComment(name: string): string;
        setComment(name: string, newValue: string);
        questionVisibilityChanged(question: IQuestion, newValue: boolean);
        questionAdded(question: IQuestion, index: number);
        questionRemoved(question: IQuestion);
        validateQuestion(name: string): SurveyError;
        isDesignMode: boolean;
    }
    export interface IQuestion {
        name: string;
        visible: boolean;
        setVisibleIndex(value: number);
        onSurveyValueChanged(newValue: any);
    }

    export class ItemValue {
        public static Separator = '|';
        public static setData(items: Array<ItemValue>, values: Array<any>) {
            items.length = 0;
            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                var item = new ItemValue(null);
                if (typeof (value.value) !== 'undefined') {
                    item.text = value["text"];
                    item.value = value["value"];
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

    export class Base {
        isKO = typeof ko !== 'undefined';
        public getType(): string {
            throw new Error('This method is abstract');
        }
    }
    export class SurveyError {
        public getText(): string {
            throw new Error('This method is abstract');
        }
    }

    export class Event<T extends Function, Options>  {
        private callbacks: Array<T>;
        public get isEmpty(): boolean { return this.callbacks == null || this.callbacks.length == 0; }
        public fire(sender: any, options: Options) {
            if (this.callbacks == null) return;
            for (var i = 0; i < this.callbacks.length; i ++) {
                var callResult = this.callbacks[i](sender, options);

            }
        }
        public add(func: T) {
            if (this.callbacks == null) {
                this.callbacks = new Array<T>();
            }
            this.callbacks.push(func);
        }
        public remove(func: T) {
            if (this.callbacks == null) return;
            var index = this.callbacks.indexOf(func, 0);
            if (index != undefined) {
                this.callbacks.splice(index, 1);
            }
        }
    }
}