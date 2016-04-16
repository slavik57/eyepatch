import { IEventT } from '../events/interfaces/iEvent';
import { IItemsChangedEventArgs } from './interfaces/iItemsChangedEventArgs';
import { IObservableCollection } from './interfaces/iObservableCollection';
export declare class ObservableCollection<T> implements IObservableCollection<T> {
    private _items;
    private _itemsChangedEvent;
    readonly items: T[];
    readonly itemsChanged: IEventT<IItemsChangedEventArgs<T>>;
    add(item: T): void;
    addRange(items: T[]): void;
    remove(item: T): void;
    removeRange(items: T[]): void;
    clear(): void;
    private _isItemInsideArray(arrayToCheckIn, item);
    private _raiseItemsAdded(items);
    private _raiseItemsRemoved(items);
    private _raiseItemsChangedIfNeeded(eventArgs);
}
