const express = require('express');
const cors = require('cors');
const createAccount = require('./save_user');
const pool = require('./connect_db.js');

const app = express();
const port = 3000;

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
    
})

app.use(cors());
app.use(express.json());

app.use(createAccount);

app.listen(port, async () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
