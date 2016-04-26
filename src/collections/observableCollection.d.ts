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
    removeMatching(item: T): void;
    removeMatchingRange(items: T[]): void;
    removeAtIndex(index: number): void;
    removeAtIndices(indices: number[]): void;
    clear(): void;
    contains(item: T): boolean;
    private _isItemInsideArray<U>(arrayToCheckIn, item);
    private _raiseItemsAdded(items);
    private _raiseItemsRemoved(items);
    private _raiseItemsChangedIfNeeded(eventArgs);
}
