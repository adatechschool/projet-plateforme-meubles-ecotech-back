const express = require('express');
const router = express.Router();
const pool = require('../connect_db');

router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q;

        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }

        // PostgreSQL query using Levenshtein distance to find closest matches
        const result = await pool.query(
            `SELECT *, levenshtein(lower(title), lower($1)) AS distance
             FROM product
             WHERE title ILIKE $2
             OR levenshtein(lower(title), lower($1)) <= 3
             ORDER BY distance ASC`,
            [searchTerm, `%${searchTerm}%`]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Error Searching Products" });
    }
});

module.exports = router;
