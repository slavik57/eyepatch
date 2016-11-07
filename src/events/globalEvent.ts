import {EventT} from "./eventT";
import {IGlobalEvent} from "./interfaces/iGlobalEvent";
import {IRaisableEventT} from "./interfaces/iRaisableEvent";
import {IEventHandlerT} from "./interfaces/iEventHandler";

export class GlobalEvent implements IGlobalEvent {
  public static globalEventsMap: { [key: string]: IRaisableEventT<any> } = {};

  public on(eventName: string, eventHandler: IEventHandlerT<any>): void {
    let event: IRaisableEventT<any> = this.getEvent(eventName);
    if (!event) {
      event = new EventT<any>();
      GlobalEvent.globalEventsMap[eventName] = event;
    }

    event.on(eventHandler);
  }

  public off(eventName: string, eventHandler: IEventHandlerT<any>): void {
    const event: IRaisableEventT<any> = this.getEvent(eventName);
    if (event) {
      event.off(eventHandler);
    }
  }

  public clearAllSubscribtions(eventName: string): void {
    if (!!this.getEvent(eventName)) {
      delete GlobalEvent.globalEventsMap[eventName];
    }
  }

  public raise(eventName: string, data?: any): void {
    const event: IRaisableEventT<any> = this.getEvent(eventName);
    if (event) {
      event.raise(data);
    }
  }

  public raiseSafe(eventName: string, data?: any): void {
    const event: IRaisableEventT<any> = this.getEvent(eventName);
    if (event) {
      event.raiseSafe(data);
    }
  }

  private getEvent(eventName): IRaisableEventT<any> {
    return GlobalEvent.globalEventsMap[eventName];
  }
}
