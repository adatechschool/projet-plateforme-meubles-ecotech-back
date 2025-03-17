import express from 'express';
import pool from '../connect_db.js';
const router = express.Router();

router.get('/search', async (req, res) => {     //fonction pour la bar de recherche
    try {
        //l'url ressemblera a ".../search?q=smartphone" (exemple) donc on fait un get de 'q'
        const searchTerm = req.query.q;

        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }

        //requete SQL pour chercher le produit soit par methode leveshtein pour ne pas trop pénaliser les fautes de frappes soit en cherchant le bout de mot écrit dans la bar de recherche dans les noms des produits
        const result = await pool.query(
            `SELECT *, levenshtein(lower(title), lower($1)) AS distance
             FROM product
             WHERE title ILIKE $2
             OR levenshtein(lower(title), lower($1)) <= 3
             ORDER BY distance ASC`,
            [searchTerm, `%${searchTerm}%`]
        );
        //levenshtein ne peut pas comparer un bout de mot a un mot entier donc on utilise les 2 methodes pour optimiser la recherche

        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error Searching Products" });
    }
});

export { router as searchBar };
