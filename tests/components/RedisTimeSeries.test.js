
const RedisMock = require('../__mocks__/redis');

const RedisTimeSeries = require('../../index');

const TEST_OPTIONS = {
  host: 'localhost',
  port: 6379
};

const TEST_PARAMS = {
  command: 'somecommand',
  args: ['some', 'args']
};

let rts = null;

describe('RedisTimeSeries component tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    rts = new RedisTimeSeries(TEST_OPTIONS);
  });

  it('should create client with out options', async () => {

    expect(() => {
      rts = new RedisTimeSeries();
    }).not.toThrow();
  });

  it('should fetch redis client', async () => {
    const redisClient = { dummy: 'client' };
    RedisMock.createClient.mockReturnValueOnce(redisClient);

    await rts.connect(TEST_OPTIONS);
    expect(rts.getClient()).toBe(redisClient);
  });

  it('should fail to set redis client, no arguments', async () => {
    expect(() => rts.setClient()).toThrow();
  });

  it('should set redis client', async () => {
    const redisClient = { dummy: 'client' };
    expect(() => rts.setClient(redisClient)).not.toThrow();
  });

  it('should throw an error, to simulte redis exception', async () => {
    const error = { some: 'error' };
    rts.client = { send_command: jest.fn((command, args, callback) => callback(error)) };
    await expect(rts.send(TEST_PARAMS.command, ...TEST_PARAMS.args)).rejects.toEqual(error);
  });
});
