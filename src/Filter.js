
class Filter {
	constructor(filterString) {
		this.filterString = filterString;
	}

	toString() {
		return this.filterString;
	}

	static equals(label, value) {
		if (!label || !value) {
			throw new Error('equals filter requires label and value');
		}

		return new Filter(`${label}=${value}`);
	}


	static notEquals(label, value) {
		if (!label || !value) {
			throw new Error('notEquals filter requires label and value');
		}

		return new Filter(`${label}!=${value}`);
	}


	static exists(label) {
		if (!label || !value) {
			throw new Error('exists filter requires label');
		}

		return new Filter(`${label}=`);
	}


	static notExists(label) {
		if (!label || !value) {
			throw new Error('exists filter requires label');
		}

		return new Filter(`${label}!=`);
	}


	static in(label, arrayOfValues = []) {
		if (!label || !arrayOfValues) {
			throw new Error('in filter requires label and arrayOfValues(must be an array)');
		}

		return new Filter(`${label}=(${arrayOfValues.join(',')})`);
	}


	static notIn(label, arrayOfValues = []) {
		if (!label || !arrayOfValues) {
			throw new Error('notIn filter requires label and arrayOfValues(must be an array)');
		}

		return new Filter(`${label}!=(${arrayOfValues.join(',')})`);
	}
}

module.exports = Filter;