const jwt = require("jsonwebtoken")
require("dotenv").config()

const tokenVerification = (req,res,next)=>{
    if(req.headers.authorization==null || req.headers.authorization==undefined)
    {return res.status(403).json({"error":"TOKEN INDEFINI"})}

    const token = req.headers.authorization.split(" ")[1]
     try{
        const resultat = jwt.verify(token, process.env.SECTOKEN)
        if(resultat){
            next()
        }else{
            return res.status(403).json({"error":"TOKEN INVALID"})
        }
     }catch{
        return res.status(403).json({"error":"TOKEN INVALID"})
     }
}

module.exports = tokenVerification