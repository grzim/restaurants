import {startWith} from 'rxjs/operators';

export type AccSet<T> = (acc: T[]) => () => T[];
export type AccAdd<T> = (item: T) => (acc: T[]) => T[];
export type AccRemove<T> = ({id}: {id: string}) => (acc: T[]) => T[];
export type AccEdit<T> = (item: T) => (acc: T[]) => T[];
type Transformation<T> = (item: T | T[]) => T[];
export type TransformationApplicator<T> = (acc: T[], transform: Transformation<T>) => T[];
export const identity = x => x;
export const not = fn => (...args) => !fn(...args);
export const negate = x => !x;
export const takeLatest = ([_, x]) => x;
export const equal = (a, b) => {
  const aEntries = Object.entries(a);
  const bEntries = Object.entries(b);
  const haveTheSameLength = (aEntries.length === bEntries.length);
  const haveTheSameKeyValuePairs = !aEntries.find(([key, value]) => bEntries[key] !== value);
  return haveTheSameLength && haveTheSameKeyValuePairs;
};
export const applyEditedRestaurantData = editedRestaurant => restaurantsData =>
  restaurantsData.map(restaurant => restaurant.id === editedRestaurant?.id ? {
    ...restaurant,
    ...editedRestaurant
  } : restaurant);
export const applyTransformation = (acc, transformation) => transformation(acc);
export const setAcc = (data) => () => data;
export const addToAcc = item => acc => [item, ...acc];
export const removeFromAcc = ({id}) => acc => acc.filter(item => item.id !== id);
export const editAcc = item => acc =>
  acc.map(elem => elem.id === item?.id ? {
    ...elem,
    ...item
  } : elem);
export const mockData = startWith;
export const isNil = (val: any): val is null | undefined => typeof val === 'undefined' || val === null;
export const isNotNil = (val: any): boolean => typeof val !== 'undefined' && val !== null;
export type ValueOrArray<T> = T | T[];
export const flatten = <T>(arr: ValueOrArray<ValueOrArray<ValueOrArray<ValueOrArray<T>>>>): T[] =>
  Array.isArray(arr) ? [].concat(...(arr as ValueOrArray<T>[]).map(flatten)) as T[] : [arr] as T[];
export const ensureArray = <T>(x: ValueOrArray<T>): T[] => (isNil(x) ? [] : Array.isArray(x) ? x : [x]) as T[];
