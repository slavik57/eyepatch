import { IEventHandler } from './iEventHandler';
import { IRaisableEvent } from './iRaisableEvent';
export declare class Event implements IRaisableEvent {
    private _eventT;
    on(eventHandler: IEventHandler): void;
    off(eventHandler: IEventHandler): void;
    raise(): void;
    raiseSafe(): void;
}
