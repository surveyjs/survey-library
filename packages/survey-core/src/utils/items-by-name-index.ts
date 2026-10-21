// A lookup by name used to lower-case and compare the name of every item. This index keeps the items
// under their lower-case names, the first item in array order for each name; an item whose name is
// null or undefined gets none. It notices no change by itself: it is built again when it is asked
// about another array, or after reset(). An owner whose array changes in place, or whose items change
// their names, calls reset().
export class ItemsByNameIndex<T> {
  private items: Array<T>;
  private itemsByName: Map<string, T>;
  constructor(private getName: (item: T) => any) {}
  public reset(): void {
    this.items = undefined;
    this.itemsByName = undefined;
  }
  public find(items: Array<T>, name: string): T {
    return this.getItemsByName(items).get(name.toLocaleLowerCase());
  }
  public has(items: Array<T>, name: string): boolean {
    return this.getItemsByName(items).has(name.toLocaleLowerCase());
  }
  private getItemsByName(items: Array<T>): Map<string, T> {
    if (!this.itemsByName || this.items !== items) {
      const itemsByName = new Map<string, T>();
      for (let i = 0; i < items.length; i++) {
        const name = this.getName(items[i]);
        if (name === undefined || name === null) continue;
        const key = name.toString().toLocaleLowerCase();
        if (!itemsByName.has(key)) {
          itemsByName.set(key, items[i]);
        }
      }
      this.items = items;
      this.itemsByName = itemsByName;
    }
    return this.itemsByName;
  }
}
