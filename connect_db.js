import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

//connection a la base de donnée
const pool = new Pool({
    connectionString: process.env.CONNECTION_DB,
    ssl: {
        rejectUnauthorized: false
    },
});

export default pool;
