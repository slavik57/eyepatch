import { expect, AssertionError } from 'chai';
import {IEventHandlerT} from './iEventHandlerT';
import {IEventT} from './iEventT';
import {EventT} from './eventT';

interface ITestEventHandler<T> extends IEventHandlerT<T> {
  actualDataThatWasCalled: T[];
}

describe('EventT', () => {
  var event: EventT<any>;

  beforeEach(() => {
    event = new EventT<any>();
  });

  function createEventHandler<T>(event: IEventT<T>): ITestEventHandler<T> {
    var eventHandler: ITestEventHandler<T> = <any>((_data: T) => {
      eventHandler.actualDataThatWasCalled.push(_data);
    });

    eventHandler.actualDataThatWasCalled = [];

    return eventHandler;
  }

  function registerThrowingEventHandler<T>(event: IEventT<T>): ITestEventHandler<T> {
    var eventHandler: ITestEventHandler<T> = <any>((_data: T) => {
      eventHandler.actualDataThatWasCalled.push(_data);

      throw 'some error';
    });

    eventHandler.actualDataThatWasCalled = [];

    event.on(eventHandler);

    return eventHandler;
  }

  function createData(): any {
    return {
      1: 'some data1',
      2: 'some data2'
    }
  }

  function verifyEventHandlerWasRaisedOnce<T>(eventHandler: ITestEventHandler<T>, data: T): void {
    expect(eventHandler.actualDataThatWasCalled.length).to.be.equal(1);
    expect(eventHandler.actualDataThatWasCalled[0]).to.be.equal(data);
  }

  function verifyEventHandlerWasNeverRaised<T>(eventHandler: ITestEventHandler<T>): void {
    expect(eventHandler.actualDataThatWasCalled.length).to.be.equal(0);
  }

  describe('raise', () => {
    it('raising unregistered event should not throw errors', () => {
      event.raise({});
    });

    it('raising on registered event should raise event on all registratios', () => {
      // Arrange
      var handler1 = createEventHandler(event);
      var handler2 = createEventHandler(event);
      var handler3 = createEventHandler(event);

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

    it('registering event handler that throws an error should throw error', () => {
      // Arrange
      var throwingHandler = registerThrowingEventHandler(event);

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
      var throwingHandler = registerThrowingEventHandler(event);
      var handler = createEventHandler(event);

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
      var handler = createEventHandler(event);
      var handlerToUnregister = createEventHandler(event);

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
      var handler1 = createEventHandler(event);
      var handler2 = createEventHandler(event);
      var handlerToUnregister = createEventHandler(event);
      var handler3 = createEventHandler(event);
      var handler4 = createEventHandler(event);

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
    });
  });

  describe('raiseSafe', () => {
    it('raising unregistered event should not throw errors', () => {
      event.raiseSafe({});
    });

    it('raising on registered event should raise event on all registratios', () => {
      // Arrange
      var handler1 = createEventHandler(event);
      var handler2 = createEventHandler(event);
      var handler3 = createEventHandler(event);

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

    it('registering event handler that throws an error should not throw error', () => {
      // Arrange
      var throwingHandler = registerThrowingEventHandler(event);

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
      var throwingHandler = registerThrowingEventHandler(event);
      var handler = createEventHandler(event);

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
      var handler = createEventHandler(event);
      var handlerToUnregister = createEventHandler(event);

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
      var handler1 = createEventHandler(event);
      var handler2 = createEventHandler(event);
      var handlerToUnregister = createEventHandler(event);
      var handler3 = createEventHandler(event);
      var handler4 = createEventHandler(event);

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
    });
  });
});
