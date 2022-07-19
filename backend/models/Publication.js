const mongoose = require('mongoose');

const publicationSchema = mongoose.Schema({
    posterId: { type: String, required: true },
    // nom: { type: String, required: true },
    // prenom: { type: String, required: true },
    message: { type: String, trim: true, maxlength: 500 },
    imageUrl: { type: String },
    video: { type: String },
    likes: { type: Number, default: 0 },
    //   dislikes: { type: Number, default:0 },
    usersLiked: { type: [String] },//tableaux des id des users
    //   usersDisliked: { type: [String] },
    comments:{
        type:[{
            commenterId:String,
            commenterName:String,
            text:String,
            timestamp: Number
        }],
        required:true,
        },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Publication', publicationSchema);