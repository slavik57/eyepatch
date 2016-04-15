export interface ICondition {
    (): boolean;
}
export interface IConditionT<T> {
    (data: T): boolean;
}
