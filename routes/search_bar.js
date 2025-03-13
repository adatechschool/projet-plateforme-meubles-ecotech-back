const express = require('express');
const router = express.Router();
const pool = require('../connect_db');

router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const result = await pool.query('SELECT * FROM product WHERE title LIKE $1', [`%${searchTerm}%`]);

        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error Searching Products" });
    }
});

module.exports = router;
