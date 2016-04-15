import { IEventHandlerT } from './iEventHandlerT';
import { IRaisableEventT } from './iRaisableEventT';
export declare class EventT<T> implements IRaisableEventT<T> {
    private _eventHandlers;
    on(eventHandler: IEventHandlerT<T>): void;
    off(eventHandler: IEventHandlerT<T>): void;
    raise(data: T): void;
    raiseSafe(data: T): void;
    private _isEventHandlerRegistered(eventHandler);
    private _callEventHandlerSafe(eventHandler, data);
}
