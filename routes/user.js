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

router.post('/user/remove/',async(req,res)=>{
    try{  
        const {id} = req.body;
        const sql = `delete from "user" where id = $1`;
        await pool.query(sql, [id]);
        res.json({erased: true})
    }catch(error){
        console.error(error)
    }
});


export { router as user };