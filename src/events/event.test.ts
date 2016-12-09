import { expect } from 'chai';
import {IEventHandler} from './interfaces/iEventHandler';
import {IEvent} from './interfaces/iEvent';
import {Event} from './event';

interface ITestEventHandler extends IEventHandler {
  numberOfTimesCalled: number;
}

describe('Event', () => {
  let event: Event;

  beforeEach(() => {
    event = new Event();
  });

  function createEventHandler(): ITestEventHandler {
    const eventHandler: ITestEventHandler = <any>(() => {
      eventHandler.numberOfTimesCalled++;
    });

    eventHandler.numberOfTimesCalled = 0;

    return eventHandler;
  }

  function createThrowingEventHandler(): ITestEventHandler {
    const eventHandler: ITestEventHandler = <any>(() => {
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
      const handler = createEventHandler();

      // Act
      const registeringAction = () => {
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
      const handler = createEventHandler();

      // Act
      const unregisteringAction = () => {
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
      const handler1 = createEventHandler();
      const handler2 = createEventHandler();
      const handler3 = createEventHandler();

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
      const handler = createEventHandler();

      // Act
      event.on(handler);
      event.on(handler);
      event.raise();

      // Assert
      verifyEventHandlerWasRaisedOnce(handler);
    });

    it('registering event handler that throws an error should throw error', () => {
      // Arrange
      const throwingHandler = createThrowingEventHandler();

      // Act
      event.on(throwingHandler);
      const raisingAction = () => event.raise();

      // Assert
      expect(raisingAction).to.throw();
      verifyEventHandlerWasRaisedOnce(throwingHandler);
    });

    it('registering event handler that throws an error should not raise the next event handler', () => {
      // Arrange
      const throwingHandler = createThrowingEventHandler();
      const handler = createEventHandler();

      // Act
      event.on(throwingHandler);
      event.on(handler);
      const raisingAction = () => event.raise();

      // Assert
      expect(raisingAction).to.throw();
      verifyEventHandlerWasRaisedOnce(throwingHandler);
      verifyEventHandlerWasNeverRaised(handler);
    });

    it('unregistering event handler should not raise it', () => {
      // Arrange
      const handler = createEventHandler();
      const handlerToUnregister = createEventHandler();

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
      const handler1 = createEventHandler();
      const handler2 = createEventHandler();
      const handlerToUnregister = createEventHandler();
      const handler3 = createEventHandler();
      const handler4 = createEventHandler();

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
      const handler1 = createEventHandler();
      const handler2 = createEventHandler();
      const handler3 = createEventHandler();

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
      const handler = createEventHandler();

      // Act
      event.on(handler);
      event.on(handler);
      event.raiseSafe();

      // Assert
      verifyEventHandlerWasRaisedOnce(handler);
    });

    it('registering event handler that throws an error should not throw error', () => {
      // Arrange
      const throwingHandler = createThrowingEventHandler();

      // Act
      event.on(throwingHandler);
      const raisingAction = () => event.raiseSafe();

      // Assert
      expect(raisingAction).to.not.throw();
      verifyEventHandlerWasRaisedOnce(throwingHandler);
    });

    it('registering event handler that throws an error should raise the next event handler', () => {
      // Arrange
      const throwingHandler = createThrowingEventHandler();
      const handler = createEventHandler();

      // Act
      event.on(throwingHandler);
      event.on(handler);
      const raisingAction = () => event.raiseSafe();

      // Assert
      expect(raisingAction).to.not.throw();
      verifyEventHandlerWasRaisedOnce(throwingHandler);
      verifyEventHandlerWasRaisedOnce(handler);
    });

    it('unregistering event handler should not raise it', () => {
      // Arrange
      const handler = createEventHandler();
      const handlerToUnregister = createEventHandler();

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
      const handler1 = createEventHandler();
      const handler2 = createEventHandler();
      const handlerToUnregister = createEventHandler();
      const handler3 = createEventHandler();
      const handler4 = createEventHandler();

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
