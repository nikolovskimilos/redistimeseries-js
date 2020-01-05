
const Validator = require('./Validator');
const { commands, keywords, aggregationTypes } = require('./constants');

const commandsArray = Object.keys(commands);


class Query {
  constructor(command) {
    this.command = command;
    this.params = [];
  }

  addParams(...params) {
    this.params = this.params.concat(params);
    return this;
  }

  retention(retention) {
    if (Validator.isUndefined(retention)) {
      return this;
    }

    if (Validator.isPositiveInteger(retention)) {
      return this.addParams(keywords.RETENTION, retention);
    }

    throw new Error('Retention has to be positive integer');
  }

  labels(labelValues = {}) {
    const labels = Object.keys(labelValues);

    if (labels.length > 0) {
      this.addParams(keywords.LABELS);
      labels.forEach((labelName) => this.addParams(labelName, labelValues[labelName]));
    }

    return this;
  }

  aggregation({ aggregationType, timeBucket } = {}) {
    if (!aggregationTypes[aggregationType]) {
      throw new Error('Unknown aggregation type');
    }

    return this.addParams(keywords.AGGREGATION, aggregationType, timeBucket);
  }

  count(count) {
    if (Validator.isUndefined(count)) {
      return this;
    }

    if (Validator.isPositiveInteger(count)) {
      return this.addParams(keywords.COUNT, count);
    }

    throw new Error('Count has to be positive integer');
  }

  timestamp(timestamp) {
    if (Validator.isUndefined(timestamp)) {
      return this;
    }

    Validator.checkTimestamp(timestamp);

    return this.addParams(keywords.TIMESTAMP, timestamp);
  }

  uncompressed(uncompressed = false) {
    if (!Validator.isBoolean(uncompressed)) {
      throw new Error('Parameter uncompressed is boolean flag');
    }

    if (uncompressed) {
      return this.addParams(keywords.UNCOMPRESSED);
    }

    return this;
  }

  withlabels(withlabels = false) {
    if (!Validator.isBoolean(withlabels)) {
      throw new Error('Parameter withlabels is boolean flag');
    }

    if (withlabels) {
      return this.addParams(keywords.WITHLABELS);
    }

    return this;
  }

  pureFilter(filter) {

  }

  filter(filter) {
    return this
      .addParams(keywords.FILTER)
      .pureFilter(filter);
  }

  build() {
    return [this.command, ...this.params];
  }

  static create(command) {
    if (commandsArray.includes(command)) {
      throw new Error('Unknown command');
    }

    return new Query(command);
  }
}

module.exports = Query;
