import {expect} from 'chai';
import {IConditionT} from './interfaces/iConditionT';
import {IEventHandlerT} from './interfaces/iEventHandlerT';
import {IConditionalEventT} from './interfaces/iConditionalEventT';
import {ConditionalEventT} from './conditionalEventT';

interface ITestEventHandler<T> extends IEventHandlerT<T> {
  actualDataThatWasCalledWith: T[];
}

interface ITestCondition<T> extends IConditionT<T> {
  actualDataThatWasCalledWith: T[];
}

describe('ConditionalEventT', () => {
  var event: ConditionalEventT<any>;

  beforeEach(() => {
    event = new ConditionalEventT<any>();
  });

  function createEventHandler<T>(): ITestEventHandler<T> {
    var eventHandler: ITestEventHandler<T> = <any>((_data: T) => {
      eventHandler.actualDataThatWasCalledWith.push(_data);
    });

    eventHandler.actualDataThatWasCalledWith = [];

    return eventHandler;
  }

  function createThrowingEventHandler<T>(): ITestEventHandler<T> {
    var eventHandler: ITestEventHandler<T> = <any>((_data: T) => {
      eventHandler.actualDataThatWasCalledWith.push(_data);

      throw 'some error';
    });

    eventHandler.actualDataThatWasCalledWith = [];

    return eventHandler;
  }

  function createConditionWithReturnValue<T>(returnValue: boolean): ITestCondition<T> {
    var condition: ITestCondition<T> = <any>((_data: T) => {
      condition.actualDataThatWasCalledWith.push(_data);

      return returnValue;
    });

    condition.actualDataThatWasCalledWith = [];

    return condition;
  }

  function createThrowintCondition<T>(): ITestCondition<T> {
    var condition: ITestCondition<T> = <any>((_data: T) => {
      condition.actualDataThatWasCalledWith.push(_data);

      throw 'some error';
    });

    condition.actualDataThatWasCalledWith = [];

    return condition;
  }

  function createData(): any {
    return {
      1: 'some data1',
      2: 'some data2'
    }
  }

  function verifyEventHandlerWasRaisedXTimes<T>(times: number, eventHandler: ITestEventHandler<T>, data: T[]): void {
    expect(eventHandler.actualDataThatWasCalledWith.length).to.be.equal(times);

    for (var i = 0; i < times; i++) {
      expect(eventHandler.actualDataThatWasCalledWith[i]).to.be.equal(data[i]);
    }
  }

  function verifyEventHandlerWasRaisedOnce<T>(eventHandler: ITestEventHandler<T>, data: T): void {
    verifyEventHandlerWasRaisedXTimes(1, eventHandler, [data]);
  }

  function verifyEventHandlerWasNeverRaised<T>(eventHandler: ITestEventHandler<T>): void {
    verifyEventHandlerWasRaisedXTimes(0, eventHandler, []);
  }

  function verifyConditionWasCalledXTimes<T>(times: number, condition: ITestCondition<T>, data: T[]): void {
    expect(condition.actualDataThatWasCalledWith.length).to.be.equal(times);

    for (var i = 0; i < times; i++) {
      expect(condition.actualDataThatWasCalledWith[i]).to.be.equal(data[i]);
    }
  }

  function verifyConditionWasCalledOnce<T>(condition: ITestCondition<T>, data: T): void {
    verifyConditionWasCalledXTimes(1, condition, [data]);
  }

  function verifyConditionWasNeverCalled<T>(condition: ITestCondition<T>): void {
    verifyConditionWasCalledXTimes(0, condition, []);
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
        event.raise({});
      });

      it('raising on registered event should raise event on all registratios', () => {
        // Arrange
        var handler1 = createEventHandler();
        var handler2 = createEventHandler();
        var handler3 = createEventHandler();

        var data = createData();

        // Act
        event.on(handler1);
        event.on(handler2);
        event.on(handler3);
        event.raise(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1, data);
        verifyEventHandlerWasRaisedOnce(handler2, data);
        verifyEventHandlerWasRaisedOnce(handler3, data);
      });

      it('registering twice with same event handler, raising, should raise once', () => {
        // Arrange
        var handler = createEventHandler();

        var data = createData();

        // Act
        event.on(handler);
        event.on(handler);
        event.raise(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler, data);
      });

      it('registering event handler that throws an error should throw error', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();

        var data = createData();

        // Act
        event.on(throwingHandler);
        var raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
      });

      it('registering event handler that throws an error should not raise the next event handler', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var handler = createEventHandler();

        var data = createData();

        // Act
        event.on(throwingHandler);
        event.on(handler);
        var raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyEventHandlerWasNeverRaised(handler);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        var handler = createEventHandler();
        var handlerToUnregister = createEventHandler();

        var data = createData();

        event.on(handler);
        event.on(handlerToUnregister);

        // Act
        event.off(handlerToUnregister);
        event.raise(data);

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

        var data = createData();

        event.on(handler1);
        event.on(handler2);
        event.on(handlerToUnregister);
        event.on(handler3);
        event.on(handler4);

        // Act
        event.off(handlerToUnregister);
        event.raise(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1, data);
        verifyEventHandlerWasRaisedOnce(handler2, data);
        verifyEventHandlerWasRaisedOnce(handler3, data);
        verifyEventHandlerWasRaisedOnce(handler4, data);
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

        var data = createData();

        // Act
        event.on(handler1, trueCondition);
        event.on(handler2, falseCondition);
        event.on(handler3, trueCondition);
        event.raise(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1, data);
        verifyEventHandlerWasNeverRaised(handler2);
        verifyEventHandlerWasRaisedOnce(handler3, data);

        verifyConditionWasCalledXTimes(2, trueCondition, [data, data]);
        verifyConditionWasCalledOnce(falseCondition, data);
      });

      it('raising should call the condition once', () => {
        // Arrange
        var handler = createEventHandler();

        var trueCondition = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(handler, trueCondition);
        event.raise(data);

        // Assert
        verifyConditionWasCalledOnce(trueCondition, data);
      });

      it('registering twice with same event handler and same condition, raising, should raise once', () => {
        // Arrange
        var handler = createEventHandler();
        var condition = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(handler, condition);
        event.on(handler, condition);
        event.raise(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler, data);
        verifyConditionWasCalledOnce(condition, data);
      });

      it('registering twice with same event handler and different condition, raising, should raise twice', () => {
        // Arrange
        var handler = createEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var condition2 = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(handler, condition1);
        event.on(handler, condition2);
        event.raise(data);

        // Assert
        verifyConditionWasCalledOnce(condition1, data);
        verifyConditionWasCalledOnce(condition2, data);
        verifyEventHandlerWasRaisedXTimes(2, handler, [data, data]);
      });

      it('registering event handler that throws an error should throw error', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var condition = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(throwingHandler, condition);
        var raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyConditionWasCalledOnce(condition, data);
      });

      it('registering event handler with condition that throws an error should throw error', () => {
        // Arrange
        var eventHandler = createEventHandler();
        var throwingCondition = createThrowintCondition();

        var data = createData();

        // Act
        event.on(eventHandler, throwingCondition);
        var raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyConditionWasCalledOnce(throwingCondition, data);
        verifyEventHandlerWasNeverRaised(eventHandler);
      });

      it('registering event handler that throws an error should not raise the next event handler or condition', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var handler = createEventHandler();
        var condition2 = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(throwingHandler, condition1);
        event.on(handler, condition2);
        var raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyConditionWasCalledOnce(condition1, data);
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyConditionWasNeverCalled(condition2);
        verifyEventHandlerWasNeverRaised(handler);
      });

      it('registering event handler with condition that throws an error should not raise the next event handler or condition', () => {
        // Arrange
        var handler1 = createThrowingEventHandler();
        var throwingCondition = createThrowintCondition();
        var handler2 = createEventHandler();
        var condition2 = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(handler1, throwingCondition);
        event.on(handler2, condition2);
        var raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyConditionWasCalledOnce(throwingCondition, data);
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

        var data = createData();

        event.on(handler, condition);
        event.on(handlerToUnregister, conditionOfHandlerToUnregister);

        // Act
        event.off(handlerToUnregister);
        event.raise(data);

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

        var data = createData();

        event.on(handler1, condition1);
        event.on(handler2, condition2);
        event.on(handlerToUnregister, conditionOfHandlerToUnregister);
        event.on(handler3, condition3);
        event.on(handler4, condition4);

        // Act
        event.off(handlerToUnregister);
        event.raise(data);

        // Assert
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

      it('registering same handler with different conditions, unregister without condition, raise, should not raise', () => {
        // Arrange
        var handler = createEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var condition2 = createConditionWithReturnValue(true);
        var condition3 = createConditionWithReturnValue(true);

        var data = createData();

        event.on(handler, condition1);
        event.on(handler, condition2);
        event.on(handler, condition3);

        // Act
        event.off(handler);
        event.raise(data);

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

        var data = createData();

        event.on(handler, condition1);
        event.on(handler, condition2);
        event.on(handler, condition3);

        // Act
        event.off(handler, condition2);
        event.raise(data);

        // Assert
        verifyConditionWasCalledOnce(condition1, data);
        verifyConditionWasNeverCalled(condition2);
        verifyConditionWasCalledOnce(condition3, data);
        verifyEventHandlerWasRaisedXTimes(2, handler, [data, data]);
      });
    });
  });

  describe('raiseSafe', () => {
    describe('no condition', () => {
      it('raising unregistered event should not throw errors', () => {
        event.raiseSafe({});
      });

      it('raising on registered event should raise event on all registratios', () => {
        // Arrange
        var handler1 = createEventHandler();
        var handler2 = createEventHandler();
        var handler3 = createEventHandler();

        var data = createData();

        // Act
        event.on(handler1);
        event.on(handler2);
        event.on(handler3);
        event.raiseSafe(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1, data);
        verifyEventHandlerWasRaisedOnce(handler2, data);
        verifyEventHandlerWasRaisedOnce(handler3, data);
      });

      it('registering twice with same event handler, raising, should raise once', () => {
        // Arrange
        var handler = createEventHandler();

        var data = createData();

        // Act
        event.on(handler);
        event.on(handler);
        event.raiseSafe(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler, data);
      });

      it('registering event handler that throws an error should not throw error', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();

        var data = createData();

        // Act
        event.on(throwingHandler);
        var raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
      });

      it('registering event handler that throws an error should raise the next event handler', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var handler = createEventHandler();

        var data = createData();

        // Act
        event.on(throwingHandler);
        event.on(handler);
        var raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyEventHandlerWasRaisedOnce(handler, data);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        var handler = createEventHandler();
        var handlerToUnregister = createEventHandler();

        var data = createData();

        event.on(handler);
        event.on(handlerToUnregister);

        // Act
        event.off(handlerToUnregister);
        event.raiseSafe(data);

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

        var data = createData();

        event.on(handler1);
        event.on(handler2);
        event.on(handlerToUnregister);
        event.on(handler3);
        event.on(handler4);

        // Act
        event.off(handlerToUnregister);
        event.raiseSafe(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1, data);
        verifyEventHandlerWasRaisedOnce(handler2, data);
        verifyEventHandlerWasRaisedOnce(handler3, data);
        verifyEventHandlerWasRaisedOnce(handler4, data);
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

        var data = createData();

        // Act
        event.on(handler1, trueCondition);
        event.on(handler2, falseCondition);
        event.on(handler3, trueCondition);
        event.raiseSafe(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler1, data);
        verifyEventHandlerWasNeverRaised(handler2);
        verifyEventHandlerWasRaisedOnce(handler3, data);

        verifyConditionWasCalledXTimes(2, trueCondition, [data, data]);
        verifyConditionWasCalledOnce(falseCondition, data);
      });

      it('raising should call the condition once', () => {
        // Arrange
        var handler = createEventHandler();

        var trueCondition = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(handler, trueCondition);
        event.raiseSafe(data);

        // Assert
        verifyConditionWasCalledOnce(trueCondition, data);
      });

      it('registering twice with same event handler and same condition, raising, should raise once', () => {
        // Arrange
        var handler = createEventHandler();
        var condition = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(handler, condition);
        event.on(handler, condition);
        event.raiseSafe(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler, data);
        verifyConditionWasCalledOnce(condition, data);
      });

      it('registering twice with same event handler and different condition, raising, should raise twice', () => {
        // Arrange
        var handler = createEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var condition2 = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(handler, condition1);
        event.on(handler, condition2);
        event.raiseSafe(data);

        // Assert
        verifyEventHandlerWasRaisedXTimes(2, handler, [data, data]);
        verifyConditionWasCalledOnce(condition1, data);
        verifyConditionWasCalledOnce(condition2, data);
      });

      it('registering event handler that throws an error should not throw error', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var condition = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(throwingHandler, condition);
        var raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyConditionWasCalledOnce(condition, data);
      });

      it('registering event handler with condition that throws an error should not throw error', () => {
        // Arrange
        var eventHandler = createEventHandler();
        var throwingCondition = createThrowintCondition();

        var data = createData();

        // Act
        event.on(eventHandler, throwingCondition);
        var raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyConditionWasCalledOnce(throwingCondition, data);
        verifyEventHandlerWasNeverRaised(eventHandler);
      });

      it('registering event handler that throws an error should raise the next event handler or condition', () => {
        // Arrange
        var throwingHandler = createThrowingEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var handler = createEventHandler();
        var condition2 = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(throwingHandler, condition1);
        event.on(handler, condition2);
        var raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyConditionWasCalledOnce(condition1, data);
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyConditionWasCalledOnce(condition2, data);
        verifyEventHandlerWasRaisedOnce(handler, data);
      });

      it('registering event handler with condition that throws an error should raise the next event handler or condition', () => {
        // Arrange
        var handler1 = createThrowingEventHandler();
        var throwingCondition = createThrowintCondition();
        var handler2 = createEventHandler();
        var condition2 = createConditionWithReturnValue(true);

        var data = createData();

        // Act
        event.on(handler1, throwingCondition);
        event.on(handler2, condition2);
        var raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyConditionWasCalledOnce(throwingCondition, data);
        verifyEventHandlerWasNeverRaised(handler1);
        verifyConditionWasCalledOnce(condition2, data);
        verifyEventHandlerWasRaisedOnce(handler2, data);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        var handler = createEventHandler();
        var condition = createConditionWithReturnValue(true);
        var handlerToUnregister = createEventHandler();
        var conditionOfHandlerToUnregister = createConditionWithReturnValue(true);

        var data = createData();

        event.on(handler, condition);
        event.on(handlerToUnregister, conditionOfHandlerToUnregister);

        // Act
        event.off(handlerToUnregister);
        event.raiseSafe(data);

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

        var data = createData();

        event.on(handler1, condition1);
        event.on(handler2, condition2);
        event.on(handlerToUnregister, conditionOfHandlerToUnregister);
        event.on(handler3, condition3);
        event.on(handler4, condition4);

        // Act
        event.off(handlerToUnregister);
        event.raiseSafe(data);

        // Assert
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

      it('registering same handler with different conditions, unregister without condition, raise, should not raise', () => {
        // Arrange
        var handler = createEventHandler();
        var condition1 = createConditionWithReturnValue(true);
        var condition2 = createConditionWithReturnValue(true);
        var condition3 = createConditionWithReturnValue(true);

        var data = createData();

        event.on(handler, condition1);
        event.on(handler, condition2);
        event.on(handler, condition3);

        // Act
        event.off(handler);
        event.raiseSafe(data);

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

        var data = createData();

        event.on(handler, condition1);
        event.on(handler, condition2);
        event.on(handler, condition3);

        // Act
        event.off(handler, condition2);
        event.raiseSafe(data);

        // Assert
        verifyConditionWasCalledOnce(condition1, data);
        verifyConditionWasNeverCalled(condition2);
        verifyConditionWasCalledOnce(condition3, data);
        verifyEventHandlerWasRaisedXTimes(2, handler, [data, data]);
      });
    });
  });
});
