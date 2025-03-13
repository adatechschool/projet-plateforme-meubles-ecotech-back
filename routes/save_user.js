const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const pool = require('../connect_db');

//chiffré le mot de passe dans la base de donnée
async function hashedPassword(password) {
    try {
        //généré un sel aléatoire (sel permet de chiffré d'une certaine manière le mot de passe)
        const salt = await bcrypt.genSalt();

        //appliquer le sel sur le mot de passe pour le chiffré
        const hashedPassword = await bcrypt.hash(password, salt);
        return (hashedPassword);
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}

//fonction qui permet de créer un utilisateur
router.post('/create-account', async (req, res) => {
    //récupérer les informations stiué dans les formulaires du frontend
    const { fullname, email, password } = req.body;

    //chiffré le mot de passe écris dans le formulaire
    const new_password = await hashedPassword(password);

    res.json({ message: "Data received successfully!", receivedData: req.body });

    //ajout dans la base de donnée
    await pool.query('INSERT INTO "user" (fullname, email, "password") VALUES ($1, $2, $3) RETURNING *', [fullname, email, new_password]);
});

// Route connexion user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = 'SELECT email, password FROM "user" WHERE email= $1 ';
        const { rows } = await pool.query(findUser,[email]);
        if (rows.length === 0) {
            return res.send("Utilisateur non trouvé");
        }
        const user = rows[0];

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

module.exports = hashedPassword;
module.exports = router;
