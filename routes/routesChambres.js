const express   = require("express")
const route     = express.Router()
const validator = require("validator")
const models    = require("../models")
const jwt       = require("jsonwebtoken")
const uuid      = require("uuid")
const tokenVerif= require("../middleware/tokenVerification")
const inputVerification = require("../middleware/inputVerification")
require("dotenv").config()

//////////////////////////////////////////////
// créer une chambre
//////////////////////////////////////////////
route.post("/add", inputVerification, (req,res)=>{

    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)
    
    // seul un administrateur pourra publier une chambre
    if(tokenDecoded.role!='ADMIN')
    {return res.status(403).json({"error":"TU DOIS ETRE UN ADMIN POUR AJOUTER UNE CHAMBRE"})}

    // générer un UUID V4 pour l'id de la chambre
    const uuidChambre = uuid.v4()

    // ajouter la chambre
    models.Chambre.create({
        id:uuidChambre,
        title:req.body.title,
        description:req.body.description,
        parking:req.body.parking,
        wifi:req.body.wifi,
        fumeur:req.body.fumeur,
        salleSport:req.body.salleSport,
        restaurant:req.body.restaurant,
        reception:req.body.reception,
        accessHandicap:req.body.accessHandicap,
        terrasse:req.body.terrasse,
        bar:req.body.bar,
        petitDej:req.body.petitDej,
        images:['standard.jpg'],
        userid: tokenDecoded.id
    })
    .then(()=>{return res.status(201).json({"OK":"CHAMBRE AJOUTÉ"})})
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

})

//////////////////////////////////////////////
// modifier une chambre
//////////////////////////////////////////////
route.patch("/edit", inputVerification , (req,res)=>{

    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)
    
    // seul un administrateur pourra modifier une chambre
    if(tokenDecoded.role!='ADMIN')
    {return res.status(403).json({"error":"TU DOIS ETRE UN ADMIN POUR MODIFIER UNE CHAMBRE"})}

    // vérifier l'uuid de le la chambre
    if(req.body.uuidChambre==null || req.body.uuidChambre==undefined)
    {return res.status(403).json({"error":"UUID CHAMBRE EST INDEFINI"})}

    const uuidChambre = req.body.uuidChambre
    if(!validator.isUUID(uuidChambre, 4))
    {return res.status(403).json({"error":"UUID CHAMBRE INVALID"})}

    // modifier la chambre
    models.Chambre.update({
        title:req.body.title,
        description:req.body.description,
        parking:req.body.parking,
        wifi:req.body.wifi,
        fumeur:req.body.fumeur,
        salleSport:req.body.salleSport,
        restaurant:req.body.restaurant,
        reception:req.body.reception,
        accessHandicap:req.body.accessHandicap,
        terrasse:req.body.terrasse,
        bar:req.body.bar,
        petitDej:req.body.petitDej
    }, {where:{id:uuidChambre}})
    .then(()=>{return res.status(200).json({"OK":"CHAMBRE MODIFIÉ"})})
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})


})

//////////////////////////////////////////////
// supprimer une chambre
//////////////////////////////////////////////
route.delete("/delete/:id", tokenVerif , (req,res)=>{

    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)
    
    // seul un administrateur pourra supprimer une chambre
    if(tokenDecoded.role!='ADMIN')
    {return res.status(403).json({"error":"TU DOIS ETRE UN ADMIN POUR SUPPRIMER UNE CHAMBRE"})}

    // vérifier l'uuid de le la chambre
    if(req.params.id==null || req.params.id==undefined)
    {return res.status(403).json({"error":"UUID CHAMBRE EST INDEFINI"})}

    const uuidChambre = req.params.id
    if(!validator.isUUID(uuidChambre, 4))
    {return res.status(403).json({"error":"UUID CHAMBRE INVALID"})}

    // supprimer la chambre
    models.Chambre.destroy({where:{id:uuidChambre}})
    .then(()=>{return res.status(200).json({"OK":"CHAMBRE SUPPRIMÉ"})})
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

})

//////////////////////////////////////////////
// afficher une chambre
//////////////////////////////////////////////
route.get("/view/:id", (req,res)=>{

    // vérifier l'uuid de le la chambre
    if(req.params.id==null || req.params.id==undefined)
    {return res.status(403).json({"error":"UUID CHAMBRE EST INDEFINI"})}

    const uuidChambre = req.params.id
    if(!validator.isUUID(uuidChambre, 4))
    {return res.status(403).json({"error":"UUID CHAMBRE INVALID"})}

    // afficher la chambre
    models.Chambre.findOne({attributes:[
        'id','title','description','parking','wifi','fumeur','salleSport',
        'restaurant','reception','accessHandicap','terrasse','bar','petitDej','images'
    ], where:{id:uuidChambre}})
    .then((data)=>{return res.status(200).json(data)})
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

})


//////////////////////////////////////////////
// Afficher toutes les chambres
//////////////////////////////////////////////
route.get("/view", (req,res)=>{

    // afficher toutes les chambres
    models.Chambre.findAll({attributes:[
        'id','title','description','parking','wifi','fumeur','salleSport',
        'restaurant','reception','accessHandicap','terrasse','bar','petitDej','images'
    ]})
    .then((data)=>{return res.status(200).json(data)})
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

})


module.exports = route