// Lorsque vous récupérer ce code, n'oubliez pas de npm install dans votre terminal pour récuperer tous les modules installer ci dessous.
const express = require('express');
const cors = require('cors');
const createAccount = require('./save_user');
const pool = require('./connect_db.js');
require('dotenv').config(); // J'importe DOTENV pour pourvoir créer des variable d'environement 

const app = express();
const port = process.env.PORT;

// Route test pour savoir si les requêtes vers la db sont fonctionnel
app.get('/test', async (req, res) => {
    try{
        const result = await pool.query('SELECT title FROM product');
        console.log(result.rows);
        res.json(result.rows);
    } catch(e) {
        console.error('Erreur serveur interne', e.message);
        res.status(500).json({error: 'Erreur interne du serveur'})
    }
    
});

// Route pour récupérer le panier d'un utilisateur 
app.get('/basket/:id', async (req, res) => {
    try {
        const basketId = req.params.id; // récupérer le paramètre id dans l'url. req = request
        const result = await pool.query(`SELECT * from basket_item WHERE basket_id = $1`, [basketId]); // Requête SQL
        res.json(result.rows) // res = response, la réponse est retourner dans un format json()
    } catch (e){
        console.error('Erreur serveur interne', e.message);
        res.status(500).json({error: 'Erreur interne du serveur'});
    }
})

app.use(cors());
app.use(express.json());

app.use(createAccount);

app.listen(port, async () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
