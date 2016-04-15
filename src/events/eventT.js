"use strict";
var conditionalEventT_1 = require('./conditionalEventT');
var EventT = (function () {
    function EventT() {
        this._conditionalEventT = new conditionalEventT_1.ConditionalEventT();
    }
    EventT.prototype.on = function (eventHandler) {
        this._conditionalEventT.on(eventHandler);
    };
    EventT.prototype.off = function (eventHandler) {
        this._conditionalEventT.off(eventHandler);
    };
    EventT.prototype.raise = function (data) {
        this._conditionalEventT.raise(data);
    };
    EventT.prototype.raiseSafe = function (data) {
        this._conditionalEventT.raiseSafe(data);
    };
    return EventT;
}());
exports.EventT = EventT;
