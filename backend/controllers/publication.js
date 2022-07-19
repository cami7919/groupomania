// -------------importations---------------------------
const req = require('express/lib/request');
const Publication = require('../models/Publication');
const fs = require('fs');
const ObjectID = require("mongoose").Types.ObjectId;

// -------------fonctions du CRUD -----------------------------------
exports.createPublication = (req, res, next) => {     
    //   const publicationObject = JSON.parse(req.body.publication);      
      const publicationObject = req.body.publication;
    // jj console.log("publicationObjet :" + publicationObject);
    // delete publicationObject._id;
    // delete publicationObject._userId;
    const publication = new Publication({
        ...publicationObject
        // userId:req.auth.userId,
        //  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     });

    // console.log("contenu de new Publication :" + publication);
    publication.save()
        .then(() => res.status(201).json({ message: 'Publication enregistrée !' }))
        .catch(error => { console.log(error); res.status(400).json({ error }) });
};



// exports.createPublication = (req, res, next) => {
//     console.log("req.body.publication :" + req.body.publication);
//     // const publicationObject = JSON.parse(req.body.publication);
//     const publicationObject = req.body.publication;
//     delete publicationObject._id;
//     const publication = new Publication({
//         ...publicationObject,
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     });
//     publication.save()
//         .then(() => res.status(201).json({ message: 'Publication enregistrée !' }))
//         .catch(error => { console.log(error); res.status(400).json({ error }) });
// };


//ajouter le unlink pour supprimer la photo si modifiée : où placer le unlink ?
exports.modifyPublication = (req, res, next) => {
    const publicationObject = req.file ?  //c'est un ternaire : si la req comporte un file,
        {
            ...JSON.parse(req.body.publication),  //alors  : fais la 1ere action decrite ici ; 
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };                     // sinon fais la 2eme decrite ici (à gauche)
    Publication.updateOne({ _id: req.params.id }, { ...publicationObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Publication modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};


// exports.removePublication = (req, res, next) => {
//     Publication.deleteOne({ _id: req.params.id })
//         .then(() => res.status(200).json({ message: 'Publication supprimée !' }))
//         .catch(error => res.status(400).json({ error }));
// };


exports.removePublication = (req, res, next) => { 
// On récupère la publication dans la BDD - grâce à l'id de l'objet, passé dans l'url:   
    Publication.findOne({ _id: req.params.id })
          .then(publication => {
            const filename = publication.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
            Publication.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Publication supprimée !'}))
                .catch(error => res.status(400).json({ error }));
            });
          })
          .catch(error => { console.log(error); res.status(500).json({ error }) });
        //   .catch(error => res.status(500).json({ error }));
      };



exports.getOnePublication = (req, res, next) => {
    Publication.findOne({ _id: req.params.id })
        .then(publication => res.status(200).json(publication))
        .catch(error => res.status(404).json({ error }));
};

//où placer la fonction de tri , du plus récent au moins recent:  (.sort({createdAt:-1}))
// exports.getAllPublications = (req, res, next) => {
//     Publication.find(docs, error)
//         .then(publications => res.status(200).send(docs))
//         .catch(error => res.status(400).json({ error }));    
// };

exports.getAllPublications = (req, res) => {
    Publication.find((err, docs)=>{
        if(!err)res.send(docs);
        else console.log ('Error to get data :'+err);
    }) .sort({createdAt:-1})           
};



exports.likePublication = (req, res, next) => {
    // On récupère la publication dans la BDD - grâce à l'id de l'objet, passé dans l'url:    
    Publication.findOne({ _id: req.params.id })
        .then(publication => {
            //Il y a 2 cas possible : +1(like),  et 0(annulation de l'avis)            
            switch (req.body.like) {
                //Si l'utilisateur like  :
                case 1:
                    Publication.updateOne({ _id: req.params.id }, {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId },

                    })
                        .then(() => res.status(201).json({ message: 'Like appliqué !' }))
                        .catch(error => res.status(400).json({ error }));
                    break;
                default:
                    return res.status(500).json({ error });


                //Si la publication est déjà likée : on retire le like
                case 0:
                    if (publication.usersLiked.find(user => user === req.body.userId)) {
                        Publication.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },

                        })
                            .then(() => res.status(201).json({ message: ' Like annulé !' }))
                            .catch(error => res.status(400).json({ error }))
                    }

            }
        })
        .catch(error => res.status(500).json({ error }))
}

//gestion des commentaires

//Creer un commentaire

module.exports.commentPub =(req,res, next)=>{
      // On récupère la publication dans la BDD - grâce à l'id de l'objet, passé dans l'url:       
        Publication.updateOne({ _id: req.params.id },
            {
            // les changements à faire sur la bdd:            
            $push: { 
                comments:{
                    commenterId:req.body.commenterId,
                    // comenterName:req.body.commenterName,
                    text:req.body.text,
                    timestamp: new Date().getTime() }                 
            }
        } ) 
         
             .then(() => res.status(201).send({ message: 'Commentaire créé !' }))
            .catch(error => res.status(400).json({ error }))
      }



//Modifier un commentaire : ma methode : je ne vois pas pourquoi elle ne fonctione pas

//  module.exports.editCommentPub =(req,res, next)=>{
//      // On récupère la publication dans la BDD - grâce à l'id de l'objet, passé dans l'url: 
//     Publication.findOne({ _id: req.params.id })
//     .then(publication => {
//         //on retrouve le commentaire recherché:
//         // const theComment = publication.comments.find((comment)=>
//         //     comment._id.equals(req.body.commentId) ) ;
//         // //on modifie le texte du commentaire://        
//         // theComment.text = req.body.text;
//        )}

//     .catch(error => res.status(500).json({ error }))
// }


//methode de From scratch


module.exports.editCommentPub = (req, res) => {
    // if (!ObjectID.isValid(req.params.id))
    //   return res.status(400).send("ID unknown : " + req.params.id);  
    try {
      return Publication.findById(req.params.id, (err, docs) => {
        const theComment = docs.comments.find((comment) =>
          comment._id.equals(req.body.commentId)
        );
  
        if (!theComment) return res.status(404).send("Comment not found");
        theComment.text = req.body.text;
  
        return docs.save((err) => {
          if (!err) return res.status(200).send(docs);
          return res.status(500).send(err);
        });
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  };



  //supprimer commentaire


  module.exports.deleteCommentPub =(req,res, next)=>{     
        Publication.updateOne({ _id: req.params.id }, { 
     // les changements à faire sur la bdd:            
     $pull: { 
        comments:{
            _id: req.body.commentId,
            }}
          })                
         .then(() => res.status(201).send({ message: 'Commentaire supprimé !' }))
         .catch(error => res.status(400).json({ error }))
   }


//  