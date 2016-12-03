import { expect } from 'chai';
import { IEventT } from '../events/interfaces/iEvent';
import { IItemsChangedEventArgs } from './interfaces/iItemsChangedEventArgs';
import { IKeyValue } from './interfaces/iKeyValue';
import { IObservableDictionary } from './interfaces/iObservableDictionary';
import { ObservableDictionary } from './observableDictionary';

interface IPropertyWithValue {
  property: any;
  value: any;
}

describe('ObservableDictionary', () => {
  var observableDictionary: IObservableDictionary<Object, Object>;

  beforeEach(() => {
    observableDictionary = new ObservableDictionary<Object, Object>();
  });

  function createKeyValuePairs(numberOfPairs: number): IKeyValue<Object, Object>[] {
    var result: IKeyValue<Object, Object>[] = [];

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

  function getPropertiesAndValues(object: any): IPropertyWithValue[] {
    var result: IPropertyWithValue[] = [];

    for (var property in object) {
      result.push({
        property: property,
        value: object[property]
      })
    }

    return result;
  }

  function verifySamePropertiesAndValues(actual: IPropertyWithValue[],
    expected: IPropertyWithValue[]): void {

    expect(actual).to.be.length(expected.length);

    for (var i = 0; i < expected.length; i++) {
      var actualPropery = actual[i].property;
      var actualValue = actual[i].value;

      var expectedProperty = expected[i].property;
      var expectedValue = expected[i].value;

      expect(actualPropery).to.be.equal(expectedProperty);
      expect(actualValue).to.be.equal(expectedValue);
    }
  }

  function registerToItemsChangedEvent(observableDictionary: IObservableDictionary<Object, Object>): IItemsChangedEventArgs<IKeyValue<Object, Object>>[] {
    var actualArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] = [];

    observableDictionary.itemsChanged.on(
      _args => {
        actualArgs.push(_args);
      });

    return actualArgs;
  }

  function verifyItemsChangedWasRaisedCorrectly(actual: IItemsChangedEventArgs<IKeyValue<Object, Object>>[],
    expected: IItemsChangedEventArgs<IKeyValue<Object, Object>>[]): void {

    expect(actual).to.be.length(expected.length);

    for (var i = 0; i < expected.length; i++) {
      var actualArg = actual[i];
      var expectedArg = expected[i];

      veriftyItemsChangedEventArgsAreEqual(actualArg, expectedArg);
    }
  }

  function veriftyItemsChangedEventArgsAreEqual(actual: IItemsChangedEventArgs<IKeyValue<Object, Object>>,
    expected: IItemsChangedEventArgs<IKeyValue<Object, Object>>): void {

    verifyKeyValuesEqual(actual.added, expected.added);
    verifyKeyValuesEqual(actual.removed, expected.removed);
  }

  function verifyKeyValuesEqual(actual: IKeyValue<Object, Object>[],
    expected: IKeyValue<Object, Object>[]): void {
    expect(actual).to.be.length(expected.length);

    for (var i = 0; i < expected.length; i++) {
      var actualKeyValue: IKeyValue<Object, Object> = actual[i];
      var expectedKeyValue: IKeyValue<Object, Object> = expected[i];

      expect(actualKeyValue.key).to.be.equal(expectedKeyValue.key);
      expect(actualKeyValue.value).to.be.equal(expectedKeyValue.value);
    }
  }

  describe('constructor', () => {
    it('should initialize with empty keys and values', () => {
      // Act
      var observableDictionary = new ObservableDictionary<any, any>();

      // Assert
      expect(observableDictionary.keys).to.be.empty;
      expect(observableDictionary.values).to.be.empty;
    });

    it('should set size correctly', () => {
      // Act
      var observableDictionary = new ObservableDictionary<any, any>();

      // Assert
      expect(observableDictionary.size).to.be.equal(0);
    });
  });

  describe('add', () => {
    it('adding key value pair, should add to keys', () => {
      // Arrange
      var key = {};
      var value = {};

      // Act
      observableDictionary.add(key, value);

      // Assert
      expect(observableDictionary.keys).to.be.length(1);
      expect(observableDictionary.keys).to.contain(key);
    });

    it('adding key value pair, should add to values', () => {
      // Arrange
      var key = {};
      var value = {};

      // Act
      observableDictionary.add(key, value);

      // Assert
      expect(observableDictionary.values).to.be.length(1);
      expect(observableDictionary.values).to.contain(value);
    });

    it('adding key value pair, should set size correctly', () => {
      // Arrange
      var key = {};
      var value = {};

      // Act
      observableDictionary.add(key, value);

      // Assert
      expect(observableDictionary.size).to.be.equal(1);
    });

    it('adding multiple key value pairs, should add to keys', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      // Act
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Assert
      expect(observableDictionary.keys).to.be.length(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        expect(observableDictionary.keys).to.contain(pair.key);
      }
    });

    it('adding multiple key value pairs, should add to values', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      // Act
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Assert
      expect(observableDictionary.values).to.be.length(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        expect(observableDictionary.values).to.contain(pair.value);
      }
    });

    it('adding multiple key value pairs, should set size correctly', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      // Act
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Assert
      expect(observableDictionary.size).to.be.equal(numberOfPairs);
    });

    it('adding key value pair, should not affect the json representation of both', () => {
      // Arrange
      var key = { a: 1, b: [2] };
      var value = { c: 'c', d: ['e'] };

      var expectedKeyJson = JSON.stringify(key);
      var expectedValueJson = JSON.stringify(value);

      // Act
      observableDictionary.add(key, value);

      // Assert
      expect(JSON.stringify(key)).to.be.equal(expectedKeyJson);
      expect(JSON.stringify(value)).to.be.equal(expectedValueJson);
    });

    it('adding key value pair, should not affect the for in loop for the key', () => {
      // Arrange
      var key = { a: 1, b: [2] };
      var value = { c: 'c', d: ['e'] };

      var expectedPropertiesWithValues: IPropertyWithValue[] =
        getPropertiesAndValues(key);

      // Act
      observableDictionary.add(key, value);

      // Assert
      var actualPropertiesWithValues: IPropertyWithValue[] =
        getPropertiesAndValues(key);

      verifySamePropertiesAndValues(actualPropertiesWithValues,
        expectedPropertiesWithValues);
    });

    it('adding key value pair, should not affect the for in loop for the value', () => {
      // Arrange
      var key = { a: 1, b: [2] };
      var value = { c: 'c', d: ['e'] };

      var expectedPropertiesWithValues: IPropertyWithValue[] =
        getPropertiesAndValues(value);

      // Act
      observableDictionary.add(key, value);

      // Assert
      var actualPropertiesWithValues: IPropertyWithValue[] =
        getPropertiesAndValues(value);

      verifySamePropertiesAndValues(actualPropertiesWithValues,
        expectedPropertiesWithValues);
    });

    it('adding multiple key value pairs, should raise itemsChanged correctly', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      var expectedArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] = [];
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        expectedArgs.push({
          added: [pair],
          removed: []
        });
      }

      var actualArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] =
        registerToItemsChangedEvent(observableDictionary);

      // Act
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Assert
      verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
    });

    it('adding key value pair with existing key, should override the value', () => {
      // Arrange
      var key = {};
      var value1 = {};
      var value2 = {};

      observableDictionary.add(key, value1);

      // Act
      observableDictionary.add(key, value2);

      // Assert
      expect(observableDictionary.keys).to.be.length(1);
      expect(observableDictionary.keys).to.contain(key);
      expect(observableDictionary.values).to.be.length(1);
      expect(observableDictionary.values).to.contain(value2);
      expect(observableDictionary.getValueByKey(key)).to.be.equal(value2);
      expect(observableDictionary.containsKey(key)).to.be.true;
      expect(observableDictionary.containsValue(value1)).to.be.false;
      expect(observableDictionary.containsValue(value2)).to.be.true;
    });

    it('adding key value pair with existing key, should raise itemsChanged correctly', () => {
      // Arrange
      var key = {};
      var value1 = {};
      var value2 = {};

      observableDictionary.add(key, value1);

      var expectedArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] =
        [
          {
            added: [{ key: key, value: value2 }],
            removed: [{ key: key, value: value1 }]
          }
        ];

      var actualArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] =
        registerToItemsChangedEvent(observableDictionary);

      // Act
      observableDictionary.add(key, value2);

      // Assert
      verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
    });
  });

  describe('remove', () => {
    it('removing non existing key, should not throw exception', () => {
      // Act
      var action = () => observableDictionary.remove({});

      // Assert
      expect(action).not.to.throw();
    });

    it('removing non existing key, should set size correctly', () => {
      // Act
      observableDictionary.remove({});

      // Assert
      expect(observableDictionary.size).to.be.equal(0);
    })

    it('removing key, should remove from keys', () => {
      // Arrange
      var key = {};
      var value = {};
      observableDictionary.add(key, value);

      // Act
      observableDictionary.remove(key);

      // Assert
      expect(observableDictionary.keys).to.be.length(0);
    });

    it('removing key, should remove from values', () => {
      // Arrange
      var key = {};
      var value = {};
      observableDictionary.add(key, value);

      // Act
      observableDictionary.remove(key);
      // Assert
      expect(observableDictionary.values).to.be.length(0);
    });

    it('removing key, should set size correctly', () => {
      // Arrange
      var key = {};
      var value = {};
      observableDictionary.add(key, value);

      // Act
      observableDictionary.remove(key);

      // Assert
      expect(observableDictionary.size).to.be.equal(0);
    });

    it('removing multiple keys, should remove from keys', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      observableDictionary.remove(keyValuePairs[0].key);
      observableDictionary.remove(keyValuePairs[2].key);

      // Assert
      expect(observableDictionary.keys).to.be.length(numberOfPairs - 2);

      expect(observableDictionary.keys).not.to.contain(keyValuePairs[0].key);
      expect(observableDictionary.keys).to.contain(keyValuePairs[1].key);
      expect(observableDictionary.keys).not.to.contain(keyValuePairs[2].key);
      expect(observableDictionary.keys).to.contain(keyValuePairs[3].key);
    });

    it('removing multiple keys, should remove from values', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      observableDictionary.remove(keyValuePairs[0].key);
      observableDictionary.remove(keyValuePairs[2].key);

      // Assert
      expect(observableDictionary.values).to.be.length(numberOfPairs - 2);

      expect(observableDictionary.values).not.to.contain(keyValuePairs[0].value);
      expect(observableDictionary.values).to.contain(keyValuePairs[1].value);
      expect(observableDictionary.values).not.to.contain(keyValuePairs[2].value);
      expect(observableDictionary.values).to.contain(keyValuePairs[3].value);
    });

    it('removing multiple keys, should set size correctly', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      observableDictionary.remove(keyValuePairs[0].key);
      observableDictionary.remove(keyValuePairs[2].key);

      // Assert
      expect(observableDictionary.size).to.be.equal(numberOfPairs - 2);
    });

    it('removing key, should not affect the json representation of both key and value', () => {
      // Arrange
      var key = { a: 1, b: [2] };
      var value = { c: 'c', d: ['e'] };

      var expectedKeyJson = JSON.stringify(key);
      var expectedValueJson = JSON.stringify(value);

      observableDictionary.add(key, value);

      // Act
      observableDictionary.remove(key);

      // Assert
      expect(JSON.stringify(key)).to.be.equal(expectedKeyJson);
      expect(JSON.stringify(value)).to.be.equal(expectedValueJson);
    });

    it('removing key, should not affect the for in loop for the key', () => {
      // Arrange
      var key = { a: 1, b: [2] };
      var value = { c: 'c', d: ['e'] };

      var expectedPropertiesWithValues: IPropertyWithValue[] =
        getPropertiesAndValues(key);

      observableDictionary.add(key, value);

      // Act
      observableDictionary.remove(key);

      // Assert
      var actualPropertiesWithValues: IPropertyWithValue[] =
        getPropertiesAndValues(key);

      verifySamePropertiesAndValues(actualPropertiesWithValues,
        expectedPropertiesWithValues);
    });

    it('removing key, should not affect the for in loop for the value', () => {
      // Arrange
      var key = { a: 1, b: [2] };
      var value = { c: 'c', d: ['e'] };

      var expectedPropertiesWithValues: IPropertyWithValue[] =
        getPropertiesAndValues(value);

      observableDictionary.add(key, value);

      // Act
      observableDictionary.remove(key);

      // Assert
      var actualPropertiesWithValues: IPropertyWithValue[] =
        getPropertiesAndValues(value);

      verifySamePropertiesAndValues(actualPropertiesWithValues,
        expectedPropertiesWithValues);
    });

    it('removing multiple keys, should raise itemsChanged correctly', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      var expectedArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] =
        [
          {
            added: [],
            removed: [keyValuePairs[0]]
          },
          {
            added: [],
            removed: [keyValuePairs[2]]
          }
        ];

      var actualArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] =
        registerToItemsChangedEvent(observableDictionary);

      // Act
      observableDictionary.remove(keyValuePairs[0].key);
      observableDictionary.remove(keyValuePairs[2].key);

      // Assert
      verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
    });

    it('removing by found key, should remove', () => {
      // Arrange
      var key = { someProp: 1 };
      var value = '1';

      interface ISomeKey {
        someProp: number;
      }

      var dictionary = new ObservableDictionary<ISomeKey, string>();
      dictionary.add(key, value);
      expect(dictionary.size).to.be.equal(1);
      expect(dictionary.keys).to.contain(key);

      // Act
      var key = dictionary.findKey(_ => _.someProp === 1);
      dictionary.remove(key);

      // Assert
      expect(dictionary.size).to.be.equal(0);
      expect(dictionary.keys).to.not.contain(key);
    });
  });

  describe('containsKey', () => {
    it('non existing key, should return false', () => {
      // Act
      var result = observableDictionary.containsKey({});

      // Assert
      expect(result).to.be.false;
    });

    it('adding key value pair, should contain the key', () => {
      // Arrange
      var key = {};
      var value = {};

      observableDictionary.add(key, value);

      // Act
      var result = observableDictionary.containsKey(key);

      // Assert
      expect(result).to.be.true;
    });

    it('adding multiple key value pairs, should contain the keys', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      var results: boolean[] = [];
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        var result = observableDictionary.containsKey(pair.key);
        results.push(result);
      }

      // Assert
      for (var i = 0; i < numberOfPairs; i++) {
        expect(results[i]).to.be.true;
      }
    });

    it('removing key, should not contain the key', () => {
      // Arrange
      var key = {};
      var value = {};
      observableDictionary.add(key, value);

      observableDictionary.remove(key);

      // Act
      var result = observableDictionary.containsKey(key);

      // Assert
      expect(result).to.be.false;
    });

    it('removing multiple keys, should not contain the keys', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      observableDictionary.remove(keyValuePairs[0].key);
      observableDictionary.remove(keyValuePairs[2].key);

      // Act
      var results: boolean[] = [];
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        var result = observableDictionary.containsKey(pair.key);
        results.push(result);
      }

      // Assert
      expect(results[0]).to.be.false;
      expect(results[1]).to.be.true;
      expect(results[2]).to.be.false;
      expect(results[3]).to.be.true;
    });
  });

  describe('containsValue', () => {
    it('non existing value, should return false', () => {
      // Act
      var result = observableDictionary.containsValue({});

      // Assert
      expect(result).to.be.false;
    });

    it('adding key value pair, should contain the value', () => {
      // Arrange
      var key = {};
      var value = {};

      observableDictionary.add(key, value);

      // Act
      var result = observableDictionary.containsValue(value);

      // Assert
      expect(result).to.be.true;
    });

    it('adding multiple key value pairs, should contain the values', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      var results: boolean[] = [];
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        var result = observableDictionary.containsValue(pair.value);
        results.push(result);
      }

      // Assert
      for (var i = 0; i < numberOfPairs; i++) {
        expect(results[i]).to.be.true;
      }
    });

    it('removing key, should not contain the value', () => {
      // Arrange
      var key = {};
      var value = {};
      observableDictionary.add(key, value);

      observableDictionary.remove(key);

      // Act
      var result = observableDictionary.containsValue(value);

      // Assert
      expect(result).to.be.false;
    });

    it('removing multiple keys, should not contain the values', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      observableDictionary.remove(keyValuePairs[0].key);
      observableDictionary.remove(keyValuePairs[2].key);

      // Act
      var results: boolean[] = [];
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        var result = observableDictionary.containsValue(pair.value);
        results.push(result);
      }

      // Assert
      expect(results[0]).to.be.false;
      expect(results[1]).to.be.true;
      expect(results[2]).to.be.false;
      expect(results[3]).to.be.true;
    });

    it('not existing value, passes the == test, should return false', () => {
      observableDictionary.add({}, 0);

      expect(observableDictionary.containsValue(false)).to.be.false;
    });
  });

  describe('getValueByKey', () => {
    it('non existing key, should throw error', () => {
      // Act
      var action = () => observableDictionary.getValueByKey({});

      // Assert
      expect(action).to.throw();
    });

    it('adding key value pair, should return correct value', () => {
      // Arrange
      var key = {};
      var value = {};

      observableDictionary.add(key, value);

      // Act
      var result = observableDictionary.getValueByKey(key);

      // Assert
      expect(result).to.be.equal(value);
    });

    it('adding multiple key value pairs, should return correct values', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      var results: Object[] = [];
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        var result = observableDictionary.getValueByKey(pair.key);
        results.push(result);
      }

      // Assert
      for (var i = 0; i < numberOfPairs; i++) {
        expect(results[i]).to.be.equal(keyValuePairs[i].value);
      }
    });

    it('requesting removed key, should throw error', () => {
      // Arrange
      var key = {};
      var value = {};
      observableDictionary.add(key, value);

      observableDictionary.remove(key);

      // Act
      var action = () => observableDictionary.getValueByKey(key);

      // Assert
      expect(action).to.throw();
    });

    it('removing multiple keys, should throw error on requesting removed keys', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      observableDictionary.remove(keyValuePairs[0].key);
      observableDictionary.remove(keyValuePairs[2].key);

      // Act
      var action0 = () => observableDictionary.getValueByKey(keyValuePairs[0].key);
      var action1 = () => observableDictionary.getValueByKey(keyValuePairs[1].key);
      var action2 = () => observableDictionary.getValueByKey(keyValuePairs[2].key);
      var action3 = () => observableDictionary.getValueByKey(keyValuePairs[3].key);

      // Assert
      expect(action0).to.throw();
      expect(action1()).to.be.equal(keyValuePairs[1].value);
      expect(action2).to.throw();
      expect(action3()).to.be.equal(keyValuePairs[3].value);
    });
  });

  describe('clear', () => {
    it('clear on empty dictionary, should not throw exception', () => {
      // Arrange
      var observableDictionary = new ObservableDictionary<any, any>();

      // Act
      var action = () => observableDictionary.clear();

      // Assert
      expect(action).not.to.throw();
    });

    it('clear on empty dictionary, should set size correctly', () => {
      // Arrange
      var observableDictionary = new ObservableDictionary<any, any>();

      // Act
      observableDictionary.clear();

      // Assert
      expect(observableDictionary.size).to.be.equal(0);
    })

    it('should clear the keys', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      observableDictionary.clear();

      // Assert
      expect(observableDictionary.keys).to.be.length(0);
    });

    it('should clear the values', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      observableDictionary.clear();

      // Assert
      expect(observableDictionary.values).to.be.length(0);
    });

    it('clear on not empty dictionary, should set size correctly', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      observableDictionary.clear();

      // Assert
      expect(observableDictionary.size).to.be.equal(0);
    });

    it('should raise itemsChanged correctly', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      var expectedArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] =
        [{
          added: [],
          removed: keyValuePairs
        }];

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      var actualArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] =
        registerToItemsChangedEvent(observableDictionary);

      // Act
      observableDictionary.clear();

      // Assert
      verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
    });

    it('should not contain the previosley existing keys', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      observableDictionary.clear();

      // Assert
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        expect(observableDictionary.containsKey(pair.key)).to.be.false;
      }
    });

    it('should not contain the previosley existing values', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      observableDictionary.clear();

      // Assert
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        expect(observableDictionary.containsValue(pair.value)).to.be.false;
      }
    });
  });

  describe('findKey', () => {
    it('returning false for all, should return null', () => {
      // Act
      var result = observableDictionary.findKey(_ => false);

      // Assert
      expect(result).to.be.null;
    });

    it('adding key value pair, should return true on the key, should return the key', () => {
      // Arrange
      var key = {};
      var value = {};

      observableDictionary.add(key, value);

      // Act
      var result = observableDictionary.findKey(_ => _ === key);

      // Assert
      expect(result).to.be.equal(key);
    });

    it('adding multiple key value pairs, returns true on second, should contain the second', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      // Act
      var result = observableDictionary.findKey(_ => _ === keyValuePairs[1].key);

      // Assert
      expect(result).to.be.equal(keyValuePairs[1].key);
    });

    it('removing key, should not find the key', () => {
      // Arrange
      var key = {};
      var value = {};
      observableDictionary.add(key, value);

      observableDictionary.remove(key);

      // Act
      var result = observableDictionary.findKey(_ => _ === key);

      // Assert
      expect(result).to.be.null;
    });

    it('removing multiple keys, should not find the keys', () => {
      // Arrange
      var numberOfPairs = 4;
      var keyValuePairs = createKeyValuePairs(numberOfPairs);

      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];
        observableDictionary.add(pair.key, pair.value);
      }

      observableDictionary.remove(keyValuePairs[0].key);
      observableDictionary.remove(keyValuePairs[2].key);

      // Act
      var results: Object[] = [];
      for (var i = 0; i < numberOfPairs; i++) {
        var pair: IKeyValue<Object, Object> = keyValuePairs[i];

        var result = observableDictionary.findKey(_ => _ === pair.key);
        results.push(result);
      }

      // Assert
      expect(results[0]).to.be.null;
      expect(results[1]).to.be.equal(keyValuePairs[1].key);
      expect(results[2]).to.be.null;
      expect(results[3]).to.be.equal(keyValuePairs[3].key);
    });
  });

  describe('multiple dictionaries', () => {
    it('adding to multiple dictionaries should contain the keys and values in all', () => {
      // Arrange
      var key1 = {};
      var key2 = {};
      var value1 = {};
      var value2 = {};

      var observableDictionary1 = new ObservableDictionary<any, any>();
      var observableDictionary2 = new ObservableDictionary<any, any>();
      var observableDictionary3 = new ObservableDictionary<any, any>();

      // Act
      observableDictionary1.add(key1, value1);
      observableDictionary2.add(key1, value1);
      observableDictionary3.add(key1, value1);
      observableDictionary1.add(key2, value2);
      observableDictionary2.add(key2, value2);
      observableDictionary3.add(key2, value2);

      // Assert
      expect(observableDictionary1.size).to.be.equal(2);
      expect(observableDictionary2.size).to.be.equal(2);
      expect(observableDictionary3.size).to.be.equal(2);

      expect(observableDictionary1.keys).to.contain(key1);
      expect(observableDictionary1.keys).to.contain(key2);
      expect(observableDictionary2.keys).to.contain(key1);
      expect(observableDictionary2.keys).to.contain(key2);
      expect(observableDictionary3.keys).to.contain(key1);
      expect(observableDictionary3.keys).to.contain(key2);

      expect(observableDictionary1.values).to.contain(value1);
      expect(observableDictionary1.values).to.contain(value2);
      expect(observableDictionary2.values).to.contain(value1);
      expect(observableDictionary2.values).to.contain(value2);
      expect(observableDictionary3.values).to.contain(value1);
      expect(observableDictionary3.values).to.contain(value2);

      expect(observableDictionary1.getValueByKey(key1)).to.be.equal(value1);
      expect(observableDictionary2.getValueByKey(key1)).to.be.equal(value1);
      expect(observableDictionary3.getValueByKey(key1)).to.be.equal(value1);
      expect(observableDictionary1.getValueByKey(key2)).to.be.equal(value2);
      expect(observableDictionary2.getValueByKey(key2)).to.be.equal(value2);
      expect(observableDictionary3.getValueByKey(key2)).to.be.equal(value2);

      expect(observableDictionary1.containsKey(key1)).to.be.true;
      expect(observableDictionary1.containsKey(key2)).to.be.true;
      expect(observableDictionary2.containsKey(key1)).to.be.true;
      expect(observableDictionary2.containsKey(key2)).to.be.true;
      expect(observableDictionary3.containsKey(key1)).to.be.true;
      expect(observableDictionary3.containsKey(key2)).to.be.true;

      expect(observableDictionary1.containsValue(value1)).to.be.true;
      expect(observableDictionary1.containsValue(value2)).to.be.true;
      expect(observableDictionary2.containsValue(value1)).to.be.true;
      expect(observableDictionary2.containsValue(value2)).to.be.true;
      expect(observableDictionary3.containsValue(value1)).to.be.true;
      expect(observableDictionary3.containsValue(value2)).to.be.true;
    });

    it('add to multiple dictionaries, remove key from one, clear the other, should act properly', () => {
      // Arrange
      var key1 = { a: 1 };
      var key2 = { b: 2 };
      var value1 = { c: 3 };
      var value2 = { d: 4 };

      var observableDictionary1 = new ObservableDictionary<any, any>();
      var observableDictionary2 = new ObservableDictionary<any, any>();
      var observableDictionary3 = new ObservableDictionary<any, any>();

      // Act
      observableDictionary1.add(key1, value1);
      observableDictionary2.add(key1, value1);
      observableDictionary3.add(key1, value1);
      observableDictionary1.add(key2, value2);
      observableDictionary2.add(key2, value2);
      observableDictionary3.add(key2, value2);

      observableDictionary2.remove(key2);
      observableDictionary1.clear();

      // Assert
      expect(observableDictionary1.size, 'size should be correct').to.be.equal(0);
      expect(observableDictionary2.size, 'size should be correct').to.be.equal(1);
      expect(observableDictionary3.size, 'size should be correct').to.be.equal(2);

      expect(observableDictionary1.keys, 'keys should be correct').not.to.contain(key1);
      expect(observableDictionary1.keys, 'keys should be correct').not.to.contain(key2);
      expect(observableDictionary2.keys, 'keys should be correct').to.contain(key1);
      expect(observableDictionary2.keys, 'keys should be correct').not.to.contain(key2);
      expect(observableDictionary3.keys, 'keys should be correct').to.contain(key1);
      expect(observableDictionary3.keys, 'keys should be correct').to.contain(key2);

      expect(observableDictionary1.values, 'values should be correct').not.to.contain(value1);
      expect(observableDictionary1.values, 'values should be correct').not.to.contain(value2);
      expect(observableDictionary2.values, 'values should be correct').to.contain(value1);
      expect(observableDictionary2.values, 'values should be correct').not.to.contain(value2);
      expect(observableDictionary3.values, 'values should be correct').to.contain(value1);
      expect(observableDictionary3.values, 'values should be correct').to.contain(value2);

      expect(observableDictionary2.getValueByKey(key1), 'getValueByKey should return correct value').to.be.equal(value1);
      expect(observableDictionary3.getValueByKey(key1), 'getValueByKey should return correct value').to.be.equal(value1);
      expect(observableDictionary3.getValueByKey(key2), 'getValueByKey should return correct value').to.be.equal(value2);

      expect(observableDictionary1.containsKey(key1), 'dictionary1 contains key1 should work ok').to.be.false;
      expect(observableDictionary1.containsKey(key2), 'dictionary1 contains key2 should work ok').to.be.false;
      expect(observableDictionary2.containsKey(key1), 'dictionary2 contains key1 should work ok').to.be.true;
      expect(observableDictionary2.containsKey(key2), 'dictionary2 contains key2 should work ok').to.be.false;
      expect(observableDictionary3.containsKey(key1), 'dictionary3 contains key1 should work ok').to.be.true;
      expect(observableDictionary3.containsKey(key2), 'dictionary3 contains key2 should work ok').to.be.true;

      expect(observableDictionary1.containsValue(value1), 'contains value should work ok').to.be.false;
      expect(observableDictionary1.containsValue(value2), 'contains value should work ok').to.be.false;
      expect(observableDictionary2.containsValue(value1), 'contains value should work ok').to.be.true;
      expect(observableDictionary2.containsValue(value2), 'contains value should work ok').to.be.false;
      expect(observableDictionary3.containsValue(value1), 'contains value should work ok').to.be.true;
      expect(observableDictionary3.containsValue(value2), 'contains value should work ok').to.be.true;
    });
  });
});
