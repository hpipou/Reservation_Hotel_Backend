const multer = require('multer')

const errCaptureFromMulter=(err, req, res, next)=>{

    if(err instanceof multer.MulterError)
    {return res.status(403).json({"error": "Le fichier ne doit pas dépasser 1 Mo"})}
    else{
        return res.status(403).json({"error":"Fichiers accepté : JPG / JPEG / PNG"})
    }
    
}

module.exports=errCaptureFromMulter