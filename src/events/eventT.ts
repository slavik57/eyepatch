import { IEventHandlerT } from './interfaces/iEventHandler';
import { IRaisableEventT } from './interfaces/iRaisableEvent';
import { ConditionalEventT } from './conditionalEventT';

export class EventT<T> implements IRaisableEventT<T> {
  private _conditionalEventT: ConditionalEventT<T> = new ConditionalEventT<T>();

  public on(eventHandler: IEventHandlerT<T>): void {
    this._conditionalEventT.on(eventHandler);
  }

  public off(eventHandler: IEventHandlerT<T>): void {
    this._conditionalEventT.off(eventHandler);
  }

  public raise(data: T): void {
    this._conditionalEventT.raise(data);
  }

  public raiseSafe(data: T): void {
    this._conditionalEventT.raiseSafe(data);
  }
}
