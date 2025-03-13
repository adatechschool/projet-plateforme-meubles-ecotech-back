const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
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
// Route connexion user
app.get('/login', async (req, res) => {
    try {
        //const { email, password } = req.body;
        const email = "raissa@gmail.com"
        const mdp = "azerty"
        const findUser = 'SELECT email, password FROM "user" WHERE email= $1 ';
        const { rows } = await pool.query(findUser,[email]);
        if (rows.length === 0) {
            return res.send("Utilisateur non trouvé");
        }
        const user = rows[0];
        console.log(user.password)

        const validPassword = await bcrypt.compare(mdp, user.password);
        if (!validPassword) {
           return res.send("Mot de passe incorrect");
        }
        res.send("Connexion réussie");
    } catch (e) {
        console.error('Erreur serveur interne', e.message);
        res.status(500).json({error: 'Erreur interne du serveur'})
    }
});


app.use(cors());
app.use(express.json());

app.use(createAccount);

app.listen(port, async () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
