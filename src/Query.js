
class Query {
  constructor(schema) {
    if (!schema) {
      throw new Error('QuerySchema is required');
    }

    this._schema = schema;
    this._params = []
    this._queries = {};
    this._queriesOrder = [];

    this._init()
  }

  _init() {
    this._schema.getSubqueries().forEach(({ query: subquerySchema }) => {
      const methodName = subquerySchema.getMethodName();
      this._queriesOrder.push(methodName);
      this[methodName] = (...params) => {
         const subquery = Query.create(subquerySchema).params(params);
         this._queries[methodName] = subquery;
         return this;
      }
    });
  }

  static create(schema) {
    return new Query(schema);
  }

  params(values = []){
    this._params = values;
    return this;
  }

  validate() {
    
  }

  serialize() {
    const serialize = this._schema.getSerializator();
    let queryString = serialize(...this._params);

    this._queriesOrder.forEach((subqueryName) => {
      const subquery = this._queries[subqueryName];
      if (subquery) {
        queryString = `${queryString} ${subquery.serialize()}`;
      }
    });

    return queryString;
  }


  async send() {
    
  }

  getSchema() {
    return this._schema;
  }
}

module.exports = Query;
