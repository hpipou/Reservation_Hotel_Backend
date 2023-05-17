const validator = require("validator")
require("dotenv").config()

const inputVerification = (req,res,next)=>{
    
    // Vérification des inputs s'ils sont NULL ou UNDEFINED
    if(req.query.datedebut==null || req.query.datedebut==undefined)
    {return res.status(403).json({"error":"DATE DE DEBUT INDEFINIE"})}
    
    if(req.query.datefin==null || req.query.datefin==undefined)
    {return res.status(403).json({"error":"DATE DE FIN INDEFINIE"})}

    if(req.query.idChambre==null || req.query.idChambre==undefined)
    {return res.status(403).json({"error":"PARKING INDEFINI"})}

    // Vérification des inputs avec validator
    if(!validator.isDate(req.query.datedebut))
    {return res.status(403).json({"error":"DATE DE DEBUT EST INCORRECT"})}

    if(!validator.isDate(req.query.datefin))
    {return res.status(403).json({"error":"DATE DE FIN EST INCORRECT"})}

    if(!validator.isUUID(req.query.idChambre))
    {return res.status(403).json({"error":"UUID DE LA CHAMBRE EST INCORRECT"})}

    next()

}

module.exports = inputVerification