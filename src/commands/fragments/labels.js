const QuerySchema = require('../../QuerySchema');
const { Validator } = require('../utils');

const LABELS = 'LABELS';
const SIGN_SPACE = ' ';

/**
 * LABELS field value..
 */
module.exports = QuerySchema
  .create(LABELS)
  .param(
    'labels',
    (value) => !Validator.isUndefined(value) && Validator.isObject(value)
  )
  .serialize((command, labels) => Object.keys(labels).reduce(
    (acc, labelName) => acc.concat([labelName, labels[labelName]]),
    [LABELS]
  )
    .join(SIGN_SPACE));
