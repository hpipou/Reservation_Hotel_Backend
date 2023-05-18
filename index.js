const express       = require("express")
const app           = express()

// cors policy
const cors          = require("cors")
app.use(cors())

// body parser
const bodyParser    = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// enregistrer tous les logs dans un fichier text
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'logs.txt');

// Créer un flux de sortie vers le fichier logs.txt
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Définir le format de log souhaité
const logFormat = ':remote-addr     :remote-user   [:date[clf]]   ":method   :url"';
app.use(morgan(logFormat, { stream: accessLogStream }));

// Limitation de requettes et protection contre les attaques DDOS
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
	windowMs: 10 * 60 * 3000, // 10 minutes
	max: 100, // Limiter chaque adresse ip à 100 requette pour 10min
	standardHeaders: true, 
	legacyHeaders: false, 
})

// appliquer la limitation à toutes les routes
app.use(limiter)

// protéger les entête de réponse
const helmet = require("helmet")
app.use(helmet())

// importer les routes
const userRoutes    = require("./routes/routesUsers")
const userChambres  = require("./routes/routesChambres")
const userReservation= require("./routes/routesReservations")
const userImage     = require("./routes/routesImages")
app.use("/user", userRoutes)
app.use("/chambre", userChambres)
app.use("/reservation", userReservation)
app.use("/images", userImage)

// launch app
app.listen(3000, ()=>console.log("SERVER START"))