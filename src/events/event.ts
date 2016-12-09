import { IEventHandler } from './interfaces/iEventHandler';
import { IRaisableEvent } from './interfaces/iRaisableEvent';
import { EventT } from './eventT';

export class Event implements IRaisableEvent {
  private _eventT: EventT<any> = new EventT<any>();

  public on(eventHandler: IEventHandler): void {
    this._eventT.on(eventHandler);
  }

  public off(eventHandler: IEventHandler): void {
    this._eventT.off(eventHandler);
  }

  public raise(): void {
    this._eventT.raise({});
  }

  public raiseSafe(): void {
    this._eventT.raiseSafe({});
  }
}
