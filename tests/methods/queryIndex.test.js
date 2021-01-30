const { commands } = require('../constants');
const RedisTimeSeries = require('../../index');

const { Filter } = RedisTimeSeries;

const { TS_QUERYINDEX } = commands;
const SIGN_SPACE = ' ';

const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};
const TEST_PARAMS = {
  label1: 'somelabel1',
  label2: 'somelabel1',
  value1: 22,
  value2: 23
};

let rts = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query.join(SIGN_SPACE));
};

describe('queryIndex method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should fetch time series keys with given label', async () => {
    const { label1 } = TEST_PARAMS;
    const query = [TS_QUERYINDEX, `${label1}!=`];

    await rts.queryIndex([Filter.exists(label1)]).send();
    validateQuery(query);
  });

  it('should fetch time series keys with multiple given labels', async () => {
    const { label1, label2 } = TEST_PARAMS;
    const query = [TS_QUERYINDEX, `${label1}!=`, `${label2}=`];

    await rts.queryIndex([
      Filter.exists(label1),
      Filter.notExists(label2)
    ])
      .send();
    validateQuery(query);
  });

  it('should fetch time series keys with multiple given labels', async () => {
    const { label1, label2, value1, value2 } = TEST_PARAMS;
    const query = [TS_QUERYINDEX, `${label1}=${value1}`, `${label2}=(${value1},${value2})`];

    await rts
      .queryIndex([
        Filter.equal(label1, value1),
        Filter.in(label2, [value1, value2])
      ])
      .send();
    validateQuery(query);
  });

  it('should fail, no arguments', async () => {
    await expect(rts.queryIndex().send()).rejects.toThrow();
  });
});
