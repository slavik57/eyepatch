"use strict";
var chai_1 = require('chai');
var observableDictionary_1 = require('./observableDictionary');
describe('ObservableDictionary', function () {
    var observableDictionary;
    beforeEach(function () {
        observableDictionary = new observableDictionary_1.ObservableDictionary();
    });
    function createKeyValuePairs(numberOfPairs) {
        var result = [];
        for (var i = 0; i < numberOfPairs; i++) {
            var key = { keyItem: i };
            var value = { valueItem: i };
            result.push({
                key: key,
                value: value
            });
        }
        return result;
    }
    function getPropertiesAndValues(object) {
        var result = [];
        for (var property in object) {
            result.push({
                property: property,
                value: object[property]
            });
        }
        return result;
    }
    function verifySamePropertiesAndValues(actual, expected) {
        chai_1.expect(actual).to.be.length(expected.length);
        for (var i = 0; i < expected.length; i++) {
            var actualPropery = actual[i].property;
            var actualValue = actual[i].value;
            var expectedProperty = expected[i].property;
            var expectedValue = expected[i].value;
            chai_1.expect(actualPropery).to.be.equal(expectedProperty);
            chai_1.expect(actualValue).to.be.equal(expectedValue);
        }
    }
    function registerToItemsChangedEvent(observableDictionary) {
        var actualArgs = [];
        observableDictionary.itemsChanged.on(function (_args) {
            actualArgs.push(_args);
        });
        return actualArgs;
    }
    function verifyItemsChangedWasRaisedCorrectly(actual, expected) {
        chai_1.expect(actual).to.be.length(expected.length);
        for (var i = 0; i < expected.length; i++) {
            var actualArg = actual[i];
            var expectedArg = expected[i];
            veriftyItemsChangedEventArgsAreEqual(actualArg, expectedArg);
        }
    }
    function veriftyItemsChangedEventArgsAreEqual(actual, expected) {
        verifyKeyValuesEqual(actual.added, expected.added);
        verifyKeyValuesEqual(actual.removed, expected.removed);
    }
    function verifyKeyValuesEqual(actual, expected) {
        chai_1.expect(actual).to.be.length(expected.length);
        for (var i = 0; i < expected.length; i++) {
            var actualKeyValue = actual[i];
            var expectedKeyValue = expected[i];
            chai_1.expect(actualKeyValue.key).to.be.equal(expectedKeyValue.key);
            chai_1.expect(actualKeyValue.value).to.be.equal(expectedKeyValue.value);
        }
    }
    describe('constructor', function () {
        it('should initialize with empty keys and values', function () {
            var observableDictionary = new observableDictionary_1.ObservableDictionary();
            chai_1.expect(observableDictionary.keys).to.be.empty;
            chai_1.expect(observableDictionary.values).to.be.empty;
        });
        it('should set size correctly', function () {
            var observableDictionary = new observableDictionary_1.ObservableDictionary();
            chai_1.expect(observableDictionary.size).to.be.equal(0);
        });
    });
    describe('add', function () {
        it('adding key value pair, should add to keys', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            chai_1.expect(observableDictionary.keys).to.be.length(1);
            chai_1.expect(observableDictionary.keys).to.contain(key);
        });
        it('adding key value pair, should add to values', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            chai_1.expect(observableDictionary.values).to.be.length(1);
            chai_1.expect(observableDictionary.values).to.contain(value);
        });
        it('adding key value pair, should set size correctly', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            chai_1.expect(observableDictionary.size).to.be.equal(1);
        });
        it('adding multiple key value pairs, should add to keys', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            chai_1.expect(observableDictionary.keys).to.be.length(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                chai_1.expect(observableDictionary.keys).to.contain(pair.key);
            }
        });
        it('adding multiple key value pairs, should add to values', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            chai_1.expect(observableDictionary.values).to.be.length(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                chai_1.expect(observableDictionary.values).to.contain(pair.value);
            }
        });
        it('adding multiple key value pairs, should set size correctly', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            chai_1.expect(observableDictionary.size).to.be.equal(numberOfPairs);
        });
        it('adding key value pair, should not affect the json representation of both', function () {
            var key = { a: 1, b: [2] };
            var value = { c: 'c', d: ['e'] };
            var expectedKeyJson = JSON.stringify(key);
            var expectedValueJson = JSON.stringify(value);
            observableDictionary.add(key, value);
            chai_1.expect(JSON.stringify(key)).to.be.equal(expectedKeyJson);
            chai_1.expect(JSON.stringify(value)).to.be.equal(expectedValueJson);
        });
        it('adding key value pair, should not affect the for in loop for the key', function () {
            var key = { a: 1, b: [2] };
            var value = { c: 'c', d: ['e'] };
            var expectedPropertiesWithValues = getPropertiesAndValues(key);
            observableDictionary.add(key, value);
            var actualPropertiesWithValues = getPropertiesAndValues(key);
            verifySamePropertiesAndValues(actualPropertiesWithValues, expectedPropertiesWithValues);
        });
        it('adding key value pair, should not affect the for in loop for the value', function () {
            var key = { a: 1, b: [2] };
            var value = { c: 'c', d: ['e'] };
            var expectedPropertiesWithValues = getPropertiesAndValues(value);
            observableDictionary.add(key, value);
            var actualPropertiesWithValues = getPropertiesAndValues(value);
            verifySamePropertiesAndValues(actualPropertiesWithValues, expectedPropertiesWithValues);
        });
        it('adding multiple key value pairs, should raise itemsChanged correctly', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            var expectedArgs = [];
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                expectedArgs.push({
                    added: [pair],
                    removed: []
                });
            }
            var actualArgs = registerToItemsChangedEvent(observableDictionary);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
        });
        it('adding key value pair with existing key, should override the value', function () {
            var key = {};
            var value1 = {};
            var value2 = {};
            observableDictionary.add(key, value1);
            observableDictionary.add(key, value2);
            chai_1.expect(observableDictionary.keys).to.be.length(1);
            chai_1.expect(observableDictionary.keys).to.contain(key);
            chai_1.expect(observableDictionary.values).to.be.length(1);
            chai_1.expect(observableDictionary.values).to.contain(value2);
            chai_1.expect(observableDictionary.getValueByKey(key)).to.be.equal(value2);
            chai_1.expect(observableDictionary.containsKey(key)).to.be.true;
            chai_1.expect(observableDictionary.containsValue(value1)).to.be.false;
            chai_1.expect(observableDictionary.containsValue(value2)).to.be.true;
        });
        it('adding key value pair with existing key, should raise itemsChanged correctly', function () {
            var key = {};
            var value1 = {};
            var value2 = {};
            observableDictionary.add(key, value1);
            var expectedArgs = [
                {
                    added: [{ key: key, value: value2 }],
                    removed: [{ key: key, value: value1 }]
                }
            ];
            var actualArgs = registerToItemsChangedEvent(observableDictionary);
            observableDictionary.add(key, value2);
            verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
        });
    });
    describe('remove', function () {
        it('removing non existing key, should not throw exception', function () {
            var action = function () { return observableDictionary.remove({}); };
            chai_1.expect(action).not.to.throw();
        });
        it('removing non existing key, should set size correctly', function () {
            observableDictionary.remove({});
            chai_1.expect(observableDictionary.size).to.be.equal(0);
        });
        it('removing key, should remove from keys', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            observableDictionary.remove(key);
            chai_1.expect(observableDictionary.keys).to.be.length(0);
        });
        it('removing key, should remove from values', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            observableDictionary.remove(key);
            chai_1.expect(observableDictionary.values).to.be.length(0);
        });
        it('removing key, should set size correctly', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            observableDictionary.remove(key);
            chai_1.expect(observableDictionary.size).to.be.equal(0);
        });
        it('removing multiple keys, should remove from keys', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.remove(keyValuePairs[0].key);
            observableDictionary.remove(keyValuePairs[2].key);
            chai_1.expect(observableDictionary.keys).to.be.length(numberOfPairs - 2);
            chai_1.expect(observableDictionary.keys).not.to.contain(keyValuePairs[0].key);
            chai_1.expect(observableDictionary.keys).to.contain(keyValuePairs[1].key);
            chai_1.expect(observableDictionary.keys).not.to.contain(keyValuePairs[2].key);
            chai_1.expect(observableDictionary.keys).to.contain(keyValuePairs[3].key);
        });
        it('removing multiple keys, should remove from values', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.remove(keyValuePairs[0].key);
            observableDictionary.remove(keyValuePairs[2].key);
            chai_1.expect(observableDictionary.values).to.be.length(numberOfPairs - 2);
            chai_1.expect(observableDictionary.values).not.to.contain(keyValuePairs[0].value);
            chai_1.expect(observableDictionary.values).to.contain(keyValuePairs[1].value);
            chai_1.expect(observableDictionary.values).not.to.contain(keyValuePairs[2].value);
            chai_1.expect(observableDictionary.values).to.contain(keyValuePairs[3].value);
        });
        it('removing multiple keys, should set size correctly', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.remove(keyValuePairs[0].key);
            observableDictionary.remove(keyValuePairs[2].key);
            chai_1.expect(observableDictionary.size).to.be.equal(numberOfPairs - 2);
        });
        it('removing key, should not affect the json representation of both key and value', function () {
            var key = { a: 1, b: [2] };
            var value = { c: 'c', d: ['e'] };
            var expectedKeyJson = JSON.stringify(key);
            var expectedValueJson = JSON.stringify(value);
            observableDictionary.add(key, value);
            observableDictionary.remove(key);
            chai_1.expect(JSON.stringify(key)).to.be.equal(expectedKeyJson);
            chai_1.expect(JSON.stringify(value)).to.be.equal(expectedValueJson);
        });
        it('removing key, should not affect the for in loop for the key', function () {
            var key = { a: 1, b: [2] };
            var value = { c: 'c', d: ['e'] };
            var expectedPropertiesWithValues = getPropertiesAndValues(key);
            observableDictionary.add(key, value);
            observableDictionary.remove(key);
            var actualPropertiesWithValues = getPropertiesAndValues(key);
            verifySamePropertiesAndValues(actualPropertiesWithValues, expectedPropertiesWithValues);
        });
        it('removing key, should not affect the for in loop for the value', function () {
            var key = { a: 1, b: [2] };
            var value = { c: 'c', d: ['e'] };
            var expectedPropertiesWithValues = getPropertiesAndValues(value);
            observableDictionary.add(key, value);
            observableDictionary.remove(key);
            var actualPropertiesWithValues = getPropertiesAndValues(value);
            verifySamePropertiesAndValues(actualPropertiesWithValues, expectedPropertiesWithValues);
        });
        it('removing multiple keys, should raise itemsChanged correctly', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            var expectedArgs = [
                {
                    added: [],
                    removed: [keyValuePairs[0]]
                },
                {
                    added: [],
                    removed: [keyValuePairs[2]]
                }
            ];
            var actualArgs = registerToItemsChangedEvent(observableDictionary);
            observableDictionary.remove(keyValuePairs[0].key);
            observableDictionary.remove(keyValuePairs[2].key);
            verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
        });
    });
    describe('containsKey', function () {
        it('non existing key, should return false', function () {
            var result = observableDictionary.containsKey({});
            chai_1.expect(result).to.be.false;
        });
        it('adding key value pair, should contain the key', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            var result = observableDictionary.containsKey(key);
            chai_1.expect(result).to.be.true;
        });
        it('adding multiple key value pairs, should contain the keys', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            var results = [];
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                var result = observableDictionary.containsKey(pair.key);
                results.push(result);
            }
            for (var i = 0; i < numberOfPairs; i++) {
                chai_1.expect(results[i]).to.be.true;
            }
        });
        it('removing key, should not contain the key', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            observableDictionary.remove(key);
            var result = observableDictionary.containsKey(key);
            chai_1.expect(result).to.be.false;
        });
        it('removing multiple keys, should not contain the keys', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.remove(keyValuePairs[0].key);
            observableDictionary.remove(keyValuePairs[2].key);
            var results = [];
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                var result = observableDictionary.containsKey(pair.key);
                results.push(result);
            }
            chai_1.expect(results[0]).to.be.false;
            chai_1.expect(results[1]).to.be.true;
            chai_1.expect(results[2]).to.be.false;
            chai_1.expect(results[3]).to.be.true;
        });
    });
    describe('containsValue', function () {
        it('non existing value, should return false', function () {
            var result = observableDictionary.containsValue({});
            chai_1.expect(result).to.be.false;
        });
        it('adding key value pair, should contain the value', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            var result = observableDictionary.containsValue(value);
            chai_1.expect(result).to.be.true;
        });
        it('adding multiple key value pairs, should contain the values', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            var results = [];
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                var result = observableDictionary.containsValue(pair.value);
                results.push(result);
            }
            for (var i = 0; i < numberOfPairs; i++) {
                chai_1.expect(results[i]).to.be.true;
            }
        });
        it('removing key, should not contain the value', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            observableDictionary.remove(key);
            var result = observableDictionary.containsValue(value);
            chai_1.expect(result).to.be.false;
        });
        it('removing multiple keys, should not contain the values', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.remove(keyValuePairs[0].key);
            observableDictionary.remove(keyValuePairs[2].key);
            var results = [];
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                var result = observableDictionary.containsValue(pair.value);
                results.push(result);
            }
            chai_1.expect(results[0]).to.be.false;
            chai_1.expect(results[1]).to.be.true;
            chai_1.expect(results[2]).to.be.false;
            chai_1.expect(results[3]).to.be.true;
        });
    });
    describe('getValueByKey', function () {
        it('non existing key, should throw error', function () {
            var action = function () { return observableDictionary.getValueByKey({}); };
            chai_1.expect(action).to.throw();
        });
        it('adding key value pair, should return correct value', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            var result = observableDictionary.getValueByKey(key);
            chai_1.expect(result).to.be.equal(value);
        });
        it('adding multiple key value pairs, should return correct values', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            var results = [];
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                var result = observableDictionary.getValueByKey(pair.key);
                results.push(result);
            }
            for (var i = 0; i < numberOfPairs; i++) {
                chai_1.expect(results[i]).to.be.equal(keyValuePairs[i].value);
            }
        });
        it('requesting removed key, should throw error', function () {
            var key = {};
            var value = {};
            observableDictionary.add(key, value);
            observableDictionary.remove(key);
            var action = function () { return observableDictionary.getValueByKey(key); };
            chai_1.expect(action).to.throw();
        });
        it('removing multiple keys, should throw error on requesting removed keys', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.remove(keyValuePairs[0].key);
            observableDictionary.remove(keyValuePairs[2].key);
            var action0 = function () { return observableDictionary.getValueByKey(keyValuePairs[0].key); };
            var action1 = function () { return observableDictionary.getValueByKey(keyValuePairs[1].key); };
            var action2 = function () { return observableDictionary.getValueByKey(keyValuePairs[2].key); };
            var action3 = function () { return observableDictionary.getValueByKey(keyValuePairs[3].key); };
            chai_1.expect(action0).to.throw();
            chai_1.expect(action1()).to.be.equal(keyValuePairs[1].value);
            chai_1.expect(action2).to.throw();
            chai_1.expect(action3()).to.be.equal(keyValuePairs[3].value);
        });
    });
    describe('clear', function () {
        it('clear on empty dictionary, should not throw exception', function () {
            var observableDictionary = new observableDictionary_1.ObservableDictionary();
            var action = function () { return observableDictionary.clear(); };
            chai_1.expect(action).not.to.throw();
        });
        it('clear on empty dictionary, should set size correctly', function () {
            var observableDictionary = new observableDictionary_1.ObservableDictionary();
            observableDictionary.clear();
            chai_1.expect(observableDictionary.size).to.be.equal(0);
        });
        it('should clear the keys', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.clear();
            chai_1.expect(observableDictionary.keys).to.be.length(0);
        });
        it('should clear the values', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.clear();
            chai_1.expect(observableDictionary.values).to.be.length(0);
        });
        it('clear on not empty dictionary, should set size correctly', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.clear();
            chai_1.expect(observableDictionary.size).to.be.equal(0);
        });
        it('should raise itemsChanged correctly', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            var expectedArgs = [{
                    added: [],
                    removed: keyValuePairs
                }];
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            var actualArgs = registerToItemsChangedEvent(observableDictionary);
            observableDictionary.clear();
            verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
        });
        it('should not contain the previosley existing keys', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.clear();
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                chai_1.expect(observableDictionary.containsKey(pair.key)).to.be.false;
            }
        });
        it('should not contain the previosley existing values', function () {
            var numberOfPairs = 4;
            var keyValuePairs = createKeyValuePairs(numberOfPairs);
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                observableDictionary.add(pair.key, pair.value);
            }
            observableDictionary.clear();
            for (var i = 0; i < numberOfPairs; i++) {
                var pair = keyValuePairs[i];
                chai_1.expect(observableDictionary.containsValue(pair.value)).to.be.false;
            }
        });
    });
    describe('multiple dictionaries', function () {
        it('adding to multiple dictionaries should contain the keys and values in all', function () {
            var key1 = {};
            var key2 = {};
            var value1 = {};
            var value2 = {};
            var observableDictionary1 = new observableDictionary_1.ObservableDictionary();
            var observableDictionary2 = new observableDictionary_1.ObservableDictionary();
            var observableDictionary3 = new observableDictionary_1.ObservableDictionary();
            observableDictionary1.add(key1, value1);
            observableDictionary2.add(key1, value1);
            observableDictionary3.add(key1, value1);
            observableDictionary1.add(key2, value2);
            observableDictionary2.add(key2, value2);
            observableDictionary3.add(key2, value2);
            chai_1.expect(observableDictionary1.size).to.be.equal(2);
            chai_1.expect(observableDictionary2.size).to.be.equal(2);
            chai_1.expect(observableDictionary3.size).to.be.equal(2);
            chai_1.expect(observableDictionary1.keys).to.contain(key1);
            chai_1.expect(observableDictionary1.keys).to.contain(key2);
            chai_1.expect(observableDictionary2.keys).to.contain(key1);
            chai_1.expect(observableDictionary2.keys).to.contain(key2);
            chai_1.expect(observableDictionary3.keys).to.contain(key1);
            chai_1.expect(observableDictionary3.keys).to.contain(key2);
            chai_1.expect(observableDictionary1.values).to.contain(value1);
            chai_1.expect(observableDictionary1.values).to.contain(value2);
            chai_1.expect(observableDictionary2.values).to.contain(value1);
            chai_1.expect(observableDictionary2.values).to.contain(value2);
            chai_1.expect(observableDictionary3.values).to.contain(value1);
            chai_1.expect(observableDictionary3.values).to.contain(value2);
            chai_1.expect(observableDictionary1.getValueByKey(key1)).to.be.equal(value1);
            chai_1.expect(observableDictionary2.getValueByKey(key1)).to.be.equal(value1);
            chai_1.expect(observableDictionary3.getValueByKey(key1)).to.be.equal(value1);
            chai_1.expect(observableDictionary1.getValueByKey(key2)).to.be.equal(value2);
            chai_1.expect(observableDictionary2.getValueByKey(key2)).to.be.equal(value2);
            chai_1.expect(observableDictionary3.getValueByKey(key2)).to.be.equal(value2);
            chai_1.expect(observableDictionary1.containsKey(key1)).to.be.true;
            chai_1.expect(observableDictionary1.containsKey(key2)).to.be.true;
            chai_1.expect(observableDictionary2.containsKey(key1)).to.be.true;
            chai_1.expect(observableDictionary2.containsKey(key2)).to.be.true;
            chai_1.expect(observableDictionary3.containsKey(key1)).to.be.true;
            chai_1.expect(observableDictionary3.containsKey(key2)).to.be.true;
            chai_1.expect(observableDictionary1.containsValue(value1)).to.be.true;
            chai_1.expect(observableDictionary1.containsValue(value2)).to.be.true;
            chai_1.expect(observableDictionary2.containsValue(value1)).to.be.true;
            chai_1.expect(observableDictionary2.containsValue(value2)).to.be.true;
            chai_1.expect(observableDictionary3.containsValue(value1)).to.be.true;
            chai_1.expect(observableDictionary3.containsValue(value2)).to.be.true;
        });
        it('add to multiple dictionaries, remove key from one, clear the other, should act properly', function () {
            var key1 = { a: 1 };
            var key2 = { b: 2 };
            var value1 = { c: 3 };
            var value2 = { d: 4 };
            var observableDictionary1 = new observableDictionary_1.ObservableDictionary();
            var observableDictionary2 = new observableDictionary_1.ObservableDictionary();
            var observableDictionary3 = new observableDictionary_1.ObservableDictionary();
            observableDictionary1.add(key1, value1);
            observableDictionary2.add(key1, value1);
            observableDictionary3.add(key1, value1);
            observableDictionary1.add(key2, value2);
            observableDictionary2.add(key2, value2);
            observableDictionary3.add(key2, value2);
            observableDictionary2.remove(key2);
            observableDictionary1.clear();
            chai_1.expect(observableDictionary1.size, 'size should be correct').to.be.equal(0);
            chai_1.expect(observableDictionary2.size, 'size should be correct').to.be.equal(1);
            chai_1.expect(observableDictionary3.size, 'size should be correct').to.be.equal(2);
            chai_1.expect(observableDictionary1.keys, 'keys should be correct').not.to.contain(key1);
            chai_1.expect(observableDictionary1.keys, 'keys should be correct').not.to.contain(key2);
            chai_1.expect(observableDictionary2.keys, 'keys should be correct').to.contain(key1);
            chai_1.expect(observableDictionary2.keys, 'keys should be correct').not.to.contain(key2);
            chai_1.expect(observableDictionary3.keys, 'keys should be correct').to.contain(key1);
            chai_1.expect(observableDictionary3.keys, 'keys should be correct').to.contain(key2);
            chai_1.expect(observableDictionary1.values, 'values should be correct').not.to.contain(value1);
            chai_1.expect(observableDictionary1.values, 'values should be correct').not.to.contain(value2);
            chai_1.expect(observableDictionary2.values, 'values should be correct').to.contain(value1);
            chai_1.expect(observableDictionary2.values, 'values should be correct').not.to.contain(value2);
            chai_1.expect(observableDictionary3.values, 'values should be correct').to.contain(value1);
            chai_1.expect(observableDictionary3.values, 'values should be correct').to.contain(value2);
            chai_1.expect(observableDictionary2.getValueByKey(key1), 'getValueByKey should return correct value').to.be.equal(value1);
            chai_1.expect(observableDictionary3.getValueByKey(key1), 'getValueByKey should return correct value').to.be.equal(value1);
            chai_1.expect(observableDictionary3.getValueByKey(key2), 'getValueByKey should return correct value').to.be.equal(value2);
            chai_1.expect(observableDictionary1.containsKey(key1), 'dictionary1 contains key1 should work ok').to.be.false;
            chai_1.expect(observableDictionary1.containsKey(key2), 'dictionary1 contains key2 should work ok').to.be.false;
            chai_1.expect(observableDictionary2.containsKey(key1), 'dictionary2 contains key1 should work ok').to.be.true;
            chai_1.expect(observableDictionary2.containsKey(key2), 'dictionary2 contains key2 should work ok').to.be.false;
            chai_1.expect(observableDictionary3.containsKey(key1), 'dictionary3 contains key1 should work ok').to.be.true;
            chai_1.expect(observableDictionary3.containsKey(key2), 'dictionary3 contains key2 should work ok').to.be.true;
            chai_1.expect(observableDictionary1.containsValue(value1), 'contains value should work ok').to.be.false;
            chai_1.expect(observableDictionary1.containsValue(value2), 'contains value should work ok').to.be.false;
            chai_1.expect(observableDictionary2.containsValue(value1), 'contains value should work ok').to.be.true;
            chai_1.expect(observableDictionary2.containsValue(value2), 'contains value should work ok').to.be.false;
            chai_1.expect(observableDictionary3.containsValue(value1), 'contains value should work ok').to.be.true;
            chai_1.expect(observableDictionary3.containsValue(value2), 'contains value should work ok').to.be.true;
        });
    });
});
