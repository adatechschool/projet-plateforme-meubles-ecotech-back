const { Pool } = require('pg');

//connection a la base de donnée
const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_0hDFSg7QmuCn@ep-gentle-shape-a98o7km5-pooler.gwc.azure.neon.tech/neondb?sslmode=require",
    ssl: {
        rejectUnauthorized: false
    },
});

module.exports = pool;
