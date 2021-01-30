const RedisTimeSeries = require('../index');

const { Aggregation } = RedisTimeSeries;

const rtsClient = new RedisTimeSeries();

const key = 'temperature';
const keyAvgTemp = 'temperature:avg';
const keyMaxTemp = 'temperature:max';
const keyMinTemp = 'temperature:min';

const updateTemperature = async () => {
  const timestamp = Date.now();
  const value = Math.floor(Math.random() * 30);
  const section = Math.floor(Math.random() * 5);

  await rtsClient
    .add(key, timestamp, value)
    .labels({ section })
    .send();
};

const readTemperature = async () => {
  const avg = await rtsClient.get(keyAvgTemp).send();
  const max = await rtsClient.get(keyMaxTemp).send();
  const min = await rtsClient.get(keyMinTemp).send();

  console.log('average', avg);
  console.log('maximum', max);
  console.log('minimum', min);
};

const start = async () => {
  await rtsClient.connect();
  await rtsClient.create(key).send();
  await rtsClient.create(keyAvgTemp).send();
  await rtsClient.create(keyMaxTemp).send();
  await rtsClient.create(keyMinTemp).send();

  await rtsClient
    .createRule(key, keyAvgTemp)
    .aggregation(Aggregation.AVG, 60000)
    .send();

  await rtsClient
    .createRule(key, keyMaxTemp)
    .aggregation(Aggregation.MAX, 60000)
    .send();

  await rtsClient
    .createRule(key, keyMinTemp)
    .aggregation(Aggregation.MIN, 60000)
    .send();

  // update temperature every second
  setInterval(updateTemperature, 1000);

  // read temperature avg, max and min values every 5 seconds
  setInterval(readTemperature, 5000);
};

start();
