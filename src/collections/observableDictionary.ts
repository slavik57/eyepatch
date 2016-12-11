import { IEventT } from '../events/interfaces/iEvent';
import { EventT } from '../events/eventT';
import { IItemsChangedEventArgs } from './interfaces/iItemsChangedEventArgs';
import { IKeyValue } from './interfaces/iKeyValue';
import { IObservableDictionary } from './interfaces/iObservableDictionary';

export class ObservableDictionary<TKey, TValue> implements IObservableDictionary<TKey, TValue> {
  private static _observableDictionaryId = 0;

  private _dictionaryId: number;
  private _lastKeyId: number;
  private _keyIdPropertyName: string;

  private _keyIdsToKeysMap: Object;
  private _keyIdsToValuesMap: Object;

  private _size: number;

  private _itemsChanged: EventT<IItemsChangedEventArgs<IKeyValue<TKey, TValue>>>;

  constructor() {
    this._dictionaryId = this._getNewObservabledDictionaryId();
    this._keyIdPropertyName = this._createKeyIdPropertyNameForCurrentDictionary();

    this._lastKeyId = 0;

    this._resetDictionary();

    this._itemsChanged = new EventT<IItemsChangedEventArgs<IKeyValue<TKey, TValue>>>();
  }

  public get keys(): TKey[] {
    const result: TKey[] = [];

    for (const keyId in this._keyIdsToKeysMap) {
      if (!this._keyIdsToKeysMap.hasOwnProperty(keyId)) {
        continue;
      }

      const key: TKey = this._keyIdsToKeysMap[keyId];
      result.push(key);
    }

    return result;
  }

  public get values(): TValue[] {
    const result: TValue[] = [];

    for (const keyId in this._keyIdsToValuesMap) {
      if (!this._keyIdsToValuesMap.hasOwnProperty(keyId)) {
        continue;
      }

      const value: TValue = this._keyIdsToValuesMap[keyId];
      result.push(value);
    }

    return result;
  }

  public get keysAndValues(): IKeyValue<TKey, TValue>[] {
    return this._getAllKeyValuePairs();
  }

  public get size(): number {
    return this._size;
  }

  public get itemsChanged(): IEventT<IItemsChangedEventArgs<IKeyValue<TKey, TValue>>> {
    return this._itemsChanged;
  }

  public add(key: TKey, value: TValue): void {
    if (this.containsKey(key)) {
      this._overrideExistingKeyValuePair(key, value);
    } else {
      this._size++;
      this._addNewKeyValuePair(key, value);
    }
  }

  public remove(key: TKey): void {
    if (!this.containsKey(key)) {
      console.log('not contains')
      return;
    }

    this._size--;

    const removedValue: TValue =
      this._removeWithoutRaisingEventAndReturnRemovedValue(key);

    const removedPair: IKeyValue<TKey, TValue> = {
      key: key,
      value: removedValue
    };

    this._raiseItemsChanged([], [removedPair]);
  }

  public findKey(predicate: (key: TKey) => boolean): TKey {
    const keys: TKey[] = this.keys;

    for (let i = 0; i < keys.length; i++) {
      if (predicate(keys[i])) {
        return keys[i];
      }
    }

    return null;
  }

  public containsKey(key: TKey) {
    if (this._isObject(key)) {
      return this._keyIdPropertyName in key;
    }

    return this._keyIdsToKeysMap[this._getKeyIdForNotObject(key)] === key;
  }

  public containsValue(value: TValue) {
    for (const keyId in this._keyIdsToValuesMap) {
      if (!this._keyIdsToValuesMap.hasOwnProperty(keyId)) {
        continue;
      }

      const existingValue: TValue = this._keyIdsToValuesMap[keyId];

      if (value === existingValue) {
        return true;
      }
    }

    return false;
  }

  public getValueByKey(key: TKey): TValue {
    if (!this.containsKey(key)) {
      throw 'The key is not inside the dictionary';
    }

    const keyId: any = this._getKeyIdFromKey(key);

    return this._keyIdsToValuesMap[keyId];
  }

  public clear(): void {
    const removedPairs: IKeyValue<TKey, TValue>[] =
      this._getAllKeyValuePairs();

    for (let i = 0; i < removedPairs.length; i++) {
      const key: TKey = removedPairs[i].key;

      this._removeIdFromKey(key);
    }

    this._resetDictionary();

    this._raiseItemsChanged([], removedPairs);
  }

