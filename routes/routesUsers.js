const express   = require("express")
const route     = express.Router()
const validator = require("validator")
const models    = require("../models")
const bcrypt    = require("bcrypt")
const jwt       = require("jsonwebtoken")
const uuid      = require("uuid")
const tokenVerif= require("../middleware/tokenVerification")
require("dotenv").config()

//////////////////////////////////////////////
// créer un compte
//////////////////////////////////////////////
route.post("/register", (req,res)=>{

    // Vérification des input
    if(req.body.email==null || req.body.email==undefined)
    {return res.status(403).json({"error":"EMAIL INDEFINI"})}

    if(req.body.password==null || req.body.password==undefined)
    {return res.status(403).json({"error":"MOT DE PASSE INDEFINI"})}

    if(req.body.fname==null || req.body.fname==undefined)
    {return res.status(403).json({"error":"NOM DE FAMILLE INDEFINI"})}

    if(req.body.lname==null || req.body.lname==undefined)
    {return res.status(403).json({"error":"PRENOM INDEFINI"})}

    const email = req.body.email
    const password = req.body.password
    const fname = req.body.fname
    const lname = req.body.lname

    if(!validator.isEmail(email))
    {return res.status(403).json({"error":"EMAIL INVALID"})}

    if(!validator.isLength(password,{min:5, max:20}))
    {return res.status(403).json({"error":"LE MOT DE PASSE DOIT CONTENIR ENTRE 5 ET 20 CARACTERES"})}

    if(!validator.isAlpha(fname))
    {return res.status(403).json({"error":"VOTRE NOM DE FAMILLE DOIT CONTENIR a-z A-Z"})}

    if(!validator.isAlpha(lname))
    {return res.status(403).json({"error":"VOTRE PRENOM DOIT CONTENIR a-z A-Z"})}

    // vérifier si l'email est déjà utilisé
    models.User.findOne({attributes:['id'], where:{email:email}})
    .then((data)=>{
            if(data){
                return res.status(500).json({"error":"ADRESSE EMAIL EXIST DEJA"})
            }else{
                creerCompte()
            }
    })
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

    // vérifier si l'email est déjà utilisé
    function creerCompte(){

        const uuidID = uuid.v4()
        models.User.create({
            id:uuidID,
            email:email,
            password:bcrypt.hashSync(password, 5),
            role:process.env.ROLE,
            fname:fname,
            lname:lname,
            accountStatus:true
        })
        .then(()=>{
            const token = jwt.sign(
                        {"id": uuidID, 
                        "role":process.env.ROLE, 
                        "accountStatus" : true},
                        process.env.SECTOKEN,
                        {expiresIn: '48h'}
                )
            return res.status(201).json({
                        "token":token,
                        "id": uuidID,
                        "role":process.env.ROLE,
                        "accountStatus" : true
                    })
        })
        .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})
    }


})

//////////////////////////////////////////////
// se connecter
//////////////////////////////////////////////
route.post("/login", (req,res)=>{

    // Vérification des input
    if(req.body.email==null || req.body.email==undefined)
    {return res.status(403).json({"error":"EMAIL INDEFINI"})}

    if(req.body.password==null || req.body.password==undefined)
    {return res.status(403).json({"error":"MOT DE PASSE INDEFINI"})}

    const email = req.body.email
    const password = req.body.password

    if(!validator.isEmail(email))
    {return res.status(403).json({"error":"EMAIL INVALID"})}

    if(!validator.isLength(password,{min:5, max:20}))
    {return res.status(403).json({"error":"LE MOT DE PASSE DOIT CONTENIR ENTRE 5 ET 20 CARACTERES"})}

    // vérifier si l'email est déjà utilisé
    models.User.findOne({attributes:['id','role','accountStatus','password'], where:{email:email}})
    .then((data)=>{
            if(data){
                
                const resultat = bcrypt.compareSync(password, data.password)
                if(resultat){
                    const token = jwt.sign({ 
                                "id": data.id,
                                "role":data.role, 
                                "accountStatus" : data.accountStatus},
                                process.env.SECTOKEN,
                                {expiresIn: '48h'}
                        )
                    return res.status(201).json({
                                "token":token,
                                "id": data.id,
                                "role":data.role,
                                "accountStatus" : data.accountStatus
                            })
                }else{
                    return res.status(500).json({"error":"MOT DE PASSE INCORRECT"})
                }
                
            }else{
                return res.status(500).json({"error":"ADRESSE EMAIL INTROUVABLE"})
            }
    })
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})


})

