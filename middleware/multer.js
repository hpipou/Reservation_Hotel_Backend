const multer = require ('multer')
const path= require('path')
require("dotenv").config()

const fileStorage= multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null, process.env.FOLDERNAME)
    },
    filename:(req,file,callback)=>{
        const extension= file.mimetype.split('/')[1]
        const fileNameFinale= Date.now() + '.' + extension
        // transmettre le nom du fichier au middleware suivant :
        req.myFileName = fileNameFinale
        callback(null,fileNameFinale)
    }
})

const upload=multer({storage:fileStorage, 
                     limits:{fileSize:process.env.MAXSIZE},
                     fileFilter:(req,file,callback)=>{
                        if(
                            path.extname(file.originalname)=='.png' || 
                            path.extname(file.originalname)=='.jpg' || 
                            path.extname(file.originalname)=='.jpeg'
                            
                           ){callback(null, true)}
                        else{callback(new Error("Fichier non supproté"))}
                     }})

module.exports=upload