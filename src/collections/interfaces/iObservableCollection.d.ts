import { IEventT } from '../../events/interfaces/iEvent';
import { IItemsChangedEventArgs } from './iItemsChangedEventArgs';
export interface IObservableCollection<T> {
    readonly items: T[];
    readonly itemsChanged: IEventT<IItemsChangedEventArgs<T>>;
    add(item: T): void;
    addRange(items: T[]): void;
    remove(items: T): void;
    removeRange(items: T[]): void;
    clear(): void;
}
