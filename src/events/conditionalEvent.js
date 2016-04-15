"use strict";
var conditionalEventT_1 = require('./conditionalEventT');
var ConditionalEvent = (function () {
    function ConditionalEvent() {
        this._conditionalEventT = new conditionalEventT_1.ConditionalEventT();
    }
    ConditionalEvent.prototype.on = function (eventHandler, condition) {
        this._conditionalEventT.on(eventHandler, condition);
    };
    ConditionalEvent.prototype.off = function (eventHandler, condition) {
        this._conditionalEventT.off(eventHandler, condition);
    };
    ConditionalEvent.prototype.raise = function () {
        this._conditionalEventT.raise({});
    };
    ConditionalEvent.prototype.raiseSafe = function () {
        this._conditionalEventT.raiseSafe({});
    };
    return ConditionalEvent;
}());
exports.ConditionalEvent = ConditionalEvent;
