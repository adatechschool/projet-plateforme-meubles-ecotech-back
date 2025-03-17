import express from 'express';
import pool from '../connect_db.js';
const router = express.Router();

// Route pour récupérer le panier d'un utilisateur 
router.get('/cart/:id', async (req, res) => {
    try {
        const basketId = req.params.id; // récupérer le paramètre id dans l'url. req = request
        const result = await pool.query(`SELECT * from basket_item WHERE basket_id = $1`, [basketId]); // Requête SQL
        res.json(result.rows) // res = response, la réponse est retourner dans un format json()
    } catch (e){
        console.error('Erreur serveur interne', e.message);
        res.status(500).json({error: 'Erreur interne du serveur'});
    }
});

router.post('/cart/:id/add', async(req, res)=>{
    try{
        const basketId = req.params.id;
        const { product_id, quantity, price} = req.body;
        const existItem = await pool.query(
            `SELECT * FROM basket_item WHERE basket_id = $1 AND product_id = $2`,
            [basketId, product_id]
        );

        if (existItem.rows.length > 0){
            await pool.query(
                `UPDATE basket_item SET quantity = quantity + $1 WHERE basket_id = $2 AND product_id = $3`,
                [quantity, basketId, product_id]
            );
        } else {
            await pool.query(
                `INSERT INTO basket_item (product_id, basket_id, quantity, price) VALUES ($1, $2, $3, $4)`,
                [product_id, basketId, quantity, price]
            );
        }

        res.json({ message: 'Produit ajouté au panier' });
    } catch (e){
        console.error('Erreur serveur interne', e.message);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});


export { router as cart };