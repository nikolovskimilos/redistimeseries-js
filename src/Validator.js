
class Validator {
  static checkKey(key, name = 'Key') {
    if (!key || !Validator.isString(key)) {
      throw new Error(`${name} as a string is required`);
    }
  }

  static checkTimestamp(timestamp) {
    if (!Number.isInteger(timestamp) || timestamp < 0) {
      throw new Error('Timestamp has to be positive integer');
    }
  }

  static checkTimestampRange(fromTimestamp, toTimestamp) {
    if (!Validator.isPositiveInteger(fromTimestamp) || !Validator.isPositiveInteger(toTimestamp)) {
      throw new Error('fromTimestamp and toTimestamp have to be integers greater than 0');
    }

    if (fromTimestamp > toTimestamp) {
      throw new Error('toTimestamp has to be greater than fromTimestamp');
    }
  }

  static checkValue(value) {
    if (!Validator.isFloat(value)) {
      throw new Error('Value has to be float');
    }
  }

  static checkParams(params) {
    if (params.length === 0) {
      throw new Error('At least one parameter is required');
    }
  }

  static isString(value) {
    return typeof value === 'string';
  }

  static isFloat(value) {
    return !Number.isNaN(parseFloat(value));
  }

  static isPositiveInteger(value) {
    return Number.isInteger(value) && value >= 0;
  }

  static isUndefined(value) {
    return typeof value === 'undefined';
  }

  static isBoolean(value) {
    return typeof value === 'boolean';
  }
}

module.exports = Validator;
