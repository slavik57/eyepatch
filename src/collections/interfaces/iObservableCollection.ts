import {IEventT} from '../../events/interfaces/iEvent';
import {IItemsChangedEventArgs} from './iItemsChangedEventArgs';

export interface IObservableCollection<T> {
  readonly items: T[];

  readonly itemsChanged: IEventT<IItemsChangedEventArgs<T>>;

  add(item: T): void;
  addRange(items: T[]): void;

  removeMatching(items: T): void;
  removeMatchingRange(items: T[]): void;

  removeAtIndex(index: number): void;
  removeAtIndices(indices: number[]): void;

  clear(): void;
}
