"use strict";
var chai_1 = require('chai');
var conditionalEvent_1 = require('./conditionalEvent');
describe('ConditionalEvent', function () {
    var event;
    beforeEach(function () {
        event = new conditionalEvent_1.ConditionalEvent();
    });
    function createEventHandler() {
        var eventHandler = (function () {
            eventHandler.numberOfTimesCalled++;
        });
        eventHandler.numberOfTimesCalled = 0;
        return eventHandler;
    }
    function createThrowingEventHandler() {
        var eventHandler = (function () {
            eventHandler.numberOfTimesCalled++;
            throw 'some error';
        });
        eventHandler.numberOfTimesCalled = 0;
        return eventHandler;
    }
    function createConditionWithReturnValue(returnValue) {
        var condition = (function () {
            condition.numberOfTimesCalled++;
            return returnValue;
        });
        condition.numberOfTimesCalled = 0;
        return condition;
    }
    function createThrowintCondition() {
        var condition = (function () {
            condition.numberOfTimesCalled++;
            throw 'some error';
        });
        condition.numberOfTimesCalled = 0;
        return condition;
    }
    function verifyEventHandlerWasRaisedXTimes(times, eventHandler) {
        chai_1.expect(eventHandler.numberOfTimesCalled).to.be.equal(times);
    }
    function verifyEventHandlerWasRaisedOnce(eventHandler) {
        verifyEventHandlerWasRaisedXTimes(1, eventHandler);
    }
    function verifyEventHandlerWasNeverRaised(eventHandler) {
        verifyEventHandlerWasRaisedXTimes(0, eventHandler);
    }
    function verifyConditionWasCalledXTimes(times, condition) {
        chai_1.expect(condition.numberOfTimesCalled).to.be.equal(times);
    }
    function verifyConditionWasCalledOnce(condition) {
        verifyConditionWasCalledXTimes(1, condition);
    }
    function verifyConditionWasNeverCalled(condition) {
        verifyConditionWasCalledXTimes(0, condition);
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
        it('registering same event with same condition twice should not throw error', function () {
            var handler = createEventHandler();
            var condition = createConditionWithReturnValue(true);
            var registeringAction = function () {
                event.on(handler, condition);
                event.on(handler, condition);
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
        describe('no condition', function () {
            it('raising unregistered event should not throw errors', function () {
                event.raise();
            });
            it('raising on registered event should raise event on all registratios', function () {
                var handler1 = createEventHandler();
                var handler2 = createEventHandler();
                var handler3 = createEventHandler();
                event.on(handler1);
                event.on(handler2);
                event.on(handler3);
                event.raise();
                verifyEventHandlerWasRaisedOnce(handler1);
                verifyEventHandlerWasRaisedOnce(handler2);
                verifyEventHandlerWasRaisedOnce(handler3);
            });
            it('registering twice with same event handler, raising, should raise once', function () {
                var handler = createEventHandler();
                event.on(handler);
                event.on(handler);
                event.raise();
                verifyEventHandlerWasRaisedOnce(handler);
            });
            it('registering event handler that throws an error should throw error', function () {
                var throwingHandler = createThrowingEventHandler();
                event.on(throwingHandler);
                var raisingAction = function () { return event.raise(); };
                chai_1.expect(raisingAction).to.throw();
                verifyEventHandlerWasRaisedOnce(throwingHandler);
            });
            it('registering event handler that throws an error should not raise the next event handler', function () {
                var throwingHandler = createThrowingEventHandler();
                var handler = createEventHandler();
                event.on(throwingHandler);
                event.on(handler);
                var raisingAction = function () { return event.raise(); };
                chai_1.expect(raisingAction).to.throw();
                verifyEventHandlerWasRaisedOnce(throwingHandler);
                verifyEventHandlerWasNeverRaised(handler);
            });
            it('unregistering event handler should not raise it', function () {
                var handler = createEventHandler();
                var handlerToUnregister = createEventHandler();
                event.on(handler);
                event.on(handlerToUnregister);
                event.off(handlerToUnregister);
                event.raise();
                verifyEventHandlerWasNeverRaised(handlerToUnregister);
            });
            it('unregistering event handler should raise the not ramoved event handlers', function () {
                var handler1 = createEventHandler();
                var handler2 = createEventHandler();
                var handlerToUnregister = createEventHandler();
                var handler3 = createEventHandler();
                var handler4 = createEventHandler();
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
                verifyEventHandlerWasNeverRaised(handlerToUnregister);
            });
        });
        describe('with condition', function () {
            it('raising should only call event handlers with truthy conditions', function () {
                var handler1 = createEventHandler();
                var handler2 = createEventHandler();
                var handler3 = createEventHandler();
                var trueCondition = createConditionWithReturnValue(true);
                var falseCondition = createConditionWithReturnValue(false);
                event.on(handler1, trueCondition);
                event.on(handler2, falseCondition);
                event.on(handler3, trueCondition);
                event.raise();
                verifyEventHandlerWasRaisedOnce(handler1);
                verifyEventHandlerWasNeverRaised(handler2);
                verifyEventHandlerWasRaisedOnce(handler3);
                verifyConditionWasCalledXTimes(2, trueCondition);
                verifyConditionWasCalledOnce(falseCondition);
            });
            it('raising should call the condition once', function () {
                var handler = createEventHandler();
                var trueCondition = createConditionWithReturnValue(true);
                event.on(handler, trueCondition);
                event.raise();
                verifyConditionWasCalledOnce(trueCondition);
            });
            it('registering twice with same event handler and same condition, raising, should raise once', function () {
                var handler = createEventHandler();
                var condition = createConditionWithReturnValue(true);
                event.on(handler, condition);
                event.on(handler, condition);
                event.raise();
                verifyEventHandlerWasRaisedOnce(handler);
                verifyConditionWasCalledOnce(condition);
            });
            it('registering twice with same event handler and different condition, raising, should raise twice', function () {
                var handler = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var condition2 = createConditionWithReturnValue(true);
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.raise();
                verifyConditionWasCalledOnce(condition1);
                verifyConditionWasCalledOnce(condition2);
                verifyEventHandlerWasRaisedXTimes(2, handler);
            });
            it('registering event handler that throws an error should throw error', function () {
                var throwingHandler = createThrowingEventHandler();
                var condition = createConditionWithReturnValue(true);
                event.on(throwingHandler, condition);
                var raisingAction = function () { return event.raise(); };
                chai_1.expect(raisingAction).to.throw();
                verifyEventHandlerWasRaisedOnce(throwingHandler);
                verifyConditionWasCalledOnce(condition);
            });
            it('registering event handler with condition that throws an error should throw error', function () {
                var eventHandler = createEventHandler();
                var throwingCondition = createThrowintCondition();
                event.on(eventHandler, throwingCondition);
                var raisingAction = function () { return event.raise(); };
                chai_1.expect(raisingAction).to.throw();
                verifyConditionWasCalledOnce(throwingCondition);
                verifyEventHandlerWasNeverRaised(eventHandler);
            });
            it('registering event handler that throws an error should not raise the next event handler or condition', function () {
                var throwingHandler = createThrowingEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var handler = createEventHandler();
                var condition2 = createConditionWithReturnValue(true);
                event.on(throwingHandler, condition1);
                event.on(handler, condition2);
                var raisingAction = function () { return event.raise(); };
                chai_1.expect(raisingAction).to.throw();
                verifyConditionWasCalledOnce(condition1);
                verifyEventHandlerWasRaisedOnce(throwingHandler);
                verifyConditionWasNeverCalled(condition2);
                verifyEventHandlerWasNeverRaised(handler);
            });
            it('registering event handler with condition that throws an error should not raise the next event handler or condition', function () {
                var handler1 = createThrowingEventHandler();
                var throwingCondition = createThrowintCondition();
                var handler2 = createEventHandler();
                var condition2 = createConditionWithReturnValue(true);
                event.on(handler1, throwingCondition);
                event.on(handler2, condition2);
                var raisingAction = function () { return event.raise(); };
                chai_1.expect(raisingAction).to.throw();
                verifyConditionWasCalledOnce(throwingCondition);
                verifyEventHandlerWasNeverRaised(handler1);
                verifyConditionWasNeverCalled(condition2);
                verifyEventHandlerWasNeverRaised(handler2);
            });
            it('unregistering event handler should not raise it', function () {
                var handler = createEventHandler();
                var condition = createConditionWithReturnValue(true);
                var handlerToUnregister = createEventHandler();
                var conditionOfHandlerToUnregister = createConditionWithReturnValue(true);
                event.on(handler, condition);
                event.on(handlerToUnregister, conditionOfHandlerToUnregister);
                event.off(handlerToUnregister);
                event.raise();
                verifyConditionWasNeverCalled(conditionOfHandlerToUnregister);
                verifyEventHandlerWasNeverRaised(handlerToUnregister);
            });
            it('unregistering event handler should raise the not ramoved event handlers', function () {
                var handler1 = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var handler2 = createEventHandler();
                var condition2 = createConditionWithReturnValue(true);
                var handlerToUnregister = createEventHandler();
                var conditionOfHandlerToUnregister = createConditionWithReturnValue(true);
                var handler3 = createEventHandler();
                var condition3 = createConditionWithReturnValue(true);
                var handler4 = createEventHandler();
                var condition4 = createConditionWithReturnValue(true);
                event.on(handler1, condition1);
                event.on(handler2, condition2);
                event.on(handlerToUnregister, conditionOfHandlerToUnregister);
                event.on(handler3, condition3);
                event.on(handler4, condition4);
                event.off(handlerToUnregister);
                event.raise();
                verifyEventHandlerWasRaisedOnce(handler1);
                verifyConditionWasCalledOnce(condition1);
                verifyEventHandlerWasRaisedOnce(handler2);
                verifyConditionWasCalledOnce(condition2);
                verifyEventHandlerWasRaisedOnce(handler3);
                verifyConditionWasCalledOnce(condition3);
                verifyEventHandlerWasRaisedOnce(handler4);
                verifyConditionWasCalledOnce(condition4);
                verifyConditionWasNeverCalled(conditionOfHandlerToUnregister);
                verifyEventHandlerWasNeverRaised(handlerToUnregister);
            });
            it('registering same handler with different conditions, unregister without condition, raise, should not raise', function () {
                var handler = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var condition2 = createConditionWithReturnValue(true);
                var condition3 = createConditionWithReturnValue(true);
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.on(handler, condition3);
                event.off(handler);
                event.raise();
                verifyConditionWasNeverCalled(condition1);
                verifyConditionWasNeverCalled(condition2);
                verifyConditionWasNeverCalled(condition3);
                verifyEventHandlerWasNeverRaised(handler);
            });
            it('registering same handler with different conditions, unregister with condition, raise, should raise correctly', function () {
                var handler = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var condition2 = createConditionWithReturnValue(true);
                var condition3 = createConditionWithReturnValue(true);
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.on(handler, condition3);
                event.off(handler, condition2);
                event.raise();
                verifyConditionWasCalledOnce(condition1);
                verifyConditionWasNeverCalled(condition2);
                verifyConditionWasCalledOnce(condition3);
                verifyEventHandlerWasRaisedXTimes(2, handler);
            });
        });
    });
    describe('raiseSafe', function () {
        describe('no condition', function () {
            it('raising unregistered event should not throw errors', function () {
                event.raiseSafe();
            });
            it('raising on registered event should raise event on all registratios', function () {
                var handler1 = createEventHandler();
                var handler2 = createEventHandler();
                var handler3 = createEventHandler();
                event.on(handler1);
                event.on(handler2);
                event.on(handler3);
                event.raiseSafe();
                verifyEventHandlerWasRaisedOnce(handler1);
                verifyEventHandlerWasRaisedOnce(handler2);
                verifyEventHandlerWasRaisedOnce(handler3);
            });
            it('registering twice with same event handler, raising, should raise once', function () {
                var handler = createEventHandler();
                event.on(handler);
                event.on(handler);
                event.raiseSafe();
                verifyEventHandlerWasRaisedOnce(handler);
            });
            it('registering event handler that throws an error should not throw error', function () {
                var throwingHandler = createThrowingEventHandler();
                event.on(throwingHandler);
                var raisingAction = function () { return event.raiseSafe(); };
                chai_1.expect(raisingAction).to.not.throw();
                verifyEventHandlerWasRaisedOnce(throwingHandler);
            });
            it('registering event handler that throws an error should raise the next event handler', function () {
                var throwingHandler = createThrowingEventHandler();
                var handler = createEventHandler();
                event.on(throwingHandler);
                event.on(handler);
                var raisingAction = function () { return event.raiseSafe(); };
                chai_1.expect(raisingAction).to.not.throw();
                verifyEventHandlerWasRaisedOnce(throwingHandler);
                verifyEventHandlerWasRaisedOnce(handler);
            });
            it('unregistering event handler should not raise it', function () {
                var handler = createEventHandler();
                var handlerToUnregister = createEventHandler();
                event.on(handler);
                event.on(handlerToUnregister);
                event.off(handlerToUnregister);
                event.raiseSafe();
                verifyEventHandlerWasNeverRaised(handlerToUnregister);
            });
            it('unregistering event handler should raise the not ramoved event handlers', function () {
                var handler1 = createEventHandler();
                var handler2 = createEventHandler();
                var handlerToUnregister = createEventHandler();
                var handler3 = createEventHandler();
                var handler4 = createEventHandler();
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
                verifyEventHandlerWasNeverRaised(handlerToUnregister);
            });
        });
        describe('with condition', function () {
            it('raising should only call event handlers with truthy conditions', function () {
                var handler1 = createEventHandler();
                var handler2 = createEventHandler();
                var handler3 = createEventHandler();
                var trueCondition = createConditionWithReturnValue(true);
                var falseCondition = createConditionWithReturnValue(false);
                event.on(handler1, trueCondition);
                event.on(handler2, falseCondition);
                event.on(handler3, trueCondition);
                event.raiseSafe();
                verifyEventHandlerWasRaisedOnce(handler1);
                verifyEventHandlerWasNeverRaised(handler2);
                verifyEventHandlerWasRaisedOnce(handler3);
                verifyConditionWasCalledXTimes(2, trueCondition);
                verifyConditionWasCalledOnce(falseCondition);
            });
            it('raising should call the condition once', function () {
                var handler = createEventHandler();
                var trueCondition = createConditionWithReturnValue(true);
                event.on(handler, trueCondition);
                event.raiseSafe();
                verifyConditionWasCalledOnce(trueCondition);
            });
            it('registering twice with same event handler and same condition, raising, should raise once', function () {
                var handler = createEventHandler();
                var condition = createConditionWithReturnValue(true);
                event.on(handler, condition);
                event.on(handler, condition);
                event.raiseSafe();
                verifyEventHandlerWasRaisedOnce(handler);
                verifyConditionWasCalledOnce(condition);
            });
            it('registering twice with same event handler and different condition, raising, should raise twice', function () {
                var handler = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var condition2 = createConditionWithReturnValue(true);
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.raiseSafe();
                verifyEventHandlerWasRaisedXTimes(2, handler);
                verifyConditionWasCalledOnce(condition1);
                verifyConditionWasCalledOnce(condition2);
            });
            it('registering event handler that throws an error should not throw error', function () {
                var throwingHandler = createThrowingEventHandler();
                var condition = createConditionWithReturnValue(true);
                event.on(throwingHandler, condition);
                var raisingAction = function () { return event.raiseSafe(); };
                chai_1.expect(raisingAction).to.not.throw();
                verifyEventHandlerWasRaisedOnce(throwingHandler);
                verifyConditionWasCalledOnce(condition);
            });
            it('registering event handler with condition that throws an error should not throw error', function () {
                var eventHandler = createEventHandler();
                var throwingCondition = createThrowintCondition();
                event.on(eventHandler, throwingCondition);
                var raisingAction = function () { return event.raiseSafe(); };
                chai_1.expect(raisingAction).to.not.throw();
                verifyConditionWasCalledOnce(throwingCondition);
                verifyEventHandlerWasNeverRaised(eventHandler);
            });
            it('registering event handler that throws an error should raise the next event handler or condition', function () {
                var throwingHandler = createThrowingEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var handler = createEventHandler();
                var condition2 = createConditionWithReturnValue(true);
                event.on(throwingHandler, condition1);
                event.on(handler, condition2);
                var raisingAction = function () { return event.raiseSafe(); };
                chai_1.expect(raisingAction).to.not.throw();
                verifyConditionWasCalledOnce(condition1);
                verifyEventHandlerWasRaisedOnce(throwingHandler);
                verifyConditionWasCalledOnce(condition2);
                verifyEventHandlerWasRaisedOnce(handler);
            });
            it('registering event handler with condition that throws an error should raise the next event handler or condition', function () {
                var handler1 = createThrowingEventHandler();
                var throwingCondition = createThrowintCondition();
                var handler2 = createEventHandler();
                var condition2 = createConditionWithReturnValue(true);
                event.on(handler1, throwingCondition);
                event.on(handler2, condition2);
                var raisingAction = function () { return event.raiseSafe(); };
                chai_1.expect(raisingAction).to.not.throw();
                verifyConditionWasCalledOnce(throwingCondition);
                verifyEventHandlerWasNeverRaised(handler1);
                verifyConditionWasCalledOnce(condition2);
                verifyEventHandlerWasRaisedOnce(handler2);
            });
            it('unregistering event handler should not raise it', function () {
                var handler = createEventHandler();
                var condition = createConditionWithReturnValue(true);
                var handlerToUnregister = createEventHandler();
                var conditionOfHandlerToUnregister = createConditionWithReturnValue(true);
                event.on(handler, condition);
                event.on(handlerToUnregister, conditionOfHandlerToUnregister);
                event.off(handlerToUnregister);
                event.raiseSafe();
                verifyConditionWasNeverCalled(conditionOfHandlerToUnregister);
                verifyEventHandlerWasNeverRaised(handlerToUnregister);
            });
            it('unregistering event handler should raise the not ramoved event handlers', function () {
                var handler1 = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var handler2 = createEventHandler();
                var condition2 = createConditionWithReturnValue(true);
                var handlerToUnregister = createEventHandler();
                var conditionOfHandlerToUnregister = createConditionWithReturnValue(true);
                var handler3 = createEventHandler();
                var condition3 = createConditionWithReturnValue(true);
                var handler4 = createEventHandler();
                var condition4 = createConditionWithReturnValue(true);
                event.on(handler1, condition1);
                event.on(handler2, condition2);
                event.on(handlerToUnregister, conditionOfHandlerToUnregister);
                event.on(handler3, condition3);
                event.on(handler4, condition4);
                event.off(handlerToUnregister);
                event.raiseSafe();
                verifyEventHandlerWasRaisedOnce(handler1);
                verifyConditionWasCalledOnce(condition1);
                verifyEventHandlerWasRaisedOnce(handler2);
                verifyConditionWasCalledOnce(condition2);
                verifyEventHandlerWasRaisedOnce(handler3);
                verifyConditionWasCalledOnce(condition3);
                verifyEventHandlerWasRaisedOnce(handler4);
                verifyConditionWasCalledOnce(condition4);
                verifyConditionWasNeverCalled(conditionOfHandlerToUnregister);
                verifyEventHandlerWasNeverRaised(handlerToUnregister);
            });
            it('registering same handler with different conditions, unregister without condition, raise, should not raise', function () {
                var handler = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var condition2 = createConditionWithReturnValue(true);
                var condition3 = createConditionWithReturnValue(true);
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.on(handler, condition3);
                event.off(handler);
                event.raiseSafe();
                verifyConditionWasNeverCalled(condition1);
                verifyConditionWasNeverCalled(condition2);
                verifyConditionWasNeverCalled(condition3);
                verifyEventHandlerWasNeverRaised(handler);
            });
            it('registering same handler with different conditions, unregister with condition, raise, should raise correctly', function () {
                var handler = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var condition2 = createConditionWithReturnValue(true);
                var condition3 = createConditionWithReturnValue(true);
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.on(handler, condition3);
                event.off(handler, condition2);
                event.raiseSafe();
                verifyConditionWasCalledOnce(condition1);
                verifyConditionWasNeverCalled(condition2);
                verifyConditionWasCalledOnce(condition3);
                verifyEventHandlerWasRaisedXTimes(2, handler);
            });
        });
    });
});
