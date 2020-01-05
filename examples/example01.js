const { RedisTimeSeries } = require('../index');

const rtsClient = new RedisTimeSeries();

const key = 'temperature';
const retention = 60000;

const updateTemperature = async () => {
	await rtsClient.add(key, Date.now(), Math.floor(Math.random()*30));
}

const start = async () => {
	await rtsClient.connect();
	await rtsClient.create(key, { retention });
	setInterval(updateTemperature, 1000);
}

start();