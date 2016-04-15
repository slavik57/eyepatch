import { expect } from 'chai';
import {IEventHandler} from './interfaces/iEventHandler';
import {IEvent} from './interfaces/iEvent';
import {Event} from './event';

interface ITestEventHandler extends IEventHandler {
  numberOfTimesCalled: number;
}

describe('Event', () => {
  var event: Event;

  beforeEach(() => {
    event = new Event();
  });

  function createEventHandler(): ITestEventHandler {
    var eventHandler: ITestEventHandler = <any>(() => {
      eventHandler.numberOfTimesCalled++;
    });

    eventHandler.numberOfTimesCalled = 0;

    return eventHandler;
  }

  function createThrowingEventHandler(): ITestEventHandler {
    var eventHandler: ITestEventHandler = <any>(() => {
      eventHandler.numberOfTimesCalled++;

      throw 'some error';
    });

    eventHandler.numberOfTimesCalled = 0;

    return eventHandler;
  }

  function verifyEventHandlerWasRaisedOnce(eventHandler: ITestEventHandler): void {
    expect(eventHandler.numberOfTimesCalled).to.be.equal(1);
  }

  function verifyEventHandlerWasNeverRaised(eventHandler: ITestEventHandler): void {
    expect(eventHandler.numberOfTimesCalled).to.be.equal(0);
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

  describe('raiseSafe', () => {
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
});
