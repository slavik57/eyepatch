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
    var result: TKey[] = [];

    for (var keyId in this._keyIdsToKeysMap) {
      var key: TKey = this._keyIdsToKeysMap[keyId];
      result.push(key);
    }

    return result;
  }

  public get values(): TValue[] {
    var result: TValue[] = [];

    for (var keyId in this._keyIdsToValuesMap) {
      var value: TValue = this._keyIdsToValuesMap[keyId];
      result.push(value);
    }

    return result;
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
      return;
    }

    this._size--;

    var removedValue: TValue =
      this._removeWithoutRaisingEventAndReturnRemovedValue(key);

    var removedPair: IKeyValue<TKey, TValue> = {
      key: key,
      value: removedValue
    };

    this._raiseItemsChanged([], [removedPair]);
  }

  public containsKey(key: TKey) {
    return this._keyIdPropertyName in key;
  }

  public containsValue(value: TValue) {
    for (var keyId in this._keyIdsToValuesMap) {
      var existingValue: TValue = this._keyIdsToValuesMap[keyId];

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

    var keyId: number = this._getKeyIdFromKey(key);

    return this._keyIdsToValuesMap[keyId];
  }

  public clear(): void {
    var removedPairs: IKeyValue<TKey, TValue>[] =
      this._getAllKeyValuePairs();

    for (var i = 0; i < removedPairs.length; i++) {
      var key: TKey = removedPairs[i].key;

      this._removeIdFromKey(key);
    }

    this._resetDictionary();

    this._raiseItemsChanged([], removedPairs);
  }

  private _getNewObservabledDictionaryId(): number {
    var newId = ObservableDictionary._observableDictionaryId;

    ObservableDictionary._observableDictionaryId++;

    return newId;
  }

  private _getNewKeyId(): number {
    this._lastKeyId++;

    return this._lastKeyId;
  }

  private _createKeyIdPropertyNameForCurrentDictionary(): string {
    return '__$observableDictionary' + this._dictionaryId + '$keyId$__';
  }

  private _addNewKeyValuePair(key: TKey, value: TValue): void {
    this._addNewKeyValuePairWithoutRaisingEvent(key, value);

    var addedPair: IKeyValue<TKey, TValue> = {
      key: key,
      value: value
    }

    this._raiseItemsChanged([addedPair], []);
  }

  private _overrideExistingKeyValuePair(key: TKey, value: TValue): void {
    var removedValue: TValue =
      this._removeWithoutRaisingEventAndReturnRemovedValue(key);

    this._addNewKeyValuePairWithoutRaisingEvent(key, value);

    var addedPair: IKeyValue<TKey, TValue> = {
      key: key,
      value: value
    };

    var removedPair: IKeyValue<TKey, TValue> = {
      key: key,
      value: removedValue
    };

    this._raiseItemsChanged([addedPair], [removedPair]);
  }

  private _addNewKeyValuePairWithoutRaisingEvent(key: TKey, value: TValue): void {
    var keyId: number = this._defineKeyId(key);

    this._keyIdsToKeysMap[keyId] = key;
    this._keyIdsToValuesMap[keyId] = value;
  }

  private _removeWithoutRaisingEventAndReturnRemovedValue(key: TKey): TValue {
    var keyId: number = this._getKeyIdFromKey(key);
    this._removeIdFromKey(key);

    this._removeKeyFromMap(keyId);

    var value: TValue =
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
    var result: IKeyValue<TKey, TValue>[] = [];

    for (var keyId in this._keyIdsToKeysMap) {
      var key: TKey = this._keyIdsToKeysMap[keyId];
      var value: TValue = this._keyIdsToValuesMap[keyId];

      result.push({
        key: key,
        value: value
      });
    }

    return result;
  }

  private _defineKeyId(key: TKey): number {
    var keyId = this._getNewKeyId();

    var propertyDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      writable: false,
      value: keyId
    };

    Object.defineProperty(key, this._keyIdPropertyName, propertyDescriptor);

    return keyId;
  }

  private _getKeyIdFromKey(key: TKey): number {
    return key[this._keyIdPropertyName];
  }

  private _removeIdFromKey(key: TKey): void {
    delete key[this._keyIdPropertyName];
  }

  private _removeKeyFromMap(keyId: number): void {
    delete this._keyIdsToKeysMap[keyId];
  }

  private _removeValueFromValues(keyId: number): TValue {
    var value: TValue = this._keyIdsToValuesMap[keyId];

    delete this._keyIdsToValuesMap[keyId];

    return value;
  }

  private _resetDictionary(): void {
    this._keyIdsToKeysMap = {};
    this._keyIdsToValuesMap = {};

    this._size = 0;
  }
}
