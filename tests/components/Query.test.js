
const Query = require('../../src/Query');
const QuerySchema = require('../../src/QuerySchema');

const TEST_PARAMS = {
  table: 'sometable',
  send: (queryString) => queryString
};

const TEST_QS_1 = {
  command: 'SELECT',
  paramName: 'table',
  paramValidator: (value) => typeof value === 'string'
};

const TEST_QS_2 = {
  command: 'WHERE',
  paramName: 'condition'
};


let select = null;


describe('Query component tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const where = QuerySchema
      .create(TEST_QS_2.command)
      .param(TEST_QS_2.paramName);

    select = QuerySchema
      .create(TEST_QS_1.command)
      .param(TEST_QS_1.paramName, TEST_QS_1.paramValidator)
      .subquery(where);
  });

  it('create query with given query schema', async () => {
    const query = Query.create(select).sendHandler(TEST_PARAMS.send);

    expect(query).toBeTruthy();
    expect(query.getSchema()).toBe(select);
  });

  it('create query with given query schema and params', async () => {
    expect(() => Query.create(select).params([TEST_PARAMS.table])).not.toThrow();
  });

  it('should fail to create query, no query schema', async () => {
    expect(() => Query.create()).toThrow();
  });

  it('should fail to create query, not a query schema', async () => {
    expect(() => Query.create(true)).toThrow();
  });

  it('should fail to set send handler, no function', async () => {
    expect(() => Query.create(select).sendHandler()).toThrow();
  });

  it('should fail to set send handler, not a function', async () => {
    expect(() => Query.create(select).sendHandler(true)).toThrow();
  });

  it('should fail to assign param values to query, no values', async () => {
    expect(() => Query.create(select).params()).toThrow();
  });

  it('should fail to assign param values to query, not an array', async () => {
    expect(() => Query.create(select).params(true)).toThrow();
  });
});
