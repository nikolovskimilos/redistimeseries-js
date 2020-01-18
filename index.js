
const RedisTimeSeries = require('./src/RedisTimeSeries');
const commands = require('./src/commands');

module.exports = RedisTimeSeries;

const setExports = (schemas) => {
  Object.values(schemas).forEach((querySchema) => {
  	const schemaExports = querySchema.getExports();
  	if (schemaExports) {
	  	Object.keys(schemaExports).forEach(name => 
	  		module.exports[name] = schemaExports[name]
	  	);
	  }
  });
}

setExports(commands);





