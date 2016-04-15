import {expect} from 'chai';
import {ICondition} from './interfaces/iCondition';
import {IEventHandler} from './interfaces/iEventHandler';
import {IConditionalEvent} from './interfaces/iConditionalEvent';
import {ConditionalEvent} from './conditionalEvent';

interface ITestEventHandler extends IEventHandler {
  numberOfTimesCalled: number;
}

interface ITestCondition extends ICondition {
  numberOfTimesCalled: number;
}

describe('ConditionalEvent', () => {
  var event: ConditionalEvent;

  beforeEach(() => {
    event = new ConditionalEvent();
  });

  function createEventHandler(): ITestEventHandler {
    var eventHandler: ITestEventHandler = <any>(() => {
      eventHandler.numberOfTimesCalled++;
    });

    eventHandler.numberOfTimesCalled = 0;

    return eventHandler;
  }

  function createThrowingEventHandler<T>(): ITestEventHandler {
    var eventHandler: ITestEventHandler = <any>(() => {
      eventHandler.numberOfTimesCalled++;

      throw 'some error';
    });

    eventHandler.numberOfTimesCalled = 0;

    return eventHandler;
  }

  function createConditionWithReturnValue<T>(returnValue: boolean): ITestCondition {
    var condition: ITestCondition = <any>(() => {
      condition.numberOfTimesCalled++;

      return returnValue;
    });

    condition.numberOfTimesCalled = 0;

    return condition;
  }

  function createThrowintCondition<T>(): ITestCondition {
    var condition: ITestCondition = <any>(() => {
      condition.numberOfTimesCalled++;

      throw 'some error';
    });

    condition.numberOfTimesCalled = 0;

    return condition;
  }

  function verifyEventHandlerWasRaisedXTimes(times: number, eventHandler: ITestEventHandler): void {
    expect(eventHandler.numberOfTimesCalled).to.be.equal(times);
  }

  function verifyEventHandlerWasRaisedOnce(eventHandler: ITestEventHandler): void {
    verifyEventHandlerWasRaisedXTimes(1, eventHandler);
  }

  function verifyEventHandlerWasNeverRaised(eventHandler: ITestEventHandler): void {
    verifyEventHandlerWasRaisedXTimes(0, eventHandler);
  }

  function verifyConditionWasCalledXTimes(times: number, condition: ITestCondition): void {
    expect(condition.numberOfTimesCalled).to.be.equal(times);
  }

  function verifyConditionWasCalledOnce(condition: ITestCondition): void {
    verifyConditionWasCalledXTimes(1, condition);
  }

  function verifyConditionWasNeverCalled<T>(condition: ITestCondition): void {
    verifyConditionWasCalledXTimes(0, condition);
  }

  describe('on', () => {
    it('registering same event twice should not throw error', () => {
      // Arrange
      var handler = createEventHandler();

      // Act
      var registeringAction = () => {
        event.on(handler);
        event.on(handler);
      }

      // Assert
      expect(registeringAction).to.not.throw();
    })

    it('registering same event with same condition twice should not throw error', () => {
      // Arrange
      var handler = createEventHandler();
      var condition = createConditionWithReturnValue(true);

      // Act
      var registeringAction = () => {
        event.on(handler, condition);
        event.on(handler, condition);
      }

      // Assert
      expect(registeringAction).to.not.throw();
    })
  });

  describe('off', () => {
    it('unregistering not registered event should not throw error', () => {
      // Arrange
      var handler = createEventHandler();

      // Act
      var unregisteringAction = () => {
        event.off(handler);
      }

      // Assert
      expect(unregisteringAction).to.not.throw();
    });
  });

  describe('raise', () => {
    describe('no condition', () => {
      it('raising unregistered event should not throw errors', () => {
        event.raise();
      });

      it('raising on registered event should raise event on all registratios', () => {
        // Arrange
        var handler1 = createEventHandler();
        var handler2 = createEventHandler();
        var handler3 = createEventHandler();

        // Act
        event.on(handler1);
        event.on(handler2);
        event.on(handler3);
        event.raise();

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1);
        verifyEventHandlerWasRaisedOnce(handler2);
        verifyEventHandlerWasRaisedOnce(handler3);
      });

      it('registering twice with same event handler, raising, should raise once', () => {
        // Arrange
        var handler = createEventHandler();

        // Act
        event.on(handler);
        event.on(handler);
        event.raise();

        // Assert
        verifyEventHandlerWasRaisedOnce(handler);
      });

      it('registering event handler that throws an error should throw error', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();

        // Act
        event.on(throwingHandler);
        var raisingAction = () => event.raise();

        // Assert
        expect(raisingAction).to.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler);
      });

      it('registering event handler that throws an error should not raise the next event handler', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var handler = createEventHandler();

        // Act
        event.on(throwingHandler);
        event.on(handler);
        var raisingAction = () => event.raise();

        // Assert
        expect(raisingAction).to.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler);
        verifyEventHandlerWasNeverRaised(handler);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        var handler = createEventHandler();
        var handlerToUnregister = createEventHandler();

        event.on(handler);
        event.on(handlerToUnregister);

        // Act
        event.off(handlerToUnregister);
        event.raise();

        // Assert
        verifyEventHandlerWasNeverRaised(handlerToUnregister);
      });

      it('unregistering event handler should raise the not ramoved event handlers', () => {
        // Arrange
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

        // Act
        event.off(handlerToUnregister);
        event.raise();

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1);
        verifyEventHandlerWasRaisedOnce(handler2);
        verifyEventHandlerWasRaisedOnce(handler3);
        verifyEventHandlerWasRaisedOnce(handler4);
        verifyEventHandlerWasNeverRaised(handlerToUnregister);
      });
    });

    describe('with condition', () => {
      it('raising should only call event handlers with truthy conditions', () => {
        // Arrange
        var handler1 = createEventHandler();
        var handler2 = createEventHandler();
        var handler3 = createEventHandler();

        var trueCondition = createConditionWithReturnValue(true);
        var falseCondition = createConditionWithReturnValue(false);

        // Act
        event.on(handler1, trueCondition);
        event.on(handler2, falseCondition);
        event.on(handler3, trueCondition);
        event.raise();

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1);
        verifyEventHandlerWasNeverRaised(handler2);
        verifyEventHandlerWasRaisedOnce(handler3);

        verifyConditionWasCalledXTimes(2, trueCondition);
        verifyConditionWasCalledOnce(falseCondition);
      });

      it('raising should call the condition once', () => {
        // Arrange
        var handler = createEventHandler();

        var trueCondition = createConditionWithReturnValue(true);

        // Act
        event.on(handler, trueCondition);
        event.raise();

        // Assert
        verifyConditionWasCalledOnce(trueCondition);
      });

      it('registering twice with same event handler and same condition, raising, should raise once', () => {
        // Arrange
        var handler = createEventHandler();
        var condition = createConditionWithReturnValue(true);

        // Act
        event.on(handler, condition);
        event.on(handler, condition);
        event.raise();

        // Assert
        verifyEventHandlerWasRaisedOnce(handler);
        verifyConditionWasCalledOnce(condition);
      });

      it('registering twice with same event handler and different condition, raising, should raise twice', () => {
        // Arrange
        var handler = createEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var condition2 = createConditionWithReturnValue(true);

        // Act
        event.on(handler, condition1);
        event.on(handler, condition2);
        event.raise();

        // Assert
        verifyConditionWasCalledOnce(condition1);
        verifyConditionWasCalledOnce(condition2);
        verifyEventHandlerWasRaisedXTimes(2, handler);
      });

      it('registering event handler that throws an error should throw error', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var condition = createConditionWithReturnValue(true);

        // Act
        event.on(throwingHandler, condition);
        var raisingAction = () => event.raise();

        // Assert
        expect(raisingAction).to.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler);
        verifyConditionWasCalledOnce(condition);
      });

      it('registering event handler with condition that throws an error should throw error', () => {
        // Arrange
        var eventHandler = createEventHandler();
        var throwingCondition = createThrowintCondition();

        // Act
        event.on(eventHandler, throwingCondition);
        var raisingAction = () => event.raise();

        // Assert
        expect(raisingAction).to.throw();
        verifyConditionWasCalledOnce(throwingCondition);
        verifyEventHandlerWasNeverRaised(eventHandler);
      });

      it('registering event handler that throws an error should not raise the next event handler or condition', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var handler = createEventHandler();
        var condition2 = createConditionWithReturnValue(true);

        // Act
        event.on(throwingHandler, condition1);
        event.on(handler, condition2);
        var raisingAction = () => event.raise();

        // Assert
        expect(raisingAction).to.throw();
        verifyConditionWasCalledOnce(condition1);
        verifyEventHandlerWasRaisedOnce(throwingHandler);
        verifyConditionWasNeverCalled(condition2);
        verifyEventHandlerWasNeverRaised(handler);
      });

      it('registering event handler with condition that throws an error should not raise the next event handler or condition', () => {
        // Arrange
        var handler1 = createThrowingEventHandler();
        var throwingCondition = createThrowintCondition();
        var handler2 = createEventHandler();
        var condition2 = createConditionWithReturnValue(true);

        // Act
        event.on(handler1, throwingCondition);
        event.on(handler2, condition2);
        var raisingAction = () => event.raise();

        // Assert
        expect(raisingAction).to.throw();
        verifyConditionWasCalledOnce(throwingCondition);
        verifyEventHandlerWasNeverRaised(handler1);
        verifyConditionWasNeverCalled(condition2);
        verifyEventHandlerWasNeverRaised(handler2);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        var handler = createEventHandler();
        var condition = createConditionWithReturnValue(true);
        var handlerToUnregister = createEventHandler();
        var conditionOfHandlerToUnregister = createConditionWithReturnValue(true);

        event.on(handler, condition);
        event.on(handlerToUnregister, conditionOfHandlerToUnregister);

        // Act
        event.off(handlerToUnregister);
        event.raise();

        // Assert
        verifyConditionWasNeverCalled(conditionOfHandlerToUnregister);
        verifyEventHandlerWasNeverRaised(handlerToUnregister);
      });

      it('unregistering event handler should raise the not ramoved event handlers', () => {
        // Arrange
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

        // Act
        event.off(handlerToUnregister);
        event.raise();

        // Assert
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

      it('registering same handler with different conditions, unregister without condition, raise, should not raise', () => {
        // Arrange
        var handler = createEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var condition2 = createConditionWithReturnValue(true);
        var condition3 = createConditionWithReturnValue(true);

        event.on(handler, condition1);
        event.on(handler, condition2);
        event.on(handler, condition3);

        // Act
        event.off(handler);
        event.raise();

        // Assert
        verifyConditionWasNeverCalled(condition1);
        verifyConditionWasNeverCalled(condition2);
        verifyConditionWasNeverCalled(condition3);
        verifyEventHandlerWasNeverRaised(handler);
      });

      it('registering same handler with different conditions, unregister with condition, raise, should raise correctly', () => {
        // Arrange
        var handler = createEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var condition2 = createConditionWithReturnValue(true);
        var condition3 = createConditionWithReturnValue(true);

        event.on(handler, condition1);
        event.on(handler, condition2);
        event.on(handler, condition3);

        // Act
        event.off(handler, condition2);
        event.raise();

        // Assert
        verifyConditionWasCalledOnce(condition1);
        verifyConditionWasNeverCalled(condition2);
        verifyConditionWasCalledOnce(condition3);
        verifyEventHandlerWasRaisedXTimes(2, handler);
      });
    });
  });

  describe('raiseSafe', () => {
    describe('no condition', () => {
      it('raising unregistered event should not throw errors', () => {
        event.raiseSafe();
      });

      it('raising on registered event should raise event on all registratios', () => {
        // Arrange
        var handler1 = createEventHandler();
        var handler2 = createEventHandler();
        var handler3 = createEventHandler();

        // Act
        event.on(handler1);
        event.on(handler2);
        event.on(handler3);
        event.raiseSafe();

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1);
        verifyEventHandlerWasRaisedOnce(handler2);
        verifyEventHandlerWasRaisedOnce(handler3);
      });

      it('registering twice with same event handler, raising, should raise once', () => {
        // Arrange
        var handler = createEventHandler();

        // Act
        event.on(handler);
        event.on(handler);
        event.raiseSafe();

        // Assert
        verifyEventHandlerWasRaisedOnce(handler);
      });

      it('registering event handler that throws an error should not throw error', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();

        // Act
        event.on(throwingHandler);
        var raisingAction = () => event.raiseSafe();

        // Assert
        expect(raisingAction).to.not.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler);
      });

      it('registering event handler that throws an error should raise the next event handler', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var handler = createEventHandler();

        // Act
        event.on(throwingHandler);
        event.on(handler);
        var raisingAction = () => event.raiseSafe();

        // Assert
        expect(raisingAction).to.not.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler);
        verifyEventHandlerWasRaisedOnce(handler);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        var handler = createEventHandler();
        var handlerToUnregister = createEventHandler();

        event.on(handler);
        event.on(handlerToUnregister);

        // Act
        event.off(handlerToUnregister);
        event.raiseSafe();

        // Assert
        verifyEventHandlerWasNeverRaised(handlerToUnregister);
      });

      it('unregistering event handler should raise the not ramoved event handlers', () => {
        // Arrange
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

        // Act
        event.off(handlerToUnregister);
        event.raiseSafe();

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1);
        verifyEventHandlerWasRaisedOnce(handler2);
        verifyEventHandlerWasRaisedOnce(handler3);
        verifyEventHandlerWasRaisedOnce(handler4);
        verifyEventHandlerWasNeverRaised(handlerToUnregister);
      });
    });

    describe('with condition', () => {
      it('raising should only call event handlers with truthy conditions', () => {
        // Arrange
        var handler1 = createEventHandler();
        var handler2 = createEventHandler();
        var handler3 = createEventHandler();

        var trueCondition = createConditionWithReturnValue(true);
        var falseCondition = createConditionWithReturnValue(false);

        // Act
        event.on(handler1, trueCondition);
        event.on(handler2, falseCondition);
        event.on(handler3, trueCondition);
        event.raiseSafe();

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1);
        verifyEventHandlerWasNeverRaised(handler2);
        verifyEventHandlerWasRaisedOnce(handler3);

        verifyConditionWasCalledXTimes(2, trueCondition);
        verifyConditionWasCalledOnce(falseCondition);
      });

      it('raising should call the condition once', () => {
        // Arrange
        var handler = createEventHandler();

        var trueCondition = createConditionWithReturnValue(true);

        // Act
        event.on(handler, trueCondition);
        event.raiseSafe();

        // Assert
        verifyConditionWasCalledOnce(trueCondition);
      });

      it('registering twice with same event handler and same condition, raising, should raise once', () => {
        // Arrange
        var handler = createEventHandler();
        var condition = createConditionWithReturnValue(true);

        // Act
        event.on(handler, condition);
        event.on(handler, condition);
        event.raiseSafe();

        // Assert
        verifyEventHandlerWasRaisedOnce(handler);
        verifyConditionWasCalledOnce(condition);
      });

      it('registering twice with same event handler and different condition, raising, should raise twice', () => {
        // Arrange
        var handler = createEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var condition2 = createConditionWithReturnValue(true);

        // Act
        event.on(handler, condition1);
        event.on(handler, condition2);
        event.raiseSafe();

        // Assert
        verifyEventHandlerWasRaisedXTimes(2, handler);
        verifyConditionWasCalledOnce(condition1);
        verifyConditionWasCalledOnce(condition2);
      });

      it('registering event handler that throws an error should not throw error', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var condition = createConditionWithReturnValue(true);

        // Act
        event.on(throwingHandler, condition);
        var raisingAction = () => event.raiseSafe();

        // Assert
        expect(raisingAction).to.not.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler);
        verifyConditionWasCalledOnce(condition);
      });

      it('registering event handler with condition that throws an error should not throw error', () => {
        // Arrange
        var eventHandler = createEventHandler();
        var throwingCondition = createThrowintCondition();

        // Act
        event.on(eventHandler, throwingCondition);
        var raisingAction = () => event.raiseSafe();

        // Assert
        expect(raisingAction).to.not.throw();
        verifyConditionWasCalledOnce(throwingCondition);
        verifyEventHandlerWasNeverRaised(eventHandler);
      });

      it('registering event handler that throws an error should raise the next event handler or condition', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var handler = createEventHandler();
        var condition2 = createConditionWithReturnValue(true);

        // Act
        event.on(throwingHandler, condition1);
        event.on(handler, condition2);
        var raisingAction = () => event.raiseSafe();

        // Assert
        expect(raisingAction).to.not.throw();
        verifyConditionWasCalledOnce(condition1);
        verifyEventHandlerWasRaisedOnce(throwingHandler);
        verifyConditionWasCalledOnce(condition2);
        verifyEventHandlerWasRaisedOnce(handler);
      });

      it('registering event handler with condition that throws an error should raise the next event handler or condition', () => {
        // Arrange
        var handler1 = createThrowingEventHandler();
        var throwingCondition = createThrowintCondition();
        var handler2 = createEventHandler();
        var condition2 = createConditionWithReturnValue(true);

        // Act
        event.on(handler1, throwingCondition);
        event.on(handler2, condition2);
        var raisingAction = () => event.raiseSafe();

        // Assert
        expect(raisingAction).to.not.throw();
        verifyConditionWasCalledOnce(throwingCondition);
        verifyEventHandlerWasNeverRaised(handler1);
        verifyConditionWasCalledOnce(condition2);
        verifyEventHandlerWasRaisedOnce(handler2);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        var handler = createEventHandler();
        var condition = createConditionWithReturnValue(true);
        var handlerToUnregister = createEventHandler();
        var conditionOfHandlerToUnregister = createConditionWithReturnValue(true);

        event.on(handler, condition);
        event.on(handlerToUnregister, conditionOfHandlerToUnregister);

        // Act
        event.off(handlerToUnregister);
        event.raiseSafe();

        // Assert
        verifyConditionWasNeverCalled(conditionOfHandlerToUnregister);
        verifyEventHandlerWasNeverRaised(handlerToUnregister);
      });

      it('unregistering event handler should raise the not ramoved event handlers', () => {
        // Arrange
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

        // Act
        event.off(handlerToUnregister);
        event.raiseSafe();

        // Assert
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

      it('registering same handler with different conditions, unregister without condition, raise, should not raise', () => {
        // Arrange
        var handler = createEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var condition2 = createConditionWithReturnValue(true);
        var condition3 = createConditionWithReturnValue(true);

        event.on(handler, condition1);
        event.on(handler, condition2);
        event.on(handler, condition3);

        // Act
        event.off(handler);
        event.raiseSafe();

        // Assert
        verifyConditionWasNeverCalled(condition1);
        verifyConditionWasNeverCalled(condition2);
        verifyConditionWasNeverCalled(condition3);
        verifyEventHandlerWasNeverRaised(handler);
      });

      it('registering same handler with different conditions, unregister with condition, raise, should raise correctly', () => {
        // Arrange
        var handler = createEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var condition2 = createConditionWithReturnValue(true);
        var condition3 = createConditionWithReturnValue(true);

        event.on(handler, condition1);
        event.on(handler, condition2);
        event.on(handler, condition3);

        // Act
        event.off(handler, condition2);
        event.raiseSafe();

        // Assert
        verifyConditionWasCalledOnce(condition1);
        verifyConditionWasNeverCalled(condition2);
        verifyConditionWasCalledOnce(condition3);
        verifyEventHandlerWasRaisedXTimes(2, handler);
      });
    });
  });
});
