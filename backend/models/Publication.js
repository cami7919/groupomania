const mongoose = require('mongoose');

const publicationSchema = mongoose.Schema({
    userId: { type: String, required: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    message: { type: String, required: true, maxlength: 500 },
    imageUrl: { type: String },
    likes: { type: Number, default: 0 },
    //   dislikes: { type: Number, default:0 },
    usersLiked: { type: [String] }//tableaux des id des users
    //   usersDisliked: { type: [String] },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Publication', publicationSchema);