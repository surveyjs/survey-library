import { ItemValue } from "./itemvalue";
import { Serializer } from "./jsonobject";
import { Question } from "./question";

export class QuestionImageMapModel extends Question {
  constructor(name: string) { super(name); }

  public getType(): string {
    return "imagemap";
  }

  public get imageLink() {
    return this.getPropertyValue("imageLink");
  }
  public set imageLink(val: string) {
    this.setPropertyValue("imageLink", val);
  }

  public get imageMap(): ImageMapItem[] {
    return this.getPropertyValue("imageMap");
  }
  public set imageMap(val: ImageMapItem[]) {
    this.setPropertyValue("imageMap", val);
  }

  public mapItemTooggle(item: ImageMapItem): void {
    if (this.isItemSelected(item)) {
      const newValue = (this.value || []).filter((e: any) => e !== item.value);
      this.value = newValue.length ? newValue : undefined;
    } else {
      this.value = [...(this.value || []), item.value];
    }
  }

  public isItemSelected(item: ImageMapItem): boolean {
    return (this.value || []).includes(item.value);
  }
}

export class ImageMapItem extends ItemValue {

  constructor(value: any) {
    super(value);
  }

  public getBaseType(): string {
    return "imagemapitem";
  }

  public get shape(): string {
    return this.getPropertyValue("shape");
  }
  public set shape(val: string) {
    this.setPropertyValue("shape", val);
  }

  public get coords(): string {
    return this.getPropertyValue("coords");
  }
  public set coords(val: string) {
    this.setPropertyValue("coords", val);
  }
}

Serializer.addClass("imagemapitem",
  [
    { name: "shape", choices: ["rect", "circle", "poly"], default: "poly" },
    { name: "coords:string" },
  ],
  () => new ImageMapItem(""),
  "itemvalue"
);

Serializer.addClass(
  "imagemap",
  [
    { name: "imageLink:file" },
    { name: "imageMap:imagemapitem[]" },
  ],
  () => new QuestionImageMapModel(""),
  "question"
);

