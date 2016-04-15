import {IEventHandlerT} from './interfaces/iEventHandlerT';
import {IRaisableEventT} from './interfaces/iRaisableEventT';

export class EventT<T> implements IRaisableEventT<T> {
  private _eventHandlers: IEventHandlerT<T>[] = [];

  public on(eventHandler: IEventHandlerT<T>): void {
    if (!this._isEventHandlerRegistered(eventHandler)) {
      this._eventHandlers.push(eventHandler);
    }
  }

  public off(eventHandler: IEventHandlerT<T>): void {
    var indexOfEventHandler: number = this._eventHandlers.indexOf(eventHandler);

    this._eventHandlers.splice(indexOfEventHandler, 1);
  }

  public raise(data: T): void {
    this._eventHandlers.forEach(
      (_eventHandler: IEventHandlerT<T>) => {
        _eventHandler(data);
      }
    )
  }

  public raiseSafe(data: T): void {
    this._eventHandlers.forEach(
      (_eventHandler: IEventHandlerT<T>) => {
        this._callEventHandlerSafe(_eventHandler, data);
      }
    )
  }

  private _isEventHandlerRegistered(eventHandler: IEventHandlerT<T>): boolean {
    return this._eventHandlers.indexOf(eventHandler) >= 0;
  }

  private _callEventHandlerSafe(eventHandler: IEventHandlerT<T>, data: T): void {
    try {
      eventHandler(data);
    } catch (e) {
    }
  }
}
