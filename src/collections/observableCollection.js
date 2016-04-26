"use strict";
var eventT_1 = require('../events/eventT');
var ObservableCollection = (function () {
    function ObservableCollection() {
        this._items = [];
        this._itemsChangedEvent = new eventT_1.EventT();
    }
    Object.defineProperty(ObservableCollection.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObservableCollection.prototype, "itemsChanged", {
        get: function () {
            return this._itemsChangedEvent;
        },
        enumerable: true,
        configurable: true
    });
    ObservableCollection.prototype.add = function (item) {
        this._items.push(item);
        this._raiseItemsAdded([item]);
    };
    ObservableCollection.prototype.addRange = function (items) {
        this._items.push.apply(this._items, items);
        this._raiseItemsAdded(items);
    };
    ObservableCollection.prototype.removeMatching = function (item) {
        var removedItems = this._items.filter(function (_item) { return _item === item; });
        this._items = this._items.filter(function (_item) { return _item !== item; });
        this._raiseItemsRemoved(removedItems);
    };
    ObservableCollection.prototype.removeMatchingRange = function (items) {
        var _this = this;
        if (!items) {
            throw 'removeRange cannot be called with null or undefined';
        }
        var removedItems = this._items.filter(function (_item) { return _this._isItemInsideArray(items, _item); });
        this._items =
            this._items.filter(function (_item) { return !_this._isItemInsideArray(items, _item); });
        this._raiseItemsRemoved(removedItems);
    };
    ObservableCollection.prototype.removeAtIndex = function (index) {
        if (this._items.length <= index) {
            return;
        }
        var itemToRemove = this._items[index];
        this._items.splice(index, 1);
        this._raiseItemsRemoved([itemToRemove]);
    };
    ObservableCollection.prototype.removeAtIndices = function (indices) {
        if (!indices) {
            throw 'removeAtIndices cannot be called with null or undefined';
        }
        var filteredItems = [];
        var removedItems = [];
        for (var i = 0; i < this._items.length; i++) {
            var item = this._items[i];
            if (this._isItemInsideArray(indices, i)) {
                removedItems.push(item);
            }
            else {
                filteredItems.push(item);
            }
        }
        this._items = filteredItems;
        this._raiseItemsRemoved(removedItems);
    };
    ObservableCollection.prototype.clear = function () {
        var removedItems = this._items;
        this._items = [];
        this._raiseItemsRemoved(removedItems);
    };
    ObservableCollection.prototype.contains = function (item) {
        return this._items.indexOf(item) >= 0;
    };
    ObservableCollection.prototype._isItemInsideArray = function (arrayToCheckIn, item) {
        return arrayToCheckIn.indexOf(item) >= 0;
    };
    ObservableCollection.prototype._raiseItemsAdded = function (items) {
        var eventArgs = {
            added: items,
            removed: []
        };
        this._raiseItemsChangedIfNeeded(eventArgs);
    };
    ObservableCollection.prototype._raiseItemsRemoved = function (items) {
        var eventArgs = {
            added: [],
            removed: items
        };
        this._raiseItemsChangedIfNeeded(eventArgs);
    };
    ObservableCollection.prototype._raiseItemsChangedIfNeeded = function (eventArgs) {
        if (eventArgs.added.length < 1 &&
            eventArgs.removed.length < 1) {
            return;
        }
        this._itemsChangedEvent.raise(eventArgs);
    };
    return ObservableCollection;
}());
exports.ObservableCollection = ObservableCollection;
