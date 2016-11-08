"use strict";
var eventT_1 = require("./eventT");
var GlobalEvent = (function () {
    function GlobalEvent() {
    }
    GlobalEvent.prototype.on = function (eventName, eventHandler) {
        var event = this.getEvent(eventName);
        if (!event) {
            event = new eventT_1.EventT();
            GlobalEvent._globalEventsMap[eventName] = event;
        }
        event.on(eventHandler);
    };
    GlobalEvent.prototype.off = function (eventName, eventHandler) {
        var event = this.getEvent(eventName);
        if (event) {
            event.off(eventHandler);
        }
    };
    GlobalEvent.prototype.clearAllSubscribtions = function (eventName) {
        if (!!this.getEvent(eventName)) {
            delete GlobalEvent._globalEventsMap[eventName];
        }
    };
    GlobalEvent.prototype.raise = function (eventName, data) {
        var event = this.getEvent(eventName);
        if (event) {
            event.raise(data);
        }
    };
    GlobalEvent.prototype.raiseSafe = function (eventName, data) {
        var event = this.getEvent(eventName);
        if (event) {
            event.raiseSafe(data);
        }
    };
    GlobalEvent.prototype.getEvent = function (eventName) {
        return GlobalEvent._globalEventsMap[eventName];
    };
    GlobalEvent._globalEventsMap = {};
    return GlobalEvent;
}());
exports.GlobalEvent = GlobalEvent;
