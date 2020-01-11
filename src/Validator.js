

class Validator {
  // static checkKey(key, name = 'Key') {
  //   if (!key || !Validator.isString(key)) {
  //     throw new Error(`${name} as a string is required`);
  //   }
  // }

  // static checkValue(value) {
  //   if (!Validator.isFloat(value)) {
  //     throw new Error('Value has to be float');
  //   }
  // }

  // static checkTimestamp(timestamp) {
  //   if (!Number.isInteger(timestamp) || timestamp < 0) {
  //     throw new Error('Timestamp has to be positive integer');
  //   }
  // }

  // static checkTimestampRange(fromTimestamp, toTimestamp) {
  //   if (!Validator.isIntegerGteZero(fromTimestamp) || !Validator.isIntegerGteZero(toTimestamp)) {
  //     throw new Error('fromTimestamp and toTimestamp have to be integers greater than 0');
  //   }

  //   if (fromTimestamp > toTimestamp) {
  //     throw new Error('toTimestamp has to be greater than fromTimestamp');
  //   }
  // }

  // static checkParams(params) {
  //   if (params.length === 0) {
  //     throw new Error('At least one parameter is required');
  //   }
  // }

  // static checkAggregation({ type, timeBucket }) {
  //   if (!aggregationTypesArray.includes(type)) {
  //     throw new Error('Unknown aggregation type');
  //   }

  //   if (!Validator.isIntegerGteZero(timeBucket)) {
  //     throw new Error('timeBucket should be a positive integer value');
  //   }
  // }

  // static checkRetention(retention) {
  //   if (!Validator.isIntegerGteZero(retention)) {
  //     throw new Error('Retention has to be positive integer');
  //   }
  // }

  // static checkCount(count) {
  //   if (!Validator.isIntegerGteZero(count)) {
  //     throw new Error('Count has to be positive integer');
  //   }
  // }

  // static checkUncompressedFlag(uncompressed) {
  //   if (!Validator.isBoolean(uncompressed)) {
  //     throw new Error('Parameter uncompressed is boolean flag');
  //   }
  // }

  // static checkWithLabelsFlag(withLabels) {
  //   if (!Validator.isBoolean(withLabels)) {
  //     throw new Error('Parameter withlabels is boolean flag');
  //   }
  // }

  static checkFilter(filter) {
    if (!Array.isArray(filter) || filter.length === 0) {
      throw new Error('At least one filter is required');
    }
  }

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
