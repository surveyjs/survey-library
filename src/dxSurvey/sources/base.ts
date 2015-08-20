module dxSurvey {
    export interface HashTable<T> {
        [key: string]: T;
    }
    export interface ISurveyData {
        getValue(name: string): any;
        setValue(name: string, newValue: any);
        getComment(name: string): string;
        setComment(name: string, newValue: string);
    }
    export interface IQuestion {
        name: string;
        onSurveyValueChanged(newValue: any);
    }
    export class Base {
        isKO = typeof ko !== 'undefined';
    }

    export class Event<T extends Function, Options>  {
        private callbacks: Array<T>;
        public fire(sender: any, options: Options) {
            if (this.callbacks == null) return;
            for (var i = 0; i < this.callbacks.length; i ++) {
                this.callbacks[i](sender, options);
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