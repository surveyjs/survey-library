import type { defineComponent } from "vue";

type VueComponent = ReturnType<typeof defineComponent>;

export class VueComponentFactory {
  public static Instance: VueComponentFactory = new VueComponentFactory();
  private creatorHash: { [index: string]: VueComponent } = {};

  public registerComponent(
    typeName: string,
    componentType: ReturnType<typeof defineComponent>
  ): void {
    this.creatorHash[typeName] = componentType;
  }
  public getComponent(typeName: string): VueComponent {
    return this.creatorHash[typeName];
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
