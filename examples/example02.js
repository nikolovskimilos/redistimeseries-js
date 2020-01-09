const RedisTimeSeries = require('../index');
const { Aggregation } = RedisTimeSeries;

const rtsClient = new RedisTimeSeries();

const key = 'temperature';
const keyAvgTemp = 'temperature:avg';
const keyMaxTemp = 'temperature:max';
const keyMinTemp = 'temperature:min';


const updateTemperature = async () => {
  const timestamp = Date.now();
  const value = Math.floor(Math.random()*30);
  const section = Math.floor(Math.random()*5);

  await rtsClient.add(key, timestamp, value, { labels: { section } });
}

const readTemperature = async () => {
  const avg = await rtsClient.get(keyAvgTemp);
  const max = await rtsClient.get(keyMaxTemp);
  const min = await rtsClient.get(keyMinTemp);

  console.log('average', avg);
  console.log('maximum', max);
  console.log('minimum', min);
}

const start = async () => {
  await rtsClient.connect();
  await rtsClient.create(key);
  await rtsClient.create(keyAvgTemp);
  await rtsClient.create(keyMaxTemp);
  await rtsClient.create(keyMinTemp);

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

  await rtsClient.createRule(key, keyAvgTemp, avgAggregationRule);
  await rtsClient.createRule(key, keyMaxTemp, maxAggregationRule);
  await rtsClient.createRule(key, keyMinTemp, minAggregationRule);
  
  // update temperature every second
  setInterval(updateTemperature, 1000);

  // read temperature avg, max and min values every 5 seconds
  setInterval(readTemperature, 5000);
}

start();