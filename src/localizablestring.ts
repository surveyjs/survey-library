export interface ILocalizableOwner {
    getLocale(): string;
}

export class LocalizableString {
    public static  defaultLocale: string = "default";
    private values = {};
    constructor (public owner: ILocalizableOwner) {
    }
    public get locale() {return this.owner ? this.owner.getLocale() : ""; }
    public get text() : string { 
        var keys = Object.keys(this.values);
        if(keys.length == 0) return "";
        var loc = this.locale;
        if(!loc) loc = LocalizableString.defaultLocale;
        var res = this.values[loc];
        if(!res && loc !== LocalizableString.defaultLocale) {
            res = this.values[LocalizableString.defaultLocale];
        }
        return res ? res : this.values[keys[0]];
    }
    public set text(value: string) {
        this.setLocaleText(this.locale, value);
    }
    public getLocaleText(loc: string): string {
        if(!loc) loc = LocalizableString.defaultLocale;
        var res = this.values[loc];
        return res ? res : "";
    }
    public setLocaleText(loc: string, value: string) {
        if(!loc) loc = LocalizableString.defaultLocale;
        if(!value) {
            if(this.values[loc]) delete this.values[loc];
        } else {
            if (typeof value === 'string') {
                if(loc != LocalizableString.defaultLocale && value == this.getLocaleText(LocalizableString.defaultLocale)) {
                    this.setLocaleText(loc, null);
                } else {
                    this.values[loc] = value;
                    if(loc == LocalizableString.defaultLocale) {
                        this.deleteValuesEqualsToDefault(value);
                    }
                }
            }
        }
    }
    public getJson(): any {
        var keys = Object.keys(this.values);
        if(keys.length == 0) return null;
        if(keys.length == 1 && keys[0] == LocalizableString.defaultLocale) return this.values[keys[0]];
        return this.values;
    }
    public setJson(value: any) {
        this.values = {};
        if(!value) return;
        if (typeof value === 'string') {
            this.setLocaleText(null, value);
        } else {
            for(var key in value) {
                this.setLocaleText(key, value[key]);
            }
        }
    }
    private deleteValuesEqualsToDefault(defaultValue: string) {
        var keys = Object.keys(this.values);
        for(var i = 0; i < keys.length; i ++) {
            if(keys[i] == LocalizableString.defaultLocale) continue;
            if(this.values[keys[i]] == defaultValue) delete this.values[keys[i]];
        }                
    }
}