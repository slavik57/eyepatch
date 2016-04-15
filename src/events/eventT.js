"use strict";
var EventT = (function () {
    function EventT() {
        this._eventHandlers = [];
    }
    EventT.prototype.on = function (eventHandler) {
        if (!this._isEventHandlerRegistered(eventHandler)) {
            this._eventHandlers.push(eventHandler);
        }
    };
    EventT.prototype.off = function (eventHandler) {
        var indexOfEventHandler = this._eventHandlers.indexOf(eventHandler);
        this._eventHandlers.splice(indexOfEventHandler, 1);
    };
    EventT.prototype.raise = function (data) {
        this._eventHandlers.forEach(function (_eventHandler) {
            _eventHandler(data);
        });
    };
    EventT.prototype.raiseSafe = function (data) {
        var _this = this;
        this._eventHandlers.forEach(function (_eventHandler) {
            _this._callEventHandlerSafe(_eventHandler, data);
        });
    };
    EventT.prototype._isEventHandlerRegistered = function (eventHandler) {
        return this._eventHandlers.indexOf(eventHandler) >= 0;
    };
    EventT.prototype._callEventHandlerSafe = function (eventHandler, data) {
        try {
            eventHandler(data);
        }
        catch (e) {
        }
    };
    return EventT;
}());
exports.EventT = EventT;
