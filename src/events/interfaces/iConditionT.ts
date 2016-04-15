export interface IConditionT<T> {
  (data: T) : boolean;
}
