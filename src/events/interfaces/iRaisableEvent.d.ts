import { IEvent } from './iEvent';
export interface IRaisableEvent extends IEvent {
    raise(): void;
    raiseSafe(): void;
}
