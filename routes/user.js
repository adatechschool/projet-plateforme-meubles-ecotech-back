import express from 'express';
import pool from '../connect_db.js';
const router = express.Router();

router.get('/user', async (req, res) => {
    try {
        const query = `SELECT * FROM "user"`;
        const result = await pool.query(query);
        
        res.json(result.rows);
    } catch (error) {
        console.error(error)
    }
});

export { router as user };