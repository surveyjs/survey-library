// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

export declare class TextPreProcessorItem {
    start: number;
    end: number;
}
export declare class TextPreProcessor {
    onProcess: (name: string) => any;
    onHasValue: (name: string) => boolean;
    constructor();
    process(text: string): string;
    private getItems(text);
    private getName(name);
    private canProcessName(name);
}
