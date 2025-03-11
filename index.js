const express = require('express');
const cors = require('cors');
const createAccount = require('./save_user');
const pool = require('./connect_db.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(createAccount);

app.listen(port, async () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
