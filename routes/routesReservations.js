const express   = require("express")
const route     = express.Router()
const validator = require("validator")
const models    = require("../models")
const jwt       = require("jsonwebtoken")
const uuid      = require("uuid")
const tokenVerif= require("../middleware/tokenVerification")
const inputReservationVerif = require("../middleware/inputReservationVerif")
const { Op } = require('sequelize');
require("dotenv").config()

//////////////////////////////////////////////
// verifier si la date est valable
//////////////////////////////////////////////
route.get("/check", inputReservationVerif, (req,res)=>{

    // déclarer les inputs
    const dateDebut=req.query.datedebut
    const dateFin=req.query.datefin
    const idChambre = req.query.idChambre;

    // On va utiliser l'opérateur Op de sequelize qui est beaucoup plus optimisé
    // dateDebut: { [Op.lte]: dateFin } : Vérifie si la date de début de la réservation 
    //                  est inférieure ou égale à la date de fin spécifiée dans la requête.
    // dateFin: { [Op.gte]: dateDebut } : Vérifie si la date de fin de la réservation est 
    //                  supérieure ou égale à la date de début spécifiée dans la requête.

    models.Reservation.findAll({
                                    attributes:['id', 'dateDebut','dateFin'] , 
                                    where: {
                                    chambreid: idChambre,
                                    dateDebut: { [Op.lte]: dateFin },
                                    dateFin: { [Op.gte]: dateDebut },
                                    },
                                })
    .then((reservations) => {
            
            if (reservations.length > 0) {
                // La chambre est indisponible pour les dates spécifiées
                return res.status(200).json({ disponible: false });
            } else {
                // La chambre est disponible pour les dates spécifiées
                return res.status(200).json({ disponible: true });
            }

        })
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})
    
})

//////////////////////////////////////////////
// réserver une chambre
//////////////////////////////////////////////
route.post("/add", tokenVerif, inputReservationVerif, (req,res)=>{

    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)

    // déclarer les inputs
    const dateDebut=req.query.datedebut
    const dateFin=req.query.datefin
    const idChambre = req.query.idChambre;

    // vérifier la disponibilité de la chambre
    models.Reservation.findAll({
                                    attributes:['id', 'dateDebut','dateFin'] , 
                                    where: {
                                    chambreid: idChambre,
                                    dateDebut: { [Op.lte]: dateFin },
                                    dateFin: { [Op.gte]: dateDebut },
                                    },
                                })
    .then((reservations) => {
            
            if (reservations.length > 0) {
                // La chambre est indisponible pour les dates spécifiées
                return res.status(200).json({ "error" :"LA CHAMBRE N'EST PLUS DISPONIBLE" });
            } else {
                // La chambre est disponible pour les dates spécifiées
                reservationChambre()
            }

        })
    .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})

    // fonction pour réserver
    function reservationChambre(){
        const uuidReservation = uuid.v4()
        models.Reservation.create({

            id:uuidReservation,
            chambreid:idChambre,
            userid:tokenDecoded.id,
            dateDebut:dateDebut,
            dateFin:dateFin

                })
        .then(()=> {return res.status(200).json({ "OK" : "RÉSERVATION AVEC SUCCES" });})
        .catch(()=>{return res.status(500).json({"error" : "ERREUR DANS LES BDD"})})
    }


})

