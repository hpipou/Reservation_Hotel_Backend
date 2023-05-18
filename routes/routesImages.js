const express   = require("express")
const route     = express.Router()
const validator = require("validator")
const models    = require("../models")
const jwt       = require("jsonwebtoken")
const tokenVerif= require("../middleware/tokenVerification")
const multer    = require("../middleware/multer")
const multerErr = require("../middleware/multerErrorCapture")
const fs = require('fs');
require("dotenv").config()

//////////////////////////////////////////////
// ajouter les images a une chambre
//////////////////////////////////////////////
route.post("/add/:id", tokenVerif , multer.single('file'), multerErr, (req,res)=>{

    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)
    
    // seul un administrateur pourra ajouter les images de chambre
    if(tokenDecoded.role!='ADMIN')
    {return res.status(403).json({"error":"TU DOIS ETRE UN ADMIN POUR AJOUTER UNE IMAGE"})}

    // vérifier l'uuid de le la chambre
    if(req.params.id==null || req.params.id==undefined)
    {return res.status(403).json({"error":"UUID CHAMBRE EST INDEFINI"})}

    const uuidChambre = req.params.id
    if(!validator.isUUID(uuidChambre, 4))
    {return res.status(403).json({"error":"UUID CHAMBRE INVALID"})}

    // vérifier si la chambre existe
    models.Chambre.findOne({attributes:['images','userid'], where:{id:uuidChambre}})
    .then((data)=>{
        if(data){
            // convertir la liste d'image de String à JSON
            const listeImage=JSON.parse(data.images)
            listeImage.push(req.myFileName)
            ajouterImageEnBDD(listeImage)

        }else{
            return res.status(403).json({"error":"CHAMBRE INTROUVABLE"})
        }
        
    })
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

    // ajouter le nom de l'image à la base de données
    function ajouterImageEnBDD(imageListe){
        models.Chambre.update({images:imageListe}, {where:{id:uuidChambre}})
        .then(()=>{return res.status(201).json(imageListe)})
        .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})
    }

})


//////////////////////////////////////////////
// supprimer une image
//////////////////////////////////////////////
route.delete("/delete", tokenVerif , (req,res)=>{

    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)
    
    // seul un administrateur pourra ajouter les images de chambre
    if(tokenDecoded.role!='ADMIN')
    {return res.status(403).json({"error":"TU DOIS ETRE UN ADMIN POUR SUPPRIMER UNE IMAGE"})}

    // vérifier l'uuid de le la chambre
    if(req.query.idChambre==null || req.query.idChambre==undefined)
    {return res.status(403).json({"error":"UUID CHAMBRE EST INDEFINI"})}

    const uuidChambre = req.query.idChambre
    if(!validator.isUUID(uuidChambre, 4))
    {return res.status(403).json({"error":"UUID CHAMBRE INVALID"})}

    // vérifier le nom de l'image
    if(req.query.myFileName==null || req.query.myFileName==undefined)
    {return res.status(403).json({"error":"LE NOM DE L'IMAGE EST INDEFINI"})}

    const myFileName = req.query.myFileName
    if(!validator.isLength(myFileName, {min:15, max:20})) 
    {return res.status(403).json({"error":"LE NOM DE L'IMAGE EST INVALID"})}

    // vérifier si la chambre existe
    models.Chambre.findOne({attributes:['images','userid'], where:{id:uuidChambre}})
    .then((data)=>{
        if(data){
            // convertir la liste d'image de String à JSON
            const listeImage=JSON.parse(data.images)

            // supprimer le nom de l'image de la liste
            const elementASupprimer = myFileName;
            const nouvelleListeImage = listeImage.filter(
                                            (element) => element !== elementASupprimer);

            // supprimer l'image du dossier "image"
            const cheminFichier = './images/' + myFileName ;
            try{
                fs.unlinkSync(cheminFichier)
            }catch(error){
                console.log(error)
            }

            modifierImageEnBDD(nouvelleListeImage)

        }else{
            return res.status(403).json({"error":"CHAMBRE INTROUVABLE"})
        }
    })
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

    // modifier la liste des images dans la base de données
    function modifierImageEnBDD(imageListe){
        models.Chambre.update({images:imageListe}, {where:{id:uuidChambre}})
        .then(()=>{return res.status(200).json(imageListe)})
        .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})
    }

})

//////////////////////////////////////////////
// afficher les images d'une chambre
//////////////////////////////////////////////
route.get("/view", tokenVerif , (req,res)=>{

    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)
    
    // seul un administrateur pourra ajouter les images de chambre
    if(tokenDecoded.role!='ADMIN')
    {return res.status(403).json({"error":"TU DOIS ETRE UN ADMIN POUR AJOUTER UNE CHAMBRE"})}

    // vérifier l'uuid de le la chambre
    if(req.query.idChambre==null || req.query.idChambre==undefined)
    {return res.status(403).json({"error":"UUID CHAMBRE EST INDEFINI"})}

    const uuidChambre = req.query.idChambre
    if(!validator.isUUID(uuidChambre, 4))
    {return res.status(403).json({"error":"UUID CHAMBRE INVALID"})}

    // vérifier si la chambre existe
    models.Chambre.findOne({attributes:['images','userid'], where:{id:uuidChambre}})
    .then((data)=>{
        if(data){
            // convertir la liste d'image de String à JSON
            const listeImage=JSON.parse(data.images)
            return res.status(200).json(listeImage)
        }else{
            return res.status(403).json({"error":"CHAMBRE INTROUVABLE"})
        } 
    })
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

})

module.exports = route