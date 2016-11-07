import {IGlobalEvent} from "./interfaces/iGlobalEvent";
import {GlobalEvent} from "./globalEvent";
import {expect} from 'chai';

class EventSubscriber {
  public static REGULAR_EVENT_NAME = 'regular event name';
  public static THROWING_EVENT_NAME = 'throwing event name';

  public eventCallbackArgs: number[] = [];
  public throwingEventCallbackArgs: string[] = [];

  constructor() {
    const globalEvent = new GlobalEvent();
    globalEvent.on(EventSubscriber.REGULAR_EVENT_NAME, this.eventCallback.bind(this));
    globalEvent.on(EventSubscriber.THROWING_EVENT_NAME, this.throwingEventCallback.bind(this));
  }

  private eventCallback(data: number): void {
    this.eventCallbackArgs.push(data);
  }

  private throwingEventCallback(data: string): void {
    this.throwingEventCallbackArgs.push(data);
    throw 'some error';
  }
}

describe('GlobalEvent', () => {
  let globalEvent: IGlobalEvent;
  let eventSubscriber: EventSubscriber;

  beforeEach(() => {
    eventSubscriber = new EventSubscriber();
  });

  beforeEach(() => {
    globalEvent = new GlobalEvent();
  });

  afterEach(() => {
    globalEvent.clearAllSubscribtions(EventSubscriber.REGULAR_EVENT_NAME);
    globalEvent.clearAllSubscribtions(EventSubscriber.THROWING_EVENT_NAME);
  })

  it('raising global event with not existing name should not call the callbacks', () => {
    globalEvent.raise('non existing name', 1);

    expect(eventSubscriber.eventCallbackArgs).to.be.length(0);
    expect(eventSubscriber.throwingEventCallbackArgs).to.be.length(0);
  });

  it('raising regular event should raise only the regular event', () => {
    const data = 12;
    globalEvent.raise(EventSubscriber.REGULAR_EVENT_NAME, data);

    expect(eventSubscriber.eventCallbackArgs).to.be.deep.equal([data]);
    expect(eventSubscriber.throwingEventCallbackArgs).to.be.length(0);
  });

  it('raising throwing event should throw an error', () => {
    const data = 'aaa';
    const action = () =>
      globalEvent.raise(EventSubscriber.THROWING_EVENT_NAME, data);

    expect(action).to.throw('some error');

    expect(eventSubscriber.eventCallbackArgs).to.be.length(0);
    expect(eventSubscriber.throwingEventCallbackArgs).to.be.deep.equal([data]);
  });

  it('raising safely a throwing event should not throw an error', () => {
    const data = 'aaa';
    const action = () =>
      globalEvent.raiseSafe(EventSubscriber.THROWING_EVENT_NAME, data);

    expect(action).to.not.throw();

    expect(eventSubscriber.eventCallbackArgs).to.be.length(0);
    expect(eventSubscriber.throwingEventCallbackArgs).to.be.deep.equal([data]);
  });

  it('raising an event after unsubscribing from it should not raise it', () => {
    const eventName = 'event name';
    let numberOfTimesRaised: number = 0;

    const eventHandler = () => numberOfTimesRaised++;

    globalEvent.on(eventName, eventHandler);
    globalEvent.off(eventName, eventHandler);

    globalEvent.raise(eventName);

    expect(numberOfTimesRaised).to.be.equal(0);
  });

});
