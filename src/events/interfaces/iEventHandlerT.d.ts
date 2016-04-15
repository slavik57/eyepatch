export interface IEventHandlerT<T> {
    (data: T): void;
}
