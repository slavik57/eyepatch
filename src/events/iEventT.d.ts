import { IEventHandlerT } from './iEventHandlerT';
export interface IEventT<T> {
    on(eventHandler: IEventHandlerT<T>): void;
    off(eventHandler: IEventHandlerT<T>): void;
}
