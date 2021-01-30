class Filter {
  constructor(filterString) {
    this.filterString = filterString;
  }

  toString() {
    return this.filterString;
  }

  static equal(label, value) {
    if (!label || !value) {
      throw new Error('equals filter requires label and value');
    }

    return new Filter(`${label}=${value}`);
  }

  static notEqual(label, value) {
    if (!label || !value) {
      throw new Error('notEquals filter requires label and value');
    }

    return new Filter(`${label}!=${value}`);
  }

  static exists(label) {
    if (!label) {
      throw new Error('exists filter requires label');
    }

    return new Filter(`${label}!=`);
  }

  static notExists(label) {
    if (!label) {
      throw new Error('notExists filter requires label');
    }

    return new Filter(`${label}=`);
  }

  static in(label, arrayOfValues = []) {
    if (!label || !arrayOfValues || !Array.isArray(arrayOfValues) || arrayOfValues.length === 0) {
      throw new Error('in filter requires label and arrayOfValues(must be an array)');
    }

    return new Filter(`${label}=(${arrayOfValues.join(',')})`);
  }

  static notIn(label, arrayOfValues = []) {
    if (!label || !arrayOfValues || !Array.isArray(arrayOfValues) || arrayOfValues.length === 0) {
      throw new Error('notIn filter requires label and arrayOfValues(must be an array)');
    }

    return new Filter(`${label}!=(${arrayOfValues.join(',')})`);
  }
}

module.exports = Filter;
