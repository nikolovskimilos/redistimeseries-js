const Client = {
  send_command: jest.fn((command, args, callback) => callback())
};

const RedisMock = {
  createClient: jest.fn(() => Client)
};

module.exports = RedisMock;
