const express = require('express');
const cors = require('cors');
const createAccount = require('./save_user');
const pool = require('./connect_db.js');

const app = express();
const port = 3000;

// Route test pour savoir si les requêtes vers la db sont fonctionnel
// app.get('/test', async (req, res) => {
//     try{
//         const result = await pool.query('SELECT title FROM product');
//         console.log(result.rows);
//         res.json(result.rows);
//     } catch(e) {
//         console.error('Erreur serveur interne', e.message);
//         res.status(500).json({error: 'Erreur interne du serveur'})
//     }
    
// })


// app.get('/login', async (req, res) => {
//     try{
//         // const {email, password } = req.body;
//         const findUser ='SELECT email, password FROM user WHERE email'
//         const {connexion} = await pool.query(findUser, [email])
//         if (connexion.length === 0){
//             return res.send('Utilisateur non trouvé');
//         }
//         const rows = connexion[0];

//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword){
//             return res.send('Mot de passe incorrect')
//         }
//         console.log(connexion.rows)
//         res.json(connexion.rows)
//         // res.send('Connexion réussie')
//     } catch(e){
//         console.error('Erreur lors de la connexion', e.message)
//         res.status(500).json({error: 'Erreur lors de la connexion'})
//     }
// })

app.use(cors());
app.use(express.json());

app.use(createAccount);

app.listen(port, async () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
