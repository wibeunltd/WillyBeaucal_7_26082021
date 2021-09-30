'use strict';
// Imports
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

// Paramétrages sequelize et base de données
let sequelize;
if(process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'development') {
  config.database = process.env.DB_DATABASE;
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
  });

} else if (process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'test') {
  config.database = process.env.DB_DATABASE_TEST;
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
  });

} else if (process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'production') {
  config.database = process.env.DB_DATABASE_PROD;
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
  });
}

// Connexion base de données
sequelize.authenticate()
.then(() => console.log(`😀 La connexion à la base de données ${config.database}, pour l'environnement ${env}, a été établie avec succès !`))
.catch((error) => console.log(`😲 Impossible de se connecter à la base de données.`, error))

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;