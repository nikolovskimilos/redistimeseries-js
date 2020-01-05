
const RedisMock = require('./__mocks__/redis');

const { commands, keywords } = require('../src/constants');
const RedisTimeSeries = require('../src/RedisTimeSeries');

const { TS_INFO } = commands;
const SIGN_SPACE = ' ';


const TEST_OPTIONS = {
	host: 'localhost',
	port: 6379
};
const TEST_PARAMS = {
	key: 'sometestkey'
};

let rts = null;


describe('info method tests', () => {
	beforeEach(() => {
    jest.clearAllMocks();
    
    rts = new RedisTimeSeries(TEST_OPTIONS);
    rts.connect(TEST_OPTIONS);
  });

  it('should fetch time series info and statistics', async () => {
  	const { key } = TEST_PARAMS;
  	const query = `${TS_INFO} ${key}`;

		await rts.info(key);

		const redisCommandParams = RedisMock.send_command.mock.calls[0];
		expect(redisCommandParams.join(SIGN_SPACE)).toBe(query);
  });

  it('should throw an error, no arguments', async () => {
		await expect(rts.info()).rejects.toThrow();
  });
});