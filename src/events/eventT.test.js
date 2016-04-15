"use strict";
var chai_1 = require('chai');
var eventT_1 = require('./eventT');
describe('EventT', function () {
    var event;
    beforeEach(function () {
        event = new eventT_1.EventT();
    });
    function createEventHandler() {
        var eventHandler = (function (_data) {
            eventHandler.actualDataThatWasCalledWith.push(_data);
        });
        eventHandler.actualDataThatWasCalledWith = [];
        return eventHandler;
    }
    function createThrowingEventHandler() {
        var eventHandler = (function (_data) {
            eventHandler.actualDataThatWasCalledWith.push(_data);
            throw 'some error';
        });
        eventHandler.actualDataThatWasCalledWith = [];
        return eventHandler;
    }
    function createData() {
        return {
            1: 'some data1',
            2: 'some data2'
        };
    }
    function verifyEventHandlerWasRaisedOnce(eventHandler, data) {
        chai_1.expect(eventHandler.actualDataThatWasCalledWith.length).to.be.equal(1);
        chai_1.expect(eventHandler.actualDataThatWasCalledWith[0]).to.be.equal(data);
    }
    function verifyEventHandlerWasNeverRaised(eventHandler) {
        chai_1.expect(eventHandler.actualDataThatWasCalledWith.length).to.be.equal(0);
    }
    describe('on', function () {
        it('registering same event twice should not throw error', function () {
            var handler = createEventHandler();
            var registeringAction = function () {
                event.on(handler);
                event.on(handler);
            };
            chai_1.expect(registeringAction).to.not.throw();
        });
    });
    describe('off', function () {
        it('unregistering not registered event should not throw error', function () {
            var handler = createEventHandler();
            var unregisteringAction = function () {
                event.off(handler);
            };
            chai_1.expect(unregisteringAction).to.not.throw();
        });
    });
    describe('raise', function () {
        it('raising unregistered event should not throw errors', function () {
            event.raise({});
        });
        it('raising on registered event should raise event on all registratios', function () {
            var handler1 = createEventHandler();
            var handler2 = createEventHandler();
            var handler3 = createEventHandler();
            var data = createData();
            event.on(handler1);
            event.on(handler2);
            event.on(handler3);
            event.raise(data);
            verifyEventHandlerWasRaisedOnce(handler1, data);
            verifyEventHandlerWasRaisedOnce(handler2, data);
            verifyEventHandlerWasRaisedOnce(handler3, data);
        });
        it('registering twice with same event handler, raising, should raise once', function () {
            var handler = createEventHandler();
            var data = createData();
            event.on(handler);
            event.on(handler);
            event.raise(data);
            verifyEventHandlerWasRaisedOnce(handler, data);
        });
        it('registering event handler that throws an error should throw error', function () {
            var throwingHandler = createThrowingEventHandler();
            var data = createData();
            event.on(throwingHandler);
            var raisingAction = function () { return event.raise(data); };
            chai_1.expect(raisingAction).to.throw();
            verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        });
        it('registering event handler that throws an error should not raise the next event handler', function () {
            var throwingHandler = createThrowingEventHandler();
            var handler = createEventHandler();
            var data = createData();
            event.on(throwingHandler);
            event.on(handler);
            var raisingAction = function () { return event.raise(data); };
            chai_1.expect(raisingAction).to.throw();
            verifyEventHandlerWasRaisedOnce(throwingHandler, data);
            verifyEventHandlerWasNeverRaised(handler);
        });
        it('unregistering event handler should not raise it', function () {
            var handler = createEventHandler();
            var handlerToUnregister = createEventHandler();
            var data = createData();
            event.on(handler);
            event.on(handlerToUnregister);
            event.off(handlerToUnregister);
            event.raise(data);
            verifyEventHandlerWasNeverRaised(handlerToUnregister);
        });
        it('unregistering event handler should raise the not ramoved event handlers', function () {
            var handler1 = createEventHandler();
            var handler2 = createEventHandler();
            var handlerToUnregister = createEventHandler();
            var handler3 = createEventHandler();
            var handler4 = createEventHandler();
            var data = createData();
            event.on(handler1);
            event.on(handler2);
            event.on(handlerToUnregister);
            event.on(handler3);
            event.on(handler4);
            event.off(handlerToUnregister);
            event.raise(data);
            verifyEventHandlerWasRaisedOnce(handler1, data);
            verifyEventHandlerWasRaisedOnce(handler2, data);
            verifyEventHandlerWasRaisedOnce(handler3, data);
            verifyEventHandlerWasRaisedOnce(handler4, data);
            verifyEventHandlerWasNeverRaised(handlerToUnregister);
        });
    });
    describe('raiseSafe', function () {
        it('raising unregistered event should not throw errors', function () {
            event.raiseSafe({});
        });
        it('raising on registered event should raise event on all registratios', function () {
            var handler1 = createEventHandler();
            var handler2 = createEventHandler();
            var handler3 = createEventHandler();
            var data = createData();
            event.on(handler1);
            event.on(handler2);
            event.on(handler3);
            event.raiseSafe(data);
            verifyEventHandlerWasRaisedOnce(handler1, data);
            verifyEventHandlerWasRaisedOnce(handler2, data);
            verifyEventHandlerWasRaisedOnce(handler3, data);
        });
        it('registering twice with same event handler, raising, should raise once', function () {
            var handler = createEventHandler();
            var data = createData();
            event.on(handler);
            event.on(handler);
            event.raiseSafe(data);
            verifyEventHandlerWasRaisedOnce(handler, data);
        });
        it('registering event handler that throws an error should not throw error', function () {
            var throwingHandler = createThrowingEventHandler();
            var data = createData();
            event.on(throwingHandler);
            var raisingAction = function () { return event.raiseSafe(data); };
            chai_1.expect(raisingAction).to.not.throw();
            verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        });
        it('registering event handler that throws an error should raise the next event handler', function () {
            var throwingHandler = createThrowingEventHandler();
            var handler = createEventHandler();
            var data = createData();
            event.on(throwingHandler);
            event.on(handler);
            var raisingAction = function () { return event.raiseSafe(data); };
            chai_1.expect(raisingAction).to.not.throw();
            verifyEventHandlerWasRaisedOnce(throwingHandler, data);
            verifyEventHandlerWasRaisedOnce(handler, data);
        });
        it('unregistering event handler should not raise it', function () {
            var handler = createEventHandler();
            var handlerToUnregister = createEventHandler();
            var data = createData();
            event.on(handler);
            event.on(handlerToUnregister);
            event.off(handlerToUnregister);
            event.raiseSafe(data);
            verifyEventHandlerWasNeverRaised(handlerToUnregister);
        });
        it('unregistering event handler should raise the not ramoved event handlers', function () {
            var handler1 = createEventHandler();
            var handler2 = createEventHandler();
            var handlerToUnregister = createEventHandler();
            var handler3 = createEventHandler();
            var handler4 = createEventHandler();
            var data = createData();
            event.on(handler1);
            event.on(handler2);
            event.on(handlerToUnregister);
            event.on(handler3);
            event.on(handler4);
            event.off(handlerToUnregister);
            event.raiseSafe(data);
            verifyEventHandlerWasRaisedOnce(handler1, data);
            verifyEventHandlerWasRaisedOnce(handler2, data);
            verifyEventHandlerWasRaisedOnce(handler3, data);
            verifyEventHandlerWasRaisedOnce(handler4, data);
            verifyEventHandlerWasNeverRaised(handlerToUnregister);
        });
    });
});
