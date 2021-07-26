export class CssClassBuilder {
    private classes: string[] = [];

    public append(value: string, condition: boolean = true): void {
        if (!!value && condition) this.classes.push(value);
    }
    public toString(): string {
        return this.classes.join(" ");
    }
}