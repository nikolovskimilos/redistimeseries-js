const Redis = require('redis');

const Query = require('./Query');
const { commands } = require('./constants');

const SIGN_SPACE = ' ';

class RedisTimeSeries {

  /**
   * Create a new RedisTimeSeries client, the {options} object is the same as for the redis library
   */
	constructor(options = {}) {
		this.options = options;
		this.client = null;
	}


	connect() {
		this.client = Redis.createClient(options);
	}

	/**
	 * Send plain command to redis
	 */
	async send(command) {
		return this.redis.send_command(command);
	}


	/**
   * TS.CREATE key [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
   */
  async create(key, { retention, labels = {}, uncompressed } = {}) {
  	const query = Query
  		.create(commands.TS_CREATE)
  		.addParams(key)
  		.retention(retention)
  		.labels(labels)
  		.uncompressed(uncompressed);
  		.toString()

  	return this.send(query);
  }

  /**
   * TS.ALTER key [RETENTION retentionTime] [LABELS field value..]
   */
  async alter(key, { retention, labels = {} }) {
  	const query =	Query
  		.create(commands.TS_ALTER)
  		.addParams(key)
  		.retention(retention)
  		.labels(labels)
  		.toString()

  	return this.send(query);
  }

	/**
	 * TS.ADD key timestamp value [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
	 */
 	async add(key, timestamp, value, { retention, labels = {}, uncompressed } = {}) {
 		const query =	Query
  		.create(commands.TS_ADD)
  		.addParams(key, timestamp, value)
  		.retention(retention)
  		.labels(labels)
  		.uncompressed(uncompressed)
  		.toString()

  	return this.send(query);
 	}


 	/**
 	 * TS.MADD key timestamp value [key timestamp value ...]
 	 */
 	async madd(...arrayOfObjects = []) {
 		const params = [];

 		arrayOfObjects.reduce((acc, { key, timestamp, value }) => {
 			acc.push(key);
 			acc.push(timestamp);
 			acc.push(value);
 			return acc;
 		}, params);
 		
 		const query = Query
 			.create(commands.TS_ADD)
  		.addParams(...params)
  		.toString();

  	return this.send(query);		
 	}


 	/**
 	 * TS.INCRBY key value [TIMESTAMP timestamp] [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
 	 */
 	async incrBy(key, value, { timestamp, retention, labels = {}, uncompressed } = {}) {
 		const query = Query
 			.create(commands.TS_INCRBY)
 			.addParams(key, value)
 			.timestamp(timestamp)
 			.retention(retention)
 			.labels(labels)
 			.uncompressed(uncompressed)
 			.toString()

 		return this.send(query);	
 	}
 	

 	/**
 	 * TS.DECRBY key value [TIMESTAMP timestamp] [RETENTION retentionTime] [LABELS field value..] [UNCOMPRESSED]
 	 */
 	async decrBy(key, value, { timestamp, retention, labels = {}, uncompressed } = {}) {
 		const query = Query
 			.create(commands.TS_DECRBY)
 			.addParams(key, value)
 			.timestamp(timestamp)
 			.retention(retention)
 			.labels(labels)
 			.uncompressed(uncompressed)
 			.toString()

 		return this.send(query);	
 	}
 	

 	/**
 	 * TS.CREATERULE sourceKey destKey AGGREGATION aggregationType timeBucket
 	 */
 	async createRule(sourceKey, destKey, aggregation = {}) {
 		const query = Query
 			.create(commands.TS_CREATERULE)
 			.addParams(sourceKey, destKey)
 			.aggregation(aggregationType, timeBucket)
 			.toString()

 		return this.send(query);	
 	}

 	
 	/**
 	 * TS.DELETERULE sourceKey destKey
 	 */
 	async deleteRule(sourceKey, destKey, aggregation = {}) {
 		const query = Query
 			.create(commands.TS_DELETERULE)
 			.addParams(sourceKey, destKey)
 			.toString()

 		return this.send(query);	
 	}


 	/**
 	 * TS.RANGE key fromTimestamp toTimestamp [COUNT count] [AGGREGATION aggregationType timeBucket]
 	 */
 	
 	async range(key, fromTimestamp, toTimestamp, { count, aggregation = {} } = {}) {
 		const query = Query
 			.create(commands.TS_RANGE)
 			.addParams(key, fromTimestamp, toTimestamp)
 			.count(count)
 			.aggregation(aggregation)
 			.toString()

 		return this.send(query);
 	}
 	

 	/**
 	 * TS.MRANGE fromTimestamp toTimestamp [COUNT count] [AGGREGATION aggregationType timeBucket] [WITHLABELS] FILTER filter..
 	 */
 	async mrange(fromTimestamp, toTimestamp, filter, { count, aggregation, withlabels }) {
 		const query = Query
 			.create(commands.TS_MRANGE)
 			.addParams(fromTimestamp, toTimestamp)
 			.count(count)
 			.aggregation(aggregation)
 			.withlabels(withlabels)
 			.filter(filter)
 			.toString()

 		return this.send(query);
 	}
 	

 	/**
 	 * TS.GET key
 	 */
 	async get(key) {
 		const query = Query
 			.create(commands.TS_GET)
 			.addParams(key)
 			.toString()

 		return this.send(query);
 	}
 	

 	/**
 	 * TS.MGET FILTER filter...
 	 */
 	async mget(filter) {
 		const query = Query
 			.create(commands.TS_GET)
 			.filter(filter)
 			.toString()

 		return this.send(query);
 	}
 	

 	/**
 	 * TS.INFO key
 	 */
 	async info(key) {
 		const query = Query
 			.create(commands.TS_GET)
 			.addParams(key)
 			.toString()

 		return this.send(query);
 	}
 	

 	/**
 	 * TS.QUERYINDEX filter...
 	 */
 	async queryIndex(filter) {
 		const query = Query
 			.create(commands.TS_GET)
 			.pureFilter(filter)
 			.toString()

 		return this.send(query);
 	}

}

module.exports = RedisTimeSeries;