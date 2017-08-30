import {HashTable} from "./base";

export class FunctionFactory {
    public static Instance: FunctionFactory = new FunctionFactory();
    private functionHash: HashTable<(params: any[])=>any> = {};

    public register(name: string, func: (params: any[])=>any) {
        this.functionHash[name] = func;
    }
    public clear() {
        this.functionHash = {};
    }
    public getAll(): Array<string> {
        var result = [];
        for(var key in this.functionHash) {
            result.push(key);
        }
        return result.sort();
    }
    public run(name: string, params: any[]): any {
        var func = this.functionHash[name];
        if(!func) return null;
        return func(params);
    }
}

function sum(params: any[]): any {
    var res = 0;
    for(var i = 0; i < params.length; i ++) {
        res += params[i];
    }
    return res;
}
FunctionFactory.Instance.register("sum", sum);

function age(params: any[]): any {
    if(params.length < 1) return -1;
    var birthDay = new Date(params[0]);
    var ageDifMs = Date.now() - birthDay.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
FunctionFactory.Instance.register("age", age);
