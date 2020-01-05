
const RedisMock = {
	createClient: jest.fn(() => RedisMock),
	send_command: jest.fn()
};

module.exports = RedisMock;
