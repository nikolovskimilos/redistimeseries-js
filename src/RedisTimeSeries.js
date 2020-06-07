const Redis = require('redis');
const RedisClustr = require('redis-clustr');
const Query = require('./Query');
const commands = require('./commands');

const SIGN_SPACE = ' ';

class RedisTimeSeries {
  /**
   * Create a new RedisTimeSeries client, the {options} object is the same as for the redis library
   */
  constructor(options = {}) {
    this.options = options;
    this.client = null;
    this._loadedSchemas = [];

    this.load(Object.values(commands));
  }


  /**
   * Connect client to redis server
   */
  async connect() {
    if ('cluster' in this.options) {
      this.client = await new RedisClustr(this.options.cluster);
    } else {
      this.client = await Redis.createClient(this.options);
    }
  }

  /**
   * Fetch redis client
   */
  getClient() {
    return this.client;
  }

  /**
   * Set redis client
   */
  setClient(client = null) {
    if (!client) {
      throw new Error('Client must be a valid object');
    }

    this.client = client;
  }

  /**
   * Send plain command to redis
   */
  async send(query) {
    const [command, ...args] = query.split(SIGN_SPACE);
    return new Promise((resolve, reject) => {
      this.client.send_command(command, args, (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      });
    });
  }


  load(querySchemas) {
    this._loadedSchemas = this._loadedSchemas.concat(querySchemas);
    querySchemas.forEach((querySchema) => {
      this[querySchema.getMethodName()] = (...params) => Query
        .create(querySchema)
        .params(params)
        .sendHandler(this.send.bind(this));
    });
  }
}

module.exports = RedisTimeSeries;
