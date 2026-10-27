// What the index arithmetic reads from DynamicDataList: public members of the list, read when they are
// needed. Nothing is cached on this side.
export interface IDynamicDataViewIndexesHost {
  getCreatedIndexes(): Array<number>;
  getVisibleIndexes(): Array<number>;
  getPageIndexes(): Array<number>;
  readonly hasView: boolean;
  readonly windowOffset: number;
  readonly loadedCount: number;
  readonly knownCount: number;
  readonly pageSize: number;
  readonly pageIndex: number;
  readonly isPagedBySource: boolean;
}
// record index -> position in a view array, cached by DynamicDataMembership.
export interface IDynamicDataViewPositions {
  getCreatedPositions(): { [index: number]: number };
  getVisiblePositions(): { [index: number]: number };
  getMaterializedPositions(indexes: Array<number>): { [index: number]: number };
}

/* The index arithmetic of DynamicDataList, read-only over state the list owns: the conversions
   between the record index, the created and the materialized positions and the positions of the whole
   view, and the page cut of a visibleIndex. The names follow the index vocabulary at the top of
   dynamic-data-list.ts. */
export class DynamicDataViewIndexes {
  constructor(private host: IDynamicDataViewIndexesHost, private positions: IDynamicDataViewPositions) { }

  public createdIndexToIndex(createdIndex: number): number {
    if (!this.host.hasView) {
      return createdIndex >= 0 && createdIndex < this.host.loadedCount ? createdIndex : -1;
    }
    const indexes = this.host.getCreatedIndexes();
    if (createdIndex < 0 || createdIndex >= indexes.length) return -1;
    return indexes[createdIndex];
  }
  public indexToCreatedIndex(index: number): number {
    if (!this.host.hasView) {
      return index >= 0 && index < this.host.loadedCount ? index : -1;
    }
    return positionOf(this.positions.getCreatedPositions(), index);
  }
  /* The owner's side of the index arithmetic matrixdynamic and paneldynamic share. The list answers
     from its own state: the offset is windowOffset, which only a paged read moves - and a question
     reads a paging source only when it was assigned - and paging is a page size above 0, which the
     paging controller sets to 0 in design mode on its next sync. */
  public getPageStartGlobalVisibleIndex(): number {
    // A paging decision, not offset arithmetic: a source without paging has offset 0 on every page.
    if (this.host.isPagedBySource) return this.host.windowOffset;
    return this.host.pageSize > 0 ? this.host.pageIndex * this.host.pageSize : 0;
  }
  // Record index + this = the record number the respondent sees ({panelIndex}, {rowIndex}).
  public getRecordNumberOffset(): number {
    return this.host.windowOffset;
  }
  // -1 when the record is not visible.
  public getGlobalVisibleIndex(index: number): number {
    const pos = positionOf(this.positions.getVisiblePositions(), index);
    return pos < 0 ? -1 : pos + this.getRecordNumberOffset();
  }
  // -1 when there is none: a remote window holds nothing beyond itself.
  public getIndexAtGlobalVisibleIndex(globalVisibleIndex: number): number {
    return this.getIndexAtGlobalPosition(this.host.getVisibleIndexes(), globalVisibleIndex);
  }
  // The same over the created records: a position of the whole view that counts the owner-hidden ones.
  public getIndexAtGlobalCreatedIndex(globalCreatedIndex: number): number {
    return this.getIndexAtGlobalPosition(this.host.getCreatedIndexes(), globalCreatedIndex);
  }
  private getIndexAtGlobalPosition(indexes: Array<number>, position: number): number {
    const at = position - this.getRecordNumberOffset();
    return at < 0 || at >= indexes.length ? -1 : indexes[at];
  }
  /* The record an insertion at a position of the whole view goes in front of, as a record index of
     the loaded window: the record at that visible position, or loadedCount (append) past the last
     visible record of the whole view. -1: a source that pages itself does not hold that position -
     the caller refuses and reports it. globalVisibleIndex counts the visible records of the whole
     view, as getGlobalVisibleIndex does. A negative position appends. */
  public getInsertIndexAtVisibleIndex(globalVisibleIndex: number): number {
    if (globalVisibleIndex < 0) return this.host.loadedCount;
    return this.getInsertIndexAtGlobalPosition(this.host.getVisibleIndexes(), globalVisibleIndex);
  }
  // The same over the created records (owner-hidden included); a negative position is the first one.
  public getInsertIndexAtCreatedIndex(globalCreatedIndex: number): number {
    return this.getInsertIndexAtGlobalPosition(this.host.getCreatedIndexes(), Math.max(0, globalCreatedIndex));
  }
  private getInsertIndexAtGlobalPosition(indexes: Array<number>, position: number): number {
    const at = position - this.getRecordNumberOffset();
    if (at >= 0 && at < indexes.length) return indexes[at];
    if (at === indexes.length) return this.host.loadedCount;
    // Outside the window: not loaded while the position is inside the whole view, an append past it.
    const viewCount = this.host.isPagedBySource ? this.host.knownCount : indexes.length;
    return position < viewCount ? -1 : this.host.loadedCount;
  }
  /* The same for a position among the objects (the materialized records, which under paging is the
     page): the record at that position, or loadedCount at or past the last one. A negative position
     is the first one. */
  public getInsertIndexAtMaterializedPosition(position: number): number {
    const p = Math.max(0, position);
    return p < this.getMaterializedIndexes().length ? this.materializedIndexToIndex(p) : this.host.loadedCount;
  }
  /* The records an owner materializes an object for, in object order. The view answers every DATA
     question (which records are in it, their order, the totals, the neighbours); this answers every
     OBJECT question (which record a panel or a row holds). Without paging they are the created
     indexes - owner-hidden records included, the owner keeps an object for them. With paging they
     are the current page, which holds visible records only: an owner that pages builds nothing for a
     record that is not on it. It lives with the list and not on the owner because it is the page cut
     of the view, and the list owns both. */
  public getMaterializedIndexes(): Array<number> {
    return this.host.pageSize > 0 ? this.host.getPageIndexes() : this.host.getCreatedIndexes();
  }
  public materializedIndexToIndex(position: number): number {
    if (this.host.pageSize <= 0) return this.createdIndexToIndex(position);
    const indexes = this.host.getPageIndexes();
    return position >= 0 && position < indexes.length ? indexes[position] : -1;
  }
  public indexToMaterializedIndex(index: number): number {
    if (this.host.pageSize <= 0) return this.indexToCreatedIndex(index);
    return positionOf(this.getMaterializedPositions(), index);
  }
  /* record index -> position among the materialized records, for the records that have an object.
     Memoized on the identity of the materialized array: the list never changes a view array in
     place, it replaces it, so a new array is the only way the map can go stale. A content change of
     the same length is seen through invalidateViews(), the limit the arrays themselves have. */
  public getMaterializedPositions(): { [index: number]: number } {
    return this.positions.getMaterializedPositions(this.getMaterializedIndexes());
  }
  /* The visible records of the whole view: for a source that pages itself the most records known to
     exist (a lower bound while the total is unknown), otherwise the visible records the list holds. */
  public get globalVisibleCount(): number {
    return this.host.isPagedBySource ? this.host.knownCount : this.host.getVisibleIndexes().length;
  }
  /* How far a number of the whole view reaches: the records counted, or further where the window holds
     more - a page of a source that pages itself keeps the records added or edited on it, wherever the
     source put them, so it may end past the total. The counts (globalVisibleCount, count, pageCount)
     stay the source's. Over the visible records, and over the created ones (owner-hidden included). */
  public get globalVisibleExtent(): number {
    return Math.max(this.globalVisibleCount, this.getRecordNumberOffset() + this.host.getVisibleIndexes().length);
  }
  public get globalCreatedExtent(): number {
    const created = this.host.getCreatedIndexes().length;
    return Math.max(this.host.isPagedBySource ? this.host.knownCount : created, this.getRecordNumberOffset() + created);
  }
  // The page that holds a visibleIndex (unpaged, see the vocabulary); 0 while the list does not page.
  public getPageOfVisibleIndex(visibleIndex: number): number {
    if (this.host.pageSize <= 0 || visibleIndex < 0) return 0;
    return Math.floor(visibleIndex / this.host.pageSize);
  }
  // The visible indexes of a page: the records getPageOfVisibleIndex puts on it. Every one is on page 0
  // while the list does not page.
  public getVisibleIndexesOfPage(page: number): Array<number> {
    const visible = this.host.getVisibleIndexes();
    const pageSize = this.host.pageSize;
    if (pageSize <= 0) return page === 0 ? visible : [];
    return visible.slice(page * pageSize, (page + 1) * pageSize);
  }
}

function positionOf(positions: { [index: number]: number }, index: number): number {
  const position = positions[index];
  return position !== undefined ? position : -1;
}
