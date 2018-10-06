const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const config = require(`${__dirname}/../config/config.json`);
const logger = require(`${__dirname}/../../helpers/logger`).child({ module: 'db' });
const db = {};
var dotenv = require('dotenv')
const sequelize = new Sequelize(config);
config.logging = function (msg) {
  logger.debug(msg);
};

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
		const model = sequelize.import(path.join(__dirname, file));
		// if(model.name == 'ips'){
			
		// }
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
