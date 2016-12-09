import {expect} from 'chai';
import {IObservableCollection} from './interfaces/iObservableCollection';
import {IItemsChangedEventArgs} from './interfaces/iItemsChangedEventArgs';
import {ObservableCollection} from './observableCollection';

interface ITestEventRegistration<T> {
  actualRaisedEventArgs: IItemsChangedEventArgs<T>[];
}

describe('ObservableCollection', () => {
  let observableCollection: IObservableCollection<any>;

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

    for (let i = 0; i < expected.length; i++) {
      const actualItem = actual[i];
      const expectedItem = expected[i];
      expect(actualItem).to.be.equal(expectedItem);
    }
  }

  function createItems(numberOfItems: number): any[] {
    const result = [];

    for (let i = 0; i < numberOfItems; i++) {
      const item = createItem(i);

      result.push(item);
    }

    return result;
  }

  function registerToItemsChangedEvent<T>(observableCollection: IObservableCollection<T>): ITestEventRegistration<T> {
    const result: ITestEventRegistration<T> = {
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

    for (let i = 0; i < expectedEvents.length; i++) {
      const exepctedEventArgs: IItemsChangedEventArgs<T> = expectedEvents[i];
      const actualEventArgs: IItemsChangedEventArgs<T> = eventRegistration.actualRaisedEventArgs[i];

      verifyArraysAreWithSameItems(exepctedEventArgs.added, actualEventArgs.added);
      verifyArraysAreWithSameItems(exepctedEventArgs.removed, actualEventArgs.removed);
    }
  }

  describe('constructor', () => {
    it('should initialize size correctly', () => {
      // Act
      const observableCollection = new ObservableCollection<any>();

      // Assert
      expect(observableCollection.size).to.be.equal(0);
    });
  });

  describe('add', () => {
    it('adding items one by one should add them to the items', () => {
      // Arrange
      const item1 = createItem();
      const item2 = createItem();

      // Act
      observableCollection.add(item1);
      observableCollection.add(item2);

      // Assert
      verifyCollectionHasItems(observableCollection, [item1, item2]);
    });

    it('adding items should raise events correctly', () => {
      // Arrange
      const item1 = createItem();
      const item2 = createItem();

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.add(item1);
      observableCollection.add(item2);

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
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

    it('adding items one by one should set size correctly', () => {
      // Arrange
      const item1 = createItem();
      const item2 = createItem();

      // Act
      observableCollection.add(item1);
      observableCollection.add(item2);

      // Assert
      expect(observableCollection.size).to.be.equal(2);
    });
  });

  describe('addRange', () => {
    it('adding range should add the items to the items', () => {
      // Arrange
      const items = createItems(3);

      // Act
      observableCollection.addRange(items);

      // Assert
      verifyCollectionHasItems(observableCollection, items);
    });

    it('adding range should raise events correctly', () => {
      // Arrange
      const items = createItems(3);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.addRange(items);

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: items,
          removed: []
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });

    it('adding empty range should not raise events', () => {
      // Arrange
      const items = [];

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.addRange(items);

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('adding range should set size correctly', () => {
      // Arrange
      const numberOfItems = 3;
      const items = createItems(numberOfItems);

      // Act
      observableCollection.addRange(items);

      // Assert
      expect(observableCollection.size).to.be.equal(numberOfItems);
    });
  });

  describe('removeMatching', () => {
    it('removing non existing item should not throw error', () => {
      // Arrange
      const item = createItem();

      // Act
      const removeAction = () => observableCollection.removeMatching(item);

      // Assert
      expect(removeAction).to.not.throw();
    });

    it('removing non existing item should not raise events', () => {
      // Arrange
      const item = createItem();

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatching(item);

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('removing added items should remove them', () => {
      // Arrange
      const items = createItems(5);

      const itemToRemove = items[2];
      const expectedItems = [items[0], items[1], items[3], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatching(itemToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing item added multiple times should remove all', () => {
      // Arrange
      const items = createItems(5);
      const itemAppearingMultipleTimes = items[1];
      items.push(itemAppearingMultipleTimes);

      const expectedItems = [items[0], items[2], items[3], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatching(itemAppearingMultipleTimes);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing added items should raise events correctly', () => {
      // Arrange
      const items = createItems(5);

      const itemToRemove1 = items[1];
      const itemToRemove2 = items[3];

      observableCollection.addRange(items);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatching(itemToRemove1);
      observableCollection.removeMatching(itemToRemove2);

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
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
      const items = createItems(5);
      const itemAppearingMultipleTimes = items[1];
      items.push(itemAppearingMultipleTimes);

      const itemToRemove2 = items[3];

      observableCollection.addRange(items);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatching(itemAppearingMultipleTimes);
      observableCollection.removeMatching(itemToRemove2);

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
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

    it('removing non existing item should not change size', () => {
      // Arrange
      const item1 = createItem();
      const item2 = createItem();

      observableCollection.add(item1);
      // Act
      observableCollection.removeMatching(item2);

      // Assert
      expect(observableCollection.size).to.be.equal(1);
    });

    it('removing added items should set size correctly', () => {
      // Arrange
      const items = createItems(5);

      const itemToRemove = items[2];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatching(itemToRemove);

      // Assert
      expect(observableCollection.size).to.be.equal(4);
    });

    it('removing item added multiple times should set size correctly', () => {
      // Arrange
      const items = createItems(5);
      const itemAppearingMultipleTimes = items[1];
      items.push(itemAppearingMultipleTimes);

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatching(itemAppearingMultipleTimes);

      // Assert
      expect(observableCollection.size).to.be.equal(4);
    });
  });

  describe('removeMatchingRange', () => {
    it('removing with null/undefined should throw error', () => {
      // Arrange
      const nullItems = null;
      const undefinedItems = null;

      // Act
      const removeWithNullAction = () => observableCollection.removeMatchingRange(nullItems);
      const removeWithUndefinedAction = () => observableCollection.removeMatchingRange(undefinedItems);

      // Assert
      expect(removeWithNullAction).to.throw();
      expect(removeWithUndefinedAction).to.throw();
    });

    it('removing with null/undefined should not raise events', () => {
      // Arrange
      const nullItems = null;
      const undefinedItems = null;

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      const removeWithNullAction = () => observableCollection.removeMatchingRange(nullItems);
      const removeWithUndefinedAction = () => observableCollection.removeMatchingRange(undefinedItems);

      // Assert
      expect(removeWithNullAction).to.throw();
      expect(removeWithUndefinedAction).to.throw();
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('removing non existing items should not throw error', () => {
      // Arrange
      const items = createItems(3);

      // Act
      const removeAction = () => observableCollection.removeMatchingRange(items);

      // Assert
      expect(removeAction).to.not.throw();
    });

    it('removing non existing item should not raise events', () => {
      // Arrange
      const items = createItems(3);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatchingRange(items);

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('removing added items should remove them', () => {
      // Arrange
      const items = createItems(5);

      const itemsToRemove = [items[1], items[3]];
      const expectedItems = [items[0], items[2], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatchingRange(itemsToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing items added multiple times should remove them', () => {
      // Arrange
      const items = createItems(5);
      const itemAddedMultipleTimes = items[1];
      items.push(itemAddedMultipleTimes);

      const itemsToRemove = [items[1], items[3]];
      const expectedItems = [items[0], items[2], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatchingRange(itemsToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing added items should raise events correctly', () => {
      // Arrange
      const items = createItems(5);

      const itemsToRemove1 = [items[1], items[2]];
      const itemsToRemove2 = [items[3], items[4]];

      observableCollection.addRange(items);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatchingRange(itemsToRemove1);
      observableCollection.removeMatchingRange(itemsToRemove2);

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
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
      const items = createItems(5);
      const itemAddedMultipleTimes = items[1];
      items.push(itemAddedMultipleTimes);

      const itemsToRemove1 = [itemAddedMultipleTimes, items[2]];
      const itemsToRemove2 = [items[3], items[4]];

      observableCollection.addRange(items);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeMatchingRange(itemsToRemove1);
      observableCollection.removeMatchingRange(itemsToRemove2);

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
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

    it('removing non existing items should set size correctly', () => {
      // Arrange
      const items1 = createItems(2);
      observableCollection.addRange(items1);

      const items2 = createItems(3);

      // Act
      observableCollection.removeMatchingRange(items2);

      // Assert
      expect(observableCollection.size).to.be.equal(2);
    });

    it('removing added items should set size correctly', () => {
      // Arrange
      const items = createItems(5);

      const itemsToRemove = [items[1], items[3]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatchingRange(itemsToRemove);

      // Assert
      expect(observableCollection.size).to.be.equal(3);
    });

    it('removing items added multiple times should set size correctly', () => {
      // Arrange
      const items = createItems(5);
      const itemAddedMultipleTimes = items[1];
      items.push(itemAddedMultipleTimes);

      const itemsToRemove = [items[1], items[3]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeMatchingRange(itemsToRemove);

      // Assert
      expect(observableCollection.size).to.be.equal(3);
    });
  });

  describe('removeAtIndex', () => {
    it('removing non existing index should not throw error', () => {
      // Arrange
      const item = createItem();

      // Act
      const removeAction = () => observableCollection.removeAtIndex(0);

      // Assert
      expect(removeAction).to.not.throw();
    });

    it('removing non existing index should not raise events', () => {
      // Arrange
      const item = createItem();

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndex(123);

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('should remove item at index', () => {
      // Arrange
      const items = createItems(5);

      const itemIndexToRemove = 2;
      const expectedItems = [items[0], items[1], items[3], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndex(itemIndexToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing index of an item added multiple times should remove only one instance', () => {
      // Arrange
      const items = createItems(5);
      const itemAppearingMultipleTimes = items[1];
      items.push(itemAppearingMultipleTimes);

      const expectedItems = [items[0], items[2], items[3], items[4], itemAppearingMultipleTimes];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndex(1);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('should raise events correctly', () => {
      // Arrange
      const items = createItems(5);

      const itemToRemove1 = items[1];
      const itemToRemove2 = items[3];

      observableCollection.addRange(items);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndex(1);
      observableCollection.removeAtIndex(2);

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
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
      const items = createItems(5);
      const itemAppearingMultipleTimes = items[1];
      items.push(itemAppearingMultipleTimes);

      const itemToRemove2 = items[3];

      observableCollection.addRange(items);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndex(1);
      observableCollection.removeAtIndex(2);

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
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

    it('removing non existing index should set size correctly', () => {
      // Arrange
      const item1 = createItem();
      observableCollection.add(item1);

      // Act
      observableCollection.removeAtIndex(10);

      // Assert
      expect(observableCollection.size).to.be.equal(1);
    });

    it('remove item at index should set size correctly', () => {
      // Arrange
      const items = createItems(5);

      const itemIndexToRemove = 2;

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndex(itemIndexToRemove);

      // Assert
      expect(observableCollection.size).to.be.equal(4);
    });

    it('removing index of an item added multiple times should set size correctly', () => {
      // Arrange
      const items = createItems(5);
      const itemAppearingMultipleTimes = items[1];
      items.push(itemAppearingMultipleTimes);

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndex(1);

      // Assert
      expect(observableCollection.size).to.be.equal(5);
    });
  });

  describe('removeAtIndices', () => {
    it('removing with null/undefined should throw error', () => {
      // Arrange
      const nullIndices = null;
      const undefinedIndices = null;

      // Act
      const removeWithNullAction = () => observableCollection.removeAtIndices(nullIndices);
      const removeWithUndefinedAction = () => observableCollection.removeAtIndices(undefinedIndices);

      // Assert
      expect(removeWithNullAction).to.throw();
      expect(removeWithUndefinedAction).to.throw();
    });

    it('removing with null/undefined should not raise events', () => {
      // Arrange
      const nullIndices = null;
      const undefinedIndices = null;

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      const removeWithNullAction = () => observableCollection.removeAtIndices(nullIndices);
      const removeWithUndefinedAction = () => observableCollection.removeAtIndices(undefinedIndices);

      // Assert
      expect(removeWithNullAction).to.throw();
      expect(removeWithUndefinedAction).to.throw();
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('removing non existing indexes should not throw error', () => {
      // Arrange
      const indices = [0, 123, 124, 1253];

      // Act
      const removeAction = () => observableCollection.removeAtIndices(indices);

      // Assert
      expect(removeAction).to.not.throw();
    });

    it('removing non existing indices should not raise events', () => {
      // Arrange
      const indices = [123, 4613];

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndices(indices);

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('removing at existing indices should remove correct items', () => {
      // Arrange
      const items = createItems(5);

      const indecesToRemove = [1, 3];
      const expectedItems = [items[0], items[2], items[4]];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndices(indecesToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing indices of items added multiple times should remove only at specific places', () => {
      // Arrange
      const items = createItems(5);
      const itemIndex = 1;
      const itemAddedMultipleTimes = items[itemIndex];
      items.push(itemAddedMultipleTimes);

      const indicesToRemove = [itemIndex, 3];
      const expectedItems = [items[0], items[2], items[4], itemAddedMultipleTimes];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndices(indicesToRemove);

      // Assert
      verifyCollectionHasItems(observableCollection, expectedItems);
    });

    it('removing existing indices should raise events correctly', () => {
      // Arrange
      const items = createItems(5);

      const itemsToRemove1 = [items[1], items[2]];
      const itemsToRemove2 = [items[3], items[4]];

      observableCollection.addRange(items);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndices([1, 2]);
      observableCollection.removeAtIndices([1, 2]);

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
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
      const items = createItems(5);
      const itemAddedMultipleTimes = items[1];
      items.push(itemAddedMultipleTimes);

      const itemsToRemove1 = [itemAddedMultipleTimes, items[2]];
      const itemsToRemove2 = [items[3], items[4]];

      observableCollection.addRange(items);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.removeAtIndices([1, 2]);
      observableCollection.removeAtIndices([1, 2]);

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
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

    it('removing non existing indexes should set size correctly', () => {
      // Arrange
      const indices = [10, 123, 124, 1253];

      observableCollection.add(createItem());

      // Act
      observableCollection.removeAtIndices(indices);

      // Assert
      expect(observableCollection.size).to.be.equal(1);
    });

    it('removing at existing indices should set size correctly', () => {
      // Arrange
      const items = createItems(5);

      const indecesToRemove = [1, 3];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndices(indecesToRemove);

      // Assert
      expect(observableCollection.size).to.be.equal(3);
    });

    it('removing indices of items added multiple times should remove only at specific places', () => {
      // Arrange
      const items = createItems(5);
      const itemIndex = 1;
      const itemAddedMultipleTimes = items[itemIndex];
      items.push(itemAddedMultipleTimes);

      const indicesToRemove = [itemIndex, 3];

      observableCollection.addRange(items);

      // Act
      observableCollection.removeAtIndices(indicesToRemove);

      // Assert
      expect(observableCollection.size).to.be.equal(4);
    });
  });

  describe('clear', () => {
    it('calling clear on emtpy collection should not throw error', () => {
      // Act
      const clearAction = () => observableCollection.clear();

      // Assert
      expect(clearAction).to.not.throw();
    });

    it('calling clear on emtpy collection should not raise events', () => {
      // Arrange
      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.clear();

      // Assert
      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
    });

    it('clearing collection with items should clear it', () => {
      // Arrange
      const items = createItems(5);

      observableCollection.addRange(items);

      // Act
      observableCollection.clear();

      // Assert
      verifyCollectionHasItems(observableCollection, []);
    });

    it('clearing collection with items appearing multiple times should clear it', () => {
      // Arrange
      const items = createItems(5);
      const itemAddedMultipleTimes = items[2];
      items.push(itemAddedMultipleTimes);

      observableCollection.addRange(items);

      // Act
      observableCollection.clear();

      // Assert
      verifyCollectionHasItems(observableCollection, []);
    });

    it('clearing collection with items should raise events correctly', () => {
      // Arrange
      const items = createItems(5);

      observableCollection.addRange(items);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.clear();

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: items
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });

    it('clearing collection with items added multiple times should raise events correctly', () => {
      // Arrange
      const items = createItems(5);
      const itemAddedMultipleTimes = items[2];
      items.push(itemAddedMultipleTimes);

      observableCollection.addRange(items);

      const eventRegistration =
        registerToItemsChangedEvent(observableCollection);

      // Act
      observableCollection.clear();

      // Assert
      const expectedEvents: IItemsChangedEventArgs<any>[] = [
        {
          added: [],
          removed: items
        }
      ];

      verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
    });

    it('calling clear on emtpy collection should set size correctly', () => {
      // Act
      observableCollection.clear();

      // Assert
      expect(observableCollection.size).to.be.equal(0);
    });

    it('clearing collection with items should set size correctly', () => {
      // Arrange
      const items = createItems(5);

      observableCollection.addRange(items);

      // Act
      observableCollection.clear();

      // Assert
      expect(observableCollection.size).to.be.equal(0);
    });

    it('clearing collection with items appearing multiple times should set size correctly', () => {
      // Arrange
      const items = createItems(5);
      const itemAddedMultipleTimes = items[2];
      items.push(itemAddedMultipleTimes);

      observableCollection.addRange(items);

      // Act
      observableCollection.clear();

      // Assert
      expect(observableCollection.size).to.be.equal(0);
    });
  });

  describe('contains', () => {
    it('empty collection, should return false', () => {
      // Arrange
      const item = {};

      // Act
      const result = observableCollection.contains(item);

      // Assert
      expect(result).to.be.false;
    });

    it('no such item, should return false', () => {
      // Arrange
      const items = createItems(5);
      observableCollection.addRange(items);

      const item = {};

      // Act
      const result = observableCollection.contains(item);

      // Assert
      expect(result).to.be.false;
    });

    it('item inside the collection, should return true', () => {
      // Arrange
      const item = {};
      const items = createItems(5);
      items.push(item);

      observableCollection.addRange(items);

      // Act
      const result = observableCollection.contains(item);

      // Assert
      expect(result).to.be.true;
    });
  });
});
