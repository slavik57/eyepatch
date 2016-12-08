"use strict";
var chai_1 = require("chai");
var observableDictionary_1 = require("./observableDictionary");
describe('ObservableDictionary', function () {
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
    describe('key type is object', function () {
        testDictionaryWithConfiguration(function () { return ({
            key: {},
            key2: {},
            value: {},
            value2: {},
            complexKey: { a: 1, b: [2] },
            complexKey2: { a: 2, b: [3], c: '4' },
            complexValue: { c: 'c', d: ['e'] },
            complexValue2: { d: 5, e: '6' },
            createKeyValuePairs: function () {
                var numberOfPairs = 4;
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
        }); });
    });
    describe('key type is string', function () {
        testDictionaryWithConfiguration(function () { return ({
            key: 'key',
            key2: 'key2',
            value: {},
            value2: {},
            complexKey: 'complex key',
            complexKey2: 'complex key 2',
            complexValue: { c: 'c', d: ['e'] },
            complexValue2: { d: 5, e: '6' },
            createKeyValuePairs: function () {
                var numberOfPairs = 4;
                var result = [];
                for (var i = 0; i < numberOfPairs; i++) {
                    var key = "key " + i;
                    var value = { valueItem: i };
                    result.push({
                        key: key,
                        value: value
                    });
                }
                return result;
            }
        }); });
    });
    describe('key type is number', function () {
        testDictionaryWithConfiguration(function () { return ({
            key: 1,
            key2: 2,
            value: {},
            value2: {},
            complexKey: 1.23,
            complexKey2: 4.56,
            complexValue: { c: 'c', d: ['e'] },
            complexValue2: { d: 5, e: '6' },
            createKeyValuePairs: function () {
                var numberOfPairs = 4;
                var result = [];
                for (var i = 0; i < numberOfPairs; i++) {
                    var key = i;
                    var value = { valueItem: i };
                    result.push({
                        key: key,
                        value: value
                    });
                }
                return result;
            }
        }); });
    });
    describe('key type is boolean', function () {
        testDictionaryWithConfiguration(function () { return ({
            key: true,
            key2: false,
            value: {},
            value2: {},
            complexKey: true,
            complexKey2: false,
            complexValue: { c: 'c', d: ['e'] },
            complexValue2: { d: 5, e: '6' },
            createKeyValuePairs: function () {
                var numberOfPairs = 2;
                var result = [];
                for (var i = 0; i < numberOfPairs; i++) {
                    var key = i % 2 === 0;
                    var value = { valueItem: i };
                    result.push({
                        key: key,
                        value: value
                    });
                }
                return result;
            }
        }); });
    });
    function testDictionaryWithConfiguration(getConfiguration) {
        var observableDictionary;
        var configuration;
        beforeEach(function () {
            configuration = getConfiguration();
            observableDictionary = new observableDictionary_1.ObservableDictionary();
        });
        describe('add', function () {
            it('adding key value pair, should add to keys', function () {
                observableDictionary.add(configuration.key, configuration.value);
                chai_1.expect(observableDictionary.keys).to.be.length(1);
                chai_1.expect(observableDictionary.keys).to.contain(configuration.key);
            });
            it('adding key value pair, should add to values', function () {
                observableDictionary.add(configuration.key, configuration.value);
                chai_1.expect(observableDictionary.values).to.be.length(1);
                chai_1.expect(observableDictionary.values).to.contain(configuration.value);
            });
            it('adding key value pair, should add to keysAndValues', function () {
                observableDictionary.add(configuration.key, configuration.value);
                var keysAndValues = observableDictionary.keysAndValues;
                chai_1.expect(keysAndValues).to.be.length(1);
                chai_1.expect(keysAndValues[0].key).to.be.equal(configuration.key);
                chai_1.expect(keysAndValues[0].value).to.be.equal(configuration.value);
            });
            it('adding key value pair, should set size correctly', function () {
                observableDictionary.add(configuration.key, configuration.value);
                chai_1.expect(observableDictionary.size).to.be.equal(1);
            });
            it('adding multiple key value pairs, should add to keys', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
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
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
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
            it('adding multiple key value pairs, should add to keysAndValues', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var keysAndValues = observableDictionary.keysAndValues;
                chai_1.expect(keysAndValues).to.be.length(numberOfPairs);
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    var actualPair = keysAndValues[i];
                    chai_1.expect(actualPair.key).to.be.equal(pair.key);
                    chai_1.expect(actualPair.value).to.be.equal(pair.value);
                }
            });
            it('adding multiple key value pairs, should set size correctly', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                chai_1.expect(observableDictionary.size).to.be.equal(numberOfPairs);
            });
            it('adding key value pair, should not affect the json representation of both', function () {
                var key = configuration.complexKey;
                var value = configuration.complexValue;
                var expectedKeyJson = JSON.stringify(key);
                var expectedValueJson = JSON.stringify(value);
                observableDictionary.add(key, value);
                chai_1.expect(JSON.stringify(key)).to.be.equal(expectedKeyJson);
                chai_1.expect(JSON.stringify(value)).to.be.equal(expectedValueJson);
            });
            it('adding key value pair, should not affect the for in loop for the key', function () {
                var key = configuration.complexKey;
                var value = configuration.complexValue;
                var expectedPropertiesWithValues = getPropertiesAndValues(key);
                observableDictionary.add(key, value);
                var actualPropertiesWithValues = getPropertiesAndValues(key);
                verifySamePropertiesAndValues(actualPropertiesWithValues, expectedPropertiesWithValues);
            });
            it('adding key value pair, should not affect the for in loop for the value', function () {
                var key = configuration.complexKey;
                var value = configuration.complexValue;
                var expectedPropertiesWithValues = getPropertiesAndValues(value);
                observableDictionary.add(key, value);
                var actualPropertiesWithValues = getPropertiesAndValues(value);
                verifySamePropertiesAndValues(actualPropertiesWithValues, expectedPropertiesWithValues);
            });
            it('adding multiple key value pairs, should raise itemsChanged correctly', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
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
                var key = configuration.key;
                var value1 = configuration.value;
                var value2 = configuration.value2;
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
                var key = configuration.key;
                var value1 = configuration.value;
                var value2 = configuration.value2;
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
                var action = function () { return observableDictionary.remove(configuration.key); };
                chai_1.expect(action).not.to.throw();
            });
            it('removing non existing key, should set size correctly', function () {
                observableDictionary.remove(configuration.key);
                chai_1.expect(observableDictionary.size).to.be.equal(0);
            });
            it('removing key, should remove from keys', function () {
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                chai_1.expect(observableDictionary.keys).to.be.length(0);
            });
            it('removing key, should remove from values', function () {
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                chai_1.expect(observableDictionary.values).to.be.length(0);
            });
            it('removing key, should remove from keysAndValues', function () {
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                chai_1.expect(observableDictionary.keysAndValues).to.be.length(0);
            });
            it('removing key, should set size correctly', function () {
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                chai_1.expect(observableDictionary.size).to.be.equal(0);
            });
            it('removing multiple keys, should remove from keys', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var pairToRemove1 = keyValuePairs[0];
                var pairToRemove2 = keyValuePairs[numberOfPairs / 2];
                observableDictionary.remove(pairToRemove1.key);
                observableDictionary.remove(pairToRemove2.key);
                chai_1.expect(observableDictionary.keys).to.be.length(numberOfPairs - 2);
                chai_1.expect(observableDictionary.keys).not.to.contain(pairToRemove1.key);
                chai_1.expect(observableDictionary.keys).not.to.contain(pairToRemove2.key);
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    if (pair === pairToRemove1 ||
                        pair === pairToRemove2) {
                        continue;
                    }
                    chai_1.expect(observableDictionary.keys).to.contain(pair.key);
                }
            });
            it('removing multiple keys, should remove from values', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var pairToRemove1 = keyValuePairs[0];
                var pairToRemove2 = keyValuePairs[numberOfPairs / 2];
                observableDictionary.remove(pairToRemove1.key);
                observableDictionary.remove(pairToRemove2.key);
                chai_1.expect(observableDictionary.values).to.be.length(numberOfPairs - 2);
                chai_1.expect(observableDictionary.values).not.to.contain(pairToRemove1.value);
                chai_1.expect(observableDictionary.values).not.to.contain(pairToRemove2.value);
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    if (pair === pairToRemove1 ||
                        pair === pairToRemove2) {
                        continue;
                    }
                    chai_1.expect(observableDictionary.values).to.contain(pair.value);
                }
            });
            it('removing multiple keys, should remove from keysAndValues', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var pairToRemove1 = keyValuePairs[0];
                var pairToRemove2 = keyValuePairs[numberOfPairs / 2];
                observableDictionary.remove(pairToRemove1.key);
                observableDictionary.remove(pairToRemove2.key);
                var keysAndValues = observableDictionary.keysAndValues;
                chai_1.expect(keysAndValues).to.be.length(numberOfPairs - 2);
                chai_1.expect(keysAndValues.map(function (_) { return _.key; })).not.to.contain(pairToRemove1.key);
                chai_1.expect(keysAndValues.map(function (_) { return _.key; })).not.to.contain(pairToRemove2.key);
                chai_1.expect(keysAndValues.map(function (_) { return _.value; })).not.to.contain(pairToRemove1.value);
                chai_1.expect(keysAndValues.map(function (_) { return _.value; })).not.to.contain(pairToRemove2.value);
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    if (pair === pairToRemove1 ||
                        pair === pairToRemove2) {
                        continue;
                    }
                    chai_1.expect(keysAndValues.map(function (_) { return _.key; })).to.contain(pair.key);
                    chai_1.expect(keysAndValues.map(function (_) { return _.value; })).to.contain(pair.value);
                }
            });
            it('removing multiple keys, should set size correctly', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var pairToRemove1 = keyValuePairs[0];
                var pairToRemove2 = keyValuePairs[numberOfPairs / 2];
                observableDictionary.remove(pairToRemove1.key);
                observableDictionary.remove(pairToRemove2.key);
                chai_1.expect(observableDictionary.size).to.be.equal(numberOfPairs - 2);
            });
            it('removing key, should not affect the json representation of both key and value', function () {
                var key = configuration.complexKey;
                var value = configuration.complexValue;
                var expectedKeyJson = JSON.stringify(key);
                var expectedValueJson = JSON.stringify(value);
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                chai_1.expect(JSON.stringify(key)).to.be.equal(expectedKeyJson);
                chai_1.expect(JSON.stringify(value)).to.be.equal(expectedValueJson);
            });
            it('removing key, should not affect the for in loop for the key', function () {
                var key = configuration.complexKey;
                var value = configuration.complexValue;
                var expectedPropertiesWithValues = getPropertiesAndValues(key);
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                var actualPropertiesWithValues = getPropertiesAndValues(key);
                verifySamePropertiesAndValues(actualPropertiesWithValues, expectedPropertiesWithValues);
            });
            it('removing key, should not affect the for in loop for the value', function () {
                var key = configuration.complexKey;
                var value = configuration.complexValue;
                var expectedPropertiesWithValues = getPropertiesAndValues(value);
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                var actualPropertiesWithValues = getPropertiesAndValues(value);
                verifySamePropertiesAndValues(actualPropertiesWithValues, expectedPropertiesWithValues);
            });
            it('removing multiple keys, should raise itemsChanged correctly', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var pairToRemove1 = keyValuePairs[0];
                var pairToRemove2 = keyValuePairs[numberOfPairs / 2];
                var expectedArgs = [
                    {
                        added: [],
                        removed: [pairToRemove1]
                    },
                    {
                        added: [],
                        removed: [pairToRemove2]
                    }
                ];
                var actualArgs = registerToItemsChangedEvent(observableDictionary);
                observableDictionary.remove(pairToRemove1.key);
                observableDictionary.remove(pairToRemove2.key);
                verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
            });
            it('removing by found key, should remove', function () {
                var key = { someProp: 1 };
                var value = '1';
                var dictionary = new observableDictionary_1.ObservableDictionary();
                dictionary.add(key, value);
                chai_1.expect(dictionary.size).to.be.equal(1);
                chai_1.expect(dictionary.keys).to.contain(key);
                var key = dictionary.findKey(function (_) { return _.someProp === 1; });
                dictionary.remove(key);
                chai_1.expect(dictionary.size).to.be.equal(0);
                chai_1.expect(dictionary.keys).to.not.contain(key);
            });
        });
        describe('containsKey', function () {
            it('non existing key, should return false', function () {
                var result = observableDictionary.containsKey(configuration.key);
                chai_1.expect(result).to.be.false;
            });
            it('adding key value pair, should contain the key', function () {
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                var result = observableDictionary.containsKey(key);
                chai_1.expect(result).to.be.true;
            });
            it('adding multiple key value pairs, should contain the keys', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
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
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                var result = observableDictionary.containsKey(key);
                chai_1.expect(result).to.be.false;
            });
            it('removing multiple keys, should not contain the keys', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var pairToRemove1 = keyValuePairs[0];
                var pairToRemove2 = keyValuePairs[numberOfPairs / 2];
                observableDictionary.remove(pairToRemove1.key);
                observableDictionary.remove(pairToRemove2.key);
                var results = [];
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    var result = observableDictionary.containsKey(pair.key);
                    results.push(result);
                }
                chai_1.expect(results[0]).to.be.false;
                chai_1.expect(results[numberOfPairs / 2]).to.be.false;
                results.splice(numberOfPairs / 2);
                results.splice(0);
                for (var i = 0; i < results.length; i++) {
                    chai_1.expect(results[i]).to.be.true;
                }
            });
        });
        describe('containsValue', function () {
            it('non existing value, should return false', function () {
                var result = observableDictionary.containsValue(configuration.key);
                chai_1.expect(result).to.be.false;
            });
            it('adding key value pair, should contain the value', function () {
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                var result = observableDictionary.containsValue(value);
                chai_1.expect(result).to.be.true;
            });
            it('adding multiple key value pairs, should contain the values', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
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
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                var result = observableDictionary.containsValue(value);
                chai_1.expect(result).to.be.false;
            });
            it('removing multiple keys, should not contain the values', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var pairToRemove1 = keyValuePairs[0];
                var pairToRemove2 = keyValuePairs[numberOfPairs / 2];
                observableDictionary.remove(pairToRemove1.key);
                observableDictionary.remove(pairToRemove2.key);
                var results = [];
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    var result = observableDictionary.containsValue(pair.value);
                    results.push(result);
                }
                chai_1.expect(results[0]).to.be.false;
                chai_1.expect(results[numberOfPairs / 2]).to.be.false;
                results.splice(numberOfPairs / 2);
                results.splice(0);
                for (var i = 0; i < results.length; i++) {
                    chai_1.expect(results[i]).to.be.true;
                }
            });
            it('not existing value, passes the == test, should return false', function () {
                observableDictionary.add(configuration.key, 0);
                chai_1.expect(observableDictionary.containsValue(false)).to.be.false;
            });
        });
        describe('getValueByKey', function () {
            it('non existing key, should throw error', function () {
                var action = function () { return observableDictionary.getValueByKey(configuration.key); };
                chai_1.expect(action).to.throw();
            });
            it('adding key value pair, should return correct value', function () {
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                var result = observableDictionary.getValueByKey(key);
                chai_1.expect(result).to.be.equal(value);
            });
            it('adding multiple key value pairs, should return correct values', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
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
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                var action = function () { return observableDictionary.getValueByKey(key); };
                chai_1.expect(action).to.throw();
            });
            it('removing multiple keys, should throw error on requesting removed keys', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var pairToRemove1 = keyValuePairs[0];
                var pairToRemove2 = keyValuePairs[numberOfPairs / 2];
                observableDictionary.remove(pairToRemove1.key);
                observableDictionary.remove(pairToRemove2.key);
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    if (pair === pairToRemove1 ||
                        pair === pairToRemove2) {
                        chai_1.expect(function () { return observableDictionary.getValueByKey(pair.key); }).to.throw();
                        continue;
                    }
                    chai_1.expect(observableDictionary.getValueByKey(pair.key)).to.be.equal(pair.value);
                }
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
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                observableDictionary.clear();
                chai_1.expect(observableDictionary.keys).to.be.length(0);
            });
            it('should clear the values', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                observableDictionary.clear();
                chai_1.expect(observableDictionary.values).to.be.length(0);
            });
            it('clear on not empty dictionary, should set size correctly', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                observableDictionary.clear();
                chai_1.expect(observableDictionary.size).to.be.equal(0);
            });
            it('should raise itemsChanged correctly', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
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
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
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
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
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
        describe('findKey', function () {
            it('returning false for all, should return null', function () {
                var result = observableDictionary.findKey(function (_) { return false; });
                chai_1.expect(result).to.be.null;
            });
            it('adding key value pair, should return true on the key, should return the key', function () {
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                var result = observableDictionary.findKey(function (_) { return _ === key; });
                chai_1.expect(result).to.be.equal(key);
            });
            it('adding multiple key value pairs, returns true on second, should contain the second', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var result = observableDictionary.findKey(function (_) { return _ === keyValuePairs[1].key; });
                chai_1.expect(result).to.be.equal(keyValuePairs[1].key);
            });
            it('removing key, should not find the key', function () {
                var key = configuration.key;
                var value = configuration.value;
                observableDictionary.add(key, value);
                observableDictionary.remove(key);
                var result = observableDictionary.findKey(function (_) { return _ === key; });
                chai_1.expect(result).to.be.null;
            });
            it('removing multiple keys, should not find the keys', function () {
                var keyValuePairs = configuration.createKeyValuePairs();
                var numberOfPairs = keyValuePairs.length;
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    observableDictionary.add(pair.key, pair.value);
                }
                var pairToRemove1 = keyValuePairs[0];
                var pairToRemove2 = keyValuePairs[numberOfPairs / 2];
                observableDictionary.remove(pairToRemove1.key);
                observableDictionary.remove(pairToRemove2.key);
                var results = [];
                var expectedResults = [];
                for (var i = 0; i < numberOfPairs; i++) {
                    var pair = keyValuePairs[i];
                    var result = observableDictionary.findKey(function (_) { return _ === pair.key; });
                    results.push(result);
                    if (pair === pairToRemove1 || pair === pairToRemove2) {
                        expectedResults.push(null);
                    }
                    else {
                        expectedResults.push(pair.key);
                    }
                }
                for (var i = 0; i < results.length; i++) {
                    chai_1.expect(results[i]).to.be.equal(expectedResults[i]);
                }
            });
        });
        describe('multiple dictionaries', function () {
            it('adding to multiple dictionaries should contain the keys and values in all', function () {
                var key1 = configuration.key;
                var key2 = configuration.key2;
                var value1 = configuration.value;
                var value2 = configuration.value2;
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
                var key1 = configuration.complexKey;
                var key2 = configuration.complexKey2;
                var value1 = configuration.complexValue;
                var value2 = configuration.complexValue2;
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
    }
});
