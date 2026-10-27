import { Base } from "../base";
import { ISurvey } from "../base-interfaces";
import { Serializer } from "../jsonobject";
import { ISortCriterion, SortDirection } from "../dynamic-data/dynamic-data-interfaces";

/* The sort that holds the criterion: it hears of every change of its field or direction, and it serves what
   Creator's property grid reads from an item - the survey (undo/redo, the modified state) and the fields the
   item can sort by. */
export interface ISortCriterionOwner {
  onSortCriterionChanged(item: SortCriterion): void;
  getSurvey(): ISurvey;
  getDesignSortFields(): Array<{ field: string, title: string }>;
}

/* One level of a records question's sort (sortCriteria). Internal: a developer works with plain
   { field, direction } objects, and the question converts what it is given on every path - an
   assignment and the array's own push, unshift and splice alike (see
   RecordsPagingController.onSortCriterionAdded) - so every element of the array is an instance of this
   class. The instance is what the serializer reads and writes, and what makes an item edit live: the
   question's sort is a live array, and an edit of an item re-applies it the way an assignment does.
   The owner decides what an edit means - an item the question has dropped from its sort may still
   report one (see RecordsPagingController.onSortCriterionChanged).
   Creator edits the items in place, a property grid row per item: that is why an item reports its
   question's survey (getSurvey - an edit is an undo step) and offers the question's fields as the
   choices of field. */
export class SortCriterion extends Base implements ISortCriterion {
  // Not "owner": Creator's helpers walk an object's owner chain, and this one ends at no survey element.
  private sortOwner: ISortCriterionOwner;
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
    this.sortOwner = owner;
  }
  // False for an item the serializer or the question has just created: the question keeps it.
  public get hasOwner(): boolean {
    return !!this.sortOwner;
  }
  public isOwnedBy(owner: ISortCriterionOwner): boolean {
    return !!owner && this.sortOwner === owner;
  }
  /* The survey of the question that holds the item; null without an owner. The items are created and filled
     before they get an owner, so a sort the question writes itself notifies nobody. */
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.sortOwner ? this.sortOwner.getSurvey() : null;
  }
  // The choices of field: the fields the question's designer can sort by; none without an owner.
  public getFieldChoices(): Array<{ value: string, text: string }> {
    if (!this.sortOwner) return [];
    return this.sortOwner.getDesignSortFields().map((item: { field: string, title: string }): { value: string, text: string } =>
      ({ value: item.field, text: item.title }));
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
    if (!!this.sortOwner && (name === "field" || name === "direction")) {
      this.sortOwner.onSortCriterionChanged(this);
    }
  }
}

/* The choices of field depend on the item's question, so they are read per item (Creator: a row's editingObj);
   no dependsOn. A stored field that is not among them (stale or hand-written) stays as it is. The schema
   generator and the linter ask with no object, and a load validates an item before it has an owner: no choices. */
Serializer.addClass(
  "sortcriterion",
  [{ name: "!field", choices: (obj: any): Array<any> => obj instanceof SortCriterion ? obj.getFieldChoices() : [] },
    { name: "direction", default: "asc", choices: ["asc", "desc"] }],
  (): Base => new SortCriterion(),
  "base"
);
