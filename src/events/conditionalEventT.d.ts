import { IEventHandlerT } from './interfaces/iEventHandlerT';
import { IConditionT } from './interfaces/iConditionT';
import { IConditionalRaisableEventT } from './interfaces/iConditionalRaisableEventT';
export declare class ConditionalEventT<T> implements IConditionalRaisableEventT<T> {
    private _defaultTruthyCondition;
    private _conditionalEventHandlers;
    on(eventHandler: IEventHandlerT<T>, condition?: IConditionT<T>): void;
    off(eventHandler: IEventHandlerT<T>, condition?: IConditionT<T>): void;
    raise(data: T): void;
    raiseSafe(data: T): void;
    private _registerIfNotRegisteredYet(conditionalEventHandler);
    private _isAlreadyRegistered(conditionalEventHandlerToCheck);
    private _areSameConditionalEventHandlers(first, second);
    private _callEventHandlerIfConditionIsSatisfiedSafe(conditionalEventHandler, data);
    private _callEventHandlerIfConditionIsSatisfied(conditionalEventHandler, data);
    private _filterConditionalEventHandlersThatContainEventHandler(eventHandler);
    private _filterConditionalEventHandlersByEventHandlerAndCondition(eventHandler, condition);
}
