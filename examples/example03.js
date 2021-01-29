const RedisTimeSeries = require('../index');

const rtsClient = new RedisTimeSeries();

const key = 'temperatures';
const duplicatePolicy = 'LAST';

const updateTemperature = async () => {
  await rtsClient.add(key, Date.now(), Math.floor(Math.random() * 30)).send();
};

const start = async () => {
  await rtsClient.connect();
  await rtsClient.create(key).duplicatePolicy(duplicatePolicy).uncompressed().send();
  setInterval(updateTemperature, 1000);
};

start();