//////////////////////////////////////////////
// modifier une réservation
//////////////////////////////////////////////
route.patch("/edit", tokenVerif , inputReservationVerif, (req,res)=>{
    
    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)

    // verifier l'id de la réservation
    if(req.query.idReservation==null || req.query.idReservation==undefined)
    {return res.status(403).json({"error":"IUID DE LA RESERVATION EST INDEFINI"})}

    // Vérification des inputs avec validator
    const idReservation = req.query.idReservation
    if(!validator.isUUID(idReservation))
    {return res.status(403).json({"error":"UUID DE LA RESERVATION EST INCORRECT"})}

    // déclarer les inputs
    const dateDebut=req.query.datedebut
    const dateFin=req.query.datefin
    const idChambre = req.query.idChambre;

    // vérifier si c'est le propriétaire de la réservation
    models.Reservation.findOne({attributes:['userid'], where:{id:idReservation}})
    .then((data)=>{
        if(data){
            if(data.userid==tokenDecoded.id){
                // si c'est le propriétaire de la réservation
                verifierLaDisponibilite()
            }else{
                // si ce n'est le propriétaire de la réservation
                return res.status(200).json({ "error" :"CETTE RESERVATION NE VOUS APPARTIENT PAS" });
            }

        }else{
            // la réservatio n'existe pas
            return res.status(200).json({ "error" :"LA RESERVATION EST INTROUVABLE" });
        }
    })

    // vérifier la disponibilité de la chambre
    function verifierLaDisponibilite(){
        models.Reservation.findAll({
            attributes:['id', 'dateDebut','dateFin'] , 
            where: {
            chambreid: idChambre,
            dateDebut: { [Op.lte]: dateFin },
            dateFin: { [Op.gte]: dateDebut },
            },
        })
        .then((reservations) => {

            if (reservations.length > 0) {
            // La chambre est indisponible pour les dates spécifiées
            return res.status(200).json({ "error" :"LA CHAMBRE N'EST PLUS DISPONIBLE A CETTE NOUVELLE DATE" });
            } else {
            // La chambre est disponible pour les dates spécifiées
            changerLaDate()
            }

        })
        .catch(()=>{return res.status(500).json({"error":"ERREUR DANS LES BDD"})})
    }

    // fonction pour réserver
    function changerLaDate(){
        models.Reservation.update({ dateDebut:dateDebut , dateFin:dateFin}, {where:{id:idReservation}})
        .then(()=> {return res.status(200).json({ "OK" : "RÉSERVATION MODIFIÉ AVEC SUCCES" });})
        .catch(()=>{return res.status(500).json({"error" : "ERREUR DANS LES BDD"})})
    }

})

//////////////////////////////////////////////
// supprimer une réservation
//////////////////////////////////////////////
route.delete("/delete", tokenVerif , (req,res)=>{
    
    // extraire l'id du token
    const token = req.headers.authorization.split(" ")[1]
    const tokenDecoded = jwt.decode(token)

    // verifier l'id de la réservation
    if(req.query.idReservation==null || req.query.idReservation==undefined)
    {return res.status(403).json({"error":"IUID DE LA RESERVATION EST INDEFINI"})}

    // Vérification des inputs avec validator
    const idReservation = req.query.idReservation
    if(!validator.isUUID(idReservation))
    {return res.status(403).json({"error":"UUID DE LA RESERVATION EST INCORRECT"})}

    // vérifier si c'est le propriétaire de la réservation
    models.Reservation.findOne({attributes:['userid'], where:{id:idReservation}})
    .then((data)=>{
        if(data){
            if(data.userid==tokenDecoded.id){
                // si c'est le propriétaire de la réservation
                supprimerReservation()
            }else{
                // si ce n'est le propriétaire de la réservation
                return res.status(200).json({ "error" :"CETTE RESERVATION NE VOUS APPARTIENT PAS" });
            }

        }else{
            // la réservatio n'existe pas
            return res.status(200).json({ "error" :"LA RESERVATION EST INTROUVABLE" });
        }
    })

    // fonction pour supprimer la réservation
    function supprimerReservation(){
        models.Reservation.destroy({where:{id:idReservation}})
        .then(()=> {return res.status(200).json({ "OK" : "RÉSERVATION SUPPRIMÉ AVEC SUCCES" });})
        .catch(()=>{return res.status(500).json({"error" : "ERREUR DANS LES BDD"})})
    }

})

//////////////////////////////////////////////
// afficher les réservations d'une chambre
//////////////////////////////////////////////
route.get("/chambre/:id", (req,res)=>{
    
    // verifier l'id de la chambre
    if(req.params.id==null || req.params.id==undefined)
    {return res.status(403).json({"error":"IUID DE LA CHAMBRE EST INDEFINI"})}

    // Vérification des inputs avec validator
    const idChambre = req.params.id
    if(!validator.isUUID(idChambre))
    {return res.status(403).json({"error":"UUID DE LA CHAMBRE EST INCORRECT"})}

    models.Reservation.findAll({attributes:['id', 'userid','chambreid','dateDebut','dateFin'], where:{chambreid:idChambre}})
    .then((data)=>{return res.status(200).json(data)})
    .catch(()=>{return res.status(500).json({"error" : "ERREUR DANS LES BDD"})})
})

//////////////////////////////////////////////
// afficher TOUTES les réservations
//////////////////////////////////////////////
route.get("/chambre", (req,res)=>{
    
    models.Reservation.findAll({attributes:['id', 'userid','chambreid','dateDebut','dateFin']})
    .then((data)=>{return res.status(200).json(data)})
    .catch(()=>{return res.status(500).json({"error" : "ERREUR DANS LES BDD"})})

})


module.exports = route