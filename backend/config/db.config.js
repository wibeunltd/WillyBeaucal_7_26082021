// Variables d'environnement
require('dotenv').config();

module.exports = {
    development : {
        USER        : process.env.DB_USERNAME,
        PASSWORD    : process.env.DB_PASSWORD,
        HOST        : process.env.DB_HOST,
        PORT        : process.env.DB_PORT,
    },
    test : {
        USER        : process.env.DB_USERNAME,
        PASSWORD    : process.env.DB_PASSWORD,
        HOST        : process.env.DB_HOST,
        PORT        : process.env.DB_PORT,
    },
    production : {
        USER        : process.env.DB_USERNAME,
        PASSWORD    : process.env.DB_PASSWORD,
        HOST        : process.env.DB_HOST,
        PORT        : process.env.DB_PORT,
    },
    
  };