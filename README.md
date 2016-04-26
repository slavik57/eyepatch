# eyepatch
A library of notification based objects

## Installation
```
npm install eyepatch
```

## Why?
Sometimes you just want to know when something happens without the need of checking it yourself. You just want to be notified when the change happens.

## Who?
Just me myself and I, in my free time

## Features
- Events - Simple or parametrized.
- ConditionalEvent - Simple or parametrized.
- ObservableCollection - notifies you when something changes.

## Languages
The library is written in TypeScript but you can use in both in TypeScript and JavaScript

## Usage examples in TypeScript

###### Using parametrized event:
```Typescript
var event = new EventT<number>();

event.on((_num: number) => console.log('The number ' + _num + ' was raised'));

event.raise(15);
```

###### Using conditional event
```Typescript
var conditionalEvent = new ConditionalEventT<number>();

conditionalEvent.on(
  (_num) => console.log('The number ' + _num + ' is positive'),
  (_num) => _num > 0
  );

conditionalEvent.raise(-1); // Will not be logged
conditionalEvent.raise(12); // Will be logged
```

###### Raising safely in case one of the registrations throws an error
```Typescript
var event = new Event();

event.on(() => throw 'some error');
event.on(() => console.log('I still want to log'));

event.raiseSafe();
```

###### Using ObservableCollection
```Typescript
var collection = new ObservableCollection<number>();

collection.itemsChanged.on(
  (_args: IItemsChangedEventArgs<number>) => {
    console.log('Added items: ' + _args.added);
    console.log('Removed items: ' + _args.removed);
  });

collection.add(2);
collection.addRange([1,2,3,4,5,6,7,8,9]);

collection.removeMatching(2);
collection.removeMatchingRange([5,6]);
collection.removeAtIndex(0);
collection.removeAtIndices([0,1]);

var size: number = collection.size;

var has7: boolean = collection.contains(7);

collection.clear();
```

## Whats next?
Have fun and feel free to use, comment, request, and contribute.
I'll keep adding stuff from time to time
