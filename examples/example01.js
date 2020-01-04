const RedisTimeSeries = require('../index');

const rtsClient = new RedisTimeSeries();


rtsClient.connect();
rtsClient.create('temperature:12', 60, { room: 'livingroom' });