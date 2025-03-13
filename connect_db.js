const { Pool } = require('pg');
require('dotenv').config();

//connection a la base de donnée
const pool = new Pool({
    connectionString: process.env.CONNECTION_DB,
    ssl: {
        rejectUnauthorized: false
    },
});

module.exports = pool;
