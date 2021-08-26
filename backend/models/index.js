'use strict';
// Modules requis
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/db.config.js')[env];
const db = {};

// Paramétrages sequelize et base de données
let sequelize;
if(process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'development') {
  config.DB = process.env.DB_DATABASE;
  sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    port: config.PORT,
    dialect: process.env.DIALECT,
  });

} else if (process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'test') {
  config.DB = process.env.DB_DATABASE_TEST;
  sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    port: config.PORT,
    dialect: 'mysql',
  });

} else if (process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'production') {
  config.DB = process.env.DB_DATABASE_PROD;
  sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    port: config.PORT,
    dialect: process.env.DIALECT,
  });
}

// Connexion base de données
sequelize.authenticate()
.then(() => console.log(`😀 La connexion à la base de données ${config.DB}, pour l'environnement ${env}, a été établie avec succès !`))
.catch((error) => console.log(`😲 Impossible de se connecter à la base de données.`, error))

/* sequelize.sync()
.then(() => console.log(`😀 La base de donnée a bien été initialisée !`))
.catch((error) => console.log(`😲 Impossible d'initialiser' la base de données.`, error)) */

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
