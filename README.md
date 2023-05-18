# RÉSERVATION D'HOTEL NODE.JS

## IMPORTANT ! LA SÉCURITÉ 
- [x]  Mots de passe crypté avec bcrypt, niveau couche 5
- [x]  Token avec un Security level 4096 bit, Level 5
- [x]  Sécurisation des entêtes de réponses avec helmet
- [x]  Limitation du nombre de requetes pour chaque IP à 100 pour 10minutes
- [x]  Loguer toutes les requetes dans un fichier text "logs.txt"

## Fonctionnalités réalisées :
- [x]  Créer un compte (deux types : ADMIN / USER )
- [x]  Se connecter
- [x]  Changer le mot de passe
- [x]  Bloquer un compte (Uniquement l'ADMIN qui peut bloquer un utilisateur)
- [x]  Supprimer un compte
- [x]  Ajouter une chambre (uniquement par l'ADMIN)
- [x]  Ajouter des images à la chambre (uniquement par l'ADMIN)
- [x]  Supprimer des images de la chambre (uniquement par l'ADMIN)
- [x]  Réserver une chambre (Date début, date fin)
- [x]  Modifier une réservation
- [x]  Supprimer une réservation
- [x]  Afficher une chambre
- [x]  Afficher toutes les chambres
- [x]  Afficher les réservations d'une chambre
- [x]  Afficher les réservations de toutes les chambres


## SCHÉMA MYSQL BDD

<div align="center">
  <img src="https://github.com/hpipou/reservation_hotel_backend/blob/main/SCREENSHOT_MYSQL_BDD.png"/><br>
</div>

## INSTALLATION ET LANCEMENT DE L'APPLICATION

Vous devez créer une base de donnée nommé : `hotelparis` <br>
Ensuite migrez les models avec la commande : `sequelize db:migrate` <br>
Importer les packages npm (node_modules) : `npm install` <br>
Lancer l'application : `node index.js` <br>

## @LAMINE 😉
