![Tests](https://github.com/nikolovskimilos/redistimeseries-js/workflows/Tests/badge.svg)
[![npm version](https://badge.fury.io/js/redistimeseries-js.svg)](https://badge.fury.io/js/redistimeseries-js)


# redistimeseries-js

JavaScript client for [RedisTimeSeries](https://github.com/RedisLabsModules/redis-timeseries)

```
npm install redistimeseries-js
```


#### Example

```javascript
const RedisTimeSeries = require('redistimeseries-js');


// check base redis client for options
// https://github.com/NodeRedis/node_redis
const options = {
  host: 'localhost',
  port: 6379
}

or for redis cluster

// check base redis cluster client for options
// https://github.com/gosquared/redis-clustr
const options = {
  cluster: {
    servers: [
      {
        host: '127.0.0.1',
        port: 7000
      }
    ]
  }
}

const rtsClient = new RedisTimeSeries(options);
const key = 'temperature';

const updateTemperature = async () => {
  await rtsClient.add(key, Date.now(), Math.floor(Math.random()*30)).send();
}

const start = async () => {
  await rtsClient.connect();
  await rtsClient.create(key).retention(60000).send();
  setInterval(updateTemperature, 1000);
}

start();

```


## Filtering

Filters are represented as array of conditions

```javascript
const { Filter } = require('redistimeseries-js');

const myFilter = [
  Filter.equal('area_id', 32),
  Filter.notEqual('sensor_id', 1),
  Filter.exists('sub_area_id'),
  Filter.notExists('outdoor'),
  Filter.in('secitons', [2, 3, 4]),
  Filter.notIn('secitons', [5, 6])
];

```

## Aggregation

Possible aggregation values

```javascript
const { Aggregation } = require('redistimeseries-js');

// Aggregation.AVG
// Aggregation.SUM
// Aggregation.MIN
// Aggregation.MAX
// Aggregation.RANGE
// Aggregation.COUNT
// Aggregation.FIRST
// Aggregation.LAST
// Aggregation.STDP
// Aggregation.STDS
// Aggregation.VARP
// Aggregation.VARS

```


## Methods

Examples for each method are shown below, notice that optional parameters are always represented as object which is the last argument in the methods.

#### create
```javascript
// TS.CREATE temperature:2:32 RETENTION 60000 LABELS sensor_id 2 area_id 32 UNCOMPRESSED

client
  .create('temperature:2:32')
  .retention(60000)
  .labels({ sensor_id: 2, area_id: 32 })
  .uncompressed()
  .send();
```

#### alter
```javascript
// TS.ALTER temperature:2:32 LABELS sensor_id 2 area_id 32 sub_area_id 15

client
  .alter('temperature:2:32')
  .labels({ sensor_id: 2, area_id: 32, sub_area_id: 15 })
  .send();
```

#### add
```javascript
// TS.ADD temperature:2:32 1548149180000 26 LABELS sensor_id 2 area_id 32

client
  .add('temperature:2:32', 1548149180000, 26)
  .labels({ sensor_id: 2, area_id: 32 })
  .send();
```
```javascript
// TS.ADD temperature:3:11 1548149183000 27 RETENTION 3600

client.add('temperature:2:32', 1548149180000, 26, {
  retention: 3600
});
```

#### madd
```javascript
// TS.MADD temperature:2:32 1548149180000 26 cpu:2:32 1548149183000 54

client
  .madd([
    { key: 'temperature:2:32', timestamp: 1548149180000, value: 26 },
    { key: 'cpu:2:32', timestamp: 1548149183000, value: 54 }
  ]);
  .send();
```

#### incrBy
```javascript
// TS.INCRBY temperature:2:32 3 RETENTION 30000

client
  .incrBy('temperature:2:32', 3)
  .retention(30000)
  .send();
```

#### decrBy
```javascript
// TS.DECRBY temperature:2:32 5 RETENTION 30000 UNCOMPRESSED

client
  .decrBy('temperature:2:32', 5)
  .retention(30000)
  .uncompressed()
  .send();
```

#### createRule
```javascript
// TS.CREATERULE temperature:2:32 temperature:avg AGGREGATION avg 60000

const RedisTimeSeries = require('redistimeseries-js');
const { Aggregation } = RedisTimeSeries;

// ...

client
  .createRule('temperature:2:32', 'temperature:avg')
  .aggregation(Aggregation.AVG, 60000)
  .send();
```

#### deleteRule
```javascript
// TS.DELETE temperature:2:32 temperature:avg

client.deleteRule('temperature:2:32', 'temperature:avg').send();
```

#### range
```javascript
// TS.RANGE temperature:3:32 1548149180000 1548149210000 AGGREGATION avg 5000

const RedisTimeSeries = require('redistimeseries-js');
const { Aggregation } = RedisTimeSeries;

// ...

client
  .range('temperature:2:32', 1548149180000, 1548149210000)
  .aggregation(Aggregation.AVG, 5000)
  .send();
```

#### mrange
```javascript
// TS.MRANGE 1548149180000 1548149210000 AGGREGATION avg 5000 FILTER area_id=32 sensor_id!=1

const RedisTimeSeries = require('redistimeseries-js');
const { Aggregation, Filter } = RedisTimeSeries;

// ...

client
  .mrange('temperature:2:32', 1548149180000, 1548149210000)
  .filter([
    Filter.equal('area_id', 32),
    Filter.notEqual('sensor_id', 1)
  ])
  .aggregation(Aggregation.AVG, 5000)
  .send();
```

```javascript
// TS.MRANGE 1548149180000 1548149210000 AGGREGATION avg 5000 WITHLABELS FILTER area_id=32 sensor_id!=1

const RedisTimeSeries = require('redistimeseries-js');
const { Aggregation, Filter } = RedisTimeSeries;

// ...

client
  .mrange('temperature:2:32', 1548149180000, 1548149210000)
  .aggregation(Aggregation.AVG, 5000)
  .withLabels()
  .filter([
    Filter.equal('area_id', 32),
    Filter.notEqual('sensor_id', 1)
  ])
  .send();
```


#### get
```javascript
// TS.GET temperature:2:32

client.get('temperature:2:32').send();
```

#### mget
```javascript
// TS.MGET FILTER area_id=32

const RedisTimeSeries = require('redistimeseries-js');
const { Filter } = RedisTimeSeries;

// ...

client
  .mget()
  .filter([ Filter.equal('area_id', 32) ])
  .send();
```

#### info
```javascript
// TS.INFO temperature:2:32

client.info('temperature:2:32').send();
```

#### queryIndex
```javascript
// TS.QUERYINDEX sensor_id=2

client
  .queryIndex([ Filter.equal('sensor_id', 2) ])
  .send();
```
