const User = require ('../models/User');
const fs = require ('fs');
const {promisify} = require('util');
const pipeline = promisify(require('stream').pipeline);

module.exports.uploadProfil = async (req, res) =>{
    try{
        if(
            req.file.detectedMimeType !== "image/jpg" &&
            req.file.detectedMimeType !== "image/png" &&
            req.file.detectedMimeType !== "image/jpeg"
        )
        throw Error("invalid file");

        if (req.file.size > 500000) throw Error ("size too big")
    }catch(err){
        return res.status(201).json(err);
    }
    const filename = req.body.name + ".jpg" ;

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            '${_dirname}/..frontend/reactjs/public/uploads/profil/${fileName}'
        )
    );

    //mettre le chemin dans MongoDB
  try{
      await User.findByIdAndUpdate(
          req.body.userId,
          {$set :{picture :"./uploads/profil/" + fileName}},
          {new : true, upsert:true, setDefaultsOnInsert:true},
       (err, docs)=>{
           if (!err) return  res.send(docs);
           else return res.status(500).send({message:err})
       }   
      )
  } catch(err){
    return res.status(500).send({message:err})
  } 
};

