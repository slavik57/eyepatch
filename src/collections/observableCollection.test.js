"use strict";
var chai_1 = require('chai');
var observableCollection_1 = require('./observableCollection');
describe('ObservableCollection', function () {
    var observableCollection;
    beforeEach(function () {
        observableCollection = new observableCollection_1.ObservableCollection();
    });
    function createItem(id) {
        id = id || 0;
        return {
            itemId: id
        };
    }
    function verifyCollectionHasItems(observableCollection, items) {
        verifyArraysAreWithSameItems(observableCollection.items, items);
    }
    function verifyArraysAreWithSameItems(actual, expected) {
        chai_1.expect(actual).to.have.length(expected.length);
        for (var i = 0; i < expected.length; i++) {
            var actualItem = actual[i];
            var expectedItem = expected[i];
            chai_1.expect(actualItem).to.be.equal(expectedItem);
        }
    }
    function createItems(numberOfItems) {
        var result = [];
        for (var i = 0; i < numberOfItems; i++) {
            var item = createItem(i);
            result.push(item);
        }
        return result;
    }
    function registerToItemsChangedEvent(observableCollection) {
        var result = {
            actualRaisedEventArgs: []
        };
        observableCollection.itemsChanged.on(function (_args) {
            result.actualRaisedEventArgs.push(_args);
        });
        return result;
    }
    function verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents) {
        chai_1.expect(eventRegistration.actualRaisedEventArgs).to.have.length(expectedEvents.length);
        for (var i = 0; i < expectedEvents.length; i++) {
            var exepctedEventArgs = expectedEvents[i];
            var actualEventArgs = eventRegistration.actualRaisedEventArgs[i];
            verifyArraysAreWithSameItems(exepctedEventArgs.added, actualEventArgs.added);
            verifyArraysAreWithSameItems(exepctedEventArgs.removed, actualEventArgs.removed);
        }
    }
    describe('add', function () {
        it('adding items one by one should add them to the items', function () {
            var item1 = createItem();
            var item2 = createItem();
            observableCollection.add(item1);
            observableCollection.add(item2);
            verifyCollectionHasItems(observableCollection, [item1, item2]);
        });
        it('adding items should raise events correctly', function () {
            var item1 = createItem();
            var item2 = createItem();
            var eventRegistration = registerToItemsChangedEvent(observableCollection);
            observableCollection.add(item1);
            observableCollection.add(item2);
            var expectedEvents = [
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
    describe('addRange', function () {
        it('adding range should add the items to the items', function () {
            var items = createItems(3);
            observableCollection.addRange(items);
            verifyCollectionHasItems(observableCollection, items);
        });
        it('adding range should raise events correctly', function () {
            var items = createItems(3);
            var eventRegistration = registerToItemsChangedEvent(observableCollection);
            observableCollection.addRange(items);
            var expectedEvents = [
                {
                    added: items,
                    removed: []
                }
            ];
            verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
        });
        it('adding empty range should not raise events', function () {
            var items = [];
            var eventRegistration = registerToItemsChangedEvent(observableCollection);
            observableCollection.addRange(items);
            verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
        });
    });
    describe('remove', function () {
        it('removing non existing item should not throw error', function () {
            var item = createItem();
            var removeAction = function () { return observableCollection.remove(item); };
            chai_1.expect(removeAction).to.not.throw();
        });
        it('removing non existing item should not raise events', function () {
            var item = createItem();
            var eventRegistration = registerToItemsChangedEvent(observableCollection);
            observableCollection.remove(item);
            verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
        });
        it('removing added items should remove them', function () {
            var items = createItems(5);
            var itemToRemove = items[2];
            var expectedItems = [items[0], items[1], items[3], items[4]];
            observableCollection.addRange(items);
            observableCollection.remove(itemToRemove);
            verifyCollectionHasItems(observableCollection, expectedItems);
        });
        it('removing added items should raise events correctly', function () {
            var items = createItems(5);
            var itemToRemove1 = items[1];
            var itemToRemove2 = items[3];
            observableCollection.addRange(items);
            var eventRegistration = registerToItemsChangedEvent(observableCollection);
            observableCollection.remove(itemToRemove1);
            observableCollection.remove(itemToRemove2);
            var expectedEvents = [
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
    });
    describe('removeRange', function () {
        it('removing with null/undefined should throw error', function () {
            var nullItems = null;
            var undefinedItems = null;
            var removeWithNullAction = function () { return observableCollection.removeRange(nullItems); };
            var removeWithUndefinedAction = function () { return observableCollection.removeRange(undefinedItems); };
            chai_1.expect(removeWithNullAction).to.throw();
            chai_1.expect(removeWithUndefinedAction).to.throw();
        });
        it('removing with null/undefined should not raise events', function () {
            var nullItems = null;
            var undefinedItems = null;
            var eventRegistration = registerToItemsChangedEvent(observableCollection);
            var removeWithNullAction = function () { return observableCollection.removeRange(nullItems); };
            var removeWithUndefinedAction = function () { return observableCollection.removeRange(undefinedItems); };
            chai_1.expect(removeWithNullAction).to.throw();
            chai_1.expect(removeWithUndefinedAction).to.throw();
            verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
        });
        it('removing non existing items should not throw error', function () {
            var items = createItems(3);
            var removeAction = function () { return observableCollection.removeRange(items); };
            chai_1.expect(removeAction).to.not.throw();
        });
        it('removing non existing item should not raise events', function () {
            var items = createItems(3);
            var eventRegistration = registerToItemsChangedEvent(observableCollection);
            observableCollection.removeRange(items);
            verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
        });
        it('removing added items should remove them', function () {
            var items = createItems(5);
            var itemsToRemove = [items[1], items[3]];
            var expectedItems = [items[0], items[2], items[4]];
            observableCollection.addRange(items);
            observableCollection.removeRange(itemsToRemove);
            verifyCollectionHasItems(observableCollection, expectedItems);
        });
        it('removing added items should raise events correctly', function () {
            var items = createItems(5);
            var itemsToRemove1 = [items[1], items[2]];
            var itemsToRemove2 = [items[3], items[4]];
            observableCollection.addRange(items);
            var eventRegistration = registerToItemsChangedEvent(observableCollection);
            observableCollection.removeRange(itemsToRemove1);
            observableCollection.removeRange(itemsToRemove2);
            var expectedEvents = [
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
    });
    describe('clear', function () {
        it('calling clear on emtpy collection should not throw error', function () {
            var clearAction = function () { return observableCollection.clear(); };
            chai_1.expect(clearAction).to.not.throw();
        });
        it('calling clear on emtpy collection should not raise events', function () {
            var eventRegistration = registerToItemsChangedEvent(observableCollection);
            observableCollection.clear();
            verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, []);
        });
        it('clearing collection with items should clear it', function () {
            var items = createItems(5);
            observableCollection.addRange(items);
            observableCollection.clear();
            verifyCollectionHasItems(observableCollection, []);
        });
        it('clearing collection with items should raise events correctly', function () {
            var items = createItems(5);
            observableCollection.addRange(items);
            var eventRegistration = registerToItemsChangedEvent(observableCollection);
            observableCollection.clear();
            var expectedEvents = [
                {
                    added: [],
                    removed: items
                }
            ];
            verifyItemsChangedEventsWereRaisedCorrectly(eventRegistration, expectedEvents);
        });
    });
});
