import {expect} from 'chai';
import {IObservableCollection} from './interfaces/iObservableCollection';
import {IItemsChangedEventArgs} from './interfaces/iItemsChangedEventArgs';
import {ObservableCollection} from './observableCollection';

interface ITestEventRegistration<T> {
  actualRaisedEventArgs: IItemsChangedEventArgs<T>[];
}

describe('ObservableCollection', () => {
  var observableCollection: IObservableCollection<any>;

  beforeEach(() => {
    observableCollection = new ObservableCollection<any>();
  });

  function createItem(id?: number): any {
    id = id || 0;

    return {
      itemId: id
    }
  }

  function verifyCollectionHasItems<T>(observableCollection: IObservableCollection<T>, items: T[]): void {
    verifyArraysAreWithSameItems(observableCollection.items, items);
  }

  function verifyArraysAreWithSameItems<T>(actual: T[], expected: T[]): void {
    expect(actual).to.have.length(expected.length);

    for (var i = 0; i < expected.length; i++) {
      var actualItem = actual[i];
      var expectedItem = expected[i];
      expect(actualItem).to.be.equal(expectedItem);
    }
  }

  function createItems(numberOfItems: number): any[] {
    var result = [];

    for (var i = 0; i < numberOfItems; i++) {
      var item = createItem(i);

      result.push(item);
    }

    return result;
  }

  function registerToItemsChangedEvent<T>(observableCollection: IObservableCollection<T>): ITestEventRegistration<T> {
    var result: ITestEventRegistration<T> = {
      actualRaisedEventArgs: []
    };

    observableCollection.itemsChanged.on(
      (_args: IItemsChangedEventArgs<T>) => {
        result.actualRaisedEventArgs.push(_args);
      }
    )

    return result;
  }

  function verifyItemsChangedEventsWereRaisedCorrectly<T>(eventRegistration: ITestEventRegistration<T>,
    expectedEvents: IItemsChangedEventArgs<any>[]) {

    expect(eventRegistration.actualRaisedEventArgs).to.have.length(expectedEvents.length);

    for (var i = 0; i < expectedEvents.length; i++) {
      var exepctedEventArgs: IItemsChangedEventArgs<T> = expectedEvents[i];
      var actualEventArgs: IItemsChangedEventArgs<T> = eventRegistration.actualRaisedEventArgs[i];

      verifyArraysAreWithSameItems(exepctedEventArgs.added, actualEventArgs.added);
      verifyArraysAreWithSameItems(exepctedEventArgs.removed, actualEventArgs.removed);
    }
  }

  describe('add', () => {
    it('adding items one by one should add them to the items', () => {
      // Arrange
      var item1 = createItem();
      var item2 = createItem();

      // Act
      observableCollection.add(item1);
      observableCollection.add(item2);

      // Assert
      verifyCollectionHasItems(observableCollection, [item1, item2]);
    });

    it('adding items should raise events correctly', () => {
      // Arrange
      var item1 = createItem();
      var item2 = createItem();

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.add(item1);
      observableCollection.add(item2);

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [item1],
          removed: []
        },
        {
          added: [item2],
          removed: []
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });
  });

  describe('addRange', () => {
    it('adding range should add the items to the items', () => {
      // Arrange
      var items = createItems(3);

      // Act
      observableCollection.addRange(items);

      // Assert
      verifyCollectionHasItems(observableCollection, items);
    });

    it('adding range should raise events correctly', () => {
      // Arrange
      var items = createItems(3);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.addRange(items);

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: items,
          removed: []
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });

    it('adding empty range should not raise events', () => {
      // Arrange
      var items = [];

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.addRange(items);

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });
  });

  describe('removeMatching', () => {
    it('removing non existing item should not throw error', () => {
      // Arrange
      var item = createItem();

      // Act
      var removeAction = () => observableCollection.removeMatching(item);

      // Assert
      expect(removeAction).to.not.throw();
    });

    it('removing non existing item should not raise events', () => {
      // Arrange
      var item = createItem();

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatching(item);

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('removing added items should remove them', () => {
      // Arrange
      var items = createItems(5);

      var itemToRemove = items[2];
      var expectedItems = [items[0], items[1], items[3], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatching(itemToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing item added multiple times should remove all', () => {
      // Arrange
      var items = createItems(5);
      var itemAppearingMultipleTimes = items[1];
      items.push(itemAppearingMultipleTimes);

      var expectedItems = [items[0], items[2], items[3], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatching(itemAppearingMultipleTimes);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing added items should raise events correctly', () => {
      // Arrange
      var items = createItems(5);

      var itemToRemove1 = items[1];
      var itemToRemove2 = items[3];

      observableCollection.addRange(items);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatching(itemToRemove1);
      observableCollection.removeMatching(itemToRemove2);

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: [itemToRemove1]
        },
        {
          added: [],
          removed: [itemToRemove2]
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });

    it('removing item added multiple times should raise events correctly', () => {
      // Arrange
      var items = createItems(5);
      var itemAppearingMultipleTimes = items[1];
      items.push(itemAppearingMultipleTimes);

      var itemToRemove2 = items[3];

      observableCollection.addRange(items);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatching(itemAppearingMultipleTimes);
      observableCollection.removeMatching(itemToRemove2);

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: [itemAppearingMultipleTimes, itemAppearingMultipleTimes]
        },
        {
          added: [],
          removed: [itemToRemove2]
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });
  });

  describe('removeMatchingRange', () => {
    it('removing with null/undefined should throw error', () => {
      // Arrange
      var nullItems = null;
      var undefinedItems = null;

      // Act
      var removeWithNullAction = () => observableCollection.removeMatchingRange(nullItems);
      var removeWithUndefinedAction = () => observableCollection.removeMatchingRange(undefinedItems);

      // Assert
      expect(removeWithNullAction).to.throw();
      expect(removeWithUndefinedAction).to.throw();
    });

    it('removing with null/undefined should not raise events', () => {
      // Arrange
      var nullItems = null;
      var undefinedItems = null;

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      var removeWithNullAction = () => observableCollection.removeMatchingRange(nullItems);
      var removeWithUndefinedAction = () => observableCollection.removeMatchingRange(undefinedItems);

      // Assert
      expect(removeWithNullAction).to.throw();
      expect(removeWithUndefinedAction).to.throw();
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('removing non existing items should not throw error', () => {
      // Arrange
      var items = createItems(3);

      // Act
      var removeAction = () => observableCollection.removeMatchingRange(items);

      // Assert
      expect(removeAction).to.not.throw();
    });

    it('removing non existing item should not raise events', () => {
      // Arrange
      var items = createItems(3);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatchingRange(items);

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('removing added items should remove them', () => {
      // Arrange
      var items = createItems(5);

      var itemsToRemove = [items[1], items[3]];
      var expectedItems = [items[0], items[2], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatchingRange(itemsToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing items added multiple times should remove them', () => {
      // Arrange
      var items = createItems(5);
      var itemAddedMultipleTimes = items[1];
      items.push(itemAddedMultipleTimes);

      var itemsToRemove = [items[1], items[3]];
      var expectedItems = [items[0], items[2], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatchingRange(itemsToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing added items should raise events correctly', () => {
      // Arrange
      var items = createItems(5);

      var itemsToRemove1 = [items[1], items[2]];
      var itemsToRemove2 = [items[3], items[4]];

      observableCollection.addRange(items);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatchingRange(itemsToRemove1);
      observableCollection.removeMatchingRange(itemsToRemove2);

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: itemsToRemove1
        },
        {
          added: [],
          removed: itemsToRemove2
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });

    it('removing items added multiple times should raise events correctly', () => {
      // Arrange
      var items = createItems(5);
      var itemAddedMultipleTimes = items[1];
      items.push(itemAddedMultipleTimes);

      var itemsToRemove1 = [itemAddedMultipleTimes, items[2]];
      var itemsToRemove2 = [items[3], items[4]];

      observableCollection.addRange(items);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatchingRange(itemsToRemove1);
      observableCollection.removeMatchingRange(itemsToRemove2);

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: [itemAddedMultipleTimes, items[2], itemAddedMultipleTimes]
        },
        {
          added: [],
          removed: itemsToRemove2
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });
  });

  describe('removeAtIndex', () => {
    it('removing non existing index should not throw error', () => {
      // Arrange
      var item = createItem();

      // Act
      var removeAction = () => observableCollection.removeAtIndex(0);

      // Assert
      expect(removeAction).to.not.throw();
    });

    it('removing non existing index should not raise events', () => {
      // Arrange
      var item = createItem();

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndex(123);

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('should remove item at index', () => {
      // Arrange
      var items = createItems(5);

      var itemIndexToRemove = 2;
      var expectedItems = [items[0], items[1], items[3], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndex(itemIndexToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing index of an item added multiple times should remove only one instance', () => {
      // Arrange
      var items = createItems(5);
      var itemAppearingMultipleTimes = items[1];
      items.push(itemAppearingMultipleTimes);

      var expectedItems = [items[0], items[2], items[3], items[4], itemAppearingMultipleTimes];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndex(1);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('should raise events correctly', () => {
      // Arrange
      var items = createItems(5);

      var itemToRemove1 = items[1];
      var itemToRemove2 = items[3];

      observableCollection.addRange(items);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndex(1);
      observableCollection.removeAtIndex(2);

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: [itemToRemove1]
        },
        {
          added: [],
          removed: [itemToRemove2]
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });

    it('removing index of an item added multiple times should raise events correctly', () => {
      // Arrange
      var items = createItems(5);
      var itemAppearingMultipleTimes = items[1];
      items.push(itemAppearingMultipleTimes);

      var itemToRemove2 = items[3];

      observableCollection.addRange(items);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndex(1);
      observableCollection.removeAtIndex(2);

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: [itemAppearingMultipleTimes]
        },
        {
          added: [],
          removed: [itemToRemove2]
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });
  });

  describe('removeAtIndices', () => {
    it('removing with null/undefined should throw error', () => {
      // Arrange
      var nullIndices = null;
      var undefinedIndices = null;

      // Act
      var removeWithNullAction = () => observableCollection.removeAtIndices(nullIndices);
      var removeWithUndefinedAction = () => observableCollection.removeAtIndices(undefinedIndices);

      // Assert
      expect(removeWithNullAction).to.throw();
      expect(removeWithUndefinedAction).to.throw();
    });

    it('removing with null/undefined should not raise events', () => {
      // Arrange
      var nullIndices = null;
      var undefinedIndices = null;

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      var removeWithNullAction = () => observableCollection.removeAtIndices(nullIndices);
      var removeWithUndefinedAction = () => observableCollection.removeAtIndices(undefinedIndices);

      // Assert
      expect(removeWithNullAction).to.throw();
      expect(removeWithUndefinedAction).to.throw();
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('removing non existing indexes should not throw error', () => {
      // Arrange
      var indices = [0, 123, 124, 1253];

      // Act
      var removeAction = () => observableCollection.removeAtIndices(indices);

      // Assert
      expect(removeAction).to.not.throw();
    });

    it('removing non existing indices should not raise events', () => {
      // Arrange
      var indices = [123, 4613];

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndices(indices);

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('removing at existing indices should remove correct items', () => {
      // Arrange
      var items = createItems(5);

      var indecesToRemove = [1, 3];
      var expectedItems = [items[0], items[2], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndices(indecesToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing indices of items added multiple times should remove only at specific places', () => {
      // Arrange
      var items = createItems(5);
      var itemIndex = 1;
      var itemAddedMultipleTimes = items[itemIndex];
      items.push(itemAddedMultipleTimes);

      var indicesToRemove = [itemIndex, 3];
      var expectedItems = [items[0], items[2], items[4], itemAddedMultipleTimes];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndices(indicesToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing existing indices should raise events correctly', () => {
      // Arrange
      var items = createItems(5);

      var itemsToRemove1 = [items[1], items[2]];
      var itemsToRemove2 = [items[3], items[4]];

      observableCollection.addRange(items);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndices([1, 2]);
      observableCollection.removeAtIndices([1, 2]);

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: itemsToRemove1
        },
        {
          added: [],
          removed: itemsToRemove2
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });

    it('removing indices of items added multiple times should raise events correctly', () => {
      // Arrange
      var items = createItems(5);
      var itemAddedMultipleTimes = items[1];
      items.push(itemAddedMultipleTimes);

      var itemsToRemove1 = [itemAddedMultipleTimes, items[2]];
      var itemsToRemove2 = [items[3], items[4]];

      observableCollection.addRange(items);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndices([1, 2]);
      observableCollection.removeAtIndices([1, 2]);

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: [itemAddedMultipleTimes, items[2]]
        },
        {
          added: [],
          removed: itemsToRemove2
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });
  });

  describe('clear', () => {
    it('calling clear on emtpy collection should not throw error', () => {
      // Act
      var clearAction = () => observableCollection.clear();

      // Assert
      expect(clearAction).to.not.throw();
    });

    it('calling clear on emtpy collection should not raise events', () => {
      // Arrange
      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.clear();

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('clearing collection with items should clear it', () => {
      // Arrange
      var items = createItems(5);

      observableCollection.addRange(items);

      // Act
      observableCollection.clear();

      // Assert
      verifyCollectionHasItems(observableCollection, []);
    });

    it('clearing collection with items appearing multiple times should clear it', () => {
      // Arrange
      var items = createItems(5);
      var itemAddedMultipleTimes = items[2];
      items.push(itemAddedMultipleTimes);

      observableCollection.addRange(items);

      // Act
      observableCollection.clear();

      // Assert
      verifyCollectionHasItems(observableCollection, []);
    });

    it('clearing collection with items should raise events correctly', () => {
      // Arrange
      var items = createItems(5);

      observableCollection.addRange(items);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.clear();

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: items
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });

    it('clearing collection with items added multiple times should raise events correctly', () => {
      // Arrange
      var items = createItems(5);
      var itemAddedMultipleTimes = items[2];
      items.push(itemAddedMultipleTimes);

      observableCollection.addRange(items);

      var eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.clear();

      // Assert
      var expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: items
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });
  });
});
