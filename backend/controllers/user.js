//--------------------IMPORTATIONS-------------------------------------

//bcrypt pour hacher le mot de passe
const bcrypt = require('bcrypt');
//crypto js pour chiffrer l'email
const cryptojs = require('crypto-js');

const User = require('../models/User');

const jwt = require('jsonwebtoken');
require('dotenv').config();

//---------------ROUTE SIGNUP : INSCRIPTION UTILISATEUR --------------------------

exports.signup = (req, res, next) => {
  console.log("afficher la req.body :"+ req.body)
  //chiffre l'email avant de le sauvegarder sur la BDD
  const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_KEY_EMAIL).toString();
  //hacher le mdp (salage:10fois) avant de le sauvegarder sur la BDD
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      //ce qui sera enregistré dans la BDD:
      const user = new User({
        email: emailCryptoJs,
        password: hash
      });
      console.log("afficher user :"+user);
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
        .catch(error => { console.log(error); res.status(400).json({ error }) });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error })
    });
};


//---------------ROUTE LOGIN : IDENTIFICATION UTILISATEUR --------------------------

const createToken= (id)=>{
  return jwt.sign(
        { id },
        process.env.RANDOM_TOKEN_SECRET,
         { expiresIn: '72h' }
)}
//  const maxAge =50*24*60*60*1000;

exports.login = (req, res, next) => {  
  //chiffrer l'email de la requete:
  const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, process.env.CRYPTOJS_KEY_EMAIL).toString();
  //chercher dans la BDD si l'utilisateur est déjà présent:
  User.findOne({ email: emailCryptoJs })
    .then(user => {
      // si l'utilisateur n'est pas present dans la BDD
      if (!user) {
        return res.status(401).json({
           message: 'Utilisateur non trouvé !',
           error:error  });      
      }
      //bcrypt compare le mdp de la requete et mdp de la BDD:
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: 'Mot de passe incorrect !' });
          }

     
         //creer le token et l'enregistrer dans un cookie hhtp only

          const token = createToken(user._id);
          res.cookie('jwt', token, { httpOnly: true, maxAge:50*24*60*60*1000});
          res.status(200).json({ user: user._id})
        })
   //s'ils correspondent : réponse 200 contenant l'id utilisateur et un token:
          //la fonction sign() de jwt va chiffrer le nouveau token   
          // res.status(200).json({
          //   userId: user._id,
          //   token: jwt.sign(
          //     { userId: user._id },
          //     process.env.RANDOM_TOKEN_SECRET,
          //      { expiresIn: '48h' }
            
                  
         
        .catch(error => { console.log(error); res.status(500).json({ error }) });
        // .catch(error => res.status(500).json({ error }));
    })
    // .catch(error => res.status(500).json({ error }));
    .catch(error => { console.log(error); res.status(501).json({ error }) });
};


exports.logout= (req, res, next) => {
res.cookie('jwt','',{maxAge:1});
res.redirect('/');
}
// --------------------------CRUD USER----------------------------------------

exports.getAllUsers = (req, res, next) => {
  User.find()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json({ error }));
      
};


exports.getOneUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
      .then(user => res.status(200).json(user))
      .catch(error => res.status(404).json({ error }));
    };
      

 exports.removeUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Utilisateur supprimée !' }))
        .catch(error => res.status(400).json({ error }));
    };   
    
    
  exports.modifyUser = (req, res, next) => {
      const userObject = req.file ?
          {
              ...JSON.parse(req.body.user),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          } : { ...req.body };
      User.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
          .catch(error => res.status(400).json({ error }));
  };