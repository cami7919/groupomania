// -------------importations---------------------------
const req = require('express/lib/request');
const Publication = require('../models/Publication');
const fs = require('fs');

// -------------fonctions du CRUD -----------------------------------
exports.createPublication = (req, res, next) => {     
    //   const publicationObject = JSON.parse(req.body.publication);
      
      const publicationObject = req.body.publication;
     console.log("publicationObjet :" + publicationObject);

    // delete publicationObject._id;
    // delete publicationObject._userId;

    const publication = new Publication({
        ...publicationObject
        // userId:req.auth.userId,
        //  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     });

    console.log("contenu de new Publication :" + publication);

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



exports.modifyPublication = (req, res, next) => {
    const publicationObject = req.file ?
        {
            ...JSON.parse(req.body.publication),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Publication.updateOne({ _id: req.params.id }, { ...publicationObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Publication modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};


exports.removePublication = (req, res, next) => {


    Publication.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Publication supprimée !' }))
        .catch(error => res.status(400).json({ error }));
};





// exports.removePublication = (req, res, next) => { 
// // On récupère la publication dans la BDD - grâce à l'id de l'objet, passé dans l'url:   
//     Publication.findOne({ _id: req.params.id })
//           .then(publication => {
//             const filename = publication.imageUrl.split('/images/')[1];
//             fs.unlink(`images/${filename}`, () => {
//             Publication.deleteOne({ _id: req.params.id })
//                 .then(() => res.status(200).json({ message: 'Publication supprimée !'}))
//                 .catch(error => res.status(400).json({ error }));
//             });
//           })
//           .catch(error => { console.log(error); res.status(00).json({ error }) });
//         //   .catch(error => res.status(500).json({ error }));
//       };



exports.getOnePublication = (req, res, next) => {
    Publication.findOne({ _id: req.params.id })
        .then(publication => res.status(200).json(publication))
        .catch(error => res.status(404).json({ error }));
};

//verifier si "sort" est bien placé :
exports.getAllPublications = (req, res, next) => {
    Publication.find()
        .then(publications => res.status(200).json(publications)).sort({createdAt:-1})
        .catch(error => res.status(400).json({ error }));

        
};



exports.likePublication = (req, res, next) => {
    // On récupère la sauce dans la BDD - grâce à l'id de l'objet, passé dans l'url:    
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

module.exports.commentPub =(req,res, next)=>{
    Publication.findOne({ _id: req.params.id })
    .then(publication => {
        Publication.updateOne({ _id: req.params.id }, {            
            $push: { comments: {
                    commenterId: req.body.commenterId,
                    text: req.body.text,
                    timestamp: new Date().getTime()},
        }
        .then(() => res.status(201).json({ message: 'commentaire posté ! !' }))
        .catch(error => res.status(400).json({ error }))
    
})})
    .catch(error => res.status(500).json({ error }))
}



// module.exports.editCommentPub =(req,res, next)=>{
//     Publication.findOne({ _id: req.params.id })
//     .then(publication => {
//         Publication.updateOne({ _id: req.params.id }, { 

    
// }

// module.exports.deleteCommentPub =(req,res, next)=>{
//     Publication.findOne({ _id: req.params.id })
//     .then(publication => {
//         Publication.updateOne({ _id: req.params.id }, { 
    
// }
