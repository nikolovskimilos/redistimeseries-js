
const { commands, keywords } = require('../../src/constants');
const { RedisTimeSeries } = require('../../index');


const { RETENTION, LABELS, UNCOMPRESSED } = keywords;
const { TS_CREATE } = commands;

const SIGN_SPACE = ' ';
const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};
const TEST_PARAMS = {
  key: 'sometestkey',
  retention: 60,
  labels: {
    room: 'livingroom',
    section: 2
  },
  uncompressed: true
};

let rts = null;

const validateQuery = (query) => {
  const [command, params] = rts.client.send_command.mock.calls[0];
  expect([command, ...params].join(SIGN_SPACE)).toBe(query);
};


describe('create method tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });


  it('should create time series', async () => {
    const { key } = TEST_PARAMS;
    const query = `${TS_CREATE} ${TEST_PARAMS.key}`;

    await rts.create(key);
    validateQuery(query);
  });

  it('should create time series with retention', async () => {
    const { key, retention } = TEST_PARAMS;
    const query = `${TS_CREATE} ${key} ${RETENTION} ${retention}`;

    await rts.create(key, { retention });
    validateQuery(query);
  });

  it('should create time series with labels', async () => {
    const { key, labels } = TEST_PARAMS;
    const query = `${TS_CREATE} ${key} ${keywords.LABELS} room ${labels.room} section ${labels.section}`;

    await rts.create(key, { labels });
    validateQuery(query);
  });

  it('should create time series with uncompressed flag', async () => {
    const { key, uncompressed } = TEST_PARAMS;

    const query = `${TS_CREATE} ${key} ${UNCOMPRESSED}`;

    await rts.create(key, { uncompressed });
    validateQuery(query);
  });

  it('should create time series with retention and labels', async () => {
    const { key, retention, labels } = TEST_PARAMS;

    const labelsQuery = `${LABELS} room ${labels.room} section ${labels.section}`;
    const query = `${TS_CREATE} ${key} ${RETENTION} ${retention} ${labelsQuery}`;

    await rts.create(key, { retention, labels });
    validateQuery(query);
  });

  it('should create time series with retention, labels and uncompressed flag', async () => {
    const { key, retention, labels, uncompressed } = TEST_PARAMS;

    const labelsQuery = `${LABELS} room ${labels.room} section ${labels.section}`;
    const query = `${TS_CREATE} ${key} ${RETENTION} ${retention} ${labelsQuery} ${UNCOMPRESSED}`;

    await rts.create(key, { retention, labels, uncompressed });
    validateQuery(query);
  });

  it('should throw an error, key is missing', async () => {
    await expect(rts.create()).rejects.toThrow();
  });

  it('should throw an error, key is not string', async () => {
    await expect(rts.create(TEST_PARAMS.uncompressed)).rejects.toThrow();
  });

  it('should throw an error, retention is not valid', async () => {
    await expect(rts.create(TEST_PARAMS.key, { retention: TEST_PARAMS.key })).rejects.toThrow();
  });

  it('should throw an error, uncompressed flag is not valid', async () => {
    await expect(rts.create(TEST_PARAMS.key, { uncompressed: TEST_PARAMS.key })).rejects.toThrow();
  });
});
