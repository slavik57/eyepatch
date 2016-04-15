"use strict";
var chai_1 = require('chai');
var conditionalEventT_1 = require('./conditionalEventT');
describe('ConditionalEventT', function () {
    var event;
    beforeEach(function () {
        event = new conditionalEventT_1.ConditionalEventT();
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
    function createConditionWithReturnValue(returnValue) {
        var condition = (function (_data) {
            condition.actualDataThatWasCalledWith.push(_data);
            return returnValue;
        });
        condition.actualDataThatWasCalledWith = [];
        return condition;
    }
    function createThrowintCondition() {
        var condition = (function (_data) {
            condition.actualDataThatWasCalledWith.push(_data);
            throw 'some error';
        });
        condition.actualDataThatWasCalledWith = [];
        return condition;
    }
    function createData() {
        return {
            1: 'some data1',
            2: 'some data2'
        };
    }
    function verifyEventHandlerWasRaisedXTimes(times, eventHandler, data) {
        chai_1.expect(eventHandler.actualDataThatWasCalledWith.length).to.be.equal(times);
        for (var i = 0; i < times; i++) {
            chai_1.expect(eventHandler.actualDataThatWasCalledWith[i]).to.be.equal(data[i]);
        }
    }
    function verifyEventHandlerWasRaisedOnce(eventHandler, data) {
        verifyEventHandlerWasRaisedXTimes(1, eventHandler, [data]);
    }
    function verifyEventHandlerWasNeverRaised(eventHandler) {
        verifyEventHandlerWasRaisedXTimes(0, eventHandler, []);
    }
    function verifyConditionWasCalledXTimes(times, condition, data) {
        chai_1.expect(condition.actualDataThatWasCalledWith.length).to.be.equal(times);
        for (var i = 0; i < times; i++) {
            chai_1.expect(condition.actualDataThatWasCalledWith[i]).to.be.equal(data[i]);
        }
    }
    function verifyConditionWasCalledOnce(condition, data) {
        verifyConditionWasCalledXTimes(1, condition, [data]);
    }
    function verifyConditionWasNeverCalled(condition) {
        verifyConditionWasCalledXTimes(0, condition, []);
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
        describe('with condition', function () {
            it('raising should only call event handlers with truthy conditions', function () {
                var handler1 = createEventHandler();
                var handler2 = createEventHandler();
                var handler3 = createEventHandler();
                var trueCondition = createConditionWithReturnValue(true);
                var falseCondition = createConditionWithReturnValue(false);
                var data = createData();
                event.on(handler1, trueCondition);
                event.on(handler2, falseCondition);
                event.on(handler3, trueCondition);
                event.raise(data);
                verifyEventHandlerWasRaisedOnce(handler1, data);
                verifyEventHandlerWasNeverRaised(handler2);
                verifyEventHandlerWasRaisedOnce(handler3, data);
                verifyConditionWasCalledXTimes(2, trueCondition, [data, data]);
                verifyConditionWasCalledOnce(falseCondition, data);
            });
            it('raising should call the condition once', function () {
                var handler = createEventHandler();
                var trueCondition = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler, trueCondition);
                event.raise(data);
                verifyConditionWasCalledOnce(trueCondition, data);
            });
            it('registering twice with same event handler and same condition, raising, should raise once', function () {
                var handler = createEventHandler();
                var condition = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler, condition);
                event.on(handler, condition);
                event.raise(data);
                verifyEventHandlerWasRaisedOnce(handler, data);
                verifyConditionWasCalledOnce(condition, data);
            });
            it('registering twice with same event handler and different condition, raising, should raise twice', function () {
                var handler = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var condition2 = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.raise(data);
                verifyConditionWasCalledOnce(condition1, data);
                verifyConditionWasCalledOnce(condition2, data);
                verifyEventHandlerWasRaisedXTimes(2, handler, [data, data]);
            });
            it('registering event handler that throws an error should throw error', function () {
                var throwingHandler = createThrowingEventHandler();
                var condition = createConditionWithReturnValue(true);
                var data = createData();
                event.on(throwingHandler, condition);
                var raisingAction = function () { return event.raise(data); };
                chai_1.expect(raisingAction).to.throw();
                verifyEventHandlerWasRaisedOnce(throwingHandler, data);
                verifyConditionWasCalledOnce(condition, data);
            });
            it('registering event handler with condition that throws an error should throw error', function () {
                var eventHandler = createEventHandler();
                var throwingCondition = createThrowintCondition();
                var data = createData();
                event.on(eventHandler, throwingCondition);
                var raisingAction = function () { return event.raise(data); };
                chai_1.expect(raisingAction).to.throw();
                verifyConditionWasCalledOnce(throwingCondition, data);
                verifyEventHandlerWasNeverRaised(eventHandler);
            });
            it('registering event handler that throws an error should not raise the next event handler or condition', function () {
                var throwingHandler = createThrowingEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var handler = createEventHandler();
                var condition2 = createConditionWithReturnValue(true);
                var data = createData();
                event.on(throwingHandler, condition1);
                event.on(handler, condition2);
                var raisingAction = function () { return event.raise(data); };
                chai_1.expect(raisingAction).to.throw();
                verifyConditionWasCalledOnce(condition1, data);
                verifyEventHandlerWasRaisedOnce(throwingHandler, data);
                verifyConditionWasNeverCalled(condition2);
                verifyEventHandlerWasNeverRaised(handler);
            });
            it('registering event handler with condition that throws an error should not raise the next event handler or condition', function () {
                var handler1 = createThrowingEventHandler();
                var throwingCondition = createThrowintCondition();
                var handler2 = createEventHandler();
                var condition2 = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler1, throwingCondition);
                event.on(handler2, condition2);
                var raisingAction = function () { return event.raise(data); };
                chai_1.expect(raisingAction).to.throw();
                verifyConditionWasCalledOnce(throwingCondition, data);
                verifyEventHandlerWasNeverRaised(handler1);
                verifyConditionWasNeverCalled(condition2);
                verifyEventHandlerWasNeverRaised(handler2);
            });
            it('unregistering event handler should not raise it', function () {
                var handler = createEventHandler();
                var condition = createConditionWithReturnValue(true);
                var handlerToUnregister = createEventHandler();
                var conditionOfHandlerToUnregister = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler, condition);
                event.on(handlerToUnregister, conditionOfHandlerToUnregister);
                event.off(handlerToUnregister);
                event.raise(data);
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
                var data = createData();
                event.on(handler1, condition1);
                event.on(handler2, condition2);
                event.on(handlerToUnregister, conditionOfHandlerToUnregister);
                event.on(handler3, condition3);
                event.on(handler4, condition4);
                event.off(handlerToUnregister);
                event.raise(data);
                verifyEventHandlerWasRaisedOnce(handler1, data);
                verifyConditionWasCalledOnce(condition1, data);
                verifyEventHandlerWasRaisedOnce(handler2, data);
                verifyConditionWasCalledOnce(condition2, data);
                verifyEventHandlerWasRaisedOnce(handler3, data);
                verifyConditionWasCalledOnce(condition3, data);
                verifyEventHandlerWasRaisedOnce(handler4, data);
                verifyConditionWasCalledOnce(condition4, data);
                verifyConditionWasNeverCalled(conditionOfHandlerToUnregister);
                verifyEventHandlerWasNeverRaised(handlerToUnregister);
            });
            it('registering same handler with different conditions, unregister without condition, raise, should not raise', function () {
                var handler = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var condition2 = createConditionWithReturnValue(true);
                var condition3 = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.on(handler, condition3);
                event.off(handler);
                event.raise(data);
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
                var data = createData();
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.on(handler, condition3);
                event.off(handler, condition2);
                event.raise(data);
                verifyConditionWasCalledOnce(condition1, data);
                verifyConditionWasNeverCalled(condition2);
                verifyConditionWasCalledOnce(condition3, data);
                verifyEventHandlerWasRaisedXTimes(2, handler, [data, data]);
            });
        });
    });
    describe('raiseSafe', function () {
        describe('no condition', function () {
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
        describe('with condition', function () {
            it('raising should only call event handlers with truthy conditions', function () {
                var handler1 = createEventHandler();
                var handler2 = createEventHandler();
                var handler3 = createEventHandler();
                var trueCondition = createConditionWithReturnValue(true);
                var falseCondition = createConditionWithReturnValue(false);
                var data = createData();
                event.on(handler1, trueCondition);
                event.on(handler2, falseCondition);
                event.on(handler3, trueCondition);
                event.raiseSafe(data);
                verifyEventHandlerWasRaisedOnce(handler1, data);
                verifyEventHandlerWasNeverRaised(handler2);
                verifyEventHandlerWasRaisedOnce(handler3, data);
                verifyConditionWasCalledXTimes(2, trueCondition, [data, data]);
                verifyConditionWasCalledOnce(falseCondition, data);
            });
            it('raising should call the condition once', function () {
                var handler = createEventHandler();
                var trueCondition = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler, trueCondition);
                event.raiseSafe(data);
                verifyConditionWasCalledOnce(trueCondition, data);
            });
            it('registering twice with same event handler and same condition, raising, should raise once', function () {
                var handler = createEventHandler();
                var condition = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler, condition);
                event.on(handler, condition);
                event.raiseSafe(data);
                verifyEventHandlerWasRaisedOnce(handler, data);
                verifyConditionWasCalledOnce(condition, data);
            });
            it('registering twice with same event handler and different condition, raising, should raise twice', function () {
                var handler = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var condition2 = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.raiseSafe(data);
                verifyEventHandlerWasRaisedXTimes(2, handler, [data, data]);
                verifyConditionWasCalledOnce(condition1, data);
                verifyConditionWasCalledOnce(condition2, data);
            });
            it('registering event handler that throws an error should not throw error', function () {
                var throwingHandler = createThrowingEventHandler();
                var condition = createConditionWithReturnValue(true);
                var data = createData();
                event.on(throwingHandler, condition);
                var raisingAction = function () { return event.raiseSafe(data); };
                chai_1.expect(raisingAction).to.not.throw();
                verifyEventHandlerWasRaisedOnce(throwingHandler, data);
                verifyConditionWasCalledOnce(condition, data);
            });
            it('registering event handler with condition that throws an error should not throw error', function () {
                var eventHandler = createEventHandler();
                var throwingCondition = createThrowintCondition();
                var data = createData();
                event.on(eventHandler, throwingCondition);
                var raisingAction = function () { return event.raiseSafe(data); };
                chai_1.expect(raisingAction).to.not.throw();
                verifyConditionWasCalledOnce(throwingCondition, data);
                verifyEventHandlerWasNeverRaised(eventHandler);
            });
            it('registering event handler that throws an error should raise the next event handler or condition', function () {
                var throwingHandler = createThrowingEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var handler = createEventHandler();
                var condition2 = createConditionWithReturnValue(true);
                var data = createData();
                event.on(throwingHandler, condition1);
                event.on(handler, condition2);
                var raisingAction = function () { return event.raiseSafe(data); };
                chai_1.expect(raisingAction).to.not.throw();
                verifyConditionWasCalledOnce(condition1, data);
                verifyEventHandlerWasRaisedOnce(throwingHandler, data);
                verifyConditionWasCalledOnce(condition2, data);
                verifyEventHandlerWasRaisedOnce(handler, data);
            });
            it('registering event handler with condition that throws an error should raise the next event handler or condition', function () {
                var handler1 = createThrowingEventHandler();
                var throwingCondition = createThrowintCondition();
                var handler2 = createEventHandler();
                var condition2 = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler1, throwingCondition);
                event.on(handler2, condition2);
                var raisingAction = function () { return event.raiseSafe(data); };
                chai_1.expect(raisingAction).to.not.throw();
                verifyConditionWasCalledOnce(throwingCondition, data);
                verifyEventHandlerWasNeverRaised(handler1);
                verifyConditionWasCalledOnce(condition2, data);
                verifyEventHandlerWasRaisedOnce(handler2, data);
            });
            it('unregistering event handler should not raise it', function () {
                var handler = createEventHandler();
                var condition = createConditionWithReturnValue(true);
                var handlerToUnregister = createEventHandler();
                var conditionOfHandlerToUnregister = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler, condition);
                event.on(handlerToUnregister, conditionOfHandlerToUnregister);
                event.off(handlerToUnregister);
                event.raiseSafe(data);
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
                var data = createData();
                event.on(handler1, condition1);
                event.on(handler2, condition2);
                event.on(handlerToUnregister, conditionOfHandlerToUnregister);
                event.on(handler3, condition3);
                event.on(handler4, condition4);
                event.off(handlerToUnregister);
                event.raiseSafe(data);
                verifyEventHandlerWasRaisedOnce(handler1, data);
                verifyConditionWasCalledOnce(condition1, data);
                verifyEventHandlerWasRaisedOnce(handler2, data);
                verifyConditionWasCalledOnce(condition2, data);
                verifyEventHandlerWasRaisedOnce(handler3, data);
                verifyConditionWasCalledOnce(condition3, data);
                verifyEventHandlerWasRaisedOnce(handler4, data);
                verifyConditionWasCalledOnce(condition4, data);
                verifyConditionWasNeverCalled(conditionOfHandlerToUnregister);
                verifyEventHandlerWasNeverRaised(handlerToUnregister);
            });
            it('registering same handler with different conditions, unregister without condition, raise, should not raise', function () {
                var handler = createEventHandler();
                var condition1 = createConditionWithReturnValue(true);
                var condition2 = createConditionWithReturnValue(true);
                var condition3 = createConditionWithReturnValue(true);
                var data = createData();
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.on(handler, condition3);
                event.off(handler);
                event.raiseSafe(data);
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
                var data = createData();
                event.on(handler, condition1);
                event.on(handler, condition2);
                event.on(handler, condition3);
                event.off(handler, condition2);
                event.raiseSafe(data);
                verifyConditionWasCalledOnce(condition1, data);
                verifyConditionWasNeverCalled(condition2);
                verifyConditionWasCalledOnce(condition3, data);
                verifyEventHandlerWasRaisedXTimes(2, handler, [data, data]);
            });
        });
    });
});
