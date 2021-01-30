const QuerySchema = require('../../src/QuerySchema');

const TEST_PARAMS = {
  command: 'SOME_COMMAND',
  methodName: 'send',
  paramName: 'someParam',
  paramValidator: (value) => Number.isInteger(value),
  data: {
    key: 'value'
  }
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

const TEST_QS_3 = {
  command: 'ORDER BY',
  paramName: 'column'
};

const TEST_QS_4 = {
  command: 'ASC'
};

describe('QuerySchema component tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create query schema with given command', async () => {
    const qs = QuerySchema.create(TEST_PARAMS.command);

    expect(qs).toBeTruthy();
    expect(qs.getCommand()).toBe(TEST_PARAMS.command);
    expect(qs.getMethodName()).toBe(TEST_PARAMS.command.toLowerCase());
  });

  it('create query schema with custom method name', async () => {
    const { command, methodName } = TEST_PARAMS;

    const qs = QuerySchema
      .create(command)
      .methodName(methodName);

    expect(qs).toBeTruthy();
    expect(qs.getCommand()).toBe(command);
    expect(qs.getMethodName()).toBe(methodName);
  });

  it('create query schema with param and data', async () => {
    const { command, paramName, paramValidator, data } = TEST_PARAMS;

    const qs = QuerySchema
      .create(command)
      .param(paramName, paramValidator)
      .data(data);

    expect(qs).toBeTruthy();
    expect(qs.getCommand()).toBe(command);
    expect(qs.getParams()[0].name).toBe(paramName);
    expect(qs.getData().key).toBe(data.key);
    expect(qs.getData().value).toBe(data.value);
  });

  it('create query schema with param, no validation', async () => {
    const { command, paramName } = TEST_PARAMS;

    const qs = QuerySchema
      .create(command)
      .param(paramName);

    expect(qs).toBeTruthy();
    expect(qs.getCommand()).toBe(command);
    expect(qs.getParams()[0].name).toBe(paramName);
    expect(qs.getParams()[0].validation()).toBe(true);
  });

  it('create query schema with optional subqueries, template string validation', async () => {
    const where = QuerySchema
      .create(TEST_QS_2.command)
      .param(TEST_QS_2.paramName);

    const select = QuerySchema
      .create(TEST_QS_1.command)
      .param(TEST_QS_1.paramName, TEST_QS_1.paramValidator)
      .subquery(where);

    const templateString = `${TEST_QS_1.command} ${TEST_QS_1.paramName} [${TEST_QS_2.command} ${TEST_QS_2.paramName}]`;

    expect(select.getTemplateString()).toBe(templateString);
  });

  it('create query schema with required subquery, template string validation', async () => {
    const where = QuerySchema
      .create(TEST_QS_2.command)
      .param(TEST_QS_2.paramName);

    const order = QuerySchema
      .create(TEST_QS_3.command)
      .param(TEST_QS_3.paramName);

    const asc = QuerySchema
      .create(TEST_QS_4.command);

    const select = QuerySchema
      .create(TEST_QS_1.command)
      .param(TEST_QS_1.paramName, TEST_QS_1.paramValidator)
      .subquery(where, true)
      .subquery(order)
      .subquery(asc);

    const ts2 = `${TEST_QS_2.command} ${TEST_QS_2.paramName}`;
    const ts3 = `${TEST_QS_3.command} ${TEST_QS_3.paramName}`;
    const ts4 = `${TEST_QS_4.command}`;

    const templateString = `${TEST_QS_1.command} ${TEST_QS_1.paramName} ${ts2} [${ts3}] [${ts4}]`;

    expect(select.getTemplateString()).toBe(templateString);
  });

  it('it should fail, no command', async () => {
    expect(() => QuerySchema.create()).toThrow();
  });

  it('it should fail, no method name', async () => {
    expect(() => QuerySchema.create(TEST_PARAMS.command).methodName()).toThrow();
  });

  it('it should fail, no param name', async () => {
    expect(() => QuerySchema.create(TEST_PARAMS.command).param()).toThrow();
  });

  it('it should fail, data is missing', async () => {
    expect(() => QuerySchema.create(TEST_PARAMS.command).data()).toThrow();
  });

  it('it should fail, data is not object', async () => {
    expect(() => QuerySchema.create(TEST_PARAMS.command).data(true)).toThrow();
  });

  it('it should fail, exports is missing', async () => {
    expect(() => QuerySchema.create(TEST_PARAMS.command).exports()).toThrow();
  });

  it('it should fail, exports is not object', async () => {
    expect(() => QuerySchema.create(TEST_PARAMS.command).exports(true)).toThrow();
  });

  it('it should fail, subquery is null', async () => {
    expect(() => QuerySchema.create(TEST_PARAMS.command).subquery(null)).toThrow();
  });

  it('it should fail, subquery is missing', async () => {
    expect(() => QuerySchema.create(TEST_PARAMS.command).subquery()).toThrow();
  });
});
