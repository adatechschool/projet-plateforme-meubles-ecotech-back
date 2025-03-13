const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const createAccount = require('./routes/save_user');
const productRoutes = require('./routes/display_products');
const pool = require('./connect_db.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(createAccount);
app.use(productRoutes);

app.listen(port, async () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
