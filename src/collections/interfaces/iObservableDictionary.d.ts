import { IEventT } from '../../events/interfaces/iEvent';
import { IItemsChangedEventArgs } from './iItemsChangedEventArgs';
import { IKeyValue } from './iKeyValue';
export interface IObservableDictionary<TKey, TValue> {
    readonly keys: TKey[];
    readonly values: TValue[];
    readonly size: number;
    readonly itemsChanged: IEventT<IItemsChangedEventArgs<IKeyValue<TKey, TValue>>>;
    add(key: TKey, value: TValue): void;
    remove(key: TKey): void;
    findKey(predicate: (key: TKey) => boolean): TKey;
    containsKey(key: TKey): any;
    containsValue(value: TValue): any;
    getValueByKey(key: TKey): TValue;
    clear(): void;
}
