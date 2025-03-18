import express from 'express';
import pool from '../connect_db.js';
const router = express.Router();

//fonction pour récupérer toutes les informations de tous les produits dans la base de donnée
router.get('/products', async (req, res) => {
    try {
        const filtre = parseInt(req.query.category);
        const productId = parseInt(req.query.id);
        if (filtre) {
            const result = await pool.query('SELECT * FROM products WHERE category_id = $1', [filtre]);
            res.json(result.rows);
        } else if (productId) {
            const result = await pool.query(
                `SELECT * FROM products WHERE id = $1`, [productId]);
                res.json(result.rows);
        } else {
            const result = await pool.query('SELECT * FROM products');
            res.json(result.rows);
        }
        
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
});

router.get('/products/category', async (req, res) => {
    try {
        const filtre = parseInt(req.query.id);
        if (filtre) {
            const result = await pool.query('SELECT * FROM categories WHERE id = $1', [filtre]);
            
            res.json(result.rows);
        } else {
            const result = await pool.query("SELECT * FROM categories");
            res.json(result.rows);
        }
        
    } catch (error) {
        console.error(`Database error : ${error}`);
        res.status(500).json({ message: "Error fetching products"});
    }
});

//fonction pour récupérer toutes les informations des produits filtré par marque
router.get('/products/brand', async (req, res) => {
    try {
        //brandId est récupéré dans la bar de recherche
        const brandId = parseInt(req.query.id, 10);
        if (brandId) {
            if (isNaN(brandId) || brandId < 1 || brandId > 10)
                return res.status(400).json({ message: "Invalid brand ID. It must be between 1 and 10." });
    
            const result = await pool.query('SELECT * FROM products WHERE brand_id = $1', [brandId]);
            res.json(result.rows);
        } else {
            const result = await pool.query("SELECT * FROM brands");
            res.json(result.rows);  
        }
        //les id des marque dans la base de donnée se situent entre 1 et 10 inclus
        
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
});

router.post('/add', async (req, res) => {
    try {
        const {category, nom, url, description, price} = req.body;
        console.log(category, nom, url, description, price);
        
        const query = `INSERT INTO products 
                       (title, description, price, category_id, img)
                       VALUES ($1,$2,$3,$4,$5)`;
        const { rows } = pool.query(query, [nom, description, price, category, url]);

        res.json({add: true});
    } catch (error) {
        console.error(error)
    }
});
// router.get('/products/brand', async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM brands");
//         res.json(result.rows);  
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching products" });
//     }
// });

// router.get('/products/:id', async (req, res) => {
//     try {
//         const id = parseInt(req.params.id, 10);
//         const result = await pool.query(
//             `SELECT * FROM products WHERE id = $1`, [id]);
//             res.json(result.rows);
//     } catch (error) {
//         console.error(error);
//     }
// });

// //fonction pour récupérer toutes les informations des produits filtré par type
// router.get('/products/category/:id', async (req, res) => {
//     try {
//         //typeId est récupéré dans la bar de recherche
//         const id = parseInt(req.params.id, 10);

//         //les id des type dans la base de donnée se situent entre 5 et 10 inclus
//         if (isNaN(id) || id < 5 || id > 10)
//             return res.status(400).json({ message: "Invalid type ID. It must be between 5 and 10." });

//         const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
//         res.json(result.rows);
//     } catch (error) {
//         console.error("Database error:", error);
//         res.status(500).json({ message: "Error fetching products" });
//     }
// });

export { router as product };