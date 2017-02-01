// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

export declare class dxSurveyService {
    static serviceUrl: string;
    constructor();
    loadSurvey(surveyId: string, onLoad: (success: boolean, result: string, response: any) => void): void;
    sendResult(postId: string, result: JSON, onSendResult: (success: boolean, response: any) => void, clientId?: string, isPartialCompleted?: boolean): void;
    sendFile(postId: string, file: File, onSendFile: (success: boolean, response: any) => void): void;
    getResult(resultId: string, name: string, onGetResult: (success: boolean, data: any, dataList: Array<any>, response: any) => void): void;
    isCompleted(resultId: string, clientId: string, onIsCompleted: (success: boolean, result: string, response: any) => void): void;
}
