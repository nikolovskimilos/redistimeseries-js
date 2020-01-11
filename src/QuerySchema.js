const Validator = require('./Validator');


class QuerySchema {
  constructor(command) {
    if (!command && Validator.isString(command)) {
      throw new Error('Command is required to create a query');
    }

    this._command = command;
    this._methodName = command.toLowerCase();
    this._params = [];
    this._queries = [];
    this._data = null;
    this._exports = null;
    this._executable = false;
    this._serializedMethod = () => {}
  }

  static create(command) { 
    return new QuerySchema(command);
  }

  executable() {
    this._executable = true;
    return this;
  }

  methodName(methodName) {
    if (!methodName) {
      throw new Error('Method name is required');
    }
    this._methodName = methodName;
    return this;
  }

  data(data = {}) {
    if (!data) {
      throw new Error('Data is required');
    }
    this._data = data;
    return this;
  }

  exports(exportedData = {}){
    this._exports = exportedData;
    return this;
  }

  param(name = null, validation = null) {
    this._params.push({ name, validation });
    return this;
  }

  subquery(query = null, required = false) {
    this._queries.push({ query, required });
    return this;
  }

  serialize(serializeMethod) {
    this._serializedMethod = serializeMethod.bind(this);
    return this;
  }

  isExecutable() {
    return this._executable;
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

  getSerializator() {
    return this._serializedMethod;
  }
}

module.exports = QuerySchema;
