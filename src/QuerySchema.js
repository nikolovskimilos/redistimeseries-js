
class QuerySchema {
  constructor(command) {
    if (!command && typeof command === 'string') {
      throw new Error('Command is required to create a query');
    }

    this._command = command;
    this._methodName = command.toLowerCase();
    this._params = [];
    this._queries = [];
    this._data = {};
    this._exports = {};
    this._executable = false;
    this._serializedMethod = this._defaultSerializeMethod.bind(this);
  }

  static create(command) {
    return new QuerySchema(command);
  }

  methodName(methodName) {
    if (!methodName) {
      throw new Error('Method name is required');
    }
    this._methodName = methodName;
    return this;
  }

  data(data = {}) {
    if (!data && typeof data === 'object') {
      throw new Error('Data should be an object');
    }
    Object.assign(this._data, data);
    return this;
  }

  exports(exportedData = {}) {
    if (!exportedData && typeof exportedData === 'object') {
      throw new Error('Exported data should be an object');
    }

    Object.assign(this._exports, exportedData);
    return this;
  }

  param(name = null, validation = () => true) {
    this._params.push({ name, validation: validation.bind(this) });
    return this;
  }

  subquery(query = null, required = false) {
    this._queries.push({ query, required });
    Object.assign(this._exports, query.getExports());
    return this;
  }

  serialize(serializeMethod) {
    this._serializedMethod = serializeMethod.bind(this);
    return this;
  }

  getTemplateString() {
    let template = `${this._command}`;

    const params = this._params.map(({ name }) => name);
    if (params.length > 0) {
      template = `${template} ${params.join(' ')}`;
    }

    const queries = this._queries.map(({ query, required }) => (
      required ? query.getTemplateString() : `[${query.getTemplateString()}]`
    ));
    if (queries.length > 0) {
      template = `${template} ${queries.join(' ')}`;
    }

    return template;
  }

  getMethodName() {
    return this._methodName;
  }

  getParams() {
    return this._params;
  }

  getSubqueries() {
    return this._queries;
  }

  getExports() {
    return this._exports;
  }

  getData() {
    return this._data;
  }

  getSerializator() {
    return this._serializedMethod;
  }

  _defaultSerializeMethod() {
    return [this.command, ...this._params];
  }
}

module.exports = QuerySchema;
