export class ComponentFactory {
  public static Instance: ComponentFactory = new ComponentFactory();
  private creatorHash: { [index: string]: any } = {};

  public registerComponent(typeName: string, componentType: any): void {
    this.creatorHash[typeName] = componentType;
  }
  public getComponent(typeName: string): any {
    return this.creatorHash[typeName] || typeName;
  }
  public getAllTypes(): Array<string> {
    const result = new Array<string>();
    for (const key in this.creatorHash) {
      result.push(key);
    }
    return result.sort();
  }
  public isComponentRegistered(elementType: string): boolean {
    return !!this.creatorHash[elementType];
  }
}
