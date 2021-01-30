class Validator {
  static isString(value) {
    return typeof value === 'string';
  }

  static isFloat(value) {
    return !Number.isNaN(parseFloat(value));
  }

  static isInteger(value) {
    return Number.isInteger(value);
  }

  static isUndefined(value) {
    return typeof value === 'undefined';
  }

  static isObject(value) {
    return typeof value === 'object';
  }
}

module.exports = Validator;
