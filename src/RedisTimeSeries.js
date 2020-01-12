const Redis = require('redis');
const Query = require('./Query');
const commands = require('./commands');


class RedisTimeSeries {
  /**
   * Create a new RedisTimeSeries client, the {options} object is the same as for the redis library
   */
  constructor(options = {}) {
    this.options = options;
    this.client = null;
    this._loadedSchemas = {};

    this.load(commands);
  }


  /**
   * Connect client to redis server
   */
  async connect() {
    this.client = await Redis.createClient(this.options);
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
  async send(...params) {
    const [command, ...args] = params;
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
    Object.assign(this._loadedSchemas, querySchemas);
    Object.values(querySchemas).forEach((querySchema) => {
      this[querySchema.getMethodName()] = (...params) => Query
        .create(querySchema)
        .params(params)
        .sendHandler(this.send.bind(this));
    });
  }
}

module.exports = RedisTimeSeries;
