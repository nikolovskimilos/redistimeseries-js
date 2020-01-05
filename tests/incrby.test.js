
const RedisMock = require('./__mocks__/redis');

const { commands, keywords } = require('../src/constants');
const RedisTimeSeries = require('../src/RedisTimeSeries');

const { TIMESTAMP, RETENTION, LABELS } = keywords;
const { TS_INCRBY } = commands;
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
	value: 17.4,
	timestamp: Date.now()
};

let rts = null;


describe('incrBy method tests', () => {
	beforeEach(() => {
    jest.clearAllMocks();
    
    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should increment the latest value of time series', async () => {
  	const { key, value } = TEST_PARAMS;
  	const query = `${TS_INCRBY} ${key} ${value}`;

		await rts.incrBy(key, value);

		const redisCommandParams = RedisMock.send_command.mock.calls[0];
		expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should increment the latest value of time series with timestamp', async () => {
  	const { key, value, timestamp } = TEST_PARAMS;
  	const query = `${TS_INCRBY} ${key} ${value} ${TIMESTAMP} ${timestamp}`;

		await rts.incrBy(key, value, { timestamp });

		const redisCommandParams = RedisMock.send_command.mock.calls[0];
		expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should increment the latest value of time series with retention', async () => {
  	const { key, value, retention } = TEST_PARAMS;
  	const query = `${TS_INCRBY} ${key} ${value} ${RETENTION} ${retention}`;

		await rts.incrBy(key, value, { retention });

		const redisCommandParams = RedisMock.send_command.mock.calls[0];
		expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should increment the latest value of time series with labels', async () => {
  	const { key, value, labels } = TEST_PARAMS;
  	const query = `${TS_INCRBY} ${key} ${value} ${LABELS} room ${labels.room} section ${labels.section}`;

		await rts.incrBy(key, value, { labels });

		const redisCommandParams = RedisMock.send_command.mock.calls[0];
		expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should throw an error, no arguments', async () => {
		await expect(rts.incrBy()).rejects.toThrow();
  });

  it('should throw an error, value is missing', async () => {
		await expect(rts.incrBy(TEST_PARAMS.key)).rejects.toThrow();
  });

  it('should throw an error, value is not valid', async () => {
		await expect(rts.incrBy(TEST_PARAMS.key, TEST_PARAMS.key)).rejects.toThrow();
  });
});