"use strict";
var eventT_1 = require('./eventT');
var Event = (function () {
    function Event() {
        this._eventT = new eventT_1.EventT();
    }
    Event.prototype.on = function (eventHandler) {
        this._eventT.on(eventHandler);
    };
    Event.prototype.off = function (eventHandler) {
        this._eventT.off(eventHandler);
    };
    Event.prototype.raise = function () {
        this._eventT.raise({});
    };
    Event.prototype.raiseSafe = function () {
        this._eventT.raiseSafe({});
    };
    return Event;
}());
exports.Event = Event;
