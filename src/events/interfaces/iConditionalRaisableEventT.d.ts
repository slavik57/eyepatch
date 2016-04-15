import { IConditinalEventT } from './iConditionalEventT';
export interface IConditionalRaisableEventT<T> extends IConditinalEventT<T> {
    raise(data: T): void;
    raiseSafe(data: T): void;
}
