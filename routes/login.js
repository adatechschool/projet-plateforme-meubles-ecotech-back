import bcrypt from "bcryptjs"; // Pour chiffrer les mots de passe
import cookieParser from "cookie-parser"; // Pour lire les cookies dans les requêtes HTTP
import dotenv from "dotenv"; // Pour charger les variables d'environnement (comme le secret du JWT)
import express from "express"; // Framework pour créer les routes API
import jwt from "jsonwebtoken"; // Pour créer et vérifier les tokens JWT
import pool from "../connect_db.js"; // Connexion à la base de données PostgreSQL

dotenv.config({ path: "./.env" }); //  Charge le fichier .env qui contient des variables comme la clé secrète du JWT.
console.log("Toutes les variables d'environnement :");
console.log(process.env); // te permet de montrer l'ensable des variable dans ton terminale

// console.log("JWT_SECRET:", process.env.JWT_SECRET);

const router = express.Router(); //Crée un routeur Express pour organiser les routes.
router.use(cookieParser()); // Active cookie-parser pour gérer les cookies HTTP.

// Fonction pour générer un token JWT
const generateToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, is_admin: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  console.log("Token généré :", token); // Ajoute ce log pour voir le token dans la console
  return token;
};

// Fonction pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "Accès refusé, pas de token !" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalide !" });
  }
};

//chiffré le mot de passe dans la base de donnée
const hashedPassword = async (password) => {
  try {
    //généré un sel aléatoire (sel permet de chiffré d'une certaine manière le mot de passe)
    const salt = await bcrypt.genSalt();

    //appliquer le sel sur le mot de passe pour le chiffré
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
};

//fonction qui permet de créer un utilisateur
router.post("/create-account", async (req, res) => {
  //récupérer les informations stiué dans les formulaires du frontend
  const { fullname, email, password } = req.body;

  //chiffré le mot de passe écris dans le formulaire
  const new_password = await hashedPassword(password);

  res.json({ message: "Data received successfully!", receivedData: req.body });

  //ajout dans la base de donnée
  await pool.query(
    'INSERT INTO "user" (fullname, email, "password", is_admin) VALUES ($1, $2, $3, $4) RETURNING *',
    [fullname, email, new_password, false]
  );
});

// Route connexion user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const findUser =
      'SELECT id,email, password, is_admin FROM "user" WHERE email= $1 ';
    const { rows } = await pool.query(findUser, [email]);

    if (rows.length === 0) {
      res.json("Utilisateur non trouvé");
      return;
      //return res.send("Utilisateur non trouvé");
    }

    const user = rows[0];
    console.log(user);
    res.json({connected: true})

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.json({ connected: false });
      return;
      // res.send("Mot de passe incorrect")
      //return res.send("Mot de passe incorrect");
    }

    const token = generateToken(user);
    console.log("✅ Token généré :", token); // ← Debug pour voir si un token est bien généré
    // Stocker le token dans un cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Active-le en production
      maxAge: 3600000, // Expire en 1h
    });

    res.json({ connected: true });
    //res.send("Connexion réussie");
  } catch (e) {
    console.error("Erreur serveur interne", e.message);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});
// **Route pour récupérer les infos de l'utilisateur**
router.get("/profile", verifyToken, (req, res) => {
  res.json({ user: req.user });
  console.log("Utilisateur connecté :", req.user);
});

// **Route pour admin uniquement**
router.get("/admin", verifyToken, (req, res) => {
  if (!req.user.r.is_admin === "true") {
    return res
      .status(403)
      .json({ message: "Accès refusé, vous n'êtes pas admin !" });
  }
  res.json({ message: "Bienvenue Admin !" });
  console.log(
    "vous etes bien l'admine et vous avez le droit d'acceder a la page admin"
  );
});

export { router as login };
