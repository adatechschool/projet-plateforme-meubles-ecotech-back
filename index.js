// Lorsque vous récupérer ce code, n'oubliez pas de npm install dans votre terminal pour récuperer tous les modules installer ci dessous.
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const createAccount = require('./routes/save_user');
const productRoutes = require('./routes/display_products');
const pool = require('./connect_db.js');
require('dotenv').config(); // J'importe DOTENV pour pourvoir créer des variable d'environement
const basket = require('./routes/basket');
const searchBar = require('./routes/search_bar');

const app = express();
const port = process.env.PORT;



app.use(cors());
app.use(express.json());

app.use(createAccount);
app.use(productRoutes);
app.use(basket);
app.use(searchBar);

app.listen(port, async () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
