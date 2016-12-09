import { IEvent, IEventT } from './iEvent';

export interface IRaisableEvent extends IEvent {
  raise(): void;
  raiseSafe(): void;
}

export interface IRaisableEventT<T> extends IEventT<T> {
  raise(data: T): void;
  raiseSafe(data: T): void;
}
