export interface IEventHandler {
    (): void;
}
export interface IEventHandlerT<T> {
    (data: T): void;
}
