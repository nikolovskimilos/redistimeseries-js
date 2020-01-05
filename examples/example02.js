const { RedisTimeSeries, Aggregation } = require('../index');

const rtsClient = new RedisTimeSeries();

const key = 'temperature';
const avgTemp = 'temperature:avg';
const maxTemp = 'temperature:max';
const minTemp = 'temperature:min';


const updateTemperature = async () => {
  const timestamp = Date.now();
  const value = Math.floor(Math.random()*30);
  const section = Math.floor(Math.random()*5);

  await rtsClient.add(key, timestamp, value, { labels: { section } });
}

const start = async () => {
  await rtsClient.connect();
  await rtsClient.create(key);
  await rtsClient.create(avgTemp);
  await rtsClient.create(maxTemp);
  await rtsClient.create(minTemp);

  const avgAggregationRule = {
    type: Aggregation.AVG, // average
    timeBucket: 60000      // 60 seconds
  }

  const maxAggregationRule = {
    type: Aggregation.MAX, // max
    timeBucket: 60000      // 60 seconds
  }

  const minAggregationRule = {
    type: Aggregation.MIN, // min
    timeBucket: 60000      // 60 seconds
  }

  await rtsClient.createRule(key, avgTemp, avgAggregationRule);
  await rtsClient.createRule(key, maxTemp, maxAggregationRule);
  await rtsClient.createRule(key, minTemp, minAggregationRule);
  setInterval(updateTemperature, 1000);
}

start();