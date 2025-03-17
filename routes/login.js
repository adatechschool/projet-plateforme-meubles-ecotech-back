import bcrypt from 'bcryptjs';
import express from 'express';
import pool from '../connect_db.js';
const router = express.Router();

//chiffré le mot de passe dans la base de donnée
const hashedPassword = async (password) => {
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
    await pool.query('INSERT INTO "user" (fullname, email, "password", is_admin) VALUES ($1, $2, $3, $4) RETURNING *', [fullname, email, new_password, false]);
});

// Route connexion user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        
        const findUser = 'SELECT email, password FROM "user" WHERE email= $1 ';
        const { rows } = await pool.query(findUser, [email]);
        
        if (rows.length === 0) {
            res.json("Utilisateur non trouvé");
            return;
            //return res.send("Utilisateur non trouvé");
        }

        const user = rows[0];
        console.log(user);
        
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.json({connected: false});
            return;
            // res.send("Mot de passe incorrect")
            //return res.send("Mot de passe incorrect");
        }
        res.json({connected: true});
        //res.send("Connexion réussie");
    } catch (e) {
        console.error('Erreur serveur interne', e.message);
        res.status(500).json({error: 'Erreur interne du serveur'})
    }
});

export { router as login };
