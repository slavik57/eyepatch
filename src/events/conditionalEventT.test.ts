import { expect } from 'chai';
import { IConditionT } from './interfaces/iCondition';
import { IEventHandlerT } from './interfaces/iEventHandler';
import { IConditionalEventT } from './interfaces/iConditionalEvent';
import { ConditionalEventT } from './conditionalEventT';

interface ITestEventHandler<T> extends IEventHandlerT<T> {
  actualDataThatWasCalledWith: T[];
}

interface ITestCondition<T> extends IConditionT<T> {
  actualDataThatWasCalledWith: T[];
}

describe('ConditionalEventT', () => {
  let event: ConditionalEventT<any>;

  beforeEach(() => {
    event = new ConditionalEventT<any>();
  });

  function createEventHandler<T>(): ITestEventHandler<T> {
    const eventHandler: ITestEventHandler<T> = <any>((_data: T) => {
      eventHandler.actualDataThatWasCalledWith.push(_data);
    });

    eventHandler.actualDataThatWasCalledWith = [];

    return eventHandler;
  }

  function createThrowingEventHandler<T>(): ITestEventHandler<T> {
    const eventHandler: ITestEventHandler<T> = <any>((_data: T) => {
      eventHandler.actualDataThatWasCalledWith.push(_data);

      throw 'some error';
    });

    eventHandler.actualDataThatWasCalledWith = [];

    return eventHandler;
  }

  function createConditionWithReturnValue<T>(returnValue: boolean): ITestCondition<T> {
    const condition: ITestCondition<T> = <any>((_data: T) => {
      condition.actualDataThatWasCalledWith.push(_data);

      return returnValue;
    });

    condition.actualDataThatWasCalledWith = [];

    return condition;
  }

  function createThrowintCondition<T>(): ITestCondition<T> {
    const condition: ITestCondition<T> = <any>((_data: T) => {
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

    for (let i = 0; i < times; i++) {
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

    for (let i = 0; i < times; i++) {
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
      const handler = createEventHandler();

      // Act
      const registeringAction = () => {
        event.on(handler);
        event.on(handler);
      }

      // Assert
      expect(registeringAction).to.not.throw();
    })

    it('registering same event with same condition twice should not throw error', () => {
      // Arrange
      const handler = createEventHandler();
      const condition = createConditionWithReturnValue(true);

      // Act
      const registeringAction = () => {
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
      const handler = createEventHandler();

      // Act
      const unregisteringAction = () => {
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
        const handler1 = createEventHandler();
        const handler2 = createEventHandler();
        const handler3 = createEventHandler();

        const data = createData();

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
        const handler = createEventHandler();

        const data = createData();

        // Act
        event.on(handler);
        event.on(handler);
        event.raise(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler, data);
      });

      it('registering event handler that throws an error should throw error', () => {
        // Arrange
        const throwingHandler = createThrowingEventHandler();

        const data = createData();

        // Act
        event.on(throwingHandler);
        const raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
      });

      it('registering event handler that throws an error should not raise the next event handler', () => {
        // Arrange
        const throwingHandler = createThrowingEventHandler();
        const handler = createEventHandler();

        const data = createData();

        // Act
        event.on(throwingHandler);
        event.on(handler);
        const raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyEventHandlerWasNeverRaised(handler);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        const handler = createEventHandler();
        const handlerToUnregister = createEventHandler();

        const data = createData();

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
        const handler1 = createEventHandler();
        const handler2 = createEventHandler();
        const handlerToUnregister = createEventHandler();
        const handler3 = createEventHandler();
        const handler4 = createEventHandler();

        const data = createData();

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
        const handler1 = createEventHandler();
        const handler2 = createEventHandler();
        const handler3 = createEventHandler();

        const trueCondition = createConditionWithReturnValue(true);
        const falseCondition = createConditionWithReturnValue(false);

        const data = createData();

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
        const handler = createEventHandler();

        const trueCondition = createConditionWithReturnValue(true);

        const data = createData();

        // Act
        event.on(handler, trueCondition);
        event.raise(data);

        // Assert
        verifyConditionWasCalledOnce(trueCondition, data);
      });

      it('registering twice with same event handler and same condition, raising, should raise once', () => {
        // Arrange
        const handler = createEventHandler();
        const condition = createConditionWithReturnValue(true);

        const data = createData();

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
        const handler = createEventHandler();
        const condition1 = createConditionWithReturnValue(true);
        const condition2 = createConditionWithReturnValue(true);

        const data = createData();

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
        const throwingHandler = createThrowingEventHandler();
        const condition = createConditionWithReturnValue(true);

        const data = createData();

        // Act
        event.on(throwingHandler, condition);
        const raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyConditionWasCalledOnce(condition, data);
      });

      it('registering event handler with condition that throws an error should throw error', () => {
        // Arrange
        const eventHandler = createEventHandler();
        const throwingCondition = createThrowintCondition();

        const data = createData();

        // Act
        event.on(eventHandler, throwingCondition);
        const raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyConditionWasCalledOnce(throwingCondition, data);
        verifyEventHandlerWasNeverRaised(eventHandler);
      });

      it('registering event handler that throws an error should not raise the next event handler or condition', () => {
        // Arrange
        const throwingHandler = createThrowingEventHandler();
        const condition1 = createConditionWithReturnValue(true);
        const handler = createEventHandler();
        const condition2 = createConditionWithReturnValue(true);

        const data = createData();

        // Act
        event.on(throwingHandler, condition1);
        event.on(handler, condition2);
        const raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyConditionWasCalledOnce(condition1, data);
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyConditionWasNeverCalled(condition2);
        verifyEventHandlerWasNeverRaised(handler);
      });

      it('registering event handler with condition that throws an error should not raise the next event handler or condition', () => {
        // Arrange
        const handler1 = createThrowingEventHandler();
        const throwingCondition = createThrowintCondition();
        const handler2 = createEventHandler();
        const condition2 = createConditionWithReturnValue(true);

        const data = createData();

        // Act
        event.on(handler1, throwingCondition);
        event.on(handler2, condition2);
        const raisingAction = () => event.raise(data);

        // Assert
        expect(raisingAction).to.throw();
        verifyConditionWasCalledOnce(throwingCondition, data);
        verifyEventHandlerWasNeverRaised(handler1);
        verifyConditionWasNeverCalled(condition2);
        verifyEventHandlerWasNeverRaised(handler2);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        const handler = createEventHandler();
        const condition = createConditionWithReturnValue(true);
        const handlerToUnregister = createEventHandler();
        const conditionOfHandlerToUnregister = createConditionWithReturnValue(true);

        const data = createData();

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
        const handler1 = createEventHandler();
        const condition1 = createConditionWithReturnValue(true);
        const handler2 = createEventHandler();
        const condition2 = createConditionWithReturnValue(true);
        const handlerToUnregister = createEventHandler();
        const conditionOfHandlerToUnregister = createConditionWithReturnValue(true);
        const handler3 = createEventHandler();
        const condition3 = createConditionWithReturnValue(true);
        const handler4 = createEventHandler();
        const condition4 = createConditionWithReturnValue(true);

        const data = createData();

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
        const handler = createEventHandler();
        const condition1 = createConditionWithReturnValue(true);
        const condition2 = createConditionWithReturnValue(true);
        const condition3 = createConditionWithReturnValue(true);

        const data = createData();

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
        const handler = createEventHandler();
        const condition1 = createConditionWithReturnValue(true);
        const condition2 = createConditionWithReturnValue(true);
        const condition3 = createConditionWithReturnValue(true);

        const data = createData();

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
        const handler1 = createEventHandler();
        const handler2 = createEventHandler();
        const handler3 = createEventHandler();

        const data = createData();

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
        const handler = createEventHandler();

        const data = createData();

        // Act
        event.on(handler);
        event.on(handler);
        event.raiseSafe(data);

        // Assert
        verifyEventHandlerWasRaisedOnce(handler, data);
      });

      it('registering event handler that throws an error should not throw error', () => {
        // Arrange
        const throwingHandler = createThrowingEventHandler();

        const data = createData();

        // Act
        event.on(throwingHandler);
        const raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
      });

      it('registering event handler that throws an error should raise the next event handler', () => {
        // Arrange
        const throwingHandler = createThrowingEventHandler();
        const handler = createEventHandler();

        const data = createData();

        // Act
        event.on(throwingHandler);
        event.on(handler);
        const raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyEventHandlerWasRaisedOnce(handler, data);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        const handler = createEventHandler();
        const handlerToUnregister = createEventHandler();

        const data = createData();

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
        const handler1 = createEventHandler();
        const handler2 = createEventHandler();
        const handlerToUnregister = createEventHandler();
        const handler3 = createEventHandler();
        const handler4 = createEventHandler();

        const data = createData();

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
        const handler1 = createEventHandler();
        const handler2 = createEventHandler();
        const handler3 = createEventHandler();

        const trueCondition = createConditionWithReturnValue(true);
        const falseCondition = createConditionWithReturnValue(false);

        const data = createData();

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
        const handler = createEventHandler();

        const trueCondition = createConditionWithReturnValue(true);

        const data = createData();

        // Act
        event.on(handler, trueCondition);
        event.raiseSafe(data);

        // Assert
        verifyConditionWasCalledOnce(trueCondition, data);
      });

      it('registering twice with same event handler and same condition, raising, should raise once', () => {
        // Arrange
        const handler = createEventHandler();
        const condition = createConditionWithReturnValue(true);

        const data = createData();

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
        const handler = createEventHandler();
        const condition1 = createConditionWithReturnValue(true);
        const condition2 = createConditionWithReturnValue(true);

        const data = createData();

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
        const throwingHandler = createThrowingEventHandler();
        const condition = createConditionWithReturnValue(true);

        const data = createData();

        // Act
        event.on(throwingHandler, condition);
        const raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyConditionWasCalledOnce(condition, data);
      });

      it('registering event handler with condition that throws an error should not throw error', () => {
        // Arrange
        const eventHandler = createEventHandler();
        const throwingCondition = createThrowintCondition();

        const data = createData();

        // Act
        event.on(eventHandler, throwingCondition);
        const raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyConditionWasCalledOnce(throwingCondition, data);
        verifyEventHandlerWasNeverRaised(eventHandler);
      });

      it('registering event handler that throws an error should raise the next event handler or condition', () => {
        // Arrange
        const throwingHandler = createThrowingEventHandler();
        const condition1 = createConditionWithReturnValue(true);
        const handler = createEventHandler();
        const condition2 = createConditionWithReturnValue(true);

        const data = createData();

        // Act
        event.on(throwingHandler, condition1);
        event.on(handler, condition2);
        const raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyConditionWasCalledOnce(condition1, data);
        verifyEventHandlerWasRaisedOnce(throwingHandler, data);
        verifyConditionWasCalledOnce(condition2, data);
        verifyEventHandlerWasRaisedOnce(handler, data);
      });

      it('registering event handler with condition that throws an error should raise the next event handler or condition', () => {
        // Arrange
        const handler1 = createThrowingEventHandler();
        const throwingCondition = createThrowintCondition();
        const handler2 = createEventHandler();
        const condition2 = createConditionWithReturnValue(true);

        const data = createData();

        // Act
        event.on(handler1, throwingCondition);
        event.on(handler2, condition2);
        const raisingAction = () => event.raiseSafe(data);

        // Assert
        expect(raisingAction).to.not.throw();
        verifyConditionWasCalledOnce(throwingCondition, data);
        verifyEventHandlerWasNeverRaised(handler1);
        verifyConditionWasCalledOnce(condition2, data);
        verifyEventHandlerWasRaisedOnce(handler2, data);
      });

      it('unregistering event handler should not raise it', () => {
        // Arrange
        const handler = createEventHandler();
        const condition = createConditionWithReturnValue(true);
        const handlerToUnregister = createEventHandler();
        const conditionOfHandlerToUnregister = createConditionWithReturnValue(true);

        const data = createData();

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
        const handler1 = createEventHandler();
        const condition1 = createConditionWithReturnValue(true);
        const handler2 = createEventHandler();
        const condition2 = createConditionWithReturnValue(true);
        const handlerToUnregister = createEventHandler();
        const conditionOfHandlerToUnregister = createConditionWithReturnValue(true);
        const handler3 = createEventHandler();
        const condition3 = createConditionWithReturnValue(true);
        const handler4 = createEventHandler();
        const condition4 = createConditionWithReturnValue(true);

        const data = createData();

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
        const handler = createEventHandler();
        const condition1 = createConditionWithReturnValue(true);
        const condition2 = createConditionWithReturnValue(true);
        const condition3 = createConditionWithReturnValue(true);

        const data = createData();

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
        const handler = createEventHandler();
        const condition1 = createConditionWithReturnValue(true);
        const condition2 = createConditionWithReturnValue(true);
        const condition3 = createConditionWithReturnValue(true);

        const data = createData();

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
