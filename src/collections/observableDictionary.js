"use strict";
var eventT_1 = require('../events/eventT');
var ObservableDictionary = (function () {
    function ObservableDictionary() {
        this._dictionaryId = this._getNewObservabledDictionaryId();
        this._keyIdPropertyName = this._createKeyIdPropertyNameForCurrentDictionary();
        this._lastKeyId = 0;
        this._resetDictionary();
        this._itemsChanged = new eventT_1.EventT();
    }
    Object.defineProperty(ObservableDictionary.prototype, "keys", {
        get: function () {
            var result = [];
            for (var keyId in this._keyIdsToKeysMap) {
                var key = this._keyIdsToKeysMap[keyId];
                result.push(key);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObservableDictionary.prototype, "values", {
        get: function () {
            var result = [];
            for (var keyId in this._keyIdsToValuesMap) {
                var value = this._keyIdsToValuesMap[keyId];
                result.push(value);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObservableDictionary.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObservableDictionary.prototype, "itemsChanged", {
        get: function () {
            return this._itemsChanged;
        },
        enumerable: true,
        configurable: true
    });
    ObservableDictionary.prototype.add = function (key, value) {
        if (this.containsKey(key)) {
            this._overrideExistingKeyValuePair(key, value);
        }
        else {
            this._size++;
            this._addNewKeyValuePair(key, value);
        }
    };
    ObservableDictionary.prototype.remove = function (key) {
        if (!this.containsKey(key)) {
            return;
        }
        this._size--;
        var removedValue = this._removeWithoutRaisingEventAndReturnRemovedValue(key);
        var removedPair = {
            key: key,
            value: removedValue
        };
        this._raiseItemsChanged([], [removedPair]);
    };
    ObservableDictionary.prototype.containsKey = function (key) {
        return this._keyIdPropertyName in key;
    };
    ObservableDictionary.prototype.containsValue = function (value) {
        for (var keyId in this._keyIdsToValuesMap) {
            var existingValue = this._keyIdsToValuesMap[keyId];
            if (value == existingValue) {
                return true;
            }
        }
        return false;
    };
    ObservableDictionary.prototype.getValueByKey = function (key) {
        if (!this.containsKey(key)) {
            throw 'The key is not inside the dictionary';
        }
        var keyId = this._getKeyIdFromKey(key);
        return this._keyIdsToValuesMap[keyId];
    };
    ObservableDictionary.prototype.clear = function () {
        var removedPairs = this._getAllKeyValuePairs();
        for (var i = 0; i < removedPairs.length; i++) {
            var key = removedPairs[i].key;
            this._removeIdFromKey(key);
        }
        this._resetDictionary();
        this._raiseItemsChanged([], removedPairs);
    };
    ObservableDictionary.prototype._getNewObservabledDictionaryId = function () {
        var newId = ObservableDictionary._observableDictionaryId;
        ObservableDictionary._observableDictionaryId++;
        return newId;
    };
    ObservableDictionary.prototype._getNewKeyId = function () {
        this._lastKeyId++;
        return this._lastKeyId;
    };
    ObservableDictionary.prototype._createKeyIdPropertyNameForCurrentDictionary = function () {
        return '__$observableDictionary' + this._dictionaryId + '$keyId$__';
    };
    ObservableDictionary.prototype._addNewKeyValuePair = function (key, value) {
        this._addNewKeyValuePairWithoutRaisingEvent(key, value);
        var addedPair = {
            key: key,
            value: value
        };
        this._raiseItemsChanged([addedPair], []);
    };
    ObservableDictionary.prototype._overrideExistingKeyValuePair = function (key, value) {
        var removedValue = this._removeWithoutRaisingEventAndReturnRemovedValue(key);
        this._addNewKeyValuePairWithoutRaisingEvent(key, value);
        var addedPair = {
            key: key,
            value: value
        };
        var removedPair = {
            key: key,
            value: removedValue
        };
        this._raiseItemsChanged([addedPair], [removedPair]);
    };
    ObservableDictionary.prototype._addNewKeyValuePairWithoutRaisingEvent = function (key, value) {
        var keyId = this._defineKeyId(key);
        this._keyIdsToKeysMap[keyId] = key;
        this._keyIdsToValuesMap[keyId] = value;
    };
    ObservableDictionary.prototype._removeWithoutRaisingEventAndReturnRemovedValue = function (key) {
        var keyId = this._getKeyIdFromKey(key);
        this._removeIdFromKey(key);
        this._removeKeyFromMap(keyId);
        var value = this._removeValueFromValues(keyId);
        return value;
    };
    ObservableDictionary.prototype._raiseItemsChanged = function (added, removed) {
        this._itemsChanged.raiseSafe({
            added: added,
            removed: removed
        });
    };
    ObservableDictionary.prototype._getAllKeyValuePairs = function () {
        var result = [];
        for (var keyId in this._keyIdsToKeysMap) {
            var key = this._keyIdsToKeysMap[keyId];
            var value = this._keyIdsToValuesMap[keyId];
            result.push({
                key: key,
                value: value
            });
        }
        return result;
    };
    ObservableDictionary.prototype._defineKeyId = function (key) {
        var keyId = this._getNewKeyId();
        var propertyDescriptor = {
            configurable: true,
            enumerable: false,
            writable: false,
            value: keyId
        };
        Object.defineProperty(key, this._keyIdPropertyName, propertyDescriptor);
        return keyId;
    };
    ObservableDictionary.prototype._getKeyIdFromKey = function (key) {
        return key[this._keyIdPropertyName];
    };
    ObservableDictionary.prototype._removeIdFromKey = function (key) {
        delete key[this._keyIdPropertyName];
    };
    ObservableDictionary.prototype._removeKeyFromMap = function (keyId) {
        delete this._keyIdsToKeysMap[keyId];
    };
    ObservableDictionary.prototype._removeValueFromValues = function (keyId) {
        var value = this._keyIdsToValuesMap[keyId];
        delete this._keyIdsToValuesMap[keyId];
        return value;
    };
    ObservableDictionary.prototype._resetDictionary = function () {
        this._keyIdsToKeysMap = {};
        this._keyIdsToValuesMap = {};
        this._size = 0;
    };
    ObservableDictionary._observableDictionaryId = 0;
    return ObservableDictionary;
}());
exports.ObservableDictionary = ObservableDictionary;
