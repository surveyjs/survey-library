export class CssClassBuilder {
    private classes: string[] = [];

    public append(value: string, condition: boolean = true): CssClassBuilder {
        if (!!value && condition) this.classes.push(value);
        return this;
    }
    public toString(): string {
        return this.classes.join(" ");
    }
}