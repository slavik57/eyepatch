import { IConditionalEventT } from './iConditionalEvent';
export interface IConditionalRaisableEventT<T> extends IConditionalEventT<T> {
    raise(data: T): void;
    raiseSafe(data: T): void;
}
