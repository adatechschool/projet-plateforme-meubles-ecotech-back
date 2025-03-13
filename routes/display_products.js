const express = require('express');
const router = express.Router();
const pool = require('../connect_db');

//fonction pour récupérer toutes les informations de tous les produits dans la base de donnée
router.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM product');
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
});

//fonction pour récupérer toutes les informations des produits filtré par type
router.get('/products/type/:typeId', async (req, res) => {
    try {
        //typeId est récupéré dans la bar de recherche
        const typeId = parseInt(req.params.typeId, 10);

        //les id des type dans la base de donnée se situent entre 5 et 10 inclus
        if (isNaN(typeId) || typeId < 5 || typeId > 10)
            return res.status(400).json({ message: "Invalid type ID. It must be between 5 and 10." });

        const result = await pool.query('SELECT * FROM product WHERE type_id = $1', [typeId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
});

//fonction pour récupérer toutes les informations des produits filtré par marque
router.get('/products/brand/:brandId', async (req, res) => {
    try {
        //brandId est récupéré dans la bar de recherche
        const brandId = parseInt(req.params.brandId, 10);

        //les id des marque dans la base de donnée se situent entre 1 et 10 inclus
        if (isNaN(brandId) || brandId < 1 || brandId > 10)
            return res.status(400).json({ message: "Invalid brand ID. It must be between 1 and 10." });

        const result = await pool.query('SELECT * FROM product WHERE brand_id = $1', [brandId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
});

module.exports = router;
