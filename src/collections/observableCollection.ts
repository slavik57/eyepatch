import {IEventT} from '../events/interfaces/iEvent';
import {EventT} from '../events/eventT';
import {IItemsChangedEventArgs} from './interfaces/iItemsChangedEventArgs';
import {IObservableCollection} from './interfaces/iObservableCollection';

export class ObservableCollection<T> implements IObservableCollection<T> {
  private _items: T[] = [];
  private _itemsChangedEvent = new EventT<IItemsChangedEventArgs<T>>();

  public get items(): T[] {
    return this._items;
  }

  public get size(): number {
    return this._items.length;
  }

  public get itemsChanged(): IEventT<IItemsChangedEventArgs<T>> {
    return this._itemsChangedEvent;
  }

  public add(item: T): void {
    this._items.push(item);

    this._raiseItemsAdded([item]);
  }

  public addRange(items: T[]): void {
    this._items.push.apply(this._items, items);

    this._raiseItemsAdded(items);
  }

  public removeMatching(item: T): void {
    const removedItems = this._items.filter(_item => _item === item);
    this._items = this._items.filter(_item => _item !== item);

    this._raiseItemsRemoved(removedItems);
  }

  public removeMatchingRange(items: T[]): void {
    if (!items) {
      throw 'removeRange cannot be called with null or undefined';
    }

    const removedItems =
      this._items.filter(_item => this._isItemInsideArray(items, _item));

    this._items =
      this._items.filter(_item => !this._isItemInsideArray(items, _item));

    this._raiseItemsRemoved(removedItems);
  }

  public removeAtIndex(index: number): void {
    if (this._items.length <= index) {
      return;
    }

    const itemToRemove = this._items[index];

    this._items.splice(index, 1);

    this._raiseItemsRemoved([itemToRemove]);
  }

  public removeAtIndices(indices: number[]): void {
    if (!indices) {
      throw 'removeAtIndices cannot be called with null or undefined';
    }

    const filteredItems = [];
    const removedItems = [];

    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];

      if (this._isItemInsideArray(indices, i)) {
        removedItems.push(item);
      } else {
        filteredItems.push(item);
      }
    }

    this._items = filteredItems;

    this._raiseItemsRemoved(removedItems);
  }

  public clear(): void {
    const removedItems = this._items;
    this._items = [];

    this._raiseItemsRemoved(removedItems);
  }

  public contains(item: T): boolean {
    return this._items.indexOf(item) >= 0;
  }

  private _isItemInsideArray<U>(arrayToCheckIn: U[], item: U): boolean {
    return arrayToCheckIn.indexOf(item) >= 0;
  }

  private _raiseItemsAdded(items: T[]): void {
    const eventArgs: IItemsChangedEventArgs<T> = {
      added: items,
      removed: []
    };

    this._raiseItemsChangedIfNeeded(eventArgs);
  }

  private _raiseItemsRemoved(items: T[]): void {
    const eventArgs: IItemsChangedEventArgs<T> = {
      added: [],
      removed: items
    };

    this._raiseItemsChangedIfNeeded(eventArgs);
  }

  private _raiseItemsChangedIfNeeded(eventArgs: IItemsChangedEventArgs<T>): void {
    if (eventArgs.added.length < 1 &&
      eventArgs.removed.length < 1) {
      return;
    }

    this._itemsChangedEvent.raise(eventArgs);
  }
}
