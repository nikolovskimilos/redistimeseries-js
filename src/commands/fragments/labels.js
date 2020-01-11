const QuerySchema = require('../../QuerySchema');
const Validator = require('../../Validator');

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
  .serialize((labels) => {
  	const fields = Object.keys(labels).map((labelName) => `${labelName} ${labels[labelName]}`);

		return `${LABELS} ${fields.join(' ')}`;
  });

