import { IEventHandlerT } from './iEventHandler';
export interface IGlobalEvent {
    clearAllSubscribtions(eventName: string): void;
    on(eventName: string, eventHandler: IEventHandlerT<any>): void;
    off(eventName: string, eventHandler: IEventHandlerT<any>): void;
    raise(eventName: string, data?: any): void;
    raiseSafe(eventName: string, data?: any): void;
}
