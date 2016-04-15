import { expect } from 'chai';
import {IEventHandlerT} from './interfaces/iEventHandler';
import {IEventT} from './interfaces/iEvent';
import {EventT} from './eventT';

interface ITestEventHandler<T> extends IEventHandlerT<T> {
  actualDataThatWasCalledWith: T[];
}

describe('EventT', () => {
  var event: EventT<any>;

  beforeEach(() => {
    event = new EventT<any>();
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

  function createData(): any {
    return {
      1: 'some data1',
      2: 'some data2'
    }
  }

  function verifyEventHandlerWasRaisedOnce<T>(eventHandler: ITestEventHandler<T>, data: T): void {
    expect(eventHandler.actualDataThatWasCalledWith.length).to.be.equal(1);
    expect(eventHandler.actualDataThatWasCalledWith[0]).to.be.equal(data);
  }

  function verifyEventHandlerWasNeverRaised<T>(eventHandler: ITestEventHandler<T>): void {
    expect(eventHandler.actualDataThatWasCalledWith.length).to.be.equal(0);
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
    })
  });

  describe('raise', () => {
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

  describe('raiseSafe', () => {
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
});
