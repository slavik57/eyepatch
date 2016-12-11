import { expect } from 'chai';
import { IEventT } from '../events/interfaces/iEvent';
import { IItemsChangedEventArgs } from './interfaces/iItemsChangedEventArgs';
import { IKeyValue } from './interfaces/iKeyValue';
import { IObservableDictionary } from './interfaces/iObservableDictionary';
import { ObservableDictionary } from './observableDictionary';
import { spy } from 'sinon';

interface IPropertyWithValue {
  property: any;
  value: any;
}

describe('ObservableDictionary', () => {

  function getPropertiesAndValues(object: any): IPropertyWithValue[] {
    const result: IPropertyWithValue[] = [];

    for (let property in object) {
      if (!object.hasOwnProperty(property)) {
        continue;
      }

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

    for (let i = 0; i < expected.length; i++) {
      const actualPropery = actual[i].property;
      const actualValue = actual[i].value;

      const expectedProperty = expected[i].property;
      const expectedValue = expected[i].value;

      expect(actualPropery).to.be.equal(expectedProperty);
      expect(actualValue).to.be.equal(expectedValue);
    }
  }

  function registerToItemsChangedEvent<T>(observableDictionary: IObservableDictionary<T, Object>):
    IItemsChangedEventArgs<IKeyValue<T, Object>>[] {
    const actualArgs: IItemsChangedEventArgs<IKeyValue<T, Object>>[] = [];

    observableDictionary.itemsChanged.on(
      _args => {
        actualArgs.push(_args);
      });

    return actualArgs;
  }

  function verifyItemsChangedWasRaisedCorrectly<T>(actual: IItemsChangedEventArgs<IKeyValue<T, Object>>[],
    expected: IItemsChangedEventArgs<IKeyValue<T, Object>>[]): void {

    expect(actual).to.be.length(expected.length);

    for (let i = 0; i < expected.length; i++) {
      const actualArg = actual[i];
      const expectedArg = expected[i];

      veriftyItemsChangedEventArgsAreEqual(actualArg, expectedArg);
    }
  }

  function veriftyItemsChangedEventArgsAreEqual<T>(actual: IItemsChangedEventArgs<IKeyValue<T, Object>>,
    expected: IItemsChangedEventArgs<IKeyValue<T, Object>>): void {

    verifyKeyValuesEqual(actual.added, expected.added);
    verifyKeyValuesEqual(actual.removed, expected.removed);
  }

  function verifyKeyValuesEqual<T>(actual: IKeyValue<T, Object>[],
    expected: IKeyValue<T, Object>[]): void {
    expect(actual).to.be.length(expected.length);

    for (let i = 0; i < expected.length; i++) {
      const actualKeyValue: IKeyValue<T, Object> = actual[i];
      const expectedKeyValue: IKeyValue<T, Object> = expected[i];

      expect(actualKeyValue.key).to.be.equal(expectedKeyValue.key);
      expect(actualKeyValue.value).to.be.equal(expectedKeyValue.value);
    }
  }

  interface IConfiguration<T> {
    key: T;
    key2: T;
    value: Object;
    value2: Object;
    complexKey: T;
    complexKey2: T;
    complexValue: Object;
    complexValue2: Object;
    createKeyValuePairs: () => IKeyValue<T, Object>[];
  }

  describe('constructor', () => {
    it('should initialize with empty keys and values', () => {
      // Act
      const observableDictionary = new ObservableDictionary<any, any>();

      // Assert
      expect(observableDictionary.keys).to.be.empty;
      expect(observableDictionary.values).to.be.empty;
    });

    it('should set size correctly', () => {
      // Act
      const observableDictionary = new ObservableDictionary<any, any>();

      // Assert
      expect(observableDictionary.size).to.be.equal(0);
    });
  });

  describe('key type is object', () => {
    testDictionaryWithConfiguration(() => (<IConfiguration<Object>>{
      key: {},
      key2: {},
      value: {},
      value2: {},
      complexKey: { a: 1, b: [2] },
      complexKey2: { a: 2, b: [3], c: '4' },
      complexValue: { c: 'c', d: ['e'] },
      complexValue2: { d: 5, e: '6' },
      createKeyValuePairs: (): IKeyValue<Object, Object>[] => {
        const numberOfPairs = 4;

        const result: IKeyValue<Object, Object>[] = [];

        for (let i = 0; i < numberOfPairs; i++) {
          const key = { keyItem: i };
          const value = { valueItem: i };

          result.push({
            key: key,
            value: value
          });
        }

        return result;
      }
    }));
  });

  describe('key type is string', () => {
    testDictionaryWithConfiguration(() => (<IConfiguration<string>>{
      key: 'key',
      key2: 'key2',
      value: {},
      value2: {},
      complexKey: 'complex key',
      complexKey2: 'complex key 2',
      complexValue: { c: 'c', d: ['e'] },
      complexValue2: { d: 5, e: '6' },
      createKeyValuePairs: (): IKeyValue<string, Object>[] => {
        const numberOfPairs = 4;

        const result: IKeyValue<string, Object>[] = [];

        for (let i = 0; i < numberOfPairs; i++) {
          const key = `key ${i}`;
          const value = { valueItem: i };

          result.push({
            key: key,
            value: value
          });
        }

        return result;
      }
    }));
  });

  describe('key type is number', () => {
    testDictionaryWithConfiguration(() => (<IConfiguration<number>>{
      key: 1,
      key2: 2,
      value: {},
      value2: {},
      complexKey: 1.23,
      complexKey2: 4.56,
      complexValue: { c: 'c', d: ['e'] },
      complexValue2: { d: 5, e: '6' },
      createKeyValuePairs: (): IKeyValue<number, Object>[] => {
        const numberOfPairs = 4;

        const result: IKeyValue<number, Object>[] = [];

        for (let i = 0; i < numberOfPairs; i++) {
          const key = i;
          const value = { valueItem: i };

          result.push({
            key: key,
            value: value
          });
        }

        return result;
      }
    }));
  });

  describe('key type is boolean', () => {
    testDictionaryWithConfiguration(() => (<IConfiguration<boolean>>{
      key: true,
      key2: false,
      value: {},
      value2: {},
      complexKey: true,
      complexKey2: false,
      complexValue: { c: 'c', d: ['e'] },
      complexValue2: { d: 5, e: '6' },
      createKeyValuePairs: (): IKeyValue<boolean, Object>[] => {
        const numberOfPairs = 2;

        const result: IKeyValue<boolean, Object>[] = [];

        for (let i = 0; i < numberOfPairs; i++) {
          const key = i % 2 === 0;
          const value = { valueItem: i };

          result.push({
            key: key,
            value: value
          });
        }

        return result;
      }
    }));
  });

  function testDictionaryWithConfiguration<T>(getConfiguration: () => IConfiguration<T>) {
    let observableDictionary: IObservableDictionary<T, Object>;
    let configuration: IConfiguration<T>;

    beforeEach(() => {
      configuration = getConfiguration();
      observableDictionary = new ObservableDictionary<T, Object>();
    });

    describe('add', () => {
      it('adding key value pair, should add to keys', () => {
        // Act
        observableDictionary.add(configuration.key, configuration.value);

        // Assert
        expect(observableDictionary.keys).to.be.length(1);
        expect(observableDictionary.keys).to.contain(configuration.key);
      });

      it('adding key value pair, should add to values', () => {
        // Act
        observableDictionary.add(configuration.key, configuration.value);

        // Assert
        expect(observableDictionary.values).to.be.length(1);
        expect(observableDictionary.values).to.contain(configuration.value);
      });

      it('adding key value pair, should add to keysAndValues', () => {
        // Act
        observableDictionary.add(configuration.key, configuration.value);

        // Assert
        const keysAndValues = observableDictionary.keysAndValues;
        expect(keysAndValues).to.be.length(1);
        expect(keysAndValues[0].key).to.be.equal(configuration.key);
        expect(keysAndValues[0].value).to.be.equal(configuration.value);
      });

      it('adding key value pair, should set size correctly', () => {
        // Act
        observableDictionary.add(configuration.key, configuration.value);

        // Assert
        expect(observableDictionary.size).to.be.equal(1);
      });

      it('adding multiple key value pairs, should add to keys', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        // Act
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Assert
        expect(observableDictionary.keys).to.be.length(numberOfPairs);

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          expect(observableDictionary.keys).to.contain(pair.key);
        }
      });

      it('adding multiple key value pairs, should add to values', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        // Act
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Assert
        expect(observableDictionary.values).to.be.length(numberOfPairs);

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          expect(observableDictionary.values).to.contain(pair.value);
        }
      });

      it('adding multiple key value pairs, should add to keysAndValues', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        // Act
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Assert
        const keysAndValues: IKeyValue<T, Object>[] = observableDictionary.keysAndValues;
        expect(keysAndValues).to.be.length(numberOfPairs);

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          const actualPair: IKeyValue<T, Object> = keysAndValues[i];

          expect(actualPair.key).to.be.equal(pair.key);
          expect(actualPair.value).to.be.equal(pair.value);
        }
      });

      it('adding multiple key value pairs, should set size correctly', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        // Act
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Assert
        expect(observableDictionary.size).to.be.equal(numberOfPairs);
      });

      it('adding key value pair, should not affect the json representation of both', () => {
        // Arrange
        const key = configuration.complexKey;
        const value = configuration.complexValue;

        const expectedKeyJson = JSON.stringify(key);
        const expectedValueJson = JSON.stringify(value);

        // Act
        observableDictionary.add(key, value);

        // Assert
        expect(JSON.stringify(key)).to.be.equal(expectedKeyJson);
        expect(JSON.stringify(value)).to.be.equal(expectedValueJson);
      });

      it('adding key value pair, should not affect the for in loop for the key', () => {
        // Arrange
        const key = configuration.complexKey;
        const value = configuration.complexValue;

        const expectedPropertiesWithValues: IPropertyWithValue[] =
          getPropertiesAndValues(key);

        // Act
        observableDictionary.add(key, value);

        // Assert
        const actualPropertiesWithValues: IPropertyWithValue[] =
          getPropertiesAndValues(key);

        verifySamePropertiesAndValues(actualPropertiesWithValues,
          expectedPropertiesWithValues);
      });

      it('adding key value pair, should not affect the for in loop for the value', () => {
        // Arrange
        const key = configuration.complexKey;
        const value = configuration.complexValue;

        const expectedPropertiesWithValues: IPropertyWithValue[] =
          getPropertiesAndValues(value);

        // Act
        observableDictionary.add(key, value);

        // Assert
        const actualPropertiesWithValues: IPropertyWithValue[] =
          getPropertiesAndValues(value);

        verifySamePropertiesAndValues(actualPropertiesWithValues,
          expectedPropertiesWithValues);
      });

      it('adding multiple key value pairs, should raise itemsChanged correctly', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        const expectedArgs: IItemsChangedEventArgs<IKeyValue<T, Object>>[] = [];
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          expectedArgs.push({
            added: [pair],
            removed: []
          });
        }

        const actualArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] =
          registerToItemsChangedEvent(observableDictionary);

        // Act
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Assert
        verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
      });

      it('adding key value pair with existing key, should override the value', () => {
        // Arrange
        const key = configuration.key;
        const value1 = configuration.value;
        const value2 = configuration.value2;

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
        const key = configuration.key;
        const value1 = configuration.value;
        const value2 = configuration.value2;

        observableDictionary.add(key, value1);

        const expectedArgs: IItemsChangedEventArgs<IKeyValue<T, Object>>[] =
          [
            {
              added: [{ key: key, value: value2 }],
              removed: [{ key: key, value: value1 }]
            }
          ];

        const actualArgs: IItemsChangedEventArgs<IKeyValue<T, Object>>[] =
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
        const action = () => observableDictionary.remove(configuration.key);

        // Assert
        expect(action).not.to.throw();
      });

      it('removing non existing key, should set size correctly', () => {
        // Act
        observableDictionary.remove(configuration.key);

        // Assert
        expect(observableDictionary.size).to.be.equal(0);
      })

      it('removing key, should remove from keys', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;
        observableDictionary.add(key, value);

        // Act
        observableDictionary.remove(key);

        // Assert
        expect(observableDictionary.keys).to.be.length(0);
      });

      it('removing key, should remove from values', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;
        observableDictionary.add(key, value);

        // Act
        observableDictionary.remove(key);
        // Assert
        expect(observableDictionary.values).to.be.length(0);
      });

      it('removing key, should remove from keysAndValues', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;
        observableDictionary.add(key, value);

        // Act
        observableDictionary.remove(key);
        // Assert
        expect(observableDictionary.keysAndValues).to.be.length(0);
      });

      it('removing key, should set size correctly', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;
        observableDictionary.add(key, value);

        // Act
        observableDictionary.remove(key);

        // Assert
        expect(observableDictionary.size).to.be.equal(0);
      });

      it('removing multiple keys, should remove from keys', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        const pairToRemove1 = keyValuePairs[0];
        const pairToRemove2 = keyValuePairs[numberOfPairs / 2];

        // Act
        observableDictionary.remove(pairToRemove1.key);
        observableDictionary.remove(pairToRemove2.key);

        // Assert
        expect(observableDictionary.keys).to.be.length(numberOfPairs - 2);
        expect(observableDictionary.keys).not.to.contain(pairToRemove1.key);
        expect(observableDictionary.keys).not.to.contain(pairToRemove2.key);

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          if (pair === pairToRemove1 ||
            pair === pairToRemove2) {
            continue;
          }

          expect(observableDictionary.keys).to.contain(pair.key);
        }
      });

      it('removing multiple keys, should remove from values', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        const pairToRemove1 = keyValuePairs[0];
        const pairToRemove2 = keyValuePairs[numberOfPairs / 2];

        // Act
        observableDictionary.remove(pairToRemove1.key);
        observableDictionary.remove(pairToRemove2.key);

        // Assert
        expect(observableDictionary.values).to.be.length(numberOfPairs - 2);
        expect(observableDictionary.values).not.to.contain(pairToRemove1.value);
        expect(observableDictionary.values).not.to.contain(pairToRemove2.value);

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          if (pair === pairToRemove1 ||
            pair === pairToRemove2) {
            continue;
          }

          expect(observableDictionary.values).to.contain(pair.value);
        }
      });

      it('removing multiple keys, should remove from keysAndValues', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        const pairToRemove1 = keyValuePairs[0];
        const pairToRemove2 = keyValuePairs[numberOfPairs / 2];

        // Act
        observableDictionary.remove(pairToRemove1.key);
        observableDictionary.remove(pairToRemove2.key);

        // Assert
        const keysAndValues: IKeyValue<T, Object>[] = observableDictionary.keysAndValues;

        expect(keysAndValues).to.be.length(numberOfPairs - 2);
        expect(keysAndValues.map(_ => _.key)).not.to.contain(pairToRemove1.key);
        expect(keysAndValues.map(_ => _.key)).not.to.contain(pairToRemove2.key);
        expect(keysAndValues.map(_ => _.value)).not.to.contain(pairToRemove1.value);
        expect(keysAndValues.map(_ => _.value)).not.to.contain(pairToRemove2.value);

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          if (pair === pairToRemove1 ||
            pair === pairToRemove2) {
            continue;
          }

          expect(keysAndValues.map(_ => _.key)).to.contain(pair.key);
          expect(keysAndValues.map(_ => _.value)).to.contain(pair.value);
        }
      });

      it('removing multiple keys, should set size correctly', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        const pairToRemove1 = keyValuePairs[0];
        const pairToRemove2 = keyValuePairs[numberOfPairs / 2];

        // Act
        observableDictionary.remove(pairToRemove1.key);
        observableDictionary.remove(pairToRemove2.key);

        // Assert
        expect(observableDictionary.size).to.be.equal(numberOfPairs - 2);
      });

      it('removing key, should not affect the json representation of both key and value', () => {
        // Arrange
        const key = configuration.complexKey;
        const value = configuration.complexValue;

        const expectedKeyJson = JSON.stringify(key);
        const expectedValueJson = JSON.stringify(value);

        observableDictionary.add(key, value);

        // Act
        observableDictionary.remove(key);

        // Assert
        expect(JSON.stringify(key)).to.be.equal(expectedKeyJson);
        expect(JSON.stringify(value)).to.be.equal(expectedValueJson);
      });

      it('removing key, should not affect the for in loop for the key', () => {
        // Arrange
        const key = configuration.complexKey;
        const value = configuration.complexValue;

        const expectedPropertiesWithValues: IPropertyWithValue[] =
          getPropertiesAndValues(key);

        observableDictionary.add(key, value);

        // Act
        observableDictionary.remove(key);

        // Assert
        const actualPropertiesWithValues: IPropertyWithValue[] =
          getPropertiesAndValues(key);

        verifySamePropertiesAndValues(actualPropertiesWithValues,
          expectedPropertiesWithValues);
      });

      it('removing key, should not affect the for in loop for the value', () => {
        // Arrange
        const key = configuration.complexKey;
        const value = configuration.complexValue;

        const expectedPropertiesWithValues: IPropertyWithValue[] =
          getPropertiesAndValues(value);

        observableDictionary.add(key, value);

        // Act
        observableDictionary.remove(key);

        // Assert
        const actualPropertiesWithValues: IPropertyWithValue[] =
          getPropertiesAndValues(value);

        verifySamePropertiesAndValues(actualPropertiesWithValues,
          expectedPropertiesWithValues);
      });

      it('removing multiple keys, should raise itemsChanged correctly', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        const pairToRemove1 = keyValuePairs[0];
        const pairToRemove2 = keyValuePairs[numberOfPairs / 2];

        const expectedArgs: IItemsChangedEventArgs<IKeyValue<T, Object>>[] =
          [
            {
              added: [],
              removed: [pairToRemove1]
            },
            {
              added: [],
              removed: [pairToRemove2]
            }
          ];

        const actualArgs: IItemsChangedEventArgs<IKeyValue<T, Object>>[] =
          registerToItemsChangedEvent(observableDictionary);

        // Act
        observableDictionary.remove(pairToRemove1.key);
        observableDictionary.remove(pairToRemove2.key);

        // Assert
        verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
      });

      it('removing by found key, should remove', () => {
        // Arrange
        const key = { someProp: 1 };
        const value = '1';

        interface ISomeKey {
          someProp: number;
        }

        const dictionary = new ObservableDictionary<ISomeKey, string>();
        dictionary.add(key, value);
        expect(dictionary.size).to.be.equal(1);
        expect(dictionary.keys).to.contain(key);

        // Act
        const foundKey = dictionary.findKey(_ => _.someProp === 1);
        dictionary.remove(foundKey);

        // Assert
        expect(dictionary.size).to.be.equal(0);
        expect(dictionary.keys).to.not.contain(key);
      });
    });

    describe('containsKey', () => {
      it('non existing key, should return false', () => {
        // Act
        const result = observableDictionary.containsKey(configuration.key);

        // Assert
        expect(result).to.be.false;
      });

      it('adding key value pair, should contain the key', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;

        observableDictionary.add(key, value);

        // Act
        const result = observableDictionary.containsKey(key);

        // Assert
        expect(result).to.be.true;
      });

      it('adding multiple key value pairs, should contain the keys', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Act
        const results: boolean[] = [];
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          const result = observableDictionary.containsKey(pair.key);
          results.push(result);
        }

        // Assert
        for (let i = 0; i < numberOfPairs; i++) {
          expect(results[i]).to.be.true;
        }
      });

      it('removing key, should not contain the key', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;
        observableDictionary.add(key, value);

        observableDictionary.remove(key);

        // Act
        const result = observableDictionary.containsKey(key);

        // Assert
        expect(result).to.be.false;
      });

      it('removing multiple keys, should not contain the keys', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        const pairToRemove1 = keyValuePairs[0];
        const pairToRemove2 = keyValuePairs[numberOfPairs / 2];

        observableDictionary.remove(pairToRemove1.key);
        observableDictionary.remove(pairToRemove2.key);

        // Act
        const results: boolean[] = [];
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          const result = observableDictionary.containsKey(pair.key);
          results.push(result);
        }

        // Assert
        expect(results[0]).to.be.false;
        expect(results[numberOfPairs / 2]).to.be.false;

        results.splice(numberOfPairs / 2);
        results.splice(0);

        for (let i = 0; i < results.length; i++) {
          expect(results[i]).to.be.true;
        }
      });
    });

    describe('containsValue', () => {
      it('non existing value, should return false', () => {
        // Act
        const result = observableDictionary.containsValue(configuration.key);

        // Assert
        expect(result).to.be.false;
      });

      it('adding key value pair, should contain the value', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;

        observableDictionary.add(key, value);

        // Act
        const result = observableDictionary.containsValue(value);

        // Assert
        expect(result).to.be.true;
      });

      it('adding multiple key value pairs, should contain the values', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Act
        const results: boolean[] = [];
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          const result = observableDictionary.containsValue(pair.value);
          results.push(result);
        }

        // Assert
        for (let i = 0; i < numberOfPairs; i++) {
          expect(results[i]).to.be.true;
        }
      });

      it('removing key, should not contain the value', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;
        observableDictionary.add(key, value);

        observableDictionary.remove(key);

        // Act
        const result = observableDictionary.containsValue(value);

        // Assert
        expect(result).to.be.false;
      });

      it('removing multiple keys, should not contain the values', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        const pairToRemove1 = keyValuePairs[0];
        const pairToRemove2 = keyValuePairs[numberOfPairs / 2];

        observableDictionary.remove(pairToRemove1.key);
        observableDictionary.remove(pairToRemove2.key);

        // Act
        const results: boolean[] = [];
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          const result = observableDictionary.containsValue(pair.value);
          results.push(result);
        }

        // Assert
        expect(results[0]).to.be.false;
        expect(results[numberOfPairs / 2]).to.be.false;

        results.splice(numberOfPairs / 2);
        results.splice(0);

        for (let i = 0; i < results.length; i++) {
          expect(results[i]).to.be.true;
        }
      });

      it('not existing value, passes the == test, should return false', () => {
        observableDictionary.add(configuration.key, 0);

        expect(observableDictionary.containsValue(false)).to.be.false;
      });
    });

    describe('getValueByKey', () => {
      it('non existing key, should throw error', () => {
        // Act
        const action = () => observableDictionary.getValueByKey(configuration.key);

        // Assert
        expect(action).to.throw();
      });

      it('adding key value pair, should return correct value', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;

        observableDictionary.add(key, value);

        // Act
        const result = observableDictionary.getValueByKey(key);

        // Assert
        expect(result).to.be.equal(value);
      });

      it('adding multiple key value pairs, should return correct values', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Act
        const results: Object[] = [];
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          const result = observableDictionary.getValueByKey(pair.key);
          results.push(result);
        }

        // Assert
        for (let i = 0; i < numberOfPairs; i++) {
          expect(results[i]).to.be.equal(keyValuePairs[i].value);
        }
      });

      it('requesting removed key, should throw error', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;
        observableDictionary.add(key, value);

        observableDictionary.remove(key);

        // Act
        const action = () => observableDictionary.getValueByKey(key);

        // Assert
        expect(action).to.throw();
      });

      it('removing multiple keys, should throw error on requesting removed keys', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        const pairToRemove1 = keyValuePairs[0];
        const pairToRemove2 = keyValuePairs[numberOfPairs / 2];

        observableDictionary.remove(pairToRemove1.key);
        observableDictionary.remove(pairToRemove2.key);

        // Act + Assert
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          if (pair === pairToRemove1 ||
            pair === pairToRemove2) {
            expect(() => observableDictionary.getValueByKey(pair.key)).to.throw();
            continue;
          }

          expect(observableDictionary.getValueByKey(pair.key)).to.be.equal(pair.value);
        }
      });
    });

    describe('clear', () => {
      it('clear on empty dictionary, should not throw exception', () => {
        // Arrange
        const observableDictionary = new ObservableDictionary<T, any>();

        // Act
        const action = () => observableDictionary.clear();

        // Assert
        expect(action).not.to.throw();
      });

      it('clear on empty dictionary, should set size correctly', () => {
        // Arrange
        const observableDictionary = new ObservableDictionary<T, any>();

        // Act
        observableDictionary.clear();

        // Assert
        expect(observableDictionary.size).to.be.equal(0);
      })

      it('should clear the keys', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Act
        observableDictionary.clear();

        // Assert
        expect(observableDictionary.keys).to.be.length(0);
      });

      it('should clear the values', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Act
        observableDictionary.clear();

        // Assert
        expect(observableDictionary.values).to.be.length(0);
      });

      it('clear on not empty dictionary, should set size correctly', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Act
        observableDictionary.clear();

        // Assert
        expect(observableDictionary.size).to.be.equal(0);
      });

      it('should raise itemsChanged correctly', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        const expectedArgs: IItemsChangedEventArgs<IKeyValue<T, Object>>[] =
          [{
            added: [],
            removed: keyValuePairs
          }];

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        const actualArgs: IItemsChangedEventArgs<IKeyValue<Object, Object>>[] =
          registerToItemsChangedEvent(observableDictionary);

        // Act
        observableDictionary.clear();

        // Assert
        verifyItemsChangedWasRaisedCorrectly(actualArgs, expectedArgs);
      });

      it('should not contain the previosley existing keys', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Act
        observableDictionary.clear();

        // Assert
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          expect(observableDictionary.containsKey(pair.key)).to.be.false;
        }
      });

      it('should not contain the previosley existing values', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Act
        observableDictionary.clear();

        // Assert
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          expect(observableDictionary.containsValue(pair.value)).to.be.false;
        }
      });
    });

    describe('findKey', () => {
      it('returning false for all, should return null', () => {
        // Act
        const result = observableDictionary.findKey(_ => false);

        // Assert
        expect(result).to.be.null;
      });

      it('adding key value pair, should return true on the key, should return the key', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;

        observableDictionary.add(key, value);

        // Act
        const result = observableDictionary.findKey(_ => _ === key);

        // Assert
        expect(result).to.be.equal(key);
      });

      it('adding multiple key value pairs, returns true on second, should contain the second', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        // Act
        const result = observableDictionary.findKey(_ => _ === keyValuePairs[1].key);

        // Assert
        expect(result).to.be.equal(keyValuePairs[1].key);
      });

      it('removing key, should not find the key', () => {
        // Arrange
        const key = configuration.key;
        const value = configuration.value;
        observableDictionary.add(key, value);

        observableDictionary.remove(key);

        // Act
        const result = observableDictionary.findKey(_ => _ === key);

        // Assert
        expect(result).to.be.null;
      });

      it('removing multiple keys, should not find the keys', () => {
        // Arrange
        const keyValuePairs = configuration.createKeyValuePairs();
        const numberOfPairs = keyValuePairs.length;

        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];
          observableDictionary.add(pair.key, pair.value);
        }

        const pairToRemove1 = keyValuePairs[0];
        const pairToRemove2 = keyValuePairs[numberOfPairs / 2];

        observableDictionary.remove(pairToRemove1.key);
        observableDictionary.remove(pairToRemove2.key);

        // Act
        const results: T[] = [];
        const expectedResults: T[] = [];
        for (let i = 0; i < numberOfPairs; i++) {
          const pair: IKeyValue<T, Object> = keyValuePairs[i];

          const result = observableDictionary.findKey(_ => _ === pair.key);
          results.push(result);

          if (pair === pairToRemove1 || pair === pairToRemove2) {
            expectedResults.push(null);
          } else {
            expectedResults.push(pair.key);
          }
        }

        // Assert
        for (let i = 0; i < results.length; i++) {
          expect(results[i]).to.be.equal(expectedResults[i]);
        }
      });
    });

    describe('multiple dictionaries', () => {
      it('adding to multiple dictionaries should contain the keys and values in all', () => {
        // Arrange
        const key1 = configuration.key;
        const key2 = configuration.key2;
        const value1 = configuration.value;
        const value2 = configuration.value2;

        const observableDictionary1 = new ObservableDictionary<any, any>();
        const observableDictionary2 = new ObservableDictionary<any, any>();
        const observableDictionary3 = new ObservableDictionary<any, any>();

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
        const key1 = configuration.complexKey;
        const key2 = configuration.complexKey2;
        const value1 = configuration.complexValue;
        const value2 = configuration.complexValue2;

        const observableDictionary1 = new ObservableDictionary<any, any>();
        const observableDictionary2 = new ObservableDictionary<any, any>();
        const observableDictionary3 = new ObservableDictionary<any, any>();

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
  }

  it('add/remove different types should raise events correctly', () => {
    // Arrange
    const dictionary = new ObservableDictionary<any, any>();

    const key1 = {};
    const key2 = 2;
    const key3 = {};

    const eventHandler: Sinon.SinonSpy = spy();

    dictionary.itemsChanged.on(eventHandler);

    // Act
    dictionary.add(key1, {});
    dictionary.add(key2, {});
    dictionary.add(key3, {});
    dictionary.remove(key2);
    dictionary.remove(key1);

    // Assert
    expect(eventHandler.callCount).to.be.equal(5, 'should be called correct number of times');
    expect(eventHandler.args[0][0].added).to.be.length(1, 'first time should add');
    expect(eventHandler.args[0][0].removed).to.be.length(0, 'first time should not remove');
    expect(eventHandler.args[0][0].added[0].key).to.be.equal(key1, 'should add key1');
    expect(eventHandler.args[1][0].added).to.be.length(1, 'second time should add');
    expect(eventHandler.args[1][0].removed).to.be.length(0, 'second time should not remove');
    expect(eventHandler.args[1][0].added[0].key).to.be.equal(key2, 'second time should add key2');
    expect(eventHandler.args[2][0].added).to.be.length(1, 'third time should add');
    expect(eventHandler.args[2][0].removed).to.be.length(0, 'third time should not remove');
    expect(eventHandler.args[2][0].added[0].key).to.be.equal(key3, 'third time should add key3');
    expect(eventHandler.args[3][0].added).to.be.length(0, 'fourth time should not add');
    expect(eventHandler.args[3][0].removed).to.be.length(1, 'fourth time should remove');
    expect(eventHandler.args[3][0].removed[0].key).to.be.equal(key2, 'fourth time should remove key2');
    expect(eventHandler.args[4][0].added).to.be.length(0, 'fifth time should not add');
    expect(eventHandler.args[4][0].removed).to.be.length(1, 'fifth time should remove');
    expect(eventHandler.args[4][0].removed[0].key).to.be.equal(key1, 'fifth time should remove key1');
  });

  it('add/remove strings and numbers with same values should raise events correctly', () => {
    // Arrange
    const dictionary = new ObservableDictionary<any, any>();

    const key1 = '2';
    const key2 = 2;

    const eventHandler: Sinon.SinonSpy = spy();

    dictionary.itemsChanged.on(eventHandler);

    // Act
    dictionary.add(key1, {});
    dictionary.add(key2, {});
    dictionary.remove(key2);
    dictionary.remove(key1);

    // Assert
    expect(eventHandler.callCount).to.be.equal(4, 'should be called correct number of times');
    expect(eventHandler.args[0][0].added).to.be.length(1, 'first time should add');
    expect(eventHandler.args[0][0].removed).to.be.length(0, 'first time should not remove');
    expect(eventHandler.args[0][0].added[0].key).to.be.equal(key1, 'should add key1');
    expect(eventHandler.args[1][0].added).to.be.length(1, 'second time should add');
    expect(eventHandler.args[1][0].removed).to.be.length(0, 'second time should not remove');
    expect(eventHandler.args[1][0].added[0].key).to.be.equal(key2, 'second time should add key2');
    expect(eventHandler.args[2][0].added).to.be.length(0, 'third time should not add');
    expect(eventHandler.args[2][0].removed).to.be.length(1, 'third time should remove');
    expect(eventHandler.args[2][0].removed[0].key).to.be.equal(key2, 'third time should remove key2');
    expect(eventHandler.args[3][0].added).to.be.length(0, 'fourth time should not add');
    expect(eventHandler.args[3][0].removed).to.be.length(1, 'fourth time should remove');
    expect(eventHandler.args[3][0].removed[0].key).to.be.equal(key1, 'fourth time should remove key1');
  });

  it('add/remove strings and boleans with same values should raise events correctly', () => {
    // Arrange
    const dictionary = new ObservableDictionary<any, any>();

    const key1 = 'true';
    const key2 = true;

    const eventHandler: Sinon.SinonSpy = spy();

    dictionary.itemsChanged.on(eventHandler);

    // Act
    dictionary.add(key1, {});
    dictionary.add(key2, {});
    dictionary.remove(key2);
    dictionary.remove(key1);

    // Assert
    expect(eventHandler.callCount).to.be.equal(4, 'should be called correct number of times');
    expect(eventHandler.args[0][0].added).to.be.length(1, 'first time should add');
    expect(eventHandler.args[0][0].removed).to.be.length(0, 'first time should not remove');
    expect(eventHandler.args[0][0].added[0].key).to.be.equal(key1, 'should add key1');
    expect(eventHandler.args[1][0].added).to.be.length(1, 'second time should add');
    expect(eventHandler.args[1][0].removed).to.be.length(0, 'second time should not remove');
    expect(eventHandler.args[1][0].added[0].key).to.be.equal(key2, 'second time should add key2');
    expect(eventHandler.args[2][0].added).to.be.length(0, 'third time should not add');
    expect(eventHandler.args[2][0].removed).to.be.length(1, 'third time should remove');
    expect(eventHandler.args[2][0].removed[0].key).to.be.equal(key2, 'third time should remove key2');
    expect(eventHandler.args[3][0].added).to.be.length(0, 'fourth time should not add');
    expect(eventHandler.args[3][0].removed).to.be.length(1, 'fourth time should remove');
    expect(eventHandler.args[3][0].removed[0].key).to.be.equal(key1, 'fourth time should remove key1');
  });
});
