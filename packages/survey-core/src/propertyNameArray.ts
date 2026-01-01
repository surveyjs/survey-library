
export class PropertyNameArray {

  public val;
  private name;

  constructor(val: any[] | undefined, name?: string) {
    this.val = val ?? [];
    this.name = name;
  }

  public add(val: any): any[] {
    if (this.contains(val)) return this.val;
    if (!this.name) {
      this.val.push(val);
    } else {
      this.val.push({ [this.name]: val });
    }
    return this.val;
  }

  public indexOf(val: any): number {

    for (let i = 0; i < this.val.length; i++) {
      let item = this.val[i];
      if (this.name && typeof item === "object") {
        if (item[this.name] === val) return i;
      } else {
        if (item === val) return i;
      }
    }
    return -1;
  }

  public contains(val: any): boolean {
    return this.indexOf(val) > -1;
  }

  public toggle(val: any, max: number = 0): any[] {
    if (this.contains(val)) return this.remove(val);
    if (max > 0 && this.val.length >= max) return this.val;
    return this.add(val);
  }

  public remove(val: any): any[] {
    const index = this.indexOf(val);
    if (index > -1) {
      this.val.splice(index, 1);
    }
    return this.val;
  }

  public convert(val: any): any[] {
    if (val === undefined || val === null) return val;
    if (!Array.isArray(val)) val = [val];
    if (!this.name) return val;
    return val.map((item: any) => {
      if (item && typeof item === "object" && this.name in item) {
        return item;
      } else {
        return { [this.name]: item };
      }
    });
  }
}