const validator = require("validator")
require("dotenv").config()

const inputVerification = (req,res,next)=>{
    
    // Vérification des inputs s'ils sont NULL ou UNDEFINED
    if(req.body.title==null || req.body.title==undefined)
    {return res.status(403).json({"error":"TITRE INDEFINI"})}
    
    if(req.body.description==null || req.body.description==undefined)
    {return res.status(403).json({"error":"DESCRIPTION INDEFINIE"})}

    if(req.body.parking==null || req.body.parking==undefined)
    {return res.status(403).json({"error":"PARKING INDEFINI"})}

    if(req.body.wifi==null || req.body.wifi==undefined)
    {return res.status(403).json({"error":"WIFI INDEFINI"})}

    if(req.body.fumeur==null || req.body.fumeur==undefined)
    {return res.status(403).json({"error":"FUMEUR INDEFINI"})}

    if(req.body.salleSport==null || req.body.salleSport==undefined)
    {return res.status(403).json({"error":"SALLE DE SPORT INDEFINIE"})}

    if(req.body.restaurant==null || req.body.restaurant==undefined)
    {return res.status(403).json({"error":"RESTAURANT INDEFINI"})}

    if(req.body.reception==null || req.body.reception==undefined)
    {return res.status(403).json({"error":"RECEPTION INDEFINI"})}
 
    if(req.body.accessHandicap==null || req.body.accessHandicap==undefined)
    {return res.status(403).json({"error":"ACCESSIBILIÉ POUR HANDICAPÉ INDEFINIE"})}

    if(req.body.terrasse==null || req.body.terrasse==undefined)
    {return res.status(403).json({"error":"TERRASSE INDEFINIE"})}

    if(req.body.bar==null || req.body.bar==undefined)
    {return res.status(403).json({"error":"BAR INDEFINI"})}

    if(req.body.petitDej==null || req.body.petitDej==undefined)
    {return res.status(403).json({"error":"PETIT DEJ INDEFINI"})}

    // Vérification des inputs avec validator
    if(!validator.isLength(req.body.title, {min:3, max:100}))
    {return res.status(403).json({"error":"TITRE DOIT AVOIR MIN 3 / MAX 1000 CHARS"})}

    if(!validator.isLength(req.body.description, {min:3, max:1000}))
    {return res.status(403).json({"error":"DESCRIPTION DOIT AVOIR MIN 3 / MAX 1000 CHARS"})}

    if(req.body.parking==true || req.body.parking==false){}else
    {return res.status(403).json({"error":"PARKING DOIT ETRE UN BOOLEAN"})}

    if(req.body.wifi==true || req.body.wifi==false){}else
    {return res.status(403).json({"error":"WIFI DOIT ETRE UN BOOLEAN"})}

    if(req.body.fumeur==true || req.body.fumeur==false){}else
    {return res.status(403).json({"error":"FUMEUR DOIT ETRE UN BOOLEAN"})}

    if(req.body.salleSport==true || req.body.salleSport==false){}else
    {return res.status(403).json({"error":"SALLE DE SPORT DOIT ETRE UN BOOLEAN"})}

    if(req.body.restaurant==true || req.body.restaurant==false){}else
    {return res.status(403).json({"error":"RESTAURANT DOIT ETRE UN BOOLEAN"})}

    if(req.body.reception==true || req.body.reception==false){}else
    {return res.status(403).json({"error":"RECEPTION DOIT ETRE UN BOOLEAN"})}
 
    if(req.body.accessHandicap==true || req.body.accessHandicap==false){}else
    {return res.status(403).json({"error":"ACCESSIBILIÉ POUR HANDICAPÉ DOIT ETRE UN BOOLEAN"})}

    if(req.body.terrasse==true || req.body.terrasse==false){}else
    {return res.status(403).json({"error":"TERRASSE DOIT ETRE UN BOOLEAN"})}

    if(req.body.bar==true || req.body.bar==false){}else
    {return res.status(403).json({"error":"BAR DOIT ETRE UN BOOLEAN"})}

    if(req.body.petitDej==true || req.body.petitDej==false){}else
    {return res.status(403).json({"error":"PETIT DEJ DOIT ETRE UN BOOLEAN"})}

    next()

}

module.exports = inputVerification