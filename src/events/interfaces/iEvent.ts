import {IEventHandler} from './iEventHandler';

export interface IEvent {
  on(eventHandler: IEventHandler): void;
  off(eventHandler: IEventHandler): void;
}
