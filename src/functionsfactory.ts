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