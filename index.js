import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT;

import { login } from './routes/login.js';
import { product } from './routes/products.js';
import { cart } from './routes/cart.js';
import { searchBar } from './routes/search_bar.js';

app.use(cors());
app.use(express.json());

app.use(login);
app.use(product);
app.use(cart);
app.use(searchBar);

app.listen(port, async () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
