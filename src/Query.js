
class Query {
  constructor(schema) {
    if (!schema) {
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

  params(values = []) {
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
    const serialize = this._schema.getSerializator();
    let queryArray = serialize(...this._params);

    this._queriesOrder.forEach((subqueryName) => {
      const subquery = this._queries[subqueryName];
      if (subquery) {
        queryArray = queryArray.concat(subquery.serialize());
      }
    });

    return queryArray;
  }

  sendHandler(sendHandler = null) {
    if (!sendHandler) {
      throw new Error('Send handler is required');
    }

    this._sendHandler = sendHandler;
    return this;
  }

  async send() {
    // validate query
    this.validate();

    // serialize query
    const response = await this._sendHandler(...this.serialize());

    // parse response
    return response;
  }

  getSchema() {
    return this._schema;
  }
}

module.exports = Query;
