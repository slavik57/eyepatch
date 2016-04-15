import {IEventHandler, IEventHandlerT} from './iEventHandler';

export interface IEvent {
  on(eventHandler: IEventHandler): void;
  off(eventHandler: IEventHandler): void;
}

export interface IEventT<T> {
  on(eventHandler: IEventHandlerT<T>): void;
  off(eventHandler: IEventHandlerT<T>): void;
}
