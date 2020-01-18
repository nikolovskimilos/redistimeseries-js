const SIGN_SPACE = ' ';
const QuerySchema = require('./QuerySchema');

class Query {
  constructor(schema) {
    if (!schema || !(schema instanceof QuerySchema)) {
      throw new Error('QuerySchema is required');
    }

    this._schema = schema;
    this._params = [];
    this._queries = {};
    this._queriesOrder = [];

    this._sendHandler = null;
    this._init();
  }

  _init() {
    this._schema.getSubqueries().forEach(({ query: subquerySchema }) => {
      const methodName = subquerySchema.getMethodName();
      this._queriesOrder.push(methodName);
      this[methodName] = (...params) => {
        const subquery = Query.create(subquerySchema).params(params);
        this._queries[methodName] = subquery;
        return this;
      };
    });
  }

  static create(schema) {
    return new Query(schema);
  }

  params(values) {
    if (!values || !Array.isArray(values)) {
      throw new Error('Param values should be an array of values');
    }

    this._params = values;
    return this;
  }

  validate() {
    this._schema.getParams().forEach(({ name, validation }, index) => {
      const value = this._params[index];
      if (validation && !validation(value)) {
        throw new Error(`Invalid value '${value}' for parameter '${name}' in ${this._schema.getMethodName()} query`);
      }
    });

    this._schema.getSubqueries().forEach(({ query: subquerySchema, required }) => {
      const methodName = subquerySchema.getMethodName();
      const subquery = this._queries[methodName];
      if (subquery) {
        subquery.validate();
      } else if (required) {
        throw new Error(`${methodName} is required for ${this._schema.getMethodName()} query`);
      }
    });
  }

  serialize() {
    const serialize = this._schema.getSerializator().bind(this);
    const queryArray = [];
    queryArray.push(serialize(this._schema.getCommand(), ...this._params));

    this._queriesOrder.forEach((subqueryName) => {
      const subquery = this._queries[subqueryName];
      if (subquery) {
        queryArray.push(subquery.serialize());
      }
    });

    return queryArray.join(SIGN_SPACE);
  }

  sendHandler(sendHandler) {
    if (!sendHandler || typeof sendHandler !== 'function') {
      throw new Error('Send handler as function is required');
    }

    this._sendHandler = sendHandler;
    return this;
  }

  async send() {
    // validate query
    this.validate();

    // serialize query
    const response = await this._sendHandler(this.serialize());

    // parse response
    return response;
  }

  getSchema() {
    return this._schema;
  }
}

module.exports = Query;
