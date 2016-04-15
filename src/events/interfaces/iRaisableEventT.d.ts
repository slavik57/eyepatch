import { IEventT } from './iEventT';
export interface IRaisableEventT<T> extends IEventT<T> {
    raise(data: T): void;
    raiseSafe(data: T): void;
}
