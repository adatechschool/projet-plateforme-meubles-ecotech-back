const express = require('express');
const router = express.Router();
const pool = require('../connect_db');


// Route pour récupérer le panier d'un utilisateur 
router.get('/basket/:id', async (req, res) => {
    try {
        const basketId = req.params.id; // récupérer le paramètre id dans l'url. req = request
        const result = await pool.query(`SELECT * from basket_item WHERE basket_id = $1`, [basketId]); // Requête SQL
        res.json(result.rows) // res = response, la réponse est retourner dans un format json()
    } catch (e){
        console.error('Erreur serveur interne', e.message);
        res.status(500).json({error: 'Erreur interne du serveur'});
    }
});

module.exports = router