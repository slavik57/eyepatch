import { IEventHandler } from './interfaces/iEventHandler';
import { ICondition } from './interfaces/iCondition';
import { IConditionalRaisableEvent } from './interfaces/iConditionalRaisableEvent';
export declare class ConditionalEvent implements IConditionalRaisableEvent {
    private _conditionalEventT;
    on(eventHandler: IEventHandler, condition?: ICondition): void;
    off(eventHandler: IEventHandler, condition?: ICondition): void;
    raise(): void;
    raiseSafe(): void;
}
