const express = require('express');

const mongoose = require ('mongoose');

const publicationRoutes = require ('./routes/publication');
const userRoutes = require ('./routes/user');

const app = express(); 

const path = require('path') ;

const helmet = require('helmet');

//Variables d'environnement, pour protéger la connexion à la BDD
const dotenv = require('dotenv');
const result = dotenv.config();


// mongodb+srv://cami2610:<password>@cluster0.hs6lk.mongodb.net/?retryWrites=true&w=majority

//Connexion à la base de données
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  // .catch(error =>{console.log(error)}); 
  .catch(() => console.log('Connexion à MongoDB échouée !'));



//Eviter les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


//Pour pouvoir utiliser le body de la requete:
app.use(express.json());


//Protection en configurant les en-tetes HHTP renvoyés par Express
app.use(helmet());

// Pour acceder aux images
app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes utilisateur , publications et authentification
 app.use ('/api/publications', publicationRoutes);
 app.use('/api/auth', userRoutes);
 



module.exports = app;