//////////////////////////////////////////////
// changer le mot de passe
//////////////////////////////////////////////
route.post("/password", tokenVerif , (req,res)=>{
    
    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)
 
    // Vérification des input
    if(req.body.newpassword==null || req.body.newpassword==undefined)
    {return res.status(403).json({"error":"NOUVEAU MOT DE PASSE INDEFINI"})}

    if(req.body.password==null || req.body.password==undefined)
    {return res.status(403).json({"error":"MOT DE PASSE INDEFINI"})}

    const newpassword = req.body.newpassword
    const password = req.body.password

    if(!validator.isLength(password,{min:5, max:20}))
    {return res.status(403).json({"error":"LE MOT DE PASSE DOIT CONTENIR ENTRE 5 ET 20 CARACTERES"})}

    if(!validator.isLength(newpassword,{min:5, max:20}))
    {return res.status(403).json({"error":"LE NOUVEAU MOT DE PASSE DOIT CONTENIR ENTRE 5 ET 20 CARACTERES"})}

    // vérifier si le compte existe
    models.User.findOne({attributes:['id','password'], where:{id:tokenDecoded.id}})
    .then((data)=>{
            if(data){
                // vérifier si le mot de passe est correct
                const resultat = bcrypt.compareSync(password, data.password)
                if(resultat){
                    changerMDP()
                }else{
                    return res.status(500).json({"error":"MOT DE PASSE INCORRECT"})
                }
                
            }else{
                return res.status(500).json({"error":"ADRESSE EMAIL INTROUVABLE"})
            }
    })
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

    // changer le mot de passe
    function changerMDP(){

        models.User.update(
                            {password:bcrypt.hashSync(newpassword, 5)},
                            {where:{id:tokenDecoded.id}}
                           )
        .then(()=>{ return res.status(200).json({"OK":"MOT DE PASSE CHANGÉ"})})
        .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})
    }

})

//////////////////////////////////////////////
// bloquer un compte
//////////////////////////////////////////////
route.post("/block", tokenVerif , (req,res)=>{
    
    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)
    
    // seul un administrateur pourra bloquer un compte
    if(tokenDecoded.role!='ADMIN')
    {return res.status(403).json({"error":"TU DOIS ETRE UN ADMIN POUR BLOQUER UN COMPTE"})}
 
    // Vérification des input
    if(req.body.idUser==null || req.body.idUser==undefined)
    {return res.status(403).json({"error":"IDUSER INDEFINI"})}
    
    const idUser = req.body.idUser

    if(!validator.isUUID(idUser, 4))
    {return res.status(403).json({"error":"L'ID N'EST PAS VALID"})}
    

    // vérifier si le compte existe
    models.User.findOne({attributes:['id','accountStatus'], where:{id:idUser}})
    .then((data)=>{
            
        // vérifier si le compte existe déjà
        if(data){

            if(data.accountStatus){
                // si le compte est actif, alors on le block
                bloqueMoi(false)
            }else{
                // si le compte est blocké, alors on l'active
                bloqueMoi(true)
            }
            
        }else{
            return res.status(500).json({"error":"COMPTE INTROUVABLE"})
        }
    })
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

    // bloquer et débloquer
    function bloqueMoi(boolean){

        models.User.update(
                            {accountStatus:boolean},
                            {where:{id:idUser}}
                           )
        .then(()=>{ 
            if(boolean){
                return res.status(200).json({"OK":"COMPTE ACTIVÉ AVEC SUCCES"})
            }else{
                return res.status(200).json({"OK":"COMPTE BLOQUÉ AVEC SUCCES"})
            }
           })
        .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})
    }

})

//////////////////////////////////////////////
// supprimer un compte
//////////////////////////////////////////////
route.post("/delete", tokenVerif , (req,res)=>{
    
    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)
 
    // Vérification des input
    if(req.body.password==null || req.body.password==undefined)
    {return res.status(403).json({"error":"MOT DE PASSE INDEFINI"})}

    const password = req.body.password

    if(!validator.isLength(password,{min:5, max:20}))
    {return res.status(403).json({"error":"LE MOT DE PASSE DOIT CONTENIR ENTRE 5 ET 20 CARACTERES"})}

    // vérifier si le compte existe
    models.User.findOne({attributes:['id','password'], where:{id:tokenDecoded.id}})
    .then((data)=>{
            if(data){

                // vérifier si le mot de passe est correct
                const resultat = bcrypt.compareSync(password, data.password)
                if(resultat){
                    supprimerCompte()
                }else{
                    return res.status(500).json({"error":"MOT DE PASSE INCORRECT"})
                }
                
            }else{
                return res.status(500).json({"error":"COMPTE INTROUVABLE"})
            }
    })
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

    // supprimer le compte
    function supprimerCompte(){

        models.User.destroy({where:{id:tokenDecoded.id}})
        .then(()=>{return res.status(200).json({"OK":"COMPTE SUPPRIMÉ"})})
        .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

    }

})


module.exports = route