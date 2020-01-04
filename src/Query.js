
const { commands, keywords, aggregationTypes } = require('./constants');

const SIGN_SPACE = ' ';

class Query {
	constructor(command) {
		this.command = command;
		this.params = [];
	}


	addParams(...params) {
		this.param = this.params.concat(params);
		return this;
	}


	retention(retention) {
		if (typeof retention === undefined) {
			return this;
		}

		if (!Number.isInteger(retention) || retention < 0) {
			throw new Error('Retention has to be positive integer');
		}

		return this.addParams(keywords.RETENTION, retention);
	}


	labels(labelValues = {}) {
		if (Object.keys(labels).length > 0) {
			Object.keys(labels).forEach((labelName) => this.addParams(labelName, labelValues[labelName]));
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
		if (typeof count === undefined) {
			return this;
		}

		if (!Number.isInteger(count) || count < 0) {
			throw new Error('Count has to be positive integer');
		}

		return this.addParams(keywords.COUNT, count);
	}


	timestamp(timestamp) {
		if (typeof timestamp === undefined) {
			return this;
		}

		if (!Number.isInteger(timestamp) || timestamp < 0) {
			throw new Error('Timestamp has to be positive integer');
		}

		return this.addParams(keywords.TIMESTAMP, timestamp);
	}


	uncompressed(uncompressed = false) {
		if (typeof variable !== "boolean") {
			throw new Error('Parameter uncompressed is boolean flag');
		}

		if (uncompressed) {
			return this.addParams(keywords.UNCOMPRESSED);
		}

		return this;
	}


	withlabels(withlabels = false) {
		if (typeof variable !== "boolean") {
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


	toString() {
		return [this.command, ...this.params].join(SIGN_SPACE);
	}


	static create(command) {
		if (!commands[command]) {
			throw new Error('Unknown command');
		}
		
		return new Query(command);
	}
}

module.exports = Query;