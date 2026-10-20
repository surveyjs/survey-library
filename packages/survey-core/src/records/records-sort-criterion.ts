import { Base } from "../base";
import { Serializer } from "../jsonobject";
import { ISortCriterion, SortDirection } from "../dynamic-data/dynamic-data-interfaces";

// The sort that holds the criterion: it hears of every change of its field or direction.
export interface ISortCriterionOwner {
  onSortCriterionChanged(item: SortCriterion): void;
}

/* One level of a records question's sort (sortCriteria). Internal: a developer works with plain
   { field, direction } objects, and the question converts what it is given on every path - an
   assignment and the array's own push, unshift and splice alike (see
   RecordsPagingController.onSortCriterionAdded) - so every element of the array is an instance of this
   class. The instance is what the serializer reads and writes, and what makes an item edit live: the
   question's sort is a live array, and an edit of an item re-applies it the way an assignment does.
   The owner decides what an edit means - an item the question has dropped from its sort may still
   report one (see RecordsPagingController.onSortCriterionChanged). */
export class SortCriterion extends Base implements ISortCriterion {
  private owner: ISortCriterionOwner;
  constructor(field?: string, direction?: SortDirection) {
    super();
    if (!!field) {
      this.field = field;
    }
    if (!!direction) {
      this.direction = direction;
    }
  }
  public getType(): string {
    return "sortcriterion";
  }
  public setOwner(owner: ISortCriterionOwner): void {
    this.owner = owner;
  }
  // False for an item the serializer or the question has just created: the question keeps it.
  public get hasOwner(): boolean {
    return !!this.owner;
  }
  public get field(): string {
    return this.getPropertyValue("field", "");
  }
  public set field(val: string) {
    this.setPropertyValue("field", val);
  }
  public get direction(): SortDirection {
    return this.getPropertyValue("direction");
  }
  public set direction(val: SortDirection) {
    this.setPropertyValue("direction", val);
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (!!this.owner && (name === "field" || name === "direction")) {
      this.owner.onSortCriterionChanged(this);
    }
  }
}

Serializer.addClass(
  "sortcriterion",
  [{ name: "!field" }, { name: "direction", default: "asc", choices: ["asc", "desc"] }],
  (): Base => new SortCriterion(),
  "base"
);
