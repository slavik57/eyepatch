import { IEventHandlerT } from './interfaces/iEventHandler';
import { IConditionT } from './interfaces/iCondition';
import { IConditionalRaisableEventT } from './interfaces/iConditionalRaisableEvent';

interface IConditionalEventHandler<T> {
  eventHandler: IEventHandlerT<T>;
  condition: IConditionT<T>;
}

export class ConditionalEventT<T> implements IConditionalRaisableEventT<T> {
  private _defaultTruthyCondition: IConditionT<T>;
  private _conditionalEventHandlers: IConditionalEventHandler<T>[] = [];

  constructor() {
    this._defaultTruthyCondition = () => true;
  }

  public on(eventHandler: IEventHandlerT<T>, condition?: IConditionT<T>): void {
    if (!condition) {
      condition = this._defaultTruthyCondition;
    }

    const conditionalEventHandler: IConditionalEventHandler<T> = {
      eventHandler: eventHandler,
      condition: condition
    };

    this._registerIfNotRegisteredYet(conditionalEventHandler);
  }

  public off(eventHandler: IEventHandlerT<T>, condition?: IConditionT<T>): void {
    if (!condition) {
      this._conditionalEventHandlers =
        this._filterConditionalEventHandlersThatContainEventHandler(eventHandler);
    } else {
      this._conditionalEventHandlers =
        this._filterConditionalEventHandlersByEventHandlerAndCondition(eventHandler, condition);
    }
  }

  public raise(data: T): void {
    this._conditionalEventHandlers.forEach(
      (_conditionalEventHandler: IConditionalEventHandler<T>) => {
        this._callEventHandlerIfConditionIsSatisfied(_conditionalEventHandler, data);
      }
    );
  }

  public raiseSafe(data: T): void {
    this._conditionalEventHandlers.forEach(
      (_conditionalEventHandler: IConditionalEventHandler<T>) => {
        this._callEventHandlerIfConditionIsSatisfiedSafe(_conditionalEventHandler, data);
      }
    );
  }

  private _registerIfNotRegisteredYet(conditionalEventHandler: IConditionalEventHandler<T>): void {
    if (this._isAlreadyRegistered(conditionalEventHandler)) {
      return;
    }

    this._conditionalEventHandlers.push(conditionalEventHandler);
  }

  private _isAlreadyRegistered(conditionalEventHandlerToCheck: IConditionalEventHandler<T>) {
    for (let i = 0; i < this._conditionalEventHandlers.length; i++) {
      const conditionalEventHandler: IConditionalEventHandler<T> = this._conditionalEventHandlers[i];

      if (this._areSameConditionalEventHandlers(conditionalEventHandler, conditionalEventHandlerToCheck)) {
        return true;
      }
    }

    return false;
  }

  private _areSameConditionalEventHandlers(first: IConditionalEventHandler<T>, second: IConditionalEventHandler<T>): boolean {
    return first.eventHandler === second.eventHandler &&
      first.condition === second.condition;
  }

  private _callEventHandlerIfConditionIsSatisfiedSafe(conditionalEventHandler: IConditionalEventHandler<T>, data: T): void {
    try {
      this._callEventHandlerIfConditionIsSatisfied(conditionalEventHandler, data);
    } catch (e) {
    }
  }

  private _callEventHandlerIfConditionIsSatisfied(conditionalEventHandler: IConditionalEventHandler<T>, data: T): void {
    if (conditionalEventHandler.condition(data)) {
      conditionalEventHandler.eventHandler(data);
    }
  }

  private _filterConditionalEventHandlersThatContainEventHandler(eventHandler: IEventHandlerT<T>): IConditionalEventHandler<T>[] {
    const result: IConditionalEventHandler<T>[] = [];

    for (let i = 0; i < this._conditionalEventHandlers.length; i++) {
      const conditionalEventHandler: IConditionalEventHandler<T> =
        this._conditionalEventHandlers[i];

      if (conditionalEventHandler.eventHandler !== eventHandler) {
        result.push(conditionalEventHandler);
      }
    }

    return result;
  }

  private _filterConditionalEventHandlersByEventHandlerAndCondition(eventHandler: IEventHandlerT<T>,
    condition: IConditionT<T>): IConditionalEventHandler<T>[] {
    const conditionalEventHandlerToFilter: IConditionalEventHandler<T> = {
      eventHandler: eventHandler,
      condition: condition
    }

    const result: IConditionalEventHandler<T>[] = [];

    for (let i = 0; i < this._conditionalEventHandlers.length; i++) {
      const conditionalEventHandler: IConditionalEventHandler<T> =
        this._conditionalEventHandlers[i];

      if (!this._areSameConditionalEventHandlers(conditionalEventHandler, conditionalEventHandlerToFilter)) {
        result.push(conditionalEventHandler);
      }
    }

    return result;
  }
}
