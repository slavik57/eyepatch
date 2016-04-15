import { IEventHandlerT } from './interfaces/iEventHandlerT';
import { IRaisableEventT } from './interfaces/iRaisableEventT';
export declare class EventT<T> implements IRaisableEventT<T> {
    private _conditionalEventT;
    on(eventHandler: IEventHandlerT<T>): void;
    off(eventHandler: IEventHandlerT<T>): void;
    raise(data: T): void;
    raiseSafe(data: T): void;
}
