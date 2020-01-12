
class Validator {
  static isString(value) {
    return typeof value === 'string';
  }

  static isFloat(value) {
    return !Number.isNaN(parseFloat(value));
  }

  static isIntegerGteZero(value) {
    return Number.isInteger(value) && value >= 0;
  }

  static isInteger(value) {
    return Number.isInteger(value);
  }

  static isUndefined(value) {
    return typeof value === 'undefined';
  }

  static isBoolean(value) {
    return typeof value === 'boolean';
  }

  static isObject(value) {
    return typeof value === 'object';
  }
}

module.exports = Validator;
