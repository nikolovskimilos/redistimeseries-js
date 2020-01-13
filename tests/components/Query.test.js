
const Query = require('../../src/Query');
const { commands } = require('../constants');

describe('Query component tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create query with given command', async () => {
    expect(() => Query.create(commands.TS_RANGE)).not.toThrow();
  });

  it('should fail to create query, no command', async () => {
    expect(() => Query.create()).toThrow();
  });

  it('should fail to create query, unknown command', async () => {
    expect(() => Query.create(true)).toThrow();
  });
});
