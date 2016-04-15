import {IConditionalEventT} from './iConditionalEventT';

export interface IConditionalRaisableEventT<T> extends IConditionalEventT<T> {
  raise(data: T): void;
  raiseSafe(data: T): void;
}
