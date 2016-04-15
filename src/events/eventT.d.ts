import { IEventHandlerT } from './interfaces/iEventHandler';
import { IRaisableEventT } from './interfaces/iRaisableEvent';
export declare class EventT<T> implements IRaisableEventT<T> {
    private _conditionalEventT;
    on(eventHandler: IEventHandlerT<T>): void;
    off(eventHandler: IEventHandlerT<T>): void;
    raise(data: T): void;
    raiseSafe(data: T): void;
}
