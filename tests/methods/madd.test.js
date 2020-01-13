
const { commands } = require('../constants');
const RedisTimeSeries = require('../../index');

const { TS_MADD } = commands;


const SIGN_SPACE = ' ';
const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};
const TEST_PARAMS = {
  multi: [
    { key: 'sometestkey1', value: 15.4, timestamp: Date.now() },
    { key: 'sometestkey2', value: 16.4, timestamp: Date.now() },
    { key: 'sometestkey3', value: 17.4, timestamp: Date.now() }
  ]
};

let rts = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query.join(SIGN_SPACE));
};

describe('madd method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should add multiple values to different time series', async () => {
    const { multi } = TEST_PARAMS;

    const multiToArray = multi.reduce((acc, { key, timestamp, value }) => {
      acc.push(`${key} ${timestamp} ${value}`);
      return acc;
    }, []);
    const query = [TS_MADD, ...multiToArray];

    await rts.madd(multi).send();
    validateQuery(query);
  });

  it('should fail, no arguments', async () => {
    await expect(rts.madd().send()).rejects.toThrow();
  });

  it('should fail, empty array', async () => {
    await expect(rts.madd([]).send()).rejects.toThrow();
  });
});
