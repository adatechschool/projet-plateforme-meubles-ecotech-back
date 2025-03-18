import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT;

import { cart } from "./routes/cart.js";
import { login } from "./routes/login.js";
import { product } from "./routes/products.js";
import { searchBar } from "./routes/search_bar.js";
import { user } from './routes/user.js';

app.use(cors());
app.use(express.json());

app.use(login);
app.use(product);
app.use(cart);
app.use(searchBar);
app.use(user);

app.listen(port, async () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
