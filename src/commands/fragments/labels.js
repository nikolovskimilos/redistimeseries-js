const QuerySchema = require('../../QuerySchema');
const { Validator } = require('../utils');

const LABELS = 'LABELS';

/**
 * LABELS field value..
 */
module.exports = QuerySchema
  .create(LABELS)
  .param(
    'labels',
    (value) => !Validator.isUndefined(value) && Validator.isObject(value)
  )
  .serialize((labels) => Object.keys(labels).reduce(
    (acc, labelName) => acc.concat([labelName, labels[labelName]]),
    [LABELS]
  ));
