import { IGlobalEvent } from "./interfaces/iGlobalEvent";
import { IEventHandlerT } from "./interfaces/iEventHandler";
export declare class GlobalEvent implements IGlobalEvent {
    private static _globalEventsMap;
    on(eventName: string, eventHandler: IEventHandlerT<any>): void;
    off(eventName: string, eventHandler: IEventHandlerT<any>): void;
    clearAllSubscribtions(eventName: string): void;
    raise(eventName: string, data?: any): void;
    raiseSafe(eventName: string, data?: any): void;
    private getEvent(eventName);
}
