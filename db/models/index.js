const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const logger = require(`${__dirname}/../../helpers/logger`).child({ module: 'db' });
const db = {};
var dotenv = require('dotenv')()
console.log(process.env)
const sequelize = new Sequelize(process.env['dburl'], {
	"logging": false,
	"dialect" : "postgres",
  "dialectOptions": {
		"ssl": false
	},
  "operatorsAliases": false,
  "pool": {
    "max": 150,
    "min": 0,
    "idle": 10000
	},
	"port":5432
});

config.logging = function (msg) {
  logger.debug(msg);
};

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
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
