import {IEventHandler} from './interfaces/iEventHandler';
import {ICondition} from './interfaces/iCondition';
import {IConditionalRaisableEvent} from './interfaces/iConditionalRaisableEvent';
import {ConditionalEventT} from './conditionalEventT';

export class ConditionalEvent implements IConditionalRaisableEvent {
  private _conditionalEventT = new ConditionalEventT<any>();

  public on(eventHandler: IEventHandler, condition?: ICondition): void {
    this._conditionalEventT.on(eventHandler, condition);
  }

  public off(eventHandler: IEventHandler, condition?: ICondition): void {
    this._conditionalEventT.off(eventHandler, condition);
  }

  public raise(): void {
    this._conditionalEventT.raise({});
  }

  public raiseSafe(): void {
    this._conditionalEventT.raiseSafe({});
  }

}
