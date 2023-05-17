const express       = require("express")
const app           = express()

// cors policy
const cors          = require("cors")
app.use(cors())

// body parser
const bodyParser    = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// importer les routes
const userRoutes    = require("./routes/routesUsers")
// const userChambres  = require("./routes/routesChambres")
// const userReservation= require("./routes/routesReservations")
app.use("/user", userRoutes)
//app.use("/chambre", userChambres)
//app.use("/reservation", userReservation)

// launch app
app.listen(3000, ()=>console.log("SERVER START"))