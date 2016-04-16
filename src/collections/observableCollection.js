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
    ObservableCollection.prototype.remove = function (item) {
        var removedItems = this._items.filter(function (_item) { return _item === item; });
        this._items = this._items.filter(function (_item) { return _item !== item; });
        this._raiseItemsRemoved(removedItems);
    };
    ObservableCollection.prototype.removeRange = function (items) {
        var _this = this;
        if (!items) {
            throw 'removeRange cannot be called with null or undefined';
        }
        var removedItems = this._items.filter(function (_item) { return _this._isItemInsideArray(items, _item); });
        this._items =
            this._items.filter(function (_item) { return !_this._isItemInsideArray(items, _item); });
        this._raiseItemsRemoved(removedItems);
    };
    ObservableCollection.prototype.clear = function () {
        var removedItems = this._items;
        this._items = [];
        this._raiseItemsRemoved(removedItems);
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
