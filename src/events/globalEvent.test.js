"use strict";
var globalEvent_1 = require("./globalEvent");
var chai_1 = require('chai');
var EventSubscriber = (function () {
    function EventSubscriber() {
        this.eventCallbackArgs = [];
        this.throwingEventCallbackArgs = [];
        var globalEvent = new globalEvent_1.GlobalEvent();
        globalEvent.on(EventSubscriber.REGULAR_EVENT_NAME, this.eventCallback.bind(this));
        globalEvent.on(EventSubscriber.THROWING_EVENT_NAME, this.throwingEventCallback.bind(this));
    }
    EventSubscriber.prototype.eventCallback = function (data) {
        this.eventCallbackArgs.push(data);
    };
    EventSubscriber.prototype.throwingEventCallback = function (data) {
        this.throwingEventCallbackArgs.push(data);
        throw 'some error';
    };
    EventSubscriber.REGULAR_EVENT_NAME = 'regular event name';
    EventSubscriber.THROWING_EVENT_NAME = 'throwing event name';
    return EventSubscriber;
}());
describe('GlobalEvent', function () {
    var globalEvent;
    var eventSubscriber;
    beforeEach(function () {
        eventSubscriber = new EventSubscriber();
    });
    beforeEach(function () {
        globalEvent = new globalEvent_1.GlobalEvent();
    });
    afterEach(function () {
        globalEvent.clearAllSubscribtions(EventSubscriber.REGULAR_EVENT_NAME);
        globalEvent.clearAllSubscribtions(EventSubscriber.THROWING_EVENT_NAME);
    });
    it('raising global event with not existing name should not call the callbacks', function () {
        globalEvent.raise('non existing name', 1);
        chai_1.expect(eventSubscriber.eventCallbackArgs).to.be.length(0);
        chai_1.expect(eventSubscriber.throwingEventCallbackArgs).to.be.length(0);
    });
    it('raising regular event should raise only the regular event', function () {
        var data = 12;
        globalEvent.raise(EventSubscriber.REGULAR_EVENT_NAME, data);
        chai_1.expect(eventSubscriber.eventCallbackArgs).to.be.deep.equal([data]);
        chai_1.expect(eventSubscriber.throwingEventCallbackArgs).to.be.length(0);
    });
    it('raising throwing event should throw an error', function () {
        var data = 'aaa';
        var action = function () {
            return globalEvent.raise(EventSubscriber.THROWING_EVENT_NAME, data);
        };
        chai_1.expect(action).to.throw('some error');
        chai_1.expect(eventSubscriber.eventCallbackArgs).to.be.length(0);
        chai_1.expect(eventSubscriber.throwingEventCallbackArgs).to.be.deep.equal([data]);
    });
    it('raising safely a throwing event should not throw an error', function () {
        var data = 'aaa';
        var action = function () {
            return globalEvent.raiseSafe(EventSubscriber.THROWING_EVENT_NAME, data);
        };
        chai_1.expect(action).to.not.throw();
        chai_1.expect(eventSubscriber.eventCallbackArgs).to.be.length(0);
        chai_1.expect(eventSubscriber.throwingEventCallbackArgs).to.be.deep.equal([data]);
    });
    it('raising an event after unsubscribing from it should not raise it', function () {
        var eventName = 'event name';
        var numberOfTimesRaised = 0;
        var eventHandler = function () { return numberOfTimesRaised++; };
        globalEvent.on(eventName, eventHandler);
        globalEvent.off(eventName, eventHandler);
        globalEvent.raise(eventName);
        chai_1.expect(numberOfTimesRaised).to.be.equal(0);
    });
});
