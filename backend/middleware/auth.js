const jwt = require ('jsonwebtoken');
require('dotenv').config();

//1. recuperer le token (dans le header Authorization)
//2.dechiffrer le token, puis en recuperer l'userId
//3. Verifier que l'userId de la requete existe
//4. comparer l'userId de la requete avec l'userId  du token :

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        const userId =decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable';
        }else{
            next();
        }

    }catch(error){
        res.status(401).json({
            message :"Echec authentification",
            error: error });
        }
    
}