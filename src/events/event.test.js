"use strict";
var chai_1 = require('chai');
var event_1 = require('./event');
describe('Event', function () {
    var event;
    beforeEach(function () {
        event = new event_1.Event();
    });
    function createEventHandler(event) {
        var eventHandler = (function () {
            eventHandler.numberOfTimesCalled++;
        });
        eventHandler.numberOfTimesCalled = 0;
        return eventHandler;
    }
    function registerThrowingEventHandler(event) {
        var eventHandler = (function () {
            eventHandler.numberOfTimesCalled++;
            throw 'some error';
        });
        eventHandler.numberOfTimesCalled = 0;
        event.on(eventHandler);
        return eventHandler;
    }
    function verifyEventHandlerWasRaisedOnce(eventHandler) {
        chai_1.expect(eventHandler.numberOfTimesCalled).to.be.equal(1);
    }
    function verifyEventHandlerWasNeverRaised(eventHandler) {
        chai_1.expect(eventHandler.numberOfTimesCalled).to.be.equal(0);
    }
    describe('raise', function () {
        it('raising unregistered event should not throw errors', function () {
            event.raise();
        });
        it('raising on registered event should raise event on all registratios', function () {
            var handler1 = createEventHandler(event);
            var handler2 = createEventHandler(event);
            var handler3 = createEventHandler(event);
            event.on(handler1);
            event.on(handler2);
            event.on(handler3);
            event.raise();
            verifyEventHandlerWasRaisedOnce(handler1);
            verifyEventHandlerWasRaisedOnce(handler2);
            verifyEventHandlerWasRaisedOnce(handler3);
        });
        it('registering event handler that throws an error should throw error', function () {
            var throwingHandler = registerThrowingEventHandler(event);
            event.on(throwingHandler);
            var raisingAction = function () { return event.raise(); };
            chai_1.expect(raisingAction).to.throw();
            verifyEventHandlerWasRaisedOnce(throwingHandler);
        });
        it('registering event handler that throws an error should not raise the next event handler', function () {
            var throwingHandler = registerThrowingEventHandler(event);
            var handler = createEventHandler(event);
            event.on(throwingHandler);
            event.on(handler);
            var raisingAction = function () { return event.raise(); };
            chai_1.expect(raisingAction).to.throw();
            verifyEventHandlerWasRaisedOnce(throwingHandler);
            verifyEventHandlerWasNeverRaised(handler);
        });
        it('unregistering event handler should not raise it', function () {
            var handler = createEventHandler(event);
            var handlerToUnregister = createEventHandler(event);
            event.on(handler);
            event.on(handlerToUnregister);
            event.off(handlerToUnregister);
            event.raise();
            verifyEventHandlerWasNeverRaised(handlerToUnregister);
        });
        it('unregistering event handler should raise the not ramoved event handlers', function () {
            var handler1 = createEventHandler(event);
            var handler2 = createEventHandler(event);
            var handlerToUnregister = createEventHandler(event);
            var handler3 = createEventHandler(event);
            var handler4 = createEventHandler(event);
            event.on(handler1);
            event.on(handler2);
            event.on(handlerToUnregister);
            event.on(handler3);
            event.on(handler4);
            event.off(handlerToUnregister);
            event.raise();
            verifyEventHandlerWasRaisedOnce(handler1);
            verifyEventHandlerWasRaisedOnce(handler2);
            verifyEventHandlerWasRaisedOnce(handler3);
            verifyEventHandlerWasRaisedOnce(handler4);
        });
    });
    describe('raiseSafe', function () {
        it('raising unregistered event should not throw errors', function () {
            event.raiseSafe();
        });
        it('raising on registered event should raise event on all registratios', function () {
            var handler1 = createEventHandler(event);
            var handler2 = createEventHandler(event);
            var handler3 = createEventHandler(event);
            event.on(handler1);
            event.on(handler2);
            event.on(handler3);
            event.raiseSafe();
            verifyEventHandlerWasRaisedOnce(handler1);
            verifyEventHandlerWasRaisedOnce(handler2);
            verifyEventHandlerWasRaisedOnce(handler3);
        });
        it('registering event handler that throws an error should not throw error', function () {
            var throwingHandler = registerThrowingEventHandler(event);
            event.on(throwingHandler);
            var raisingAction = function () { return event.raiseSafe(); };
            chai_1.expect(raisingAction).to.not.throw();
            verifyEventHandlerWasRaisedOnce(throwingHandler);
        });
        it('registering event handler that throws an error should raise the next event handler', function () {
            var throwingHandler = registerThrowingEventHandler(event);
            var handler = createEventHandler(event);
            event.on(throwingHandler);
            event.on(handler);
            var raisingAction = function () { return event.raiseSafe(); };
            chai_1.expect(raisingAction).to.not.throw();
            verifyEventHandlerWasRaisedOnce(throwingHandler);
            verifyEventHandlerWasRaisedOnce(handler);
        });
        it('unregistering event handler should not raise it', function () {
            var handler = createEventHandler(event);
            var handlerToUnregister = createEventHandler(event);
            event.on(handler);
            event.on(handlerToUnregister);
            event.off(handlerToUnregister);
            event.raiseSafe();
            verifyEventHandlerWasNeverRaised(handlerToUnregister);
        });
        it('unregistering event handler should raise the not ramoved event handlers', function () {
            var handler1 = createEventHandler(event);
            var handler2 = createEventHandler(event);
            var handlerToUnregister = createEventHandler(event);
            var handler3 = createEventHandler(event);
            var handler4 = createEventHandler(event);
            event.on(handler1);
            event.on(handler2);
            event.on(handlerToUnregister);
            event.on(handler3);
            event.on(handler4);
            event.off(handlerToUnregister);
            event.raiseSafe();
            verifyEventHandlerWasRaisedOnce(handler1);
            verifyEventHandlerWasRaisedOnce(handler2);
            verifyEventHandlerWasRaisedOnce(handler3);
            verifyEventHandlerWasRaisedOnce(handler4);
        });
    });
});
