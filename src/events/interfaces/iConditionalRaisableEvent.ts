import {IConditionalEvent, IConditionalEventT} from './iConditionalEvent';

export interface IConditionalRaisableEvent extends IConditionalEvent {
  raise(): void;
  raiseSafe(): void;
}

export interface IConditionalRaisableEventT<T> extends IConditionalEventT<T> {
  raise(data: T): void;
  raiseSafe(data: T): void;
}
