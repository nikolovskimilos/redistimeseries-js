
const Validator = require('./Validator');
const { commands, keywords } = require('./constants');

const commandsArray = Object.values(commands);

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
    this._validateAndDo(retention, Validator.checkRetention, () => {
      this.addParams(keywords.RETENTION, retention);
    });

    return this;
  }

  labels(labelValues = {}) {
    const labels = Object.keys(labelValues);

    if (labels.length > 0) {
      this.addParams(keywords.LABELS);
      labels.forEach((labelName) => this.addParams(labelName, labelValues[labelName]));
    }

    return this;
  }

  aggregation(aggregation) {
    this._validateAndDo(aggregation, Validator.checkAggregation, () => {
      const { type, timeBucket } = aggregation;
      this.addParams(keywords.AGGREGATION, type, timeBucket);
    });

    return this;
  }

  count(count) {
    this._validateAndDo(count, Validator.checkCount, () => {
      this.addParams(keywords.COUNT, count);
    });

    return this;
  }

  timestamp(timestamp) {
    this._validateAndDo(timestamp, Validator.checkTimestamp, () => {
      this.addParams(keywords.TIMESTAMP, timestamp);
    });

    return this;
  }

  uncompressed(uncompressed) {
    this._validateAndDo(uncompressed, Validator.checkUncompressedFlag, () => {
      this.addParams(...(uncompressed ? [keywords.UNCOMPRESSED] : []));
    });

    return this;
  }

  withLabels(withLabels = false) {
    this._validateAndDo(withLabels, Validator.checkWithLabelsFlag, () => {
      this.addParams(...(withLabels ? [keywords.WITHLABELS] : []));
    });

    return this;
  }

  pureFilter(filter) {
    this._validateAndDo(filter, Validator.checkFilter, () => {
      const filterArray = filter.map((condition) => condition.toString());
      this.addParams(...filterArray);
    });
    return this;
  }

  filter(filter) {
    return this
      .addParams(keywords.FILTER)
      .pureFilter(filter);
  }

  build() {
    return [this.command, ...this.params];
  }

  _validateAndDo(value, validator, callback) {
    if (!Validator.isUndefined(value)) {
      validator(value);
      callback();
    }
  }

  static create(command) {
    if (!commandsArray.includes(command)) {
      throw new Error('Unknown command');
    }

    return new Query(command);
  }
}

module.exports = Query;
