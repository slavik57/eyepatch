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

  public remove(item: T): void {
    var removedItems = this._items.filter(_item => _item === item);
    this._items = this._items.filter(_item => _item !== item);

    this._raiseItemsRemoved(removedItems);
  }

  public removeRange(items: T[]): void {
    if (!items) {
      throw 'removeRange cannot be called with null or undefined';
    }

    var removedItems =
      this._items.filter(_item => this._isItemInsideArray(items, _item));

    this._items =
      this._items.filter(_item => !this._isItemInsideArray(items, _item));

    this._raiseItemsRemoved(removedItems);
  }

  public clear(): void {
    var removedItems = this._items;
    this._items = [];

    this._raiseItemsRemoved(removedItems);
  }

  private _isItemInsideArray(arrayToCheckIn: T[], item: T): boolean {
    return arrayToCheckIn.indexOf(item) >= 0;
  }

  private _raiseItemsAdded(items: T[]): void {
    var eventArgs: IItemsChangedEventArgs<T> = {
      added: items,
      removed: []
    };

    this._raiseItemsChangedIfNeeded(eventArgs);
  }

  private _raiseItemsRemoved(items: T[]): void {
    var eventArgs: IItemsChangedEventArgs<T> = {
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
