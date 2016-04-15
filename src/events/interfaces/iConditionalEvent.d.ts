import { IEventHandlerT } from './iEventHandler';
import { IConditionT } from './iCondition';
export interface IConditionalEventT<T> {
    on(eventHandler: IEventHandlerT<T>, condition?: IConditionT<T>): void;
    off(eventHandler: IEventHandlerT<T>, condition?: IConditionT<T>): void;
}
