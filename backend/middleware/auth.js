const jwt = require ('jsonwebtoken');
const User = require("../models/User");
require('dotenv').config();

// CONTROLER QUE LA PERSONNE EST CONNECTEE ET BIEN IDENTIFIEE

//1. recuperer le token (dans le cookie de la reponse/header Authorization)
//2.dechiffrer le token, puis en recuperer l'userId
//3. Verifier que l'userId de la requete existe
//4. comparer l'userId de la requete avec l'userId  du token :


//pour tester si l'utilisateur est bien connecté à tout moment:
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.RANDOM_TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          res.status(500).json("utilisateur non connecté")
          // res.cookie("jwt", "", { maxAge: 1 });//pour supprimer le token s'il est faux
          next();
        } else {
            //si la clé permet de dechiffrer le token, on retrouve le user correspondant:
            let user = await User.findById(decodedToken.id);
            res.locals.user = user;           
            next();
          }
            });
          } else {
            res.locals.user = null;
            next();
          }
        };

// module.exports.checkUser = (req, res, next) =>{
//     try{
//         // const token = req.headers.authorization.split(' ')[1];
//         const token = res.cookiers.jwt;
//         const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
//         const userId =decodedToken.userId;
//         if (req.body.userId && req.body.userId !== userId){
//             throw 'User ID non valable';
//         }else{            
//             next();
//         }

//     }catch(error){
//         res.status(401).json({
//             message :"Echec authentification",
//             error: error });
//         }}


// POUR LA PREMIERE AUTHENTIFICATION DE L UTILISATEUR en front : 
// controler que le token correspond à qqun deja présent dans la BDD
module.exports.requireAuth = (req, res, next) =>{
const token = req.cookies.jwt;
if(token){
    jwt.verify(token, process.env.RANDOM_TOKEN_SECRET, async (err, decodedToken)=>{
        if(err){
            console.log(err);
            res.send(200).json('No token')
        }else{
            console.log(decodedToken.id);
            // res.status(200).send(res.locals.user._id)
            next();
        }
    })
}else{
    console.log ('No token')
}};