  private _getNewObservabledDictionaryId(): number {
    const newId = ObservableDictionary._observableDictionaryId;

    ObservableDictionary._observableDictionaryId++;

    return newId;
  }

  private _getNewKeyIdForObject(): any {
    this._lastKeyId++;

    return `obect_key_id_${this._lastKeyId}`;
  }

  private _getKeyIdForNotObject(key: TKey): any {
    if (typeof key === 'number') {
      return `not_object_number_${key}`;
    } else if (typeof key === 'boolean') {
      return `not_object_boolean_${key}`;
    } else if (typeof key === 'string') {
      return `not_object_string_${key}`;
    } else {
      return `not_obect_${key}`;
    }
  }

  private _createKeyIdPropertyNameForCurrentDictionary(): string {
    return '__$observableDictionary' + this._dictionaryId + '$keyId$__';
  }

  private _addNewKeyValuePair(key: TKey, value: TValue): void {
    this._addNewKeyValuePairWithoutRaisingEvent(key, value);

    const addedPair: IKeyValue<TKey, TValue> = {
      key: key,
      value: value
    }

    this._raiseItemsChanged([addedPair], []);
  }

  private _overrideExistingKeyValuePair(key: TKey, value: TValue): void {
    const removedValue: TValue =
      this._removeWithoutRaisingEventAndReturnRemovedValue(key);

    this._addNewKeyValuePairWithoutRaisingEvent(key, value);

    const addedPair: IKeyValue<TKey, TValue> = {
      key: key,
      value: value
    };

    const removedPair: IKeyValue<TKey, TValue> = {
      key: key,
      value: removedValue
    };

    this._raiseItemsChanged([addedPair], [removedPair]);
  }

  private _addNewKeyValuePairWithoutRaisingEvent(key: TKey, value: TValue): void {
    const keyId: any = this._defineKeyId(key);

    this._keyIdsToKeysMap[keyId] = key;
    this._keyIdsToValuesMap[keyId] = value;
  }

  private _removeWithoutRaisingEventAndReturnRemovedValue(key: TKey): TValue {
    const keyId: any = this._getKeyIdFromKey(key);
    this._removeIdFromKey(key);

    this._removeKeyFromMap(keyId);

    const value: TValue =
      this._removeValueFromValues(keyId);

    return value;
  }

  private _raiseItemsChanged(added: IKeyValue<TKey, TValue>[], removed: IKeyValue<TKey, TValue>[]): void {
    this._itemsChanged.raiseSafe({
      added: added,
      removed: removed
    });
  }

  private _getAllKeyValuePairs(): IKeyValue<TKey, TValue>[] {
    const result: IKeyValue<TKey, TValue>[] = [];

    for (const keyId in this._keyIdsToKeysMap) {
      if (!this._keyIdsToKeysMap.hasOwnProperty(keyId)) {
        continue;
      }

      const key: TKey = this._keyIdsToKeysMap[keyId];
      const value: TValue = this._keyIdsToValuesMap[keyId];

      result.push({
        key: key,
        value: value
      });
    }

    return result;
  }

  private _defineKeyId(key: TKey): any {
    if (!this._isObject(key)) {
      return this._getKeyIdForNotObject(key);
    }

    const keyId = this._getNewKeyIdForObject();

    const propertyDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      writable: false,
      value: keyId
    };

    Object.defineProperty(key, this._keyIdPropertyName, propertyDescriptor);

    return keyId;
  }

  private _getKeyIdFromKey(key: TKey): any {
    if (this._isObject(key)) {
      return key[this._keyIdPropertyName];
    } else {
      return this._getKeyIdForNotObject(key);
    }
  }

  private _removeIdFromKey(key: TKey): void {
    if (this._isObject(key)) {
      delete key[this._keyIdPropertyName];
    }
  }

  private _removeKeyFromMap(keyId: number): void {
    delete this._keyIdsToKeysMap[keyId];
  }

  private _removeValueFromValues(keyId: number): TValue {
    const value: TValue = this._keyIdsToValuesMap[keyId];

    delete this._keyIdsToValuesMap[keyId];

    return value;
  }

  private _resetDictionary(): void {
    this._keyIdsToKeysMap = {};
    this._keyIdsToValuesMap = {};

    this._size = 0;
  }

  private _isObject(key: TKey): boolean {
    return typeof key === 'object';
  }
}
