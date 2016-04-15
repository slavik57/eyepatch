import { IEventHandler, IEventHandlerT } from './iEventHandler';
import { ICondition, IConditionT } from './iCondition';
export interface IConditionalEvent {
    on(eventHandler: IEventHandler, condition?: ICondition): void;
    off(eventHandler: IEventHandler, condition?: ICondition): void;
}
export interface IConditionalEventT<T> {
    on(eventHandler: IEventHandlerT<T>, condition?: IConditionT<T>): void;
    off(eventHandler: IEventHandlerT<T>, condition?: IConditionT<T>): void;
}
