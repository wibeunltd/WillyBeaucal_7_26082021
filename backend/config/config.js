// Variables d'environnement
require('dotenv').config();

module.exports = {
    development : {
        username    : process.env.DB_USERNAME,
        password    : process.env.DB_PASSWORD,
        host        : process.env.DB_HOST,
        database    : process.env.DB_DATABASE,
        port        : process.env.DB_PORT,
        dialect     : process.env.DIALECT
    },
    test : {
        username    : process.env.DB_USERNAME,
        password    : process.env.DB_PASSWORD,
        host        : process.env.DB_HOST,
        database    : process.env.DB_DATABASE_TEST,
        port        : process.env.DB_PORT,
        dialect     : process.env.DIALECT
    },
    production : {
        username    : process.env.DB_USERNAME,
        password    : process.env.DB_PASSWORD,
        host        : process.env.DB_HOST,
        database    : process.env.DB_DATABASE_PROD,
        port        : process.env.DB_PORT,
        dialect     : process.env.DIALECT
    },
    
};