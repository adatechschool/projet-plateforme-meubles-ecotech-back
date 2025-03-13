const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const pool = require('./connect_db');

async function hashedPassword(password) {                   //chiffré le mot de passe dans la base de donnée
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        return (hashedPassword);
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}

router.post('/create-account', async (req, res) => {
    const { fullname, email, password } = req.body;
    const new_password = await hashedPassword(password);

    console.log("Received Data:");
    console.log("Fullname:", fullname);
    console.log("Email:", email);
    console.log("Password:", new_password);

    res.json({ message: "Data received successfully!", receivedData: req.body });
    await pool.query('INSERT INTO "user" (fullname, email, "password") VALUES ($1, $2, $3) RETURNING *', [fullname, email, new_password]);
});

module.exports = hashedPassword;
module.exports = router;
